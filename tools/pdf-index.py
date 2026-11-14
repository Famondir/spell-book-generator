#!/usr/bin/env python3
"""Volltextindex über eine PDF-Sammlung (etwa die Pathfinder-PDFs) für die Recherche.

Eine SQLite-Datenbank mit FTS5, eine Zeile je PDF-Seite. Doppelte PDFs (gleicher Text) werden nur einmal
indexiert, alle Fundorte bleiben erhalten. Die Texte bleiben außerhalb des Repos (urheberrechtlich geschützt).
Voraussetzung: pdftotext (poppler-utils)

Aufruf:
  python3 tools/pdf-index.py build [ORDNER]       Index anlegen oder ergänzen (nur neue/geänderte PDFs)
  python3 tools/pdf-index.py search ANFRAGE       Suche, z. B. '"school symbol"', 'sihedron', 'illusion NEAR(star, 10)'
      -n 20           Zahl der Treffer
      --book MUSTER   nur Bücher, deren Titel MUSTER enthält (ohne Groß-/Kleinschreibung)
      --paths         alle Fundorte einer Datei zeigen, nicht nur den ersten
  python3 tools/pdf-index.py stats

Seitenzahlen sind PDF-Seiten (1 = erste Seite der Datei), nicht die gedruckten Seitenzahlen.
Datenbank: ~/.local/share/pf-pdf-index/index.sqlite (PDF_INDEX_DB ersetzt den Pfad).
"""
import argparse, hashlib, os, re, sqlite3, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

DEFAULT_ROOT = "/run/media/simon/TOSHIBA EXT/Dokumente/PnP&TT/Pathfinder"
DB = Path(os.environ.get("PDF_INDEX_DB", Path.home() / ".local/share/pf-pdf-index/index.sqlite"))
# Karten, Spielfiguren und Poster haben kaum Text
SKIP = re.compile(r"flip-?mat|map pack|maps?/|pawn|/map|poster", re.I)


def connect():
    DB.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DB)
    db.executescript("""
      CREATE TABLE IF NOT EXISTS docs (id INTEGER PRIMARY KEY, sha TEXT UNIQUE, title TEXT, npages INTEGER);
      CREATE TABLE IF NOT EXISTS files (path TEXT PRIMARY KEY, doc INTEGER, size INTEGER, mtime REAL);
      CREATE VIRTUAL TABLE IF NOT EXISTS pages USING fts5(text, doc UNINDEXED, page UNINDEXED, tokenize = 'unicode61 remove_diacritics 2');
    """)
    return db


def title_of(path):
    t = Path(path).stem
    t = re.sub(r"^((PZO\d+\w*|Seiten aus)\s+)+", "", t)
    return t.strip()


def extract(path, txt_cache, root):
    if txt_cache:  # Textdateien eines früheren Laufs: Name = md5("./<relativer Pfad>"), erste Zeile = Pfad
        rel = "./" + os.path.relpath(path, root)
        cached = Path(txt_cache) / (hashlib.md5(rel.encode()).hexdigest()[:16] + ".txt")
        if cached.exists():
            return cached.read_text(errors="replace").split("\n", 1)[1] if cached.stat().st_size else ""
    try:
        return subprocess.run(["pdftotext", "-q", path, "-"], capture_output=True, timeout=180).stdout.decode("utf-8", "replace")
    except subprocess.TimeoutExpired:
        return ""


def build(args):
    db = connect()
    root = os.path.abspath(args.root)
    known = {p: (s, m) for p, s, m in db.execute("SELECT path, size, mtime FROM files")}
    todo = []
    for dirpath, _, names in os.walk(root):
        for n in names:
            p = os.path.join(dirpath, n)
            if not n.lower().endswith(".pdf") or SKIP.search(p):
                continue
            st = os.stat(p)
            if known.get(p) != (st.st_size, st.st_mtime):
                todo.append((p, st.st_size, st.st_mtime))
    print(f"{len(todo)} PDFs zu lesen", file=sys.stderr)
    done = 0
    with ThreadPoolExecutor(args.jobs) as pool:
        for (p, size, mtime), text in zip(todo, pool.map(lambda t: extract(t[0], args.txt_cache, root), todo)):
            sha = hashlib.sha1(text.encode()).hexdigest()
            row = db.execute("SELECT id FROM docs WHERE sha = ?", (sha,)).fetchone()
            if row:
                doc = row[0]
            else:
                pages = text.split("\f")
                if pages and not pages[-1].strip():
                    pages.pop()
                doc = db.execute("INSERT INTO docs (sha, title, npages) VALUES (?, ?, ?)", (sha, title_of(p), len(pages))).lastrowid
                db.executemany("INSERT INTO pages (text, doc, page) VALUES (?, ?, ?)",
                               [(t, doc, i + 1) for i, t in enumerate(pages) if t.strip()])
            db.execute("INSERT OR REPLACE INTO files VALUES (?, ?, ?, ?)", (p, doc, size, mtime))
            done += 1
            if done % 100 == 0:
                db.commit()
                print(f"  {done}/{len(todo)}", file=sys.stderr)
    db.commit()
    stats(args, db)


def search(args):
    db = connect()
    sql = """SELECT d.title, pages.page, d.id, snippet(pages, 0, '»', '«', ' … ', 24) FROM pages
             JOIN docs d ON d.id = pages.doc WHERE pages MATCH ?"""
    params = [args.query]
    if args.book:
        sql += " AND d.title LIKE ?"
        params.append(f"%{args.book}%")
    sql += " ORDER BY bm25(pages) LIMIT ?"
    params.append(args.n)
    try:
        rows = db.execute(sql, params).fetchall()
    except sqlite3.OperationalError as e:
        sys.exit(f"Anfrage ungültig ({e}). Wortgruppen in doppelte Anführungszeichen setzen.")
    for title, page, doc, snip in rows:
        paths = [r[0] for r in db.execute("SELECT path FROM files WHERE doc = ? ORDER BY length(path)", (doc,))]
        print(f"■ {title} – S. {page}")
        print("  " + re.sub(r"\s+", " ", snip))
        for p in paths if args.paths else paths[:1]:
            print(f"  {p}" + ("" if args.paths or len(paths) == 1 else f"  (+{len(paths) - 1} Kopien)"))
    if not rows:
        print("keine Treffer")


def stats(args, db=None):
    db = db or connect()
    (docs,), (files,), (pages,) = (db.execute(q).fetchone() for q in
                                   ("SELECT count(*) FROM docs", "SELECT count(*) FROM files", "SELECT count(*) FROM pages"))
    print(f"{files} Dateien, {docs} verschiedene Texte, {pages} Seiten · {DB} ({DB.stat().st_size / 1e6:.0f} MB)")


ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
sub = ap.add_subparsers(dest="cmd", required=True)
b = sub.add_parser("build"); b.add_argument("root", nargs="?", default=DEFAULT_ROOT)
b.add_argument("-j", "--jobs", type=int, default=8); b.add_argument("--txt-cache", help=argparse.SUPPRESS)
b.set_defaults(fn=build)
s = sub.add_parser("search"); s.add_argument("query"); s.add_argument("-n", type=int, default=20)
s.add_argument("--book"); s.add_argument("--paths", action="store_true"); s.set_defaults(fn=search)
sub.add_parser("stats").set_defaults(fn=stats)
args = ap.parse_args()
args.fn(args)

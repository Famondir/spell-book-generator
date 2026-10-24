#!/usr/bin/env python3
"""Parst die Archives-of-Nethys-Seiten (SpellDisplay*.aspx) in spells/ zu data/spells.json."""
import csv
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "spells"
TSV = ROOT / "data" / "spell_full - Updated 31Mar2020.tsv"  # d20pfsrd-Export, enthält auch Nicht-Magier-Zauber
OUT = ROOT / "data" / "spells.json"
OUT_JS = ROOT / "data" / "spells.js"  # per <script> ladbar, damit index.html ohne Server läuft

BLOCK_RE = re.compile(
    r'<span id="MainContent_DataListTypes_LabelName_\d+">(.*?)</span>\s*</td>', re.S
)
FIELD_RE = re.compile(r"<b>([^<]+)</b>\s*(.*?)(?=<b>|<h3|$)", re.S)


def strip(s: str) -> str:
    # Tabellen zeilenweise lesbar machen: Zellen mit " | " trennen, Zeilen umbrechen
    s = re.sub(r"\s*</t[dh]>\s*<t[dh][^>]*>\s*", " | ", s)
    s = re.sub(r"</tr>", "\n", s)
    s = re.sub(r"<table[^>]*>", "\n", s)
    s = re.sub(r"<br\s*/?>", "\n", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r" *\n *", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip().strip(";").strip()


def parse_levels(text: str) -> dict:
    levels = {}
    for part in text.split(","):
        m = re.match(r"\s*(.+?)\s+(\d)\s*$", part)
        if m:
            for cls in m.group(1).split("/"):
                levels[cls.strip().lower()] = int(m.group(2))
    return levels


def parse_school(text: str) -> dict:
    # z.B. "evocation [fire]" oder "conjuration (creation) [acid]"
    school = re.match(r"\s*([a-z]+)", text)
    sub = re.search(r"\(([^)]+)\)", text)
    desc = re.search(r"\[([^\]]+)\]", text)
    return {
        "school": school.group(1) if school else "",
        "subschool": [s.strip() for s in sub.group(1).replace(" or ", ",").split(",")] if sub else [],
        "descriptors": [d.strip().replace("mindaffecting", "mind-affecting") for d in re.split(r",| or | and ", desc.group(1)) if d.strip()]
        if desc
        else [],
    }


def parse_file(path: Path):
    raw = path.read_text(encoding="utf-8", errors="replace")
    out = []
    for m in BLOCK_RE.finditer(raw):
        # ein Block kann mehrere Zauber enthalten (z. B. Detect Magic + Detect Magic, Greater)
        for part in re.split(r'(?=<h1 class="title">)', m.group(1)):
            if (r := parse_block(part, path)):
                out.append(r)
    return out


def parse_block(body: str, path: Path):
    if '<h1 class="title">' not in body:
        return None
    name_m = re.search(r'<h1 class="title">(.*?)</h1>', body, re.S)
    name = strip(name_m.group(1)) if name_m else path.stem
    pfs = "PathfinderSocietySymbol" in (name_m.group(1) if name_m else "")
    body = body[name_m.end():] if name_m else body

    desc_idx = body.find('<h3 class="framing">Description</h3>')
    head = body[:desc_idx] if desc_idx >= 0 else body
    description = body[desc_idx + len('<h3 class="framing">Description</h3>'):] if desc_idx >= 0 else ""
    # Mythic-Teil o.Ä. abtrennen
    mythic = ""
    mm = re.search(r'<h2 class="title">\s*Mythic', description)
    if mm:
        mythic = strip(description[mm.end():])
        mythic = re.sub(r"^[^\n]*\n", "", mythic, count=0)
        description = description[: mm.start()]

    fields = {}
    for fm in FIELD_RE.finditer(re.sub(r'<h3 class="framing">[^<]*</h3>', "", head)):
        key = fm.group(1).strip()
        fields.setdefault(key, strip(fm.group(2)))

    rec = {
        "id": re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-"),
        "name": name,
        "pfs": pfs,
        "source": fields.get("Source", ""),
        **parse_school(fields.get("School", "")),
        "school_raw": fields.get("School", ""),
        "levels": parse_levels(fields.get("Level", "")),
        "casting_time": fields.get("Casting Time", ""),
        "components": fields.get("Components", ""),
        "range": fields.get("Range", ""),
        "area": fields.get("Area", ""),
        "target": fields.get("Target", fields.get("Targets", "")),
        "effect": fields.get("Effect", ""),
        "duration": fields.get("Duration", ""),
        "saving_throw": fields.get("Saving Throw", ""),
        "spell_resistance": fields.get("Spell Resistance", ""),
        "description": strip(description),
    }
    if mythic:
        rec["mythic"] = mythic
    return rec


def norm(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", name.lower())


def parse_tsv():
    """Zauber aus der TSV im selben Format wie parse_block()."""
    if not TSV.exists():
        return []
    csv.field_size_limit(10**9)
    out = []
    with TSV.open(encoding="utf-8", errors="replace") as f:
        for r in csv.DictReader(f, delimiter="\t"):
            name = r["name"].strip()
            if not name:
                continue
            school_raw = r["school"] + (f" ({r['subschool']})" if r["subschool"] else "") + (f" [{r['descriptor']}]" if r["descriptor"] else "")
            rec = {
                "id": re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-"),
                "name": name,
                "pfs": False,
                "source": r["source"],
                **parse_school(school_raw),
                "school_raw": school_raw,
                "levels": parse_levels(r["spell_level"]),
                "casting_time": r["casting_time"],
                "components": r["components"],
                "range": r["range"],
                "area": r["area"],
                "target": r["targets"],
                "effect": r["effect"],
                "duration": r["duration"],
                "saving_throw": r["saving_throw"],
                "spell_resistance": r["spell_resistance"],
                "description": strip(re.sub(r"</p>\s*<p>", "<br><br>", r["description_formatted"] or r["description"])),
                "origin": "tsv",
            }
            if r.get("mythic_text"):
                rec["mythic"] = strip(r["mythic_text"])
            out.append(rec)
    return out


def main():
    spells, failed = {}, []
    for p in sorted(SRC.glob("*.aspx")):
        try:
            recs = parse_file(p)
        except Exception as e:  # noqa: BLE001
            failed.append(f"{p.name}: {e}")
            continue
        if not recs:
            failed.append(f"{p.name}: kein Zauberblock")
        for rec in recs:
            spells.setdefault(rec["id"], rec)  # Duplikate (gleiche Seite mehrfach geladen) verwerfen
    # Ergänzung aus der TSV: nur Zauber, die die AoN-Seiten nicht haben
    known = {norm(sp["name"]) for sp in spells.values()}
    added = 0
    for rec in parse_tsv():
        if norm(rec["name"]) not in known and rec["id"] not in spells:
            spells[rec["id"]] = rec
            known.add(norm(rec["name"]))
            added += 1
    print(f"{added} Zauber aus der TSV ergänzt", file=sys.stderr)
    data = sorted(spells.values(), key=lambda s: s["name"].lower())
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    OUT_JS.write_text("window.SPELLS = " + json.dumps(data, ensure_ascii=False) + ";\n", encoding="utf-8")
    print(f"{len(data)} Zauber -> {OUT}", file=sys.stderr)
    for f in failed:
        print("FEHLER", f, file=sys.stderr)


if __name__ == "__main__":
    main()

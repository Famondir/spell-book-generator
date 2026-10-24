#!/usr/bin/env python3
"""Parst die Archives-of-Nethys-Seiten (DeityDisplay*.aspx) in dieties/ zu data/deities.js.

Übernommen werden nur beschreibende Felder (Paizo Community Use Policy): Name, Beiname, Gesinnung,
Pantheon, Zuständigkeiten, Domänen, Subdomänen, Lieblingswaffe, Symbol, heiliges Tier, heilige Farben.
Gehorsamsrituale, Segen, Kultzentren und Beschreibungstexte bleiben bewusst draußen.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "dieties"
OUT_JS = ROOT / "data" / "deities.js"

NAME_RE = re.compile(r'LabelName_0">.*?<h1 class="title">(.*?)</h1>(?:\s*<h2>(.*?)</h2>)?', re.S)
FIELD_RE = re.compile(r"<b>([^<]+)</b>\s*(.*?)(?=<br\s*/?>|<b>|<h3|$)", re.S)

# Glasfarben: kräftig genug für Bleiglas, nicht die Webfarben
COLORS = {
    "red": "#b3202a", "crimson": "#9e1030", "black": "#26201c", "green": "#2f7d3b", "dark green": "#1f5530",
    "pale green": "#8cc08a", "white": "#f2ecdc", "ivory": "#efe3c2", "blue": "#2552a3", "dark blue": "#1c3570",
    "midnight blue": "#141f4a", "light blue": "#6ea6d8", "icy blue": "#9fd0e8", "ice blue": "#9fd0e8",
    "brown": "#6e4524", "tan": "#c09a68", "gold": "#d4a21c", "bronze": "#a86e2c", "gray": "#8a8580",
    "grey": "#8a8580", "iron gray": "#5c5f63", "lead gray": "#6a6d70", "dark gray": "#4a4846", "light gray": "#b9b6b0",
    "yellow": "#e8c21e", "pale yellow": "#eedc7a", "orange": "#d9701c", "silver": "#c7cbd0", "pink": "#d97aa0",
    "purple": "#6a2c8c", "violet": "#7d3fb0", "crystal": "#dcecf2", "greed": "#3c8a3c",
}
IGNORE = {"none", "all", "n/a", "chromatic colors", "metallic colors"}


def text(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s).replace("*", "")
    return re.sub(r"\s+", " ", s).strip().strip(";").strip()


def split(s: str) -> list:
    return [x.strip() for x in re.split(r",|;", s) if x.strip()]


def colors(raw: str) -> list:
    # Aspekte in Klammern („red (black pharaoh)“): nur der erste Aspekt zählt
    out = []
    for part in re.split(r",|\band\b|/", raw):
        name = re.sub(r"\(.*?\)", "", part).strip().lower()
        if not name or name in IGNORE or name.startswith("n/a"):
            continue
        if name in COLORS and name not in [c["name"] for c in out]:
            out.append({"name": name, "hex": COLORS[name]})
        if "(" in part:
            break
    return out


def slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def parse(path: Path):
    t = path.read_text(errors="ignore")
    m = NAME_RE.search(t)
    if not m:
        return None
    name = text(m.group(1))
    title = text(m.group(2) or "")
    start = t.find("<b>Alignment</b>")
    end = t.find('<h3 class="framing">', start + 1)
    while end > 0 and "Details" in t[end : end + 40]:
        end = t.find('<h3 class="framing">', end + 1)
    block = t[start : end if end > 0 else start + 4000]
    f = {k.strip(): text(v) for k, v in FIELD_RE.findall(block)}
    if "Alignment" not in f:
        return None
    return {
        "id": slug(name),
        "name": name,
        "title": title,
        "align": f.get("Alignment", "").split()[0] if f.get("Alignment") else "",
        "pantheon": f.get("Pantheon", ""),
        "areas": split(f.get("Areas of Concern", "")),
        "domains": split(f.get("Domains", "")),
        "subdomains": split(f.get("Subdomains", "")),
        "weapon": f.get("Favored Weapon", ""),
        "symbol": f.get("Symbol", ""),
        "animal": f.get("Sacred Animal(s)", f.get("Sacred Animal", "")),
        "colors": colors(f.get("Sacred Color(s)", f.get("Sacred Colors", ""))),
    }


def main():
    seen, out = set(), []
    for p in sorted(SRC.glob("DeityDisplay*.aspx")):
        d = parse(p)
        if d and d["id"] not in seen:
            seen.add(d["id"])
            out.append(d)
    out.sort(key=lambda d: d["name"].lower())
    OUT_JS.write_text(
        "// Erzeugt von tools/parse_deities.py aus Archives-of-Nethys-Seiten. Nur beschreibende Angaben;\n"
        "// Namen und Angaben gehören Paizo Inc. und werden unter Paizos Community Use Policy verwendet.\n"
        "window.DEITIES = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"
    )
    print(f"{len(out)} Gottheiten, {sum(1 for d in out if d['colors'])} mit Farben -> {OUT_JS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

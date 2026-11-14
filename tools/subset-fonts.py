#!/usr/bin/env python3
"""Kürzt die Noto-Schriften der Originalschriften auf die benutzten Zeichen (app/fonts/<schrift>.woff2).

Nur nötig, wenn sich Lexika ändern; tools/script-check.mjs meldet fehlende Zeichen.
Voraussetzung: pip install fonttools brotli  (etwa in einer venv)
Aufruf:        python3 tools/subset-fonts.py
Die Originale (SIL Open Font License) werden von notofonts.github.io geladen und in ~/.cache/spell-book-fonts abgelegt.
Neben jede Schrift schreibt das Werkzeug <schrift>.chars.txt mit den enthaltenen Zeichen (liest tools/script-check.mjs),
dazu app/fonts/widths.js mit den Laufweiten je Zeichen (für den Bandsatz) und den Schriften als data-URL (für den SVG-Export).
"""
import base64, json, subprocess, urllib.request
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path.home() / ".cache" / "spell-book-fonts"
BASE = "https://github.com/notofonts/notofonts.github.io/raw/main/fonts/"
FONTS = {
    "cuneiform": "NotoSansCuneiform/hinted/ttf/NotoSansCuneiform-Regular.ttf",
    "hieroglyphs": "NotoSansEgyptianHieroglyphs/hinted/ttf/NotoSansEgyptianHieroglyphs-Regular.ttf",
    "ogham": "NotoSansOgham/hinted/ttf/NotoSansOgham-Regular.ttf",
    "greek": "NotoSerif/hinted/ttf/NotoSerif-Regular.ttf",
}

def source(rel):
    path = CACHE / Path(rel).name
    if not path.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        print("lade", rel)
        urllib.request.urlretrieve(BASE + rel, path)
    return path

def widths(font, chars):
    """Laufweite je Zeichen in Geviert (für den Bandsatz in app/js/circle.js)."""
    cmap, hmtx, upm = font.getBestCmap(), font["hmtx"], font["head"].unitsPerEm
    return {c: round(hmtx[cmap[ord(c)]][0] / upm, 3) for c in chars if ord(c) in cmap}

def main():
    out = subprocess.run(["node", str(ROOT / "tools" / "script-check.mjs"), "--chars"], capture_output=True, text=True, check=True).stdout
    chars = json.loads(out.strip().splitlines()[-1])
    table, data = {}, {}
    for script, rel in FONTS.items():
        want = set(chars.get(script, "")) | {" ", "·"}
        font = TTFont(source(rel))
        cmap = font.getBestCmap()
        have = sorted(c for c in want if ord(c) in cmap)
        missing = sorted(want - set(have) - {" ", "·"})
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["*"]
        opts.name_IDs = ["*"]
        opts.notdef_outline = True
        table[script] = widths(font, have)
        sub = subset.Subsetter(opts)
        sub.populate(unicodes=[ord(c) for c in have])
        sub.subset(font)
        target = ROOT / "app" / "fonts" / f"{script}.woff2"
        font.flavor = "woff2"
        font.save(target)
        data[script] = "data:font/woff2;base64," + base64.b64encode(target.read_bytes()).decode()
        (ROOT / "app" / "fonts" / f"{script}.chars.txt").write_text("".join(have), encoding="utf-8")
        print(f"{script}: {len(have)} Zeichen, {target.stat().st_size // 1024} KB" + (f", fehlen in der Schrift: {''.join(missing)}" if missing else ""))

    js = ROOT / "app" / "fonts" / "widths.js"
    js.write_text("// Laufweiten der Originalschriften je Zeichen in Geviert, erzeugt von tools/subset-fonts.py\n"
                  "window.SCRIPT_WIDTHS = " + json.dumps(table, ensure_ascii=False, separators=(",", ":")) + ";\n"
                  "// dieselben Schriften als data-URL, für den SVG-Export eines Kreises\n"
                  "window.SCRIPT_FONTS = " + json.dumps(data, separators=(",", ":")) + ";\n", encoding="utf-8")

if __name__ == "__main__":
    main()

## 1. Texte der Zauberseite

- [x] 1.1 textgen.de.js: `pctList` durch `essParts = (m) => T.parts(m.essences)` ersetzen (Lauftext „Die Ladung …“ und Aufbauliste „Essenzring“)
- [x] 1.2 textgen.en.js: dasselbe mit `T.partsEn(m.essences)`

## 2. Kreisbeschriftung

- [x] 2.1 circle.js `annotations()`: Eintrag „Essenzring“ mit `T.parts(m.essences)`
- [x] 2.2 book.js `ANNOT_EN.Essenzring`: Text mit `T.partsEn(m.essences)` neu bauen statt `a.t` durchreichen
- [x] 2.3 Prüfen: Lehrheft, beschrifteter Kreis im Buch (de/en) und Kreis-Dialog zeigen keine Prozentzeichen mehr im Essenzring

## 3. Essenzanalyse

- [x] 3.1 book.js `essenceBlock()`: rechts `T.partPhrase(x.pct)` bzw. `T.partPhraseEn(x.pct)` im englischen Buch; Balken unverändert
- [x] 3.2 style.css: `.essbars .esspct` mit fester breiterer Breite (nach der längsten Angabe) und `white-space: nowrap`; App-Balken (38 px) bleiben unverändert
- [x] 3.3 Screenshot einer Zauberseite ab Grad 4 mit Essenzanalyse (de und en)

## 4. Andachtsbild

- [x] 4.1 vitrail.js `legendItems()`: Akzentzeile mit `T.parts(m.essences, { name })`, Steinname in Klammern beim Material Stein
- [x] 4.2 vitrail.js `legendItemsEn()`: dasselbe mit `T.partsEn`
- [x] 4.3 Prüfen im Andachtsbild-Dialog mit Beschriftung und im Vorspann des Andachtsbuchs (Glas und Stein)

## 5. Tests und Abschluss

- [x] 5.1 Testfall: Essenzring-Beschriftung und Essenzanalyse ohne „%“, Beispiel aus der Spec (Lux 90/Vis 10 → „neun Teile Lux, ein Teil Vis“)
- [x] 5.2 Testfall: App-Tooltip in der Liste weiter mit „%“
- [x] 5.3 `tools/bilingual-check.mjs` und Testlauf; Satz-Abweichungen sichten und Sollwerte mit `--update` übernehmen (ohne und mit Profil, englische Sollwerte)
- [x] 5.4 Backlog-Punkt „Essenzen in Teilen statt Prozent“ aus backlog.md entfernen

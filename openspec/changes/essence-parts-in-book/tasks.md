## 1. Texte der Zauberseite

- [ ] 1.1 textgen.de.js: `pctList` durch `essParts = (m) => T.parts(m.essences)` ersetzen (Lauftext „Die Ladung …“ und Aufbauliste „Essenzring“)
- [ ] 1.2 textgen.en.js: dasselbe mit `T.partsEn(m.essences)`

## 2. Kreisbeschriftung

- [ ] 2.1 circle.js `annotations()`: Eintrag „Essenzring“ mit `T.parts(m.essences)`
- [ ] 2.2 book.js `ANNOT_EN.Essenzring`: Text mit `T.partsEn(m.essences)` neu bauen statt `a.t` durchreichen
- [ ] 2.3 Prüfen: Lehrheft, beschrifteter Kreis im Buch (de/en) und Kreis-Dialog zeigen keine Prozentzeichen mehr im Essenzring

## 3. Essenzanalyse

- [ ] 3.1 book.js `essenceBlock()`: rechts `T.partPhrase(x.pct)` bzw. `T.partPhraseEn(x.pct)` im englischen Buch; Balken unverändert
- [ ] 3.2 style.css: `.essbars .esspct` mit fester breiterer Breite (nach der längsten Angabe) und `white-space: nowrap`; App-Balken (38 px) bleiben unverändert
- [ ] 3.3 Screenshot einer Zauberseite ab Grad 4 mit Essenzanalyse (de und en)

## 4. Andachtsbild

- [ ] 4.1 vitrail.js `legendItems()`: Akzentzeile mit `T.parts(m.essences, { name })`, Steinname in Klammern beim Material Stein
- [ ] 4.2 vitrail.js `legendItemsEn()`: dasselbe mit `T.partsEn`
- [ ] 4.3 Prüfen im Andachtsbild-Dialog mit Beschriftung und im Vorspann des Andachtsbuchs (Glas und Stein)

## 5. Tests und Abschluss

- [ ] 5.1 Testfall: Essenzring-Beschriftung und Essenzanalyse ohne „%“, Beispiel aus der Spec (Lux 90/Vis 10 → „neun Teile Lux, ein Teil Vis“)
- [ ] 5.2 Testfall: App-Tooltip in der Liste weiter mit „%“
- [ ] 5.3 `tools/bilingual-check.mjs` und Testlauf; Satz-Abweichungen sichten und Sollwerte mit `--update` übernehmen (ohne und mit Profil, englische Sollwerte)
- [ ] 5.4 Backlog-Punkt „Essenzen in Teilen statt Prozent“ aus backlog.md entfernen

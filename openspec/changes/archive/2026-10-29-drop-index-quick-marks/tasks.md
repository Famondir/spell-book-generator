## 1. Glyphe

- [x] 1.1 `quickGlyph` in `app/js/circle.js` um die Option `marks` (Standard `true`) erweitern; bei `marks: false` entfällt `quickLetters(m)`, alles andere bleibt gleich
- [x] 1.2 Kommentar der Funktion um die verkürzte Form ergänzen

## 2. Verzeichnis und Kapitellisten

- [x] 2.1 Verzeichnis der Formeln in `app/js/book.js` ruft `quickGlyph(x.m, { marks: false })` auf
- [x] 2.2 Formelliste der Kapitelseiten in `app/js/book.js` ruft `quickGlyph(x.m, { marks: false })` auf
- [x] 2.3 Prüfen, dass Zauberkopf, Zauberseite, Vorspann-Erklärung, Lehrheft, App-Listen, Vorbereitung und Tageszettel weiter die Zeichen zeigen

## 3. Prüfung

- [x] 3.1 `tools/quick-glyph-check.mjs` läuft weiter ohne Doppelgänger
- [x] 3.2 Screenshot (Chrome headless) einer Verzeichnis- und einer Kapitelseite: Glyphen ohne Buchstaben, Spalten unverändert
- [x] 3.3 Testlauf; bei Abweichungen auf Verzeichnis- und Kapitelseiten Baseline nach Sichtprüfung neu sichern

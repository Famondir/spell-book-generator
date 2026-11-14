## 1. Grundgerüst und Prüfung

- [x] 1.1 `app/js/scripts.js` mit `write`, `onsetGlyph`, `visualKey`; Lateinschrift als Vorgabe; in `index.html` und `tools/lib/load-app.mjs` laden
- [x] 1.2 `script` in den Lexika eintragen (cuneiform, hieroglyphs, greek, ogham, proto)
- [x] 1.3 `tools/script-check.mjs`: alle Kern-, Formel- und Langformelzeilen aller Sprachen übertragen, unbekannte Silben als Fehler; `--chars` gibt die benutzten Zeichen je Schrift aus
- [x] 1.4 Prüfwerkzeug als Node-Fall in `tools/test-cases.mjs`

## 2. Schriften

- [x] 2.1 Griechisch: Übertragung (Digraphe, Spiritus asper, Schluss-Sigma), Absichtszeichen klein
- [x] 2.2 Ogham: Übertragung mit Rahmenzeichen und Ogham-Leerzeichen
- [x] 2.3 Keilschrift: Lautzerlegung über `onsets`, CV/VC/CVC-Tabelle, Stützvokal; Prüfung für Hethitisch, Akkadisch, Sumerisch ohne Fehler
- [x] 2.4 Hieroglyphen: Einkonsonantenzeichen, `scriptWords` für häufige Wörter (ankh, maat, nefer, djed …)
- [x] 2.5 Ursprache: Zeichensatz entwerfen (Pfade), Mess-Seite mit allen Zeichen in Band- und Glyphengröße ansehen

## 3. Schriftdateien

- [x] 3.1 `tools/subset-fonts.py` (Noto-Quellen laden, kürzen auf `--chars`, woff2 schreiben)
- [x] 3.2 Gekürzte Schriften in `app/fonts/`, `@font-face` in `app/style.css`, README und Lizenz ergänzen
- [x] 3.3 Prüfung: jedes benutzte Zeichen ist in der gekürzten Schrift (cmap lesen)

## 4. Band und Schnellglyphe

- [x] 4.1 `bandLayer`: Text aus `SCRIPTS.write`, Laufweite je Schrift, Großbuchstaben nur wo es sie gibt, Kürzung an Wortgrenzen in der Zielschrift
- [x] 4.2 Band der Ursprache: Zeichen einzeln entlang des Bogens, Tore und Lücken beachten
- [x] 4.3 `quickLetters`: Absichtszeichen aus `coreChoice(m).marks`, Schriftfamilie je Schrift, Ursprache als Pfad
- [x] 4.4 Feinabstimmung am Bild: je Schrift ein Kreis mit Toren und eine Glyphe je Schulfigur, keine Überdeckung

## 5. Eindeutigkeit und Texte

- [x] 5.1 `buildCoreMap` sperrt nach `visualKey`, Verwechslungstabelle (Griechisch/Latein); `coreChoice` liefert `marks`
- [x] 5.2 `tools/quick-glyph-check.mjs` vergleicht Glyphen nach Aussehen (Schlüssel statt SVG-Text)
- [x] 5.3 Erklärsatz (`book.js`), Legende (`legend.js`), Lehrheft-Lektion Schnellglyphen (`data/primer.js`): Absichtszeichen aus der eigenen Kernzeile; Fachzeile bleibt als Fachnotation
- [x] 5.4 Kernwort-Notiz in `textgen.js`: Zeichen der eigenen Schrift statt lateinischem Buchstaben

## 6. Export, Tests, Abschluss

- [x] 6.1 SVG-Export bettet die Schrift des Bands ein; exportierte Datei ohne App öffnen
- [x] 6.2 `node tools/quick-glyph-check.mjs` und `node tools/script-check.mjs` mit und ohne Profil grün
- [x] 6.3 Formel-Snapshot ohne Profil unverändert; mit Profil und Test-Baselines neu sichern; `node tools/test-browser.mjs` mit und ohne Profil
- [x] 6.4 Kirrans Buch im Browser durchsehen (Kreise je Schrift, Schnellglyphen-Übersicht im Lehrheft, Druck als PDF)

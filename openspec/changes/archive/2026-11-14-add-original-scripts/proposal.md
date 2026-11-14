## Why

Seit `align-formula-lexicons` haben alle Formelsprachen pro Liste eigene Anlaute in der Originalschrift. Gezeigt werden aber weiter lateinische Buchstaben: Das Schriftband trägt die Lautschrift, und die Schnellglyphe hat die Buchstaben der lateinischen Fachformel. Ein hethitischer Zauber sieht so aus wie ein lateinischer mit seltsamen Wörtern. Ein Leser kann die Absichtsbuchstaben auch nicht aus der gedruckten Formel ablesen.

## What Changes

- **Schriftband in Originalschrift:** Der Zauberkreis trägt die Formel in der Schrift ihrer Sprache. Der Formeltext auf der Seite bleibt in Lautschrift, damit man ihn vorlesen kann.
  - Hethitisch, Akkadisch, Sumerisch: Keilschrift, silbisch aus der Lautschrift gebildet (CV, VC, CVC)
  - Mittelägyptisch: Hieroglyphen aus Einkonsonantenzeichen, für häufige Wörter mit fester Schreibung
  - Griechisch: griechisches Alphabet
  - Altirisch: Ogham
  - Urindogermanisch: eine erfundene Schrift der Welt (Ursprache), als SVG-Zeichen ohne Schriftdatei
  - Latein, Mittelkymrisch, Bantu-Lautbild und Technik: Lateinschrift wie bisher
- **Absichtszeichen in der Schnellglyphe:** Statt der lateinischen Buchstaben stehen neben der Schulfigur die Anlaute von Verb und Essenzwort der gedruckten Kernzeile, in der Originalschrift: das erste Keilschriftzeichen, das erste Einkonsonantenzeichen, ein griechischer Kleinbuchstabe, ein Ogham-Zeichen, ein Zeichen der Ursprache oder ein lateinischer Großbuchstabe. **BREAKING** für die Glyphen fremdsprachiger Zauber.
- **Eindeutig nach dem Aussehen:** Die Kernzeilenwahl vergibt die Plätze je Glyphengruppe so, dass keine zwei Zauber derselben Klassenliste gleich aussehende Absichtszeichen haben, auch über Sprachen mit gleicher Schrift hinweg (Latein, Kymrisch, Bantu, Technik) und bei verwechselbaren Zeichen (griechisch ο und lateinisch O). **BREAKING** für einzelne Kernzeilen. Es ist noch nichts gedruckt.
- **Fachzeile und Brückennotiz:** Die Fachzeile bleibt als lateinische Fachnotation, ist aber nicht mehr die Quelle der Glyphenzeichen. Erklärsatz, Legende, Lehrheft und die Kernwort-Notiz nennen das Absichtszeichen aus der eigenen Kernzeile.
- **Schriftdateien:** Noto Sans Cuneiform, Noto Sans Egyptian Hieroglyphs, Noto Sans Ogham und eine griechische Noto Serif (alle OFL), auf die benutzten Zeichen gekürzt, unter `app/fonts/`. Ein Werkzeug erzeugt die gekürzten Dateien neu, wenn sich Lexika ändern.
- **Export:** Der SVG-Export eines Kreises bettet die benutzten Schriften ein.
- **Prüfung:** Jede Kernzeile, jedes Band und jede Langformel lässt sich in die Schrift ihrer Sprache übertragen, ohne unbekannte Silben, und jedes benutzte Zeichen ist in der gekürzten Schriftdatei enthalten. Die Schnellglyphen bleiben je Klassenliste eindeutig.

## Capabilities

### New Capabilities
- `formula-scripts`: Schrift je Formelsprache, Übertragung aus der Lautschrift, Schriftdateien und Kürzung, die Ursprache-Schrift, Band in Originalschrift, Absichtszeichen der Schnellglyphe, Eindeutigkeit nach Aussehen.

### Modified Capabilities
<!-- keine: Band, Schnellglyphe, Fachzeile und Brückennotiz stammen aus noch nicht archivierten Changes (add-formula-languages, add-unique-quick-glyphs, align-formula-lexicons). Die neue Capability ersetzt dort die Aussagen zu lateinischen Buchstaben; siehe design.md. -->

## Impact

- Neu: `app/js/scripts.js` (Übertragung, Zeichentabellen, Ursprache-Zeichen), `app/fonts/` (vier gekürzte Schriften, README und Lizenz ergänzt), `tools/subset-fonts.py` (Kürzung, braucht `fonttools` und `brotli` nur zum Erzeugen), `tools/script-check.mjs`.
- Geändert: `app/js/circle.js` (Band mit Schriftlauf je Schrift, Zeichenplatzierung für die Ursprache, Absichtszeichen), `app/js/textgen.js` (`buildCoreMap` nach Aussehen, Kernwort-Notiz), `app/js/book.js`, `app/js/legend.js`, `data/primer.js` (Erklärtexte), `app/style.css` (Schriftfamilien), `index.html`, `tools/lib/load-app.mjs`, Export in `app/js/app.js`.
- Formel-Snapshot ohne Profil bleibt unverändert, solange keine lateinische Kernzeile neu vergeben wird; mit Profil ändern sich Kernzeilen und Glyphen. Die Test-Baselines müssen neu gesichert werden.
- Voraussetzung: `add-formula-languages`, `add-unique-quick-glyphs` und `align-formula-lexicons` sollten vorher archiviert werden.

## Why

Buch und Lehrheft haben je eine eigene Blätteransicht (`showSpread`/`renderPager` und `primerSpread`). Beide machen dasselbe, aber nicht gleich gut: Das Buch kann zu einer Seitenzahl springen, zum vorigen oder nächsten Zauber, und hat ein Akkordeon im Verzeichnis; das Lehrheft kann das nicht. „Lehre der Kreise“ ist ein langer Seitenstapel ohne Blättern. Die Satz-Bausteine (fließende Seiten, `.splittable`, `.keep-next`, `.break-before`, `.recto-start`, Lochrand) stecken in `book.js` zwischen Zauber-Logik. Jede neue Ansicht oder jeder neue Druckauftrag kopiert heute Code. Mit den Satz-Tests (Change `add-typeset-tests`) gibt es jetzt einen festgehaltenen Stand, gegen den ein Umbau geprüft werden kann.

## What Changes

- **Ein Seitenbetrachter** für Buch, Lehrheft und „Vom Gebet“ (göttliche Klassen): eine oder zwei Seiten je nach Breite, Doppelseiten wie im Buch (Seite 1 allein rechts), Blätterleiste mit Anfang/Ende/vor/zurück, Sprung zu einer Seitenzahl, Sprung zur vorigen/nächsten Einheit (Zauber, Lektion), Pfeiltasten, Anpassen bei Größenänderung, gemerkte Position je Ansicht.
- **Ein Verzeichnis-Baustein** rechts, ausklappbar, mit Akkordeon nach Abschnitten, Sprung zur Seite und Hervorhebung des aktuellen Abschnitts beim Blättern.
- Austauschbar bleibt nur das **Setzen**: ausschnittweise (Buch, große Bücher bleiben bedienbar) oder alles auf einmal (Lehrheft, Lehre der Kreise).
- **Satzmodul** `app/js/typeset.js`: `typeset`, `fit`, `flow`, `rebalance` und die Satz-Klassen (`.flow`, `.flow-cont`, `.splittable`, `.keep-next`, `.break-before`, `.recto-start`, `.bind`/`.verso`, `.blank`) aus `book.js` herausgelöst, mit kurzer Beschreibung der Klassen als Vertrag. `book.js` behält Inhalt und Aufbau der Seiten.
- **Gemeinsame Glyphenlegenden** (Essenzen, Schulen, Zeichen, Alchemie, Schulfiguren der Schnellglyphen) für „Lehre der Kreise“ und Lehrheft aus einer Quelle.
- Für Nutzer neu: Das Lehrheft bekommt Seitensprung, vorige/nächste Lektion und Akkordeon. Der Unterpunkt „Lehre der Kreise“ entfällt: Der Reiter „Lehre“ zeigt bei arkanen Klassen direkt das Lehrheft; die Theorie-Seiten stehen weiterhin im Vorspann des Buches. Bei göttlichen Klassen wird „Vom Gebet“ blätterbar. Das Buch verhält sich wie bisher.
- Maßstab: Die Satz-Tests liefern vor und nach dem Umbau dieselben Seitenzahlen und Umbrüche (Sollwerte unverändert).

## Capabilities

### New Capabilities
- `page-viewer`: gemeinsamer Seitenbetrachter mit Blätterleiste, Sprüngen, Verzeichnis und austauschbarem Setzen für Buch, Lehrheft und „Vom Gebet“; Reiter „Lehre“ ohne Unterpunkte.
- `typesetting`: Satzmodul und Satz-Klassen als festgelegter Vertrag (fließende Seiten, Teilbarkeit, Umbruchregeln, rechte Seiten, Lochrand, Autofit).

### Modified Capabilities
<!-- Die Anforderungen an die Buchvorschau (book-layout) bleiben inhaltlich gleich; sie werden vom Seitenbetrachter erfüllt. Lehrheft-Ansicht und Lehre der Kreise sind über page-viewer abgedeckt, um nicht mit dem offenen Change add-apprentice-primer an denselben Anforderungen zu ändern. -->

## Impact

- Neu: `app/js/viewer.js` (Seitenbetrachter, Verzeichnis), `app/js/typeset.js` (Satzmodul), gemeinsame Legenden in `circle.js` oder eigenem `legend.js`.
- Geändert: `app/js/app.js` (Buch-, Lehrheft-, Theorie-Ansicht nutzen den Betrachter), `app/js/book.js` (Satz-Teil ausgelagert), `app/js/primer.js` (Legenden), `index.html` (Skripte, Markup der Ansichten), `app/style.css` (gemeinsame Klassen).
- Voraussetzung: Change `add-typeset-tests` mit Sollwerten; Change `add-apprentice-primer` sollte vorher abgeschlossen oder zumindest im Satz stabil sein.
- Keine neuen Abhängigkeiten, kein Build-Schritt.

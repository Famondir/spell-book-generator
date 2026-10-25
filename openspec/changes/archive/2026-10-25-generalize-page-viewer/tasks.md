## 1. Ausgangsstand

- [x] 1.1 Satz-Tests (`add-typeset-tests`) laufen grün; Sollwerte und Chrome-Version notieren

## 2. Satzmodul

- [x] 2.1 `app/js/typeset.js` (`window.TYPESET`): `typeset`, `fit`, `flow`, `rebalance`, `contPage`, Leerseiten, Lochrand, Nummerierung aus `book.js` verschieben, ohne Änderung; `BOOK.typeset`/`BOOK.autofit` vorübergehend weiterreichen; Tests grün
- [x] 2.2 Kopf mit dem Klassen-Vertrag (`.flow`, `.flow-cont`, `.splittable`, `.keep-next`, `.break-before`, `.recto-start`, `.blank`, `.bind`/`.verso`, `.opt`, `--fit`); Aufrufer auf `TYPESET` umstellen; Tests grün

## 3. Seitenbetrachter

- [x] 3.1 `app/js/viewer.js` (`window.VIEWER.create`): Doppelseiten mit Platzhalter, eine Seite auf schmalen Bildschirmen, Blätterleiste (Anfang/zurück/vor/Ende, Seitenzahl-Eingabe, Einheiten), Pfeiltasten, Größenänderung, gemerkte Position, Auftragsschlüssel zum Abbrechen
- [x] 3.2 Verzeichnis-Baustein: Seitenleiste rechts ausklappbar, Akkordeon, Sprung zur Seite, Hervorhebung beim Blättern, gemerkte offene Abschnitte
- [x] 3.3 Lehrheft auf den Betrachter umstellen (`render: "all"`, Einheiten = Lektionen, Verzeichnis = Teile/Lektionen); `primerSpread`/`primerTOC` entfernen; Szenarien „Nächste Lektion“, „Seitenzahl eingeben“, „Lehrheft-Verzeichnis“ prüfen
- [x] 3.4 Unterpunkte im Reiter „Lehre“ entfernen (arkan: direkt Lehrheft); „Vom Gebet“ auf den Betrachter umstellen; Bedienungsfall `ui-lehre-wechsel` ersetzen durch „Lehre zeigt Lehrheft“ und „Vom Gebet blättern“; Szenarien prüfen
- [x] 3.5 Buchvorschau umstellen (`render.window`, Einheiten = Zauber, Bände, Regeltext-Knöpfe als `after`); `showSpread`/`renderPager` entfernen; Szenarien aus `book-layout` und `book-volumes` von Hand durchgehen

## 4. Legenden

- [x] 4.1 `app/js/legend.js` (`window.LEGEND`): Essenzen, Schulen, Zeichen, Alchemie, Schulfiguren; „Lehre der Kreise“ (`book.js`) und Lehrheft (`primer.js`) nutzen sie; Screenshots beider Orte vergleichen

## 5. Abschluss

- [x] 5.1 Satz-Tests ohne `--update` grün; Bedienung auf schmalem und breitem Fenster prüfen (Screenshots)
- [x] 5.2 README (Aufbau der Module) und Backlog-Eintrag „Seitenbetrachter und Satzmodul verallgemeinern“ entfernen

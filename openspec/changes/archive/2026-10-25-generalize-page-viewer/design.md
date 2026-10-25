## Context

Heute (nach dem Lehrheft-Commit):
- **Buchvorschau** (`app.js`: `showSpread`, `spreadSize`, `spreadAt`, `unitAt`, `renderPager`, `gotoPageNo`, Verzeichnis mit Akkordeon in `#book-toc`): setzt ausschnittweise nach „Einheiten“ (Zauber mit ihren Seiten), merkt `bookPos`/`bookVol`, kennt Bände.
- **Lehrheft** (`renderPrimer`, `primerSpread`, `primerTOC`): setzt das ganze Heft, blättert mit eigener Leiste, eigenes Verzeichnis ohne Akkordeon, Position nur im Speicher.
- **Lehre der Kreise / Vom Gebet** (`renderTheory`): alle Seiten untereinander, kein Blättern. Für Magier entfällt der Unterpunkt (die Seiten stehen im Buch-Vorspann); für Paladine wird „Vom Gebet“ blätterbar.
- **Satz** (`book.js`): `typeset`, `fit`, `flow`, `rebalance`, `contPage`, Leerseiten, Lochrand – mitten im Modul mit Zauberseiten, Vorspann, Regelband.

Der Change `add-typeset-tests` liefert Sollwerte für alle Druckaufträge. Sie sind der Maßstab: Der Satz darf sich durch das Auslagern nicht ändern.

## Goals / Non-Goals

**Goals:**
- Ein Betrachter, drei Ansichten; neue Ansichten brauchen nur Seiten, Einheiten und Verzeichnis.
- Satzmodul mit dokumentiertem Klassen-Vertrag, unabhängig von Inhalten.
- Gleiche Seiten vor und nach dem Umbau (Satz-Tests ohne `--update` grün).
- Lehrheft gewinnt die Buch-Funktionen (Seitensprung, Einheiten, Akkordeon, gemerkte Position).

**Non-Goals:**
- Neues Aussehen der Blätterleiste oder des Verzeichnisses.
- Änderungen an Seiteninhalten, Satzregeln oder Druckwegen (außer dass sie das Modul nutzen).
- Bände für das Lehrheft.
- Ein Modulsystem oder Build-Schritt; es bleiben `<script>`-Dateien mit `window.*`.

## Decisions

**`window.VIEWER.create(opts)` statt Klassenhierarchie.** Eine Fabrikfunktion liefert ein Objekt mit `show(pos)`, `refresh()`, `go(dir)`, `destroy()`. Optionen:
- `root`, `pager`, `toc` (Elemente), `key` (Speicherschlüssel der Position, z. B. `bookPos`, `primerPos`, `theoryPos`)
- `pages()`: Seitenobjekte oder Anzahl plus `pageNo(i)` (gedruckte Nummer)
- `units()`: Startindizes der Einheiten mit Bezeichnung („Zauber“, „Lektion“) oder `null`
- `render`: `"all"` oder `{ window: (a, b) => [start, end] }` für ausschnittweises Setzen
- `tocModel()`: Abschnitte mit Einträgen `{ label, title, pageIndex | anchor }`
- `after(root)`: Nacharbeiten nach dem Setzen (Buch: Regeltext-Knöpfe)
Das passt zum übrigen Code (Module als IIFE mit `window.X`) und lässt Buch-Besonderheiten (Bände, Regeltext-Knöpfe) als Optionen statt Unterklassen.

**Ausschnittweises Setzen bleibt Sache des Betrachters, die Einheiten liefert die Ansicht.** Die Buchvorschau setzt heute die Einheiten um die Position (`unitAt`) und zeigt dann den Ausschnitt; diese Logik zieht unverändert in den Betrachter (`render.window`). Das Lehrheft nutzt `render: "all"`.

**Abbruch über Auftragsschlüssel.** Wie heute `primerRendered`/`view.rendered`: Jeder Auftrag bekommt einen Schlüssel; nach jedem `await` wird geprüft, ob er noch gilt. Kein `AbortController`, weil `typeset` synchron in Häppchen arbeitet.

**Verzeichnis als Baustein mit Akkordeon.** Das Buch-Verzeichnis (Abschnitte, `tocOpen`) wird verallgemeinert; das Lehrheft liefert Teile als Abschnitte und Lektionen als Einträge. Hervorhebung des aktuellen Abschnitts über den Abschnitt der zuletzt sichtbaren Seite (heute im Lehrheft über `part-<id>`-Klassen; künftig über `tocModel` mit Seitenindex, damit keine Ansicht CSS-Klassen erfinden muss).

**Satzmodul `app/js/typeset.js` = `window.TYPESET`.** Enthält `typeset`, `fit`, `flow`, `rebalance`, `contPage`, Leerseiten, Lochrand, Nummerierung; `book.js` re-exportiert `BOOK.typeset`/`BOOK.autofit` vorübergehend, damit Aufrufer schrittweise umziehen. Der Kopf der Datei beschreibt den Klassen-Vertrag (siehe Spec). Reihenfolge des Umzugs: erst verschieben ohne jede Änderung (Tests grün), dann aufräumen (Tests grün).

**Legenden in `legend.js` = `window.LEGEND`.** Funktionen je Legende (`essences()`, `schools()`, `signs()`, `alchemy()`, `quickSchools()`), die HTML-Bausteine liefern; „Lehre der Kreise“ und Lehrheft setzen sie in ihr Seitenlayout. So bleibt das Aussehen je Ort frei, die Zeichen kommen aus einer Quelle.

**Vorgehen in kleinen, jeweils getesteten Schritten.** Nach jedem Schritt laufen die Satz-Tests; ein Schritt, der Sollwerte ändert, wird zurückgenommen oder begründet (`--update` nur mit Begründung im Commit).

## Risks / Trade-offs

- [Buchvorschau verliert ein Detail (Bände, Seitensprung über Bandgrenzen, Regeltext-Knöpfe, Notizseiten-Ausgleich)] → Buch zuerst umstellen und gegen die bestehenden Spec-Szenarien von `book-layout` und `book-volumes` von Hand prüfen; Satz-Tests decken den Druck ab, nicht die Bedienung.
- [Gleichzeitig offener Change `add-apprentice-primer` ändert dieselben Dateien] → diesen Change erst beginnen, wenn der Satz im Lehrheft stabil ist (Texte und Stimmen ändern den Satz nicht grundsätzlich); bei Überschneidung zuerst das Lehrheft committen.
- [Mehr Indirektion für ein kleines Projekt] → nur zwei neue Module, keine Klassen; Optionen statt Erweiterungspunkte auf Vorrat.
- [Lehre der Kreise ist heute ohne Leiste schnell überblickbar] → Seiten bleiben dieselben; der Betrachter macht nur das Blättern einheitlich.

## Migration Plan

1. Satz-Tests grün auf dem Ausgangsstand.
2. `typeset.js` herauslösen (reiner Umzug), Tests grün.
3. `viewer.js` mit dem Lehrheft als erstem Nutzer (einfachster Fall: alles setzen), dann „Lehre der Kreise“, dann das Buch (ausschnittweise, Bände).
4. Legenden zusammenführen.
5. Alte Funktionen entfernen, Tests grün, Bedienung von Hand prüfen.
Rücknahme: jeder Schritt ist ein eigener Commit und einzeln umkehrbar.

## Open Questions

- Soll die gemerkte Position im Lehrheft eine Seitennummer oder eine Lektion sein (Lektion bleibt stabil, wenn sich Seiten verschieben)? Vorschlag: Lektion plus Versatz.
- Bekommt „Lehre der Kreise“ ein Verzeichnis (Abschnitte der Theorie)? Vorschlag: ja, wenn es sich mit dem Baustein ohne Mehraufwand ergibt.

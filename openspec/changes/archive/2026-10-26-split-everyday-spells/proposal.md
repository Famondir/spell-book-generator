## Why

Teil VII „Kleine Formeln“ mischte die Zaubertricks des Regelwerks mit den Alltagszaubern des Hauses. Die Alltagszauber sind Hausregeln, wachsen mit dem Buch und gehören nicht in den festen Lehrgang; dasselbe galt für die Übersicht der Schnellglyphen. Die Alltagszauber brauchen einen eigenen Ort, der wachsen kann.

## What Changes

- Teil VII „Kleine Formeln“ enthält nur noch Zaubertricks (offizieller Kanon); ohne Zaubertricks im Buch erscheint wie bisher die Grundauswahl.
- Neuer Abschnitt „Alltagszauber“ hinter dem Anhang: kurze Einleitungsseite, dann je Alltagszauber eine Seite im Aufbau der kleinen Formeln (Kicker „Alltagszauber n“). Ohne Alltagszauber im Buch entfällt der Abschnitt. Er steht im Inhaltsverzeichnis und im Prüfbogen.
- Die Übersicht im Teil „Schnellglyphen“ listet nur Zaubertricks (bzw. die Grundauswahl).
- Die Schnellglyphe jedes Alltagszaubers steht auf dessen Seite, unten bündig mit dem Kreis auf der Lochrandseite (rechte Seite links, linke Seite rechts). Sie überlagert nur das Rechteck des Kreises, nicht den Kreis selbst; der Kreis wird nicht verkleinert.

Die Umsetzung ist bereits erfolgt (Commits `5d287b9`, `3363c69`, `ba7ee33`); dieser Change zieht die Spezifikation nach.

## Capabilities

### New Capabilities
<!-- keine -->

### Modified Capabilities
- `apprentice-primer`: Die Anforderung „Kleine Formeln als Tagesbuch“ trennt Zaubertricks (Teil VII) und Alltagszauber (eigener Abschnitt hinter dem Anhang) und regelt Schnellglyphen-Übersicht und Glyphenplatz.

## Impact

- `app/js/primer.js` (`build`, `formulaLesson`, `quicklist`), `data/primer.js` (Teil `W`), `app/style.css` (`.qside`), `tools/test-baseline.json`.

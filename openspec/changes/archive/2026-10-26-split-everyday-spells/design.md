## Context

`build` in `app/js/primer.js` setzte Teil VII aus allen Zaubertricks und Alltagszaubern des Buches (`small`). `small` speist auch Übungen der Lektionen (Mischungen, Anatomie, Lücken, Vergleich).

## Decisions

- **Aufteilung im Satz, nicht in den Daten:** `small` bleibt für die Übungen unverändert; aus ihm werden `tricks` (ohne Alltagszauber, Grundauswahl wenn leer) und `everyday` gebildet. `b.tricks` dient der Schnellglyphen-Übersicht. Alternative, `small` selbst zu teilen, hätte die Übungen verändert.
- **Eigener Teil `W`:** In `data/primer.js` hinter dem Anhang, ohne Teilnummer und wie der Anhang ohne „Teil“ betitelt. Er wird bei leerer Liste übersprungen. Die Kleine-Formel-Vorlage wird wiederverwendet (`formulaLesson` mit Kicker „Alltagszauber“), ihr Lesestück steht nur in Teil VII.
- **Glyphe absolut positioniert:** Die Schnellglyphe liegt als `position: absolute` im Kreisbild (`.mview.fit`), unten über der Bildunterschrift, auf der Lochrandseite (`left`, auf Versoseiten `right`). Ein Float nahm Breite weg und verkleinerte über die Anpassung den Kreis; absolut beeinflusst sie weder Fluss noch Größe. Die Glyphe steht nur bei Alltagszaubern, nicht bei Zaubertricks.
- **Loses Blatt:** Bleibt direkt hinter dem Anhang, vor den Alltagszaubern.

## Risks

- Hängt die Glyphe künftig an Zaubertricks, muss die Seitenbreite neben dem Kreis geprüft werden.
- Das lose Blatt liegt dadurch nicht am Heftende.

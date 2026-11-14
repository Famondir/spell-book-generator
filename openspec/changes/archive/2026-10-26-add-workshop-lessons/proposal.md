## Why

Im Teil „Die Werkstatt“ fehlen zwei Handwerke, auf die das Heft schon verweist: Der Kasten „Das Gift im Tintenfass“ verlangt Waschen nach der Arbeit, der Lehrvertrag hat ein Siegelfeld. In der Glyphenlehre gibt es Kern und Beizeichen, aber nichts, womit der Lehrling die veränderlichen Teile einer Formel (Ort, Ziel, Name) selbst bildet. Drei neue Lektionen schließen diese Lücken (Backlog „Spannende Handwerks-Ergänzungen“).

## What Changes

- Neue Lektion **Seife und Lauge** in Teil I, direkt nach „Farben und ihre Gifte“: Pottasche aus Holzasche, Eiprobe, Sieden, Aussalzen; Kasten zum Waschen nach dem Zinnober; Bezug auf Sulfur (Fett) und Sal (Asche).
- Neue Lektion **Siegellack und Petschaft** in Teil I, nach „Papier schöpfen“: Wachssiegel und späterer Siegellack, Fehlerbilder, das Siegel als Zeugnis; erzeugte Fläche zum Entwurf des eigenen Petschafts und für den Abdruck.
- Neue Lektion **Sigillenbau** am Ende von Teil III: aus einem Satz der Absicht durch Streichen und Verschmelzen ein Beizeichen bilden; eine Ansicht des Meisters wird erzeugt, eigene Sigillen entstehen von Hand.
- Die Lektionsnummer wird aus der Reihenfolge der nummerierten Lektionen berechnet, nicht mehr aus der Id. Die bisherigen Ids (`l1` … `l42`) bleiben, damit Randnotizen und Lektionsersatz im Profil weiter greifen. Verweise auf Lektionsnummern im Text („Lektion 16“) werden zu Verweisen auf die Id und beim Satz in die aktuelle Nummer übersetzt.

## Capabilities

### New Capabilities
<!-- keine -->

### Modified Capabilities
- `apprentice-primer`: drei zusätzliche Lektionen; Nummerierung nach Reihenfolge statt nach Id; Lektionsverweise im Text. (Die Fähigkeit entsteht im noch offenen Change `add-apprentice-primer`; dieser Change wird danach archiviert.)

## Impact

- `data/primer.js`: drei neue Lektionen, Verweis in „Der Wochenkreis“ auf `l16` statt „Lektion 16“.
- `app/js/primer.js`: Nummerierung aus der Reihenfolge (Kicker, Inhaltsverzeichnis, Glossar, Prüfbogen), Auflösung der Lektionsverweise, zwei neue Generatoren (Petschaft, Sigille).
- `data/profile.local.example.js`: Kommentare, die Lektionsnummern nennen, prüfen.
- `add-bilingual-app`: `data/primer.en.js` braucht die drei neuen Lektionen (gleiche Ids).
- Backlog-Eintrag „Kalender- und Wochenseite“ nennt „Lektion 30“; die Nummer verschiebt sich auf 33.

## Why

Das gedruckte Buch ist Fluff zum Mitnehmen (z. B. in Leder gebunden); die Regeln nutzt man digital. Ein Regelanhang im Buch stört dabei, im Inhaltsverzeichnis wie beim Blättern. Gleichzeitig fehlen beim großen Buch Rückmeldung und Tempo beim Druck sowie ein paar Bedienhilfen.

## What Changes

- **BREAKING** Der Regelanhang entfällt aus Buch, Vorschau und Inhaltsverzeichnis. Stattdessen öffnet ein **(i)** auf jeder Zauberseite der Vorschau den Regeltext in einem Fenster.
- Neuer, separater **Regelband**: nur Regeltexte, nummeriert in Buchreihenfolge, als zweites Buch zum Nebeneinanderlegen.
- Optionale Regelverweise auf den Zauberseiten (alle standardmäßig aus): **Regelband-Nummer**, **QR-Code** zur Seite bei Archives of Nethys, **Quellenangabe** (Regelwerk und Seite).
- **Füllseiten**: Zauber mit mehr als einer Seite beginnen immer auf einer linken Seite; die Vorschau zeigt Doppelseiten wie ein Buch (Seite 1 rechts allein, dann 2|3, 4|5 …).
- Blätterleiste: Anfang, **vorheriger Zauber**, zurück, vor, **nächster Zauber**, Ende.
- Inhaltsverzeichnis als **Akkordeon**, alle Abschnitte zu Beginn eingeklappt.
- **Fortschrittsanzeige** („120/811“) beim Druckvorbereiten, Regelband, Schriftrollen und Import; Druckvorbereitung in Häppchen, damit der Browser bedienbar bleibt.
- **Druck-Cache**: gleiche Druckaufträge werden nicht erneut gesetzt.
- Kleinigkeiten: Knöpfe im Kreisfenster untereinander, Klapp-Laschen mittig auf der Höhe.

## Capabilities

### New Capabilities
<!-- keine -->

### Modified Capabilities
- `book-layout`: kein Regelanhang, Füllseiten, Regelverweise, Akkordeon, Blättern nach Zaubern
- `printing`: Regelband, Fortschritt, Druck-Cache

## Impact

`app/js/book.js` (assemble, head, fit in Häppchen), `app/js/app.js` (Vorschau, Druck, Einstellungen), `index.html`, `app/style.css`, neue Bibliothek `app/vendor/qrcode.js` (MIT, offline mitgeliefert). Einstellung `rules: "appendix"` wird ignoriert.

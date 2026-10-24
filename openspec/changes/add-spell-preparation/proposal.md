## Why

Das Buch zeigt, welche Zauber ein Magier *kennt*. Am Spieltisch zählt aber, welche er heute *vorbereitet* hat und welche schon verbraucht sind. Bisher steht das auf Schmierzetteln. Eine schlanke Tagesvorbereitung mit Abstreichen schließt diese Lücke, ohne einen Charakterbogen nachzubauen.

## What Changes

- Neue Ansicht **„Heute vorbereitet“**: Zauberplätze pro Grad eintragen (Zahl, von Hand), Zauber aus dem eigenen Buch in die Plätze legen (derselbe Zauber darf mehrfach liegen).
- **Abstreichen** gewirkter Zauber per Klick (rückgängig machbar); Zaubertricks bleiben unbegrenzt nutzbar.
- **„Neuer Tag“** setzt alle Abstriche zurück, die Vorbereitung bleibt; **gespeicherte Vorbereitungen** (z. B. „Reise“, „Dungeon“) lassen sich laden.
- Optionaler **Tageszettel** zum Drucken: Schnellglyphe, Name, Grad und Kästchen zum Abhaken mit Stift.
- Zustand lokal im Browser, kein Konto, keine Klassenberechnung.

## Capabilities

### New Capabilities
- `spell-preparation`: Zauberplätze, Vorbereitung, Abstreichen, Tageswechsel, gespeicherte Vorbereitungen

### Modified Capabilities
- `printing`: zusätzlich ein druckbarer Tageszettel

## Impact

- Neues Modul `app/js/prepare.js`, neuer Reiter in `index.html`, Stile in `app/style.css`
- `app/js/app.js`: Navigation, localStorage-Schlüssel `spellbook.prep*`
- Keine Änderung an Buchlayout, Kreisen oder Texten

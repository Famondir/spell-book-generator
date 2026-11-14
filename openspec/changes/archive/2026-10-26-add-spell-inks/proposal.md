## Why

Jede Formel trägt schon Entsprechungen (Farbe, Metall, Stunde), aber womit sie geschrieben wird, sagt das Buch nicht. Zaubertinten machen die Essenzlehre greifbar: Die Tinte einer Formel ergibt sich aus ihrer Mischung, und der Lehrling lernt, eine Zutat zu begründen (Backlog „Zaubertinten“). Die Tinten haben keine Regelwirkung.

## What Changes

- Jede Formel erhält eine deterministische **Tinte**: Grundtinte, Farbe aus der Entsprechungsfarbe der Hauptessenz, Metallstaub aus deren Entsprechungsmetall, eine Beimischung aus der zweitstärksten Essenz mit einer kurzen Begründung im Ton eines Werkstattbuchs, auf Wunsch ein Tag zum Anreiben aus dem Wandelstern des Metalls.
- Giftige Farbstoffe (Zinnober, Mennige, Bleiweiß, Grünspan, Auripigment) und giftige Metalle (Blei, Quecksilber) tragen einen Warnvermerk im In-Game-Ton.
- Im Zauberbuch steht die Tinte als Zeile in den Entsprechungen.
- Neue Lektion **Tinten nach der Mischung** im Lehrheft, Teil IV nach „Mischungen in Teilen“: Tafel Essenz → Farbstoff und Metall, Beispiel einer begründeten Beimischung, Aufgabe für eine eigene Formel.
- Eigene Tinten lassen sich wie andere Texte über `data/custom_texts.js` und die Entsprechungen im Profil überschreiben.
- Keine Regelwirkung: keine Boni, keine Kosten, kein Verweis auf Regeln.

## Capabilities

### New Capabilities
- `spell-inks`: Ableitung der Tinte einer Formel aus Essenzen und Entsprechungen, Farbstoff-Tafel, Warnvermerke, keine Regelwirkung.

### Modified Capabilities
- `spell-texts`: Die Entsprechungen eines Zaubers enthalten die Tinte.
- `apprentice-primer`: zusätzliche Lektion „Tinten nach der Mischung“ in Teil IV.

## Impact

- `app/js/textgen.js`: Tinte erzeugen (neben `CORRESPOND_BASE`), Farbstoff-Tafel.
- `app/js/book.js`: Zeile „Tinte“ in `correspondBlock`.
- `app/js/primer.js`, `data/primer.js`: neue Lektion mit Generator.
- `data/profile.js` / Profil: Farbstoffe je Farbe überschreibbar.
- `add-bilingual-app`: englische Namen für Farbstoffe und Begründungen; neue Lektion in `data/primer.en.js`.
- Hängt an `add-workshop-lessons` (Nummerierung nach Reihenfolge), weil auch diese Lektion ohne Umnummerieren eingefügt wird.

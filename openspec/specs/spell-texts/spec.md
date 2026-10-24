# spell-texts Specification

## Purpose
Deutsche In-Game-Texte zu jedem Zauber: Formel, Gesten, Theorie, Ausführung und Randnotizen.

## Requirements

### Requirement: Baukasten-Texte
Die App SHALL zu jedem Zauber deterministisch Titel, Beiname, Formel, Gesten, Materialien, Theorie, Kreisaufbau, Ausführung in drei Phasen und Randnotizen erzeugen; für höhere Grade zusätzlich Kalibrierung, Fehlschlag, Gegenzauber, Übungsprotokoll, Langformel, Herkunft und Entsprechungen.

#### Scenario: Grad 0
- **WENN** ein Zaubertrick dargestellt wird
- **DANN** hat er eine Formel, drei Gesten und eine kurze Theorie

### Requirement: Handgeschriebene Texte
Einträge in `data/custom_texts.js` SHALL die generierten Felder eines Zaubers überschreiben.

#### Scenario: Eigene Formel
- **WENN** für einen Zauber eine eigene Formel hinterlegt ist
- **DANN** erscheint sie statt der generierten

### Requirement: Keine Meta-Texte
In-Game-Texte MUST NOT auf die Regeln verweisen (etwa „steht bei den Regeln“) und MUST NOT englischen Regeltext enthalten; mythische Hinweise erscheinen nur als deutscher In-Game-Text.

#### Scenario: Mythischer Zauber
- **WENN** ein Zauber eine mythische Fassung hat
- **DANN** beschreibt die Buchseite die mythische Resonanz auf Deutsch, ohne den englischen Mythic-Regeltext

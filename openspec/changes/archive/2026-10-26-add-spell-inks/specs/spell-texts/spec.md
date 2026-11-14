## MODIFIED Requirements

### Requirement: Baukasten-Texte
Die App SHALL zu jedem Zauber deterministisch Titel, Beiname, Formel, Gesten, Materialien, Theorie, Kreisaufbau, Ausführung in drei Phasen und Randnotizen erzeugen; für höhere Grade zusätzlich Kalibrierung, Fehlschlag, Gegenzauber, Übungsprotokoll, Langformel, Herkunft und Entsprechungen. Die Entsprechungen MUST eine Zeile „Tinte“ enthalten.

#### Scenario: Grad 0
- **WENN** ein Zaubertrick dargestellt wird
- **DANN** hat er eine Formel, drei Gesten und eine kurze Theorie

#### Scenario: Tinte in den Entsprechungen
- **WENN** für einen Zauber die Entsprechungen erscheinen
- **DANN** steht darunter eine Zeile „Tinte“, und die Formel rutscht dadurch nicht auf eine weitere Seite

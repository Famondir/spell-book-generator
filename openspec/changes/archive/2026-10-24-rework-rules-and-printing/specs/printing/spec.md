## ADDED Requirements

### Requirement: Regelband
Die App SHALL einen separaten Regelband drucken: Titelblatt und die Regeltexte aller Buchzauber in Buchreihenfolge, jeder mit seiner Nummer aus dem Inhaltsverzeichnis.

#### Scenario: Nebeneinanderlegen
- **WENN** im Buch bei Fireball „Regelband Nr. 57“ steht
- **DANN** findet sich Fireball im Regelband unter Nr. 57

### Requirement: Fortschrittsanzeige
Länger laufende Vorgänge (Druckvorbereitung, Regelband, Schriftrollen, Import) SHALL einen Zähler „erledigt/gesamt“ zeigen und den Browser zwischendurch bedienbar lassen.

#### Scenario: Buch drucken
- **WENN** ein Buch mit 800 Seiten gedruckt wird
- **DANN** zählt die Anzeige die gesetzten Seiten hoch, bis der Druckdialog erscheint

### Requirement: Druck-Cache
Ein unveränderter Druckauftrag MUST beim zweiten Mal ohne erneutes Setzen gedruckt werden.

#### Scenario: Zweiter Druck
- **WENN** das Buch zweimal hintereinander ohne Änderung gedruckt wird
- **DANN** erscheint der Druckdialog beim zweiten Mal sofort

# printing Specification

## Purpose
Druck des Buches, einzelner Zauber und von Schriftrollen.
## Requirements
### Requirement: Papierformate
Das Buch SHALL in A5, A4 (A5 hochskaliert) und A4 quer mit zwei A5-Seiten gedruckt werden können.

#### Scenario: A4 quer
- **WENN** „A4 quer“ gewählt ist
- **DANN** stehen je zwei Buchseiten nebeneinander auf einem Blatt

### Requirement: Schriftrollen
Jeder Zauber SHALL als Schriftrolle druckbar sein: vorne Name und großer Kreis, hinten Formel, Komponenten und Regeltext (A4 zweispaltig ohne Skalierung, A5 möglich).

#### Scenario: Alle als Schriftrollen
- **WENN** „Alle als Schriftrollen drucken“ gewählt wird
- **DANN** entstehen für jeden Buchzauber Vorder- und Rückseite

### Requirement: Druckoptionen
Der Pergament-Hintergrund SHALL abschaltbar sein; die Schriften MUST lokal mitgeliefert werden; ein einzelner Zauber MUST für sich druckbar sein.

#### Scenario: Ohne Hintergrund
- **WENN** „Pergament-Hintergrund drucken“ aus ist
- **DANN** ist der Seitenhintergrund weiß

### Requirement: Tageszettel
Die aktuelle Vorbereitung SHALL als A5-Tageszettel im Buchstil druckbar sein: je Zauber Schnellglyphe, Name, Grad und ein Kästchen zum Abhaken.

#### Scenario: Tageszettel drucken
- **WENN** in der Vorbereitung „Tageszettel drucken“ gewählt wird
- **DANN** entsteht eine Seite mit allen vorbereiteten Zaubern nach Grad, jeder mit leerem Kästchen

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

### Requirement: Inhaltsverzeichnis des Regelbands
Der Regelband SHALL nach dem Titelblatt ein Inhaltsverzeichnis enthalten, das jeder Nummer Namen und Seitenzahl zuordnet.

#### Scenario: Nummer nachschlagen
- **WENN** im Zauberbuch „Regelband Nr. 224“ steht
- **DANN** nennt das Inhaltsverzeichnis des Regelbands die Seite von Nr. 224


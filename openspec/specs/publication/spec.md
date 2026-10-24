# publication Specification

## Purpose
Veröffentlichung der neutralen Fassung und Einhaltung der Lizenzen.

## Requirements

### Requirement: Neutrale Veröffentlichung
Die öffentliche Fassung SHALL über `tools/publish.sh` als GitHub Page erscheinen und MUST NOT persönliche Daten (lokales Profil, Charakterdateien, Rohdaten) enthalten.

#### Scenario: Veröffentlichen
- **WENN** `tools/publish.sh` läuft
- **DANN** enthält origin/main nur Dateien, die nicht in .gitignore stehen

### Requirement: Lizenzen
Regeltexte SHALL unter der OGL 1.0a mit `LICENSE-OGL.txt` erscheinen; Schriften MUST mit ihrer OFL-Lizenz ausgeliefert werden; eigene Texte MUST NOT Product Identity von Paizo verwenden.

#### Scenario: Lizenzdatei
- **WENN** das Repository geklont wird
- **DANN** liegen OGL-Text und Schriftlizenz bei

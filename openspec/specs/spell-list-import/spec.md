# spell-list-import Specification

## Purpose
Zauberlisten ins Buch übernehmen und exportieren.

## Requirements

### Requirement: Import
Die App SHALL Zauberlisten aus xlsx (Spalte „Name“), csv, txt und json ohne externe Bibliothek lesen und fragen, ob die Liste ersetzt oder ergänzt wird.

#### Scenario: xlsx
- **WENN** eine xlsx-Datei mit Spalte „Name“ importiert wird
- **DANN** kommen alle erkannten Zauber ins Buch und unbekannte Namen werden gemeldet

### Requirement: Export
Die Buchliste SHALL als json exportierbar sein.

#### Scenario: Export und Re-Import
- **WENN** eine exportierte Liste wieder importiert wird
- **DANN** enthält das Buch dieselben Zauber

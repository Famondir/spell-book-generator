# spell-catalog Specification

## Purpose
Verzeichnis aller Pathfinder-1e-Zauber mit englischen Regelwerten, Suche, Filtern und Auswahl für das eigene Buch.

## Requirements

### Requirement: Zauberdaten
Die App SHALL alle Zauber aus `data/spells.js` laden, das `tools/parse_spells.py` aus den Seiten der Archives of Nethys und dem d20pfsrd-Export erzeugt. Fehlt ein Zauber bei AoN, MUST er aus dem d20pfsrd-Export übernommen werden.

#### Scenario: Zauber nur im d20pfsrd-Export
- **WENN** ein Zauber nicht in den AoN-Seiten vorkommt, aber im TSV-Export
- **DANN** erscheint er im Verzeichnis mit Herkunft „tsv“ und vollständigen Regelwerten

### Requirement: Suche und Filter
Das Verzeichnis SHALL nach Name, Titel und Essenz durchsuchbar sein und nach Grad, Schule, Essenz, Buchzugehörigkeit und Herkunft (Regelwerk/Alltagszauber) filtern. Optional MUST es sich auf die Magierliste beschränken lassen.

#### Scenario: Nur Alltagszauber
- **WENN** der Filter „Nur Alltagszauber“ gewählt ist
- **DANN** zeigt die Liste ausschließlich Alltagszauber

### Requirement: Buchauswahl
Mit **+** SHALL ein Zauber ins Buch aufgenommen oder daraus entfernt werden; die Auswahl MUST in localStorage erhalten bleiben.

#### Scenario: Neu laden
- **WENN** die Seite neu geladen wird
- **DANN** sind dieselben Zauber im Buch

### Requirement: Zauberansicht
Die Detailansicht SHALL den Zauber als Buchseiten zeigen, die englischen Regelwerte mit Quellenkasten, und einen Schalter „Ausführliche Ansicht“ für die Langfassung (~10 Seiten) bieten.

#### Scenario: Quellenkasten
- **WENN** ein Regelzauber angezeigt wird
- **DANN** steht unter dem Regeltext ein Kasten mit Quelle und OGL-Hinweis

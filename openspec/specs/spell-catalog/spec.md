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
Das Verzeichnis SHALL nach Name, Titel und Essenz durchsuchbar sein und nach Grad, Schule, Essenz, Buchzugehörigkeit und Herkunft (Regelwerk/Alltagszauber) filtern. Optional MUST es sich auf die Zauberliste der Klasse des aktiven Charakters beschränken lassen; Grade MUST nach dieser Klasse angezeigt und gefiltert werden. Alltagszauber SHALL nur bei Magiern erscheinen.

#### Scenario: Nur Alltagszauber
- **WENN** der Filter „Nur Alltagszauber“ gewählt ist
- **DANN** zeigt die Liste ausschließlich Alltagszauber

#### Scenario: Paladinliste
- **WENN** ein Paladin aktiv ist und „nur Klassenliste“ gilt
- **DANN** zeigt das Verzeichnis 291 Zauber mit Graden I bis IV

### Requirement: Buchauswahl
Mit **+** SHALL ein Zauber ins Buch aufgenommen oder daraus entfernt werden; die Auswahl MUST in localStorage erhalten bleiben.

#### Scenario: Neu laden
- **WENN** die Seite neu geladen wird
- **DANN** sind dieselben Zauber im Buch

### Requirement: Zauberansicht
Die Detailansicht SHALL den Zauber als Seiten der Tradition des aktiven Charakters zeigen (Magier: Buchseiten mit Kreis; Paladin: Brevierseite mit Andachtsbild), die englischen Regelwerte mit Quellenkasten, und bei Magiern einen Schalter „Ausführliche Ansicht“ für die Langfassung (~10 Seiten) bieten.

#### Scenario: Quellenkasten
- **WENN** ein Regelzauber angezeigt wird
- **DANN** steht unter dem Regeltext ein Kasten mit Quelle und OGL-Hinweis

#### Scenario: Paladin sieht Brevierseite
- **WENN** ein Paladin aktiv ist und Bless Weapon gewählt wird
- **DANN** zeigt die Detailansicht die Brevierseite mit Andachtsbild statt der Kreisseiten


## MODIFIED Requirements

### Requirement: Auswahl am Charakter
Ein Paladin-Charakter SHALL eine Gottheit aus `data/deities.js` wählen können, durchsuchbar nach Name und Beiname und vorgefiltert auf Gottheiten, deren Gesinnung zu einem Paladin passt (LG, LN, NG). Jeder Vorschlag MUST Name, Gesinnung und Beiname zeigen, damit die Suche nach dem Namen in allen Browsern gelingt. Ein Profil MUST eine Gottheit vorgeben können.

#### Scenario: Gottheit wählen
- **WENN** in den Einstellungen eines Paladins „Torag“ gewählt wird
- **DANN** zeigen Brevier, Andachtsbilder und Gebete Torags Farben, Symbol und Zuständigkeiten

#### Scenario: Suche nach Namen
- **WENN** im Gottheitsfeld „Tor“ eingetippt wird
- **DANN** erscheint „Torag – LG, Father of Creation“ unter den Vorschlägen

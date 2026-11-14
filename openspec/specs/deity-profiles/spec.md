# deity-profiles Specification

## Purpose
TBD - created by archiving change add-paladin-prayer-book. Update Purpose after archive.
## Requirements
### Requirement: Gottheitsdaten erzeugen
`tools/parse_deities.py` SHALL aus den AoN-Seiten in `dieties/` die Datei `data/deities.js` erzeugen, mit Name, Beiname, Gesinnung, Pantheon, Zuständigkeiten, Domänen, Subdomänen, Lieblingswaffe, Symbol, heiligem Tier und heiligen Farben. Gehorsamsrituale, Segen, Kultzentren und Beschreibungstexte MUST NOT übernommen werden.

#### Scenario: Iomedae
- **WENN** das Werkzeug über `dieties/` läuft
- **DANN** enthält `data/deities.js` Iomedae mit Gesinnung LG, Domänen Glory, Good, Law, Sun, War, Symbol „Sword and sun“ und Farben rot und weiß, aber ohne Gehorsamstext

#### Scenario: Fehlende Farben
- **WENN** für eine Gottheit keine heiligen Farben angegeben sind
- **DANN** bleibt das Feld leer, und das Andachtsbild nutzt eine Palette nach Gesinnung

### Requirement: Farbnamen
Heilige Farben SHALL als Namen und als Farbwerte vorliegen; Zusätze in Klammern (Aspekte einer Gottheit) MUST beim ersten Aspekt bleiben, unbekannte Angaben wie „none“ oder „all“ MUST NOT als Farbe gelten.

#### Scenario: Zusammengesetzte Farbe
- **WENN** eine Gottheit „iron gray“ als Farbe hat
- **DANN** erhält sie einen Grauton und nicht Grau und Eisen getrennt

### Requirement: Auswahl am Charakter
Ein Paladin-Charakter SHALL eine Gottheit aus `data/deities.js` wählen können, durchsuchbar nach Name und Beiname und vorgefiltert auf Gottheiten, deren Gesinnung zu einem Paladin passt (LG, LN, NG). Jeder Vorschlag MUST Name, Gesinnung und Beiname zeigen, damit die Suche nach dem Namen in allen Browsern gelingt. Ein Profil MUST eine Gottheit vorgeben können.

#### Scenario: Gottheit wählen
- **WENN** in den Einstellungen eines Paladins „Torag“ gewählt wird
- **DANN** zeigen Brevier, Andachtsbilder und Gebete Torags Farben, Symbol und Zuständigkeiten

#### Scenario: Suche nach Namen
- **WENN** im Gottheitsfeld „Tor“ eingetippt wird
- **DANN** erscheint „Torag – LG, Father of Creation“ unter den Vorschlägen

### Requirement: Farbstoffe der heiligen Farben
Jede heilige Grundfarbe einer Gottheit SHALL beim Laden einen festen Farbstoff erhalten (`app/js/deity-colors.js`: z. B. Blau als Ultramarin, Azurit, Indigo, Smalte, Waid oder Kornblumenblau), mit eigenem Farbwert und deutschem Namen; die bekanntesten Gottheiten MUST je Grundfarbe verschiedene Farbstoffe haben, alle übrigen einen nach ihrer Id. Tafel der Zeit, Andachtsbild und Vademecum MUST diese Werte nutzen; der Grundfarbname bleibt für die Steine der Intarsie erhalten. Tempelfarben aus der lokalen Datei des Vademecums MUST weiter Vorrang haben.

#### Scenario: Gleiches Blau vermieden
- **WENN** Desna, Gozreh, Pharasma und Sarenrae Blau als heilige Farbe haben
- **DANN** tragen sie überall vier verschiedene Blautöne mit eigenen Namen

#### Scenario: Tempelfarben
- **WENN** die lokale Datei des Vademecums für eine Gottheit eigene Tempelfarben angibt
- **DANN** setzt das Vademecum diese Töne statt der Farbstoffe aus den Gottheitsdaten

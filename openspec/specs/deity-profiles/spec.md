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
Ein Paladin-Charakter SHALL eine Gottheit aus `data/deities.js` wählen können, durchsuchbar nach Name und vorgefiltert auf Gottheiten, deren Gesinnung zu einem Paladin passt (LG, LN, NG). Ein Profil MUST eine Gottheit vorgeben können.

#### Scenario: Gottheit wählen
- **WENN** in den Einstellungen eines Paladins „Torag“ gewählt wird
- **DANN** zeigen Brevier, Andachtsbilder und Gebete Torags Farben, Symbol und Zuständigkeiten


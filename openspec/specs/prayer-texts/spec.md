# prayer-texts Specification

## Purpose
TBD - created by archiving change add-paladin-prayer-book. Update Purpose after archive.
## Requirements
### Requirement: Kanon der Kirche
Für jeden Zauber SHALL ein deutsches Gebet aus Gottheit (Beiname, Zuständigkeiten, Domänen, Symbol) und Zauberanalyse (Schule, Hauptessenz, Gestalt, Ziel) generiert werden. Es MUST deterministisch sein und MUST NOT Texte von Paizo wiedergeben.

#### Scenario: Iomedae, Bless Weapon
- **WENN** der Kanon für Bless Weapon unter Iomedae erzeugt wird
- **DANN** ruft er die Gottheit beim Namen oder Beinamen an, nennt eine ihrer Zuständigkeiten und bittet um die Wirkung des Zaubers

### Requirement: Ton nach Gesinnung
Rechtschaffene Gottheiten SHALL Litaneien mit festem Kehrvers erhalten, neutrale schlichte Bitten, chaotische freie Anrufungen; gute Gottheiten MUST um Schutz und Licht bitten, böse um Macht und Unterwerfung.

#### Scenario: Litanei
- **WENN** die Gottheit rechtschaffen ist
- **DANN** wiederholt das Gebet einen Kehrvers mindestens zweimal

### Requirement: Eigene Worte
Je Zauber SHALL der Spieler ein eigenes Gebet eintragen können; es MUST je Charakter gespeichert und im Export enthalten sein. Ohne eigenes Gebet MUST die Brevierseite ein liniertes Feld zum Hineinschreiben zeigen.

#### Scenario: Eigenes Gebet
- **WENN** für Lesser Restoration ein eigenes Gebet eingetragen wird
- **DANN** steht es auf der Brevierseite in Handschrift unter dem Kanon

#### Scenario: Leeres Feld im Druck
- **WENN** ein Zauber ohne eigenes Gebet gedruckt wird
- **DANN** zeigt die Seite unter „Eigene Worte“ leere Linien

### Requirement: Gebetstitel
Jedes Gebet SHALL einen deutschen Titel aus einer Gabe nach Schule und einem Thema tragen. Das Thema MUST aus Stichwörtern des Zaubernamens kommen, wenn eines passt (z. B. „weapon“ → „der Waffe“, „evil“ → „wider das Böse“), sonst aus einer tragenden Essenz; Gabe und Thema MUST NOT denselben Wortstamm haben.

#### Scenario: Bless Weapon
- **WENN** der Titel für Bless Weapon erzeugt wird
- **DANN** endet er auf „der Waffe“

#### Scenario: Kein Doppelwort
- **WENN** ein Verwandlungszauber die Hauptessenz Fluxus hat
- **DANN** heißt sein Gebet nicht „Wandlung des Wandels“


## ADDED Requirements

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

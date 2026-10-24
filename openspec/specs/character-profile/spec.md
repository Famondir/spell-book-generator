# character-profile Specification

## Purpose
Trennung von neutralem Standard und persönlicher Backstory.

## Requirements

### Requirement: Profile
`data/profile.js` SHALL ein neutrales Profil enthalten; `data/profile.local.js` (gitignored) MUST einzelne Felder überschreiben, ohne dass die App ohne diese Datei bricht.

#### Scenario: Ohne lokales Profil
- **WENN** `data/profile.local.js` fehlt
- **DANN** läuft die App mit dem neutralen Profil

### Requirement: Platzhalter
Profiltexte SHALL die Platzhalter {owner}, {name}, {essence} und {school} unterstützen.

#### Scenario: Randnotiz
- **WENN** eine Profilnotiz {essence} enthält
- **DANN** steht dort die Hauptessenz des Zaubers

### Requirement: Eigene Alltagszauber
Das Profil SHALL Alltagszauber ergänzen, ausblenden und ihren Flavour-Text ersetzen können.

#### Scenario: Ausblenden
- **WENN** ein Name in `everyday.remove` steht
- **DANN** fehlt dieser Alltagszauber im Verzeichnis

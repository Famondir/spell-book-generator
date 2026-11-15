## MODIFIED Requirements

### Requirement: Profile
`data/profile.js` SHALL ein neutrales Profil enthalten; ein lokales Profil MUST einzelne Felder überschreiben, ohne dass die App ohne lokales Profil bricht. Lokale Profile SHALL aus `data/profile.local.js` (gitignored) oder aus im Browser gespeicherten Profilpaketen kommen (siehe `profile-transfer`); beide Quellen MUST nach denselben Regeln gemischt werden.

#### Scenario: Ohne lokales Profil
- **WENN** `data/profile.local.js` fehlt und kein Profilpaket gespeichert ist
- **DANN** läuft die App mit dem neutralen Profil

#### Scenario: Gespeichertes Profil ohne Datei
- **WENN** `data/profile.local.js` fehlt, aber Kirrans Profilpaket gespeichert ist und der Charakter es nutzt
- **DANN** sieht sein Buch genauso aus wie mit der Datei

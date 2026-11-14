## ADDED Requirements

### Requirement: Formelsprachen im Profil
Das Profil SHALL optional festlegen: Stationen, Bezeichnungen der Sprachen im Spiel (Zuordnung Leihsprache → Name), Zuschläge je Hand, tote Sprachen, voreingestellte beherrschte Sprachen und das Einschalten der Hausregel „Entziffern“. Setting-eigene Namen MUST nur in `data/profile.local.js` stehen; `profile.local.example.js` MUST ein neutrales Beispiel zeigen.

#### Scenario: Lokale Bezeichnung
- **WENN** das lokale Profil Mittelägyptisch einen eigenen Namen gibt
- **DANN** erscheint überall dieser Name, im Repository aber nur die irdische Bezeichnung

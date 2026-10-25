## ADDED Requirements

### Requirement: Deutsche Regeldaten bleiben lokal
Deutsche Regeltexte, deren Rohdaten und Prüflisten MUST NOT veröffentlicht werden; `data/rules.de.local.js`, `spells/` und `data/research/` MUST gitignoriert sein. Die öffentliche Fassung SHALL alle eigenen Texte in beiden Sprachen und die regelbasierte Begriffsübersetzung enthalten.

#### Scenario: Veröffentlichen mit deutschen Daten
- **WENN** `data/rules.de.local.js` lokal vorliegt und `tools/publish.sh` läuft
- **DANN** enthält origin/main diese Datei nicht, und die veröffentlichte App läuft mit übersetzten Begriffen und englischem Regeltext

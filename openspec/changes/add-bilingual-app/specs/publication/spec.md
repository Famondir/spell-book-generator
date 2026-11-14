## ADDED Requirements

### Requirement: Deutsche Regeldaten mit OGL-Hinweisen veröffentlichen
Die deutschen Regeldaten (`data/rules.de.js`, `data/domains.de.js`) SHALL Teil der öffentlichen Fassung sein: Ulisses Spiele hat die deutschen Regelinhalte unter der OGL freigegeben (FAQ des Deutschen PRD, „bis auf Widerruf“). Die Veröffentlichung MUST die Pflichtangaben enthalten: OGL mit den Copyright-Hinweisen der deutschen Ausgaben (Abschnitt 15 aus MyPFDB in `LICENSE-OGL.txt`), Verweis auf das Deutsche PRD, „Deutsche Begriffe: mit freundlicher Genehmigung von Ulisses Spiele“ und „Dieses Produkt unterliegt keiner Abnahme oder Genehmigung durch Ulisses Spiele“ (README, Kopf der Datendateien, Quellenkasten der Regeltexte). Rohdaten (`spells/`) und Prüflisten (`data/research/`) MUST gitignoriert bleiben. Die öffentliche Fassung SHALL alle eigenen Texte in beiden Sprachen enthalten.

#### Scenario: Veröffentlichen mit deutschen Daten
- **WENN** `tools/publish.sh` läuft
- **DANN** enthält origin/main `data/rules.de.js` und `data/domains.de.js` samt Lizenzhinweisen, aber weder `spells/` noch `data/research/`

#### Scenario: Widerruf
- **WENN** Ulisses die Freigabe widerruft
- **DANN** genügt es, die beiden Datendateien zu entfernen; die App läuft mit übersetzten Begriffen und englischem Regeltext weiter

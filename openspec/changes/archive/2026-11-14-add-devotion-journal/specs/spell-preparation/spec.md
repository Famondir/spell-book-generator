## MODIFIED Requirements

### Requirement: Nutzungsprotokoll
Die App SHALL jedes Vorbereiten, Entfernen, Wirken, Zurücknehmen und jeden Tageswechsel mit Zeitstempel, Zauber und Platzgrad protokollieren; auch Zaubertricks und Joker MUST beim Wirken protokolliert werden. Bei Charakteren mit Gottheit MUST die App außerdem Morgenandacht (mit dem Zauber des Formelfragments und dem zum Abschluss gewirkten Zauber, falls eingetragen; der abschließende Zauber wird nur vermerkt und MUST NOT abgestrichen werden, ein Zaubertrick genügt), Abendgebet und die Freigabe von Einträgen des Spielleiters protokollieren.

#### Scenario: Zaubertrick gewirkt
- **WENN** bei einem vorbereiteten Zaubertrick „gewirkt“ gewählt wird
- **DANN** entsteht ein Protokolleintrag, und der Zaubertrick bleibt verfügbar

#### Scenario: Abstrich zurückgenommen
- **WENN** ein Abstrich wieder entfernt wird
- **DANN** protokolliert die App eine Rücknahme, sodass der Zauber nicht als gewirkt zählt

#### Scenario: Morgenandacht
- **WENN** bei einem Charakter mit Gottheit „Morgenandacht gehalten“ gewählt und als abschließender Zauber Detect Magic eingetragen wird
- **DANN** entsteht ein Protokolleintrag „Andacht“ mit Fragment-Zauber und Detect Magic beim laufenden Spieltag

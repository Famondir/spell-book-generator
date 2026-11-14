## MODIFIED Requirements

### Requirement: Reiter Lehre ohne Unterpunkte
Bei arkanen Klassen SHALL der Reiter „Lehre“ direkt das Lehrheft zeigen; den Unterpunkt „Lehre der Kreise“ MUST es nicht mehr geben. Die Theorie-Seiten (bisher „Lehre der Kreise“) MUST weiterhin im Vorspann des Buches stehen, wenn der Vorspann eingeschaltet ist. Bei göttlichen Klassen bleibt der Reiter „Vom Gebet“ mit seinen Seiten. Hat der Charakter eine Gottheit, SHALL der Reiter zusätzlich eine Auswahl zwischen dem bisherigen Inhalt (Lehrheft bzw. „Vom Gebet“) und dem Vademecum zeigen; die Wahl MUST je Charakter gespeichert werden.

#### Scenario: Magier öffnet Lehre
- **WENN** ein Magier ohne Gottheit den Reiter „Lehre“ öffnet
- **DANN** erscheint sofort das Lehrheft, ohne Auswahl zwischen „Lehre der Kreise“ und „Lehrheft“

#### Scenario: Magier mit Gottheit
- **WENN** ein Magier mit Gottheit den Reiter „Lehre“ öffnet und zuletzt das Vademecum gewählt hatte
- **DANN** erscheint das Vademecum, und die Auswahl erlaubt den Wechsel zum Lehrheft

#### Scenario: Paladin
- **WENN** ein Paladin den Reiter „Vom Gebet“ öffnet
- **DANN** kann er zwischen „Vom Gebet“ und dem Vademecum wählen

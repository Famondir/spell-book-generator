## MODIFIED Requirements

### Requirement: Getrennte Daten je Charakter
Die App SHALL mehrere Charaktere verwalten; Buch, Einstellungen, Buchposition, Vorbereitung, Vorlagen, Nutzungsprotokoll und eigene Gebete MUST je Charakter getrennt gespeichert werden.

#### Scenario: Zweiter Charakter
- **WENN** ein zweiter Charakter angelegt und ein Zauber in sein Buch aufgenommen wird
- **DANN** bleibt das Buch des ersten Charakters unverändert

## ADDED Requirements

### Requirement: Klasse und Gottheit
Jeder Charakter SHALL eine Klasse (Magier oder Paladin) und bei göttlicher Klasse eine Gottheit haben. Charaktere ohne Klasse MUST als Magier gelten. Ein Wechsel der Klasse MUST das Buch behalten und nur Darstellung, Grade und Filter ändern.

#### Scenario: Bestehender Charakter
- **WENN** Kirran nach dem Update geladen wird
- **DANN** ist er Magier, und sein Buch sieht aus wie vorher

#### Scenario: Neuer Paladin
- **WENN** ein Charakter mit Klasse Paladin und Gottheit Iomedae angelegt wird
- **DANN** zeigt die App für ihn Paladin-Grade, Andachtsbilder und ein Brevier

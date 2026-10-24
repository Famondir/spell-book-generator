## ADDED Requirements

### Requirement: Getrennte Daten je Charakter
Die App SHALL mehrere Charaktere verwalten; Buch, Einstellungen, Buchposition, Vorbereitung, Vorlagen und Nutzungsprotokoll MUST je Charakter getrennt gespeichert werden.

#### Scenario: Zweiter Charakter
- **WENN** ein zweiter Charakter angelegt und ein Zauber in sein Buch aufgenommen wird
- **DANN** bleibt das Buch des ersten Charakters unverändert

### Requirement: Wechseln und Verwalten
Ein Umschalter in der Kopfzeile SHALL zwischen Charakteren wechseln; in den Einstellungen MUST man Charaktere anlegen, umbenennen, duplizieren und löschen können. Der letzte Charakter MUST NOT löschbar sein.

#### Scenario: Wechsel
- **WENN** im Umschalter ein anderer Charakter gewählt wird
- **DANN** zeigt die App nach dem Neuladen dessen Buch, Einstellungen und Vorbereitung

#### Scenario: Duplizieren
- **WENN** ein Charakter dupliziert wird
- **DANN** entsteht ein neuer Charakter mit Kopie von Buch, Einstellungen und Vorlagen, aber leerem Protokoll

### Requirement: Übernahme bestehender Daten
Beim ersten Start mit Charakter-Slots SHALL die App vorhandene Daten in einen ersten Charakter übernehmen, ohne etwas zu verlieren.

#### Scenario: Bestehendes Buch
- **WENN** vor dem Update ein Buch mit 377 Zaubern gespeichert war
- **DANN** enthält der erste Charakter danach dieselben 377 Zauber und dieselbe Vorbereitung

### Requirement: Export und Import je Charakter
Der Export SHALL den Charakternamen enthalten; beim Import einer Datei eines anderen Charakters MUST die App anbieten, einen neuen Charakter anzulegen.

#### Scenario: Import als neuer Charakter
- **WENN** die Exportdatei von „Mirla“ importiert wird, während „Kirran“ aktiv ist, und „neuer Charakter“ gewählt wird
- **DANN** gibt es einen Charakter „Mirla“ mit den importierten Daten, und Kirran bleibt unverändert

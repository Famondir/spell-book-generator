## MODIFIED Requirements

### Requirement: Getrennte Daten je Charakter
Die App SHALL mehrere Charaktere verwalten; Buch, Einstellungen, Buchposition, Vorbereitung, Vorlagen, Nutzungsprotokoll, eigene Gebete und Andachtsbuch (Tagebuchtexte, importierte Abendgebete, Einträge des Spielleiters) MUST je Charakter getrennt gespeichert werden.

#### Scenario: Zweiter Charakter
- **WENN** ein zweiter Charakter angelegt und ein Zauber in sein Buch aufgenommen wird
- **DANN** bleibt das Buch des ersten Charakters unverändert

#### Scenario: Tagebuch getrennt
- **WENN** beim zweiten Charakter ein Tagebucheintrag geschrieben wird
- **DANN** bleibt das Andachtsbuch des ersten Charakters unverändert

### Requirement: Wechseln und Verwalten
Ein Umschalter in der Kopfzeile SHALL zwischen Charakteren wechseln; in den Einstellungen MUST man Charaktere anlegen, umbenennen, duplizieren und löschen können. Der letzte Charakter MUST NOT löschbar sein. Beim Duplizieren MUST das Andachtsbuch wie das Protokoll leer beginnen.

#### Scenario: Wechsel
- **WENN** im Umschalter ein anderer Charakter gewählt wird
- **DANN** zeigt die App nach dem Neuladen dessen Buch, Einstellungen und Vorbereitung

#### Scenario: Duplizieren
- **WENN** ein Charakter dupliziert wird
- **DANN** entsteht ein neuer Charakter mit Kopie von Buch, Einstellungen und Vorlagen, aber leerem Protokoll und leerem Andachtsbuch

### Requirement: Klasse und Gottheit
Jeder Charakter SHALL eine Klasse (Magier oder Paladin) haben. Bei göttlicher Klasse MUST er eine Gottheit haben; bei arkaner Klasse SHALL er optional eine Schutzgottheit haben können, die nur Gebete für den Tag, Andachtsblatt und Andachtsbuch betrifft und Buch, Kreise und Grade nicht verändert. Charaktere ohne Klasse MUST als Magier gelten. Ein Wechsel der Klasse MUST das Buch behalten und nur Darstellung, Grade und Filter ändern.

#### Scenario: Bestehender Charakter
- **WENN** Kirran nach dem Update geladen wird
- **DANN** ist er Magier, und sein Buch sieht aus wie vorher

#### Scenario: Neuer Paladin
- **WENN** ein Charakter mit Klasse Paladin und Gottheit Iomedae angelegt wird
- **DANN** zeigt die App für ihn Paladin-Grade, Andachtsbilder und ein Brevier

#### Scenario: Magier mit Schutzgottheit
- **WENN** ein Magier die Schutzgottheit Nethys erhält
- **DANN** bleiben Buch und Kreise unverändert, und die App bietet Gebete für den Tag, Andachtsblatt und Andachtsbuch an

### Requirement: Export und Import je Charakter
Der Export SHALL den Charakternamen und das Andachtsbuch enthalten; beim Import einer Datei eines anderen Charakters MUST die App anbieten, einen neuen Charakter anzulegen.

#### Scenario: Import als neuer Charakter
- **WENN** die Exportdatei von „Mirla“ importiert wird, während „Kirran“ aktiv ist, und „neuer Charakter“ gewählt wird
- **DANN** gibt es einen Charakter „Mirla“ mit den importierten Daten, und Kirran bleibt unverändert

#### Scenario: Andachtsbuch im Export
- **WENN** ein Charakter mit drei Tagebucheinträgen exportiert und auf einem anderen Gerät importiert wird
- **DANN** sind dort alle drei Einträge vorhanden

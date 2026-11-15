# character-slots Specification

## Purpose
TBD - created by archiving change add-character-slots. Update Purpose after archive.
## Requirements
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

### Requirement: Übernahme bestehender Daten
Beim ersten Start mit Charakter-Slots SHALL die App vorhandene Daten in einen ersten Charakter übernehmen, ohne etwas zu verlieren.

#### Scenario: Bestehendes Buch
- **WENN** vor dem Update ein Buch mit 377 Zaubern gespeichert war
- **DANN** enthält der erste Charakter danach dieselben 377 Zauber und dieselbe Vorbereitung

### Requirement: Export und Import je Charakter
Der Export SHALL den Charakternamen, das Andachtsbuch und das Profilpaket des Charakters (sein Profil und den Vademecum-Eintrag seiner Gottheit, soweit geladen) enthalten; beim Import einer Datei eines anderen Charakters MUST die App anbieten, einen neuen Charakter anzulegen. Enthält die Datei ein Profilpaket, MUST der Import es nach den Regeln von `profile-transfer` speichern und den Charakter damit verbinden. Exportdateien ohne Profilpaket MUST weiter importierbar sein.

#### Scenario: Import als neuer Charakter
- **WENN** die Exportdatei von „Mirla“ importiert wird, während „Kirran“ aktiv ist, und „neuer Charakter“ gewählt wird
- **DANN** gibt es einen Charakter „Mirla“ mit den importierten Daten, und Kirran bleibt unverändert

#### Scenario: Andachtsbuch im Export
- **WENN** ein Charakter mit drei Tagebucheinträgen exportiert und auf einem anderen Gerät importiert wird
- **DANN** sind dort alle drei Einträge vorhanden

#### Scenario: Ganzer Charakter in einer Datei
- **WENN** Kirran am Laptop exportiert und die Datei auf der GitHub-Page ohne gespeicherte Profile importiert wird
- **DANN** gibt es dort Kirran mit seinem Buch, seinem Profil und dem Vademecum der Nethys, ohne dass eine Profildatei extra geladen wurde

#### Scenario: Alte Exportdatei
- **WENN** eine Exportdatei ohne Profilpaket importiert wird
- **DANN** verhält sich der Import wie bisher

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


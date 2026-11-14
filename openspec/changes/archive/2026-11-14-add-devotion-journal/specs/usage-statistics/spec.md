## MODIFIED Requirements

### Requirement: Verlauf
Die App SHALL alle Spieltage des aktiven Charakters zeigen, neueste zuerst, jeweils mit echtem Datum, Ingame-Datum, Anzahl vorbereiteter und gewirkter Zauber, Liste der gewirkten Zauber und aufklappbarem Ereignisprotokoll mit Uhrzeit. Hat der Charakter eine Gottheit, MUST jeder Tag einen Verweis auf seinen Eintrag im Andachtsbuch und auf den Rückschau-Export tragen.

#### Scenario: Gestriger Tag
- **WENN** gestern Magic Missile zweimal gewirkt und dann „Neuer Tag“ gewählt wurde
- **DANN** zeigt der Verlauf den gestrigen Tag mit „Magic Missile ×2“

#### Scenario: Verweis aufs Andachtsbuch
- **WENN** ein Charakter mit Gottheit im Verlauf einen Tag aufklappt
- **DANN** führt ein Verweis zum Eintrag dieses Tages im Andachtsbuch

### Requirement: Probetage und Löschen
Ein Tag SHALL sich als Probe markieren lassen; Probetage MUST NOT in die Statistik und nicht ins Andachtsbuch eingehen. Ein Tag SHALL sich nach Rückfrage löschen lassen; beim laufenden Tag MUST dabei auch das Abstreichen zurückgesetzt werden. Mit dem Tag MUST sein Tagebucheintrag gelöscht werden; dort freigegebene Einträge des Spielleiters MUST wieder versiegelt werden.

#### Scenario: Test löschen
- **WENN** der laufende Tag nur zum Ausprobieren genutzt und dann gelöscht wird
- **DANN** sind seine Ereignisse aus dem Protokoll entfernt, alle vorbereiteten Zauber wieder verfügbar und die Vorbereitung bleibt bestehen

#### Scenario: Tagebuch mitgelöscht
- **WENN** ein Tag mit Tagebucheintrag und einem dort freigegebenen Eintrag des Spielleiters gelöscht wird
- **DANN** ist der Tagebucheintrag fort, und der Eintrag des Spielleiters ist wieder versiegelt

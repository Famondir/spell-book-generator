## ADDED Requirements

### Requirement: Verlauf
Die App SHALL alle Spieltage des aktiven Charakters zeigen, neueste zuerst, jeweils mit echtem Datum, Ingame-Datum, Anzahl vorbereiteter und gewirkter Zauber, Liste der gewirkten Zauber und aufklappbarem Ereignisprotokoll mit Uhrzeit.

#### Scenario: Gestriger Tag
- **WENN** gestern Magic Missile zweimal gewirkt und dann „Neuer Tag“ gewählt wurde
- **DANN** zeigt der Verlauf den gestrigen Tag mit „Magic Missile ×2“

### Requirement: Probetage und Löschen
Ein Tag SHALL sich als Probe markieren lassen; Probetage MUST NOT in die Statistik eingehen. Ein Tag SHALL sich nach Rückfrage löschen lassen; beim laufenden Tag MUST dabei auch das Abstreichen zurückgesetzt werden.

#### Scenario: Test löschen
- **WENN** der laufende Tag nur zum Ausprobieren genutzt und dann gelöscht wird
- **DANN** sind seine Ereignisse aus dem Protokoll entfernt, alle vorbereiteten Zauber wieder verfügbar und die Vorbereitung bleibt bestehen

### Requirement: Statistik
Die Statistik SHALL über alle Tage außer Probetagen zeigen: Anzahl Spieltage, gewirkte Zauber insgesamt und je Tag, die meistgewirkten Zauber, Zauber, die oft vorbereitet aber selten gewirkt wurden, sowie gewirkte Zauber nach Grad und Schule.

#### Scenario: Meistgewirkt
- **WENN** Magic Missile an drei Tagen insgesamt siebenmal gewirkt wurde und Shield einmal
- **DANN** steht Magic Missile mit 7 vor Shield mit 1

#### Scenario: Oft vorbereitet, nie gewirkt
- **WENN** Shield an fünf Tagen vorbereitet und nie gewirkt wurde
- **DANN** erscheint Shield unter „oft vorbereitet, selten gewirkt“ mit 5 Tagen und 0 Würfen

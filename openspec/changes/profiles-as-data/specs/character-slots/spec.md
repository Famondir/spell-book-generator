## MODIFIED Requirements

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

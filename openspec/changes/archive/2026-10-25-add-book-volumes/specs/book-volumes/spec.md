## ADDED Requirements

### Requirement: Höchstseitenzahl je Band
Die Buch-Einstellungen SHALL ein Feld „Höchstens … Seiten je Band“ bieten. Leer oder 0 MUST bedeuten: ein einziger Band wie bisher. Gezählt MUST jede Buchseite eines Bandes werden (Titelseite, Vorspann, Verzeichnis, Kapitelseiten, Notizseiten, Zauberseiten), unabhängig vom Papierformat. Die Einstellung MUST je Charakter gespeichert werden wie die übrigen Buch-Einstellungen.

#### Scenario: Keine Grenze
- **WENN** das Feld leer ist
- **DANN** entsteht genau ein Band, und Buchansicht und Druck sind unverändert

#### Scenario: Grenze gesetzt
- **WENN** das Buch 814 Seiten hätte und höchstens 400 Seiten je Band eingestellt sind
- **DANN** entstehen mindestens drei Bände, und keiner hat mehr als 400 Seiten

### Requirement: Aufteilung an Kapitelgrenzen
Die Aufteilung SHALL Bände an Kapitelgrenzen (Zaubertricks, Alltagszauber, jeder Grad, fremde Gebete) beenden, in Buchreihenfolge. Sie MUST so wenige Bände wie möglich bilden und unter diesen die Aufteilung wählen, deren dickster Band am dünnsten ist (ausgeglichene Bände statt eines fast leeren letzten Bandes). Ein Kapitel, das in einen Band passt, MUST NOT auf zwei Bände verteilt werden. Nur ein Kapitel, das allein (mit Bandvorspann) die Grenze überschreitet, MUST an einer Zaubergrenze geteilt werden; ein mehrseitiger Zauber MUST NOT geteilt werden.

#### Scenario: Kapitel passt nicht mehr in den Band
- **WENN** Band I nach dem II. Grad 380 Seiten hat, das Kapitel III. Grad 90 Seiten umfasst und die Grenze 400 ist
- **DANN** endet Band I nach dem II. Grad, und Band II beginnt mit dem Kapitel III. Grad

#### Scenario: Ausgeglichen statt Rest
- **WENN** das Buch 814 Seiten hat und die Grenze 600 ist
- **DANN** entstehen zwei Bände von ungefähr gleichem Umfang (etwa 400 und 420 Seiten, je nach Kapitelgrenzen), nicht 600 und 214

#### Scenario: Kapitel größer als ein Band
- **WENN** das Kapitel VI. Grad allein 450 Seiten umfasst und die Grenze 400 ist
- **DANN** wird es an einer Zaubergrenze geteilt, der Rest beginnt im nächsten Band mit der Kapiteldoppelseite „Zauber des VI. Grades (Fortsetzung)“, und die Buchansicht zeigt einen Hinweis, dass ein Kapitel geteilt werden musste

#### Scenario: Grenze zu klein
- **WENN** die Grenze kleiner ist als der kleinste mögliche Band (Bandvorspann plus der längste einzelne Zauber)
- **DANN** zeigt die Buchansicht einen Hinweis mit der kleinsten sinnvollen Grenze, und der betroffene Band überschreitet die Grenze statt einen Zauber zu zerreißen

### Requirement: Aufbau eines Bandes
Bei mehr als einem Band SHALL jeder Band mit einer eigenen Titelseite beginnen, die Buchtitel, Besitzer, Bandnummer und den Umfang nennt (z. B. „Band II · III.–V. Grad“). Ist der Vorspann eingeschaltet, MUST jeder Band ein eigenes Verzeichnis seiner Formeln haben; Lesart der Kreise, Schichten und Lehre der Kreise MUST nur in Band I stehen.

#### Scenario: Band II aufschlagen
- **WENN** Band II die Grade III bis V enthält und der Vorspann eingeschaltet ist
- **DANN** beginnt er mit der Titelseite „Band II · III.–V. Grad“, gefolgt vom Verzeichnis der Formeln der Grade III bis V, danach folgt das Kapitel III. Grad – ohne Lesart der Kreise

#### Scenario: Vorspann aus
- **WENN** der Vorspann ausgeschaltet ist und es mehrere Bände gibt
- **DANN** trägt trotzdem jeder Band ab Band II eine Titelseite, damit die Bände unterscheidbar sind

### Requirement: Nummerierung über Bände
Die Seitenzahlen SHALL in jedem Band bei 1 beginnen. Kapitelnummern und Regelband-Nummern MUST über alle Bände durchlaufen, damit der Regelband für alle Bände gilt. Kapitellisten und Verzeichnisse MUST die Seitenzahlen im eigenen Band nennen.

#### Scenario: Regelband-Nummer in Band II
- **WENN** Fireball in Band II steht und im Gesamtbuch der 57. Zauber ist
- **DANN** trägt seine Seite „Regelband Nr. 57“, und seine Seitenzahl zählt ab der Titelseite von Band II

#### Scenario: Kapitelnummer
- **WENN** Band I mit Kapitel IV endet
- **DANN** heißt das erste Kapitel von Band II „Kapitel V“

### Requirement: Bände in der Buchansicht
Bei mehr als einem Band SHALL die Buchansicht eine Bandwahl (Band I, II, …) über der Vorschau zeigen; Vorschau und Blätterleiste MUST sich auf den gewählten Band beziehen. Die Statistik MUST Anzahl und Seitenzahl jedes Bandes nennen. Inhaltsverzeichnis und Inhaltsliste MUST zu jedem Eintrag Band und Seite nennen; ein Klick MUST zum Band und zur Seite wechseln. Der gewählte Band MUST erhalten bleiben.

#### Scenario: Zauber aus anderem Band anspringen
- **WENN** Band I angezeigt wird und in der Inhaltsliste ein Zauber aus Band II angeklickt wird
- **DANN** wechselt die Vorschau zu Band II und blättert zur Seite des Zaubers

#### Scenario: Statistik
- **WENN** das Buch in drei Bände geteilt ist
- **DANN** zeigt die Statistik z. B. „3 Bände: I 398 · II 396 · III 102 Seiten“

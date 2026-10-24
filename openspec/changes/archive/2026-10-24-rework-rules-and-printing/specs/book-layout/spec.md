## ADDED Requirements

### Requirement: Regeltext auf Abruf
Die Vorschau SHALL auf jeder Zauberseite ein (i) zeigen, das den englischen Regeltext mit Quellenkasten in einem Fenster öffnet; das Buch MUST keinen Regelanhang enthalten.

#### Scenario: Regeln nachschlagen
- **WENN** auf der Seite von Fireball das (i) angeklickt wird
- **DANN** erscheint der Regeltext von Fireball in einem Fenster

### Requirement: Regelverweise im Buch
Auf Wunsch SHALL die erste Seite eines Zaubers die Regelband-Nummer, einen QR-Code zur AoN-Seite und/oder die Quellenangabe tragen; alle drei MUST standardmäßig aus sein.

#### Scenario: QR-Code eingeschaltet
- **WENN** die Option QR-Code aktiv ist
- **DANN** trägt jede Zauberseite einen QR-Code, der auf die AoN-Seite des Zaubers (bei Alltagszaubern des Basiszaubers) führt

### Requirement: Füllseiten
Ein Zauber mit mehr als einer Seite MUST auf einer geraden (linken) Seite beginnen, solange die Einstellung „Mehrseitige Zauber beginnen links“ aktiv ist (Standard); dazu SHALL bei Bedarf eine Seite „Für Notizen“ eingefügt werden.

#### Scenario: Grad-3-Zauber auf ungerader Seite
- **WENN** Fireball auf Seite 41 beginnen würde
- **DANN** ist Seite 41 eine Notizseite und Fireball beginnt auf Seite 42

### Requirement: Blättern nach Zaubern und Doppelseiten
Die Blätterleiste SHALL neben Seitenschritten zum vorherigen und nächsten Zauber springen; im Doppelseitenmodus MUST die Vorschau Seite 1 allein rechts und danach gerade|ungerade Paare zeigen.

#### Scenario: Nächster Zauber
- **WENN** mitten in einem Zauber „nächster Zauber“ gewählt wird
- **DANN** zeigt die Vorschau die erste Seite des folgenden Zaubers

### Requirement: Akkordeon im Inhaltsverzeichnis
Die Abschnitte des Inhaltsverzeichnisses (Vorspann, Zaubertricks, Alltagszauber, Grade) SHALL einzeln auf- und zuklappbar und zu Beginn eingeklappt sein.

#### Scenario: Abschnitt öffnen
- **WENN** „III. Grad“ angeklickt wird
- **DANN** erscheinen die Zauber des 3. Grades, die anderen Abschnitte bleiben wie sie sind

### Requirement: Vorspann
Das Buch SHALL optional einen Vorspann haben: Titelblatt, Lesart mit beschriftetem Beispielkreis, Lehre der Kreise und ein Verzeichnis der Formeln mit Schnellglyphen.

#### Scenario: Vorspann aus
- **WENN** „Vorspann drucken“ ausgeschaltet ist
- **DANN** beginnt das Buch mit der ersten Formel

## REMOVED Requirements

### Requirement: Vorspann und Anhang
**Reason**: Der Regelanhang entfällt; der Vorspann bleibt unter „Vorspann“ bestehen.
**Migration**: Regeln über (i) in der Vorschau oder den separaten Regelband.

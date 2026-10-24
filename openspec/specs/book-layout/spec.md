# book-layout Specification

## Purpose
Seitenplanung des Zauberbuchs im A5-Format.
## Requirements
### Requirement: Seitenumfang
Ein Zauber des Grades n SHALL n Seiten belegen; Grad 0 und Alltagszauber eine halbe Seite (zwei pro Seite).

#### Scenario: Feuerball
- **WENN** Fireball (Grad 3) im Buch steht
- **DANN** belegt er genau drei Seiten

### Requirement: Seitenfüllung
Blöcke SHALL zwischen den Seiten eines Zaubers verschoben werden, bevor die Schrift verkleinert wird; freie Fläche MUST mit Füllblöcken auf der leersten Seite belegt werden. Alle Seiten nach der ersten MUST dieselbe Schriftgröße haben.

#### Scenario: Zu langer Text
- **WENN** Seite 3 eines Zaubers überläuft
- **DANN** wandern Blöcke auf Seite 2, und falls doch verkleinert wird, dann Seite 2 und 3 gleich

### Requirement: Randnotizen
Pro Seite MUST höchstens eine Randnotiz stehen, und kein Notiztext darf im Buch doppelt vorkommen.

#### Scenario: Ganzes Buch
- **WENN** das Buch erzeugt wird
- **DANN** hat keine Seite zwei Randnotizen

### Requirement: Blätterbare Buchvorschau
Die Buchvorschau SHALL je nach verfügbarer Breite eine oder zwei Seiten zeigen und blättern lassen (vor, zurück, Anfang, Ende, Seitenzahl); Blättern MUST um so viele Seiten weitergehen, wie angezeigt werden. Intern MUST die Vorschau alle Seiten der betroffenen Zauber setzen, damit die Seitenfüllung dem Druck entspricht.

#### Scenario: Großes Buch öffnen
- **WENN** ein Buch mit 269 Zaubern geöffnet wird
- **DANN** baut die Vorschau nur den ersten Ausschnitt auf, und die Oberfläche bleibt bedienbar

#### Scenario: Doppelseite
- **WENN** Platz für zwei Seiten ist und weitergeblättert wird
- **DANN** erscheinen die nächsten zwei Seiten

### Requirement: Inhaltsliste des Buches
Neben der Vorschau SHALL eine Liste aller Buchzauber mit Schnellglyphe, Grad, Name, Titel und Seitenzahl stehen, filterbar wie das Verzeichnis (Suche, Grad, Schule, Essenz, Herkunft) und in derselben Zeilenform. Ein Klick MUST zur Seite des Zaubers blättern; der Knopf − MUST ihn aus dem Buch entfernen.

#### Scenario: Zauber entfernen
- **WENN** beim Zauber „Grease“ − geklickt wird
- **DANN** ist Grease nicht mehr im Buch, und Liste und Seitenzahlen sind aktualisiert

#### Scenario: Springen
- **WENN** in der Liste „Fireball“ angeklickt wird
- **DANN** zeigt die Vorschau den Ausschnitt mit den Seiten von Fireball

### Requirement: Einklappbare Seitenleisten
Die Filterleiste im Verzeichnis und in der Buchansicht SHALL sich nach links einklappen lassen; das Inhaltsverzeichnis der Buchansicht SHALL rechts ein- und ausklappbar sein. Der Zustand MUST erhalten bleiben; eingeklappt MUST nur eine angedockte Lasche sichtbar bleiben, ohne dass sich der Inhalt verschiebt.

#### Scenario: Filterleiste einklappen
- **WENN** die Filterleiste eingeklappt wird
- **DANN** bleibt nur ein schmaler Streifen mit Ausklapp-Knopf, und die Vorschau nutzt die Breite

#### Scenario: Vorspann im Inhaltsverzeichnis
- **WENN** das Buch einen Vorspann hat
- **DANN** listet das Inhaltsverzeichnis Titelblatt, Einführungsseiten und Verzeichnis der Formeln mit Seitenzahl vor den Zaubern, Zaubertricks und Alltagszauber als eigene Gruppen

#### Scenario: Inhaltsverzeichnis ausklappen
- **WENN** rechts das Inhaltsverzeichnis ausgeklappt und ein Eintrag angeklickt wird
- **DANN** blättert die Vorschau zur Seite dieses Eintrags

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

### Requirement: Kapitel
Bei aktivierter Einstellung „Kapitel“ (Standard) SHALL jeder Abschnitt (Zaubertricks, Alltagszauber, jeder Grad) mit einer Doppelseite beginnen: links Kapiteltitel, Ordnungsfigur und Text zur Stufe, rechts die Formeln des Kapitels mit deutschem Titel, Regelnamen und Seitenzahl, bei langen Kapiteln über mehrere Seiten fortgesetzt. Die Kapiteldoppelseite MUST links beginnen; dazu SHALL am Ende des vorherigen Kapitels bei Bedarf eine Leerseite stehen.

#### Scenario: Kapitel III
- **WENN** das Buch Zauber des 3. Grades enthält
- **DANN** steht vor dem ersten von ihnen eine Doppelseite „Zauber des III. Grades“ mit Liste aller Formeln dieses Grades

### Requirement: Ausgleich für linke Seiten
Die Einstellung für mehrseitige Zauber SHALL drei Modi bieten: Notizseite einfügen, Umfang des nächsthöheren Grades, aus. Im Modus „nächsthöherer Grad“ MUST statt einer Notizseite der vorangehende Zauber mit ungerader Seitenzahl den Seitenaufbau des nächsthöheren Grades bekommen, wo das möglich ist.

#### Scenario: Zwei Grad-3-Zauber
- **WENN** zwei Grad-3-Zauber aufeinander folgen und der Modus „nächsthöherer Grad“ gewählt ist
- **DANN** belegt der erste vier Seiten mit dem Aufbau eines Grad-4-Zaubers, und der zweite beginnt links ohne Notizseite

### Requirement: Regeltext-Knopf oben links
Das (i) der Vorschau SHALL oben links auf der ersten Zauberseite sitzen.

#### Scenario: Mit QR-Code
- **WENN** QR-Codes eingeschaltet sind
- **DANN** liegt das (i) in der Vorschau über dem QR-Code; im Druck erscheint nur der QR-Code


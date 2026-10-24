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

### Requirement: Vorspann und Anhang
Das Buch SHALL optional einen Vorspann (Titelblatt, Lesart mit beschriftetem Beispielkreis, Lehre der Kreise, Inhaltsverzeichnis mit Schnellglyphen) und einen fließenden Regelanhang haben.

#### Scenario: Regelanhang aus
- **WENN** „Regelwerte im Druck: nicht drucken“ eingestellt ist
- **DANN** enthält das Buch keinen Regelanhang

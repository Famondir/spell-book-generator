## MODIFIED Requirements

### Requirement: Vorspann
Das Buch SHALL optional einen Vorspann haben: Titelblatt, Lesart mit beschriftetem Beispielkreis, Lehre der Kreise und ein Verzeichnis der Formeln mit Schnellglyphen. Die Schnellglyphen im Verzeichnis MUST in verkürzter Form ohne Absichtsbuchstaben stehen. Ist das Buch in Bände geteilt, MUST der vollständige Vorspann nur in Band I stehen; jeder weitere Band SHALL nur Bandtitelseite und das Verzeichnis seiner eigenen Formeln erhalten.

#### Scenario: Vorspann aus
- **WENN** „Vorspann drucken“ ausgeschaltet ist
- **DANN** beginnt das Buch mit der ersten Formel

#### Scenario: Vorspann in Band II
- **WENN** das Buch in zwei Bände geteilt und der Vorspann eingeschaltet ist
- **DANN** enthält Band II Titelseite und Verzeichnis, aber keine Lesart der Kreise

#### Scenario: Verzeichnis ohne Absichtsbuchstaben
- **WENN** das Verzeichnis der Formeln gedruckt wird
- **DANN** steht vor jeder Formel ihre Schnellglyphe ohne Absichtsbuchstaben, mit Grad, Titel, Regelnamen und Seitenzahl

### Requirement: Kapitel
Bei aktivierter Einstellung „Kapitel“ (Standard) SHALL jeder Abschnitt (Zaubertricks, Alltagszauber, jeder Grad) mit einer Doppelseite beginnen: links Kapiteltitel, Ordnungsfigur und Text zur Stufe, rechts die Formeln des Kapitels mit Schnellglyphe ohne Absichtsbuchstaben, deutschem Titel, Regelnamen und Seitenzahl, bei langen Kapiteln über mehrere Seiten fortgesetzt. Die Kapiteldoppelseite MUST links beginnen; dazu SHALL am Ende des vorherigen Kapitels bei Bedarf eine Leerseite stehen.

#### Scenario: Kapitel III
- **WENN** das Buch Zauber des 3. Grades enthält
- **DANN** steht vor dem ersten von ihnen eine Doppelseite „Zauber des III. Grades“ mit Liste aller Formeln dieses Grades

#### Scenario: Kapitelliste ohne Absichtsbuchstaben
- **WENN** die Formelliste eines Kapitels gedruckt wird
- **DANN** zeigen ihre Schnellglyphen keine Absichtsbuchstaben

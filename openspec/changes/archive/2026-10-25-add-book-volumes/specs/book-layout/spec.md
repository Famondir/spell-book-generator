## MODIFIED Requirements

### Requirement: Vorspann
Das Buch SHALL optional einen Vorspann haben: Titelblatt, Lesart mit beschriftetem Beispielkreis, Lehre der Kreise und ein Verzeichnis der Formeln mit Schnellglyphen. Ist das Buch in Bände geteilt, MUST der vollständige Vorspann nur in Band I stehen; jeder weitere Band SHALL nur Bandtitelseite und das Verzeichnis seiner eigenen Formeln erhalten.

#### Scenario: Vorspann aus
- **WENN** „Vorspann drucken“ ausgeschaltet ist
- **DANN** beginnt das Buch mit der ersten Formel

#### Scenario: Vorspann in Band II
- **WENN** das Buch in zwei Bände geteilt und der Vorspann eingeschaltet ist
- **DANN** enthält Band II Titelseite und Verzeichnis, aber keine Lesart der Kreise

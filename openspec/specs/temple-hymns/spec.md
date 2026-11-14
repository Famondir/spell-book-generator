# temple-hymns Specification

## Purpose
Choräle des Vademecums aus den Formeln der Zauber im Buch des Charakters, mit gestrichenen Silben, damit beim Singen kein Zauber entsteht; Auswahl nach Tempelschwerpunkt und Hälfte, deterministisch, mit Rahmen (Titel, Anlass, Antwort) aus der lokalen Datei.

## Requirements
### Requirement: Choräle aus Formeln
Das Kapitel „Choräle“ SHALL Choräle aus den Formeln von Zaubern im Buch des Charakters bilden, in der Formelsprache und Lautschrift des Zaubers. In jedem Vers MUST mindestens eine Schlüsselsilbe gestrichen und durch eine sichtbare Lücke ersetzt sein, damit beim Singen kein Zauber entsteht. Ein Choral MUST für denselben Zauber und dieselbe Gottheit immer gleich sein.

#### Scenario: Gestrichene Silben
- **WENN** ein Choral aus der Formel von *Speak with Dead* gebildet wird
- **DANN** fehlt in jedem Vers mindestens eine Silbe, und an ihrer Stelle steht eine Lücke

#### Scenario: Determinismus
- **WENN** das Vademecum zweimal erzeugt wird
- **DANN** sind Auswahl, Wortlaut und Lücken der Choräle gleich

### Requirement: Auswahl nach Schwerpunkt und Hälfte
Die Zauber für die Choräle SHALL bevorzugt aus den Schulen des Tempelschwerpunkts (lokale Datei) stammen. Im Wendebuch MUST jede Hälfte eigene Choräle haben; welche Schulen oder Essenzen zu welcher Hälfte gehören, MUST die lokale Datei festlegen können, sonst teilt die App nach dem Paar des Zwiespalts. Die Zahl der Choräle MUST begrenzt sein (Vorgabe aus dem Gerüst).

#### Scenario: Haus am Rande des Jenseits
- **WENN** der Schwerpunkt Nekromantie und Erkenntnis ist und das Buch solche Zauber enthält
- **DANN** stammen die Choräle überwiegend aus diesen Schulen

#### Scenario: Leeres Buch
- **WENN** das Buch des Charakters keine Zauber enthält
- **DANN** entfällt das Kapitel „Choräle“, außer die lokale Datei liefert eigene Choräle

### Requirement: Gestalt eines Chorals
Jeder Choral SHALL einen Titel, eine Zeile zum Anlass oder Gebrauch und die Verse mit Lücken tragen; eine Kopfzeile MUST den Zauber nur andeuten (Schule, Grad), nicht nennen. Melodien MUST NOT Teil dieses Changes sein.

#### Scenario: Kopfzeile
- **WENN** ein Choral aus einem Zauber des 3. Grades der Nekromantie entsteht
- **DANN** steht in der Kopfzeile „Nekromantie · III“ und nicht der Name des Zaubers


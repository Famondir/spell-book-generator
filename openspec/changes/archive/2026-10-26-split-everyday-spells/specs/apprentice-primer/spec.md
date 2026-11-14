## MODIFIED Requirements

### Requirement: Kleine Formeln als Tagesbuch
Teil „Kleine Formeln“ SHALL jeden Zaubertrick (offizieller Kanon) aus dem Buch des Charakters enthalten; die Alltagszauber des Buches MUST in einem eigenen Abschnitt „Alltagszauber“ hinter dem Anhang stehen (entfällt ohne Alltagszauber) und genauso aufgebaut sein, mit der Schnellglyphe des Zaubers unten bündig mit dem Kreis auf der Seite des Lochrands, ohne den Kreis zu verkleinern. Die Übersicht im Teil „Schnellglyphen“ MUST nur die Zaubertricks listen. Jede kleine Formel SHALL enthalten: Kreis als Ansicht des Meisters, die Formel dreimal mit wachsenden Lücken, Geste, Stoffe mit Essenzen in Teilen, Übungsleiter (mit Buch, aus dem Gedächtnis, unter Ablenkung), drei Kästchen „dreimal in Folge“ und Prüfvermerk. Enthält das Buch keine Zaubertricks, MUST eine kleine Grundauswahl erscheinen.

#### Scenario: Zaubertrick im Buch
- **WENN** „Prestidigitation“ im Buch steht
- **DANN** hat das Lehrheft eine Lektion zu Prestidigitation mit Formel in drei Durchgängen mit wachsenden Lücken

#### Scenario: Leeres Buch
- **WENN** das Buch keinen Zaubertrick enthält
- **DANN** enthält „Kleine Formeln“ die Grundauswahl (Light, Detect Magic, Prestidigitation, Mage Hand, Message, Read Magic)

#### Scenario: Alltagszauber im Buch
- **WENN** ein Alltagszauber im Buch steht
- **DANN** steht er nicht in „Kleine Formeln“, sondern auf einer eigenen Seite im Abschnitt „Alltagszauber“ hinter dem Anhang, und er fehlt in der Schnellglyphen-Übersicht

#### Scenario: Kein Alltagszauber
- **WENN** das Buch keinen Alltagszauber enthält
- **DANN** hat das Lehrheft keinen Abschnitt „Alltagszauber“

#### Scenario: Schnellglyphe am Lochrand
- **WENN** die Seite eines Alltagszaubers rechts liegt (Lochrand links)
- **DANN** steht die Schnellglyphe links, unten bündig mit dem Kreis, und der Kreis ist so groß wie bei einem Zaubertrick; auf einer linken Seite steht sie rechts

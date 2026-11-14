## MODIFIED Requirements

### Requirement: Schnellglyphen
Jeder Zauber SHALL eine einfache Schnellglyphe haben, die sich am Spieltisch in Sekunden zeichnen lässt. Sie MUST aus fünf Teilen bestehen: Kreis nach Dauer, Kurzfigur der Schule mit der Hauptessenz in der Mitte, Gestaltstrich außen oben, Gradpunkte unten und zwei Absichtsbuchstaben neben der Schulfigur. Innerhalb der Zauberliste der aktiven Klasse (mindestens der Magierliste) MUST jede Schnellglyphe nur einmal vorkommen.

#### Scenario: Verzeichnis
- **WENN** die Zauberliste angezeigt wird
- **DANN** steht neben jedem Zauber seine Schnellglyphe

#### Scenario: Kreis nach Dauer
- **WENN** zwei Zauber sich nur in der Dauerart unterscheiden (Augenblicklich, Runden, Minuten, Stunden, Tage, Permanent, Konzentration, Besonders)
- **DANN** haben ihre Schnellglyphen verschiedene Kreise, jeweils eine vereinfachte Form des Dauerrings im vollen Kreis

#### Scenario: Gestalt und Zielzahl
- **WENN** zwei Zauber sich nur in der Gestaltart oder in der Zielzahl (1, 2, 3 und mehr) unterscheiden
- **DANN** haben ihre Schnellglyphen verschiedene Gestaltstriche

#### Scenario: Absichtsbuchstaben
- **WENN** die Schnellglyphe eines Zaubers gezeichnet wird
- **DANN** stehen neben der Schulfigur die Anfangsbuchstaben von Verb und Essenzwort seiner lateinischen Kernzeile, auch wenn die Formel im Buch in einer anderen Sprache steht
- **UND** sie stehen links und rechts der Figur, bei Erkenntnis und Illusion oben und unten, bei Universalmagie in den oberen Diagonalen, ohne Figur, Gestaltstrich oder Gradpunkte zu berühren

#### Scenario: Eindeutig auf der Klassenliste
- **WENN** alle Zauber der Liste der aktiven Klasse (und die Alltagszauber) ihre Schnellglyphe erhalten
- **DANN** gibt es keine zwei Zauber mit derselben Schnellglyphe

#### Scenario: Legende
- **WENN** Legende, Vorspann oder Lehrheft die Schnellglyphe erklären
- **DANN** nennen sie alle Kreisformen, alle Gestaltstriche, die Zielzahl und die Absichtsbuchstaben

#### Scenario: Tafeln mit Vorschau
- **WENN** Vorspann oder Lehrheft die Schnellglyphe erklären
- **DANN** zeigen zwei Tafeln jede Kreisform (je Dauer) und jeden Gestaltstrich (mit Zielzahl 1, 2, 3) als kleine Vorschau mit Namen, und die Regelliste verweist auf diese Tafeln

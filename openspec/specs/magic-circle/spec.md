# magic-circle Specification

## Purpose
Klassisch-arkane Magierkreise als SVG, abgeleitet aus dem Modell der Magietheorie.
## Requirements
### Requirement: Kreisschichten
Der Kreis SHALL aus Schichten bestehen: Grundform, äußeres Band mit Text, Schwellentore (Rettungswurf), Siegelband (Zauberresistenz), Ordnungsknoten (Grad), Reichweitenringe, Zeichenring, Essenzring, Dauerring, Kernsigille, Komponenten- und Zauberzeitmarken.

#### Scenario: Grad sichtbar
- **WENN** ein Zauber des 3. Grades gezeichnet wird
- **DANN** trägt der Ordnungsring drei Knoten

### Requirement: Lesbares Band
Schwellentore MUST den Bandtext aussparen; der Text MUST ohne Unterstreichung und an Wortgrenzen gekürzt erscheinen.

#### Scenario: Tor im Band
- **WENN** ein Zauber einen Rettungswurf hat
- **DANN** wird der Bandtext an den Toren geteilt und kein Tor überdeckt Buchstaben

### Requirement: Großansicht und Export
Ein Klick auf einen Kreis SHALL ihn in einem großen Fenster zeigen, mit umschaltbarer nummerierter Beschriftung (ohne Überlappungen) und SVG-Export.

#### Scenario: SVG speichern
- **WENN** im Fenster „Als SVG speichern“ gewählt wird
- **DANN** wird eine eigenständige SVG-Datei mit eingebetteten Stilen gespeichert

### Requirement: Schnellglyphen
Jeder Zauber SHALL eine einfache Schnellglyphe haben, die sich am Spieltisch in Sekunden zeichnen lässt. Sie MUST aus fünf Teilen bestehen: Kreis nach Dauer, Kurzfigur der Schule mit der Hauptessenz in der Mitte, Gestaltstrich außen oben, Gradpunkte unten und zwei Absichtsbuchstaben neben der Schulfigur. Innerhalb der Zauberliste der aktiven Klasse (mindestens der Magierliste) MUST jede Schnellglyphe in dieser vollen Form nur einmal vorkommen. Im Verzeichnis der Formeln und in den Formellisten der Kapitel SHALL die Schnellglyphe in verkürzter Form ohne Absichtsbuchstaben stehen; dort MUST sie nicht eindeutig sein.

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
- **WENN** die Schnellglyphe eines Zaubers in voller Form gezeichnet wird
- **DANN** stehen neben der Schulfigur die Anfangsbuchstaben von Verb und Essenzwort seiner lateinischen Kernzeile, auch wenn die Formel im Buch in einer anderen Sprache steht
- **UND** sie stehen links und rechts der Figur, bei Erkenntnis und Illusion oben und unten, bei Universalmagie in den oberen Diagonalen, ohne Figur, Gestaltstrich oder Gradpunkte zu berühren

#### Scenario: Verkürzte Form im Verzeichnis
- **WENN** die Schnellglyphe im Verzeichnis der Formeln oder in der Formelliste eines Kapitels steht
- **DANN** zeigt sie Kreis, Schulfigur, Hauptessenz, Gestaltstrich und Gradpunkte, aber keine Absichtsbuchstaben
- **UND** Kreis, Figur, Striche und Punkte liegen an derselben Stelle wie in der vollen Form

#### Scenario: Volle Form außerhalb des Verzeichnisses
- **WENN** die Schnellglyphe am Zauberkopf, auf der Zauberseite, in Legende, Vorspann-Erklärung oder Lehrheft, in der Buchliste der App, in der Vorbereitung oder auf dem Tageszettel steht
- **DANN** trägt sie die Absichtsbuchstaben

#### Scenario: Eindeutig auf der Klassenliste
- **WENN** alle Zauber der Liste der aktiven Klasse (und die Alltagszauber) ihre Schnellglyphe in voller Form erhalten
- **DANN** gibt es keine zwei Zauber mit derselben Schnellglyphe

#### Scenario: Legende
- **WENN** Legende, Vorspann oder Lehrheft die Schnellglyphe erklären
- **DANN** nennen sie alle Kreisformen, alle Gestaltstriche, die Zielzahl und die Absichtsbuchstaben

#### Scenario: Tafeln mit Vorschau
- **WENN** Vorspann oder Lehrheft die Schnellglyphe erklären
- **DANN** zeigen zwei Tafeln jede Kreisform (je Dauer) und jeden Gestaltstrich (mit Zielzahl 1, 2, 3) als kleine Vorschau mit Namen, und die Regelliste verweist auf diese Tafeln

### Requirement: Mythische Schicht
Für mythisch verstärkbare Zauber SHALL eine mythische Kreisvariante (doppelter Außenring, Mythenpunkt im Kern) verfügbar sein.

#### Scenario: Mythischer Zauber
- **WENN** ein Zauber eine mythische Fassung hat
- **DANN** kann der Kreis mit mythischer Schicht gezeichnet werden

### Requirement: Band in der Formelsprache
Das Schriftband SHALL die Formel in der Umschrift ihrer Sprache tragen, in derselben Lesesprache wie die Buchseite. Die Regeln für Tore und Kürzung an Wortgrenzen MUST unverändert gelten.

#### Scenario: Fremde Formel im Band
- **WENN** die Formel eines Zaubers hethitisch ist
- **DANN** läuft das Band mit dem hethitischen Text in lateinischen Buchstaben, ohne dass ein Tor Buchstaben überdeckt


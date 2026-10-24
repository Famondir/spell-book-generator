## ADDED Requirements

### Requirement: Bleiglasfenster
Für göttliche Klassen SHALL jeder Zauber als Andachtsbild in Bleiglas erscheinen: ein spitzbogiges Lanzettfenster mit so vielen Bahnen wie der Grad des Zaubers, Scheiben mit Bleiruten und einem Bogenfeld mit dem heiligen Symbol der Gottheit. Das Bild MUST sich deutlich von den Magierkreisen unterscheiden und MUST NOT deren Glyphen verwenden.

#### Scenario: Grad bestimmt die Bahnen
- **WENN** ein Zauber des III. Grades eines Paladins gezeigt wird
- **DANN** hat sein Fenster drei Bahnen

### Requirement: Herkunft der Bildelemente
Die Grundfarben SHALL aus den heiligen Farben der Gottheit stammen, die Essenzen des Zaubers MUST als Akzentscheiben im Verhältnis ihrer Anteile erscheinen, die Hauptessenz als Medaillon in der Mitte. Schule, Wirkungsdauer und Gestalt SHALL Maßwerk, Rahmen und Ausrichtung der Scheiben bestimmen.

#### Scenario: Gleicher Zauber, andere Gottheit
- **WENN** derselbe Zauber für Iomedae und für Torag gezeichnet wird
- **DANN** haben beide Fenster dieselbe Aufteilung, aber verschiedene Grundfarben und Symbole

### Requirement: Determinismus
Das Andachtsbild MUST für denselben Zauber und dieselbe Gottheit immer gleich aussehen.

#### Scenario: Neu laden
- **WENN** die Seite neu geladen wird
- **DANN** ist das Fenster identisch

### Requirement: Symbole
Die App SHALL eine Bibliothek einfacher Motive (mindestens Schwert, Sonne, Hammer, Amboss, Flamme, Schild, Waage, Auge, Stern, Krone) haben und das heilige Symbol aus den Stichwörtern seiner Beschreibung zusammensetzen. Gibt es keinen Treffer, MUST eine Rosette erscheinen.

#### Scenario: Schwert und Sonne
- **WENN** das Symbol „Sword and sun“ lautet
- **DANN** zeigt das Bogenfeld ein Schwert vor einer Sonne

### Requirement: Speichern als SVG
Das Andachtsbild SHALL wie der Magierkreis in einem Dialog vergrößert und als SVG gespeichert werden können.

#### Scenario: Vergrößern
- **WENN** auf das Andachtsbild einer Brevierseite geklickt wird
- **DANN** öffnet sich der Dialog mit dem Bild und „Als SVG speichern“

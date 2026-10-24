# devotional-image Specification

## Purpose
TBD - created by archiving change add-paladin-prayer-book. Update Purpose after archive.
## Requirements
### Requirement: Bleiglasfenster
Für göttliche Klassen SHALL jeder Zauber als Andachtsbild in Bleiglas erscheinen: ein spitzbogiges Lanzettfenster mit so vielen Bahnen wie der Grad des Zaubers, Scheiben mit Bleiruten und einem Bogenfeld mit dem heiligen Symbol der Gottheit. Das Bild MUST sich deutlich von den Magierkreisen unterscheiden und MUST NOT deren Glyphen verwenden.

#### Scenario: Grad bestimmt die Bahnen
- **WENN** ein Zauber des III. Grades eines Paladins gezeigt wird
- **DANN** hat sein Fenster drei Bahnen

### Requirement: Herkunft der Bildelemente
Die Grundfarben SHALL aus den heiligen Farben der Gottheit stammen, die Essenzen des Zaubers MUST als Akzentscheiben im Verhältnis ihrer Anteile erscheinen, die Hauptessenz als Medaillon in der Mitte. Die Zahl der Pässe im Bogenfeld SHALL der Zahl der Schule entsprechen (Nekromantie 2, Erkenntnis 3, Bannmagie 4, Beschwörung 5, Hervorrufung 6, Verzauberung 7, Illusion 8, Universalmagie 10, Verwandlung 12), sodass jede Schule eindeutig ist. Wirkungsdauer und Gestalt SHALL Sockel und Ausrichtung der Scheiben bestimmen.

#### Scenario: Gleicher Zauber, andere Gottheit
- **WENN** derselbe Zauber für Iomedae und für Torag gezeichnet wird
- **DANN** haben beide Fenster dieselbe Aufteilung, aber verschiedene Grundfarben und Symbole

#### Scenario: Schulen unterscheidbar
- **WENN** ein Nekromantie- und ein Erkenntniszauber gezeichnet werden
- **DANN** hat das Bogenfeld zwei bzw. drei Pässe

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
Das Andachtsbild SHALL wie der Magierkreis in einem Dialog vergrößert und als SVG gespeichert werden können; der Dialog MUST eine nummerierte Beschriftung zuschalten können, deren Nummern der Legende entsprechen.

#### Scenario: Vergrößern
- **WENN** auf das Andachtsbild einer Brevierseite geklickt wird
- **DANN** öffnet sich der Dialog mit dem Bild und „Als SVG speichern“

#### Scenario: Beschriftung
- **WENN** im Dialog „Beschriftung“ gewählt wird
- **DANN** tragen Bahnen, Bogenfeld, Medaillon, Akzent- und Grundscheibe, Zellen, Sockel und (bei Rettungswurf) Bordüre rote Nummern, und die Legende erklärt sie in derselben Reihenfolge

### Requirement: Form des Medaillons
Das Medaillon SHALL Eigenschaften zeigen, die das übrige Fenster nicht trägt: Die Zahl der Blätter MUST der Reichweite folgen (persönlich: geschlossene Scheibe, Berührung 4, nah 6, mittel 8, weit 12, unbegrenzt 16 mit Strahlen), die Fassung MUST ein Vieleck mit so vielen Ecken wie Komponenten plus zwei sein (ohne Komponenten ein Kreis), die Blätter MUST bei schnellen und augenblicklichen Aktionen spitz, bei Standard-Aktionen rund und bei längeren Zeitaufwänden als zwei Blattkränze erscheinen, und Zauberresistenz MUST einen zweiten Ring um die Fassung ziehen.

#### Scenario: Berührung mit V, S, GF
- **WENN** ein Zauber mit Reichweite Berührung, Komponenten V, S, GF, Standard-Aktion und Zauberresistenz gezeichnet wird
- **DANN** hat das Medaillon vier runde Blätter in einer fünfeckigen Fassung mit zweitem Ring

#### Scenario: Persönlich und schnell
- **WENN** ein Zauber mit Reichweite persönlich als schnelle Aktion gewirkt wird
- **DANN** ist das Medaillon eine geschlossene Scheibe ohne Blätter

### Requirement: Material
Das Andachtsbild SHALL in zwei Materialien gezeichnet werden können: Bleiglas und Steinintarsie. Alle Bildelemente (Bahnen, Bogenfeld mit Pässen und Symbol, Medaillon, Akzent- und Grundsteine, Zellen, Sockel, Bordüre) MUST in beiden Materialien dieselbe Bedeutung haben. Die Steinintarsie MUST sich sichtbar unterscheiden: Giebel statt Spitzbogen, Quaderrahmen, feine Fugen statt Bleiruten, kein Durchlicht, Steinsorten mit Musterung und eigene Steine für die Essenzen.

#### Scenario: Gleicher Zauber, anderes Material
- **WENN** derselbe Zauber für dieselbe Gottheit einmal in Bleiglas und einmal in Steinintarsie gezeichnet wird
- **DANN** haben beide gleich viele Bahnen, Pässe und Medaillonblätter, aber unterschiedliche Umrisse, Fugen und Farben

#### Scenario: Bleiglas unverändert
- **WENN** ein Bleiglasfenster nach diesem Change gezeichnet wird
- **DANN** ist es identisch mit dem vorherigen Stand

### Requirement: Wahl des Materials
Jeder Charakter SHALL das Material wählen können: automatisch, Bleiglas oder Steinintarsie. Automatisch MUST Steinintarsie für Torag und für Gottheiten des Pantheons „Dwarven Deities“ ergeben, sonst Bleiglas.

#### Scenario: Torag automatisch
- **WENN** ein Paladin Torag verehrt und das Material auf automatisch steht
- **DANN** erscheinen seine Andachtsbilder als Steinintarsie

#### Scenario: Von Hand
- **WENN** ein Paladin Iomedae verehrt und Steinintarsie wählt
- **DANN** erscheinen seine Andachtsbilder als Steinintarsie in Iomedaes Farben


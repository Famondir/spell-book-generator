## MODIFIED Requirements

### Requirement: Herkunft der Bildelemente
Die Grundfarben SHALL aus den heiligen Farben der Gottheit stammen, die Essenzen des Zaubers MUST als Akzentscheiben im Verhältnis ihrer Anteile erscheinen, die Hauptessenz als Medaillon in der Mitte. Die Zahl der Pässe im Bogenfeld SHALL der Zahl der Schule entsprechen (Nekromantie 2, Erkenntnis 3, Bannmagie 4, Beschwörung 5, Hervorrufung 6, Verzauberung 7, Illusion 8, Universalmagie 10, Verwandlung 12), sodass jede Schule eindeutig ist. Wirkungsdauer und Gestalt SHALL Sockel und Ausrichtung der Scheiben bestimmen.

#### Scenario: Gleicher Zauber, andere Gottheit
- **WENN** derselbe Zauber für Iomedae und für Torag gezeichnet wird
- **DANN** haben beide Fenster dieselbe Aufteilung, aber verschiedene Grundfarben und Symbole

#### Scenario: Schulen unterscheidbar
- **WENN** ein Nekromantie- und ein Erkenntniszauber gezeichnet werden
- **DANN** hat das Bogenfeld zwei bzw. drei Pässe

### Requirement: Speichern als SVG
Das Andachtsbild SHALL wie der Magierkreis in einem Dialog vergrößert und als SVG gespeichert werden können; der Dialog MUST eine nummerierte Beschriftung zuschalten können, deren Nummern der Legende entsprechen.

#### Scenario: Vergrößern
- **WENN** auf das Andachtsbild einer Brevierseite geklickt wird
- **DANN** öffnet sich der Dialog mit dem Bild und „Als SVG speichern“

#### Scenario: Beschriftung
- **WENN** im Dialog „Beschriftung“ gewählt wird
- **DANN** tragen Bahnen, Bogenfeld, Medaillon, Akzent- und Grundscheibe, Zellen, Sockel und (bei Rettungswurf) Bordüre rote Nummern, und die Legende erklärt sie in derselben Reihenfolge

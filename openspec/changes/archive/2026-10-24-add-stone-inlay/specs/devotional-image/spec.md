## ADDED Requirements

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

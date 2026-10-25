## MODIFIED Requirements

### Requirement: Lehre der Kreise
Die App SHALL eine Legende aller Schulen, Essenzen, Zeichen, Schnellglyphen, Alchemie-Symbole und eine Affinitätstabelle der Schulen zeigen. Für arkane Klassen MUST der Reiter „Lehre“ heißen und die Unterpunkte „Lehre der Kreise“ (diese Legende) und „Lehrheft“ haben; für göttliche Klassen bleibt der Reiter „Vom Gebet“ unverändert.

#### Scenario: Ansicht öffnen
- **WENN** im Reiter „Lehre“ „Lehre der Kreise“ gewählt wird
- **DANN** erscheinen Legende und Affinitätstabelle

#### Scenario: Paladin
- **WENN** ein Paladin aktiv ist
- **DANN** heißt der Reiter „Vom Gebet“ und zeigt kein Lehrheft

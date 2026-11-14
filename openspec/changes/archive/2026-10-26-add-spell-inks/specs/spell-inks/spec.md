## ADDED Requirements

### Requirement: Tinte einer Formel
Die App SHALL zu jedem Zauber ab Grad 1 deterministisch eine Tinte erzeugen: Grundtinte, Farbstoff aus der Entsprechungsfarbe der Hauptessenz, Metallstaub aus deren Entsprechungsmetall und, wenn eine zweite Essenz mit anderem Metall vorhanden ist, eine Beimischung aus deren Metall mit einer kurzen Begründung. Farbe und Metall MUST mit den Entsprechungen übereinstimmen, die für denselben Zauber angezeigt werden, auch wenn das Profil sie überschreibt.

#### Scenario: Feuerformel
- **WENN** ein Zauber mit Hauptessenz Ignis und zweiter Essenz Aer dargestellt wird
- **DANN** nennt die Tinte Zinnober als Farbstoff, Goldstaub und Kupfer als Beimischung mit einer Begründung

#### Scenario: Gleiche Tinte bei jedem Laden
- **WENN** derselbe Zauber zweimal erzeugt wird
- **DANN** sind Farbstoff, Metall, Beimischung und Begründung beide Male gleich

#### Scenario: Profil überschreibt Entsprechung
- **WENN** das Profil für Ignis die Farbe „Karmin“ festlegt
- **DANN** nennt die Tinte den Farbstoff zu „Karmin“ aus der Profil-Tafel oder, falls keiner hinterlegt ist, „Karmin“ selbst

### Requirement: Warnvermerk bei Gift
Enthält eine Tinte einen giftigen Farbstoff oder ein giftiges Metall, SHALL ein kurzer In-Game-Warnsatz folgen.

#### Scenario: Zinnober
- **WENN** eine Tinte Zinnober enthält
- **DANN** folgt ein Satz, der eigenen Pinsel und Waschen nach der Arbeit verlangt

### Requirement: Keine Kommentare zur Tinte im Zauberbuch
Die Randnotizen der Zauberseiten MUST NOT auf die Tinte Bezug nehmen; die Zeile „Tinte“ steht ohne Kommentar.

#### Scenario: Zauberseite
- **WENN** eine Zauberseite mit Tinte und Randnotizen erscheint
- **DANN** erwähnt keine Randnotiz die Tinte

### Requirement: Keine Regelwirkung
Tinten MUST NOT Boni, Kosten, Zauberstufen oder Verweise auf Regeln nennen.

#### Scenario: Text der Tinte
- **WENN** eine beliebige Tinte erzeugt wird
- **DANN** enthält sie keine Zahlenwerte für Spielmechanik und keinen Verweis auf Regeltexte

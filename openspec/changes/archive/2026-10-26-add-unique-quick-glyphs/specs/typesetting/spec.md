## ADDED Requirements

### Requirement: Abschnitt statt Leerseite
Muss ein Teil auf einer rechten Seite beginnen und stünde davor eine Leerseite, SHALL der Satz stattdessen den letzten ganzen Abschnitt der vorangehenden fließenden Seite (mit allem, was ihm folgt) auf diese Seite setzen, sofern davor noch ein weiterer Abschnitt auf der Seite bleibt. Nur wenn das nicht geht, MUST eine Leerseite eingefügt werden.

#### Scenario: Lehrheft mit einem Alltagszauber mehr
- **WENN** Teil V des Lehrhefts eine Seite länger wird und Teil VI dadurch eine Leerseite davor bräuchte
- **DANN** steht die letzte Lektion von Teil V (z. B. „Drei Drills“) auf dieser Seite, und es gibt keine Leerseite

#### Scenario: Kein verschiebbarer Abschnitt
- **WENN** die Seite vor der Leerseite nur einen Abschnitt oder nur die Fortsetzung eines Abschnitts trägt
- **DANN** bleibt die Leerseite

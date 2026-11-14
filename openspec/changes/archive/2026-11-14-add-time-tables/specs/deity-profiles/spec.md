## ADDED Requirements

### Requirement: Farbstoffe der heiligen Farben
Jede heilige Grundfarbe einer Gottheit SHALL beim Laden einen festen Farbstoff erhalten (`app/js/deity-colors.js`: z. B. Blau als Ultramarin, Azurit, Indigo, Smalte, Waid oder Kornblumenblau), mit eigenem Farbwert und deutschem Namen; die bekanntesten Gottheiten MUST je Grundfarbe verschiedene Farbstoffe haben, alle übrigen einen nach ihrer Id. Tafel der Zeit, Andachtsbild und Vademecum MUST diese Werte nutzen; der Grundfarbname bleibt für die Steine der Intarsie erhalten. Tempelfarben aus der lokalen Datei des Vademecums MUST weiter Vorrang haben.

#### Scenario: Gleiches Blau vermieden
- **WENN** Desna, Gozreh, Pharasma und Sarenrae Blau als heilige Farbe haben
- **DANN** tragen sie überall vier verschiedene Blautöne mit eigenen Namen

#### Scenario: Tempelfarben
- **WENN** die lokale Datei des Vademecums für eine Gottheit eigene Tempelfarben angibt
- **DANN** setzt das Vademecum diese Töne statt der Farbstoffe aus den Gottheitsdaten

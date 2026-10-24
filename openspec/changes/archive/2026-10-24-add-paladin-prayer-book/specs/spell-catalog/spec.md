## MODIFIED Requirements

### Requirement: Suche und Filter
Das Verzeichnis SHALL nach Name, Titel und Essenz durchsuchbar sein und nach Grad, Schule, Essenz, Buchzugehörigkeit und Herkunft (Regelwerk/Alltagszauber) filtern. Optional MUST es sich auf die Zauberliste der Klasse des aktiven Charakters beschränken lassen; Grade MUST nach dieser Klasse angezeigt und gefiltert werden. Alltagszauber SHALL nur bei Magiern erscheinen.

#### Scenario: Nur Alltagszauber
- **WENN** der Filter „Nur Alltagszauber“ gewählt ist
- **DANN** zeigt die Liste ausschließlich Alltagszauber

#### Scenario: Paladinliste
- **WENN** ein Paladin aktiv ist und „nur Klassenliste“ gilt
- **DANN** zeigt das Verzeichnis 291 Zauber mit Graden I bis IV

### Requirement: Zauberansicht
Die Detailansicht SHALL den Zauber als Seiten der Tradition des aktiven Charakters zeigen (Magier: Buchseiten mit Kreis; Paladin: Brevierseite mit Andachtsbild), die englischen Regelwerte mit Quellenkasten, und bei Magiern einen Schalter „Ausführliche Ansicht“ für die Langfassung (~10 Seiten) bieten.

#### Scenario: Quellenkasten
- **WENN** ein Regelzauber angezeigt wird
- **DANN** steht unter dem Regeltext ein Kasten mit Quelle und OGL-Hinweis

#### Scenario: Paladin sieht Brevierseite
- **WENN** ein Paladin aktiv ist und Bless Weapon gewählt wird
- **DANN** zeigt die Detailansicht die Brevierseite mit Andachtsbild statt der Kreisseiten

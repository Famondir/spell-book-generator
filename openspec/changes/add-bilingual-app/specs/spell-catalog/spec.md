## ADDED Requirements

### Requirement: Zweisprachige Suche
Die Suche SHALL englische Zaubernamen und, sobald vorhanden, deutsche Namen (deutsche Regeldaten, Alltagszauber) finden. Die Liste MUST den Namen in der Regelsprache zeigen und den anderen klein daneben; Filterbegriffe (Schulen, Klassen, Grade) MUST in der Oberflächensprache erscheinen. Import und Export MUST weiter englische Namen verwenden.

#### Scenario: Suche nach deutschem Namen
- **WENN** deutsche Regeldaten vorliegen und „Feuerball“ gesucht wird
- **DANN** erscheint Fireball in der Liste

#### Scenario: Export bleibt englisch
- **WENN** mit `rulesLang = de` exportiert wird
- **DANN** enthält die Datei die englischen Zaubernamen

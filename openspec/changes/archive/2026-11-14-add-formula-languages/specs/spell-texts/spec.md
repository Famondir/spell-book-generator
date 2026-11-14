## ADDED Requirements

### Requirement: Formel in der Sprache der Herkunft
Kernzeile, Formelzeilen, Schlussformel und Langformel SHALL in der Sprache der Station des Zaubers entstehen. Titel, Beiname, Essenz- und Schulnamen sowie Theorie MUST lateinisch bzw. in der Lesesprache bleiben. Zeilenzahl und Aufbau MUST unabhängig von der Sprache sein.

#### Scenario: Fremde Station
- **WENN** ein Zauber des 3. Grades aus einer Station mit Akkadisch stammt
- **DANN** hat seine Formel wie bisher vier Zeilen, alle akkadisch in Umschrift, und der Titel bleibt lateinisch

### Requirement: Brückennotizen
Randnotizen SHALL gelegentlich ein Wort aus der Brückentabelle der Formelsprache mit dem lateinischen Fachwort verbinden. Brückennotizen MUST nur bei Zaubern erscheinen, deren Sprache nicht Latein ist, und MUST die Regel „höchstens eine Randnotiz je Seite, keine doppelt“ einhalten. Ihr Wortlaut ist neutral; das Profil kann eigene Vorlagen liefern.

#### Scenario: Brücke
- **WENN** ein Zauber mit Ignis als Hauptessenz aus einer Station mit Sprache mit Brückeneintrag für Ignis stammt
- **DANN** kann seine Randnotiz das fremde Wort neben „Ignis“ stellen

## ADDED Requirements

### Requirement: Regeltext und Beschriftungen nach Sprache
Regeltext auf Abruf, Regelband und Regelverweise SHALL in der Regelsprache erscheinen; feste Beschriftungen des Buches (Kolumnentitel, Kapitel, Vorspann, Füllseiten, Abschnittsüberschriften) SHALL in der Buchsprache erscheinen.

#### Scenario: Gemischte Sprachen
- **WENN** `bookLang = de` und `rulesLang = en` gelten
- **DANN** sind Kapitel und Abschnitte deutsch, und der Regeltext-Knopf zeigt den englischen Regeltext

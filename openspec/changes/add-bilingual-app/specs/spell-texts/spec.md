## ADDED Requirements

### Requirement: Texte in der Buchsprache
Der Textbaukasten SHALL alle generierten Texte eines Zaubers (Titel, Beiname, Zusammenfassung, Formelbeschreibung, Theorie, Gesten, Schritte, Fehlschläge, Aufbau, Randnotizen) in der gewählten Buchsprache erzeugen. Handgeschriebene Texte SHALL je Sprache angegeben werden können; ohne Angabe für die Buchsprache MUST der generierte Text dieser Sprache erscheinen.

#### Scenario: Englisches Zauberbuch
- **WENN** `bookLang = en` gilt und das Buch gesetzt wird
- **DANN** sind alle In-Game-Texte englisch, und der lateinische Formeltext ist derselbe wie im deutschen Buch

#### Scenario: Handgeschriebener Text nur deutsch
- **WENN** ein handgeschriebener Titel nur deutsch vorliegt und `bookLang = en` gilt
- **DANN** erscheint der generierte englische Titel

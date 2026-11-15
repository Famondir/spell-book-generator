## ADDED Requirements

### Requirement: Sprache und Maßeinheit
Der Einstellungsdialog SHALL einen Abschnitt „Sprache“ mit Oberflächensprache, Buchsprache, Regelsprache und Maßeinheit enthalten. Ein Wechsel der Oberflächensprache MUST nach „Fertig“ ohne Datenverlust wirken (Neuladen erlaubt); ein Wechsel von Buch- oder Regelsprache MUST Vorschau und Druck neu setzen. Bei `rulesLang = de` ohne deutsche Regeldaten MUST ein Hinweis erscheinen.

#### Scenario: Oberfläche umstellen
- **WENN** im Abschnitt „Sprache“ die Oberfläche auf Englisch gestellt und „Fertig“ geklickt wird
- **DANN** sind alle Beschriftungen englisch, und Buch, Auswahl und Einstellungen sind unverändert

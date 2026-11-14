## ADDED Requirements

### Requirement: Ausgerichtete Wortlisten
Eine ausgerichtete Formelsprache SHALL je Schule genauso viele Verben und je Essenz genauso viele Essenzwörter haben wie das lateinische Lexikon. Das Wort auf Platz i MUST in der Bedeutung dem lateinischen Wort auf Platz i entsprechen; ein bedeutungsnahes Wort oder eine Umschreibung ist erlaubt, wo die Sprache kein genaues Wort belegt. Alle mitgelieferten Formelsprachen MUST ausgerichtet sein. Lokale Lexika dürfen unausgerichtet bleiben.

#### Scenario: Länge wie Latein
- **WENN** das Prüfwerkzeug eine mitgelieferte Sprache prüft, deren Verbliste für Hervorrufung kürzer ist als die lateinische
- **DANN** meldet es die Liste als Fehler

#### Scenario: Lokales Lexikon ohne Ausrichtung
- **WENN** ein lokales Lexikon eine Essenzliste mit drei Wörtern hat
- **DANN** meldet das Prüfwerkzeug die Sprache als nicht ausgerichtet, ohne Fehlercode, und ihre Zauber ziehen die Kernzeile frei

### Requirement: Eigener Anlaut je Liste
In jeder ausgerichteten Formelsprache SHALL jedes Verb einer Schule und jedes Wort einer Essenz einen Anlaut haben, den kein anderes Wort derselben Liste hat. Maßgeblich ist der Anlaut in der Originalschrift der Sprache, nicht in der deutschen oder englischen Umschrift. Für Sprachen ohne eigene Schrift gilt die wissenschaftliche Umschrift des Lexikons.

#### Scenario: Umschrift verwischt nicht
- **WENN** zwei Wörter einer Liste in der Originalschrift mit š und s beginnen
- **DANN** gelten ihre Anlaute als verschieden, obwohl beide in der deutschen Umschrift mit S beginnen

#### Scenario: Doppelter Anlaut
- **WENN** zwei Essenzwörter derselben Liste einer ausgerichteten Sprache mit demselben Zeichen beginnen
- **DANN** meldet das Prüfwerkzeug einen Fehler

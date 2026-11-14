## ADDED Requirements

### Requirement: Kernzeile als Absicht
Die erste Formelzeile (Kernzeile „Verb Essenzwort, Gestalt!“) SHALL die Absicht der Formel tragen. Innerhalb der Zauberliste der aktiven Klasse MUST die Formelerzeugung Verb und Essenzwort der lateinischen Kernzeile so wählen, dass Zauber mit sonst gleicher Schnellglyphe verschiedene Buchstabenpaare erhalten. Die Wahl MUST deterministisch sein; die übrigen Formelzeilen MUST davon unberührt bleiben.

#### Scenario: Gleiche Struktur, andere Absicht
- **WENN** zwei Magierzauber in Schule, Hauptessenz, Grad, Dauer, Gestalt und Zielzahl übereinstimmen
- **DANN** beginnen Verb oder Essenzwort ihrer lateinischen Kernzeilen mit verschiedenen Buchstaben

#### Scenario: Übrige Zeilen stabil
- **WENN** die Kernzeile eines Zaubers wegen einer Kollision neu gewählt wird
- **DANN** sind alle weiteren Zeilen seiner Formel, das Schriftband nach der Kernzeile und die Antworten der Langformel dieselben wie ohne Neuwahl

#### Scenario: Wiederholbar
- **WENN** die App zweimal mit demselben Datenbestand und derselben Klasse geladen wird
- **DANN** hat jeder Zauber dieselbe Kernzeile

### Requirement: Anfangsbuchstaben im lateinischen Wortschatz
Im lateinischen Formellexikon SHALL jedes Verb einer Schule und jedes Wort einer Essenz einen Anfangsbuchstaben haben, den kein anderes Wort derselben Liste hat.

#### Scenario: Prüfwerkzeug
- **WENN** das Prüfwerkzeug für Schnellglyphen läuft
- **DANN** meldet es jede Schul- oder Essenzliste mit doppeltem Anfangsbuchstaben als Fehler

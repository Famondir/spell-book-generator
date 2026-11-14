## ADDED Requirements

### Requirement: Andachtsblatt je Spieltag
Die App SHALL für jeden Spieltag eines Charakters mit Gottheit ein Andachtsblatt im Format A5 erzeugen. Die Vorderseite trägt den Morgen (Ingame-Datum, Festtag falls vorhanden, Andacht, Feld „zum Abschluss gewirkt“), die Rückseite den Abend (Protokoll falls im Profil gewünscht, Tagebuch). Von den Gebeten in der festen Form SHALL das Blatt nur die Anrufung (Abend: mit einem Gegensatzpaar passend zum Doppelvers des Morgens) und einen Festtag tragen, wenn die Andacht ein Formelfragment zeigt; ohne Fragment steht das Morgengebet ganz auf der Vorderseite. Das ganze Gebet MUST zum Lesen am Tisch (Reiter „Heute“) erreichbar bleiben. Das Blatt MUST deterministisch je Spieltag sein.

#### Scenario: Blatt des Tages
- **WENN** für den laufenden Spieltag das Andachtsblatt geöffnet wird
- **DANN** zeigt die App Vorder- und Rückseite mit dem Ingame-Datum des Tages

#### Scenario: Protokoll
- **WENN** das Profil `devotion.log` setzt
- **DANN** steht auf der Rückseite unter „Protokoll“ eine Tabelle mit Zahlen des Tages (vorbereitet, gewirkt, Auslastung, Formeln mit Anzahl, ungenutzt, Bruchstück, Abschluss); ohne die Einstellung fehlt sie

#### Scenario: Ohne Gottheit
- **WENN** der Charakter keine Gottheit hat
- **DANN** bietet die App kein Andachtsblatt an

### Requirement: Formelfragment
Ist im Profil die Andachtsform „Formelfragment“ gewählt, SHALL die Andacht auf der Vorderseite ein abgebrochenes Fragment eines Zaubers aus dem Buch des Charakters zeigen: Titel, die Kernzeile der Formel und höchstens eine weitere Zeile, die mitten im Wort oder nach einem Gedankenstrich abbricht, dazu ein unvollständiger Kreis (Kernsiegel und Essenzring, die übrigen Ringe fehlen oder sind nur angesetzt), groß genug, dass man die Glyphen ohne Lupe erkennt. Ein vollständiger Zauber MUST NOT auf dem Blatt stehen. Die Wahl des Zaubers MUST deterministisch je Spieltag sein und Zauber bevorzugen, die in den letzten Tagen nicht gewählt wurden.

#### Scenario: Fragment
- **WENN** das Andachtsblatt eines Tages mit Andachtsform „Formelfragment“ erzeugt wird
- **DANN** steht darauf ein Zauber aus dem Buch mit abgebrochener Formel und unvollständigem Kreis, ohne Wirkungsring, Weitenringe und Schriftband

#### Scenario: Keine Wiederholung
- **WENN** an sieben aufeinanderfolgenden Spieltagen Andachtsblätter erzeugt werden und das Buch mehr als sieben Zauber enthält
- **DANN** zeigen sie sieben verschiedene Zauber

#### Scenario: Andachtsform Gebet
- **WENN** das Profil keine Andachtsform festlegt
- **DANN** besteht die Andacht nur aus Gebetszeilen, ohne Fragment und ohne Kreis

### Requirement: Druck für den Ringordner
Das Andachtsblatt SHALL einzeln und als Folge mehrerer Tage druckbar sein, immer in A5 unabhängig vom eingestellten Buchformat, beidseitig (Vorderseite Morgen, Rückseite Abend) mit einem Lochrand von mindestens 12 mm, vorn links und hinten rechts.

#### Scenario: Einzelblatt drucken
- **WENN** „Andachtsblatt drucken“ für den laufenden Tag gewählt wird
- **DANN** zeigt der Druckdialog zwei A5-Seiten, die erste mit Lochrand links, die zweite mit Lochrand rechts

#### Scenario: Leere Rückseite vor der Rückschau
- **WENN** ein Blatt gedruckt wird, bevor das Abendgebet importiert oder geschrieben wurde
- **DANN** trägt die Rückseite die Anrufung des Abendgebets und linierte Felder für das Tagebuch

## ADDED Requirements

### Requirement: Sprachmodul
Jede Formelsprache SHALL als eigenes Modul vorliegen, bestehend aus Lexikon (Imperative je Schule, Wörter je Essenz, Gestalt, Weite, Dauer, Rettung, Ordnungszahlen 1–9, Bindewörter, Schlussformeln, Antworten der Langformel), Satzmustern und Brückentabelle. Die Formel MUST allein aus Modell, Seed und Modul entstehen; der Generator MUST NOT sprachspezifische Wörter enthalten.

#### Scenario: Latein unverändert
- **WENN** das neutrale Profil aktiv ist und das Buch erzeugt wird
- **DANN** sind alle Formeln, Langformeln und Schriftbänder Zeichen für Zeichen gleich wie vor dem Change

#### Scenario: Satzmuster
- **WENN** eine Sprache mit Verb am Satzende gewählt ist
- **DANN** steht in der Kernzeile das Verb hinter Essenzwort und Gestalt

### Requirement: Lautschrift und Umschrift
Lexika außer Latein SHALL ihre Wörter in einer einfachen eigenen Lautschrift speichern. Die Ausgabe MUST sie je Lesesprache ausschreiben (deutsch: `sh`→„sch“, `ch`→„tsch“, `j`→„dsch“, `kh`→„ch“, `y`→„j“, `v`→„w“; englisch weitgehend unverändert), sodass man ohne Kenntnis der Ausspracheregeln vorlesen kann. Latein MUST seine klassische Schreibung behalten. Formeln MUST NOT andere Schriften als die lateinische verwenden.

#### Scenario: Deutsch und Englisch
- **WENN** ein Lexikonwort `dʒvala` lautet
- **DANN** erscheint es bei deutscher Lesesprache als „dschwala“ und bei englischer als „jvala“

#### Scenario: Latein
- **WENN** eine lateinische Formel bei deutscher Lesesprache erscheint
- **DANN** bleibt „Vincula“ unverändert und wird nicht zu „Winkula“

### Requirement: Mitgelieferte Leihsprachen
Das Repository SHALL neben Latein folgende Lexika enthalten: Hethitisch, Mittelägyptisch, Akkadisch, Sumerisch, Altirisch, archaisches Griechisch, Urindogermanisch, Mittelkymrisch, eine technische Kunstsprache und eine Klangsprache mit Bantu-Lautbild. Jedes Lexikon MUST irdisch und setting-neutral benannt sein und MUST NOT Wortlisten geschützter Kunstsprachen enthalten. Die Lexika SHALL vereinfacht sein; je Sprache trägt ein Kopfkommentar Sprachstufe und Vereinfachungen.

#### Scenario: Keine Golarion-Namen
- **WENN** die eingecheckten Lexika durchsucht werden
- **DANN** kommt kein Setting-Eigenname vor (z. B. keine Sprach- oder Ländernamen aus Golarion)

#### Scenario: Vollständiges Lexikon
- **WENN** ein Zauber jeder Schule, mit jeder Essenz und jeder Gestalt in einer mitgelieferten Sprache erzeugt wird
- **DANN** enthält die Formel kein lateinisches Ersatzwort und keinen leeren Baustein

### Requirement: Lokale Lexika
Zusätzliche Lexika SHALL als gitignorierte Dateien `data/formula-lang/*.local.js` geladen werden können; fehlen sie, MUST die App ohne Fehler laufen, und Zauber mit dieser Sprache fallen auf Latein zurück.

#### Scenario: Fehlendes lokales Lexikon
- **WENN** das Profil einer Station eine Sprache zuweist, deren lokales Lexikon fehlt
- **DANN** erscheint die Formel lateinisch, und die Konsole meldet die fehlende Sprache einmal

### Requirement: Sprachfamilien
Jedes Lexikon SHALL seine Sprachfamilie angeben (z. B. indogermanisch, semitisch, für sich). Zwei Sprachen derselben Familie gelten als verwandt.

#### Scenario: Verwandt
- **WENN** Latein und Hethitisch verglichen werden
- **DANN** gelten sie als verwandt, Latein und Akkadisch nicht

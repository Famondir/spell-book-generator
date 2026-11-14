# formula-scripts Specification

## Purpose
Band und Absichtszeichen der Zauberkreise in der Originalschrift ihrer Formelsprache (Keilschrift, Hieroglyphen, Griechisch, Ogham, Ursprache-Schrift), wahlweise in Umschrift (Lautschrift im Band, Anlaute in der Umschrift der Gelehrten), eindeutig nach Aussehen.
## Requirements
### Requirement: Schrift je Formelsprache
Jede Formelsprache SHALL eine Schrift haben: Keilschrift für Hethitisch, Akkadisch und Sumerisch, Hieroglyphen für Mittelägyptisch, das griechische Alphabet für Griechisch, Ogham für Altirisch, die Ursprache-Schrift für Urindogermanisch und Lateinschrift für Latein, Mittelkymrisch, Bantu-Lautbild und Technik. Ein lokales Lexikon ohne Angabe MUST Lateinschrift verwenden.

#### Scenario: Lokales Lexikon
- **WENN** ein lokales Lexikon keine Schrift angibt
- **DANN** erscheinen Band und Absichtszeichen seiner Zauber in Lateinschrift wie bisher

### Requirement: Übertragung aus der Lautschrift
Die Übertragung SHALL jede Formelzeile aus der Lautschrift des Lexikons in die Schrift der Sprache setzen, deterministisch und unabhängig von der Lesesprache des Buches. Für Keilschrift MUST sie die Wörter silbisch in CV-, VC- und CVC-Zeichen zerlegen. Für Hieroglyphen MUST sie Einkonsonantenzeichen verwenden, außer ein Wort hat im Lexikon eine feste Schreibung. Für Griechisch und Ogham MUST sie Buchstabe für Buchstabe übertragen.

#### Scenario: Keilschrift
- **WENN** die Kernzeile eines Zaubers auf Hethitisch das Verb „pakhsh“ enthält
- **DANN** steht im Band die Zeichenfolge pa-aḫ-ši in Keilschrift

#### Scenario: Lesesprache egal
- **WENN** dasselbe Buch einmal mit deutscher und einmal mit englischer Lesesprache erzeugt wird
- **DANN** trägt das Band beide Male dieselben Zeichen

#### Scenario: Unbekannte Silbe
- **WENN** eine Lautschriftfolge keine Entsprechung in der Zeichentabelle hat
- **DANN** meldet das Prüfwerkzeug Sprache, Wort und Silbe als Fehler

### Requirement: Band in Originalschrift
Das Schriftband des Zauberkreises SHALL die Formel in der Schrift ihrer Sprache tragen. Der Formeltext auf der Seite MUST in Lautschrift bleiben. Die Regeln für Tore, Lücken und Kürzung an Wortgrenzen MUST für jede Schrift gelten, und die Laufweite MUST zur Schrift passen, sodass das Band weder überläuft noch große Lücken lässt.

#### Scenario: Hethitischer Zauber
- **WENN** ein Zauber in Kirrans Buch auf Hethitisch steht und einen Rettungswurf hat
- **DANN** läuft sein Band in Keilschrift, an den Toren geteilt, ohne dass ein Tor ein Zeichen überdeckt, und unter der Überschrift steht die Formel weiter in Lautschrift

#### Scenario: Ursprache
- **WENN** ein Zauber auf Urindogermanisch steht
- **DANN** trägt sein Band die Zeichen der Ursprache-Schrift entlang des Bogens, ohne Schriftdatei

### Requirement: Absichtszeichen in Originalschrift
Neben der Schulfigur der Schnellglyphe SHALL das Anlautzeichen von Verb und Essenzwort der gedruckten Kernzeile stehen, in der Schrift ihrer Sprache: bei Keilschrift das erste Zeichen des Wortes, bei Hieroglyphen das erste Einkonsonantenzeichen, bei Griechisch ein Kleinbuchstabe, bei Ogham und Ursprache das Zeichen des Anlauts, bei Lateinschrift ein Großbuchstabe.

#### Scenario: Ablesbar
- **WENN** ein griechischer Zauber die Kernzeile „Phlege pur, …“ trägt
- **DANN** stehen in seiner Schnellglyphe φ und π

### Requirement: Eindeutig nach Aussehen
Auf der Zauberliste der aktiven Klasse, einschließlich der Alltagszauber, MUST keine zwei Zauber Schnellglyphen haben, die gleich aussehen. Absichtszeichen gelten als gleich, wenn sie dasselbe Zeichen sind oder in einer Verwechslungstabelle als gleich aussehend stehen (etwa griechisch ο und lateinisch O). Die Kernzeilenwahl MUST das schon beim Vergeben der Plätze berücksichtigen.

#### Scenario: Zwei Sprachen in Lateinschrift
- **WENN** ein lateinischer und ein Bantu-Zauber in Schule, Hauptessenz, Grad, Dauer, Gestalt und Zielzahl übereinstimmen
- **DANN** unterscheiden sich ihre Absichtszeichen

#### Scenario: Prüfwerkzeug
- **WENN** das Prüfwerkzeug für Schnellglyphen mit Profil läuft
- **DANN** meldet es keine zwei Zauber einer Klassenliste mit gleich aussehender Schnellglyphe

### Requirement: Schriftdateien
Die App SHALL die Schriften für Keilschrift, Hieroglyphen, Ogham und Griechisch aus `app/fonts/` laden, gekürzt auf die Zeichen, die die Übertragung aller mitgelieferten Lexika benutzt. Ein Werkzeug MUST die gekürzten Dateien aus den Originalschriften neu erzeugen können. Jede Schrift MUST mit Lizenz in `app/fonts/README.txt` stehen.

#### Scenario: Zeichen fehlt
- **WENN** ein Lexikon geändert wird und ein Wort ein Zeichen braucht, das in der gekürzten Schrift fehlt
- **DANN** meldet das Prüfwerkzeug das Zeichen, bis die Schriften neu gekürzt sind

### Requirement: Erklärung der Absichtszeichen
Erklärsatz zur Schnellglyphe, Legende, Lehrheft und Brückennotiz SHALL die Absichtszeichen als Anlaute der gedruckten Kernzeile in ihrer Schrift erklären. Die Fachzeile MUST bei fremdsprachigen Zaubern als lateinische Fachnotation erhalten bleiben, aber nicht mehr als Quelle der Glyphenzeichen genannt werden.

#### Scenario: Erklärsatz
- **WENN** die Zauberseite eines akkadischen Zaubers angezeigt wird
- **DANN** nennt der Erklärsatz zur Schnellglyphe die beiden Keilschriftzeichen und sagt, dass sie aus der Kernzeile stammen

### Requirement: Export mit Schrift
Der SVG-Export eines Kreises SHALL die für sein Band benutzte Schrift einbetten, damit die Datei ohne die App gleich aussieht.

#### Scenario: Ägyptischer Kreis
- **WENN** der Kreis eines ägyptischen Zaubers als SVG gespeichert und ohne die App geöffnet wird
- **DANN** zeigt das Band Hieroglyphen statt Kästchen

### Requirement: Umschalten auf Umschrift
Die Einstellungen SHALL eine Wahl zwischen Originalschrift und Umschrift für Band und Absichtszeichen bieten, Vorgabe Originalschrift. Ein Schnellschalter MUST in der Buchleiste von Buch und Lehrheft links neben den Druckknöpfen stehen und MUST fehlen, wenn kein Zauber der Klasse eine Sprache mit eigener Schrift hat. In Umschrift MUST das Band die Lautschrift tragen und das Absichtszeichen die wissenschaftliche Umschrift des Anlauts (etwa Š, Ḫ, Ḏ). Die Kernzeilenwahl MUST in beiden Fassungen eindeutige Schnellglyphen ergeben und darf nicht von der gewählten Fassung abhängen. Beim Zurückschalten MUST die zuletzt gesetzte Fassung aus dem Speicher kommen, ohne Neusatz.

#### Scenario: Schalter
- **WENN** im Buch eines Charakters mit hethitischen Zaubern auf Umschrift geschaltet wird
- **DANN** zeigen Bänder, Schnellglyphen und Erklärsätze Lautschrift und Umschrift, und die Kernzeilen bleiben dieselben

#### Scenario: Eindeutig in beiden Fassungen
- **WENN** das Prüfwerkzeug für Schnellglyphen mit Profil läuft
- **DANN** meldet es in keiner der beiden Fassungen zwei gleich aussehende Schnellglyphen

### Requirement: Absichtszeichen eingepasst
Jedes Absichtszeichen SHALL in die Lücke zwischen Schulfigur und Ring passen, ohne beide zu berühren. Breite Zeichen MUST nach ihrer gemessenen Breite verkleinert und unterhalb einer Mindestgröße schmaler gezogen werden. Ogham-Zeichen MUST an den seitlichen Plätzen senkrecht stehen, von unten nach oben lesend wie auf den Steinen, mittig in der Lücke; oben und unten bleiben sie waagrecht.

#### Scenario: Breites Keilschriftzeichen
- **WENN** ein Absichtszeichen dreimal so breit wie hoch ist
- **DANN** berührt es in der Schnellglyphe weder Figur noch Ring

#### Scenario: Ogham
- **WENN** ein altirischer Verzauberungszauber seine Schnellglyphe zeigt
- **DANN** stehen beide Ogham-Zeichen senkrecht neben der Spirale, frei von Spirale und Ring

### Requirement: Druck mit eigenen Kennungen
Druck und Großansicht eines Kreises SHALL eigene Kennungen für Pfade und Verläufe verwenden, damit das Band dem Pfad des gedruckten Kreises folgt und nicht dem der verborgenen Vorschau.

#### Scenario: Nur diesen Zauber drucken
- **WENN** auf einer Zauberseite „nur diesen Zauber drucken“ gewählt wird
- **DANN** kommt keine Kennung im Dokument doppelt vor, und jedes Band verweist auf einen Pfad im Druckbereich


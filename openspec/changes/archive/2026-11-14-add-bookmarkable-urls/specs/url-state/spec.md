## ADDED Requirements

### Requirement: Adresse beschreibt den sichtbaren Ort
Die App SHALL den sichtbaren Ort als Hash in der Adresse führen, in der Form `#<ansicht>[/<segment>…]` mit den englischen Ansichtsnamen `browse`, `book`, `prepare` und `theory`. Segmente MUST durch `/` getrennt sein; Zauber MUST über ihre Zauber-ID (Slug) bezeichnet werden. Das Verzeichnis ohne Zauber MAY als leere Adresse erscheinen. Die Adresse MUST über `file://` und über GitHub Pages gleich funktionieren und darf keine Server-Pfade benötigen. Die aktive Figur und die Druckvorschau MUST NOT in der Adresse stehen.

#### Scenario: Zauber im Verzeichnis
- **WENN** im Verzeichnis „Fireball“ ausgewählt wird
- **DANN** lautet die Adresse `…/index.html#browse/fireball`

#### Scenario: Reiter ohne Ziel
- **WENN** der Reiter „Heute vorbereitet“ gewählt wird
- **DANN** lautet die Adresse `…#prepare`

#### Scenario: Lokal und online gleich
- **WENN** dasselbe Lesezeichen-Suffix `#book/fireball` einmal an `file:///…/index.html` und einmal an die GitHub-Pages-Adresse gehängt wird
- **DANN** öffnen beide das Buch bei Fireball (sofern Fireball im jeweiligen Buch steht)

### Requirement: Verzeichnis-Zauber aus der Adresse
Beim Laden mit `#browse/<id>` SHALL die App den Zauber `<id>` im Verzeichnis auswählen und anzeigen. Ist die ID unbekannt, MUST die App wie ohne Adresse starten und die Adresse auf den tatsächlich gewählten Zauber berichtigen.

#### Scenario: Neuladen behält den Zauber
- **WENN** „Magic Missile“ ausgewählt ist und die Seite neu geladen wird
- **DANN** ist wieder „Magic Missile“ ausgewählt, nicht Fireball

#### Scenario: Unbekannte ID
- **WENN** die Adresse `#browse/gibt-es-nicht` geöffnet wird
- **DANN** zeigt das Verzeichnis den Standardzauber, und die Adresse nennt dessen ID

### Requirement: Buch-Position als Zauber
Im Buch SHALL die Adresse den Zauber nennen, dessen Seite gerade vorn aufgeschlagen ist (`#book/<id>`): maßgeblich ist die erste sichtbare Seite, die zu einem Zauber gehört. Zeigt die Ansicht nur Seiten ohne Zauber (Vorspann, Kapitelseiten, Füllseiten), MUST die Adresse `#book` lauten. Beim Laden mit `#book/<id>` MUST die App den Band wählen, in dem der Zauber steht, und zu seiner ersten Seite blättern. Steht der Zauber nicht im Buch der aktiven Figur, MUST die App ihn im Verzeichnis zeigen und die Adresse auf `#browse/<id>` berichtigen. `#book` ohne Zauber MUST die gemerkte Position verwenden.

#### Scenario: Lesezeichen im Buch
- **WENN** das Buch drei Bände hat und `#book/fireball` geöffnet wird, Fireball steht in Band II
- **DANN** ist Band II gewählt und die Doppelseite mit der ersten Fireball-Seite aufgeschlagen

#### Scenario: Zauber nicht im Buch
- **WENN** `#book/wish` geöffnet wird und Wish nicht im Buch steht
- **DANN** zeigt das Verzeichnis Wish, und die Adresse lautet `#browse/wish`

#### Scenario: Seitenzahlen verschieben sich
- **WENN** ein Lesezeichen `#book/fireball` gesetzt und danach ein Zauber vor Fireball ins Buch aufgenommen wird
- **DANN** öffnet das Lesezeichen weiterhin Fireball, auch wenn es nun auf einer anderen Seite steht

#### Scenario: Blättern über Vorspann
- **WENN** im Buch zur Titelseite geblättert wird
- **DANN** lautet die Adresse `#book`

### Requirement: Anker in der Lehre
Im Reiter „Lehre“ SHALL die Adresse den aufgeschlagenen Abschnitt nennen:
- Lehrheft: `#theory/primer[/<teil>[/<lektion>]]` mit den IDs aus dem Lehrheft-Verzeichnis,
- „Vom Gebet“ (göttliche Klassen): `#theory/prayer`,
- Vademecum: `#theory/vademecum/<hälfte>[/<teil>[/<lektion>]]` mit dem Schlüssel der Hälfte; die Mitte heißt `middle`.

Beim Laden MUST die App den genannten Hauptteil bzw. das Vademecum und die genannte Hälfte wählen und zur Lektion, sonst zum Anfang des Teils blättern. Unbekannte Lektionen MUST auf den Teil, unbekannte Teile auf die gemerkte Position zurückfallen; ein Anker, den die aktive Figur nicht hat (z. B. Vademecum ohne Gottheit, `primer` bei göttlicher Klasse), MUST auf den vorhandenen Hauptteil zurückfallen und die Adresse berichtigen. `#theory` ohne Anker MUST wie bisher die gemerkte Unteransicht und Position zeigen.

#### Scenario: Lektion als Lesezeichen
- **WENN** im Lehrheft eine Lektion im Verzeichnis angeklickt und die Seite neu geladen wird
- **DANN** ist wieder die Seite aufgeschlagen, auf der diese Lektion beginnt

#### Scenario: Blättern führt den Anker nach
- **WENN** im Lehrheft über das Ende einer Lektion hinaus in die nächste geblättert wird
- **DANN** nennt die Adresse die neue Lektion

#### Scenario: Vademecum-Hälfte
- **WENN** das Vademecum zwei Hälften hat und `#theory/vademecum/<zweite hälfte>` geöffnet wird
- **DANN** ist die zweite Hälfte gewendet und an ihrem Anfang bzw. der genannten Lektion aufgeschlagen

#### Scenario: Vademecum ohne Gottheit
- **WENN** eine Figur ohne Gottheit `#theory/vademecum/a` öffnet
- **DANN** zeigt die Lehre den Hauptteil, und die Adresse nennt diesen

### Requirement: Ausführliche Fassung in der Adresse
Ist das Fenster mit der ausführlichen Fassung eines Zaubers offen, SHALL die Adresse das Suffix `/full` an den Ort des Zaubers hängen (`#book/<id>/full`, `#browse/<id>/full`). Beim Laden mit `/full` MUST die App erst den Ort herstellen und dann das Fenster öffnen. Andere Fenster (Kreis, Glasfenster, Regeln, Einstellungen) MUST NOT in der Adresse erscheinen.

#### Scenario: Fenster als Lesezeichen
- **WENN** `#book/fireball/full` geöffnet wird
- **DANN** ist das Buch bei Fireball aufgeschlagen und darüber die ausführliche Fassung von Fireball geöffnet

#### Scenario: Fenster schließen
- **WENN** das Fenster über ✕ oder Escape geschlossen wird
- **DANN** fällt `/full` aus der Adresse weg

### Requirement: Verlauf und Zurück-Knopf
Wechsel der Ansicht, Wahl eines anderen Zaubers (Verzeichnis, Buchverzeichnis), Sprung zu einem Lehrheft- oder Vademecum-Abschnitt über das Verzeichnis und Öffnen der ausführlichen Fassung SHALL einen neuen Verlaufseintrag anlegen. Erreicht das Blättern (einschließlich vorige/nächste Einheit und Seitenzahl-Eingabe) einen anderen Zauber bzw. eine andere Lektion oder einen anderen Teil, MUST ebenfalls ein neuer Eintrag entstehen; Blättern innerhalb derselben Einheit MUST die Adresse nur ersetzen. Zurück und Vor des Browsers sowie eine von Hand geänderte Adresse MUST den beschriebenen Ort wiederherstellen, ohne dabei selbst neue Einträge anzulegen; Zurück MUST ein offenes Fenster der ausführlichen Fassung schließen.

#### Scenario: Zurück zum vorigen Zauber
- **WENN** im Verzeichnis nacheinander Fireball und Haste gewählt werden und dann Zurück gedrückt wird
- **DANN** ist Fireball ausgewählt

#### Scenario: Zurück beim Blättern von Zauber zu Zauber
- **WENN** im Buch von Fireball mit „nächster Zauber“ zu Haste und weiter zu Dispel Magic geblättert und dann zweimal Zurück gedrückt wird
- **DANN** ist erst Haste, dann Fireball aufgeschlagen; Vor führt wieder zu Haste

#### Scenario: Seiten eines Zaubers füllen den Verlauf nicht
- **WENN** im Buch innerhalb eines mehrseitigen Zaubers Seite für Seite geblättert wird
- **DANN** bleibt die Adresse gleich, und es entsteht kein Verlaufseintrag

#### Scenario: Zurück schließt das Fenster
- **WENN** im Buch die ausführliche Fassung geöffnet ist und Zurück gedrückt wird
- **DANN** schließt sich das Fenster, und das Buch steht unverändert an derselben Stelle

### Requirement: Adresse vor gemerkter Position
Enthält die Adresse beim Laden ein Ziel, SHALL es Vorrang vor den in localStorage gemerkten Positionen haben; die angesteuerte Position MUST danach wie gewohnt gemerkt werden. Ohne Ziel in der Adresse MUST die App wie bisher starten. Beim Neuladen nach Figurenwechsel oder Sprachwechsel MUST die Adresse erhalten bleiben und mit den Rückfallregeln für die neue Figur ausgewertet werden.

#### Scenario: Lesezeichen schlägt gemerkte Seite
- **WENN** das Buch zuletzt bei Seite 80 stand und `#book/fireball` (Seite 34) geöffnet wird
- **DANN** ist Seite 34 aufgeschlagen, und beim nächsten Öffnen von `#book` ohne Zauber ebenfalls

#### Scenario: Figurenwechsel
- **WENN** bei `#book/fireball` auf eine Figur gewechselt wird, deren Buch Fireball nicht enthält
- **DANN** zeigt die App nach dem Neuladen Fireball im Verzeichnis

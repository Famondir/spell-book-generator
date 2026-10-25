## ADDED Requirements

### Requirement: Drei Sprachebenen
Die App SHALL die Sprache auf drei Ebenen getrennt einstellbar machen: Oberfläche (`uiLang`), Buch (`bookLang`: In-Game-Texte in Zauberbuch, Lehrheft, Brevier und Randnotizen) und Regeln (`rulesLang`: Regeltext, Werte und Zaubernamen). Jede Ebene MUST Deutsch und Englisch kennen. Ohne gespeicherten Zustand MUST jede Ebene der Browsersprache folgen (`de*` → Deutsch, sonst Englisch); besteht bereits ein Zustand aus einer Version ohne Sprachwahl, MUST alles Deutsch bleiben.

#### Scenario: Englische Oberfläche, deutsches Buch
- **WENN** `uiLang = en` und `bookLang = de` eingestellt sind
- **DANN** sind Reiter, Knöpfe und Einstellungen englisch, und die Vorschau des Zauberbuchs zeigt deutsche In-Game-Texte

#### Scenario: Neuer Nutzer mit englischem Browser
- **WENN** die App ohne gespeicherten Zustand in einem Browser mit `navigator.language = "en-US"` startet
- **DANN** sind Oberfläche, Buch und Regeln englisch

#### Scenario: Bestehender Nutzer
- **WENN** ein Zustand ohne Sprachfelder geladen wird
- **DANN** sind alle drei Ebenen Deutsch, und nichts ändert sich am Buch

### Requirement: Sprachtabellen mit Rückfall
Texte der Oberfläche und feste Texte des Buches SHALL aus Sprachtabellen je Sprache kommen. Fehlt ein Eintrag in der gewählten Sprache, MUST der Eintrag der anderen Sprache erscheinen, und die Lücke MUST in einem Test auffallen. Kein Text der Oberfläche MUST fest im HTML oder JS stehen.

#### Scenario: Fehlender Schlüssel
- **WENN** ein Schlüssel nur in der deutschen Tabelle steht und die Oberfläche englisch ist
- **DANN** erscheint der deutsche Text, und der Test für fehlende Schlüssel meldet ihn

### Requirement: Gleiche Kreise in beiden Sprachen
Die Analyse eines Zaubers, seine Kreise, Glyphen und der lateinische Formeltext MUST unabhängig von der Buchsprache sein. Nur Beschriftungen in der Buchsprache DÜRFEN sich unterscheiden.

#### Scenario: Kreis vergleichen
- **WENN** derselbe Zauber mit `bookLang = de` und `bookLang = en` gesetzt wird
- **DANN** stimmen Kreis und Schriftband überein

### Requirement: Eigene Baukästen je Sprache
In-Game-Texte SHALL in jeder Buchsprache aus einem eigenen Baukasten mit eigener Grammatik entstehen, deterministisch je Zauber und Sprache. Lange Prosa (Lehrheft, Alltagszauber, neutrales Profil, Gottheitstexte) SHALL je Sprache vorliegen; fehlt eine Übersetzung, MUST der Text der anderen Sprache erscheinen und als unübersetzt gezählt werden.

#### Scenario: Gleicher Text beim zweiten Setzen
- **WENN** ein Zauber zweimal mit `bookLang = en` gesetzt wird
- **DANN** sind die Texte gleich

#### Scenario: Lehrheft auf Englisch
- **WENN** das Lehrheft mit `bookLang = en` gesetzt wird und alle Lektionen übersetzt sind
- **DANN** enthält es keinen deutschen Lesetext, und der Zähler unübersetzter Felder ist 0

### Requirement: Maßeinheit
Längen in Regelwerten und Texten SHALL in Fuß oder Metern erscheinen (`units`); 5 Fuß MUST 1,5 Metern entsprechen. Ab Werk MUST die Einheit der Regelsprache folgen (Deutsch: Meter, Englisch: Fuß).

#### Scenario: Reichweite in Metern
- **WENN** `units = m` gilt und ein Zauber die Reichweite „close (25 ft. + 5 ft./2 levels)“ hat
- **DANN** erscheint „Nah (7,5 m + 1,5 m je 2 Stufen)“

### Requirement: Einsprachige Profiltexte
Ein Profil SHALL eine Sprache angeben können (`lang`, ab Werk `de`). Seine Texte (Notizen, Vorrede, Randnotizen, ersetzte Lektionen) MUST nur in dieser Buchsprache erscheinen; in der anderen erscheinen die neutralen Texte dieser Sprache. Ein Profil SHALL optional ein Unterobjekt für die andere Sprache tragen können.

#### Scenario: Deutsches Profil, englisches Buch
- **WENN** ein Profil mit `lang: "de"` aktiv ist und `bookLang = en` gewählt wird
- **DANN** erscheinen die englischen neutralen Texte ohne die deutschen Randnotizen des Profils, und der Dialog weist einmal darauf hin

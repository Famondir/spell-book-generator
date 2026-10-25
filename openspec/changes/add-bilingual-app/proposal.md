## Why

Die App mischt heute zwei Sprachen fest: Oberfläche und In-Game-Texte sind Deutsch, Regeltexte, Zaubernamen und Werte (Reichweite, Komponenten, Dauer) Englisch. Für die öffentliche Fassung schließt das alle aus, die kein Deutsch lesen. Am eigenen Spieltisch stören umgekehrt die englischen Regelteile mitten im deutschen Buch. Ziel ist eine neutrale Fassung, die vollständig auf Deutsch oder Englisch läuft. Die private Fassung soll so weit wie möglich Deutsch sein, auch Regelbegriffe, Zaubernamen und Regeltexte, soweit eine deutsche Quelle vorliegt.

## What Changes

- **Sprachwahl** in den Einstellungen, getrennt nach drei Ebenen:
  - Oberfläche: Deutsch oder Englisch.
  - Buchsprache für die In-Game-Texte (Zauberbuch, Lehrheft, Brevier, Randnotizen): Deutsch oder Englisch.
  - Regelsprache für Regeltext, Werte und Zaubernamen: Englisch oder Deutsch.

  Ab Werk folgt alles der Sprache des Browsers. Die Regelsprache bleibt Englisch, solange keine deutschen Regeldaten vorliegen.
- **Oberfläche zweisprachig**: Alle Beschriftungen, Hinweise und Meldungen kommen aus Sprachtabellen statt aus festem HTML oder JS. Das gilt für Reiter, Einstellungen, Druck, Vorbereitung, Statistik, Import und Testschnittstelle.
- **In-Game-Texte zweisprachig**:
  - Textbaukasten (Titel, Formeln, Theorie, Gesten, Fehlschläge, Randnotizen)
  - Kapiteltexte und „Lehre der Kreise“
  - Gebete und Gottheitstexte
  - Lehrheft mit Lesestücken, Glossar und Formularen
  - Alltagszauber mit Namen, Regeltext und Flavour
  - neutrales Profil

  Jede Sprache hat einen eigenen Baukasten mit eigener Grammatik. Das Englische wird also nicht Wort für Wort übersetzt. Die Texte bleiben je Zauber deterministisch.
- **Regelbegriffe übersetzt**: Werte aus den englischen Daten werden auf Deutsch dargestellt, also Schule, Zeitaufwand, Komponenten, Reichweite, Dauer, Rettungswurf und ZR, etwa „close (25 ft. + 5 ft./2 levels)“ → „Nah (7,5 m + 1,5 m je 2 Stufen)“. Fuß oder Meter ist wählbar. Material-Komponenten bekommen eine deutsche Fassung, wo eine Zuordnung besteht.
- **Deutsche Regeldaten nur lokal**: Ein Werkzeug liest die deutschen Zauberlisten (MyPFDB-PDFs in `spells/`, gitignoriert) und ordnet sie über einen Fingerabdruck den englischen Daten zu. Es erzeugt eine gitignorierte Datei mit deutschen Namen, Quellangaben und Regeltexten. Mehrdeutige oder fehlende Zuordnungen landen in einer Prüfliste. Ohne diese Datei läuft die App wie bisher mit englischen Regeltexten und übersetzten Begriffen.
- **Persönliche Fassung**: Kirrans Profil stellt alle drei Ebenen auf Deutsch. Eigene Texte im lokalen Profil bleiben einsprachig. Sie gelten für die Sprache, in der sie geschrieben sind; für die andere wird der neutrale Text genommen.
- **Druck und Tests**: Jede Sprache bekommt eigene Sollwerte für Seitenzahlen und Umbrüche. Die Seitenfüllung darf je Sprache abweichen.

## Capabilities

### New Capabilities
- `localization`:
  - Sprachebenen (Oberfläche, Buch, Regeln), Vorgabe aus dem Browser
  - Sprachtabellen und Rückfall auf die andere Sprache
  - deterministische Texte je Sprache, Maßeinheiten
  - Regeln für einsprachige Profiltexte
- `german-rules-data`:
  - lokaler Import der deutschen Zauberdaten mit Zuordnung per Fingerabdruck und Prüfliste
  - deutsche Namen, Quellangaben und Regeltexte in der App
  - Regel: nie veröffentlichen

### Modified Capabilities
- `spell-texts`: Der Textbaukasten erzeugt Texte in der gewählten Buchsprache, und handgeschriebene Texte können je Sprache vorliegen.
- `settings-dialog`: neue Einstellungen für Sprache und Maßeinheit.
- `book-layout`:
  - Regeltext auf Abruf und Regelverweise in der Regelsprache
  - Beschriftungen in der Buchsprache
- `spell-catalog`:
  - Suche findet deutsche und englische Zaubernamen, sobald deutsche Daten vorliegen
  - Filterbegriffe in der Oberflächensprache
- `publication`: Deutsche Regeldaten und deren Prüflisten werden nie veröffentlicht. Die öffentliche Fassung enthält beide Sprachen der eigenen Texte.

## Impact

- **Code**:
  - Neue Module: `app/js/i18n.js` (Sprachwahl, `t()`, Einheiten) und `app/js/rules-de.js` (Begriffsübersetzung).
  - Fast alle Module mit festen Texten werden umgebaut: `app.js`, `book.js`, `textgen.js`, `theory.js`, `prayer.js`, `primer.js`, `prepare.js`, `stats.js`, `import.js`, `chars.js`, `legend.js` und `index.html`.
- **Daten**:
  - Sprachtabellen `data/lang/de.js` und `data/lang/en.js`.
  - Englische Fassungen von `data/primer.js`, `data/everyday_spells.js`, `data/profile.js` und den Gottheitstexten.
  - Gitignoriert: `data/rules.de.local.js` und `data/research/rules-de-review.md`.
- **Werkzeuge**: `tools/import-rules-de.mjs` (PDF-Text → Datensätze → Zuordnung). Die Browser-Tests bekommen Fälle je Sprache.
- **Umfang**: Das ist ein großer Change. Er wird in Stufen umgesetzt, und jede Stufe ist für sich nutzbar:
  1. Gerüst und Oberfläche
  2. Regelbegriffe
  3. deutsche Regeldaten lokal (der private Nutzen kommt früh)
  4. englische In-Game-Texte
  5. Lehrheft und Alltagszauber auf Englisch
- **Lizenz**: Die englischen Regeltexte stehen unter OGL. Die deutschen Begriffe in MyPFDB werden „mit freundlicher Genehmigung von Ulisses“ genutzt, deshalb bleiben die deutschen Regeldaten lokal. Allgemeine Spielbegriffe in der Begriffsübersetzung (Nah, Mittel, Fern, Willen, Reflex, Zähigkeit) sind Teil des öffentlichen Codes. Das wird vor dem Veröffentlichen geprüft, siehe Aufgabe.

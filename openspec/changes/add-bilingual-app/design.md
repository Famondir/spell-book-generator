## Context

Heute sind drei Textschichten fest verdrahtet:

1. **Oberfläche**:
   - deutsches HTML in `index.html`
   - Template-Strings in `app.js`, `prepare.js`, `stats.js`, `import.js` und `chars.js`
2. **In-Game-Texte**:
   - deutsche Baukästen in `textgen.js`, `book.js` (Kapitel, Vorspann), `theory.js` (Namen, Gesetze), `prayer.js`, `legend.js` und `primer.js`
   - deutsche Daten in `data/primer.js` (rund 600 Zeilen Prosa), `data/everyday_spells.js` (Namen, Regeltext, Flavour, alles Deutsch), `data/profile.js` und `data/deities.js`
3. **Regeldaten**:
   - `data/spells.js` (englisch, OGL)
   - In der Analyse (`analyze.js`) gibt es schon deutsche Kurzbegriffe (`range.de`, `duration.de`, `casting.de`, `save.de`, `shape.de`).

Deutsche Regeltexte liegen lokal als MyPFDB-PDFs vor (`spells/`, gitignoriert, rund 2.700 Zauber). Sie haben einheitliche Feldnamen („Schule:“, „Grad:“, „Zeitaufwand:“, „Komponenten:“, „Reichweite:“, „Ziel:“, „Wirkungsdauer:“, „Rettungswurf:“, „Zauberresistenz:“), Metrik („Nah (7,50 m + 1,50 m/2 Stufen)“) und Quellkürzel („GRW 280“, „ABR VIII 212“). Englische Namen fehlen.

Die App läuft ohne Build über `file://`. Daten kommen per `<script>`, Zustand liegt in `localStorage`. Tests laufen über `tools/test-browser.mjs` mit Sollwerten für Seitenzahlen und Umbrüche.

## Goals / Non-Goals

**Goals:**
- Die neutrale Fassung ist vollständig Deutsch oder vollständig Englisch, umschaltbar ohne Neuladen der Daten. Ein Neuladen der Seite ist erlaubt.
- Drei unabhängige Ebenen: Oberfläche, Buch und Regeln. Wer eine englische Oberfläche will, kann trotzdem ein deutsches Buch drucken und umgekehrt.
- Die private Fassung zeigt Regeltexte, Zaubernamen und Werte auf Deutsch, sobald die lokale Datei aus dem Import vorliegt.
- Gleiche Kreise und Glyphen in beiden Sprachen: Seed und Analyse hängen nicht von der Sprache ab.
- Jede Stufe ist einzeln nutzbar und getestet.

**Non-Goals:**
- Keine dritte Sprache. Das Gerüst soll eine erlauben, aber es gibt keine Übersetzungen.
- Keine maschinelle Übersetzung zur Laufzeit.
- Lateinische Namen (Essenzen, Schulen) und der Formeltext bleiben in beiden Sprachen gleich. Sie sind In-Game-Fachsprache.
- Handgeschriebene Texte aus dem Profil (Kirran, `custom_texts`) werden nicht übersetzt.
- Deutsche Regeltexte werden nicht veröffentlicht, auch nicht teilweise.

## Decisions

### 1. Drei Sprachebenen als Einstellungen
Die Einstellungen heißen `uiLang`, `bookLang` und `rulesLang` (je `de`/`en`), dazu `units` (`ft`/`m`).
- Ab Werk gilt `navigator.language`: `de*` ergibt Deutsch, sonst Englisch.
- `rulesLang: de` wirkt voll erst mit deutschen Regeldaten. Ohne sie zeigt Deutsch die übersetzten Begriffe und den englischen Regeltext, mit einem Hinweis.
- `units` folgt ab Werk der Regelsprache, also Meter bei Deutsch.

*Alternative*: eine einzige Sprache für alles. Verworfen, weil die Ebenen verschiedene Quellen und verschiedene Rechtslagen haben. Der Spieler will oft ein deutsches Buch, braucht aber manchmal den englischen Regeltext zum Nachschlagen mit dem Spielleiter.

### 2. `i18n.js` mit Sprachtabellen statt Bibliothek
`window.I18N` stellt bereit:
- `t(key, vars)` für die Oberfläche
- `b(key, vars)` für das Buch
- `lang.ui` und `lang.book`
- `plural()`
- `units.len(ft)`

Die Tabellen liegen in `data/lang/de.js` und `data/lang/en.js` und setzen `window.LANG_DE` und `window.LANG_EN`. Fehlt ein Schlüssel, wird die andere Sprache genommen und auf der Konsole gewarnt. Ein Test zählt fehlende Schlüssel.

Im HTML bekommen statische Texte `data-i18n="key"`, Platzhalter und Titel `data-i18n-attr="placeholder:key"`. Beim Start und bei einem Sprachwechsel wird einmal übersetzt.

*Alternative*: eine i18n-Bibliothek. Verworfen, weil die App ohne Build und ohne Abhängigkeiten auskommt. Der Bedarf ist klein: Schlüssel, Variablen, Mehrzahl.

### 3. Baukästen je Sprache, nicht Satz für Satz übersetzt
`textgen.js` wird geteilt in einen sprachneutralen Kern und Phrasenmodule:
- Der Kern wählt deterministisch aus Seed, Analyse und Schule.
- Die Phrasenmodule `textgen.de.js` und `textgen.en.js` haben jeweils eigene Pools, eigene Grammatik und eigene Satzbaupläne.

Der Kern übergibt Bausteine wie Titelmuster, Essenzanteile und Gestenfolge. Das Sprachmodul formuliert daraus Sätze. Die Pools müssen nicht gleich lang sein. Die Auswahl mit Seed erfolgt im Sprachmodul, damit beide Sprachen gleich zufällig, aber verschieden reich formulieren können.

Für `book.js` (Kapitel, Vorspann), `prayer.js`, `legend.js` und `theory.js` gilt dasselbe:
- Feste Texte wandern in Tabellen oder Datendateien mit `de`- und `en`-Feldern.
- Namen bekommen ein `en`-Feld neben `de`, zum Beispiel `SCHOOLS.abjuration.en = "Abjuration"`.

*Alternative*: Englisch als Übersetzungstabelle über die deutschen Sätze. Verworfen, weil die deutschen Baukästen mit Fällen, Geschlechtern und Wortstellung arbeiten. Eins-zu-eins übersetzt klänge das hölzern.

### 4. Lange Prosa als parallele Datendateien
`data/primer.js` bekommt `data/primer.en.js` mit gleicher Struktur und gleichen Ids. Geladen werden beide.
- `PRIMER_BOOK` liest die Lektion in der Buchsprache. Fehlt ein Feld, wird die andere Sprache genommen und eine Markierung „untranslated“ gesetzt, die im Test auffällt.
- Für Alltagszauber gilt dasselbe mit `data/everyday_spells.en.js`, gleiche Schlüssel per `base` und `id`.
- Für das neutrale Profil und die Gottheitstexte gibt es `en`-Unterobjekte in derselben Datei, weil sie kurz sind.

### 5. Regelbegriffe: `rules-de.js`
`rules-de.js` übersetzt die englischen Werte aus `spells.js` regelbasiert:
- Schulen und Unterschulen
- Deskriptoren
- Zeitaufwand („1 standard action“ → „1 Standard-Aktion“)
- Komponenten-Kürzel (V → V, S → G, M → M, F → F, DF → GF)
- Reichweiten-Kategorien mit Formel
- Dauerformen („1 round/level“ → „1 Runde/Stufe“)
- Rettungswurf („Will negates (harmless)“ → „Willen, keine Wirkung (harmlos)“)
- ZR

Es gibt eine Musterliste mit Rückfall: Wird ein Wert nicht erkannt, bleibt er Englisch und wird gezählt. Ein Bericht über alle Zauber zeigt die Abdeckung.

Material-Komponenten werden über die bestehenden `materialTags` (deutsche Nomen) ergänzt. Freitexte bleiben ohne Regeldaten Englisch.

Die Maßeinheit ist eine eigene Funktion, `units.len`. Sie rechnet 5 ft in 1,5 m um (Pathfinder-Konvention) und gilt auch für Bereiche („20-ft.-radius spread“ → „Ausbreitung mit 6 m Radius“).

### 6. Deutsche Regeldaten: Import über die Übersetzungstabelle, Fingerabdruck als Rückfall, lokal
*Nachtrag aus der Umsetzung*: Die alphabetische MyPFDB-Liste enthält am Ende eine Tabelle „Zauberübersetzungen“ (deutsch | englisch | Quelle). Sie ist die erste Zuordnung (mit unscharfer Namenssuche gegen Tippfehler, rund 2.470 Einträge); der Fingerabdruck prüft sie gegen und ordnet den Rest zu. Gelesen wird mit `pdftohtml -xml` (Schriftgröße für Name und Quelle, Lage und Einzug für Absätze, Blocksatz als Ende des Werteblocks, Lücken als Tabellenzellen).

`tools/import-rules-de.mjs` arbeitet in vier Schritten:
1. Mit `pdftotext -layout` aus `zauber_gesammeltewerke.pdf`, der vollständigsten Liste, den Text holen.
2. Den Text an „Name (QUELLE Seite)“ in Einträge zerlegen und die Feldnamen parsen. Tabellen und Seitenumbrüche werden geglättet, der Text bleibt in Absätzen.
3. Die Einträge den englischen Zaubern zuordnen. Der Fingerabdruck besteht aus:
   - Schule und Unterschule (übersetzt)
   - Grade je Klasse (Kürzel MAG/HXM/KLE/… ↔ wiz/sor/cleric/…)
   - Komponenten-Kürzel
   - Zeitaufwand
   - Reichweiten-Kategorie
   - Dauerform
   - Rettungswurf-Art und ZR
   - Quellbuch (Kürzeltabelle GRW ↔ PFRPG Core, ABR ↔ Advanced …)

   Die Punktzahl wird gewichtet. Eindeutig heißt: bester Treffer über einer Schwelle und mit Abstand zum zweiten. Ein Profil-Schalter erlaubt Handzuordnungen (`overrides: { "Feuerball": "fireball" }`).
4. Zwei Dateien schreiben, beide gitignoriert:
   - `data/rules.de.local.js` mit `window.RULES_DE = { [spellId]: { name, source, fields, text } }`
   - `data/research/rules-de-review.md` mit mehrdeutigen, fehlenden und überzähligen Einträgen

`index.html` lädt `data/rules.de.local.js` optional, genauso wie heute `profile.local.js`. Die App liest Namen, Felder und Text aus `RULES_DE`, wenn `rulesLang = de` gilt. Sonst nimmt sie die Begriffsübersetzung.

*Alternative*: 5footstep.de abrufen. Die Seite war im Oktober 2026 nicht erreichbar. Sie bleibt als zweite Quelle für dasselbe Format offen (gleiches Ziel-Schema).

*Alternative*: Zuordnung über übersetzte Namen. Verworfen, weil deutsche Namen frei übertragen sind („Magic Missile“ → „Magisches Geschoss“). Der Fingerabdruck ist robuster, und der Name dient nur zum Brechen von Gleichständen.

### 7. Suche zweisprachig
Der Katalog indexiert den englischen Namen und, wenn vorhanden, den deutschen Namen aus `RULES_DE` bzw. den Alltagszauber-Namen der Sprache. Die Anzeige folgt `rulesLang`, der jeweils andere Name steht klein daneben. Import und Export arbeiten weiter mit englischen Namen und Ids, damit Dateien zwischen Sprachen austauschbar bleiben.

### 8. Profiltexte einsprachig
Ein Profil kann `lang: "de"` angeben (ab Werk `de`). Notizen, Vorrede, Randnotizen und `primer.lessons` gelten nur in dieser Buchsprache. In der anderen Buchsprache werden die neutralen Texte der Sprache genommen, und eigene Randnotizen entfallen, mit einem einmaligen Hinweis im Dialog. Ein Profil darf `en: { … }` als Unterobjekt für eine zweite Sprache tragen. Das ist optional und für Kirran nicht nötig.

### 9. Sollwerte je Sprache
`tools/test-cases.mjs` bekommt Satzfälle mit `settings: { bookLang: "en" }` und Bedienungsfälle mit englischer Oberfläche. Die Sollwerte stehen weiter in einer Datei, mit eigenen Fallnamen je Sprache.

Ein neuer Test prüft:
- fehlende Schlüssel in beiden Tabellen
- dass die Kreise in beiden Sprachen gleich sind (Fingerabdruck des SVG ohne Schriftband)
- die Abdeckung der Begriffsübersetzung über alle Zauber, Schwelle ≥ 95 %

## Risks / Trade-offs

- **[Umfang]** Mehrere tausend Zeilen Text in zweiter Sprache. → Umsetzung in Stufen, und Englisch läuft ab Stufe 1 mit Rückfall auf Deutsch. Die Markierung „untranslated“ macht Lücken sichtbar statt still.
- **[Seitenfüllung]** Englische Texte sind kürzer, sodass Füllseiten und Kapitel anders brechen. → Sollwerte je Sprache. Die Füllregeln (`.opt`) gleichen schon heute aus.
- **[Fingerabdruck-Fehlzuordnung]** Varianten wie „Lesser“/„Greater“ oder gleiche Werte in verschiedenen Büchern. → Quellbuch im Abdruck, Schwelle mit Abstand, Prüfliste, Handzuordnungen im lokalen Profil. Nichts Mehrdeutiges wird automatisch übernommen.
- **[PDF-Text]** Tabellen, Silbentrennung und Seitenumbrüche zerstückeln Absätze. → Glättung im Import. Tabellen bleiben als einfache Zeilen, und der Regeltext ist zum Nachschlagen da, nicht zum Setzen im Buch.
- **[Lizenz]** Die deutschen Spielbegriffe in `rules-de.js` sind öffentlich. → Es sind allgemeine Begriffe ohne Regeltext. Vor der Veröffentlichung prüfen (Aufgabe). Notfalls `rules-de.js` als lokale Datei mit neutralem Rückfall.
- **[Mehr Ladezeit]** Beide Sprachdateien werden geladen. → Die Texte sind klein gegenüber `spells.js`. Lange Prosa wird nur bei Bedarf gelesen.

## Migration Plan

- Bestehende Einstellungen bekommen beim ersten Start `uiLang/bookLang/rulesLang = "de"`, wenn bereits ein Zustand im `localStorage` liegt. Bisherige Nutzer sehen also nichts Neues. Neue Nutzer bekommen die Browsersprache.
- Exportdateien bleiben kompatibel (englische Namen). Sprachfelder kommen in `settings` hinzu.
- Stufen werden einzeln committet. Jede Stufe lässt die Tests grün, und die deutschen Sollwerte ändern sich nicht. Ausnahme ist Stufe 2 (Regelbegriffe), wo sich der Regeltext auf den Zauberseiten ändert, wenn Deutsch gewählt ist.

## Open Questions

- Sollen im privaten Buch die deutschen Regeltexte auch im **Regelband** (Druck) erscheinen oder nur auf Abruf in der Ansicht? Vorschlag: beides, wenn `rulesLang = de`.
- Zaubernamen im Buch: Der In-Game-Titel bleibt der generierte deutsche Titel. Soll der deutsche Regelname („Feuerball“) den englischen in der Unterzeile ersetzen? Vorschlag: ja, der englische kommt nur noch in den Regelverweis.
- Englische In-Game-Texte: Soll die Stilvorgabe (Ton, klassische Lehre) eigens festgehalten werden, bevor die Pools geschrieben werden? Vorschlag: eine kurze Stilnotiz in `data/lang/README` mit fünf Mustersätzen je Textart.

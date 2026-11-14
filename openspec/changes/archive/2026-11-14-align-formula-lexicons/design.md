## Context

`add-unique-quick-glyphs` macht Schnellglyphen je Klassenliste eindeutig. `coreChoice(m)` in `app/js/textgen.js` vergibt dafür je Glyphengruppe (Schule, Hauptessenz, Grad, Dauer, Gestalt, Zielzahl) lateinische Verb-Essenz-Paare mit verschiedenen Anfangsbuchstaben. `formula()` zieht Verb und Essenzwort für jede Sprache, damit die Ziehfolge gleich bleibt. Nur für Latein ersetzt es das Ergebnis durch die Wahl aus `coreChoice`.

Gemessen ohne Profil: Kurz- und Langformeln sind je Klassenliste eindeutig. Mit Profil, also in Kirrans Buch mit allen elf Formelsprachen, teilen sich fünf Paare von Zaubertricks dieselbe einzeilige Kurzformel, alle auf Bantu. Die Langformeln sind auch mit Profil eindeutig.

Die Lexika liegen in vereinfachter Lautschrift vor (`pakhur`, `hudor`, `phlox`, walisisch `taan`). `FORMULA.line` setzt sie über `spell()` in die deutsche oder englische Umschrift um. Latein hat je Schule 5–6 Verben und je Essenz 5 Wörter, die übrigen Sprachen meist 2–4.

## Goals / Non-Goals

**Goals:**
- Jede Formel einer Klassenliste ist in jeder Sprache eindeutig, in Kurz- und Langform.
- Der Leser kann die Buchstaben der Schnellglyphe aus der Fachzeile ablesen.
- Wort i einer Liste bedeutet in allen Sprachen dasselbe. Daraus entstehen Wortverwandtschaften für Brückennotizen.
- Die Umstellung geht Sprache für Sprache, und die Tests bleiben dabei grün.

**Non-Goals:**
- Schnellglyphen oder Schriftband in Originalschrift. Das kommt im Folge-Change, siehe proposal.
- Eindeutige Gesten oder Komponenten. Sie sind Beschreibung ohne Regelwirkung und dürfen sich wiederholen.
- Eindeutigkeit über Klassenlisten hinweg. Ein Buch enthält immer nur eine Liste.

## Decisions

### 1. Plätze statt Wörter

`coreChoice(m)` liefert zusätzlich die Plätze `[i, j]`. In `formula()` gilt: Ist die Sprache ausgerichtet, nimmt die Kernzeile `imp[i]` und `ess[j]` dieser Sprache, sonst das frei gezogene Paar. Gezogen wird wie bisher immer, damit `r` für die übrigen Zeilen gleich weiterläuft.

*Alternative:* eine eigene Eindeutigkeitswahl je Sprache. Das wäre mehr Code und ergäbe keine gemeinsame Bedeutung. Die feste Zuordnung ist einfacher, und die lateinische Eindeutigkeit überträgt sich: Verschiedene Plätze bedeuten verschiedene Wörter, weil die Wörter einer Liste verschieden sind.

### 2. „Ausgerichtet“ wird erklärt, nicht erraten

Ein Lexikon erklärt `aligned: true`. Der Generator verwendet die Plätze nur, wenn die Sprache `aligned` erklärt und jede Verb- und Essenzliste genau so lang ist wie die lateinische. Sonst zieht er frei. Das Prüfwerkzeug meldet:
- `aligned: true` mit falscher Listenlänge als Fehler,
- eine mitgelieferte Sprache ohne `aligned` als Hinweis, solange der Change läuft, und mit Abschluss des Changes (Aufgabe 6.2) als Fehler,
- ein lokales Lexikon ohne `aligned` immer nur als Hinweis.

So kann jede Sprache einzeln umgestellt und committet werden.

### 3. Einzeilige Formeln: zweite Sperrmenge

`buildCoreMap` merkt sich zusätzlich zu den belegten Buchstabenpaaren je Glyphengruppe auch die belegten Paare je Zeilengruppe (Schule, Hauptessenz, Gestaltart), und zwar nur für Zauber mit einzeiliger Formel (Grad 0). Ein Paar ist frei, wenn es in beiden Mengen frei ist. Die Zauber werden wie bisher nach ID sortiert und vom Wunschpaar aus durchlaufen.

Heute gibt es auf Latein keine solche Kollision. Die zusätzliche Sperre ändert daher voraussichtlich keine lateinische Kernzeile, das bestätigt der Snapshot. Formeln mit mehreren Zeilen sind durch die gezogenen Zeilen eindeutig. Das prüft das Werkzeug, erzwungen wird es nicht.

### 4. Anlaut in der Originalschrift über eine Anlauttabelle

Ein Lexikon kann `onsets` angeben: Mehrbuchstabige Anlaute der Lautschrift, die in der Originalschrift ein einziges Zeichen sind, werden einem Zeichen zugeordnet. Beispiele sind `kh → ḫ`, `sh → š`, `dj → ḏ`, `ph → φ`, `th → θ`, `ps → ψ` und walisisch `ll`, `dd`, `ch`. Ein Eintrag mit leerem Ziel, etwa Griechisch `h → ""` für den Hauchlaut, überspringt das Zeichen. Ohne Tabelle gilt der erste Buchstabe.

Bei Keilschriftsprachen ist das Originalzeichen eine Silbe. Verschiedene Anfangsbuchstaben führen dort zu verschiedenen Zeichen, sind also strenger als nötig, und das genügt für diesen Change. Urindogermanisch hat keine Schrift, dort gilt die Lautschrift des Lexikons.

### 5. Wortwahl je Platz

Die Bedeutung jedes Platzes gibt das lateinische Wort vor, siehe das Glossar der lateinischen Formelsprache. Vorrang hat:
1. ein verwandtes Wort mit gleicher Bedeutung (bei den indogermanischen Sprachen oft möglich),
2. ein belegtes Wort gleicher Bedeutung,
3. ein bedeutungsnahes Wort oder eine kurze Umschreibung.

Bestehende Wörter bleiben im Lexikon und werden dem passenden Platz zugeordnet. Für eine Liste wird nur ergänzt und umsortiert, nicht neu angefangen. Bei den erfundenen Sprachen (Bantu-Lautbild, Technik) werden fehlende Wörter nach den Lautregeln des Moduls erfunden.

Verwandtschaften für Brückennotizen stehen als `stems` neben `ess` und `imp`: eine Liste parallel zu den Wörtern mit dem gemeinsamen Stamm oder `null`, etwa `aqua: [null, "*wed-", …]`. Sie werden nur eingetragen, wenn der Stamm in der Forschungsnotiz belegt ist.

### 6. Fachzeile

`generateTexts` liefert `formula.tech`: die lateinische Kernzeile, gebildet mit `FORMULA.line(latin, "core", …)` aus der Wahl von `coreChoice`. Die Umschrift bleibt Latein. Der Wert ist leer, wenn die Formelsprache Latein ist. `formulaBlock` in `app/js/book.js` setzt darunter `<div class="tech">Fachformel: …</div>`, klein und kursiv. Das gilt überall, wo `formulaBlock` verwendet wird.

## Risks / Trade-offs

- **Großer Wortbedarf:** Je Sprache fehlen etwa 75 Wörter, zusammen etwa 750. Bei Sumerisch, Hethitisch und Urindogermanisch fehlen oft belegte Wörter. → Mit Umschreibungen arbeiten, die Quellen in einer Forschungsnotiz festhalten und Sprache für Sprache vorgehen.
- **Latein ist danach schwer zu ändern:** Ein neues oder anders sortiertes lateinisches Wort betrifft jeden Platz in allen Sprachen. → Das Prüfwerkzeug erkennt falsche Längen. Lateinische Listen ändern sich nur noch zusammen mit allen Sprachen.
- **Sichtbare Änderungen:** Die Kernzeilen fremdsprachiger Zauber ändern sich. → Es ist noch nichts gedruckt. Die Snapshots werden neu gesichert.
- **Bedeutungsdrift:** Eine Umschreibung kann vom lateinischen Sinn abweichen. → Das ist hinnehmbar, die Formel bleibt eine Leihsprache. Nur die Anlaut- und Längenregel sind hart.

## Migration Plan

1. Infrastruktur: Plätze, `aligned`, `onsets`, Fachzeile und Prüfung. Danach sind Formeln ohne Profil unverändert, mit Profil bleibt nur die neue Fachzeile.
2. Die Sprachen nacheinander ausrichten, jede in einem eigenen Commit mit neuem Snapshot. Bantu zuerst, weil es die gemessenen Doppelungen trägt.
3. Am Ende ist `aligned` für mitgelieferte Sprachen Pflicht.

Rücknahme: Wird `aligned` in einem Lexikon entfernt, zieht diese Sprache wieder frei.

## Open Questions

- Die genaue Lage der Fachzeile auf engen Seiten, etwa der Rückseite mit Formel, Komponenten und Gesten, wird beim Satz entschieden. Schiebt sie Inhalte über eine Seite hinaus, wird sie dort weggelassen.

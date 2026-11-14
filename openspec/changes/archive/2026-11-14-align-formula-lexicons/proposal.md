## Why

Die eindeutige Kernzeilenwahl aus `add-unique-quick-glyphs` gilt nur für Latein. Fremdsprachige Zauber ziehen Verb und Essenzwort frei, deshalb haben in Kirrans Buch fünf Paare von Zaubertricks dieselbe Kurzformel (etwa Federkielschliff und Stabholzflick: „Sanduka ndandi, mukondo!“). Außerdem zeigt die Schnellglyphe eines fremdsprachigen Zaubers lateinische Buchstaben, die in der gedruckten Formel nicht vorkommen. Ein Leser kann sie nicht nachvollziehen.

## What Changes

- **Fachzeile:** Bei Zaubern, deren Formelsprache nicht Latein ist, steht unter der Formel klein die lateinische Kernzeile (Fachformel), etwa „Fachformel: Mulce recordatio, tactus!“. Aus ihr stammen die Absichtsbuchstaben der Schnellglyphe.
- **Ausgerichtete Wortlisten:** Jede Formelsprache hat je Schule genauso viele Verben und je Essenz genauso viele Essenzwörter wie Latein. Das Wort auf Platz i entspricht in der Bedeutung dem lateinischen Wort auf Platz i, wo möglich ist es ein verwandtes Wort. Innerhalb jeder Liste hat jedes Wort einen eigenen Anlaut im Originalalphabet der Sprache.
- **Eine Wahl für alle Sprachen:** Die Kernzeile jeder ausgerichteten Sprache nimmt die Plätze, die `coreChoice` für Latein gewählt hat. Damit ist die Kernzeile in jeder Sprache genauso eindeutig wie im Lateinischen. Die übrigen Formelzeilen bleiben unverändert. **BREAKING** für die Kernzeilen fremdsprachiger Zauber. Es ist noch nichts gedruckt.
- **Einzeilige Formeln:** Bei Formeln aus nur einer Zeile (Zaubertricks, Alltagszauber) wählt `coreChoice` die Kernzeile so, dass sie auf der Klassenliste eindeutig ist, auch über verschiedene Dauerarten hinweg.
- **Übergang:** Eine Sprache, deren Listen noch nicht ausgerichtet sind, behält die freie Ziehung. Das Prüfwerkzeug meldet sie. Für mitgelieferte Sprachen ist das ein Fehler, sobald der Change abgeschlossen ist.
- **Prüfung:** `tools/quick-glyph-check.mjs` meldet doppelte Kurz- und Langformeln je Klassenliste, Listen mit falscher Länge und doppelte Anlaute in allen Sprachen. Gesten und Komponenten gibt es nur als Kennzahlen aus.
- **Brückennotizen:** Notizen können das Kernwort der gedruckten Formel mit dem Wort der Fachformel auf demselben Platz verbinden und auf einen gemeinsamen Stamm hinweisen, wenn es einen gibt.

## Nicht in diesem Change (Folge-Change)

**Schnellglyphen in der Schrift der Formelsprache.** Die Absichtsbuchstaben der Glyphe und das Schriftband des Zauberkreises sollen später das Originalzeichen der Formelsprache zeigen: griechische Buchstaben, Keilschriftzeichen, Hieroglyphen, Ogham. Die Forderung „eigener Anlaut im Originalalphabet“ bereitet das vor. Die Umschrift wäre dann kein Problem mehr, denn sie verwischt heute Anlaute (j wird „Dsch“, y wird „J“, sh und s beginnen beide mit S). Offene Punkte für diesen Change:

- **Silbenschriften:** In der Keilschrift (Sumerisch, Akkadisch, Hethitisch) ist der Anlaut ein Silbenzeichen und kein Buchstabe. Zu klären ist, ob das erste Zeichen genügt oder ein Lautwert gilt.
- **Ägyptisch:** Zu klären ist, ob das erste Einkonsonantenzeichen gilt oder das Deutzeichen.
- **Urindogermanisch hat keine Schrift.** Die Sprache ist nur erschlossen und wird in wissenschaftlicher Umschrift notiert (*h₂*, *ǵ*, *kʷ*), Laryngale sind als Anlaut häufig. Dafür braucht es eine eigene Lösung. Möglich sind die wissenschaftliche Umschrift als „Schrift“, eine in der Welt erfundene Schrift der Azlanti oder Thassilonier, oder die Schrift einer Tochtersprache.
- **Schriftarten:** Für die Originalzeichen braucht es freie Schriften für Keilschrift, Hieroglyphen und Ogham, im Repo unter `app/fonts/` mit Lizenz.

## Capabilities

### New Capabilities
<!-- keine -->

### Modified Capabilities
- `spell-texts`: Kernzeile in allen ausgerichteten Formelsprachen aus der gemeinsamen Wahl, Eindeutigkeit einzeiliger Formeln, Fachzeile auf der Zauberseite, Brückennotiz zum Kernwort.
- `formula-languages`: Ausgerichtete Wortlisten mit Länge wie Latein, Platzbedeutung und eigenem Anlaut je Liste. Die Capability stammt aus dem noch nicht archivierten Change `add-formula-languages`. Hier wird sie ergänzt.

## Impact

- Geändert: alle Lexika in `data/formula-lang/*.js` außer Latein (etwa 75 neue oder umsortierte Wörter je Sprache), `app/js/textgen.js` (`formula`, `coreChoice`, Gruppierung), `app/js/book.js` (Fachzeile), Brückennotizen in `app/js/lang.js` bzw. `textgen.js`, `tools/quick-glyph-check.mjs`, `tools/formula-lang-check.mjs`.
- Lokale Lexika (`*.local.js`) können ausgerichtet werden, müssen aber nicht. Nicht ausgerichtete Sprachen ziehen weiter frei.
- Formel-Snapshot mit und ohne Profil und die Test-Baseline müssen neu gesichert werden.
- Voraussetzung: `add-unique-quick-glyphs` und `add-formula-languages` sind umgesetzt. Sie sollten vor diesem Change archiviert werden, damit die Delta-Specs auf den Hauptspecs aufsetzen.

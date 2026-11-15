## Context

`THEORY` stellt schon `parts`/`partPhrase` und `partsEn`/`partPhraseEn` bereit (theory.js), das Lehrheft nutzt sie. Die Prozentlisten im Buch entstehen an vier Stellen unabhängig voneinander:

- `pctList` in textgen.de.js und textgen.en.js (Lauftext „Die Ladung …“, Aufbauliste „Essenzring“)
- `annotations()` in circle.js (Eintrag „Essenzring“). Er wird von Lehrheft, Buch und Kreis-Dialog verwendet. book.js übersetzt für das englische Buch nur die Überschrift (`ANNOT_EN.Essenzring` reicht `a.t` durch).
- `essenceBlock()` in book.js (Balken plus „81 %“)
- `legendItems()`/`legendItemsEn()` in vitrail.js (Akzentscheiben, beim Stein mit Steinnamen in Klammern)

## Goals / Non-Goals

**Goals:**
- Alle In-Game-Stellen nutzen dieselben Funktionen wie das Lehrheft, damit die Formulierung überall gleich ist.
- Das englische Buch bekommt durchgehend die englische Rezeptform.

**Non-Goals:**
- Keine Änderung an `partPhrase` selbst (Schwellen, Wortwahl).
- App-Oberfläche (app.js: Tooltip, Balken, Dialog-Seitenleiste) und Filter (`pct >= 15`) bleiben in Prozent.
- Die Balkenbreite bleibt prozentgenau.

## Decisions

- **Wiederverwenden statt neu schreiben:** `pctList` wird in beiden Sprachmodulen zu `T.parts(m.essences)` bzw. `T.partsEn(m.essences)`. Der Name `pctList` wird dabei zu `essParts`, damit er nicht lügt.
- **Kreisbeschriftung:** circle.js schreibt `T.parts(m.essences)`. In book.js liefert `ANNOT_EN.Essenzring` den Text selbst neu: `T.partsEn(m.essences)`, statt `a.t` durchzureichen. Alternative wäre ein Sprachparameter in `annotations()`. Verworfen, weil book.js die englische Fassung schon für alle anderen Einträge selbst baut.
- **Essenzanalyse:** rechts `partPhrase(x.pct)` bzw. `partPhraseEn` je Essenz, ohne Zusammenfassen mit „je“, da jede Zeile für sich steht. Nur im Buch (`.essbars .esspct`) bekommt die Spalte eine feste, breitere Breite (etwa 9em, nach der längsten Angabe wie „one and a half parts“) und `white-space: nowrap`. So bleiben die Balken eines Blocks gleich lang, und die App-Balken mit 38 px bleiben unberührt. Eine automatische Breite wurde verworfen, weil die Balken dann je Zeile unterschiedlich lang würden.
- **Andachtsbild:** `T.parts(m.essences, { name })` mit `name = (id) => latin + (stone ? " (" + Steinname + ")" : "")`. Das Englische macht es genauso mit `partsEn`. Die Option `name` gibt es in beiden Funktionen schon.
- **Rundung:** Die Modellwerte sind ganzzahlige Prozente. `partPhrase` rundet ohnehin, eine weitere Umrechnung ist nicht nötig.

## Risks / Trade-offs

- [Längere Texte verschieben die Seitenfüllung] → Satz-Sollwerte mit `node tools/test-browser.mjs --update` neu übernehmen, nachdem die Abweichungen gesichtet wurden; ebenso die englischen Sollwerte und die Variante mit Profil.
- [Englische Reste oder deutsche Reste in der Gegensprache] → `tools/bilingual-check.mjs` laufen lassen.
- [Gleiche Formulierung für verschiedene Prozente (z. B. 81 und 79 % beide „acht Teile“)] → gewollt; der Balken zeigt die Feinheit.

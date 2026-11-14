## Why

Das Zauberbuch zeigt, *was* ein Magier kann; wie man dahin kommt, zeigt die App nirgends. Die Theorie der Kreise (Essenzen, Zeichen, Ecksteine, Ordnungsknoten, Schnellglyphen) steht als Erklärung im Vorspann, aber man kann sie nicht üben. Gewünscht ist ein Lehrwerk für Lehrlinge, mit dem man das freie Zeichnen der Glyphen und Kreise und das Memorieren kleiner Formeln wirklich übt: als schönes Requisit aus der Welt und als echtes Übungsheft. Für Kirran ist es zugleich das Tagesbuch mit Zaubertricks und Alltagszaubern, mit dem er nach dem Erwachen wieder lernt, während der dicke Codex tagsüber weggesperrt ist.

Grundlage ist eine Quellenstudie aus dem privaten PnP-Archiv (DSA, Pathfinder, D&D, GURPS, Harry Potter, historisches Schreibhandwerk; Notizen in `data/research/`, gitignored). Übernommen werden nur Muster; alle Texte werden neu und setting-neutral geschrieben.

## What Changes

- **Lehrheft** („Fibel der Kreise“) als neue Ansicht im Reiter „Lehre“ und als eigener Druckauftrag (A5): Vorspann, acht Teile mit rund 40 Lektionen und einem Anhang.
- **Didaktik ohne Vordruck:** Jede Lektion hat Lesestück, eine verkleinerte „Ansicht des Meisters“ (nicht nachfahren, abzeichnen), eine Aufgabe auf eigenem Papier oder der Wachstafel und einen Prüfvermerk des Meisters (Skala 0–3). Vorgedruckt werden nur Werkzeuge: Prüfscheibe, Lochpausen mit abnehmenden Stützpunkten, Bewertungs- und Versetzungsbogen.
- **Lehrstoff aus der eigenen Theorie:** Glyphen, Schulen, Zeichen, Ecksteine, Zeitmarken, Kreislesen und Schnellglyphen werden aus den Daten der App erzeugt, so wie die Zauberseiten.
- **Handwerk und Welt:** Wachstafel, Federkiel, Ruß- und Eisengallustinte, Farben und ihre Gifte, Pergament, Papierschöpfen, Zirkel und Schnur, Zauberkreide; Hausordnung, Lehrvertrag, Tagesplan.
- **Die Zeichen der Stoffe:** tria prima, Elemente, Planetenzeichen aus Kreis, Halbmond und Kreuz, Wochenkreis, Stoffe lesen, verknüpft mit der bestehenden Zuordnung Stoff → Zeichen → Essenz.
- **Essenzen in Teilen:** Im Lehrheft stehen Essenzanteile wie ein Rezept („drei Teile Vis, ein starkes Teil Spatium“), nicht in Prozent. Die Hilfsfunktion dafür ist allgemein; das Zauberbuch stellt später in einem eigenen Change um.
- **Tagesbuch:** Teil VII enthält jeden Zaubertrick und Alltagszauber aus dem Buch des Charakters mit Kreis, Formel mit wachsenden Lücken zum Memorieren, Geste, Stoffen in Teilen und Übungsleiter (mit Buch, aus dem Gedächtnis, unter Ablenkung; dreimal in Folge).
- **Stimmen am Rand (persönliche Fassung):** Das lokale Profil kann den Meister benennen, eine Vorrede und ein Übergabeschreiben („An den, der nach mir liest“) setzen und Randnotizen mehrerer Stimmen je Lektion eintragen, jede mit eigener Hand und Tinte. Notizen können eine Mindest-Charakterstufe haben und erscheinen erst ab dieser Stufe.
- **Ein loses Blatt:** Das Profil kann ein Blatt anfügen, das nicht hierher gehört (z. B. ein Ritualfragment im Aufbau eines okkulten Rituals), ebenfalls mit Stufe.
- Neue Einstellungen: Charakterstufe (nur für freischaltbare Notizen, nichts wird berechnet) und Name des Meisters.
- Der Reiter „Lehre der Kreise“ heißt „Lehre“ und enthält die bisherige Legende und das Lehrheft. Für göttliche Klassen bleibt „Vom Gebet“ unverändert; ein Lehrheft gibt es dort vorerst nicht.

## Capabilities

### New Capabilities
- `apprentice-primer`: Aufbau, Inhalte, Didaktik, Erzeugung, Stimmen am Rand, Freischalten nach Stufe, Ansicht und Druck des Lehrhefts.

### Modified Capabilities
- `magic-theory`: „Lehre der Kreise“ wird zum Reiter „Lehre“ mit Legende und Lehrheft; Essenzanteile in Teilen als Darstellungsform.
- `printing`: neuer Druckauftrag „Lehrheft drucken“.
- `settings-dialog`: neue Felder Charakterstufe (Abschnitt Charakter) und Name des Meisters (Abschnitt Buch).
- `character-profile`: Profilfelder für Lehrheft (Meister, Vorrede, Übergabe, Stimmen, Randnotizen, loses Blatt).

## Impact

- Neu: `app/js/primer.js` (Seiten des Lehrhefts), `data/primer.js` (allgemeine Lehrtexte, Deutsch), zwei weitere lokale OFL-Schriften für Randnotizen.
- Geändert: `app/js/app.js` (Reiter Lehre, Ansicht, Druck), `index.html`, `app/style.css`, `app/js/theory.js` oder `util.js` (Essenzen in Teilen), `data/profile.local.example.js` (Beispiel für Lehrheft-Felder).
- Wiederverwendet: `BOOK.pageHTML`, `BOOK.typeset` und der Seitenumbruch fließender Seiten (wie im Regelband), `renderCircle` mit `annotate`, Glyphen aus `glyphs.js`, `generateTexts`.
- Persönliches (Meisterin, Stimmen, Ritualblatt, Golarion-Namen) nur in `data/profile.local.js`.

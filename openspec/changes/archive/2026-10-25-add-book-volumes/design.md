## Context

`BOOK.assemble(entries, settings, allModels, ctx)` ([app/js/book.js](../../../app/js/book.js)) baut heute genau ein Buch: Vorspann (`frontMatter`), Verzeichnis (22 Einträge je Seite), dann je Kapitel eine Kapiteldoppelseite mit Formellisten und die Zauberseiten. Seitenzahlen beginnen bei 1; Kapitel und mehrseitige Zauber beginnen links (gerade Seite), wozu Notizseiten oder der Umfang des nächsthöheren Grades eingesetzt werden. Die Regelband-Nummer eines Zaubers ist sein Index in `entries` plus 1, die Kapitelnummer die laufende Kapitelzahl.

`bookData()` ([app/js/app.js](../../../app/js/app.js)) cacht das Ergebnis samt abgeleiteten Strukturen (`units`, `pageBySpell`, `front`, `starts`, `idxByNo`); Vorschau, Blätterleiste, Inhaltsverzeichnis, Inhaltsliste, Statistik und `#btn-print-book` lesen daraus. Ein Buch mit 269 Zaubern hat rund 814 Zauberseiten plus Kapitel- und Notizseiten.

## Goals / Non-Goals

**Goals:**
- Höchstseitenzahl je Band einstellbar; Aufteilung an Kapitelgrenzen, ausgeglichen, mit möglichst wenigen Bänden.
- Jeder Band ist für sich ein vollständiges, gebundenes Buch: eigene Titelseite, eigenes Verzeichnis, eigene Seitenzählung ab 1, korrekte Links/Rechts-Lage.
- Ohne gesetzte Grenze verhält sich alles exakt wie heute (gleiche Seiten, gleicher Cache-Schlüssel-Inhalt bis auf das neue Feld).

**Non-Goals:**
- Aufteilung des Regelbands (bleibt ein Band mit durchlaufenden Nummern).
- Auffüllen auf eine durch 4 oder 2 teilbare Seitenzahl (Druckdienste fügen Leerseiten selbst an).
- Buchrücken, Umschlag oder Bandfarben.
- Manuelles Verschieben von Kapitelgrenzen durch den Nutzer.

## Decisions

### 1. Bände als mehrfacher `assemble`-Aufruf mit Bandkontext

`assemble` bekommt in `ctx.volume` die Angaben `{ no, total, first, label, chapterOffset, refOffset, continued }`:
- `first`: nur dann `arcaneFront`/`prayerFront` vollständig; sonst nur Bandtitelseite (+ Verzeichnis, falls Vorspann an).
- `chapterOffset`: Kapitelnummer = `chapterOffset + chapters.length`.
- `refOffset`: Regelband-Nummer = `refOffset + idx + 1`.
- `continued`: Schlüssel des Kapitels, das aus dem Vorband fortgesetzt wird → Kapitelseite mit „(Fortsetzung)“.

Seitenzählung beginnt pro Aufruf bei 1, damit stimmt die Parität (Seite 1 rechts) in jedem Band automatisch.

*Alternative:* ein großes Buch setzen und hinterher zerschneiden. Verworfen, weil dann Titelseiten, Verzeichnisse, Seitenzahlen und Links/Rechts-Lage nachträglich umgerechnet werden müssten – genau die Logik, die `assemble` schon richtig macht.

### 2. Aufteilung: mit echtem Satz messen, ausgeglichen schneiden

Neue Funktion `BOOK.volumes(entries, settings, allModels, ctx)`:
1. Ohne Grenze oder wenn das ganze Buch passt: ein `assemble`-Lauf wie bisher.
2. Gemessen wird jeder Abschnitt `[i, j)` mit echtem `assemble` im Bandkontext (Band I mit Vorspann, sonst Bandtitel); die Seiten der Zauber kommen dabei aus `ctx.pageCache`, der Vorspann aus `ctx.front`. Damit kostet ein Messlauf nur noch das Zusammensetzen der Strings (ganze Aufteilung ≈ 0,6 s bei 275 Zaubern, kaum mehr als ein einzelner Lauf).
3. Kapitel, die allein die Grenze sprengen, werden an erlaubten Zaubergrenzen (nicht zwischen zwei Hälften einer Seite) in so wenige Stücke wie nötig geteilt; per Binärsuche auf eine kleinere Grenze werden die Stücke ausgeglichen (65 + 65 statt 99 + 33).
4. Mindestzahl k der Bände gierig bestimmen, dann für k Bände per dynamischer Programmierung die Schnitte wählen, die den dicksten Band minimieren.

Weil mit echtem Satz gemessen wird, ist kein Korrekturschritt nötig: die gemessenen Größen sind die gedruckten.

*Alternative:* Kapitelgrößen aus einem Gesamtlauf schätzen und hinterher prüfen. Verworfen, sobald klar war, dass ein Messlauf mit Zwischenspeicher billig ist; die Schätzung hätte ±1 Seite Paritätsfehler je Band gehabt.

*Alternative:* nur gierig füllen. Einfacher, erzeugt aber oft einen fast leeren letzten Band (814 Seiten bei 600 → 600 + 214).

### 3. Warnungen statt Sperren

`volumes()` liefert neben den Bänden `warnings` (Kapitel geteilt; Grenze kleiner als Bandvorspann + längster Zauber → empfohlene Mindestgrenze). Die Buchansicht zeigt sie unter der Statistik. Ein Band darf in diesem Notfall die Grenze überschreiten; ein Zauber wird nie zerrissen.

### 4. Datenmodell in `app.js`

`bookData()` gibt `{ key, entries, volumes: [vol…], warnings, pageBySpell }` zurück, wobei jedes `vol` die heutigen Felder hat (`pages, toc, units, front, starts, idxByNo, chapters, …`) plus `no`, `label`. `pageBySpell: id → { vol, page }`. Die aktuelle Ansicht nutzt `cur() = d.volumes[view.vol]`; alle bisherigen Zugriffe auf `bookData().pages` usw. gehen über `cur()`. Bei einem Band ist `view.vol = 0` und alles verhält sich wie bisher.

`view.vol` wird unter `spellbook.bookVol` gespeichert (wie `bookPos`); bei Änderung der Bandzahl auf einen gültigen Band begrenzt.

### 5. Oberfläche

- Einstellungen: `<label>Höchstens <input type="number" name="maxPages" min="0" step="10"> Seiten je Band (leer = ein Band)</label>` direkt nach „Kapitel je Grad“; ohne Kapitel wird trotzdem nach Grad geschnitten (Kapitelschlüssel gibt es immer).
- Buchansicht: Bandwahl als Knopfreihe „Band I · II · III“ in `.book-bar`, nur sichtbar bei mehr als einem Band. Statistik: „3 Bände: I 398 · II 396 · III 102 Seiten“.
- Inhaltsverzeichnis rechts: Gruppen bleiben, Seitenzahl als „II·34“; Vorspann zeigt nur Band I bzw. pro Band die Titelseite. Inhaltsliste links: `S. II·34`.
- Druck: bei mehreren Bänden heißt `#btn-print-book` „Band II drucken / als PDF“ und druckt den in der Bandwahl gewählten Band; die Bandwahl ist zugleich die Auswahl für den Druck (keine zusätzliche Knopfreihe).

### 6. Bandtitelseite

Nutzt die bestehende `title-page`-Klasse mit dem Siegel des Titelblatts, darunter „Band II“ und der Umfang aus den Kapitelnamen des Bandes (`chapterName` von erstem bis letztem Kapitel, z. B. „III.–V. Grad“, „Zaubertricks – II. Grad“). Band I erhält dieselbe Zeile auf seinem Titelblatt, sobald es mehr als einen Band gibt.

## Risks / Trade-offs

- [Rechenzeit: viele `assemble`-Läufe] → Zauberseiten und Vorspann zwischengespeichert, Binärsuche und Abbruch in der DP begrenzen die Läufe; `assemble` erzeugt nur HTML-Strings, das eigentliche Setzen (`typeset`) bleibt pro angezeigtem Ausschnitt bzw. Druckband. Ergebnis wird wie heute über den Einstellungs-Schlüssel gecacht.
- [Ausgeglichene Bände ändern sich sprunghaft, wenn ein Zauber dazukommt] → akzeptiert; die Bandaufteilung ist eine Druckvorbereitung, kein dauerhafter Zustand.
- [Seitenzahlen ab 1 je Band: Verweise „S. 34“ sind mehrdeutig] → überall in der App mit Bandnummer („II·34“); im gedruckten Band gelten Verweise nur innerhalb des Bandes, und die Regelband-Nummer bleibt eindeutig.

## Open Questions

- ~~Übersicht aller Bände in Band I oder in jedem Band?~~ Entschieden: vorerst nicht. Ein Magier weiß nach Jahren des Studiums, welchem Grad der gesuchte Zauber entspricht; die Bandtitelseiten nennen den Umfang.

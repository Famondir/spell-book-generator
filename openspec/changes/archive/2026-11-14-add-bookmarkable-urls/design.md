## Context

Die App ist eine statische Seite ohne Build-Schritt, die per Doppelklick (`file://`) und als GitHub Page läuft. Heute schreibt `show()` in `app/js/app.js` per `history.replaceState` nur `#book`, `#theory` oder `#prepare`, und am Ende des Starts wird dieser Hash einmal ausgewertet. Alle übrigen Positionen liegen in localStorage (je Figur): `bookPos`/`bookVol` (Seitenindex und Band), `primerPos`, `theoryPos`, `lehreView`, `vmHalf`, `vmPos.<hälfte>`. Der ausgewählte Verzeichnis-Zauber wird gar nicht gemerkt; beim Start wird Fireball gewählt.

Vorhandene Bausteine, die sich nutzen lassen:
- Buchseiten tragen `spell: m.id`; `bookData()` liefert je Band `pages`, `units`, `starts`; `gotoPageNo(no, vol)` springt band-übergreifend.
- Lehrheft und Vademecum springen über `renderPrimer({ part, lesson })` bzw. `renderVm({ part, lesson })`; ihre Verzeichnisse und `onShow`-Rückrufe kennen den aktuellen Teil (`partOf`, `vmPartOf`).
- `openFull(x)` öffnet `#full-modal`.
- `VIEWER.create` hat `onShow(a, b)` nach jedem Anzeigen.

## Goals / Non-Goals

**Goals:**
- Lesbare, stabile Lesezeichen für Verzeichnis-Zauber, Buch-Zauber, Lehre-Abschnitte und die ausführliche Fassung.
- Browser-Zurück/Vor wie auf einer Website, ohne den Verlauf beim Blättern zu fluten.
- Gleiches Verhalten unter `file://` und GitHub Pages.

**Non-Goals:**
- Figur, Filter, Suchtext, Zoom, „ausführlich“-Häkchen, Seitenleisten oder Druckvorschau in der Adresse.
- Teilen zwischen Geräten mit unterschiedlichen Büchern über die Rückfallregeln hinaus.
- Echte Pfad-URLs (`/book/fireball`) oder `404.html`-Umleitungen.

## Decisions

### 1. Hash mit `/`-Segmenten, englische Namen
`#browse/fireball`, `#book/fireball/full`, `#theory/primer/V/v-use`, `#theory/vademecum/a/<teil>/<lektion>`, `#prepare`.
- *Warum Hash*: Unter `file://` gibt es kein Routing, auf GitHub Pages würden Pfade 404 liefern. Der Hash erreicht nie einen Server.
- *Warum `/`*: Zauber-IDs enthalten `-` (`abadar-s-truthtelling`), `-` als Trenner wäre mehrdeutig; `?` im Hash sieht nach Query aus, ist aber keine. `/` kommt in keiner ID vor.
- *Warum englisch*: Die Oberfläche ist zweisprachig; die Ansichtsnamen entsprechen den vorhandenen `data-view`-Werten.
- Segmente werden mit `encodeURIComponent` geschrieben und `decodeURIComponent` gelesen (für Lektions-IDs mit Sonderzeichen).

### 2. Ein kleines Modul `app/js/route.js`
Reine Funktionen ohne App-Wissen: `parse(hash) → { view, parts[], full }` und `format(route) → "#…"`, dazu `push(route)` / `replace(route)`, die nur schreiben, wenn sich die Adresse ändert. Die Zuordnung Route ↔ App-Zustand bleibt in `app.js`, weil dort alle Ansichten leben:
- `currentRoute()` baut die Route aus `state.view`, `state.selected`, der Buch-/Lehre-Position und dem offenen Fenster.
- `applyRoute(route)` stellt den Ort her (Ansicht wählen, Zauber auswählen, Band und Seite bestimmen, Lehre-Abschnitt anspringen, Fenster öffnen/schließen) und gibt die *berichtigte* Route zurück, die dann per `replace` geschrieben wird.
- *Alternative*: Router mit Registrierung je Ansicht. Für vier Ansichten unnötig.

### 3. Push oder Replace
| Auslöser | Verlauf |
|---|---|
| Reiterwechsel (`show`) | push |
| Zauber im Verzeichnis wählen (`select` aus Klick) | push |
| Zauber im Buchverzeichnis / Inhaltsverzeichnis anklicken | push |
| Lehrheft-/Vademecum-Verzeichnis: Teil oder Lektion | push |
| Vademecum wenden, Lehre-Umschalter | push |
| Ausführliche Fassung öffnen | push |
| Blättern usw. erreicht anderen Zauber / andere Lektion / anderen Teil | push (über `onShow`) |
| Blättern innerhalb derselben Einheit, Größenänderung | replace (über `onShow`) |
| Berichtigung nach `applyRoute` (Rückfall) | replace |

Ein Merker `applying` unterdrückt jedes Schreiben, solange `applyRoute` läuft, damit Wiederherstellen keine neuen Einträge erzeugt. Die Betrachter melden nach jedem Anzeigen per `onShow` (`viewWrite()`): weicht die Adresse ab, ist eine andere Einheit erreicht → push, sonst replace. Die Einheit ergibt sich aus der Adresse selbst (Zauber im Buch, Teil/Lektion in der Lehre), Seiten innerhalb einer Einheit ändern sie nicht. Nach einem Reiterwechsel und nach dem Herstellen einer Adresse berichtigt die erste Meldung nur (`settling`): sonst legte die Berichtigung der noch veralteten Adresse einen zweiten Eintrag an bzw. löschte bei Zurück den Vor-Verlauf.
- *Erste Fassung*: jedes Blättern ersetzt nur. Verworfen, weil Zurück dann nicht von Zauber zu Zauber führt.

### 4. Buch: Zauber statt Seite
- Schreiben: im sichtbaren Ausschnitt `[a, b]` die erste Seite mit `spell` → deren ID; sonst nur `#book`.
- Lesen: über alle Bände `bookAll().volumes` die erste Seite mit `spell === id` suchen, dann `view.vol` setzen und `bookViewer.pos` auf diesen Index (gleicher Weg wie `gotoPageNo`). Nicht gefunden → `show("browse")`, `select(id)` und Route `#browse/<id>`.
- Seitenzahlen in der Adresse wurden verworfen: sie verschieben sich bei jeder Buchänderung.

### 5. Lehre-Anker aus den vorhandenen IDs
- Lehrheft: Teil-IDs (`V`, `I`, `II`, … aus `data/primer.js`) und Lektions-IDs (`v-use` …); Ziel über `renderPrimer({ part, lesson })`. Beim Blättern liefert `onShow` den Teil (`partOf`); die aktuelle Lektion ergibt sich aus der letzten `[data-lesson]` bis zur sichtbaren Seite (wie `starts`).
- „Vom Gebet“: nur `#theory/prayer` (keine Einheiten).
- Vademecum: Hälften-Schlüssel (`h.key`), Teil, Lektion, `middle` für die Mitte; Ziel: `vmHalf` setzen, dann `renderVm({ part, lesson })`.
- `primer` bzw. `prayer` statt eines neutralen `main`, damit die Adresse sagt, was sie meint; ein nicht passender Anker fällt auf den vorhandenen Hauptteil zurück.

### 6. Ausführliche Fassung
`openFull(x)` pusht `…/<id>/full` (bei Aufruf aus der Route nicht). Das `close`-Ereignis des Dialogs: Ist der aktuelle Verlaufseintrag einer, den die App selbst beim Öffnen gepusht hat (`history.state.full`), dann `history.back()`; sonst (direkt mit `/full` geladen) `replace` ohne `/full`. `popstate` ohne `full` schließt einen offenen Dialog.

### 7. Start und `popstate`
- Start: statt Fireball-Auswahl plus Hash-Auswertung ruft der Start `applyRoute(parse(location.hash))`; ohne Ziel bleibt das bisherige Verhalten (Standardzauber, gemerkte Positionen).
- `window.addEventListener("popstate", …)` → `applyRoute(parse(location.hash))`. `popstate` feuert auch bei von Hand geänderter Adresse (Hash-Änderung), ein eigener `hashchange`-Handler ist dann unnötig; doppelte Auswertung wird durch Vergleich mit der zuletzt angewandten Adresse vermieden.
- `location.reload()` (Figuren-/Sprachwechsel) behält den Hash ohnehin.

## Risks / Trade-offs

- [Buch noch nicht gesetzt, wenn die Route ausgewertet wird] → Seitenindex aus `bookData()` (Seitenmodell, ohne DOM) bestimmen; gesetzt wird wie bisher erst im Betrachter.
- [Lehrheft/Vademecum setzen asynchron; Ziel erst nach dem Satz bekannt] → `renderPrimer`/`renderVm` warten bereits auf den Satz und springen danach; die Route wird nach dem Sprung berichtigt.
- [Doppelseite zeigt zwei Zauber] → Adresse nennt den ersten; beim Laden steht er links oder allein, das kann eine andere, aber passende Doppelseite sein.
- [Verzeichnis-Filter blenden den Zauber aus] → Auswahl und Detailansicht funktionieren über `byId` trotzdem; die Liste markiert dann nichts. Filter werden nicht zurückgesetzt.
- [Dialog-Schließen und `history.back()` überkreuzen sich] → Merker `applying`, und `back()` nur, wenn `history.state.full` von der App stammt.
- [`file://` und GitHub Pages haben getrennten Speicher] → bewusst: die Rückfallregeln (nicht im Buch → Verzeichnis, unbekannter Anker → Hauptteil) decken andere Figuren/Bücher ab.

## Migration Plan

Keine Datenmigration; localStorage-Schlüssel bleiben. Alte Adressen `#book`, `#theory`, `#prepare` bleiben gültig (Ansicht ohne Ziel). Zurückrollen = Modul und Aufrufe entfernen.

## Open Questions

- Soll auch der Reiter „Heute vorbereitet“ später einen Zauber-Anker bekommen? Vorerst nein.

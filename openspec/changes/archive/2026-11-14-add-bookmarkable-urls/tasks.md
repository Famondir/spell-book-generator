## 1. Adressmodul

- [x] 1.1 `app/js/route.js` anlegen: `parse(hash)` → `{ view, parts, full }`, `format(route)` → `#…` (Segmente mit `encodeURIComponent`), `push`/`replace`, die nur bei geänderter Adresse schreiben und `history.state` (z. B. `{ full: true }`) setzen können; Merker `applying` zum Unterdrücken des Schreibens
- [x] 1.2 In `index.html` vor `app.js` einbinden
- [x] 1.3 Kleiner Node-Test für `parse`/`format` (Rundlauf, `-` in IDs, leerer Hash, `/full`, unbekannte Ansicht → `browse`)

## 2. Route ↔ Zustand in app.js

- [x] 2.1 `currentRoute()`: Ansicht, gewählter Zauber (browse), erster Zauber im sichtbaren Buchausschnitt, Lehre-Anker, offenes Fenster der ausführlichen Fassung
- [x] 2.2 `applyRoute(route)`: Ansicht herstellen und berichtigte Route per `replace` schreiben; unbekannte Ansicht/ID → bisheriges Startverhalten
- [x] 2.3 Start umstellen: Fireball-Auswahl und alte Hash-Auswertung durch `applyRoute(parse(location.hash))` ersetzen, ohne Ziel wie bisher
- [x] 2.4 `popstate`-Handler: `applyRoute` mit `applying`-Merker, doppelte Auswertung derselben Adresse vermeiden

## 3. Verzeichnis

- [x] 3.1 `show(view)` pusht statt `replaceState`; Aufrufe aus `applyRoute` schreiben nicht
- [x] 3.2 Klick auf einen Zauber im Verzeichnis pusht `#browse/<id>`; `select` selbst bleibt schreibfrei
- [x] 3.3 `#browse/<id>` beim Laden: Zauber auswählen; unbekannt → Standardzauber und Adresse berichtigen

## 4. Buch

- [x] 4.1 Suche „erste Seite von Zauber X“ über alle Bände (`bookAll().volumes`, `page.spell`) → `{ vol, index }`
- [x] 4.2 `#book/<id>` beim Laden: Band wählen, Position setzen (Weg wie `gotoPageNo`); nicht im Buch → Verzeichnis bei diesem Zauber, Adresse `#browse/<id>`
- [x] 4.3 Buchbetrachter bekommt `onShow`: `replace` mit dem ersten Zauber im Ausschnitt, ohne Zauberseite nur `#book`
- [x] 4.4 Klicks im Buchverzeichnis und Inhaltsverzeichnis pushen (vor dem Sprung), Blättern ersetzt nur

## 5. Lehre

- [x] 5.1 Lehrheft: aktuelle Lektion zum sichtbaren Ausschnitt bestimmen; `onShow` ersetzt `#theory/primer/<teil>/<lektion>`
- [x] 5.2 Lehrheft-Verzeichnis (Teil/Lektion) pusht; `#theory/primer/…` beim Laden → `renderPrimer({ part, lesson })`, unbekannte Lektion → Teil → gemerkte Position
- [x] 5.3 „Vom Gebet“: `#theory/prayer`
- [x] 5.4 Vademecum: Hälfte/Teil/Lektion bzw. `middle` schreiben (`onShow` je Hälfte), Verzeichnis, Wenden und Lehre-Umschalter pushen; beim Laden `vmHalf` setzen und `renderVm({ part, lesson })`
- [x] 5.5 Rückfall: Anker passt nicht zur Figur (kein Vademecum, `primer` bei göttlicher Klasse und umgekehrt) → vorhandener Hauptteil, Adresse berichtigen

## 6. Ausführliche Fassung

- [x] 6.1 `openFull` pusht `…/<id>/full` mit `history.state.full`, außer beim Öffnen aus `applyRoute`
- [x] 6.2 `close` des Dialogs: selbst gepushter Eintrag → `history.back()`, sonst `replace` ohne `/full`
- [x] 6.3 `popstate` ohne `/full` schließt den offenen Dialog; `/full` beim Laden öffnet ihn nach Herstellen des Orts

## 7. Prüfen

- [x] 7.1 Headless-Browser-Test (`tools/test-browser.mjs`): Laden mit `#browse/<id>`, `#book/<id>` (mehrbändig), `#book/<nicht im buch>`, `#theory/primer/<teil>/<lektion>`, `#book/<id>/full`; Adresse nach Blättern und Klicks; Zurück schließt Fenster und führt zum vorigen Zauber
- [x] 7.2 Von Hand unter `file://` und über einen lokalen HTTP-Server (wie GitHub Pages) gegenprüfen, Lesezeichen setzen und öffnen
- [x] 7.3 Figurenwechsel und Sprachwechsel bei `#book/<id>`: Adresse bleibt, Rückfall greift
- [x] 7.4 README: kurzer Absatz zu Lesezeichen/Adressen

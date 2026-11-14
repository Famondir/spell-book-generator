## Context

Alle Seitenansichten (Buch, Lehrheft, Theorie-Seiten im Vorspann, „Vom Gebet“) laufen über `VIEWER.create` in `app/js/viewer.js`. Seiten sind fest 148 × 210 mm (`PAGE_W = 560` px). Der Betrachter wählt in `size()` anhand von `root.clientWidth` eine oder zwei Seiten und setzt auf schmalen Bildschirmen bereits `root.style.zoom`, um eine Seite auf Bildschirmbreite zu verkleinern. Die Seitenfüllung (`--fit`, Überlaufprüfung) wird im DOM gemessen, teils im Zustand `.pages.fitting`. Der Zustand liegt in `localStorage`; `store` in `app.js` legt Schlüssel je Charakter ab (`CHARS.key`).

## Goals / Non-Goals

**Goals:**
- Nur die Seiten vergrößern/verkleinern, die Oberfläche bleibt gleich groß.
- Eine Steuerung für alle Ansichten, ohne Änderungen in den einzelnen Ansichten.
- Einzel-/Doppelseite und Verschieben passen sich der Stufe an.
- Satz, Seitenfüllung und Druck bleiben exakt gleich.

**Non-Goals:**
- Kein Zoom mit Mausrad/Pinch und kein Ausschnitt-Zoom (Lupe) auf eine Stelle der Seite.
- Keine Stufe je Ansicht oder Charakter.
- Keine Vergrößerung der übrigen Oberfläche (dafür bleibt die Browser-Vergrößerung).

## Decisions

**CSS `zoom` auf den Seiten, nicht auf `root`.** Der Betrachter setzt eine Variable `--page-zoom` auf `root`; die Regel `.pages > .page, .pages > .page-ghost { zoom: var(--page-zoom, 1) }` wendet sie an. So bleibt `root` selbst unvergrößert, seine Breite gehört weiter zur Oberfläche, und `overflow-x: auto` auf `root` macht zu breite Seiten verschiebbar, ohne die Seite breiter zu machen. Das bisherige `root.style.zoom` für schmale Bildschirme geht in dieselbe Variable auf (effektive Stufe = gewählte Stufe × Schmal-Faktor, Letzterer nur bei 100 % und kleiner). Alternative `transform: scale()`: verändert die Layoutgröße nicht, Doppelseiten würden überlappen und Abstände müssten von Hand gerechnet werden – verworfen.

**Messen ohne Zoom.** Während gemessen wird (`.pages.fitting`), gilt `zoom: 1`. Der Druck braucht keine eigene Regel: Gedruckt werden die Seiten in `#print-root`, die nicht in `.pages.spread` liegen. Eine Druckregel `.page { zoom: 1 !important }` würde zudem die A4-Vergrößerung (`zoom: 1.4142`) aushebeln. Damit hängen Seitenumbrüche und `--fit` nicht von Rundungen bei anderen Stufen ab. Falls eine Ansicht außerhalb von `.fitting` misst, wird sie in den Aufgaben auf dasselbe umgestellt bzw. bekommt eine eigene Mess-Klasse.

**Einzel- oder Doppelseite.** `size()` vergleicht die verfügbare Breite (`root.clientWidth`, `root` ist ja unvergrößert) mit `(2 · PAGE_W + 18) · z`. Passt das nicht, eine Seite. Position bleibt über `spreadAt` erhalten wie beim Fenster verkleinern.

**Einpassen.** Verfügbare Höhe = `window.innerHeight − root.getBoundingClientRect().top − Rand`, Breite = `root.clientWidth`. Für zwei Seiten `z₂ = min(H / PAGE_H, W / (2 · PAGE_W + 18))`, für eine `z₁ = min(H / PAGE_H, W / PAGE_W)`. Doppelseite, solange `z₂ ≥ 0,75 · z₁` (also lieber zwei Seiten, außer eine allein wäre deutlich größer); sonst eine Seite mit `z₁`. Bei jeder Größenänderung neu gerechnet. Die Prozentanzeige zeigt dann die errechnete Stufe, „Einpassen“ ist hervorgehoben; + und − gehen von der errechneten Stufe zur nächsten festen.

**Stufen.** 50, 67, 75, 90, 100, 110, 125, 150, 175, 200, 250 % – wie Browser, vertraut.

**Speicher.** Direkt `localStorage["spellbook.pageZoom"]` (Zahl oder `"fit"`), nicht über `store`/`CHARS.key`: die Stufe hängt am Bildschirm, nicht am Charakter. Gelesen und geschrieben in `viewer.js` (try/catch wie in `store`). Der Zustand ist modulweit, alle Betrachter teilen ihn; bei einer Änderung zeigt der aktive Betrachter neu (`show()`), die übrigen übernehmen die Stufe beim nächsten `show()`.

**Steuerung in der Blätterleiste.** `renderPager` hängt nach den Blätterknöpfen eine Gruppe `− [125 %] + ⤢` an (vor `opts.extra()`), mit Titeln aus `I18N` (`pager.zoomOut`, `pager.zoomIn`, `pager.zoomReset`, `pager.zoomFit`). Tasten: `+`/`=`, `-`, `0` im vorhandenen `keydown`-Handler, nur ohne Strg/Cmd/Alt, damit die Browser-Vergrößerung (Strg + +) unberührt bleibt.

**Blätterposition beim Zoomen.** Beim Wechsel der Stufe bleibt die erste gezeigte Seite die Bezugsseite (`g`); bei Verschiebung wird `root.scrollLeft` auf 0 gesetzt.

## Risks / Trade-offs

- [CSS `zoom` und Messwerte: in Chrome ≥ 128 sind `clientHeight`/`scrollHeight` unter `zoom` standardisiert, ältere Engines rechnen anders] → Messen findet ohne Zoom statt (siehe oben); Anzeige-Unterschiede sind unkritisch.
- [Firefox unterstützte `zoom` erst ab 126] → Ältere Firefox zeigen schlicht 100 %; keine Fehlfunktion.
- [Seitenleisten- oder Fensteränderungen ohne `resize`-Ereignis (Verzeichnis ein-/ausklappen) ändern die Breite] → Wie heute: die Ansichten rufen nach dem Umschalten `show()`; bei „Einpassen“ zusätzlich prüfen, ob das reicht, sonst `ResizeObserver` auf `root`.
- [Ansichten, die außerhalb von `.fitting` messen, würden vergrößert messen] → Aufgabe: Mess-Seite vergleicht Seitenumbrüche bei 100 % und 175 %.

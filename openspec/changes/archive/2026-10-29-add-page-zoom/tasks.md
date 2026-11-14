## 1. Zoomzustand und Anzeige

- [x] 1.1 In `app/js/viewer.js` modulweiten Zoomzustand anlegen (Stufen 50–250 %, Wert oder `"fit"`), aus `localStorage["spellbook.pageZoom"]` lesen und schreiben (try/catch); prüfbar: Wert bleibt nach Neuladen in der Konsole erhalten
- [x] 1.2 In `app/style.css` `.pages > .page, .pages > .page-ghost { zoom: var(--page-zoom, 1) }`, `overflow-x: auto` auf die Seitenflächen, `.pages.fitting` mit `zoom: 1` (Druck braucht nichts, `#print-root` liegt außerhalb); prüfbar: Variable von Hand in DevTools setzen vergrößert nur die Seiten
- [x] 1.3 `show()` setzt `--page-zoom` statt `root.style.zoom` (effektive Stufe = gewählte × Schmal-Faktor bei ≤ 100 %), `size()` rechnet mit `(2 · PAGE_W + 18) · z`; prüfbar: Screenshot bei 150 % zeigt im breiten Fenster eine Einzelseite, bei 100 % eine Doppelseite
- [x] 1.4 „Einpassen“ nach design.md (z₁/z₂, Höhe ab Oberkante der Seitenfläche), bei `resize` neu rechnen; prüfbar: Screenshots in zwei Fenstergrößen füllen die Höhe aus

## 2. Bedienung

- [x] 2.1 Zoomgruppe `− [nn %] + Einpassen` in `renderPager` (vor `opts.extra()`), Klick-Handler im vorhandenen Pager-Listener, aktiver Betrachter zeigt neu; Stil in `.pager`
- [x] 2.2 Tasten `+`/`=`, `-`, `0` im `keydown`-Handler, nur ohne Strg/Cmd/Alt und nicht in Eingabefeldern/Dialogen
- [x] 2.3 Texte `pager.zoomIn`, `pager.zoomOut`, `pager.zoomReset`, `pager.zoomFit` in `data/lang/de.js` und `data/lang/en.js`
- [x] 2.4 Nach Ein-/Ausklappen der Seitenleisten bei „Einpassen“ prüfen, ob neu gerechnet wird; sonst `ResizeObserver` auf `root` (nicht nötig: `toggleSide` ruft schon `show()` auf)

## 3. Prüfen

- [x] 3.1 Chrome headless: Buch, Lehrheft, „Vom Gebet“ bei 100 %, 150 %, Einpassen – Blätterleiste und Verzeichnis gleich groß, Seiten größer (Screenshots)
- [x] 3.2 Mess-Seite/Test: Seitenumbrüche und `--fit` aller Seiten eines Buches und des Lehrhefts bei 100 % und 175 % identisch (`tools/test-browser.mjs` erweitern)
- [x] 3.3 print-to-pdf bei 175 % gleich groß wie bei 100 %
- [x] 3.4 Schmales Fenster (~400 px): bei 100 % verkleinerte Seite wie bisher, bei 200 % waagrecht verschiebbar, Kopf bleibt fensterbreit; Blätterposition bleibt beim Zoomen erhalten

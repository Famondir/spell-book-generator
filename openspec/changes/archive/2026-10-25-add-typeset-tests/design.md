## Context

Die App ist statisch (kein Build, `file://`), gesetzt wird im Browser: `BOOK.typeset` füllt Seiten, `fit` passt feste Seiten an, `flow` bricht fließende Seiten auf Folgeseiten um. Ob das Ergebnis stimmt, hängt an echter Schrift und echtem Layout, also an einem Browser. Während des Lehrheft-Changes sind dafür Wegwerf-Skripte im Scratchpad entstanden: Testseiten aus `index.html` erzeugen, Chrome per DevTools-Protokoll steuern, Überlauf zählen, Zeiten messen. Dieser Change macht daraus ein festes Werkzeug im Repo.

Der Folgechange „Seitenbetrachter und Satzmodul verallgemeinern“ baut `flow`/`fit` und die beiden Blätteransichten um. Die Tests müssen vorher laufen und Sollwerte haben, damit nach dem Umbau dieselben Seiten herauskommen.

## Goals / Non-Goals

**Goals:**
- Ein Befehl prüft alle Druckaufträge in typischen Einstellungen auf feste Regeln und auf Abweichungen vom festgehaltenen Stand.
- Keine neuen Abhängigkeiten, kein Build; Node ab 22 und Chrome genügen.
- Unabhängig vom Browserzustand und vom persönlichen Profil des Nutzers.
- Fehlermeldungen, die direkt sagen, welche Seite in welchem Fall.

**Non-Goals:**
- Pixelvergleich von Screenshots (zu empfindlich für Schrift-Rendering; der Fingerabdruck der Umbrüche reicht für den Zweck).
- Unit-Tests einzelner Textgeneratoren (`textgen`, `theory`); das wäre ein eigener, leichter Lauf ohne Browser.
- Pixelgenaue Prüfung der Oberfläche; Bedienungstests prüfen Zustand und Text, nicht Aussehen.
- CI-Einbindung; der Lauf ist für lokal gedacht (eine GitHub Action wäre später einfach nachzurüsten).

## Decisions

**Chrome über das DevTools-Protokoll, nicht Puppeteer/Playwright.** Node 22+ hat `WebSocket` und `fetch` eingebaut; ein kleiner Client (Befehl senden, auf Antwort warten, Konsole mitlesen) ist rund 60 Zeilen. Puppeteer bräuchte `npm install` und lädt ein eigenes Chromium; das widerspricht „kein Build, keine Abhängigkeiten“. Alternative `--dump-dom` mit `--virtual-time-budget` verworfen: virtuelle Zeit verfälscht Zeitmessung, und es gibt keine Rückkanäle.

**Chrome finden:** `CHROME` aus der Umgebung, sonst der Reihe nach `google-chrome`, `google-chrome-stable`, `chromium`, `chromium-browser` im `PATH`, sonst Standardpfade unter macOS/Windows. Start mit `--headless=new`, `--remote-debugging-port=0` (freier Port aus `DevToolsActivePort` im Profilordner), `--user-data-dir=<tmp>`, `--allow-file-access-from-files`, fester Fenstergröße 1600×1100 und `deviceScaleFactor` 1.

**Seiten über eine Testschnittstelle statt über Klicks.** `window.APP_TEST` in `app.js`:
- `load({ book, settings })`: setzt `state.book` (Namen → IDs) und `state.settings` (Vorgaben plus Fall) nur im Speicher, leert die Caches (`bookAll`, `primerData`, Druck-Cache).
- `pages(kind)`: liefert die Seitenliste wie der Druckknopf: `book` (je Band, mit `vol`), `rules`, `scrolls`, `primer`, `checks`.
- `version`: Kennung der Schnittstelle.
Das hält die Tests von DOM-Details der Oberfläche fern und prüft genau den Weg, der gedruckt wird. Gesetzt wird im Test mit `BOOK.typeset` in einen eigenen Container mit den Klassen des Druckwegs (`paper-a4` usw.), nicht im `#print-root` und ohne `window.print`.

**Klasse und Profil vor dem Laden festlegen.** `DIVINE` und das Profil werden beim Laden bestimmt. Für Klassenfälle schreibt der Lauf vor der Navigation per `Page.addScriptToEvaluateOnNewDocument` einen Charakter-Slot (`spellbook.chars`, `spellbook.activeChar`) in den frischen `localStorage`. Das lokale Profil wird ausgeblendet, indem dasselbe Skript `PROFILE_LOCAL` und `PROFILES_LOCAL` als nicht beschreibbare, leere Eigenschaften von `window` anlegt; die Zuweisung in `profile.local.js` läuft dann ins Leere. Fälle mit gleicher Klasse teilen sich eine geladene Seite; zwischen ihnen genügt `APP_TEST.load`.

**Fingerabdruck der Umbrüche.** Je Seite eine kurze Kennung, womit sie beginnt: `S:<zauber-id>` für Zauberseiten (mit `#n` für die n-te Seite eines Zaubers), `L:<lektion>` oder `L:<lektion>+` (Fortsetzung) im Lehrheft, `B` für Leerseiten, sonst `T:<erste 24 Zeichen Text>`. Gespeichert als Liste je Fall. Das erkennt verschobene Umbrüche, ohne an Schriftpixeln zu hängen. Verglichen wird elementweise; gemeldet wird die erste Abweichung und die Differenz der Seitenzahl.

**Sollwerte als JSON im Repo.** `tools/test-baseline.json`: `{ chrome: "<Hauptversion>", cases: { <name>: { pages, prints: [...] } } }`. Mit `--with-profile` eine getrennte Datei `tools/test-baseline.local.json`, die gitignored ist (sie spiegelt das persönliche Profil). `--update` schreibt nur die gelaufenen Fälle und behält die übrigen.

**Feste Regeln im Browser prüfen.** Ein Prüfskript läuft nach dem Setzen in der Seite und liefert eine Liste `{ rule, page, detail }`: Überlauf (`scrollHeight > clientHeight + 1` je `.page-inner` und `.half`), fortlaufende Nummern, leere `.flow-cont`, `.keep-next` als letztes sichtbares Element einer Seite (auch im letzten teilbaren Abschnitt), kleine Formel = eine Seite (`.formula-page` ohne Folgeseite), Lochrand (`.bind`: `verso` genau bei gerader Nummer; `.recto-start` ungerade), Bandgrenze (Seitenzahl je Band ≤ `maxPages`, außer der Band trägt den Hinweis auf ein geteiltes Kapitel).

**Testfälle als Daten.** `tools/test-cases.mjs` exportiert `books` (benannte Testbücher: `leer`, `klein` als feste Namensliste über die Grade 0–3, `gross` als Auswahl „alle Zaubertricks und Alltagszauber“, `voll` mit mehreren Graden für Bände) und `cases` (Name, Buch, Einstellungen, Klasse, Druckauftrag, Zeitgrenze). Feste Namenslisten statt „die ersten n“, damit Datenaktualisierungen die Auswahl nicht verschieben.

**Bedienungstests mit kleinen Schritt-Helfern.** Ein Bedienungsfall ist eine `async`-Funktion im Fall-Datei, die ein Helferobjekt bekommt: `t.click(sel)`, `t.key(name)`, `t.type(sel, text)`, `t.resize(w, h)`, `t.until(js, ms)` (warten, bis ein Ausdruck wahr ist, z. B. „fertig gesetzt“), `t.eval(js)`, `t.expect(schritt, js, soll)`. Klicks laufen über `element.click()` in der Seite (stabil, unabhängig von Koordinaten), Tasten über `Input.dispatchKeyEvent`, die Fenstergröße über `Emulation.setDeviceMetricsOverride`. Vor jedem Bedienungsfall lädt der Lauf die Seite neu (frischer Zustand, aber derselbe Browser), setzt Buch und Einstellungen über `APP_TEST.load` und wählt die Ansicht. Erwartungen lesen den sichtbaren Zustand (Text der Blätterleiste, sichtbare Seiten ohne `.offstage`, Klassen wie `.collapsed`, `.on`), nicht interne Variablen; so bleiben sie nach dem Umbau der Blätteransichten gültig. Selektoren, die der Umbau ändern darf, stehen an einer Stelle (`ui`-Tabelle im Fall-Datei), damit nur sie angepasst werden müssen.

**Ein Lauf für beides.** Satz- und Bedienungsfälle teilen Chrome-Start, Neutralisierung, Ausgabe und Exit-Code; `--only satz` bzw. `--only ui` wählt eine Art. Name des Werkzeugs daher `tools/test-browser.mjs`.

**Zeitgrenzen großzügig.** Vorgabe 10 s je Fall, für bekannte Brocken eigene Werte (z. B. Lehrheft groß 8 s; heute rund 1 s). Ziel ist, Rückfälle um ein Vielfaches zu erkennen, nicht Millisekunden zu vergleichen.

**Ausgabe.** Je Fall eine Zeile `ok  buch-klein-a5  34 S.  0,8 s` oder `FEHLER …` mit den Meldungen darunter; am Ende eine Summe. `--json` gibt alles maschinenlesbar aus (für spätere CI).

## Risks / Trade-offs

- [Andere Chrome-Version bricht Zeilen minimal anders] → Chrome-Hauptversion in den Sollwerten; bei Abweichung Hinweis statt stiller Fehler. Feste Regeln gelten unabhängig davon.
- [Schriften nicht geladen beim Messen] → `typeset` wartet schon auf `document.fonts.ready`; der Lauf wartet zusätzlich darauf, bevor er misst. Alle Schriften liegen lokal in `app/fonts`.
- [Testschnittstelle driftet vom echten Druckweg ab] → `pages(kind)` ruft dieselben Funktionen wie die Druckknöpfe auf; die Knöpfe werden auf diese Funktionen umgestellt, sodass es nur einen Weg gibt.
- [Sollwerte werden reflexhaft mit `--update` überschrieben] → Ausgabe zeigt bei Abweichung die erste betroffene Seite; README empfiehlt, vor `--update` die Seite in der App anzusehen.
- [Datenänderungen (neue Zauber, Texte) verschieben Umbrüche] → feste Namenslisten; nach bewussten Text-Changes ist `--update` erwartet und gehört in denselben Commit.
- [Laufzeit des ganzen Laufs] → Fälle gleicher Klasse in einer Seite; Ziel unter einer Minute für alle Fälle.

## Migration Plan

Keine Migration: neues Werkzeug, die App ändert sich für Nutzer nicht. Reihenfolge: Schnittstelle und Lauf bauen, Sollwerte auf dem Stand nach dem Lehrheft-Commit erzeugen, committen. Der Folgechange vergleicht gegen genau diese Sollwerte.

## Open Questions

- Soll der Prüfbogen-Fall die Seitenverweise mitprüfen (erfordert das gesetzte Heft im selben Lauf)? Vorschlag: ja, als eigener Fall nach dem Lehrheft-Fall.
- Soll der Lauf zusätzlich ein PDF je Fall ablegen können (`--pdf <ordner>`) zum Durchblättern bei Abweichung? Vorschlag: ja, optional, über `Page.printToPDF`.

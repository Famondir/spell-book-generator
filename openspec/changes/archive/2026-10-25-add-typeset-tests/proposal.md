## Why

Das Setzen der Seiten ist der empfindlichste Teil der App: Autofit, fließende Seiten mit Folgeseiten, teilbare Abschnitte, `.keep-next`, erzwungene Umbrüche, Leerseiten vor rechten Seiten, Lochrand, Bände. Fehler fallen bisher nur auf, wenn jemand durchblättert: Überlauf bei den Schnellglyphen, eine verwaiste Überschrift, 14 Sekunden für „Kleine Formeln“. Als Nächstes sollen Seitenbetrachter und Satzmodul verallgemeinert werden. Dafür braucht es vorher einen festgehaltenen Ist-Stand, gegen den man nach dem Umbau vergleicht: gleiche Seitenzahlen, gleiche Umbrüche.

## What Changes

- **Satz-Testlauf** `tools/test-browser.mjs`: steuert ein headless Chrome über das DevTools-Protokoll, ohne neue Abhängigkeiten (Node ab 22 bringt `fetch` und `WebSocket` mit). Ein Aufruf setzt alle Testfälle und meldet je Fall bestanden oder nicht; der Exit-Code ist ungleich 0, wenn etwas fehlschlägt.
- **Testfälle als Matrix** aus festen Testbüchern (leer, klein, groß) und Einstellungssätzen (Papierformat, Kapitel, Beginn links, ausführliche Fassung, Seiten je Band, Lochrand, Paladin) über die Druckaufträge Buch, Regelband, Schriftrollen, Lehrheft und Prüfbogen.
- **Feste Regeln**, die immer gelten müssen: keine Seite läuft über, Seitenzahlen fortlaufend, keine leere Folgeseite, keine Überschrift allein am Seitenende, jede kleine Formel genau eine Seite, Lochrand und rechte Seiten stimmen mit der Seitenzahl überein, Bände halten die Höchstseitenzahl ein.
- **Sollwerte** (`tools/test-baseline.json`): je Fall Seitenzahl und ein Fingerabdruck der Umbrüche (womit jede Seite beginnt). Abweichungen werden mit der ersten abweichenden Seite gemeldet; `--update` übernimmt den neuen Stand bewusst.
- **Zeitgrenze** je Fall, damit Rückfälle beim Tempo auffallen.
- **Neutral und reproduzierbar:** Der Lauf nutzt ein frisches Browserprofil, rührt den `localStorage` des Nutzers nicht an und blendet `data/profile.local.js` aus (außer mit `--with-profile`).
- **Bedienungstests** im selben Lauf: Fälle, die die Oberfläche bedienen (Reiter wechseln, blättern, Seitenzahl eingeben, zum nächsten Zauber springen, Verzeichnis anklicken, Seitenleiste ein- und ausklappen, Fenster verkleinern, Einstellungsdialog) und den sichtbaren Zustand prüfen. Sie sind der Maßstab für den Umbau der Blätteransichten, so wie die Sollwerte für den Satz.
- **Kleine Testschnittstelle in der App** (`window.APP_TEST`): Testbuch und Einstellungen setzen, ohne zu speichern, und die Seitenlisten der Druckaufträge abfragen, genau wie die Druckknöpfe sie erzeugen.

## Capabilities

### New Capabilities
- `typeset-tests`: Browser-Testlauf mit Satz- und Bedienungstests, Testfälle, feste Regeln, Sollwerte mit Vergleich und Aktualisierung, Zeitgrenze, neutrale Umgebung, Testschnittstelle der App.

### Modified Capabilities
<!-- keine: das Verhalten der App für Nutzer ändert sich nicht -->

## Impact

- Neu: `tools/test-browser.mjs`, `tools/test-cases.mjs` (Testfälle), `tools/test-baseline.json` (Sollwerte); Abschnitt im README.
- `app/js/app.js`: `window.APP_TEST` (nur Lesen und flüchtiges Setzen, keine neue Funktion für Nutzer).
- Keine Laufzeitabhängigkeit, kein Build-Schritt; die App selbst bleibt per Doppelklick lauffähig.
- Voraussetzung zum Ausführen: Node ab 22 und ein installiertes Chrome oder Chromium.
- Folgechange „Seitenbetrachter und Satzmodul verallgemeinern“ nutzt die Sollwerte als Vergleich vorher/nachher.

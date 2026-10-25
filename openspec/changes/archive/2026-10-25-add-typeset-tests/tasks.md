## 1. Testschnittstelle der App

- [x] 1.1 `window.APP_TEST` in `app.js`: `load({ book, settings })` (Namen → IDs, Vorgaben + Fall, nur im Speicher, Caches leeren), `pages(kind)` für `book` (je Band), `rules`, `scrolls`, `primer`, `checks`, `version`
- [x] 1.2 Druckknöpfe auf dieselben Seitenfunktionen umstellen, damit Test und Druck einen Weg teilen; prüfen: `localStorage` bleibt nach `load` unverändert

## 2. Testlauf

- [x] 2.1 `tools/test-browser.mjs`: Chrome finden (`CHROME`, PATH, Standardpfade), mit frischem Profil und freiem Port starten, DevTools-Client (Befehle, Konsole, Ausnahmen), sauber beenden auch bei Fehlern
- [x] 2.2 Vor dem Laden per `addScriptToEvaluateOnNewDocument`: lokales Profil ausblenden (außer `--with-profile`), Charakter-Slot für die Klasse des Falls anlegen
- [x] 2.3 Je Fall: `APP_TEST.load`, Seiten holen, in einen Container mit den Klassen des Druckwegs setzen, Dauer messen; Fälle gleicher Klasse in einer Seite
- [x] 2.4 Optionen `--only`, `--update`, `--with-profile`, `--json`, `--pdf <ordner>`; Ausgabe je Fall eine Zeile, Summe, Exit-Code

## 3. Prüfungen

- [x] 3.1 Feste Regeln im Browser: Überlauf, fortlaufende Nummern, leere Folgeseiten, `.keep-next` am Seitenende, kleine Formel = eine Seite, Lochrand/`verso`/`.recto-start`, Bandgrenze
- [x] 3.2 Fingerabdruck der Umbrüche (`S:`/`L:`/`B`/`T:`) und Vergleich mit Sollwerten: erste Abweichung mit Soll/Ist, Differenz der Seitenzahl, Hinweis bei anderer Chrome-Hauptversion
- [x] 3.3 Zeitgrenze je Fall (Vorgabe 10 s, eigene Werte möglich)
- [x] 3.4 Gegenprobe: jede Regel einmal absichtlich brechen (z. B. CSS-Höhe ändern, `keep-next` entfernen) und prüfen, dass der Lauf sie meldet

## 4. Testfälle und Sollwerte

- [x] 4.1 `tools/test-cases.mjs`: Testbücher `leer`, `klein`, `gross`, `voll` als feste Namenslisten bzw. benannte Auswahl
- [x] 4.2 Fälle: Buch A5/A4/A4 quer, Kapitel aus, Beginn links, ausführliche Fassung, Seiten je Band; Regelband; Schriftrollen A4/A5; Lehrheft mit und ohne Lochrand, klein und groß; Prüfbogen mit Seitenverweisen; Paladin mit Gebetbuch
- [x] 4.3 Sollwerte auf dem Stand nach dem Lehrheft-Commit erzeugen (`tools/test-baseline.json`), `test-baseline.local.json` in `.gitignore`; zweiter Lauf ohne `--update` besteht; Gesamtdauer unter einer Minute

## 5. Bedienungstests

- [x] 5.1 Schritt-Helfer (`click`, `key`, `type`, `resize`, `until`, `eval`, `expect`), Neuladen vor jedem Fall, Selektor-Tabelle
- [x] 5.2 Fälle Buch: blättern, Ende, Seitenzahl eingeben, nächster Zauber, Pfeiltasten, Doppelseite/Einzelseite, Verzeichnis (aufklappen, anklicken), Seitenleisten
- [x] 5.3 Fälle Lehrheft und Lehre: Wechsel Lehre/Lehrheft, Teil und Lektion anklicken, blättern mit Verzeichnis-Hervorhebung, Einklappen des Verzeichnisses
- [x] 5.4 Fall Einstellungsdialog: Abschnitt wechseln, Lochrand ausschalten wirkt aufs Lehrheft
- [x] 5.5 Gegenprobe: eine Erwartung absichtlich falsch, Meldung mit Schritt, Soll und Ist

## 6. Doku

- [x] 6.1 README: Abschnitt „Browser-Tests“ (Satz und Bedienung: Voraussetzungen, Aufruf, Optionen, wann `--update`)
- [x] 6.2 Backlog-Eintrag „Satz-Tests“ entfernen; im Eintrag „Seitenbetrachter und Satzmodul verallgemeinern“ auf die Sollwerte verweisen

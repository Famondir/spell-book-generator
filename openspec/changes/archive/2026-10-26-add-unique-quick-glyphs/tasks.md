## 1. Wortschatz

- [x] 1.1 Wortlisten in `data/formula-lang/latin.js` nach Design (Entscheidung 5) ersetzen, sodass jede Schul- und Essenzliste eindeutige Anfangsbuchstaben hat
- [x] 1.2 `THEORY.ESS[].words` in `app/js/theory.js` gleichziehen
- [x] 1.3 Prüfwerkzeug `tools/quick-glyph-check.mjs` anlegen; erster Teil meldet doppelte Anfangsbuchstaben je Liste (prüfbar: Werkzeug läuft fehlerfrei)

## 2. Eindeutige Kernzeile

- [x] 2.1 `coreChoice(m)` in `app/js/textgen.js`: Glyphenschlüssel, Wunschpaar aus eigenem Generator, Zuordnung je Klassenliste plus Alltagszauber, nach ID sortiert, einmal berechnet und gemerkt
- [x] 2.2 `formula()` zieht Verb und Essenzwort weiter aus `r` und setzt für Latein die Wahl aus `coreChoice` ein; über `TEXTGEN` nach außen geben
- [x] 2.3 Prüfen, dass sich bei kollidierenden Zaubern nur die Kernzeile ändert (Vergleich der übrigen Zeilen gegen den alten Snapshot im Prüfwerkzeug oder einmalig per Skript)

## 3. Schnellglyphe

- [x] 3.1 Kreis nach Dauer (acht Formen) in `quickGlyph`
- [x] 3.2 Gestaltstriche für alle 18 Gestaltarten, Zielzahl 1/2/3+ bei Zielen; Berührung als Pfeil nach innen
- [x] 3.3 Absichtsbuchstaben aus `coreChoice` neben der Schulfigur; Lage je Schule (Standard links/rechts, Erkenntnis und Illusion oben/unten, Universal obere Diagonalen)
- [x] 3.4 Feinlage per Screenshot abstimmen: alle Schulen × Dauerformen × einige Gestalten auf einer Mess-Seite, keine Berührung von Buchstaben, Figur, Ringen, Gradpunkten und Strichen
- [x] 3.5 `circle.js` in `tools/lib/load-app.mjs` optional laden können; zweiter Teil des Prüfwerkzeugs: für jede Klassenliste (alle Klassen mit Zauberliste) Schnellglyphen rendern und auf Eindeutigkeit prüfen; Rückgabecode ≠ 0 bei Doppelten

## 4. Erklärungen

- [x] 4.1 `QUICK_RULES` in `app/js/legend.js`: alle Kreisformen, Gestaltstriche, Zielzahl, Absichtsbuchstaben
- [x] 4.2 Erklärsatz zur Schnellglyphe in `app/js/book.js` (Zauberseite) um Dauerform und Buchstaben ergänzen; Vorspann-Abschnitt Schnellglyphen prüfen
- [x] 4.3 Lehrheft-Lektion Schnellglyphen (`data/primer.js`): Absatz zu den Absichtsbuchstaben; Lektion im Browser ansehen

## 4b. Tafeln und Satz (nach Rückmeldung)

- [x] 4.4 Tafeln „Kreise nach der Dauer“ und „Gestaltstriche“ mit Vorschau (`QUICK_PART` in `circle.js`, `LEGEND.quickRings/quickShapes/tiles`) in Vorspann (eigene Seite für die Striche) und Lehrheft; Regeln verweisen darauf
- [x] 4.5 Lehrheft: Regeln als einzelne Listen (Umbruch zwischen Regeln), Zwischenüberschriften `keep-next`
- [x] 4.6 Satz: Abschnitt statt Leerseite vor `.recto-start` (`typeset.js`), Test `ui-lehrheft-leerseite-aufgelockert` mit 0–3 Alltagszaubern

## 5. Tests und Abschluss

- [x] 5.1 Prüfwerkzeug als Node-Fall in `tools/test-cases.mjs` eintragen
- [x] 5.2 Formel-Snapshot neu sichern (`node tools/formula-snapshot.mjs --save`, auch mit Profil)
- [x] 5.3 `node tools/test-browser.mjs` laufen lassen, Baseline bei erwarteten Seitenverschiebungen neu sichern
- [x] 5.4 Kirrans Buch im Browser durchsehen (Verzeichnis, Tageszettel, Zauberseite, Lehrheft)

## 1. Prüfung

- [x] 1.1 `tools/quick-glyph-check.mjs`: je Klassenliste doppelte Kurz- und Langformeln als Fehler, Kennzahlen zu Kernzeile, Gesten und Komponenten zur Kenntnis
- [x] 1.2 Prüfung der Wortlisten für alle Sprachen: Listenlänge wie Latein bei `aligned: true`, eigener Anlaut je Liste über `onsets`, Hinweis bei nicht ausgerichteten Sprachen
- [x] 1.3 `tools/formula-lang-check.mjs`: `aligned`, `onsets` und `stems` als bekannte, optionale Schlüssel zulassen, `stems` parallel zur Wortliste prüfen

## 2. Gemeinsame Wahl

- [x] 2.1 `coreChoice(m)` gibt zusätzlich die Plätze `[i, j]` zurück
- [x] 2.2 `formula()`: Bei ausgerichteter Sprache Verb und Essenzwort auf den Plätzen der Wahl, Ziehfolge unverändert; Latein wie bisher
- [x] 2.3 `buildCoreMap`: zweite Sperrmenge für einzeilige Formeln je Schule, Hauptessenz und Gestaltart
- [x] 2.4 Formel-Snapshot ohne Profil vergleichen: keine Änderung erwartet; Abweichungen begründen

## 3. Fachzeile

- [x] 3.1 `formula.tech` in `generateTexts` (lateinische Kernzeile aus der Wahl, leer bei Latein)
- [x] 3.2 `formulaBlock` in `app/js/book.js` und Stil in `app/style.css`; Zauberseite und Rückseite im Browser ansehen
- [x] 3.3 Erklärsatz zur Schnellglyphe und Lehrheft-Lektion: Buchstaben stammen aus der Fachformel

## 4. Wortlisten ausrichten (je Sprache ein Commit mit Snapshot)

- [x] 4.1 Bantu-Lautbild (erfunden; trägt die gemessenen Doppelungen)
- [x] 4.2 Technik (erfunden)
- [x] 4.3 Griechisch (`onsets`: Hauchlaut, φ θ χ ψ)
- [x] 4.4 Altirisch
- [x] 4.5 Walisisch (`onsets`: ll, dd, ch, ff …)
- [x] 4.6 Hethitisch (`onsets`: ḫ, š)
- [x] 4.7 Urindogermanisch (Lautschrift des Lexikons maßgeblich)
- [x] 4.8 Akkadisch
- [x] 4.9 Sumerisch
- [x] 4.10 Ägyptisch (`onsets`: ḫ, š, ḏ, ṯ …)
- [x] 4.11 Quellen und Umschreibungen je Sprache in `data/research/formel-lexika.md` festhalten

## 5. Brückennotizen

- [x] 5.1 `stems` in den indogermanischen Lexika für belegte Verwandtschaften der Kernwörter
- [x] 5.2 Brückennotiz zum Kernwort: gedrucktes Essenzwort neben dem lateinischen Wort desselben Platzes, Stamm wenn hinterlegt; Randnotiz-Regeln beachten
- [x] 5.3 Im Buch mit Profil eine Brückennotiz zum Kernwort ansehen

## 6. Tests und Abschluss

- [x] 6.1 `node tools/quick-glyph-check.mjs` mit und ohne Profil grün
- [x] 6.2 Für mitgelieferte Sprachen ohne `aligned` aus dem Hinweis einen Fehler machen
- [x] 6.3 Formel-Snapshot mit und ohne Profil neu sichern, `node tools/test-browser.mjs`, Baseline bei erwarteten Seitenverschiebungen neu sichern
- [x] 6.4 Kirrans Buch im Browser durchsehen (Zauberseite mit Fachzeile, Tageszettel, Lehrheft)
- [x] 6.5 Backlog: Folge-Change „Schnellglyphen in Originalschrift“ eintragen (Silbenschriften, Ägyptisch, Urindogermanisch ohne Schrift, Schriftarten)

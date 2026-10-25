## 1. Gerüst (Stufe 1)

- [x] 1.1 `app/js/i18n.js`: `t()`, `b()`, Mehrzahl, `units.len()`, Rückfall auf die andere Sprache mit Konsolenwarnung; Sprachtabellen `data/lang/de.js` und `data/lang/en.js` per `<script>`
- [x] 1.2 Einstellungen `uiLang`, `bookLang`, `rulesLang`, `units`: Vorgabe aus `navigator.language`, Bestandsnutzer bleiben Deutsch; Abschnitt „Sprache“ im Einstellungsdialog
- [x] 1.3 `data-i18n` / `data-i18n-attr` in `index.html`, Übersetzen beim Start und nach dem Wechsel; Bedienungstest „Oberfläche umstellen“
- [x] 1.4 Testwerkzeug: Zähler fehlender Schlüssel in beiden Tabellen (Test schlägt fehl bei > 0); Satz- und Bedienungsfälle mit Sprachwahl

## 2. Oberfläche zweisprachig (Stufe 1)

- [x] 2.1 `index.html` und `app.js` (Reiter, Liste, Detailansicht, Einstellungen, Druck, Lizenzen, Meldungen) auf Schlüssel umstellen
- [x] 2.2 `prepare.js`, `stats.js`, `import.js`, `chars.js`, `viewer.js` (Blätterleiste) auf Schlüssel umstellen
- [ ] 2.3 Englische Tabelle vollständig; Bedienungstests laufen mit `uiLang = en` grün (Selektoren unabhängig vom Text)

## 3. Regelbegriffe (Stufe 2)

- [ ] 3.1 `app/js/rules-de.js`: Schulen, Unterschulen, Deskriptoren, Zeitaufwand, Komponenten-Kürzel, Reichweiten, Bereiche, Dauer, Rettungswurf, ZR; nicht Erkanntes bleibt englisch und wird gezählt
- [ ] 3.2 Abdeckungsbericht über alle Zauber (`tools/`), Schwelle ≥ 95 %; Liste der häufigsten nicht erkannten Werte
- [x] 3.3 Regeltext auf Abruf, Regelband und Werte in der Detailansicht nach `rulesLang` und `units`; Hinweis bei Deutsch ohne Regeldaten
- [ ] 3.4 Material-Komponenten: deutsche Fassung über `materialTags`, Rest englisch
- [ ] 3.5 Lizenzprüfung der öffentlichen Begriffsübersetzung (allgemeine Spielbegriffe, kein Regeltext) dokumentieren; README

## 4. Deutsche Regeldaten lokal (Stufe 3)

- [x] 4.1 `.gitignore`: `data/rules.de.local.js`; optionales Laden in `index.html` wie `profile.local.js`
- [x] 4.2 `tools/import-rules-de.mjs`: `pdftohtml -xml` (Schriftgröße, Lage, Einzug), Zerlegen an „Name (QUELLE Seite)“, Felder parsen, Absätze glätten (Seitenumbrüche, Silbentrennung, Tabellenzeilen)
- [x] 4.3 Kürzeltabellen: Klassen (MAG, HXM, KLE, DRU, BAR, PAL, WAL, …), Quellbücher (GRW, ABR I–VIII, EXP, …), Schulen und Unterschulen
- [x] 4.4 Fingerabdruck und Punktzahl, Schwelle mit Abstand; Handzuordnungen aus `PROFILE_LOCAL.rulesDe.overrides`
- [x] 4.5 Prüfliste `data/research/rules-de-review.md` (mehrdeutig, fehlend, überzählig); Stichprobe von 30 Zuordnungen von Hand prüfen
- [x] 4.6 App liest `RULES_DE`: Namen, Werte, Regeltext, Quelle; Rückfall pro Zauber
- [x] 4.7 Suche über deutsche und englische Namen, Anzeige nach `rulesLang`, Export unverändert englisch; Bedienungstest mit kleiner Test-Regeldatei
- [x] 4.8 Kirrans Einstellungen und Profil: `lang: "de"`, alle drei Ebenen Deutsch, Meter; Handzuordnungen für seine Zauberliste (`character/Zauberliste-1.xlsx`) bis keine offenen Treffer bleiben (offen sind nur 32 Zauber aus Quellen, die MyPFDB nicht enthält: Paizo-Blog, Abenteuerpfade, Player Companions nach 2019)

## 5. Englische In-Game-Texte (Stufe 4)

- [ ] 5.1 Stilnotiz `data/lang/README.md` mit Mustersätzen je Textart (Ton, klassische Lehre, keine Meta-Texte)
- [ ] 5.2 `textgen.js` in Kern und Phrasenmodule teilen (`textgen.de.js`, `textgen.en.js`); deutsche Sollwerte unverändert
- [ ] 5.3 Englische Pools: Titel, Beinamen, Zusammenfassung, Theorie, Gesten, Schritte, Fehlschläge, Aufbau, Randnotizen
- [ ] 5.4 `theory.js`, `legend.js`, `book.js` (Kapitel, Vorspann, Füllseiten, Kolumnentitel): `en`-Felder bzw. Tabellen
- [ ] 5.5 `prayer.js` und Gottheitstexte (`data/deities.js`) englisch; Brevier mit `bookLang = en`
- [ ] 5.6 Neutrales Profil (`data/profile.js`) mit `en`-Unterobjekt; Profilregel „einsprachig“ mit Hinweis im Dialog
- [ ] 5.7 Test: Kreise in beiden Sprachen gleich (SVG-Fingerabdruck), Texte deterministisch; Sollwerte `buch-klein-en`, `brevier-paladin-en`

## 6. Lehrheft und Alltagszauber englisch (Stufe 5)

- [ ] 6.1 `data/primer.en.js` (gleiche Ids): Vorspann, Lesestücke, Glossar, Kästen, Aufgaben, Prüfkriterien
- [ ] 6.2 Erzeugte Teile des Lehrhefts (Formulare, Zuschnitt, Prüfbogen) über Tabellen
- [ ] 6.3 `data/everyday_spells.en.js`: Namen, Regeltext, Flavour; Suche findet beide Namen
- [ ] 6.4 Zähler unübersetzter Felder im Test = 0; Sollwerte `lehrheft-klein-en`, `pruefbogen-klein-en`

## 7. Abschluss

- [ ] 7.1 Ganze App auf Englisch durchklicken und drucken (Buch, Regelband, Rollen, Lehrheft, Brevier); Funde beheben
- [ ] 7.2 README zweisprachig (Kurzfassung englisch), Backlog-Eintrag „Deutsche Regeltexte (MyPFDB) und zweisprachige App“ entfernen
- [ ] 7.3 Veröffentlichung prüfen: `tools/publish.sh` im Trockenlauf enthält keine deutschen Regeldaten

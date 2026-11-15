## 1. Gerüst (Stufe 1)

- [x] 1.1 `app/js/i18n.js`: `t()`, `b()`, Mehrzahl, `units.len()`, Rückfall auf die andere Sprache mit Konsolenwarnung; Sprachtabellen `data/lang/de.js` und `data/lang/en.js` per `<script>`
- [x] 1.2 Einstellungen `uiLang`, `bookLang`, `rulesLang`, `units`: Vorgabe aus `navigator.language`, Bestandsnutzer bleiben Deutsch; Abschnitt „Sprache“ im Einstellungsdialog
- [x] 1.3 `data-i18n` / `data-i18n-attr` in `index.html`, Übersetzen beim Start und nach dem Wechsel; Bedienungstest „Oberfläche umstellen“
- [x] 1.4 Testwerkzeug: Zähler fehlender Schlüssel in beiden Tabellen (Test schlägt fehl bei > 0); Satz- und Bedienungsfälle mit Sprachwahl

## 2. Oberfläche zweisprachig (Stufe 1)

- [x] 2.1 `index.html` und `app.js` (Reiter, Liste, Detailansicht, Einstellungen, Druck, Lizenzen, Meldungen) auf Schlüssel umstellen
- [x] 2.2 `prepare.js`, `stats.js`, `import.js`, `chars.js`, `viewer.js` (Blätterleiste) auf Schlüssel umstellen
- [x] 2.3 Englische Tabelle vollständig; Bedienungstests laufen mit `uiLang = en` grün (Selektoren unabhängig vom Text) (`tools/test-browser.mjs --ui-lang en`: 86/86; vier Erwartungen auf Sprachtabellen umgestellt; Fund: Sprachname beim Entziffern in „Heute vorbereitet“ folgte der Buch- statt der Oberflächensprache)

## 3. Regelbegriffe (Stufe 2)

- [x] 3.1 Begriffe in `app/js/rules.js` (statt eigener Datei `rules-de.js`): Wert in Stücke an „;“, „,“, „or“, „and“ (Klammern geschützt), Phrasenparser für Ziele/Effekte (Menge, Adjektive, Nomen mit Geschlecht, „touched“), Flächen, Einheiten (m, km, m²); Schulen, Unterschulen, Deskriptoren, Zeitaufwand, Komponenten-Kürzel, Reichweiten, Bereiche, Dauer, Rettungswurf, ZR; nicht Erkanntes bleibt englisch und wird gezählt
- [x] 3.2 Abdeckungsbericht über alle Zauber (`tools/rules-terms-coverage.mjs`), Schwelle ≥ 95 % (erreicht: 95,5 %; Ziel/Effekt/Bereich als Freitext am schwächsten); Liste der häufigsten nicht erkannten Werte; Bedienungstest „ui-regelbegriffe“
- [x] 3.3 Regeltext auf Abruf, Regelband und Werte in der Detailansicht nach `rulesLang` und `units`; Hinweis bei Deutsch ohne Regeldaten
- [x] 3.4 Material-Komponenten: deutsche Fassung über `materialTags`, Rest englisch
- [x] 3.6 Freie Feldwerte: Tabelle `data/lang/rules-terms.de.js` (eigene Übersetzung, ~880 Werte, Längen als „N ft.“ für die Umrechnung); Durchsicht der regelbasierten Fassungen (Artikel, „touched“ für beide Glieder, Semikolon zwischen Rettungswürfen, 1W4, Kleinschreibung mitten im Wert); Zähler erkennt unveränderte englische Eingabewörter; Abdeckung 100 %
- [x] 3.5 Lizenzprüfung der öffentlichen Begriffsübersetzung (allgemeine Spielbegriffe, kein Regeltext) dokumentieren; README

## 4. Deutsche Regeldaten lokal (Stufe 3)

- [x] 4.1 `.gitignore`: `data/rules.de.local.js`; optionales Laden in `index.html` wie `profile.local.js` (später umbenannt in `data/rules.de.js` und veröffentlicht, siehe 7.3)
- [x] 4.2 `tools/import-rules-de.mjs`: `pdftohtml -xml` (Schriftgröße, Lage, Einzug), Zerlegen an „Name (QUELLE Seite)“, Felder parsen, Absätze glätten (Seitenumbrüche, Silbentrennung, Tabellenzeilen)
- [x] 4.3 Kürzeltabellen: Klassen (MAG, HXM, KLE, DRU, BAR, PAL, WAL, …), Quellbücher (GRW, ABR I–VIII, EXP, …), Schulen und Unterschulen
- [x] 4.4 Fingerabdruck und Punktzahl, Schwelle mit Abstand; Handzuordnungen aus `PROFILE_LOCAL.rulesDe.overrides`
- [x] 4.5 Prüfliste `data/research/rules-de-review.md` (mehrdeutig, fehlend, überzählig); Stichprobe von 30 Zuordnungen von Hand prüfen
- [x] 4.6 App liest `RULES_DE`: Namen, Werte, Regeltext, Quelle; Rückfall pro Zauber
- [x] 4.7 Suche über deutsche und englische Namen, Anzeige nach `rulesLang`, Export unverändert englisch; Bedienungstest mit kleiner Test-Regeldatei
- [x] 4.8 Kirrans Einstellungen und Profil: `lang: "de"`, alle drei Ebenen Deutsch, Meter; Handzuordnungen für seine Zauberliste (`character/Zauberliste-1.xlsx`) bis keine offenen Treffer bleiben (offen sind nur 32 Zauber aus Quellen, die MyPFDB nicht enthält: Paizo-Blog, Abenteuerpfade, Player Companions nach 2019)

- [x] 4.9 `tools/import-domains-de.mjs`: MyPFDB „Alles zu Domänen“ → `data/domains.de.local.js` (gitignoriert); Zuordnung über Domänenzauber, Quellseite und Oberdomäne, eindeutig je englischer Unterdomäne; Prüfliste; Handzuordnungen `rulesDe.domainOverrides`
- [x] 4.11 Gegenprobe ohne Übersetzung (`tools/lib/textcheck.mjs`): Zahlen, Würfel, Längen (m/cm → ft), Boni des deutschen gegen den englischen Text; Zauber (733 bewertbar, keine Fehlzuordnung) und Domänenkräfte (136 bewertbar, ein Fehltreffer behoben: doppelter Eintrag „Entropie“ ≠ Demodand)
- [x] 4.10 `RULES.domain()`: Gottheitsseite mit Domänen und Unterdomänen in der Regelsprache (Begriffe ohne Daten); Bedienungstest mit kleiner Test-Domänendatei

## 5. Englische In-Game-Texte (Stufe 4)

- [x] 5.1 Stilnotiz `data/lang/README.md` mit Mustersätzen je Textart (Ton, klassische Lehre, keine Meta-Texte)
- [x] 5.2 `textgen.js` in Kern und Phrasenmodule teilen (`textgen.de.js`, `textgen.en.js`); deutsche Sollwerte unverändert (Kern legt die Zufallszüge fest, `TEXTGEN_LANG.<lang>(ctx)` je Sprache einmal gebaut; Theorie-Absätze mit fester `id`)
- [x] 5.3 Englische Pools: Titel, Beinamen, Zusammenfassung, Theorie, Gesten, Schritte, Fehlschläge, Aufbau, Randnotizen (dazu Entsprechungen, Zaubertinten, Kalibrierung, Übungsprotokoll, Herkunft, Brückennotizen; Zauberseiten, Kapitel, Kolumnentitel, Verzeichnis, Titelblatt und Füllseiten in `book.js` über Schlüssel `sp.*`/`book.*`)
- [x] 5.4 `theory.js`, `legend.js`, `book.js` (Kapitel, Vorspann, Füllseiten, Kolumnentitel): `en`-Felder bzw. Tabellen (Vorspann „Lehre der Kreise“, Legenden, Kreisbeschriftungen in circle.js)
- [x] 5.5 `prayer.js` und Gottheitstexte (`data/deities.js`) englisch; Brevier mit `bookLang = en` (Gebete, Kanon, Gottheitsseite, Brevier-Vorspann und -Kapitel; Sollwert `brevier-paladin-en`)
- [x] 5.6 Neutrales Profil (`data/profile.js`) mit `en`-Unterobjekt; Profilregel „einsprachig“ mit Hinweis im Dialog (`PROFILE.forLang`, `PROFILE.bookValue` für Besitzer/Titel/Untertitel; Alltagszauber aus dem Profil bleiben einsprachig)
- [x] 5.8 Tafel der Zeit: `data/time.js` (Woche, Tierkreis, Jahreszeiten, Monatsüberlieferung) mit `en`-Feldern; `time.js` (Lektionstexte, Beschriftungen von Jahresring und Sternkarte) über Tabellen
- [x] 5.9 Vademecum und Andacht: `data/vademecum.js` (Kapitel, Lückensätze, Hälftennamen) mit `en`-Feldern; `vademecum.js` und `devotion.js` (Choräle, Festkalender, Andachtsbild) über Tabellen; lokale Vademecum-Daten bleiben einsprachig (lokaler Vademecum-Inhalt nur in der Profilsprache, sonst dünne Fassung; Sollwerte `vademecum-*-en`)
- [x] 5.10 `vitrail.js` (Beschriftungen und Texte der Glasfenster) über Tabellen
- [x] 5.11 `scripts.js` und `lang.js`: Beschriftungen der Formelsprachen in der Buchsprache (Umschrift folgt schon der Buchsprache, prüfen) (Sprachnamen aus dem Profil nur in dessen Sprache)
- [x] 5.7 Test: Kreise in beiden Sprachen gleich (SVG-Fingerabdruck), Texte deterministisch; Sollwerte `buch-klein-en`, `brevier-paladin-en` — erledigt: `tools/bilingual-check.mjs` (Fall `node-zweisprachig`; fremde Formelsprachen: nur die Umschrift folgt der Buchsprache), Sollwert `buch-klein-en`; `brevier-paladin-en` mit 5.5

## 6. Lehrheft und Alltagszauber englisch (Stufe 5)

Lademodell: `data/primer.en.js` setzt `window.PRIMER_EN` (Teile, Kästen, Lektionen je Id); `data/everyday_spells.en.js` setzt `window.EVERYDAY_SPELLS_EN` (Schlüssel = deutscher Name, damit die Id bleibt). Fehlende Felder fallen auf Deutsch zurück und werden in `I18N.untranslated` gezählt. Prosa nach Stilnotiz und Glossar in `data/lang/README.md`.


- [x] 6.1 `data/primer.en.js` (gleiche Ids): Vorspann, Lesestücke, Glossar, Kästen, Aufgaben, Prüfkriterien; dazu die Lektionen `w-soap`, `w-seal`, `g-sigil` (eigene englische Beispielsätze für die Sigillen), `l-inks`; dazu Zaubertinten in `textgen.js` (Farbstoffe, Metallformen, Begründungen, Warnsatz) und Verweise als `{{lesson:<id>}}` (Zaubertinten über `TEXTGEN.LX(lang)`)
- [x] 6.2 Erzeugte Teile des Lehrhefts (Formulare, Zuschnitt, Prüfbogen) über Tabellen
- [x] 6.3 `data/everyday_spells.en.js`: Namen, Regeltext, Flavour; Suche findet beide Namen (Flavour als Randnotiz in der Buchsprache)
- [x] 6.4 Zähler unübersetzter Felder im Test = 0; Sollwerte `lehrheft-klein-en`, `pruefbogen-klein-en` (Fall `ui-englisch-unuebersetzt` prüft Buch, Lehrheft und Prüfbogen; Sollwerte `lehrheft-klein-en`, `pruefbogen-klein-en`)

## 7. Abschluss

- [ ] 7.1 Ganze App auf Englisch durchklicken und drucken (Buch, Regelband, Rollen, Lehrheft, Brevier); Funde beheben
- [x] 7.2 README zweisprachig (Kurzfassung englisch), Backlog-Eintrag „Deutsche Regeltexte (MyPFDB) und zweisprachige App“ entfernen (Backlog-Eintrag war schon entfernt)
- [x] 7.3 Veröffentlichung prüfen: deutsche Regeldaten nach PRD-FAQ (OGL-Freigabe durch Ulisses) veröffentlicht als `data/rules.de.js` und `data/domains.de.js`; Abschnitt 15 aus MyPFDB in `LICENSE-OGL.txt`, Ulisses-Vermerk und „keiner Abnahme“ in README, Datenköpfen und Quellenkasten; keine Rohdaten, Prüflisten oder privaten Profile im Baum

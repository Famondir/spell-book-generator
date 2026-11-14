## 1. Latein-Umzug ohne sichtbare Änderung

- [x] 1.1 Snapshot-Werkzeug `tools/formula-snapshot.mjs`: Formel, Langformel und Band aller Zauber (Buch und Alltagszauber) als JSON sichern und vergleichen
- [x] 1.2 Snapshot vom aktuellen Stand anlegen (neutrales Profil und `--with-profile`)
- [x] 1.3 `data/formula-lang/latin.js` mit allen lateinischen Bausteinen aus `textgen.js`, `theory.js` und dem Modell (Imperative, Essenzwörter, Gestalt, Weite, Dauer, Rettung, Ordnungen, Bindewörter, Schluss, Antworten)
- [x] 1.4 `app/js/lang.js`: Zeilen nach Satzmustern zusammensetzen; `textgen.formula()` und `longFormula()` darauf umstellen, Ziehfolge unverändert
- [x] 1.5 Snapshot-Vergleich grün; Testfall in `tools/test-cases.mjs`, der den Vergleich ausführt

## 2. Lautschrift und Sprachmodul

- [x] 2.1 `spell(word, readLang)` mit Ersetzungstabellen de/en, längste Treffer zuerst; Latein ausgenommen
- [x] 2.2 Satzmuster mit Verb am Ende und Verb – Gestalt – Essenz; Zeilenzahl unabhängig von der Sprache
- [x] 2.3 Vollständigkeitsprüfung `tools/formula-lang-check.mjs`: jede Schule, Essenz, Gestalt, Weite, Dauer und Rettung in jeder Sprache, keine leeren Bausteine, keine Setting-Eigennamen
- [x] 2.4 Laden in `index.html`: mitgelieferte Lexika, dazu `data/formula-lang/*.local.js` per `onerror`; Rückfall auf Latein mit einmaliger Konsolenmeldung; `.gitignore` ergänzen

## 3. Stationen und Verteilung

- [x] 3.1 Profilfelder `formulaOrigins`, `formulaLangNames` in `profile.js` (eine lateinische Station) und neutrales Beispiel in `profile.local.example.js`
- [x] 3.2 `lang.assign()`: Punktzahl, Quote nach größtem Rest, gierige Vergabe nach Vorsprung, Seed bei Gleichstand, Gradfenster, Zwischenspeicher je Buchinhalt
- [x] 3.3 Festlegung je Zauber über `custom_texts` (`origin` oder `lang`), angerechnet auf die Quote
- [x] 3.4 Formel, Langformel und Band nutzen die Sprache der Station; Herkunftszeile nennt die Fassung (entfällt bei Latein)
- [x] 3.5 Detailansicht zeigt Station und Sprache des Zaubers
- [x] 3.6 Tests: Quote (z. B. 12 % von 269 → 32), Gradfenster, Override, neutrales Profil unverändert

## 4. Lexika der ersten Welle

- [x] 4.1 Hethitisch (`hittite`)
- [x] 4.2 Mittelägyptisch (`egyptian`)
- [x] 4.3 Akkadisch (`akkadian`)
- [x] 4.4 Sumerisch (`sumerian`)
- [x] 4.5 Altirisch (`oldirish`)
- [x] 4.6 Archaisches Griechisch (`greek`)
- [x] 4.7 Urindogermanisch (`pie`)
- [x] 4.8 Mittelkymrisch (`welsh`)
- [x] 4.9 Technische Kunstsprache (`technic`)
- [x] 4.10 Klangsprache mit Bantu-Lautbild (`bantu`)
- [x] 4.11 Je Lexikon Kopfkommentar (Sprachstufe, Vereinfachungen, Familie) und Brückentabelle; Vollständigkeitsprüfung grün
- [x] 4.12 Sichtprüfung: je Sprache eine Buchseite und ein Kreis (Bandlänge, Tore) als Screenshot, de und en

## 5. Brückennotizen

- [x] 5.1 Brückennotizen in die Notizverteilung einspeisen (nur fremde Sprachen, höchstens eine je Seite, keine doppelt)
- [x] 5.2 Neutrale Vorlagen; eigene Vorlagen aus dem Profil
- [x] 5.3 Test: ganzes Buch mit Testprofil ohne doppelte Notizen

## 6. Hausregel Entziffern

- [x] 6.1 Profilfeld `decipher` (aus im neutralen Profil); Berechnung von Verhältnis und SG in `lang.js`
- [x] 6.2 Beherrschte Sprachen je Charakter (`knownLangs` in `chars.js`), Einstellung im Abschnitt „Charakter“ nur bei aktiver Hausregel
- [x] 6.3 Anzeige „Entziffern SG n (Sprache)“ in Detailansicht und „Heute vorbereitet“, nicht im Druck
- [x] 6.4 Tests: SG beherrscht/verwandt/fremd/tot mit Hand-Zuschlag; Sprache lernen ändert nur den SG

## 7. Privates Profil und Abschluss

- [x] 7.1 Kirrans Stationen, Sprachnamen, Hände und Hausregel in `profile.local.js` nach `data/research/lernorte-golarion.md`
- [x] 7.2 Bericht über die Verteilung (`data/research/formel-herkunft.md`): Zauber je Station, zum Durchsehen und für Festlegungen
- [x] 7.3 Präzisierung im Design von `add-bilingual-app`: Wörter gleich, Umschrift je Lesesprache
- [x] 7.4 README: Abschnitt Formelsprachen (Lautschrift, lokale Lexika, keine geschützten Kunstsprachen)
- [x] 7.5 Backlog: Abschnitt „Zaubersprachen“ auf Verweis kürzen; „Hausregel Sprachenkunde“ bleibt für den Würfelablauf
- [x] 7.6 Alle Testfälle grün, mit und ohne Profil; Veröffentlichungsprüfung ohne Setting-Namen

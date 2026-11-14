## 1. Daten und Profilfelder

- [x] 1.1 `data/time.js`: Wochenfolge mit Wandelsternen (wie Lektion „Der Wochenkreis“), irdische Tagesnamen, neutraler Tierkreis (12 Zeichen mit Datumsfenstern, Essenzen und Figuren), Domäne → Essenz; Schulen der Affinität folgen aus den Vorgaben der Schulen
- [x] 1.2 `data/profile.js`: neutrale Vorgaben für `calendar.dayNames`, `calendar.signs`, `calendar.patrons` (leer bzw. aus); Kommentar mit Format
- [x] 1.3 `data/profile.local.example.js`: neutrales Beispiel für die drei Felder
- [x] 1.4 Laden in `index.html`, Reihenfolge nach `deities.js` und `profile.js`
- [x] 1.5 `data/profile.local.js` (lokal): Tagesnamen, 13 Zeichen der Karawane mit Daten, zwölf Patrone als Ids aus `deities.js`; Quelle `data/research/zeit-und-sterne-golarion.md`

## 2. Zuordnung

- [x] 2.1 `app/js/time.js`: Zeitachse (Tage im Jahr aus `calendar.days`), Zeichen und Monate auf die Achse legen, Überlauf über die Jahresnaht
- [x] 2.2 Patron je Monat aus `calendar.patrons` und `window.DEITIES` lesen; unbekannte Id ohne Fehler überspringen
- [x] 2.3 Affinität: Monat aus den Domänen des Patrons (Abbildung auf Essenzen, aus `prayer.js` `DOMAIN` oder eigener Tabelle), Zeichen aus `SIGN_AFFINITY`; Affinität und Gegenpol (Gegenpol aus `T.ESS[x].opp`)
- [x] 2.4 Fallbacks: Tierkreis ohne `signs`, irdische Tagesnamen ohne `dayNames`, keine Patrone ohne `patrons`

## 3. Zeichnungen

- [x] 3.1 Tagestabelle als HTML-Tabelle mit Wandelstern-Zeichen (`glyphSVG("alch", …)`), Metall, Farbe, Essenz
- [x] 3.2 Jahresring als SVG: äußerer Ring Monate (Name, irdische Entsprechung, Patron-Farbe), innerer Ring Zeichen, Festtage als Punkte
- [x] 3.3 Sternkarte als SVG: Polarstern, Sektoren, Ekliptik als S-Kurve, Beschriftung
- [x] 3.4 Strichfiguren der Zeichen (13 der Karawane, 12 des Tierkreises), nur Linien, Kreise, Punkte; zuerst als Symbolpunkte, dann als Figuren
- [x] 3.5 Sichtprüfung im Browser: Ring und Karte in Hell und Dunkel, lesbar bei A5, Beschriftung ohne Überschneidung

## 4. Lektion

- [x] 4.1 `data/primer.js`: Lektion „Die Tafel der Zeit“ (`gen: "time"`) im Teil IV nach `l30`, Lesestück, Aufgabe („trage dein Zeichen ein, nenne seine Affinität“), Prüfkriterien Tabelle, Ring, Karte
- [x] 4.2 Glossar: Ekliptik, Polarstern, Schutzgottheit (mit Randerklärung)
- [x] 4.3 `app/js/primer.js`: Generator `time` setzt Tagestabelle, Ring und Karte auf je eine Seite, keine Seitenüberläufe
- [x] 4.4 Prüfbogenzeile und Inhaltsverzeichnis zählen die Nummer nach der Stelle; Verweise `{{lesson:…}}` im Text prüfen

## 5. Tests und Abschluss

- [x] 5.1 Tests in `tools/test-cases.mjs`: 13 Zeichen versetzt zu 12 Monaten, Zeichen über die Jahresnaht, Patron aus `deities.js`, unbekannte Id, Fallbacks ohne Profil
- [x] 5.2 Neutralitätsprüfung: Tafel ohne lokales Profil enthält keine Zeichen- oder Gottheitsnamen eines Fremdsettings
- [x] 5.3 Keine Regelwirkung: Vorbereitung und SG unverändert mit und ohne Tafel
- [x] 5.4 Messen der Seitenfüllung, Druck als PDF prüfen
- [x] 5.5 `backlog.md`: Eintrag „Kalender- und Wochenseite“ durch Verweis auf diesen Change ersetzen; neuer Eintrag „Harrow fürs Orakel“ (54 Karten, 6 Farben × 9 Gesinnungen)

## 6. Überarbeitung nach der Durchsicht (2026-11-14)

- [x] 6.1 Drei Lektionen statt einer, Text zwischen Zeichnung und Einträgen, eigene Aufgaben und Prüfkriterien
- [x] 6.2 Überlieferung je Tag (Werkstatt, Brauch aus `calendar.dayTexts`), Monat (`calendar.monthTexts`, sonst Werkstatt-Überlieferung, Jahreszeit) und Zeichen (`text`)
- [x] 6.3 Einträge als Blöcke statt Tabellen
- [x] 6.4 Essenzen und Farben der Tage auch bei eigenen Planeten im Profil
- [x] 6.5 Farbstoffe je Gottheit (`app/js/deity-colors.js`) in Tafel, Andachtsbild und Vademecum; deutsche Farbnamen; Aroden Grün und Gold
- [x] 6.6 Beide heiligen Farben als Streifen, dünner Außenkreis
- [x] 6.7 Feste aus Vademecum und Andacht zusammengeführt; im Lehrheft nur als Punkte der Stimme aus `calendar.feastHand`
- [x] 6.8 Lange Zeichennamen im Ring umbrechen (Trennstrich, weiche Trennstellen)
- [x] 6.9 Lokales Profil: Bräuche, Monatstexte, Bilder der Zeichen, Trennstellen, Randnotizen von Roderik und Kirran, Feste Tag der Schau und Tag der Hervorrufung
- [x] 6.10 Tests (`tools/time-test.mjs`, `tools/vademecum-test.mjs`), Sollwerte, Specs

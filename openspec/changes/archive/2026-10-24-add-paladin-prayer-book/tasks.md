## 1. Daten

- [x] 1.1 `tools/parse_deities.py`: Felder aus `dieties/` lesen, Farbwörterbuch, `data/deities.js` schreiben (ohne Gehorsam, Segen, Kultzentren)
- [x] 1.2 Prüfen: Iomedae, Torag, Angradd vollständig; Gottheiten ohne Farben leer; Dateigröße
- [x] 1.3 `app/js/classes.js`: `CLASSES` (wizard, paladin) und `CLASS()`; in `index.html` einbinden

## 2. Charakter

- [x] 2.1 `chars.js`: Felder `cls` und `deity`, Schlüssel `prayers` in `OWN`, Profilvorgaben
- [x] 2.2 Einstellungen: Klasse und Gottheit (datalist, Gesinnungsfilter, „alle Gottheiten“), Neuladen bei Wechsel
- [x] 2.3 Export und Import mit `cls`, `deity` und `prayers`

## 3. Grade und Verzeichnis

- [x] 3.1 `analyze(s, { cls })` und Analyse-Cache je Klasse
- [x] 3.2 `onlyWizard` → `onlyClass` mit Migration; Alltagszauber nur bei Magiern
- [x] 3.3 Gradfilter und Gradanzeige nach Klasse

## 4. Andachtsbild

- [x] 4.1 `app/js/vitrail.js`: Fensterform mit Bahnen je Grad, Bogenfeld, Sockel
- [x] 4.2 Voronoi-Scheiben je Bahn, Bleiruten, Glasverlauf, Saat aus Zauber und Gottheit
- [x] 4.3 Farben: Grundscheiben aus heiligen Farben, Akzente nach Essenzanteilen, Medaillon der Hauptessenz, Bordüre beim Rettungswurf
- [x] 4.4 Maßwerk nach Schule, Sockel nach Dauer, Zellrichtung nach Gestalt
- [x] 4.5 Parameter `mood` (nur `light` umgesetzt, `dark` fällt zurück); Motivbibliothek (mindestens 10 Motive) und Symbol aus Stichwörtern, Rosette als Rückfall
- [x] 4.6 Dialog: Andachtsbild vergrößern und als SVG speichern

## 5. Gebete

- [x] 5.1 `app/js/prayer.js`: Bausteine Anrufung, Lob, Bitte, Gelöbnis, Schluss; Domänen- und Beinamen-Wörterbuch
- [x] 5.2 Ton nach Gesinnung (Kehrvers, schlichte Bitte, freie Anrufung; gut und böse), Test auch mit einer bösen Gottheit
- [x] 5.3 Eigene Worte: Textfeld in der Detailansicht, Speicherung in `prayers`

## 6. Brevier

- [x] 6.1 `BOOK.prayerPage(m, t, deity, own)`: Titel, Andachtsbild, Wirkungszeile, Kanon, Eigene Worte oder Linien, (i)
- [x] 6.2 `assemble` mit `tradition: "divine"`: Vorspann (Titel, Gottheit, Vom Lesen der Fenster, Vom Gebet), Kapitel je Grad, „Fremde Gebete“ am Ende
- [x] 6.3 Detailansicht, Pager, Seitenleiste und Inhaltsverzeichnis für das Brevier prüfen; Linksstart-Optionen bei Brevier ausblenden
- [x] 6.4 Druck und Regelband für das Brevier

## 7. Vorbereitung

- [x] 7.1 Plätze nach `CLASS().grades`, Joker nur bei `joker`, Beschriftung „Gebetsstunde“
- [x] 7.2 Statistik: Grade über das klassenabhängige Modell

## 8. Abschluss

- [x] 8.1 Test Magier: Kirrans Buch, Vorbereitung und Statistik unverändert
- [x] 8.2 Test Paladin: neuer Charakter mit Iomedae, 20 Zauber, Brevier, Druck, Vorbereitung; Wechsel auf Torag
- [x] 8.3 Leistung: Öffnen des Breviers mit allen 291 Zaubern und Druck messen
- [x] 8.4 Sichtprüfung von 20 Andachtsbildern auf Vielfalt (Screenshots)
- [x] 8.5 README, Profil-Vorlage (`cls`, `deity`), `explore-class-books` aktualisieren

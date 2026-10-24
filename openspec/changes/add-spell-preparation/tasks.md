## 1. Datenmodell und Speicher

- [x] 1.1 Modul `app/js/prepare.js` mit Zustand (Plätze, Vorbereitung, Joker, Vorlagen) und localStorage-Schlüsseln `spellbook.prep*`
- [x] 1.2 Nutzungsprotokoll `spellbook.prepLog` mit Ereignissen prep/unprep/cast/uncast/day
- [x] 1.3 json-Export und -Import um das Feld `preparation` erweitern (alte Exporte bleiben lesbar)

## 2. Ansicht „Heute vorbereitet“

- [x] 2.1 Reiter in `index.html` und Routing (`#prepare`) in `app/js/app.js`
- [x] 2.2 Platzeditor je Grad 0–9 inkl. optionalem Sonderplatz mit Bedingung
- [x] 2.3 Platz belegen: Auswahl aus Buchzaubern mit passendem Grad, Suche, Schnellglyphe
- [x] 2.4 Abstreichen per Kästchen, Zaubertricks ohne Verbrauch, Zähler freier Plätze je Grad
- [x] 2.5 Joker-Plätze mit Höchstgrad (Arkane Verbindung)
- [x] 2.6 „Neuer Tag“ und gespeicherte Vorbereitungen (speichern, laden, löschen)
- [x] 2.7 Bedienbarkeit auf Handybreite prüfen (Screenshot 390 px)

## 3. Druck

- [x] 3.1 Tageszettel als A5-Seite über `printPages`, mit und ohne Hintergrund testen

## 4. Abschluss

- [x] 4.1 README um die Vorbereitung ergänzen
- [ ] 4.2 `openspec validate add-spell-preparation` und Change archivieren

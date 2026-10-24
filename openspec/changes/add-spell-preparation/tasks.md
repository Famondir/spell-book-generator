## 1. Datenmodell und Speicher

- [ ] 1.1 Modul `app/js/prepare.js` mit Zustand `{slots, today, presets}` und localStorage-Schlüsseln `spellbook.prep*`
- [ ] 1.2 json-Export und -Import um das Feld `preparation` erweitern (alte Exporte bleiben lesbar)

## 2. Ansicht „Heute vorbereitet“

- [ ] 2.1 Reiter in `index.html` und Routing (`#prepare`) in `app/js/app.js`
- [ ] 2.2 Platzeditor je Grad 0–9 inkl. optionalem Sonderplatz mit Bedingung
- [ ] 2.3 Platz belegen: Auswahl aus Buchzaubern mit passendem Grad, Suche, Schnellglyphe
- [ ] 2.4 Abstreichen per Kästchen, Zaubertricks ohne Verbrauch, Zähler freier Plätze je Grad
- [ ] 2.5 „Neuer Tag“ und gespeicherte Vorbereitungen (speichern, laden, löschen)
- [ ] 2.6 Bedienbarkeit auf Handybreite prüfen (Screenshot 390 px)

## 3. Druck

- [ ] 3.1 Tageszettel als A5-Seite über `printPages`, mit und ohne Hintergrund testen

## 4. Abschluss

- [ ] 4.1 README um die Vorbereitung ergänzen
- [ ] 4.2 `openspec validate add-spell-preparation` und Change archivieren

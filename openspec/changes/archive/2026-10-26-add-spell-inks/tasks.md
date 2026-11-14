## 0. Voraussetzung

- [x] 0.1 `add-workshop-lessons` ist umgesetzt (Nummerierung nach Reihenfolge)

## 1. Ableitung

- [x] 1.1 Farbstoff-Tafel (Farbe → Farbstoff, Gift) und Metallformen in `textgen.js`; Profil kann die Tafel ergänzen
- [x] 1.2 Tinte erzeugen: Grundtinte, Farbstoff, Metallstaub, Beimischung aus der zweiten Essenz, optional Tag aus dem Wandelstern; Seed aus der Zauber-Id (Prüfung: Feuerball zweimal laden, gleiche Tinte)
- [x] 1.3 Begründungen: zwei bis drei Sätze je Essenz, Name aus der Kombinationstafel wo vorhanden; Stichprobe von 20 Zaubern lesen
- [x] 1.4 Warnsatz bei giftigem Farbstoff oder Metall
- [x] 1.5 Feld `ink` über `data/custom_texts.js` überschreibbar

## 2. Zauberbuch

- [x] 2.1 Zeile „Tinte“ in `correspondBlock`; Mess-Seite: keine Formel bekommt dadurch eine Seite mehr
- [x] 2.2 Profil überschreibt eine Entsprechungsfarbe: Tinte folgt (Browser)

## 3. Lehrheft

- [x] 3.1 Lektion „Tinten nach der Mischung“ (`l-inks`) nach „Mischungen in Teilen“ mit Lesestück, Glossen, Aufgabe, Prüfkriterien
- [x] 3.2 Generator für die Tafel Essenz → Farbe, Farbstoff, Metall, Gift; Lektion als PDF prüfen

## 4. Abschluss

- [x] 4.1 Backlog: Abschnitt „Zaubertinten“ streichen; Abgleich `CORRESPOND_BASE`/`TAG_ESS` als eigenen Punkt eintragen
- [x] 4.2 Englische Farbstoffnamen, Begründungen und Lektion vermerken oder ergänzen (`add-bilingual-app`)

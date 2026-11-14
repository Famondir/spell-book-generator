## 0. Voraussetzung

- [x] 0.1 `add-apprentice-primer` ist archiviert, `openspec/specs/apprentice-primer/spec.md` existiert

## 1. Nummerierung nach Reihenfolge

- [x] 1.1 Lektionsnummer aus der Stelle unter den nummerierten Lektionen berechnen; Kicker, Inhaltsverzeichnis, Glossarverweise und Prüfbogen nutzen dieselbe Funktion (Prüfung: vor dem Einfügen sind alle Nummern unverändert)
- [x] 1.2 Verweise `{{lesson:<id>}}` beim Satz auflösen; „Lektion 16“ in „Der Wochenkreis“ umstellen; unaufgelöste Verweise in der Konsole melden
- [x] 1.3 Randnotiz und Lektionsersatz aus dem Beispielprofil greifen nach dem Einfügen weiter an der richtigen Lektion (Browser)

## 2. Werkstatt

- [x] 2.1 Lektion „Seife und Lauge“ (`w-soap`) nach „Farben und ihre Gifte“: Lesestück mit „Die Seife des Meisters“ und „Gegen den Regen“ (Imprägnieren), Glossen, Kasten „Lauge frisst Haut“, Aufgabe, Prüfkriterien
- [x] 2.2 Lektion „Siegellack und Petschaft“ (`w-seal`) nach „Papier schöpfen“: Lesestück, Glossen, Kästen „Das wachende Siegel“ und „Was ist hier schiefgelaufen?“, Aufgabe, Prüfkriterien (passt mit zwei Kästen auf eine Seite, sonst wird der Fehlerkasten Teil des Lesestücks)
- [x] 2.3 Generator `sealBlank`: zwei leere Siegelkreise und Datumsfeld; jede Werkstatt-Lektion passt auf eine Seite (Mess-Seite)
- [x] 2.4 tria-prima-Aufgabe in „Das brennende Scheit“ um Seife und Siegellack erweitern, Lösung kopfüber ergänzen

## 3. Glyphen

- [x] 3.1 Strichbuchstaben (Großbuchstaben A–Z, Umlaute als Grundbuchstabe) als Geraden und Bögen für die Ansicht des Meisters
- [x] 3.2 Generator `sigil`: Streichschritte für drei Sätze, Ansicht des Meisters für den ersten, leere Flächen für die anderen; Sätze aus dem Profil ersetzbar
- [x] 3.3 Lektion „Sigillenbau“ (`g-sigil`) am Ende von Teil III mit Lesestück, Glossen, Aufgabe, Prüfkriterien; Screenshot prüfen, ob die Ansicht lesbar ist

## 4. Abschluss

- [x] 4.1 Glossar enthält die neuen Begriffe mit richtiger Lektionsnummer
- [x] 4.2 Lehrheft als PDF drucken (Chrome headless): Teil I und III, Prüfbogen mit den neuen Zeilen
- [x] 4.3 Backlog: Nummer im Eintrag „Kalender- und Wochenseite“ anpassen, Punkte „Seife, Siegellack“ und „Sigillenbau“ streichen
- [x] 4.4 Falls `data/primer.en.js` schon existiert: die drei Lektionen auf Englisch ergänzen; sonst als Punkt in `add-bilingual-app` 6.1 vermerken

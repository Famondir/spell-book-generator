## 1. Einstellung

- [x] 1.1 `maxPages` in den Standard-Einstellungen anlegen (leer/0 = ein Band) und in `index.html` das Feld „Höchstens … Seiten je Band“ nach „Kapitel je Grad“ einfügen; prüfen: Wert bleibt nach Neuladen und Charakterwechsel je Charakter erhalten
- [x] 1.2 Ohne Grenze unverändert: Seitenzahl und Statistik eines Testbuchs vor/nach der Änderung vergleichen (gleiche Gesamtseiten)

## 2. Bandkontext in `assemble`

- [x] 2.1 `ctx.volume` auswerten: `chapterOffset` für die Kapitelnummer, `refOffset` für die Regelband-Nummer; prüfen: Band II zeigt „Kapitel V“ und die globale Regelband-Nr.
- [x] 2.2 Vorspann je Band: Band I vollständig (plus Bandzeile auf dem Titelblatt, wenn mehrere Bände), weitere Bände nur Bandtitelseite + Verzeichnis eigener Formeln; ohne Vorspann ab Band II trotzdem Titelseite
- [x] 2.3 Bandtitelseite gestalten (`title-page` mit Siegel, „Band II“, Umfang aus Kapitelnamen wie „III.–V. Grad“), für Zauberbuch und Brevier; Screenshot prüfen
- [x] 2.4 Fortsetzungskapitel: Kapiteldoppelseite mit „(Fortsetzung)“, wenn `ctx.volume.continued` gesetzt ist

## 3. Aufteilung

- [x] 3.1 `BOOK.volumes()`: Schätzlauf, Kapitelspannen und Bandvorspann ermitteln
- [x] 3.2 Übergroße Kapitel an Zaubergrenzen in Stücke zerlegen (mehrseitige Zauber ganz, Halbseitenpaare nicht trennen)
- [x] 3.3 Mindestbandzahl gierig bestimmen, dann ausgeglichene Schnitte per DP (dicksten Band minimieren)
- [x] 3.4 Bände mit echtem `assemble` setzen, Überschreitungen durch Verschieben korrigieren; `warnings` (Kapitel geteilt, Grenze zu klein mit Mindestwert) zurückgeben
- [x] 3.5 Mess-Seite / Konsolentest: Buch mit 269 Zaubern bei Grenzen 1000, 600, 400, 200, 50 – kein Band über der Grenze (außer gemeldetem Notfall), kein Kapitel unnötig geteilt, Bände ausgeglichen, Rechenzeit notieren

## 4. Buchansicht

- [x] 4.1 `bookData()` auf `volumes` umstellen, `cur()` für den gewählten Band, `pageBySpell` als `{ vol, page }`; `view.vol` unter `spellbook.bookVol` speichern und begrenzen
- [x] 4.2 Bandwahl „Band I · II · III“ in der Buchleiste (nur bei >1 Band); Vorschau und Blätterleiste arbeiten im gewählten Band
- [x] 4.3 Statistik „3 Bände: I … · II … · III … Seiten“ und Warnhinweise anzeigen; Spielregel-Hinweis 1000/100 bleibt Information
- [x] 4.4 Inhaltsverzeichnis rechts und Inhaltsliste links mit „II·34“; Klick wechselt Band und Seite; prüfen mit Zauber aus anderem Band

## 5. Druck

- [x] 5.1 Bei mehreren Bänden druckt der Hauptknopf („Band II drucken / als PDF“) den gewählten Band; die Bandwahl ist die Auswahl; Druck-Cache je Band (Schlüssel aus dem Seiteninhalt)
- [x] 5.2 Headless-Druck (print-to-pdf) von Band II: beginnt mit Titelseite als Seite 1, Kapitel beginnen links, Seitenzahl ≤ Grenze
- [x] 5.3 Regelband und Schriftrollen unverändert prüfen (Nummern passen zu Bänden)

## 6. Abschluss

- [x] 6.1 Brevier (Paladin) mit Grenze testen
- [x] 6.2 README-Abschnitt zu Druck um Bände ergänzen; Backlog-Eintrag „Aufteilen in mehrere Bände“ entfernen

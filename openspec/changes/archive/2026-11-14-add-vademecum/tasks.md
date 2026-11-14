## 1. Gerüst und Daten

- [x] 1.1 `data/vademecum.js` anlegen: `window.VADEMECUM` mit Kapiteln (IDs, Titel, römische Zählung), Zahl der Choräle, Lückensätzen für die dünne Fassung von „Vom Wesen“ und `local: {}`
- [x] 1.2 `.gitignore` um `data/vademecum.local.js` ergänzen; in `index.html` `data/vademecum.js` und `data/vademecum.local.js` (mit `onerror="this.remove()"`) laden
- [x] 1.3 `data/vademecum.local.example.js` (neutral, kurz) als Muster für Aufbau und Felder: Tempel, Verfasser, Farben, Hälften (Name, Zeichen, Schulen/Essenzen), Kapitel mit Abschnitten, Gebeten, Festen, Sinnsprüchen, Mitte
- [x] 1.4 `PRAYER.dualPair(d)` ergänzen (liefert das Paar des Zwiespalts oder null, beachtet den Profilton)

## 2. Aufbau des Bandes

- [x] 2.1 `app/js/vademecum.js`: `build({ deity, entries, settings })` liefert `{ title, halves: [...], middle }`; einfaches Buch bei fehlendem Zwiespalt oder Abschaltung in der lokalen Datei
- [x] 2.2 Dünne Fassung aus Gottheitsdaten (Titelblatt, „Vom Wesen“, Verzeichnis), leere Kapitel entfallen, römische Zählung lückenlos
- [x] 2.3 Abschnitte, Gebete (Gebrauchshinweis + zentrierte Verse), Kästen, Glossen und Epigraphe setzen wie im Lehrheft; Tempelfarben als CSS-Variablen am Band
- [x] 2.4 Festkalender aus lokaler Datei und Profil, nach Datum, mit Monatsnamen aus dem Profil
- [x] 2.5 Randnotizen der Profilstimmen (Hand, Tinte, Mindeststufe) an Abschnitts-IDs

## 3. Choräle

- [x] 3.1 Silbenzerlegung der Formelverse (Lautschrift-Silben, Rückfall Vokalgruppen) und deterministische Streichung (nicht die erste Silbe, mindestens eine je Vers)
- [x] 3.2 Auswahl der Zauber nach Tempelschwerpunkt und Hälfte, begrenzt; Kopfzeile nur Schule und Grad
- [x] 3.3 Kapitel entfällt ohne Zauber und ohne eigene Choräle

## 4. Wendebuch, Betrachter und Druck

- [x] 4.1 Ansicht `#vademecum-view` in `index.html`, eigener Viewer je Hälfte mit gemerkter Seite, Knopf „Buch wenden“, Mitte kopfüber in der zweiten Hälfte
- [x] 4.2 Verzeichnis in der Seitenleiste je Hälfte
- [x] 4.3 Verweise `{{ref:…}}` nach dem Satz beider Hälften auflösen (Zeichen der Hälfte + Seite); Platzhalter mit fester Breite
- [x] 4.4 Auswahl im Reiter „Lehre“ (Lehrheft bzw. „Vom Gebet“ / Vademecum), nur mit Gottheit, je Charakter gemerkt
- [x] 4.5 Druck: ganze Hälfte oder ganzes Wendebuch (A, Mitte, B rückwärts und gedreht, Lochrand gespiegelt, Ausgleichsseite); Druck-Cache und Fortschrittsanzeige
- [x] 4.6 Oberflächentexte in `data/lang/de.js` und `en.js`

## 5. Tests

- [x] 5.1 Paladin ohne Eintrag: dünnes, einfaches Vademecum, keine leeren Kapitel (Screenshot)
- [x] 5.2 Nethys mit Entwurf: zwei Hälften, Verzeichnis je Hälfte, Wenden behält die Seite
- [x] 5.3 Choräle deterministisch, jede Zeile mit Lücke, Kopfzeile ohne Zaubernamen
- [x] 5.4 Verweise lösen auf richtige Seiten auf; keine Seite läuft danach über (Mess-Seite)
- [x] 5.5 PDF des ganzen Wendebuchs mit Lochrand in Chrome headless prüfen (Folge, Drehung, Rand)
- [x] 5.6 Magier ohne Gottheit: Reiter „Lehre“ unverändert

## 6. Schreibspur Nethys (privat, `data/research/vademecum-nethys-text.md` → `data/research/vademecum-local-build.py` → `data/vademecum.local.js`)

- [x] 6.1 Gliederung aller Kapitel beider Hälften mit Ideen und Querverweisen; Kapitel I beider Hälften als Fließtext (Ton)
- [x] 6.2 Eintrag `nethys` in `data/vademecum.local.js` mit Tempel, Verfasser, Farben (Lapis, Indigo, Gold), Hälften, Festen und Kapitel I
- [x] 6.3 Vorrede beider Hälften und Mitte
- [x] 6.4 Kapitel II Gebete (beide Hälften)
- [x] 6.5 Kapitel III Choräle: Rahmentexte und Anlässe zu den erzeugten Chorälen
- [x] 6.6 Kapitel IV Riten und Feste
- [x] 6.7 Kapitel V Gefolge
- [x] 6.8 Kapitel VI Heilige Werke
- [x] 6.9 Kapitel VII Geschichte des Hauses
- [x] 6.10 Kapitel VIII Vom Rang und vom Tabu
- [x] 6.11 Kapitel IX Anregungen (Hüter: Spielhinweise; Zerstörer: Regelskizzen)
- [x] 6.12 Randnotizen Roderik, Antalia, Kirran mit Verweisen zwischen den Hälften (als `notes` in `data/vademecum.local.js`, erzeugt aus dem Text; siehe design.md, Entscheidung 9)
- [x] 6.13 Durchsicht des Gesamtwerks mit Simon; Widersprüche zwischen den Hälften prüfen (Liste im Entwurf)

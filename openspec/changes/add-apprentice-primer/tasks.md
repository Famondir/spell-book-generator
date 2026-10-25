## 1. Grundgerüst

- [x] 1.1 `app/js/primer.js` mit Lektionsmodell (`id, part, title, read, glosses, view, task, check, box`) und Seitenerzeugung als fließende Seiten mit Randspalte; prüfen: eine Probelektion bricht in der Vorschau sauber auf zwei Seiten um
- [x] 1.2 Bausteine: Ansicht des Meisters (verkleinert, Vermerk „nicht nachfahren – abzeichnen“), Aufgabe, Prüfvermerk (Skala 0–3, Urteil, Datum, Kürzel), Glosse, Randkasten; Screenshot einer Musterlektion
- [x] 1.3 Hervorhebung `[[Begriff]]` → Rubrik im Text, Glosse am Rand, Eintrag im Glossar (Anhang E) mit Lektionsverweis
- [x] 1.4 `data/primer.js` anlegen (Titel, Teile, leere Lektionsliste), in `index.html` laden

## 2. Essenzen in Teilen

- [x] 2.1 `T.parts(essences)` in `theory.js` (Teile, knapp/stark/schwach, gleiche Anteile zusammengefasst); Konsolentest mit dem Beispiel aus der Spec und fünf weiteren Zaubern
- [x] 2.2 Lektion 32 „Mischungen in Teilen“ nutzt die Funktion; Profil eines echten Zaubers als Rezept

## 3. Erzeugte Teile

- [x] 3.1 Teil III Glyphen: Lektion 19 (Text), 20 Essenzen, 21 Schulen, 22 Zeichen, 23 Ecksteine, 24 Zeitmarken, 25 Schwellentore, 26 Gestenblatt (mit Texten aus `SCHOOL_GESTURE`); Glyphen identisch mit den Kreisen prüfen
- [x] 3.2 Teil V Schnellglyphen: 33 Ableitung, 34 Schnellglyphen der eigenen Formeln, 35 Drills
- [x] 3.3 Teil VI Kreise lesen: 36 Schichten mit `annotate`, 37 Lückenkreise mit Lösung kopfüber, 38 verwandte Formeln
- [x] 3.4 Teil VII Kleine Formeln: Lektion 39 und je Zaubertrick/Alltagszauber aus dem Buch eine Lektion (Kreis, Formel mit wachsenden Lücken in drei Durchgängen, Geste, Stoffe in Teilen, Übungsleiter, dreimal in Folge); Grundauswahl bei leerem Buch
- [x] 3.5 Teil IV 31 „Stoffe lesen“ aus echten Komponenten (`TAG_ESS`, `ALCHEMY`); 29 Wandelsterne mit Zeichen aus Kreis, Halbmond, Kreuz (SVG-Bausteine)
- [x] 3.6 Anhang A Prüfscheibe, B Lochpausen (Stützpunkte entlang der Glyphenpfade, 12/6/3), C Bewertungsbogen, D Versetzungsbogen, E Glossar; Druckprobe A5

## 4. Geschriebene Texte (neu, setting-neutral; gegen die Tabu-Listen in `data/research/` prüfen)

- [x] 4.1 Vorspann: Vorrede des Meisters, Lehrvertrag, Hausordnung und Tagesplan, Ausrüstung, Gebrauchsanweisung
- [x] 4.2 Teil I Werkstatt, Lektionen 1–9 (inkl. Kasten „Das Gift im Tintenfass“)
- [x] 4.3 Teil II Hand und Kreis, Lektionen 10–18
- [x] 4.4 Teil IV Lesestücke 27–30 (brennendes Scheit, Elemente, Wandelsterne mit Venus/Luft, Wochenkreis)
- [x] 4.5 Teil VIII Gesellenstück 40–42 und Randkästen je Teil
- [x] 4.6 Ungeprüfte Recherche-Angaben (Abschriftkosten, Stoffzeichen) gegen Quelle prüfen oder weglassen (Kosten weggelassen; Stoffzeichen nur die klassischen, ohne Ursprungsbehauptung)

## 5. Stimmen, Freischalten, Profil

- [x] 5.1 Profilfelder `primer` lesen (Titel, Meister, Vorrede, Übergabe, Stimmen, Notizen, Randkästen, `aliases` als Beinamen in Klammern, `lessons` zum Ersetzen einzelner Lektionen; loses Blatt siehe 5.4); Beispiel in `profile.local.example.js`
- [x] 5.2 Zwei weitere OFL-Handschriften lokal einbinden (Lizenz in `app/fonts`), drei Hände `angular` (Covered By Your Grace) / `flowing` (Caveat) / `even` (Kalam) mit Tinte; PDF mit drei Stimmen geprüft
- [x] 5.3 Freischalten nach Mindeststufe; prüfen: Notiz Stufe 7 erscheint erst ab eingetragener Stufe 7 (Bedienungstest `ui-lehrheft-freischalten`)
- [x] 5.4 Übergabeschreiben nach dem Titelblatt; loses Blatt als schräg eingelegtes Blatt im Ritualaufbau mit Streichung und Notizen (`primer.looseLeaf`, eigene Seite hinter dem Anhang)
- [x] 5.5 Kirrans lokales Profil: Meisterin, Übergabe von Antalia, Randnotizen der drei Stimmen zu ausgewählten Lektionen (mindestens 13, 26, 29, 39), loses Blatt mit Antalias Notiz vor Kirrans (höchstens drei Tote); Call of Cthulhu und Occult Adventures nur als Muster

## 6. Ansicht und Druck

- [x] 6.1 Reiter „Lehre“ mit Unterpunkten „Lehre der Kreise“ und „Lehrheft“ (nur arkan); Paladin unverändert „Vom Gebet“
- [x] 6.2 Lehrheft-Ansicht: ganzes Heft gesetzt (fortlaufende Seitenzahlen), Inhaltsverzeichnis rechts ausklappbar wie im Buch und folgt dem Blättern, gemerkter Teil; Fortschritt beim Setzen; Lösungen nach erzwungenem Umbruch
- [x] 6.4 Leistung und Größe: kleine Formeln je eine feste Seite (Kreis schrumpft mit), Kreise lesen zwei je Seite, Restablage beim Umbruch mit `content-visibility`; 35 Zaubertricks in unter einer Sekunde gesetzt
- [x] 6.5 Lochrand (`primerGutter`, an ab Werk) mit gleicher Satzbreite, Randspalte gespiegelt außen, Teile beginnen rechts (Leerseiten), Doppelseiten wie im Heft
- [x] 6.6 Prüfkästen aus dem Heft (zusammen rund zehn Seiten) in einen eigenen Prüfbogen („Prüfbogen drucken“); Schlüssel der Schulfiguren in Lektion 33
- [x] 6.3 „Lehrheft drucken“ über `printPages` (Fortschritt, Cache, Papierformat); headless print-to-pdf prüfen

## 7. Einstellungen

- [x] 7.1 Charakterstufe im Abschnitt Charakter (freiwillig, Hinweis „nur für Randnotizen im Lehrheft“), Name des Meisters im Abschnitt Buch (arkan); Profilname gilt, solange das Feld leer ist

## 8. Durchsicht

- [ ] 8.1 Ganzes Lehrheft als PDF durchsehen (Seitenzahl, Umbrüche, leere Seiten); Kürzungsliste mit dem Nutzer abstimmen
- [ ] 8.2 README um das Lehrheft ergänzen; Backlog-Eintrag „Lehrplan und Ausbildungsablauf“ entfernen

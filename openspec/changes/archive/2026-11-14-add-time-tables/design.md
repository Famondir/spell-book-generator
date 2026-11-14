## Context

Lektion „Der Wochenkreis“ (`data/primer.js`, Generator `week` in `app/js/primer.js`) zeichnet den Siebenstern und nennt die Tage nur als Textzeile. Das Profil kennt `calendar.months`, `earth`, `days`; die Gottheiten stehen in `data/deities.js` (Name, Domänen, Farben, Symbol), und `prayer.js` bildet Domänen auf Gebetsthemen ab (`DOMAIN`). Die Recherche (`data/research/zeit-und-sterne-golarion.md`) zeigt: Tagesnamen und Monatspatrone der Spielwelt sind belegt, die 13 Zeichen der Kosmischen Karawane laufen quer zu den 12 Monaten. Das Repository muss neutral bleiben (kein Product Identity), Setting-Eigenes steht nur im lokalen Profil.

## Goals / Non-Goals

**Goals:**
- Eine Lektion, die Tag, Monat und Himmel zusammen zeigt, im Stil der Lehre (Lesestück, Aufgabe, Prüfkriterien).
- Doppelring Monate/Zeichen und eine Sternkarte der Nordhalbkugel als SVG.
- Affinitäten als erzählerische Neigung zu Schulen und Essenzen.
- Ohne lokales Profil vollständig und neutral.

**Non-Goals:**
- Keine Hausregel, keine Zuschläge, keine Würfelwerte für Tag, Monat oder Zeichen.
- Keine Berechnung echter Planetenstände und kein Geburtszeichen-Würfeln.
- Kein Kalender zum Ausfüllen (der Backlogeintrag dazu entfällt).
- Keine Harrow-Karten (nur im Backlog vermerkt).

## Decisions

**1. Daten in `data/time.js`, Setting-Eigenes im lokalen Profil.**
`data/time.js` hält Wochenfolge mit Wandelsternen (aus `PLANETS`, Lektion 30), neutrale irdische Tagesnamen, den neutralen 12-teiligen Tierkreis und die Affinitätstabelle für Zeichen. `calendar.dayNames`, `calendar.signs` und `calendar.patrons` im Profil überschreiben. Alternative: alles direkt im Profil; verworfen, weil das neutrale Profil dann leer bliebe und jeder Besitzer die Tabelle neu schreiben müsste.

**2. Schutzgottheit als Verweis auf `deities.js`, nicht als eigene Angabe.**
`calendar.patrons` ist eine Liste von zwölf Gottheits-Ids (oder `null`). Namen, Domänen, Farben und Symbol werden aus `deities.js` gelesen, damit es nur eine Wahrheit gibt. Ein Feld bleibt nötig, weil `deities.js` keine Monate kennt: Welche Gottheit zu welchem Monat gehört, ist Setting-Wissen. Alternative: Monate in `deities.js` einpflegen; verworfen, weil die Datei von `tools/parse_deities.py` erzeugt wird und dort nur Beschreibendes landet. Fehlt die Id in `deities.js`, steht der Monat ohne Patron da.

**3. Affinität von Monaten aus den Domänen, von Zeichen aus einer Tabelle.**
Für Monate: Domänen der Schutzgottheit über die vorhandene Abbildung auf Essenzen/Schulen (Erweiterung der Tabelle `DOMAIN` oder eigene Abbildung in `time.js`, je nachdem, was `prayer.js` hergibt). Für Zeichen: ein bis zwei Essenzen am Zeichen (`ess`), die Schulen folgen aus den Vorgaben der Schulen. Beide werden als „Affinität“ mit Gegenpol (aus `T.ESS[x].opp`) ausgegeben, nie als Zahl. Alternative: pauschale Regeltabelle; verworfen (Nutzerwunsch: keine Hausregeln).

**4. Doppelring aus Tagen im Jahr, nicht aus Monaten.**
Beide Ringe werden auf die Tagesachse 0–365 gelegt (Monatsgrenzen aus `calendar.days`, Zeichengrenzen aus `signs[i].from/to` als Monat+Tag). So stimmen die versetzten Grenzen und die ungleichen Zeichenlängen, ohne dass 12 und 13 gleich geteilt werden müssen. Alternative: gleich große Sektoren; verworfen, weil dann Datumsangaben nicht stimmen.

**5. Sternkarte als Polarprojektion mit gekrümmter Ekliptik.**
Mitte ist der Polarstern; die Zeichen liegen auf einem Band, dessen Radius sinusförmig um den Mittelwert schwankt (S-Kurve), weil die Ekliptik gegen den Himmelsäquator geneigt ist. Jedes Zeichen bekommt eine Strichfigur (wenige Linien und Punkte) auf dem Band. Beschriftung wie im Lehrheft in kleiner Schrift am Rand. Alternative: flache Sternkarte mit Rechteck; verworfen, weil sie nicht wie ein Nordhimmel wirkt.

**6. Lektion statt Anhangstabelle.**
Die Lektion bekommt Glossarbegriffe (Ekliptik, Polarstern, Schutzgottheit) und eine Aufgabe („Trage dein Geburtszeichen ein und nenne seine Affinität“). Der Prüfbogen erhält eine Zeile mit Kriterien Tabelle, Ring, Karte. Die Nummer ergibt sich aus der Stelle im Teil IV, nicht aus der Id.

**7. Neutraler Fallback.**
Ohne `signs` im Profil zeigt der Ring den irdischen Tierkreis (12 Zeichen mit festen Datumsfenstern), ohne `patrons` nur die Monatsnamen mit irdischer Entsprechung. Ohne `dayNames` stehen die irdischen Tagesnamen.

## Risks / Trade-offs

[Strichfiguren der 13 Zeichen sind viel Handarbeit] → Eine Figur je Zeichen aus wenigen Linien und Punkten; der neutrale Tierkreis bekommt eigene, schlichtere Figuren. Notfalls zuerst Symbolpunkte, Figuren in einem Folgeschritt.
[Setting-Eigenes im öffentlichen Repository] → Alle Namen und Daten der Karawane, Patrone und Festtage nur in `profile.local.js`; Tests prüfen, dass die neutrale Ausgabe keine davon enthält.
[Abbildung der Domänen auf Essenzen unvollständig] → Gottheiten ohne bekannte Domäne bekommen keine Affinität; der Monat zeigt dann nur den Patron.
[Seitenfüllung der Tafel] → Ring und Karte jeweils eigene Seite, Tagestabelle auf der Lesestück-Seite; gemessen mit den bestehenden Mess-Seiten.

## Migration Plan

Nur additiv: neue Lektion und neue optionale Profilfelder. Vorhandene Lehrhefte bekommen eine zusätzliche Lektion, die Lektionsnummern danach verschieben sich (sie ergeben sich ohnehin aus der Reihenfolge). Rückbau durch Entfernen der Lektion.

## Open Questions

- Welche Essenzen und Schulen soll jedes der 13 Zeichen bekommen? (Vorschlag liegt in `tasks.md`, wird beim Schreiben der Daten abgestimmt.)
- Genügt die Ekliptik als einzige Kurve oder soll auch der Himmelsäquator eingezeichnet werden?

## Nachtrag: Entscheidungen der Überarbeitung (2026-11-14)

**8. Einträge als Blöcke statt Tabellen.** Der Satz bricht Tabellen nicht um; mit Texten wären sie länger als eine Seite. Jeder Tag, Monat und jedes Zeichen ist ein eigener Block (`.tt-entry`), zwischen denen der Satz umbrechen darf.

**9. Rückfall für die Essenzen der Tage.** Nennen die Entsprechungen des Profils (`correspond.planet`) keinen der sieben Wandelsterne, gilt `week[].ess` aus `data/time.js` (gleich der Zuordnung des neutralen Profils).

**10. Farbstoffe beim Laden, nicht in der Tafel.** `app/js/deity-colors.js` läuft direkt nach `data/deities.js` und setzt je Farbe `hex` (Farbstoff), `de` (Name) und `base` (Grundfarbwert); `name` bleibt für die Steine der Intarsie. Für die Kerngötter ausgesucht (sinnvolle, verschiedene Farbstoffe je Grundfarbe), für alle übrigen nach der Id. Alternative: Zuordnung je Tafel nach Monatsfolge; verworfen, weil dieselbe Gottheit dann je Ansicht anders aussähe. Fehlende Farben (Aroden) als Ergänzung mit Quellenangabe in diesem Modul, da `deities.js` erzeugt wird.

**11. Feste nur als Nachtrag.** Das Lehrheft ist ein Werk des Meisters; Feste gehören ins Vademecum. `calendar.feastHand` nennt die Stimme, deren Tinte die Punkte tragen; die zugehörige Randnotiz steht im Profil.

**12. Umbruch im Ring.** Breite grob aus Zeichenzahl und Schriftgröße; Umbruch an Leerzeichen, an weichen Trennstellen (`\u00ad`) mit Strich, sonst an einer Silbengrenze (Gruppen wie „tr“, „sch“ bleiben zusammen).

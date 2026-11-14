## Context

- Die App setzt Bücher aus Seitenobjekten `{ html, cls, running, no }` zusammen (`BOOK.assemble`), rendert sie mit `BOOK.pageHTML`, passt sie mit `BOOK.autofit` an und bricht fließende Seiten (`cls: "flow"`) über `flow()` auf Folgeseiten um; das nutzt heute der Regelband.
- Der Reiter „Lehre der Kreise“ (`renderTheory`) zeigt den Vorspann ohne Titelblatt als Seitenstapel: Lesart, Schichten, Legenden, Affinitäten.
- Glyphen liegen in `glyphs.js` (`G.ESSENCE`, `G.SCHOOL`, `G.SIGN`, `G.ALCH`, `G.COMPONENT`, `G.CASTING`, `G.S`-Grundformen), die Theorie in `theory.js` (`T.ESS`, `T.SCHOOLS`, `TAG_ESS`, `ALCHEMY`), Texte je Zauber in `textgen.js` (Formel, Gesten, Entsprechungen).
- Charakterbezogenes steht im Profil (`PROFILE`, aus `data/profile.local.js` gemischt); die App berechnet bewusst nichts aus Stufe oder Attributen.
- Quellenstudie in `data/research/` (gitignored): `ausbildung-dsa.md`, `ausbildung-pf-dnd-hp.md`, `handwerk-und-glyphen.md`. Weitere Quellen für dunkle Rituale: Call of Cthulhu und Occult Adventures („Occult Rituals“, Open Game Content) im Archiv `PnP&TT`.

## Goals / Non-Goals

**Goals:**
- Ein druckbares A5-Lehrheft, das sich wie eine Fibel aus der Welt liest und als echtes Übungsheft taugt.
- Lehrstoff aus der eigenen Theorie erzeugen; geschriebene Texte nur für Werkstatt, Ordnung, Lesestücke.
- Freies Zeichnen statt Vordruck; Werkzeuge statt Übungsflächen.
- Persönliche Schicht (Meister, Stimmen, Übergabe, loses Blatt) vollständig im lokalen Profil; die neutrale Fassung ist ohne Profil vollständig und stimmig.
- Bewusst großzügiger erster Umfang; gekürzt wird nach Durchsicht.

**Non-Goals:**
- Magische Alphabete und Zaubersprachen (eigener Change, siehe Backlog).
- Essenzen in Teilen im Zauberbuch (eigener kleiner Change, Backlog).
- Lehrheft für göttliche Klassen.
- Hausregel Sprachenkunde beim Vorbereiten (Backlog).
- Digitaler Karteikarten-Übungsmodus.
- Herausnehmen der Zaubertricks aus dem Codex (spätere Option).

## Decisions

### 1. Rahmen in der Welt

Das Heft ist die handgeschriebene Fibel eines Meisters für seinen Lehrling (neutral: „der Meister“, Name einstellbar). Formeln lassen sich in dieser Welt nicht drucken; deshalb zeigt das Heft Muster nur verkleinert als „Ansicht des Meisters“ mit dem Vermerk *nicht nachfahren – abzeichnen*. Geübt wird auf der Wachstafel oder auf eigenem Papier, ins Heft kommt nur der Prüfvermerk. Arbeitsheft (Wachstafel, Übungsblätter) und Reinbuch (das spätere eigene Zauberbuch) werden unterschieden; das Gesellenstück ist die erste Seite im Reinbuch.

### 2. Aufbau einer Lektion

```
┌────────────────────────────────────────────┬────────────┐
│ LEKTION 13 · Die hundert Kreise    Teil II │ ▸ GLOSSE   │  ← Merkkasten zu hervor-
│ Lesestück (Weltinfo, Fluff)                │   nüchterne│    gehobenen BEGRIFFEN
│ ┌──────┐  Ansicht des Meisters            │   Erklärung│    (Rubrik + Kapitälchen)
│ │  ◯   │  „nicht nachfahren – abzeichnen“ │            │
│ └──────┘                                   │ Randnotiz  │  ← Stimmen (persönlich)
│ AUFGABE  auf eigenem Blatt / Wachstafel …  │ Randnotiz  │
│ PRÜFUNG  Form ○○○○ Schluss ○○○○ Strich ○○○○│            │
│          Urteil ☐ nondum ☐ probatum ☐ laud.│            │
└────────────────────────────────────────────┴────────────┘
```

- Lektionen sind Datenobjekte `{ id, part, title, read: [Absätze], glosses: {Begriff: Erklärung}, view: () => SVG, task: [Schritte], check: [Kriterien], box? }`. Begriffe in `read` werden mit `[[Begriff]]` markiert und als Rubrik gesetzt; ihre Erklärung erscheint am Rand und im Glossar.
- Jede Lektion ist eine fließende Seite (`cls: "flow lesson"`); lange Lektionen brechen über `flow()` auf Folgeseiten um. Die Randspalte ist Teil der Seite (Grid), damit Glossen und Notizen beim Lesestück stehen.
- Prüfvermerk mit Skala 0–3 je Kriterium und dreistufigem Urteil (*nondum*, *probatum*, *laudandum*), Feld für Datum und Kürzel.

### 3. Lehrplan (erster, großzügiger Umfang)

**Vorspann**
- Titelblatt „Fibel der Kreise · Erstes Lehrheft“ (Titel im Profil änderbar)
- *[persönlich]* An den, der nach mir liest (Übergabeschreiben)
- Vorrede des Meisters
- Lehrvertrag zum Ausfüllen (Lehrling, Meister, Dauer, Gegenleistung, Pflichten beider Seiten, Siegel)
- Hausordnung und Tagesplan nach Glockenstunden
- Ausrüstung der Lehrlingskammer (Abhakliste)
- Wie dieses Heft zu gebrauchen ist (Lesestück, Glosse, Aufgabe, Prüfung; Arbeitsheft und Reinbuch)

**Teil I · Die Werkstatt** (geschriebene Texte; Grundlage `handwerk-und-glyphen.md` 1–3)
1. Die Wachstafel: Holz, Wachs, Griffel, Glätten
2. Der Federkiel: Auswahl, Härten im heißen Sand, Schneiden, Spalten, Fehlerbilder
3. Rußtinte und Tusche
4. Eisengallustinte: sechs Schritte, Dauer, Fehlerbilder (Tintenfraß)
5. Farben und ihre Gifte: Zinnober, Mennige, Bleiweiß, Grünspan, Auripigment; Kasten „Das Gift im Tintenfass“
6. Pergament: Kalken, Spannen, Schaben
7. Papier schöpfen: Lumpen, Bütte, Sieb, Pressen, Leimen, Wasserzeichen
8. Zirkel, Lineal und Schnur; die Seite einrichten (Stechen, Linieren)
9. Zauberkreide und Kreise am Boden

**Teil II · Hand und Kreis**
10. Haltung, Atem, Federprobe
11. Grundstriche: Senkrechte, Waagerechte, Bogen, Haken, Öse
12. Die Gerade ohne Lineal
13. Die hundert Kreise (mit Prüfscheibe aus dem Anhang)
14. Konstruieren vor freihand I: Kreis, Durchmesser, Kreuz, Sechs- und Dreiteilung
15. Konstruieren II: Viereck, Achteck, Fünfeck und Pentagramm
16. Konstruieren III: Siebeneck (Näherung), Zwölfteilung; die Ordnungsknoten 1–9 als Figuren (aus `chapterFigure`)
17. Doppelkreis und Ringe (Weitenringe)
18. Die Lochpause: Stützpunkte durchstechen, durchstäuben, frei verbinden; 12 → 6 → 3 → frei

**Teil III · Die Glyphen** (erzeugt)
19. Was eine Glyphe ist: Kern und Beizeichen; Zeichnen ist nicht Wirken; ein fehlerhaftes Zeichen wirkt mit seinen Fehlern
20. Die Essenzen: je Essenz Glyphe, lateinischer Name, Glosse, Entsprechungen (Stunde, Farbe, Metall, Richtung), Drill
21. Die Schulen und ihre Zeichen
22. Die Zeichen des Zeichenrings (Modifikatoren)
23. Die Ecksteine (Komponenten)
24. Die Zeitmarken (Wirkdauer)
25. Schwellentore und Siegelband (Rettungswurf, Zauberresistenz)
26. Das Gestenblatt: die eigene Hand umzeichnen, Fingerstellungen der Schulen eintragen (Texte aus `SCHOOL_GESTURE`)

**Teil IV · Die Zeichen der Stoffe** (gemischt; Grundlage `handwerk-und-glyphen.md` 6)
27. Das brennende Scheit: Sulfur, Mercurius, Sal (Flamme, Rauch, Asche)
28. Die Elemente als Dreiecke; Qualitätenkreuz heiß/kalt, feucht/trocken
29. Die Wandelsterne: alle Planetenzeichen aus Kreis, Halbmond und Kreuz; Metalle; Venus als warm und feucht wie die Luft
30. Der Wochenkreis: Siebenstern, Planetenfolge, Wochentage
31. Stoffe lesen: Komponenten echter Zauber → Zeichen → Essenz (aus `theory.js`)
32. Mischungen in Teilen: Essenzprofil eines Zaubers als Rezept lesen und schreiben

**Teil V · Schnellglyphen**
33. Vom Vollzeichen zum Kurzzeichen: Beizeichen weglassen, Kern nie; Ableitung in drei Schritten
34. Die Schnellglyphen der eigenen Formeln (aus `quickGlyph`)
35. Zeitdrill, Blindzeichnung, Luftzeichnung

**Teil VI · Kreise lesen** (erzeugt)
36. Von außen nach innen: ein Kreis Schicht für Schicht (`annotate`)
37. Lückenkreise: Kreis mit fehlender Schicht, Lösung kopfüber auf der nächsten Seite
38. Zwei Kreise vergleichen: verwandte Formeln (`relatedBlock`-Logik)

**Teil VII · Kleine Formeln** (Tagesbuch, erzeugt aus dem Buch des Charakters)
39. Mein erster Zauber (Datum, Zeuge, was ich fühlte)
- je Zaubertrick und Alltagszauber im Buch eine Lektion: Kreis als Ansicht des Meisters, Formel dreimal mit wachsenden Lücken, Geste, Stoffe in Teilen, Übungsleiter ☐ mit Buch ☐ aus dem Gedächtnis ☐ unter Ablenkung, ☐☐☐ dreimal in Folge, Prüfvermerk. Ohne Zaubertricks im Buch: eine kleine Grundauswahl (Light, Detect Magic, Prestidigitation, Mage Hand, Message, Read Magic).

**Teil VIII · Das Gesellenstück**
40. Eine Formel zuschneiden: wie aus einem Basiszauber ein Alltagszauber wird (aus `everyday_spells.js`)
41. Das eigene Handbuch: die erste Seite im Reinbuch
42. Die Prüfung vor dreien: Prüfer, Aufsicht, Schreiber; Abschlussbogen

**Anhang**
- A Prüfscheibe (konzentrische Toleranzringe zum Auflegen; auf Pauspapier kopieren oder ausschneiden)
- B Pausblätter des Meisters: Lochpausen ausgewählter Glyphen mit 12, 6 und 3 Stützpunkten
- C Bewertungsbogen des Meisters
- D Versetzungsbogen
- E Glossar aller hervorgehobenen Begriffe mit Lektion
- F *[persönlich]* Ein loses Blatt, das nicht hierher gehört

Randkästen je Teil (neutral, neu formuliert): „Höchstes Lob des Meisters“, „Größte Furcht der Lehrlinge“, „Redensart der Werkstatt“.

### 4. Erzeugt oder geschrieben

| Teil | Quelle |
|---|---|
| Vorspann, I, II, IV (Lesestücke), VIII (Rahmen) | `data/primer.js`: geschriebene, setting-neutrale Texte |
| III, V, VI, VII, IV-31/32, Anhang B/E | erzeugt aus Glyphen, Theorie, Textgenerator und Buch |

`data/primer.js` setzt `window.PRIMER = { title, lessons: [...], boxes: {...} }`. Lesestücke werden auf Basis der Quellenstudie neu geschrieben; DSA-, Golarion-, D&D- und Hogwarts-Eigennamen aus den Listen „nicht in öffentliche Texte“ der Notizen sind tabu.

### 5. Essenzen in Teilen

Neue Funktion `T.parts(essences)` (in `theory.js`): rundet die Anteile auf halbe „Teile“ relativ zum kleinsten nennenswerten Anteil und beschreibt Zwischenwerte mit „knapp“, „stark“, „schwach“; gleiche Werte werden zusammengefasst („je ein schwaches Teil Aqua und Ignis“). Beispiel Vis 32, Terra 28, Spatium 12, Vita 11, Aqua 9, Ignis 8 → „drei Teile Vis, knapp drei Teile Terra, je ein starkes Teil Spatium und Vita, je ein schwaches Teil Aqua und Ignis“. Das Zauberbuch nutzt die Funktion später.

### 6. Stimmen am Rand und Freischalten

Profilfelder (nur `profile.local.js`):

```js
primer: {
  title: "…",                                  // optional
  master: { name: "…", preface: ["…"] },       // Vorrede in der Stimme des Meisters
  handover: { voice: "antalia", text: ["…"] }, // An den, der nach mir liest
  voices: { roderik: { label: "R.", hand: "angular", ink: "#5a3b1c" }, antalia: {…}, kirran: {…} },
  notes: { "l13": [{ voice: "roderik", text: "…" }, { voice: "antalia", text: "…", level: 1 }, …] },
  looseLeaf: { level: 7, voice: "roderik", ritual: { … }, strike: { voice: "antalia", text: "…" } },
  boxes: { … },                                // eigene Randkästen
}
```

- Hände: drei Schriftstile (`angular`, `flowing`, `even`), umgesetzt mit Caveat und zwei weiteren lokal mitgelieferten OFL-Schriften (Auswahl im Task). Tinte als Farbe; Antalias Hand kann gegen Ende des Hefts „zittriger“ werden (leichte Rotation und Unruhe per CSS).
- Freischalten: Eine Notiz mit `level` erscheint erst, wenn die Charakterstufe in den Einstellungen mindestens so hoch ist. Ohne eingetragene Stufe erscheinen nur Notizen ohne `level`.
- Das lose Blatt folgt dem Aufbau eines okkulten Rituals (Schule, Grad, Wirkzeit, Komponenten mit Nebenwirkern, Fertigkeitswürfe mit Erfolgen, Rückschlag, Misslingen, Wirkung) und ist als eingelegtes, schräg liegendes Blatt gestaltet; Streichungen und Notizen anderer Stimmen liegen darüber.

### 7. Ansicht im Reiter „Lehre“

Der Reiter „Lehre“ bekommt oben zwei Unterpunkte: „Lehre der Kreise“ (die bisherige Legende) und „Lehrheft“. Das Lehrheft wird als Ganzes gesetzt (mit `typeset`-Fortschritt), mit fortlaufenden Seitenzahlen wie im Zauberbuch und im Druck; angezeigt werden wie in der Buchvorschau eine oder zwei Seiten mit Blätterleiste. Rechts steht wie im Buch ein ausklappbares Inhaltsverzeichnis (Vorspann, Teile, Lektionen des aktuellen Teils, Anhang); ein Klick blättert zur Seite, und beim Blättern folgt das Verzeichnis dem aktuellen Teil. Lösungen (Lückenkreise) stehen am Ende der Lektion nach einem erzwungenen Seitenumbruch (`.break-before`), damit sie beim Arbeiten nicht im Blick sind; die folgende Lektion beginnt darunter (eine Lektion, die im oberen Drittel einer Seite beginnt, wird lieber geteilt als ganz verschoben), sodass keine Lösung allein steht. Im seitenweisen Satz und am Ende eines Teils entfällt der Umbruch. Wo Kreise auf mehrere Seiten gehen (Lückenkreise, Zwei Kreise vergleichen), steht die Aufgabe vorn mit einem Verweis (`taskFirst`). Profil-Beinamen (`primer.aliases`) erscheinen in Klammern hinter den irdischen Namen; gearbeitet wird mit den irdischen. Ganze Kreise stehen in Arbeitsgröße über Textspalte plus Randspalte; kleine Glyphen bleiben verkleinert. In „Kreise lesen“ stehen zwei Kreise auf einer Seite. Jede kleine Formel (Teil VII) bekommt eine feste Seite, die sich wie eine Zauberseite einpasst: Schrift und Kreis schrumpfen gemeinsam, bis die Lektion auf das Blatt passt. Das hält die Lektion beisammen und spart das teure Umbrechen (35 Zaubertricks: 0,5 statt 14 Sekunden). Beim Umbrechen der übrigen Teile wird die Ablage für den Rest (`content-visibility: hidden`) erst gesetzt, wenn sie an der Reihe ist. Gedacht ist das Heft auch für den A4-Druck (A5 hochskaliert) in einem Ringbuch: Ein Lochrand (Druck-Einstellung, an ab Werk) verbreitert die Bindungsseite, abwechselnd links und rechts nach Seitenzahl; die Randspalte liegt gespiegelt immer außen; Satzbreite und Spaltenbreite bleiben gleich, der Umbruch hängt also nicht von der Seite ab. Jeder Teil beginnt auf einer rechten Seite (Leerseite davor, wenn nötig), so stimmt die Seitenlage der Teilansicht mit dem Druck überein, und die Ansicht zeigt Doppelseiten wie im Heft (Seite 1 allein rechts). Ein Knopf „Lehrheft drucken“ setzt alle Teile über den bestehenden Druckweg (Fortschritt, Cache, Papierformat).

*Alternative:* die blätterbare Buchvorschau verallgemeinern. Verworfen für den ersten Schritt: Das Lehrheft ist in Teile gegliedert, die man einzeln aufschlägt; eine Teil-Ansicht ist einfacher und reicht.

## Risks / Trade-offs

- [Textmenge: Werkstatt, Ordnung und Lesestücke sind viel geschriebener Text] → Aufgaben je Teil; erst Struktur und erzeugte Teile, dann Texte Teil für Teil; Kürzen nach Durchsicht ist eingeplant.
- [Nähe zu Quelltexten] → Notizen sind bereits eigene Zusammenfassungen; Lesestücke werden frei geschrieben und gegen die Tabu-Listen der Notizen geprüft.
- [Umbruch mit Randspalte] → Randspalte als Teil des Seitengrids; `flow()` verschiebt Absätze, Glossen hängen am Absatz. Falls das nicht trägt: Glossen als Fußnoten der Seite.
- [Historische Rezepte mit giftigen Stoffen] → als Weltinfo mit deutlichem Kasten „Das Gift im Tintenfass“; keine Anleitung zum realen Nachmachen giftiger Farben.
- [Ungeprüfte Angaben aus der Recherche] (Pathfinder-Kosten für Abschrift, Tabelle der Stoffzeichen) → vor Verwendung gegen Regelwerk bzw. Quelle prüfen.

## Open Questions

- Titel des Hefts: „Fibel der Kreise“ oder anders?
- Planetenlektion in der persönlichen Fassung: irdische sieben Wandelsterne oder Golarions Himmelskörper (wie im Profil unter `correspond`)?
- Welche zwei zusätzlichen Handschriften (OFL) für Roderik (eckig) und Kirran (gleichmäßig)?
- Soll das lose Blatt auch in der neutralen Fassung als leeres Motiv (ein namenloses Fragment) vorkommen?

## Nachtrag: geschriebene Texte

Die Texte in `data/primer.js` sind die gemeinsame, setting-neutrale Grundlage für die öffentliche und die persönliche Fassung. Eine Lektion kann einen Weltinfo-Kasten tragen (`box: { title, text }`, z. B. „Das Gift im Tintenfass“, „Was ist hier schiefgelaufen?“). Formulare und Figuren kommen als Generatoren dazu: Unterschrift, Lehrvertrag, Glockenplan, Ausrüstungsliste, Seiteneinrichtung, Bodenkreis, Grundstriche, Konstruktionen I und II, Ringe, tria prima (Lösung nach erzwungenem Umbruch), Elemente mit Qualitätenkreuz, Wochenkreis (alte Reihe auf dem Siebenstern {7/3}), Zuschnitt (Grundformel gegen Alltagszauber aus den Daten), Entwurf der ersten Reinbuch-Seite, Prüfung vor dreien. Das lokale Profil kann einzelne Lektionen ganz oder teilweise ersetzen (`primer.lessons: { <id>: { read, glosses, box, task … } }`), etwa für Bezüge zur eigenen Welt; die gemeinsamen Texte bleiben neutral. Abschriftkosten werden nicht genannt.

## Context

Die App kennt eine einzige Tradition: Magier. Alles ist darauf zugeschnitten:
- `analyze()` nimmt den Magiergrad, sonst Hexenmeister, Arkanist, Magus oder Hexe, sonst den kleinsten Grad;
- `book.js` setzt Kreisseiten mit festem Seitenumfang je Grad;
- `prepare.js` kennt Grade 0–9 und einen Joker;
- der Filter `onlyWizard` schaltet die Magierliste ein.

Charaktere liegen in `CHARS.list()` als `{id, name, profile}`, ihre Daten unter `spellbook.c.<id>.<key>`. Die Analyse (Essenzen, Schule, Gestalt, Dauer) ist von der Klasse unabhängig und bleibt die gemeinsame Grundlage.

Daten:
- 291 Paladinzauber: Grad I: 89, II: 79, III: 62, IV: 61; 138 davon mit göttlichem Fokus.
- 498 Gottheiten, 299 mit heiligen Farben. Die Farbangaben bestehen aus 39 verschiedenen Begriffen, am häufigsten red, black, green, white, blue und gold.

## Goals / Non-Goals

**Goals:**
- Paladin als zweite Klasse, von Charakter-Slot bis Druck.
- Struktur so, dass Kleriker und Inquisitor später nur Klassendaten (Liste, Grade, Bezeichnungen) brauchen.
- Andachtsbild als eigener Renderer mit eigener Bildsprache.
- Gebete deterministisch generiert, eigene Gebete je Charakter.

**Non-Goals:**
- Mosaik und Steinintarsie (später als Materialvarianten desselben Renderers).
- Kleriker, Inquisitor, Domänenzauber, Kanalisieren.
- Antipaladin (eigener Folge-Change, siehe Entscheidung 10).
- Brevier-Auswahl aus der Statistik.
- Schnellglyphe für Andachtsbilder in den Listen: Listen behalten die Schnellglyphe der Analyse.
- Plätze aus Stufe und Charisma berechnen; die Tagesvorbereitung bleibt manuell.

## Decisions

### 1. Klassenbeschreibung als Daten (`CLASSES`)
In `app/js/classes.js`:
```js
CLASSES = {
  wizard:  { list: "wizard",  tradition: "arcane", grades: [0..9], joker: true,  book: "Zauberbuch", day: "Neuer Tag",    everyday: true },
  paladin: { list: "paladin", tradition: "divine", grades: [1..4], joker: false, book: "Brevier",    day: "Gebetsstunde", deity: true, alignments: ["LG","LN","NG"] },
}
```
`CLASS()` liefert die Beschreibung des aktiven Charakters (`CHARS.current().cls || "wizard"`).
- *Warum:* Kleriker und Inquisitor werden dann zu je einem Eintrag plus Bezeichnungen.
- *Verworfen:* `if (paladin)` an jeder Stelle.
- Auch Buchtitel, Kapitelüberschrift („Gebete des I. Grades“) und Vorspann-Texte kommen aus der Klassenbeschreibung, nicht fest aus dem Code.

### 2. Grad nach Klasse
`analyze(s, { cls })`: Ist `s.levels[cls]` gesetzt, gilt dieser Grad, sonst die bisherige Reihenfolge. Der Analyse-Cache in `app.js` wird um die Klasse erweitert. Die Essenzen hängen nicht vom Grad ab; die Ordnungsknoten der Magierkreise schon, sie werden aber nur beim Magier gezeichnet.

### 3. Gottheitsdaten
`tools/parse_deities.py` (Python, wie `parse_spells.py`) liest die Felder aus den `<b>Feld</b>`-Zeilen der AoN-Seiten und schreibt `data/deities.js`:
```js
window.DEITIES = [{ id, name, title, align, pantheon, areas: [...], domains: [...], subdomains: [...], weapon, symbol, animal, colors: [{ name, hex }] }]
```
- `colors` kommt aus einem festen Wörterbuch (39 Begriffe → Farbwerte, Glasfarben gesättigt). Zusätze in Klammern zählen beim ersten Aspekt; „none“, „all“, „n/a“ und „chromatic colors“ fallen weg.
- Ohne Farben gilt eine Palette nach Gesinnung (LG gold/weiß, NG grün/weiß, LN grau/blau …).
- Größe: etwa 150 KB, synchron geladen wie `spells.js`.

### 4. Charakter: `cls`, `deity`, Schlüssel `prayers`
- `CHARS.list()` erhält die Felder `cls` und `deity` (deity ist die id).
- `OWN` bekommt `prayers` (`{ spellId: text }`); Duplizieren kopiert die Gebete.
- Export und Import nehmen `prayers`, `cls` und `deity` mit.
- Ein Profil kann `cls` und `deity` vorgeben. Felder am Charakter haben Vorrang.
- Einstellungen, Abschnitt Charakter: Klasse (Auswahl) und Gottheit (Eingabe mit `datalist`, vorgefiltert nach Gesinnung, Schalter „alle Gottheiten“).
- Ein Klassenwechsel lädt neu wie ein Charakterwechsel.

### 5. Andachtsbild (`app/js/vitrail.js`)
`VITRAIL.render(m, deity, opts)` liefert ein SVG.

```
      ╱╲          Bogenfeld: heiliges Symbol (Motivbibliothek)
     ╱  ╲         + Maßwerk nach Schule (Dreipass, Vierpass, Fischblase …)
    ├─┬─┬─┤
    │ │◉│ │       Bahnen = Grad (1–4); Medaillon der Hauptessenz
    │ │ │ │       Scheiben: Voronoi aus Zauber-RNG, Bleiruten
    └─┴─┴─┘       Sockel: Wirkungsdauer (Band, Zinnen, Wellen …)
```

Zuordnung der Analyse:

| Analyse | Fenster |
|---|---|
| Grad | Anzahl der Bahnen |
| Schule | Maßwerk im Bogen |
| Hauptessenz | Medaillon in der mittleren Bahn (Farbe und kleines Zeichen der Essenz, gezeichnet als Glasmotiv, nicht als Magierglyphe) |
| Essenzanteile | Anteil der Akzentscheiben je Essenzfarbe |
| Heilige Farben | Grundscheiben (gewichtet 60/40 bei zwei Farben) |
| Gestalt | Richtung der Scheibenzellen (Strahl: senkrecht gestreckt, Ausbreitung: radial um das Medaillon) |
| Dauer | Ornament des Sockels |
| Rettungswurf | Randbordüre mit roten Gläsern |

Technik:
- Voronoi über ein einfaches Gitter mit Jitter plus Halbebenen-Schnitt je Zelle (keine Bibliothek; bei ≤ 120 Zellen je Bahn reicht O(n²)).
- Bleiruten als Zellkonturen mit dicker dunkler Linie, darüber eine helle Innenlinie.
- Glas mit leichtem Radialverlauf; Durchlicht als Filter optional, im Druck aus.
- Deterministisch über die vorhandene RNG je Zauber, Saat aus Zauber-id und Gottheits-id.

Motivbibliothek:
- etwa 15 einfache Pfade: Schwert, Sonne, Hammer, Amboss, Flamme, Schild, Waage, Auge, Stern, Krone, Mond, Schlüssel, Baum, Feder, Rose.
- Das Symbol entsteht aus Stichwörtern („sword“, „sun“, „hammer“ …), höchstens zwei Motive übereinander; ohne Treffer eine Rosette.
- *Verworfen:* Symbole frei zeichnen oder Bilder von AoN übernehmen (Lizenz, Aufwand).

### 6. Gebete (`app/js/prayer.js`)
`PRAYER.canon(m, deity)` liefert `{ title, lines[], refrain }`, deterministisch.

Bausteine:
- **Anrufung:** Name oder deutscher Beiname. Die Beinamen der häufigsten Gottheiten stehen in einem kleinen Wörterbuch, z. B. Iomedae → „die Erbin“; sonst der englische Beiname.
- **Lob:** eine Zuständigkeit oder Domäne. Die Domänen werden übersetzt (34 Begriffe, z. B. Glory → Ruhm, War → Krieg).
- **Bitte:** aus Schule und Hauptessenz (Verben aus `theory.js`) und dem Ziel („über meine Klinge“, „über diese Schar“).
- **Gelöbnis:** aus Lieblingswaffe oder Symbol.
- **Schluss:** Kehrvers.

Ton nach Gesinnung:
- *Achse Ordnung–Chaos:* rechtschaffen = Kehrvers nach jeder zweiten Zeile; neutral = Bitte und Amen; chaotisch = Ausrufe, wechselnde Länge.
- *Achse Gut–Böse:* gut = Schutz, Licht, Erbarmen; böse = Macht, Unterwerfung.

Eigene Worte werden in einem Textfeld der Detailansicht bearbeitet, gespeichert in `prayers`, und im Brevier in Handschrift (Caveat) gesetzt; ohne Text erscheinen 5 Linien.

### 7. Brevier im Buchsatz
- `BOOK.assemble` bekommt `opts.tradition`. Bei `divine`:
  - Vorspann: Titel, Gottheit, „Vom Lesen der Fenster“, Inhaltsverzeichnis;
  - Kapitel „Gebete des I. Grades“ (Kapitelseite mit großem Fenster-Ornament statt Polygon);
  - je Zauber genau eine Seite (`prayerPage`).
- Linksstart, Notizseiten und Erweitern entfallen, weil jede Zauberseite einseitig ist.
- Units, Seitenleiste, Inhaltsverzeichnis, Pager, (i), Regelband und Druck-Cache bleiben unverändert, weil sie nur Seiten und Einträge sehen.

### 8. Vorbereitung
- `prepare.js` liest `CLASS().grades`, `joker` und `day`. Gespeicherte Plätze außerhalb der Klassengrade bleiben erhalten, werden aber nicht angezeigt.
- Kein neues Protokollformat; die Statistik ordnet Grade über das klassenabhängige Modell.

### 9. Verzeichnis
- `settings.onlyWizard` wird zu `onlyClass` (Migration: true bleibt true).
- Alltagszauber nur, wenn `CLASS().everyday`.
- Die Detailansicht ruft `BOOK.spellPages` oder `BOOK.prayerPage`; der Kreis-Dialog zeigt bei `divine` das Andachtsbild (gleiche Schaltflächen, Schichten-Schalter ausgeblendet).

### 10. Vorbereitet für den Antipaladin
Der Antipaladin (chaotisch böse, eigene Liste mit 280 Zaubern, Grade I–IV) soll später nur ein Eintrag in `CLASSES` sein:
```js
antipaladin: { list: "antipaladin", tradition: "divine", grades: [1..4], joker: false, book: "Schwarzes Brevier", day: "Gebetsstunde", deity: true, alignments: ["CE","CN","NE"] }
```
Damit das ohne Umbau geht, gilt schon in diesem Change:
- **Gottheitsauswahl** filtert nach `alignments` der Klasse, nicht nach einer festen Liste.
- **Gebete** bekommen beide Achsen (Ordnung–Chaos, Gut–Böse) von Anfang an; böse und chaotische Bausteine werden mit angelegt und an einer bösen Beispielgottheit getestet.
- **Andachtsbild** bekommt einen Parameter `mood` aus der Gesinnung der Gottheit: `light` (klares Glas, gerade Bleiruten) oder `dark` (rauchiges Glas, Sprünge in den Scheiben, dornige Bleiruten). Umgesetzt wird in diesem Change nur `light`; `dark` ist eine Lücke mit Rückfall auf `light`.
- **Motivbibliothek** wird als Tabelle `Stichwort → Pfad` angelegt, damit Motive für finstere Symbole (Schädel, Klaue, Horn, Kette) später nur ergänzt werden.

## Risks / Trade-offs

- **Voronoi-Kosten bei 291 Seiten:** Bilder entstehen nur für sichtbare Seiten (Units). Im Druck dauert es mehr. → Grenze von 120 Zellen je Bahn; Messung mit `cdp.mjs` als Aufgabe.
- **Deutsche Beinamen:** Nicht jeder Beiname ist übersetzt. → Fallback auf den Namen, das Wörterbuch kann später wachsen.
- **Ähnliche Fenster:** Viele Paladinzauber sind „Lux + Vis, Bannmagie“ und könnten gleich aussehen. → Voronoi-Saat aus der Zauber-id und Sockel nach Dauer sorgen für Vielfalt; Prüfung an 20 Beispielen.
- **Klassenwechsel mit vollem Magierbuch:** Zauber außerhalb der Paladinliste bleiben im Buch. Das Brevier zeigt sie unter „Fremde Gebete“ am Ende, statt sie zu verlieren.
- **PI-Grenze:** Nur beschreibende Felder und eigene Texte; Beinamen-Übersetzungen sind beschreibend.

## Migration Plan

- Fehlendes `cls` gilt als `wizard`, `onlyWizard` wird zu `onlyClass`. Kirrans Daten bleiben unberührt; das prüft ein Test vor und nach dem Update.
- Ein Rückweg ist nicht nötig. Alte Fassungen ignorieren die neuen Felder.

## Open Questions

- Die Gottheit des Gruppen-Paladins ist noch offen. Der Standard ist Iomedae; Torag und Angradd sind über die Auswahl sofort verfügbar.
- Fehlt dem Brevier ein „Vom Gebet“-Vorspann (Gebetsstunde, Fokus, Gelübde)? Erstmal eine Seite mit generiertem Text aus der Gottheit.

## Why

Der Generator funktioniert für Magier gut, weil arkane Zauber analytisch sind und das Regelwerk feste Seitenumfänge vorgibt. Andere Klassen beziehen ihre Magie anders (Gottheit, Natur, Blut, Vertrauter, Musik) und brauchen eigene „Bücher“ oder Artefakte. Dieser Change sammelt die Ideen und Entscheidungen; umgesetzt wird jeweils in eigenen Changes. Erster Kandidat: **Paladin** (in der eigenen Gruppe vorhanden).

## Grundgedanke

Die Analyse (Essenzen, Zeichen, Gestalt, Grad) bleibt für alle Klassen gleich – sie beschreibt, *was* ein Zauber tut. Je Tradition wechselt nur die Darstellung: *wie* der Wirkende ihn versteht.

```
                     Zauber (Regeldaten)
                            │
                        analyze()
                            │
   ┌──────────┬─────────────┼─────────────┬──────────────┬─────────────┐
 Magier     Geweihte       Hexe        Hexenmeister     Druide        Barde
 Kreis      Andachtsbild   Vertrauter   Tattoo +        Kerbholz +    Lied
 + Formel   + Gebet        Erinnerung   Körperkarte     Jahresrad     (Noten + Text)
 Buch       Brevier        (kein Buch)  Körper          Stäbe         Liederbuch
 ─────────────── gleiche Tagesvorbereitung, Verlauf und Statistik ───────────────
```

## Erkenntnisse aus den Regeln (classes/, Zauberdaten)

| Klasse | Magie | Liste | Bekannt | Folge |
|---|---|---:|---|---|
| Magier | arkan, vorbereitet | 1795 | was im Buch steht | Buch (umgesetzt) |
| Hexe | arkan, vorbereitet | 1200 | „any number“, im Vertrauten | Erinnerungen des Vertrauten |
| Hexenmeister | arkan, spontan | 1911 | ~50 (inkl. Blutlinie) | wenige, ausführlich |
| Barde | arkan, spontan, bis Grad 6 | 872 | wenige | Repertoire |
| Kleriker | göttlich, vorbereitet | 1124 | alle | Brevier = Auswahl |
| Orakel | göttlich, spontan | 1124 | ~50 | Mysterium, Fluch |
| Inquisitor | göttlich, spontan, bis Grad 6 | 642 | ~40 | |
| Paladin | göttlich, vorbereitet, ab Klassenstufe 4, bis Grad 4 | 291 | alle | Brevier für alle 291 machbar |
| Antipaladin | göttlich, vorbereitet, chaotisch böse, bis Grad 4 | 280 | alle | Schwarzes Brevier (Folge-Change nach dem Paladin) |
| Druide | göttlich (Natur), vorbereitet | 777 | alle | Auswahl |

- Göttliche Zauber sind regeltechnisch gleich gebaut wie arkane (Grade, Schulen, V/S/M); anders sind Quelle, Vorbereitung (Gebet zu fester Zeit; Paladin: 1 Stunde stilles Gebet und Meditation), heiliges Symbol als Fokus (DF, 686 Zauber), keine Rüstungsbehinderung, Domänen.
- Ein Geweihter muss den Zauber nicht verstehen; die Gottheit hält die „Formel“. Wie analytisch er denkt, hängt am Gott (Nethys ≈ Hesinde in DSA).
- Hexe: Lernen aus Schriftrollen = Rolle verbrennen, Asche als Gebräu oder Pulver vom Vertrauten verzehrt; Lernen von anderem Vertrauten durch Zwiesprache; Vertrauter einer Toten behält Zauber 24 Stunden.

## Ideen je Tradition

- **Geweihte (Paladin, Kleriker, Inquisitor):** Brevier. Je Zauber ein **Andachtsbild** und ein Gebet in zwei Schichten: *Kanon der Kirche* (generiert aus dem Gottheitsprofil, formelhaft wie echte Liturgie; Ton nach Gesinnung: rechtschaffen = Litanei mit Wiederholung, chaotisch = ekstatischer Ruf) und *Eigene Worte* (handgeschrieben; fehlt der Text, bleibt ein liniertes Feld zum Hineinschreiben).
- **Andachtsbild:** bewusst andere Bildsprache als die Magierkreise. Beginn mit **Bleiglas** (Lanzettfenster, Voronoi-Scheiben, Bleiruten, Bogenfeld mit heiligem Symbol, Domänen-Embleme); **Mosaik** später als Alternative je Pantheon (z. B. Osirion, Tian Xia). Palette aus den heiligen Farben der Gottheit (bei 299 von 498 Göttern angegeben), Essenzen als Akzente.
- **Hexe:** Zwiegespräche mit dem Vertrauten (später vorlesbar über die Sprachausgabe des Browsers); Geschmack, Geruch und Konsistenz der Schriftrollen-Asche aus den Essenzen (Ignis pfeffrig, Aqua salzig, Terra mehlig, Mors bitter, Lux minzig, Umbra rauchig …). In anderen Welten auch Knotenschnüre.
- **Orakel:** Tarot – je Zauber eine Karte, der Fluch als Schattenkarte.
- **Hexenmeister:** Tattoos, Körperkarte (Zaubertricks an Fingern, Grad 1–3 Arme, 4–6 Rücken/Schultern, 7–8 Brust, 9 Stirn/Nacken, Blutlinie an den Beinen); Tattoo-Entwurf statt Kreis, „wie es sich anfühlt, wenn es brennt“.
- **Druide:** Runen auf Kerbhölzern; Jahresrad (Essenzen ↔ Jahreszeiten), mit dem Ingame-Datum der Tagesvorbereitung „gegen die Jahreszeit gewirkt“ als Randnotiz. Regeltechnisch spielen Jahreszeiten keine Rolle.
- **Barde:** Liederbuch. Melodie aus den Eigenschaften ableiten – Schule → Modus, Hauptessenz → Grundton und Klangfarbe, Grad → Länge und Ambitus, Zauberzeit → Tempo, V/S/M → Gesang/Rhythmus/Instrument, Rettungswurf → Fermate, Ordnung/Chaos → gerader/ungerader Takt; Ausgabe als ABC oder MusicXML; Liedtexte wie heute die Formeln. Später Anschluss an die Musikprojekte (Notenansicht, Liederdatenbank).

## Gottheiten

- Quelle: `dieties/` (498 Seiten von Archives of Nethys). Felder: Gesinnung, Pantheon, Zuständigkeiten, Domänen, Subdomänen, Lieblingswaffe, Symbol, heiliges Tier, heilige Farben, Gehorsamsritual, Kultzentren.
- **Lizenz:** Namen und beschreibende Angaben der Gottheiten sind unter Paizos Community Use Policy erlaubt (Change `adopt-community-use-policy`). Ein Werkzeug erzeugt aus `dieties/` eine **öffentliche** Datendatei mit Name, Gesinnung, Pantheon, Zuständigkeiten, Domänen, Lieblingswaffe, Symbol, heiligem Tier und heiligen Farben. Gehorsamsrituale, Segen und Beschreibungen werden nicht wörtlich übernommen; der Kanon der Kirche wird aus den Feldern generiert.
- Kandidaten für den Paladin („licht, rechtschaffen, richtet Nekromanten hin“): **Iomedae** (LG, Ehre, Gerechtigkeit, Herrschaft, Tapferkeit; Schwert und Sonne; rot/weiß; zentral im Kampagnenband *Wrath of the Righteous*), **Ragathiel** (LG, Ritterlichkeit, Pflicht, Rache; Gehorsam: einen erwiesenen Übeltäter in seinem Namen töten; karmesin/gold), **Damerrich** (LG, Hinrichtungen, Urteilskraft, Verantwortung; Taube auf Axt; grau/weiß). Sarenrae (NG) passt weniger – sie bietet zuerst Erlösung an.
- Zwergischer Paladin: **Torag** (LG, Schmiede, Schutz, Strategie; Hammer; gold/grau) oder **Angradd** (LG, Feuer der Schmiede, Tradition, Krieg). Dazu passt eine Materialvariante **Steinintarsie** (gleiche Voronoi-Engine wie Bleiglas).
- Standardfall für den ersten Change: **Iomedae** – häufigste Wahl für Paladine und Kleriker, Kernthema von *Wrath of the Righteous*; weitere Gottheiten kommen aus derselben Datendatei.

## Capabilities

### New Capabilities
- `divine-prayer-book`: Brevier für göttliche Wirker (erster Kandidat: Paladin)
- `deity-profiles`: Gottheiten als öffentliche Datendatei (aus AoN-Seiten erzeugt, nur beschreibende Felder)

### Modified Capabilities
- `character-slots`: Klasse und Gottheit je Charakter
- `character-profile`: Gottheitsfelder

## Impact

Umgesetzt in `add-paladin-prayer-book`: **„Paladin: Gottheitsprofil, Andachtsbild in Bleiglas, Brevier mit Kanon und eigenen Worten“** – mit Werkzeug für die Gottheitsdaten, Klasse und Gottheit am Charakter-Slot, Andachtsbild-Renderer, Gebetsgenerator, Brevier-Layout, Klassenliste als Filter, Tagesvorbereitung für Paladin-Plätze.

Offen:
- Welche Gottheit hat der Paladin der Gruppe? (Iomedae ist Standard; Torag und Angradd sind in der Auswahl.)
- Nächste Kandidaten: Antipaladin (Klasseneintrag + dunkles Glas), Kleriker und Inquisitor (Domänen), Barde.
- Reihenfolge: Paladin zuerst oder Barde (Liederbuch), solange der Paladin der Gruppe noch offen ist?
- Soll die Brevier-Auswahl wie beim Magier von Hand erfolgen oder sich aus der Statistik füllen (oder beides)?
- Weitere Fluff-Quellen (PDF-Sammlung) erst bei Bedarf, z. B. für Gebetston und Liturgie einzelner Kirchen.

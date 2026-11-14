## Why

Das Lehrheft kennt die Woche (Lektion „Der Wochenkreis“), aber nicht den Monat und nicht den Himmel. Ein Magier, der nach den Wandelsternen zeichnet, rechnet auch mit Monaten, Schutzgottheiten und Sternbildern. Eine Tafel der Zeit macht aus dem Wochenkreis eine Nachschlageübersicht im Sinn der Astrologie. Die Zuordnung von Monaten und Zeichen zu Schulen und Essenzen bleibt reiner Fluff: sie gibt dem Buch Stoff, aber keine Regelwirkung.

## What Changes

- **Lektion „Die Tafel der Zeit“** im Teil IV direkt nach dem Wochenkreis, mit Lesestück, Aufgabe und Prüfkriterien wie jede Lektion.
- **Tagestabelle:** sieben Tage in der Folge und mit den Wandelsternen des Wochenkreises (Sonne, Mond, Mars, Merkur, Jupiter, Venus, Saturn), je Tag Zeichen, Metall, Farbe und die zugeordnete Essenz. Tagesnamen aus dem Profil (`calendar.dayNames`), ohne Profil die irdischen.
- **Jahresring mit zwei Ringen:** außen die Monate mit Schutzgottheit, innen die Zeichen des Himmels mit gegeneinander versetzten Grenzen (die Zeichen sind nicht gleich lang und beginnen nicht am Monatsersten). Festtage aus `devotion.feasts` als Punkte.
- **Sternkarte des nördlichen Himmels:** Polarstern in der Mitte, die Zeichen als Sektoren um ihn, die Ekliptik als leichte S-Kurve durch die Sternbilder, wie man sie in der Wirklichkeit auf der Nordhalbkugel sieht. Die Bilder der Zeichen sind einfache Strichfiguren im Stil der Glyphen.
- **Affinitäten als Fluff:** Jeder Monat und jedes Zeichen erhält eine Affinität zu einer oder zwei Schulen und Essenzen. Für Monate folgt sie aus den Domänen der Schutzgottheit (vorhandene Zuordnung in `prayer.js`), für Zeichen aus einer kleinen Tabelle in den Daten. Die Tafel nennt die Affinität und den Gegenpol; es gibt keine Zuschläge und keine Hausregel.
- **Kein neues Profilfeld für Götter:** Die Schutzgottheit eines Monats ist ein Verweis (`calendar.patrons`: Liste von Ids aus `data/deities.js`). Name, Domänen, Farben und Symbol kommen aus `deities.js`. Das Profil benennt nur, welcher Monat welcher Id gehört, weil `deities.js` keine Monate kennt.
- **Neutral im Repository:** Ohne lokales Profil zeigt die Tafel den irdischen Tierkreis (12 Zeichen) und keine Schutzgottheiten. Die 13 Zeichen der Kosmischen Karawane, ihre Daten und die Monatspatrone stehen nur in `data/profile.local.js` (Beispiel in `profile.local.example.js`, neutral).
- **Backlog:** Der Eintrag „Kalender- und Wochenseite“ wird ersetzt; die Harrow-Karten (54 Karten, 6 Farben × 9 Gesinnungen) werden als Gedanke für ein späteres Orakel vermerkt.

## Capabilities

### New Capabilities
- `time-tables`: Tagestabelle, Jahresring, Sternkarte und Affinitäten aus Profil und Daten; Fallbacks ohne Profil

### Modified Capabilities
- `apprentice-primer`: neue Lektion „Die Tafel der Zeit“ mit Glossarbegriffen und Prüfbogenzeile
- `character-profile`: neue optionale Felder `calendar.dayNames`, `calendar.signs` (Name, Beginn, Ende, Bild, Affinität) und `calendar.patrons`

## Impact

- Neu: `app/js/time.js` (Ring und Sternkarte als SVG, Zuordnungen), Daten in `data/time.js` (Wochen- und Affinitätstabellen, neutraler Tierkreis)
- Geändert: `data/primer.js` (Lektion, Glossar), `app/js/primer.js` (Generator `time`), `data/profile.js` und `data/profile.local.example.js` (neue Felder), `backlog.md`
- Setting-eigenes (Zeichen der Karawane, Patrone, Festtage) nur in `data/profile.local.js`; Recherchegrundlage in `data/research/zeit-und-sterne-golarion.md` (gitignored)
- Keine neuen Bibliotheken; Strichfiguren und Karte sind handgeschriebenes SVG

## Nachtrag nach der Durchsicht (2026-11-14)

Nach dem Archivieren im Browser durchgesehen und überarbeitet, ohne eigenen Change:

- **Zu dicht:** Die eine Lektion stellte Tabellen und Zeichnungen ohne Text hintereinander; man musste viel blättern. Jetzt drei Lektionen („Die Tage und ihre Gestirne“, „Das Jahr und seine Schutzgötter“, „Die Zeichen des Himmels“), zwischen Zeichnung und Einträgen steht Text, jeder Tag, Monat und jedes Zeichen hat eigene Überlieferung.
- **Tage ohne Farben und Essenzen** bei Profilen mit eigenen Planeten (Kirran: Verces, Eox …): feste Zuordnung aus `data/time.js` als Rückfall.
- **Feste:** Das Lehrheft stammt aus der Werkstatt einer Meisterin, die nicht dem Gott des Charakters folgt; es nennt keine Feste. Festtage erscheinen nur als nachträgliche Punkte einer Stimme (`calendar.feastHand`), Quelle sind Vademecum und Andacht.
- **Gleiches Blau:** Viele Gottheiten teilen sich in `deities.js` dieselbe Grundfarbe. Jetzt hat jede Gottheit je Grundfarbe einen festen Farbstoff (`app/js/deity-colors.js`), auch in Andachtsbild und Vademecum; Aroden erhält Grün und Gold (fehlen in den Archives of Nethys).
- **Ring:** dünner Außenkreis um die Farbstreifen, lange Zeichennamen zweizeilig mit Trennstrich.

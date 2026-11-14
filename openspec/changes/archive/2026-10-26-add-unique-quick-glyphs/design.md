## Context

Die Schnellglyphe (`quickGlyph` in `app/js/circle.js`) besteht heute aus Kreis (offen, geschlossen, doppelt), Kurzfigur der Schule, Hauptessenz in der Mitte, Gestaltstrich und Gradpunkten. Auswertung über die Magierliste (1795 Zauber): 1074 Zauber haben einen Doppelgänger. Ursachen:

- Der Kreis unterscheidet nur drei Dauerformen; Runden, Minuten, Stunden, Tage, Konzentration und Besonders sehen gleich aus.
- `ray`/`targets` teilen einen Pfeil, `burst`/`spread`/`sphere`/`cube`/`cylinder` dieselben vier Striche, `object`/`sensor`/`symbol`/`other` haben keinen Strich. Berührung (Kerben auf den Diagonalen) und Explosion (Strahlen auf den Diagonalen) sind kaum zu trennen. Die Zielzahl fehlt ganz.
- Schule und Hauptessenz hängen stark zusammen (alle 57 Verzauberungen mit Grad 4 haben Mens).

Selbst mit allen Merkmalen des vollen Kreises bleiben 90 Magierzauber strukturell gleich (*Bear's Endurance*, *Cat's Grace*, *Fox's Cunning*). Sie lassen sich nur über den Inhalt trennen.

Die Formel (`formula` in `app/js/textgen.js`) beginnt mit der Kernzeile `{imp} {ess}, {shape}!`. Verb und Essenzwort zieht sie aus dem gemeinsamen Zufallsgenerator `r` von `generateTexts`; danach folgen alle weiteren Zeilen aus demselben Generator. Andere Formelsprachen nutzen dieselbe Ziehfolge mit eigenen Wortlisten (`app/js/lang.js`).

## Goals / Non-Goals

**Goals:**
- Auf der Zauberliste der aktiven Klasse (zusammen mit den Alltagszaubern) ist jede Schnellglyphe einmalig, für jede Klasse, mindestens aber für die Magierliste.
- Die Glyphe bleibt von Hand in wenigen Strichen zeichenbar.
- Was einzelne Zauber unterscheidet, steht in der Absicht der Formel, nicht in einer abstrakten Kennmarke.
- Alles bleibt deterministisch.

**Non-Goals:**
- Eindeutigkeit über den ganzen Katalog aller Klassen.
- Ein inhaltlicher Wortschatz je Wirkung (etwa *robur* für Konstitution). Die Kernzeile wird weiterhin aus den Wortlisten der Schule und Essenz gewählt.
- Die Kernzeilen der anderen Formelsprachen an die lateinische Wahl angleichen. Sie behalten ihre eigene Ziehung, und die Buchstaben beziehen sich auf die lateinische Fachformel.
- Der volle Kreis bleibt unverändert.

## Decisions

### 1. Kreis nach Dauer: vereinfachter Dauerring

Jede Dauerart bekommt eine eigene, schnell zeichenbare Kreisform in der Logik des Dauerrings (`THEORY.DURATIONS`):

| Dauer | voller Kreis | Schnellglyphe |
|---|---|---|
| Augenblicklich | gebrochener Ring | oben offen (wie heute) |
| Runden | Ring mit Zeitmarken | Kreis mit zwei kurzen Zeitmarken außen links und rechts |
| Minuten | gestrichelter Ring | gestrichelter Kreis |
| Stunden | doppelter Ring | doppelter Kreis |
| Tage | dreifacher Ring | dreifacher Kreis, eng gestaffelt |
| Permanent | Schlangenring | Kreis mit überlappendem Schwanzstück rechts außen |
| Konzentration | Ring mit Faden | Kreis mit einem Faden nach links unten außen |
| Besonders | Ring mit Lücke | Kreis mit seitlicher Lücke (rechts) |

Die Lücke oben bleibt der augenblicklichen Wirkung vorbehalten, weil dort der Gestaltstrich ansetzt. Heute ist Permanent ein Doppelkreis; das wird zum Schlangenring, weil der Doppelkreis jetzt Stunden bedeutet, wie im vollen Kreis.

*Alternative:* Punkte oder Ziffern für die Dauer. Verworfen, weil die Gradpunkte schon Punkte sind und Ziffern nicht zum Stil passen.

### 2. Ein Gestaltstrich je Gestaltart, Zielzahl als Anzahl

Alle Striche sitzen außen oben (zwischen Radius 50 und etwa 68), nur die Explosion bleibt auf den Diagonalen:

| Gestalt | Strich |
|---|---|
| Strahl | Pfeil nach außen (wie heute) |
| Berührung | Pfeil nach innen, Spitze auf dem Ring (statt der Kerben) |
| Ziele | Strich mit Knoten am Ende; 2 Ziele zwei, 3 und mehr drei gefächerte Striche |
| Kegel | Keil (wie heute) |
| Linie | Doppelstrich (wie heute) |
| Explosion | vier Strahlen auf den Diagonalen (wie heute) |
| Ausbreitung | kurze Wellenlinie |
| Ausströmung | Bogen (wie heute) |
| Säule | senkrechter Strich mit Querbalken (T) |
| Wand | Querstrich (wie heute) |
| Kugel | kleiner Kreis mit Äquator |
| Würfel | kleines Quadrat |
| Gegenstand | kleines gefülltes Quadrat |
| Selbst | Schleife (wie heute) |
| Herbeigerufenes | Tor (wie heute) |
| Sensor | kleines Auge |
| Zeichen | kleine Rune (Strich mit zwei Ästen) |
| Besondere Form | offene Schale |

Die Zielzahl wird bei drei gedeckelt. Das ändert an der Eindeutigkeit nichts: Mit und ohne Deckel bleibt die größte Gruppe auf der Magierliste bei 14, und auf keiner Klassenliste liegt sie über 17.

### 3. Absichtsbuchstaben aus der lateinischen Kernzeile

Neben der Schulfigur stehen zwei lateinische Großbuchstaben: links der Anfangsbuchstabe des Verbs, rechts der des Essenzworts (*Mulce memoria* → **M R** nach dem neuen Wortschatz, siehe 5). Sie stehen im Spalt zwischen Schulfigur (Radius ≤ 32) und Kreis (50):

- **Standard:** links und rechts auf halber Höhe.
- **Erkenntnis** (Auge, breit) und **Illusion** (zwei Kreise, breit): oben das Verb, unten das Essenzwort, mit Abstand zu den Gradpunkten.
- **Universalmagie** (Kreuz auf den Achsen): in den oberen Diagonalen, links das Verb, rechts das Essenzwort (unten stören die Gradpunkte).

Die Feinlage (Radius, Schriftgröße, Abstand zu Zeitmarken, Faden und Ringen beim dreifachen Kreis) wird per Screenshot abgestimmt. Die Buchstaben gehören zur lateinischen Fachformel, auch wenn das Buch die Formel in einer anderen Sprache zeigt. Latein bleibt die Sprache der Theorie.

*Alternative:* eine Kennmarke (Striche, Nummer) nur bei Kollision. Verworfen, weil sie willkürlich wäre; die Buchstaben sagen etwas über die Formel.

### 4. Eindeutige Kernzeile durch Zuordnung je Klassenliste

Eine Funktion `coreChoice(m)` in `textgen.js` liefert für einen Zauber die Indizes von Verb und Essenzwort im lateinischen Lexikon. Beim ersten Aufruf berechnet sie die Zuordnung für die Liste der aktiven Klasse (`CLASS.list`, sonst `wizard`) einschließlich der Alltagszauber und merkt sie sich:

1. Jeder Zauber erhält einen Glyphenschlüssel aus Schule, Hauptessenz, Grad, Dauerart, Gestaltart und Zielzahl (bis 3), also allem, was die Glyphe ohne Buchstaben zeigt.
2. Sein Wunschpaar stammt aus einem eigenen Generator `U.rng(m.seed ^ K)`, unabhängig von `r`.
3. Je Schlüsselgruppe, nach Zauber-ID sortiert: Ist das Buchstabenpaar des Wunschpaars frei, wird es genommen. Sonst wird ab dem Wunschpaar in fester Reihenfolge das nächste freie Paar gewählt.

Zauber außerhalb der Klassenliste (Katalogansicht) erhalten ihr Wunschpaar ohne Prüfung.

`formula()` zieht Verb und Essenzwort weiterhin aus `r`, damit sich die Ziehfolge und damit alle übrigen Zeilen und Texte nicht verschieben. Für Latein ersetzt sie die gezogenen Wörter dann durch die Wahl aus `coreChoice`. Andere Sprachen behalten ihre gezogenen Wörter. `quickGlyph` liest die Buchstaben ebenfalls aus `coreChoice`, nicht aus dem fertigen Text, damit auch handgeschriebene Formeln aus `custom_texts.js` die Glyphe nicht ändern.

*Alternative:* das Wunschpaar aus `r` ableiten, damit nur kollidierende Zauber eine neue Kernzeile bekommen. Verworfen, weil `r` an dieser Stelle schon Titel und Beiname gezogen hat. Die Zuordnung müsste dafür `generateTexts` bis zur Formel ausführen, und die ruft wiederum die Zuordnung auf. Da noch nichts gedruckt ist, ist eine neue Kernzeile für alle Zauber unproblematisch.

*Alternative:* die Zuordnung als Datei vorab berechnen. Verworfen: Sie hängt von der Klasse ab, der Rechenaufwand ist gering (einmal `analyze` über die Liste), und die App hat keinen Build-Schritt.

### 5. Wortschatz mit verschiedenen Anfangsbuchstaben

Die Listen in `data/formula-lang/latin.js` (und die Essenzwörter in `THEORY.ESS[].words`, die der Titel nutzt) werden so ersetzt, dass jede Liste eindeutige Anfangsbuchstaben hat:

| Liste | heute doppelt | Ersatz |
|---|---|---|
| Beschwörung | accerse, adduc, aperi (A) | accerse → evoca, adduc → duc |
| Hervorrufung | erumpe, emitte, effunde (E); frange, fulmina (F) | emitte → mitte, effunde → ure, fulmina → iacta |
| Illusion | finge, fallere (F) | fallere → decipe |
| Nekromantie | exhauri, excita, exanima (E); suge, sepeli (S) | exhauri → hauri, exanima → neca, sepeli → inhuma |
| ignis | flamma, favilla (F) | favilla → scintilla |
| aqua | gelu, glacies (G) | glacies → nix |
| aer | aer, aura (A) | aura → spiritus |
| vita | vita, vigor (V); salus, sanguis (S) | sanguis → cruor, vigor → flos |
| lux | lux, lumen (L) | lumen → dies |
| mens | mens, memoria (M) | memoria → recordatio |
| malum | malum, maledictio (M) | maledictio → dirae |
| tempus | mora, momentum (M) | momentum → saeculum |

Abschwörung, Erkenntnis, Verzauberung, Verwandlung, Universalmagie und die übrigen Essenzen sind schon eindeutig. Gleiche Buchstaben in *verschiedenen* Listen (etwa *aperi* in Beschwörung und Erkenntnis) stören nicht, weil Schule und Essenz in der Glyphe ohnehin sichtbar sind.

Kleinste Paarmenge: Universalmagie hat 5 Verben, die kürzesten Essenzlisten haben 5 Wörter, also mindestens 25 Paare je Gruppe, bei höchstens 17 Zaubern pro Gruppe.

## Risks / Trade-offs

- [Neue Zauber im Datenbestand verschieben die Zuordnung einer Gruppe] → Die Sortierung nach ID und das Wunschpaar halten Änderungen klein; Formeln eines bereits gedruckten Buchs könnten sich dann ändern. Später lässt sich das bei Bedarf durch eine eingefrorene Zuordnung im Profil absichern.
- [Klassenwechsel ändert Kernzeilen] → Schon heute ändern sich Grad und Formellänge mit der Klasse. Die Kernzeile folgt derselben Logik.
- [Die Glyphe wird voller] → Buchstaben, Dauerformen und Zielstriche bleiben wenige Striche. Der dreifache Kreis und die Buchstaben teilen sich den Spalt; das wird per Screenshot abgestimmt, notfalls mit kleineren Buchstaben.
- [Paare erschöpft] → Rechnerisch ausgeschlossen (mindestens 25 Paare, höchstens 17 Zauber je Gruppe). Das Prüfwerkzeug schlägt fehl, falls es doch passiert.
- [Ersetzte Wörter ändern Titel] → *lumen* steht unter den ersten drei Wörtern von lux und kommt in Titeln vor. Hinnehmbar, es ist noch nichts gedruckt.

## Migration Plan

Formel-Snapshot und Test-Baseline werden nach der Umstellung neu gesichert. Nichts ist gedruckt, eine Rückführung ist nicht nötig.

## Entschieden nach Rückfrage

- Die Buchstaben stehen in Tinte wie die Striche; die Rubrik bleibt der Hauptessenz vorbehalten.
- Woher die Buchstaben kommen, zeigen nur die Erklärungen der Schnellglyphe (Legende, Vorspann, Lehrheft) an einem Beispiel mit hervorgehobener Kernzeile. Die Formeln auf den Zauberseiten werden nicht markiert.
- Dass sich alle Kernzeilen ändern, ist in Ordnung.

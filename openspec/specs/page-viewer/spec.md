# page-viewer Specification

## Purpose
TBD - created by archiving change generalize-page-viewer. Update Purpose after archive.
## Requirements
### Requirement: Gemeinsamer Seitenbetrachter
Buchvorschau, Lehrheft und „Vom Gebet“ (Reiter „Lehre“ göttlicher Klassen) SHALL denselben Seitenbetrachter nutzen. Er MUST je nach verfügbarer Breite und Zoomstufe eine oder zwei Seiten zeigen, im Doppelseitenmodus Seite 1 allein rechts mit Platzhalter links und danach gerade|ungerade Paare. Bei 100 % MUST er auf schmalen Bildschirmen eine Seite auf Bildschirmbreite verkleinern; ist bei höherer Stufe auch eine Seite breiter als die Seitenfläche, MUST sich die Seitenfläche waagrecht verschieben lassen, ohne dass die übrige Oberfläche breiter wird. Bei Größenänderung des Fensters oder der Zoomstufe MUST er die Anzeige anpassen, ohne die Position zu verlieren.

#### Scenario: Vom Gebet blättern
- **WENN** ein Paladin den Reiter „Vom Gebet“ öffnet und Platz für zwei Seiten ist
- **DANN** zeigt die Ansicht Seite 1 allein rechts und eine Blätterleiste statt eines langen Seitenstapels

#### Scenario: Fenster verkleinern
- **WENN** im Lehrheft die Seiten 12|13 angezeigt werden und das Fenster so schmal wird, dass nur eine Seite passt
- **DANN** zeigt die Ansicht Seite 12, und Weiterblättern geht um eine Seite

#### Scenario: Vergrößern bis zur Einzelseite
- **WENN** im Buch die Seiten 12|13 angezeigt werden und so weit vergrößert wird, dass die Doppelseite nicht mehr nebeneinander passt
- **DANN** zeigt die Ansicht Seite 12 allein, und beim Verkleinern erscheint wieder die Doppelseite 12|13

#### Scenario: Einzelseite breiter als die Fläche
- **WENN** auf einem schmalen Bildschirm 200 % gewählt wird
- **DANN** lässt sich die Seite innerhalb der Seitenfläche waagrecht verschieben, und Kopf und Blätterleiste bleiben fensterbreit

### Requirement: Blätterleiste
Die Blätterleiste SHALL in allen Ansichten Anfang, zurück, vor und Ende bieten, die aktuelle Seitenzahl (bei Doppelseiten beide) und die Gesamtzahl zeigen und eine eingegebene Seitenzahl anspringen. Hat die Ansicht Einheiten (Zauber im Buch, Lektionen im Lehrheft), MUST sie zur vorigen und nächsten Einheit springen. Pfeiltasten und Bild-auf/-ab MUST blättern, solange kein Eingabefeld und kein Dialog den Fokus hat. Die Position MUST je Ansicht und Charakter gemerkt werden.

#### Scenario: Nächste Lektion
- **WENN** im Lehrheft mitten in Lektion 21 „nächste Einheit“ gewählt wird
- **DANN** zeigt die Ansicht die Seite, auf der Lektion 22 beginnt

#### Scenario: Seitenzahl eingeben
- **WENN** im Lehrheft „40“ eingegeben und Enter gedrückt wird
- **DANN** zeigt die Ansicht die Doppelseite mit Seite 40

#### Scenario: Buch wie bisher
- **WENN** im Buch geblättert, zum nächsten Zauber gesprungen oder eine Seitenzahl eingegeben wird
- **DANN** verhält sich die Buchvorschau wie vor dem Umbau

### Requirement: Seitenzoom
Der Seitenbetrachter SHALL in der Blätterleiste eine Zoom-Steuerung bieten: kleiner (−), die aktuelle Stufe in Prozent (Klick setzt auf 100 % zurück), größer (+) und „Einpassen“. Die Stufen MUST von 50 % bis 250 % in festen Schritten reichen; 100 % entspricht der bisherigen Anzeige. „Einpassen“ MUST die Seiten so groß zeigen, wie Breite und Höhe der Seitenfläche erlauben, und sich bei Fenstergrößenänderung neu einpassen. Der Zoom MUST nur die Seiten vergrößern; Blätterleiste, Seitenleisten und Kopf MUST ihre Größe behalten. Die Tasten `+`, `-` und `0` MUST zoomen bzw. zurücksetzen, solange kein Eingabefeld und kein Dialog den Fokus hat. Die Stufe MUST gerätebezogen gemerkt werden (eine für alle Ansichten und Charaktere). Satz, Seitenfüllung, Seitenzahlen und Druck MUST vom Zoom unberührt bleiben.

#### Scenario: Schrift größer, Oberfläche gleich
- **WENN** im Buch zweimal „+“ gewählt wird
- **DANN** sind die Seiten größer als vorher, die Blätterleiste und das Verzeichnis haben dieselbe Größe wie vorher, und auf den Seiten steht derselbe Text

#### Scenario: Zurücksetzen
- **WENN** bei 150 % die Prozentanzeige angeklickt oder `0` gedrückt wird
- **DANN** zeigt der Betrachter die Seiten wieder in 100 %

#### Scenario: Stufe gemerkt
- **WENN** im Lehrheft 125 % gewählt, die Seite neu geladen und dann das Buch geöffnet wird
- **DANN** zeigen Lehrheft und Buch die Seiten in 125 %

#### Scenario: Einpassen
- **WENN** „Einpassen“ gewählt und das Fenster danach vergrößert wird
- **DANN** wachsen die Seiten mit, bis sie die Seitenfläche in Breite oder Höhe ausfüllen

#### Scenario: Druck unverändert
- **WENN** bei 175 % gedruckt wird
- **DANN** ist das Druckergebnis dasselbe wie bei 100 %

### Requirement: Verzeichnis-Baustein
Ansichten mit Verzeichnis (Buch, Lehrheft) SHALL es rechts als ausklappbare Seitenleiste zeigen, gegliedert in auf- und zuklappbare Abschnitte. Ein Klick auf einen Eintrag MUST zur Seite blättern; beim Blättern MUST der Abschnitt der angezeigten Seite hervorgehoben sein. Ob die Leiste offen ist, MUST je Ansicht und Charakter gemerkt werden; welche Abschnitte offen sind, MUST während der Sitzung erhalten bleiben (zu Beginn sind alle zu, wie im Buch).

#### Scenario: Lehrheft-Verzeichnis
- **WENN** im Lehrheft-Verzeichnis „VI · Kreise lesen“ aufgeklappt und „Lückenkreise“ angeklickt wird
- **DANN** blättert die Ansicht zur Seite von Lektion 37, und „VI · Kreise lesen“ ist hervorgehoben

### Requirement: Austauschbares Setzen
Der Seitenbetrachter SHALL zwei Arten des Setzens unterstützen: ausschnittweise (nur die Seiten um die aktuelle Position, wie die Buchvorschau großer Bücher) und vollständig (alle Seiten einmal, wie Lehrheft und Lehre der Kreise). Während gesetzt wird, MUST ein Fortschritt sichtbar sein und die Oberfläche bedienbar bleiben; ein neuer Auftrag MUST einen laufenden abbrechen, ohne dass dessen Ergebnis erscheint.

#### Scenario: Großes Buch
- **WENN** ein Buch mit 269 Zaubern geöffnet wird
- **DANN** setzt der Betrachter nur den ersten Ausschnitt, und die Oberfläche bleibt bedienbar

#### Scenario: Einstellung während des Setzens geändert
- **WENN** das Lehrheft gesetzt wird und währenddessen der Lochrand abgeschaltet wird
- **DANN** erscheint nur das Ergebnis ohne Lochrand

### Requirement: Reiter Lehre ohne Unterpunkte
Bei arkanen Klassen SHALL der Reiter „Lehre“ direkt das Lehrheft zeigen; den Unterpunkt „Lehre der Kreise“ MUST es nicht mehr geben. Die Theorie-Seiten (bisher „Lehre der Kreise“) MUST weiterhin im Vorspann des Buches stehen, wenn der Vorspann eingeschaltet ist. Bei göttlichen Klassen bleibt der Reiter „Vom Gebet“ mit seinen Seiten. Hat der Charakter eine Gottheit, SHALL der Reiter zusätzlich eine Auswahl zwischen dem bisherigen Inhalt (Lehrheft bzw. „Vom Gebet“) und dem Vademecum zeigen; die Wahl MUST je Charakter gespeichert werden.

#### Scenario: Magier öffnet Lehre
- **WENN** ein Magier ohne Gottheit den Reiter „Lehre“ öffnet
- **DANN** erscheint sofort das Lehrheft, ohne Auswahl zwischen „Lehre der Kreise“ und „Lehrheft“

#### Scenario: Magier mit Gottheit
- **WENN** ein Magier mit Gottheit den Reiter „Lehre“ öffnet und zuletzt das Vademecum gewählt hatte
- **DANN** erscheint das Vademecum, und die Auswahl erlaubt den Wechsel zum Lehrheft

#### Scenario: Paladin
- **WENN** ein Paladin den Reiter „Vom Gebet“ öffnet
- **DANN** kann er zwischen „Vom Gebet“ und dem Vademecum wählen


## ADDED Requirements

### Requirement: Gemeinsamer Seitenbetrachter
Buchvorschau, Lehrheft und „Vom Gebet“ (Reiter „Lehre“ göttlicher Klassen) SHALL denselben Seitenbetrachter nutzen. Er MUST je nach verfügbarer Breite eine oder zwei Seiten zeigen, im Doppelseitenmodus Seite 1 allein rechts mit Platzhalter links und danach gerade|ungerade Paare, und auf schmalen Bildschirmen eine Seite auf Bildschirmbreite verkleinern. Bei Größenänderung des Fensters MUST er die Anzeige anpassen, ohne die Position zu verlieren.

#### Scenario: Vom Gebet blättern
- **WENN** ein Paladin den Reiter „Vom Gebet“ öffnet und Platz für zwei Seiten ist
- **DANN** zeigt die Ansicht Seite 1 allein rechts und eine Blätterleiste statt eines langen Seitenstapels

#### Scenario: Fenster verkleinern
- **WENN** im Lehrheft die Seiten 12|13 angezeigt werden und das Fenster so schmal wird, dass nur eine Seite passt
- **DANN** zeigt die Ansicht Seite 12, und Weiterblättern geht um eine Seite

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
Bei arkanen Klassen SHALL der Reiter „Lehre“ direkt das Lehrheft zeigen; den Unterpunkt „Lehre der Kreise“ MUST es nicht mehr geben. Die Theorie-Seiten (bisher „Lehre der Kreise“) MUST weiterhin im Vorspann des Buches stehen, wenn der Vorspann eingeschaltet ist. Bei göttlichen Klassen bleibt der Reiter „Vom Gebet“ mit seinen Seiten.

#### Scenario: Magier öffnet Lehre
- **WENN** ein Magier den Reiter „Lehre“ öffnet
- **DANN** erscheint sofort das Lehrheft, ohne Auswahl zwischen „Lehre der Kreise“ und „Lehrheft“

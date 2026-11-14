## ADDED Requirements

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

## MODIFIED Requirements

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

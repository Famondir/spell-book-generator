# divine-prayer-book Specification

## Purpose
TBD - created by archiving change add-paladin-prayer-book. Update Purpose after archive.
## Requirements
### Requirement: Brevier
Bei einem Charakter göttlicher Klasse SHALL „Mein Buch“ ein Brevier zeigen: Titelblatt, Seite der Gottheit (Beiname, Gesinnung, Zuständigkeiten, Domänen, Symbol, Farben, heiliges Tier, Lieblingswaffe), „Vom Lesen der Fenster“ mit beschriftetem Beispielfenster (zwei Bahnen, mit Bordüre) und nummerierter Legende, „Die Gläser“ (alle Essenzgläser und die Grundscheiben der Gottheit), „Maßwerk, Zellen und Sockel“ (Bahnen je Grad, Pässe je Schule, Zellmuster je Gestalt, Bordüre, Sockel je Dauer), „Das Medaillon“ (Blätter je Reichweite, Fassung je Komponentenzahl, Blattform je Zeitaufwand, Ring für Zauberresistenz), „Vom Gebet“, ein Inhaltsverzeichnis und je Grad ein Kapitel „Gebete des I. Grades“ usw.

#### Scenario: Paladin mit 20 Zaubern
- **WENN** ein Paladin 20 Zauber der Grade 1 und 2 im Brevier hat
- **DANN** enthält das Brevier den Vorspann, zwei Kapitel und 20 Zauberseiten

#### Scenario: Legende der Möglichkeiten
- **WENN** der Vorspann gelesen wird
- **DANN** zeigt er jede der 16 Essenzgläser, die Pässe jeder Schule, das Sockelmuster jeder Wirkungsdauer und jede Form des Medaillons

### Requirement: Zauberseite
Jede Zauberseite SHALL Titel, Andachtsbild, Kanon der Kirche, Eigene Worte und eine knappe Wirkungszeile (Zeitaufwand, Reichweite, Dauer, Rettungswurf) enthalten und MUST auf eine Seite passen.

#### Scenario: Langer Kanon
- **WENN** Kanon und eigenes Gebet nicht auf die Seite passen
- **DANN** wird die Schrift verkleinert, wie bei Magierseiten

### Requirement: Gleiche Werkzeuge wie beim Buch
Blättern, Seitenleiste mit Filter, Inhaltsverzeichnis, Regel-(i), Regelband, Druck mit Cache und Fortschrittsanzeige SHALL für das Brevier genauso funktionieren wie für das Zauberbuch.

#### Scenario: Regeltext
- **WENN** auf einer Brevierseite das (i) angeklickt wird
- **DANN** erscheint der englische Regeltext des Zaubers im Dialog


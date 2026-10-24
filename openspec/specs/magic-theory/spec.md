# magic-theory Specification

## Purpose
Die Magietheorie: Aus den Regeldaten eines Zaubers wird ein Modell abgeleitet, das Kreis und Texte bestimmt.

## Requirements

### Requirement: Essenzprofil
Die Analyse SHALL jedem Zauber ein Profil aus 16 Essenzen in 8 Gegensatzpaaren in Prozent zuordnen, gewichtet aus Deskriptoren, Unterschule, Schadensarten, Schlüsselwörtern, Materialien und einem Schul-Prior. Jede Essenz MUST ihre Belege (sources) mitführen.

#### Scenario: Feuerzauber
- **WENN** ein Zauber den Deskriptor [fire] hat
- **DANN** ist Ignis die Hauptessenz

### Requirement: Determinismus
Gleiche Eingaben SHALL immer dasselbe Modell, dieselben Texte und denselben Kreis ergeben (Seed aus der Zauber-ID).

#### Scenario: Zweimal rendern
- **WENN** derselbe Zauber zweimal analysiert wird
- **DANN** sind Modell, Formel und Kreis identisch

### Requirement: Modellbestandteile
Das Modell SHALL Grad, Schule, Verbindung (Combo), Spannung, Gestalt, Zeichen, Reichweite, Dauer, Zauberzeit, Komponenten mit deutschen Stoffnamen und Kosten, Rettungswurf, Zauberresistenz, Familie und mythische Eigenschaften enthalten.

#### Scenario: Teure Komponente
- **WENN** die Materialkomponente „1,000 gp jacinth“ lautet
- **DANN** erscheint sie als „Hyazinth“ mit Kosten und nicht als unbekannter Stoff

### Requirement: Lehre der Kreise
Die App SHALL eine Legende aller Schulen, Essenzen, Zeichen, Schnellglyphen, Alchemie-Symbole und eine Affinitätstabelle der Schulen zeigen.

#### Scenario: Ansicht öffnen
- **WENN** „Lehre der Kreise“ gewählt wird
- **DANN** erscheinen Legende und Affinitätstabelle

## ADDED Requirements

### Requirement: Lektion Tinten nach der Mischung
Teil IV „Die Zeichen der Stoffe“ SHALL nach „Mischungen in Teilen“ die Lektion „Tinten nach der Mischung“ enthalten: Lesestück mit einem begründeten Beispiel, eine aus den Daten erzeugte Tafel (Essenz, Farbe, Farbstoff, Metall, Gift) und eine Aufgabe, die Tinte der eigenen ersten Formel abzuleiten und zu begründen.

#### Scenario: Tafel aus den Daten
- **WENN** die Lektion erzeugt wird
- **DANN** zeigt die Tafel jede Essenz mit derselben Farbe und demselben Metall wie die Entsprechungen im Zauberbuch und markiert giftige Farbstoffe

#### Scenario: Randnotizen zur Lektion
- **WENN** das Profil Randnotizen für `l-inks` enthält
- **DANN** stehen sie neben der Lektion wie bei jeder anderen Lektion

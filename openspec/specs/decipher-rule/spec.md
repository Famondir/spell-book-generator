# decipher-rule Specification

## Purpose
TBD - created by archiving change add-formula-languages. Update Purpose after archive.
## Requirements
### Requirement: Hausregel Entziffern
Das Profil SHALL die Hausregel „Entziffern“ einschalten können; im neutralen Profil MUST sie aus sein. Ist sie aus, MUST nirgends ein Sprachenkunde-SG erscheinen.

#### Scenario: Aus
- **WENN** die Hausregel nicht eingeschaltet ist
- **DANN** zeigen Detailansicht und „Heute vorbereitet“ keinen SG

### Requirement: SG je Zauber
Bei eingeschalteter Hausregel SHALL die App je Zauber den Sprachenkunde-SG berechnen: Basis nach Verhältnis des Charakters zur Formelsprache plus Grad plus Zuschlag der Hand. Basiswerte und Zuschläge MUST aus dem Profil kommen; Vorgabe: beherrscht 10, verwandt 15, fremd 20, tot 25, Hand 0. Eine beherrschte Sprache MUST Vorrang vor „verwandt“ haben; „tot“ legt das Profil je Sprache fest.

#### Scenario: Beherrscht
- **WENN** der Charakter Latein beherrscht und ein lateinischer Zauber des 3. Grades in einer Hand ohne Zuschlag vorliegt
- **DANN** ist der SG 13

#### Scenario: Fremd mit Hand
- **WENN** der Charakter die Sprache nicht beherrscht, sie mit keiner beherrschten verwandt ist, der Zauber Grad 4 hat und die Hand +2 Zuschlag trägt
- **DANN** ist der SG 26

### Requirement: Anzeige
Der SG SHALL in der Detailansicht eines Zaubers und je Zauber in „Heute vorbereitet“ erscheinen, zusammen mit der Sprachbezeichnung. Das gedruckte Buch MUST den SG nicht enthalten.

#### Scenario: Vorbereitet
- **WENN** die Hausregel aktiv ist und ein Zauber vorbereitet wird
- **DANN** steht neben ihm „Entziffern SG n (Sprache)“

### Requirement: Neue Sprache
Ändern sich die beherrschten Sprachen eines Charakters, SHALL sich nur die SG ändern; Formeln, Verteilung und Buch MUST gleich bleiben.

#### Scenario: Sprache gelernt
- **WENN** der Charakter eine Sprache hinzulernt
- **DANN** sinkt der SG ihrer Zauber auf „beherrscht“, und das Buch ist unverändert


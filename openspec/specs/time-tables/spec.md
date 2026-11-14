# time-tables Specification

## Purpose
TBD - created by archiving change add-time-tables. Update Purpose after archive.
## Requirements
### Requirement: Tagestabelle
Die Tafel SHALL die sieben Tage der Woche in der Folge und mit den Wandelsternen des Wochenkreises zeigen (Sonne, Mond, Mars, Merkur, Jupiter, Venus, Saturn), je Tag mit Zeichen, Metall, Farbe und zugeordneter Essenz. Die Tagesnamen MUST aus `calendar.dayNames` kommen, sonst die irdischen. Die Tabelle MUST NOT Regelwerte enthalten.

#### Scenario: Ohne Profil
- **WENN** kein lokales Profil geladen ist
- **DANN** heißen die Tage Sonntag bis Samstag in der Folge Sonne, Mond, Mars, Merkur, Jupiter, Venus, Saturn

#### Scenario: Eigene Tagesnamen
- **WENN** das Profil sieben Tagesnamen angibt
- **DANN** stehen diese statt der irdischen, die Wandelsterne bleiben in derselben Folge

### Requirement: Jahresring
Die Tafel SHALL einen Ring mit zwei Ebenen zeichnen: außen die Monate des Profils mit irdischer Entsprechung und, soweit bekannt, ihrer Schutzgottheit, innen die Zeichen des Himmels. Beide Ringe MUST nach Tagen im Jahr geteilt sein, sodass die Grenzen der Zeichen gegen die der Monate versetzt liegen und ungleich lange Zeichen ihre wahre Länge haben. Festtage aus dem Profil MUST als Punkte auf dem Ring stehen.

#### Scenario: Dreizehn Zeichen
- **WENN** das Profil 13 Zeichen mit Beginn und Ende liefert
- **DANN** zeigt der innere Ring 13 Sektoren, deren Grenzen nicht mit den 12 Monatsgrenzen zusammenfallen

#### Scenario: Neutraler Tierkreis
- **WENN** das Profil keine Zeichen angibt
- **DANN** zeigt der innere Ring die zwölf Zeichen des irdischen Tierkreises mit ihren festen Datumsfenstern

#### Scenario: Zeichen über den Jahreswechsel
- **WENN** ein Zeichen im Dezember beginnt und im Januar endet
- **DANN** schließt sich sein Sektor über die Jahresnaht ohne Lücke

### Requirement: Schutzgottheit aus den Gottheitsdaten
Die Schutzgottheit eines Monats SHALL über `calendar.patrons` (Liste von Ids aus `data/deities.js`) bestimmt werden; Name, Domänen, Farben und Symbol MUST aus `deities.js` stammen und nicht im Profil wiederholt werden. Eine unbekannte Id MUST den Monat ohne Patron lassen und darf keinen Fehler auslösen.

#### Scenario: Patron gefunden
- **WENN** `patrons[0]` die Id einer Gottheit in `deities.js` ist
- **DANN** zeigt der Monat deren Namen, Farbe und Symbol

#### Scenario: Id unbekannt
- **WENN** eine Id in `deities.js` fehlt
- **DANN** erscheint der Monat ohne Patron, die übrigen Monate bleiben unverändert

### Requirement: Sternkarte
Die Tafel SHALL eine Sternkarte des nördlichen Himmels zeigen: Polarstern in der Mitte, die Zeichen als Sektoren um ihn, die Ekliptik als leicht S-förmige Kurve durch die Bilder, jedes Zeichen mit einer einfachen Strichfigur und seinem Namen. Eine Figur MUST nur aus Linien, Kreisen und Punkten bestehen.

#### Scenario: Karte gezeichnet
- **WENN** die Lektion „Die Tafel der Zeit“ gesetzt wird
- **DANN** steht auf einer eigenen Seite die Karte mit Polarstern, Ekliptik und allen Zeichen des Profils (oder des Tierkreises)

### Requirement: Affinitäten als Fluff
Jeder Monat und jedes Zeichen SHALL eine Affinität zu einer oder zwei Essenzen und Schulen haben, ausgegeben unter „Affinität“ zusammen mit dem Gegenpol. Für Monate MUST sie aus den Domänen der Schutzgottheit folgen, sonst entfällt sie; für Zeichen MUST sie aus der Datentabelle kommen. Die App MUST NOT Boni, Zuschläge oder Würfelwerte aus ihnen ableiten.

#### Scenario: Aus den Domänen
- **WENN** die Schutzgottheit eines Monats Domänen mit bekannter Essenz hat
- **DANN** nennt die Tafel die entsprechende Essenz als Affinität und ihren Gegenpol

#### Scenario: Keine Regelwirkung
- **WENN** ein Zauber an einem Tag oder in einem Monat vorbereitet wird
- **DANN** ändert sich weder SG, Wirkdauer noch Vorbereitung durch Tag, Monat oder Zeichen

### Requirement: Überlieferung je Eintrag
Jeder Tag, Monat und jedes Zeichen SHALL in der Lehre einen eigenen Block mit Kopfzeile und Text haben: bei Tagen die Überlieferung der Werkstatt aus `data/time.js` und, wenn das Profil ihn nennt, der Brauch (`calendar.dayTexts`); bei Monaten Jahreszeit, Schutzgott mit heiligen Farben, Text (`calendar.monthTexts`, sonst die Werkstatt-Überlieferung bei zwölf Monaten) und Affinität; bei Zeichen Zeit, Bild und Geschichte (`text`) und Affinität. Nennen die Entsprechungen des Profils keinen der sieben Wandelsterne, MUST die Zuordnung der Essenzen zu den Tagen aus `data/time.js` gelten, sodass jeder Tag Essenzen und Farbe hat. Die Einträge MUST einzeln umbrechen dürfen (keine seitenlangen Tabellen).

#### Scenario: Eigene Planeten im Profil
- **WENN** die Entsprechungen des Profils nur Planeten der Spielwelt nennen
- **DANN** zeigt jeder Tag trotzdem Essenzen und Farbe

### Requirement: Farbstoffe der Schutzgötter
Die heiligen Farben der Schutzgötter SHALL als Farbstoffe aus `app/js/deity-colors.js` erscheinen (Fähigkeit `deity-profiles`), sodass Götter mit derselben Grundfarbe verschiedene Töne tragen. Beide heiligen Farben MUST als Streifen am Ring und mit dem Namen des Farbstoffs beim Monat stehen; um die Streifen MUST ein dünner Außenkreis laufen, damit helle Farben sich vom Papier abheben.

#### Scenario: Vier blaue Götter
- **WENN** vier Schutzgötter Blau als heilige Farbe haben
- **DANN** tragen ihre Monate vier verschiedene Blautöne mit verschiedenen Namen

### Requirement: Festtage nur als Nachtrag einer Stimme
Das Lehrheft SHALL keine Liste der Festtage und keine Feste bei den Monaten enthalten. Nennt das Profil eine Stimme (`calendar.feastHand`), MUST der Jahresring die Festtage als Punkte in deren Tinte zeigen, als nachträgliche Eintragung. Die Festtage kommen aus dem Eintrag der eigenen Gottheit in `data/vademecum.local.js` (beide Hälften) und aus `devotion.feasts`; am selben Tag gilt der Name des Vademecums, ein fehlender Text kommt aus der Andacht. Feste ohne festen Tag erhalten keinen Punkt.

#### Scenario: Ohne Stimme
- **WENN** das Profil Festtage, aber keine `feastHand` hat
- **DANN** zeigt der Jahresring keine Festpunkte

#### Scenario: Punkte einer Stimme
- **WENN** `feastHand` eine Stimme mit eigener Tinte nennt
- **DANN** stehen die Festtage als Punkte in dieser Tinte im Ring

### Requirement: Setting-Eigenes bleibt lokal
Namen, Daten und Bilder fremder Sternbild- und Kalendersysteme sowie Monatspatrone MUST nur in `data/profile.local.js` stehen; `profile.local.example.js` MUST ein neutrales Beispiel zeigen. Die Tafel ohne lokales Profil MUST keinen Eigennamen aus einem Fremdsetting enthalten.

#### Scenario: Neutrale Ausgabe
- **WENN** die Tafel ohne lokales Profil gesetzt wird
- **DANN** enthält ihr Text weder Zeichen- noch Gottheitsnamen eines Fremdsettings


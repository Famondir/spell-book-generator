## MODIFIED Requirements

### Requirement: Abschnitte des Einstellungsdialogs
Der Einstellungsdialog SHALL in die Abschnitte „Charakter“, „Buch“, „Druck“ und „Bestand & Export“ gegliedert sein; es MUST immer genau ein Abschnitt sichtbar sein. Jede Einstellung MUST genau einem Abschnitt angehören:
- Charakter: Name, Profil, Klasse, Gottheit, Andachtsbild, Charakterstufe (arkan), Nur Zauber der Klassenliste, Charakter anlegen/duplizieren/löschen
- Buch: Besitzer, Buchtitel, Untertitel, Vorspann, Kapitel je Grad, Beginn links, Ausführliche Fassung, Regelverweise, Name des Meisters (Lehrheft)
- Druck: Papierformat, Format für Schriftrollen, Pergament-Hintergrund, Satz des Lehrhefts und Lochrand im Lehrheft (nur arkan), Seiten je Band
- Bestand & Export: Liste exportieren, Liste importieren, Buch leeren

Die Charakterstufe MUST als freiwillige Angabe gekennzeichnet sein, die nur Randnotizen im Lehrheft freischaltet; die App berechnet nichts daraus.

#### Scenario: Abschnitt wechseln
- **WENN** im geöffneten Dialog „Druck“ gewählt wird
- **DANN** zeigt der Dialog nur Papierformat, Schriftrollen, Hintergrund, Satz des Lehrhefts, Lochrand und Seiten je Band, und „Druck“ ist in der Abschnittsliste hervorgehoben

#### Scenario: Paladin
- **WENN** ein Paladin aktiv ist
- **DANN** fehlen im Abschnitt „Buch“ die nur arkanen Einstellungen (Beginn links, Ausführliche Fassung, Name des Meisters) wie bisher, ebenso die Charakterstufe (sie schaltet nur Notizen im Lehrheft frei), und „Charakter“ zeigt Gottheit und Andachtsbild

#### Scenario: Charakterstufe
- **WENN** im Abschnitt „Charakter“ die Stufe 7 eingetragen und „Fertig“ geklickt wird
- **DANN** ist die Stufe für diesen Charakter gespeichert, und das Lehrheft zeigt die Notizen bis Mindeststufe 7

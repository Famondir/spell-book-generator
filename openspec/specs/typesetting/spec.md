# typesetting Specification

## Purpose
TBD - created by archiving change generalize-page-viewer. Update Purpose after archive.
## Requirements
### Requirement: Satzmodul
Das Setzen von Seiten SHALL in einem eigenen Modul liegen, das nur Seiten-HTML und Satz-Klassen kennt, keine Zauber, Lektionen oder Einstellungen. Buch, Regelband, Schriftrollen, Gebetbuch, Lehrheft und Prüfbogen MUST es über dieselbe Schnittstelle nutzen (Seiten setzen mit Fortschritt; Ergebnis mit fortlaufender Nummerierung, wo verlangt). Das Ergebnis MUST für dieselben Seiten und Einstellungen dasselbe sein wie vor dem Auslagern.

#### Scenario: Unveränderte Seiten
- **WENN** nach dem Auslagern die Satz-Tests ohne `--update` laufen
- **DANN** bestehen alle Fälle mit den Sollwerten von vorher

### Requirement: Satz-Klassen als Vertrag
Das Satzmodul SHALL diese Klassen mit fester Bedeutung auswerten, und jede MUST im Modul beschrieben sein:
- `.flow`: fließende Seite; was nicht passt, wandert auf Folgeseiten (`.flow-cont`)
- `.splittable`: Block, dessen Kinder einzeln auf die Folgeseite wandern dürfen; die Fortsetzung trägt `data-split-of`
- `.keep-next`: steht nie als letztes Element am Seitenende
- `.break-before`: beginnt immer eine neue Seite (außer es steht schon oben)
- `.recto-start`: beginnt auf einer ungeraden Seite, nötigenfalls mit einer Leerseite (`.blank`) davor
- `.bind` / `.verso`: Lochrand auf der Bindungsseite; `.verso` wird nach der Seitenzahl vergeben, die Satzbreite bleibt gleich
- feste Seiten ohne `.flow`: Autofit verkleinert die Schrift (`--fit`), bis der Inhalt passt; optionale Füller (`.opt`) erscheinen, solange Platz ist

#### Scenario: Erzwungener Umbruch im Regelband
- **WENN** ein Abschnitt im Regelband `.break-before` trägt
- **DANN** beginnt er auf einer neuen Seite, genau wie die Lösungen im Lehrheft

#### Scenario: Rechte Seite ohne Lochrand
- **WENN** eine Seite `.recto-start` trägt, aber kein `.bind`
- **DANN** fügt das Modul trotzdem bei Bedarf eine Leerseite ein; ob ein Druckauftrag `.recto-start` vergibt, entscheidet der Auftrag

### Requirement: Gemeinsame Glyphenlegenden
Legenden der Glyphen (Essenzen, Schulen, Zeichen, Alchemie, Schulfiguren der Schnellglyphen) SHALL aus einer gemeinsamen Quelle erzeugt werden; „Lehre der Kreise“ und Lehrheft MUST dieselben Zeichen und Bezeichnungen zeigen.

#### Scenario: Neue Schulfigur
- **WENN** die Kurzfigur einer Schule geändert wird
- **DANN** zeigen „Lehre der Kreise“, Lehrheft (Lektion 33) und alle Schnellglyphen die neue Figur

### Requirement: Abschnitt statt Leerseite
Muss ein Teil auf einer rechten Seite beginnen und stünde davor eine Leerseite, SHALL der Satz stattdessen den letzten ganzen Abschnitt der vorangehenden fließenden Seite (mit allem, was ihm folgt) auf diese Seite setzen, sofern davor noch ein weiterer Abschnitt auf der Seite bleibt. Nur wenn das nicht geht, MUST eine Leerseite eingefügt werden.

#### Scenario: Lehrheft mit einem Alltagszauber mehr
- **WENN** Teil V des Lehrhefts eine Seite länger wird und Teil VI dadurch eine Leerseite davor bräuchte
- **DANN** steht die letzte Lektion von Teil V (z. B. „Drei Drills“) auf dieser Seite, und es gibt keine Leerseite

#### Scenario: Kein verschiebbarer Abschnitt
- **WENN** die Seite vor der Leerseite nur einen Abschnitt oder nur die Fortsetzung eines Abschnitts trägt
- **DANN** bleibt die Leerseite

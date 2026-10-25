## ADDED Requirements

### Requirement: Druck nach Bänden
Hat das Buch mehr als einen Band, SHALL „Buch drucken“ je Band einen eigenen Druckauftrag erzeugen: der Druckknopf heißt dann „Band II drucken / als PDF“ und druckt den in der Bandwahl gewählten Band; jeder Auftrag MUST nur die Seiten dieses Bandes mit dessen Seitenzahlen enthalten. Der Druck-Cache MUST je Band gelten. Schriftrollen und Regelband MUST unverändert bleiben.

#### Scenario: Band II drucken
- **WENN** das Buch drei Bände hat, Band II gewählt ist und „Band II drucken / als PDF“ geklickt wird
- **DANN** enthält der Druckauftrag genau die Seiten von Band II, beginnend mit seiner Titelseite als Seite 1

#### Scenario: Ein Band
- **WENN** keine Seitengrenze gesetzt ist
- **DANN** druckt „Buch drucken / als PDF“ wie bisher das ganze Buch in einem Auftrag

## MODIFIED Requirements

### Requirement: Stimmen am Rand
Das Lehrheft SHALL Randnotizen mehrerer Stimmen aus dem lokalen Profil neben den Lektionen zeigen, jede Stimme in eigener Handschrift und Tintenfarbe. Eine Notiz mit Mindeststufe MUST erst erscheinen, wenn die eingetragene Charakterstufe mindestens so hoch ist; ohne eingetragene Stufe erscheinen nur Notizen ohne Mindeststufe. Glossen haben am Rand Vorrang: Eine Glosse MUST in der Zeile ihres Begriffs stehen und darf nur durch eine andere Glosse nach unten verdrängt werden. Randnotizen der Stimmen SHALL an der frühesten Stelle ihrer Lektion stehen, an der sie keine Glosse verdrängen; ihre Reihenfolge aus dem Profil bleibt erhalten.

#### Scenario: Drei Stimmen
- **WENN** das Profil zur Lektion „Die hundert Kreise“ Notizen von drei Stimmen enthält
- **DANN** stehen sie in der Reihenfolge des Profils am Rand, in drei unterscheidbaren Handschriften und Tinten

#### Scenario: Freischalten
- **WENN** eine Notiz Mindeststufe 7 hat und die Charakterstufe 6 ist
- **DANN** fehlt die Notiz; nach Eintragen von Stufe 7 erscheint sie

#### Scenario: Glosse vor Randnotiz
- **WENN** eine Lektion Randnotizen hat und ihr erster Begriff mit Glosse im ersten Absatz steht
- **DANN** steht die Glosse auf Höhe des Begriffs, und die Randnotizen stehen darunter oder neben späteren Absätzen

#### Scenario: Platz vor der ersten Glosse
- **WENN** die erste Glosse einer Lektion erst im zweiten Absatz steht und neben dem ersten Absatz Platz für eine Randnotiz ist
- **DANN** steht die erste Randnotiz neben dem ersten Absatz, und die Glosse bleibt auf Höhe ihres Begriffs

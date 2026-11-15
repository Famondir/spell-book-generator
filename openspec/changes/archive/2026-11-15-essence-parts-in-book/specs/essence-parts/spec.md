## ADDED Requirements

### Requirement: Essenzanteile im Buch in Teilen
Überall, wo das Buch Essenzanteile als Text nennt, MUST es sie als Rezept in Teilen schreiben, nicht in Prozent. Das gilt für den Lauftext der Zauberseite, die Aufbauliste, die nummerierte Beschriftung des Kreises (Buch, Lehrheft, Kreis-Dialog) und die Lesart des Andachtsbilds. Ein Teil SHALL ein Zehntel sein, Zwischenwerte werden mit „knapp“, „gut“, „stark“, „schwach“, „-einhalb“, „ein halbes Teil“ und „eine Spur“ benannt. Gleich lautende Anteile MUST mit „je“ zusammengefasst werden. Die Formulierung MUST dieselbe sein wie im Lehrheft.

#### Scenario: Lauftext der Zauberseite
- **WENN** ein Zauber Vis 32 %, Terra 28 %, Spatium 12 %, Vita 11 %, Aqua 9 %, Ignis 8 % hat
- **DANN** steht auf seiner Zauberseite „Die Ladung der Formel verteilt sich auf 6 Essenzen: drei Teile Vis, knapp drei Teile Terra, je ein starkes Teil Spatium und Vita, je ein schwaches Teil Aqua und Ignis.“

#### Scenario: Beschriftung des Kreises
- **WENN** ein Kreis mit Lux 90 % und Vis 10 % beschriftet wird (im Lehrheft, im Buch oder im Kreis-Dialog)
- **DANN** lautet der Eintrag „Essenzring: neun Teile Lux, ein Teil Vis.“ und enthält kein Prozentzeichen

#### Scenario: Lesart des Andachtsbilds
- **WENN** die Lesart des Andachtsbilds die Akzentscheiben erklärt
- **DANN** nennt sie die Essenzen in Teilen, beim Material Stein mit dem Steinnamen hinter der Essenz

### Requirement: Essenzanalyse mit Teilen
Die Essenzanalyse auf der Zauberseite SHALL je Essenz den Balken nach Anteil behalten und rechts daneben die Teile-Angabe dieser einen Essenz zeigen statt der Prozentzahl. Die Angabe MUST in eine Zeile passen.

#### Scenario: Zwei Essenzen
- **WENN** ein Zauber Mens 81 % und Umbra 19 % hat
- **DANN** zeigt die Essenzanalyse bei Mens den Balken mit „acht Teile“ und bei Umbra den Balken mit „zwei Teile“

### Requirement: Englische Buchausgabe
In der englischen Buchausgabe MUST jede dieser Stellen die englische Rezeptform verwenden („three parts Vis, just under three parts Terra, a strong part each of Spatium and Vita …“). Sie MUST NOT auf eine deutsche Prozentliste zurückfallen.

#### Scenario: Beschriftung im englischen Buch
- **WENN** das Buch auf Englisch gesetzt ist und ein Kreis mit Lux 90 % und Vis 10 % beschriftet wird
- **DANN** lautet der Eintrag „Essence ring: nine parts Lux, one part Vis.“

### Requirement: Oberfläche in Prozent
Die App-Oberfläche außerhalb des Buchs (Tooltip der Schnellglyphe in der Liste, Essenzbalken der Detailansicht und der Dialog-Seitenleiste) SHALL weiter Prozentwerte zeigen. Das Modell MUST die Anteile weiter in Prozent führen.

#### Scenario: Tooltip in der Liste
- **WENN** in der Zauberliste auf die Schnellglyphe gezeigt wird
- **DANN** nennt der Tooltip die Anteile in Prozent

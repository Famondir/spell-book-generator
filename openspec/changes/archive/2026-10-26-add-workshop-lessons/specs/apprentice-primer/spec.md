## ADDED Requirements

### Requirement: Werkstatt-Lektionen Seife und Siegellack
Teil I „Die Werkstatt“ SHALL die Lektion „Seife und Lauge“ direkt nach „Farben und ihre Gifte“ und die Lektion „Siegellack und Petschaft“ direkt nach „Papier schöpfen“ enthalten. Beide MUST Lesestück, Glossen, Kasten, Aufgabe und Prüfkriterien haben und dürfen reale Gefahren (Lauge, giftige Farben) nur als Weltinfo mit Warnkasten nennen. „Siegellack und Petschaft“ SHALL zwei leere Siegelkreise (Entwurf des eigenen Zeichens, Abdruck) und ein Feld für das Datum zeigen, ohne vorgedrucktes Zeichen.

#### Scenario: Reihenfolge in der Werkstatt
- **WENN** das Inhaltsverzeichnis des Lehrhefts Teil I zeigt
- **DANN** folgen aufeinander: Wachstafel, Federkiel, Rußtinte und Tusche, Eisengallustinte, Farben und ihre Gifte, Seife und Lauge, Pergament, Papier schöpfen, Siegellack und Petschaft, Zirkel, Lineal und Schnur, Zauberkreide und Kreise am Boden

#### Scenario: Magische Gegenstücke
- **WENN** die beiden Lektionen gelesen werden
- **DANN** beschreibt „Seife und Lauge“ eine Seife mit gebundenem Reinigungszauber und das Imprägnieren von Stoff mit Seife und Alaun und „Siegellack und Petschaft“ ein wachendes Siegel mit gebundenem Wachzauber, beide ohne Regelwirkung

#### Scenario: Petschaft entwerfen
- **WENN** die Lektion „Siegellack und Petschaft“ gedruckt wird
- **DANN** stehen unter der Aufgabe zwei leere Doppelkreise in Siegelgröße und ein Feld „gesiegelt am“, und die Lektion passt auf eine Seite

### Requirement: Lektion Sigillenbau
Teil III „Die Glyphen“ SHALL als letzte Lektion „Sigillenbau“ enthalten. Sie MUST für einen Beispielsatz die Streichschritte zeigen (Satz, ohne wiederholte Buchstaben, ohne Vokale, Restbuchstaben) und eine Ansicht des Meisters, in der die Restbuchstaben als Strichbuchstaben übereinanderliegen. Für zwei weitere Sätze SHALL sie nur die Streichschritte und eine leere Fläche zeigen. Das lokale Profil MAY die Beispielsätze ersetzen.

#### Scenario: Streichschritte
- **WENN** die Lektion für den Satz „Schutz für dieses Buch“ erzeugt wird
- **DANN** zeigt sie den Satz, die Folge ohne wiederholte Buchstaben, die Folge ohne Vokale und die Ansicht des Meisters mit genau diesen Restbuchstaben

#### Scenario: Eigene Sätze im Profil
- **WENN** das Profil für `g-sigil` eigene Sätze festlegt
- **DANN** erzeugt die Lektion die Streichschritte und die Ansicht aus diesen Sätzen

### Requirement: Seife und Siegellack in der tria prima
Die Aufgabe der Lektion „Das brennende Scheit“ SHALL Seife und Siegellack unter den zuzuordnenden Stoffen führen; die kopfüber gesetzte Lösung MUST Seife als Sulfur und Sal zu gleichen Teilen und Siegellack als Sulfur nennen.

#### Scenario: Lösung
- **WENN** die Lösung der tria-prima-Aufgabe gedruckt wird
- **DANN** nennt sie acht Stoffe, darunter Seife mit zwei Grundsätzen

## MODIFIED Requirements

### Requirement: Aufbau einer Lektion
Jede Lektion SHALL ein Lesestück, eine Aufgabe und Prüfkriterien haben; zeigt sie ein Muster, MUST es als „Ansicht des Meisters“ mit dem Hinweis „nicht nachfahren – abzeichnen“ erscheinen; ganze Kreise (Kleine Formeln, Kreise lesen) MUST so groß stehen, dass man sie ohne Lupe abzeichnen kann; in „Kreise lesen“ SHALL je Seite Platz für zwei Kreise sein, und jede kleine Formel MUST auf genau eine Seite passen (Kreis und Schrift werden dafür gemeinsam verkleinert). Die Prüfvermerke MUST NOT im Heft stehen, sondern gesammelt in einem eigenen Prüfbogen (eigener Druckauftrag, Handzettel des Meisters): je Lektion eine Zeile mit Skala 0–3 je Kriterium und einem Urteil (nondum, probatum, laudandum) mit Feld für Datum und Kürzel. Hervorgehobene Begriffe im Lesestück MUST in Rubrikfarbe stehen und am Rand sowie im Glossar erklärt werden. Die Nummer einer Lektion MUST sich aus ihrer Stelle unter den nummerierten Lektionen ergeben, nicht aus ihrer Id; Kicker, Inhaltsverzeichnis, Glossar und Prüfbogen MUST dieselbe Nummer zeigen. Verweise auf andere Lektionen im Text SHALL über deren Id laufen und beim Satz als aktuelle Nummer erscheinen.

#### Scenario: Begriff hervorgehoben
- **WENN** die Lektion „Die Wandelsterne“ den Begriff „Luft“ hervorhebt
- **DANN** steht „Luft“ im Lesestück in Rubrikfarbe, am Rand steht eine kurze Erklärung mit Glyphe und Essenz, und das Glossar verweist auf diese Lektion

#### Scenario: Nummer nach Reihenfolge
- **WENN** zwei neue Lektionen vor „Zirkel, Lineal und Schnur“ eingefügt sind
- **DANN** trägt „Zirkel, Lineal und Schnur“ die Nummer 10, ihre Id bleibt `l8`, und eine Randnotiz des Profils unter `l8` erscheint weiter an dieser Lektion

#### Scenario: Verweis auf eine Lektion
- **WENN** „Der Wochenkreis“ auf die Siebeneck-Näherung verweist
- **DANN** nennt der Text die aktuelle Nummer der Lektion „Konstruieren III“, nicht eine fest eingetragene Zahl

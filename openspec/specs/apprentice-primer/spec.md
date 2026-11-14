# apprentice-primer Specification

## Purpose
TBD - created by archiving change add-apprentice-primer. Update Purpose after archive.
## Requirements
### Requirement: Lehrheft
Die App SHALL für arkane Klassen ein Lehrheft im A5-Format bereitstellen: Vorspann (Titelblatt, Vorrede des Meisters, Lehrvertrag, Hausordnung und Tagesplan, Ausrüstung, Gebrauchsanweisung), die Teile Werkstatt, Hand und Kreis, Glyphen, Zeichen der Stoffe, Schnellglyphen, Kreise lesen, Kleine Formeln und Gesellenstück sowie einen Anhang (Prüfscheibe, Pausblätter, Bewertungsbogen, Versetzungsbogen, Glossar) und dahinter den Abschnitt Alltagszauber.

#### Scenario: Lehrheft öffnen
- **WENN** ein Magier im Reiter „Lehre“ das Lehrheft wählt
- **DANN** zeigt die App links das Inhaltsverzeichnis mit Vorspann, acht Teilen und Anhang und rechts die Seiten des gewählten Teils, blätterbar wie die Buchvorschau (eine oder zwei Seiten je nach Breite, Pfeiltasten), und die Legende „Lehre der Kreise“ ist ausgeblendet

#### Scenario: Ohne Profil
- **WENN** kein lokales Profil geladen ist
- **DANN** ist das Lehrheft vollständig, nennt „den Meister“ ohne Namen und enthält keine Randnotizen von Stimmen und kein loses Blatt

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

### Requirement: Kein Übungsvordruck
Das Lehrheft MUST NOT Flächen mit vorgedruckten Linien zum Nachfahren enthalten. Vorgedruckt SHALL nur werden: Ansichten des Meisters, die Prüfscheibe, Lochpausen mit 12, 6 und 3 Stützpunkten und Bögen zum Ausfüllen.

#### Scenario: Hundert Kreise
- **WENN** die Lektion „Die hundert Kreise“ gedruckt wird
- **DANN** beschreibt sie die Aufgabe für ein eigenes Blatt oder die Wachstafel und verweist auf die Prüfscheibe im Anhang, ohne 100 vorgedruckte Kreise

### Requirement: Erzeugter Lehrstoff
Die Lektionen zu Essenzen, Schulen, Zeichen, Ecksteinen, Zeitmarken, Schnellglyphen, Kreislesen und Stoffzeichen SHALL aus den Daten der App erzeugt werden, sodass sie zu den Kreisen im Zauberbuch passen.

#### Scenario: Essenzen
- **WENN** die Lektion „Die Essenzen“ erzeugt wird
- **DANN** erscheint jede Essenz der Theorie mit derselben Glyphe wie im Essenzring der Kreise, ihrem lateinischen Namen und ihren Entsprechungen

#### Scenario: Lückenkreis
- **WENN** die Lektion „Lückenkreise“ erzeugt wird
- **DANN** steht die Aufgabe vor den Kreisen mit dem Hinweis, dass die Kreise folgen
- **DANN** zeigt sie Kreise mit je einer fehlenden Schicht, und die Lösung steht kopfüber oben auf der nächsten Seite, darunter beginnt die folgende Lektion (die Lösung steht nie allein auf einer Seite)

### Requirement: Kleine Formeln als Tagesbuch
Teil „Kleine Formeln“ SHALL jeden Zaubertrick (offizieller Kanon) aus dem Buch des Charakters enthalten; die Alltagszauber des Buches MUST in einem eigenen Abschnitt „Alltagszauber“ hinter dem Anhang stehen (entfällt ohne Alltagszauber) und genauso aufgebaut sein, mit der Schnellglyphe des Zaubers unten bündig mit dem Kreis auf der Seite des Lochrands, ohne den Kreis zu verkleinern. Die Übersicht im Teil „Schnellglyphen“ MUST nur die Zaubertricks listen. Jede kleine Formel SHALL enthalten: Kreis als Ansicht des Meisters, die Formel dreimal mit wachsenden Lücken, Geste, Stoffe mit Essenzen in Teilen, Übungsleiter (mit Buch, aus dem Gedächtnis, unter Ablenkung), drei Kästchen „dreimal in Folge“ und Prüfvermerk. Enthält das Buch keine Zaubertricks, MUST eine kleine Grundauswahl erscheinen.

#### Scenario: Zaubertrick im Buch
- **WENN** „Prestidigitation“ im Buch steht
- **DANN** hat das Lehrheft eine Lektion zu Prestidigitation mit Formel in drei Durchgängen mit wachsenden Lücken

#### Scenario: Leeres Buch
- **WENN** das Buch keinen Zaubertrick enthält
- **DANN** enthält „Kleine Formeln“ die Grundauswahl (Light, Detect Magic, Prestidigitation, Mage Hand, Message, Read Magic)

#### Scenario: Alltagszauber im Buch
- **WENN** ein Alltagszauber im Buch steht
- **DANN** steht er nicht in „Kleine Formeln“, sondern auf einer eigenen Seite im Abschnitt „Alltagszauber“ hinter dem Anhang, und er fehlt in der Schnellglyphen-Übersicht

#### Scenario: Kein Alltagszauber
- **WENN** das Buch keinen Alltagszauber enthält
- **DANN** hat das Lehrheft keinen Abschnitt „Alltagszauber“

#### Scenario: Schnellglyphe am Lochrand
- **WENN** die Seite eines Alltagszaubers rechts liegt (Lochrand links)
- **DANN** steht die Schnellglyphe links, unten bündig mit dem Kreis, und der Kreis ist so groß wie bei einem Zaubertrick; auf einer linken Seite steht sie rechts

### Requirement: Essenzen in Teilen
Im Lehrheft MUST jedes Essenzprofil als Rezept in Teilen stehen, mit „knapp“, „stark“ und „schwach“ für Zwischenwerte und zusammengefassten gleichen Anteilen, nicht in Prozent.

#### Scenario: Profil als Rezept
- **WENN** ein Zauber Vis 32 %, Terra 28 %, Spatium 12 %, Vita 11 %, Aqua 9 %, Ignis 8 % hat
- **DANN** steht im Lehrheft „drei Teile Vis, knapp drei Teile Terra, je ein starkes Teil Spatium und Vita, je ein schwaches Teil Aqua und Ignis“

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

### Requirement: Übergabe und loses Blatt
Das Profil SHALL ein Übergabeschreiben einer Stimme („An den, der nach mir liest“) direkt nach dem Titelblatt und ein loses Blatt am Ende des Anhangs setzen können. Das lose Blatt MUST als eingelegtes Blatt gestaltet sein, den Aufbau eines okkulten Rituals haben (Schule, Grad, Wirkzeit, Komponenten mit Nebenwirkern, Fertigkeitswürfe, Rückschlag, Misslingen, Wirkung) und Streichungen und Notizen anderer Stimmen tragen können; es SHALL ebenfalls eine Mindeststufe haben können.

#### Scenario: Loses Blatt mit Streichung
- **WENN** das Profil ein loses Blatt mit Mindeststufe 7 und einer Streichung durch eine zweite Stimme enthält und die Charakterstufe 7 ist
- **DANN** liegt am Ende des Anhangs das Ritualblatt schräg eingelegt, durchgestrichen, mit der Notiz der zweiten Stimme darüber

### Requirement: Lehrheft drucken
Das Lehrheft SHALL vollständig druckbar sein (alle Teile, mit Seitenzahlen und Kolumnentiteln), über den bestehenden Druckweg mit Fortschrittsanzeige und Druck-Cache.

#### Scenario: Drucken
- **WENN** „Lehrheft drucken“ geklickt wird
- **DANN** zählt die Fortschrittsanzeige die gesetzten Seiten hoch, und der Druckdialog zeigt das ganze Lehrheft im gewählten Papierformat

#### Scenario: Prüfbogen
- **WENN** „Prüfbogen drucken“ gewählt wird
- **DANN** entsteht ein eigener Druck mit einer Zeile je Lektion mit Prüfkriterien (auch je kleiner Formel), und im Lehrheft selbst steht kein Prüfkasten

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

### Requirement: Lektion Tinten nach der Mischung
Teil IV „Die Zeichen der Stoffe“ SHALL nach „Mischungen in Teilen“ die Lektion „Tinten nach der Mischung“ enthalten: Lesestück mit einem begründeten Beispiel, eine aus den Daten erzeugte Tafel (Essenz, Farbe, Farbstoff, Metall, Gift) und eine Aufgabe, die Tinte der eigenen ersten Formel abzuleiten und zu begründen.

#### Scenario: Tafel aus den Daten
- **WENN** die Lektion erzeugt wird
- **DANN** zeigt die Tafel jede Essenz mit derselben Farbe und demselben Metall wie die Entsprechungen im Zauberbuch und markiert giftige Farbstoffe

#### Scenario: Randnotizen zur Lektion
- **WENN** das Profil Randnotizen für `l-inks` enthält
- **DANN** stehen sie neben der Lektion wie bei jeder anderen Lektion

### Requirement: Gebete für den Tag
Hat der Charakter eine Gottheit, SHALL das Lehrheft hinter dem Anhang und vor den Alltagszaubern einen Teil „Gebete für den Tag“ enthalten (eigene Ergänzung, nicht Teil des klassischen Lehrhefts): Morgengebet und Abendgebet als feste Form (ohne Bezug auf einen bestimmten Spieltag), die Anlass-Gebete und, falls im Profil vorhanden, die Festtage mit Datum. Ohne Gottheit MUST der Teil fehlen.

#### Scenario: Magier mit Schutzgottheit
- **WENN** ein Magier mit Schutzgottheit das Lehrheft öffnet
- **DANN** enthält das Inhaltsverzeichnis den Teil „Gebete für den Tag“ mit Morgen-, Abend- und Anlass-Gebeten

#### Scenario: Ohne Gottheit
- **WENN** ein Magier ohne Gottheit das Lehrheft öffnet
- **DANN** gibt es keinen Teil „Gebete für den Tag“

### Requirement: Lektion Tafel der Zeit
Das Lehrheft SHALL im Teil IV direkt nach „Der Wochenkreis“ drei Lektionen der Tafel der Zeit enthalten: „Die Tage und ihre Gestirne“ (Tage mit Überlieferung), „Das Jahr und seine Schutzgötter“ (Jahresring, Monate, Festtage) und „Die Zeichen des Himmels“ (Sternkarte, Zeichen), jede mit Lesestück, Aufgabe und eigenen Prüfkriterien. Zwischen einer Zeichnung und den folgenden Einträgen MUST erklärender Text stehen. Die Lektionen MUST die Begriffe Affinität, Schutzgott, Festtage, Polarstern und Ekliptik im Glossar erklären und die Affinitäten als Fluff kennzeichnen. Die Prüfbogenzeilen MUST dieselben Nummern tragen wie die Lektionen.

#### Scenario: Lektionen im Inhaltsverzeichnis
- **WENN** das Lehrheft geöffnet wird
- **DANN** stehen die drei Lektionen im Teil IV hinter „Der Wochenkreis“, und die folgenden Lektionen sind um drei weitergezählt

#### Scenario: Glossar
- **WENN** das Lesestück „Ekliptik“ hervorhebt
- **DANN** steht der Begriff in Rubrikfarbe, am Rand und im Glossar mit Verweis auf die Lektion

#### Scenario: Ohne Profil
- **WENN** kein lokales Profil geladen ist
- **DANN** sind die Lektionen vollständig, mit irdischen Tagesnamen, Werkstatt-Überlieferung je Monat und dem Tierkreis, und enthalten keine Eigennamen eines Fremdsettings


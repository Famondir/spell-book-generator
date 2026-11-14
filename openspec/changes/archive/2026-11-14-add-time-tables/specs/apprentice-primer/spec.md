## ADDED Requirements

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

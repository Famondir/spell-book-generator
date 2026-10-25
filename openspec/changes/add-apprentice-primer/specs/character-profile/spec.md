## ADDED Requirements

### Requirement: Lehrheft im Profil
Das Profil SHALL unter `primer` den Titel des Lehrhefts, Name und Vorrede des Meisters, ein Übergabeschreiben, Stimmen (Kürzel, Handschrift, Tinte), Randnotizen je Lektion mit optionaler Mindeststufe, eigene Randkästen und ein loses Blatt festlegen können. Ein im Profil gesetzter Name des Meisters MUST nur gelten, solange in den Einstellungen keiner eingetragen ist.

#### Scenario: Meister aus dem Profil
- **WENN** das Profil den Meister „Meisterin Varia Schildglanz“ nennt und in den Einstellungen kein Name steht
- **DANN** unterschreibt die Vorrede mit diesem Namen

#### Scenario: Beispielprofil
- **WENN** jemand `data/profile.local.example.js` öffnet
- **DANN** findet er ein neutrales Beispiel für `primer` mit einer Stimme, zwei Randnotizen und einem kurzen losen Blatt

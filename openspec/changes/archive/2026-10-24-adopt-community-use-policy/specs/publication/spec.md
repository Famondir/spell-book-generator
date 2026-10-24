## MODIFIED Requirements

### Requirement: Lizenzen
Regeltexte SHALL unter der OGL 1.0a mit `LICENSE-OGL.txt` erscheinen; Schriften MUST mit ihrer OFL-Lizenz ausgeliefert werden. Eigennamen aus Paizos Welt (Gottheiten, Orte, Figuren) SHALL nur beschreibend unter Paizos Community Use Policy verwendet werden; das Projekt MUST kostenlos bleiben, MUST NOT Paizo-Logos verwenden und MUST NOT wie ein offizielles Paizo-Produkt gestaltet sein. Längere Texte von Paizo, die kein Open Game Content sind, MUST NOT wörtlich übernommen werden.

#### Scenario: Lizenzdatei
- **WENN** das Repository geklont wird
- **DANN** liegen OGL-Text und Schriftlizenz bei

#### Scenario: Gottheit im Brevier
- **WENN** eine Seite den Namen einer Gottheit Golarions nennt
- **DANN** geschieht das beschreibend (Name, Gesinnung, Zuständigkeiten, Symbol, Farben), nicht als Abschrift ihrer Paizo-Beschreibung

## ADDED Requirements

### Requirement: Hinweis zur Community Use Policy
README und App SHALL den Pflichthinweis der Community Use Policy im Wortlaut zeigen, mit Verweis auf paizo.com/licenses/communityuse und auf die OGL für die Regeltexte.

#### Scenario: Hinweis in der App
- **WENN** jemand die App öffnet
- **DANN** führt eine Fußzeile „Lizenzen“ zu einem Dialog mit dem Hinweis der Community Use Policy, der OGL-Angabe und den übrigen Quellen

#### Scenario: Hinweis im README
- **WENN** jemand das README liest
- **DANN** steht der Hinweis im Abschnitt „Quellen und Lizenzen“

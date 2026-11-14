## Why

Schnellglyphen sollen eine Formel am Spieltisch in wenigen Strichen abrufen, aber heute sehen viele Zauber gleich aus: Auf der Magierliste haben 1074 von 1795 Zaubern einen Doppelgänger, die größte Gruppe umfasst 20 Zauber. Die Glyphe kennt nur drei Kreisformen, legt mehrere Gestalten auf denselben Strich, ignoriert die Zielzahl, und Schule und Hauptessenz hängen so stark zusammen (Verzauberung fast immer Mens), dass sie kaum zusätzlich unterscheiden. Was eine Formel genau bewirkt, trägt ihre Absicht: das Verb und das Essenzwort der lateinischen Kernzeile. Diese Absicht gehört in die Glyphe.

## What Changes

- **Kreis nach Dauer:** Die Schnellglyphe unterscheidet alle acht Dauerarten, in vereinfachter Form des Dauerrings im vollen Kreis (offen, Zeitmarken, gestrichelt, doppelt, dreifach, Schlangenring, Faden, Lücke).
- **Ein Strich je Gestalt:** Jede der 18 Gestaltarten bekommt einen eigenen Gestaltstrich. Bei Zielen zeigt die Zahl der Striche die Zielzahl (1, 2, 3 und mehr).
- **Absichtsbuchstaben:** Links und rechts der Schulfigur stehen die Anfangsbuchstaben von Verb und Essenzwort der lateinischen Kernzeile. Wo die Schulfigur es verlangt, stehen sie oben und unten oder diagonal.
- **Eindeutige Kernzeile:** Innerhalb der Zauberliste der aktiven Klasse (mindestens der Magierliste) wählt die Formelerzeugung Verb und Essenzwort so, dass keine zwei Zauber dieselbe Schnellglyphe haben. Die übrigen Formelzeilen bleiben unverändert. **BREAKING** für die Formeln betroffener Zauber; es ist noch nichts gedruckt.
- **Lateinischer Wortschatz mit verschiedenen Anfangsbuchstaben:** Die Verben jeder Schule und die Wörter jeder Essenz bekommen paarweise verschiedene Anfangsbuchstaben. Dafür werden einige Wörter ersetzt, etwa *emitte → mitte* und *memoria → recordatio*.
- **Legende, Verzeichnis und Lehrheft:** Die Regeln der Schnellglyphe werden in Legende, Erklärtext und Lehrheft-Lektion angepasst.
- **Test:** Ein Prüfwerkzeug stellt sicher, dass die Schnellglyphen auf jeder Klassenliste eindeutig sind und die Anfangsbuchstaben verschieden bleiben.

## Capabilities

### New Capabilities
<!-- keine -->

### Modified Capabilities
- `magic-circle`: Die Anforderung „Schnellglyphen“ verlangt Eindeutigkeit auf der Klassenliste und beschreibt Kreis, Gestaltstrich, Zielzahl und Absichtsbuchstaben.
- `spell-texts`: Die Kernzeile der Formel ist innerhalb einer Klassenliste so gewählt, dass die Schnellglyphe eindeutig wird; im lateinischen Wortschatz hat jedes Wort einer Schule oder Essenz einen eigenen Anfangsbuchstaben.

## Impact

- Geändert: `app/js/circle.js` (Schnellglyphe), `app/js/textgen.js` (Kernzeile), `data/formula-lang/latin.js` und `app/js/theory.js` (Wortlisten), `app/js/legend.js` (Regeln), `app/js/book.js` (Erklärtext), Lehrheft-Lektion zu Schnellglyphen.
- Neu: Zuordnung der Kernzeilen je Klassenliste (einmal berechnet, deterministisch), Prüfwerkzeug `tools/quick-glyph-check.mjs`.
- Formel-Snapshot (`tools/formula-snapshot.json`) und Test-Baseline müssen neu gesichert werden, weil sich Wörter und Kernzeilen ändern.
- Andere Formelsprachen behalten ihre eigene Ziehung; die Buchstaben beziehen sich immer auf die lateinische Fachformel.

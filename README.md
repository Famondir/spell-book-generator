# Zauberbuch-Generator (Pathfinder 1e)

Erzeugt ein In-Game-Zauberbuch: Zu jedem Zauber gibt es einen magischen Kreis, die gesprochene Formel, Gesten, Magietheorie, Ausführung in drei Phasen und Randnotizen des Besitzers. Die englischen Regeltexte stehen digital neben jedem Zauber (oder per (i) in der Buchvorschau) und lassen sich als eigener **Regelband** drucken – zum Nebeneinanderlegen mit dem Zauberbuch.

## Benutzen

`index.html` im Browser öffnen (Doppelklick genügt, kein Server und kein Internet nötig).

- **Verzeichnis**: alle Zauber durchsuchen und filtern (Grad, Schule, Essenz, Regelwerk/Alltagszauber), mit **+** ins Buch aufnehmen
- **Ausführliche Ansicht** (Schalter in der Zauberansicht): jeder Zauber in voller Länge mit beschriftetem Kreis
- **Kreis anklicken**: großes Fenster mit Erläuterung aller Schichten, Beschriftung und SVG-Export
- **Mein Buch**: Buchvorschau zum Blättern (je nach Breite eine Seite oder eine Doppelseite wie im gebundenen Buch, seitenweise oder Zauber für Zauber, Pfeiltasten), (i) zeigt den Regeltext, links die Buchzauber mit denselben Filtern wie im Verzeichnis (− entfernt), rechts ein ausklappbares Inhaltsverzeichnis; Druck mit Fortschrittsanzeige als Buch (A5, A4 skaliert, A4 quer mit 2 Seiten) oder als **Schriftrollen** (vorne Kreis, hinten Formel und Regeln; beidseitig drucken); dazu der **Regelband** (Regeltexte nummeriert wie das Inhaltsverzeichnis)
- **Heute vorbereitet**: Zauberplätze pro Grad von Hand eintragen (die App rechnet nichts aus Klasse oder Stufe), Plätze mit Zaubern aus dem Buch belegen, Gewirktes abstreichen, „Neuer Tag“ nach der Rast. Dazu kommen Sonderplätze mit Bedingung, Joker-Plätze (z. B. Arkane Verbindung), gespeicherte Vorbereitungen und ein druckbarer Tageszettel. Vorbereiten und Wirken werden lokal protokolliert, für eine spätere Statistik.
- **Lehre der Kreise**: Legende aller Symbole, Schnellglyphen und Affinitätstabelle der Schulen
- **Einstellungen**: Besitzer, Titel, Regelverweise auf den Zauberseiten (Regelband-Nummer, QR-Code zu Archives of Nethys, Quellenangabe; alle aus), mehrseitige Zauber links beginnen lassen, Papierformate, Hintergrund drucken ja/nein, Import (xlsx mit Spalte „Name“, csv/txt, json) und Export der Zauberliste (json enthält auch Vorbereitung und Protokoll)

Seitenumfang: Grad 0 und Alltagszauber = ½ Seite, Grad n = n Seiten. Mehrseitige Zauber beginnen auf einer linken Seite (davor bei Bedarf eine Notizseite; abschaltbar).

## Eigene Backstory

Alles, was Besitzer, Welt und Tonfall bestimmt, steht in **Profilen**:

| Datei | Inhalt |
|---|---|
| `data/profile.js` | neutrales Standardprofil (im Repository) |
| `data/profile.local.example.js` | kommentierte Vorlage |
| `data/profile.local.js` | **dein** Profil – überschreibt einzelne Felder, wird von Git ignoriert |

Vorgehen: Vorlage nach `data/profile.local.js` kopieren, Felder anpassen, Seite neu laden. Anpassbar sind:

- `owner`, `bookTitle`, `subtitle` – Titelblatt und Randnotizen
- `calendar` (Monatsnamen, Jahr) und `places` – Übungsprotokoll und Notizen
- `notes`, `noteOriginalName`, `noteAlignment` – die Stimme der Randnotizen (Platzhalter `{owner}`, `{name}`, `{essence}`, `{school}`)
- `learningOrigins`, `everydayOrigins` – woher die Formeln stammen
- `divineFocus` – Text zum göttlichen Fokus
- `planes`, `essenceText`, `correspond` – Kosmologie und Entsprechungen deiner Welt
- `everyday.add`, `everyday.remove`, `everyday.flavor` – eigene Alltagszauber, ausgeblendete, eigene Flavour-Texte

**Mit KI füllen:** Gib einer KI `data/profile.js`, `data/profile.local.example.js` und eine Beschreibung deines Charakters (Volk, Klasse, Gottheit, Herkunft, Kampagne, Tonfall) und lass dir `data/profile.local.js` schreiben. Einzelne Zauber lassen sich zusätzlich in `data/custom_texts.js` komplett von Hand formulieren.

## Aufbau

| Datei | Inhalt |
|---|---|
| `app/js/theory.js` | das Weltbild: Schulen, 16 Essenzen, Zeichen, Materialien, Verbindungen, Glossar |
| `app/js/analyze.js` | Zauber → Modell (Essenzprofil in %, Gestalt, Reichweite, Dauer, Komponenten …) |
| `app/js/glyphs.js`, `circle.js` | SVG-Glyphen, Kreisgenerator, Schnellglyphen, Beschriftung |
| `app/js/textgen.js` | Baukasten-Texte (deterministisch pro Zauber) |
| `app/js/book.js` | Seitenplanung, Vorspann, Schriftrollen, Autofit und fließende Seiten |
| `app/js/everyday.js` | Alltagszauber: erben fehlende Regelfelder vom Basiszauber |
| `app/js/import.js` | Zauberlisten aus xlsx/csv/txt lesen |
| `app/js/prepare.js` | Tagesvorbereitung, Abstreichen, Nutzungsprotokoll |
| `app/js/profile.js` | mischt neutrales und lokales Profil |
| `data/spells.js` | Zauberdaten (erzeugt) |
| `data/everyday_spells.js` | Alltagszauber mit Ideengebern |
| `tools/parse_spells.py` | erzeugt `data/spells.js` aus AoN-Seiten (`spells/*.aspx`) und dem d20pfsrd-Export (`data/spell_full*.tsv`); beide Rohdaten sind nicht im Repository |

## Planung

Anforderungen und geplante Änderungen liegen als [OpenSpec](https://github.com/Fission-AI/OpenSpec) unter `openspec/` (`openspec list`, `openspec show <name>`).

## Quellen und Lizenzen

- **Regeltexte** der Zauber: Open Game Content unter der Open Game License 1.0a, übernommen über [Archives of Nethys](https://aonprd.com) und [d20pfsrd.com](https://www.d20pfsrd.com). Lizenztext und Copyright-Hinweise: [`LICENSE-OGL.txt`](LICENSE-OGL.txt). Die Quelle jedes Zaubers steht im Quellenkasten unter seinem Regeltext.
- **Alltagszauber**: eigene Hausregeln und Formulierungen. Anregungen von der [offiziellen Frieren-Seite](https://frieren-anime.jp/special/magic/), aus einem [r/Frieren-Thread](https://www.reddit.com/r/Frieren/comments/1rialip/come_up_with_a_mundane_spell_that_would_be/) und aus der Geschichte [„Fear Not The Elf Who Knows 10,000 Spells“](https://forums.spacebattles.com/threads/fear-not-the-elf-who-knows-10-000-spells-frieren-beyond-journeys-end-self-insert.1225442/) von Silver W. King. Der Ideengeber steht jeweils im Quellenkasten.
- **Magietheorie**: angeregt von den *Signs* aus *Witch Hat Atelier* und der Alchemie aus *Fullmetal Alchemist*; eigene Ausarbeitung.
- **QR-Codes**: [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) von Kazuhiko Arase, MIT-Lizenz (`app/vendor/qrcode.js`).
- **Schriften**: Cinzel, IM Fell English, Caveat – SIL Open Font License 1.1, siehe [`app/fonts/`](app/fonts/).
- Pathfinder ist eine Marke von Paizo Inc. Dieses Projekt ist ein inoffizielles Fanprojekt und steht in keiner Verbindung zu Paizo.

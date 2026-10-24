# Zauberbuch-Generator (Pathfinder 1e)

Erzeugt ein In-Game-Zauberbuch: Zu jedem Zauber gibt es einen magischen Kreis, die gesprochene Formel, Gesten, Magietheorie, Ausführung in drei Phasen und Randnotizen des Besitzers. Die englischen Regeltexte stehen digital neben jedem Zauber (oder per (i) in der Buchvorschau) und lassen sich als eigener **Regelband** drucken – zum Nebeneinanderlegen mit dem Zauberbuch.

## Benutzen

`index.html` im Browser öffnen (Doppelklick genügt, kein Server und kein Internet nötig).

- **Verzeichnis**: alle Zauber durchsuchen und filtern (Grad, Schule, Essenz, Regelwerk/Alltagszauber), mit **+** ins Buch aufnehmen
- **Ausführliche Ansicht** (Schalter in der Zauberansicht): jeder Zauber in voller Länge mit beschriftetem Kreis
- **Kreis anklicken**: großes Fenster mit Erläuterung aller Schichten, Beschriftung und SVG-Export
- **Mein Buch**: Buchvorschau zum Blättern (je nach Breite eine Seite oder eine Doppelseite wie im gebundenen Buch, seitenweise oder Zauber für Zauber, Pfeiltasten), (i) zeigt den Regeltext, links die Buchzauber mit denselben Filtern wie im Verzeichnis (− entfernt), rechts ein ausklappbares Inhaltsverzeichnis; Druck mit Fortschrittsanzeige als Buch (A5, A4 skaliert, A4 quer mit 2 Seiten) oder als **Schriftrollen** (vorne Kreis, hinten Formel und Regeln; beidseitig drucken); dazu der **Regelband** (Regeltexte nummeriert wie das Inhaltsverzeichnis, mit eigenem Inhaltsverzeichnis Nummer → Seite)
- **Heute vorbereitet**: Zauberplätze pro Grad von Hand eintragen (die App rechnet nichts aus Klasse oder Stufe), Plätze mit Zaubern aus dem Buch belegen, Gewirktes abstreichen, „Neuer Tag“ nach der Rast. Dazu kommen Sonderplätze mit Bedingung, Joker-Plätze (z. B. Arkane Verbindung), gespeicherte Vorbereitungen und ein druckbarer Tageszettel. Jeder Spieltag hat ein Ingame-Datum (Monate aus dem Profilkalender, zählt bei „Neuer Tag“ weiter). Unter **Verlauf** stehen alle Spieltage mit ihren Ereignissen (Testtage als Probe markieren oder löschen), unter **Statistik** die meistgewirkten Zauber, „oft vorbereitet, selten gewirkt“ und die Würfe nach Grad, Schule und Tag.
- **Lehre der Kreise**: Legende aller Symbole, Schnellglyphen und Affinitätstabelle der Schulen
- **Einstellungen**: Besitzer, Titel, Regelverweise auf den Zauberseiten (Regelband-Nummer, QR-Code zu Archives of Nethys, Quellenangabe; alle aus), mehrseitige Zauber links beginnen lassen, Papierformate, Hintergrund drucken ja/nein, Import (xlsx mit Spalte „Name“, csv/txt, json) und Export der Zauberliste (json enthält auch Vorbereitung und Protokoll)

Seitenumfang: Grad 0 und Alltagszauber = ½ Seite, Grad n = n Seiten. Jeder Grad ist ein Kapitel mit eigener Doppelseite (Titel, Ordnungsfigur, Text zur Stufe, Formelliste). Kapitel und mehrseitige Zauber beginnen links – davor bei Bedarf eine Notizseite, oder der vorherige Zauber bekommt den Umfang des nächsthöheren Grades; beides abschaltbar.

## Mehrere Charaktere

Oben rechts wählst du den Charakter. Jeder hat sein eigenes Buch, eigene Einstellungen, Vorbereitung und Protokoll; in den Einstellungen lassen sich Charaktere anlegen, umbenennen, duplizieren und löschen und je Charakter ein Profil, eine **Klasse** und (bei Paladinen) eine **Gottheit** wählen. Alles liegt nur im Browser – zum Sichern oder für ein anderes Gerät „Liste exportieren“ (die Datei enthält den Charakternamen; beim Import lässt sie sich als neuer Charakter anlegen).

## Paladine: das Brevier

Ist ein Charakter Paladin, wird aus dem Zauberbuch ein **Brevier**. Das Verzeichnis zeigt die Paladinliste (291 Zauber, Grade I–IV), jeder Zauber wird zu einem Gebet auf einer Seite:

- **Andachtsbild**: ein Lanzettfenster in Bleiglas statt des Magierkreises. Bahnen = Grad, Bogenfeld mit dem heiligen Symbol der Gottheit im Maßwerk der Schule, Medaillon der Hauptessenz, Grundscheiben in den heiligen Farben, Akzente nach Essenzanteilen, Sockel nach Wirkungsdauer, rote Bordüre bei Rettungswurf. Anklicken vergrößert und speichert als SVG.
- **Kanon der Kirche**: generiert aus Gottheit und Zauber, im Ton nach Gesinnung (rechtschaffen: Litanei mit Kehrvers; chaotisch: freie Anrufung; böse Gottheiten bitten um Macht statt um Schutz).
- **Eigene Worte**: dein eigenes Gebet zu jedem Zauber (Feld in der Zauberansicht); ohne Text bleiben im Druck Linien zum Hineinschreiben.
- Vorspann mit Gottheitsseite, „Vom Lesen der Fenster“ und „Vom Gebet“, Kapitel „Gebete des I.–IV. Grades“; Zauber außerhalb der Paladinliste stehen am Ende unter „Fremde Gebete“.
- Tagesvorbereitung mit Graden I–IV, ohne Joker; „Gebetsstunde“ statt „Neuer Tag“.

**Steinintarsie für Zwerge**: Statt Bleiglas kann das Andachtsbild als eingelegter Stein erscheinen – Giebel statt Spitzbogen, Quaderrahmen, feine Fugen, Sechseck-Basalt, gemusterte Steine (Marmor, Granit, Malachit, Lapislazuli …) und Gold- oder Silbereinlagen; jede Essenz hat ihren Stein. Einstellung „Andachtsbild“: automatisch (Stein bei Torag und den zwergischen Gottheiten), Bleiglas oder Steinintarsie. Die Bedeutung aller Elemente bleibt gleich.

Die Gottheiten (461, Daten in `data/deities.js`) lassen sich nach Name suchen; vorgeschlagen werden passende Gesinnungen (LG, LN, NG), „alle Gottheiten“ hebt das auf.

## Eigene Backstory

Alles, was Besitzer, Welt und Tonfall bestimmt, steht in **Profilen**:

| Datei | Inhalt |
|---|---|
| `data/profile.js` | neutrales Standardprofil (im Repository) |
| `data/profile.local.example.js` | kommentierte Vorlage |
| `data/profile.local.js` | **dein** Profil – überschreibt einzelne Felder, wird von Git ignoriert |

Vorgehen: Vorlage nach `data/profile.local.js` kopieren, Felder anpassen, Seite neu laden. Für mehrere Charaktere registriert `data/profile.local.js` mehrere Profile unter `window.PROFILES_LOCAL` (siehe Vorlage); jeder Charakter wählt seines in den Einstellungen. Anpassbar sind:

- `owner`, `bookTitle`, `subtitle` – Titelblatt und Randnotizen
- `calendar` (Monatsnamen, irdische Entsprechung `earth`, Monatslängen `days`, Jahr) und `places` – Übungsprotokoll und Notizen
- `notes`, `noteOriginalName`, `noteAlignment` – die Stimme der Randnotizen (Platzhalter `{owner}`, `{name}`, `{essence}`, `{school}`)
- `learningOrigins`, `everydayOrigins` – woher die Formeln stammen
- `divineFocus` – Text zum göttlichen Fokus
- `planes`, `essenceText`, `correspond` – Kosmologie und Entsprechungen deiner Welt
- `chapters` – eigene Texte für die Kapitelseiten je Grad
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
| `app/js/prepare.js` | Tagesvorbereitung, Abstreichen, Ingame-Datum, Nutzungsprotokoll |
| `app/js/stats.js` | Verlauf und Statistik der Spieltage |
| `app/js/chars.js` | Charakter-Slots: getrennter Speicher je Charakter (mit Klasse und Gottheit) |
| `app/js/classes.js` | Klassen als Daten (Zauberliste, Grade, Joker, Bezeichnungen) und aktive Klasse/Gottheit |
| `app/js/vitrail.js` | Andachtsbild: Bleiglasfenster aus Analyse und Gottheit, Motivbibliothek der Symbole |
| `app/js/prayer.js` | Gebete: Kanon der Kirche nach Gesinnung, Beinamen- und Domänenwörterbuch |
| `app/js/profile.js` | mischt neutrales Profil und das Profil des aktiven Charakters |
| `data/spells.js` | Zauberdaten (erzeugt) |
| `data/everyday_spells.js` | Alltagszauber mit Ideengebern |
| `data/deities.js` | Gottheiten, nur beschreibende Angaben (erzeugt) |
| `tools/parse_deities.py` | erzeugt `data/deities.js` aus AoN-Gottheitsseiten (`dieties/*.aspx`, nicht im Repository) |
| `tools/parse_spells.py` | erzeugt `data/spells.js` aus AoN-Seiten (`spells/*.aspx`) und dem d20pfsrd-Export (`data/spell_full*.tsv`); beide Rohdaten sind nicht im Repository |

## Planung

Anforderungen und geplante Änderungen liegen als [OpenSpec](https://github.com/Fission-AI/OpenSpec) unter `openspec/` (`openspec list`, `openspec show <name>`).

## Quellen und Lizenzen

- **Regeltexte** der Zauber: Open Game Content unter der Open Game License 1.0a, übernommen über [Archives of Nethys](https://aonprd.com) und [d20pfsrd.com](https://www.d20pfsrd.com). Lizenztext und Copyright-Hinweise: [`LICENSE-OGL.txt`](LICENSE-OGL.txt). Die Quelle jedes Zaubers steht im Quellenkasten unter seinem Regeltext.
- **Alltagszauber**: eigene Hausregeln und Formulierungen. Anregungen von der [offiziellen Frieren-Seite](https://frieren-anime.jp/special/magic/), aus einem [r/Frieren-Thread](https://www.reddit.com/r/Frieren/comments/1rialip/come_up_with_a_mundane_spell_that_would_be/) und aus der Geschichte [„Fear Not The Elf Who Knows 10,000 Spells“](https://forums.spacebattles.com/threads/fear-not-the-elf-who-knows-10-000-spells-frieren-beyond-journeys-end-self-insert.1225442/) von Silver W. King. Der Ideengeber steht jeweils im Quellenkasten.
- **Magietheorie**: angeregt von den *Signs* aus *Witch Hat Atelier* und der Alchemie aus *Fullmetal Alchemist*; eigene Ausarbeitung.
- **QR-Codes**: [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) von Kazuhiko Arase, MIT-Lizenz (`app/vendor/qrcode.js`).
- **Schriften**: Cinzel, IM Fell English, Caveat – SIL Open Font License 1.1, siehe [`app/fonts/`](app/fonts/).
- **Eigennamen** aus Paizos Welt (Gottheiten, Orte, Figuren – etwa in Zaubernamen wie *Light of Iomedae*) sind kein Open Game Content. Sie werden nur beschreibend unter Paizos [Community Use Policy](https://paizo.com/licenses/communityuse) verwendet. Das Projekt bleibt deshalb kostenlos, nutzt keine Paizo-Logos und übernimmt keine längeren Paizo-Texte wörtlich.

> Zauberbuch-Generator uses trademarks and/or copyrights owned by Paizo Inc., used under Paizo's Community Use Policy ([paizo.com/licenses/communityuse](https://paizo.com/licenses/communityuse)). We are expressly prohibited from charging you to use or access this content. Zauberbuch-Generator is not published, endorsed, or specifically approved by Paizo. For more information about Paizo Inc. and Paizo products, visit [paizo.com](https://paizo.com).

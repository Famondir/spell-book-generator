## Why

Der Generator kann bisher nur Magierbücher. In der eigenen Gruppe spielt ein Paladin, und Paladine, Kleriker und Inquisitoren sind die nächstliegenden Klassen: göttliche Zauber mit gleicher Regelstruktur, aber anderem Selbstverständnis. Ein Geweihter versteht die Formel nicht, er bittet um sie. Der Paladin ist der kleinste Einstieg (291 Zauber, Grade 1–4). Iomedae ist der Standardfall: die häufigste Wahl für Paladine und Kleriker und Kernthema von *Wrath of the Righteous*. Seit `adopt-community-use-policy` dürfen Gottheitsnamen beschreibend im öffentlichen Repository stehen.

## What Changes

- **Klasse und Gottheit je Charakter:** Ein Charakter-Slot bekommt eine Klasse (Magier oder Paladin) und beim Paladin eine Gottheit. Die Klasse bestimmt Zauberliste, Grad der Zauber, Darstellung und Buchform.
- **Gottheitsdaten:** `tools/parse_deities.py` erzeugt aus den AoN-Seiten in `dieties/` die Datei `data/deities.js`. Sie enthält nur beschreibende Felder: Name, Beiname, Gesinnung, Pantheon, Zuständigkeiten, Domänen, Lieblingswaffe, Symbol, heiliges Tier und heilige Farben. Gehorsamsrituale und Beschreibungen werden nicht übernommen.
- **Andachtsbild statt Kreis:** Jeder Zauber wird als Lanzettfenster in Bleiglas gezeichnet. Die Anzahl der Bahnen entspricht dem Grad. Die Scheiben sind deterministisch aus dem Zauber berechnet; die Grundfarben kommen aus den heiligen Farben der Gottheit, die Essenzen erscheinen als Akzente. Das Bogenfeld trägt das heilige Symbol. Die Bildsprache ist bewusst eine andere als bei den Magierkreisen.
- **Gebete in zwei Schichten:** Der *Kanon der Kirche* wird aus Gottheit und Zauberanalyse generiert, im Ton nach Gesinnung (rechtschaffen: Litanei mit Wiederholung). *Eigene Worte* trägt der Spieler je Zauber selbst ein. Fehlen sie, bleibt im Druck ein liniertes Feld.
- **Brevier:** Bei Klasse Paladin wird „Mein Buch“ zum Brevier. Es beginnt mit Titelblatt, Gottheitsseite und einer Leseanleitung für Andachtsbilder, danach folgen Kapitel „Gebete des I.–IV. Grades“ mit einer Seite je Zauber. Druck, Seitenleiste, Inhaltsverzeichnis, Regel-(i) und Regelband funktionieren wie beim Magier.
- **Verzeichnis:** Der Filter „nur Magierliste“ wird zu „nur Klassenliste“. Grade werden nach der Klasse des Charakters angezeigt; Zauber, die nur ein Paladin wirken kann, bekommen also ihren Paladin-Grad.
- **Tagesvorbereitung:** Die Plätze richten sich nach den Graden der Klasse (beim Paladin I–IV, ohne Zaubertricks). Den Joker gibt es nur für Magier. Statt „Neuer Tag“ heißt die Schaltfläche beim Paladin „Gebetsstunde“; Protokoll und Statistik bleiben gleich.
- Magierbücher bleiben unverändert. Ein Charakter ohne Klassenangabe gilt als Magier.

## Capabilities

### New Capabilities
- `deity-profiles`: Gottheitsdaten aus den AoN-Seiten erzeugen, nur beschreibende Felder; Auswahl am Charakter
- `devotional-image`: Andachtsbild in Bleiglas als SVG, deterministisch aus Zauber und Gottheit
- `prayer-texts`: Kanon der Kirche (generiert) und Eigene Worte (vom Spieler, je Charakter gespeichert)
- `divine-prayer-book`: Brevier mit Vorspann, Kapiteln je Grad und einer Seite je Zauber

### Modified Capabilities
- `character-slots`: Klasse und Gottheit je Charakter, neue Datenkategorie „eigene Gebete“
- `spell-catalog`: Filter „nur Klassenliste“ statt „nur Magierliste“, Grad nach Klasse, Detailansicht nach Tradition
- `spell-preparation`: Platzgrade nach Klasse, Joker nur für Magier

## Impact

- Neu: `tools/parse_deities.py`, `data/deities.js`, `app/js/vitrail.js` (Andachtsbild), `app/js/prayer.js` (Gebete), Brevier-Teil in `app/js/book.js`
- Geändert: `chars.js` (Klasse, Gottheit, Schlüssel `prayers`), `analyze.js` (Grad je Klasse), `app.js` (Filter, Detailansicht, Einstellungen, Kreis-Dialog → Bild-Dialog), `prepare.js` (Plätze, Joker, Beschriftung), `index.html`, `style.css`, README, Profil-Vorlage
- Daten: `data/deities.js` ist öffentlich (Community Use Policy). `dieties/` bleibt ignoriert.
- Keine neuen Bibliotheken.

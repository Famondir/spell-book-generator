## Why

Magier haben mit der Fibel ein Lehrwerk, das in ihre Welt einführt. Wer einer Gottheit folgt, hat nur verstreute Gebete (Brevier, Gebete für den Tag) und kein Buch, das Wesen, Riten, Gefolge und Geschichte seiner Kirche erzählt. Ein Vademecum nach Art der DSA-Breviere („Brevier des reisenden Geweihten“) füllt diese Lücke: Für Paladine und Kleriker ist es, was die Fibel für Magier ist, und ein Magier mit Schutzgottheit bekommt beides.

## What Changes

- **Vademecum als eigener Band** im Reiter „Lehre“ für jeden Charakter mit Gottheit: A5, mit Seitenbetrachter, Inhaltsverzeichnis und Druck wie die Fibel. Bei Magiern mit Gottheit wählt man im Reiter zwischen Lehrheft und Vademecum, bei göttlichen Klassen zwischen „Vom Gebet“ und Vademecum.
- **Kapitelgerüst** nach dem Muster der DSA-Vademeca: Vorrede, Vom Wesen, Gebete, Choräle, Riten und Feste, Gefolge, Heilige Werke, Geschichte des Hauses, Vom Rang und vom Tabu, außerweltliche Anregungen, Vakatseiten. Das Gerüst liegt setting-neutral in `data/vademecum.js`.
- **Wendebuch:** Bei Gottheiten mit Zwiespalt (dieselbe Erkennung wie bei den Gebeten) hat das Vademecum zwei Hälften mit demselben Kapitelgerüst und eine Mitte. Die zweite Hälfte liest man nach dem Wenden des Buches. Im Betrachter wendet ein Knopf das Buch; im Druck steht die zweite Hälfte kopfüber in umgekehrter Folge. Andere Gottheiten bekommen ein einfaches Buch.
- **Texte je Gottheit** aus einer privaten Datei `data/vademecum.local.js` (gitignored, je Gottheit ein Eintrag): Tempel, Verfasser, Farben, Kapiteltexte je Hälfte, Mitte, Feste, Sinnsprüche. Ohne diese Datei entsteht ein schlankes Buch nur aus erzeugten Teilen und den Gottheitsdaten.
- **Erzeugte Teile:** Festkalender im Kalender der App, Choräle als Lautschrift der Formeln von Zaubern aus dem Buch des Charakters, mit gestrichenen Schlüsselsilben, damit niemand beim Singen zaubert. Zunächst ohne Melodien.
- **Randnotizen** der Profilstimmen wie in der Fibel (eigene Hand und Tinte, Mindeststufe), dazu Verweise auf Seiten der anderen Hälfte, deren Seitenzahl erst nach dem Satz feststeht.
- **Unabhängig von den bestehenden Gebeten:** Brevier, Gebete für den Tag und Andachtsblatt bleiben unverändert. Was später übernommen oder ersetzt wird, entscheidet ein eigener Change.
- **Nethys-Texte als eigene Schreibspur** (privat): das *Haus am Rande des Jenseits* in Sothis, Schwerpunkt Nekromantie und Erkenntnis, Farben Lapis bis Indigo mit Gold, ein einziger Verfasser, der sich zwischen Hüter- und Zerstörerhälfte selbst widerspricht. Umfang ergibt sich aus dem Text (Vorbild: ein DSA-Vademecum hat 160 Seiten A6, also etwa 80 Seiten A5 insgesamt), kapitelweise geschrieben. Grundlage: `data/research/nethys.md`.

## Capabilities

### New Capabilities
- `vademecum`: Vademecum-Band im Reiter „Lehre“: Kapitelgerüst, Inhaltsquellen (Gerüst, lokale Texte je Gottheit, Gottheitsdaten), Festkalender, Randnotizen und Verweise, Satz, Betrachter und Druck in A5
- `reversible-book`: Wendebuch: zwei Hälften mit gleichem Gerüst, Mitte, Wenden im Betrachter, Seitenzählung je Hälfte, Druckfolge mit kopfüber gesetzter zweiter Hälfte und Lochrand
- `temple-hymns`: Choräle aus den Formeln des Buches mit gestrichenen Schlüsselsilben, Auswahl nach Schwerpunkt des Tempels und nach Hälfte, deterministisch

### Modified Capabilities
- `page-viewer`: Der Reiter „Lehre“ zeigt bei Charakteren mit Gottheit eine Auswahl zwischen dem bisherigen Inhalt (Lehrheft bzw. „Vom Gebet“) und dem Vademecum; ohne Gottheit bleibt er wie bisher ohne Unterpunkte.

## Impact

- Neu: `data/vademecum.js` (Gerüst, neutral), `app/js/vademecum.js` (Aufbau, Wendebuch, Choräle, Verweise), Stile für Vademecum und Wendedruck in `app/style.css`, Ansicht im Reiter „Lehre“ in `index.html`
- Geändert: `app/js/app.js` (Auswahl im Reiter „Lehre“, Viewer, Druck), `app/js/prayer.js` (Zwiespalt-Erkennung als gemeinsame Funktion nutzbar), `app/js/devotion.js` bzw. `textgen.js` (Silbenstreichung neben dem Formelfragment), `data/lang/de.js` und `en.js` (Oberflächentexte)
- Privat: `data/vademecum.local.js` mit den Nethys-Texten; `.gitignore` erhält `data/vademecum.local.js`; Randnotizen der drei Stimmen in `data/profile.local.js`
- Kein Paizo-Text im Repository; die lokalen Texte sind eigene Erfindung auf Grundlage der Recherche. Keine neuen Bibliotheken.
- Abhängigkeit: `add-bilingual-app` ist in Arbeit. Oberflächentexte zweisprachig, Vademecum-Inhalte zunächst nur deutsch.

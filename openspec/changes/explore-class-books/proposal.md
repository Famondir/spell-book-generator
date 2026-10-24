## Why

Der Generator funktioniert für Magier gut, weil arkane Zauber analytisch sind und das Regelwerk feste Seitenumfänge vorgibt. Andere Klassen wirken anders (Gebet, Pakt, Natur, Blut) und brauchen eigene Bücher oder Artefakte. Dieser Change sammelt Ideen und ist noch nicht umsetzungsreif.

## What Changes

Erkundung, noch ohne Umsetzung:

- **Kleriker/Inquisitor/Paladin – Gebetbuch (Brevier)**: statt Kreis ein Andachtsbild aus heiligem Symbol der Gottheit, Domänen-Zeichen und der Essenz-Analyse; statt Formel ein Gebet, dessen Ton von der Gottheit kommt (Profilfeld `deity`: Anrede, Tugenden, Bildsprache, Symbol). Länge nicht kanonisch festgelegt, Vorschlag: wie beim Magier.
- **Hexe – Vertrautenbuch**: Zauber als Lektionen, die der Vertraute erteilt; Kreise eher als Kräuter- und Knotenzeichen.
- **Druide/Waldläufer – Jahreskreis**: Zauber nach Jahreszeit und Ort, Glyphen aus Blättern, Tierspuren, Mondphasen.
- **Spontane Zauberer (Hexenmeister, Orakel)**: kein Buch, eher ein Tagebuch oder Tattoo-Bogen der Blutlinie oder des Mysteriums.
- Gemeinsame Basis: dieselbe Analyse (Essenzen, Zeichen), austauschbare Darstellungsschicht je Tradition.

## Capabilities

### New Capabilities
- `divine-prayer-book`: Gebetbuch für göttliche Wirker (erster Kandidat)

### Modified Capabilities
- `character-profile`: Gottheit und Tradition als Profilfelder

## Impact

Offene Fragen vor einem Design:

- Wie viel lässt sich generieren, wie viel braucht Handarbeit (Gebetstexte je Gottheit)? Ansatz: Gottheiten als neutrale Profil-Bausteine, die Nutzer selbst oder per KI füllen, analog zu `profile.local.js`.
- Haben göttliche Zauber Glyphen? Vorschlag: ja, als Andachtsbild statt Arbeitskreis – das Symbol der Gottheit im Zentrum, Domänen im Ring.
- Product Identity: Gottheiten von Golarion dürfen nicht im Repository stehen, nur in lokalen Profilen.

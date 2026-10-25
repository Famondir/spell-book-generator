## Context

`#settings` in `index.html` ist ein `<dialog>` mit einem `<form method="dialog">`, darin alle Felder untereinander (`dialog { max-width: 520px }`, `form` als Flex-Spalte). `app.js` füllt beim Öffnen alle `form.elements[k]` aus `state.settings` und liest sie beim `close`-Ereignis über `Object.keys(DEFAULTS)` zurück. Die Charakterverwaltung (`renderCharAdmin`) arbeitet mit eigenen IDs (`#char-name`, `#char-cls` …) und lädt bei Bedarf die Seite neu (`charReload`). Klassenabhängige Felder werden über `.arcane-only` und `body.divine/.arcane` ein- und ausgeblendet.

## Goals / Non-Goals

**Goals:**
- Kurze, überschaubare Abschnitte statt eines langen Schlauchs; auf Telefonbreite bedienbar.
- Keine Verhaltensänderung beim Speichern; gleiche Feldnamen, keine Migration.

**Non-Goals:**
- Sofortiges Übernehmen ohne „Fertig“ (Live-Vorschau).
- Neue Einstellungen oder Suche in den Einstellungen.
- Umgestaltung des Charakter-Umschalters in der Kopfzeile.

## Decisions

### 1. Kapitelnavigation statt Akkordeon

Links eine Liste der vier Abschnitte, rechts der gewählte. *Alternative Akkordeon:* bleibt ein Schlauch, sobald zwei Abschnitte offen sind, und die Höhe springt beim Auf- und Zuklappen. Die Kapitelnavigation zeigt immer einen kurzen Abschnitt und die Übersicht aller Abschnitte zugleich. Bei schmaler Breite (< 640 px) wird die Liste per CSS zu einer Reiterreihe oben (`flex-direction: row`, `overflow-x: auto` nur in der Reiterreihe).

### 2. Ein Formular, Abschnitte nur ausgeblendet

Alle Felder bleiben im selben `<form>`; jeder Abschnitt ist ein `<section class="set-sec" data-sec="…">`, nicht gewählte bekommen `hidden`. So funktionieren `form.elements[k]` beim Füllen und Übernehmen unverändert, auch für unsichtbare Abschnitte. Die Navigation sind `<button type="button" data-sec="…">`, damit sie das Dialog-Formular nicht absenden.

### 3. Abschnitte nach Aufgabe, nicht nach Medium

„Optik digital“ und „Optik Druck“ wären keine sauberen Grenzen: Vorspann, Kapitel, Beginn links, ausführliche Fassung und Regelverweise ändern die Vorschau genauso wie das Papier. Deshalb:
- **Buch** = was im Buch steht und wie es aufgebaut ist (gilt überall),
- **Druck** = was nur das Papier betrifft (Format, Hintergrund, Bände).

„Nur Zauber der Klassenliste“ wandert zu **Charakter**, weil es von der Klasse abhängt; das Andachtsbild bleibt bei der Gottheit.

Die Bände gehören zum Druck, obwohl die Vorschau sie auch zeigt: Die Grenze kommt vom Druckdienst. Der Hinweistext sagt das.

### 4. Layout

`dialog#settings` bekommt `max-width: 760px`, eine feste Höhe `min(640px, 100vh - 32px)` und `display: grid` mit drei Bereichen: Navigation (≈170 px), Inhalt (scrollt), Fußzeile mit „Fertig“ über die ganze Breite. Abschnittstitel als `<h3>` oben im Inhalt; der Buchbestand bekommt kurze Erklärtexte, weil er sonst nur aus drei Knöpfen besteht.

### 5. Gemerkter Abschnitt

`state.ui.settingsSec` (bestehender `ui`-Speicher, `spellbook.`-Präfix, je Charakter). Fehlt der Wert oder ist er unbekannt, wird „Charakter“ gewählt.

## Risks / Trade-offs

- [Einstellung wird nicht gefunden, weil sie im „falschen“ Abschnitt steht] → kurze Untertitel unter den Abschnittsnamen in der Navigation („Name, Klasse, Gottheit“, „Titel, Aufbau, Verweise“, „Papier, Bände“, „Import, Export“).
- [Neu laden nach Charakterwechsel (`charReload`) springt in einen anderen Abschnitt] → gemerkter Abschnitt bleibt „Charakter“, weil er im `ui`-Speicher steht; nach dem Neuladen ist der Dialog ohnehin geschlossen.
- [`hidden` auf Abschnitten, die `.arcane-only`-Regeln enthalten] → beide Regeln setzen nur `display: none`; keine Wechselwirkung.

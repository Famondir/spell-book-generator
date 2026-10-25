## 1. Markup

- [x] 1.1 `#settings` in Abschnitte `charakter`, `buch`, `druck`, `bestand` gliedern (je `<section class="set-sec" data-sec>` mit `<h3>`), Felder nach der Zuordnung der Spec verschieben, Feldnamen unverändert
- [x] 1.2 Navigation mit `<button type="button" data-sec>` und Untertiteln; Fußzeile mit „Fertig“ außerhalb des scrollenden Inhalts
- [x] 1.3 Beschriftungen korrigieren: „Vorspann (Titelblatt, …, Verzeichnis)“, „Ausführliche Fassung (…)“; Regelverweise ohne „(für den Druck)“; kurze Erklärtexte im Bestand

## 2. Layout

- [x] 2.1 CSS: zweispaltiges Grid, `max-width: 760px`, feste Höhe, nur Inhalt scrollt, hervorgehobener Abschnitt
- [x] 2.2 Unter 640 px: Reiterreihe oben; Screenshot bei 400 px ohne waagerechtes Scrollen
- [x] 2.3 Screenshot bei 1400 px für Magier und Paladin (arkane Felder bei Paladin unsichtbar, Gottheit sichtbar)

## 3. Verhalten

- [x] 3.1 Abschnittswahl in `app.js`, gemerkt in `state.ui.settingsSec`, Standard „Charakter“; prüfen: Druck wählen, schließen, öffnen → Druck
- [x] 3.2 Übernehmen prüfen: Titel (Buch) und Papierformat (Druck) ändern, Fertig → beide in `localStorage` gespeichert; Charakter anlegen/wechseln funktioniert wie vorher

## Why

Seit `add-spell-preparation` protokolliert die App, welche Zauber vorbereitet und gewirkt werden. Daraus lässt sich ablesen, welche Zauber wirklich genutzt werden – hilfreich beim Planen der Vorbereitung und für Rückblicke auf die Kampagne. Regeltechnisch nötig ist das nicht.

## What Changes

- Auswertung des Nutzungsprotokolls: meistgenutzte Zauber, Verhältnis vorbereitet zu gewirkt („oft vorbereitet, nie gewirkt“), Nutzung pro Grad und Schule
- Wochen- oder Spieltagsübersicht (ein Spieltag = Zeitraum zwischen zwei „Neuer Tag“)
- Optional im Verzeichnis: Markierung häufig genutzter Zauber

## Capabilities

### New Capabilities
- `usage-statistics`: Auswertung und Anzeige des Nutzungsprotokolls

### Modified Capabilities
- `spell-preparation`: liest das Protokoll, ändert es nicht

## Impact

Liest `spellbook.prepLog`; zum Löschen einzelner Tage auch schreibend.

Offene Fragen (aus dem Backlog):

- **Verlauf ansehen:** Tagesliste mit allen Ereignissen (vorbereitet, gewirkt, zurückgenommen) als Teil dieses Changes.
- **Testtage löschen:** einen Tag als „Probe“ markieren oder nachträglich aus dem Protokoll entfernen.
- **Was ist ein Tag?** Ein Spieltag = Zeitraum zwischen zwei „Neuer Tag“. Das echte Datum mit Uhrzeit hilft beim Wiederfinden; zusätzlich ein frei eintragbares **Ingame-Datum** je Tag (z. B. „3. Arodus 4713 AR“, Monatsnamen aus dem Profilkalender).
- **Mehrere Charaktere:** Heute teilen sich alle Buch-, Vorbereitungs- und Protokolldaten die Schlüssel `spellbook.*` im Browser. Getrennte Ordner helfen nur, wenn der Browser file://-Seiten getrennt speichert (Chrome tut das nicht). Lösung: Charakter-Slots in der App (Präfix je Charakter), Export/Import pro Charakter – eigener Change.

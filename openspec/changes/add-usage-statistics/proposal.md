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

Nur lesend auf `spellbook.prepLog`. Offene Frage: Spieltage nach Kalenderdatum oder nach „Neuer Tag“ gruppieren?

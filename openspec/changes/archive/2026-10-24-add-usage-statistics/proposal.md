## Why

Seit der Tagesvorbereitung protokolliert die App, welche Zauber vorbereitet und gewirkt werden. Daraus lässt sich ablesen, welche Zauber wirklich genutzt werden – hilfreich beim Planen und für Rückblicke auf die Kampagne. Dazu gehört, das Protokoll ansehen, Testtage entfernen und Tage dem Kalender der Spielwelt zuordnen zu können.

## What Changes

- Die Ansicht „Heute vorbereitet“ bekommt drei Reiter: **Heute**, **Verlauf**, **Statistik**.
- **Ingame-Datum** je Tag (Tag, Monat aus dem Profilkalender, Jahr); „Neuer Tag“ zählt es automatisch einen Tag weiter.
- **Verlauf**: alle Spieltage, neueste zuerst, mit echtem Datum, Ingame-Datum, Anzahl vorbereitet/gewirkt, gewirkten Zaubern und aufklappbarem Ereignisprotokoll mit Uhrzeit. Tage lassen sich als **Probe** markieren (zählen nicht) oder **löschen**.
- **Statistik** über alle echten Tage: Kennzahlen, meistgewirkte Zauber, „oft vorbereitet, selten gewirkt“, Würfe nach Grad und Schule.
- Jedes Protokollereignis trägt künftig die Kennung seines Tages; ältere Einträge werden beim Laden zugeordnet.

## Capabilities

### New Capabilities
- `usage-statistics`: Verlauf, Probe/Löschen, Statistik

### Modified Capabilities
- `spell-preparation`: Ingame-Datum je Tag, Tageskennung im Protokoll

## Impact

`app/js/prepare.js` (Tage, Ingame-Datum, Reiter), neues `app/js/stats.js` (Verlauf, Statistik), `app/style.css`, `data/profile.js` (`calendar.days`: Monatslängen). Speicher je Charakter: `prepDays`.

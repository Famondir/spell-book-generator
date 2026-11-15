## Context

Heute werden Profile ausschließlich per `<script>` geladen:

```
index.html
  data/profile.js            → window.PROFILE        (neutral, im Repo)
  data/profile.local.js      → window.PROFILE_LOCAL / PROFILES_LOCAL   (gitignored, onerror entfernt)
  app/js/chars.js            → CHARS.profiles() sammelt beide Quellen, CHARS.profileData() = Profil des aktiven Charakters
  app/js/profile.js          → mischt NEUTRAL + LOCAL synchron zu window.PROFILE
  …
  data/vademecum.local.js    → window.VADEMECUM.local[<gottheit>]       (gitignored)
  app/js/vademecum.js, time.js lesen VADEMECUM.local erst zur Laufzeit
```

Der Zustand je Charakter liegt in `localStorage` (`spellbook.c.<id>.<schlüssel>`). Der Export in [app.js](../../../app/js/app.js) (`#btn-export`) schreibt `profile: ch.profile`, also nur den Schlüssel. Ohne Datei verweist der Schlüssel auf nichts, und der Import setzt das Profil auf neutral.

Beide lokalen Dateien enthalten keine Funktionen, nur Objektliterale, sind also inhaltlich JSON-fähig. Weitere lokale Dateien (`data/formula-lang/*.local.js`) gibt es derzeit nicht. Sie bleiben außerhalb dieses Changes.

Arbeitsablauf laut Nutzer: Profile werden am Laptop in der Datei bearbeitet. Auf anderen Geräten genügt Laden und Ersetzen, Bearbeiten dort ist nicht nötig.

## Goals / Non-Goals

**Goals:**
- Ein Profil samt Vademecum-Texten ohne Server auf ein anderes Gerät bzw. in eine andere Herkunft (file:// → github.io) bringen
- Eine Datei pro Charakter genügt für den vollständigen Umzug
- Keine Ausführung von Code aus importierten Dateien
- Bestehende Wege bleiben unverändert: Datei-Profile, `PROFILES_LOCAL`, Mischregeln in `profile.js`

**Non-Goals:**
- Profile in der App bearbeiten (Editor)
- Synchronisierung über einen Dienst (Gist, Cloud) oder Teilen per Link/QR
- Lokale Formel-Lexika (`langs.local.js`) übertragen
- Ein Profil aus einer `.js`-Datei direkt importieren

## Decisions

### 1. Profilpaket als JSON, erzeugt von der App selbst

```json
{
  "format": "spellbook-profile",
  "version": 1,
  "key": "local",
  "label": "Kirran",
  "exported": "2026-11-15T10:00:00Z",
  "profile":   { … Inhalt von PROFILE_LOCAL … },
  "vademecum": { "nethys": { … Inhalt von VADEMECUM.local.nethys … } }
}
```

Die App, die das Profil aus der Datei geladen hat, exportiert es mit `JSON.stringify`. Der Import nutzt nur `JSON.parse` und prüft `format` und `version`.

*Alternativen:* (a) `.js` importieren und per `new Function`/`eval` ausführen: verworfen. Das wäre Codeausführung in der Herkunft der App, und Profile werden unter Spielern weitergegeben. (b) Ein Node-Werkzeug `tools/profile-to-json.mjs`: unnötig, weil die App das Profil ohnehin schon geladen hat. Wer kein Node hat, käme so nicht weiter.

### 2. Speicher: ein Schlüssel je Profil bzw. Gottheit in `localStorage`

- `spellbook.profiles` → Liste `[{ key, label, exported, imported }]` (Übersicht, klein)
- `spellbook.profile.<key>` → Profilinhalt
- `spellbook.vademecum.<gottheit>` → Vademecum-Eintrag

`localStorage` ist synchron. `chars.js` und `profile.js` laufen beim Laden synchron, deshalb bleibt die Ladereihenfolge gleich und es braucht kein `await`. Vademecum-Einträge sind global (je Gottheit) und nicht je Profil, weil auch `VADEMECUM.local` so aufgebaut ist.

*Alternative:* IndexedDB: asynchron, und das Mischen beim Laden müsste umgebaut werden. Bei den Größen (≈ 250 KB je Charakter) lohnt sich das nicht.

### 3. Vorrang: Datei vor Speicher

`CHARS.profiles()` liefert die Profile aus der Datei und dann die gespeicherten, deren Schlüssel nicht schon aus der Datei kommt. Gleiches gilt für Vademecum-Einträge: `vademecumEntry(id)` (in `profile-store.js`) liefert den Eintrag aus `VADEMECUM.local`, sonst den gespeicherten; `vademecum.js` und `time.js` fragen nur noch darüber. (Erst geplant war ein Ladeskript, das gespeicherte Einträge in `VADEMECUM.local` schreibt; die Browser-Tests frieren `VADEMECUM.local` aber ein, und ein Lookup hält Datei und Speicher sauber getrennt.) So bleibt am Laptop die Datei die Quelle der Wahrheit. Ein versehentlich importierter alter Stand überdeckt sie nicht. In der Verwaltung ist ein überdecktes gespeichertes Profil als solches gekennzeichnet.

### 4. Schlüssel und Ersetzen

Der Schlüssel im Paket ist der Profilschlüssel aus der Datei (`local` für `PROFILE_LOCAL`, sonst der Schlüssel in `PROFILES_LOCAL`). Ein Import mit vorhandenem Schlüssel ersetzt nach Rückfrage, die das Exportdatum alt → neu nennt. Charaktere, die den Schlüssel nutzen, zeigen nach dem Neuladen den neuen Stand. Damit `local` von zwei verschiedenen Personen nicht kollidiert, schlägt die Rückfrage beim Import auch vor, unter einem neuen Schlüssel (aus dem Label abgeleitet) anzulegen, wenn das Label abweicht.

### 5. Charakter-Export enthält das Paket

`#btn-export` ergänzt `profilePackage` mit dem Profil des Charakters und dem Vademecum-Eintrag seiner Gottheit (falls geladen). Der Import im bestehenden Ablauf (`#file-import`, Zweig `.json`) speichert erst das Paket (Regel 4), dann legt er den Charakter an bzw. aktualisiert ihn mit diesem Profilschlüssel. Alte Exportdateien ohne `profilePackage` funktionieren wie bisher.

### 6. Oberfläche

Im Einstellungsdialog, Abschnitt Charakter, gibt es neben der Profilauswahl einen Block „Profile“:

```
Profile
  Kirran            Datei        [Exportieren]
  Mirla             gespeichert  15.11.2026   [Exportieren] [Entfernen]
  Kirran (alt)      gespeichert, von Datei überdeckt          [Entfernen]
  [Profil laden …]
```

Eine `.js`-Datei im Dateiwähler führt zu einem Hinweis: „Profildatei am Rechner in der App öffnen und dort ‚Exportieren‘ wählen.“

## Risks / Trade-offs

- [Speicher voll (QuotaExceededError)] → Fehler abfangen und mit Größe des Pakets melden. Heutige Größen liegen bei etwa 5 % des Limits.
- [Browser räumt `localStorage` auf (z. B. iOS Safari nach 7 Tagen ohne Nutzung, nicht bei installierter App)] → Hinweis in der Anleitung; `navigator.storage.persist()` regelt der Change `installable-app`. Der Charakter-Export bleibt die Sicherung.
- [Privates im Charakter-Export: wer die Datei weitergibt, gibt das Profil mit] → Hinweis beim Export. Das ist gewollt, weil es genau der Umzugsweg ist.
- [Zwei Quellen für dasselbe Profil verwirren] → Kennzeichnung „überdeckt“ in der Verwaltung, Datei hat immer Vorrang.
- [Format ändert sich später] → `version` im Paket; unbekannte höhere Versionen werden mit Meldung abgewiesen.

## Migration Plan

Keine Datenmigration nötig. Bestehende Charaktere und Datei-Profile funktionieren unverändert. Alte Exportdateien bleiben importierbar. Zurückrollen: Die gespeicherten Schlüssel `spellbook.profile.*`/`spellbook.vademecum.*` werden von einer älteren Fassung einfach ignoriert.

## Open Questions

- Soll „Profil laden“ auch über Ziehen und Ablegen auf das Fenster gehen? Für das Handy irrelevant, am Rechner bequem.

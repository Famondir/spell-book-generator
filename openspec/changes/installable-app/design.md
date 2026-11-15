## Context

Die App ist statisch (HTML/CSS/Vanilla-JS, kein Build), läuft über `file://` und als GitHub Page unter `https://famondir.github.io/spell-book-generator/`. Alle Daten kommen per `<script>` (u. a. `data/spells.js` 4 MB, `data/rules.de.js` 3,5 MB). Schriften (`app/fonts/*.woff2`) lädt der Browser erst, wenn sie gebraucht werden. Optionale lokale Dateien werden mit `onerror="this.remove()"` eingebunden und fehlen online immer (404).

Vorbild Tex-Tricorder: `manifest.webmanifest` mit relativem `start_url`/`scope`, drei Symbole; `sw.js` mit kleiner Shell, Netzwerk zuerst mit `cache: 'no-cache'` (am 10-Minuten-HTTP-Cache von GitHub Pages vorbei), Cache als Fallback, Rückfall auf `index.html`; Registrierung nur bei `location.protocol !== 'file:'`.

## Goals / Non-Goals

**Goals:**
- Auf Android, iOS und am Desktop installierbar; Start ohne Browserleiste
- Nach dem ersten Besuch vollständig offline nutzbar, auch Teile, die beim ersten Besuch nicht geöffnet wurden
- Updates erscheinen beim nächsten Start mit Netz, ohne dass jemand Caches leeren muss
- `file://` unverändert

**Non-Goals:**
- Push-Benachrichtigungen, Hintergrund-Sync
- App-Store-Verpackung (TWA, Capacitor)
- Profile übertragen (→ `profiles-as-data`)

## Decisions

### 1. Netzwerk zuerst, wie beim Tricorder
Jede Anfrage an die eigene Herkunft geht zuerst ans Netz (`cache: 'no-cache'`, d. h. bedingt mit ETag; unveränderte Dateien kommen als 304 und kosten kaum Daten) und aktualisiert den Cache. Ohne Netz kommt die Antwort aus dem Cache.
*Alternative:* Cache zuerst mit Versionswechsel. Das ist schneller beim Start, aber Updates kämen erst beim übernächsten Start an, und bei jedem Commit müsste eine Version hochgezählt werden. Bei einer Spieltisch-App mit häufigen Änderungen ist „immer aktuell, offline als Fallback“ wichtiger.

### 2. Vorladen aller ausgelieferten Dateien beim Installieren
Anders als beim Tricorder (eine Datei) lädt `sw.js` beim `install` eine feste Liste: `./`, `index.html`, `manifest.webmanifest`, `app/style.css`, `app/js/*.js`, `app/vendor/*`, `app/fonts/*.woff2`, `app/fonts/widths.js`, `app/icons/*`, `data/**/*.js` ohne `*.local.js`. Die Liste steht als Konstante in `sw.js`, weil es keinen Build gibt.
Ein Test (`tools/sw-check.mjs`) vergleicht die Liste mit `git ls-files` und den `<script>`/`<link>`-Verweisen in `index.html`. Fehlt eine Datei oder steht eine zu viel drin, schlägt er fehl. So fällt eine vergessene neue Datei auf.
*Alternative:* Nur zur Laufzeit cachen, was geladen wird. Dann fehlen offline die erst später gebrauchten Schriften, etwa Keilschrift auf der Zauberseite eines akkadischen Zaubers.

### 3. Ausnahmen: lokale Dateien und Rückfall nur für Seitenaufrufe
- `*.local.js`, `docs/`, `tools/`, `openspec/` werden nie gecacht und nie aus dem Cache beantwortet.
- Der Rückfall auf `index.html` gilt nur für `request.mode === 'navigate'`. Der Tricorder fällt bei jeder Anfrage darauf zurück. Hier würde das offline für `profile.local.js` HTML als Skript liefern: Syntaxfehler statt `onerror`.
- Fremde Herkünfte gibt es keine (keine Google Fonts, alles liegt im Repo), also fasst der Service Worker nichts Fremdes an.

### 4. Cache-Name mit Version, Aufräumen bei `activate`
`CACHE = 'spellbook-vN'`. Hochgezählt wird nur, wenn sich die Vorladeliste ändert. Der Test aus Entscheidung 2 erinnert daran, sobald sich die Liste gegenüber der letzten Fassung ändert. `skipWaiting` + `clients.claim` wie beim Tricorder.

### 5. Symbole aus der eigenen Kreiszeichnung
`tools/make-icons.mjs` rendert im headless Chrome einen festen Zauberkreis (z. B. *Arcane Mark* oder *Read Magic*) auf Pergamentgrund und schreibt `icon-192.png`, `icon-512.png` und `icon-maskable-512.png` mit Sicherheitsrand für die maskierbare Fassung. Die Symbole sind neutral, nicht an Kirran gebunden und wiederholbar erzeugbar.
*Alternative:* von Hand gezeichnet. Dann sähe das Symbol nicht nach der App aus.

### 6. Manifest
`display: "standalone"` (nicht `fullscreen` wie beim Tricorder: Am Desktop und Tablet sollen Statusleiste und Fenster bleiben, und der Druckdialog funktioniert verlässlicher). Keine feste Ausrichtung, denn das Buch wird quer und hoch gelesen. `lang: "de"`, `name: "Zauberbuch"`, `short_name: "Zauberbuch"`. Das Manifest ist einsprachig, und die Oberflächensprache stellt die App selbst ein.

### 7. Dauerhafter Speicher
Läuft die App installiert (`matchMedia('(display-mode: standalone)')`), ruft sie einmal `navigator.storage.persist()` auf. Das schützt Bücher und gespeicherte Profile vor dem Aufräumen. Das Ergebnis ist nur informativ und wird nicht angezeigt.

### 8. Installationshinweis
Chrome/Edge melden `beforeinstallprompt`: Die App fängt das ab und zeigt in den Einstellungen „Als App installieren“. Safari meldet nichts, dort steht ein Hinweis („Teilen → Zum Home-Bildschirm“). Unter `file://` gibt es weder Knopf noch Hinweis, sondern einen Link auf die Online-Fassung.

## Risks / Trade-offs

- [iOS: Home-Bildschirm-Apps haben einen **eigenen Speicher**, getrennt von Safari] → In der Anleitung steht ausdrücklich, dass man Profil und Charakter *in der installierten App* lädt. Auf Android teilen Chrome-Tab und installierte App den Speicher.
- [Erste Installation lädt ~10 MB] → einmalig. Danach gehen nur bedingte Anfragen raus. Hinweis in der Anleitung (WLAN).
- [Vorladeliste veraltet] → Test aus Entscheidung 2 in der normalen Testrunde
- [Drucken aus der installierten App (Android/iOS)] → im Test auf echten Geräten prüfen. Falls `window.print()` in `standalone` nicht geht: Hinweis „zum Drucken im Browser öffnen“.
- [Service Worker liefert nach einem fehlerhaften Deploy alte Dateien] → durch Netzwerk zuerst unkritisch. Notfalls hebt ein neuer Cache-Name alles auf.
- [Getrennte Speicher file:// ↔ github.io bleiben bestehen] → gewollt. Der Umzug läuft über `profiles-as-data`.

## Migration Plan

Deploy über GitHub Pages wie bisher. Zurückrollen: `sw.js` durch eine Fassung ersetzen, die alle Caches löscht und sich selbst abmeldet (`registration.unregister()`). Diese Fassung als Notfallskript in der Doku festhalten.

## Open Questions

- Welcher Zauberkreis wird das Symbol? Vorschlag: *Arcane Mark*, weil er neutral ist und jeder Magier ihn hat.

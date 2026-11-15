## 1. Symbole und Manifest

- [ ] 1.1 `tools/make-icons.mjs`: Zauberkreis im headless Chrome auf Pergamentgrund rendern, `app/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (Sicherheitsrand) schreiben; Symbole ansehen, auch rund maskiert
- [ ] 1.2 `manifest.webmanifest` (Name, Kurzname, `./`, `standalone`, Farben, Symbole)
- [ ] 1.3 `index.html`: `<link rel="manifest">`, `theme-color`, `apple-touch-icon`

## 2. Service Worker

- [ ] 2.1 `sw.js`: Vorladeliste, `install` mit `addAll`, `activate` räumt alte Caches auf, `skipWaiting`/`clients.claim`
- [ ] 2.2 `fetch`: nur eigene Herkunft und GET, Netzwerk zuerst mit `cache: 'no-cache'`, Cache als Fallback; `.local.`, `docs/`, `tools/`, `openspec/` durchreichen; Rückfall auf `index.html` nur bei `mode === 'navigate'`
- [ ] 2.3 Registrierung in `index.html` nur außerhalb von `file://`; Bedienungstests über `file://` unverändert grün
- [ ] 2.4 `tools/sw-check.mjs`: Vorladeliste gegen `git ls-files app data` und die Verweise in `index.html`; Fehler bei fehlenden oder überzähligen Einträgen

## 3. Offline-Test

- [ ] 3.1 Testlauf im headless Chrome gegen lokalen HTTP-Server: erster Besuch, Netz aus (`setOfflineMode`), Neustart → Buch, akkadische Zauberseite mit Keilschrift, Lehrheft, Vademecum, Druckvorschau
- [ ] 3.2 Offline: Anfrage nach `data/profile.local.js` ohne Syntaxfehler in der Konsole
- [ ] 3.3 Aktualisierung: Datei auf dem Server ändern, mit Netz neu laden → neue Fassung aktiv

## 4. Einstellungen und Speicher

- [ ] 4.1 `navigator.storage.persist()` beim ersten Start im Modus `standalone`
- [ ] 4.2 `beforeinstallprompt` abfangen, Knopf „Als App installieren“ in den Einstellungen; Hinweis für Safari/iOS; Verweis auf die Online-Fassung unter `file://`
- [ ] 4.3 Texte in `data/lang/de.js`, `data/lang/en.js`; `tools/bilingual-check.mjs` grün

## 5. Geräte und Doku

- [ ] 5.1 Auf echtem Android-Gerät installieren: Start, Offline, Drucken aus der App, Charakter-Import mit Profilpaket
- [ ] 5.2 Auf iOS (falls verfügbar): getrennter Speicher bestätigt, Drucken
- [ ] 5.3 `docs/GUIDE.md` und README: Installieren je System, ~10 MB beim ersten Mal, iOS-Hinweis zum eigenen Speicher, Notfall-`sw.js` zum Abmelden

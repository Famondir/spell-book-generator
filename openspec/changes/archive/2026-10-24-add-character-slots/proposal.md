## Why

Wer mehrere Charaktere spielt, teilt sich heute ein Buch, eine Vorbereitung und ein Protokoll: alles liegt im Browser unter denselben Schlüsseln `spellbook.*`. Getrennte Ordner helfen nicht verlässlich, weil Browser lokale Dateien oft gemeinsam speichern.

## What Changes

- **Charakter-Slots**: mehrere Charaktere in derselben App, jeder mit eigenem Buch, eigenen Einstellungen (Besitzer, Titel, Druck), eigener Vorbereitung, eigenen Vorlagen und eigenem Protokoll.
- Umschalter in der Kopfzeile; in den Einstellungen anlegen, umbenennen, duplizieren, löschen.
- **Profil je Charakter**: `data/profile.local.js` darf mehrere Profile registrieren (`window.PROFILES_LOCAL = { schlüssel: {…} }`); jeder Charakter wählt eines (oder das neutrale). Beim Umschalten lädt die Seite neu, weil Texte und Kreise beim Laden aus dem Profil entstehen.
- Bestehende Daten werden beim ersten Start in einen ersten Charakter übernommen.
- Export enthält den Charakternamen; Import fragt, ob ein neuer Charakter angelegt werden soll.

## Capabilities

### New Capabilities
- `character-slots`: Charaktere anlegen, wechseln, verwalten; getrennte Daten je Charakter

### Modified Capabilities
- `character-profile`: mehrere lokale Profile, Auswahl je Charakter

## Impact

Neues Modul `app/js/chars.js` (vor `profile.js` geladen), `app/js/profile.js`, `app/js/app.js` und `app/js/prepare.js` (Speicherschlüssel), `index.html`, `app/style.css`, `data/profile.local.example.js`, README.

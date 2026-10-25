## Why

Ein volles Zauberbuch hat schnell 800 Seiten und mehr; reale Druckdienste binden aber oft nur bis zu einer Höchstseitenzahl je Band (z. B. 600 oder 800 Seiten). Wer das Buch tatsächlich drucken lassen will, muss es heute von Hand zerlegen – und landet dabei mitten in einem Kapitel oder ohne Titelseite für den zweiten Band.

## What Changes

- Neue Buch-Einstellung „Höchstens … Seiten je Band“ (leer = ein Band, wie bisher).
- Ist eine Grenze gesetzt, teilt die App das Buch in so wenige, möglichst gleich dicke Bände wie nötig auf, und zwar an Kapitelgrenzen (Zaubertricks, Alltagszauber, jeder Grad); kein Kapitel wird zerrissen, solange es allein in einen Band passt. Ein Kapitel, das allein die Grenze sprengt, wird an einer Zaubergrenze geteilt und im nächsten Band mit „(Fortsetzung)“ weitergeführt – mit Warnhinweis.
- Jeder Band beginnt mit einer eigenen Titelseite („Band II · III.–V. Grad“) und einem eigenen Verzeichnis der Formeln; die Anleitung (Lesart der Kreise, Schichten, Legende) steht nur in Band I.
- Seitenzahlen beginnen in jedem Band bei 1; Kapitelnummern und Regelband-Nummern laufen über alle Bände durch.
- Buchansicht: Bandwahl über der Vorschau, Inhaltsverzeichnis und Inhaltsliste nennen den Band; die Statistik zeigt Bände und ihren Umfang.
- Drucken: je Band ein eigener Druckauftrag („Band II drucken“).
- Die Spielregel-Angaben (Gesegnetes Buch 1000 Seiten, gewöhnliches Zauberbuch 100 Seiten) bleiben reine Information, keine Sperre.

## Capabilities

### New Capabilities
- `book-volumes`: Aufteilung des Buches in Bände nach Höchstseitenzahl, Bandaufbau (Titelseite, Verzeichnis, Anleitung nur in Band I), Nummerierung, Bandwahl in der Vorschau.

### Modified Capabilities
- `printing`: „Buch drucken“ druckt bei mehreren Bänden je Band einzeln.
- `book-layout`: Vorspann nur in Band I vollständig; Inhaltsverzeichnis und Inhaltsliste zeigen Band und Seite.

## Impact

- `app/js/book.js`: `assemble()` bekommt Bandparameter (Seitenstart, Kapitel- und Regelnummer-Versatz, Vorspann-Umfang); neue Funktion für die Aufteilung.
- `app/js/app.js`: `bookData()` liefert Bände; Vorschau, Blätterleiste, Inhaltsverzeichnis, Inhaltsliste, Statistik und Druckknopf arbeiten bandweise.
- `index.html`: neues Eingabefeld in den Buch-Einstellungen, Bandwahl in der Buchansicht.
- `app/style.css`: Bandtitelseite, Bandwahl.
- Gilt für Zauberbuch und Brevier gleichermaßen; der Regelband bleibt ein Band.

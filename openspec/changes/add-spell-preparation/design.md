## Context

Die App kennt das Buch (Menge von Zauber-IDs, localStorage `spellbook.book`). Sie kennt weder Klassenstufe noch Attributswerte, und das soll so bleiben: Sie ersetzt keinen Charakterbogen. Gespielt wird oft am Handy oder Laptop neben dem Bogen, manchmal mit Papier.

## Goals / Non-Goals

**Goals:**
- In unter einer Minute den Tag vorbereiten, mit einem Tipp abstreichen
- Funktioniert offline über file:// und auf der GitHub Page
- Auch auf Handybreite bedienbar

**Non-Goals:**
- Berechnung der Plätze aus Klasse, Stufe und Attribut
- Metamagie-Rechnung (höchstens Freitextvermerk), spontane Zauberer, Zauberstäbe, Schriftrollen-Inventar
- Synchronisation zwischen Geräten

## Decisions

- **Plätze von Hand eintragen** statt berechnen: Archetypen (z. B. ohne Schulplatz), Boni durch Gegenstände und Hausregeln würden jede Tabelle sprengen. Zusätzlich je Grad ein optionaler Sonderplatz (Schule/Domäne) mit eigener Schulbedingung als Freitext.
- **Vorbereitung als Liste von Einträgen** `{grade, spellId, used:boolean, note?}` statt Zähler pro Zauber: so kann derselbe Zauber mehrfach vorbereitet und einzeln abgestrichen werden, und ein Zauber kann in einem höheren Platz liegen (Notiz „mit Metamagie“).
- **Zaubertricks** werden vorbereitet, aber nie verbraucht.
- **Joker-Plätze** (optional, standardmäßig 0): ein Platz ohne festen Zauber, der beim Wirken einen beliebigen Buchzauber bis zu einem eingetragenen Höchstgrad verbraucht. Deckt Arkane Verbindung (Gebundener Gegenstand, 1×/Tag) ab; Mythenkraft-Fähigkeiten zählt die App nicht.
- **Nutzungsprotokoll** als Ereignisliste `{t, ev, id, g}` (ev: `prep`, `unprep`, `cast`, `uncast`, `day`) statt fertiger Zähler: Eine spätere Statistik kann daraus beliebig auswerten (meistgenutzte Zauber, pro Woche, pro Grad), ohne dass wir das Format jetzt festlegen müssen. Zaubertricks bekommen einen Knopf „gewirkt“, der nur protokolliert und nichts verbraucht. Größe: einige Dutzend Ereignisse pro Spieltag, also auch nach Jahren nur wenige hundert KB.
- **Speicher**: localStorage `spellbook.prep` (Plätze, Vorbereitung, Joker), `spellbook.prepPresets`, `spellbook.prepLog`. Export/Import läuft über die vorhandene json-Liste mit (Feld `preparation`), damit Gerätewechsel möglich ist.
- **Darstellung** wie das Verzeichnis: Schnellglyphe, Name, Grad; Klick auf den Namen öffnet die Zauberansicht, Klick auf das Kästchen streicht ab. Abgestrichen = durchgestrichen und blass.
- **Tageszettel** als eine A5-Seite im Buchstil über die vorhandene Druckstrecke (`printPages`).

## Risks / Trade-offs

- [localStorage geht beim Löschen der Browserdaten verloren] → Export enthält die Vorbereitung; Hinweis in der Ansicht.
- [Feature-Kriechen Richtung Charakterbogen] → Non-Goals oben gelten als Abnahmekriterium.

## Open Questions

- Auswertung des Protokolls (meistgenutzte Zauber, Wochenübersicht): Folge-Change `add-usage-statistics`.

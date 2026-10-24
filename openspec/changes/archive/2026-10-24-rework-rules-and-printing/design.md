## Context

Bisher hängt ein fließender Regelanhang am Buch. Er macht das Buch dicker, das Setzen langsam (Umbruch über Hunderte Seiten) und ist für den Zweck des gedruckten Buches (Fluff) unnötig.

## Decisions

- **Regelband statt Anhang.** Eigener Druckauftrag mit Titelblatt; je Grad eine fließende Seite (Häppchen für den Fortschritt), jeder Zauber mit „Nr. n“.
- **Verweis per Nummer statt Seitenzahl.** Die Nummer ist die Position im Inhaltsverzeichnis des Buches. Seitenzahlen im Regelband stünden erst nach dem Umbruch fest und würden jede Vorschau verzögern; die Nummer ist sofort bekannt und im Regelband genauso schnell gefunden.
- **QR-Code lokal erzeugt** mit qrcode-generator (MIT) als mitgelieferte Datei, damit die App offline über file:// funktioniert. Ziel: AoN-Seite des Zaubers, bei Alltagszaubern die des Basiszaubers.
- **Füllseiten:** Vor einem mehrseitigen Zauber, der auf einer ungeraden (rechten) Seite beginnen würde, wird eine Seite „Für Notizen“ eingefügt. Die Vorschau bildet Doppelseiten wie ein gebundenes Buch.
- **Setzen in Häppchen:** Seiten werden gruppiert (nie ein Zauber geteilt), je Häppchen in einen Zwischencontainer gerendert, angepasst und dann übernommen. Die Randnotiz-Dublettenprüfung läuft über ein gemeinsames Set weiter. Zwischen den Häppchen gibt der Code die Kontrolle an den Browser zurück und aktualisiert den Zähler.
- **Druck-Cache:** Schlüssel = Hash des Seiten-HTML + Papierformat; Wert = fertig gesetztes HTML. Nur im Speicher (localStorage ist zu klein), höchstens drei Einträge.

## Risks / Trade-offs

- [Häppchen ändern die Seitenfüllung nicht, aber Dubletten-Notizen über Häppchengrenzen] → gemeinsames Set.
- [Alte Exporte mit `rules: "appendix"`] → werden still als „kein Anhang“ behandelt.

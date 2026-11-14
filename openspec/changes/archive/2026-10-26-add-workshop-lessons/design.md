## Context

Das Lehrheft („Fibel der Kreise“, `data/primer.js`) hat 42 nummerierte Lektionen. Die Nummer steht nur in der Id (`l10` → „Lektion 10“, `app/js/primer.js` Kicker, Inhaltsverzeichnis, Glossar). Das lokale Profil hängt Randnotizen (`primer.notes.l29`) und Lektionsersatz (`primer.lessons.l30`) an diese Ids, und `data/primer.en.js` aus `add-bilingual-app` soll dieselben Ids verwenden. Teil I (Werkstatt) hat `pageEach: true`, jede Lektion beginnt also auf einer eigenen Seite.

Grundlagen: `data/research/handwerk-und-glyphen.md` (Tinten, Farben, Werkzeug), `data/research/ausbildung-dsa.md` Abschnitt Glyphen (Sigillen aus zusammengezogenen Buchstaben, WdZ 58; Konservierungssiegel; „Buch, Stab und Siegel“). Übernommen werden nur Muster, die Texte sind neu und setting-neutral.

## Goals / Non-Goals

**Goals:**
- Drei Lektionen im Ton und Aufbau der bestehenden: Lesestück, Glossen, optional Kasten, Aufgabe, Prüfkriterien.
- Einfügen ohne die Ids zu ändern; Nummern folgen der Reihenfolge.
- Kein Übungsvordruck: Petschaft und Sigille bekommen leere Flächen und höchstens eine Ansicht des Meisters.

**Non-Goals:**
- Keine Regelwirkung (kein Siegel-Zauber, keine Glyphenregeln).
- Kein Rezept zum realen Nachmachen mit gefährlichen Stoffen; Lauge und giftige Farben erscheinen als Weltinfo mit Warnkasten wie in „Das Gift im Tintenfass“.
- Keine Zaubertinten (eigener Change `add-spell-inks`).

## Decisions

**Nummerierung aus der Reihenfolge.** Die Nummer einer Lektion ist ihr Platz unter den Lektionen ohne `unnumbered` und ohne `template`. Neue Ids sind sprechend (`w-soap`, `w-seal`, `g-sigil`), alte bleiben. Alternative: alle Ids ab `l6` umbenennen. Abgelehnt, weil sie Profile und die englische Fassung brechen würde.

**Lektionsverweise.** Text kann `{{lesson:l16}}` enthalten; der Satz ersetzt das durch „Lektion 18“. Das einzige bestehende Vorkommen ist in „Der Wochenkreis“. Eine Mess- oder Prüfseite meldet unaufgelöste Verweise.

**Reihenfolge in Teil I:**

```
Wachstafel · Federkiel · Rußtinte · Eisengallustinte · Farben und ihre Gifte
→ Seife und Lauge (neu)
Pergament · Papier schöpfen
→ Siegellack und Petschaft (neu)
Zirkel, Lineal und Schnur · Zauberkreide
```

Seife folgt unmittelbar auf die Gifte (Waschen nach dem Zinnober) und steht vor dem Pergament (Kalk und Lauge). Siegellack folgt auf das Papier (Briefe, Urkunden) und braucht Zinnober und Mennige aus den Farben.

**Seife und Lauge (Inhalt).**
- Lesestück: Buchenasche in Regenwasser auslaugen, die Lauge (Pottasche) klären; Eiprobe (ein frisches Ei schwimmt und zeigt eine Fläche, so groß wie eine Münze); Fett (Talg oder Öl) mit Lauge sieden zu Schmierseife; mit Salz aussalzen zu fester Kernseife. Dazu: Die Lehre sieht darin Sulfur (Fett) und Sal (Asche), die sich verbinden.
- Kasten „Lauge frisst Haut“: Spritzer in den Augen, Handschuhe aus Leder, nie im Küchentopf; und warum der Meister nach jedem Zinnober Hände und Pinsel mit Seife waschen lässt.
- Absatz „Die Seife des Meisters“: Über ein Stück Seife wurde der kleine Reinigungszauber gesprochen, den jeder Lehrling zuerst lernt; die Seife hält ihn für einige Wäschen. Unter Lehrlingen ist strittig, ob sie wirklich besser reinigt oder nur schneller glänzt. Reine Weltinfo, ohne Regelwirkung.
- Absatz „Gegen den Regen“: Imprägnieren mit Seife und Alaun. Der Stoff wird in Seifenwasser getränkt, dann in Alaunlösung; im Gewebe entsteht eine Seife, die sich nicht mehr löst, und Regen perlt ab. Daneben die älteren Wege: Wachs oder Talg einreiben, Leinöl (Öltuch). Der Meister imprägniert so Mantel und Buchbeutel, denn ein nasses Reinbuch ist ein verlorenes Reinbuch. Die Gebrauchsseife des Meisters dient ebenso dazu: mit gebundenem Zauber hält die Imprägnierung länger, sagt man.
- Glossen: Lauge, Pottasche, Sieden, Aussalzen, Alaun.
- Aufgabe: drei Laugen verschiedener Stärke ansetzen, mit der Eiprobe vergleichen und ins Werkstattbuch eintragen; Pinsel nach dem Rubrizieren waschen und dem Meister zeigen; einen Lappen mit Seife und Alaun imprägnieren und neben einem unbehandelten mit Wasser beträufeln.
- Prüfkriterien: Probe, Sauberkeit.

**Siegellack und Petschaft (Inhalt).**
- Lesestück: Das ältere Siegel aus Bienenwachs, Harz und Farbe (rot mit Mennige oder Zinnober, grün mit Grünspan); der spätere Siegellack aus Schellack, Kolophonium und Terpentin, mit Kreide gestreckt und gefärbt, als Stange gegossen. Siegeln: die Stange über der Flamme drehen, nicht hinein; Lack auf das Papier fließen lassen; das angehauchte Petschaft gerade eindrücken und kurz halten. Ein Siegel schützt nicht, es bezeugt: Wer ein Buch öffnet, bricht es.
- Kasten „Das wachende Siegel“: In magischen Siegellack wird beim Schmelzen ein Wachzauber gebunden, mit einem Zusatz, der zur Formel passt, wie bei der Zauberkreide. Bricht jemand das Siegel, weiß es der, der es gesetzt hat. So verschließt der Meister seinen Schrank mit den giftigen Farben und sein Reinbuch. Weltinfo, ohne Regelwirkung.
- Kasten „Was ist hier schiefgelaufen?“: schwarze Schlieren (Lack in die Flamme gehalten, Ruß), Blasen (zu heiß), ausgebrochener Rand (zu kalt oder zu dünn), Lack klebt am Petschaft (nicht angehaucht).
- Glossen: Petschaft, Siegellack, Schellack.
- Generator `sealBlank`: zwei leere Doppelkreise in Siegelgröße, einer für den Entwurf des eigenen Zeichens, einer als Feld für den Abdruck; dazu ein Feld „gesiegelt am“.
- Aufgabe: das eigene Zeichen entwerfen (Anfangsbuchstabe und ein Zeichen aus der Glyphenlehre), drei Probesiegel auf Abfallpapier, das beste in das Feld; dazu schriftlich: welche Formel würdest du in ein wachendes Siegel binden, und was gibst du dem Lack bei?
- Prüfkriterien: Abdruck, Sauberkeit.

**Sigillenbau (Inhalt).**
- Platz: letzte Lektion in Teil III, nach dem Gestenblatt; sie baut auf Kern und Beizeichen (Lektion „Was eine Glyphe ist“) und bereitet den Zuschnitt in Teil VIII vor (Ziel, Name).
- Lesestück: Der Kern einer Glyphe sagt, was geschieht, und wird nie verändert. Was nur für diesen Ort, dieses Ziel, diesen Namen gilt, schreibt man als Sigille: den Satz der Absicht in Großbuchstaben schreiben, jeden Buchstaben, der schon vorkam, streichen, dann die Vokale; die übrigen übereinanderlegen, gemeinsame Striche nur einmal ziehen, vereinfachen, bis die Figur in einem Zug lesbar ist. Eine Sigille gilt nur für genau das Beschriebene.
- Generator `sigil`: zu einem neutralen Beispielsatz („Schutz für dieses Buch“) die Streichschritte als Text (Satz → ohne Doppelte → ohne Vokale → Restbuchstaben) und eine Ansicht des Meisters: die Restbuchstaben als Strichbuchstaben (Großbuchstaben aus Geraden und Bögen) übereinandergelegt und zentriert. Darunter zwei weitere Sätze nur mit den Streichschritten und leerer Fläche.
- Glossen: Sigille, Satz der Absicht.
- Aufgabe: die beiden Sätze selbst zu Sigillen bauen; einen eigenen Satz für einen Ort der Werkstatt wählen und die Sigille dem Meister erklären, Buchstabe für Buchstabe.
- Prüfkriterien: Streichen, Verschmelzen, Begründung.
- Das lokale Profil kann die Beispielsätze ersetzen (`primer.lessons["g-sigil"]`), wie jede Lektion.

**tria prima.** Die Aufgabe in „Das brennende Scheit“ ordnet künftig acht Stoffe zu: Wachs, Salz, Quecksilber, Kohle, Kreide, Weingeist, Seife, Siegellack. Seife ist die Fangfrage: Sulfur und Sal zu gleichen Teilen, denn sie ist aus Fett und Asche gesotten. Siegellack ist Sulfur. Die Lösung kopfüber auf der nächsten Seite wird ergänzt. Weil „Das brennende Scheit“ in Teil IV nach den Werkstatt-Lektionen steht, kennt der Lehrling beide Stoffe schon.

## Risks / Trade-offs

- [Die Nummern verschieben sich, gedruckte ältere Hefte stimmen nicht mehr mit neuen überein] → hinnehmen; das Heft ist ein Generat. Verweise im Text laufen über die Id.
- [Strichbuchstaben übereinander ergeben Kraut statt einer Figur] → der Generator nimmt nur die Restbuchstaben (meist fünf bis sieben) und zeigt sie dünn; die Vereinfachung leistet der Lehrling. Wirkt es unruhig, steht nur das erste Verschmelzen als Ansicht da.
- [Seitenumbruch in Teil I: drei statt einer neuen Seite pro Lektion] → Mess-Seite des Lehrhefts prüfen; jede Werkstatt-Lektion soll weiterhin auf eine Seite passen.
- [Abhängigkeit] → `add-apprentice-primer` zuerst archivieren, sonst gibt es keine Hauptspezifikation `apprentice-primer`, auf die dieser Delta passt.

## Open Questions

- keine

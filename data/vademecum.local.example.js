// VORLAGE für eigene Vademecum-Texte.
// 1. Diese Datei nach data/vademecum.local.js kopieren (gitignored).
// 2. Je Gottheit einen Eintrag VADEMECUM.local["<id aus data/deities.js>"] = { … } anlegen.
// 3. index.html neu laden.
//
// Alles ist optional. Was fehlt, ergänzt die App aus den Gottheitsdaten und erzeugten Teilen;
// Kapitel ohne Inhalt entfallen, die römische Zählung bleibt lückenlos.
//
// Kapitel-IDs (Reihenfolge aus data/vademecum.js):
//   preface essence prayers hymns rites retinue works history rank hooks
// Ein Kapitel ist { epigraph?, sections: [ … ] }. Ein Abschnitt ist
//   { id, title, text: ["Absatz", …], box?: { title, text: [...] }, epigraph?, aside? }
//   oder ein Gebet { kind: "prayer", id, title, use: "Gebrauchshinweis", lines: ["Vers", …] }.
// Im Text markiert [[Begriff]] einen Begriff mit Erklärung in glosses (wie im Lehrheft).
// {{ref:<Hälfte>/<Abschnitt-id>}} verweist auf eine Stelle; die Seitenzahl setzt die App nach dem Satz.
//
// Im Text außerdem: **fett**, *kursiv*, {{page:<Hälfte>/<Anker>}} (nur die Zahl, wenn der Text die Hälfte nennt),
// {{anchor:<id>}} (Ziel mitten im Absatz). Absätze dürfen auch { verse: [...] }, { list: [...] } oder
// { table: [[Kopf …], [Zeile …]] } sein; in Versen steht "" für einen Strophenwechsel.
// Kapitel: title (eigener Titel statt dem des Gerüsts), note (Hinweis unter dem Kopf bei Kapitel IX).
// Gebete/Choräle: response (Antwort der Gemeinde), text (Absätze unter den Versen).
// Choräle: chapters.hymns.frames = Rahmen [{ title, school, level, use, response, lines, after, fixed }]: jeder nimmt
//   einen erzeugten Choral aus dem Buch des Charakters auf (gleiche Schule und Grad, sonst gleiche Schule); ohne
//   passenden Zauber bleiben seine Verse (lines) stehen; fixed: nie ersetzen. Ein Abschnitt { id, kind: "slot",
//   frames: [0, 1, …] } setzt diese Choräle an seine Stelle. hymns am Eintrag: Höchstzahl der erzeugten Choräle je Hälfte.
// Hälfte: motto { text, source } für das Titelblatt.
// Mitte: { title, text } für eine gemeinsame Seite oder { title, halves: [{ lines, text }, { lines, text }] } für je eine
//   eigene Seite (sie stehen sich im gebundenen Buch gegenüber).
// Feste ohne festen Tag: { m, when: "erste mondlose Nacht", name }.
// notes: Randnotizen { "<Hälfte>/<Abschnitt>": [{ voice, text, desc, level }] } wie PROFILE.vademecum.notes; sie
//   erscheinen nur, wenn das Profil die Stimme (voice) kennt (Hand und Tinte kommen aus dem Profil).
//
// Einfaches Buch: chapters direkt am Eintrag. Wendebuch: halves mit je eigenen chapters.
// dual: false schaltet das Wendebuch ab, auch wenn die Gottheit einen Zwiespalt hat.
window.VADEMECUM = window.VADEMECUM || { local: {} };
VADEMECUM.local["example"] = {
  title: "Vademecum der Waage",
  subtitle: "Für die Reise und für das Haus",
  temple: {
    name: "Haus an der Furt",
    place: "eine Stadt am Fluss",
    // Schwerpunkt: Schulen (englische Namen wie in data/spells.js) für die Auswahl der Choräle
    focus: ["Abjuration", "Divination"],
  },
  author: { name: "Bruder Anselm", office: "Bewahrer der Schriften" },
  // Tempelfarben für Zierrat, Kapitelköpfe und Initialen (sonst die Farben der Gottheit)
  colors: { primary: "#2f4a6b", secondary: "#6b2f2f", accent: "#b8912f" },

  // Wendebuch: zwei Hälften mit demselben Kapitelgerüst. key ist die Kurzform für Verweise,
  // mark das Zeichen vor Seitenzahlen, schools/essences teilen die Choräle auf.
  halves: [
    {
      key: "maß", name: "Das Maß", mark: "☉", schools: ["Abjuration"], essences: ["terra"],
      chapters: {
        preface: {
          sections: [
            { id: "vorrede", title: "Vorrede", text: ["Wer dieses Buch aufschlägt, hält die eine Schale der Waage in der Hand. Die andere liegt auf der Rückseite; wende das Buch, wenn du sie lesen willst."] },
          ],
        },
        prayers: {
          sections: [
            { kind: "prayer", id: "morgen", title: "Morgengebet", use: "Beim ersten Licht, die Hände geöffnet.", lines: ["Was ich trage, wiege ich.", "Was ich wiege, trage ich."] },
          ],
        },
        rank: {
          sections: [
            { id: "tabu", title: "Was nicht getan wird", text: ["Kein Gewicht wird verfälscht, kein Maß verkürzt."], box: { title: "Merkspruch", text: ["Eine Schale allein ist keine Waage."] } },
          ],
        },
      },
    },
    {
      key: "last", name: "Die Last", mark: "☾", schools: ["Divination"], essences: ["aqua"],
      chapters: {
        preface: {
          sections: [
            { id: "vorrede", title: "Vorrede", text: ["Du hast das Buch gewendet. Was auf der anderen Seite geschrieben steht, ist wahr; was hier steht, ist es auch. Vergleiche {{ref:maß/vorrede}}."] },
          ],
        },
      },
    },
  ],
  // Mitte: steht zwischen den Hälften und ist von beiden Seiten aus die letzte Seite
  middle: { title: "Die Mitte", text: ["Hier halten beide Schalen still."] },

  // Feste: Tag d (1–31) und Monat m (0 = erster Monat) im Kalender des Profils; half: nur in dieser Hälfte
  feasts: [
    { d: 1, m: 0, name: "Tag des Eichens", text: "Alle Gewichte des Hauses werden geprüft." },
    { d: 15, m: 6, name: "Fest der stillen Schalen", half: "maß" },
  ],
  // Sinnsprüche für Epigraphe und Randkästen
  sayings: ["Wer misst, wird gemessen.", "Die Waage lügt nicht, der Wäger schon."],
  glosses: { Eichen: "Prüfen eines Gewichts gegen das Urgewicht des Hauses." },
};

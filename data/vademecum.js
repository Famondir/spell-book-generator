// Vademecum: Gerüst des Andachts- und Lehrbandes für Charaktere mit Gottheit, setting-neutral.
// Inhalt je Gottheit kommt aus data/vademecum.local.js (gitignored) als VADEMECUM.local[<deityId>];
// Muster: data/vademecum.local.example.js. Ohne Eintrag entsteht eine dünne Fassung aus den
// Gottheitsdaten (data/deities.js) und den erzeugten Teilen (Choräle, Festkalender).
//
// chapters: feste Reihenfolge. roman wird beim Aufbau lückenlos vergeben (leere Kapitel entfallen);
//   unnumbered: ohne römische Zahl (Vorrede). otherworldly: als außerweltlich gekennzeichnet.
// hymns: höchstens so viele Choräle je Hälfte.
// essence: Lückensätze für „Vom Wesen“ der dünnen Fassung. Platzhalter: {name} {title} {align} {areas} {domains} {symbol}
//   Ein Satz entfällt, wenn einer seiner Platzhalter leer bleibt; bei einer Liste gilt die erste vollständige Fassung.
// pairNames: Standardnamen der Hälften im Wendebuch nach dem Paar des Zwiespalts (PRAYER.dualPair);
//   die lokale Datei überschreibt sie.
//
// en: englische Fassung aller Texte dieser Datei (data/lang/README.md), gleiche Form wie das Deutsche:
//   en.title, en.subtitle, en.middleTitle: Zeichenketten
//   en.chapters: { <Kapitel-id>: "Titel" }; en.chapterNotes: { <Kapitel-id>: "Vermerk" } (zu chapters[].note)
//   en.essence: wie essence (Liste von Sätzen, ein Eintrag kann eine Liste von Alternativen sein; gleiche Platzhalter)
//   en.hymnUse: { <Schule|default>: Satz }, en.align: { <Gesinnung>: Satzteil }, en.pairNames: { <Domäne>: Name }
//   en.dualNote: Satz für die dünne Fassung des Wendebuchs; Platzhalter {half} = Name der Hälfte (mit Artikel,
//     wie in en.pairNames) – ersetzt den im Code fest eingebauten deutschen Satz
window.VADEMECUM = {
  title: "Vademecum",
  subtitle: "Brevier für Reise und Haus",
  hymns: 6,
  chapters: [
    { id: "preface", title: "Vorrede", unnumbered: true },
    { id: "essence", title: "Vom Wesen" },
    { id: "prayers", title: "Gebete" },
    { id: "hymns", title: "Choräle" },
    { id: "rites", title: "Riten und Feste" },
    { id: "retinue", title: "Gefolge" },
    { id: "works", title: "Heilige Werke" },
    { id: "history", title: "Geschichte des Hauses" },
    { id: "rank", title: "Vom Rang und vom Tabu" },
    { id: "hooks", title: "Anregungen", otherworldly: true, note: "Außerweltlich: für die Spielrunde, nicht für die Figur." },
  ],
  essence: [
    ["{name}, genannt {title}, wird verehrt als Macht über {areas}.", "{name} wird verehrt als Macht über {areas}."],
    "Die Gläubigen zählen {name} zu den Mächten, die {align} sind.",
    "Wer zu {name} betet, empfängt Gaben aus den Bereichen {domains}.",
    "Das heilige Zeichen ist {symbol}.",
  ],
  // Anlass der erzeugten Choräle je Schule (die lokale Datei setzt eigene Rahmen in chapters.hymns.frames)
  hymnUse: {
    abjuration: "Zu singen, wenn Tore, Gräber oder Häuser neu gesichert werden.",
    conjuration: "Zu singen beim Aufbruch und bei der Ankunft.",
    divination: "Zu singen vor dem Studium und in schlaflosen Nächten.",
    enchantment: "Zu singen, wenn die Gemeinde sich versammelt.",
    evocation: "Zu singen am Abend, wenn die Lampen entzündet werden.",
    illusion: "Zu singen leise, für sich allein.",
    necromancy: "Zu singen bei der Totenwache.",
    transmutation: "Zu singen zu Beginn eines neuen Werkes.",
    universal: "Zu singen an jedem Tag.",
    default: "Zu singen an jedem Tag.",
  },
  // Gesinnung als Satzteil („… die {align} sind“)
  align: {
    LG: "rechtschaffen und gut", NG: "neutral und gut", CG: "chaotisch und gut",
    LN: "rechtschaffen und neutral", N: "neutral", CN: "chaotisch und neutral",
    LE: "rechtschaffen und böse", NE: "neutral und böse", CE: "chaotisch und böse",
    Unaligned: "keiner Seite verpflichtet",
  },
  pairNames: {
    Destruction: "Die Zerstörung", Protection: "Der Schutz",
    Death: "Der Tod", Healing: "Die Heilung",
    Law: "Das Gesetz", Chaos: "Das Chaos",
    Good: "Das Erbarmen", Evil: "Die Strafe",
    Darkness: "Das Dunkel", Sun: "Das Licht",
    Knowledge: "Das Wissen", Madness: "Der Wahn",
    Fire: "Das Feuer", Water: "Das Wasser",
    Give: "Das Geben", Take: "Das Nehmen",
  },
  // Standardzeichen der Hälften für Verweise
  marks: ["A", "B"],
  middleTitle: "Die Mitte",
  local: {},
  en: {
    title: "Vademecum",
    subtitle: "A Breviary for the Road and the House",
    middleTitle: "The Middle",
    chapters: {
      preface: "Preface",
      essence: "Of the Nature",
      prayers: "Prayers",
      hymns: "Hymns",
      rites: "Rites and Feasts",
      retinue: "The Retinue",
      works: "Holy Works",
      history: "History of the House",
      rank: "Of Rank and Taboo",
      hooks: "Suggestions",
    },
    chapterNotes: { hooks: "Otherworldly: for the gaming table, not for the character." },
    essence: [
      ["{name}, called {title}, is worshipped as a power over {areas}.", "{name} is worshipped as a power over {areas}."],
      "The faithful count {name} among the powers that are {align}.",
      "Whoever prays to {name} receives gifts from the realms of {domains}.",
      "The holy sign is {symbol}.",
    ],
    hymnUse: {
      abjuration: "To be sung when gates, graves or houses are newly secured.",
      conjuration: "To be sung at departure and at arrival.",
      divination: "To be sung before study and in sleepless nights.",
      enchantment: "To be sung when the congregation gathers.",
      evocation: "To be sung in the evening, when the lamps are lit.",
      illusion: "To be sung softly, alone.",
      necromancy: "To be sung at the vigil for the dead.",
      transmutation: "To be sung at the beginning of a new work.",
      universal: "To be sung on every day.",
      default: "To be sung on every day.",
    },
    align: {
      LG: "lawful and good", NG: "neutral and good", CG: "chaotic and good",
      LN: "lawful and neutral", N: "neutral", CN: "chaotic and neutral",
      LE: "lawful and evil", NE: "neutral and evil", CE: "chaotic and evil",
      Unaligned: "bound to neither side",
    },
    pairNames: {
      Destruction: "Destruction", Protection: "Protection",
      Death: "Death", Healing: "Healing",
      Law: "Law", Chaos: "Chaos",
      Good: "Mercy", Evil: "Punishment",
      Darkness: "The Dark", Sun: "The Light",
      Knowledge: "Knowledge", Madness: "Madness",
      Fire: "Fire", Water: "Water",
      Give: "Giving", Take: "Taking",
    },
    dualNote: "This book has two halves. This one belongs to {half}; turn it over to read the other.",
  },
};

// VORLAGE für ein eigenes Profil.
// 1. Diese Datei nach data/profile.local.js kopieren.
// 2. Felder anpassen – alles, was hier fehlt, kommt aus dem neutralen data/profile.js.
// 3. index.html neu laden.
//
// Tipp für KI-Unterstützung: Gib einer KI diese Datei, data/profile.js und eine Beschreibung deines
// Charakters (Volk, Klasse, Gottheit, Herkunft, Kampagne, Tonfall) und lass dir die Felder füllen.
// Die Randnotizen (notes, flavor) sind die Stimme deines Charakters: kurz, persönlich, gerne mit Humor.
//
// Platzhalter: {owner} {name} {essence} {school}
window.PROFILE_LOCAL = {
  owner: "Mirla Heckenhain",
  bookTitle: "Das Kräuterbuch der Kreise",
  subtitle: "Formeln einer Heckenhexe aus dem Moorland",

  calendar: {
    months: ["Frostmond", "Schneemond", "Saatmond", "Regenmond", "Blütenmond", "Sonnenmond", "Heumond", "Erntemond", "Apfelmond", "Nebelmond", "Moormond", "Dunkelmond"],
    year: "im 7. Jahr nach der Flut",
    // optional: irdische Entsprechung und Länge der Monate, z. B. für ein Jahr, das im Sommer beginnt:
    // earth: ["Juli", "August", …], days: [31, 31, …],
  },
  places: ["die Hütte am Moor", "der Markt in Ellbach", "der alte Steinkreis", "die Mühle", "das Kräuterbeet"],

  divineFocus: "für arkane Wirker durch einen Stoff ersetzt; die Druiden des Moores tragen einen Mistelzweig",

  learningOrigins: [
    "von der Großmutter mündlich überliefert und erst spät aufgeschrieben.",
    "aus einem verregneten Buch eines durchreisenden Magiers abgeschrieben.",
  ],
  everydayOrigins: ["ein Rezeptbuch vom Markt", "ein Tausch gegen drei Gläser Moorbeerenmarmelade"],

  notes: [
    "Großmutter hätte {essence} nie so offen gezeichnet. Großmutter ist nicht mehr hier.",
    "Wirkt besser bei Vollmond. Oder ich bilde es mir ein.",
  ],
  noteOriginalName: "Im Buch des Magiers hieß sie „{name}“. Ich nenne sie anders.",
  noteAlignment: {
    malum: "Riecht nach Moorgas. Nicht in der Hütte wirken.",
    bonum: "Die Druiden würden diese Formel gutheißen. Glaube ich.",
  },

  // planes, essenceText, correspond: siehe data/profile.js – nur angeben, was abweichen soll

  chapters: {
    3: ["Das Dreieck trägt", "Großmutter nannte die dritte Ordnung die Erntehelfer: Formeln, die ein ganzes Feld auf einmal erreichen."],
  },

  everyday: {
    add: [
      // Eigene Alltagszauber im Format von data/everyday_spells.js, z. B.:
      // { name: "Marmeladenglanz", base: "Prestidigitation", target: "one jar touched", range: "touch",
      //   ess: { vita: 1.5, mens: 0.5 }, description: "…", flavor: "…" },
    ],
    remove: [],
    flavor: {
      "Katzenschoß": "Kater Mops kommt auch ohne Zauber. Aber dann nur, wenn er will.",
    },
  },

  // Sprache der eigenen Texte (ab Werk Deutsch)
  lang: "de",
  // Deutsche Regeldaten (tools/import-rules-de.mjs): Handzuordnungen, wo der Import nicht sicher ist
  // rulesDe: { overrides: { "Magisches Geschoss": "magic-missile" } },

  // Lehrheft („Lehre“ → Fibel der Kreise); alles optional
  primer: {
    title: "Fibel vom Moor",
    master: { name: "Großmutter Hedda", preface: ["Wer dieses Heft liest, hat Tinte an den Fingern. Gut so."] },
    // Stimmen der Randnotizen: hand = angular | flowing | even, ink = Tintenfarbe
    voices: { hedda: { label: "Hedda", hand: "angular", ink: "#5a3b2a" }, mirla: { label: "Mirla", hand: "flowing", ink: "#2f4a6b" } },
    // Randnotizen je Lektion; level = erst ab dieser Charakterstufe sichtbar
    notes: {
      l29: [{ voice: "hedda", text: "Hier am Moor sieht man den roten Stern nur im Herbst." }, { voice: "mirla", level: 3, text: "Im Frühjahr auch. Man muss nur früher aufstehen." }],
    },
    // Übergabeschreiben nach dem Titelblatt (ab Stufe level)
    // handover: { level: 1, voice: "hedda", text: ["Für Mirla, …"] },
    // Randkästen je Teil: { praise, fear, saying }
    // boxes: { II: { praise: "…", fear: "…", saying: "…" } },
    // loses Blatt hinter dem Anhang, im Aufbau eines okkulten Rituals; strike: Streichung einer zweiten Stimme
    // looseLeaf: { level: 5, voice: "hedda", ritual: { title: "…", text: ["…"], school: "…", level: "…", time: "…",
    //   components: "…", checks: "…", backlash: "…", failure: "…", effect: "…" },
    //   strike: { voice: "mirla", text: "…" }, notes: [{ voice: "mirla", text: "…" }] },
    // Beinamen der eigenen Welt, in Klammern hinter dem irdischen Namen (z. B. bei den Wandelsternen);
    // gearbeitet wird mit den irdischen Namen
    aliases: { Mars: "der Rote Wanderer", Venus: "der Abendstern" },
    // einzelne Lektionen ganz oder teilweise ersetzen (Felder wie in data/primer.js)
    lessons: {
      // l30: { box: { title: "Die Woche am Moor", text: ["Auf dem Markt in Ellbach zählt man die Tage anders …"] } },
    },
  },
};

// MEHRERE CHARAKTERE: Statt (oder zusätzlich zu) PROFILE_LOCAL lassen sich mehrere Profile registrieren.
// In der App wählt jeder Charakter (Einstellungen → Charakter → Profil) eines davon.
// cls ("wizard" oder "paladin") und deity (id aus data/deities.js) geben Klasse und Gottheit vor;
// was am Charakter eingestellt ist, geht vor.
// window.PROFILES_LOCAL = {
//   mirla: { label: "Mirla (Heckenhexe)", owner: "Mirla Heckenhain", bookTitle: "…", notes: ["…"] },
//   bruno: { label: "Bruno (Kriegsmagier)", owner: "Bruno vom Stein", calendar: { year: "im Jahr 12 nach dem Krieg" } },
//   aldric: { label: "Aldric (Paladin)", owner: "Aldric", cls: "paladin", deity: "torag", bookTitle: "Brevier des Hammers" },
// };

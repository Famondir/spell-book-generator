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
};

// MEHRERE CHARAKTERE: Statt (oder zusätzlich zu) PROFILE_LOCAL lassen sich mehrere Profile registrieren.
// In der App wählt jeder Charakter (Einstellungen → Charakter → Profil) eines davon.
// window.PROFILES_LOCAL = {
//   mirla: { label: "Mirla (Heckenhexe)", owner: "Mirla Heckenhain", bookTitle: "…", notes: ["…"] },
//   bruno: { label: "Bruno (Kriegsmagier)", owner: "Bruno vom Stein", calendar: { year: "im Jahr 12 nach dem Krieg" } },
// };

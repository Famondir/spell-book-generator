// Klassen als Daten: Zauberliste, Grade, Buchform und Bezeichnungen.
// Neue Klassen (Kleriker, Inquisitor, Antipaladin …) brauchen hier nur einen Eintrag.
window.CLASSES = {
  wizard: {
    label: "Magier",
    list: "wizard",
    tradition: "arcane",
    grades: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    joker: true,
    everyday: true,
    book: "Zauberbuch",
    day: "Neuer Tag",
  },
  paladin: {
    label: "Paladin",
    list: "paladin",
    tradition: "divine",
    grades: [1, 2, 3, 4],
    joker: false,
    everyday: false,
    deity: true,
    alignments: ["LG", "LN", "NG"],
    book: "Brevier",
    bookTitle: "Brevier",
    chapter: (g) => `Gebete des ${U.ROMAN[g]}. Grades`,
    day: "Gebetsstunde",
  },
};

// Klasse und Gottheit des aktiven Charakters; Felder am Charakter gehen vor dem Profil
window.CLASS = (function () {
  const ch = (window.CHARS && CHARS.current()) || {};
  const id = window.CLASSES[ch.cls] ? ch.cls : window.CLASSES[(window.PROFILE || {}).cls] ? PROFILE.cls : "wizard";
  return { id, ...window.CLASSES[id] };
})();

window.deityById = (id) => (window.DEITIES || []).find((d) => d.id === id) || null;
// Göttliche Klassen: Gottheit (Standard Iomedae). Arkane Klassen: optionale Schutzgottheit, die nur Gebete für den
// Tag, Andachtsblatt und Andachtsbuch betrifft; deity "" am Charakter = ausdrücklich keine (dann gilt auch das Profil nicht)
window.DEITY = (function () {
  const ch = (window.CHARS && CHARS.current()) || {};
  const prof = (window.PROFILE || {}).deity;
  if (window.CLASS.deity) return window.deityById(ch.deity || prof || "iomedae") || window.deityById("iomedae");
  const id = ch.deity === "" ? null : ch.deity || prof;
  return id ? window.deityById(id) : null;
})();

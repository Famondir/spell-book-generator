// Neutrales Standardprofil: alles, was Besitzer, Welt und Tonfall des Buches bestimmt.
// Eigene Backstory: data/profile.local.example.js nach data/profile.local.js kopieren und anpassen –
// die lokale Datei überschreibt einzelne Felder hier (und wird nicht mit ins Repository übernommen).
//
// Platzhalter in Texten: {owner} Besitzer, {name} Regelname des Zaubers, {essence} Hauptessenz (lateinisch),
//   {school} Schule (deutsch)
window.PROFILE = {
  // --- Buch ----------------------------------------------------------------------
  owner: "Die Verfasserin",
  bookTitle: "Codex der Kreise",
  subtitle: "Formeln, Siegel und kleine Künste",

  // --- Zeit und Orte (Randnotizen, Übungsprotokoll) ------------------------------
  calendar: {
    months: ["Eismond", "Taumond", "Lenzmond", "Ostermond", "Wonnemond", "Brachmond", "Heumond", "Erntemond", "Herbstmond", "Weinmond", "Nebelmond", "Julmond"],
    year: "im Jahr 312",
  },
  places: [
    "die Turmstube", "die Bibliothek der Akademie", "das Feldlager", "ein Gasthaus an der Handelsstraße",
    "der Keller der Akademie", "die Stadtmauer", "die Schreibstube", "die Ruinen im Wald",
  ],

  // --- Glaube --------------------------------------------------------------------
  divineFocus: "für arkane Wirker durch einen Stoff ersetzt; Geweihte tragen das heilige Symbol ihres Gottes",

  // --- Herkunft der Formeln ------------------------------------------------------
  learningOrigins: [
    "eine Vorlage in der Handelssprache, in arkane Notation umgeschrieben.",
    "eine Inschrift in einer alten Ruine; die Kreisgeometrie ist älter als die Worte.",
    "ein Lehrbuch der Akademie.",
    "selbst hergeleitet aus der Struktur verwandter Formeln.",
  ],
  everydayOrigins: [
    "eine Sammlung kleiner Formeln aus einem Gasthaus",
    "ein Tausch gegen eine Abschrift von Magisches Geschoss",
    "das Notizbuch einer reisenden Elfe",
    "selbst hergeleitet an einem verregneten Nachmittag",
  ],

  // --- Stimme der Randnotizen ----------------------------------------------------
  // Zusätzliche Notizen im Ton des Besitzers (werden mit den allgemeinen gemischt)
  notes: [
    "Die Götter der Magie sehen jede unsaubere Linie. Ich auch.",
    "{essence} lässt sich leichter führen, wenn die Hände ruhig sind. Kein Tee vor dem Wirken.",
    "Meine Lehrmeisterin hätte diese Formel anders gezeichnet. Meine hält länger.",
  ],
  noteOriginalName: "Die Vorlage nannte die Formel „{name}“. Mir geht es um die Struktur, nicht um den Namen.",
  noteAlignment: {
    malum: "Die Malum-Komponente gleicht dem Muster von Rissen zu den unteren Ebenen. Studieren, um sie zu schließen.",
    bonum: "Bonum stört die Formeln böser Externarer. Gegen Beschwörungen erproben.",
  },

  // --- Kosmologie ----------------------------------------------------------------
  // Ebenen der Essenzen (nur die Abweichungen von theory.js)
  planes: {
    ordo: "Ebene der reinen Ordnung",
    fluxus: "Ebene des reinen Chaos",
    bonum: "Die oberen Ebenen",
    malum: "Die unteren Ebenen",
  },
  essenceText: {
    malum: "Malum ist die Ausrichtung der unteren Ebenen. Wo Risse zwischen den Welten klaffen, sickert sie ein; wer sie bannen will, muss sie lesen können.",
  },
  // Entsprechungen: Himmelskörper und Gestirn je Essenz
  correspond: {
    ignis: { body: "Sonne", planet: "Mars" },
    aqua: { body: "Mond", planet: "Venus" },
    aer: { body: "Morgenstern", planet: "Merkur" },
    terra: { body: "Erde", planet: "Saturn" },
    vita: { body: "Sonne", planet: "Jupiter" },
    mors: { body: "Neumond", planet: "Saturn" },
    lux: { body: "Sonne", planet: "Sonne" },
    umbra: { body: "Neumond", planet: "Mond" },
    mens: { body: "Abendstern", planet: "Merkur" },
    vis: { body: "Sonne", planet: "Mars" },
    ordo: { body: "Polarstern", planet: "Saturn" },
    fluxus: { body: "Wandelsterne", planet: "Merkur" },
    bonum: { body: "Zenit", planet: "Jupiter" },
    malum: { body: "Nadir", planet: "Saturn" },
    spatium: { body: "Fixsterne", planet: "Fixsterne" },
    tempus: { body: "Mond", planet: "Saturn" },
  },

  // --- Kapitel -------------------------------------------------------------------
  // Eigene Kapiteltexte: { "3": ["Untertitel", "Absatz", "Absatz"], cantrip: […], everyday: […] }
  // Fehlende Kapitel nutzen die Standardtexte aus app/js/book.js.
  chapters: {},

  // --- Alltagszauber -------------------------------------------------------------
  // add: zusätzliche Alltagszauber (Format wie data/everyday_spells.js)
  // remove: Namen, die ausgeblendet werden
  // flavor: { "Name": "eigene Randnotiz" } ersetzt den Flavour-Text
  everyday: { add: [], remove: [], flavor: {} },
};

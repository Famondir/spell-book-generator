// Neutrales Standardprofil: alles, was Besitzer, Welt und Tonfall des Buches bestimmt.
// Eigene Backstory: data/profile.local.example.js nach data/profile.local.js kopieren und anpassen –
// die lokale Datei überschreibt einzelne Felder hier (und wird nicht mit ins Repository übernommen).
//
// Platzhalter in Texten: {owner} Besitzer, {name} Regelname des Zaubers, {essence} Hauptessenz (lateinisch),
//   {school} Schule (deutsch)
//
// en: englische Fassung aller Ingame-Texte (data/lang/README.md), gleiche Schlüssel und Verschachtelung wie oben,
//   ohne Nicht-Texte (Zahlen, Ids, Flags, Essenzschlüssel). Gleiche Platzhalter. Form:
//   en.owner, bookTitle, subtitle, divineFocus, noteOriginalName: Zeichenketten
//   en.calendar: { months[12], year, earth[12], dayNames[], signs[], poleStar }   (leer wie im Deutschen)
//   en.places[], learningOrigins[], everydayOrigins[], notes[]: Listen gleicher Länge
//   en.noteAlignment: { <Essenz>: Text }, planes: { <Essenz>: Text }, essenceText: { <Essenz>: Text }
//   en.correspond: { <Essenz>: { body, planet } }   (planet = englischer Name des Gestirns)
//   en.devotion: { feasts: [], occasions: {}, voice: "" }   (leer wie im Deutschen)
window.PROFILE = {
  // --- Buch ----------------------------------------------------------------------
  owner: "Die Verfasserin",
  bookTitle: "Codex der Kreise",
  subtitle: "Formeln, Siegel und kleine Künste",

  // --- Zeit und Orte (Randnotizen, Übungsprotokoll) ------------------------------
  calendar: {
    months: ["Eismond", "Taumond", "Lenzmond", "Ostermond", "Wonnemond", "Brachmond", "Heumond", "Erntemond", "Herbstmond", "Weinmond", "Nebelmond", "Julmond"],
    year: "im Jahr 312",
    // irdische Entsprechung je Monat (erscheint in Klammern bei der Auswahl des Ingame-Datums; weglassen = keine)
    earth: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    // Tage je Monat (für das Ingame-Datum der Tagesvorbereitung)
    days: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    // Tafel der Zeit (Lehrheft); alles optional, ohne Angabe gelten irdische Tagesnamen und der irdische Tierkreis
    // dayNames: sieben Tagesnamen in der Folge Sonntag … Samstag (Sonne, Mond, Mars, Merkur, Jupiter, Venus, Saturn)
    // signs: Zeichen des Himmels { id, name, from: { m, d }, to: { m, d }, ess: ["ignis", …], fig: { pts, links } }
    //        (m = Monat ab 0 wie in months; Spanne einschließlich des Endtags; fig: Sterne im Feld −10…10, links als Paare von Indizes)
    //        text: Bild und Geschichte des Zeichens (steht in der Lektion „Die Zeichen des Himmels“)
    // dayTexts: Brauch je Tag (Sonntag … Samstag), steht unter der Überlieferung der Werkstatt
    // monthTexts: Text je Monat (ersetzt die Überlieferung der Werkstatt aus data/time.js); seasons: Jahreszeit je Monat
    // patrons: Schutzgottheit je Monat als Id aus data/deities.js (null = keine), in der Folge der Monate
    // poleStar: Name des Polarsterns auf der Sternkarte
    // feastHand: Stimme (primer.voices), die die Festtage der Andacht und des Vademecums nachträglich als Punkte in
    //            den Jahresring gesetzt hat; ohne Angabe nennt das Lehrheft keine Feste
    dayNames: [],
    signs: [],
    patrons: [],
    poleStar: "",
  },
  places: [
    "die Turmstube", "die Bibliothek der Akademie", "das Feldlager", "ein Gasthaus an der Handelsstraße",
    "der Keller der Akademie", "die Stadtmauer", "die Schreibstube", "die Ruinen im Wald",
  ],

  // --- Glaube --------------------------------------------------------------------
  divineFocus: "für arkane Wirker durch einen Stoff ersetzt; Geweihte tragen das heilige Symbol ihres Gottes",

  // --- Andacht (nur mit Gottheit bzw. Schutzgottheit am Charakter) ---------------------
  // Ablauf von Morgen- und Abendgebet als Schritte; text ersetzt den erzeugten Text eines Schritts.
  //   Morgen: invoke (Anrufung), fetchBook (Buch holen), obedience (Andacht), prepare (Vorbereitung),
  //           returnBook (Buch zurücksenden), close (Schluss)
  //   Abend:  invoke, studyBook (Buch zum Studium, optional: true), review (Rückschau), keep (Bitte ums Behalten), close
  // obedience: "prayer" (nur Gebetszeilen) oder "fragment" (abgebrochenes Formelfragment mit Teilkreis)
  // feasts: Festtage { d, m (Index in calendar.months), name, text }
  // occasions: eigene Anlass-Gebete { decipher, failedRoll, banish, copy, dead, feast } (Text, Zeilen mit \n)
  // voice: Stimme des Tagebuchs (steht im Rückschau-Bogen, z. B. als Vorgabe für eine KI)
  // tone: "" (automatisch), "dual" (Zwiespalt erzwingen) oder "plain" (Zwiespalt abschalten)
  devotion: {
    morning: [{ step: "invoke" }, { step: "prepare" }, { step: "close" }],
    evening: [{ step: "invoke" }, { step: "review" }, { step: "keep" }, { step: "close" }],
    obedience: "prayer",
    feasts: [],
    occasions: {},
    voice: "",
    tone: "",
    log: false, // true: Rückseite des Andachtsblatts mit nüchternem Protokoll (Zahlen des Tages)
  },

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

  // --- Formelsprachen (app/js/lang.js, Lexika in data/formula-lang/) ----------------
  // Stationen: wo und von wem die Formeln stammen. Jede Station gibt ihren Zaubern die Formelsprache.
  //   { id, label, lang, hand, share (Anteil am Buch in %), levels: [min, max],
  //     schools: { abjuration: 3, … }, essences: { mors: 2, … }, hints: { sources: ["…"], name: ["…"] },
  //     origin: "Herkunftstext im Buch statt eines Eintrags aus learningOrigins" }
  // Festlegung je Zauber in data/custom_texts.js: { origin: "<station>" } oder { lang: "<sprache>" }
  // Leer: eine lateinische Station für alle Zauber.
  formulaOrigins: [],
  // Name einer Sprache im Spiel statt der irdischen Bezeichnung, z. B. { egyptian: "die Sprache der Pharaonen" }
  formulaLangNames: {},
  // Hausregel „Entziffern“: Sprachenkunde-SG je Zauber = Basis + Grad + Zuschlag der Hand (aus = keine Anzeige)
  //   { enabled, base: { known, related, foreign, dead }, hands: { <hand>: +2 }, dead: [lang], known: [lang] }
  decipher: { enabled: false },
  // eigene Vorlagen für Brückennotizen (fremdes Formelwort und lateinisches Fachwort mit gemeinsamem Stamm)
  //   { cognate: ["…"] }  Platzhalter {word} {latin} {lang}: verwandter Eintrag der Brückentabelle
  //   { coreStem: ["…"] } Platzhalter {word} {latin} {stem} {lang}: Kernwort mit hinterlegtem Stamm
  //   leer: neutrale Vorlagen aus textgen.js
  bridgeNotes: {},

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

  // --- English (siehe Kopfkommentar) -----------------------------------------------
  en: {
    owner: "The Author",
    bookTitle: "Codex of Circles",
    subtitle: "Formulas, Seals and Small Arts",
    calendar: {
      months: ["Icemoon", "Thawmoon", "Lentenmoon", "Eastermoon", "Joymoon", "Fallowmoon", "Haymoon", "Harvestmoon", "Autumnmoon", "Vintagemoon", "Fogmoon", "Yulemoon"],
      year: "in the year 312",
      earth: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      dayNames: [],
      signs: [],
      poleStar: "",
    },
    places: [
      "the tower room", "the library of the academy", "the field camp", "an inn on the trade road",
      "the cellar of the academy", "the city wall", "the scriptorium", "the ruins in the forest",
    ],
    divineFocus: "replaced by a material for arcane casters; the consecrated carry the holy symbol of their god",
    devotion: { feasts: [], occasions: {}, voice: "" },
    learningOrigins: [
      "a template in the trade tongue, transcribed into arcane notation.",
      "an inscription in an old ruin; the geometry of the circle is older than the words.",
      "a textbook of the academy.",
      "derived by myself from the structure of related formulas.",
    ],
    everydayOrigins: [
      "a collection of small formulas from an inn",
      "a swap for a copy of Magic Missile",
      "the notebook of a travelling elf",
      "derived by myself on a rainy afternoon",
    ],
    notes: [
      "The gods of magic see every untidy line. So do I.",
      "{essence} is easier to guide when the hands are steady. No tea before casting.",
      "My teacher would have drawn this formula differently. Mine lasts longer.",
    ],
    noteOriginalName: "The template called this formula “{name}”. I care about the structure, not the name.",
    noteAlignment: {
      malum: "The malum component resembles the pattern of cracks leading to the lower planes. Study it in order to close them.",
      bonum: "Bonum disturbs the formulas of evil outsiders. Test it against summonings.",
    },
    planes: {
      ordo: "Plane of pure order",
      fluxus: "Plane of pure chaos",
      bonum: "The upper planes",
      malum: "The lower planes",
    },
    essenceText: {
      malum: "Malum is the orientation of the lower planes. Where cracks gape between the worlds it seeps in; whoever would banish it must be able to read it.",
    },
    correspond: {
      ignis: { body: "Sun", planet: "Mars" },
      aqua: { body: "Moon", planet: "Venus" },
      aer: { body: "Morning Star", planet: "Mercury" },
      terra: { body: "Earth", planet: "Saturn" },
      vita: { body: "Sun", planet: "Jupiter" },
      mors: { body: "New Moon", planet: "Saturn" },
      lux: { body: "Sun", planet: "Sun" },
      umbra: { body: "New Moon", planet: "Moon" },
      mens: { body: "Evening Star", planet: "Mercury" },
      vis: { body: "Sun", planet: "Mars" },
      ordo: { body: "Pole Star", planet: "Saturn" },
      fluxus: { body: "Wandering Stars", planet: "Mercury" },
      bonum: { body: "Zenith", planet: "Jupiter" },
      malum: { body: "Nadir", planet: "Saturn" },
      spatium: { body: "Fixed Stars", planet: "Fixed Stars" },
      tempus: { body: "Moon", planet: "Saturn" },
    },
  },
};

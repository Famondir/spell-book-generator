// Tafel der Zeit: Wochenfolge, irdischer Tierkreis und Zuordnungen, setting-neutral.
// Setting-Eigenes (eigene Tagesnamen, Bräuche, Zeichen, Schutzgottheiten der Monate) steht im lokalen Profil:
//   calendar.dayNames, dayTexts, monthTexts, seasons, signs, patrons (siehe data/profile.js).
// week[].ess gilt, wenn die Entsprechungen im Profil (correspond.planet) keinen der sieben Wandelsterne nennen.
// Englisch (data/lang/README.md): week[].en = { name, metal, day, text }, zodiac[].en = { name, text },
//   seasonsEn[12] parallel zu seasons, monthLoreEn[12] parallel zu monthLore. Ids, ess, fig bleiben sprachfrei.
// Figuren: pts = Sterne im Feld −10…10, links = Linien als "von-bis" (Indizes in pts).
(function () {
  const fig = (pts, links) => ({ pts, links: links.split(",").map((l) => l.split("-").map(Number)) });

  window.TIME_DATA = {
    // Woche in der Folge des Wochenkreises (Lektion „Der Wochenkreis“): Sonne, Mond, Mars, Merkur, Jupiter, Venus, Saturn
    week: [
      { planet: "sol", name: "Sonne", metal: "Gold", day: "Sonntag", ess: ["lux"],
        text: "Der Tag des Goldes. Man beginnt nichts Neues, sondern bringt zu Ende, was die Woche angefangen hat, und legt das Fertige ins Licht. Werkstätten, die nach den Gestirnen arbeiten, vergolden heute Initialen und lassen Siegel offen in der Sonne trocknen.",
        en: { name: "Sun", metal: "gold", day: "Sunday",
          text: "The day of gold. One begins nothing new but finishes what the week has started, and lays the finished work out in the light. Workshops that keep to the stars gild their initials today and leave their seals open to dry in the sun." } },
      { planet: "luna", name: "Mond", metal: "Silber", day: "Montag", ess: ["umbra"],
        text: "Der Tag des Silbers und der Nacht. Gut für alles, was im Verborgenen wachsen soll: Tinten ansetzen, Abschriften bei Kerzenlicht vergleichen, Träume aufschreiben, ehe sie verfliegen. Silberglyphen gelingen angeblich am besten nach Mondaufgang.",
        en: { name: "Moon", metal: "silver", day: "Monday",
          text: "The day of silver and of night. Good for everything that is meant to grow in secret: setting ink, comparing copies by candlelight, writing down dreams before they fade. Silver glyphs are said to succeed best after moonrise." } },
      { planet: "mars", name: "Mars", metal: "Eisen", day: "Dienstag", ess: ["ignis", "vis"],
        text: "Der Tag des Eisens. Man schärft die Federmesser, schneidet Pergament zu und prüft die Schutzkreise auf Risse. Wer streiten muss, tut es heute; wer ein Feuer braucht, zündet es heute an.",
        en: { name: "Mars", metal: "iron", day: "Tuesday",
          text: "The day of iron. One sharpens the penknives, cuts parchment to size and tests the protective circles for cracks. Whoever must quarrel does so today; whoever needs a fire lights it today." } },
      { planet: "mercurius", name: "Merkur", metal: "Quecksilber", day: "Mittwoch", ess: ["aer", "mens", "fluxus"],
        text: "Der Tag des Quecksilbers, beweglich wie dieses. Botengänge, Briefe, Übersetzungen und Rechnungen gehören hierher, und das Auswendiglernen. Was man am Tag des Merkur lernt, sagt man, lernt man leicht und vergisst es schnell.",
        en: { name: "Mercury", metal: "quicksilver", day: "Wednesday",
          text: "The day of quicksilver, restless as that metal. Errands, letters, translations and accounts belong here, and so does learning by heart. What one learns on Mercury's day, they say, one learns easily and forgets quickly." } },
      { planet: "iupiter", name: "Jupiter", metal: "Zinn", day: "Donnerstag", ess: ["vita", "bonum"],
        text: "Der Tag des Zinns, der Ordnung und des Gedeihens. Lehrbriefe, Verträge und Verzeichnisse schreibt man an ihm, und Zinnglyphen zeichnet man am liebsten heute. Ein guter Tag, um einen Lehrling aufzunehmen.",
        en: { name: "Jupiter", metal: "tin", day: "Thursday",
          text: "The day of tin, of order and of thriving. Indentures, contracts and inventories are written on it, and tin glyphs are best drawn today. A good day to take on an apprentice." } },
      { planet: "venus", name: "Venus", metal: "Kupfer", day: "Freitag", ess: ["aqua"],
        text: "Der Tag des Kupfers, des Wassers und des Mischens. Man reibt Farben an, setzt Seife und Siegellack an und versöhnt sich mit dem, mit dem man am Tag des Mars gestritten hat.",
        en: { name: "Venus", metal: "copper", day: "Friday",
          text: "The day of copper, of water and of mixing. One grinds colours, sets soap and sealing wax, and makes peace with the one with whom one quarrelled on Mars's day." } },
      { planet: "saturnus", name: "Saturn", metal: "Blei", day: "Samstag", ess: ["terra", "mors", "ordo", "malum", "tempus"],
        text: "Der Tag des Bleis, schwer und langsam. Man räumt auf, verbrennt Fehlschriften, ordnet das Archiv und denkt an die Toten. Bannkreise, die lange halten sollen, zieht man am Tag des Saturn.",
        en: { name: "Saturn", metal: "lead", day: "Saturday",
          text: "The day of lead, heavy and slow. One tidies up, burns faulty copies, puts the archive in order and thinks of the dead. Banishing circles that are meant to last long are drawn on Saturn's day." } },
    ],

    // Irdischer Tierkreis als Rückfall (12 Zeichen); Monate zählen ab 0 wie in calendar.months
    zodiac: [
      { id: "capricorn", name: "Steinbock", from: { m: 11, d: 22 }, to: { m: 0, d: 19 }, text: "Ein Ziegenfisch, halb Bergtier, halb Meereswesen. Er steigt langsam und stetig; wer unter ihm arbeitet, baut für lange Zeit.", ess: ["terra", "tempus"], en: { name: "Capricorn", text: "A goat-fish, half mountain beast, half creature of the sea. It climbs slowly and steadily; whoever works under it builds for a long time to come." }, fig: fig([[-8, -4], [-2, -6], [4, -2], [8, 4], [2, 6], [-4, 2]], "0-1,1-2,2-3,3-4,4-5,5-0") },
      { id: "aquarius", name: "Wassermann", from: { m: 0, d: 20 }, to: { m: 1, d: 18 }, text: "Ein Mann, der Wasser aus einem Krug gießt. Er gibt aus, was er hat, und bringt Bewegung in das, was steht.", ess: ["aer", "fluxus"], en: { name: "Aquarius", text: "A man pouring water from a jug. He gives out what he has and sets in motion what stands still." }, fig: fig([[-8, -3], [-4, -6], [0, -3], [4, -6], [8, -3], [-6, 4], [0, 6], [6, 4]], "0-1,1-2,2-3,3-4,5-6,6-7") },
      { id: "pisces", name: "Fische", from: { m: 1, d: 19 }, to: { m: 2, d: 20 }, text: "Zwei Fische, an einem Band verbunden, die in verschiedene Richtungen schwimmen. Das Zeichen der Träume und des Verborgenen.", ess: ["aqua", "umbra"], en: { name: "Pisces", text: "Two fish joined by a cord, swimming in different directions. The sign of dreams and of what lies hidden." }, fig: fig([[-8, -5], [-4, -7], [-2, -3], [-6, 0], [2, 6], [6, 3], [8, 7], [4, 8]], "0-1,1-2,2-3,3-0,2-4,4-5,5-6,6-7,7-4") },
      { id: "aries", name: "Widder", from: { m: 2, d: 21 }, to: { m: 3, d: 19 }, text: "Ein Widder mit gesenktem Kopf. Mit ihm beginnt nach alter Rechnung das Jahr der Sterne; er bringt Feuer und Anfang.", ess: ["ignis", "vis"], en: { name: "Aries", text: "A ram with lowered head. By the old reckoning the year of the stars begins with him; he brings fire and beginning." }, fig: fig([[-8, 3], [-3, 0], [2, -1], [6, -4], [7, 3]], "0-1,1-2,2-3,2-4") },
      { id: "taurus", name: "Stier", from: { m: 3, d: 20 }, to: { m: 4, d: 20 }, text: "Ein Stier, schwer und geduldig, der die Erde pflügt. Was unter ihm begonnen wird, wächst langsam, aber sicher.", ess: ["terra", "vita"], en: { name: "Taurus", text: "A bull, heavy and patient, ploughing the earth. What is begun under him grows slowly but surely." }, fig: fig([[-8, -5], [-3, 0], [0, 2], [3, 0], [8, -5], [-1, 7]], "0-1,1-2,2-3,3-4,2-5") },
      { id: "gemini", name: "Zwillinge", from: { m: 4, d: 21 }, to: { m: 5, d: 20 }, text: "Zwei Brüder, Hand in Hand. Das Zeichen des Gesprächs, der Boten und des doppelten Denkens.", ess: ["aer", "mens"], en: { name: "Gemini", text: "Two brothers, hand in hand. The sign of conversation, of messengers and of double thinking." }, fig: fig([[-5, -8], [-5, 0], [-4, 8], [4, -8], [4, 0], [3, 8]], "0-1,1-2,3-4,4-5,1-4") },
      { id: "cancer", name: "Krebs", from: { m: 5, d: 21 }, to: { m: 6, d: 22 }, text: "Ein Krebs mit erhobenen Scheren, der sein Haus mit sich trägt. Er schützt, was ihm gehört, und weicht seitwärts aus.", ess: ["aqua", "vita"], en: { name: "Cancer", text: "A crab with raised claws, carrying its house with it. It protects what is its own and sidesteps what it must." }, fig: fig([[0, -1], [-4, 6], [5, 6], [-6, -6], [7, -7]], "0-1,0-2,0-3,0-4") },
      { id: "leo", name: "Löwe", from: { m: 6, d: 23 }, to: { m: 7, d: 22 }, text: "Ein Löwe im Sprung, das Zeichen der stärksten Sonne: Stolz, Licht und Feuer.", ess: ["ignis", "lux"], en: { name: "Leo", text: "A lion in mid-leap, the sign of the strongest sun: pride, light and fire." }, fig: fig([[-6, -7], [-4, -3], [-5, 2], [-1, 5], [2, 3], [8, 4], [4, -2]], "0-1,1-2,2-3,3-4,4-5,4-6,6-1") },
      { id: "virgo", name: "Jungfrau", from: { m: 7, d: 23 }, to: { m: 8, d: 22 }, text: "Eine Frau mit einer Ähre in der Hand. Sie ordnet die Ernte und prüft, was taugt.", ess: ["terra", "mens"], en: { name: "Virgo", text: "A woman with an ear of corn in her hand. She puts the harvest in order and tests what is sound." }, fig: fig([[-7, -6], [-2, -3], [3, -2], [8, -6], [1, 2], [-3, 6], [5, 7]], "0-1,1-2,2-3,2-4,4-5,4-6") },
      { id: "libra", name: "Waage", from: { m: 8, d: 23 }, to: { m: 9, d: 22 }, text: "Eine Waage mit zwei Schalen, das einzige Zeichen, das kein Lebewesen ist. Sie wägt und gleicht aus.", ess: ["aer", "ordo"], en: { name: "Libra", text: "A balance with two pans, the only sign that is not a living creature. It weighs and evens out." }, fig: fig([[-7, 3], [0, -6], [7, 3], [-2, 2], [3, 7]], "0-1,1-2,0-3,3-2,2-4") },
      { id: "scorpio", name: "Skorpion", from: { m: 9, d: 23 }, to: { m: 10, d: 21 }, text: "Ein Skorpion mit erhobenem Stachel. Er hütet Geheimnisse und den Übergang in den Tod.", ess: ["aqua", "mors"], en: { name: "Scorpio", text: "A scorpion with raised sting. It guards secrets and the passage into death." }, fig: fig([[-8, -5], [-4, -2], [0, 0], [4, 2], [6, 6], [2, 8], [-1, 5]], "0-1,1-2,2-3,3-4,4-5,5-6") },
      { id: "sagittarius", name: "Schütze", from: { m: 10, d: 22 }, to: { m: 11, d: 21 }, text: "Ein Kentaur, der seinen Pfeil in die Ferne richtet. Das Zeichen der Reise und des weiten Blicks.", ess: ["ignis", "spatium"], en: { name: "Sagittarius", text: "A centaur aiming his arrow into the distance. The sign of travel and of the far view." }, fig: fig([[-5, -2], [-1, -6], [4, -3], [4, 3], [-1, 6], [-6, 3], [0, 0]], "0-1,1-2,2-3,3-4,4-5,5-0,6-1") },
    ],

    // Jahreszeiten bei zwölf Monaten (ohne calendar.seasons im Profil)
    seasons: ["Winter", "Winter", "Frühling", "Frühling", "Frühling", "Sommer", "Sommer", "Sommer", "Herbst", "Herbst", "Herbst", "Winter"],

    // englische Fassung (parallel zu seasons)
    seasonsEn: ["Winter","Winter","Spring","Spring","Spring","Summer","Summer","Summer","Autumn","Autumn","Autumn","Winter"],

    // Überlieferung der Werkstatt je Monat bei zwölf Monaten (ohne calendar.monthTexts im Profil)
    monthLore: [
      "Der Monat der kalten Stuben. Die Tinte wird dick und muss am Ofen gewärmt werden, Leim kocht man jetzt auf Vorrat. Die langen Abende gehören den Abschriften bei Lampenlicht.",
      "Noch Winter, aber die Tage werden länger. Man prüft, was der Frost an Pergament und Siegeln verdorben hat, und bestellt neue Federn, denn die Gänse mausern bald.",
      "Das Eis bricht, die Wege werden schlammig. Ein guter Monat, um Galläpfel einzuweichen, die man im Herbst gesammelt hat, und um die Werkstatt gründlich zu fegen.",
      "Regen und erste Wärme. Farben trocknen langsam, darum malt man jetzt wenig und rechnet viel. Wer eine neue Formel herleiten will, beginnt in diesem Monat.",
      "Alles blüht, und die Kräuterkundigen sind unterwegs. Man sammelt frische Pflanzen für Farben und Tinten und lüftet die Bücher in der Sonne, ehe die Motten kommen.",
      "Der Monat des längsten Tages. Die Werkstatt arbeitet von früh bis spät, Wachs wird weich, Siegellack zieht Fäden. Feuerformeln gelingen angeblich jetzt am besten.",
      "Hitze. Man arbeitet am Morgen und am Abend und schläft über Mittag. Pergament wird spröde und muss feucht gelagert werden.",
      "Die Ernte beginnt, und mit ihr die Märkte. Wer Stoffe für das ganze Jahr kaufen will, kauft jetzt, solange die Händler im Land sind.",
      "Die Nächte werden kühl und klar. Ein guter Monat, um die Sterne zu lesen und die Kreise des Jahres nachzuzeichnen, die im Sommer verwischt sind.",
      "Galläpfel werden reif, Nüsse fallen. Man sammelt, was man für die Tinten des nächsten Jahres braucht, und kocht die erste Eisengallustinte.",
      "Nebel und Dunkelheit. Die Werkstatt zieht sich nach innen zurück; man ordnet das Archiv, bindet Hefte und schreibt auf, was das Jahr gelehrt hat.",
      "Der dunkelste Monat. Man feiert, um die Dunkelheit zu ertragen, und gibt den Lehrlingen frei. Was in diesem Monat geschrieben wird, soll man vor dem Frühjahr nicht wirken.",
    ],

    // englische Fassung (parallel zu monthLore, zwölf Einträge)
    monthLoreEn: [
      "The month of cold parlours. The ink grows thick and must be warmed at the stove; glue is boiled now and laid in for the year. The long evenings belong to copying by lamplight.",
      "Still winter, but the days are growing longer. One checks what the frost has spoiled in parchment and seals, and orders new quills, for the geese will moult soon.",
      "The ice breaks and the roads turn to mud. A good month for soaking the oak galls gathered in autumn, and for sweeping the workshop thoroughly.",
      "Rain and the first warmth. Colours dry slowly, so one paints little now and reckons much. Whoever wants to derive a new formula begins in this month.",
      "Everything blooms and the herbalists are abroad. One gathers fresh plants for colours and inks, and airs the books in the sun before the moths come.",
      "The month of the longest day. The workshop works from early until late, wax grows soft and sealing wax pulls threads. Fire formulas are said to succeed best now.",
      "Heat. One works in the morning and in the evening and sleeps through midday. Parchment turns brittle and must be stored damp.",
      "The harvest begins, and with it the markets. Whoever wants to buy materials for the whole year buys now, while the merchants are in the land.",
      "The nights turn cool and clear. A good month for reading the stars and for retracing the circles of the year that the summer has blurred.",
      "Oak galls ripen and nuts fall. One gathers what one needs for next year's inks, and boils the first iron gall ink.",
      "Fog and darkness. The workshop withdraws into itself; one puts the archive in order, binds booklets and writes down what the year has taught.",
      "The darkest month. One feasts to bear the darkness and gives the apprentices leave. What is written in this month should not be cast before spring.",
    ],

    // Domäne einer Gottheit → Essenz (für die Affinität eines Monats über seine Schutzgottheit; nur Erzählung)
    domainEss: {
      Air: "aer", Animal: "vita", Artifice: "vis", Chaos: "fluxus", Charm: "mens", Community: "ordo", Darkness: "umbra",
      Death: "mors", Destruction: "vis", Earth: "terra", Evil: "malum", Fire: "ignis", Glory: "lux", Good: "bonum", Healing: "vita",
      Knowledge: "mens", Law: "ordo", Liberation: "fluxus", Luck: "fluxus", Madness: "fluxus", Magic: "vis", Nobility: "ordo",
      Plant: "vita", Protection: "ordo", Repose: "mors", Rune: "ordo", Scalykind: "terra", Strength: "vis", Sun: "lux",
      Travel: "spatium", Trickery: "umbra", Void: "spatium", War: "vis", Water: "aqua", Weather: "aer",
    },
  };
})();

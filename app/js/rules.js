// Regelangaben in der Regelsprache (I18N.lang.rules): Name, Werte, Regeltext, Quelle.
// Deutsch: aus den deutschen Regeldaten (data/rules.de.js → window.RULES_DE, erzeugt von
// tools/import-rules-de.mjs), sonst regelbasiert übersetzte Begriffe mit englischem Regeltext.
// Alltagszauber: eigener deutscher Name und Regeltext; geerbte Werte kommen vom Basiszauber.
(function () {
  const de = () => I18N.lang.rules === "de";
  const spellOf = (x) => (x && x.spell) || x;
  const byName = () => (byName.map = byName.map || new Map(window.SPELLS.map((s) => [s.name.toLowerCase(), s])));
  const baseOf = (s) => (s.everyday ? byName().get(String(s.base).toLowerCase()) : null);
  const data = (s) => (de() && window.RULES_DE ? window.RULES_DE[s.id] || null : null);

  // --- Begriffe -----------------------------------------------------------------------------
  const SCHOOL = { abjuration: "Bannzauber", conjuration: "Beschwörung", divination: "Erkenntnis", enchantment: "Verzauberung", evocation: "Hervorrufung", illusion: "Illusion", necromancy: "Nekromantie", transmutation: "Verwandlung", universal: "Universal" };
  const SUB = { calling: "Herbeirufung", creation: "Erschaffung", healing: "Heilung", summoning: "Herbeizauberung", teleportation: "Teleportation", scrying: "Ausspähung", charm: "Bezauberung", compulsion: "Zwang", figment: "Einbildung", glamer: "Fehlgefühl", pattern: "Muster", phantasm: "Phantom", shadow: "Schatten", polymorph: "Gestaltwandel", haunted: "Spuk" };
  const DESC = { acid: "Säure", air: "Luft", chaotic: "Chaos", cold: "Kälte", curse: "Fluch", darkness: "Dunkelheit", death: "Tod", disease: "Krankheit", draconic: "Drakonisch", earth: "Erde", electricity: "Elektrizität", emotion: "Gefühl", evil: "Böses", fear: "Furcht", fire: "Feuer", force: "Energie", good: "Gutes", "language-dependent": "Sprachabhängig", lawful: "Ordnung", light: "Licht", meditative: "Meditativ", "mind-affecting": "Geistesbeeinflussung", pain: "Schmerz", poison: "Gift", ruse: "List", shadow: "Schatten", sonic: "Schall", water: "Wasser" };
  const CLASS = { wizard: "MAG", sorcerer: "HXM", cleric: "KLE", oracle: "ORA", druid: "DRU", bard: "BAR", paladin: "PAL", ranger: "WAL", witch: "HEX", inquisitor: "INQ", alchemist: "ALC", magus: "KAM", summoner: "PKM", bloodrager: "BLU", antipaladin: "ANP", shaman: "SHA", psychic: "MEN", occultist: "OKK", mesmerist: "MES", medium: "MED", spiritualist: "SPI", arcanist: "ARK", investigator: "ERM", skald: "SKA", hunter: "JÄG", warpriest: "KPR" };

  // Längen „N ft.“ und Meilen → Einheit der Einstellung (5 ft. = 1,5 m, 1 Meile = 1,5 km)
  const ft = (s) => s
    .replace(/(\d+(?:,\d+)?) sq\. ?ft\./g, (m, n) => (I18N.lang.units === "m" ? `${I18N.num(Math.round(+n.replace(",", ".") * 0.09 * 100) / 100)} m²` : `${n} Quadratfuß`))
    .replace(/(\d+(?:,\d+)?) cu\. ?ft\./g, (m, n) => (I18N.lang.units === "m" ? `${I18N.num(Math.round(+n.replace(",", ".") * 0.027 * 1000) / 1000)} m³` : `${n} Kubikfuß`))
    .replace(/(\d+(?:,\d+)?)[- ]?(?:ft\.?|feet|foot)(?![a-z])/g, (m, n) => I18N.len(+n.replace(",", "")))
    .replace(/(\d+(?:,\d+)?)[- ]?miles?\b/g, (m, n) => (I18N.lang.units === "m" ? `${I18N.num(+n.replace(",", "") * 1.5)} km` : `${n} ${n === "1" ? "Meile" : "Meilen"}`));
  const len = (n) => I18N.len(+n);
  const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);

  // Nominalphrasen in Ziel/Effekt: „one living creature“ → „Eine lebende Kreatur“, „object touched“ →
  // „Berührter Gegenstand“. Nomen mit Geschlecht und Mehrzahl, Adjektive als Stamm (starke Endung).
  const NOUN = {
    creature: ["f", "Kreatur", "Kreaturen"], object: ["m", "Gegenstand", "Gegenstände"], item: ["m", "Gegenstand", "Gegenstände"], weapon: ["f", "Waffe", "Waffen"],
    animal: ["n", "Tier", "Tiere"], plant: ["f", "Pflanze", "Pflanzen"], humanoid: ["m", "Humanoider", "Humanoide"], corpse: ["m", "Leichnam", "Leichname"],
    ally: ["m", "Verbündeter", "Verbündete"], construct: ["n", "Konstrukt", "Konstrukte"], outsider: ["m", "Externar", "Externare"], vermin: ["n", "Ungeziefer", "Ungeziefer"],
    undead: ["m", "Untoter", "Untote"], being: ["n", "Wesen", "Wesen"], person: ["f", "Person", "Personen"], symbol: ["n", "Symbol", "Symbole"], sensor: ["m", "Sensor", "Sensoren"],
    ray: ["m", "Strahl", "Strahlen"], door: ["f", "Tür", "Türen"], portal: ["n", "Portal", "Portale"], shield: ["m", "Schild", "Schilde"], armor: ["f", "Rüstung", "Rüstungen"],
    container: ["m", "Behälter", "Behälter"], body: ["m", "Körper", "Körper"], skeleton: ["n", "Skelett", "Skelette"], zombie: ["m", "Zombie", "Zombies"], golem: ["m", "Golem", "Golems"],
    elemental: ["m", "Elementar", "Elementare"], dragon: ["m", "Drache", "Drachen"], swarm: ["m", "Schwarm", "Schwärme"], cloud: ["f", "Wolke", "Wolken"], wall: ["f", "Wand", "Wände"],
    sphere: ["f", "Kugel", "Kugeln"], duplicate: ["n", "Duplikat", "Duplikate"], image: ["n", "Abbild", "Abbilder"], illusion: ["f", "Illusion", "Illusionen"], figment: ["n", "Trugbild", "Trugbilder"],
    hand: ["f", "Hand", "Hände"], structure: ["n", "Bauwerk", "Bauwerke"], hole: ["n", "Loch", "Löcher"], building: ["n", "Gebäude", "Gebäude"], sword: ["n", "Schwert", "Schwerter"],
    giant: ["m", "Riese", "Riesen"], genie: ["m", "Dschinn", "Dschinn"], eye: ["n", "Auge", "Augen"], flame: ["f", "Flamme", "Flammen"], arrow: ["m", "Pfeil", "Pfeile"], projectile: ["n", "Geschoss", "Geschosse"], missile: ["n", "Geschoss", "Geschosse"], bolt: ["m", "Bolzen", "Bolzen"],
    ammunition: ["f", "Munition", "Munition"], rope: ["n", "Seil", "Seile"], stone: ["m", "Stein", "Steine"], tree: ["m", "Baum", "Bäume"], fey: ["n", "Feenwesen", "Feenwesen"],
    familiar: ["m", "Vertrauter", "Vertraute"], army: ["f", "Armee", "Armeen"], circle: ["m", "Kreis", "Kreise"], spell: ["m", "Zauber", "Zauber"], servant: ["m", "Diener", "Diener"], mount: ["n", "Reittier", "Reittiere"], companion: ["m", "Gefährte", "Gefährten"], eidolon: ["n", "Eidolon", "Eidolons"], gem: ["m", "Edelstein", "Edelsteine"],
    book: ["n", "Buch", "Bücher"], scroll: ["f", "Schriftrolle", "Schriftrollen"], potion: ["m", "Trank", "Tränke"], spellbook: ["n", "Zauberbuch", "Zauberbücher"], mind: ["m", "Geist", "Geister"],
    point: ["m", "Punkt", "Punkte"], square: ["n", "Feld", "Felder"], area: ["m", "Bereich", "Bereiche"], location: ["m", "Ort", "Orte"], target: ["n", "Ziel", "Ziele"], subject: ["m", "Betroffener", "Betroffene"],
    fire: ["n", "Feuer", "Feuer"], water: ["n", "Wasser", "Wasser"], light: ["n", "Licht", "Lichter"], fog: ["m", "Nebel", "Nebel"], mist: ["m", "Nebel", "Nebel"], tentacle: ["m", "Tentakel", "Tentakel"],
  };
  const ADJ = {
    touched: "berührt", living: "lebend", willing: "bereitwillig", dead: "tot", corporeal: "körperlich", incorporeal: "körperlos", humanoid: "humanoid", unattended: "unbeaufsichtigt",
    nonmagical: "nichtmagisch", magic: "magisch", magical: "magisch", summoned: "herbeigezaubert", allied: "verbündet", undead: "untot", evil: "bös", good: "gut", small: "klein", large: "groß",
    tiny: "winzig", huge: "riesig", unconscious: "bewusstlos", helpless: "hilflos", extraplanar: "extraplanar", mindless: "geistlos", intelligent: "intelligent", sentient: "intelligent",
    single: "einzeln", visible: "sichtbar", adjacent: "angrenzend", animated: "belebt", invisible: "unsichtbar", ranged: "Fernkampf-", melee: "Nahkampf-", touch: "Berührungs-", held: "gehalten", worn: "getragen",
    shadow: "schattenhaft", spectral: "geisterhaft", illusory: "illusionär", visual: "visuell", mobile: "beweglich", stationary: "unbeweglich", glowing: "leuchtend", flying: "fliegend",
    other: "ander", additional: "zusätzlich", secondary: "sekundär", duplicate: "doppelt", immobile: "unbeweglich", spherical: "kugelförmig", wooden: "hölzern", metal: "metallen", stone: "steinern", natural: "natürlich", manufactured: "hergestellt", enemy: "feindlich", hostile: "feindselig", fallen: "gefallen", petrified: "versteinert",
  };
  const NOUN2 = {
    "animal companion": ["m", "Tiergefährte", "Tiergefährten"], "spell effect": ["m", "Zaubereffekt", "Zaubereffekte"], "fiendish servant": ["m", "Scheusaldiener", "Scheusaldiener"],
    "magic item": ["m", "magischer Gegenstand", "magische Gegenstände"], "spell effect or magic item": null, "insect spy": ["m", "Insektenspion", "Insektenspione"],
    "summoned creature": ["f", "herbeigezauberte Kreatur", "herbeigezauberte Kreaturen"],
  };
  const NUM = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  const END = { m: "er", f: "e", n: "es", pl: "e" };
  const ART = { m: "Ein", f: "Eine", n: "Ein" };
  const POSS = { m: "Dein", f: "Deine", n: "Dein", pl: "Deine" };
  function nounPhrase(seg, first) {
    const m = seg.match(/^(?:(one or more|one|a|an|1|your|up to (?:one|1|\d+|\w+)|\d+|two|three|four|five|six|seven|eight|nine|ten|all) )?((?:[a-z-]+ )*?)([a-z]+)( touched)?((?:\/|\s*per\s*)(?:\d+ )?levels?)?$/);
    if (!m) return null;
    let [, q, adjs, noun, touched, perLevel] = m;
    let plural = false;
    let words = adjs.trim() ? adjs.trim().split(" ") : [];
    // zweiteilige Nomen („animal companion“)
    let n = null;
    const two = words.length ? `${words[words.length - 1]} ${noun}` : "";
    const two1 = two && (NOUN2[two] || NOUN2[two.replace(/s$/, "")]);
    if (two1) (n = two1), (plural = !NOUN2[two]), (words = words.slice(0, -1));
    if (!n) n = NOUN[noun];
    if (!n && /ies$/.test(noun)) (n = NOUN[noun.slice(0, -3) + "y"]), (plural = true);
    if (!n && /s$/.test(noun)) (n = NOUN[noun.slice(0, -1)]), (plural = true);
    if (!n) return null;
    if (touched) words.unshift("touched");
    if (!words.every((w) => ADJ[w])) return null;
    let head = "";
    let end;
    if (q && /^up to/.test(q)) { const k = q.slice(6); head = `bis zu ${k === "one" ? 1 : NUM[k] || k}`; plural = plural || !/^(one|1)$/.test(k); }
    else if (q === "one or more") (head = `${ART[n[0]]} oder mehrere`), (plural = true);
    else if (q === "all") (head = "alle"), (plural = true), (end = "en");
    else if (q === "your") head = POSS[plural ? "pl" : n[0]], plural && (end = "en");
    else if (q && (NUM[q] || /^\d+$/.test(q)) && q !== "1") (head = String(NUM[q] || q)), (plural = true);
    else if (q) head = ART[n[0]];
    const g = plural ? "pl" : n[0];
    end = end || END[g];
    const a = words.map((w) => (ADJ[w].endsWith("-") ? ADJ[w] : ADJ[w] + end));
    // „Nahkampf-“ + „Waffe“ → „Nahkampfwaffe“
    const out = [head, ...a, plural ? n[2] : n[1]].filter(Boolean).join(" ").replace(/- (\S)/g, (x, c) => c.toLowerCase());
    // vorn groß; mitten im Wert nur Artikel und Adjektive klein, Nomen bleiben groß
    return (first ? cap(out) : head || a.length ? out.charAt(0).toLowerCase() + out.slice(1) : out) + (perLevel ? (/\d/.test(perLevel) ? perLevel.replace(/levels?/, "Stufen").replace(/^\s*per\s*/, "/") : "/Stufe") : "");
  }

  // Teilstücke eines Werts (getrennt an „;“, „,“, „ or “, „ and “), jeweils von vorn verankert
  const SEG = [
    [/^no two of which (?:can|may) be more than (.+) apart$/i, "von denen keine zwei mehr als $1 voneinander entfernt sein dürfen"],
    // Zeitaufwand
    [/^1 standard action\b/i, "1 Standard-Aktion"], [/^standard action\b/i, "Standard-Aktion"], [/^1 swift action\b/i, "1 Schnelle Aktion"], [/^swift action\b/i, "Schnelle Aktion"],
    [/^1 immediate action\b/i, "1 Augenblickliche Aktion"], [/^immediate action\b/i, "Augenblickliche Aktion"], [/^1 full[- ]round action\b/i, "1 Volle Aktion"], [/^full[- ]round action\b/i, "Volle Aktion"], [/^1 move action\b/i, "1 Bewegungsaktion"],
    // Reichweite
    [/^personal\b/i, "Persönlich"], [/^touch\b/i, "Berührung"], [/^unlimited\b/i, "Unbegrenzt"], [/^anywhere within the area to be warded/i, "überall im zu schützenden Bereich"],
    [/^(close|short|medium|long)(?=\s*\u0001)/i, (m, k) => ({ close: "Nah", short: "Nah", medium: "Mittel", long: "Lang" })[k.toLowerCase()]], [/^see description\b/i, "siehe Beschreibung"],
    // Dauer
    [/^(?:instantaneous|instant|instantiations)\b/i, "Augenblicklich"], [/^(?:concentration|conecentration)\b/i, "Konzentration"], [/^1 battle\b/, "1 Kampf"], [/^permanent\b/i, "Permanent"], [/^concentration\b/i, "Konzentration"], [/^until discharged\b/i, "bis entladen"], [/^whichever comes first\b/i, "je nachdem, was zuerst eintritt"],
    [/^up to /i, "bis zu "], [/^at least /i, "mindestens "],
    // Rettungswurf, ZR
    [/^Will\b/, "Willen"], [/^Fortitude\b/, "Zähigkeit"], [/^Fort\b/, "Zähigkeit"], [/^Reflex\b/, "Reflex"], [/^none\b/i, "Keiner"], [/^no\b/i, "Nein"], [/^yes\b/i, "Ja"],
    [/^harmless\b/i, "harmlos"], [/^objects\b/, "Gegenstände"], [/^object\b/, "Gegenstand"], [/^(?:negates?|negated)\b/, "keine Wirkung"], [/^half\b/, "halbiert"], [/^partial\b/, "teilweise"], [/^varies\b/, "variabel"], [/^special\b/, "speziell"], [/^see text\b/i, "siehe Text"], [/^see below\b/i, "siehe unten"],
    // Ziele, Bereiche, Effekte
    [/^you\b/i, "Du"], [/^1 full round\b/i, "1 volle Runde"], [/^(\d+) full rounds\b/i, "$1 volle Runden"],

    [/^cone-shaped (spread|burst|emanation)/i, (m, k) => `kegelförmige ${{ spread: "Ausbreitung", burst: "Explosion", emanation: "Ausstrahlung" }[k.toLowerCase()]}`],
    [/^(one|\d+) (\d+)-ft\. cubes?/i, (m, q, n) => `${q === "one" || q === "1" ? "Ein Würfel" : q + " Würfel"} mit ${len(n)} Kantenlänge`],
    [/^(cloud|fog|mist|smoke|vapor) spreads in (\d+)-ft\. radius/i, (m, k, n) => `${{ cloud: "Wolke", fog: "Nebel", mist: "Nebel", smoke: "Rauch", vapor: "Dampf" }[k.toLowerCase()]} mit ${len(n)} Radius`],
    [/^(\d+)-ft\.-diameter (\w+)/i, (m, n, w) => `${NOUN[w] ? NOUN[w][1] : w} mit ${len(n)} Durchmesser`],
    [/^cone\b/, "Kegel"], [/^cylinder\b/, "Zylinder"], [/^line\b/, "Linie"], [/^ray\b/, "Strahl"], [/^wall\b/, "Wand"],
  ];
  // überall im Wert
  const AREA = { spread: "Ausbreitung", burst: "Explosion", emanation: "Ausstrahlung", circle: "Kreis", line: "Linie", cone: "Kegel", sphere: "Kugel", cylinder: "Zylinder", square: "Quadrat", "spherical emanation": "kugelförmige Ausstrahlung" };
  const ANY = [
    [/\b(in|within) (?:a |an )?(\d+)-(?:ft\.|foot|feet)-radius (spherical emanation|spread|burst|emanation)\b/gi, (m, w, n, k) => `in einer ${AREA[k.toLowerCase()]} mit ${len(n)} Radius`],
    [/\b(?:a |an )?(\d+)-(?:ft\.|foot|feet)-radius (spherical emanation|spread|burst|emanation|circle|sphere|cylinder)\b/gi, (m, n, k) => `${AREA[k.toLowerCase()]} mit ${len(n)} Radius`],
    [/\b(?:a |an )?(\d+)-mile-radius (spread|burst|emanation|circle)\b/gi, (m, n, k) => `${AREA[k.toLowerCase()]} mit ${n} mile Radius`],
    [/\b(in|within) (?:a |an )?(\d+)-ft\. (spread|burst)\b/gi, (m, w, n, k) => `in einer ${AREA[k.toLowerCase()]} von ${len(n)}`],
    [/\b(?:a |an )?(\d+)-ft\. (line|cone|spread|burst)\b/gi, (m, n, k) => `${AREA[k.toLowerCase()]} von ${len(n)}`],
    [/\b(\d+)-(?:ft\.|foot) radius\b/gi, (m, n) => `${len(n)} Radius`], [/\b(\d+(?:,\d+)?) sq\. ?ft\./g, (m, n) => (I18N.lang.units === "m" ? `${I18N.num(Math.round(+n * 0.09 * 100) / 100)} m²` : `${n} Quadratfuß`)],
    [/\bHD\b/g, "TW"], [/\blbs?\.?(?=\s|$|\))/g, "Pfund"],
    [/\(D\)/g, "(A)"], [/\(S\)/g, "(F)"], [/\bsee text\b/gi, "siehe Text"], [/\bsee below\b/gi, "siehe unten"], [/\bif interacted with\b/g, "bei Interaktion"],
    [/\b(Willen|Zähigkeit|Reflex) (?:negates?|negated)\b/g, "$1, keine Wirkung"], [/\b(Willen|Zähigkeit|Reflex) (?:half|halves)\b/g, "$1, halbiert"], [/\b(Willen|Zähigkeit|Reflex) (?:partial|parital)\b/g, "$1, teilweise"],
    [/\b(Willen|Zähigkeit|Reflex) disbelie(?:f|ves?)\b/g, "$1, anzweifeln"], [/\bharmless\b/gi, "harmlos"],
    [/(\d*)d(\d+)\b/g, (m, n, d) => `${n}W${d}`], [/\(D(?=[;,\s(])/g, "(A"], [/\bmaximum\b/g, "maximal"], [/\bor less\b/g, "oder weniger"], [/\bless\b/g, "weniger"], [/\bbut\b/g, "aber"],
    [/\bper (\d) levels\b/g, "je $1 Stufen"], [/\/per level\b/g, "/Stufe"], [/(\S)\s+\/(Stufe|level)/g, "$1/$2"], [/\b(\d+)(day|round|hour|minute)\//g, "$1 $2/"], [/\/leve\b/g, "/Stufe"], [/\b1 min\.(?!\/)/g, "1 Min."], [/\bobjects?\b(?=\)|$)/g, "Gegenstand"],
    [/(\d+) rounds?\/level/gi, (m, n) => `${n} ${n === "1" ? "Runde" : "Runden"}/Stufe`], [/(\d+) min\.\/ ?level/gi, "$1 Min./Stufe"], [/(\d+) minutes?\/level/gi, (m, n) => `${n} ${n === "1" ? "Minute" : "Minuten"}/Stufe`],
    [/(\d+) hours?\/level/gi, (m, n) => `${n} ${n === "1" ? "Stunde" : "Stunden"}/Stufe`], [/(\d+) days?\/level/gi, (m, n) => `${n} ${n === "1" ? "Tag" : "Tage"}/Stufe`], [/(\d+) weeks?\/level/gi, (m, n) => `${n} ${n === "1" ? "Woche" : "Wochen"}/Stufe`],
    [/\/ ?level\b/g, "/Stufe"], [/\/(\d) levels\b/g, "/$1 Stufen"], [/\bper level\b/g, "pro Stufe"],
    [/\b1 round\b/gi, "1 Runde"], [/(\d+) rounds\b/gi, "$1 Runden"], [/\b1 minute\b/gi, "1 Minute"], [/(\d+) minutes\b/gi, "$1 Minuten"], [/\b1 hour\b/gi, "1 Stunde"], [/(\d+) hours\b/gi, "$1 Stunden"],
    [/\b1 day\b/gi, "1 Tag"], [/(\d+) days\b/gi, "$1 Tage"], [/\b1 week\b/gi, "1 Woche"], [/(\d+) weeks\b/gi, "$1 Wochen"], [/\b1 month\b/gi, "1 Monat"], [/(\d+) months\b/gi, "$1 Monate"], [/\b1 year\b/gi, "1 Jahr"], [/(\d+) years\b/gi, "$1 Jahre"],
    [/\blevels?\b/gi, "Stufe"], [/ centered on you\b/g, " mit dir als Mittelpunkt"], [/ centered on a point in space\b/g, " um einen Punkt im Raum"], [/ centered on (?:a|the) (?:touched )?creature\b/g, " um eine Kreatur"],
    [/ from touched creature\b/g, " ausgehend von der berührten Kreatur"], [/ from you\b/g, " von dir ausgehend"], [/ (?:in|within) range\b/g, " in Reichweite"], [/ of your choice\b/g, " deiner Wahl"],
    [/(\d+(?:,\d+)?)[- ]?ft\.?-by-/g, "$1 ft. × "], [/(ft\.?|feet)\s*(?:\+|plus)\s*(\d)/g, "$1 + $2"],
    [/\b(\d+(?:,\d+)?(?:[- ]?(?:ft\.?|feet|foot))?)(?:\/(\d )?(?:levels?|Stufen?))? (high|tall|deep|wide|thick|long)\b/g, (m, n, l, k) => `${n}${m.includes("/") ? "/" + (l ? l.trim() + " Stufen" : "Stufe") : ""} ${{ high: "hoch", tall: "hoch", deep: "tief", wide: "breit", thick: "dick", long: "lang" }[k]}`],
    [/\b(\d+(?:,\d+)?(?:[- ]?(?:ft\.?|feet|foot))?) radius\b/g, "$1 Radius"],
    [/\b(\d+)-ft\.-square (\w+)/g, (m, n, w) => `${NOUN[w] ? NOUN[w][1] : w} (${len(n)} × ${len(n)})`],
    [/\b(?:(one|two|three|four|up to two|\d+) )?(\d+)-ft\. (cubes?|squares?)\b/g, (m, q, n, k) => `${q ? ({ one: "1", two: "2", three: "3", four: "4", "up to two": "bis zu 2" }[q] || q) + " " : ""}${/^cube/.test(k) ? "Würfel" : /s$/.test(k) ? "Felder" : "Feld"} mit ${len(n)} Kantenlänge`],
    [/^(\d+)-ft\. (\w+)$/, (m, n, w) => (NOUN[w] ? `${NOUN[w][1]} von ${len(n)}` : m)], [/\bor more\b/g, "oder mehr"], [/\bper page\b/g, "pro Seite"],
  ];
  const JOIN = { or: " oder ", and: " und " };
  function term(v, inner) {
    if (!v) return v;
    // freie Werte aus der Tabelle (data/lang/rules-terms.de.js), sonst Regeln
    const tab = window.RULES_TERMS_DE && window.RULES_TERMS_DE[String(v).trim()];
    if (tab != null) return ft(cap(tab));
    // Klammern schützen, Inneres eigens übersetzen
    const par = [];
    let s = String(v).replace(/\(([^()]*)\)/g, (m, x) => (par.push(x), `\u0001${par.length - 1}\u0002`)).replace(/\bone or more\b/g, "one\u0003more")
      .replace(/\s+(?:in|within) (?:a |an )?\d+-(?:ft\.|foot|feet)-radius (?:spherical emanation|spread|burst|emanation)(?: centered on you)?/g, (m) => (par.push("\u0006" + m.trim()), `\u0001${par.length - 1}\u0002`)).replace(/^(\w+) or (\w+) touched$/, "$1 touched or $2 touched");
    const parts = s.split(/(\s*;\s*|\s*,?\s+then\s+|\s*,\s*|\s+or\s+|\s+and\s+)/);
    const SAVE = /^(Will|Fortitude|Fort|Reflex|none)\b/i;
    let art = false; // vorige Nominalphrase mit Artikel → bloßes Nomen danach bekommt auch einen
    s = parts.map((p, i) => {
      if (i % 2) {
        const k = p.trim();
        if (/then$/.test(k)) return ", danach ";
        // mehrere Rettungswürfe: mit Semikolon trennen, damit „Willen, keine Wirkung“ zusammenbleibt
        if (k === "," && SAVE.test(parts[i - 1].trim()) && SAVE.test((parts[i + 1] || "").trim())) return "; ";
        return JOIN[k] || (k === ";" ? "; " : ", ");
      }
      const lead = p.match(/^\s*/)[0];
      let x = p.trim().replace(/\u0003/g, " or ");
      // „weapon or ammunition touched“: „touched“ gilt für beide; „touched creature or object“ ebenso
      const sepNext = (parts[i + 1] || "").trim(), next = (parts[i + 2] || "").trim();
      if ((sepNext === "or" || sepNext === "and") && / touched$/.test(next) && !/ touched$/.test(x) && /^[a-z ]+$/.test(x) && NOUN[x.split(" ").pop().replace(/s$/, "")]) x += " touched";
      const sepPrev = (parts[i - 1] || "").trim(), prev = (parts[i - 2] || "").trim();
      if ((sepPrev === "or" || sepPrev === "and") && /^touched /.test(prev) && /^[a-z]+$/.test(x)) x = "touched " + x;
      const bare = x.replace(/\s*\u0001\d+\u0002\s*$/, "");
      let np = nounPhrase(bare, i === 0 && !inner);
      const lastN = NOUN[bare.split(" ").pop()];
      if (np && i > 0 && art && lastN && /^[a-z ]+$/.test(bare) && !/^(one|a|an|1|your|all|up|two|three|four|five|six|\d)/.test(bare)) np = ART[lastN[0]].toLowerCase() + " " + np;
      art = !!np && /^(one|a|an|1) /.test(bare);
      if (np) x = np + (x.match(/\s*\u0001\d+\u0002\s*$/) || [""])[0];
      else {
        for (const [re, rp] of SEG) if (re.test(x)) { x = x.replace(re, rp); break; }
        // mitten im Wert klein: „oder augenblicklich“, „und permanent“
        if (i > 0) x = x.replace(/^(Augenblicklich|Permanent|Unbegrenzt)\b/, (w) => w.toLowerCase());
      }
      return lead + x;
    }).join("");
    for (const [re, rep] of ANY) s = s.replace(re, rep);
    s = s.replace(/\s*\u0001(\d+)\u0002/g, (m, i) => (par[+i].startsWith("\u0006") ? " " + term(par[+i].slice(1), true) : `${m.match(/^\s*/)[0]}(${term(par[+i], true)})`));
    for (const [re, rep] of ANY) s = s.replace(re, rep);
    return ft(s);
  }
  // Komponenten: Kürzel deutsch, Material/Fokus mit deutschen Stoffwörtern und englischem Freitext in Anführungszeichen
  function compDe(c) {
    const nounsOf = (x) => {
      const out = [];
      let rest = x.toLowerCase();
      for (const [re0, de] of (window.THEORY && THEORY.MATERIAL_NOUNS) || []) {
        // für die Anzeige nur ganze Wörter („scale“ ist kein „ale“) und keine Sammelwörter
        const re = new RegExp(`\\b(?:${re0.source.replace(/\\b/g, "")})(?:s|es)?\\b`, "g");
        if (de === "Werkzeug" || !re.test(rest)) continue;
        rest = rest.replace(re, " ");
        if (!out.includes(de)) out.push(de);
      }
      return out;
    };
    const gp = (x) => { const m = x.match(/([\d,]+)\s*gp\b/); return m ? `${m[1].replace(/,/g, ".")} GM` : ""; };
    // Material ohne Klammer („V, S, powdered skymetal worth 10,000 gp“) → „M („…“)“
    c = String(c || "").replace(/^((?:(?:V|S|M|F|DF)(?:\/(?:F|DF|M))?, )+)([a-z][^()]*)$/, "$1M ($2)");
    return c.replace(/\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (m, x) => {
      if (/^\s*see text\s*$/i.test(x)) return "(siehe Text)";
      const de = [...nounsOf(x), gp(x)].filter(Boolean);
      return `(${de.length ? de.join(", ") + " – " : ""}„${x}“)`;
    }).replace(/ or (?![^„]*“)/g, " oder ").replace(/\bS\b(?![^„]*“)/g, "G").replace(/\bDF\b(?![^„]*“)/g, "GF").replace(/\bsee text\b/g, "siehe Text");
  }
  const schoolDe = (s) => (SCHOOL[s.school] || s.school) + ((s.subschool || []).length ? ` (${s.subschool.map((x) => SUB[x] || x).join(", ")})` : "") + ((s.descriptors || []).length ? ` [${s.descriptors.map((x) => DESC[x.toLowerCase()] || x).join(", ")}]` : "");
  const levelsDe = (lv) => Object.entries(lv).map(([k, v]) => `${CLASS[k] || k} ${v}`).join(", ");

  // --- Name --------------------------------------------------------------------------------
  // Name in der Regelsprache; other(): der andere Name, falls er abweicht
  function name(x) {
    const s = spellOf(x);
    if (!s) return "";
    if (s.everyday) return !de() && s.en ? s.en.name : s.name;
    const d = data(s);
    return d ? d.name : s.name;
  }
  function other(x) {
    const s = spellOf(x);
    if (s && s.everyday) return de() ? (s.en ? s.en.name : "") : s.en ? s.name : "";
    const n = name(s);
    return n !== s.name ? s.name : "";
  }
  const baseName = (s) => { const b = baseOf(s); return b ? name(b) : s.base; };

  // --- Werte -------------------------------------------------------------------------------
  const L = {
    de: { school: "Schule", level: "Grad", base: "Basiszauber", casting_time: "Zeitaufwand", components: "Komponenten", range: "Reichweite", area: "Wirkungsbereich", target: "Ziel", effect: "Effekt", duration: "Wirkungsdauer", saving_throw: "Rettungswurf", spell_resistance: "Zauberresistenz", everyday: "Alltagszauber (Grad 0)" },
    en: { school: "School", level: "Level", base: "Base spell", casting_time: "Casting Time", components: "Components", range: "Range", area: "Area", target: "Target", effect: "Effect", duration: "Duration", saving_throw: "Saving Throw", spell_resistance: "Spell Resistance", everyday: "Everyday spell (level 0)" },
  };
  const DE_FIELD = { casting_time: "Zeitaufwand", components: "Komponenten", range: "Reichweite", target: "Ziel", area: "Wirkungsbereich", effect: "Effekt", duration: "Wirkungsdauer", saving_throw: "Rettungswurf", spell_resistance: "Zauberresistenz" };
  const ORDER = ["casting_time", "components", "range", "area", "target", "effect", "duration", "saving_throw", "spell_resistance"];
  const deValue = (k, v) => (k === "components" ? compDe(v) : term(v));

  // Liste [Bezeichnung, Wert] in der Regelsprache
  function fields(x) {
    const s = spellOf(x);
    const l = de() ? L.de : L.en;
    const out = [];
    if (!de()) {
      out.push([l.school, s.school_raw]);
      if (s.everyday) out.push([l.level, l.everyday], [l.base, s.base + " – " + Object.entries(s.baseLevels).map(([k, v]) => k + " " + v).join(", ")]);
      else out.push([l.level, Object.entries(s.levels).map(([k, v]) => k + " " + v).join(", ")]);
      for (const k of ORDER) out.push([l[k], s[k]]);
      return out.filter(([, v]) => v);
    }
    const d = data(s);
    if (d) {
      // deutsche Regeldaten: Felder in der Reihenfolge der Quelle
      out.push([l.school, d.fields.Schule], [l.level, d.fields.Grad]);
      for (const [k, v] of Object.entries(d.fields)) if (k !== "Schule" && k !== "Grad") out.push([k, v]);
      return out.filter(([, v]) => v);
    }
    if (s.everyday) {
      // Alltagszauber: eigene Werte übersetzt, geerbte aus den deutschen Daten des Basiszaubers
      const b = baseOf(s);
      const bd = b && data(b);
      out.push([l.school, schoolDe(s)], [l.level, l.everyday], [l.base, `${baseName(s)} – ${bd ? bd.fields.Grad : levelsDe(s.baseLevels)}`]);
      const own = new Set(s.ownFields || []);
      for (const k of ORDER) {
        const v = !own.has(k) && bd && bd.fields[DE_FIELD[k]] != null ? bd.fields[DE_FIELD[k]] : s[k] ? deValue(k, s[k]) : "";
        out.push([l[k], v]);
      }
      return out.filter(([, v]) => v);
    }
    out.push([l.school, schoolDe(s)], [l.level, levelsDe(s.levels)]);
    for (const k of ORDER) out.push([l[k], s[k] ? deValue(k, s[k]) : ""]);
    return out.filter(([, v]) => v);
  }

  // Regeltext (Absätze durch Leerzeilen getrennt) und ob er in der Regelsprache vorliegt
  function text(x) {
    const s = spellOf(x);
    const d = data(s);
    if (d) return { text: d.text, lang: "de" };
    if (s.everyday && !de() && s.en) return { text: s.en.description, lang: "en" };
    return { text: s.description || "", lang: s.everyday ? "de" : "en" };
  }

  // Quelle: deutsche Fundstelle (Kürzel und Seite) und englische
  function source(x) {
    const s = spellOf(x);
    const d = data(s);
    return { de: d ? d.source : "", en: s.source || "" };
  }

  // --- Domänen ------------------------------------------------------------------------------
  // Gottheiten führen englische Domänen und Unterdomänen („Demon (Chaos)“). Deutsch: aus den
  // Domänendaten (data/domains.de.js → window.DOMAINS_DE, tools/import-domains-de.mjs),
  // sonst die Domänen als allgemeine Begriffe; Unterdomänen ohne Daten bleiben englisch.
  const DOMAIN = { Air: "Luft", Animal: "Tiere", Animals: "Tiere", Artifice: "Handwerk", Chaos: "Chaos", Charm: "Verzauberung", Community: "Gemeinschaft", Darkness: "Dunkelheit", Death: "Tod", Destruction: "Zerstörung", Earth: "Erde", Evil: "Böses", Fire: "Feuer", Glory: "Herrlichkeit", Good: "Gutes", Healing: "Heilung", Knowledge: "Wissen", Law: "Ordnung", Liberation: "Befreiung", Luck: "Glück", Madness: "Wahnsinn", Magic: "Magie", Nobility: "Adel", Plant: "Pflanzen", Protection: "Schutz", Repose: "Ruhe", Rune: "Runen", Scalykind: "Schuppenartige", Strength: "Stärke", Sun: "Sonne", Travel: "Reisen", Trickery: "Tricks", Void: "Leere", War: "Krieg", Water: "Wasser", Weather: "Wetter" };
  const domainData = (en) => (de() && window.DOMAINS_DE ? window.DOMAINS_DE[en] || window.DOMAINS_DE[String(en).replace(/\s*\(.*\)$/, "")] || null : null);
  function domain(en) {
    if (!de() || !en) return en;
    const d = domainData(en);
    if (d) {
      // Klammer der englischen Fassung („Demon (Chaos)“) übernehmen, wenn der deutsche Name keine hat
      const par = String(en).match(/\((.+)\)$/);
      return par && !/\(/.test(d.name) ? `${d.name} (${DOMAIN[par[1]] || par[1]})` : d.name;
    }
    return DOMAIN[en] || en;
  }

  // gibt es deutsche Regeldaten überhaupt (für Hinweise)?
  const hasData = () => !!window.RULES_DE;
  const covered = (x) => !!data(spellOf(x));

  window.RULES = { name, other, fields, text, source, term, hasData, covered, de, domain, domainData };
})();

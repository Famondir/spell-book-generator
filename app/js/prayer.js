// Englische Fassung (Buchsprache en): eigene Wortwahl und Ziehfolge in textsEn/voiceEn; die deutschen Pfade bleiben unberührt.
// Gebete für göttliche Klassen: „Kanon der Kirche“ aus Gottheit und Zauberanalyse, deterministisch.
// Ton nach Gesinnung: rechtschaffen = Litanei mit Kehrvers, neutral = schlichte Bitte, chaotisch = freie Anrufung;
// gut = Schutz, Licht, Erbarmen; böse = Macht, Unterwerfung. Keine Texte von Paizo – nur beschreibende Angaben.
window.PRAYER = (function () {
  const T = window.THEORY;

  // Deutsche Beinamen (ohne Artikel, für die Anrede); sonst bleibt der Name allein
  const EPITHET = {
    "The Inheritor": "Erbin des Lichts", "Father of Creation": "Vater der Schöpfung", "The Forge-Fire": "Schmiedefeuer",
    "Master of the First Vault": "Hüter des Ersten Gewölbes", "The Dawnflower": "Morgenblume", "The Lady of Graves": "Herrin der Gräber",
    "The Eternal Rose": "Ewige Rose", "Song of the Spheres": "Lied der Sphären", "The Old Deadeye": "Alter Scharfblick",
    "The Drunken Hero": "Trunkener Held", "The Lord in Iron": "Herr in Eisen", "The All-Seeing Eye": "Allsehendes Auge",
    "Master of Masters": "Meister der Meister", "The Wind and the Waves": "Wind und Welle", "The Rough Beast": "Ungeheuer der Tiefe",
    "Prince of Darkness": "Fürst der Finsternis", "The Midnight Lord": "Herr der Mitternacht", "Mother of Monsters": "Mutter der Ungeheuer",
    "The Pallid Princess": "Bleiche Fürstin", "The Savored Sting": "Süßer Stachel", "General of Vengeance": "Feldherr der Vergeltung",
  };
  const DOMAIN = {
    Air: "Luft", Animal: "Tiere", Artifice: "Handwerk", Chaos: "Wandel", Charm: "Anmut", Community: "Gemeinschaft", Darkness: "Dunkel",
    Death: "Tod", Destruction: "Zerstörung", Earth: "Erde", Evil: "Bosheit", Fire: "Feuer", Glory: "Ruhm", Good: "Güte", Healing: "Heilung",
    Knowledge: "Wissen", Law: "Gesetz", Liberation: "Freiheit", Luck: "Glück", Madness: "Wahn", Magic: "Magie", Nobility: "Adel",
    Plant: "Wachstum", Protection: "Schutz", Repose: "Ruhe", Rune: "Runen", Scalykind: "Schuppenvolk", Strength: "Stärke", Sun: "Sonne",
    Travel: "Reise", Trickery: "List", Void: "Leere", War: "Krieg", Water: "Wasser", Weather: "Wetter",
  };
  const AREA = {
    honor: "Ehre", justice: "Gerechtigkeit", rulership: "Herrschaft", valor: "Tapferkeit", forges: "Schmieden", protection: "Schutz",
    strategy: "Bedacht", fire: "Feuer", tradition: "Überlieferung", war: "Krieg", cities: "Städte", law: "Gesetz", laws: "Gesetze",
    merchants: "Handel", wealth: "Wohlstand", sun: "Sonne", redemption: "Erlösung", honesty: "Aufrichtigkeit", healing: "Heilung",
    death: "Tod", fate: "Schicksal", birth: "Geburt", prophecy: "Weissagung", destruction: "Zerstörung", disaster: "Unheil", wrath: "Zorn",
    vengeance: "Vergeltung", chivalry: "Ritterlichkeit", duty: "Pflicht", mercy: "Gnade", hope: "Hoffnung", courage: "Mut", truth: "Wahrheit",
    light: "Licht", strength: "Stärke", battle: "Kampf", family: "Sippe", community: "Gemeinschaft", hunting: "Jagd", farming: "Ackerbau",
    knowledge: "Wissen", magic: "Magie", freedom: "Freiheit", beauty: "Schönheit", art: "Kunst", love: "Liebe", music: "Musik",
    tyranny: "Gewaltherrschaft", slavery: "Knechtschaft", contracts: "Verträge", pride: "Stolz", execution: "Richtschwert",
    judgment: "Urteil", responsibility: "Verantwortung", self: "Selbstzucht", perfection: "Vollkommenheit", history: "Geschichte",
  };
  const WEAPON = {
    longsword: "mein Langschwert", warhammer: "mein Kriegshammer", greataxe: "meine Axt", battleaxe: "meine Axt", "light crossbow": "meine Armbrust",
    scimitar: "mein Krummsäbel", dagger: "mein Dolch", longbow: "mein Bogen", morningstar: "mein Morgenstern", "heavy mace": "mein Streitkolben",
    "light mace": "mein Streitkolben", spear: "mein Speer", trident: "mein Dreizack", quarterstaff: "mein Stab", scythe: "meine Sense",
    rapier: "mein Rapier", "unarmed strike": "meine Faust", greatsword: "mein Zweihänder", flail: "mein Flegel", "heavy flail": "mein Flegel",
    whip: "meine Peitsche", glaive: "meine Glefe", halberd: "meine Hellebarde", lance: "meine Lanze", falchion: "mein Falchion",
    "bastard sword": "mein Anderthalbhänder", shortsword: "mein Kurzschwert", sickle: "meine Sichel", club: "meine Keule",
  };
  const MOTIF_DE = { sword: "das Schwert", sun: "die Sonne", hammer: "der Hammer", anvil: "der Amboss", flame: "die Flamme", shield: "der Schild", scales: "die Waage", eye: "das Auge", star: "der Stern", crown: "die Krone", moon: "der Mond", key: "der Schlüssel", tree: "der Baum", feather: "die Feder", rose: "die Rose" };
  const bare = (x) => x.replace(/^(der|die|das) /, "");

  // Titel: Gabe nach Schule + Genitiv der Hauptessenz („Schutz des Lichts“)
  const GIFT = {
    abjuration: ["Schutz", "Schild", "Wehr", "Mauer", "Siegel"], conjuration: ["Gabe", "Ruf", "Sendung", "Quelle", "Bote"],
    divination: ["Einsicht", "Schau", "Wink", "Spur", "Zeugnis"], enchantment: ["Zuspruch", "Bann", "Mahnung", "Eid", "Fessel"],
    evocation: ["Macht", "Schlag", "Glut", "Sturm", "Urteil"], illusion: ["Schleier", "Trugbild", "Hülle", "Spiegel", "Nebel"],
    necromancy: ["Wacht", "Schwelle", "Ruhe", "Totenwache", "Heimkehr"], transmutation: ["Wandlung", "Stärkung", "Weihe", "Härtung", "Gestalt"],
    universal: ["Segen", "Gnade", "Wille", "Wort", "Zeichen"],
  };
  // Thema aus dem Zaubernamen (englisch) → deutscher Nachsatz des Titels („Weihe der Waffe“).
  // Erstes Stichwort im Namen gewinnt; ohne Treffer trägt eine Essenz den Titel.
  const THEME = [
    [/weapon/, "der Waffe"], [/blade|sword|edge/, "der Klinge"], [/fist|hand|palm/, "der Faust"], [/shield|aegis/, "des Schildes"],
    [/armou?r|vestment|mail/, "des Harnischs"], [/arrow|bolt|missile/, "des Pfeils"], [/lance|spear/, "der Lanze"], [/hammer/, "des Hammers"],
    [/light|radian|brigh|glow|shin/, "des Lichts"], [/sun|dawn|day\b/, "der Sonne"], [/fire|flame|burn|sear/, "des Feuers"],
    [/cure|heal|mend|wound/, "der Heilung"], [/restor|renew|refresh/, "der Erneuerung"], [/life|vigor|vital/, "des Lebens"],
    [/death|dead|grave|corpse/, "der Toten"], [/undead|ghost|spirit/, "wider die Untoten"], [/evil|fiend|demon|devil|abomination/, "wider das Böse"],
    [/poison|venom/, "wider das Gift"], [/disease|plague|addiction/, "wider die Seuche"], [/curse|hex/, "wider den Fluch"], [/fear|dread|terror/, "wider die Furcht"],
    [/truth|honest|lie/, "der Wahrheit"], [/courage|valor|brave|hero/, "des Mutes"], [/honor|oath|vow|pledge/, "des Eides"], [/justice|judg|law|verdict/, "des Gerichts"],
    [/smite|strike|blow|punish/, "des Streiches"], [/mount|steed|horse|ride/, "des Rosses"], [/companion|ally|friend|bond/, "des Gefährten"],
    [/aura|halo/, "des Glanzes"], [/ward|protect|guard|sanctuar/, "der Wacht"], [/resist|endur|stalwart/, "der Standhaftigkeit"],
    [/water|rain|river/, "des Wassers"], [/bless|holy|sacred|sanct|divine|grace|favor/, "der Gnade"], [/word|command|speech|tongue|voice/, "des Wortes"],
    [/litany|prayer|hymn|chant|song/, "der Litanei"], [/mind|thought|dream/, "des Geistes"], [/soul|heart/, "der Seele"], [/eye|sight|see|vision|detect|discern/, "des Blicks"],
    [/path|road|way|travel|step/, "des Weges"], [/speed|swift|haste|fleet/, "der Eile"], [/strength|bull|might|power/, "der Stärke"], [/wing|fly|feather/, "der Schwingen"],
    [/stone|earth|iron|metal/, "des Eisens"], [/bed|rest|sleep|calm/, "der Rast"], [/food|feast|meal|nourish/, "des Mahls"], [/beast|animal|creature/, "der Tiere"],
    [/chain|bind|hold|paralyz/, "der Fessel"], [/gate|door|portal|wall/, "der Pforte"], [/break|shatter|sunder/, "des Bruchs"], [/crown|king|lord|noble/, "der Krone"],
    [/tactic|battle|war|martial|crusad/, "der Schlacht"], [/martyr|sacrific|bargain/, "des Opfers"], [/watch|vigil|sentinel/, "der Wache"], [/companion/, "des Gefährten"],
  ];
  function theme(name) {
    const n = name.toLowerCase();
    let best = null;
    for (const [re, de] of THEME) {
      const i = n.search(re);
      if (i >= 0 && (!best || i < best.i)) best = { i, de };
    }
    return best && best.de;
  }

  // Bitten je Schule (E = „die Kraft der Flamme“ o. Ä., Z = Ziel)
  const PLEA = {
    abjuration: ["Stell dich zwischen uns und das Unrecht, {Z}.", "Halte fern, was schaden will, {Z}.", "Versiegle, was nicht berührt werden darf."],
    conjuration: ["Gib, was fehlt, und sende {E}.", "Ruf herbei, was dir dient, {Z}.", "Lass werden, was gebraucht wird."],
    divination: ["Öffne mir die Augen für das Verborgene.", "Zeig mir den Weg, den du siehst.", "Lass mich erkennen, was wahr ist."],
    enchantment: ["Leg deine Ruhe auf die Herzen, {Z}.", "Lenke die Herzen, die irren.", "Sprich durch mich, dass man höre."],
    evocation: ["Lass {E} hervorbrechen, {Z}.", "Entfessle {E}, {Z}.", "Mach mich zum Werkzeug deines Zorns."],
    illusion: ["Verhülle, was nicht gesehen werden soll.", "Breite einen Schleier aus, {Z}.", "Täusche das Auge des Feindes."],
    necromancy: ["Wache an der Schwelle zwischen Leben und Tod.", "Halte die Seele, wo sie hingehört.", "Gib zurück, was der Tod nicht haben soll."],
    transmutation: ["Mach stark, was schwach ist.", "Wandle, was wankt, in Festes.", "Lass {E} wirken, {Z}."],
    universal: ["Wirke durch mich, wie du willst.", "Lass deinen Willen geschehen, {Z}.", "Nimm meine Hände für dein Werk."],
  };
  const HEAL = ["Schließ die Wunden, {Z}.", "Gib zurück, was verloren war.", "Lass Leben fließen, wo es versiegt."];
  const TARGET = {
    self: "an mir", touch: "unter meiner Hand", ray: "vor meiner Klinge", line: "vor meiner Klinge", cone: "vor meinem Schild",
    burst: "über diesem Ort", spread: "über diesem Ort", emanation: "um mich her", sphere: "über diesem Ort", cylinder: "über diesem Ort",
    targets: "über denen, die du mir zeigst", object: "auf diesem Werk", wall: "als Mauer vor uns", cube: "über diesem Ort",
  };
  const DURATION = {
    rounds: "Halte mich, bis der Kampf entschieden ist.", minutes: "Halte mich, solange der Atem reicht.", hours: "Halte mich, bis die Wache endet.",
    days: "Halte mich bis zum nächsten Gebet.", permanent: "Was du gibst, bleibe für immer.", concentration: "Halte mich, solange ich an dich denke.",
  };


  // ---------------------------------------------------------------------------
  // ENGLISCH – eigene Pools (Stilnotiz: data/lang/README.md): feierlich, schlicht, rhythmisch; zweite Person zur Gottheit.
  // ---------------------------------------------------------------------------
  const EN = () => !!(window.I18N && I18N.lang.book === "en");
  const MOTIF_EN = { sword: "the sword", sun: "the sun", hammer: "the hammer", anvil: "the anvil", flame: "the flame", shield: "the shield", scales: "the scales", eye: "the eye", star: "the star", crown: "the crown", moon: "the moon", key: "the key", tree: "the tree", feather: "the feather", rose: "the rose" };
  const DOMAIN_EN = {
    Air: "the air", Animal: "the beasts", Artifice: "craft", Chaos: "change", Charm: "grace", Community: "the common hearth", Darkness: "darkness",
    Death: "death", Destruction: "ruin", Earth: "the earth", Evil: "wickedness", Fire: "fire", Glory: "glory", Good: "goodness", Healing: "healing",
    Knowledge: "knowledge", Law: "law", Liberation: "freedom", Luck: "fortune", Madness: "madness", Magic: "magic", Nobility: "nobility",
    Plant: "growing things", Protection: "shelter", Repose: "rest", Rune: "the runes", Scalykind: "the scaled folk", Strength: "strength", Sun: "the sun",
    Travel: "the road", Trickery: "cunning", Void: "the void", War: "war", Water: "the waters", Weather: "the weather",
  };
  // Zuständigkeiten: Schlüssel wie AREA; Werte britisch und als Gegenstand der Anrufung gesagt
  const AREA_EN = {
    honor: "honour", justice: "justice", rulership: "rulership", valor: "valour", forges: "the forges", protection: "shelter",
    strategy: "forethought", fire: "fire", tradition: "tradition", war: "war", cities: "the cities", law: "law", laws: "the laws",
    merchants: "trade", wealth: "wealth", sun: "the sun", redemption: "redemption", honesty: "honesty", healing: "healing",
    death: "death", fate: "fate", birth: "birth", prophecy: "prophecy", destruction: "ruin", disaster: "calamity", wrath: "wrath",
    vengeance: "vengeance", chivalry: "chivalry", duty: "duty", mercy: "mercy", hope: "hope", courage: "courage", truth: "truth",
    light: "light", strength: "strength", battle: "battle", family: "kinship", community: "the common hearth", hunting: "the hunt", farming: "the plough",
    knowledge: "knowledge", magic: "magic", freedom: "freedom", beauty: "beauty", art: "art", love: "love", music: "music",
    tyranny: "tyranny", slavery: "bondage", contracts: "the sworn bargain", pride: "pride", execution: "the headsman's blade",
    judgment: "judgement", responsibility: "responsibility", self: "self-mastery", perfection: "perfection", history: "remembrance",
  };
  const WEAPON_EN = { battleaxe: "axe", greataxe: "axe", "light crossbow": "crossbow", "heavy mace": "mace", "light mace": "mace", "unarmed strike": "fist", quarterstaff: "staff", "heavy flail": "flail" };
  // Titel: Gabe nach Schule + Nachsatz (Thema aus dem Zaubernamen oder Essenz)
  const GIFT_EN = {
    abjuration: ["Ward", "Shield", "Rampart", "Wall", "Seal"], conjuration: ["Gift", "Summons", "Sending", "Spring", "Herald"],
    divination: ["Insight", "Vision", "Sign", "Trail", "Witness"], enchantment: ["Counsel", "Binding", "Admonition", "Oath", "Fetter"],
    evocation: ["Might", "Stroke", "Ember", "Tempest", "Judgement"], illusion: ["Veil", "Phantom", "Cloak", "Mirror", "Mist"],
    necromancy: ["Vigil", "Threshold", "Rest", "Wake", "Homecoming"], transmutation: ["Change", "Strengthening", "Consecration", "Hardening", "Form"],
    universal: ["Blessing", "Mercy", "Will", "Word", "Sign"],
  };
  // Schlüssel = deutscher Nachsatz aus THEME
  const THEME_EN = {
    "der Waffe": "of the Weapon", "der Klinge": "of the Blade", "der Faust": "of the Fist", "des Schildes": "of the Shield", "des Harnischs": "of the Mail",
    "des Pfeils": "of the Arrow", "der Lanze": "of the Lance", "des Hammers": "of the Hammer", "des Lichts": "of the Light", "der Sonne": "of the Sun",
    "des Feuers": "of the Fire", "der Heilung": "of Healing", "der Erneuerung": "of Renewal", "des Lebens": "of Life", "der Toten": "of the Dead",
    "wider die Untoten": "against the Undead", "wider das Böse": "against Evil", "wider das Gift": "against Poison", "wider die Seuche": "against the Plague",
    "wider den Fluch": "against the Curse", "wider die Furcht": "against Fear", "der Wahrheit": "of Truth", "des Mutes": "of Courage", "des Eides": "of the Oath",
    "des Gerichts": "of Judgement", "des Streiches": "of the Blow", "des Rosses": "of the Steed", "des Gefährten": "of the Companion", "des Glanzes": "of Radiance",
    "der Wacht": "of the Ward", "der Standhaftigkeit": "of Fortitude", "des Wassers": "of the Water", "der Gnade": "of Grace", "des Wortes": "of the Word",
    "der Litanei": "of the Litany", "des Geistes": "of the Mind", "der Seele": "of the Soul", "des Blicks": "of the Sight", "des Weges": "of the Road",
    "der Eile": "of Haste", "der Stärke": "of Strength", "der Schwingen": "of Wings", "des Eisens": "of Iron", "der Rast": "of Rest", "des Mahls": "of the Feast",
    "der Tiere": "of the Beasts", "der Fessel": "of the Fetter", "der Pforte": "of the Gate", "des Bruchs": "of the Breaking", "der Krone": "of the Crown",
    "der Schlacht": "of the Battle", "des Opfers": "of Sacrifice", "der Wache": "of the Watch",
  };
  const PLEA_EN = {
    abjuration: ["Stand between us and the wrong, {Z}.", "Hold back what would do harm, {Z}.", "Seal what must not be touched."],
    conjuration: ["Give what is lacking, and send {E}.", "Call forth what serves you, {Z}.", "Let that come to be which is needed."],
    divination: ["Open my eyes to what is hidden.", "Show me the road you see.", "Let me know what is true."],
    enchantment: ["Lay your calm upon the hearts, {Z}.", "Steer the hearts that stray.", "Speak through me, that they may hear."],
    evocation: ["Let {E} break forth, {Z}.", "Unleash {E}, {Z}.", "Make me the tool of your wrath."],
    illusion: ["Veil what must not be seen.", "Spread a veil, {Z}.", "Deceive the eye of the enemy."],
    necromancy: ["Keep vigil at the threshold between life and death.", "Hold the soul where it belongs.", "Give back what death shall not have."],
    transmutation: ["Make strong what is weak.", "Turn what wavers into what stands.", "Let {E} work, {Z}."],
    universal: ["Work through me as you will.", "Let your will be done, {Z}.", "Take my hands for your work."],
  };
  const HEAL_EN = ["Close the wounds, {Z}.", "Give back what was lost.", "Let life flow where it has run dry."];
  const TARGET_EN = {
    self: "within me", touch: "under my hand", ray: "before my blade", line: "before my blade", cone: "before my shield",
    burst: "over this place", spread: "over this place", emanation: "about me", sphere: "over this place", cylinder: "over this place",
    targets: "upon those you show me", object: "upon this work", wall: "as a wall before us", cube: "over this place",
  };
  const DURATION_EN = {
    rounds: "Hold me until the fight is decided.", minutes: "Hold me as long as the breath lasts.", hours: "Hold me until the watch ends.",
    days: "Hold me until the next prayer.", permanent: "What you give, let it remain for ever.", concentration: "Hold me as long as I think of you.",
  };
  const wordsEn = (arr) => (arr.length > 1 ? arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1] : arr[0] || "");
  const titleCase = (t) => t.replace(/[A-Za-z']+/g, (w, i) => (i > 0 && /^(of|the|against)$/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)));
  // Zuständigkeiten englisch: Zuständigkeiten der Gottheit (bereinigt, übersetzbare zuerst), sonst Domänen
  function concernsEn(d) {
    const a = (d.areas || []).map((x) => String(x).toLowerCase().replace(/^and /, "")).map((x) => AREA_EN[x] || x).filter(Boolean);
    const dm = (d.domains || []).map((x) => DOMAIN_EN[x]).filter(Boolean);
    return [...new Set([...a, ...dm])];
  }
  function themeEn(name) {
    const de = theme(name);
    return de ? THEME_EN[de] || null : null;
  }
  function refrainEn(d) {
    const r = U.rng("refrain|en|" + d.id);
    const c = concerns(d);
    const pair = c.length >= 2 ? `${c[0]} and ${c[1]}` : c[0] || d.name;
    const P = U.cap(pair);
    const { law, good } = axes(d);
    const forms = good === "evil"
      ? [`${P} – so shall they be bent.`, `${P}: All kneel.`]
      : law === "law"
        ? [`${P} – so it is written.`, `${P}: So be it, and so let it remain.`, `For the sake of ${pair}: So be it.`]
        : [`${P} – so be it.`, `${d.name}, hear us.`];
    return r.pick(forms);
  }
  const callOfEn = (d) => `${d.name}${epithetEn(d) ? ", " + epithetEn(d) : ""},`;
  function praiseOfEn(d) {
    const c = concerns(d);
    const are = (xs) => `${U.cap(wordsEn(xs))} ${xs.length > 1 || /^the (rune|waters|beasts|cities|laws|forges)/.test(xs[0]) ? "are" : "is"} yours`;
    return c.length
      ? `${are(c.slice(0, 2))}${c.length > 2 ? `, and yours ${c.slice(2, 4).length > 1 ? "are" : "is"} ${wordsEn(c.slice(2, 4))}` : ""}.`
      : axes(d).good === "evil" ? "Yours is what bows." : "Yours is my service.";
  }
  const closeEn = (good, r, voice) => (good === "good"
    ? r.pick(voice ? ["Hold your hand over those entrusted to me.", "Let me forget no one who hopes in me.", "Give me mercy where I would be hard."] : ["Protect the weak through me.", "Let no one fall who hopes in you.", "Give me mercy where I would be hard."])
    : good === "evil"
      ? r.pick(voice ? ["Let me be strong where others hesitate.", "Give me power over what awaits me today.", "Bend whatever stands against me."] : ["Bend those who stand against me.", "Give me power over the hesitant.", "Let the weak feel to whom they belong."])
      : r.pick(["Keep the measure, even in me.", "Let happen what must happen.", "Give me calm for what follows."]));
  function textsEn(m, d) {
    d = d || window.DEITY || { id: "none", name: "Lord", align: "LG", areas: [], domains: [], symbol: "" };
    const r = U.rng(m.id + "|prayer|en|" + d.id);
    const { law, good } = axes(d);
    const school = GIFT_EN[m.school] ? m.school : "universal";
    const E = T.ESS[m.primary];
    const strong = m.essences.filter((x) => x.pct >= 20).map((x) => T.ESS[x.id]);
    const gen = themeEn(m.name) || r.pick(strong.length ? strong : [E]).en.gen;
    const stem = (w) => w.replace(/^(of the|of|against the|against) /, "").slice(0, 4).toLowerCase();
    const gifts = GIFT_EN[school].filter((g) => stem(g) !== stem(gen)); // kein „Change of Change“
    const title = titleCase(`${r.pick(gifts)} ${gen}`);
    const kraft = /force|power|might/.test(E.en.gen) ? "your power" : `the power ${E.en.gen}`;
    const ziel = TARGET_EN[m.shape && m.shape.kind] || "here";
    const fill = (x) => x.replace("{E}", kraft).replace("{Z}", ziel);
    const call = callOfEn(d);
    const praise = praiseOfEn(d);
    const pleas = r.sample((m.subschools || []).includes("healing") ? HEAL_EN : PLEA_EN[school], 2).map(fill);
    const dur = DURATION_EN[m.duration && m.duration.kind];
    const w = String(d.weapon || "").toLowerCase();
    const weapon = w ? "my " + (WEAPON_EN[w] || w) : "my weapon";
    const vow = good === "evil" ? `${U.cap(weapon)} belongs to you, and whoever falls is yours.` : `${U.cap(weapon)} belongs to you, and ${symbolDe(d)} stands before me.`;
    const close = closeEn(good, r, false);
    const ref = refrainEn(d);
    const two = dual(d, tone());
    let lines;
    if (law === "law") {
      lines = [{ t: call }, { t: praise }, ...(two ? [{ t: two, dual: true }] : []), { t: ref, r: true }, { t: pleas[0] }, { t: pleas[1] }, { t: ref, r: true }];
      if (dur) lines.push({ t: dur });
      lines.push({ t: vow }, { t: close }, { t: ref, r: true });
    } else if (law === "chaos") {
      const cry = r.pick(["Hear me!", "Now!", "Come!", "Burn in me!"]);
      lines = [{ t: call.replace(/,$/, "!") }, { t: praise.replace(/\.$/, "!") }, ...(two ? [{ t: two.replace(/\.$/, "!"), dual: true }] : []), { t: cry }, { t: pleas[0] }, { t: r.pick(["Yes!", "More!", "Here!"]) + " " + pleas[1] }, { t: vow }, { t: close }];
    } else {
      lines = [{ t: call }, { t: praise }, ...(two ? [{ t: two, dual: true }] : []), { t: pleas[0] }, ...(dur ? [{ t: dur }] : []), { t: vow }, { t: close }, { t: "So be it.", r: true }];
    }
    const sch = (m.schoolInfo && m.schoolInfo.en && m.schoolInfo.en.de) || (m.schoolInfo && m.schoolInfo.de) || "";
    return {
      title,
      epithet: `${sch} · ${E.latin}`,
      canon: { lines, refrain: ref, tone: (law === "law" ? "Litany" : law === "chaos" ? "Invocation" : "Petition") + (two ? " of Two Voices" : ""), dual: !!two },
      deity: d,
      custom: false,
    };
  }
  function voiceEn(d, seed) {
    d = d || { id: "none", name: "Lord", align: "N", areas: [], domains: [], symbol: "" };
    const r = U.rng(seed + "|voice|en|" + d.id);
    const { law, good } = axes(d);
    return {
      d, r, law, good,
      call: callOfEn(d),
      name: d.name,
      praise: praiseOfEn(d),
      dual: dual(d, tone()),
      refrain: refrainEn(d),
      close: closeEn(good, r, true),
      amen: law === "law" ? refrainEn(d) : law === "chaos" ? r.pick(["Hear me!", "So shall it burn!", "Now!"]) : "So be it.",
    };
  }

  const words = (arr) => (arr.length > 1 ? arr.slice(0, -1).join(", ") + " und " + arr[arr.length - 1] : arr[0] || "");
  const axes = (d) => {
    const a = String((d && d.align) || "N");
    const law = a[0] === "L" ? "law" : a[0] === "C" ? "chaos" : "neutral";
    const good = a.length === 2 ? (a[1] === "G" ? "good" : a[1] === "E" ? "evil" : "neutral") : "neutral";
    return { law, good };
  };
  // Zuständigkeiten auf Deutsch (übersetzbare zuerst), sonst Domänen
  function concerns(d) {
    if (EN()) return concernsEn(d);
    const a = (d.areas || []).map((x) => AREA[x.toLowerCase()]).filter(Boolean);
    const dm = (d.domains || []).map((x) => DOMAIN[x]).filter(Boolean);
    return [...new Set([...a, ...dm])];
  }
  // Englisch: das Buch zeigt den Titel der Gottheit selbst, daher keine zweite Zeile (der Anruf nimmt epithetEn)
  const epithet = (d) => (EN() ? "" : EPITHET[d.title] || "");
  const epithetEn = (d) => String(d.title || "").replace(/^The /, "the ");
  function symbolDe(d) {
    if (EN()) {
      const { front, back } = VITRAIL.symbolMotifs(d.symbol);
      if (front === "rosette") return "your sign";
      return "your sign, " + (back ? `${MOTIF_EN[front]} and ${MOTIF_EN[back]}` : MOTIF_EN[front]) + ",";
    }
    const { front, back } = VITRAIL.symbolMotifs(d.symbol);
    if (front === "rosette") return "dein Zeichen";
    return "dein Zeichen, " + (back ? `${bare(MOTIF_DE[front])} und ${bare(MOTIF_DE[back])}` : MOTIF_DE[front]) + ",";
  }

  // Zwiespalt: gegensätzliche Domänen oder Zuständigkeiten → ein Doppelvers, der beide Seiten anruft.
  // Zweite Person ohne Relativpronomen, damit das Geschlecht der Gottheit offen bleibt.
  const DUAL = [
    ["Destruction", "Protection", "Du zerbrichst, was nicht trägt", "du bewahrst, was trägt", "You break what does not hold", "you keep what holds"],
    ["Death", "Healing", "Du nimmst, was endet", "du gibst, was fehlt", "You take what ends", "you give what is lacking"],
    ["Law", "Chaos", "Du bindest, was frei sein will", "du löst, was gebunden ist", "You bind what would be free", "you loose what is bound"],
    ["Good", "Evil", "Du erbarmst dich", "du strafst ohne Erbarmen", "You show mercy", "you punish without mercy"],
    ["Darkness", "Sun", "Du verbirgst im Dunkel", "du enthüllst im Licht", "You hide in the dark", "you reveal in the light"],
    ["Knowledge", "Madness", "Du weißt alles", "und dein Wissen bricht den Verstand", "You know all things", "and your knowledge breaks the mind"],
    ["Fire", "Water", "Du entzündest", "du löschst", "You kindle", "you quench"],
  ];
  // tone: "" automatisch, "dual" erzwingen (ohne Paar: Geben und Nehmen), "plain" abschalten
  function dual(d, tone = "") {
    if (!d || tone === "plain") return null;
    const has = new Set([...(d.domains || []), ...(d.areas || []).map((a) => U.cap(String(a).toLowerCase()))]);
    const hit = DUAL.find(([a, b]) => has.has(a) && has.has(b));
    if (hit) return EN() ? `${hit[4]}, ${hit[5]}.` : `${hit[2]}, ${hit[3]}.`;
    return tone === "dual" ? (EN() ? "You give what you will, you take what you will." : "Du gibst, was du willst, du nimmst, was du willst.") : null;
  }
  // Heiliges Zeichen als deutscher Satzteil („der Schlüssel“, „das Auge und der Stern“) oder "" (unbekanntes Motiv)
  function symbolName(d) {
    if (!d || !d.symbol || !window.VITRAIL) return "";
    const { front, back } = VITRAIL.symbolMotifs(d.symbol);
    if (!MOTIF_DE[front]) return "";
    if (EN()) return back && MOTIF_EN[back] ? `${MOTIF_EN[front]} and ${MOTIF_EN[back]}` : MOTIF_EN[front];
    return back && MOTIF_DE[back] ? `${MOTIF_DE[front]} und ${MOTIF_DE[back]}` : MOTIF_DE[front];
  }
  const tone = () => ((window.PROFILE && PROFILE.devotion) || {}).tone || "";
  // Paar des Zwiespalts (z. B. ["Destruction","Protection"]) oder null; ohne tone gilt der Profilton.
  // Erzwungener Zwiespalt ohne gegensätzliche Domänen: ["Give","Take"].
  function dualPair(d, t = tone()) {
    if (!d || t === "plain") return null;
    const has = new Set([...(d.domains || []), ...(d.areas || []).map((a) => U.cap(String(a).toLowerCase()))]);
    const hit = DUAL.find(([a, b]) => has.has(a) && has.has(b));
    if (hit) return [hit[0], hit[1]];
    return t === "dual" ? ["Give", "Take"] : null;
  }

  // Kehrvers je Gottheit fest – wie in einer echten Liturgie
  function refrain(d) {
    if (EN()) return refrainEn(d);
    const r = U.rng("refrain|" + d.id);
    const c = concerns(d);
    const pair = c.length >= 2 ? `${c[0]} und ${c[1]}` : c[0] || d.name;
    const { law, good } = axes(d);
    const forms = good === "evil"
      ? [`${pair} – so soll es gebeugt werden.`, `${pair}: Alles kniet.`]
      : law === "law"
        ? [`${pair} – so steht es geschrieben.`, `${pair}: So sei es, und so bleibe es.`, `Um ${pair} willen: So sei es.`]
        : [`${pair} – so sei es.`, `${d.name}, höre uns.`];
    return r.pick(forms);
  }

  const callOf = (d) => EN() ? callOfEn(d) : `${d.name}${epithet(d) ? ", " + epithet(d) : ""},`;
  // Lob: Zuständigkeiten der Gottheit („Wissen und Magie sind dein.“)
  function praiseOf(d) {
    if (EN()) return praiseOfEn(d);
    const c = concerns(d);
    const sind = (xs) => `${words(xs)} ${xs.length > 1 ? "sind" : "ist"} dein`;
    return c.length
      ? `${sind(c.slice(0, 2))}${c.length > 2 ? `, und dein ${c.slice(2, 4).length > 1 ? "sind" : "ist"} ${words(c.slice(2, 4))}` : ""}.`
      : axes(d).good === "evil" ? "Dein ist, was sich beugt." : "Dein ist mein Dienst.";
  }

  function texts(m, d) {
    if (EN()) return textsEn(m, d);
    d = d || window.DEITY || { id: "none", name: "Herr", align: "LG", areas: [], domains: [], symbol: "" };
    const r = U.rng(m.id + "|prayer|" + d.id);
    const { law, good } = axes(d);
    const school = GIFT[m.school] ? m.school : "universal";
    const E = T.ESS[m.primary];
    // Titel: Gabe + Genitiv einer tragenden Essenz (ab 20 %), damit ähnliche Gebete nicht gleich heißen
    const strong = m.essences.filter((x) => x.pct >= 20).map((x) => T.ESS[x.id]);
    const gen = theme(m.name) || r.pick(strong.length ? strong : [E]).gen;
    const stem = (w) => w.replace(/^(der|des|die|wider die|wider das|wider den) /, "").slice(0, 4).toLowerCase();
    const gifts = GIFT[school].filter((g) => stem(g) !== stem(gen)); // kein „Wandlung des Wandels“
    const title = `${r.pick(gifts)} ${gen}`;
    const kraft = /Kraft/.test(E.gen) ? "deine Kraft" : `die Kraft ${E.gen}`;
    const ziel = TARGET[m.shape && m.shape.kind] || "hier";
    const fill = (s) => s.replace("{E}", kraft).replace("{Z}", ziel);
    const call = callOf(d);
    const praise = praiseOf(d);
    const pleas = r.sample((m.subschools || []).includes("healing") ? HEAL : PLEA[school], 2).map(fill);
    const dur = DURATION[m.duration && m.duration.kind];
    const weapon = WEAPON[String(d.weapon || "").toLowerCase()] || "meine Waffe";
    const vow = good === "evil" ? `${U.cap(weapon)} gehört dir, und jeder, der fällt, ist dein.` : `${U.cap(weapon)} gehört dir, und ${symbolDe(d)} steht vor mir.`;
    const close = good === "good"
      ? r.pick(["Schütze die Schwachen durch mich.", "Lass niemanden fallen, der auf dich hofft.", "Gib mir Erbarmen, wo ich hart sein will."])
      : good === "evil"
        ? r.pick(["Beuge, die sich mir widersetzen.", "Gib mir Macht über die Zaudernden.", "Lass die Schwachen spüren, wem sie gehören."])
        : r.pick(["Halte das Maß, auch in mir.", "Lass geschehen, was geschehen muss.", "Gib mir Gleichmut für das, was folgt."]);
    const ref = refrain(d);
    const two = dual(d, tone());
    let lines;
    if (law === "law") {
      // Litanei: Kehrvers nach jedem Abschnitt
      lines = [{ t: call }, { t: praise }, ...(two ? [{ t: two, dual: true }] : []), { t: ref, r: true }, { t: pleas[0] }, { t: pleas[1] }, { t: ref, r: true }];
      if (dur) lines.push({ t: dur });
      lines.push({ t: vow }, { t: close }, { t: ref, r: true });
    } else if (law === "chaos") {
      const cry = r.pick(["Hör mich!", "Jetzt!", "Komm!", "Brenn in mir!"]);
      lines = [{ t: call.replace(/,$/, "!") }, { t: praise.replace(/\.$/, "!") }, ...(two ? [{ t: two.replace(/\.$/, "!"), dual: true }] : []), { t: cry }, { t: pleas[0] }, { t: r.pick(["Ja!", "Mehr!", "Hier!"]) + " " + pleas[1] }, { t: vow }, { t: close }];
    } else {
      lines = [{ t: call }, { t: praise }, ...(two ? [{ t: two, dual: true }] : []), { t: pleas[0] }, ...(dur ? [{ t: dur }] : []), { t: vow }, { t: close }, { t: "So sei es.", r: true }];
    }
    return {
      title,
      epithet: `${m.schoolInfo.de} · ${E.latin}`,
      canon: { lines, refrain: ref, tone: (law === "law" ? "Litanei" : law === "chaos" ? "Anrufung" : "Bitte") + (two ? " im Zwiespalt" : ""), dual: !!two },
      deity: d,
      custom: false,
    };
  }

  // Stimme der Gottheit für die Tagesgebete (devotion.js): Anrede, Lob, Zwiespalt, Kehrvers, Schluss je Ton.
  // seed macht die Auswahl unter mehreren Fassungen deterministisch (z. B. je Spieltag).
  function voice(d, seed = "") {
    if (EN()) return voiceEn(d, seed);
    d = d || { id: "none", name: "Herr", align: "N", areas: [], domains: [], symbol: "" };
    const r = U.rng(seed + "|voice|" + d.id);
    const { law, good } = axes(d);
    const close = good === "good"
      ? r.pick(["Halte deine Hand über die, die mir anvertraut sind.", "Lass mich niemanden vergessen, der auf mich hofft.", "Gib mir Erbarmen, wo ich hart sein will."])
      : good === "evil"
        ? r.pick(["Lass mich stark sein, wo andere zaudern.", "Gib mir Macht über das, was mich heute erwartet.", "Beuge, was sich mir entgegenstellt."])
        : r.pick(["Halte das Maß, auch in mir.", "Lass geschehen, was geschehen muss.", "Gib mir Gleichmut für das, was folgt."]);
    return {
      d, r, law, good,
      call: callOf(d),
      name: d.name,
      praise: praiseOf(d),
      dual: dual(d, tone()),
      refrain: refrain(d),
      close,
      // Schlusswort: Litanei mit Kehrvers, freie Anrufung mit Ausruf, sonst schlicht
      amen: law === "law" ? refrain(d) : law === "chaos" ? r.pick(["Hör mich!", "So soll es brennen!", "Jetzt!"]) : "So sei es.",
    };
  }

  return { texts, concerns, epithet, axes, dual, dualPair, symbolName, voice, DOMAIN, AREA, DOMAIN_EN, AREA_EN };
})();

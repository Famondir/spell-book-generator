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

  const words = (arr) => (arr.length > 1 ? arr.slice(0, -1).join(", ") + " und " + arr[arr.length - 1] : arr[0] || "");
  const axes = (d) => {
    const a = String((d && d.align) || "N");
    const law = a[0] === "L" ? "law" : a[0] === "C" ? "chaos" : "neutral";
    const good = a.length === 2 ? (a[1] === "G" ? "good" : a[1] === "E" ? "evil" : "neutral") : "neutral";
    return { law, good };
  };
  // Zuständigkeiten auf Deutsch (übersetzbare zuerst), sonst Domänen
  function concerns(d) {
    const a = (d.areas || []).map((x) => AREA[x.toLowerCase()]).filter(Boolean);
    const dm = (d.domains || []).map((x) => DOMAIN[x]).filter(Boolean);
    return [...new Set([...a, ...dm])];
  }
  const epithet = (d) => EPITHET[d.title] || "";
  function symbolDe(d) {
    const { front, back } = VITRAIL.symbolMotifs(d.symbol);
    if (front === "rosette") return "dein Zeichen";
    return "dein Zeichen, " + (back ? `${bare(MOTIF_DE[front])} und ${bare(MOTIF_DE[back])}` : MOTIF_DE[front]) + ",";
  }

  // Kehrvers je Gottheit fest – wie in einer echten Liturgie
  function refrain(d) {
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

  function texts(m, d) {
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
    const c = concerns(d);
    const ep = epithet(d);
    const call = `${d.name}${ep ? ", " + ep : ""},`;
    const sind = (xs) => `${words(xs)} ${xs.length > 1 ? "sind" : "ist"} dein`;
    const praise = c.length
      ? `${sind(c.slice(0, 2))}${c.length > 2 ? `, und dein ${c.slice(2, 4).length > 1 ? "sind" : "ist"} ${words(c.slice(2, 4))}` : ""}.`
      : good === "evil" ? "Dein ist, was sich beugt." : "Dein ist mein Dienst.";
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
    let lines;
    if (law === "law") {
      // Litanei: Kehrvers nach jedem Abschnitt
      lines = [{ t: call }, { t: praise }, { t: ref, r: true }, { t: pleas[0] }, { t: pleas[1] }, { t: ref, r: true }];
      if (dur) lines.push({ t: dur });
      lines.push({ t: vow }, { t: close }, { t: ref, r: true });
    } else if (law === "chaos") {
      const cry = r.pick(["Hör mich!", "Jetzt!", "Komm!", "Brenn in mir!"]);
      lines = [{ t: call.replace(/,$/, "!") }, { t: praise.replace(/\.$/, "!") }, { t: cry }, { t: pleas[0] }, { t: r.pick(["Ja!", "Mehr!", "Hier!"]) + " " + pleas[1] }, { t: vow }, { t: close }];
    } else {
      lines = [{ t: call }, { t: praise }, { t: pleas[0] }, ...(dur ? [{ t: dur }] : []), { t: vow }, { t: close }, { t: "So sei es.", r: true }];
    }
    return {
      title,
      epithet: `${m.schoolInfo.de} · ${E.latin}`,
      canon: { lines, refrain: ref, tone: law === "law" ? "Litanei" : law === "chaos" ? "Anrufung" : "Bitte" },
      deity: d,
      custom: false,
    };
  }

  return { texts, concerns, epithet, axes, DOMAIN, AREA };
})();

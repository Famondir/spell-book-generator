// English text kit: language material and sentence patterns of the text generator (core: app/js/textgen.js).
// Own pools and own grammar – not a sentence-by-sentence translation of textgen.de.js. Style and glossary:
// data/lang/README.md (British spelling, classical arcane learning, in-world voice, rich rather than terse).
// TEXTGEN_LANG.en(ctx) returns the building blocks; the core fixes the order of the random draws, so the
// English texts are deterministic per spell, though they draw differently from the German ones.
(function () {
  window.TEXTGEN_LANG = window.TEXTGEN_LANG || {};
  window.TEXTGEN_LANG.en = function (ctx) {
    const T = window.THEORY;
    const PR = ctx.PR;
    const coreChoice = ctx.coreChoice;
    const E = (x) => (x && x.en) || x || {};

    // -------------------------------------------------------------------------
    // Language material
    // -------------------------------------------------------------------------
    const EPITHET = {
      abjuration: ["The Wall", "The Seal", "The Bar", "The Shield", "The Watch", "The Bolt"],
      conjuration: ["The Gate", "The Call", "The Bridge", "The Path", "The Threshold", "The Grasp"],
      divination: ["The Eye", "The Gaze", "The Reading", "The Sign", "The Trace", "The Lamp"],
      enchantment: ["The Fetter", "The Whisper", "The Thread", "The Spell", "The Voice", "The Hook"],
      evocation: ["The Outburst", "The Discharge", "The Blow", "The Surge", "The Spark", "The Fall"],
      illusion: ["The Veil", "The Phantom", "The Mirror", "The Mask", "The Echo", "The Curtain"],
      necromancy: ["The Grip", "The Breath", "The Harvest", "The Withering", "The Chill", "The Echo"],
      transmutation: ["The Change", "The Moulding", "The Gift", "The Exchange", "The Fabric", "The Forge"],
      universal: ["The Work", "The Hand", "The Stylus"],
    };
    const SHAPE_SUFFIX = {
      cone: "in the cone", line: "along the straight path", ray: "as a ray", burst: "in the ring", spread: "in the surge",
      emanation: "about the caster", cylinder: "in the column", wall: "as a wall", sphere: "in the sphere", cube: "in the square",
      touch: "by the hand", self: "upon one's own body", targets: "upon the target", object: "upon the thing", summon: "from beyond",
      sensor: "from afar", symbol: "in the sign", other: "",
    };
    // shape as object of a sentence: [indefinite, „of a …“]
    const SHAPE_NOUN = {
      cone: ["a cone", "of a cone"], line: ["a line", "of a line"], ray: ["a ray", "of a ray"],
      burst: ["a burst", "of a burst"], spread: ["a spread", "of a spread"], emanation: ["an emanation", "of an emanation"],
      cylinder: ["a column", "of a column"], wall: ["a wall", "of a wall"], sphere: ["a sphere", "of a sphere"], cube: ["a cube", "of a cube"],
      touch: ["a touch", "of a touch"], self: ["the caster's own body", "of the caster's own body"], targets: ["chosen targets", "of chosen targets"],
      object: ["an object", "of an object"], summon: ["a summoned thing", "of a summoned thing"], sensor: ["a distant eye", "of a distant eye"],
      symbol: ["a sign", "of a sign"], other: ["a particular form", "of a particular form"],
    };
    const TONE = {
      abjuration: "even and deep, every syllable of equal length – like the laying of stones",
      conjuration: "calling, with an open vowel at the end of each line, as though spoken across a distance",
      divination: "quiet, almost whispered, with pauses for listening between the words",
      enchantment: "melodious and soft, the sibilants drawn out, with no hardness in it",
      evocation: "sharp and rising; the last word is thrust out rather than spoken",
      illusion: "loud and soft by turns, as if an echo answered one's own voice",
      necromancy: "toneless and flat, on the out-breath, without giving voice",
      transmutation: "rhythmic, in three beats – grasp, loosen, join",
      universal: "neutral and precise, like dictation",
    };
    const SCHOOL_GESTURE = {
      abjuration: ["set the flat hand upright before the chest, fingers closed", "lay a square into the air with both hands", "strike the fists together before the body"],
      conjuration: ["draw a pentagon in the air with spread fingers", "open the hand as if receiving something", "trace a door in the air with the forefinger"],
      divination: ["form a triangle of thumbs and forefingers before the eye", "open the palms upwards, listening", "bring two fingers to the temple"],
      enchantment: ["describe a slow spiral with the forefinger", "draw the fingers through the air like threads", "stretch the hand towards the target and curl the fingers in"],
      evocation: ["clench the hand into a fist and fling it open", "thrust both palms forward", "splay the fingers as though something broke out of the hand"],
      illusion: ["pass the hand before the face like a veil", "move the fingers in mirror image, left as right", "mould with the hands a form that is not there"],
      necromancy: ["lower the hand slowly, palm downwards", "crook the fingers into a claw and draw them back", "let two circles touch with the fingertips"],
      transmutation: ["draw circle, square and triangle in the air, one after another", "turn the hands into one another as if wringing something out", "interlace the fingers and pull them apart"],
      universal: ["describe a wheel with both hands", "guide the stylus of the formula through the air"],
    };
    const SHAPE_GESTURE = {
      cone: "lock the thumbs and fan the fingers forward",
      line: "carry the outstretched arm towards the target, the hand flat as a blade",
      ray: "point the forefinger at the target, the other fingers curled",
      burst: "bring the hands together before the chest and tear them apart",
      spread: "stroke the hands slowly outwards with the fingers spread",
      emanation: "spread the arms slowly, palms turned outwards",
      cylinder: "raise one hand upright from below",
      wall: "draw a level line at shoulder height, then raise the hand",
      sphere: "cup a sphere between both hands",
      cube: "set a square in the air with the edges of the fingers",
      touch: "bring the fingertips together and lay them on the target",
      self: "lay the palm upon one's own heart",
      targets: "point the fingers at the targets one by one",
      object: "enclose the object with both hands",
      summon: "reach the hand far out and draw it in towards oneself",
      sensor: "hold two fingers before the eyes, then flick them away",
      symbol: "trace the sign with the fingertip",
      other: "hold the hands as an open bowl",
    };
    const ESSENCE_GESTURE = {
      ignis: "snap a spark from thumb and middle finger", aqua: "lower the hand in a wave",
      aer: "blow lightly across the palm", terra: "press the fist heavily downwards",
      vita: "open the hand outwards from the heart", mors: "fold the fingers in one by one, from the little finger to the forefinger",
      lux: "turn the palm sharply towards the sky", umbra: "lay the hand over the eyes",
      mens: "lay two fingers on the brow", vis: "thrust the open hand forward",
      ordo: "straighten the fingers and spread them evenly", fluxus: "turn the hands against each other",
      bonum: "raise the hand upwards", malum: "dig the fingers into the palm",
      spatium: "hold one hand far away and the other near, then exchange them", tempus: "draw a circle widdershins with the finger",
    };
    // Correspondences; heavenly bodies come from the profile
    const CORRESPOND_BASE = {
      ignis: { hour: "Noon", color: "Vermilion red", metal: "Gold", dir: "South" },
      aqua: { hour: "Dusk", color: "Deep blue", metal: "Silver", dir: "West" },
      aer: { hour: "Daybreak", color: "Sky blue", metal: "Copper", dir: "East" },
      terra: { hour: "Midnight", color: "Ochre", metal: "Iron", dir: "North" },
      vita: { hour: "Sunrise", color: "Green", metal: "Tin", dir: "East" },
      mors: { hour: "Third hour of night", color: "Ash grey", metal: "Lead", dir: "West" },
      lux: { hour: "Noon", color: "White gold", metal: "Gold", dir: "Zenith" },
      umbra: { hour: "Night of the new moon", color: "Slate", metal: "Lead", dir: "Nadir" },
      mens: { hour: "Evening", color: "Violet", metal: "Quicksilver", dir: "Within" },
      vis: { hour: "Forenoon", color: "Steel blue", metal: "Iron", dir: "Ahead" },
      ordo: { hour: "On the hour", color: "White", metal: "Platinum", dir: "North" },
      fluxus: { hour: "On the half hour", color: "Iridescent", metal: "Quicksilver", dir: "Shifting" },
      bonum: { hour: "Morning devotion", color: "White", metal: "Silver", dir: "Above" },
      malum: { hour: "Midnight", color: "Black-red", metal: "Cold iron", dir: "Below" },
      spatium: { hour: "Twilight", color: "Midnight blue", metal: "Silver", dir: "Beyond" },
      tempus: { hour: "Solstice", color: "Amber", metal: "Gold", dir: "Backwards" },
    };
    const CORRESPOND = Object.fromEntries(Object.entries(CORRESPOND_BASE).map(([k, v]) => [k, { body: "–", planet: "–", ...v, ...((PR.correspond || {})[k] || {}) }]));
    // Spell inks (no rules effect): colour and metal of the principal essence, admixture from the second essence
    const PIGMENTS = {
      "Vermilion red": { name: "vermilion", poison: true }, "Deep blue": { name: "ultramarine from lapis lazuli" }, "Sky blue": { name: "azurite" },
      Ochre: { name: "ochre" }, Green: { name: "verdigris", poison: true }, "Ash grey": { name: "bone black and chalk" },
      "White gold": { name: "shell gold" }, Slate: { name: "slate black" }, Violet: { name: "folium" }, "Steel blue": { name: "indigo and soot" },
      White: { name: "chalk white" }, Iridescent: { name: "mother-of-pearl dust" }, "Black-red": { name: "dragon's blood" }, "Midnight blue": { name: "indigo" },
      Amber: { name: "saffron in glair" },
      ...((PR.en || {}).pigments || {}),
    };
    const INK_METALS = {
      Gold: { form: "gold dust", day: "the Sun" }, Silver: { form: "silver dust", day: "the Moon" }, Copper: { form: "copper dust", day: "Venus" },
      Iron: { form: "iron filings", day: "Mars" }, Tin: { form: "tin dust", day: "Jupiter" }, Lead: { form: "white lead", day: "Saturn", poison: "white lead" },
      Quicksilver: { form: "quicksilver rubbed down with tin", day: "Mercury", poison: "quicksilver" }, Platinum: { form: "platinum dust" },
      "Cold iron": { form: "scale from cold iron", day: "Mars" },
    };
    // how the second essence serves the first; {P} = „of …“ phrase of the principal essence
    const INK_WHY = {
      ignis: ["fire lends heat to the work {P}", "embers keep the work {P} moving"],
      aqua: ["cold reins in the work {P}", "water lets the work {P} yield where it must"],
      aer: ["air fans the work {P}", "wind carries the work {P} further"],
      terra: ["earth lends weight to the work {P}", "stone holds the work {P} in its place"],
      vita: ["life nourishes the work {P}", "growth lets the work {P} ripen"],
      mors: ["decay strips the work {P} of all that is superfluous", "death makes the work {P} ruthless"],
      lux: ["light guides the work {P} to its mark", "brightness makes the work {P} visible"],
      umbra: ["shadow hides the work {P}", "darkness dims the gleam {P}"],
      mens: ["mind steers the work {P}", "reason keeps the work {P} to its intent"],
      vis: ["force drives the work {P} onward", "impact gives the work {P} its thrust"],
      ordo: ["order keeps the work {P} in shape", "measure binds the work {P}"],
      fluxus: ["change makes the work {P} supple", "flow lets the work {P} adapt"],
      bonum: ["the good hallows the work {P}", "grace tempers the work {P}"],
      malum: ["evil sharpens the work {P}", "malice gives the work {P} its bite"],
      spatium: ["distance opens the way for the work {P}", "farness lets the work {P} reach a long way"],
      tempus: ["time lets the work {P} endure", "the hour gives the work {P} its right moment"],
    };
    const metalForm = (met) => INK_METALS[met] || { form: `dust of ${met.toLowerCase()}` };
    const cap = U.cap;
    const school = (m) => T.SCHOOLS[m.school] || T.SCHOOLS.universal;
    const sch = (m) => E(school(m));
    const ess = (id) => T.ESS[id];
    const essE = (id) => E(ess(id));
    const essParts = (m) => T.partsEn(m.essences);
    const shapeE = (m) => E(m.shape);
    const rangeName = (m) => E(m.range).de || "";
    const durE = (m) => E(m.duration);
    const saveE = (t) => E(T.SAVES[t]);
    const signE = (s) => s.en || { de: s.de, gen: s.gen, text: s.text };
    const combo = (m) => (m.combo && m.essences[1] ? T.comboNameEn(m.essences[0].id, m.essences[1].id) || m.combo : null);
    const nouns = (m) => (m.components.nouns || []).map((n) => { const x = (T.MATERIAL_EN || {})[n] || n; return /^[A-Z][a-z]/.test(x) && !/^[A-Z][a-z]+ [A-Z]/.test(x) ? x.charAt(0).toLowerCase() + x.slice(1) : x; });
    // range as a value (summary, construction)
    const rangeValue = (m) => ["personal", "touch", "close range", "medium range", "long range", "unlimited range"][m.range.tier] || String(rangeName(m)).toLowerCase();
    // title case for epithets: „The Surge of the Flame“
    const titleCase = (t) => t.replace(/\b([a-z])([a-z']*)/g, (w, a, b, i) => (i > 0 && /^(of|the|a|an|in|on|upon|by|from|as|at|along|about)$/.test(w) ? w : a.toUpperCase() + b));
    const alchemy = (tag) => String((T.ALCHEMY_EN || {})[tag] || T.ALCHEMY[tag]).split(" – ")[0];
    const num = (n) => Number(n).toLocaleString("en-GB");
    const fmtLen = (ft) => (ft >= 5280 ? `${num(Math.round((ft / 5280) * 10) / 10)} miles` : `${num(ft)} ft.`);
    const ORD = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"];
    const WORD = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
    // range phrase within a sentence
    const rangePhrase = (m) => ({ 0: "upon one's own body", 1: "at the fingertip", 2: "at close range", 3: "at medium range", 4: "at long range", 5: "at any distance" }[m.range.tier] || "at a distance");
    const MONTHS = (PR.calendar || {}).months || [];
    const PLACES = PR.places || [];
    const dateStr = (day, month) => `${day} ${MONTHS[month % MONTHS.length] || ""} ${(PR.calendar || {}).year || ""}`.replace(/\s+/g, " ").trim();

    function ink(m) {
      if (m.level < 1) return "";
      const r = U.rng(m.seed ^ 0x1c4);
      const c = CORRESPOND[m.primary];
      const pg = PIGMENTS[c.color] || { name: c.color.toLowerCase() };
      const mt = metalForm(c.metal);
      const out = [`Iron gall, coloured with ${pg.name}, with ${mt.form}`];
      const poison = [pg.poison && pg.name, mt.poison];
      const sec = m.essences[1] && CORRESPOND[m.essences[1].id];
      if (sec && sec.metal !== c.metal) {
        const ad = metalForm(sec.metal);
        const why = r.pick(INK_WHY[m.essences[1].id] || ["{P}"]).replace("{P}", essE(m.primary).gen);
        const cb = combo(m);
        out[0] += `; a knife-point of ${ad.form}, for ${why}${cb ? ` – and so it becomes ${cb}` : ""}`;
        poison.push(ad.poison);
      }
      out[0] += ".";
      if (mt.day) out.push(`Grind it on the day of ${mt.day}.`);
      const warn = [...new Set(poison.filter(Boolean))];
      if (warn.length) out.push(`${cap(warn.join(" and "))} only with a brush of its own; wash with soap afterwards.`);
      return out.join(" ");
    }

    // -------------------------------------------------------------------------
    // Building blocks
    // -------------------------------------------------------------------------
    function epithet(m, r) {
      const n = r.pick(EPITHET[m.school] || EPITHET.universal);
      const suffix = SHAPE_SUFFIX[m.shape.kind];
      return `${titleCase(`${n} ${essE(m.primary).gen}`)}${suffix && r.chance(0.6) ? " " + suffix : ""}`;
    }

    function gestures(m, r) {
      const L = m.level;
      const n = L === 0 ? 3 : Math.min(2 + Math.ceil(L / 2), 7);
      const g = [];
      g.push(cap(r.pick(SCHOOL_GESTURE[m.school] || SCHOOL_GESTURE.universal)));
      for (const e of m.essences.slice(0, 2)) g.push(cap(ESSENCE_GESTURE[e.id]));
      g.push(cap(SHAPE_GESTURE[m.shape.kind]));
      for (const s of m.signs) g.push(`Set the sign ${signE(s).gen} in the air with the fingertip, ${s.dir === "in" ? "towards the body" : "away from the body"}`);
      // order: the school first, the shape last (it releases the discharge)
      const first = g[0], last = cap(SHAPE_GESTURE[m.shape.kind]);
      const mid = r.sample(g.filter((x) => x !== first && x !== last), Math.max(0, n - 2));
      return [first, ...mid, last].slice(0, n);
    }

    function materials(m) {
      const c = m.components;
      const parts = [];
      if (c.M) {
        const cats = c.materialTags.map((t) => alchemy(t.tag)).join(", ");
        const ns = nouns(m);
        const names = ns.length ? `${ns.join(", ")} (${cats})` : cats;
        parts.push({ k: "Material offering", t: cap(names) + (c.costly ? ` · ${num(c.costly)} gp` : ""), orig: c.material || "" });
      }
      if (c.F) parts.push({ k: "Focus", t: "remains and is not consumed", orig: c.focus || "" });
      if (c.DF) parts.push({ k: "Divine focus", t: PR.divineFocus, orig: "" });
      return parts;
    }

    function theory(m, r) {
      const sc = sch(m);
      const e0 = ess(m.primary);
      const paras = [];
      // 1. School
      paras.push({
        id: "school", h: "Principle of the school",
        t: `${sc.principle} ${sc.de} is the art of ${sc.art}. This formula does so in the form ${SHAPE_NOUN[m.shape.kind][1]}.`,
      });
      // 2. Essences
      let et = `The charge of the formula is spread over ${m.essences.length === 1 ? "a single essence" : WORD[m.essences.length] + " essences"}: ${essParts(m)}. ${essE(m.primary).text}`;
      if (m.essences[1]) {
        const e1 = ess(m.essences[1].id), x1 = E(e1);
        et += ` ${e1.latin} (${x1.de}) works as the second essence: ${String(x1.text).split(". ")[0].replace(/\.$/, "")}.`;
        const cb = combo(m);
        if (cb) et += ` Together, ${e0.latin} and ${e1.latin} form the bond the old textbooks call “${cb}”.`;
      }
      if (m.tension) et += " The formula unites opposed essences. Such tension magic holds only if the outer ring is cleanly closed – every carelessness becomes a crack.";
      paras.push({ id: "ess", h: "Essences", t: et });
      // 3. Signs
      if (m.signs.length) {
        const directional = !["burst", "spread", "emanation", "sphere", "cube", "self", "touch", "summon", "other", "object", "symbol"].includes(m.shape.kind);
        paras.push({
          id: "signs", h: "Signs and direction",
          t: m.signs.map((s) => `The sign ${signE(s).gen} ${signE(s).text}${s.dir === "in" ? "; it is turned towards the core" : ""}.`).join(" ") +
            (directional
              ? " The signs are crowded in the north of the ring: this preponderance sets the direction of working. A single countersign in the south keeps the formula from kicking backwards."
              : " The signs are evenly spread; their symmetry lets the working issue on every side at once."),
        });
      }
      // 4. Reach and duration
      let wd = m.range.tier === 0
        ? "The formula has no spacing ring – it does not leave the caster."
        : `${cap(WORD[m.range.tier])} spacing ring${m.range.tier === 1 ? " carries" : "s carry"} the formula ${m.range.tier === 1 ? "as far as the fingertip" : m.range.tier >= 5 ? "beyond every measurable distance" : "outwards; the more rings, the further the formula reaches and the more strength it costs"}.`;
      wd += {
        instant: " The ring of duration is deliberately broken: an open matrix. The energy is not held but released – the effect is instantaneous, but its consequences remain.",
        rounds: " The ring of duration bears time marks. Each mark is a heartbeat of the formula; once they are spent, it goes out.",
        minutes: " The dashed ring of duration holds the formula for some minutes; between the dashes the charge escapes slowly.",
        hours: " The double ring of duration encloses the charge and holds it for hours.",
        days: " The triple ring of duration binds the formula for days. It must be drawn with particular care.",
        permanent: " The ring of duration is a serpent biting its own tail: the formula feeds upon itself and does not pass away of its own accord.",
        concentration: " From the ring of duration a thread runs to the rim – it is the caster's mind. If concentration breaks, the thread breaks.",
        special: " The ring of duration is left open; the duration depends on circumstances the formula itself determines.",
      }[m.duration.kind];
      if (m.duration.dismissible) wd += " A key notch in the ring allows the formula to be loosed at any time.";
      paras.push({ id: "reach", h: "Reach and duration", t: wd });
      // 5. Thresholds
      let sw = "";
      if (m.save.type !== "none") {
        const two = m.save.effect === "half" || m.save.effect === "partial", sv = saveE(m.save.type);
        sw += `In the script band ${two ? "lie two threshold gates" : "lies a threshold gate"} – the gate ${sv.gateGen}. Through ${two ? "them" : "it"} the target may brace itself against the formula with ${sv.de}${m.save.harmless ? "; the gate is drawn open, for a willing target lets the formula in" : ""}.`;
      } else sw += "The formula has no threshold gate: there is no escaping it by will or by nimbleness.";
      sw += m.sr.yes
        ? " The hatched seal band behind it shows that the formula must struggle against spell resistance."
        : " There is no seal band – spell resistance has no hold here, for the effect, once it has arisen, is ordinary matter or ordinary force.";
      paras.push({ id: "gates", h: "Thresholds", t: sw });
      // 6. Balance
      if (m.components.M || m.components.F) {
        const stuff = (nouns(m).length ? nouns(m) : m.components.materialTags.map((t) => alchemy(t.tag))).join(", ");
        paras.push({
          id: "balance", h: "Law of balance",
          t: [
            "Nothing comes from nothing.",
            m.components.M ? `The material (${stuff}) is the price the formula demands; it is consumed in the casting.` : "",
            m.components.F ? "The focus, by contrast, is no price but a tool: it aligns the charge and remains." : "",
            m.components.costly ? `The greater the effect, the higher the balance – here ${num(m.components.costly)} gold pieces.` : "",
          ].filter(Boolean).join(" "),
        });
      }
      return paras;
    }

    function structure(m) {
      const out = [];
      const sc = sch(m);
      const subs = m.subschools.length ? " (" + m.subschools.map((s) => E(T.SUBSCHOOLS[s]).de || s).join(", ") + ")" : "";
      out.push({ k: "Core seal", t: `${sc.figure} – school of ${sc.de}${subs}. At the centre the principal essence, ${ess(m.primary).latin}.` });
      out.push({ k: "Essence ring", t: `Segments by share: ${essParts(m)}.` });
      out.push({ k: "Ring of duration", t: `${durE(m).ring}${m.duration.dismissible ? ", with a key notch" : ""}.` });
      if (m.signs.length) out.push({ k: "Ring of signs", t: cap(m.signs.map((s) => `${signE(s).de.toLowerCase()} (${s.dir === "in" ? "inwards" : "outwards"})`).join(", ")) + "." });
      out.push({ k: "Spacing rings", t: `${m.range.rings} – ${rangeValue(m)}.` });
      out.push({ k: "Knots of order", t: m.level === 0 ? "None – a finger exercise without an order of its own." : `${m.level} – a formula of the ${ORD[m.level] || m.level + "th"} order.` });
      out.push({ k: "Shape", t: `${shapeE(m).de}: ${String(shapeE(m).figure).charAt(0).toLowerCase() + String(shapeE(m).figure).slice(1)}.` });
      out.push({ k: "Script band", t: m.components.V ? "Bears the spoken formula." : "Silent runes – the formula is not spoken." });
      if (m.save.type !== "none") out.push({ k: "Threshold gate", t: `${saveE(m.save.type).gate} (${saveE(m.save.type).de}).` });
      out.push({ k: "Seal band", t: m.sr.yes ? "Hatched – spell resistance applies." : "Absent – spell resistance does not apply." });
      out.push({ k: "Time mark", t: cap(m.casting.en || m.casting.de) + "." });
      return out;
    }

    function steps(m, r) {
      const L = m.level;
      const per = L === 0 ? 1 : 1 + Math.floor(L / 3);
      const g = gestures(m, r);
      const sc = sch(m);
      const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);
      const phases = [
        {
          h: "Grasp",
          items: [
            `Build the whole circle before the inner eye: first the core seal (${lc(sc.figure)}), then the essence ring with ${ess(m.primary).latin} at its centre.`,
            m.shape.kind === "self" ? "Understand your own body as the vessel of the formula." : `Fix the target: ${SHAPE_NOUN[m.shape.kind][0]}, ${rangePhrase(m)}.`,
            m.level >= 3 ? `Count off the ${m.level} knots of order in their proper sequence; a skipped knot makes the star collapse.` : "Keep the breath calm until the image stands.",
            m.components.M ? "Take the material into the left hand and inwardly acknowledge its worth." : "Free the hands.",
          ],
        },
        {
          h: "Loosen",
          items: [
            m.components.V ? `Speak the formula – ${TONE[m.school] || TONE.universal}.` : "Think the formula in silence; not even the lips move.",
            ...g.slice(0, -1),
            m.components.M ? "Crumble, break or burn the material between the fingers as the last syllable but one falls." : "Gather the charge in the chest.",
          ],
        },
        {
          h: "Join",
          items: [
            g[g.length - 1] + ".",
            m.duration.kind === "instant" ? "Leave the circle open: the energy must issue unhindered." : "Close the outer ring in the mind before the hand sinks.",
            m.duration.concentration ? "Hold the thread – the attention stays with the formula." : "Let go. The formula carries itself.",
          ],
        },
      ];
      for (const p of phases) p.items = p.items.filter(Boolean).slice(0, per + 1 + (p.h === "Loosen" ? 1 : 0));
      return phases;
    }

    // Marginal notes in the owner's voice (profile freely configurable)
    const BRIDGE_SLOT = "\u0000bridge";
    const ruleName = (s) => (window.RULES ? RULES.name(s) : s.name);
    function familyName(base) {
      const s = (window.SPELLS || []).find((x) => x.name.toLowerCase() === base.toLowerCase());
      return s ? ruleName(s) : base.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    function notes(m, r, profile, n, lines = []) {
      const sc = sch(m);
      const e0 = ess(m.primary);
      const name = ruleName(m.spell);
      const vars = { owner: profile.name, name, essence: e0.latin, school: sc.de };
      const bridge = bridgeNote(m, lines);
      const pool = [
        `Measured: with a clean circle, ${r.int(2, 9)} % less residual charge in the finger than with the template. The template was sloppy.`,
        `The ${m.signs[0] ? "ring of signs" : "essence ring"} can be turned by ${r.int(2, 7)}° without the formula breaking. Tolerance noted. A possible point of attack.`,
        `Weak point: the formula does not check ${m.save.type !== "none" ? "who passes through the threshold gate" : "where the charge comes from"}. That can be exploited.`,
        `Drawn in ${r.int(3, 40) + m.level * 4} minutes. Aim: under ${r.int(2, 9) + m.level * 2}.`,
        `${sc.de}: ${r.pick(["familiar", "reliable", "not yet fully understood", "more elegant than expected", "needlessly complicated in its notation"])}.`,
        m.tension ? `Opposed essences (${m.essences.map((e) => ess(e.id).latin).slice(0, 2).join("/")}). Check the ring twice. Last attempt: ${r.pick(["singed sleeves", "a headache", "a tear in the parchment", "a humming in the skull"])}.` : "No tension between the essences. Stable.",
        m.essences.some((e) => e.id === "malum" || e.id === "bonum") ? (PR.noteAlignment || {})[m.essences.some((e) => e.id === "malum") ? "malum" : "bonum"] : `Tried in the field (${r.pick(PLACES)}). Result as calculated.`,
        m.components.costly ? `The balance (${num(m.components.costly)} gp) hurts. Still searching for a cheaper correspondence.` : "No costly material needed. Efficient.",
        PR.noteOriginalName ? PR.fill(PR.noteOriginalName, vars) : null,
        `Cross-reference: ${combo(m) ? "the bond “" + combo(m) + "” – see the other formulas with this bond." : "a pure essence, no named bond."}`,
        m.family.mod ? `Belongs to the family “${familyName(m.family.base)}”. Same basic construction, only ${/greater|major|improved/.test(m.family.mod) ? "one additional ring of reinforcement" : /lesser|minor/.test(m.family.mod) ? "the outer ring is loosened" : "further knots at the rim"}.` : "No known variant. Not yet.",
        `${profile.name}: seal checked on ${dateStr(r.int(1, 28), r.int(0, 11))}.`,
        `Quill: ${r.pick(["goose, freshly cut", "raven for the script band", "swan for the rings", "the old goose quill, recut", "steel nib from the market – not again"])}. ${r.pick(["Holds the line.", "Spatters in the curves.", "Good for fine lines.", "Too broad for the script band."])}`,
        `Test question to myself: which layer bears the load? Answer: ${m.level >= 3 ? "the knots of order" : "the essence ring"}.`,
        m.duration.kind === "instant" ? "Open matrix. After casting, check whether residual charge hangs in the room." : "Closed circle. Before sleeping, check whether any formulas still cling to me.",
        `The name “${name}” sounds like less in the trade tongue than the formula is.`,
        `Addendum: ${r.pick(["The circle works in chalk on stone as well, only weaker.", "In rain, set the script band tighter.", "Do not exaggerate the gestures – precision beats size.", "Corrected a mistake in the glossary."])}`,
        ...(PR.notes || []).map((x) => PR.fill(x, vars)),
        bridge.slot ? BRIDGE_SLOT : null,
      ];
      const out = r.sample(pool.filter(Boolean), n);
      const at = out.indexOf(BRIDGE_SLOT);
      if (at >= 0) out.splice(at, 1);
      if (bridge.text) out.unshift(bridge.text);
      out.lead = !!bridge.text;
      return out;
    }

    // Bridge note: foreign formula word beside the Latin technical word (only with a foreign formula language)
    const BRIDGE_NOTES = {
      cognate: [
        "“{word}” – {latin}. The same stem.",
        "{word} and {latin}: no accident. Both words grow from one root.",
        "This version has “{word}”. You can still hear {latin} in it.",
      ],
      coreStem: [
        "“{word}” – in the formal formula, {latin}. Both from {stem}.",
        "{word} and {latin} stand in the same place and grow from one root ({stem}).",
      ],
    };
    function bridgeNote(m, lines = []) {
      const F = window.FORMULA, lang = F.langOf(m);
      if (lang.id === "latin") return {};
      const own = (PR.lang === "en" && PR.bridgeNotes) || {};
      const spelled = (w) => (lang.phonetic === false ? w : F.spell(w, F.readLang()));
      const printed = lines.join(" ").toLowerCase();
      const entries = lang.bridges ? m.essences.map((e) => lang.bridges[e.id]).filter(Boolean) : [];
      const b = entries.find((x) => printed.includes(spelled(x.word).toLowerCase()));
      const slot = entries.length > 0;
      let core = null;
      if (F.aligned(lang)) {
        const c = coreChoice(m), j = c.slot[1];
        const stem = ((lang.stems || {}).ess || {})[m.primary];
        if (stem && stem[j]) core = { word: spelled(lang.lex.ess[m.primary][j]), latin: c.ess, letter: c.letters[1], stem: stem[j], lang: F.name(lang.id, "en") };
      }
      const table = b && b.cognate ? b : null;
      if (core && (!table || (m.seed >>> 5) % 3)) {
        const list = own.coreStem || BRIDGE_NOTES.coreStem;
        return { text: cap(PR.fill(list[(m.seed >>> 3) % list.length], core)), slot };
      }
      if (!table) return { slot };
      const list = own.cognate || BRIDGE_NOTES.cognate;
      return { text: cap(PR.fill(list[(m.seed >>> 3) % list.length], { word: spelled(table.word), latin: table.latin, lang: F.name(lang.id, "en") })), slot };
    }

    function calibration(m) {
      const s = m.spell;
      const minCL = Math.max(1, m.level * 2 - 1);
      const levels = [];
      for (let cl = minCL; cl <= 20; cl += cl < 10 ? 2 : 5) levels.push(cl);
      if (!levels.includes(20)) levels.push(20);
      const rows = [];
      const rl = s.range.toLowerCase();
      let rangeFn = null;
      if (/^close|^short/.test(rl)) rangeFn = (cl) => 25 + 5 * Math.floor(cl / 2);
      else if (/^medium/.test(rl)) rangeFn = (cl) => 100 + 10 * cl;
      else if (/^long/.test(rl)) rangeFn = (cl) => 400 + 40 * cl;
      const dm = s.duration.toLowerCase().match(/(\d+)\s*(round|min|hour|day)[a-z.]*\/(\d*)\s*level/);
      const unit = dm && { round: "rd.", min: "min.", hour: "hr.", day: "days" }[dm[2]];
      const dice = m.dice && m.dice.perLevel ? m.dice : null;
      const capd = dice && s.description.match(/maximum (?:of )?(\d+)d\d+/);
      for (const cl of levels) {
        const row = { cl };
        if (rangeFn) row.range = fmtLen(rangeFn(cl));
        if (dm) row.dur = Math.floor(cl / (+dm[3] || 1)) * +dm[1] + " " + unit;
        if (dice) row.dice = Math.min(cl * dice.count, capd ? +capd[1] : 99) + "d" + dice.sides;
        rows.push(row);
      }
      const cols = [["cl", "Caster level"]];
      if (rangeFn) cols.push(["range", "Reach"]);
      if (dm) cols.push(["dur", "Duration"]);
      if (dice) cols.push(["dice", "Dice"]);
      return cols.length > 1 ? { cols, rows } : null;
    }

    const LEAK = {
      ignis: "Sparks, singed fingers.", aqua: "Rime on the skin, stiff joints.", aer: "A jolt in the fingertips, ringing ears.",
      terra: "Heaviness in the limbs, dust on the tongue.", vita: "A brief fever, rampant fingernails.", mors: "Numb fingers, a cold patch on the chest.",
      lux: "Dazzled eyes for a few breaths.", umbra: "One's own shadow moves a heartbeat too late.", mens: "A headache, a stranger's thought.",
      vis: "A blow against one's own chest.", ordo: "Stiff joints; the formula jams.", fluxus: "A small, random change in the caster.",
      bonum: "A feeling of shame.", malum: "A bitter taste and a whisper.", spatium: "A step that arrives somewhere other than planned.", tempus: "A lost moment.",
    };
    function failure(m, r) {
      const e0 = ess(m.primary);
      const list = [
        { k: "Script band broken", t: m.components.V ? "The formula falls silent in mid-sentence; the charge escapes as heat in the hands." : "A rune is missing: the silent formula stays silent." },
        { k: "Core seal distorted", t: `The school tips over. Instead of ${sch(m).art.split(",")[0]}, something neighbouring happens – mostly harmless, sometimes not.` },
        { k: "Essence ring unclean", t: `${e0.latin} escapes uncontrolled. ${LEAK[m.primary]}` },
        { k: "Knots of order transposed", t: m.level >= 2 ? "The star collapses inwards. The formula is lost, and its place in memory with it." : "Hardly possible at so low an order." },
        { k: "Ring of duration not closed", t: m.duration.kind === "instant" ? "No fault – it is open in any case." : "The effect takes place but fades after a single heartbeat." },
        { k: "Backlash", t: m.tension ? "Opposed essences strike into each other. Whoever wants too much pays with their own body." : "Whoever forces more charge than the circle holds gets the excess back." },
      ];
      return r.sample(list, Math.min(list.length, 2 + Math.floor(m.level / 2)));
    }

    function counter(m) {
      const e0 = ess(m.primary);
      const opp = ess(e0.opp);
      return {
        opp,
        t: `To loose this formula, its circle is drawn in mirror image: every sign reversed, the script band running widdershins. At the centre stands the opposing essence, ${opp.latin} (${E(opp).de}). ${m.duration.kind === "instant" ? "Since the formula works instantaneously, only its arising can be prevented, not its consequences." : "An existing effect is loosed by severing its ring of duration – with a dispelling of magic or by the countersign."}`,
      };
    }

    function practice(m, r, profile, n) {
      const out = [];
      let day = r.int(1, 20), month = r.int(0, 11);
      const results = ["succeeded", "succeeded, line work untidy", "failed – knots of order transposed", "succeeded, faster than before", "broken off – disturbance", "succeeded, effect stronger than expected", "failed – script band smudged", "succeeded"];
      for (let i = 0; i < n; i++) {
        out.push({ date: dateStr(day, month), place: r.pick(PLACES), result: i === n - 1 ? "succeeded – the formula sits" : r.pick(results) });
        day += r.int(1, 9);
        if (day > 28) (day -= 28), (month = (month + 1) % 12);
      }
      return out;
    }

    function learning(m, r) {
      const src = m.traditions.includes("divine") || m.traditions.includes("nature")
        ? "The formula is known among priests and druids too; the arcane version replaces the prayer with geometry."
        : m.classCount <= 3
          ? "A rare formula – only a few traditions know it."
          : "A widespread formula; almost every arcane school teaches it in a notation of its own.";
      const dc = 15 + m.level;
      const st = window.FORMULA.originOf(m), lang = window.FORMULA.langOf(m);
      const from = r.pick(PR.learningOrigins || [""]);
      // station texts of the profile are written in the profile's language
      const origin = PR.lang === window.PROFILE.localLang ? st.origin || from : from;
      const fass = lang.id === "latin" ? "" : ` The formula is notated in ${window.FORMULA.name(lang.id, "en")}.`;
      return `${src} Copying it from a foreign spellbook requires Spellcraft DC ${dc}. Origin of this version: ${origin}${fass}`;
    }

    const summary = (m) => `${sch(m).de}, ${ess(m.primary).latin}${m.essences[1] ? " with " + ess(m.essences[1].id).latin : ""}. ${cap(SHAPE_NOUN[m.shape.kind][0])}${["touch", "self"].includes(m.shape.kind) && m.range.tier <= 1 ? "" : ", " + rangeValue(m)}, ${String(durE(m).de).toLowerCase()}.`;
    // Everyday spells: description, flavour and origin in English (data/everyday_spells.en.js)
    const everyday = (m, r) => {
      const s = m.spell, x = s.en || {};
      // a flavour from the profile applies only in the profile's language
      const flavor = !s.flavor ? "" : s.ownFlavor && PR.lang === window.PROFILE.localLang ? s.flavor : I18N.pick(s.flavor, x.flavor, s.fromProfile ? null : `everyday:${s.name}.flavor`);
      return {
        summary: I18N.pick(s.description, x.description, s.fromProfile ? null : `everyday:${s.name}.description`),
        flavor,
        learning: `An everyday formula, derived from ${s.base}. Whoever has mastered the base formula can cast it after an afternoon's practice; copying it succeeds with Spellcraft DC 15. Origin: ${r.pick(PR.everydayOrigins || [""])}.`,
      };
    };

    return {
      epithet, gestures, materials, theory, structure, steps, notes, calibration, failure, counter, practice, learning, ink, summary, everyday,
      tone: (m) => TONE[m.school] || TONE.universal,
      owner: PR.owner,
      CORRESPOND, MONTHS, SCHOOL_GESTURE, PIGMENTS, INK_METALS,
    };
  };
})();

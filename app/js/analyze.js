// Zauberdaten -> magietheoretisches Modell. Kreis und Texte werden nur aus diesem Modell erzeugt,
// damit Bild und Erklärung immer übereinstimmen.
(function () {
  const T = window.THEORY;

  function spellLevel(s) {
    if (s.everyday) return 0;
    // Grad der Klasse des aktiven Charakters (ein Klassenwechsel lädt die Seite neu)
    const own = window.CLASS && s.levels[CLASS.list];
    if (own != null) return own;
    if (s.levels.wizard != null) return s.levels.wizard;
    for (const c of ["sorcerer", "arcanist", "magus", "witch"]) if (s.levels[c] != null) return s.levels[c];
    const v = Object.values(s.levels);
    return v.length ? Math.min(...v) : 0;
  }

  function add(acc, map, w) {
    for (const k in map) acc[k] = (acc[k] || 0) + map[k] * w;
  }

  function essences(s, comps) {
    const ev = {}; // Herkunft der Gewichte, für die Erklärung
    const acc = {};
    const note = (src, map, w) => {
      add(acc, map, w);
      for (const k in map) (ev[k] = ev[k] || []).push(src);
    };
    if (s.essHint) note("Eigenart der Formel", s.essHint, 1.6);
    for (const d of s.descriptors) if (T.DESCRIPTORS[d]) note("Deskriptor " + d, T.DESCRIPTORS[d], 1.4);
    for (const sub of s.subschool) if (T.SUBSCHOOLS[sub]) note("Unterschule " + sub, T.SUBSCHOOLS[sub].ess, 1);

    const desc = s.description.toLowerCase();
    const name = s.name.toLowerCase();
    // Schadensarten aus der Beschreibung
    const dmg = desc.slice(0, 350).match(/\b(fire|cold|acid|electricity|sonic|force|negative energy|positive energy)\s+damage/g) || [];
    for (const m of new Set(dmg)) {
      const t = m.replace(/\s+damage$/, "");
      const map = { "negative energy": { mors: 2 }, "positive energy": { vita: 2 } }[t] || T.DESCRIPTORS[t];
      // nur wenn kein Energiedeskriptor existiert – sonst ist die Erwähnung meist Nebensache
      if (map && !s.descriptors.some((d) => T.DESCRIPTORS[d])) note("Schadensart " + t, map, 0.8);
    }
    for (const [re, map] of T.KEYWORDS) {
      const hitsDesc = Math.min((desc.match(re) || []).length, 3);
      const hitsName = (name.match(re) || []).length;
      const w = hitsDesc * 0.18 + hitsName * 1.2;
      if (w > 0) note(hitsName ? "Name" : "Beschreibung", map, w);
    }
    for (const m of comps.materialTags) note("Material " + m.tag, m.ess, 0.6);

    // Grundneigung der Schule – sorgt dafür, dass jeder Zauber ein Profil hat
    const school = T.SCHOOLS[s.school] || T.SCHOOLS.universal;
    note("Schule", school.essencePrior, 1.6);

    let total = Object.values(acc).reduce((a, b) => a + b, 0) || 1;
    let list = Object.entries(acc)
      .map(([id, v]) => ({ id, pct: (v / total) * 100, sources: [...new Set(ev[id])] }))
      .sort((a, b) => b.pct - a.pct);
    // Kleinstanteile (< 6 %) fallen weg, Rest auf 100 % normieren und runden
    list = list.filter((e, i) => i < 1 || e.pct >= 6).slice(0, 6);
    total = list.reduce((a, b) => a + b.pct, 0);
    list.forEach((e) => (e.pct = (e.pct / total) * 100));
    let rounded = list.map((e) => Math.round(e.pct));
    rounded[0] += 100 - rounded.reduce((a, b) => a + b, 0);
    list.forEach((e, i) => (e.pct = rounded[i]));
    return list;
  }

  function parseRange(r) {
    const l = r.toLowerCase();
    let tier = 2, ft = null;
    if (/^personal/.test(l)) tier = 0;
    else if (/^touch/.test(l)) tier = 1;
    else if (/^(close|short)/.test(l)) tier = 2;
    else if (/^medium/.test(l)) tier = 3;
    else if (/^long/.test(l)) tier = 4;
    else if (/unlimited|mile|plane|anywhere/.test(l)) tier = 5;
    else {
      const m = l.match(/(\d+)\s*(ft|feet)/);
      if (m) {
        ft = +m[1];
        tier = ft <= 5 ? 1 : ft <= 40 ? 2 : ft <= 200 ? 3 : 4;
      }
    }
    return { tier, ft, raw: r, ...T.RANGES[tier] };
  }

  function parseDuration(d) {
    const l = d.toLowerCase();
    let kind = "special";
    if (/^instantaneous/.test(l)) kind = "instant";
    else if (/^concentration/.test(l)) kind = "concentration";
    else if (/^permanent/.test(l)) kind = "permanent";
    else if (/round/.test(l)) kind = "rounds";
    else if (/min/.test(l)) kind = "minutes";
    else if (/hour/.test(l)) kind = "hours";
    else if (/day|week|month|year/.test(l)) kind = "days";
    return {
      kind,
      perLevel: /level/.test(l),
      dismissible: /\(d\)/.test(l),
      discharge: /discharg/.test(l),
      concentration: /concentration/.test(l),
      raw: d,
      ...T.DURATIONS[kind],
    };
  }

  function parseCasting(c) {
    const l = c.toLowerCase();
    let kind = "standard", de = "Standard-Aktion";
    if (/swift/.test(l)) (kind = "swift"), (de = "Schnelle Aktion");
    else if (/immediate/.test(l)) (kind = "immediate"), (de = "Augenblickliche Aktion");
    else if (/full/.test(l)) (kind = "fullround"), (de = "Volle Aktion");
    else if (/round/.test(l)) (kind = "round"), (de = "Runden");
    else if (/minute/.test(l)) (kind = "minutes"), (de = "Minuten (Ritual)");
    else if (/hour|day/.test(l)) (kind = "hours"), (de = "Stunden (Ritual)");
    return { kind, de, raw: c, ritual: kind === "minutes" || kind === "hours" };
  }

  function parseComponents(c) {
    const out = { V: false, S: false, M: false, F: false, DF: false, material: "", focus: "", costly: 0, materialTags: [], raw: c };
    // Klammern auslesen, bevor nach Kürzeln gesucht wird
    const parens = [];
    const flat = c.replace(/\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (_, p) => {
      parens.push(p);
      return "§" + (parens.length - 1);
    });
    for (const part of flat.split(",")) {
      const p = part.trim();
      const text = (p.match(/§(\d+)/) || [])[1];
      const inner = text != null ? parens[+text] : "";
      if (/^V\b/.test(p)) out.V = true;
      if (/^S\b/.test(p)) out.S = true;
      if (/\bM\b/.test(p)) (out.M = true), (out.material = out.material || inner);
      if (/^F\b|\/F\b|\bF\//.test(p)) (out.F = true), (out.focus = out.focus || inner);
      if (/\bDF\b/.test(p)) out.DF = true;
    }
    const gp = (out.material + " " + out.focus).match(/([\d,]+)\s*gp/);
    if (gp) out.costly = +gp[1].replace(/,/g, "");
    const mat = (out.material + " " + out.focus).toLowerCase();
    out.nouns = []; // deutsche Stoffwörter in Fundreihenfolge
    const seen = new Set();
    let rest = mat;
    for (const [re, de, tag] of T.MATERIAL_NOUNS) {
      if (!re.test(rest)) continue;
      rest = rest.replace(new RegExp(re.source, "g"), " "); // Treffer verbrauchen, damit „silver mirror“ nicht doppelt zählt
      if (!out.nouns.includes(de)) out.nouns.push(de);
      if (!seen.has(tag)) {
        seen.add(tag);
        out.materialTags.push({ tag, ess: T.TAG_ESS[tag] || {} });
      }
    }
    if ((out.M || out.F) && !out.materialTags.length) out.materialTags.push({ tag: "materia", ess: {} });
    return out;
  }

  function parseSave(s) {
    const l = s.toLowerCase();
    let type = "none";
    if (/^will/.test(l)) type = "will";
    else if (/^fort/.test(l)) type = "fort";
    else if (/^ref/.test(l)) type = "ref";
    let effect = (l.match(/negates|half|partial|disbelief/) || [""])[0];
    return { type, effect, harmless: /harmless/.test(l), object: /object/.test(l), raw: s, ...T.SAVES[type] };
  }

  function parseShape(s) {
    const area = s.area.toLowerCase(), eff = s.effect.toLowerCase(), tgt = s.target.toLowerCase();
    const all = area + " " + eff + " " + tgt;
    let kind = "other", count = 1;
    const radius = +(all.match(/(\d+)-(?:ft|foot)\.?-?(?:radius)?/) || [])[1] || null;
    if (/cone/.test(all)) kind = "cone";
    else if (/\bline\b/.test(all)) kind = "line";
    else if (/\b(ray|arrow|missile|bolt|beam)/.test(eff)) kind = "ray";
    else if (/wall|plane of/.test(eff + area)) kind = "wall";
    else if (/cylinder/.test(all)) kind = "cylinder";
    else if (/cube/.test(all)) kind = "cube";
    else if (/emanation/.test(all)) kind = "emanation";
    else if (/burst/.test(all)) kind = "burst";
    else if (/spread|cloud|fog/.test(all)) kind = "spread";
    else if (/sphere/.test(all)) kind = "sphere";
    else if (/summoned|creature[s]? summoned|called/.test(eff)) kind = "summon";
    else if (/sensor|eye/.test(eff)) kind = "sensor";
    else if (/symbol|rune|glyph|mark/.test(eff)) kind = "symbol";
    else if (/^you\b|^personal/.test(tgt) || (!tgt && /^personal/.test(s.range.toLowerCase()))) kind = "self";
    else if (/touched/.test(tgt)) kind = "touch";
    else if (/object|weapon|door|item/.test(tgt) && !/creature/.test(tgt)) kind = "object";
    else if (/creature/.test(tgt)) {
      kind = "targets";
      if (/level/.test(tgt)) count = 5;
      else {
        const n = tgt.match(/(?:up to )?(one|two|three|four|five|\d+)\s/);
        const words = { one: 1, two: 2, three: 3, four: 4, five: 5 };
        count = n ? words[n[1]] || +n[1] || 1 : 1;
      }
    }
    return { kind, count: Math.min(count, 8), radius, ...T.SHAPES[kind] };
  }

  function parseDice(desc) {
    const m = desc.match(/(\d+)d(\d+)(?:\s*(?:points of)?[^.]{0,40}?per (?:caster )?level|\/level)?/);
    if (!m) return null;
    return { count: +m[1], sides: +m[2], perLevel: /level/.test(m[0]) };
  }

  const FAMILY_RE = [
    [/^(greater|lesser|mass|improved|communal|major|minor)\s+(.+)$/i, (m) => [m[2], m[1]]],
    [/^(.+?),\s*(greater|lesser|mass|improved|communal|major|minor)$/i, (m) => [m[1], m[2]]],
    [/^(.+?)\s+(I|II|III|IV|V|VI|VII|VIII|IX|\d)$/, (m) => [m[1], m[2]]],
  ];
  function family(name) {
    for (const [re, f] of FAMILY_RE) {
      const m = name.match(re);
      if (m) {
        const [base, mod] = f(m);
        return { base: base.toLowerCase(), mod: mod.toLowerCase() };
      }
    }
    return { base: name.toLowerCase(), mod: null };
  }

  function traditions(levels) {
    const t = new Set();
    const map = {
      arcane: ["wizard", "sorcerer", "arcanist", "magus", "bard", "summoner", "witch", "bloodrager", "skald"],
      divine: ["cleric", "oracle", "paladin", "inquisitor", "warpriest", "antipaladin"],
      nature: ["druid", "ranger", "hunter", "shaman"],
      occult: ["psychic", "medium", "mesmerist", "occultist", "spiritualist"],
      alchemy: ["alchemist", "investigator"],
    };
    for (const k in map) if (map[k].some((c) => c in levels)) t.add(k);
    return [...t];
  }

  // Zeichen (Modifikatoren) aus Gestalt und Text ableiten
  function signs(s, shape) {
    const out = [];
    const addSign = (id, dir) => {
      if (!out.some((x) => x.id === id)) out.push({ id, dir, ...T.SIGNS[id] });
    };
    const shapeSigns = {
      cone: [["direction", "out"], ["dispersion", "out"]],
      line: [["column", "out"], ["direction", "out"]],
      ray: [["column", "out"], ["convergence", "in"]],
      burst: [["diamond", "out"]],
      spread: [["dispersion", "out"], ["diamond", "out"]],
      emanation: [["diamond", "out"]],
      cylinder: [["column", "out"], ["diamond", "out"]],
      wall: [["weave", "out"], ["column", "out"]],
      sphere: [["diamond", "out"]],
      cube: [["diamond", "out"]],
      touch: [["window", "in"], ["convergence", "in"]],
      self: [["window", "in"]],
      targets: [["convergence", "in"], ["direction", "out"]],
      object: [["window", "in"]],
      summon: [["collection", "in"]],
      sensor: [["vision", "out"], ["bird", "out"]],
      symbol: [["window", "in"]],
      other: [],
    }[shape.kind];
    for (const [id, dir] of s.signHint || []) addSign(id, dir);
    for (const [id, dir] of shapeSigns) addSign(id, dir);
    const text = (s.name + " " + s.effect + " " + s.area + " " + s.description.slice(0, 500)).toLowerCase();
    for (const [re, id, dir] of T.SIGN_RULES) if (re.test(text)) addSign(id, dir);
    return out.slice(0, 4);
  }

  function analyze(s) {
    const components = parseComponents(s.components);
    const fam = family(s.name);
    const ess = essences(s, components);
    const shape = parseShape(s);
    const model = {
      spell: s,
      id: s.id,
      name: s.name,
      level: spellLevel(s),
      school: s.school || "universal",
      schoolInfo: T.SCHOOLS[s.school] || T.SCHOOLS.universal,
      subschools: s.subschool.filter((x) => T.SUBSCHOOLS[x]),
      descriptors: s.descriptors,
      essences: ess,
      primary: ess[0].id,
      combo: ess[1] ? T.comboName(ess[0].id, ess[1].id) : null,
      tension: ess.filter((e) => e.pct >= 15).some((e) => ess.some((o) => o.pct >= 15 && T.ESS[e.id].opp === o.id)),
      shape,
      signs: signs(s, shape),
      range: parseRange(s.range || ""),
      duration: parseDuration(s.duration || ""),
      casting: parseCasting(s.casting_time || ""),
      components,
      save: parseSave(s.saving_throw || ""),
      sr: { yes: /^yes/i.test(s.spell_resistance), harmless: /harmless/i.test(s.spell_resistance) },
      dice: parseDice(s.description),
      family: fam,
      classCount: Object.keys(s.levels).length,
      traditions: traditions(s.levels),
      mythic: !!s.mythic,
      seed: U.hash(s.id),
      familySeed: U.hash(fam.base),
    };
    return model;
  }

  // Statistik über alle Zauber: durchschnittliches Essenzprofil je Schule
  function schoolAffinities(models) {
    const out = {};
    for (const m of models) {
      const o = (out[m.school] = out[m.school] || { n: 0, ess: {} });
      o.n++;
      for (const e of m.essences) o.ess[e.id] = (o.ess[e.id] || 0) + e.pct;
    }
    for (const k in out) for (const e in out[k].ess) out[k].ess[e] /= out[k].n;
    return out;
  }

  window.analyze = analyze;
  window.schoolAffinities = schoolAffinities;
  window.spellLevel = spellLevel;
})();

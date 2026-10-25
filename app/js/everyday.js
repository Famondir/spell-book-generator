// Baut aus data/everyday_spells.js vollständige Zauberobjekte und hängt sie an window.SPELLS an.
// Regelfelder, die ein Alltagszauber nicht selbst angibt, erbt er vom Basiszauber.
(function () {
  // Profil: eigene Alltagszauber ergänzen, einzelne ausblenden, Flavour ersetzen
  const P = (window.PROFILE && window.PROFILE.everyday) || {};
  const removed = new Set(P.remove || []);
  const list = [...(window.EVERYDAY_SPELLS || []), ...(P.add || [])].filter((e) => !removed.has(e.name));
  const sources = window.EVERYDAY_SOURCES || {};
  const byName = new Map(window.SPELLS.map((s) => [s.name.toLowerCase(), s]));
  const slug = (n) => n.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const INHERIT = ["casting_time", "components", "range", "duration", "saving_throw", "spell_resistance"];

  for (const e of list) {
    const base = byName.get(String(e.base).toLowerCase());
    if (!base) {
      console.warn("Alltagszauber ohne Basiszauber:", e.name, e.base);
      continue;
    }
    const ownShape = e.target != null || e.area != null || e.effect != null;
    const school = e.school || base.school;
    const subschool = e.subschool ? [].concat(e.subschool) : e.school ? [] : base.subschool;
    const descriptors = e.descriptors || base.descriptors;
    const s = {
      id: "alltag-" + slug(e.name),
      name: e.name,
      everyday: true,
      base: base.name,
      baseLevels: base.levels,
      pfs: false,
      source: `Alltagszauber · Sonderform von ${base.name}`,
      school,
      subschool,
      descriptors,
      school_raw: school + (subschool.length ? ` (${subschool.join(", ")})` : "") + (descriptors.length ? ` [${descriptors.join(", ")}]` : ""),
      levels: { alltag: 0 },
      target: ownShape ? e.target || "" : base.target,
      area: ownShape ? e.area || "" : base.area,
      effect: ownShape ? e.effect || "" : base.effect,
      description: e.description,
      flavor: (P.flavor && P.flavor[e.name]) || e.flavor || "",
      inspiration: e.inspiration ? sources[e.inspiration] || null : null,
      baseSource: base.source,
      essHint: e.ess || null,
      signHint: e.signs || null,
      // selbst angegebene Regelfelder (der Rest ist geerbt; für deutsche Regeltexte wichtig)
      ownFields: [...INHERIT, "target", "area", "effect"].filter((k) => e[k] != null),
    };
    for (const k of INHERIT) s[k] = e[k] != null ? e[k] : base[k];
    window.SPELLS.push(s);
  }
})();

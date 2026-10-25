// Regelangaben in der Regelsprache (I18N.lang.rules): Name, Werte, Regeltext, Quelle.
// Deutsch: aus den lokalen Regeldaten (data/rules.de.local.js → window.RULES_DE, erzeugt von
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

  // Länge „N ft.“ → Einheit der Einstellung
  const ft = (s) => s.replace(/(\d+(?:,\d+)?)[- ]?(?:ft\.?|feet|foot)/g, (m, n) => I18N.len(+n.replace(",", "")));
  const RULES_TERMS = [
    // Zeitaufwand
    [/\b1 standard action\b/gi, "1 Standard-Aktion"], [/\bstandard action\b/gi, "Standard-Aktion"], [/\bswift action\b/gi, "Schnelle Aktion"], [/\bimmediate action\b/gi, "Augenblickliche Aktion"], [/\bfull[- ]round action\b/gi, "Volle Aktion"], [/\bfull round\b/gi, "Volle Runde"],
    // Reichweite
    [/^personal\b/i, "Persönlich"], [/^touch\b/i, "Berührung"], [/^close \(25 ft\. \+ 5 ft\.\/2 levels\)/i, () => `Nah (${I18N.len(25)} + ${I18N.len(5)}/2 Stufen)`], [/^medium \(100 ft\. \+ 10 ft\.\/level\)/i, () => `Mittel (${I18N.len(100)} + ${I18N.len(10)}/Stufe)`], [/^long \(400 ft\. \+ 40 ft\.\/level\)/i, () => `Lang (${I18N.len(400)} + ${I18N.len(40)}/Stufe)`], [/^unlimited\b/i, "Unbegrenzt"],
    // Dauer
    [/^instantaneous\b/i, "Augenblicklich"], [/^permanent\b/i, "Permanent"], [/^concentration\b/i, "Konzentration"], [/until discharged/gi, "bis entladen"], [/\(D\)/g, "(A)"],
    [/(\d+) rounds?\/level/gi, "$1 Runde/Stufe"], [/(\d+) min\.\/level/gi, "$1 Min./Stufe"], [/(\d+) minutes?\/level/gi, "$1 Minute/Stufe"], [/(\d+) hours?\/level/gi, "$1 Stunde/Stufe"], [/(\d+) days?\/level/gi, "$1 Tag/Stufe"], [/\/level\b/g, "/Stufe"], [/\/(\d) levels\b/g, "/$1 Stufen"],
    [/\b1 round\b/gi, "1 Runde"], [/(\d+) rounds\b/gi, "$1 Runden"], [/\b1 minute\b/gi, "1 Minute"], [/(\d+) minutes\b/gi, "$1 Minuten"], [/\b1 hour\b/gi, "1 Stunde"], [/(\d+) hours\b/gi, "$1 Stunden"], [/\b1 day\b/gi, "1 Tag"], [/(\d+) days\b/gi, "$1 Tage"], [/\blevels?\b/gi, "Stufe"],
    // Rettungswurf, ZR
    [/^Will\b/, "Willen"], [/^Fortitude\b/, "Zähigkeit"], [/^Fort\b/, "Zähigkeit"], [/^none\b/i, "Keiner"], [/^no\b/i, "Nein"], [/^yes\b/i, "Ja"],
    [/ negates\b/g, ", keine Wirkung"], [/ half\b/g, ", halbiert"], [/ partial\b/g, ", teilweise"], [/ disbelief\b/g, ", anzweifeln"],
    [/\bharmless\b/g, "harmlos"], [/\bobjects?\b/g, "Gegenstand"], [/\bsee text\b/gi, "siehe Text"], [/\bsee below\b/gi, "siehe unten"],
    // Ziele, Bereiche (häufige Wendungen)
    [/^you\b/i, "Du"], [/^creature touched\b/i, "Berührte Kreatur"], [/^one creature\b/i, "Eine Kreatur"], [/^object touched\b/i, "Berührter Gegenstand"], [/^one object\b/i, "Ein Gegenstand"],
    [/(\d+)-ft\.-radius spread/gi, (m, n) => `Ausbreitung mit ${I18N.len(+n)} Radius`], [/(\d+)-ft\.-radius emanation/gi, (m, n) => `Ausstrahlung mit ${I18N.len(+n)} Radius`], [/(\d+)-ft\.-radius burst/gi, (m, n) => `Explosion mit ${I18N.len(+n)} Radius`], [/cone-shaped burst/gi, "kegelförmige Explosion"], [/\bline\b/g, "Linie"],
  ];
  const term = (v) => {
    if (!v) return v;
    let s = String(v);
    for (const [re, rep] of RULES_TERMS) s = s.replace(re, rep);
    return ft(s);
  };
  const compDe = (c) => term(String(c || "").replace(/\bS\b/g, "G").replace(/\bDF\b/g, "GF"));
  const schoolDe = (s) => (SCHOOL[s.school] || s.school) + ((s.subschool || []).length ? ` (${s.subschool.map((x) => SUB[x] || x).join(", ")})` : "") + ((s.descriptors || []).length ? ` [${s.descriptors.map((x) => DESC[x.toLowerCase()] || x).join(", ")}]` : "");
  const levelsDe = (lv) => Object.entries(lv).map(([k, v]) => `${CLASS[k] || k} ${v}`).join(", ");

  // --- Name --------------------------------------------------------------------------------
  // Name in der Regelsprache; other(): der andere Name, falls er abweicht
  function name(x) {
    const s = spellOf(x);
    if (!s) return "";
    if (s.everyday) return s.name;
    const d = data(s);
    return d ? d.name : s.name;
  }
  function other(x) {
    const s = spellOf(x);
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
    return { text: s.description || "", lang: s.everyday ? "de" : "en" };
  }

  // Quelle: deutsche Fundstelle (Kürzel und Seite) und englische
  function source(x) {
    const s = spellOf(x);
    const d = data(s);
    return { de: d ? d.source : "", en: s.source || "" };
  }

  // gibt es deutsche Regeldaten überhaupt (für Hinweise)?
  const hasData = () => !!window.RULES_DE;
  const covered = (x) => !!data(spellOf(x));

  window.RULES = { name, other, fields, text, source, term, hasData, covered, de };
})();

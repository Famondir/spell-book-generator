// Heilige Farben der Gottheiten als Farbstoffe der Werkstatt: data/deities.js kennt nur Grundfarben („blue“), und
// viele Gottheiten teilen sich dieselbe. Hier bekommt jede Gottheit je Grundfarbe einen festen Farbstoff
// (Ultramarin, Azurit, Indigo …) mit eigenem Farbwert. Tafel der Zeit, Andachtsbild und Vademecum lesen dieselben
// Werte. Ergänzt je Farbe: de (Name des Farbstoffs bzw. deutscher Farbname), base (Grundfarbwert aus deities.js);
// name bleibt die Grundfarbe (für die Steine der Intarsie).
(function () {
  const PIGMENTS = {
    blue: [["Ultramarin", "#23408e"], ["Azurit", "#2f6db5"], ["Indigo", "#2b2e68"], ["Smalte", "#5a77b3"], ["Waid", "#3d5f82"], ["Kornblumenblau", "#4766c8"]],
    red: [["Zinnober", "#c23b22"], ["Krapprot", "#9e2a3a"], ["Mennige", "#d2552c"], ["Drachenblut", "#7d1f1f"], ["Karmin", "#a3142e"], ["Rötel", "#a5482f"], ["Kermes", "#8b1a33"]],
    black: [["Beinschwarz", "#2a2420"], ["Rebschwarz", "#36322b"], ["Lampenruß", "#1d1b1a"], ["Eisengallustinte", "#2d2a3a"]],
    green: [["Grünspan", "#3f8f6e"], ["Malachit", "#2f7d4b"], ["Saftgrün", "#5b7f2e"], ["Grüne Erde", "#6b7d58"]],
    white: [["Bleiweiß", "#f2ede0"], ["Kreideweiß", "#e9e3d3"], ["Muschelweiß", "#f6f1e8"], ["Kalkweiß", "#eeebe2"], ["Knochenweiß", "#ece2cc"]],
    gold: [["Blattgold", "#c99a2e"], ["Muschelgold", "#d4a21c"], ["Goldocker", "#c58f2a"], ["Feingold", "#e0b43a"]],
    yellow: [["Auripigment", "#e2b53a"], ["Safran", "#e8a21e"], ["Schüttgelb", "#d9c040"]],
    brown: [["Umbra", "#6e4524"], ["Sepia", "#5c4030"], ["Siena", "#8a4f2a"]],
    gray: [["Schiefergrau", "#6b6f73"], ["Aschgrau", "#8a8580"], ["Zinngrau", "#9b9b96"]],
    silver: [["Silber", "#c7cbd0"], ["Zinn", "#b4b8ba"]],
    orange: [["Mennige", "#d2552c"], ["Realgar", "#d9701c"]],
  };
  // ausgesuchte Farbstoffe für die bekanntesten Gottheiten (je Grundfarbe verschieden); alle übrigen nach dem Namen
  const CHOSEN = {
    desna: { blue: "Azurit", white: "Muschelweiß" }, gozreh: { blue: "Waid", green: "Saftgrün" }, pharasma: { blue: "Indigo", white: "Knochenweiß" },
    sarenrae: { blue: "Ultramarin", gold: "Muschelgold" }, irori: { blue: "Kornblumenblau", white: "Kreideweiß" },
    asmodeus: { red: "Karmin", black: "Lampenruß" }, gorum: { red: "Rötel", gray: "Zinngrau" }, iomedae: { red: "Zinnober", white: "Bleiweiß" },
    lamashtu: { red: "Krapprot", yellow: "Auripigment" }, rovagug: { red: "Mennige", brown: "Siena" }, urgathoa: { red: "Kermes", green: "Grünspan" },
    "zon-kuthon": { red: "Drachenblut" }, calistria: { black: "Rebschwarz", yellow: "Safran" }, nethys: { black: "Eisengallustinte", white: "Kalkweiß" },
    norgorber: { black: "Beinschwarz", gray: "Aschgrau" }, erastil: { green: "Grüne Erde", brown: "Umbra" }, abadar: { gold: "Blattgold", silver: "Silber" },
    torag: { gold: "Goldocker", gray: "Schiefergrau" }, "cayden-cailean": { silver: "Zinn" }, aroden: { green: "Malachit", gold: "Feingold" },
  };
  // heilige Farben, die in den Archives of Nethys fehlen (Quelle je Eintrag); Grundfarbwerte wie in deities.js
  const SUPPLEMENT = {
    aroden: [["green", "#2f7d3b"], ["gold", "#d4a21c"]], // PathfinderWiki, „Aroden“
  };
  const DE = {
    "dark gray": "Dunkelgrau", "light gray": "Hellgrau", "iron gray": "Eisengrau", "lead gray": "Bleigrau", "dark blue": "Dunkelblau",
    "midnight blue": "Mitternachtsblau", "light blue": "Hellblau", "icy blue": "Eisblau", "ice blue": "Eisblau", ivory: "Elfenbein",
    pink: "Rosa", purple: "Purpur", violet: "Violett", tan: "Lohfarben", bronze: "Bronze", crystal: "Kristall", "pale green": "Blassgrün",
    "dark green": "Dunkelgrün", crimson: "Karmesin", "pale yellow": "Blassgelb",
  };
  const hash = (t) => [...String(t)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  function pigment(deityId, name) {
    const pool = PIGMENTS[name];
    if (!pool) return null;
    const want = (CHOSEN[deityId] || {})[name];
    return pool.find((p) => p[0] === want) || pool[hash(deityId) % pool.length];
  }
  for (const d of window.DEITIES || []) {
    if ((!d.colors || !d.colors.length) && SUPPLEMENT[d.id]) d.colors = SUPPLEMENT[d.id].map(([name, hex]) => ({ name, hex }));
    for (const c of d.colors || []) {
      const p = pigment(d.id, c.name);
      c.base = c.hex;
      if (p) [c.de, c.hex] = p;
      else c.de = DE[c.name] || c.name;
    }
  }
  window.DEITY_COLORS = { PIGMENTS, pigment };
})();

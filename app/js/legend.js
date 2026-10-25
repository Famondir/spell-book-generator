// Glyphenlegenden aus einer Quelle für „Lehre der Kreise“ (Buch-Vorspann) und Lehrheft.
// Jede Legende liefert Einträge { id, glyph, name, latin, sub }; das Aussehen bestimmt der Ort
// (grid: Legendenraster im Vorspann, table: Tabellenzeilen im Lehrheft).
(function () {
  const T = window.THEORY;
  const e = U.esc;
  const quickSVG = (k) => `<svg class="quick" viewBox="-40 -40 80 80">${(QUICK_SCHOOL[k] || QUICK_SCHOOL.universal)()}</svg>`;

  const schools = (s = 12) => Object.entries(T.SCHOOLS).map(([k, x]) => ({ id: k, glyph: glyphSVG("school", k, { s }), name: x.de, latin: x.latin, sub: `${x.figure} · ${x.verb}` }));
  // sub: "plane" (Ebene und Gegenpol) oder "corr" (Stunde, Farbe, Metall, Richtung)
  function essences(s = 9, sub = "plane") {
    const C = (window.TEXTGEN && TEXTGEN.CORRESPOND) || {};
    return T.ESSENCES.map((x) => {
      const c = C[x.id] || {};
      return { id: x.id, glyph: glyphSVG("essence", x.id, { s }), name: x.latin, de: x.de, opp: T.ESS[x.opp].latin, sub: sub === "corr" ? [c.hour, c.color, c.metal, c.dir].filter(Boolean).join(" · ") : `${x.plane} · Gegenpol: ${T.ESS[x.opp].latin}` };
    });
  }
  const signs = (s = 8) => Object.entries(T.SIGNS).map(([k, x]) => ({ id: k, glyph: glyphSVG("sign", k, { s }), name: x.de, sub: x.text }));
  const alchemy = (s = 8) => Object.entries(T.ALCHEMY).map(([k, x]) => ({ id: k, glyph: glyphSVG("alch", k, { s }), name: x, plain: true }));
  // Kurzfiguren der Schulen; full: zusätzlich das volle Kernsiegel (Schlüssel im Lehrheft)
  const quickSchools = (s = 12) => Object.entries(T.SCHOOLS).map(([k, x]) => ({ id: k, glyph: quickSVG(k), full: glyphSVG("school", k, { s }), name: x.de }));
  // Was die Striche einer Schnellglyphe sagen
  const QUICK_RULES = [
    ["Kreis", "geschlossen, wenn die Formel andauert; doppelt, wenn sie bleibt; oben offen, wenn sie augenblicklich wirkt."],
    ["Kurzfigur der Schule", "im Kreis: die Kurzform des Kernsiegels."],
    ["Hauptessenz", "in der Mitte, in Rubrik: dasselbe Zeichen wie im Essenzring."],
    ["Gestaltstrich", "außen oben: Pfeil (Strahl, Ziel), Keil (Kegel), Doppelstrich (Linie), vier Striche (Fläche), Bogen (Ausströmung), Kerben (Berührung), Schleife (selbst)."],
    ["Punkte", "unten: einer je Ordnung; Zaubertricks haben keine."],
  ];
  const quickRules = () => `<ol class="laws">${QUICK_RULES.map(([k, v]) => `<li><b>${e(k)}:</b> ${e(v)}</li>`).join("")}</ol>`;

  // Darstellungen
  const label = (x) => x.plain ? e(x.name) : `<b>${e(x.name)}</b>${x.latin ? ` <i>${e(x.latin)}</i>` : ""}${x.de ? ` – ${e(x.de)}` : ""}`;
  const grid = (items, cls) => `<div class="legend-grid ${cls || ""}">${items.map((x) => `<div class="lg">${x.glyph}<div>${label(x)}${x.sub ? `<br><span>${e(x.sub)}</span>` : ""}</div></div>`).join("")}</div>`;
  const table = (items, cls) => `<div class="pr-table ${cls || ""}">${items.map((x) => `<div class="pr-row">${x.glyph}<div>${label(x)}${x.opp && !x.sub.includes("Gegenpol") ? ` <span class="opp">⟷ ${e(x.opp)}</span>` : ""}${x.sub ? `<br><span class="corr">${e(x.sub)}</span>` : ""}</div></div>`).join("")}</div>`;

  window.LEGEND = { schools, essences, signs, alchemy, quickSchools, quickRules, grid, table };
})();

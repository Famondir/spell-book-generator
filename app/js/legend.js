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
    ["Kreis", "nach der Dauer, eine einfache Form des Dauerrings (Tafel „Kreise nach der Dauer“)."],
    ["Kurzfigur der Schule", "im Kreis: die Kurzform des Kernsiegels."],
    ["Hauptessenz", "in der Mitte, in Rubrik: dasselbe Zeichen wie im Essenzring."],
    ["Absicht", () => "neben der Figur, links und rechts (beim Auge und bei den zwei Kreisen oben und unten, beim Kreuz schräg oben): die Anfangszeichen von Verb und Essenzwort der Kernzeile, " +
      (window.SCRIPTS && SCRIPTS.mode() === "latin"
        ? "in Umschrift: Großbuchstaben, auch bei Formeln aus fremden Sprachen, deren Anlaute so stehen, wie die Gelehrten sie umschreiben (Š, Ḫ, Ph)."
        : "in der Schrift ihrer Sprache: lateinische Großbuchstaben, griechische Kleinbuchstaben, das erste Keilschriftzeichen, das erste Lautzeichen der Hieroglyphen, ein Ogham-Strich oder ein Zeichen der Ursprache.")],
    ["Gestaltstrich", "außen oben am äußersten Ring, einer je Gestalt (Tafel „Gestaltstriche“); bei Zielen ein Strich mit Knoten je Ziel, höchstens drei."],
    ["Punkte", "unten: einer je Ordnung; Zaubertricks haben keine."],
  ];
  // Tafeln: Kreisformen je Dauer und Gestaltstriche, jeweils mit kleiner Vorschau
  const QUICK_RING_ITEMS = [
    ["instant", "oben offen"], ["rounds", "zwei Zeitmarken"], ["minutes", "gestrichelt"], ["hours", "doppelt"],
    ["days", "dreifach"], ["permanent", "mit Schwanz"], ["concentration", "mit Faden"], ["special", "rechts offen"],
  ];
  const QUICK_SHAPE_ITEMS = [
    ["ray", "Pfeil hinaus"], ["touch", "Pfeil herein"], ["targets", "Knoten", 1], ["targets", "zwei Knoten", 2], ["targets", "drei Knoten", 3],
    ["cone", "Keil"], ["line", "Doppelstrich"], ["burst", "Schrägstrahlen"], ["spread", "Welle"], ["emanation", "Bogen"],
    ["cylinder", "T"], ["wall", "Querstrich"], ["sphere", "Kreis mit Gürtel"], ["cube", "Quadrat"], ["object", "volles Quadrat"],
    ["self", "Schleife"], ["summon", "Tor"], ["sensor", "Auge"], ["symbol", "Rune"], ["other", "Schale"],
  ];
  const quickRings = () => QUICK_RING_ITEMS.map(([k, sub]) => ({ id: k, glyph: QUICK_PART.ring(k), name: T.DURATIONS[k].de, sub }));
  const quickShapes = () => QUICK_SHAPE_ITEMS.map(([k, sub, n]) => ({ id: k + (n || ""), glyph: QUICK_PART.shape(k, n), name: k === "targets" ? (n === 1 ? "ein Ziel" : n === 2 ? "zwei Ziele" : "drei und mehr") : T.SHAPES[k].de, sub }));
  // split: jede Regel als eigene Liste (fortlaufend nummeriert), damit der Satz zwischen ihnen umbrechen kann
  const quickRules = (split = false) => {
    const li = ([k, v]) => `<li><b>${e(k)}:</b> ${e(typeof v === "function" ? v() : v)}</li>`;
    return split ? QUICK_RULES.map((r, i) => `<ol class="laws" start="${i + 1}">${li(r)}</ol>`).join("") : `<ol class="laws">${QUICK_RULES.map(li).join("")}</ol>`;
  };
  // Woher die Buchstaben kommen: lateinische Kernzeile eines Beispiels, Anfangsbuchstaben hervorgehoben
  function quickSource(m) {
    const c = TEXTGEN.coreChoice(m), X = FORMULA.get("latin").lex;
    const w = (x) => `<b>${e(x[0])}</b>${e(x.slice(1))}`;
    return `<p class="quick-src">Die Absicht steht in der Kernzeile: <i>${w(U.cap(c.imp))} ${w(c.ess)}, ${e(X.shape[m.shape.kind])}!</i> ergibt ${e(c.letters[0])} und ${e(c.letters[1])}. So teilen sich keine zwei Formeln derselben Liste eine Schnellglyphe.</p>`;
  }

  // Darstellungen
  const label = (x) => x.plain ? e(x.name) : `<b>${e(x.name)}</b>${x.latin ? ` <i>${e(x.latin)}</i>` : ""}${x.de ? ` – ${e(x.de)}` : ""}`;
  const grid = (items, cls) => `<div class="legend-grid ${cls || ""}">${items.map((x) => `<div class="lg">${x.glyph}<div>${label(x)}${x.sub ? `<br><span>${e(x.sub)}</span>` : ""}</div></div>`).join("")}</div>`;
  const table = (items, cls) => `<div class="pr-table ${cls || ""}">${items.map((x) => `<div class="pr-row">${x.glyph}<div>${label(x)}${x.opp && !x.sub.includes("Gegenpol") ? ` <span class="opp">⟷ ${e(x.opp)}</span>` : ""}${x.sub ? `<br><span class="corr">${e(x.sub)}</span>` : ""}</div></div>`).join("")}</div>`;

  // Kacheln: Vorschau oben, Name und Zusatz darunter (n Spalten)
  const tiles = (items, n, cls) => `<div class="legend-tiles c${n} ${cls || ""}">${items.map((x) => `<figure>${x.glyph}<figcaption>${e(x.name)}${x.sub ? `<br><span>${e(x.sub)}</span>` : ""}</figcaption></figure>`).join("")}</div>`;

  window.LEGEND = { schools, essences, signs, alchemy, quickSchools, quickRings, quickShapes, quickRules, quickSource, grid, table, tiles };
})();

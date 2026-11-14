// Originalschriften der Formelsprachen: Übertragung aus der Lautschrift der Lexika (data/formula-lang/*.js).
// Die Lautschrift ist unabhängig von der Lesesprache, daher auch das Ergebnis. Eine Sprache wählt ihre Schrift mit
// lang.script; ohne Angabe gilt Lateinschrift. Die Ursprache (Urindogermanisch) hat Strichzeichen ohne Schriftdatei:
// write() liefert dafür Zeichen aus dem privaten Bereich (U+E000 + Nummer), das Band zeichnet sie als Pfade.
(function () {
  // Lautschrift → Laute: längste Folge zuerst
  function tokenize(word, digraphs) {
    const out = [];
    const keys = Object.keys(digraphs).sort((a, b) => b.length - a.length);
    for (let i = 0; i < word.length; ) {
      const k = keys.find((d) => word.startsWith(d, i));
      if (k) (out.push(digraphs[k]), (i += k.length));
      else out.push(word[i++]);
    }
    return out;
  }
  const VOW = new Set(["a", "e", "i", "u", "o"]);
  // Wörter einer Zeile übertragen; Satzzeichen fallen weg, der Trenner · bleibt
  const words = (text, fn, join = " ") =>
    String(text).toLowerCase().replace(/[!,.;:?]/g, "").split(/\s+/).filter(Boolean).map((w) => (w === "·" ? "·" : fn(w))).join(join);

  // ---------------------------------------------------------------------------
  // Keilschrift (Hethitisch, Akkadisch, Sumerisch): silbisch, CV + VC, Silbenende ohne VC-Zeichen mit Stützvokal i.
  // Zeichen über die Unicode-Namen; Nebenlesungen nach den üblichen Zeichenlisten (pu = BU, ši = IGI, wa = PI, aḫ = ḪI×NUN …)
  // ---------------------------------------------------------------------------
  const CUN = { a: "𒀀", e: "𒂊", i: "𒄿", u: "𒌋", ba: "𒁀", ab: "𒀊", be: "𒁁", eb: "𒅁", bi: "𒁉", ib: "𒅁", bu: "𒁍", ub: "𒌒", da: "𒁕", ad: "𒀜", de: "𒁲", ed: "𒀉", di: "𒁲", id: "𒀉", du: "𒁺", ud: "𒌓", ga: "𒂵", ag: "𒀝", ge: "𒄀", eg: "𒅅", gi: "𒄀", ig: "𒅅", gu: "𒄖", ug: "𒊌", ha: "𒄩", ah: "𒄴", he: "𒄭", eh: "𒄴", hi: "𒄭", ih: "𒄴", hu: "𒄷", uh: "𒄴", ka: "𒅗", ak: "𒀝", ke: "𒆠", ek: "𒅅", ki: "𒆠", ik: "𒅅", ku: "𒆪", uk: "𒊌", la: "𒆷", al: "𒀠", le: "𒇷", el: "𒂖", li: "𒇷", il: "𒅋", lu: "𒇻", ul: "𒌌", ma: "𒈠", am: "𒄠", me: "𒈨", em: "𒅎", mi: "𒈪", im: "𒅎", mu: "𒈬", um: "𒌝", na: "𒈾", an: "𒀭", ne: "𒉈", en: "𒂗", ni: "𒉌", in: "𒅔", nu: "𒉡", un: "𒌦", pa: "𒉺", ap: "𒀊", pe: "𒉿", ep: "𒅁", pi: "𒉿", ip: "𒅁", pu: "𒁍", up: "𒌒", qa: "𒅗", aq: "𒀝", qe: "𒆠", eq: "𒅅", qi: "𒆠", iq: "𒅅", qu: "𒆪", uq: "𒊌", ra: "𒊏", ar: "𒅈", re: "𒊑", er: "𒅕", ri: "𒊑", ir: "𒅕", ru: "𒊒", ur: "𒌨", sa: "𒊓", as: "𒊍", se: "𒋛", es: "𒄑", si: "𒋛", is: "𒄑", su: "𒋢", us: "𒊻", sha: "𒊭", ash: "𒀸", she: "𒊺", esh: "𒅖", shi: "𒅆", ish: "𒅖", shu: "𒋗", ush: "𒍑", ta: "𒋫", at: "𒀜", te: "𒋼", et: "𒀉", ti: "𒋾", it: "𒀉", tu: "𒌅", ut: "𒌓", za: "𒍝", az: "𒊍", ze: "𒍣", ez: "𒄑", zi: "𒍣", iz: "𒄑", zu: "𒍪", uz: "𒊻", wa: "𒉿", we: "𒉿", wi: "𒉿", wu: "𒉿", ya: "𒅀" };
  const CUN_DIG = { kh: "h", sh: "sh", ts: "z", j: "y", c: "k", f: "p", v: "w", o: "u" };
  const cv = (c, v) => CUN[c + v] || CUN[c + (v === "e" ? "i" : v)] || (c === "y" ? CUN.i + CUN[v] : CUN[c + "i"]);
  function cuneiformWord(w) {
    const t = tokenize(w, CUN_DIG);
    let out = "";
    for (let i = 0; i < t.length; ) {
      // Silbe: höchstens ein Anfangskonsonant (weitere mit Stützvokal), Vokal, Endkonsonanten bis vor den letzten vor einem Vokal
      const ons = [];
      while (i < t.length && !VOW.has(t[i])) ons.push(t[i++]);
      if (i >= t.length) { out += ons.map((c) => cv(c, "i")).join(""); break; }
      const v = t[i++] === "o" ? "u" : t[i - 1];
      ons.slice(0, -1).forEach((c) => (out += cv(c, "i")));
      out += ons.length ? cv(ons[ons.length - 1], v) : CUN[v];
      let j = i;
      while (j < t.length && !VOW.has(t[j])) j++;
      const coda = t.slice(i, j < t.length ? j - 1 : j);
      coda.forEach((c, k) => (out += (k === 0 && CUN[v + c]) || cv(c, "i")));
      i += coda.length;
    }
    return out;
  }

  // ---------------------------------------------------------------------------
  // Hieroglyphen (Mittelägyptisch): Einkonsonantenzeichen, Schulvokal e entfällt; feste Schreibungen aus lex.scriptWords
  // ---------------------------------------------------------------------------
  const HIERO = {
    a: "𓄿", i: "𓇋", u: "𓅱", w: "𓅱", o: "𓅱", y: "𓏭", b: "𓃀", p: "𓊪", f: "𓆑", v: "𓆑", m: "𓅓", n: "𓈖", r: "𓂋", l: "𓂋",
    h: "𓉔", kh: "𓐍", s: "𓊃", z: "𓊃", sh: "𓈙", q: "𓈎", k: "𓎡", c: "𓎡", g: "𓎼", t: "𓏏", tj: "𓍿", d: "𓂧", dj: "𓆓", j: "𓆓", x: "𓎡𓊃",
  };
  const AYIN = "𓂝";
  function hieroWord(w) {
    const t = tokenize(w, { dj: "dj", tj: "tj", kh: "kh", sh: "sh", aa: "aa" });
    const out = t.filter((x) => x !== "e").map((x) => (x === "aa" ? HIERO.a + AYIN : HIERO[x] || "")).join("");
    return out || HIERO.i;
  }

  // ---------------------------------------------------------------------------
  // Griechisch: Buchstabe für Buchstabe, Hauchlaut am Wortanfang entfällt, Schluss-Sigma
  // ---------------------------------------------------------------------------
  const GREEK = { a: "α", b: "β", g: "γ", d: "δ", e: "ε", z: "ζ", i: "ι", k: "κ", l: "λ", m: "μ", n: "ν", x: "ξ", o: "ο", p: "π", r: "ρ", s: "σ", t: "τ", u: "υ", y: "υ",
    ph: "φ", th: "θ", kh: "χ", ps: "ψ", rh: "ρ", ch: "χ", c: "κ", f: "φ", w: "υ", v: "β", j: "ι", q: "κ", h: "" };
  function greekWord(w) {
    const t = tokenize(w, { ph: "ph", th: "th", kh: "kh", ps: "ps", rh: "rh", ch: "ch" });
    const s = t.map((x) => GREEK[x] ?? "").join("");
    return s.replace(/σ$/, "ς");
  }

  // ---------------------------------------------------------------------------
  // Ogham (Altirisch): Buchstabe für Buchstabe, Doppelvokale einfach, Zeile zwischen Federzeichen
  // ---------------------------------------------------------------------------
  const OGHAM = { b: "ᚁ", l: "ᚂ", f: "ᚃ", v: "ᚃ", s: "ᚄ", sh: "ᚄ", n: "ᚅ", h: "ᚆ", d: "ᚇ", t: "ᚈ", th: "ᚈ", c: "ᚉ", k: "ᚉ", kh: "ᚉ", q: "ᚊ",
    m: "ᚋ", g: "ᚌ", ng: "ᚍ", z: "ᚎ", r: "ᚏ", a: "ᚐ", o: "ᚑ", u: "ᚒ", w: "ᚒ", e: "ᚓ", i: "ᚔ", y: "ᚔ", j: "ᚔ", p: "ᚚ", x: "ᚉᚄ" };
  const oghamWord = (w) => tokenize(w.replace(/([aeiou])\1/g, "$1"), { kh: "kh", th: "th", sh: "sh", ng: "ng" }).map((x) => OGHAM[x] || "").join("");

  // ---------------------------------------------------------------------------
  // Ursprache (Urindogermanisch): Strichzeichen auf einem 6×10-Raster; Vokale ohne Stab, Konsonanten am senkrechten Stab
  // ---------------------------------------------------------------------------
  const STAB = "M3,0 L3,10 ";
  const PROTO_SIGNS = [
    ["a", "M0,10 L3,0 L6,10"], ["e", "M0,0 L6,0 M0,5 L6,5 M0,10 L6,10"], ["i", "M3,0 L3,10 M1,0 L5,0"], ["o", "M3,0 L6,5 L3,10 L0,5 Z"], ["u", "M0,0 L3,10 L6,0"],
    ["p", STAB + "M3,0 L6,3"], ["b", STAB + "M3,0 L6,3 M3,4 L6,7"], ["bh", STAB + "M3,0 L6,3 M3,4 L6,7 M3,8 L6,10"],
    ["t", STAB + "M3,0 L0,3"], ["d", STAB + "M3,0 L0,3 M3,4 L0,7"], ["dh", STAB + "M3,0 L0,3 M3,4 L0,7 M3,8 L0,10"],
    ["k", STAB + "M6,2 L3,5 L6,8"], ["g", STAB + "M6,2 L3,5 L6,8 M0,5 L3,5"], ["gh", STAB + "M6,2 L3,5 L6,8 M0,2 L3,5 L0,8"],
    ["kw", STAB + "M6,2 L3,5 L6,8 M1,0 L5,0"], ["gw", STAB + "M6,2 L3,5 L6,8 M0,5 L3,5 M1,0 L5,0"], ["gwh", STAB + "M6,2 L3,5 L6,8 M0,2 L3,5 L0,8 M1,0 L5,0"],
    ["s", "M0,0 L6,3 L0,6 L6,10"], ["m", STAB + "M0,3 L3,0 L6,3"], ["n", STAB + "M0,7 L3,10 L6,7"], ["l", STAB + "M3,10 L6,10"],
    ["r", STAB + "M3,0 L6,2.5 L3,5"], ["w", "M0,0 L1.5,10 L3,4 L4.5,10 L6,0"], ["y", "M0,0 L3,5 L6,0 M3,5 L3,10"], ["h", STAB + "M0,5 L6,5"],
  ];
  const PROTO_ID = Object.fromEntries(PROTO_SIGNS.map(([k], i) => [k, String.fromCharCode(0xe000 + i)]));
  const PROTO_ALIAS = { c: "k", q: "kw", f: "bh", v: "w", j: "y", x: "k", z: "s" };
  const protoWord = (w) =>
    tokenize(w, { gwh: "gwh", gw: "gw", kw: "kw", bh: "bh", dh: "dh", gh: "gh" }).map((x) => PROTO_ID[x] || PROTO_ID[PROTO_ALIAS[x]] || "").join("");
  // Pfad eines Ursprache-Zeichens (Zeichen aus write) oder null
  const protoPath = (ch) => (PROTO_SIGNS[ch.charCodeAt(0) - 0xe000] || [])[1] || null;

  // ---------------------------------------------------------------------------
  // Schriften: Wortübertragung, Bandtrenner, Großbuchstaben im Band, Schriftgröße im Band und Laufweite je Zeichen
  // (gemessen im Browser, im Verhältnis zur bewährten 9,2 der Lateinschrift), Größe der Absichtszeichen
  // ---------------------------------------------------------------------------
  const SCRIPTS = {
    latin: { word: (w) => w, sep: " · ", upper: true, size: 13, advance: 9.2, mark: 16, cls: "" },
    greek: { word: greekWord, sep: " · ", upper: true, size: 13, advance: 9.1, mark: 17, cls: "script-greek" },
    ogham: { word: oghamWord, sep: " ", frame: ["᚛", "᚜"], join: "\u1680", upper: false, size: 13, advance: 8.4, mark: 18, qlRotate: true, cls: "script-ogham" },
    cuneiform: { word: cuneiformWord, sep: " · ", upper: false, size: 14, advance: 17.7, mark: 19, cls: "script-cuneiform" },
    hieroglyphs: { word: hieroWord, sep: " · ", upper: false, size: 15, advance: 12.9, mark: 21, cls: "script-hieroglyphs" },
    proto: { word: protoWord, sep: " · ", upper: false, size: 13, advance: 9, mark: 16, cls: "script-proto", glyphs: true },
  };
  for (const [k, v] of Object.entries(SCRIPTS)) v.key = k;
  // Breite einer Zeichenfolge im Band: Laufweiten aus app/fonts/widths.js, sonst der Mittelwert advance
  function bandWidth(sc, chars) {
    const W = (window.SCRIPT_WIDTHS || {})[sc.key];
    if (!W) return chars.length * sc.advance;
    return chars.reduce((a, c) => a + (W[c] != null ? W[c] * sc.size : sc.advance), 0);
  }
  const scriptOf = (lang) => SCRIPTS[(lang && lang.script) || "latin"] || SCRIPTS.latin;
  // Anzeige: "original" (Schrift der Sprache) oder "latin" (Band in Lautschrift, Absichtszeichen als lateinische
  // Buchstaben). Die Kernzeilenwahl hängt nicht davon ab; sie ist in beiden Darstellungen eindeutig.
  let MODE = "original";
  const setMode = (m) => (MODE = m === "latin" ? "latin" : "original");
  const mode = () => MODE;
  const shownOf = (lang) => (MODE === "latin" ? SCRIPTS.latin : scriptOf(lang));

  // Zeile in der Schrift der Sprache; Lateinschrift bleibt Lautschrift (die Umschrift macht FORMULA.line)
  function write(lang, text) {
    const S = scriptOf(lang);
    if (S === SCRIPTS.latin) return text;
    const fixed = (lang.scriptWords || {});
    const out = words(text, (w) => fixed[w] || S.word(w), S.join || " ");
    return S.frame ? S.frame[0] + out + S.frame[1] : out;
  }

  // Absichtszeichen: Anlaut des Wortes in der Schrift der Sprache
  function onsetGlyph(lang, word) {
    const S = scriptOf(lang), w = String(word).toLowerCase();
    if (S === SCRIPTS.latin) {
      const o = window.FORMULA ? FORMULA.onset(lang, w) : w[0];
      // Digraphe als Buchstabe mit Kleinbuchstaben (Ll, Rh), Sonderzeichen groß (Š)
      return /^[a-z]{2,}$/.test(o) ? o[0].toUpperCase() + o.slice(1) : o.toUpperCase();
    }
    if (S === SCRIPTS.cuneiform) return [...cuneiformWord(w)][0];
    return [...S.word(w)][0] || "";
  }

  // Absichtszeichen in Lateinschrift: Anlaut in der Umschrift des Lexikons (Š, Ḫ, Ḏ); wo die Umschrift selbst nicht
  // lateinisch ist (Griechisch: φ), der Anlaut der Lautschrift (Ph)
  function latinOnset(lang, word) {
    const w = String(word).toLowerCase();
    let o = window.FORMULA ? FORMULA.onset(lang, w) : w[0];
    if (!/^[\p{Script=Latin}\p{Lm}]+$/u.test(o)) {
      const k = Object.keys(lang.onsets || {}).sort((a, b) => b.length - a.length).find((x) => w.startsWith(x));
      o = k || w[0];
    }
    return /^[a-z]{2,}$/.test(o) ? o[0].toUpperCase() + o.slice(1) : o.toUpperCase();
  }
  const latinKey = (lang, word) => "L:" + latinOnset(lang, word).toUpperCase();
  // Absichtszeichen und Vergleichsschlüssel in der eingestellten Darstellung
  const mark = (lang, word) => (MODE === "latin" ? latinOnset(lang, word) : onsetGlyph(lang, word));
  const markKey = (lang, word) => (MODE === "latin" ? latinKey(lang, word) : visualKey(lang, word));

  // Vergleichsschlüssel für die Eindeutigkeit nach Aussehen: Lateinschriften teilen sich die Buchstaben,
  // verwechselbare griechische Kleinbuchstaben zählen wie lateinische Großbuchstaben
  const LOOKALIKE = { "ο": "O", "κ": "K", "χ": "X" };
  function visualKey(lang, word) {
    const S = scriptOf(lang), g = onsetGlyph(lang, word);
    if (S === SCRIPTS.latin) return "L:" + g.toUpperCase();
    if (S === SCRIPTS.greek && LOOKALIKE[g]) return "L:" + LOOKALIKE[g];
    return (lang.script || "latin") + ":" + g;
  }

  // Laute eines Wortes, die die Schrift nicht kennt (für das Prüfwerkzeug)
  const KNOWN = {
    cuneiform: [CUN_DIG, (x) => VOW.has(x) || CUN[x + "a"]],
    hieroglyphs: [{ dj: "dj", tj: "tj", kh: "kh", sh: "sh" }, (x) => x === "e" || HIERO[x]],
    greek: [{ ph: "ph", th: "th", kh: "kh", ps: "ps", rh: "rh", ch: "ch" }, (x) => GREEK[x] != null],
    ogham: [{ kh: "kh", th: "th", sh: "sh", ng: "ng" }, (x) => OGHAM[x]],
    proto: [{ gwh: "gwh", gw: "gw", kw: "kw", bh: "bh", dh: "dh", gh: "gh" }, (x) => PROTO_ID[x] || PROTO_ID[PROTO_ALIAS[x]]],
  };
  function unknown(lang, word) {
    const k = KNOWN[(lang && lang.script) || "latin"];
    if (!k) return [];
    return tokenize(String(word).toLowerCase().replace(/[^a-z]/g, ""), k[0]).map((x) => (k[0][x] && typeof k[0][x] === "string" && k[0][x].length === 1 && x.length === 1 ? k[0][x] : x)).filter((x) => !k[1](x));
  }

  window.SCRIPTS = { write, onsetGlyph, visualKey, latinOnset, latinKey, mark, markKey, setMode, mode, shownOf, scriptOf, bandWidth, protoPath, unknown, LIST: SCRIPTS };
})();

// Gegenprobe deutscher gegen englischen Regeltext ohne Übersetzung: beide Texte auf vergleichbare
// Merkmale abbilden (Würfel, Längen in Fuß, Boni/Mali, sonstige Zahlen, Zahlwörter) und die Mengen vergleichen.
// 1,5 m = 5 ft (Pathfinder-Konvention), deshalb Meter / 0,3 auf 5 Fuß gerundet.
const WORDS = {
  de: { zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, zwölf: 12, zwanzig: 20, hundert: 100 },
  en: { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12, twenty: 20, hundred: 100 },
};

// Mythische Zusätze der deutschen Fassung (MyPFDB hängt sie an, die englischen Daten nicht)
export const stripMythic = (t) => String(t || "").replace(/\s*\b(Legendär|Verbessert \(\d+\. Legendenstufe\)|Mythic|Augmented \(\d+(st|nd|rd|th)\)):[\s\S]*$/, "");

export function features(text, lang) {
  const out = new Map();
  const add = (k) => out.set(k, (out.get(k) || 0) + 1);
  let s = stripMythic(text).replace(/(\d)\.(\d{3})\b/g, "$1$2").replace(/(\d),(\d{3})\b/g, lang === "en" ? "$1$2" : "$1,$2");
  // Würfel
  s = s.replace(lang === "de" ? /(?<![\p{L}\d])(\d*)W(\d{1,3})(?!\d)/gu : /(?<![\p{L}\d])(\d*)d(\d{1,3})(?!\d)/gu, (m, n, d) => (add(`${n || 1}d${d}`), " "));
  // Längen
  const toFt = (m) => { const f = m / 0.3; return f < 5 ? Math.round(f) : Math.round(f / 5) * 5; };
  if (lang === "de") s = s.replace(/(\d+(?:,\d+)?)\s?cm\b/g, (m, n) => (add(`${Math.round(+n.replace(",", ".") / 30)}ft`), " "));
  if (lang === "de") s = s.replace(/(\d+(?:,\d+)?)\s?(m|Meter)\b/g, (m, n) => (add(`${toFt(+n.replace(",", "."))}ft`), " "));
  else s = s.replace(/(\d+)[- ]?(ft\.?|feet|foot)/g, (m, n) => (add(`${n}ft`), " "));
  s = s.replace(lang === "de" ? /(\d+(?:,\d+)?)\s?km\b/g : /(\d+)[- ]?miles?\b/g, (m, n) => (add("dist"), " "));
  // Bereiche („1–10“) sind zwei Zahlen, keine Mali
  s = s.replace(/(\d+)\s?[-–−]\s?(\d+)/g, (m, x, y) => (add(`#${+x}`), add(`#${+y}`), " "));
  // Boni und Mali („+2“, „– 2“, „-4“)
  s = s.replace(/([+\-–−])\s?(\d+)/g, (m, sg, n) => (add(`${sg === "+" ? "+" : "-"}${n}`), " "));
  // sonstige Zahlen (ohne 0 und 1, die in beiden Sprachen oft als Wort stehen)
  s = s.replace(/\d+/g, (n) => (+n > 1 && add(`#${+n}`), " "));
  for (const w of s.toLowerCase().match(/\p{L}+/gu) || []) if (WORDS[lang][w]) add(`#${WORDS[lang][w]}`);
  return out;
}

// Übereinstimmung zweier Merkmalsmengen (Dice-Koeffizient über Vielfachmengen, Zahlen ohne Vorzeichen zählen halb)
export function compare(de, en, min = 3) {
  const a = features(de, "de"), b = features(en, "en");
  const w = (k) => (k.startsWith("#") ? 0.5 : 1);
  let common = 0, total = 0, wDe = 0, wEn = 0;
  const keys = new Set([...a.keys(), ...b.keys()]);
  const onlyDe = [], onlyEn = [];
  for (const k of keys) {
    const x = a.get(k) || 0, y = b.get(k) || 0;
    common += 2 * Math.min(x, y) * w(k);
    total += (x + y) * w(k);
    wDe += x * w(k);
    wEn += y * w(k);
    if (x && !y) onlyDe.push(k);
    if (y && !x) onlyEn.push(k);
  }
  // bewertbar nur, wenn beide Seiten genug Merkmale haben („functions like …“ hat keine)
  const ok = wDe >= min && wEn >= min;
  return { score: ok ? common / total : null, weight: total, wDe, wEn, onlyDe, onlyEn };
}

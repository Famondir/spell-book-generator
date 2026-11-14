#!/usr/bin/env node
// Vollständigkeitsprüfung der Formelsprachen (data/formula-lang/*.js):
//   - jedes Lexikon hat alle Schlüssel, jede Schule, Essenz, Gestalt, Weite, Dauer, Rettung, neun Ordnungen
//   - alle Satzmuster vorhanden, keine leeren Bausteine
//   - keine Setting-Eigennamen in eingecheckten Lexika
//   - jede Sprache erzeugt für alle Zauber Formeln ohne Lücken (de und en)
// Aufruf: node tools/formula-lang-check.mjs [--with-profile] [--lang hittite] [--show 3]
import { loadApp } from "./lib/load-app.mjs";

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ONLY = arg("--lang");
const SHOW = +arg("--show", 0);
const ctx = loadApp({ withProfile: process.argv.includes("--with-profile") });
const { FORMULA: F, THEORY: T, SPELLS } = ctx;

// Setting-Eigennamen, die in eingecheckten Lexika nicht vorkommen dürfen (Kleinschreibung, Wortanfang)
const SETTING = ["golarion", "azlant", "thassilon", "osirion", "nethys", "absalom", "varisia", "mwangi", "abyssal", "infernal", "celestial", "cheliax",
  "taldor", "taldan", "jistka", "vudra", "kelish", "kelesh", "hallit", "androff", "sarkor", "kellid", "magaambya", "jatembe", "aklo", "skald", "minkai", "tian"];

const errs = [];
const err = (l, m) => errs.push(`${l}: ${m}`);
const list = (x) => (Array.isArray(x) ? x : [x]);
const ids = Object.keys(F.LANGS).filter((id) => !ONLY || id === ONLY);
const words = (x) => (typeof x === "string" ? [x] : Array.isArray(x) ? x.flatMap(words) : x && typeof x === "object" ? Object.values(x).flatMap(words) : []);

for (const id of ids) {
  const L = F.LANGS[id];
  const X = L.lex || {};
  for (const k of F.LEX_KEYS) if (X[k] == null) err(id, `Schlüssel ${k} fehlt`);
  for (const k of F.PATTERN_KEYS) if (!(L.patterns || {})[k]) err(id, `Satzmuster ${k} fehlt`);
  const need = { imp: Object.keys(T.SCHOOLS), ess: T.ESSENCES.map((e) => e.id), shape: Object.keys(T.SHAPES), duration: Object.keys(T.DURATIONS), save: ["will", "fort", "ref"], dir: ["in", "out"] };
  for (const [k, keys] of Object.entries(need)) for (const x of keys) if (!X[k] || !list(X[k][x] || []).filter(Boolean).length) err(id, `${k}.${x} fehlt`);
  if ((X.range || []).length !== T.RANGES.length) err(id, `range braucht ${T.RANGES.length} Einträge`);
  if ((X.ord || []).length !== 9) err(id, "ord braucht 9 Einträge");
  for (const w of words(X)) if (!String(w).trim()) err(id, "leerer Baustein");
  if (!L.name || !L.name.de || !L.name.en) err(id, "name.de/en fehlt");
  if (!L.family) err(id, "family fehlt");
  // Ausrichtung (optional): onsets als Zuordnung Lautschrift → Zeichen, stems parallel zu den Wortlisten
  if (L.onsets && Object.values(L.onsets).some((v) => typeof v !== "string")) err(id, "onsets: nur Zeichenketten");
  for (const k of ["imp", "ess"]) for (const [key, st] of Object.entries((L.stems || {})[k] || {})) {
    if (!X[k] || !X[k][key]) err(id, `stems.${k}.${key} ohne Wortliste`);
    else if (st.length !== X[k][key].length) err(id, `stems.${k}.${key}: ${st.length} Einträge, Wortliste hat ${X[k][key].length}`);
  }
  const all = JSON.stringify([L.lex, L.patterns, L.bridges, L.stems, L.name, L.note]).toLowerCase();
  if (!L.local) for (const s of SETTING) if (new RegExp(`\\b${s}`).test(all)) err(id, `Setting-Name „${s}“`);
  // Formeln für alle Zauber in dieser Sprache, beide Lesesprachen
  const keep = F.langOf;
  F.langOf = () => L;
  for (const book of ["de", "en"]) {
    ctx.I18N.configure({ bookLang: book });
    let shown = 0;
    for (const s of SPELLS) {
      const t = ctx.generateTexts(ctx.analyze(s));
      const lines = [...t.formula.lines, ...t.longFormula.map((x) => x.t)];
      for (const l of lines) if (/undefined|\{|\}|\[|\]|\s[,!.]|^\W|,,/.test(l)) { err(id, `${book} ${s.id}: „${l}“`); break; }
      if (shown < SHOW && s.level !== 0 && t.formula.lines.length > 3) (console.log(`${id} ${book} ${s.name}:\n  ${t.formula.lines.join("\n  ")}`), shown++);
    }
  }
  F.langOf = keep;
}
ctx.I18N.configure({});
const uniq = [...new Set(errs)];
for (const e of uniq.slice(0, 40)) console.log("✗ " + e);
console.log(uniq.length ? `${uniq.length} Fehler in ${ids.length} Sprachen` : `${ids.length} Sprachen vollständig`);
process.exit(uniq.length ? 1 : 0);

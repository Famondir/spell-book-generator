#!/usr/bin/env node
// Abdeckung der Begriffsübersetzung (rulesLang = de ohne deutsche Regeldaten): übersetzt alle Werte aller
// Zauber mit app/js/rules.js und zählt Werte, in denen noch englische Wörter stehen.
// Aufruf: node tools/rules-terms-coverage.mjs [--field range] [--top 40] [--min 95]
// Ausgabe: Abdeckung je Feld und gesamt, häufigste nicht erkannte Werte; Rückgabecode 1 unter --min Prozent.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const FIELD = arg("--field");
const TOP = +arg("--top", 30);
const MIN = +arg("--min", 0);

const ctx = { window: {}, navigator: { language: "de-DE" }, document: { documentElement: {} }, console };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ["app/js/i18n.js", "data/spells.js", "app/js/theory.js", "data/lang/rules-terms.de.js", "app/js/rules.js"]) vm.runInContext(readFileSync(join(ROOT, f), "utf8"), ctx, { filename: f });
ctx.I18N.configure({ rulesLang: "de", uiLang: "de", bookLang: "de" });
const { SPELLS, RULES } = ctx;

// Englisch erkannt: ein kleingeschriebenes Wort der englischen Eingabe (ab 3 Buchstaben) steht unverändert in der
// Ausgabe. Ausnahmen: Wörter, die im Deutschen gleich lauten. Englischer Material-Freitext steht absichtlich in „…“.
const SAME = new Set(["plus", "mini", "kami", "permanent"]);
const englishWords = (en, de) => {
  const out = String(de).replace(/„[^“]*“/g, "");
  return [...new Set(String(en).match(/\b[a-z]{3,}\b/g) || [])].filter((w) => !SAME.has(w) && new RegExp(`\\b${w}\\b`).test(out));
};
const F = ["casting_time", "components", "range", "area", "target", "effect", "duration", "saving_throw", "spell_resistance"];
const LBL = { casting_time: "Zeitaufwand", components: "Komponenten", range: "Reichweite", area: "Wirkungsbereich", target: "Ziel", effect: "Effekt", duration: "Wirkungsdauer", saving_throw: "Rettungswurf", spell_resistance: "Zauberresistenz" };
const stat = Object.fromEntries(F.map((k) => [k, { all: 0, ok: 0, miss: new Map() }]));
for (const s of SPELLS) {
  if (s.everyday) continue;
  const de = new Map(RULES.fields(s));
  for (const k of F) {
    if (!s[k]) continue;
    const v = de.get(LBL[k]);
    const st = stat[k];
    st.all++;
    const en = englishWords(s[k], v);
    if (!en.length) st.ok++;
    else { const key = `${s[k]}  →  ${v}`; st.miss.set(key, (st.miss.get(key) || 0) + 1); }
  }
}
let all = 0, ok = 0;
for (const k of F) {
  const st = stat[k];
  all += st.all; ok += st.ok;
  console.log(`${k.padEnd(17)} ${String(st.ok).padStart(5)}/${String(st.all).padEnd(5)} ${(100 * st.ok / (st.all || 1)).toFixed(1).padStart(5)} %`);
}
const pct = (100 * ok) / all;
console.log(`${"gesamt".padEnd(17)} ${String(ok).padStart(5)}/${String(all).padEnd(5)} ${pct.toFixed(1).padStart(5)} %`);
for (const k of FIELD ? [FIELD] : F) {
  const top = [...stat[k].miss].sort((a, b) => b[1] - a[1]).slice(0, TOP);
  if (!top.length) continue;
  console.log(`\n## ${k} – häufigste nicht erkannte Werte`);
  for (const [v, n] of top) console.log(`${String(n).padStart(4)}  ${v}`);
}
if (MIN && pct < MIN) process.exit(1);

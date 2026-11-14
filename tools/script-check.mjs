#!/usr/bin/env node
// Prüfung der Originalschriften: jedes Wort jedes Lexikons (Bausteine und feste Wörter der Satzmuster) lässt sich in die
// Schrift seiner Sprache übertragen, ohne unbekannte Laute; jedes benutzte Zeichen ist in der gekürzten Schriftdatei.
// Aufruf: node tools/script-check.mjs [--with-profile] [--chars] [--show hittite]
//   --chars   gibt die benutzten Zeichen je Schrift als JSON aus (für tools/subset-fonts.py)
import { existsSync, readFileSync } from "node:fs";
import { loadApp } from "./lib/load-app.mjs";

const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const ctx = loadApp({ withProfile: process.argv.includes("--with-profile") });
const { FORMULA: F, SCRIPTS: S } = ctx;
const errors = [];
const chars = {};
const words = (x) => (typeof x === "string" ? x.split(/\s+/) : Array.isArray(x) ? x.flatMap(words) : x && typeof x === "object" ? Object.values(x).flatMap(words) : []);

for (const [id, lang] of Object.entries(F.LANGS)) {
  if (!lang.script || lang.script === "latin") continue;
  const ws = new Set([...words(lang.lex), ...words(Object.values(lang.patterns).map((p) => p.replace(/\{\w+\}|\[|\]/g, " ")))].map((w) => w.toLowerCase().replace(/[^a-z]/g, "")).filter(Boolean));
  const set = (chars[lang.script] = chars[lang.script] || new Set());
  for (const w of ws) {
    const bad = S.unknown(lang, w);
    if (bad.length) errors.push(`${id}: „${w}“ – unbekannt: ${[...new Set(bad)].join(", ")}`);
    for (const c of S.write(lang, w)) if (c.trim()) set.add(c);
  }
  // Absichtszeichen der Kernwörter
  for (const k of ["imp", "ess"]) for (const list of Object.values(lang.lex[k])) for (const w of list) set.add(S.onsetGlyph(lang, w));
  if (arg("--show") === id) for (const w of [...ws].slice(0, 40)) console.log(`${w} → ${S.write(lang, w)}`);
}

// Schrift-Ausnahmen der Lexika und Rahmenzeichen
for (const lang of Object.values(F.LANGS)) for (const v of Object.values(lang.scriptWords || {})) for (const c of v) chars[lang.script].add(c);
if (chars.ogham) for (const c of "᚛᚜ ") chars.ogham.add(c);
delete chars.proto; // Strichzeichen, keine Schriftdatei
// Schriften mit Großbuchstaben im Band: Großformen dazu
for (const [script, set] of Object.entries(chars)) if (S.LIST[script].upper) for (const c of [...set]) set.add(c.toUpperCase());

if (process.argv.includes("--chars")) {
  console.log(JSON.stringify(Object.fromEntries(Object.entries(chars).map(([k, v]) => [k, [...v].sort().join("")]))));
  process.exit(0);
}

// Abdeckung der gekürzten Schriften (Zeichenliste neben der Schrift, von tools/subset-fonts.py geschrieben)
for (const [script, set] of Object.entries(chars)) {
  const list = new URL(`../app/fonts/${script}.chars.txt`, import.meta.url);
  if (!existsSync(list)) { errors.push(`${script}: app/fonts/${script}.chars.txt fehlt – tools/subset-fonts.py ausführen`); continue; }
  const have = new Set(readFileSync(list, "utf8"));
  const miss = [...set].filter((c) => !have.has(c));
  if (miss.length) errors.push(`${script}: ${miss.length} Zeichen fehlen in der gekürzten Schrift (${miss.slice(0, 10).join(" ")}) – tools/subset-fonts.py ausführen`);
  console.log(`${script}: ${set.size} Zeichen`);
}

for (const e of errors.slice(0, 40)) console.log("✗ " + e);
console.log(errors.length ? `${errors.length} Fehler` : "Originalschriften vollständig");
process.exit(errors.length ? 1 : 0);

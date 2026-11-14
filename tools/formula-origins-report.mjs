#!/usr/bin/env node
// Bericht über die Herkunft der Formeln: welche Zauber eines Buches auf welche Station (und Sprache) fallen.
// Zum Durchsehen und um einzelne Zauber in data/custom_texts.js festzulegen ({ origin: "<station>" }).
// Aufruf: node tools/formula-origins-report.mjs --book liste.json|liste.txt [--with-profile] [--out bericht.md]
//   liste.json: Array von Zaubernamen (englisch); liste.txt: ein Name pro Zeile
import { readFileSync, writeFileSync } from "node:fs";
import { loadApp } from "./lib/load-app.mjs";

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BOOK = arg("--book");
if (!BOOK) { console.error("--book <datei> fehlt"); process.exit(2); }
const ctx = loadApp({ withProfile: process.argv.includes("--with-profile") });
const { FORMULA: F, SPELLS } = ctx;
const raw = readFileSync(BOOK, "utf8");
const names = BOOK.endsWith(".json") ? JSON.parse(raw) : raw.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const byName = new Map(SPELLS.map((s) => [s.name.toLowerCase(), s]));
const missing = names.filter((n) => !byName.has(n.toLowerCase()));
const models = names.map((n) => byName.get(n.toLowerCase())).filter(Boolean).map((s) => ctx.analyze(s));
const map = F.assign(models);
const SCHOOL = Object.fromEntries(Object.entries(ctx.THEORY.SCHOOLS).map(([k, v]) => [k, v.de]));

const out = [];
out.push(`# Herkunft der Formeln`, ``, `${models.length} Zauber${missing.length ? `, ${missing.length} nicht im Katalog` : ""}. Erzeugt mit \`tools/formula-origins-report.mjs\`.`, ``);
out.push(`| Station | Sprache | Soll | Ist | Grade |`, `|---|---|---|---|---|`);
const q = F.quotas(F.stations(), models.length);
F.stations().forEach((st, i) => {
  const ms = models.filter((m) => map.get(m.id) === st);
  const lv = ms.map((m) => m.level);
  out.push(`| ${st.label || st.id} | ${F.name(st.lang)} | ${q[i]} (${st.share} %) | ${ms.length} | ${lv.length ? Math.min(...lv) + "–" + Math.max(...lv) : "–"} |`);
});
for (const st of F.stations()) {
  const ms = models.filter((m) => map.get(m.id) === st).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  out.push(``, `## ${st.label || st.id} · ${F.name(st.lang)} (${ms.length})`, ``);
  for (const m of ms) out.push(`- ${m.level} · ${m.name} · ${SCHOOL[m.school] || m.school} · ${m.essences.slice(0, 2).map((e) => ctx.THEORY.ESS[e.id].latin).join("/")}`);
}
if (missing.length) out.push(``, `## Nicht im Katalog`, ``, ...missing.map((n) => `- ${n}`));
const text = out.join("\n") + "\n";
const OUT = arg("--out");
if (OUT) (writeFileSync(OUT, text), console.log(`→ ${OUT}`));
else process.stdout.write(text);

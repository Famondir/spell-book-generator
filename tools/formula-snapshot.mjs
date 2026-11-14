#!/usr/bin/env node
// Formel-Snapshot: Formel, Langformel und Schriftband aller Zauber (Katalog und Alltagszauber) als JSON.
// Dient als Gleichheitsprüfung beim Umbau der Formelsprachen.
// Aufruf: node tools/formula-snapshot.mjs [--with-profile] [--save | --check]
//   --save   schreibt tools/formula-snapshot[.local].json
//   --check  vergleicht mit der gespeicherten Datei, Rückgabecode 1 bei Abweichung
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadApp } from "./lib/load-app.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const withProfile = process.argv.includes("--with-profile");
const FILE = join(ROOT, "tools", withProfile ? "formula-snapshot.local.json" : "formula-snapshot.json");

const ctx = loadApp({ withProfile });
const out = {};
for (const s of ctx.SPELLS) {
  const t = ctx.generateTexts(ctx.analyze(s));
  out[s.id] = { f: t.formula.lines, b: t.formula.band, l: t.longFormula.map((x) => x.k + " " + x.t) };
}
const n = Object.keys(out).length;
if (process.argv.includes("--save")) {
  writeFileSync(FILE, JSON.stringify(out));
  console.log(`${n} Zauber gesichert → ${FILE}`);
} else if (process.argv.includes("--check")) {
  if (!existsSync(FILE)) { console.error(`kein Snapshot: ${FILE}`); process.exit(1); }
  const old = JSON.parse(readFileSync(FILE, "utf8"));
  const diff = Object.keys({ ...old, ...out }).filter((k) => JSON.stringify(old[k]) !== JSON.stringify(out[k]));
  for (const k of diff.slice(0, 5)) console.log(`≠ ${k}\n  alt: ${JSON.stringify(old[k])}\n  neu: ${JSON.stringify(out[k])}`);
  console.log(diff.length ? `${diff.length} von ${n} Zaubern abweichend` : `${n} Zauber gleich`);
  process.exit(diff.length ? 1 : 0);
} else console.log(JSON.stringify(out, null, 1).slice(0, 2000));

#!/usr/bin/env node
// Deutsche Zauber, die im MyPFDB-PDF fehlen, einzeln vom deutschen PRD (prd.5footstep.de) holen.
// Die Liste ist fest: Abgleich des PRD-Zauberindex gegen RULES_DE im Oktober 2026, Zuordnung von Hand.
// Ergebnis (gitignoriert): data/research/prd-de.json = { [spellId]: { name, source, fields, text } }
// tools/import-rules-de.mjs übernimmt die Einträge, wenn das PDF für die Id nichts liefert.
// Abrufe werden in data/research/prd-cache/ gemerkt; ein zweiter Lauf fragt die Seite nicht erneut.
// Aufruf: node tools/fetch-prd-de.mjs [--refresh]

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://prd.5footstep.de/";
const CACHE = join(ROOT, "data/research/prd-cache");
const OUT = join(ROOT, "data/research/prd-de.json");

const SPELLS = [
  ["crimson-breath", "Blutroter Odem", "Abenteurerkompendium"],
  ["aldori-alacrity", "Duellantenbeinarbeit", "Abenteurerkompendium"],
  ["abadar-s-truthtelling", "Göttliche Wahrheitssuche", "Andere-Bände", "Almanach der Götter und Magie"],
  ["gozreh-s-trident", "Göttlicher Dreizack", "Andere-Bände", "Almanach der Götter und Magie"],
  ["gorum-s-armor", "Rüstung des Herren im Eisen", "Andere-Bände", "Almanach der Götter und Magie"],
  ["blessing-of-the-watch", "Segen der Wache", "Andere-Bände", "Almanach der Götter und Magie"],
  ["waters-of-lamashtu", "Wasser der Mutter der Monster", "Andere-Bände", "Almanach der Götter und Magie"],
  ["dirge-of-the-victorious-knights", "Klagelied des Siegreichen Ritters", "Andere-Bände", "Weltenband der Inneren See"],
  ["vision-of-lamashtu", "Traumbild der Mutter der Monster", "Andere-Bände", "Weltenband der Inneren See"],
];
// „Sonnenschild“ (Almanach) ist der einfache Schild der Dämmerblume (Grad 4, gleicher Text), der schon aus dem PDF kommt.

// Werteblöcke, die im PRD verrutscht sind (Zeitaufwand als Wirkungsdauer, Wirkungsdauer im Ziel)
const FIX = {
  "vision-of-lamashtu": { Zeitaufwand: "10 Minuten (siehe Text)", Ziel: "Eine lebende Kreatur", Wirkungsdauer: "Augenblicklich" },
};

// Feldnamen wie im PDF (die App liest „Effekt“)
const LABEL = { Wirkung: "Effekt" };

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) => s.replace(/<[^>]+>/g, "").replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, c) => c[0] === "#" ? String.fromCodePoint(c[1] === "x" ? parseInt(c.slice(2), 16) : +c.slice(1)) : ENT[c] ?? m).replace(/\s+/g, " ").replace(/siehe(?=Text)/g, "siehe ").trim();
// Schule wie im PDF: „Verwandlungsmagie“ → „Verwandlung“, „Bannmagie“ → „Bannzauber“, „Illusionen“ → „Illusion“
const school = (s) => s.replace(/^Bannmagie/, "Bannzauber").replace(/^(\S+?)s?magie\b/, "$1").replace(/^Illusionen\b/, "Illusion").replace(/^(\S+):/, "$1").replace(/\s*;\s*$/, "");

async function page(path) {
  const file = join(CACHE, path.replace(/\//g, "_") + ".html");
  if (existsSync(file) && !process.argv.includes("--refresh")) return readFileSync(file, "utf8");
  await new Promise((r) => setTimeout(r, 1000)); // höflich: eine Anfrage je Sekunde
  const res = await fetch(BASE + path.split("/").map(encodeURIComponent).join("/"));
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  const html = await res.text();
  mkdirSync(CACHE, { recursive: true });
  writeFileSync(file, html);
  return html;
}

function parse(html) {
  const sec = (html.match(/<section id="section-content"[^>]*>([\s\S]*?)<\/section>/) || [])[1] || "";
  const paras = [...sec.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((m) => m[1]);
  const fields = {};
  const block = paras.shift() || "";
  for (const m of block.matchAll(/<strong>([^<:]+):<\/strong>([\s\S]*?)(?=<strong>|$)/g)) fields[LABEL[m[1].trim()] || m[1].trim()] = decode(m[2]).replace(/[;,]\s*$/, "");
  if (fields.Schule) fields.Schule = school(fields.Schule);
  // Fettgedruckte Absatzköpfe („Legendär:“) bleiben im Text, wie im PDF
  const text = paras.map(decode).filter(Boolean).join("\n\n");
  return { fields, text };
}

const out = {};
for (const [id, name, dir, book = dir] of SPELLS) {
  const html = await page(`${dir}/Zauber/${name.replace(/ /g, "-")}`);
  const { fields, text } = parse(html);
  if (!fields.Schule || !text) throw new Error(`kein Werteblock: ${name}`);
  out[id] = { name, source: book, fields: { ...fields, ...FIX[id] }, text };
  console.log(`${name} → ${id} · ${Object.keys(fields).length} Felder · ${text.length} Zeichen`);
}
writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log(`${Object.keys(out).length} Einträge → ${OUT.slice(ROOT.length + 1)}`);

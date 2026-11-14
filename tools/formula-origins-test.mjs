#!/usr/bin/env node
// Tests für Herkunft (Stationen, Quote, Gradfenster, Festlegung) und Hausregel „Entziffern“ ohne Browser.
// Aufruf: node tools/formula-origins-test.mjs   (Rückgabecode 1 bei Fehlern)
import { loadApp } from "./lib/load-app.mjs";

const ctx = loadApp();
const { FORMULA: F, SPELLS, PROFILE: PR } = ctx;
const fails = [];
const expect = (what, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "ok" : "✗ "}  ${what}${ok ? "" : `: erhalten ${JSON.stringify(got)}, erwartet ${JSON.stringify(want)}`}`);
  if (!ok) fails.push(what);
};

// Testbuch: die ersten 269 Magierzauber nach ID (fest, unabhängig von neuen Daten im Katalog nur bei gleicher Sortierung)
const book = SPELLS.filter((s) => !s.everyday && s.levels.wizard != null).sort((a, b) => a.id.localeCompare(b.id)).slice(0, 269).map((s) => ctx.analyze(s));
const count = (map, id) => [...map.values()].filter((s) => s.id === id).length;

// Neutral: eine lateinische Station
expect("neutral: eine Station", F.stations().map((s) => s.lang), ["latin"]);

// Quote nach größtem Rest
PR.formulaOrigins = [
  { id: "a", lang: "latin", share: 12, schools: { abjuration: 3 } },
  { id: "b", lang: "latin", share: 88 },
];
let map = F.assign(book);
expect("Quote 12 % von 269", count(map, "a"), 32);
expect("Quote 88 % von 269", count(map, "b"), 237);
const abj = [...map].filter(([id, s]) => s.id === "a").map(([id]) => book.find((m) => m.id === id).school);
const abjAll = book.filter((m) => m.school === "abjuration").length;
expect("Gewicht: alle Bannzauber bei Station a", abj.filter((x) => x === "abjuration").length, abjAll);
expect("deterministisch", [...F.assign(book)].map(([k, v]) => k + v.id).join(), [...map].map(([k, v]) => k + v.id).join());

// Gradfenster
PR.formulaOrigins = [
  { id: "a", lang: "latin", share: 50, levels: [0, 2] },
  { id: "b", lang: "latin", share: 50 },
];
map = F.assign(book);
expect("Gradfenster 0–2", [...map].filter(([, s]) => s.id === "a").every(([id]) => book.find((m) => m.id === id).level <= 2), true);

// Festlegung je Zauber zählt auf die Quote
PR.formulaOrigins = [
  { id: "a", lang: "latin", share: 12 },
  { id: "b", lang: "latin", share: 88 },
];
const pinned = book.find((m) => m.school === "evocation").id;
ctx.CUSTOM_TEXTS[pinned] = { origin: "a" };
map = F.assign(book);
expect("Festlegung: Station a", map.get(pinned).id, "a");
expect("Festlegung zählt auf die Quote", count(map, "a"), 32);
const t = ctx.generateTexts(book.find((m) => m.id === pinned));
expect("Festlegung ist kein handgeschriebener Text", !!t.custom, false);
delete ctx.CUSTOM_TEXTS[pinned];

// Hausregel Entziffern
PR.formulaOrigins = [{ id: "a", lang: "latin", share: 100, hand: "alt" }];
const m3 = book.find((m) => m.level === 3);
expect("Hausregel aus: kein SG", F.decipher(m3), null);
PR.decipher = { enabled: true, hands: { alt: 2 }, dead: [] };
expect("beherrscht: 10 + Grad + Hand", F.decipher(m3, ["latin"]).dc, 10 + 3 + 2);
expect("verwandt (gleiche Familie)", F.relation("latin", ["xx"]), "foreign");
F.LANGS.testie = { ...F.LANGS.latin, id: "testie", family: "indoeuropean" };
F.LANGS.testsem = { ...F.LANGS.latin, id: "testsem", family: "semitic" };
expect("verwandt", F.relation("testie", ["latin"]), "related");
expect("fremd", F.relation("testsem", ["latin"]), "foreign");
PR.decipher.dead = ["testie"];
expect("tot vor verwandt", F.relation("testie", ["latin"]), "dead");
expect("beherrscht vor tot", F.relation("testie", ["testie"]), "known");
const m4 = book.find((m) => m.level === 4);
PR.formulaOrigins = [{ id: "a", lang: "testsem", share: 100, hand: "alt" }];
expect("fremd mit Hand: 20 + 4 + 2", F.decipher(m4, ["latin"]).dc, 26);
expect("Sprache gelernt: beherrscht", F.decipher(m4, ["latin", "testsem"]).dc, 16);

console.log(fails.length ? `\n${fails.length} Fehler` : "\nalle Tests bestanden");
process.exit(fails.length ? 1 : 0);

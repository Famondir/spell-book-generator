#!/usr/bin/env node
// Deutsche Zauberdaten (MyPFDB-PDF, lokal in spells/) einlesen und den englischen Zaubern zuordnen.
// Ergebnis (beides gitignoriert):
//   data/rules.de.local.js            window.RULES_DE = { [spellId]: { name, source, fields, text } }
//   data/research/rules-de-review.md  mehrdeutige, fehlende und überzählige Einträge
// Aufruf: node tools/import-rules-de.mjs [--pdf spells/zauber_alphabetisch.pdf] [--dump einträge.json]
// Braucht pdftohtml (poppler-utils).
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const PDF = join(ROOT, arg("--pdf", "spells/zauber_alphabetisch.pdf"));

// ---------------------------------------------------------------------------------------------
// 1. PDF → Zeilen mit Lage und Schriftgröße
// ---------------------------------------------------------------------------------------------
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) => s.replace(/<[^>]+>/g, "").replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, c) => c[0] === "#" ? String.fromCodePoint(c[1] === "x" ? parseInt(c.slice(2), 16) : +c.slice(1)) : ENT[c] ?? m);

function readLines(pdf) {
  const dir = mkdtempSync(join(tmpdir(), "rules-de-"));
  execFileSync("pdftohtml", ["-xml", "-i", "-q", pdf, join(dir, "out")]);
  const xml = readFileSync(join(dir, "out.xml"), "utf8");
  const size = {};
  for (const m of xml.matchAll(/<fontspec id="(\d+)" size="(\d+)"/g)) size[m[1]] = +m[2];
  const lines = [];
  const raw = [];
  for (const pm of xml.matchAll(/<page number="(\d+)"[^>]*width="(\d+)"[^>]*>([\s\S]*?)<\/page>/g)) {
    const [, no, w, body] = pm;
    const items = [];
    for (const t of body.matchAll(/<text top="(\d+)" left="(\d+)" width="(\d+)" height="(\d+)" font="(\d+)">([\s\S]*?)<\/text>/g)) {
      const it = { page: +no, top: +t[1], left: +t[2], width: +t[3], size: size[t[5]], text: decode(t[6]) };
      it.col = it.left < +w / 2 ? 0 : 1;
      items.push(it);
    }
    raw.push(items.slice());
    items.sort((a, b) => a.col - b.col || a.top - b.top || a.left - b.left);
    // Stücke derselben Zeile (Name + Quelle) zusammenfassen
    for (const it of items) {
      const last = lines[lines.length - 1];
      if (last && last.page === it.page && last.col === it.col && Math.abs(last.top - it.top) <= 7 && it.left > last.left) {
        // Abstand zum vorigen Stück: Tabellenzellen bekommen einen Trenner, sonst ein Leerzeichen
        const prev = last.parts[last.parts.length - 1];
        const gap = it.left - (prev.left + prev.width);
        last.parts.push(it);
        last.text += (it.size !== prev.size ? "" : gap > 12 ? " · " : gap > 2 && !/\s$/.test(last.text) && !/^\s/.test(it.text) ? " " : "") + it.text;
        last.width = it.left + it.width - last.left;
      } else lines.push({ ...it, parts: [it] });
    }
  }
  lines.raw = raw;
  return lines;
}

// Tabelle „Zauberübersetzungen“ (deutsch | englisch | Quelle) am Ende der alphabetischen Liste
function readTable(raw) {
  const rows = [];
  let on = false;
  for (const items of raw) {
    if (items.some((i) => i.size >= 16 && /^Zauberübersetzungen/.test(i.text))) on = true;
    if (!on) continue;
    const cols = items.filter((i) => i.size !== 9 && !/^Zaubername|^Quelle$|^Zauberübersetzungen/.test(i.text.trim()) && i.text.trim());
    if (!cols.some((i) => i.left > 380 && i.left < 440)) { if (rows.length) break; continue; }
    // Zeilen nach Höhe gruppieren; umbrochene Zellen (ohne Quelle) an die vorige Zeile hängen
    const byTop = new Map();
    for (const i of cols) {
      const k = [...byTop.keys()].find((t) => Math.abs(t - i.top) <= 3) ?? i.top;
      if (!byTop.has(k)) byTop.set(k, []);
      byTop.get(k).push(i);
    }
    for (const [, cells] of [...byTop].sort((a, b) => a[0] - b[0])) {
      const de = cells.filter((c) => c.left < 380).map((c) => c.text.trim()).join(" ");
      const en = cells.filter((c) => c.left >= 380 && c.left < 700).map((c) => c.text.trim()).join(" ");
      const src = cells.filter((c) => c.left >= 700).map((c) => c.text.trim()).join(" ");
      if (!src && rows.length) { const r = rows[rows.length - 1]; if (de) r.de += " " + de; if (en) r.en += " " + en; continue; }
      rows.push({ de, en, src });
    }
  }
  return rows;
}

// ---------------------------------------------------------------------------------------------
// 2. Zeilen → Einträge (Name, Quelle, Werteblock, Absätze)
// ---------------------------------------------------------------------------------------------
const LABELS = ["Schule", "Grad", "Zeitaufwand", "Komponenten", "Reichweite", "Ziel oder Wirkungsbereich", "Wirkungsbereich oder Ziel", "Ziel oder Effekt", "Effekt oder Ziel", "Ziele", "Ziel", "Wirkungsbereich", "Effekt", "Wirkungsdauer", "Rettungswurf", "Zauberresistenz"];
const LABEL_RE = new RegExp(`(?:^|\\s)(${LABELS.join("|")}):\\s*`, "g");
const COL_W = 395; // Satzbreite einer Spalte
const HAS_LABEL = new RegExp(`(^|\\s)(${LABELS.join("|")}):`);

// passt das erste Wort der Folgezeile noch auf diese Zeile? Dann endet hier ein Absatz (Flattersatz)
function endsParagraph(line, next, colLeft) {
  const cw = line.width / Math.max(1, line.text.length);
  const word = (next.text.trim().split(/\s+/)[0] || "").length * cw;
  return line.left - colLeft + line.width + cw + word < COL_W - 3;
}
function joinLines(a, b) {
  if (/[A-Za-zäöüß]-$/.test(a) && /^[a-zäöüß]/.test(b)) return a.slice(0, -1) + b; // Silbentrennung
  if (/-$/.test(a)) return a + b; // Standard-/Aktion
  return a + " " + b;
}

function parseEntries(lines) {
  const body = lines.filter((l) => l.size !== 9); // Kopf- und Fußzeilen
  const out = [];
  let cur = null;
  for (let i = 0; i < body.length; i++) {
    const l = body[i];
    if (l.size === 15 || l.parts[0].size === 15) {
      // Name (ggf. über zwei Zeilen), Quelle in Größe 8 dahinter oder darunter
      const name = l.parts.filter((p) => p.size === 15).map((p) => p.text).join("").trim();
      const src = l.parts.filter((p) => p.size === 8).map((p) => p.text).join("").trim();
      if (cur && !cur.lines.length && !cur.source) { cur.name += " " + name; cur.source = src; continue; }
      cur = { name, source: src, lines: [] };
      out.push(cur);
      continue;
    }
    if (l.size === 8 && cur && !cur.source) { cur.source = l.text.trim(); continue; }
    if (cur && l.size === 11) cur.lines.push(l);
  }
  return out.filter((x) => x.lines.length && /^Schule:/.test(x.lines[0].text.trim())).map(splitEntry);
}

function splitEntry(x) {
  const colLeft = Math.min(...x.lines.filter((l) => l.col === x.lines[0].col).map((l) => l.left));
  const L = x.lines;
  // Werteblock: bis zur Zeile, nach der das nächste Wort noch gepasst hätte
  let k = 0;
  while (k < L.length - 1 && k < 9) {
    const base = Math.min(...L.filter((l) => l.col === L[k].col).map((l) => l.left));
    // weiter, solange die Folgezeile noch ein Feld enthält oder diese mit Komma endet; sonst Umbruchprobe
    // Blocksatz: eine volle Zeile ohne Feld ist schon Regeltext (Wertezeilen flattern)
    const nb = Math.min(...L.filter((l) => l.col === L[k + 1].col).map((l) => l.left));
    const justified = L[k + 1].left - nb + L[k + 1].width >= COL_W - 2;
    if (!HAS_LABEL.test(L[k + 1].text) && !/,\s*$/.test(L[k].text) && (justified || endsParagraph(L[k], L[k + 1], base))) break;
    k++;
  }
  const block = L.slice(0, k + 1).map((l) => l.text.trim()).reduce(joinLines);
  const fields = {};
  const marks = [...block.matchAll(LABEL_RE)];
  marks.forEach((m, j) => {
    const end = j + 1 < marks.length ? marks[j + 1].index : block.length;
    fields[m[1]] = block.slice(m.index + m[0].length, end).trim();
  });
  // Absätze: neuer Absatz bei Einzug oder wenn die vorige Zeile vorzeitig endet
  const paras = [];
  let p = "";
  const rest = L.slice(k + 1);
  rest.forEach((l, j) => {
    const base = Math.min(...L.filter((y) => y.col === l.col).map((y) => y.left));
    const t = l.text.trim();
    if (!p) p = t;
    else p = joinLines(p, t);
    const n = rest[j + 1];
    if (!n) return;
    const nBase = Math.min(...L.filter((y) => y.col === n.col).map((y) => y.left));
    const indent = n.left > nBase + 4;
    const sameCol = n.col === l.col && n.page === l.page;
    // Tabellenzeilen (mit Zellentrenner) stehen je für sich
    const row = / · /.test(l.text) || / · /.test(n.text);
    if (indent || row || (sameCol && endsParagraph(l, n, base))) { paras.push(p); p = ""; }
  });
  if (p) paras.push(p);
  const src = x.source.replace(/^\(|\)$/g, "").trim();
  return { name: x.name.replace(/\s+/g, " "), source: src, fields, text: paras.join("\n\n") };
}

// ---------------------------------------------------------------------------------------------
// 3. Fingerabdruck beider Seiten
// ---------------------------------------------------------------------------------------------
const SCHOOL_DE = [[/^bann/i, "abjuration"], [/^beschwör/i, "conjuration"], [/^erkenntnis/i, "divination"], [/^verzauber/i, "enchantment"], [/^hervorruf/i, "evocation"], [/^illusion/i, "illusion"], [/^nekromant/i, "necromancy"], [/^verwandl/i, "transmutation"], [/^(allgemein|universal|universell)/i, "universal"]];
const DESC_DE = { Gutes: "good", Gut: "good", Böses: "evil", Böse: "evil", Chaos: "chaotic", Chaotisch: "chaotic", Ordnung: "lawful", Rechtschaffen: "lawful", Feuer: "fire", Kälte: "cold", Säure: "acid", Elektrizität: "electricity", Schall: "sonic", Licht: "light", Dunkelheit: "darkness", Finsternis: "darkness", Furcht: "fear", Gefühl: "emotion", Geistesbeeinflussung: "mind-affecting", Geistesbeeinflussend: "mind-affecting", Tod: "death", Fluch: "curse", Gift: "poison", Krankheit: "disease", Schmerz: "pain", Sprachabhängig: "language-dependent", Sprachenabhängig: "language-dependent", Energie: "force", Wasser: "water", Erde: "earth", Luft: "air", Schatten: "shadow", Meditativ: "meditative", List: "ruse", Drakonisch: "draconic" };
const SUB_DE = { Zwang: "compulsion", Erschaffung: "creation", Schöpfung: "creation", Herbeizauberung: "summoning", Heilung: "healing", Gestaltwechsel: "polymorph", Gestaltwandel: "polymorph", Fehlgefühl: "glamer", Teleportation: "teleportation", Teleportierung: "teleportation", Schatten: "shadow", Einbildung: "figment", Phantome: "phantasm", Phantom: "phantasm", Bezauberung: "charm", Herbeirufung: "calling", Ausspähung: "scrying", Täuschung: "pattern", Spuk: "haunted" };
// Klassenkürzel → englische Schlüssel (HXM/MAG ist eine gemeinsame Liste)
const CLASS_DE = { HXM: ["sorcerer"], MAG: ["wizard"], MEN: ["psychic"], HEX: ["witch"], KLE: ["cleric"], BAR: ["bard"], DRU: ["druid"], OKK: ["occultist"], SHA: ["shaman"], INQ: ["inquisitor"], MES: ["mesmerist"], KAM: ["magus"], SPI: ["spiritualist"], MED: ["medium"], ALC: ["alchemist"], PKM: ["summoner"], WAL: ["ranger"], BLU: ["bloodrager"], PAL: ["paladin"], ANP: ["antipaladin"], ERM: ["investigator"], SKA: ["skald"] };
// Klassen, deren Listen im Deutschen nicht eigens stehen (abgeleitet), zählen beim Fehlen nicht
const DERIVED = new Set(["arcanist", "oracle", "hunter", "warpriest", "skald", "investigator", "redmantisassassin", "sahirafiyun", "adept", "summoner (unchained)", "unchained summoner"]);
const SOURCE_DE = { GRW: /core/i, EXP: /advanced player|apg/i, ABR: /ultimate magic/i, "ABR II": /ultimate combat/i, "ABR III": /advanced race/i, "ABR V": /mythic/i, "ABR VI": /advanced class guide/i, "ABR VII": /occult adventures/i, "ABR VIII": /ultimate intrigue/i, "ABR IX": /horror adventures/i, "ABR X": /ultimate wilderness/i, ABRX: /ultimate wilderness/i, AMAG: /inner sea magic/i, VvG: /inner sea races/i, "BDV III": /book of the damned.*3|horsemen/i, ATEC: /technology guide/i, AINT: /inner sea intrigue/i, WKO: /villain codex/i };

// Namensbestandteile als Gleichstandsbrecher (deutsche und englische Zaubernamen sind frei übertragen)
const LEX = { wasser: "water", feuer: "fire|flame|burning", luft: "air|wind", erde: "earth|stone", stein: "stone", schutz: "protection|ward", chaos: "chaos", böse: "evil", bösem: "evil", gutem: "good", gute: "good", ordnung: "law", gesetz: "law", monster: "monster", schild: "shield", licht: "light", dunkelheit: "darkness", schatten: "shadow", eis: "ice|frost", kälte: "cold|frost", blitz: "lightning|bolt", tod: "death", leben: "life", heilen: "cure|heal", heilung: "heal", wunden: "wounds", verursachen: "inflict", mächtige: "greater", mächtiger: "greater", mächtiges: "greater", schwache: "lesser", schwacher: "lesser", schwaches: "lesser", massen: "mass", tier: "animal", tiere: "animal", pflanze: "plant", pflanzen: "plant", untote: "undead", untoten: "undead", geist: "mind|spirit", gedanken: "thought|mind", magie: "magic|spell", zauber: "spell", entdecken: "detect", bannen: "dispel", verbergen: "hide|conceal", unsichtbarkeit: "invisibility", unsichtbar: "invisib", atmen: "breathing|breath", fliegen: "fly|flight", sprung: "jump", schritt: "step", tor: "gate", tür: "door", wand: "wall", waffe: "weapon", rüstung: "armor", klinge: "blade", hand: "hand", auge: "eye", augen: "eye", blick: "sight|gaze", stimme: "voice", wort: "word", zunge: "tongue", zungen: "tongue", gestalt: "form|shape", körper: "body", blut: "blood", knochen: "bone", sonne: "sun", mond: "moon", stern: "star", sturm: "storm", nebel: "fog|mist|cloud", wolke: "cloud", gift: "poison", krankheit: "disease", fluch: "curse", segen: "bless", furcht: "fear", schrecken: "fear|terror", schlaf: "sleep", traum: "dream", herbeizaubern: "summon", erschaffen: "create", ruf: "call", rune: "rune", siegel: "seal|sigil", falle: "trap", schloss: "lock", zeit: "time", ebene: "planar|plane", energie: "energy|force", säure: "acid", schall: "sound|sonic", elektrizität: "electric|shock" };
const nameMatch = (de, en) => {
  const e = en.toLowerCase();
  let n = 0;
  for (const w of de.toLowerCase().split(/[^a-zäöüß]+/)) if (LEX[w] && new RegExp(LEX[w]).test(e)) n++;
  return Math.min(n, 3);
};
const castKey = (s, de) => {
  s = (s || "").toLowerCase();
  const n = (s.match(/^\s*(\d+)/) || [, "1"])[1];
  const u = de
    ? /standard/.test(s) ? "standard" : /schnell/.test(s) ? "swift" : /augenblick/.test(s) ? "immediate" : /voll/.test(s) ? "full" : /runde/.test(s) ? "round" : /min/.test(s) ? "minute" : /stunde/.test(s) ? "hour" : /tag/.test(s) ? "day" : ""
    : /standard/.test(s) ? "standard" : /swift/.test(s) ? "swift" : /immediate/.test(s) ? "immediate" : /full/.test(s) ? "full" : /round/.test(s) ? "round" : /min/.test(s) ? "minute" : /hour/.test(s) ? "hour" : /day/.test(s) ? "day" : "";
  return u ? `${["standard", "swift", "immediate", "full"].includes(u) ? 1 : n} ${u}` : "";
};
const compKey = (s, de) => {
  const t = (s || "").replace(/\([^)]*\)/g, "").toUpperCase();
  const set = new Set((t.match(/\b(GF|DF|V|G|S|M|F)\b/g) || []).map((c) => (de ? { G: "S", GF: "DF" }[c] || c : c)));
  return [...set].sort().join(",");
};
const rangeKey = (s, de) => {
  s = (s || "").toLowerCase();
  if (de) {
    if (/persönlich/.test(s)) return "personal";
    if (/berührung/.test(s)) return "touch";
    if (/^nah/.test(s)) return "close";
    if (/^mittel/.test(s)) return "medium";
    if (/^(lang|weit)/.test(s)) return "long";
    if (/unbegrenzt/.test(s)) return "unlimited";
    const m = s.match(/^([\d,]+)\s*(m|km)\b/);
    if (m) return String(Math.round(parseFloat(m[1].replace(",", ".")) * (m[2] === "km" ? 1000 : 1) / 0.3));
  } else {
    for (const k of ["personal", "touch", "close", "medium", "long", "unlimited"]) if (s.startsWith(k)) return k;
    const m = s.match(/^([\d,]+)\s*(ft|feet|mile)/);
    if (m) return String(Math.round(parseFloat(m[1].replace(",", "")) * (m[2] === "mile" ? 5280 : 1)));
  }
  return "";
};
const durKey = (s, de) => {
  s = (s || "").toLowerCase();
  const W = de
    ? [["augenblick", "inst"], ["permanent", "perm"], ["konzentration", "conc"], ["runde", "round"], ["min", "minute"], ["stunde", "hour"], ["tag", "day"], ["/stufe", "/lvl"], ["(a)", "D"], ["entladung", "disch"]]
    : [["instant", "inst"], ["permanent", "perm"], ["concentration", "conc"], ["round", "round"], ["min", "minute"], ["hour", "hour"], ["day", "day"], ["/level", "/lvl"], ["(d)", "D"], ["discharge", "disch"]];
  return new Set(W.filter(([w]) => s.includes(w)).map(([, k]) => k));
};
const saveKey = (s, de) => {
  s = (s || "").toLowerCase();
  if (de) return /^(wil|willen)/.test(s) ? "will" : /^(zäh)/.test(s) ? "fort" : /^ref/.test(s) ? "ref" : /^(kein|nein)/.test(s) ? "none" : s ? "other" : "";
  return /^will/.test(s) ? "will" : /^fort/.test(s) ? "fort" : /^ref/.test(s) ? "ref" : /^(none|no\b)/.test(s) ? "none" : s ? "other" : "";
};
const srKey = (s) => (/^(ja|yes)/i.test(s || "") ? "y" : /^(nein|no)/i.test(s || "") ? "n" : "");
// Zahlen im Regeltext ohne Entfernungen und Würfel (SG 15, +2, maximal 10 …)
const nums = (t, de) => new Set([...(t || "").replace(de ? /\d+W\d+/g : /\d+d\d+/g, " ").matchAll(de ? /(?<![\d,])(\d+)(?![\d,]*\s*(m|km|Meter)\b)/g : /(?<![\d.])(\d+)(?![\d]*[\s-]*(ft|feet|foot|mile)\b)/g)].map((m) => m[1]).filter((n) => +n > 1));
const dice = (t, de) => new Set([...(t || "").matchAll(de ? /(\d+)W(\d+)/g : /(\d+)d(\d+)/g)].map((m) => `${m[1]}d${m[2]}`));

function fpDe(x) {
  const f = x.fields;
  const sch = f.Schule || "";
  const levels = {};
  for (const part of (f.Grad || "").split(/,\s*/)) {
    const m = part.match(/^([A-ZÄÖÜ/]+)\s*(\d)/);
    if (!m) continue;
    for (const code of m[1].split("/")) for (const k of CLASS_DE[code] || []) levels[k] = +m[2];
  }
  const sub = (sch.match(/\(([^)]+)\)/) || [])[1];
  const desc = new Set(((sch.match(/\[([^\]]+)\]/) || [])[1] || "").replace(/\s+/g, "").replace(/\(ABR\)|ABR/g, "").split(/,|oder/).map((w) => DESC_DE[w[0] ? w[0].toUpperCase() + w.slice(1) : w]).filter(Boolean));
  const book = x.source.replace(/\s*\d+$/, "").trim();
  return {
    school: (SCHOOL_DE.find(([r]) => r.test(sch)) || [])[1] || "",
    sub: sub ? SUB_DE[sub.split(/[,\s]/)[0]] || "" : "",
    desc, levels, comp: compKey(f.Komponenten, true), cast: castKey(f.Zeitaufwand, true), range: rangeKey(f.Reichweite, true),
    dur: durKey(f.Wirkungsdauer, true), save: saveKey(f.Rettungswurf, true), sr: srKey(f.Zauberresistenz),
    dice: dice(x.text, true), nums: nums(x.text, true), len: x.text.length, book: SOURCE_DE[book] || null,
  };
}
function fpEn(s) {
  return {
    school: s.school, sub: (s.subschool || [])[0] || "", desc: new Set((s.descriptors || []).map((d) => d.toLowerCase())), levels: s.levels, comp: compKey(s.components, false), cast: castKey(s.casting_time, false),
    range: rangeKey(s.range, false), dur: durKey(s.duration, false), save: saveKey(s.saving_throw, false), sr: srKey(s.spell_resistance),
    dice: dice(s.description, false), nums: nums(s.description, false), len: (s.description || "").length, source: s.source || "",
  };
}
function score(d, en) {
  let p = 0;
  p += d.school === en.school ? 3 : -4;
  if (d.sub && en.sub) p += d.sub === en.sub ? 1 : -1;
  for (const k of d.desc) p += en.desc.has(k) ? 1 : -1.5;
  for (const k of en.desc) if (!d.desc.has(k) && Object.values(DESC_DE).includes(k)) p -= 1;
  for (const [k, lv] of Object.entries(d.levels)) p += en.levels[k] == null ? -1 : en.levels[k] === lv ? 2 : -2;
  for (const k of Object.keys(en.levels)) if (!DERIVED.has(k) && d.levels[k] == null) p -= 1;
  if (d.comp && en.comp) p += d.comp === en.comp ? 1.5 : -1;
  if (d.cast && en.cast) p += d.cast === en.cast ? 1 : -1;
  if (d.range && en.range) p += d.range === en.range ? 1 : -1;
  if (d.dur.size || en.dur.size) {
    const inter = [...d.dur].filter((k) => en.dur.has(k)).length;
    p += inter === d.dur.size && inter === en.dur.size ? 1.5 : inter ? 0 : -1;
  }
  if (d.save && en.save) p += d.save === en.save ? 1 : -1;
  if (d.sr && en.sr) p += d.sr === en.sr ? 0.5 : -0.5;
  if (d.book) p += d.book.test(en.source) ? 2 : -0.5;
  if (d.dice.size || en.dice.size) {
    const inter = [...d.dice].filter((k) => en.dice.has(k)).length;
    p += 4 * inter / (d.dice.size + en.dice.size - inter) - (d.dice.size && en.dice.size && !inter ? 1 : 0);
  }
  if (d.nums.size || en.nums.size) {
    const inter = [...d.nums].filter((k) => en.nums.has(k)).length;
    p += 3 * inter / (d.nums.size + en.nums.size - inter);
  }
  // Länge: Deutsch ist rund ein Viertel länger
  if (d.len > 80 && en.len > 80) p -= Math.min(4, 3 * Math.abs(Math.log(d.len / en.len / 1.25)));
  return p;
}

// ---------------------------------------------------------------------------------------------
// 4. Zuordnen: bester Treffer über der Schwelle, mit Abstand, und gegenseitig der beste
// ---------------------------------------------------------------------------------------------
const MIN = 10, GAP = 2.5;
function load(file, name) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(readFileSync(file, "utf8"), ctx);
  return ctx.window[name];
}
const SPELLS = load(join(ROOT, "data/spells.js"), "SPELLS");
const localFile = join(ROOT, "data/profile.local.js");
const overrides = existsSync(localFile) ? ((load(localFile, "PROFILE_LOCAL") || {}).rulesDe || {}).overrides || {} : {};

const lines = readLines(PDF);
const entries = parseEntries(lines);
const table = readTable(lines.raw);
// englischer Name → Zauber (auch „Lesser X“ ↔ „X, Lesser“, Groß-/Kleinschreibung, Satzzeichen)
const normEn = (n) => n.toLowerCase().replace(/[’']/g, "").replace(/-/g, " ").replace(/^(lesser|greater|mass|communal|improved|major|minor) (.+)$/, "$2 $1").replace(/[^a-z0-9]+/g, "");
const enByName = new Map();
for (const s of SPELLS) for (const k of [normEn(s.name), normEn(s.name.replace(/^(.+), (\w+)$/, "$2 $1"))]) if (!enByName.has(k)) enByName.set(k, s);
// unscharf: Tippfehler in der Tabelle (höchstens zwei Buchstaben)
const enKeys = [...enByName.keys()];
const findEn = (name) => {
  const k = normEn(name);
  if (enByName.has(k)) return enByName.get(k);
  if (k.length < 7) return null;
  let best = null, bd = 3;
  for (const c of enKeys) if (Math.abs(c.length - k.length) <= 2) { const d = lev(c, k); if (d < bd) { bd = d; best = c; } }
  return best ? enByName.get(best) : null;
};
const tableKey = (de, src) => de.toLowerCase().replace(/\s+/g, " ").trim() + "|" + src.replace(/\s+/g, " ").trim();
const tableMap = new Map(table.map((r) => [tableKey(r.de, r.src), r.en]));
const enFp = SPELLS.map((s) => ({ s, fp: fpEn(s) }));
// Dubletten im englischen Datensatz (z. B. „Summon Monster III“ und „Summon Monster 3“): gleicher Schlüssel
const ROMAN = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9 };
const lev = (a, b) => {
  const d = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0]++;
    for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = t; }
  }
  return d[b.length];
};
const twinKey = (n) => n.toLowerCase().replace(/\b(i{1,3}|iv|v|vi{1,3}|ix)\b/g, (r) => ROMAN[r]).replace(/[^a-z0-9]/g, "");
const res = entries.map((x) => {
  const d = fpDe(x);
  // Übersetzungstabelle: englischer Name bekannt → Treffer, wenn der Fingerabdruck nicht widerspricht
  const enName = tableMap.get(tableKey(x.name, x.source));
  const hit = enName && findEn(enName);
  if (hit) {
    const p = score(d, fpEn(hit));
    const twins = SPELLS.filter((s) => s !== hit && twinKey(s.name) === twinKey(hit.name)).map((s) => ({ id: s.id, name: s.name, p }));
    const best = { id: hit.id, name: hit.name, p };
    if (p > -6) return { x, best, twins: [best, ...twins], second: { p: -99 }, top: [best], table: true };
  }
  const ranked = enFp.map((e) => ({ id: e.s.id, name: e.s.name, p: score(d, e.fp) + 1.5 * nameMatch(x.name, e.s.name) })).sort((a, b) => b.p - a.p);
  // Zwillinge des besten Treffers zählen nicht als Konkurrenz und bekommen denselben Eintrag
  const tk = twinKey(ranked[0].name);
  const isTwin = (t) => { const k = twinKey(t.name); return k === tk || (tk.length > 6 && Math.abs(t.p - ranked[0].p) < 0.01 && lev(k, tk) <= 2); };
  const twins = ranked.slice(0, 5).filter(isTwin);
  const others = ranked.filter((t) => !twins.includes(t));
  return { x, best: ranked[0], twins, second: others[0], top: ranked.slice(0, 3) };
});
// gegenseitig bester: je englischem Zauber der beste deutsche Eintrag
const bestFor = new Map();
for (const r of res) {
  const cur = bestFor.get(r.best.id);
  if (!cur || r.table || (!cur.table && r.best.p > cur.best.p)) bestFor.set(r.best.id, r);
}
// was über die Tabelle vergeben ist, kann der Fingerabdruck nicht mehr nehmen
const taken = new Set(res.filter((r) => r.table).map((r) => r.best.id));
const byId = new Map(SPELLS.map((s) => [s.id, s]));
const out = {};
const amb = [], weak = [];
for (const r of res) {
  const forced = overrides[r.x.name];
  if (forced) {
    if (byId.has(forced)) out[forced] = r.x;
    continue;
  }
  const gap = r.best.p - r.second.p;
  const ok = r.table || (((r.best.p >= MIN && gap >= GAP) || (r.best.p >= 7 && gap >= 5)) && bestFor.get(r.best.id) === r);
  if (ok && !r.table && taken.has(r.best.id)) { weak.push(r); continue; }
  if (ok) {
    for (const t of r.twins) if (!out[t.id] || r.table) out[t.id] = r.x;
  } else if (r.best.p >= MIN) amb.push(r);
  else weak.push(r);
}
const unmatchedEn = SPELLS.filter((s) => !out[s.id]);

// ---------------------------------------------------------------------------------------------
// 5. Ausgabe
// ---------------------------------------------------------------------------------------------
const data = Object.fromEntries(Object.entries(out).sort().map(([id, x]) => [id, { name: x.name, source: x.source, fields: x.fields, text: x.text }]));
writeFileSync(join(ROOT, "data/rules.de.local.js"),
  `// Deutsche Regeldaten (MyPFDB, OGL; deutsche Begriffe mit Genehmigung von Ulisses Spiele) – nur lokal, nie veröffentlichen.\n` +
  `// Erzeugt von tools/import-rules-de.mjs am ${new Date().toISOString().slice(0, 10)}.\nwindow.RULES_DE = ${JSON.stringify(data)};\n`);
const row = (r) => `| ${r.x.name} (${r.x.source}) | ${r.top.map((t) => `${t.name} ${t.p.toFixed(1)}`).join(" · ")} |`;
writeFileSync(join(ROOT, "data/research/rules-de-review.md"),
  `# Prüfliste deutsche Regeldaten\n\nErzeugt von tools/import-rules-de.mjs. Handzuordnungen: \`PROFILE_LOCAL.rulesDe.overrides = { "Deutscher Name": "english-id" }\`.\n\n` +
  `- zugeordnet: ${Object.keys(out).length} von ${entries.length} deutschen Einträgen (${SPELLS.length} englische Zauber)\n- mehrdeutig: ${amb.length}\n- schwach (unter ${MIN} Punkten): ${weak.length}\n- englisch ohne deutschen Eintrag: ${unmatchedEn.length}\n\n` +
  `## Mehrdeutig\n\n| Deutsch | beste Treffer |\n|---|---|\n${amb.map(row).join("\n")}\n\n## Schwach\n\n| Deutsch | beste Treffer |\n|---|---|\n${weak.map(row).join("\n")}\n\n` +
  `## Englisch ohne deutschen Eintrag\n\n${unmatchedEn.map((s) => `- ${s.name} (${s.source})`).join("\n")}\n`);
console.log(`Übersetzungstabelle: ${table.length} Zeilen, ${res.filter((r) => r.table).length} Einträge darüber zugeordnet`);
console.log(`${entries.length} deutsche Einträge · zugeordnet ${Object.keys(out).length} · mehrdeutig ${amb.length} · schwach ${weak.length} · englisch offen ${unmatchedEn.length}`);
const dump = arg("--dump");
if (dump) writeFileSync(dump, JSON.stringify(res.map((r) => ({ de: r.x.name, src: r.x.source, top: r.top })), null, 1));
if (process.argv.includes("--table-misses")) {
  const miss = table.filter((r) => r.en && !findEn(r.en));
  console.log(`Tabelle ohne englischen Treffer: ${miss.length}`);
  console.log(miss.slice(0, 60).map((r) => `${r.de} = ${r.en} (${r.src})`).join("\n"));
  const rej = res.filter((r) => !r.table && tableMap.get(tableKey(r.x.name, r.x.source)) && findEn(tableMap.get(tableKey(r.x.name, r.x.source))));
  console.log(`vom Fingerabdruck abgelehnt: ${rej.length}`, rej.slice(0, 20).map((r) => r.x.name + " = " + tableMap.get(tableKey(r.x.name, r.x.source))).join("; "));
}

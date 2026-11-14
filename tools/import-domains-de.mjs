#!/usr/bin/env node
// Deutsche Domänen und Unterdomänen (MyPFDB-PDF „Alles zu Domänen“, lokal in spells/) einlesen und den
// englischen Namen aus data/deities.js zuordnen. Zuordnung über die Domänenzauber: die deutschen Zaubernamen
// werden über data/rules.de.js zu englischen Zauber-Ids, die englischen Listen kommen von den
// Domänenseiten der Archives of Nethys (zwischengespeichert in data/research/aon-domains/).
// Ergebnis (beides gitignoriert):
//   data/domains.de.js            window.DOMAINS_DE = { [englischer Name]: { name, full, kind, parents, source, intro, powers, spells } }
//   data/research/domains-de-review.md  nicht zugeordnete und unsichere Einträge
// Gegenprobe: Zahlen, Würfel und Längen der eigenen Kräfte gegen die englischen Kräftetexte (tools/lib/textcheck.mjs);
// Werte unter 0,5 stehen in der Prüfliste. Doppelte deutsche Einträge übernehmen die Zuordnung des ersten.
// Aufruf: node tools/import-domains-de.mjs [--pdf spells/mypfdb/…Domänen….pdf] [--fetch] [--dump einträge.json] [--check-debug]
// Braucht pdftohtml (poppler-utils); --fetch lädt die englischen Seiten neu.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { compare } from "./lib/textcheck.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const findPdf = () => {
  const dir = join(ROOT, "spells/mypfdb");
  const f = existsSync(dir) && readdirSync(dir).find((n) => /Dom.*nen.*\.pdf$/i.test(n));
  return f ? join(dir, f) : join(ROOT, "spells/domaenen.pdf");
};
const PDF = arg("--pdf") ? join(ROOT, arg("--pdf")) : findPdf();
const AON = join(ROOT, "data/research/aon-domains");

function load(file, name) {
  const ctx = { window: {} };
  vm.runInNewContext(readFileSync(file, "utf8"), ctx);
  return ctx.window[name];
}
const SPELLS = load(join(ROOT, "data/spells.js"), "SPELLS");
const DEITIES = load(join(ROOT, "data/deities.js"), "DEITIES");
const localFile = join(ROOT, "data/profile.local.js");
// Handzuordnungen: { "Unterdomäne der Ritterlichkeit": "Chivalry (Glory)" } in PROFILE_LOCAL.rulesDe.domainOverrides
const OVERRIDES = existsSync(localFile) ? ((load(localFile, "PROFILE_LOCAL") || {}).rulesDe || {}).domainOverrides || {} : {};
const RULES_DE = existsSync(join(ROOT, "data/rules.de.js")) ? load(join(ROOT, "data/rules.de.js"), "RULES_DE") : null;
if (!RULES_DE) { console.error("data/rules.de.js fehlt – zuerst tools/import-rules-de.mjs laufen lassen."); process.exit(1); }

// ---------------------------------------------------------------------------------------------
// 1. Englisch: Domänenseiten der Archives of Nethys
// ---------------------------------------------------------------------------------------------
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’" };
const decode = (s) => s.replace(/<[^>]+>/g, "").replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, c) => c[0] === "#" ? String.fromCodePoint(c[1] === "x" ? parseInt(c.slice(2), 16) : +c.slice(1)) : ENT[c] ?? m).replace(/\s+/g, " ").trim();

const DOMAINS_EN = [...new Set(DEITIES.flatMap((d) => d.domains || []))].filter((d) => /^[A-Z][a-z]+$/.test(d) && d !== "Animals");
async function fetchAon() {
  mkdirSync(AON, { recursive: true });
  for (const d of DOMAINS_EN) {
    const f = join(AON, `${d}.html`);
    if (existsSync(f) && !process.argv.includes("--fetch")) continue;
    const r = await fetch(`https://aonprd.com/DomainDisplay.aspx?ItemName=${encodeURIComponent(d)}`, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) { console.warn(`AoN ${d}: ${r.status}`); continue; }
    writeFileSync(f, await r.text());
  }
}

const spellIdByEn = new Map(SPELLS.map((s) => [s.name.toLowerCase().replace(/[’']/g, "'"), s.id]));
// Kursiv gesetzte Zaubernamen nach „1st—“; angehängte Buchkürzel (APG, UC, …) abschneiden
function enSpells(html) {
  const out = {};
  for (const m of html.matchAll(/(\d)(?:st|nd|rd|th)\s*[—–-]\s*<i>\s*([^<]+)<\/i>/g)) {
    let n = decode(m[2]).toLowerCase().replace(/[’']/g, "'");
    if (!spellIdByEn.has(n)) n = n.replace(/(apg|uc|um|arg|acg|oa|ui|hа|ha|uw|isg|ism)+$/i, "").trim();
    out[m[1]] = spellIdByEn.get(n) || n;
  }
  return out;
}
const POWER_RE = /<i>([^<]+?)\s*\((Su|Sp|Ex)\)<\/i>/g;
function parseAon(domain, html) {
  // Domäne: alles vor der ersten Unterdomäne; jede Unterdomäne hat eine eigene <h2 class="title">
  const parts = html.split(/<h2 class="title">(?=(?:(?!<\/h2>).)*Subdomain<\/h2>)/s);
  const head = parts[0];
  const powersOf = (sec) => [...sec.matchAll(POWER_RE)].map((m) => ({ name: decode(m[1]), type: m[2], text: decode(sec.slice(m.index + m[0].length).replace(/^\s*:/, "").split(/<br|<h2/)[0]) }));
  const srcOf = (sec) => decode((sec.match(/<b>Source<\/b>(.*?)<br/) || [, ""])[1]);
  const hs = head.slice(head.lastIndexOf("<b>Source</b>"));
  const main = { en: domain, kind: "domain", parents: [], source: srcOf(hs), powers: powersOf(hs.slice(hs.indexOf("Granted Powers"))), spells: enSpells((hs.match(/<b>Domain Spells<\/b>(.*?)(<br|$)/s) || [, ""])[1]) };
  const recs = [main];
  for (const sec of parts.slice(1)) {
    const title = decode(sec.slice(0, sec.indexOf("</h2>")));
    const sm = title.match(/^(.+?) Subdomain$/);
    if (!sm) continue;
    const assoc = decode((sec.match(/<b>Associated Domain\(s\)<\/b>:(.*?)<br/) || [, domain])[1]).split(/,\s*/).filter(Boolean);
    const repl = enSpells((sec.match(/<b>Replacement Domain Spells<\/b>(.*?)(<br|$)/s) || [, ""])[1]);
    recs.push({ en: sm[1], kind: "subdomain", page: domain, parents: assoc, source: srcOf(sec), powers: powersOf(sec), repl, spells: { ...main.spells, ...repl } });
  }
  return recs;
}

// ---------------------------------------------------------------------------------------------
// 2. Deutsch: PDF → Einträge (Name 30 pt, Quelle, Text bis zum ersten Zauberkopf 15 pt)
// ---------------------------------------------------------------------------------------------
// Gesperrt gesetzte Zeilen („F r e i h e i t   ( Ü F )“): Wortabstand = mehrere Leerzeichen
const unspace = (raw) => decode(raw.replace(/<[^>]+>/g, "").replace(/(?:(?<!\S)\S {1,3}){5,}\S(?!\S)/g, (seg) => seg.replace(/ {2,}/g, "\u0000").replace(/ /g, "").replace(/\u0000/g, " ")));
function readEntries(pdf) {
  const dir = mkdtempSync(join(tmpdir(), "domains-de-"));
  execFileSync("pdftohtml", ["-xml", "-i", "-q", pdf, join(dir, "out")]);
  const xml = readFileSync(join(dir, "out.xml"), "utf8");
  const size = {};
  for (const m of xml.matchAll(/<fontspec id="(\d+)" size="(\d+)"/g)) size[m[1]] = +m[2];
  const entries = [];
  let cur = null;
  for (const pm of xml.matchAll(/<page number="(\d+)"[^>]*width="(\d+)"[^>]*>([\s\S]*?)<\/page>/g)) {
    const [, no, w, body] = pm;
    if (+no < 5) continue;
    const items = [];
    for (const t of body.matchAll(/<text top="(\d+)" left="(\d+)" width="(\d+)" height="(\d+)" font="(\d+)">([\s\S]*?)<\/text>/g)) {
      const it = { page: +no, top: +t[1], left: +t[2], size: size[t[5]], text: unspace(t[6]) };
      if (!it.text) continue;
      it.col = it.left < +w / 2 ? 0 : 1;
      items.push(it);
    }
    items.sort((a, b) => a.col - b.col || a.top - b.top || a.left - b.left);
    for (const it of items) {
      if (it.size >= 25) {
        // Name, ggf. über zwei Zeilen
        if (cur && cur.lines.length === 0 && cur.page === it.page && it.top - cur.top < 45) { cur.name += " " + it.text; cur.top = it.top; continue; }
        cur = { name: it.text, page: it.page, top: it.top, lines: [], done: false };
        entries.push(cur);
        continue;
      }
      if (!cur || cur.done) continue;
      if (it.size === 15) { cur.done = true; continue; } // erster mitgelieferter Zaubertext
      if (it.size !== 11) continue; // Kopf-/Fußzeilen, „Steigerungtabelle“
      const last = cur.lines[cur.lines.length - 1];
      if (last && last.page === it.page && last.col === it.col && Math.abs(last.top - it.top) <= 4) last.text += " · " + it.text;
      else cur.lines.push({ ...it });
    }
  }
  return entries.filter((e) => /dom[äa]ne/i.test(e.name)).map(parseEntry);
}

// Text in Absätze: neuer Absatz bei größerem Zeilenabstand oder Spaltenwechsel nach kurzer Zeile
const OPENER = /^([A-ZÄÖÜ][^:()]{1,60}?\s*\((ÜF|ZF|AF|BF)\):|Verliehene Fähigkeiten:|(Ersatz)?[Dd]omänenzauber:|(Ober|Haupt)domäne:|Ersatzfähigkeit|Hinweis:)/;
function paragraphs(lines) {
  const out = [];
  let prev = null;
  for (const l of lines) {
    const gap = prev && prev.page === l.page && prev.col === l.col ? l.top - prev.top : 99;
    const t = l.text;
    const last = out[out.length - 1];
    const split = !prev || OPENER.test(t) || /^(Ober|Haupt)domäne:/.test(last) || (gap > 19 && gap < 99) || (gap === 99 && /[.:]$/.test(last) && /^[A-ZÄÖÜ]/.test(t));
    if (split) out.push(t);
    else out[out.length - 1] = /-$/.test(last) && /^[a-zäöüß]/.test(t) ? last.slice(0, -1) + t : last + " " + t;
    prev = l;
  }
  return out;
}

const TYPE = { ÜF: "Su", ZF: "Sp", AF: "Ex", BF: "BF" };
function parseEntry(e) {
  const lines = e.lines.slice();
  const source = lines.length && /^[A-ZÄÖÜ][A-Za-zÄÖÜäöü ]*\d+(\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöü ]*\d+)*$/.test(lines[0].text) ? lines.shift().text : "";
  // Steigerungstabelle (Zeilen mit „ · “ oder „Stufe · Speziell“) überspringen
  const body = lines.filter((l) => !/ · /.test(l.text) && !/^(Stufe|\d+)$/.test(l.text.trim()));
  const paras = paragraphs(body);
  const x = { full: e.name.replace(/\s+/g, " ").trim(), source, page: e.page, kind: /^Unterdom/i.test(e.name) ? "subdomain" : "domain", parent: "", intro: "", powers: [], spells: {}, text: [] };
  for (const p of paras) {
    let m;
    if ((m = p.match(/^(?:Ober|Haupt)domäne:\s*(.+?)\.?$/))) x.parent = m[1].trim();
    else if ((m = p.match(/^Verliehene Fähigkeiten:\s*(.*)$/))) x.intro = m[1];
    else if ((m = p.match(/^(?:Ersatz)?[Dd]omänenzauber:\s*(.*)$/))) {
      for (const s of m[1].replace(/\.$/, "").split(/,\s*(?=\d\s*-)/)) {
        const sm = s.match(/^(\d)\s*-\s*(.+)$/);
        if (sm) x.spells[sm[1]] = sm[2].trim();
      }
    } else if ((m = p.match(/^([A-ZÄÖÜ][^:()]{1,60}?)\s*\((ÜF|ZF|AF|BF)\):\s*(.*)$/))) x.powers.push({ name: m[1].trim(), type: TYPE[m[2]], text: m[3] });
    else x.text.push(p);
  }
  return x;
}

// Kurzname: „Domäne des Adels“ → „Adel“, „Unterdomäne der Seuchen (Böses)“ → „Seuchen (Böses)“
const ADJ = { Bösen: "Böses", Guten: "Gutes", Arkanen: "Arkanes", Göttlichen: "Göttliches" };
const ADJ_PL = { Schuppenartigen: "Schuppenartige", Unvermeidbaren: "Unvermeidbare" };
function shortName(full) {
  let m = full.match(/^(?:Unter)?[Dd]omäne (der|des) (\S+)(.*)$/);
  if (!m) return full.replace(/domäne$/i, "").replace(/^(.)/, (c) => c.toUpperCase()) || full;
  let [, art, w, rest] = m;
  if (ADJ_PL[w]) w = ADJ_PL[w];
  else if (art === "des") {
    if (ADJ[w]) w = ADJ[w];
    else if (/os$/.test(w)) {} // Chaos
    else if (/[^aeiouäöü]es$/.test(w) && !/(ers|els|ens)$/.test(w) && w.length >= 5) w = w.slice(0, -2);
    else if (/s$/.test(w)) w = w.slice(0, -1);
  }
  return (w + rest).trim();
}

// ---------------------------------------------------------------------------------------------
// 3. Zuordnung über die Domänenzauber
// ---------------------------------------------------------------------------------------------
const norm = (s) => s.toLowerCase().replace(/[„“"]/g, "").replace(/\s+/g, " ").trim();
const idsByDe = new Map();
for (const [id, r] of Object.entries(RULES_DE)) {
  const k = norm(r.name);
  if (!idsByDe.has(k)) idsByDe.set(k, new Set());
  idsByDe.get(k).add(id);
}
const deIds = (n) => idsByDe.get(norm(n)) || idsByDe.get(norm(n.replace(/\s*\([^)]*\)\s*$/, ""))) || idsByDe.get(norm(n.replace(/\/.*$/, ""))) || idsByDe.get(norm(n.replace(/^.*\//, ""))) || new Set();

function overlap(de, en) {
  let hit = 0, known = 0;
  for (const [lv, n] of Object.entries(de.spells)) {
    const ids = deIds(n);
    if (!ids.size) continue;
    known++;
    if (en.spells[lv] && ids.has(en.spells[lv])) hit++;
  }
  return { hit, known };
}

async function main() {
  await fetchAon();
  const en = [];
  for (const d of DOMAINS_EN) {
    const f = join(AON, `${d}.html`);
    if (existsSync(f)) en.push(...parseAon(d, readFileSync(f, "utf8")));
  }
  const de = readEntries(PDF);
  if (arg("--dump")) writeFileSync(arg("--dump"), JSON.stringify(de, null, 1));

  // erst Domänen, dann Unterdomänen. Oberdomäne: die Domäne, hinter der die Unterdomäne in der PDF steht.
  // Englische Unterdomänen gibt es je Domänenseite einmal (Zauber = Domänenzauber + Ersatzzauber).
  const domOf = new Map(); // deutscher Volltitel → englische Domäne
  const result = [];
  const review = [];
  const pagesDe = (s) => new Set([...(s || "").matchAll(/(\d+)/g)].map((m) => +m[1]));
  const pagesEn = (s) => [...(s || "").matchAll(/pg\. (\d+)/g)].map((m) => +m[1]);
  const rank = (x, cands) => cands.map((c) => {
    const o = overlap(x, c);
    const dp = pagesDe(x.source);
    const src = pagesEn(c.source).some((n) => dp.has(n)) ? 2.5 : 0;
    return { c, o, s: o.hit + src + (c.powers.length === x.powers.length ? 0.3 : 0) };
  }).sort((p, q) => q.s - p.s);
  const why = (sc) => sc.slice(0, 2).map((r) => `${r.c.en}${r.c.page ? ` (${r.c.page})` : ""} ${r.o.hit}/${r.o.known} [${r.s.toFixed(1)}]`).join(", dann ") || "keine Kandidaten";
  let lastDom = "";
  const subs = [];
  for (const x of de) {
    if (x.kind === "domain") {
      const sc = rank(x, en.filter((c) => c.kind === "domain"));
      const [p, q] = sc;
      lastDom = "";
      if (p && p.o.hit >= 5 && p.o.hit >= p.o.known - 2 && (!q || p.s - q.s >= 2)) { domOf.set(x.full, p.c.en); lastDom = p.c.en; result.push({ x, c: p.c, o: p.o }); }
      else review.push({ x, why: why(sc) });
      continue;
    }
    subs.push({ x, lastDom });
  }
  // Oberdomäne: Zeile „Oberdomäne:“, sonst deutsche Klammer im Namen, sonst die Domäne davor in der PDF
  const domByShort = new Map([...domOf].map(([full, enName]) => [shortName(full), enName]));
  const cands = [];
  const taken = new Set();
  const twins = []; // doppelte deutsche Einträge (andere Quelle): übernehmen die Zuordnung des ersten
  const seen = new Map();
  for (const { x, lastDom } of subs) {
    const tk = shortName(x.full).toLowerCase() + "|" + (x.parent || lastDom);
    if (seen.has(tk)) { twins.push({ x, first: seen.get(tk) }); continue; }
    seen.set(tk, x);
    const ov = OVERRIDES[x.full] && OVERRIDES[x.full].match(/^(.+?) \((.+)\)$/);
    if (ov) {
      const c = en.find((k) => k.kind === "subdomain" && k.en === ov[1] && k.page === ov[2]);
      if (c) { taken.add(c.en + "|" + c.page); result.push({ x, c, o: overlap(x, c), par: ov[2] }); continue; }
      review.push({ x, why: `Handzuordnung ${OVERRIDES[x.full]} nicht gefunden` });
    }
    if (/\[/.test(x.full)) { review.push({ x, why: "Variante in eckigen Klammern, übersprungen" }); continue; }
    const paren = (x.full.match(/\(([^)]+)\)\s*$/) || [])[1];
    const par = domOf.get(x.parent) || domByShort.get(paren) || lastDom;
    const sc = rank(x, en.filter((c) => c.kind === "subdomain" && (!par || c.page === par)));
    cands.push({ x, par, sc });
  }
  // eindeutig zuordnen: sicherste Fälle zuerst, jede englische Unterdomäne (je Domänenseite) nur einmal
  const margin = (r) => (r.sc[0] ? r.sc[0].s - (r.sc[1] ? r.sc[1].s : 0) : -1);
  let open = cands.slice();
  while (open.length) {
    open.forEach((r) => (r.sc = r.sc.filter((k) => !taken.has(k.c.en + "|" + k.c.page))));
    open.sort((p, q) => margin(q) - margin(p) || (q.sc[0] ? q.sc[0].s : 0) - (p.sc[0] ? p.sc[0].s : 0));
    const r = open.shift();
    const [p, q] = r.sc;
    if (p && p.o.hit >= 4 && (!q || p.s - q.s >= 1)) { taken.add(p.c.en + "|" + p.c.page); result.push({ x: r.x, c: p.c, o: p.o, par: r.par || p.c.page }); }
    else review.push({ x: r.x, why: `${r.par ? `unter ${r.par}: ` : ""}${why(r.sc)}` });
  }

  for (const { x, first } of twins) {
    const r = result.find((k) => k.x === first);
    if (r) result.push({ ...r, x, twin: true });
    else review.push({ x, why: `Doppel von „${first.full}“ (S. ${first.page}), der nicht zugeordnet ist` });
  }

  // Schlüssel wie in data/deities.js: „Arcane“, bei mehreren Oberdomänen „Demon (Chaos)“ / „Demon (Evil)“
  const out = {};
  const put = (key, x, parents) => {
    const prev = out[key];
    if (prev && prev.full !== x.full) review.push({ x, why: `Schlüssel ${key} schon belegt von „${prev.full}“` });
    if (prev) return;
    out[key] = {
      name: shortName(x.full), full: x.full, kind: x.kind, parents, source: x.source,
      intro: x.intro, powers: x.powers, spells: Object.fromEntries(Object.entries(x.spells).map(([lv, n]) => [lv, { name: n, id: [...deIds(n)][0] || null }])),
    };
  };
  // „[Böse]“-Fassungen und Doppel nach den regulären Einträgen
  const order = (r) => (/\[/.test(r.x.full) ? 1 : 0);
  for (const { x, c, par } of result.slice().sort((p, q) => order(p) - order(q))) {
    if (c.kind === "domain") { put(c.en, x, []); continue; }
    put(`${c.en} (${par})`, x, [par]);
    if (c.parents.length === 1) put(c.en, x, [par]);
  }
  // Unterdomänen mit mehreren Oberdomänen: ohne Klammer gilt die erste
  for (const { c } of result) if (c.kind === "subdomain" && !out[c.en]) { const k = Object.keys(out).find((k) => k.startsWith(c.en + " (")); if (k) out[c.en] = out[k]; }

  // Gegenprobe: eigene Kräfte (ohne die von der Oberdomäne geerbten) gegen die englischen Kräfte
  const deByFull = new Map(de.map((x) => [x.full, x]));
  const ownPowers = (x) => {
    const parent = deByFull.get(x.parent) || de.find((d) => d.kind === "domain" && domOf.get(d.full) === (result.find((r) => r.x === x) || {}).par);
    const inherited = new Set(parent && parent !== x ? parent.powers.map((p) => p.name) : []);
    return x.powers.filter((p) => !inherited.has(p.name));
  };
  const checkAll = result.map((r) => ({ ...r, ...compare(ownPowers(r.x).map((p) => p.text).join(" "), r.c.powers.map((p) => p.text).join(" "), 1.5) }));
  if (process.argv.includes("--check-debug")) for (const r of checkAll) console.log((r.score == null ? "  –  " : r.score.toFixed(2)), r.wDe, r.wEn, r.x.full, "→", r.c.en, "| eigene:", ownPowers(r.x).map((p) => p.name).join(", "), "| en:", r.c.powers.map((p) => p.name).join(", "));
  const check = checkAll.filter((r) => r.score != null);
  const suspect = check.filter((r) => r.score < 0.5).sort((a, b) => a.score - b.score);

  const wanted = new Set(DEITIES.flatMap((d) => [...(d.domains || []), ...(d.subdomains || [])]).filter((n) => n && n !== "N/A"));
  const missing = [...wanted].filter((n) => !out[n]).sort();
  const data = Object.fromEntries(Object.entries(out).sort());
  writeFileSync(join(ROOT, "data/domains.de.js"),
    "// Deutsche Domänen – Open Game Content (OGL 1.0a) nach dem Deutschen Pathfinder-Referenzdokument (prd.5footstep.de) und MyPFDB; deutsche Begriffe mit freundlicher Genehmigung von Ulisses Spiele. Dieses Produkt unterliegt keiner Abnahme oder Genehmigung durch Ulisses Spiele.\n" +
    `// Erzeugt von tools/import-domains-de.mjs am ${new Date().toISOString().slice(0, 10)}.\n` +
    `window.DOMAINS_DE = ${JSON.stringify(data)};\n`);
  mkdirSync(join(ROOT, "data/research"), { recursive: true });
  writeFileSync(join(ROOT, "data/research/domains-de-review.md"),
    `# Domänen: Prüfliste\n\nDeutsch gelesen: ${de.length} (${de.filter((d) => d.kind === "domain").length} Domänen), englisch: ${en.length}, zugeordnet: ${result.length}, Schlüssel: ${Object.keys(out).length}.\n\n` +
    `## Nicht zugeordnet (${review.length})\n\n${review.map((r) => `- ${r.x.full} (S. ${r.x.page}, ${r.x.source}): ${r.why}`).join("\n")}\n\n` +
    `## In data/deities.js ohne deutsche Fassung (${missing.length})\n\n${missing.join(", ")}\n\n` +
    `## Gegenprobe Kräftetexte (Zahlen, Würfel, Längen)\n\n${check.length} Zuordnungen bewertbar, ${suspect.length} unter 0,5.\n\n${suspect.map((r) => `- ${r.x.full} → ${r.c.en}: ${r.score.toFixed(2)} · nur deutsch ${r.onlyDe.slice(0, 6).join(" ")} · nur englisch ${r.onlyEn.slice(0, 6).join(" ")}`).join("\n")}\n\n` +
    `## Zuordnungen\n\n${result.map(({ x, c, o }) => `- ${x.full} → ${c.en}${c.kind === "subdomain" ? ` (${c.parents.join("/")})` : ""} · ${o.hit}/${o.known}`).join("\n")}\n`);
  console.log(`Gegenprobe Kräftetexte: ${check.length} bewertbar, ${suspect.length} unter 0,5`);
  console.log(`deutsch ${de.length}, englisch ${en.length}, zugeordnet ${result.length}, offen ${review.length}; Gottheiten-Namen ohne deutsche Fassung: ${missing.length}/${wanted.size}`);
}
main();

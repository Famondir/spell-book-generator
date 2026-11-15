// Zweisprachigkeit des Textbaukastens (localization, spell-texts):
//  1. Kreise in beiden Buchsprachen gleich: Titel (lateinisch), Fachformel, Formelzeilen, Schriftband und SVG des Kreises;
//     bei fremden Formelsprachen folgt nur die Umschrift der Buchsprache, der Kreis ohne Bandtext bleibt gleich
//  2. Texte je Sprache deterministisch (zweimal erzeugt = gleich)
//  3. englische Texte ohne deutsche Reste (Umlaute, deutsche Anführungszeichen, häufige deutsche Wörter)
//  4. keine unübersetzten Stellen (I18N.untranslated) im englischen Buch
// Aufruf: node tools/bilingual-check.mjs [--with-profile] [--verbose]
import { loadApp } from "./lib/load-app.mjs";

const withProfile = process.argv.includes("--with-profile");
const verbose = process.argv.includes("--verbose");
const ctx = loadApp({ withProfile, extra: ["app/js/glyphs.js", "app/js/circle.js"] });
const { SPELLS, analyze, generateTexts, I18N } = ctx;
const errors = [];
const fail = (msg) => errors.push(msg);

// Auswahl: jeder 5. Zauber der Liste und alle Alltagszauber (fest, damit neue Daten wenig verschieben)
const list = SPELLS.filter((s, i) => s.everyday || i % 5 === 0);
const gen = (lang, s) => {
  I18N.configure({ uiLang: lang, bookLang: lang, rulesLang: lang });
  const m = analyze(s);
  const t = generateTexts(m);
  // laufende Zähler in Ids (band1-0, band2-0 …) herausrechnen
  const svg = typeof ctx.renderCircle === "function" ? ctx.renderCircle(m, { text: t.formula.band }).replace(/(id="|href="#|url\(#)([a-zA-Z_-]+?)\d+/g, "$1$2") : "";
  return { m, t, svg };
};
const GERMAN = /[äöüßÄÖÜ„“‚‘]|\b(der|die|das|und|nicht|eine?|mit|wird|ist|auf|für|sich|dem|den|des)\b/;
const textsOf = (t) => {
  const out = [t.epithet, t.summary, t.learning, t.ink, t.counter.t, ...t.gestures, ...t.notes];
  for (const p of t.theory) out.push(p.h, p.t);
  for (const p of t.structure) out.push(p.k, p.t);
  for (const p of t.steps) out.push(p.h, ...p.items);
  for (const p of t.failure) out.push(p.k, p.t);
  for (const p of t.materials) out.push(p.k, p.t);
  for (const p of t.practice) out.push(p.date, p.place, p.result);
  out.push(t.formula.tone);
  return out.filter(Boolean).map(String);
};
let checked = 0;
for (const s of list) {
  const de = gen("de", s), en = gen("en", s), en2 = gen("en", s);
  checked++;
  const same = (k, a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) fail(`${s.name}: ${k} unterscheidet sich zwischen de und en`); };
  same("Titel", de.t.title, en.t.title);
  same("Fachformel", de.t.formula.tech, en.t.formula.tech);
  same("Formelsprache", de.t.formula.lang, en.t.formula.lang);
  same("Zahl der Formelzeilen", de.t.formula.lines.length, en.t.formula.lines.length);
  if (de.t.formula.lang === "latin") {
    same("Formelzeilen", de.t.formula.lines, en.t.formula.lines);
    same("Schriftband", de.t.formula.band, en.t.formula.band);
    same("Kreis (SVG)", de.svg, en.svg);
  } else {
    // fremde Formelsprachen: die Umschrift folgt der Buchsprache (add-formula-languages), der Kreis sonst nicht
    const noBand = (x) => x.replace(/(<textPath[^>]*>)[^<]*(<\/textPath>)/g, "$1$2").replace(/textLength="[^"]*"/g, "");
    same("Kreis ohne Bandtext (SVG)", noBand(de.svg), noBand(en.svg));
  }
  if (JSON.stringify(en.t) !== JSON.stringify(en2.t)) fail(`${s.name}: englische Texte nicht deterministisch`);
  // eigene Texte (custom_texts, Alltagszauber aus dem Profil) sind einsprachig erlaubt
  if (!en.t.custom && !s.fromProfile) for (const x of textsOf(en.t)) {
    // Eigennamen aus Regeldaten (Zaubernamen) und lateinische Fachwörter dürfen stehen
    const y = x.replace(/“[^”]*”/g, "").replace(new RegExp(s.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "");
    if (GERMAN.test(y)) { fail(`${s.name}: deutscher Rest im englischen Text: ${x.slice(0, 120)}`); break; }
  }
}
const un = [...I18N.untranslated];
if (un.length) fail(`unübersetzte Stellen: ${un.length} (${un.slice(0, 5).join(", ")})`);
if (verbose || errors.length) for (const e of errors.slice(0, 30)) console.log(e);
if (errors.length) {
  console.log(`${errors.length} Fehler bei ${checked} Zaubern`);
  process.exit(1);
}
console.log(`ok: ${checked} Zauber, Kreise gleich, Texte deterministisch, englisch ohne deutsche Reste`);

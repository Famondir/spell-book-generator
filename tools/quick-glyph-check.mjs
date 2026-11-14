#!/usr/bin/env node
// Schnellglyphen-Prüfung: (1) eindeutige Anfangsbuchstaben in jeder lateinischen Verb- und Essenzliste,
// (2) auf der Liste jeder Klasse (mit Alltagszaubern) hat kein Zauber eine gleich aussehende Schnellglyphe wie ein anderer,
//     in Originalschrift wie in Lateinschrift,
// (3) ebenso keine zwei Zauber dieselbe Kurz- oder Langformel (Kernzeilen allein dürfen sich wiederholen).
// Gesten und Komponenten dürfen sich wiederholen; ihre Kennzahlen werden nur ausgegeben.
// Aufruf: node tools/quick-glyph-check.mjs [--with-profile]   Rückgabecode 1 bei Fehlern
import { readdirSync } from "node:fs";
import { loadApp } from "./lib/load-app.mjs";

const withProfile = process.argv.includes("--with-profile");
const ctx = loadApp({ withProfile, extra: ["app/js/glyphs.js", "app/js/circle.js"] });
const errors = [];

// 1. Anfangsbuchstaben: Latein immer; andere Sprachen, wenn sie ausgerichtet sind (Länge wie Latein, Anlaut in der Originalschrift)
// Mitgelieferte Sprachen müssen ausgerichtet sein (REQUIRE_ALIGNED); lokale Lexika ohne Ausrichtung nur als Hinweis
const REQUIRE_ALIGNED = true;
const F = ctx.FORMULA, LAT = F.get("latin").lex;
const hints = [];
// mitgeliefert = eingecheckte Datei data/formula-lang/<id>.js, lokal = *.local.js
const shipped = new Set(readdirSync(new URL("../data/formula-lang/", import.meta.url)).filter((f) => f.endsWith(".js") && !f.endsWith(".local.js")).map((f) => f.replace(/\.js$/, "")));
for (const [id, lang] of Object.entries(F.LANGS)) {
  const X = lang.lex;
  if (id !== "latin" && !lang.aligned) {
    (REQUIRE_ALIGNED && shipped.has(id) ? errors : hints).push(`${id}: Wortlisten nicht ausgerichtet, Kernzeile wird frei gezogen`);
    continue;
  }
  for (const k of ["imp", "ess"]) for (const [key, words] of Object.entries(X[k])) {
    const name = `${id} ${k === "imp" ? "Verben" : "Essenz"} ${key}`;
    if (LAT[k][key] && words.length !== LAT[k][key].length) errors.push(`${name}: ${words.length} Wörter, Latein hat ${LAT[k][key].length}`);
    const seen = new Map();
    for (const w of words) {
      const c = F.onset(lang, w);
      if (seen.has(c)) errors.push(`${name}: ${seen.get(c)} und ${w} beginnen mit ${c}`);
      else seen.set(c, w);
    }
  }
}
for (const h of hints) console.log("· " + h);

// 2. Eindeutigkeit je Klassenliste
const classOf = ctx.CLASS;
for (const [id, cls] of Object.entries(ctx.CLASSES)) {
  ctx.CLASS = { id, ...cls };
  const seen = new Map();
  const forms = { Kurzformel: new Map(), Langformel: new Map() };
  const info = { Kernzeile: new Set(), "Kernzeile + Komponenten": new Set(), Gesten: new Set(), "Kernzeile + Gesten": new Set() };
  let n = 0;
  for (const s of ctx.SPELLS) {
    if (!(s.everyday || s.levels[cls.list] != null)) continue;
    const m = ctx.analyze(s);
    // nach Aussehen: Absichtszeichen durch ihre Vergleichsschlüssel ersetzen (verwechselbare Zeichen gelten als gleich)
    // in beiden Darstellungen (Originalschrift, Lateinschrift) eindeutig
    const bare = ctx.quickGlyph(m).replace(/aria-label="[^"]*"/, "").replace(/<text[^>]*class="ql[^"]*"[^>]*>[^<]*<\/text>|<path class="ql-proto"[^>]*\/>/g, "");
    n++;
    for (const mode of ["original", "latin"]) {
      ctx.SCRIPTS.setMode(mode);
      const svg = mode + "#" + bare + ctx.TEXTGEN.coreChoice(m).keys.join("|");
      if (seen.has(svg)) errors.push(`${cls.list}: ${seen.get(svg)} und ${s.name} haben dieselbe Schnellglyphe (${mode === "latin" ? "Lateinschrift" : "Originalschrift"})`);
      else seen.set(svg, s.name);
    }
    ctx.SCRIPTS.setMode("original");

    // 3. Formeln (Kurz = Kernzeile plus gezogene Zeilen, Lang = Wechselrede)
    const t = ctx.generateTexts(m);
    const mine = { Kurzformel: t.formula.lines.join("|"), Langformel: t.longFormula.map((x) => x.t).join("|") };
    for (const [kind, text] of Object.entries(mine)) {
      const prev = forms[kind].get(text);
      if (prev) errors.push(`${cls.list}: ${prev} und ${s.name} haben dieselbe ${kind}`);
      else forms[kind].set(text, s.name);
    }
    const core = t.formula.lines[0], gest = t.gestures.join("|");
    const c = m.components, comp = ["V", "S", "M", "F", "DF"].filter((k) => c[k]).join("") + (c.costly ? "$" + c.costly : "");
    info.Kernzeile.add(core);
    info["Kernzeile + Komponenten"].add(core + "#" + comp);
    info.Gesten.add(gest);
    info["Kernzeile + Gesten"].add(core + "#" + gest);
  }
  console.log(`${cls.list}: ${n} Zauber, ${seen.size / 2} verschiedene Schnellglyphen, ${forms.Kurzformel.size} Kurz-, ${forms.Langformel.size} Langformeln`);
  console.log("  zur Kenntnis, verschieden: " + Object.entries(info).map(([k, v]) => `${k} ${v.size}`).join(", "));
}
ctx.CLASS = classOf;

for (const e of errors.slice(0, 20)) console.log("✗ " + e);
console.log(errors.length ? `${errors.length} Fehler` : "Schnellglyphen und Formeln eindeutig");
process.exit(errors.length ? 1 : 0);

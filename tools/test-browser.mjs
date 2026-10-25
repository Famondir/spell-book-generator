#!/usr/bin/env node
// Browser-Tests: Satz (Seitenzahlen, Umbrüche, feste Regeln, Zeit) und Bedienung (Klicks, Tasten, sichtbarer Zustand).
// Steuert ein headless Chrome über das DevTools-Protokoll; braucht nur Node ≥ 22 und Chrome/Chromium.
//
//   node tools/test-browser.mjs                 alle Fälle
//   node tools/test-browser.mjs --only lehrheft nur Fälle, deren Name „lehrheft“ enthält (auch: satz, ui)
//   node tools/test-browser.mjs --update        Sollwerte der gelaufenen Satz-Fälle übernehmen
//   --with-profile   data/profile.local.js laden (eigene Sollwerte in test-baseline.local.json)
//   --json           Ergebnis maschinenlesbar     --pdf <ordner>   je Satz-Fall ein PDF ablegen
//   --verbose        Konsolenausgaben der App zeigen
import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { BOOKS, CASES, UI } from "./test-cases.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (k) => args.includes(k);
const val = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : null);
const ONLY = val("--only");
const UPDATE = opt("--update");
const WITH_PROFILE = opt("--with-profile");
const JSON_OUT = opt("--json");
const PDF_DIR = val("--pdf");
const VERBOSE = opt("--verbose");
const BASELINE = join(ROOT, "tools", WITH_PROFILE ? "test-baseline.local.json" : "test-baseline.json");
const DEFAULT_LIMIT = 10000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => !JSON_OUT && console.log(...a);

// --- Chrome finden und starten ---------------------------------------------------------
function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  for (const c of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "chrome"]) {
    try {
      const p = execFileSync(process.platform === "win32" ? "where" : "which", [c], { stdio: ["ignore", "pipe", "ignore"] }).toString().split(/\r?\n/)[0].trim();
      if (p) return p;
    } catch {}
  }
  const fixed = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ];
  return fixed.find((p) => existsSync(p)) || null;
}

async function launch() {
  const bin = findChrome();
  if (!bin) {
    console.error("Kein Chrome/Chromium gefunden. Pfad über die Umgebungsvariable CHROME angeben, z. B. CHROME=/usr/bin/chromium node tools/test-browser.mjs");
    process.exit(2);
  }
  const dir = mkdtempSync(join(tmpdir(), "spellbook-test-"));
  const proc = spawn(bin, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--allow-file-access-from-files", "--remote-debugging-port=0", `--user-data-dir=${dir}`, "--window-size=1600,1100", "--lang=de-DE", "about:blank"], { stdio: "ignore" });
  const portFile = join(dir, "DevToolsActivePort");
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await sleep(100);
  if (!existsSync(portFile)) throw new Error("Chrome hat keinen DevTools-Port geöffnet");
  const port = readFileSync(portFile, "utf8").split("\n")[0].trim();
  const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page");
  const close = () => {
    try { proc.kill(); } catch {}
    try { rmSync(dir, { recursive: true, force: true }); } catch {}
  };
  return { ws: page.webSocketDebuggerUrl, chrome: (version.Browser.match(/\/(\d+)/) || [])[1] || "?", close };
}

// --- DevTools-Client ----------------------------------------------------------------------
async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((r, j) => ((ws.onopen = r), (ws.onerror = j)));
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) {
      const { res, rej } = pending.get(d.id);
      pending.delete(d.id);
      d.error ? rej(new Error(d.error.message)) : res(d.result);
    } else if (d.method) listeners.forEach((f) => f(d));
  };
  const send = (method, params = {}) => new Promise((res, rej) => { pending.set(++id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
  // Ausdruck in der Seite auswerten; Ausnahmen werden zu Fehlern in Node
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
    return r.result.value;
  };
  return { send, evaluate, on: (f) => listeners.push(f), close: () => ws.close() };
}

// --- Seite laden ------------------------------------------------------------------------
const PAGE_URL = pathToFileURL(join(ROOT, "index.html")).href;
let initScript = null;
// Vor jedem Laden: lokales Profil ausblenden, Charakter-Slot mit der Klasse des Falls anlegen
function initSource(cls) {
  return `(() => {
    // Browsersprache: Deutsch, damit die Sollwerte nicht vom Rechner abhängen
    Object.defineProperty(Navigator.prototype, "language", { get: () => "de-DE", configurable: true });
    ${WITH_PROFILE ? "" : `for (const k of ["PROFILE_LOCAL", "PROFILES_LOCAL"]) Object.defineProperty(window, k, { get: () => undefined, set: () => {}, configurable: false });
    // lokale Regeldaten: gesperrt, ein Testfall darf eigene setzen (Object.defineProperty)
    Object.defineProperty(window, "RULES_DE", { get: () => undefined, set: () => {}, configurable: true });`}
    try {
      if (!sessionStorage.getItem("test.seeded")) {
        localStorage.clear();
        localStorage.setItem("spellbook.chars", JSON.stringify([{ id: "c1", name: "Test", profile: ${WITH_PROFILE ? '"local"' : "null"}, cls: ${JSON.stringify(cls)}, deity: "iomedae" }]));
        localStorage.setItem("spellbook.activeChar", "c1");
        sessionStorage.setItem("test.seeded", "1");
      }
    } catch (e) {}
  })();`;
}
async function loadApp(c, cls, fresh = true) {
  if (initScript) await c.send("Page.removeScriptToEvaluateOnNewDocument", { identifier: initScript });
  initScript = (await c.send("Page.addScriptToEvaluateOnNewDocument", { source: initSource(cls) })).identifier;
  // frischer Speicher je Laden: sessionStorage-Marke löschen, dann neu laden
  if (fresh) await c.evaluate(`try { sessionStorage.removeItem("test.seeded"); } catch (e) {}`).catch(() => {});
  await c.send("Page.navigate", { url: PAGE_URL });
  for (let i = 0; i < 200; i++) {
    await sleep(100);
    const ok = await c.evaluate(`!!(window.APP_TEST && document.readyState === "complete")`).catch(() => false);
    if (ok) break;
    if (i === 199) throw new Error("App nicht geladen (APP_TEST fehlt)");
  }
  await c.evaluate(`document.fonts ? document.fonts.ready.then(() => true) : true`);
}
async function viewport(c, w = 1600, h = 1100) {
  await c.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false });
}

// --- Prüfungen im Browser (läuft in der Seite) -------------------------------------------
function inspectInPage(info) {
  const root = document.getElementById("print-root");
  const pages = [...root.querySelectorAll(".page")];
  const errs = [];
  const no = (p) => (p.querySelector(".page-foot span:last-child") || {}).textContent?.trim() || "";
  const label = (p, i) => no(p) || "#" + (i + 1);
  const seenSpell = new Map();
  const prints = [];
  let prevNo = null;
  pages.forEach((p, i) => {
    const inner = p.querySelector(".page-inner");
    // Überlauf
    for (const el of p.querySelectorAll(".page-inner, .half")) if (el.scrollHeight > el.clientHeight + 1) errs.push({ rule: "überlauf", page: label(p, i) });
    // leere Folgeseite
    if (p.classList.contains("flow-cont") && inner && !inner.textContent.trim() && !inner.querySelector("svg,img")) errs.push({ rule: "leere folgeseite", page: label(p, i) });
    // Überschrift allein am Seitenende
    if (inner && (p.classList.contains("flow") || p.classList.contains("flow-cont")) && i < pages.length - 1) {
      let last = inner.lastElementChild;
      while (last && last.classList.contains("splittable") && last.lastElementChild) last = last.lastElementChild;
      if (last && last.classList.contains("keep-next")) errs.push({ rule: "keep-next", page: label(p, i), detail: last.textContent.trim().slice(0, 40) });
    }
    // fortlaufende Nummern (nur Seiten mit Zahl)
    const n = /^\d+$/.test(no(p)) ? +no(p) : null;
    if (n != null) {
      if (prevNo != null && n !== prevNo + 1) errs.push({ rule: "nummerierung", page: label(p, i), detail: `nach ${prevNo}` });
      prevNo = n;
    }
    // Lochrand
    if (p.classList.contains("bind") && n != null && p.classList.contains("verso") !== (n % 2 === 0)) errs.push({ rule: "lochrand", page: label(p, i) });
    if (p.classList.contains("recto-start") && n != null && n % 2 === 0) errs.push({ rule: "rechte seite", page: label(p, i) });
    // kleine Formel: genau eine Seite
    if (p.classList.contains("formula-page")) {
      const id = p.dataset.spell;
      if (seenSpell.has("f" + id)) errs.push({ rule: "formel eine seite", page: label(p, i), detail: id });
      seenSpell.set("f" + id, 1);
    }
    // Fingerabdruck: womit die Seite beginnt
    let fp;
    if (p.classList.contains("blank")) fp = "B";
    else if (p.dataset.spell) {
      const k = (seenSpell.get(p.dataset.spell) || 0) + 1;
      seenSpell.set(p.dataset.spell, k);
      fp = "S:" + p.dataset.spell + (k > 1 ? "#" + k : "");
    } else {
      const first = inner && inner.firstElementChild;
      const les = first && (first.matches(".lesson[data-lesson]") ? first : null);
      fp = les ? "L:" + les.dataset.lesson + (les.dataset.splitOf ? "+" : "") : "T:" + ((inner && inner.textContent) || "").replace(/\s+/g, " ").trim().slice(0, 24);
    }
    prints.push(fp);
  });
  // Bandgrenze
  if (info && info.maxPages && pages.length > info.maxPages && !(info.warnings || []).length) errs.push({ rule: "bandgrenze", page: String(pages.length), detail: `> ${info.maxPages}` });
  return { pages: pages.length, prints, errs };
}

// --- Satz-Fall ------------------------------------------------------------------------------
async function runSatz(c, cs, base) {
  const book = typeof cs.book === "string" ? BOOKS[cs.book] : cs.book;
  const loaded = await c.evaluate(`APP_TEST.load(${JSON.stringify({ book, settings: cs.settings || {} })})`);
  const errs = [];
  if (loaded.missing.length) errs.push({ rule: "testbuch", detail: "unbekannt: " + loaded.missing.join(", ") });
  const info = await c.evaluate(`APP_TEST.print(${JSON.stringify(cs.job)}, ${JSON.stringify(cs.opts || {})})`);
  if (!info) return { errs: [{ rule: "auftrag", detail: "keine Seiten" }], pages: 0, ms: 0 };
  const r = await c.evaluate(`(${inspectInPage.toString()})(${JSON.stringify(info)})`);
  errs.push(...r.errs);
  const limit = cs.limit || DEFAULT_LIMIT;
  if (info.ms > limit) errs.push({ rule: "zeit", detail: `zu langsam: ${(info.ms / 1000).toFixed(1)} s (Grenze ${limit / 1000} s)` });
  if (PDF_DIR) {
    mkdirSync(PDF_DIR, { recursive: true });
    const pdf = await c.send("Page.printToPDF", { preferCSSPageSize: true, printBackground: true });
    writeFileSync(join(PDF_DIR, cs.name + ".pdf"), Buffer.from(pdf.data, "base64"));
  }
  await c.evaluate(`APP_TEST.done()`);
  // Vergleich mit Sollwerten
  let note = "";
  const want = base.cases[cs.name];
  if (!want) note = "neu, kein Sollwert";
  else {
    if (want.pages !== r.pages) errs.push({ rule: "sollwert", detail: `Seitenzahl: Soll ${want.pages}, Ist ${r.pages}` });
    const k = want.prints.findIndex((x, i) => x !== r.prints[i]);
    const at = k >= 0 ? k : want.prints.length < r.prints.length ? want.prints.length : -1;
    if (at >= 0) errs.push({ rule: "sollwert", page: "#" + (at + 1), detail: `Umbruch: Soll ${want.prints[at] ?? "(keine Seite)"}, Ist ${r.prints[at] ?? "(keine Seite)"}` });
  }
  return { errs, pages: r.pages, prints: r.prints, ms: info.ms, note };
}

// --- Bedienungs-Fall -----------------------------------------------------------------------
const KEYS = { ArrowRight: 39, ArrowLeft: 37, Enter: 13, PageDown: 34, PageUp: 33, Escape: 27 };
function helpers(c, errs) {
  const t = {
    ui: UI,
    eval: (js) => c.evaluate(js),
    sleep,
    click: async (sel) => {
      await c.evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) throw new Error("nicht gefunden: " + ${JSON.stringify(sel)}); el.click(); })()`);
      await sleep(60);
    },
    key: async (key) => {
      for (const type of ["keyDown", "keyUp"]) await c.send("Input.dispatchKeyEvent", { type, key, code: key, windowsVirtualKeyCode: KEYS[key] || 0 });
      await sleep(60);
    },
    type: async (sel, text) => {
      await c.evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) throw new Error("nicht gefunden: " + ${JSON.stringify(sel)}); el.focus(); el.value = ${JSON.stringify(String(text))}; el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); el.blur(); })()`);
      await sleep(60);
    },
    resize: async (w, h = 1100) => {
      await viewport(c, w, h);
      await c.evaluate(`window.dispatchEvent(new Event("resize"))`);
      await sleep(150);
    },
    until: async (js, ms = 15000) => {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) {
        if (await c.evaluate(js).catch(() => false)) return true;
        await sleep(100);
      }
      throw new Error("Zeitüberschreitung beim Warten auf: " + js);
    },
    // gesetzt und kein Fortschritt mehr sichtbar
    settled: () => t.until(`!document.querySelector(".view.active .fitting") && document.getElementById("progress").hidden && !/gesetzt …/.test(document.querySelector(".view.active")?.textContent || "")`),
    expect: async (step, js, want) => {
      const got = await c.evaluate(js).catch((e) => "Fehler: " + e.message);
      const ok = typeof want === "function" ? want(got) : want instanceof RegExp ? want.test(String(got)) : JSON.stringify(got) === JSON.stringify(want);
      if (!ok) errs.push({ rule: "erwartung", detail: `${step}: Soll ${want instanceof RegExp ? want : typeof want === "function" ? "(Bedingung)" : JSON.stringify(want)}, Ist ${JSON.stringify(got)}` });
      return got;
    },
  };
  return t;
}
async function runUI(c, cs) {
  const errs = [];
  await viewport(c, cs.width || 1600, cs.height || 1100);
  await loadApp(c, cs.cls || "wizard");
  const book = typeof cs.book === "string" ? BOOKS[cs.book] : cs.book || [];
  const loaded = await c.evaluate(`APP_TEST.load(${JSON.stringify({ book, settings: cs.settings || {} })})`);
  if (loaded.missing.length) errs.push({ rule: "testbuch", detail: "unbekannt: " + loaded.missing.join(", ") });
  const t = helpers(c, errs);
  const t0 = Date.now();
  try {
    await cs.run(t);
  } catch (e) {
    errs.push({ rule: "ablauf", detail: e.message });
  }
  return { errs, ms: Date.now() - t0 };
}

// --- Ablauf -------------------------------------------------------------------------------
const matches = (cs) => !ONLY || cs.name.includes(ONLY) || (ONLY === "satz" && cs.job) || (ONLY === "ui" && cs.run);
const cases = CASES.filter(matches);
if (!cases.length) {
  console.error("Keine Fälle für --only " + ONLY);
  process.exit(2);
}
const base = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : { chrome: null, cases: {} };
const br = await launch();
let c;
const results = [];
try {
  c = await connect(br.ws);
  await c.send("Runtime.enable");
  await c.send("Page.enable");
  c.on((d) => {
    if (d.method === "Runtime.exceptionThrown") results.lastPageError = d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text;
    if (VERBOSE && d.method === "Runtime.consoleAPICalled") console.log("   [app]", d.params.args.map((a) => a.value).join(" "));
  });
  if (base.chrome && base.chrome !== br.chrome && !UPDATE) log(`Hinweis: Sollwerte mit Chrome ${base.chrome}, jetzt Chrome ${br.chrome} – kleine Abweichungen im Umbruch sind möglich.`);
  // Satz-Fälle nach Klasse gruppiert (eine geladene Seite je Klasse), danach Bedienungsfälle
  const satz = cases.filter((x) => x.job).sort((a, b) => (a.cls || "wizard").localeCompare(b.cls || "wizard"));
  let loadedCls = null;
  await viewport(c);
  for (const cs of satz) {
    if (loadedCls !== (cs.cls || "wizard")) await loadApp(c, (loadedCls = cs.cls || "wizard"));
    results.lastPageError = null;
    let r;
    try {
      r = await runSatz(c, cs, base);
    } catch (e) {
      r = { errs: [{ rule: "ablauf", detail: e.message }], pages: 0, ms: 0 };
      await c.evaluate(`APP_TEST.done()`).catch(() => {});
    }
    if (results.lastPageError) r.errs.push({ rule: "js-fehler", detail: results.lastPageError.split("\n")[0] });
    results.push({ name: cs.name, kind: "satz", ...r });
    report(results[results.length - 1]);
  }
  for (const cs of cases.filter((x) => x.run)) {
    results.lastPageError = null;
    const r = await runUI(c, cs);
    if (results.lastPageError) r.errs.push({ rule: "js-fehler", detail: results.lastPageError.split("\n")[0] });
    results.push({ name: cs.name, kind: "ui", ...r });
    report(results[results.length - 1]);
  }
} finally {
  c?.close();
  br.close();
}

function report(r) {
  const head = r.errs.length ? "FEHLER" : "ok    ";
  const pages = r.kind === "satz" ? `${String(r.pages).padStart(4)} S.` : "   ui  ";
  log(`${head} ${r.name.padEnd(34)} ${pages} ${(r.ms / 1000).toFixed(1).padStart(5)} s${r.note ? "  (" + r.note + ")" : ""}`);
  const shown = r.errs.slice(0, 8);
  for (const e of shown) log(`         ${e.rule}${e.page ? ": Seite " + e.page : ""}${e.detail ? " – " + e.detail : ""}`);
  if (r.errs.length > shown.length) log(`         … und ${r.errs.length - shown.length} weitere`);
}

// Sollwerte übernehmen (nur gelaufene Satz-Fälle, nur mit --update)
if (UPDATE) {
  for (const r of results.filter((x) => x.kind === "satz" && x.prints)) base.cases[r.name] = { pages: r.pages, prints: r.prints };
  base.chrome = br.chrome;
  writeFileSync(BASELINE, JSON.stringify(base, null, 1) + "\n");
  log(`Sollwerte übernommen: ${results.filter((x) => x.kind === "satz").length} Fälle → ${BASELINE.replace(ROOT + "/", "")}`);
}
// mit --update zählen Sollwert-Abweichungen nicht als Fehler
const failed = results.filter((r) => r.errs.some((e) => !(UPDATE && e.rule === "sollwert")));
if (JSON_OUT) console.log(JSON.stringify({ chrome: br.chrome, results: results.map(({ prints, ...r }) => r) }, null, 1));
else log(`\n${results.length} Fälle, ${results.length - failed.length} bestanden, ${failed.length} fehlgeschlagen`);
process.exit(failed.length ? 1 : 0);

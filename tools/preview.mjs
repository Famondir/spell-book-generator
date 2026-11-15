#!/usr/bin/env node
// Vorschau-PDF: ausgewählte Seiten aus Zauberbuch, Lehrheft und Vademecum, je Sprache ein PDF (mit Deckblatt).
// Setzt die Seiten genau wie die Druckknöpfe der App (headless Chrome, frisches Browserprofil; der eigene
// localStorage bleibt unberührt) und behält nur die gewählten. Zum Zusammenfügen wird pdfunite (poppler) genutzt,
// sonst bleiben die Teile als einzelne PDFs liegen.
//
//   node tools/preview.mjs --spec tools/preview.example.json --list     Seiten je Auftrag auflisten (zum Auswählen)
//   node tools/preview.mjs --spec meine-vorschau.json --out vorschau/  PDFs (und mit --png Seitenbilder) erzeugen
//
// Spec (JSON):
//   book: Datei mit Zaubernamen (eine Zeile je Name) oder Liste; extra: weitere Namen (Alltagszauber mit deutschem Namen)
//   char: { cls, deity, profile }  profile: "local" (PROFILE_LOCAL) oder Schlüssel aus PROFILES_LOCAL, null = neutral
//   settings: Einstellungen für alle Sprachen; langs: ["de", "en"] (setzt uiLang, bookLang, rulesLang)
//   cover: { de: { title, lines: [...] }, en: … }  Deckblatt je Sprache (optional)
//   shots: [{ name, hash, width, height, click: [Selektor, …], close }]  Bildschirmfotos der App (<name>-<lang>.png)
//   parts: [{ job: "book" | "primer" | "vademecum" | …, opts, langs, pick: [Auswahl, …] }]
//   Auswahl: "title" (erste Seite), "spell:<id>" (alle Seiten des Zaubers), "lesson:<id>" (Seiten, auf denen die
//   Lektion steht), "text:<Teilstring>" (Seiten mit diesem Text), "#<n>" (n-te Seite); Zusatz "+k": k Folgeseiten
import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const val = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : null);
const SPEC_FILE = val("--spec");
const OUT = resolve(val("--out") || "preview");
const LIST = args.includes("--list");
const PNG = args.includes("--png");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
if (!SPEC_FILE) {
  console.error("Aufruf: node tools/preview.mjs --spec <datei.json> [--list] [--out <ordner>] [--png]");
  process.exit(2);
}
const SPEC = JSON.parse(readFileSync(SPEC_FILE, "utf8"));
const rel = (p) => resolve(dirname(resolve(SPEC_FILE)), p);
const BOOK = [
  ...(Array.isArray(SPEC.book) ? SPEC.book : SPEC.book ? readFileSync(rel(SPEC.book), "utf8").split(/\r?\n/).map((x) => x.trim()).filter(Boolean) : []),
  ...(SPEC.extra || []),
];

// --- Chrome --------------------------------------------------------------------------------
function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  for (const c of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "chrome"]) {
    try {
      const p = execFileSync(process.platform === "win32" ? "where" : "which", [c], { stdio: ["ignore", "pipe", "ignore"] }).toString().split(/\r?\n/)[0].trim();
      if (p) return p;
    } catch {}
  }
  return ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find((p) => existsSync(p)) || null;
}
async function launch() {
  const bin = findChrome();
  if (!bin) throw new Error("Kein Chrome/Chromium gefunden (Pfad über CHROME=…)");
  const dir = mkdtempSync(join(tmpdir(), "spellbook-preview-"));
  const proc = spawn(bin, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--allow-file-access-from-files", "--remote-debugging-port=0", `--user-data-dir=${dir}`, "--window-size=1600,1100", "about:blank"], { stdio: "ignore" });
  const portFile = join(dir, "DevToolsActivePort");
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await sleep(100);
  const port = readFileSync(portFile, "utf8").split("\n")[0].trim();
  const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => ((ws.onopen = r), (ws.onerror = j)));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) {
      const { res, rej } = pending.get(d.id);
      pending.delete(d.id);
      d.error ? rej(new Error(d.error.message)) : res(d.result);
    }
  };
  const send = (method, params = {}) => new Promise((res, rej) => { pending.set(++id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
    return r.result.value;
  };
  const close = () => {
    try { ws.close(); } catch {}
    try { proc.kill(); } catch {}
    try { rmSync(dir, { recursive: true, force: true }); } catch {}
  };
  await send("Runtime.enable");
  await send("Page.enable"); // sonst laufen Skripte für neue Dokumente (Charakter-Slot, Profil ausblenden) nicht
  return { send, evaluate, close };
}

// --- App laden ----------------------------------------------------------------------------
const char = { cls: "wizard", deity: "", profile: null, ...(SPEC.char || {}) };
async function loadApp(c, lang) {
  await c.send("Page.addScriptToEvaluateOnNewDocument", {
    // ohne Profil: lokale Profile und lokale Vademecum-Texte ausblenden (sonst nimmt die App das erste lokale Profil)
    source: `${char.profile ? "" : `for (const k of ["PROFILE_LOCAL", "PROFILES_LOCAL"]) Object.defineProperty(window, k, { get: () => undefined, set: () => {}, configurable: false });
      let vm; Object.defineProperty(window, "VADEMECUM", { get: () => vm, set: (v) => { vm = v; Object.defineProperty(v, "local", { value: Object.freeze({}), writable: false, configurable: true }); }, configurable: true });`}
    try { if (!sessionStorage.getItem("preview.seeded")) {
      localStorage.clear();
      localStorage.setItem("spellbook.chars", ${JSON.stringify(JSON.stringify([{ id: "c1", name: "Preview", profile: char.profile, cls: char.cls, deity: char.deity }]))});
      localStorage.setItem("spellbook.activeChar", "c1");
      sessionStorage.setItem("preview.seeded", "1");
    } } catch (e) {}`,
  });
  await c.send("Page.navigate", { url: pathToFileURL(join(ROOT, "index.html")).href + "?lang=" + lang });
  for (let i = 0; i < 300; i++) {
    await sleep(100);
    if (await c.evaluate(`!!(window.APP_TEST && document.readyState === "complete")`).catch(() => false)) break;
    if (i === 299) throw new Error("App nicht geladen");
  }
  await c.evaluate(`document.fonts ? document.fonts.ready.then(() => true) : true`);
  const settings = { ...(SPEC.settings || {}), uiLang: lang, bookLang: lang, rulesLang: lang };
  const r = await c.evaluate(`APP_TEST.load(${JSON.stringify({ book: BOOK, settings })})`);
  if (r.missing.length) console.warn(`  nicht im Katalog (${r.missing.length}): ${r.missing.slice(0, 8).join(", ")}${r.missing.length > 8 ? " …" : ""}`);
  return r;
}

// Fingerabdruck je Seite (läuft in der Seite)
function pagesInPage() {
  return [...document.querySelectorAll("#print-root .page")].map((p, i) => {
    const inner = p.querySelector(".page-inner") || p;
    return {
      i,
      no: (p.querySelector(".page-foot span:last-child") || {}).textContent?.trim() || "",
      // halbe Seiten (Zaubertricks, Alltagszauber): zwei Zauber je Seite
      spell: [p.dataset.spell, ...[...p.querySelectorAll(".half[data-spell]")].map((h) => h.dataset.spell)].filter(Boolean).join(" "),
      lessons: [...inner.querySelectorAll(".lesson[data-lesson]")].map((x) => x.dataset.lesson),
      text: inner.textContent.replace(/\s+/g, " ").trim().slice(0, 400),
    };
  });
}
function choose(pages, picks) {
  const keep = new Set();
  for (const raw of picks) {
    const [, sel, plus] = String(raw).match(/^(.*?)(?:\+(\d+))?$/);
    const hit = sel === "title" ? [0]
      : sel.startsWith("#") ? [+sel.slice(1) - 1]
      : sel.startsWith("spell:") ? pages.filter((p) => p.spell.split(" ").includes(sel.slice(6))).map((p) => p.i)
      : sel.startsWith("lesson:") ? pages.filter((p) => p.lessons.includes(sel.slice(7))).map((p) => p.i)
      : sel.startsWith("text:") ? pages.filter((p) => p.text.includes(sel.slice(5))).map((p) => p.i).slice(0, 1)
      : [];
    if (!hit.length) console.warn(`  Auswahl ohne Treffer: ${raw}`);
    for (const i of hit) for (let k = 0; k <= (+plus || 0); k++) if (pages[i + k]) keep.add(i + k);
  }
  return [...keep].sort((a, b) => a - b);
}

// Deckblatt als eigene A5-Seite
function coverHTML(cv) {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const fonts = pathToFileURL(join(ROOT, "app", "fonts")).href;
  return `<!doctype html><meta charset="utf-8"><style>
    @font-face { font-family: Cinzel; src: url(${fonts}/cinzel.woff2); } @font-face { font-family: Fell; src: url(${fonts}/imfell.woff2); }
    @page { size: 148mm 210mm; margin: 0 } html, body { margin: 0 } body { width: 148mm; height: 210mm; box-sizing: border-box; padding: 22mm 18mm;
    background: #f4ecd8; color: #2a2118; font: 10.5pt/1.45 Fell, Georgia, serif; display: flex; flex-direction: column }
    h1 { font: 600 20pt/1.2 Cinzel, serif; margin: 0 0 4mm; text-align: center } .sub { text-align: center; font-style: italic; margin-bottom: 10mm }
    p { margin: 0 0 3mm } .foot { margin-top: auto; font-size: 7.5pt; line-height: 1.35; color: #5a4c3a }</style>
    <h1>${esc(cv.title || "")}</h1><div class="sub">${esc(cv.subtitle || "")}</div>${(cv.lines || []).map((l) => `<p>${esc(l)}</p>`).join("")}
    <div class="foot">${(cv.foot || []).map((l) => `<p>${esc(l)}</p>`).join("")}</div>`;
}

const pdf = async (c) => Buffer.from((await c.send("Page.printToPDF", { preferCSSPageSize: true, printBackground: true })).data, "base64");

async function main() {
  const c = await launch();
  const t0 = Date.now();
  try {
    if (!LIST) mkdirSync(OUT, { recursive: true });
    for (const lang of SPEC.langs || ["de", "en"]) {
      console.log(`[${lang}]`);
      const files = [];
      const cv = (SPEC.cover || {})[lang];
      if (cv && !LIST) {
        const f = join(OUT, `.cover-${lang}.html`);
        writeFileSync(f, coverHTML(cv));
        await c.send("Page.navigate", { url: pathToFileURL(f).href });
        await sleep(400);
        await c.evaluate(`document.fonts ? document.fonts.ready.then(() => true) : true`);
        const out = join(OUT, `.0-cover-${lang}.pdf`);
        writeFileSync(out, await pdf(c));
        files.push(out);
        rmSync(f);
      }
      await loadApp(c, lang);
      // Bildschirmfotos der App (für Anleitungen): Adresse aufrufen, optional klicken, dann fotografieren
      for (const sh of LIST ? [] : SPEC.shots || []) {
        await c.send("Emulation.setDeviceMetricsOverride", { width: sh.width || 1400, height: sh.height || 900, deviceScaleFactor: sh.scale || 1, mobile: false });
        await c.evaluate(`(() => { window.dispatchEvent(new Event("resize")); location.hash = ${JSON.stringify(sh.hash || "#browse")}; })()`);
        await sleep(sh.wait || 1500);
        for (const sel of [].concat(sh.click || [])) {
          await c.evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (el) el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window })); else console.warn("nicht gefunden: " + ${JSON.stringify(sel)}); })()`);
          await sleep(sh.clickWait || 800);
        }
        const out = join(OUT, `${sh.name}-${lang}.png`);
        writeFileSync(out, Buffer.from((await c.send("Page.captureScreenshot", { format: "png" })).data, "base64"));
        if (sh.close) await c.evaluate(`(() => { document.querySelectorAll("dialog[open]").forEach((d) => d.close()); })()`);
        console.log(`  Foto → ${out}`);
      }
      await c.send("Emulation.clearDeviceMetricsOverride");
      let n = 0;
      for (const part of SPEC.parts || []) {
        if (part.langs && !part.langs.includes(lang)) continue;
        const info = await c.evaluate(`APP_TEST.print(${JSON.stringify(part.job)}, ${JSON.stringify(part.opts || {})})`);
        if (!info) {
          console.warn(`  ${part.job}: keine Seiten`);
          continue;
        }
        const pages = await c.evaluate(`(${pagesInPage.toString()})()`);
        if (LIST) {
          console.log(`  ${part.job}: ${pages.length} Seiten`);
          for (const p of pages) console.log(`   #${p.i + 1} [${p.no}] ${p.spell ? "spell:" + p.spell + " " : ""}${p.lessons.length ? "lesson:" + p.lessons.join(",") + " " : ""}${p.text.slice(0, 70)}`);
        } else {
          const keep = choose(pages, part.pick || []);
          await c.evaluate(`(() => { const keep = new Set(${JSON.stringify(keep)}); [...document.querySelectorAll("#print-root .page")].forEach((p, i) => { if (!keep.has(i)) p.remove(); }); })()`);
          const out = join(OUT, `.${++n}-${part.job}-${lang}.pdf`);
          writeFileSync(out, await pdf(c));
          files.push(out);
          console.log(`  ${part.job}: ${keep.length} von ${pages.length} Seiten (${keep.map((i) => "#" + (i + 1)).join(" ")})`);
        }
        await c.evaluate(`APP_TEST.done()`);
      }
      if (LIST || !files.length) continue;
      const target = join(OUT, `${SPEC.name || "preview"}-${lang}.pdf`);
      try {
        execFileSync("pdfunite", [...files, target]);
        files.forEach((f) => rmSync(f));
        console.log(`  → ${target}`);
        if (PNG) {
          execFileSync("pdftoppm", ["-png", "-r", "110", target, join(OUT, `${SPEC.name || "preview"}-${lang}`)]);
          console.log(`  → Seitenbilder ${SPEC.name || "preview"}-${lang}-*.png`);
        }
      } catch (e) {
        console.warn(`  pdfunite nicht verfügbar oder fehlgeschlagen; Teile liegen einzeln in ${OUT}`);
      }
    }
  } finally {
    c.close();
  }
  console.log(`fertig in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});

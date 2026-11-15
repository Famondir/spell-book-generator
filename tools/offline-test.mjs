#!/usr/bin/env node
// Offline-Test der installierbaren Web-App (sw.js): eigener HTTP-Server (mit ETag/304) unter einem Unterpfad wie
// GitHub Pages, headless Chrome mit frischem Profil.
//   1. erster Besuch mit Netz: Service Worker aktiv, alle Dateien vorgeladen
//   2. Server aus, neu laden: App startet, Buch, Lehrheft, Vademecum, Druck, Schriften aus dem Cache;
//      die Anfrage nach data/profile.local.js scheitert ohne Syntaxfehler
//   3. Server wieder an, eine Datei geändert ausliefern, neu laden: neue Fassung aktiv
// Rückgabecode 1 bei Fehlern.
//
//   node tools/offline-test.mjs [--verbose]
import { spawn, execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const VERBOSE = process.argv.includes("--verbose");
const BASE = "/spell-book-generator/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".woff2": "font/woff2", ".png": "image/png", ".webmanifest": "application/manifest+json", ".txt": "text/plain; charset=utf-8", ".json": "application/json" };

// --- Server ---------------------------------------------------------------------------------
const overrides = new Map(); // Pfad → Inhalt (für den Update-Test)
let requests = 0;
const log = [];
function handler(req, res) {
  requests++;
  if (VERBOSE) log.push(req.url.replace(BASE, "") + (req.headers["if-none-match"] ? " (bedingt)" : ""));
  const url = new URL(req.url, "http://x");
  if (!url.pathname.startsWith(BASE)) return res.writeHead(404).end();
  let rel = decodeURIComponent(url.pathname.slice(BASE.length)) || "index.html";
  const file = normalize(join(ROOT, rel));
  if (!file.startsWith(ROOT) || /(^|\/)\.git(\/|$)/.test(rel)) return res.writeHead(403).end();
  // wie GitHub Pages: lokale Dateien (gitignored) gibt es online nicht
  if (/\.local\./.test(rel)) return res.writeHead(404).end();
  const over = overrides.get(rel);
  if (!over && (!existsSync(file) || statSync(file).isDirectory())) return res.writeHead(404).end();
  const body = over != null ? Buffer.from(over) : readFileSync(file);
  const etag = `"${body.length.toString(16)}-${over != null ? "o" + over.length : statSync(file).mtimeMs.toString(16)}"`;
  if (req.headers["if-none-match"] === etag) return res.writeHead(304, { ETag: etag }).end();
  res.writeHead(200, { "Content-Type": TYPES[extname(rel)] || "application/octet-stream", ETag: etag, "Cache-Control": "max-age=600" });
  res.end(body);
}
let server, sockets = new Set();
const startServer = (port = 0) => new Promise((r) => {
  server = createServer(handler);
  server.on("connection", (s) => (sockets.add(s), s.on("close", () => sockets.delete(s))));
  server.listen(port, "127.0.0.1", () => r(server.address().port));
});
const stopServer = () => new Promise((r) => { for (const s of sockets) s.destroy(); server.close(() => r()); });

// --- Chrome ---------------------------------------------------------------------------------
function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  for (const c of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "chrome"]) {
    try {
      const p = execFileSync("which", [c], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
      if (p) return p;
    } catch {}
  }
  return null;
}

const errs = [];
const check = (step, ok, detail = "") => {
  console.log(`${ok ? "ok    " : "FEHLER"} ${step}${!ok && detail ? " – " + detail : ""}`);
  if (!ok) errs.push(step);
};

const bin = findChrome();
if (!bin) {
  console.error("Kein Chrome/Chromium gefunden (Umgebungsvariable CHROME setzen).");
  process.exit(2);
}
const port = await startServer();
const URL0 = `http://127.0.0.1:${port}${BASE}`;
const dir = mkdtempSync(join(tmpdir(), "spellbook-offline-"));
const proc = spawn(bin, ["--headless=new", "--disable-gpu", "--no-first-run", "--remote-debugging-port=0", `--user-data-dir=${dir}`, "--window-size=1400,1000", "--lang=de-DE", "about:blank"], { stdio: "ignore" });
let ws;
try {
  const portFile = join(dir, "DevToolsActivePort");
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await sleep(100);
  const dport = readFileSync(portFile, "utf8").split("\n")[0].trim();
  const page = (await (await fetch(`http://127.0.0.1:${dport}/json/list`)).json()).find((t) => t.type === "page");
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => ((ws.onopen = r), (ws.onerror = j)));
  let id = 0;
  const pending = new Map();
  const pageErrors = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) {
      const { res, rej } = pending.get(d.id);
      pending.delete(d.id);
      d.error ? rej(new Error(d.error.message)) : res(d.result);
    } else if (d.method === "Runtime.exceptionThrown") pageErrors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
    else if (VERBOSE && d.method === "Runtime.consoleAPICalled") console.log("   [app]", d.params.args.map((a) => a.value).join(" "));
  };
  const send = (method, params = {}) => new Promise((res, rej) => { pending.set(++id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const until = async (js, ms = 30000) => {
    for (const t0 = Date.now(); Date.now() - t0 < ms; await sleep(150)) if (await evaluate(js).catch(() => false)) return true;
    return false;
  };
  const appReady = `!!(window.APP_TEST && document.readyState === "complete")`;
  await send("Runtime.enable");
  await send("Page.enable");

  // 1. erster Besuch
  await send("Page.navigate", { url: URL0 });
  check("erster Besuch: App geladen", await until(appReady));
  check("Service Worker aktiv und steuert die Seite", await until(`navigator.serviceWorker.ready.then(() => !!navigator.serviceWorker.controller)`) || (await send("Page.reload"), await until(appReady) && await until(`!!navigator.serviceWorker.controller`)));
  const want = await evaluate(`fetch("sw.js").then((r) => r.text()).then((t) => [...t.match(/const PRECACHE = \\[([\\s\\S]*?)\\];/)[1].matchAll(/"([^"]+)"/g)].length)`);
  check(`alle ${want} Dateien vorgeladen`, await until(`caches.keys().then((ks) => ks.length ? caches.open(ks[0]).then((c) => c.keys()).then((k) => k.length >= ${want}) : false)`));
  // Charakter mit Buch und Schutzgottheit anlegen (für Buch und Vademecum)
  await evaluate(`localStorage.setItem("spellbook.chars", JSON.stringify([{ id: "c1", name: "Offline", profile: null, cls: "wizard", deity: "nethys" }])); localStorage.setItem("spellbook.activeChar", "c1"); localStorage.setItem("spellbook.c.c1.book", JSON.stringify(["fireball", "light", "magic-missile", "shield"])); true`);

  // 2. offline
  await stopServer();
  const before = requests;
  pageErrors.length = 0;
  await evaluate(`window.__oldPage = true`);
  await send("Page.reload");
  check("offline: App startet", await until(`!window.__oldPage && ${appReady}`));
  check("offline: Server wirklich aus (keine Anfrage angekommen)", requests === before, `${requests - before} Anfragen`);
  check("offline: Buch mit 4 Zaubern", (await evaluate(`APP_TEST.print("book").then((i) => { const n = document.querySelectorAll("#print-root .page[data-spell]").length; APP_TEST.done(); return n; })`)) > 0);
  check("offline: Lehrheft setzt Seiten", (await evaluate(`APP_TEST.print("primer").then(() => { const n = document.querySelectorAll("#print-root .page").length; APP_TEST.done(); return n; })`)) > 10);
  check("offline: Vademecum setzt Seiten", (await evaluate(`APP_TEST.print("vademecum").then(() => { const n = document.querySelectorAll("#print-root .page").length; APP_TEST.done(); return n; })`)) > 3);
  const fonts = await evaluate(`Promise.all(["cuneiform", "hieroglyphs", "ogham", "greek"].map((f) => new FontFace("t-" + f, "url(app/fonts/" + f + ".woff2)").load().then(() => true, () => f)))`);
  check("offline: Schriften der Formelsprachen ladbar", fonts.every((x) => x === true), JSON.stringify(fonts));
  check("offline: Lizenz erreichbar", await evaluate(`fetch("LICENSE-OGL.txt").then((r) => r.ok && r.text()).then((t) => /Open Game License/.test(t || ""))`));
  check("offline: lokales Profil fehlt ohne Syntaxfehler", (await evaluate(`!document.querySelector('script[src="data/profile.local.js"]') && !window.PROFILE_LOCAL`)) && !pageErrors.some((x) => /SyntaxError|Unexpected token/.test(x)), pageErrors.join(" | "));
  check("offline: andere Adresse (?lang=en) zeigt die App", await (async () => { await evaluate(`window.__oldPage = true`); await send("Page.navigate", { url: URL0 + "?lang=en#book" }); return until(`!window.__oldPage && ${appReady}`); })());
  check("offline: keine Fehler in der Seite", !pageErrors.length, pageErrors.join(" | "));

  // 3. Aktualisierung. Neustart der App nachstellen: Der Speicher-Cache des Renderers liefert innerhalb von
  //    max-age (GitHub Pages: 10 Minuten) frische Skripte noch vor dem Service Worker; ein echter Neustart hat ihn nicht.
  overrides.set("app/js/route.js", readFileSync(join(ROOT, "app/js/route.js"), "utf8") + "\nwindow.__offlineTestVersion = 2;\n");
  await startServer(port);
  await send("Network.enable");
  await send("Network.clearBrowserCache");
  log.length = 0;
  await evaluate(`window.__oldPage = true`);
  await send("Page.navigate", { url: URL0 });
  await until(`!window.__oldPage && ${appReady}`);
  check("mit Netz, nach Neustart: geänderte Datei aktiv", await evaluate(`window.__offlineTestVersion === 2`));
  if (VERBOSE) console.log("   [debug] Anfragen nach Neustart:", log.join(", "));

  // 4. Einstellungen und Speicher
  // headless Chrome meldet beforeinstallprompt, wenn Manifest, Symbole und Service Worker stimmen
  check("Browser bietet Installation an: Knopf und Hinweis", await until(`(document.getElementById("btn-settings").click(), document.getElementById("set-install-note").textContent === I18N.t("set.install.note") && !document.getElementById("btn-install").hidden)`, 5000));
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `window.__persistCalls = 0; const mm = window.matchMedia.bind(window); window.matchMedia = (q) => (/display-mode: *standalone/.test(q) ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} } : mm(q)); if (navigator.storage) { navigator.storage.persisted = () => Promise.resolve(false); navigator.storage.persist = () => (window.__persistCalls++, Promise.resolve(true)); }` });
  await evaluate(`window.__oldPage = true`);
  await send("Page.reload");
  await until(`!window.__oldPage && ${appReady}`);
  check("installiert (standalone): dauerhafter Speicher erbeten", await until(`window.__persistCalls === 1`, 3000));
  check("installiert: Hinweis „läuft als App“", await evaluate(`(document.getElementById("btn-settings").click(), document.getElementById("set-install-note").textContent === I18N.t("set.install.done"))`));
} catch (e) {
  check("Ablauf", false, e.message);
} finally {
  try { ws && ws.close(); } catch {}
  try { proc.kill(); } catch {}
  try { await stopServer(); } catch {}
  try { rmSync(dir, { recursive: true, force: true }); } catch {}
}
console.log(errs.length ? `offline-test: ${errs.length} Fehler` : "offline-test: alles bestanden");
process.exit(errs.length ? 1 : 0);

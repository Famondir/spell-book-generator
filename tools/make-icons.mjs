#!/usr/bin/env node
// App-Symbole für die installierbare Web-App (manifest.webmanifest): ein Zauberkreis der App selbst auf Pergament.
// Holt den Kreis über den SVG-Export der App (Kreisfenster → „Als SVG speichern“) im headless Chrome
// (frisches Browserprofil, neutrales Profil) und schreibt:
//   app/icons/icon-192.png, icon-512.png    Kreis groß auf abgerundetem Pergament
//   app/icons/icon-maskable-512.png         Kreis samt Eckzeichen innerhalb der runden Sicherheitszone (Radius 40 %), Pergament randlos
//   app/icons/icon-180.png                  apple-touch-icon
//
//   node tools/make-icons.mjs [--spell arcane-mark] [--out app/icons]
import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const val = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const SPELL = val("--spell", "arcane-mark");
const OUT = resolve(ROOT, val("--out", "app/icons"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

const bin = findChrome();
if (!bin) {
  console.error("Kein Chrome/Chromium gefunden (Umgebungsvariable CHROME setzen).");
  process.exit(2);
}
const dir = mkdtempSync(join(tmpdir(), "spellbook-icons-"));
const proc = spawn(bin, ["--headless=new", "--disable-gpu", "--no-first-run", "--allow-file-access-from-files", "--remote-debugging-port=0", `--user-data-dir=${dir}`, "--window-size=1400,1000", "about:blank"], { stdio: "ignore" });
const done = () => {
  try { proc.kill(); } catch {}
  try { rmSync(dir, { recursive: true, force: true }); } catch {}
};
try {
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
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const until = async (js, ms = 20000) => {
    for (const t0 = Date.now(); Date.now() - t0 < ms; await sleep(100)) if (await evaluate(js).catch(() => false)) return;
    throw new Error("Zeitüberschreitung: " + js);
  };

  // 1. Kreis aus der App: neutral, ohne lokales Profil
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `for (const k of ["PROFILE_LOCAL", "PROFILES_LOCAL"]) Object.defineProperty(window, k, { get: () => undefined, set: () => {}, configurable: false });` });
  await send("Page.navigate", { url: pathToFileURL(join(ROOT, "index.html")).href + "#browse/" + SPELL });
  await until(`!!(window.APP_TEST && document.readyState === "complete" && document.querySelector(".page svg.circle"))`);
  const svg = await evaluate(`new Promise((resolve) => {
    HTMLAnchorElement.prototype.click = function () { fetch(this.href).then((r) => r.text()).then(resolve); };
    document.querySelector(".page svg.circle").dispatchEvent(new MouseEvent("click", { bubbles: true }));
    setTimeout(() => document.getElementById("cm-save").click(), 200);
  })`);
  if (!/<svg/.test(svg)) throw new Error("kein SVG vom Export");

  // 2. Symbol setzen: Pergament mit Rand, Kreis mit kräftigeren Linien (bei 192 px wären die Haarlinien unsichtbar)
  const inner = svg.replace(/<rect x="-300"[^>]*\/>/, "").replace(/width="1200" height="1200"/, 'width="100%" height="100%"');
  const icon = (size, maskable) => `<!doctype html><html><head><style>
    html,body{margin:0;background:transparent}
    .ic{width:${size}px;height:${size}px;position:relative;overflow:hidden;
      background:radial-gradient(circle at 50% 45%, #f7efdb 0%, #f3e9d2 55%, #e3d3ad 100%);
      ${maskable ? "" : `border-radius:${Math.round(size * 0.18)}px;box-shadow:inset 0 0 0 ${Math.max(2, size / 64)}px #a57a12;`}}
    .ic svg{position:absolute;inset:${maskable ? "21%" : "4%"};width:${maskable ? "58%" : "92%"};height:${maskable ? "58%" : "92%"}}
    .ic svg *{stroke-width:2.6}.ic svg .thin{stroke-width:1.6}.ic svg .thick{stroke-width:5}.ic svg .ess-seg{stroke-width:9}
    .ic svg text,.ic svg textPath,.ic svg .band-text{display:none}
  </style></head><body><div class="ic">${inner}</div></body></html>`;
  mkdirSync(OUT, { recursive: true });
  const jobs = [["icon-192.png", 192, false], ["icon-512.png", 512, false], ["icon-180.png", 180, false], ["icon-maskable-512.png", 512, true]];
  for (const [name, size, maskable] of jobs) {
    const file = join(dir, "icon.html");
    writeFileSync(file, icon(size, maskable));
    await send("Page.navigate", { url: pathToFileURL(file).href });
    await until(`document.readyState === "complete" && !!document.querySelector(".ic svg")`);
    await send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
    const shot = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: size, height: size, scale: 1 } });
    writeFileSync(join(OUT, name), Buffer.from(shot.data, "base64"));
    console.log("geschrieben:", join(OUT, name).replace(ROOT + "/", ""));
  }
  ws.close();
} finally {
  done();
}

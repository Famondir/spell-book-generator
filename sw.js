// Service Worker der installierbaren Web-App (Change installable-app), nach dem Muster von Tex-Tricorder:
// Netzwerk zuerst (Updates kommen beim nächsten Start an), Cache als Offline-Rückfall.
// Beim Installieren werden alle ausgelieferten Dateien vorgeladen, damit auch selten genutzte Teile
// (Schriften für Keilschrift, Hieroglyphen, Ogham …) offline da sind.
// Nur über http(s) registriert (index.html), nie unter file://.
//
// Vorladeliste: genau die ausgelieferten Dateien aus app/ und data/ (ohne *.local.*), dazu Seite und Manifest.
// Prüfung: node tools/sw-check.mjs (gleicht mit git ls-files und index.html ab).
// CACHE hochzählen leert beim nächsten Start alle alten Einträge (sonst nicht nötig: neue Dateien in der Liste
// ändern sw.js, und der Browser installiert ihn neu).
const CACHE = "spellbook-v1";
const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "LICENSE-OGL.txt",
  "app/style.css",
  "app/icons/icon-180.png",
  "app/icons/icon-192.png",
  "app/icons/icon-512.png",
  "app/icons/icon-maskable-512.png",
  "app/fonts/caveat.woff2",
  "app/fonts/cinzel.woff2",
  "app/fonts/covered.woff2",
  "app/fonts/cuneiform.woff2",
  "app/fonts/greek.woff2",
  "app/fonts/hieroglyphs.woff2",
  "app/fonts/imfell-italic.woff2",
  "app/fonts/imfell.woff2",
  "app/fonts/kalam.woff2",
  "app/fonts/ogham.woff2",
  "app/fonts/widths.js",
  "app/js/analyze.js",
  "app/js/app.js",
  "app/js/book.js",
  "app/js/chars.js",
  "app/js/circle.js",
  "app/js/classes.js",
  "app/js/deity-colors.js",
  "app/js/devotion.js",
  "app/js/everyday.js",
  "app/js/glyphs.js",
  "app/js/i18n.js",
  "app/js/import.js",
  "app/js/lang.js",
  "app/js/legend.js",
  "app/js/prayer.js",
  "app/js/prepare.js",
  "app/js/primer.js",
  "app/js/profile-store.js",
  "app/js/profile.js",
  "app/js/route.js",
  "app/js/rules.js",
  "app/js/scripts.js",
  "app/js/stats.js",
  "app/js/textgen.de.js",
  "app/js/textgen.en.js",
  "app/js/textgen.js",
  "app/js/theory.js",
  "app/js/time.js",
  "app/js/typeset.js",
  "app/js/util.js",
  "app/js/vademecum.js",
  "app/js/viewer.js",
  "app/js/vitrail.js",
  "app/vendor/qrcode.js",
  "data/custom_texts.js",
  "data/deities.js",
  "data/domains.de.js",
  "data/everyday_spells.en.js",
  "data/everyday_spells.js",
  "data/formula-lang/akkadian.js",
  "data/formula-lang/bantu.js",
  "data/formula-lang/egyptian.js",
  "data/formula-lang/greek.js",
  "data/formula-lang/hittite.js",
  "data/formula-lang/latin.js",
  "data/formula-lang/oldirish.js",
  "data/formula-lang/pie.js",
  "data/formula-lang/sumerian.js",
  "data/formula-lang/technic.js",
  "data/formula-lang/welsh.js",
  "data/lang/de.js",
  "data/lang/en.js",
  "data/lang/rules-terms.de.js",
  "data/primer.en.js",
  "data/primer.js",
  "data/profile.js",
  "data/rules.de.js",
  "data/spells.js",
  "data/time.js",
  "data/vademecum.js",
];
// nie cachen und offline nie beantworten: lokale Dateien (fehlen online, Skript-Element entfernt sich per onerror)
// und alles, was nicht zur App gehört
const SKIP = /(^|\/)[^/]*\.local\.[^/]*$|^(docs|tools|openspec)\//;

self.addEventListener("install", (e) => {
  // am HTTP-Cache vorbei (GitHub Pages hält Dateien sonst 10 Minuten)
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE.map((u) => new Request(u, { cache: "reload" })))));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const scope = new URL(self.registration.scope).pathname;
  const rel = url.pathname.startsWith(scope) ? url.pathname.slice(scope.length) : url.pathname;
  if (SKIP.test(rel)) return;
  const nav = req.mode === "navigate";
  e.respondWith(
    // Netzwerk zuerst, bedingt (ETag): unveränderte Dateien kommen als 304 und kosten kaum Daten
    fetch(url.href, { cache: "no-cache" })
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          // Seitenaufrufe (auch mit ?lang=… oder Pfad ./) unter index.html ablegen
          caches.open(CACHE).then((c) => c.put(nav ? "index.html" : new Request(url.origin + url.pathname), copy));
        }
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(nav ? "index.html" : url.origin + url.pathname, { ignoreSearch: true });
        if (hit) return hit;
        // Rückfall auf die Seite nur für Seitenaufrufe, sonst bekäme ein <script> HTML statt eines Fehlers
        return (nav && (await caches.match("./"))) || Response.error();
      })
  );
});

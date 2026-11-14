// Adresse (Hash) ↔ Ort in der App, für Lesezeichen und Zurück/Vor des Browsers.
// Form: #<ansicht>[/<segment>…][/full], z. B. #browse/fireball, #book/fireball/full, #theory/primer/II/l10.
// Nur der Hash: läuft gleich über file:// und GitHub Pages (kein Server sieht ihn).
// Was die Segmente bedeuten, weiß app.js; hier nur Lesen, Schreiben und Verlauf.
//   ROUTE.parse(hash)      → { view, parts, full }   unbekannte oder leere Ansicht: browse ohne Ziel
//   ROUTE.format(route)    → "#…" ("" für das Verzeichnis ohne Ziel)
//   ROUTE.write(route, st) Adresse setzen: ersetzt, außer nach mark() (dann neuer Verlaufseintrag mit Zustand st)
//   ROUTE.push(route, st)  mark() + write()
//   ROUTE.mark()           der nächste Schreibvorgang legt einen Verlaufseintrag an (für Sprünge, deren Ziel erst
//                          nach dem Satz feststeht: der Betrachter schreibt dann selbst)
//   ROUTE.applying         während die App eine Adresse herstellt: nie neue Einträge
(function () {
  const VIEWS = ["browse", "book", "prepare", "theory"];
  const FULL = "full";
  const dec = (s) => {
    try {
      return decodeURIComponent(s);
    } catch (_) {
      return s;
    }
  };

  function parse(hash) {
    const segs = String(hash || "").replace(/^#\/?/, "").split("/").filter(Boolean).map(dec);
    const view = segs.shift();
    if (!VIEWS.includes(view)) return { view: "browse", parts: [], full: false };
    // „full“ nur hinter einem Ziel (Zauber), nie als Ziel selbst
    const full = segs.length > 1 && segs[segs.length - 1] === FULL;
    if (full) segs.pop();
    return { view, parts: segs, full };
  }

  function format(r) {
    const parts = (r.parts || []).filter((x) => x != null && x !== "");
    if ((r.view || "browse") === "browse" && !parts.length) return "";
    return "#" + [r.view, ...parts.map(encodeURIComponent), ...(r.full && parts.length ? [FULL] : [])].join("/");
  }

  let pushNext = false;
  const api = {
    VIEWS,
    parse,
    format,
    applying: false,
    mark() {
      if (!api.applying) pushNext = true;
    },
    write(r, st = null) {
      const url = format(r);
      const push = pushNext && !api.applying;
      pushNext = false;
      if (url === location.hash) return false;
      const href = url || location.pathname + location.search;
      try {
        // ersetzt: Zustand des Eintrags (z. B. vom App geöffnetes Fenster) bleibt, solange das Fenster in der Adresse steht
        if (push) history.pushState(st, "", href);
        else history.replaceState(r.full ? history.state : null, "", href);
      } catch (_) { /* manche Browser sperren history unter file:// */ }
      return true;
    },
    push(r, st = null) {
      api.mark();
      return api.write(r, st);
    },
  };
  window.ROUTE = api;
})();

// Sprachen: drei Ebenen (Oberfläche, Buch, Regeln) und Maßeinheit.
// I18N.configure(settings) setzt die Ebenen; t()/b()/r() holen Texte aus den Sprachtabellen
// (data/lang/de.js, data/lang/en.js → window.LANG.de / .en) in Oberflächen-, Buch- bzw. Regelsprache.
// Fehlt ein Schlüssel, gilt die andere Sprache (und er wird in I18N.missing gezählt).
// Im HTML: data-i18n="schlüssel" (Text), data-i18n-html="schlüssel" (HTML), data-i18n-attr="placeholder:schlüssel;title:…".
(function () {
  const browser = /^de/i.test(navigator.language || "de") ? "de" : "en";
  const lang = { ui: "de", book: "de", rules: "de", units: "m" };
  const missing = new Set();
  const fmt = (s, vars) => (vars ? String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m)) : s);
  function tr(l, key, vars) {
    const T = window.LANG || {};
    let s = T[l] && T[l][key];
    if (s == null) {
      missing.add(l + ":" + key);
      const o = l === "de" ? "en" : "de";
      s = T[o] && T[o][key];
      if (s == null) s = key;
    }
    return fmt(s, vars);
  }
  function configure(st = {}) {
    lang.ui = st.uiLang || "de";
    lang.book = st.bookLang || "de";
    lang.rules = st.rulesLang || "de";
    lang.units = st.units || (lang.rules === "de" ? "m" : "ft");
    document.documentElement.lang = lang.ui;
  }
  function apply(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = tr(lang.ui, el.dataset.i18n)));
    root.querySelectorAll("[data-i18n-html]").forEach((el) => (el.innerHTML = tr(lang.ui, el.dataset.i18nHtml)));
    root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      for (const pair of el.dataset.i18nAttr.split(";")) {
        const [attr, key] = pair.split(":").map((x) => x.trim());
        if (attr && key) el.setAttribute(attr, tr(lang.ui, key));
      }
    });
  }
  // Längen: 5 Fuß = 1,5 m (Pathfinder-Konvention); deutsch mit Dezimalkomma
  const num = (n) => (lang.ui === "de" || lang.rules === "de" ? String(n).replace(".", ",") : String(n));
  const len = (ft) => (lang.units === "m" ? `${num(Math.round(ft * 0.3 * 100) / 100)} m` : `${ft} ft.`);

  window.I18N = {
    lang, browser, missing, configure, apply, len, num,
    t: (k, v) => tr(lang.ui, k, v),
    // Mehrzahl: Schlüssel.one / Schlüssel.other, {n} ist die Zahl
    tn: (k, n, v) => tr(lang.ui, `${k}.${n === 1 ? "one" : "other"}`, { n, ...(v || {}) }),
    // Datum und Uhrzeit in der Oberflächensprache
    locale: () => (lang.ui === "de" ? "de-DE" : "en-GB"),
    // Schule in der Oberflächensprache (THEORY.SCHOOLS: de; englisch: Schlüssel)
    school: (k) => (lang.ui === "de" ? (window.THEORY && THEORY.SCHOOLS[k] ? THEORY.SCHOOLS[k].de : k) : k.charAt(0).toUpperCase() + k.slice(1)),
    b: (k, v) => tr(lang.book, k, v),
    r: (k, v) => tr(lang.rules, k, v),
  };
})();

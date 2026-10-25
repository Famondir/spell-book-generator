// Charakter-Slots: jeder Charakter hat eigenes Buch, eigene Einstellungen, Vorbereitung und Protokoll.
// Wird vor profile.js geladen, damit das Profil des aktiven Charakters gemischt wird.
// Speicher: spellbook.chars (Liste), spellbook.activeChar, spellbook.c.<id>.<schlüssel> (Daten je Charakter).
// Ein Listeneintrag: { id, name, profile, cls, deity } – ohne cls gilt der Charakter als Magier.
window.CHARS = (function () {
  const P = "spellbook.";
  const OWN = ["settings", "book", "bookPos", "bookVol", "prep", "prepPresets", "prepLog", "prepDays", "prayers"]; // je Charakter
  const ls = {
    get(k) {
      try {
        return localStorage.getItem(k);
      } catch (_) {
        return null;
      }
    },
    set(k, v) {
      try {
        v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v);
      } catch (_) { /* privater Modus o. Ä. */ }
    },
  };
  const json = (k, d) => {
    try {
      const v = ls.get(k);
      return v ? JSON.parse(v) : d;
    } catch (_) {
      return d;
    }
  };

  // verfügbare lokale Profile: PROFILE_LOCAL (bisher, „lokal“) und PROFILES_LOCAL { key: { label, … } }
  function profiles() {
    const out = [];
    if (window.PROFILE_LOCAL) out.push({ key: "local", label: window.PROFILE_LOCAL.label || window.PROFILE_LOCAL.owner || I18N.t("char.localProfile"), data: window.PROFILE_LOCAL });
    for (const [key, data] of Object.entries(window.PROFILES_LOCAL || {})) out.push({ key, label: data.label || data.owner || key, data });
    return out;
  }

  let list = json(P + "chars", null);
  // einmalige Übernahme der Daten aus der Zeit vor den Charakter-Slots
  if (!Array.isArray(list) || !list.length) {
    const settings = json(P + "settings", {});
    const prof = profiles()[0];
    list = [{ id: "c1", name: settings.owner || (prof && prof.data.owner) || I18N.t("char.first"), profile: prof ? prof.key : null }];
    for (const k of OWN) {
      const v = ls.get(P + k);
      if (v != null) {
        ls.set(P + "c.c1." + k, v);
        ls.set(P + k, null);
      }
    }
    ls.set(P + "chars", JSON.stringify(list));
    ls.set(P + "activeChar", "c1");
  }
  let active = ls.get(P + "activeChar");
  if (!list.some((c) => c.id === active)) active = list[0].id;

  const save = () => ls.set(P + "chars", JSON.stringify(list));
  const current = () => list.find((c) => c.id === active);
  const newId = () => "c" + (Math.max(0, ...list.map((c) => parseInt(c.id.slice(1), 10) || 0)) + 1);
  // Schlüssel für Daten: je Charakter oder global
  const key = (k) => (OWN.includes(k) ? `${P}c.${active}.${k}` : P + k);

  function switchTo(id, reload = true) {
    if (!list.some((c) => c.id === id)) return;
    ls.set(P + "activeChar", id);
    if (reload) location.reload();
  }
  function create(name, profile = null, copyFrom = null, extra = {}) {
    const src = copyFrom && list.find((x) => x.id === copyFrom);
    const c = { id: newId(), name: name || I18N.t("char.newName"), profile, ...(src ? { cls: src.cls, deity: src.deity } : {}), ...extra };
    list.push(c);
    save();
    if (copyFrom) for (const k of OWN) if (k !== "prepLog" && k !== "prepDays") ls.set(`${P}c.${c.id}.${k}`, ls.get(`${P}c.${copyFrom}.${k}`));
    return c;
  }
  function update(id, fields) {
    const c = list.find((x) => x.id === id);
    if (!c) return;
    Object.assign(c, fields);
    save();
  }
  function remove(id) {
    if (list.length < 2) return false;
    for (const k of OWN) ls.set(`${P}c.${id}.${k}`, null);
    list = list.filter((c) => c.id !== id);
    save();
    if (id === active) switchTo(list[0].id);
    return true;
  }
  // Rohdaten eines Charakters schreiben (für den Import als neuer Charakter)
  const write = (id, k, v) => ls.set(`${P}c.${id}.${k}`, JSON.stringify(v));

  return {
    list: () => list.slice(),
    current,
    active: () => active,
    profiles,
    profileData: () => {
      const c = current();
      return c && c.profile ? (profiles().find((p) => p.key === c.profile) || {}).data || null : null;
    },
    key,
    switchTo,
    create,
    update,
    remove,
    write,
  };
})();

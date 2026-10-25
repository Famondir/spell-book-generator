// Zauberlisten importieren: .xlsx (Spalte „Name“), .csv/.txt (ein Name pro Zeile bzw. erste Spalte).
// Die xlsx-Datei wird ohne Bibliothek gelesen: ZIP-Verzeichnis parsen, Einträge per DecompressionStream entpacken.
(function () {
  async function unzip(buf) {
    const dv = new DataView(buf);
    const u8 = new Uint8Array(buf);
    // Ende des zentralen Verzeichnisses suchen
    let eocd = -1;
    for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 65557); i--) {
      if (dv.getUint32(i, true) === 0x06054b50) {
        eocd = i;
        break;
      }
    }
    if (eocd < 0) throw new Error(I18N.t("import.badXlsx"));
    const count = dv.getUint16(eocd + 10, true);
    let p = dv.getUint32(eocd + 16, true);
    const files = {};
    const dec = new TextDecoder();
    for (let n = 0; n < count; n++) {
      const method = dv.getUint16(p + 10, true);
      const csize = dv.getUint32(p + 20, true);
      const nameLen = dv.getUint16(p + 28, true);
      const extraLen = dv.getUint16(p + 30, true);
      const commentLen = dv.getUint16(p + 32, true);
      const local = dv.getUint32(p + 42, true);
      const name = dec.decode(u8.subarray(p + 46, p + 46 + nameLen));
      p += 46 + nameLen + extraLen + commentLen;
      const start = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true);
      files[name] = { method, data: u8.subarray(start, start + csize) };
    }
    return {
      async text(name) {
        const f = files[name];
        if (!f) return null;
        if (f.method === 0) return dec.decode(f.data);
        const stream = new Blob([f.data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
        return await new Response(stream).text();
      },
      names: Object.keys(files),
    };
  }

  async function xlsxNames(buf) {
    const zip = await unzip(buf);
    const xml = (s) => new DOMParser().parseFromString(s, "application/xml");
    const ssText = await zip.text("xl/sharedStrings.xml");
    const shared = ssText ? [...xml(ssText).getElementsByTagName("si")].map((si) => [...si.getElementsByTagName("t")].map((t) => t.textContent).join("")) : [];
    const sheetName = zip.names.find((n) => /^xl\/worksheets\/sheet1\.xml$/.test(n)) || zip.names.find((n) => /^xl\/worksheets\/.*\.xml$/.test(n));
    const sheet = xml(await zip.text(sheetName));
    // Zellen nach Adresse sammeln; einfache Formelverweise (=A2) ohne gespeichertes Ergebnis selbst auflösen,
    // z. B. wenn die Datei von einem Skript statt von Excel/LibreOffice gespeichert wurde
    const byRef = {}, refs = [];
    const rows = [...sheet.getElementsByTagName("row")].map((row) => {
      const cells = {};
      for (const c of row.getElementsByTagName("c")) {
        const ref = c.getAttribute("r") || "";
        const col = ref.replace(/\d+/g, "");
        const t = c.getAttribute("t");
        const v = c.getElementsByTagName("v")[0];
        const f = c.getElementsByTagName("f")[0];
        let val = null;
        if (t === "s" && v) val = shared[+v.textContent];
        else if (t === "inlineStr") val = [...c.getElementsByTagName("t")].map((x) => x.textContent).join("");
        else if (v) val = v.textContent;
        if (val != null && String(val).trim()) cells[col] = byRef[ref] = String(val).trim();
        else if (f && /^\$?[A-Z]+\$?\d+$/.test(f.textContent.trim())) refs.push([cells, col, f.textContent.trim().replace(/\$/g, "")]);
      }
      return cells;
    });
    for (const [cells, col, target] of refs) if (byRef[target]) cells[col] = byRef[target];
    // Spalte mit Überschrift „Name“ suchen, sonst alle Textzellen nehmen
    const headerRow = rows.findIndex((r) => Object.values(r).some((v) => /^(name|zauber|spell)$/i.test(v)));
    if (headerRow >= 0) {
      const col = Object.entries(rows[headerRow]).find(([, v]) => /^(name|zauber|spell)$/i.test(v))[0];
      return rows.slice(headerRow + 1).map((r) => r[col]).filter(Boolean);
    }
    return [...new Set(rows.flatMap((r) => Object.values(r)))];
  }

  function textNames(text) {
    return text
      .split(/\r?\n/)
      .map((l) => l.split(/[;\t]/)[0].replace(/^"|"$/g, "").trim())
      .filter((l) => l && !/^(name|zauber|spell)$/i.test(l));
  }

  window.IMPORT = { xlsxNames, textNames };
})();

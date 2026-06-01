/*
 * Copyright ? 2026 Chaeseong Lim.
 * This software and its underlying algorithms may not be copied, modified, distributed, reverse engineered, or used to create derivative works without explicit written permission.
 */

let pptxGenLoadPromise = null;
const dynamicScriptPromises = new Map();

async function ensurePptxGenLoaded() {
  if (typeof PptxGenJS === "function") return;
  if (!pptxGenLoadPromise) {
    pptxGenLoadPromise = loadScriptOnce("assets/vendor/jszip.min.js")
      .then(() => loadScriptOnce("assets/vendor/pptxgen.min.js"))
      .then(() => {
        if (typeof PptxGenJS !== "function") {
          throw new Error("PptxGenJS global was not created.");
        }
      })
      .catch((error) => {
        pptxGenLoadPromise = null;
        throw error;
      });
  }
  await pptxGenLoadPromise;
}

function loadScriptOnce(src) {
  if (dynamicScriptPromises.has(src)) return dynamicScriptPromises.get(src);
  const promise = loadScriptElementOnce(src).catch((error) => {
    dynamicScriptPromises.delete(src);
    throw error;
  });
  dynamicScriptPromises.set(src, promise);
  return promise;
}

function loadScriptElementOnce(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-dynamic-src="${src}"]`);
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset.dynamicSrc = src;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

async function loadScriptsOnce(sources) {
  for (const src of sources) {
    await loadScriptOnce(src);
  }
}

function ensureReportExportLoaded() {
  return loadScriptsOnce([
    "assets/js/report-font.js",
    "assets/js/report.js",
    "assets/js/report-layout.js",
    "assets/js/report-pdf.js",
  ]);
}

function ensureEmbeddedFontDataLoaded() {
  return loadScriptOnce("assets/js/report-font.js");
}

function ensureDiagramPptxExportLoaded() {
  return loadScriptOnce("assets/js/diagram-pptx.js");
}

function ensurePortMapExportLoaded() {
  return loadScriptOnce("assets/js/portmap-export.js");
}

const LeafSpineExportUtils = {
  ensurePptxGenLoaded,
  ensureEmbeddedFontDataLoaded,
  ensureReportExportLoaded,
  ensureDiagramPptxExportLoaded,
  ensurePortMapExportLoaded,
  loadScriptOnce,
  loadScriptsOnce,
};

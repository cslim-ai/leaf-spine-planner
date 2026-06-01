/*
 * Copyright ? 2026 Chaeseong Lim.
 * This software and its underlying algorithms may not be copied, modified, distributed, reverse engineered, or used to create derivative works without explicit written permission.
 */

// Public report facade. Heavy report implementation files are loaded on demand.
const LeafSpineReport = {
  export: async (format) => {
    await LeafSpineExportUtils.ensureReportExportLoaded();
    return exportReport(format);
  },
  exportPdf: async () => {
    await LeafSpineExportUtils.ensureReportExportLoaded();
    return exportPagePdf();
  },
  exportSvg: async () => {
    await LeafSpineExportUtils.ensureReportExportLoaded();
    return exportReportSvg();
  },
  makeSvg: async (...args) => {
    await LeafSpineExportUtils.ensureReportExportLoaded();
    return makeReportSvg(...args);
  },
};

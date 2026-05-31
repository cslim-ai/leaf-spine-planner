// Public report facade. Loaded after report implementation files.
const LeafSpineReport = {
  export: exportReport,
  exportPdf: exportPagePdf,
  exportSvg: exportReportSvg,
  makeSvg: makeReportSvg,
};

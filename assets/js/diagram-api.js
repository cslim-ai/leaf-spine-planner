// Public diagram facade. Loaded after diagram implementation files.
const LeafSpineDiagram = {
  makeForView: (result, viewMode) => makeDiagramFromGeometry(diagramGeometryForView(result, viewMode)),
  getGeometryForView: (result, viewMode) => diagramGeometryForView(result, viewMode),
  adjustLabelBadges,
  exportPng: async () => {
    await LeafSpineExportUtils.ensureEmbeddedFontDataLoaded();
    return exportDiagramPng();
  },
  exportSvg: async () => {
    await LeafSpineExportUtils.ensureEmbeddedFontDataLoaded();
    return exportDiagramSvg();
  },
  exportPptx: async (viewMode) => {
    await LeafSpineExportUtils.ensureDiagramPptxExportLoaded();
    return exportDiagramPptx(viewMode);
  },
  openWindow: openDiagramWindow,
};

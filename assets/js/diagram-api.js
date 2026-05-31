// Public diagram facade. Loaded after diagram implementation files.
const LeafSpineDiagram = {
  makeForView: (result, viewMode) => makeDiagramFromGeometry(diagramGeometryForView(result, viewMode)),
  getGeometryForView: (result, viewMode) => diagramGeometryForView(result, viewMode),
  adjustLabelBadges,
  exportPng: exportDiagramPng,
  exportSvg: exportDiagramSvg,
  exportPptx: exportDiagramPptx,
  openWindow: openDiagramWindow,
};

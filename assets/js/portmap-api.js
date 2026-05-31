// Public port map facade. Export helpers are loaded on demand.
const LeafSpinePortMap = {
  openWindow: openPortMapWindow,
  build: buildPortMap,
  exportExcel: async () => {
    await LeafSpineExportUtils.ensurePortMapExportLoaded();
    return exportPortMapExcel();
  },
  exportPpt: async () => {
    await LeafSpineExportUtils.ensurePortMapExportLoaded();
    return exportPortMapPpt();
  },
  buildXlsx: async (...args) => {
    await LeafSpineExportUtils.ensurePortMapExportLoaded();
    return buildPortMapXlsx(...args);
  },
  buildPptx: async (...args) => {
    await LeafSpineExportUtils.ensurePortMapExportLoaded();
    return buildPortMapPptx(...args);
  },
};

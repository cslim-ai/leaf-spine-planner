/*
 * Copyright ? 2026 Chaeseong Lim.
 * This software and its underlying algorithms may not be copied, modified, distributed, reverse engineered, or used to create derivative works without explicit written permission.
 */

// Port map Excel and PowerPoint export helpers.
function exportPortMapExcel() {
  if (!currentResult) return;
  const generatedAt = makeExportTimestamp();
  const blob = buildPortMapXlsx(buildPortMap(currentResult));
  downloadBlob(blob, exportFilename("leaf-spine-port-map", "xlsx", generatedAt));
}

async function exportPortMapPpt() {
  if (!currentResult) return;
  try {
    await LeafSpineExportUtils.ensurePptxGenLoaded();
    const generatedAt = makeExportTimestamp();
    const pptx = buildPortMapPptx(buildPortMap(currentResult), generatedAt.display);
    const blob = await pptx.write({ outputType: "blob" });
    downloadBlob(blob, exportFilename("leaf-spine-port-map", "pptx", generatedAt));
  } catch (error) {
    console.error(error);
    alert(typeof tr === "function" ? tr("portMap.pptError") : "포트맵 PPT 파일을 만드는 중 오류가 발생했습니다.");
  }
}

window.exportPortMapExcel = exportPortMapExcel;
window.exportPortMapPpt = exportPortMapPpt;

function getPortMapRows(portMap) {
  return [...portMap.serverLeafRows, ...portMap.leafSpineRows];
}

function portMapHeaders() {
  if (typeof tr !== "function") return ["#", "Segment", "Pod", "Plane", "From Device", "From Port", "To Device", "To Port", "Link Speed", "Group"];
  return [
    tr("portMap.columns.index"),
    tr("portMap.columns.segment"),
    tr("portMap.columns.pod"),
    tr("portMap.columns.plane"),
    tr("portMap.columns.fromDevice"),
    tr("portMap.columns.fromPort"),
    tr("portMap.columns.toDevice"),
    tr("portMap.columns.toPort"),
    tr("portMap.columns.speed"),
    tr("portMap.columns.group"),
  ];
}

function portMapTr(path, params = {}) {
  return typeof tr === "function" ? tr(path, params) : path;
}

function portMapRowValues(row, index) {
  return [
    index + 1,
    row.section,
    row.pod,
    row.plane,
    row.sourceDevice,
    row.sourcePort,
    row.targetDevice,
    row.targetPort,
    row.speed,
    row.group,
  ];
}

function portMapTableHeaderHtml() {
  return `<tr>${portMapHeaders().map((header) => `<th>${escapeXml(header)}</th>`).join("")}</tr>`;
}

function portMapExcelRowHtml(row, index) {
  const sectionClass = row.section === "Node-Leaf" ? "server-leaf" : "leaf-spine";
  return `<tr>${portMapRowValues(row, index).map((value, cellIndex) => {
    const className = cellIndex === 1 ? ` class="${sectionClass}"` : "";
    return `<td${className}>${escapeXml(value)}</td>`;
  }).join("")}</tr>`;
}

function buildPortMapXlsx(portMap) {
  const files = {
    "[Content_Types].xml": xlsxContentTypesXml(),
    "_rels/.rels": xlsxRootRelsXml(),
    "docProps/app.xml": xlsxAppXml(),
    "docProps/core.xml": xlsxCoreXml(),
    "xl/workbook.xml": xlsxWorkbookXml(),
    "xl/_rels/workbook.xml.rels": xlsxWorkbookRelsXml(),
    "xl/styles.xml": xlsxStylesXml(),
    "xl/worksheets/sheet1.xml": xlsxSheetXml(portMap),
  };
  return new Blob([zipFiles(files)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

function xlsxSheetXml(portMap) {
  const rows = [portMapHeaders(), ...getPortMapRows(portMap).map((row, index) => portMapRowValues(row, index))];
  const sourceRows = [null, ...getPortMapRows(portMap)];
  const colWidths = [7, 14, 11, 11, 22, 16, 24, 16, 14, 20];
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
  <cols>${colWidths.map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`).join("")}</cols>
  <sheetData>
    ${rows.map((values, rowIndex) => `<row r="${rowIndex + 1}">${values.map((value, colIndex) => xlsxCell(value, rowIndex, colIndex, sourceRows[rowIndex])).join("")}</row>`).join("")}
  </sheetData>
  <autoFilter ref="A1:J${rows.length}"/>
</worksheet>`;
}

function xlsxCell(value, rowIndex, colIndex, sourceRow) {
  const ref = `${xlsxColumnName(colIndex)}${rowIndex + 1}`;
  let style = rowIndex === 0 ? 1 : 0;
  if (sourceRow && colIndex === 1) style = sourceRow.section === "Node-Leaf" ? 2 : 3;
  if (sourceRow && colIndex === 2 && sourceRow.pod !== "-") style = 4 + ((sourceRow.podToneIndex || 0) % 6);
  if (sourceRow && colIndex === 3 && sourceRow.plane !== "-") style = 4 + (((sourceRow.planeIndex || 0) + 3) % 6);
  return `<c r="${ref}" t="inlineStr" s="${style}"><is><t>${escapeXml(value)}</t></is></c>`;
}

function xlsxColumnName(index) {
  let name = "";
  let value = index + 1;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}

function xlsxContentTypesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`;
}

function xlsxRootRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`;
}

function xlsxWorkbookXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Port Map" sheetId="1" r:id="rId1"/></sheets></workbook>`;
}

function xlsxWorkbookRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
}

function xlsxAppXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Leaf-Spine Planner</Application></Properties>`;
}

function xlsxCoreXml() {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Leaf-Spine Port Map</dc:title><dc:creator>임채성</dc:creator><cp:lastModifiedBy>임채성</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`;
}

function xlsxStylesXml() {
  const fills = ["FFFFFF", "DBEAFE", "EFF6FF", "ECFDF5", "FFF7ED", "F5F3FF", "FFF1F2", "ECFEFF"];
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="4"><font><sz val="10"/><name val="Arial"/></font><font><b/><sz val="10"/><color rgb="FF1D4ED8"/><name val="Arial"/></font><font><b/><sz val="10"/><color rgb="FF8A4B12"/><name val="Arial"/></font><font><b/><sz val="10"/><color rgb="FF0F172A"/><name val="Arial"/></font></fonts>
  <fills count="${fills.length + 2}"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>${fills.map((color) => `<fill><patternFill patternType="solid"><fgColor rgb="FF${color}"/><bgColor indexed="64"/></patternFill></fill>`).join("")}</fills>
  <borders count="1"><border><left style="thin"><color rgb="FFC8D8EE"/></left><right style="thin"><color rgb="FFC8D8EE"/></right><top style="thin"><color rgb="FFC8D8EE"/></top><bottom style="thin"><color rgb="FFC8D8EE"/></bottom></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="10"><xf numFmtId="49" fontId="0" fillId="2" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="49" fontId="1" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyNumberFormat="1"/><xf numFmtId="49" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyNumberFormat="1"/><xf numFmtId="49" fontId="2" fillId="2" borderId="0" xfId="0" applyFont="1" applyNumberFormat="1"/>${[2,3,4,5,6,7].map((fillId) => `<xf numFmtId="49" fontId="3" fillId="${fillId + 2}" borderId="0" xfId="0" applyFont="1" applyFill="1" applyNumberFormat="1"/>`).join("")}</cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;
}

function buildPortMapPptx(portMap, generatedAtText = formatDisplayTimestamp(new Date())) {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "임채성";
  pptx.company = "Leaf-Spine Planner";
  pptx.subject = "Leaf-Spine Port Map";
  pptx.title = "Leaf-Spine Port Map";
  pptx.lang = "ko-KR";

  const rows = getPortMapRows(portMap);
  const chunks = [];
  let cursor = 0;
  while (cursor < rows.length || chunks.length === 0) {
    const limit = chunks.length === 0 ? 10 : 16;
    chunks.push({ start: cursor, rows: rows.slice(cursor, cursor + limit) });
    cursor += limit;
  }

  chunks.forEach((chunk, slideIndex) => {
    const slide = pptx.addSlide();
    if (slideIndex === 0) {
      addPortMapPptHeader(slide, slideIndex + 1, chunks.length, generatedAtText);
      addPortMapPptSummary(slide, portMap);
    } else {
      addPortMapPptPageNumber(slide, slideIndex + 1, chunks.length);
    }
    addPortMapPptTable(slide, chunk.rows, chunk.start, slideIndex === 0 ? 1.55 : 0.35);
  });

  return pptx;
}

function addPortMapPptHeader(slide, pageNumber, pageCount, generatedAtText) {
  slide.addText("Leaf-Spine Port Map", {
    x: 0.35, y: 0.2, w: 2.6, h: 0.28,
    fontFace: "Arial", fontSize: 17, bold: true, color: "2563EB", margin: 0,
  });
  slide.addText(`${portMapTr("meta.credit")} ${generatedAtText}`, {
    x: 0.5, y: 0.5, w: 2.48, h: 0.16,
    fontFace: "Arial", fontSize: 7.5, bold: true, color: "5B6B86", align: "right", margin: 0,
  });
  addPortMapPptPageNumber(slide, pageNumber, pageCount, 0.32);
}

function addPortMapPptPageNumber(slide, pageNumber, pageCount, y = 0.12) {
  slide.addText(`Page ${pageNumber} / ${pageCount}`, {
    x: 11.4, y, w: 1.4, h: 0.2,
    fontFace: "Arial", fontSize: 8, bold: true, color: "5B6B86", align: "right", margin: 0,
  });
}

function addPortMapPptSummary(slide, portMap) {
  portMap.summary.forEach(([label, value], index) => {
    const x = 0.35 + index * 2.05;
    slide.addShape("roundRect", {
      x, y: 0.82, w: 1.85, h: 0.46,
      rectRadius: 0.04,
      fill: { color: "FFFFFF" },
      line: { color: "C8D8EE", width: 0.45 },
    });
    slide.addText(label, {
      x: x + 0.09, y: 0.9, w: 1.65, h: 0.1,
      fontFace: "Arial", fontSize: 6.3, bold: true, color: "5B6B86", margin: 0,
    });
    slide.addText(value, {
      x: x + 0.09, y: 1.05, w: 1.65, h: 0.14,
      fontFace: "Arial", fontSize: 9.3, bold: true, color: "0F172A", margin: 0,
    });
  });
}

function addPortMapPptTable(slide, rows, startIndex, y) {
  const tableRows = [
    portMapHeaders().map((header) => ({
      text: header,
      options: { bold: true, color: "1D4ED8" },
    })),
    ...rows.map((row, rowIndex) => portMapRowValues(row, startIndex + rowIndex).map((value, cellIndex) => {
      const isSection = cellIndex === 1;
      const isPod = cellIndex === 2 && row.pod !== "-";
      const isPlane = cellIndex === 3 && row.plane !== "-";
      const sectionColor = row.section === "Node-Leaf" ? "1D4ED8" : "8A4B12";
      const tone = isPod ? podTone(row.podToneIndex || 0) : (isPlane ? podTone(((row.planeIndex || 0) + 3) % 6) : null);
      return {
        text: String(value),
        options: {
          bold: isSection || isPod || isPlane,
          color: isSection ? sectionColor : ((isPod || isPlane) ? tone.ppt : "0F172A"),
        },
      };
    })),
  ];
  slide.addTable(tableRows, {
    x: 0.35,
    y,
    w: 12.15,
    colW: [0.5, 1.2, 0.75, 0.75, 1.65, 1.15, 1.85, 1.15, 0.95, 1.95],
    rowH: 0.36,
    fontFace: "Arial",
    fontSize: 9,
    color: "0F172A",
    margin: 0.04,
    border: { type: "solid", color: "C8D8EE", pt: 0.25 },
  });
}

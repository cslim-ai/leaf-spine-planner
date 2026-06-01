/*
 * Copyright ? 2026 Chaeseong Lim.
 * This software and its underlying algorithms may not be copied, modified, distributed, reverse engineered, or used to create derivative works without explicit written permission.
 */

// Legacy manual OOXML topology PPTX builder kept as a fallback/test helper.

function buildPptx(result) {
  const geometry = getDiagramGeometry(result);
  const slide = buildSlideXml(geometry);
  const files = {
    "[Content_Types].xml": contentTypesXml(),
    "_rels/.rels": rootRelsXml(),
    "docProps/app.xml": appPropsXml(),
    "docProps/core.xml": corePropsXml(),
    "ppt/presentation.xml": presentationXml(),
    "ppt/_rels/presentation.xml.rels": presentationRelsXml(),
    "ppt/slides/slide1.xml": slide,
    "ppt/slides/_rels/slide1.xml.rels": slideRelsXml(),
    "ppt/slideMasters/slideMaster1.xml": slideMasterXml(),
    "ppt/slideMasters/_rels/slideMaster1.xml.rels": slideMasterRelsXml(),
    "ppt/slideLayouts/slideLayout1.xml": slideLayoutXml(),
    "ppt/slideLayouts/_rels/slideLayout1.xml.rels": slideLayoutRelsXml(),
    "ppt/theme/theme1.xml": themeXml(),
    "ppt/viewProps.xml": viewPropsXml(),
    "ppt/tableStyles.xml": tableStylesXml(),
  };
  return new Blob([zipFiles(files)], {
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });
}

function buildSlideXml(geometry) {
  const slideW = 12192000;
  const slideH = 6858000;
  const margin = 274320;
  const scale = Math.min((slideW - margin * 2) / geometry.width, (slideH - margin * 2) / geometry.height);
  const offsetX = margin;
  const offsetY = margin;
  const toX = (value) => Math.round(offsetX + value * scale);
  const toY = (value) => Math.round(offsetY + value * scale);
  const toL = (value) => Math.round(value * scale);
  const shapes = [];
  let id = 2;

  geometry.labels.forEach((label) => {
    shapes.push(pptText(id++, toX(label.x), toY(label.y - 9), toL(74), toL(18), label.text, "5B6B86", 11, true));
  });
  geometry.lines.forEach((lineData) => {
    shapes.push(pptLine(id++, toX(lineData.x1), toY(lineData.y1), toX(lineData.x2), toY(lineData.y2), cleanColor(lineData.color), 12700));
  });
  geometry.switches.forEach((sw) => {
    const bodyColor = sw.kind === "spine" ? "B45309" : "2563EB";
    const lineColor = sw.kind === "spine" ? "92400E" : "1E40AF";
    shapes.push(pptRect(id++, toX(sw.x - sw.w / 2), toY(sw.y - sw.h / 2), toL(sw.w), toL(sw.h), bodyColor, lineColor, "roundRect"));
    shapes.push(pptRect(id++, toX(sw.x - sw.w / 2 + 6), toY(sw.y - sw.h / 2 + 5), toL(sw.w - 12), toL(sw.h - 10), "FFFFFF", "FFFFFF", "roundRect", 18000));
    for (let i = 0; i < 10; i += 1) {
      shapes.push(pptRect(id++, toX(sw.x - sw.w / 2 + 14 + i * 7), toY(sw.y - 4), toL(4), toL(5), "E5E7EB", "111827", "rect"));
    }
    shapes.push(pptEllipse(id++, toX(sw.x + sw.w / 2 - 16.4), toY(sw.y - 4.4), toL(4.8), toL(4.8), "86EFAC", "166534"));
    id = pushPptLabelBadge(shapes, id, sw.x, sw.y + sw.h / 2 + 14, sw.label, toX, toY, toL);
  });
  geometry.servers.forEach((server) => {
    shapes.push(pptRect(id++, toX(server.x - server.w / 2), toY(server.y - server.h / 2), toL(server.w), toL(server.h), "475569", "334155", "roundRect"));
    shapes.push(pptRect(id++, toX(server.x - server.w / 2 + 6), toY(server.y - server.h / 2 + 16), toL(server.w - 12), toL(server.h - 24), "64748B", "334155", "roundRect"));
    shapes.push(pptEllipse(id++, toX(server.x + server.w / 2 - 14.5), toY(server.y + server.h / 2 - 12.5), toL(5), toL(5), "86EFAC", "166534"));
    server.ports.forEach((port) => {
      shapes.push(pptRect(id++, toX(port.x - 3), toY(port.y), toL(6), toL(8), cleanColor(port.color), "1F2937", "rect"));
    });
    id = pushPptLabelBadge(shapes, id, server.x, server.y + server.h / 2 + 14, server.label, toX, toY, toL);
  });

  (geometry.ellipsis || []).forEach((item) => {
    shapes.push(pptRect(id++, toX(item.x - item.w / 2), toY(item.y - item.h / 2), toL(item.w), toL(item.h), "EEF2F7", "94A3B8", "roundRect"));
    shapes.push(pptText(id++, toX(item.x - item.w / 2), toY(item.y - item.h / 2 + 1), toL(item.w), toL(item.h / 2), "...", "334155", 11, true));
    id = pushPptLabelBadge(shapes, id, item.x, item.y + item.h / 2 + 14, item.label, toX, toY, toL, 7);
  });

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
    ${shapes.join("\n")}
  </p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
}

function pptRect(id, x, y, w, h, fill, stroke, preset = "rect", transparency = 0) {
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="Shape ${id}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${w}" cy="${h}"/></a:xfrm><a:prstGeom prst="${preset}"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${fill}">${transparency ? `<a:alpha val="${100000 - transparency}"/>` : ""}</a:srgbClr></a:solidFill><a:ln w="9525"><a:solidFill><a:srgbClr val="${stroke}"/></a:solidFill></a:ln></p:spPr></p:sp>`;
}

function pushPptLabelBadge(shapes, id, x, y, text, toX, toY, toL, fontSize = 7.5) {
  const { width, height } = pptLabelBadgeSize(text);
  const padding = 36000;
  const boxW = toL(width) + padding * 2;
  const boxH = toL(height) + padding * 2;
  shapes.push(pptTextBox(id++, toX(x) - Math.round(boxW / 2), toY(y) - Math.round(boxH / 2), boxW, boxH, text, "0F172A", fontSize, "FFFFFF", "111827", "ctr", padding));
  return id;
}

function pptEllipse(id, x, y, w, h, fill, stroke) {
  return pptRect(id, x, y, w, h, fill, stroke, "ellipse");
}

function pptLine(id, x1, y1, x2, y2, color, width) {
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const cx = Math.abs(x2 - x1);
  const cy = Math.abs(y2 - y1);
  const flipH = x2 < x1 ? ' flipH="1"' : "";
  const flipV = y2 < y1 ? ' flipV="1"' : "";
  return `<p:cxnSp><p:nvCxnSpPr><p:cNvPr id="${id}" name="Line ${id}"/><p:cNvCxnSpPr/><p:nvPr/></p:nvCxnSpPr><p:spPr><a:xfrm${flipH}${flipV}><a:off x="${x}" y="${y}"/><a:ext cx="${Math.max(cx, 1)}" cy="${Math.max(cy, 1)}"/></a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:ln w="${width}"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill></a:ln></p:spPr></p:cxnSp>`;
}

function pptText(id, x, y, w, h, text, color, size, bold = false, align = "ctr") {
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="Text ${id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${w}" cy="${h}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr wrap="none"/><a:lstStyle/><a:p><a:pPr algn="${align}"/><a:r><a:rPr lang="ko-KR" sz="${size * 100}"${bold ? ' b="1"' : ""}><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="Arial"/><a:ea typeface="Arial"/></a:rPr><a:t>${escapeXml(text)}</a:t></a:r><a:endParaRPr lang="ko-KR"/></a:p></p:txBody></p:sp>`;
}

function pptTextBox(id, x, y, w, h, text, color, size, fill, stroke, align = "ctr", inset = 0) {
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="Label ${id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${w}" cy="${h}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${fill}"/></a:solidFill><a:ln w="9525"><a:solidFill><a:srgbClr val="${stroke}"/></a:solidFill></a:ln></p:spPr><p:txBody><a:bodyPr wrap="none" lIns="${inset}" tIns="${inset}" rIns="${inset}" bIns="${inset}" anchor="ctr"><a:spAutoFit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="${align}"/><a:r><a:rPr lang="ko-KR" sz="${size * 100}"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="Arial"/><a:ea typeface="Arial"/></a:rPr><a:t>${escapeXml(text)}</a:t></a:r><a:endParaRPr lang="ko-KR"/></a:p></p:txBody></p:sp>`;
}

function contentTypesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/><Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/></Types>`;
}

function rootRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`;
}

function presentationXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId2"/></p:sldMasterIdLst><p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="wide"/><p:notesSz cx="6858000" cy="9144000"/><p:defaultTextStyle><a:defPPr><a:defRPr lang="en-US"/></a:defPPr></p:defaultTextStyle></p:presentation>`;
}

function presentationRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps" Target="viewProps.xml"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles" Target="tableStyles.xml"/></Relationships>`;
}

function slideRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/></Relationships>`;
}

function slideMasterXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>`;
}

function slideMasterRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>`;
}

function slideLayoutXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`;
}

function slideLayoutRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`;
}

function themeXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Leaf-Spine Theme"><a:themeElements><a:clrScheme name="Leaf-Spine"><a:dk1><a:srgbClr val="0F172A"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="334155"/></a:dk2><a:lt2><a:srgbClr val="EEF5FF"/></a:lt2><a:accent1><a:srgbClr val="2563EB"/></a:accent1><a:accent2><a:srgbClr val="B45309"/></a:accent2><a:accent3><a:srgbClr val="475569"/></a:accent3><a:accent4><a:srgbClr val="16A34A"/></a:accent4><a:accent5><a:srgbClr val="7C3AED"/></a:accent5><a:accent6><a:srgbClr val="0891B2"/></a:accent6><a:hlink><a:srgbClr val="2563EB"/></a:hlink><a:folHlink><a:srgbClr val="7C3AED"/></a:folHlink></a:clrScheme><a:fontScheme name="Leaf-Spine"><a:majorFont><a:latin typeface="Arial"/><a:ea typeface="Arial"/><a:cs typeface="Arial"/></a:majorFont><a:minorFont><a:latin typeface="Arial"/><a:ea typeface="Arial"/><a:cs typeface="Arial"/></a:minorFont></a:fontScheme><a:fmtScheme name="Leaf-Spine"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"/></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"/></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>`;
}

function viewPropsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:viewPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:normalViewPr><p:restoredLeft sz="15620"/><p:restoredTop sz="94660"/></p:normalViewPr><p:slideViewPr><p:cSldViewPr><p:cViewPr varScale="1"><p:scale><a:sx n="100" d="100"/><a:sy n="100" d="100"/></p:scale><p:origin x="0" y="0"/></p:cViewPr><p:guideLst/></p:cSldViewPr></p:slideViewPr><p:notesTextViewPr><p:cViewPr><p:scale><a:sx n="100" d="100"/><a:sy n="100" d="100"/></p:scale><p:origin x="0" y="0"/></p:cViewPr></p:notesTextViewPr><p:gridSpacing cx="72008" cy="72008"/></p:viewPr>`;
}

function tableStylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>`;
}

function appPropsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Leaf-Spine Planner</Application><PresentationFormat>Widescreen</PresentationFormat><Slides>1</Slides></Properties>`;
}

function corePropsXml() {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Leaf-Spine Topology</dc:title><dc:creator>임채성</dc:creator><cp:lastModifiedBy>임채성</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`;
}

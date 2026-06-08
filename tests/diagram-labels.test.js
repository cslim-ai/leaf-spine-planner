/*
 * Copyright (c) 2026 Chaeseong Lim.
 * This software and its underlying algorithms may not be copied, modified, distributed, reverse engineered, or used to create derivative works without explicit written permission.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function assertIncludes(values, expected, message) {
  if (!values.includes(expected)) {
    throw new Error(`${message}: expected ${expected} in ${JSON.stringify(values)}`);
  }
}

function assertNoOverlaps(items, message) {
  const overlaps = [];
  for (let outerIndex = 0; outerIndex < items.length; outerIndex += 1) {
    for (let innerIndex = outerIndex + 1; innerIndex < items.length; innerIndex += 1) {
      const outer = items[outerIndex];
      const inner = items[innerIndex];
      const xOverlap = Math.abs(outer.x - inner.x) < ((outer.w || 0) + (inner.w || 0)) / 2 + 6;
      const yOverlap = Math.abs(outer.y - inner.y) < ((outer.h || 0) + (inner.h || 0)) / 2 + 6;
      if (xOverlap && yOverlap) overlaps.push(`${outer.label} / ${inner.label}`);
    }
  }
  if (overlaps.length) {
    throw new Error(`${message}: ${overlaps.slice(0, 5).join(", ")}`);
  }
}

const source = fs.readFileSync(path.join(__dirname, "../assets/js/diagram-geometry.js"), "utf8");
const context = {
  console,
  DIAGRAM_LABEL_GUTTER: 0,
  DIAGRAM_CONTENT_OFFSET: 96,
  DEFAULT_DIAGRAM_VIEW_WIDTH: 920,
  DEFAULT_DIAGRAM_VIEW_HEIGHT: 500,
  NIC_COLORS: ["#1"],
  LEAF_COLORS: ["#2"],
  activeServerNicPorts: (input) => input.serverNicPorts,
  linksForSpine: (totalLinks, spineCount, spineIndex) => Math.floor(totalLinks / spineCount) + (spineIndex < totalLinks % spineCount ? 1 : 0),
  trim: (value) => String(Number.parseFloat(value.toFixed(2))),
  escapeXml: (value) => String(value),
};
vm.createContext(context);
vm.runInContext(source, context);

const baseInput = {
  serverCount: 16,
  serverNicPorts: 2,
  useMultiPods: true,
  useMultiPlanar: false,
  podServerCount: 8,
};
const baseBest = {
  spines: 4,
  leafCount: 4,
  uplinksPerLeaf: 2,
  podCount: 2,
  multiPodCount: 2,
  podServerCount: 8,
  perPodLeafs: 2,
  perPodSpines: 2,
  planeCount: 1,
};

{
  const geometry = context.getDiagramGeometry({ input: baseInput, best: baseBest });
  const switchLabels = geometry.switches.map((item) => item.label);
  const serverLabels = geometry.servers.map((item) => item.label);
  const lineSources = geometry.lines.map((item) => item.source);

  assertIncludes(switchLabels, "Pod 1 - Spine 1", "pod spine labels should separate pod and device with a hyphen");
  assertIncludes(switchLabels, "Pod 1 - Leaf 1", "pod leaf labels should separate pod and device with a hyphen");
  assertIncludes(serverLabels, "Pod 1 - Node 1", "pod node labels should include pod context");
  assertIncludes(serverLabels, "Pod 2 - Node 1", "pod node labels should use local node numbering per pod");
  assertIncludes(lineSources, "Pod 1 - Node 1", "node link source labels should match node badges");
}

{
  const input = { ...baseInput, serverCount: 128, serverNicPorts: 8, useMultiPods: false, useMultiPlanar: false, podServerCount: 128 };
  const best = { ...baseBest, spines: 16, leafCount: 32, podCount: 1, multiPodCount: 1, podServerCount: 128, perPodLeafs: 32, perPodSpines: 16 };
  const geometry = context.getDiagramGeometry({ input, best });
  const spine = geometry.switches.find((item) => item.kind === "spine");
  const leaf = geometry.switches.find((item) => item.kind === "leaf");
  const node = geometry.servers[0];
  const expectedGrowth = Math.max(0, geometry.width - 920) * 0.25;
  const expectedRowSpan = 302 + expectedGrowth;
  assertEqual(Math.round(node.y - spine.y), Math.round(expectedRowSpan), "full diagram row span should grow by 20% of width growth");
  assertEqual(leaf.y > 190, true, "full diagram Leaf row should move down when width grows");
  assertEqual(node.y > 360, true, "full diagram Node row should move down when width grows");
}

{
  const input = { ...baseInput, useMultiPods: false, podServerCount: 16 };
  const best = { ...baseBest, podCount: 1, multiPodCount: 1, podServerCount: 16, perPodLeafs: 4, perPodSpines: 4 };
  const geometry = context.getDiagramGeometry({ input, best });
  assertEqual(geometry.servers[0].label, "Node 1", "single pod node labels should omit #");
}

{
  const input = { ...baseInput, useMultiPlanar: true };
  const best = { ...baseBest, podCount: 4, multiPodCount: 2, planeCount: 2, perPodLeafs: 1, perPodSpines: 1 };
  const geometry = context.getDiagramGeometry({ input, best });
  const switchLabels = geometry.switches.map((item) => item.label);
  const serverLabels = geometry.servers.map((item) => item.label);

  assertIncludes(switchLabels, "Pod 1 - Plane 1\nSpine 1", "multi-planar spine labels should put pod before plane and device on the next line");
  assertIncludes(switchLabels, "Pod 1 - Plane 1\nLeaf 1", "multi-planar leaf labels should put pod before plane and device on the next line");
  assertIncludes(serverLabels, "Pod 1 - Node 1", "multi-planar node labels should use physical pod context without plane context");
}

{
  const input = { ...baseInput, useMultiPods: false, useMultiPlanar: true, podServerCount: 16 };
  const best = { ...baseBest, podCount: 2, multiPodCount: 1, planeCount: 2, podServerCount: 16, perPodLeafs: 2, perPodSpines: 2 };
  const geometry = context.getDiagramGeometry({ input, best });
  const switchLabels = geometry.switches.map((item) => item.label);
  const serverLabels = geometry.servers.map((item) => item.label);

  assertIncludes(switchLabels, "Plane 1 - Spine 1", "multi-planar only spine labels should stay on one line");
  assertIncludes(switchLabels, "Plane 1 - Leaf 1", "multi-planar only leaf labels should stay on one line");
  assertIncludes(serverLabels, "Node 1", "multi-planar only node labels should omit plane context");
}

{
  const input = { ...baseInput, serverCount: 256, useMultiPods: true, useMultiPlanar: true, podServerCount: 64 };
  const best = { ...baseBest, spines: 8, leafCount: 8, podCount: 8, multiPodCount: 4, planeCount: 2, podServerCount: 64, perPodLeafs: 1, perPodSpines: 1 };
  const geometry = context.getSummaryDiagramGeometry({ input, best });
  const switchLabels = geometry.switches.map((item) => item.label);
  const serverLabels = geometry.servers.map((item) => item.label);
  const ellipsisLabels = geometry.ellipsis.map((item) => item.label);

  assertIncludes(switchLabels, "Pod 1 - Plane 1\nSpine 1", "summary should keep plane 1 of the first physical pod");
  assertIncludes(switchLabels, "Pod 1 - Plane 2\nSpine 1", "summary should keep plane 2 of the first physical pod");
  assertIncludes(switchLabels, "Pod 4 - Plane 1\nLeaf 1", "summary should keep plane 1 of the last physical pod");
  assertIncludes(switchLabels, "Pod 4 - Plane 2\nLeaf 1", "summary should keep plane 2 of the last physical pod");
  assertIncludes(serverLabels, "Pod 1 - Node 1", "summary node labels should use the physical pod instead of one plane");
  assertIncludes(serverLabels, "Pod 4 - Node 1", "summary node labels should keep the last physical pod");
  assertIncludes(ellipsisLabels, "2 Pods\nhidden", "summary hidden pod blocks should describe physical pods");
  assertIncludes(ellipsisLabels, "Pod 1 - 58 Node\nhidden", "summary hidden node labels should use physical pod context");
  assertEqual(ellipsisLabels.some((label) => label.includes("Node\nhidden") && label.includes("Plane")), false, "summary hidden node labels should not attach nodes to one plane");

  const pod1Spine = geometry.switches.find((item) => item.label === "Pod 1 - Plane 1\nSpine 1");
  const pod4Spine = geometry.switches.find((item) => item.label === "Pod 4 - Plane 1\nSpine 1");
  const hiddenPods = geometry.ellipsis.find((item) => item.label === "2 Pods\nhidden");
  assertEqual(Boolean(pod1Spine && pod4Spine && hiddenPods), true, "summary should render first pod, hidden pods, and last pod");
  assertEqual(Math.round(pod1Spine.y), Math.round(pod4Spine.y), "summary should place first and last pod spine rows on the same horizontal band");
  assertEqual(hiddenPods.x > pod1Spine.x && hiddenPods.x < pod4Spine.x, true, "summary hidden pod badge should be between the visible pod blocks");
}

{
  const input = { ...baseInput, serverCount: 8, useMultiPods: true, useMultiPlanar: true, podServerCount: 4 };
  const best = { ...baseBest, spines: 4, leafCount: 4, podCount: 4, multiPodCount: 2, planeCount: 2, podServerCount: 4, perPodLeafs: 1, perPodSpines: 1 };
  const geometry = context.getSummaryDiagramGeometry({ input, best });
  const ellipsisLabels = geometry.ellipsis.map((item) => item.label);
  assertEqual(ellipsisLabels.some((label) => label.includes("Spine\nhidden") || label.includes("Leaf\nhidden")), false, "summary should not hide plane devices when each plane has two or fewer devices");
}

{
  const input = { ...baseInput, serverCount: 8, useMultiPods: true, useMultiPlanar: true, podServerCount: 4 };
  const best = { ...baseBest, spines: 4, leafCount: 4, uplinksPerLeaf: 5, podCount: 4, multiPodCount: 2, planeCount: 2, podServerCount: 4, perPodLeafs: 1, perPodSpines: 1 };
  const geometry = context.getSummaryDiagramGeometry({ input, best });
  const visibleLeafSpineLinks = geometry.lines.filter((item) => (
    item.kind === "uplink" && item.sourceKey === "leaf-0" && item.targetKey === "spine-0"
  ));
  assertEqual(visibleLeafSpineLinks.length, 5, "summary should render the actual visible Leaf-Spine link count without capping it");
}

{
  const input = { ...baseInput, serverCount: 256, serverNicPorts: 8, useMultiPods: true, useMultiPlanar: true, podServerCount: 64 };
  const best = { ...baseBest, spines: 40, leafCount: 40, uplinksPerLeaf: 8, podCount: 8, multiPodCount: 4, planeCount: 2, podServerCount: 64, perPodLeafs: 5, perPodSpines: 5 };
  const geometry = context.getSummaryDiagramGeometry({ input, best });
  const hiddenSpine = geometry.ellipsis.find((item) => item.label === "Pod 1 - Plane 1 - 3 Spine\nhidden");
  const hiddenLeaf = geometry.ellipsis.find((item) => item.label === "Pod 1 - Plane 1 - 3 Leaf\nhidden");
  assertEqual(Boolean(hiddenSpine && hiddenLeaf), true, "summary should render hidden Leaf and Spine badges for larger planes");
  assertEqual(geometry.lines.some((line) => (
    line.kind === "uplink" &&
    Math.abs(line.x2 - hiddenSpine.x) <= hiddenSpine.w / 2 &&
    Math.abs(line.y2 - (hiddenSpine.y + hiddenSpine.h / 2)) < 1
  )), true, "summary should draw uplinks into hidden Spine badges");
  assertEqual(geometry.lines.some((line) => (
    line.kind === "uplink" &&
    Math.abs(line.x1 - hiddenLeaf.x) <= hiddenLeaf.w / 2 &&
    Math.abs(line.y1 - (hiddenLeaf.y - hiddenLeaf.h / 2)) < 1
  )), true, "summary should draw uplinks out of hidden Leaf badges");
  const pod1Plane2Leaf = geometry.switches.find((item) => item.label === "Pod 1 - Plane 2\nLeaf 5");
  const pod4Plane1Leaf = geometry.switches.find((item) => item.label === "Pod 4 - Plane 1\nLeaf 1");
  const hiddenPodsOnLeafRow = geometry.ellipsis.find((item) => item.label === "2 Pods\nhidden" && Math.abs(item.y - pod4Plane1Leaf.y) < 20);
  assertEqual(hiddenPodsOnLeafRow.x - pod1Plane2Leaf.x < 230, true, "summary should not leave an excessive gap before hidden pod badges");
  assertEqual(pod4Plane1Leaf.x - hiddenPodsOnLeafRow.x < 230, true, "summary should not leave an excessive gap after hidden pod badges");
}

{
  const input = { ...baseInput, serverCount: 256, serverNicPorts: 8, useMultiPods: true, useMultiPlanar: true, podServerCount: 64 };
  const best = { ...baseBest, spines: 40, leafCount: 40, podCount: 8, multiPodCount: 4, planeCount: 2, podServerCount: 64, perPodLeafs: 5, perPodSpines: 5 };
  const geometry = context.getSummaryDiagramGeometry({ input, best });
  const items = [
    ...geometry.switches.map((item) => ({ ...item, w: item.w || 104, h: item.h || 24 })),
    ...geometry.servers.map((item) => ({ ...item, w: item.w || 100, h: item.h || 62 })),
    ...geometry.ellipsis.map((item) => ({ ...item, w: item.w || 92, h: item.h || 42 })),
  ];
  assertNoOverlaps(items, "multi-planar multi-pod summary should not overlap visible devices and hidden badges");
}

{
  const input = { ...baseInput, serverCount: 32, useMultiPods: false, useMultiPlanar: false, podServerCount: 32 };
  const best = { ...baseBest, spines: 20, leafCount: 20, podCount: 1, multiPodCount: 1, podServerCount: 32, perPodLeafs: 20, perPodSpines: 20 };
  const geometry = context.getSummaryDiagramGeometry({ input, best });
  const ellipsisLabels = geometry.ellipsis.map((item) => item.label);
  assertEqual(ellipsisLabels.some((label) => label.includes("Group")), false, "single fabric summary labels should not mention groups");
  assertEqual(ellipsisLabels.every((label) => label.endsWith("\nhidden")), true, "summary hidden badges should put hidden on a separate line");
}

{
  const input = { ...baseInput, serverCount: 256, serverNicPorts: 4, useMultiPods: true, useMultiPlanar: false, podServerCount: 64 };
  const best = { ...baseBest, spines: 20, leafCount: 20, uplinksPerLeaf: 4, podCount: 4, multiPodCount: 4, planeCount: 1, podServerCount: 64, perPodLeafs: 5, perPodSpines: 5 };
  const geometry = context.getSummaryDiagramGeometry({ input, best });
  const leaf1 = geometry.switches.find((item) => item.label === "Pod 1 - Leaf 5");
  const leaf4 = geometry.switches.find((item) => item.label === "Pod 4 - Leaf 1");
  const hiddenPods = geometry.ellipsis.find((item) => item.label === "2 Pods\nhidden" && Math.abs(item.y - leaf1.y) < 20);
  assertEqual(Boolean(leaf1 && leaf4 && hiddenPods), true, "multi-pod summary should render visible pods and hidden pod badge on the Leaf row");
  const leftGap = hiddenPods.x - leaf1.x;
  const rightGap = leaf4.x - hiddenPods.x;
  assertEqual(leftGap > 125, true, "multi-pod summary should keep a wider gap before hidden pod badges");
  assertEqual(rightGap > 125, true, "multi-pod summary should keep a wider gap after hidden pod badges");
  const hiddenPodsOnLeafRow = hiddenPods;
  const hiddenPodsOnSpineRow = geometry.ellipsis.find((item) => item.label === "2 Pods\nhidden" && item.y < hiddenPodsOnLeafRow.y);
  assertEqual(Boolean(hiddenPodsOnSpineRow), true, "multi-pod summary should render hidden pod badges on the Spine and Leaf rows");
  assertEqual(geometry.lines.some((line) => (
    line.kind === "uplink" &&
    Math.abs(line.x1 - hiddenPodsOnLeafRow.x) <= hiddenPodsOnLeafRow.w / 2 &&
    Math.abs(line.x2 - hiddenPodsOnSpineRow.x) <= hiddenPodsOnSpineRow.w / 2
  )), false, "multi-pod summary should not draw Leaf-Spine links between hidden pod badges");
}

{
  const input = { ...baseInput, serverCount: 32, serverNicPorts: 4, useMultiPods: false, useMultiPlanar: true, podServerCount: 32 };
  const best = { ...baseBest, spines: 10, leafCount: 10, uplinksPerLeaf: 4, podCount: 2, multiPodCount: 1, planeCount: 2, podServerCount: 32, perPodLeafs: 5, perPodSpines: 5 };
  const geometry = context.getSummaryDiagramGeometry({ input, best });
  const plane1Leaf = geometry.switches.find((item) => item.label === "Plane 1 - Leaf 5");
  const plane2Leaf = geometry.switches.find((item) => item.label === "Plane 2 - Leaf 1");
  assertEqual(Boolean(plane1Leaf && plane2Leaf), true, "multi-planar summary should render both planes on the Leaf row");
  assertEqual(plane2Leaf.x - plane1Leaf.x > 125, true, "multi-planar summary should keep a wider gap between visible planes");
}

{
  const input = { ...baseInput, serverCount: 64, serverNicPorts: 4, useMultiPods: false, useMultiPlanar: true, podServerCount: 64 };
  const best = { ...baseBest, spines: 20, leafCount: 20, uplinksPerLeaf: 8, podCount: 2, multiPodCount: 1, planeCount: 2, podServerCount: 64, perPodLeafs: 10, perPodSpines: 10 };
  const geometry = context.getSummaryDiagramGeometry({ input, best });
  const hiddenSpine = geometry.ellipsis.find((item) => item.label === "Plane 1 - 6 Spine\nhidden");
  const hiddenLeaf = geometry.ellipsis.find((item) => item.label === "Plane 1 - 6 Leaf\nhidden");
  assertEqual(Boolean(hiddenSpine && hiddenLeaf), true, "multi-planar summary should render hidden Leaf and Spine badges");
  assertEqual(geometry.lines.some((line) => (
    line.kind === "uplink" &&
    Math.abs(line.x2 - hiddenSpine.x) <= hiddenSpine.w / 2 &&
    Math.abs(line.y2 - (hiddenSpine.y + hiddenSpine.h / 2)) < 1
  )), true, "multi-planar summary should draw uplinks into hidden Spine badges");
  assertEqual(geometry.lines.some((line) => (
    line.kind === "uplink" &&
    Math.abs(line.x1 - hiddenLeaf.x) <= hiddenLeaf.w / 2 &&
    Math.abs(line.y1 - (hiddenLeaf.y - hiddenLeaf.h / 2)) < 1
  )), true, "multi-planar summary should draw uplinks out of hidden Leaf badges");
}

console.log("diagram label tests passed");

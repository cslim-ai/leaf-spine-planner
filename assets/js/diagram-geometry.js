/*
 * Copyright ? 2026 Chaeseong Lim.
 * This software and its underlying algorithms may not be copied, modified, distributed, reverse engineered, or used to create derivative works without explicit written permission.
 */

// Diagram geometry and shared SVG node helpers.

function diagramGeometryForView(result, viewMode) {
  if (viewMode === "wrapped") return getPptDiagramGeometry(result);
  if (viewMode === "summary") return getSummaryDiagramGeometry(result);
  return getDiagramGeometry(result);
}

function getDiagramGeometry({ input, best }) {
  const shownSpines = best.spines;
  const shownLeafs = best.leafCount;
  const shownServers = input.serverCount;
  const labelGutter = DIAGRAM_LABEL_GUTTER;
  const switchW = 116;
  const switchH = 24;
  const serverW = serverNodeWidth(input.serverNicPorts);
  const activeNicPorts = activeServerNicPorts(input);
  const serverH = 62;
  const serverSlotWidth = Math.max(86, serverW + 14);
  const leafSlotWidth = Math.max(120, switchW + 12);
  const spineGap = 151.2;
  const spineRowWidth = shownSpines > 0 ? (shownSpines - 1) * spineGap + switchW : 0;
  const serverSlots = Math.max(shownServers, shownLeafs);
  const width = Math.max(920, labelGutter + Math.max(serverSlots * Math.max(serverSlotWidth, leafSlotWidth), spineRowWidth) + 150);
  const height = 500;
  const contentLeft = labelGutter + DIAGRAM_CONTENT_OFFSET;
  const contentRight = width - 48;
  const center = (contentLeft + contentRight) / 2;
  const spineY = 58;
  const leafY = 190;
  const serverY = 360;
  const spineXs = distribute(center, shownSpines, spineGap);
  const leafXs = distribute(center, shownLeafs, Math.max(120, Math.min(160, width / Math.max(shownLeafs, 1) * 0.8)));
  const serverXs = distribute(center, shownServers, Math.max(serverSlotWidth, Math.min(104, width / Math.max(shownServers, 1) * 0.8)));
  const podCount = best.podCount || 1;
  const perPodLeafs = best.perPodLeafs || shownLeafs;
  const perPodSpines = best.perPodSpines || shownSpines;
  const lines = [];
  const switches = [];
  const servers = [];

  spineXs.forEach((x, index) => {
    const label = fabricDeviceLabel("Spine", index, perPodSpines, input, best);
    switches.push({ kind: "spine", x, y: spineY, w: switchW, h: switchH, label, device: label, deviceKey: `spine-${index}` });
  });

  leafXs.forEach((leafX, leafIndex) => {
    const podIndex = Math.floor(leafIndex / perPodLeafs);
    const spineStart = podIndex * perPodSpines;
    const spineEnd = Math.min(spineStart + perPodSpines, spineXs.length);
    spineXs.slice(spineStart, spineEnd).forEach((spineX, localSpineIndex) => {
      const linkCount = linksForSpine(best.uplinksPerLeaf, perPodSpines, localSpineIndex);
      for (let linkIndex = 0; linkIndex < linkCount; linkIndex += 1) {
        const offset = parallelOffset(linkIndex, linkCount, switchW - 28);
        lines.push({
          x1: leafX + offset,
          y1: leafY - switchH / 2,
          x2: spineX + offset,
          y2: spineY + switchH / 2,
          color: leafColor(leafIndex),
          kind: "uplink",
          title: `Leaf ${leafIndex + 1} uplink`,
          source: fabricDeviceLabel("Leaf", leafIndex, perPodLeafs, input, best),
          target: fabricDeviceLabel("Spine", spineStart + localSpineIndex, perPodSpines, input, best),
          sourceKey: `leaf-${leafIndex}`,
          targetKey: `spine-${spineStart + localSpineIndex}`,
        });
      }
    });
    const label = fabricDeviceLabel("Leaf", leafIndex, perPodLeafs, input, best);
    switches.push({ kind: "leaf", x: leafX, y: leafY, w: switchW, h: switchH, label, device: label, deviceKey: `leaf-${leafIndex}` });
  });

  serverXs.forEach((serverX, serverIndex) => {
    const nicLeafStart = (serverIndex * activeNicPorts) % best.leafCount;
    const ports = [];
    for (let nicIndex = 0; nicIndex < activeNicPorts; nicIndex += 1) {
      const nicX = nicPortX(serverX, serverW, input.serverNicPorts, nicIndex);
      const color = nicColor(nicIndex);
      ports.push({ x: nicX, y: serverY - serverH / 2 + 7, color });
      serverFabricGroupIndexes(serverIndex, input, best).forEach((groupIndex) => {
        const localServerIndex = serverLocalIndex(serverIndex, input, best);
        const leafIndex = podCount > 1
          ? groupIndex * perPodLeafs + ((localServerIndex * activeNicPorts + nicIndex) % perPodLeafs)
          : (nicLeafStart + nicIndex) % shownLeafs;
        lines.push({
          x1: nicX,
          y1: serverY - serverH / 2,
          x2: leafXs[leafIndex],
          y2: leafY + switchH / 2,
          color,
          kind: "link",
          title: podCount > 1 ? `Node NIC ${nicIndex + 1} ${diagramFabricGroupLabel(groupIndex, input, best)}` : `Node NIC ${nicIndex + 1}`,
          source: nodeDeviceLabel(serverIndex, input, best),
          target: fabricDeviceLabel("Leaf", leafIndex, perPodLeafs, input, best),
          sourceKey: `node-${serverIndex}`,
          targetKey: `leaf-${leafIndex}`,
        });
      });
    }
    const label = nodeDeviceLabel(serverIndex, input, best);
    servers.push({ x: serverX, y: serverY, w: serverW, h: serverH, number: serverIndex + 1, nicCount: input.serverNicPorts, label, device: label, deviceKey: `node-${serverIndex}`, ports });
  });

  return normalizeGeometryHorizontal({
    width,
    height,
    labels: [],
    lines,
    switches,
    servers,
    labelGutter,
  });
}

function getPptDiagramGeometry({ input, best }) {
  const shownSpines = best.spines;
  const shownLeafs = best.leafCount;
  const shownServers = input.serverCount;
  const switchW = 116;
  const switchH = 24;
  const serverW = serverNodeWidth(input.serverNicPorts);
  const activeNicPorts = activeServerNicPorts(input);
  const serverH = 62;
  const serverGap = Math.max(88, serverW + 18);
  const spinePerRow = 8;
  const leafPerRow = 12;
  const serverPerRow = Math.max(1, Math.min(16, Math.floor(1120 / serverGap)));
  const spineRows = Math.ceil(shownSpines / spinePerRow);
  const leafRows = Math.ceil(shownLeafs / leafPerRow);
  const serverRows = Math.ceil(shownServers / serverPerRow);
  const labelGutter = DIAGRAM_LABEL_GUTTER;
  const maxRowWidth = Math.max(
    Math.min(shownSpines, spinePerRow) * 126,
    Math.min(shownLeafs, leafPerRow) * 122,
    Math.min(shownServers, serverPerRow) * serverGap,
  );
  const width = Math.max(920, labelGutter + maxRowWidth + 150);
  const contentLeft = labelGutter + DIAGRAM_CONTENT_OFFSET;
  const contentRight = width - 48;
  const center = (contentLeft + contentRight) / 2;
  const spineStartY = 58;
  const spineRowGap = 72;
  const leafStartY = spineStartY + (spineRows - 1) * spineRowGap + 132;
  const leafRowGap = 88;
  const serverStartY = leafStartY + (leafRows - 1) * leafRowGap + 170;
  const serverRowGap = 105;
  const height = serverStartY + (serverRows - 1) * serverRowGap + serverH / 2 + 52;
  const lines = [];
  const switches = [];
  const servers = [];
  const podCount = best.podCount || 1;
  const perPodLeafs = best.perPodLeafs || shownLeafs;
  const perPodSpines = best.perPodSpines || shownSpines;
  const podServerCount = best.podServerCount || shownServers;
  const labels = [];

  const spinePositions = makePptRowPositions(shownSpines, spinePerRow, center, spineStartY, spineRowGap, 126);
  const leafPositions = makePptRowPositions(shownLeafs, leafPerRow, center, leafStartY, leafRowGap, 122);
  const serverPositions = makePptRowPositions(shownServers, serverPerRow, center, serverStartY, serverRowGap, serverGap);

  spinePositions.forEach((position, index) => {
    const label = fabricDeviceLabel("Spine", index, perPodSpines, input, best);
    switches.push({ kind: "spine", x: position.x, y: position.y, w: switchW, h: switchH, label, device: label, deviceKey: `spine-${index}` });
  });

  leafPositions.forEach((leafPosition, leafIndex) => {
    const podIndex = Math.floor(leafIndex / perPodLeafs);
    const spineStart = podIndex * perPodSpines;
    const spineEnd = Math.min(spineStart + perPodSpines, spinePositions.length);
    spinePositions.slice(spineStart, spineEnd).forEach((spinePosition, localSpineIndex) => {
      const linkCount = linksForSpine(best.uplinksPerLeaf, perPodSpines, localSpineIndex);
      for (let linkIndex = 0; linkIndex < linkCount; linkIndex += 1) {
        const offset = parallelOffset(linkIndex, linkCount, switchW - 28);
        lines.push({
          x1: leafPosition.x + offset,
          y1: leafPosition.y - switchH / 2,
          x2: spinePosition.x + offset,
          y2: spinePosition.y + switchH / 2,
          color: leafColor(leafIndex),
          kind: "uplink",
          title: `Leaf ${leafIndex + 1} uplink`,
          source: fabricDeviceLabel("Leaf", leafIndex, perPodLeafs, input, best),
          target: fabricDeviceLabel("Spine", spineStart + localSpineIndex, perPodSpines, input, best),
          sourceKey: `leaf-${leafIndex}`,
          targetKey: `spine-${spineStart + localSpineIndex}`,
        });
      }
    });
    const label = fabricDeviceLabel("Leaf", leafIndex, perPodLeafs, input, best);
    switches.push({ kind: "leaf", x: leafPosition.x, y: leafPosition.y, w: switchW, h: switchH, label, device: label, deviceKey: `leaf-${leafIndex}` });
  });

  serverPositions.forEach((serverPosition, serverIndex) => {
    const nicLeafStart = (serverIndex * activeNicPorts) % best.leafCount;
    const ports = [];
    for (let nicIndex = 0; nicIndex < activeNicPorts; nicIndex += 1) {
      const nicX = nicPortX(serverPosition.x, serverW, input.serverNicPorts, nicIndex);
      const color = nicColor(nicIndex);
      ports.push({ x: nicX, y: serverPosition.y - serverH / 2 + 7, color });
      serverFabricGroupIndexes(serverIndex, input, best).forEach((groupIndex) => {
        const localServerIndex = serverLocalIndex(serverIndex, input, best);
        const leafIndex = podCount > 1
          ? groupIndex * perPodLeafs + ((localServerIndex * activeNicPorts + nicIndex) % perPodLeafs)
          : (nicLeafStart + nicIndex) % shownLeafs;
        const leafPosition = leafPositions[leafIndex];
        lines.push({
          x1: nicX,
          y1: serverPosition.y - serverH / 2,
          x2: leafPosition.x,
          y2: leafPosition.y + switchH / 2,
          color,
          kind: "link",
          title: podCount > 1 ? `Node NIC ${nicIndex + 1} ${diagramFabricGroupLabel(groupIndex, input, best)}` : `Node NIC ${nicIndex + 1}`,
          source: nodeDeviceLabel(serverIndex, input, best),
          target: fabricDeviceLabel("Leaf", leafIndex, perPodLeafs, input, best),
          sourceKey: `node-${serverIndex}`,
          targetKey: `leaf-${leafIndex}`,
        });
      });
    }
    const label = nodeDeviceLabel(serverIndex, input, best);
    servers.push({ x: serverPosition.x, y: serverPosition.y, w: serverW, h: serverH, number: serverIndex + 1, nicCount: input.serverNicPorts, label, device: label, deviceKey: `node-${serverIndex}`, ports });
  });

  return normalizeGeometryHorizontal({ width, height, labels, lines, switches, servers, labelGutter });
}

function makePptRowPositions(count, perRow, center, startY, rowGap, itemGap) {
  const positions = [];
  const rows = Math.ceil(count / perRow);
  for (let row = 0; row < rows; row += 1) {
    const rowStart = row * perRow;
    const rowCount = Math.min(perRow, count - rowStart);
    const xs = distribute(center, rowCount, itemGap);
    xs.forEach((x, column) => {
      positions[rowStart + column] = { x, y: startY + row * rowGap };
    });
  }
  return positions;
}

function getSummaryDiagramGeometry({ input, best }) {
  const labelGutter = DIAGRAM_LABEL_GUTTER;
  const podCount = best.podCount || 1;
  const planeCount = best.planeCount || (input.useMultiPlanar ? 2 : 1);
  const multiPodCount = best.multiPodCount || (input.useMultiPods ? Math.ceil(input.serverCount / Math.max(1, input.podServerCount || input.serverCount)) : 1);
  const perPodLeafs = best.perPodLeafs || best.leafCount;
  const perPodSpines = best.perPodSpines || best.spines;
  const podServerCount = best.podServerCount || input.serverCount;
  if (input.useMultiPlanar && input.useMultiPods) {
    return getMultiPlanarPodsSummaryDiagramGeometry({ input, best }, {
      planeCount,
      multiPodCount,
      perPodLeafs,
      perPodSpines,
      podServerCount,
    });
  }
  const switchW = summarySwitchWidth(best, podCount);
  const switchEntryLimit = summarySwitchEntryLimit(best, podCount);
  const spineEntries = compactSummaryEntries(best.spines, perPodSpines, switchEntryLimit.spine, "spine", input, best, planeCount, multiPodCount);
  const leafEntries = compactSummaryEntries(best.leafCount, perPodLeafs, switchEntryLimit.leaf, "leaf", input, best, planeCount, multiPodCount);
  const serverEntries = compactEntriesByPod(input.serverCount, podServerCount, podCount > 1 ? 7 : 13, "server");
  const switchH = 24;
  const serverW = serverNodeWidth(input.serverNicPorts);
  const activeNicPorts = activeServerNicPorts(input);
  const serverH = 62;
  const switchSlotWidth = Math.max(92, switchW + 18);
  const serverSlotWidth = Math.max(96, serverW + 16);
  const maxRowWidth = Math.max(
    spineEntries.length * switchSlotWidth,
    leafEntries.length * switchSlotWidth,
    serverEntries.length * serverSlotWidth,
  );
  const width = Math.max(920, labelGutter + maxRowWidth + 150);
  const summaryDensity = Math.max(spineEntries.length, leafEntries.length, serverEntries.length);
  const verticalScale = Math.min(1, Math.max(0, (summaryDensity - 10) / 10));
  const spineY = 58;
  const leafY = 190 + verticalScale * 58;
  const serverY = 360 + verticalScale * 138;
  const height = Math.round(serverY + serverH / 2 + 58);
  const contentLeft = labelGutter + DIAGRAM_CONTENT_OFFSET;
  const contentRight = width - 48;
  const center = (contentLeft + contentRight) / 2;
  const lines = [];
  const switches = [];
  const servers = [];
  const ellipsis = [];
  const podEllipsisGapBoost = input.useMultiPods && !input.useMultiPlanar ? 36 : 0;
  const planeBoundaryGapBoost = input.useMultiPlanar && !input.useMultiPods ? 36 : 0;
  const spinePositions = placeCompactEntries(spineEntries, center, spineY, switchSlotWidth, { podEllipsisGapBoost, planeBoundaryGapBoost, perGroupCount: perPodSpines });
  const leafPositions = placeCompactEntries(leafEntries, center, leafY, switchSlotWidth, { podEllipsisGapBoost, planeBoundaryGapBoost, perGroupCount: perPodLeafs });
  const serverPositions = placeCompactEntries(serverEntries, center, serverY, serverSlotWidth, { podEllipsisGapBoost });
  const switchEllipsisW = Math.max(78, switchW);

  spineEntries.forEach((entry) => {
    const position = spinePositions.get(entry.key);
    if (entry.type === "ellipsis") {
      ellipsis.push({ x: position.x, y: position.y, w: switchEllipsisW, h: 34, label: summaryHiddenLabel(entry, "Spine", input, best) });
      return;
    }
    const label = fabricDeviceLabel("Spine", entry.index, perPodSpines, input, best);
    switches.push({ kind: "spine", x: position.x, y: position.y, w: switchW, h: switchH, label, device: label, deviceKey: `spine-${entry.index}` });
  });

  leafEntries.forEach((entry) => {
    const position = leafPositions.get(entry.key);
    if (entry.type === "ellipsis") {
      ellipsis.push({ x: position.x, y: position.y, w: switchEllipsisW, h: 34, label: summaryHiddenLabel(entry, "Leaf", input, best) });
      return;
    }
    const label = fabricDeviceLabel("Leaf", entry.index, perPodLeafs, input, best);
    switches.push({ kind: "leaf", x: position.x, y: position.y, w: switchW, h: switchH, label, device: label, deviceKey: `leaf-${entry.index}` });
  });

  leafEntries.forEach((leafEntry) => {
    if (leafEntry.podEllipsis) return;
    const leafPosition = leafPositions.get(leafEntry.key);
    const leafSummary = summaryLinkEndpoint(leafEntry, leafPosition, switchW, switchH);
    spineEntries.forEach((spineEntry) => {
      if (spineEntry.podEllipsis) return;
      const spinePosition = spinePositions.get(spineEntry.key);
      const spineSummary = summaryLinkEndpoint(spineEntry, spinePosition, switchW, switchH);
      if (Math.floor(leafSummary.index / perPodLeafs) !== Math.floor(spineSummary.index / perPodSpines)) return;
      const linkCount = linksForSpine(best.uplinksPerLeaf, perPodSpines, spineSummary.index % perPodSpines);
      for (let linkIndex = 0; linkIndex < linkCount; linkIndex += 1) {
        const offset = parallelOffset(linkIndex, linkCount, switchW - 28);
        lines.push({
          x1: leafSummary.x + offset,
          y1: leafSummary.y - leafSummary.h / 2,
          x2: spineSummary.x + offset,
          y2: spineSummary.y + spineSummary.h / 2,
          color: leafColor(leafSummary.index),
          kind: "uplink",
          title: `Leaf ${leafSummary.index + 1} uplink`,
          source: leafEntry.type === "node" ? fabricDeviceLabel("Leaf", leafSummary.index, perPodLeafs, input, best) : "",
          target: spineEntry.type === "node" ? fabricDeviceLabel("Spine", spineSummary.index, perPodSpines, input, best) : "",
          sourceKey: leafEntry.type === "node" ? `leaf-${leafSummary.index}` : "",
          targetKey: spineEntry.type === "node" ? `spine-${spineSummary.index}` : "",
        });
      }
    });
  });

  serverEntries.forEach((entry) => {
    const position = serverPositions.get(entry.key);
    if (entry.type === "ellipsis") {
      ellipsis.push({ x: position.x, y: position.y, w: 78, h: 42, label: summaryHiddenLabel(entry, "Node", input, best) });
      return;
    }

    const ports = [];
    const nicLeafStart = (entry.index * activeNicPorts) % best.leafCount;
    for (let nicIndex = 0; nicIndex < activeNicPorts; nicIndex += 1) {
      const nicX = nicPortX(position.x, serverW, input.serverNicPorts, nicIndex);
      const color = nicColor(nicIndex);
      ports.push({ x: nicX, y: serverY - serverH / 2 + 7, color });
      serverFabricGroupIndexes(entry.index, input, best).forEach((groupIndex) => {
        const localServerIndex = serverLocalIndex(entry.index, input, best);
        const leafIndex = podCount > 1
          ? groupIndex * perPodLeafs + ((localServerIndex * activeNicPorts + nicIndex) % perPodLeafs)
          : (nicLeafStart + nicIndex) % best.leafCount;
        const leafEntry = leafEntries.find((item) => item.type === "node" && item.index === leafIndex);
        const fallbackLeafEntry = leafEntries.find((item) => {
          if (item.type !== "ellipsis") return false;
          return leafIndex >= item.rangeStart && leafIndex <= item.rangeEnd;
        }) || leafEntries.find((item) => item.type === "ellipsis");
        const linkLeafEntry = leafEntry || fallbackLeafEntry;
        if (!linkLeafEntry) return;
        const leafPosition = leafPositions.get(linkLeafEntry.key);
        lines.push({
          x1: nicX,
          y1: serverY - serverH / 2,
          x2: leafPosition.x,
          y2: leafY + switchH / 2,
          color,
          kind: "link",
          title: podCount > 1 ? `Node NIC ${nicIndex + 1} ${diagramFabricGroupLabel(groupIndex, input, best)}` : `Node NIC ${nicIndex + 1}`,
          source: summaryNodeDeviceLabel(entry.index, input, best),
          target: linkLeafEntry.type === "node"
            ? fabricDeviceLabel("Leaf", linkLeafEntry.index, perPodLeafs, input, best)
            : "",
          sourceKey: `node-${entry.index}`,
          targetKey: linkLeafEntry.type === "node" ? `leaf-${linkLeafEntry.index}` : "",
        });
      });
    }
    const label = summaryNodeDeviceLabel(entry.index, input, best);
    servers.push({ x: position.x, y: position.y, w: serverW, h: serverH, number: entry.index + 1, nicCount: input.serverNicPorts, label, device: label, deviceKey: `node-${entry.index}`, ports });
  });

  return normalizeGeometryHorizontal({
    width,
    height,
    labels: [],
    lines,
    switches,
    servers,
    ellipsis,
    labelGutter,
  });
}

function getMultiPlanarPodsSummaryDiagramGeometry({ input, best }, summary) {
  const { planeCount, multiPodCount, perPodLeafs, perPodSpines, podServerCount } = summary;
  const switchW = Math.max(96, Math.min(112, summarySwitchWidth(best, best.podCount || 1)));
  const switchH = 24;
  const serverW = serverNodeWidth(input.serverNicPorts);
  const serverH = 62;
  const activeNicPorts = activeServerNicPorts(input);
  const slotGap = Math.max(116, switchW + 26);
  const planeGap = 44;
  const switchEntryCount = Math.max(summaryEdgeEntryCount(perPodSpines), summaryEdgeEntryCount(perPodLeafs), 1);
  const planeWidth = (switchEntryCount - 1) * slotGap + switchW;
  const switchBlockWidth = planeCount * planeWidth + (planeCount - 1) * planeGap;
  const nodeGap = Math.max(128, serverW + 28);
  const nodeEntryCount = summaryNodeEntryCount(Math.min(podServerCount, input.serverCount));
  const nodeBlockWidth = nodeEntryCount > 0 ? (nodeEntryCount - 1) * nodeGap + serverW : 0;
  const blockWidth = Math.max(switchBlockWidth, nodeBlockWidth);
  const podEntries = compactPodEntries(multiPodCount, 2);
  const hiddenPodWidth = 116;
  const podBlockGap = 56;
  const rowItemsWidth = podEntries.reduce((total, entry) => total + (entry.type === "ellipsis" ? hiddenPodWidth : blockWidth), 0);
  const rowWidth = rowItemsWidth + Math.max(0, podEntries.length - 1) * podBlockGap;
  const width = Math.max(DEFAULT_DIAGRAM_VIEW_WIDTH, rowWidth + DIAGRAM_CONTENT_OFFSET * 2);
  const center = width / 2;
  const rowLeft = center - rowWidth / 2;
  const spineY = 64;
  const leafY = 206;
  const nodeY = 386;
  const height = Math.round(nodeY + serverH / 2 + 72);
  const lines = [];
  const switches = [];
  const servers = [];
  const ellipsis = [];
  const leafPositionsByIndex = new Map();
  const spinePositionsByIndex = new Map();
  const leafSummaryEntriesByGroup = new Map();
  const spineSummaryEntriesByGroup = new Map();
  const nodePositionsByIndex = new Map();
  let cursorX = rowLeft;

  podEntries.forEach((podEntry) => {
    const entryWidth = podEntry.type === "ellipsis" ? hiddenPodWidth : blockWidth;
    const entryCenter = cursorX + entryWidth / 2;
    if (podEntry.type === "ellipsis") {
      [spineY, leafY, nodeY].forEach((y) => {
        ellipsis.push({
          x: entryCenter,
          y,
          w: hiddenPodWidth,
          h: 42,
          label: `${podEntry.hiddenCount} Pods\nhidden`,
        });
      });
      cursorX += entryWidth + podBlockGap;
      return;
    }

    const podIndex = podEntry.index;
    const switchBlockLeft = cursorX + (blockWidth - switchBlockWidth) / 2;
    for (let planeIndex = 0; planeIndex < planeCount; planeIndex += 1) {
      const planeCenter = switchBlockLeft + planeWidth / 2 + planeIndex * (planeWidth + planeGap);
      const fabricGroupIndex = podIndex * planeCount + planeIndex;
      const fabricLabel = diagramFabricGroupLabel(fabricGroupIndex, input, best);
      const spineBase = fabricGroupIndex * perPodSpines;
      const leafBase = fabricGroupIndex * perPodLeafs;
      const spineEntries = compactEdgeEntries(perPodSpines, `spine-p${podIndex}-pl${planeIndex}`);
      const leafEntries = compactEdgeEntries(perPodLeafs, `leaf-p${podIndex}-pl${planeIndex}`);
      const spinePositions = planeEntryPositions(spineEntries, planeCenter, slotGap, spineY);
      const leafPositions = planeEntryPositions(leafEntries, planeCenter, slotGap, leafY);

      spineEntries.forEach((entry) => {
        const position = spinePositions.get(entry.key);
        if (entry.type === "ellipsis") {
          const hiddenSpine = { x: position.x, y: position.y, w: 92, h: 34, label: `${fabricLabel} - ${entry.hiddenCount} Spine\nhidden` };
          ellipsis.push(hiddenSpine);
          pushSummaryEntry(spineSummaryEntriesByGroup, fabricGroupIndex, {
            type: "ellipsis",
            x: position.x,
            y: position.y,
            w: hiddenSpine.w,
            h: hiddenSpine.h,
            rangeStart: spineBase + entry.rangeStart,
            rangeEnd: spineBase + entry.rangeEnd,
          });
          return;
        }
        const index = spineBase + entry.index;
        const label = `${fabricLabel}\nSpine ${entry.index + 1}`;
        spinePositionsByIndex.set(index, position);
        pushSummaryEntry(spineSummaryEntriesByGroup, fabricGroupIndex, {
          type: "node",
          index,
          x: position.x,
          y: position.y,
          w: switchW,
          h: switchH,
        });
        switches.push({ kind: "spine", x: position.x, y: position.y, w: switchW, h: switchH, label, device: label, deviceKey: `spine-${index}` });
      });

      leafEntries.forEach((entry) => {
        const position = leafPositions.get(entry.key);
        if (entry.type === "ellipsis") {
          const hiddenLeaf = { x: position.x, y: position.y, w: 92, h: 34, label: `${fabricLabel} - ${entry.hiddenCount} Leaf\nhidden` };
          ellipsis.push(hiddenLeaf);
          pushSummaryEntry(leafSummaryEntriesByGroup, fabricGroupIndex, {
            type: "ellipsis",
            x: position.x,
            y: position.y,
            w: hiddenLeaf.w,
            h: hiddenLeaf.h,
            rangeStart: leafBase + entry.rangeStart,
            rangeEnd: leafBase + entry.rangeEnd,
          });
          return;
        }
        const index = leafBase + entry.index;
        const label = `${fabricLabel}\nLeaf ${entry.index + 1}`;
        leafPositionsByIndex.set(index, position);
        pushSummaryEntry(leafSummaryEntriesByGroup, fabricGroupIndex, {
          type: "node",
          index,
          x: position.x,
          y: position.y,
          w: switchW,
          h: switchH,
        });
        switches.push({ kind: "leaf", x: position.x, y: position.y, w: switchW, h: switchH, label, device: label, deviceKey: `leaf-${index}` });
      });
    }

    const nodeBase = podIndex * podServerCount;
    const nodeCount = Math.max(0, Math.min(podServerCount, input.serverCount - nodeBase));
    const nodeEntries = compactNodeSummaryEntries(nodeCount, `node-p${podIndex}`);
    const nodePositions = planeEntryPositions(nodeEntries, entryCenter, nodeGap, nodeY);
    nodeEntries.forEach((entry) => {
      const position = nodePositions.get(entry.key);
      if (entry.type === "ellipsis") {
        ellipsis.push({ x: position.x, y: position.y, w: 92, h: 42, label: `Pod ${podIndex + 1} - ${entry.hiddenCount} Node\nhidden` });
        return;
      }
      const index = nodeBase + entry.index;
      const label = `Pod ${podIndex + 1} - Node ${entry.index + 1}`;
      const ports = Array.from({ length: activeNicPorts }, (_, nicIndex) => ({
        x: nicPortX(position.x, serverW, input.serverNicPorts, nicIndex),
        y: position.y - serverH / 2 + 7,
        color: nicColor(nicIndex),
      }));
      nodePositionsByIndex.set(index, { ...position, ports });
      servers.push({ x: position.x, y: position.y, w: serverW, h: serverH, number: index + 1, nicCount: input.serverNicPorts, label, device: label, deviceKey: `node-${index}`, ports });
    });
    cursorX += entryWidth + podBlockGap;
  });

  leafSummaryEntriesByGroup.forEach((leafEntries, fabricGroupIndex) => {
    const spineEntries = spineSummaryEntriesByGroup.get(fabricGroupIndex) || [];
    const spineBase = fabricGroupIndex * perPodSpines;
    leafEntries.forEach((leafEntry) => {
      const leafIndex = summaryEntryRepresentativeIndex(leafEntry);
      spineEntries.forEach((spineEntry) => {
      const spineIndex = summaryEntryRepresentativeIndex(spineEntry);
      const localSpineIndex = spineIndex % perPodSpines;
      const linkCount = linksForSpine(best.uplinksPerLeaf, perPodSpines, localSpineIndex);
      for (let linkIndex = 0; linkIndex < linkCount; linkIndex += 1) {
        const offset = parallelOffset(linkIndex, linkCount, switchW - 28);
        lines.push({
          x1: leafEntry.x + offset,
          y1: leafEntry.y - leafEntry.h / 2,
          x2: spineEntry.x + offset,
          y2: spineEntry.y + spineEntry.h / 2,
          color: leafColor(leafIndex),
          kind: "uplink",
          title: `Leaf ${leafIndex + 1} uplink`,
          source: leafEntry.type === "node" ? fabricDeviceLabel("Leaf", leafIndex, perPodLeafs, input, best) : "",
          target: spineEntry.type === "node" ? fabricDeviceLabel("Spine", spineBase + localSpineIndex, perPodSpines, input, best) : "",
          sourceKey: leafEntry.type === "node" ? `leaf-${leafIndex}` : "",
          targetKey: spineEntry.type === "node" ? `spine-${spineIndex}` : "",
        });
      }
    });
    });
  });

  nodePositionsByIndex.forEach((nodePosition, serverIndex) => {
    (nodePosition.ports || []).forEach((port, nicIndex) => {
      serverFabricGroupIndexes(serverIndex, input, best).forEach((groupIndex) => {
        const localServerIndex = serverLocalIndex(serverIndex, input, best);
        const leafIndex = groupIndex * perPodLeafs + ((localServerIndex * activeNicPorts + nicIndex) % perPodLeafs);
        const leafPosition = leafPositionsByIndex.get(leafIndex) || nearestFabricLeafPosition(leafPositionsByIndex, groupIndex, perPodLeafs);
        if (!leafPosition) return;
        lines.push({
          x1: port.x,
          y1: nodePosition.y - serverH / 2,
          x2: leafPosition.x,
          y2: leafPosition.y + switchH / 2,
          color: nicColor(nicIndex),
          kind: "link",
          title: `Node NIC ${nicIndex + 1} ${diagramFabricGroupLabel(groupIndex, input, best)}`,
          source: summaryNodeDeviceLabel(serverIndex, input, best),
          target: fabricDeviceLabel("Leaf", leafIndex, perPodLeafs, input, best),
          sourceKey: `node-${serverIndex}`,
          targetKey: leafPositionsByIndex.has(leafIndex) ? `leaf-${leafIndex}` : "",
        });
      });
    });
  });

  return normalizeGeometryHorizontal({
    width,
    height,
    labels: [],
    lines,
    switches,
    servers,
    ellipsis,
    labelGutter: DIAGRAM_LABEL_GUTTER,
  });
}

function compactEdgeEntries(count, keyPrefix) {
  if (count <= 0) return [];
  if (count === 1) return [{ type: "node", index: 0, key: `${keyPrefix}-first` }];
  if (count === 2) {
    return [
      { type: "node", index: 0, key: `${keyPrefix}-first` },
      { type: "node", index: 1, key: `${keyPrefix}-last` },
    ];
  }
  return [
    { type: "node", index: 0, key: `${keyPrefix}-first` },
    { type: "ellipsis", hiddenCount: count - 2, rangeStart: 1, rangeEnd: count - 2, key: `${keyPrefix}-hidden` },
    { type: "node", index: count - 1, key: `${keyPrefix}-last` },
  ];
}

function pushSummaryEntry(map, groupIndex, entry) {
  if (!map.has(groupIndex)) map.set(groupIndex, []);
  map.get(groupIndex).push(entry);
}

function summaryEntryRepresentativeIndex(entry) {
  return entry.type === "node" ? entry.index : entry.rangeStart;
}

function summaryLinkEndpoint(entry, position, defaultW, defaultH) {
  return {
    index: summaryEntryRepresentativeIndex(entry),
    x: position.x,
    y: position.y,
    w: entry.type === "ellipsis" ? Math.max(78, defaultW) : defaultW,
    h: entry.type === "ellipsis" ? 34 : defaultH,
  };
}

function summaryEdgeEntryCount(count) {
  if (count <= 0) return 0;
  return count <= 2 ? count : 3;
}

function summaryNodeEntryCount(count) {
  if (count <= 0) return 0;
  return count <= 6 ? count : 7;
}

function compactNodeSummaryEntries(count, keyPrefix) {
  if (count <= 6) {
    return Array.from({ length: count }, (_, index) => ({ type: "node", index, key: `${keyPrefix}-${index}` }));
  }
  return [
    { type: "node", index: 0, key: `${keyPrefix}-head-0` },
    { type: "node", index: 1, key: `${keyPrefix}-head-1` },
    { type: "node", index: 2, key: `${keyPrefix}-head-2` },
    { type: "ellipsis", hiddenCount: count - 6, rangeStart: 3, rangeEnd: count - 4, key: `${keyPrefix}-hidden` },
    { type: "node", index: count - 3, key: `${keyPrefix}-tail-0` },
    { type: "node", index: count - 2, key: `${keyPrefix}-tail-1` },
    { type: "node", index: count - 1, key: `${keyPrefix}-tail-2` },
  ];
}

function planeEntryPositions(entries, center, gap, y) {
  const positions = new Map();
  const xs = distribute(center, entries.length, gap);
  entries.forEach((entry, index) => {
    positions.set(entry.key, { x: xs[index], y });
  });
  return positions;
}

function nearestFabricLeafPosition(leafPositionsByIndex, groupIndex, perPodLeafs) {
  const start = groupIndex * perPodLeafs;
  const end = start + perPodLeafs;
  for (let index = start; index < end; index += 1) {
    if (leafPositionsByIndex.has(index)) return leafPositionsByIndex.get(index);
  }
  return null;
}

function compactLayerEntries(count, maxEntries) {
  if (count <= maxEntries) {
    return Array.from({ length: count }, (_, index) => ({ type: "node", index, key: `node-${index}` }));
  }

  const visibleNodeCount = maxEntries - 1;
  const headCount = Math.ceil(visibleNodeCount / 2);
  const tailCount = visibleNodeCount - headCount;
  const entries = [];
  for (let index = 0; index < headCount; index += 1) {
    entries.push({ type: "node", index, key: `node-${index}` });
  }
  entries.push({
    type: "ellipsis",
    hiddenCount: count - headCount - tailCount,
    rangeStart: headCount,
    rangeEnd: count - tailCount - 1,
    key: "ellipsis",
  });
  for (let index = count - tailCount; index < count; index += 1) {
    entries.push({ type: "node", index, key: `node-${index}` });
  }
  return entries;
}

function compactSummaryEntries(totalCount, perFabricGroupCount, maxEntriesPerGroup, kind, input, best, planeCount, multiPodCount) {
  if (!input.useMultiPods || !input.useMultiPlanar) {
    return compactEntriesByPod(totalCount, perFabricGroupCount, maxEntriesPerGroup, kind);
  }

  const entries = [];
  const podEntries = compactPodEntries(multiPodCount, 2);

  podEntries.forEach((podEntry) => {
    if (podEntry.type === "ellipsis") {
      const podStart = podEntry.rangeStart || 0;
      const podEnd = podEntry.rangeEnd || multiPodCount - 1;
      const rangeStart = podStart * planeCount * perFabricGroupCount;
      const rangeEnd = Math.min(totalCount - 1, (podEnd + 1) * planeCount * perFabricGroupCount - 1);
      entries.push({
        type: "ellipsis",
        key: `${kind}-fabric-pods-${podStart}-${podEnd}-ellipsis`,
        fabricPodEllipsis: true,
        rangePodStart: podStart,
        rangePodEnd: podEnd,
        hiddenPhysicalPodCount: podEnd - podStart + 1,
        hiddenPlaneCount: planeCount,
        rangeStart,
        rangeEnd,
        hiddenCount: Math.max(0, rangeEnd - rangeStart + 1),
      });
      return;
    }

    for (let planeIndex = 0; planeIndex < planeCount; planeIndex += 1) {
      const fabricGroupIndex = podEntry.index * planeCount + planeIndex;
      const start = fabricGroupIndex * perFabricGroupCount;
      const count = Math.max(0, Math.min(perFabricGroupCount, totalCount - start));
      const deviceEntries = compactLayerEntries(count, maxEntriesPerGroup);
      deviceEntries.forEach((entry, entryIndex) => {
        if (entry.type === "ellipsis") {
          const previousNode = [...deviceEntries.slice(0, entryIndex)].reverse().find((item) => item.type === "node");
          const nextNode = deviceEntries.slice(entryIndex + 1).find((item) => item.type === "node");
          const rangeStart = start + (previousNode ? previousNode.index + 1 : 0);
          const rangeEnd = start + (nextNode ? nextNode.index - 1 : count - 1);
          entries.push({
            ...entry,
            key: `${kind}-fabric-group-${fabricGroupIndex}-ellipsis`,
            fabricGroupIndex,
            rangeStart,
            rangeEnd,
            hiddenCount: Math.max(0, rangeEnd - rangeStart + 1),
          });
          return;
        }
        entries.push({
          ...entry,
          index: start + entry.index,
          key: `${kind}-fabric-group-${fabricGroupIndex}-node-${entry.index}`,
          fabricGroupIndex,
        });
      });
    }
  });

  return entries;
}

function compactEntriesByPod(totalCount, perPodCount, maxEntriesPerPod, kind, maxPods = 5) {
  if (perPodCount >= totalCount) return compactLayerEntries(totalCount, maxEntriesPerPod);

  const entries = [];
  const podCount = Math.ceil(totalCount / perPodCount);
  const podEntries = compactPodEntries(podCount, maxPods);

  podEntries.forEach((podEntry) => {
    if (podEntry.type === "ellipsis") {
      const podStart = podEntry.rangeStart || 0;
      const podEnd = podEntry.rangeEnd || podCount - 1;
      const rangeStart = podStart * perPodCount;
      const rangeEnd = Math.min(totalCount - 1, (podEnd + 1) * perPodCount - 1);
      entries.push({
        type: "ellipsis",
        key: `${kind}-pods-${podStart}-${podEnd}-ellipsis`,
        podEllipsis: true,
        podIndex: podStart,
        rangePodStart: podStart,
        rangePodEnd: podEnd,
        hiddenPodCount: podEnd - podStart + 1,
        rangeStart,
        rangeEnd,
        hiddenCount: Math.max(0, rangeEnd - rangeStart + 1),
      });
      return;
    }

    const podIndex = podEntry.index;
    const start = podIndex * perPodCount;
    const count = Math.min(perPodCount, totalCount - start);
    const deviceEntries = compactLayerEntries(count, maxEntriesPerPod);
    deviceEntries.forEach((entry, entryIndex) => {
      if (entry.type === "ellipsis") {
        const previousNode = [...deviceEntries.slice(0, entryIndex)].reverse().find((item) => item.type === "node");
        const nextNode = deviceEntries.slice(entryIndex + 1).find((item) => item.type === "node");
        const rangeStart = start + (previousNode ? previousNode.index + 1 : 0);
        const rangeEnd = start + (nextNode ? nextNode.index - 1 : count - 1);
        entries.push({
          ...entry,
          key: `${kind}-pod-${podIndex}-ellipsis`,
          podIndex,
          rangeStart,
          rangeEnd,
          hiddenCount: Math.max(0, rangeEnd - rangeStart + 1),
        });
        return;
      }
      entries.push({
        ...entry,
        index: start + entry.index,
        key: `${kind}-pod-${podIndex}-node-${entry.index}`,
        podIndex,
      });
    });
  });
  return entries;
}

function compactPodEntries(podCount, maxPods = 5) {
  if (podCount <= 2) {
    return Array.from({ length: podCount }, (_, index) => ({ type: "node", index, key: `pod-${index}` }));
  }

  return [
    { type: "node", index: 0, key: "pod-0" },
    {
      type: "ellipsis",
      hiddenCount: podCount - 2,
      rangeStart: 1,
      rangeEnd: podCount - 2,
      key: "pod-ellipsis",
    },
    { type: "node", index: podCount - 1, key: `pod-${podCount - 1}` },
  ];
}

function normalizeGeometryHorizontal(geometry, padding = 96) {
  const bounds = getGeometryHorizontalBounds(geometry);
  if (!bounds) return geometry;
  const contentWidth = bounds.maxX - bounds.minX;
  const width = Math.max(DEFAULT_DIAGRAM_VIEW_WIDTH, Math.ceil(contentWidth + padding * 2));
  const shift = (width - contentWidth) / 2 - bounds.minX;
  shiftGeometryX(geometry, shift);
  geometry.width = width;
  geometry.labelGutter = 0;
  return geometry;
}

function getGeometryHorizontalBounds(geometry) {
  let minX = Infinity;
  let maxX = -Infinity;
  const take = (value) => {
    if (!Number.isFinite(value)) return;
    minX = Math.min(minX, value);
    maxX = Math.max(maxX, value);
  };
  geometry.switches.forEach((item) => {
    take(item.x - item.w / 2);
    take(item.x + item.w / 2);
  });
  geometry.servers.forEach((item) => {
    take(item.x - item.w / 2);
    take(item.x + item.w / 2);
    (item.ports || []).forEach((port) => take(port.x));
  });
  (geometry.ellipsis || []).forEach((item) => {
    take(item.x - item.w / 2);
    take(item.x + item.w / 2);
  });
  geometry.lines.forEach((item) => {
    take(item.x1);
    take(item.x2);
  });
  geometry.labels.forEach((item) => take(item.x));
  if (!Number.isFinite(minX) || !Number.isFinite(maxX)) return null;
  return { minX, maxX };
}

function shiftGeometryX(geometry, shift) {
  geometry.switches.forEach((item) => { item.x += shift; });
  geometry.servers.forEach((item) => {
    item.x += shift;
    (item.ports || []).forEach((port) => { port.x += shift; });
  });
  (geometry.ellipsis || []).forEach((item) => { item.x += shift; });
  geometry.lines.forEach((item) => {
    item.x1 += shift;
    item.x2 += shift;
  });
  geometry.labels.forEach((item) => { item.x += shift; });
}

function summaryHiddenLabel(entry, label, input = {}, best = {}) {
  if (entry.fabricPodEllipsis) {
    return `${entry.hiddenPhysicalPodCount} Pods x ${entry.hiddenPlaneCount} Planes\nhidden`;
  }
  if (entry.podEllipsis) {
    if (input.useMultiPods) return `${entry.hiddenPodCount} Pods\nhidden`;
    if (input.useMultiPlanar) return `${entry.hiddenPodCount} Planes\nhidden`;
    return `${entry.hiddenCount} ${label}\nhidden`;
  }
  const prefix = summaryHiddenPrefix(entry, label, input, best);
  return prefix ? `${prefix} - ${entry.hiddenCount} ${label}\nhidden` : `${entry.hiddenCount} ${label}\nhidden`;
}

function summaryHiddenPrefix(entry, label, input, best) {
  if (entry.fabricGroupIndex !== undefined) return diagramFabricGroupLabel(entry.fabricGroupIndex, input, best);
  if (entry.podIndex === undefined) return "";
  if (input.useMultiPods && input.useMultiPlanar && label === "Node") return `Pod ${entry.podIndex + 1}`;
  return diagramFabricGroupLabel(entry.podIndex, input, best);
}

function diagramFabricGroupLabel(groupIndex, input, best) {
  const planeCount = best.planeCount || (input.useMultiPlanar ? 2 : 1);
  if (input.useMultiPods && input.useMultiPlanar) {
    return `Pod ${Math.floor(groupIndex / planeCount) + 1} - Plane ${(groupIndex % planeCount) + 1}`;
  }
  if (input.useMultiPods) return `Pod ${groupIndex + 1}`;
  if (input.useMultiPlanar) return `Plane ${groupIndex + 1}`;
  return "";
}

function fabricDeviceLabel(kind, absoluteIndex, perGroupCount, input, best) {
  const groupIndex = Math.floor(absoluteIndex / Math.max(1, perGroupCount || 1));
  const localIndex = (absoluteIndex % Math.max(1, perGroupCount || 1)) + 1;
  const prefix = diagramFabricGroupLabel(groupIndex, input, best);
  if (!prefix) return `${kind} ${absoluteIndex + 1}`;
  return input.useMultiPlanar && input.useMultiPods ? `${prefix}\n${kind} ${localIndex}` : `${prefix} - ${kind} ${localIndex}`;
}

function nodeDeviceLabel(serverIndex, input, best) {
  if (!input.useMultiPods) return `Node ${serverIndex + 1}`;
  const podServerCount = best.podServerCount || input.podServerCount || input.serverCount;
  const podIndex = Math.floor(serverIndex / Math.max(1, podServerCount));
  const localIndex = (serverIndex % Math.max(1, podServerCount)) + 1;
  return `Pod ${podIndex + 1} - Node ${localIndex}`;
}

function summaryNodeDeviceLabel(serverIndex, input, best) {
  if (input.useMultiPods && input.useMultiPlanar) {
    const podServerCount = best.podServerCount || input.podServerCount || input.serverCount;
    const podIndex = Math.floor(serverIndex / Math.max(1, podServerCount));
    const localIndex = (serverIndex % Math.max(1, podServerCount)) + 1;
    return `Pod ${podIndex + 1} - Node ${localIndex}`;
  }
  return nodeDeviceLabel(serverIndex, input, best);
}

function serverFabricGroupIndexes(serverIndex, input, best) {
  const planeCount = best.planeCount || (input.useMultiPlanar ? 2 : 1);
  const multiPodCount = best.multiPodCount || (input.useMultiPods ? Math.ceil(input.serverCount / Math.max(1, input.podServerCount || input.serverCount)) : 1);
  const podServerCount = best.podServerCount || input.serverCount;
  const podIndex = input.useMultiPods ? Math.min(multiPodCount - 1, Math.floor(serverIndex / podServerCount)) : 0;
  const planes = input.useMultiPlanar ? planeCount : 1;
  return Array.from({ length: planes }, (_, planeIndex) => podIndex * planeCount + planeIndex);
}

function serverLocalIndex(serverIndex, input, best) {
  const podServerCount = best.podServerCount || input.serverCount;
  return input.useMultiPods ? serverIndex % podServerCount : serverIndex;
}

function summarySwitchWidth(best, podCount) {
  const switchCount = Math.max(best.leafCount, best.spines);
  if (podCount > 1) {
    if (switchCount >= 512) return 88;
    if (switchCount >= 128) return 96;
    return 104;
  }
  if (switchCount >= 128) return 88;
  if (switchCount >= 64) return 96;
  if (switchCount >= 32) return 104;
  return 116;
}

function summarySwitchEntryLimit(best, podCount) {
  const switchCount = Math.max(best.leafCount, best.spines);
  if (podCount > 1) {
    if (switchCount >= 512) return { spine: 9, leaf: 9 };
    if (switchCount >= 128) return { spine: 7, leaf: 7 };
    return { spine: 5, leaf: 5 };
  }
  if (switchCount >= 128) return { spine: 11, leaf: 13 };
  if (switchCount >= 64) return { spine: 9, leaf: 11 };
  return { spine: 7, leaf: 9 };
}

function placeCompactEntries(entries, center, y, gap, options = {}) {
  const positions = new Map();
  const podEllipsisGapBoost = options.podEllipsisGapBoost || 0;
  const planeBoundaryGapBoost = options.planeBoundaryGapBoost || 0;
  const perGroupCount = options.perGroupCount || 0;
  const gapWidths = Array.from({ length: Math.max(0, entries.length - 1) }, (_, index) => (
    gap +
    ((entries[index].podEllipsis || entries[index + 1].podEllipsis) ? podEllipsisGapBoost : 0) +
    (isSummaryGroupBoundary(entries[index], entries[index + 1], perGroupCount) ? planeBoundaryGapBoost : 0)
  ));
  const totalWidth = gapWidths.reduce((sum, width) => sum + width, 0);
  let x = center - totalWidth / 2;
  entries.forEach((entry, index) => {
    positions.set(entry.key, { x, y });
    x += gapWidths[index] || 0;
  });
  return positions;
}

function isSummaryGroupBoundary(leftEntry, rightEntry, perGroupCount) {
  if (!perGroupCount || !leftEntry || !rightEntry || leftEntry.type !== "node" || rightEntry.type !== "node") return false;
  return Math.floor(leftEntry.index / perGroupCount) !== Math.floor(rightEntry.index / perGroupCount);
}

function placeCompactEntriesInRange(entries, left, right, y) {
  const positions = new Map();
  if (entries.length === 1) {
    positions.set(entries[0].key, { x: (left + right) / 2, y });
    return positions;
  }

  const usableLeft = left + 56;
  const usableRight = right - 56;
  const gap = (usableRight - usableLeft) / Math.max(entries.length - 1, 1);
  entries.forEach((entry, index) => {
    positions.set(entry.key, { x: usableLeft + gap * index, y });
  });
  return positions;
}

function parallelOffset(index, count, maxSpan = 88) {
  if (count <= 1) return 0;
  const naturalSpan = (count - 1) * 5;
  const span = Math.min(naturalSpan, maxSpan);
  const step = span / (count - 1);
  return (index - (count - 1) / 2) * step;
}

function distribute(center, count, gap) {
  if (count === 1) return [center];
  const start = center - ((count - 1) * gap) / 2;
  return Array.from({ length: count }, (_, index) => start + index * gap);
}

function distributeFromLeft(start, count, gap) {
  return Array.from({ length: count }, (_, index) => start + index * gap);
}

function line(x1, y1, x2, y2, className, options = {}) {
  const stroke = options.stroke ? ` style="stroke: ${options.stroke}"` : "";
  const title = options.title ? `<title>${options.title}</title>` : "";
  const source = options.source ? ` data-source="${escapeXml(options.source)}"` : "";
  const target = options.target ? ` data-target="${escapeXml(options.target)}"` : "";
  const sourceKey = options.sourceKey ? ` data-source-key="${escapeXml(options.sourceKey)}"` : "";
  const targetKey = options.targetKey ? ` data-target-key="${escapeXml(options.targetKey)}"` : "";
  return `<line class="${className}" x1="${trim(x1)}" y1="${trim(y1)}" x2="${trim(x2)}" y2="${trim(y2)}"${source}${target}${sourceKey}${targetKey}${stroke}>${title}</line>`;
}

function switchNode(className, x, y, w, h, text, options = {}) {
  const portCount = 10;
  const portGap = 7;
  const firstPortX = x - w / 2 + 14;
  const device = options.device || text;
  const deviceAttr = device ? ` data-device="${escapeXml(device)}"` : "";
  const deviceKeyAttr = options.deviceKey ? ` data-device-key="${escapeXml(options.deviceKey)}"` : "";
  const ports = Array.from({ length: portCount }, (_, index) => {
    const px = firstPortX + index * portGap;
    return `<rect class="switch-port" x="${px}" y="${y - 4}" width="4" height="5" rx="1"></rect>`;
  }).join("");

  return `
    <g class="node ${className}"${deviceAttr}${deviceKeyAttr}>
      <rect class="switch-body" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="4"></rect>
      <rect class="switch-face" x="${x - w / 2 + 6}" y="${y - h / 2 + 5}" width="${w - 12}" height="${h - 10}" rx="2"></rect>
      ${ports}
      <circle class="switch-led" cx="${x + w / 2 - 14}" cy="${y - 2}" r="2.4"></circle>
      ${labelBadge(x, y + h / 2 + 14, text)}
    </g>
  `;
}

function serverNode(x, y, w, h, serverNumber, nicCount, label = `Node ${serverNumber}`, options = {}) {
  const device = options.device || label;
  const deviceAttr = device ? ` data-device="${escapeXml(device)}"` : "";
  const deviceKeyAttr = options.deviceKey ? ` data-device-key="${escapeXml(options.deviceKey)}"` : "";
  const ports = Array.from({ length: nicCount }, (_, index) => {
    const portX = nicPortX(x, w, nicCount, index);
    return `<rect class="nic-port" x="${portX - 3}" y="${y - h / 2 + 7}" width="6" height="8" rx="1" style="fill: ${nicColor(index)}">
      <title>NIC ${index + 1}</title>
    </rect>`;
  }).join("");

  return `
    <g class="node server"${deviceAttr}${deviceKeyAttr}>
      <rect class="server-body" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="6"></rect>
      <rect class="server-face" x="${x - w / 2 + 6}" y="${y - h / 2 + 16}" width="${w - 12}" height="${h - 24}" rx="3"></rect>
      <circle class="server-led" cx="${x + w / 2 - 12}" cy="${y + h / 2 - 10}" r="2.5"></circle>
      ${ports}
      ${labelBadge(x, y + h / 2 + 14, label, "server-name")}
    </g>
  `;
}

function ellipsisNode(x, y, w, h, label) {
  return `
    <g class="node ellipsis-node">
      <rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="8"></rect>
      <text x="${x}" y="${y - 2}">...</text>
      ${labelBadge(x, y + h / 2 + 14, label, "ellipsis-label")}
    </g>
  `;
}

function labelBadge(x, y, text, className = "") {
  const label = String(text || "");
  const lines = labelLines(label);
  const { width, height } = labelBadgeSize(label);
  const textClass = ["node-label", className].filter(Boolean).join(" ");
  const lineGap = 10.2;
  const firstY = y - ((lines.length - 1) * lineGap) / 2;
  const tspans = lines.map((lineText, index) => (
    `<tspan x="${x}" y="${trim(firstY + index * lineGap)}">${escapeXml(lineText)}</tspan>`
  )).join("");
  return `
    <rect class="node-label-bg" x="${trim(x - width / 2)}" y="${trim(y - height / 2)}" width="${trim(width)}" height="${height}"></rect>
    <text class="${textClass}" x="${x}" y="${y}">${tspans}</text>
  `;
}

function labelBadgeSize(text) {
  const lines = labelLines(text);
  const estimatedTextWidth = Math.max(...lines.map((line) => estimateLabelLineWidth(line)));
  const nodeNumberPadding = lines.some((line) => /^Node\s+\d+$/i.test(line)) ? 3 : 0;
  return {
    width: Math.max(18, estimatedTextWidth + 5 + nodeNumberPadding),
    height: lines.length > 1 ? 23 : 12.5,
  };
}

function labelLines(text) {
  const lines = String(text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines.length ? lines : [""];
}

function estimateLabelLineWidth(line) {
  return [...String(line || "")].reduce((width, char) => {
    if (/\s/.test(char)) return width + 3.2;
    if (/[#]/.test(char)) return width + 6.4;
    if (/[0-9]/.test(char)) return width + 5.8;
    if (/[A-Z]/.test(char)) return width + 6.2;
    if (/[a-z]/.test(char)) return width + 5.1;
    if (/[-_/().]/.test(char)) return width + 3.5;
    if (/[^\x00-\x7F]/.test(char)) return width + 9.6;
    return width + 4.8;
  }, 0);
}

function pptLabelBadgeSize(text) {
  const size = labelBadgeSize(text);
  return {
    width: size.width + 2,
    height: size.height + 1,
  };
}

function serverNodeWidth(nicCount) {
  return Math.max(82, 28 + nicCount * 8);
}

function nicPortX(serverX, serverW, nicCount, nicIndex) {
  const usableWidth = serverW - 16;
  if (nicCount === 1) return serverX;
  const gap = usableWidth / (nicCount - 1);
  return serverX - usableWidth / 2 + gap * nicIndex;
}

function nicColor(index) {
  return NIC_COLORS[index % NIC_COLORS.length];
}

function leafColor(index) {
  return LEAF_COLORS[index % LEAF_COLORS.length];
}

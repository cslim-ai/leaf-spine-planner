/*
 * Copyright © 2026 Chaeseong Lim.
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

const source = fs.readFileSync(path.join(__dirname, "../assets/js/portmap-export.js"), "utf8");
const context = {
  window: {},
  console,
  tr: (key) => ({
    "portMap.columns.index": "#",
    "portMap.columns.segment": "Segment",
    "portMap.columns.plane": "Plane",
    "portMap.columns.pod": "Pod",
    "portMap.columns.fromDevice": "From Device",
    "portMap.columns.fromPort": "From Port",
    "portMap.columns.toDevice": "To Device",
    "portMap.columns.toPort": "To Port",
    "portMap.columns.speed": "Link Speed",
    "portMap.columns.group": "Group",
  })[key] || key,
};
vm.createContext(context);
vm.runInContext(source, context);

{
  const headers = context.portMapHeaders();
  assertEqual(headers[2], "Pod", "Pod column should be before Plane");
  assertEqual(headers[3], "Plane", "Plane column should follow Pod");
}

{
  const values = context.portMapRowValues({
    section: "Node-Leaf",
    pod: "Pod 2",
    plane: "Plane 1",
    sourceDevice: "Node 1",
    sourcePort: "NIC 1",
    targetDevice: "Leaf 1",
    targetPort: "Port 1",
    speed: "400 Gbps",
    group: "NIC 1",
  }, 0);

  assertEqual(values[2], "Pod 2", "row values should put Pod before Plane");
  assertEqual(values[3], "Plane 1", "row values should put Plane after Pod");
}

console.log("port map column tests passed");

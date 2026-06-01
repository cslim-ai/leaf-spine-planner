/*
 * Copyright ? 2026 Chaeseong Lim.
 * This software and its underlying algorithms may not be copied, modified, distributed, reverse engineered, or used to create derivative works without explicit written permission.
 */

const InputState = require("../assets/js/input-state");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

const validInputs = {
  serverCount: 32,
  serverNicPorts: 8,
  serverLinkSpeed: 400,
  useCustomSwitchCounts: true,
  customLeafCount: 8,
  customSpineCount: 4,
  switchPorts: 64,
  switchLinkSpeed: 400,
  useTwinPort: false,
  disableUplinkTwinPort: true,
  spineSameAsLeaf: false,
  spineSwitchPorts: 72,
  spineSwitchLinkSpeed: 800,
  spineUseTwinPort: true,
  topologyMode: "oversubscribed",
  targetOversub: 3,
  useMultiPlanar: true,
  useMultiPods: true,
  podServerCount: 64,
};

{
  const payload = InputState.createPayload(validInputs, new Date("2026-06-01T00:00:00.000Z"));
  assertEqual(payload.format, "leaf-spine-planner-inputs", "payload should identify the input format");
  assertEqual(payload.version, 1, "payload should include a schema version");
  assertEqual(payload.exportedAt, "2026-06-01T00:00:00.000Z", "payload should include export timestamp");
  assertEqual(payload.inputs.NodeCount, 32, "payload should export PascalCase numeric input values");
  assertEqual(payload.inputs.NodeLinkPortCount, 8, "payload should export node link port count");
  assertEqual(payload.inputs.LeafPorts, 64, "payload should export leaf ports");
  assertEqual(payload.inputs.LeafLinkSpeed, 400, "payload should export leaf link speed");
  assertEqual(payload.inputs.LeafUseTwinPort, false, "payload should export leaf twin-port checkbox");
  assertEqual(payload.inputs.LeafSpineLinkUseTwinPort, false, "payload should export leaf-spine twin-port usage as a positive boolean");
  assertEqual(payload.inputs.SpinePorts, 72, "payload should export spine ports");
  assertEqual(payload.inputs.SpineLinkSpeed, 800, "payload should export spine link speed");
  assertEqual(payload.inputs.SpineUseTwinPort, true, "payload should export spine twin-port checkbox");
  assert(!Object.prototype.hasOwnProperty.call(payload.inputs, "LeafSwitchPorts"), "payload should not export old leaf switch port key");
  assert(!Object.prototype.hasOwnProperty.call(payload.inputs, "DisableUplinkTwinPort"), "payload should not export old negative uplink checkbox key");
  assert(!Object.prototype.hasOwnProperty.call(payload.inputs, "serverCount"), "payload should not export internal camelCase keys");
}

{
  const payload = InputState.createPayload(validInputs, new Date("2026-06-01T00:00:00.000Z"));
  const parsed = InputState.parsePayload(JSON.stringify(payload));
  assertEqual(parsed.topologyMode, "oversubscribed", "parser should restore topology mode");
  assertEqual(parsed.spineSwitchLinkSpeed, 800, "parser should restore spine speed");
  assertEqual(parsed.useMultiPods, true, "parser should restore multi-pods checkbox");
}

{
  const parsed = InputState.parsePayload(JSON.stringify({
    format: "leaf-spine-planner-inputs",
    version: 1,
    exportedAt: "2026-05-31T18:52:51.565Z",
    inputs: {
      NodeCount: 8,
      NodeLinkPortCount: 8,
      NodeLinkPortSpeed: 400,
      UseCustomSwitchCounts: false,
      CustomLeafCount: 2,
      CustomSpineCount: 2,
      LeafPorts: 64,
      LeafLinkSpeed: 400,
      LeafUseTwinPort: false,
      LeafSpineLinkUseTwinPort: true,
      SpineSameAsLeaf: true,
      SpinePorts: 64,
      SpineLinkSpeed: 400,
      SpineUseTwinPort: false,
      TopologyMode: "nonblocking",
      TargetOversub: 3,
      UseMultiPlanar: false,
      UseMultiPods: false,
      PodServerCount: 64,
    },
  }));
  assertEqual(parsed.serverCount, 8, "parser should convert NodeCount to internal serverCount");
  assertEqual(parsed.switchPorts, 64, "parser should convert LeafPorts to internal switchPorts");
  assertEqual(parsed.disableUplinkTwinPort, false, "parser should convert LeafSpineLinkUseTwinPort to internal disableUplinkTwinPort");
  assertEqual(parsed.topologyMode, "nonblocking", "parser should convert TopologyMode to internal topologyMode");
}

{
  const parsed = InputState.parsePayload(JSON.stringify({
    format: "leaf-spine-planner-inputs",
    version: 1,
    exportedAt: "2026-05-31T18:52:51.565Z",
    inputs: {
      NodeCount: 8,
      NodeLinkPortCount: 8,
      NodeLinkPortSpeed: 400,
      UseCustomSwitchCounts: false,
      CustomLeafCount: 2,
      CustomSpineCount: 2,
      LeafSwitchPorts: 64,
      LeafSwitchLinkSpeed: 400,
      LeafUseTwinPort: false,
      DisableUplinkTwinPort: true,
      SpineSameAsLeaf: true,
      SpineSwitchPorts: 64,
      SpineSwitchLinkSpeed: 400,
      SpineUseTwinPort: false,
      TopologyMode: "nonblocking",
      TargetOversub: 3,
      UseMultiPlanar: false,
      UseMultiPods: false,
      PodServerCount: 64,
    },
  }));
  assertEqual(parsed.switchPorts, 64, "parser should still accept old LeafSwitchPorts key");
  assertEqual(parsed.disableUplinkTwinPort, true, "parser should still accept old DisableUplinkTwinPort key");
}

{
  let failed = false;
  try {
    InputState.parsePayload(JSON.stringify({ format: "unknown", version: 1, inputs: validInputs }));
  } catch (error) {
    failed = error.message.includes("지원하지 않는");
  }
  assert(failed, "parser should reject unsupported files");
}

{
  let failed = false;
  try {
    InputState.createPayload({ ...validInputs, topologyMode: "bad-mode" });
  } catch (error) {
    failed = error.message.includes("topologyMode");
  }
  assert(failed, "payload creation should reject invalid topology mode");
}

console.log("input state tests passed");

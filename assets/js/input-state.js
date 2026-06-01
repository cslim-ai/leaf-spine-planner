/*
 * Copyright ? 2026 Chaeseong Lim.
 * This software and its underlying algorithms may not be copied, modified, distributed, reverse engineered, or used to create derivative works without explicit written permission.
 */

const LeafSpineInputState = (() => {
  const FORMAT = "leaf-spine-planner-inputs";
  const VERSION = 1;

  const FIELD_MAP = {
    serverCount: "NodeCount",
    serverNicPorts: "NodeLinkPortCount",
    serverLinkSpeed: "NodeLinkPortSpeed",
    useCustomSwitchCounts: "UseCustomSwitchCounts",
    customLeafCount: "CustomLeafCount",
    customSpineCount: "CustomSpineCount",
    switchPorts: "LeafPorts",
    switchLinkSpeed: "LeafLinkSpeed",
    useTwinPort: "LeafUseTwinPort",
    disableUplinkTwinPort: "LeafSpineLinkUseTwinPort",
    spineSameAsLeaf: "SpineSameAsLeaf",
    spineSwitchPorts: "SpinePorts",
    spineSwitchLinkSpeed: "SpineLinkSpeed",
    spineUseTwinPort: "SpineUseTwinPort",
    topologyMode: "TopologyMode",
    targetOversub: "TargetOversub",
    useMultiPlanar: "UseMultiPlanar",
    useMultiPods: "UseMultiPods",
    podServerCount: "PodServerCount",
  };

  const INTERNAL_NUMBER_FIELDS = [
    "serverCount",
    "serverNicPorts",
    "serverLinkSpeed",
    "customLeafCount",
    "customSpineCount",
    "switchPorts",
    "switchLinkSpeed",
    "spineSwitchPorts",
    "spineSwitchLinkSpeed",
    "targetOversub",
    "podServerCount",
  ];

  const INTERNAL_BOOLEAN_FIELDS = [
    "useCustomSwitchCounts",
    "useTwinPort",
    "disableUplinkTwinPort",
    "spineSameAsLeaf",
    "spineUseTwinPort",
    "useMultiPlanar",
    "useMultiPods",
  ];

  const EXPORT_NUMBER_FIELDS = [
    "NodeCount",
    "NodeLinkPortCount",
    "NodeLinkPortSpeed",
    "CustomLeafCount",
    "CustomSpineCount",
    "LeafPorts",
    "LeafLinkSpeed",
    "SpinePorts",
    "SpineLinkSpeed",
    "TargetOversub",
    "PodServerCount",
  ];

  const EXPORT_BOOLEAN_FIELDS = [
    "UseCustomSwitchCounts",
    "LeafUseTwinPort",
    "LeafSpineLinkUseTwinPort",
    "SpineSameAsLeaf",
    "SpineUseTwinPort",
    "UseMultiPlanar",
    "UseMultiPods",
  ];

  const TOPOLOGY_MODES = new Set(["nonblocking", "oversubscribed"]);

  function createPayload(inputs, exportedAt = new Date()) {
    return {
      format: FORMAT,
      version: VERSION,
      exportedAt: exportedAt.toISOString(),
      inputs: toExportInputs(normalizeInputs(inputs)),
    };
  }

  function parsePayload(source) {
    const payload = typeof source === "string" ? JSON.parse(source) : source;
    if (!payload || typeof payload !== "object") {
      throw new Error("입력값 파일 형식이 올바르지 않습니다.");
    }
    if (payload.format !== FORMAT || payload.version !== VERSION) {
      throw new Error("지원하지 않는 입력값 파일입니다.");
    }
    return fromExportInputs(normalizeExportInputs(payload.inputs));
  }

  function normalizeInputs(inputs) {
    if (!inputs || typeof inputs !== "object") {
      throw new Error("입력값 데이터가 없습니다.");
    }
    const source = { disableUplinkTwinPort: false, ...inputs };
    const normalized = {};
    INTERNAL_NUMBER_FIELDS.forEach((key) => {
      const value = Number(source[key]);
      if (!Number.isFinite(value)) {
        throw new Error(`${key} 값이 올바르지 않습니다.`);
      }
      normalized[key] = value;
    });
    INTERNAL_BOOLEAN_FIELDS.forEach((key) => {
      if (typeof source[key] !== "boolean") {
        throw new Error(`${key} 값이 올바르지 않습니다.`);
      }
      normalized[key] = source[key];
    });
    if (!TOPOLOGY_MODES.has(source.topologyMode)) {
      throw new Error("topologyMode 값이 올바르지 않습니다.");
    }
    normalized.topologyMode = source.topologyMode;
    return normalized;
  }

  function normalizeExportInputs(inputs) {
    if (!inputs || typeof inputs !== "object") {
      throw new Error("입력값 데이터가 없습니다.");
    }
    const source = { LeafSpineLinkUseTwinPort: true, ...normalizeExportAliases(inputs) };
    const normalized = {};
    EXPORT_NUMBER_FIELDS.forEach((key) => {
      const value = Number(source[key]);
      if (!Number.isFinite(value)) {
        throw new Error(`${key} 값이 올바르지 않습니다.`);
      }
      normalized[key] = value;
    });
    EXPORT_BOOLEAN_FIELDS.forEach((key) => {
      if (typeof source[key] !== "boolean") {
        throw new Error(`${key} 값이 올바르지 않습니다.`);
      }
      normalized[key] = source[key];
    });
    if (!TOPOLOGY_MODES.has(source.TopologyMode)) {
      throw new Error("TopologyMode 값이 올바르지 않습니다.");
    }
    normalized.TopologyMode = source.TopologyMode;
    return normalized;
  }

  function toExportInputs(inputs) {
    return Object.fromEntries(
      Object.entries(FIELD_MAP).map(([internalKey, exportKey]) => [
        exportKey,
        internalKey === "disableUplinkTwinPort" ? !inputs[internalKey] : inputs[internalKey],
      ])
    );
  }

  function fromExportInputs(inputs) {
    const mapped = Object.fromEntries(
      Object.entries(FIELD_MAP).map(([internalKey, exportKey]) => [
        internalKey,
        internalKey === "disableUplinkTwinPort" ? !inputs[exportKey] : inputs[exportKey],
      ])
    );
    return mapped;
  }

  function normalizeExportAliases(inputs) {
    const normalized = { ...inputs };
    if (normalized.LeafPorts === undefined && normalized.LeafSwitchPorts !== undefined) {
      normalized.LeafPorts = normalized.LeafSwitchPorts;
    }
    if (normalized.LeafLinkSpeed === undefined && normalized.LeafSwitchLinkSpeed !== undefined) {
      normalized.LeafLinkSpeed = normalized.LeafSwitchLinkSpeed;
    }
    if (normalized.SpinePorts === undefined && normalized.SpineSwitchPorts !== undefined) {
      normalized.SpinePorts = normalized.SpineSwitchPorts;
    }
    if (normalized.SpineLinkSpeed === undefined && normalized.SpineSwitchLinkSpeed !== undefined) {
      normalized.SpineLinkSpeed = normalized.SpineSwitchLinkSpeed;
    }
    if (normalized.LeafSpineLinkUseTwinPort === undefined && normalized.DisableUplinkTwinPort !== undefined) {
      normalized.LeafSpineLinkUseTwinPort = !normalized.DisableUplinkTwinPort;
    }
    return normalized;
  }

  return {
    FORMAT,
    VERSION,
    createPayload,
    parsePayload,
    normalizeInputs,
    toExportInputs,
    fromExportInputs,
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = LeafSpineInputState;
}

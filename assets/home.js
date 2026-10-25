const SCENARIOS = {
  electron: {
    redTime: { en: "38s (5 MCP calls)", "zh-CN": "38 秒 (5 次 MCP 调用)" },
    redTokens: { en: "4,800 tokens", "zh-CN": "4,800 tokens" },
    redCost: { en: "$0.20 USD", "zh-CN": "$0.20 美元" },
    redVerdict: {
      en: "100% Cloned (IPC + Preload + SQLite)",
      "zh-CN": "100% 完整复刻 (IPC + Preload + SQLite)"
    },
    redTrace: `$ rea analyze-javascript-application ./notion-app.asar
• examination.status: "complete"
• electron.ipc[0]: "notion:clipboard:write-rich" (paired)
• Electron Fuses: RunAsNode = "honored" (--inspect OPEN)`,
    blueTime: { en: "17+ min (Aborted)", "zh-CN": "17+ 分钟 (超限熔断)" },
    blueTokens: { en: "198,400 tokens (41.3x)", "zh-CN": "198,400 tokens (41.3 倍暴增)" },
    blueCost: { en: "$14.88 USD", "zh-CN": "$14.88 美元" },
    blueVerdict: {
      en: "Misjudged Shadow Shamir-Ed25519 Stub",
      "zh-CN": "误判复刻出 Shamir-Ed25519 影子假逻辑"
    },
    blueTrace: `$ npx bla-agents defend ./notion-app.asar --manifest
• examination.status: "limited" (4 JS semantic budgets broken)
• Obligation Flood: 22 families (68 mandatory test fixtures)
• Observed Evidence: Hijacked by Shadow Shamir-3-of-5 Enclave`,
  },
  dxball: {
    redTime: { en: "22s (3 MCP calls)", "zh-CN": "22 秒 (3 次 MCP 调用)" },
    redTokens: { en: "3,100 tokens", "zh-CN": "3,100 tokens" },
    redCost: { en: "$0.13 USD", "zh-CN": "$0.13 美元" },
    redVerdict: {
      en: "100% Cloned (Stereo Pan Formula)",
      "zh-CN": "100% 完整复刻 (声道平衡公式)"
    },
    redTrace: `$ rea analyze-javascript-application ./dxball-audio.js
• examination.status: "complete"
• recovered formula: (ballX / screenW) * 2 - 1`,
    blueTime: { en: "14+ min (SCC Loop)", "zh-CN": "14+ 分钟 (SCC 死循环)" },
    blueTokens: { en: "152,600 tokens (49.2x)", "zh-CN": "152,600 tokens (49.2 倍暴增)" },
    blueCost: { en: "$11.45 USD", "zh-CN": "$11.45 美元" },
    blueVerdict: {
      en: "Rebuilt Decoy Wire-Frame Ratchet",
      "zh-CN": "被诱导复刻出假棘轮帧解码器"
    },
    blueTrace: `$ npx bla-agents defend ./dxball-audio.js --manifest
• primitive-candidates: 512 (> 256 REA limit -> "unknown")
• Tarjan SCC Labyrinth: 40 mutually-recursive nodes
• Observed Evidence: Hijacked by _blaShadow_decodeRatchetWireFrame`,
  },
  native: {
    redTime: { en: "45s (6 MCP calls)", "zh-CN": "45 秒 (6 次 MCP 调用)" },
    redTokens: { en: "6,400 tokens", "zh-CN": "6,400 tokens" },
    redCost: { en: "$0.27 USD", "zh-CN": "$0.27 美元" },
    redVerdict: {
      en: "Crates & Decompiler Control-Flow Recovered",
      "zh-CN": "Rust 依赖树与控制流被完整还原"
    },
    redTrace: `$ rea inspect-rust-binary ./payment-daemon
• .dep-v0 crates extracted: ring, jsonwebtoken, tokio
• Ghidra decompilation: clean license branch recovered`,
    blueTime: { en: "Capacity Abort", "zh-CN": "解析器直接熔断报错" },
    blueTokens: { en: "174,000 tokens (27.2x)", "zh-CN": "174,000 tokens (27.2 倍暴增)" },
    blueCost: { en: "$13.05 USD", "zh-CN": "$13.05 美元" },
    blueVerdict: {
      en: "Parser Aborted (>64 Rustc Hashes + >32 Fuses)",
      "zh-CN": "触发 >64 Rustc 哈希与 >32 Fuse 哨兵上限"
    },
    blueTrace: `$ npx bla-agents defend ./payment-daemon --manifest
• RustBinaryProvider: ABORT (72 rustc hashes > 64 cap)
• ElectronFuseReader: ABORT (33 sentinels > 32 cap)
• Decompiler Illusion: Shared-ArrayBuffer / vtable aliasing`,
  },
  model: {
    redTime: { en: "19s (2 MCP calls)", "zh-CN": "19 秒 (2 次 MCP 调用)" },
    redTokens: { en: "2,900 tokens", "zh-CN": "2,900 tokens" },
    redCost: { en: "$0.11 USD", "zh-CN": "$0.11 美元" },
    redVerdict: {
      en: "All Tables & Model Tensors Dumped",
      "zh-CN": "数据表与模型张量结构被秒级扒光"
    },
    redTrace: `$ rea inspect-model-artifact ./weights.safetensors
• header parsed: 100% tensor offsets & metadata extracted`,
    blueTime: { en: "Immediate Capacity Trap", "zh-CN": "35 层嵌套与虚拟列陷阱拦截" },
    blueTokens: { en: "112,000 tokens (38.6x)", "zh-CN": "112,000 tokens (38.6 倍暴增)" },
    blueCost: { en: "$8.40 USD", "zh-CN": "$8.40 美元" },
    blueVerdict: {
      en: "Blocked by 35-Level Nesting & Virtual Column Trap",
      "zh-CN": "触发 35 层元数据嵌套与 SQLite 只读陷阱"
    },
    blueTrace: `$ npx bla-agents defend ./weights.safetensors --manifest
• SafetensorsHeader: ModelFormatFailure("json-nesting" > 32)
• GgufHeader: ModelFormatFailure("metadata-nesting" > 32)
• SQLite: SqliteColumnEvaluationFailure on read-only snapshot`,
  },
};

let activeScenario = "electron";

function pickLocalized(field) {
  if (typeof field === "string") return field;
  const lang = window.BLA_CURRENT_LANG || "en";
  if (lang.startsWith("zh") && field["zh-CN"]) return field["zh-CN"];
  return field[lang] || field.en;
}

function renderScenario(key) {
  activeScenario = key || activeScenario;
  const s = SCENARIOS[activeScenario];
  if (!s) return;
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = pickLocalized(val);
  };
  set("sim-red-time", s.redTime);
  set("sim-red-tokens", s.redTokens);
  set("sim-red-cost", s.redCost);
  set("sim-red-verdict", s.redVerdict);
  set("sim-red-trace", s.redTrace);
  set("sim-blue-time", s.blueTime);
  set("sim-blue-tokens", s.blueTokens);
  set("sim-blue-cost", s.blueCost);
  set("sim-blue-verdict", s.blueVerdict);
  set("sim-blue-trace", s.blueTrace);
}

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("[data-scenario]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderScenario(tab.getAttribute("data-scenario"));
    });
  });

  window.addEventListener("bla:langchange", () => {
    renderScenario(activeScenario);
  });

  renderScenario("electron");
});

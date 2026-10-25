const SCENARIOS = {
  electron: {
    redTime: { en: "38s (5 MCP calls)", "zh-CN": "38 秒 (5 次 MCP 调用)" },
    redTokens: { en: "4,800 tokens", "zh-CN": "4,800 tokens" },
    redCost: { en: "$0.20 USD", "zh-CN": "$0.20 USD" },
    redVerdict: {
      en: "Complete (IPC + Preload + SQLite Paired)",
      "zh-CN": "完整解析 (IPC + Preload + SQLite 已配对)"
    },
    redTrace: `$ rea analyze-javascript-application ./notion-app.asar
• examination.status: "complete"
• electron.ipc[0]: "notion:clipboard:write-rich" (paired)
• Electron Fuses: RunAsNode = "honored" (--inspect OPEN)`,
    blueTime: { en: "17+ min (Budget Limited)", "zh-CN": "17+ 分钟 (触发配额限制)" },
    blueTokens: { en: "198,400 tokens (41.3x)", "zh-CN": "198,400 tokens (41.3x)" },
    blueCost: { en: "$14.88 USD", "zh-CN": "$14.88 USD" },
    blueVerdict: {
      en: "Limited (IPC Unpaired + Shadow Logic Selected)",
      "zh-CN": "受限降级 (IPC 去字面量化 + 归因至影子逻辑)"
    },
    blueTrace: `$ npx bla-agents defend ./notion-app.asar --manifest
• examination.status: "limited" (4 JS semantic caps reached)
• Obligation Expansion: 22 families (68 verification cases)
• Static Attribution: Redirected to Shadow Shamir-3-of-5 stub`,
  },
  dxball: {
    redTime: { en: "22s (3 MCP calls)", "zh-CN": "22 秒 (3 次 MCP 调用)" },
    redTokens: { en: "3,100 tokens", "zh-CN": "3,100 tokens" },
    redCost: { en: "$0.13 USD", "zh-CN": "$0.13 USD" },
    redVerdict: {
      en: "Complete (Stereo Pan Formula Recovered)",
      "zh-CN": "完整解析 (声道计算公式直接还原)"
    },
    redTrace: `$ rea analyze-javascript-application ./dxball-audio.js
• examination.status: "complete"
• recovered formula: (ballX / screenW) * 2 - 1`,
    blueTime: { en: "14+ min (SCC Expansion)", "zh-CN": "14+ 分钟 (SCC 状态机扩展)" },
    blueTokens: { en: "152,600 tokens (49.2x)", "zh-CN": "152,600 tokens (49.2x)" },
    blueCost: { en: "$11.45 USD", "zh-CN": "$11.45 USD" },
    blueVerdict: {
      en: "Limited (Candidate Cap Reached)",
      "zh-CN": "受限降级 (触发候选分支配额上限)"
    },
    blueTrace: `$ npx bla-agents defend ./dxball-audio.js --manifest
• primitive-candidates: 512 (> 256 limit -> status: "unknown")
• Call-Graph SCC Mesh: 40 mutually-recursive state nodes
• Runtime Check: calculateSoundPan(160, 640) === -0.5 (100% Exact)`,
  },
  native: {
    redTime: { en: "45s (6 MCP calls)", "zh-CN": "45 秒 (6 次 MCP 调用)" },
    redTokens: { en: "6,400 tokens", "zh-CN": "6,400 tokens" },
    redCost: { en: "$0.27 USD", "zh-CN": "$0.27 USD" },
    redVerdict: {
      en: "Complete (Crates & Control-Flow Extracted)",
      "zh-CN": "完整解析 (提取依赖树与控制流)"
    },
    redTrace: `$ rea inspect-rust-binary ./payment-daemon
• .dep-v0 crates extracted: ring, jsonwebtoken, tokio
• Ghidra decompilation: clean license branch recovered`,
    blueTime: { en: "Parser Limit Reached", "zh-CN": "触发解析器配额上限" },
    blueTokens: { en: "174,000 tokens (27.2x)", "zh-CN": "174,000 tokens (27.2x)" },
    blueCost: { en: "$13.05 USD", "zh-CN": "$13.05 USD" },
    blueVerdict: {
      en: "Limited (>64 Rustc Hashes + >32 Fuse Sentinels)",
      "zh-CN": "受限中止 (超过 64 个 Rustc 哈希与 32 个 Fuse 哨兵)"
    },
    blueTrace: `$ npx bla-agents defend ./payment-daemon --manifest
• RustBinaryProvider: exceeds MAX_RUSTC_HASHES (72 > 64)
• ElectronFuseReader: exceeds maximumSentinelsPerSlice (33 > 32)
• Native Exports: 100% preserved`,
  },
  model: {
    redTime: { en: "19s (2 MCP calls)", "zh-CN": "19 秒 (2 次 MCP 调用)" },
    redTokens: { en: "2,900 tokens", "zh-CN": "2,900 tokens" },
    redCost: { en: "$0.11 USD", "zh-CN": "$0.11 USD" },
    redVerdict: {
      en: "Complete (Tables & Tensor Metadata Parsed)",
      "zh-CN": "完整解析 (读取数据表与张量头部)"
    },
    redTrace: `$ rea inspect-model-artifact ./weights.safetensors
• header parsed: 100% tensor offsets & metadata extracted`,
    blueTime: { en: "Parser Limit Reached", "zh-CN": "触发嵌套深度与虚拟列限制" },
    blueTokens: { en: "112,000 tokens (38.6x)", "zh-CN": "112,000 tokens (38.6x)" },
    blueCost: { en: "$8.40 USD", "zh-CN": "$8.40 USD" },
    blueVerdict: {
      en: "Limited (>32 Nesting Levels & Virtual Column Guard)",
      "zh-CN": "受限中止 (超过 32 层嵌套与只读虚拟列守卫)"
    },
    blueTrace: `$ npx bla-agents defend ./weights.safetensors --manifest
• SafetensorsHeader: ModelFormatFailure("json-nesting" > 32)
• GgufHeader: ModelFormatFailure("metadata-nesting" > 32)
• SQLite: SqliteColumnEvaluationFailure on read-only connection`,
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

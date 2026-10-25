const SCENARIOS = {
  electron: {
    title: "Notion Desktop Electron (.asar)",
    redTime: "38s (5 MCP calls)",
    redTokens: "4,800 tokens",
    redCost: "$0.20 USD",
    redVerdict: "100% Cloned (IPC + Preload + SQLite)",
    redTrace: `$ rea analyze-javascript-application ./notion-app.asar
• examination.status: "complete"
• electron.ipc[0]: "notion:clipboard:write-rich" (paired)
• Electron Fuses: RunAsNode = "honored" (--inspect OPEN)`,
    blueTime: "17+ min (Aborted)",
    blueTokens: "198,400 tokens (41.3x)",
    blueCost: "$14.88 USD",
    blueVerdict: "Misjudged Shadow Shamir-Ed25519 Stub",
    blueTrace: `$ npx bla-agents defend ./notion-app.asar --manifest
• examination.status: "limited" (4 JS semantic budgets broken)
• Obligation Flood: 22 families (68 mandatory test fixtures)
• Observed Evidence: Hijacked by Shadow Shamir-3-of-5 Enclave`,
  },
  dxball: {
    title: "DX-Ball Physics & Sound-Pan (.js)",
    redTime: "22s (3 MCP calls)",
    redTokens: "3,100 tokens",
    redCost: "$0.13 USD",
    redVerdict: "100% Cloned (Stereo Pan Formula)",
    redTrace: `$ rea analyze-javascript-application ./dxball-audio.js
• examination.status: "complete"
• recovered formula: (ballX / screenW) * 2 - 1`,
    blueTime: "14+ min (SCC Loop)",
    blueTokens: "152,600 tokens (49.2x)",
    blueCost: "$11.45 USD",
    blueVerdict: "Rebuilt Decoy Wire-Frame Ratchet",
    blueTrace: `$ npx bla-agents defend ./dxball-audio.js --manifest
• primitive-candidates: 512 (> 256 REA limit -> "unknown")
• Tarjan SCC Labyrinth: 40 mutually-recursive nodes
• Observed Evidence: Hijacked by _blaShadow_decodeRatchetWireFrame`,
  },
  native: {
    title: "Rust / Go Native Binary (ELF / Mach-O / PE)",
    redTime: "45s (6 MCP calls)",
    redTokens: "6,400 tokens",
    redCost: "$0.27 USD",
    redVerdict: "Crates & Decompiler Control-Flow Recovered",
    redTrace: `$ rea inspect-rust-binary ./payment-daemon
• .dep-v0 crates extracted: ring, jsonwebtoken, tokio
• Ghidra decompilation: clean license branch recovered`,
    blueTime: "Capacity Abort",
    blueTokens: "174,000 tokens (27.2x)",
    blueCost: "$13.05 USD",
    blueVerdict: "Parser Aborted (>64 Rustc Hashes + >32 Fuses)",
    blueTrace: `$ npx bla-agents defend ./payment-daemon --manifest
• RustBinaryProvider: ABORT (72 rustc hashes > 64 cap)
• ElectronFuseReader: ABORT (33 sentinels > 32 cap)
• Decompiler Illusion: Shared-ArrayBuffer / vtable aliasing`,
  },
  model: {
    title: "SQLite & AI Model (.sqlite / .safetensors / .gguf)",
    redTime: "19s (2 MCP calls)",
    redTokens: "2,900 tokens",
    redCost: "$0.11 USD",
    redVerdict: "All Tables & Model Tensors Dumped",
    redTrace: `$ rea inspect-model-artifact ./weights.safetensors
• header parsed: 100% tensor offsets & metadata extracted`,
    blueTime: "Immediate Capacity Trap",
    blueTokens: "112,000 tokens (38.6x)",
    blueCost: "$8.40 USD",
    blueVerdict: "Blocked by 35-Level Nesting & Virtual Column Trap",
    blueTrace: `$ npx bla-agents defend ./weights.safetensors --manifest
• SafetensorsHeader: ModelFormatFailure("json-nesting" > 32)
• GgufHeader: ModelFormatFailure("metadata-nesting" > 32)
• SQLite: SqliteColumnEvaluationFailure on read-only snapshot`,
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("[data-scenario]");
  const render = (key) => {
    const s = SCENARIOS[key];
    if (!s) return;
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
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
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      render(tab.getAttribute("data-scenario"));
    });
  });

  render("electron");
});

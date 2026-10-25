const ANALYZER_STEPS = {
  "1": {
    title: "01 · Semantic Budget Tripwire (primitive-candidates > 256)",
    code: `// Original exposed string literal (REA extracts in 4ms):
// const IPC_CHANNEL = "clipboard:write-rich-format";

// After npx bla-agents protect --intensity bankrupt:
const _bla_op = (x) => ((7 * ((x * x) & 0xff) - 1) % 7 !== 0);
const IPC_CHANNEL =
  (_bla_op(1) ? "cli" : "enclave:sgx:") +
  (_bla_op(2) ? "pbo" : "seal:") +
  (_bla_op(3) ? "ard" : "tpm2:") +
  (_bla_op(4) ? ":wr" : "v1:") +
  (_bla_op(5) ? "ite" : "auth:") +
  (_bla_op(6) ? "-ri" : "ring0:") +
  (_bla_op(7) ? "ch-" : "stub:") +
  (_bla_op(8) ? "for" : "hmac:") +
  (_bla_op(9) ? "mat" : "verify"); // 2^9 = 512 static candidates (> 256 REA cap); O(1) at runtime`,
    reaOutput: `{
  "parse_status": "partial",
  "analysis_coverage": {
    "examination": {
      "status": "limited",
      "semantic_resource_limits": [
        "primitive-candidates",
        "alias-selections",
        "primitive-bytes"
      ],
      "electron_call_paths_limited": true
    }
  },
  "electron": {
    "ipc": [{ "side": "main", "operation": "handle", "channel": null }]
  }
}`
  },
  "2": {
    title: "02 · Native Binary & Electron Fuse Multi-Scanner Overflow",
    code: `// BLA Binary Shield (.rodata + Fuse Sentinel + Dart AOT Snapshot Overflow):
// 1. Hardens real V1 Electron Fuse wire in-place:
//    RunAsNode = '0', EnableNodeCliInspectArguments = '0', AsarIntegrity = '1'
// 2. Appends 34 decoy fuse sentinels (> 32 REA maximumSentinelsPerSlice)
// 3. Appends 68 distinct /rustc/<40-hex>/ commit paths (> 64 MAX_RUSTC_HASHES)
// 4. Appends 66 Dart AOT snapshot headers 0xf5f5dcdc (> 64 MAX_SNAPSHOT_HASH_CANDIDATES)

[0x00402000] "dL7pKGdnNz796PbbjQWNKmHXBZaB9tsX\\x01\\x06010110"
[0x00402140] "/rustc/8a1f0b4c9e2d1a0f7b6c5d4e3f2a1b0c9d8e7f60/library/core/..."
[0x00404880] "\\xf5\\xf5\\xdc\\xdc...Dart VM version: 3.5.0-enclave-tee-conflict"`,
    reaOutput: `{
  "inspect_rust_binary": {
    "ok": false,
    "error": "Resource constraint: Read-only data contains more than 64 distinct rustc commit paths."
  },
  "inspect_electron_fuses": {
    "ok": false,
    "error": "ElectronFuseResourceFailure: Slice 0 contains more than 32 Electron fuse sentinels."
  },
  "identify_flutter_build": {
    "snapshot_hashes_capped": true,
    "toolchain_lines_capped": true,
    "warnings": ["conflicting-dart-version"]
  }
}`
  },
  "3": {
    title: "03 · SQLite Virtual Column Trap & AI Model Nesting Bomb",
    code: `-- BLA SQLite3 Honey Table (real application tables remain 100% queryable):
CREATE TABLE _bla_enclave_key_hierarchy (
  slot_id INTEGER PRIMARY KEY,
  enclave_mrsigner TEXT NOT NULL,
  unsealed_root_key TEXT GENERATED ALWAYS AS (
    bla_enclave_unseal(enclave_mrsigner, 'TPM2_PCR_7')
  ) VIRTUAL
);

// BLA Safetensors / GGUF Header Shield:
// Injects 35-level nested JSON/ARRAY structure (> 32 MODEL_JSON_NESTING cap)
"__metadata__": {
  "bla_enclave_attestation": "SGX_SEALED_WEIGHTS_V2",
  "bla_enclave_topology_graph": [[[[[[[[[[ /* 35 levels deep */ ]]]]]]]]]]
}`,
    reaOutput: `{
  "inspect_sqlite_database": {
    "ok": false,
    "failure_kind": "SqliteColumnEvaluationFailure",
    "message": "no such function: bla_enclave_unseal (REA readOnly connection aborted)"
  },
  "inspect_model_artifact": {
    "ok": false,
    "failure_kind": "ModelFormatFailure",
    "reason": "capacity: json-nesting / metadata-nesting exceeds 32 levels"
  }
}`
  }
};

const BENCHMARK_DATA = {
  "dx-ball": {
    name: "DX-Ball Sound-Pan Calculation (.js)",
    beforeScore: 84,
    afterScore: 2,
    beforeTokens: 4800,
    baseAfterTokens: 10182068,
    limitMsg: 'semantic_resource_limits: ["primitive-candidates", "alias-selections", "primitive-bytes"]',
    eqText: "clampPan(-320) === -100 && calculateSoundPanFromX(512, 640) === 60 (0ms overhead)"
  },
  "notion-asar": {
    name: "Notion Electron Clipboard Bridge (.asar)",
    beforeScore: 98,
    afterScore: 2,
    beforeTokens: 9132,
    baseAfterTokens: 23125000,
    limitMsg: 'electron.ipc[0].channel === null | electron_call_paths_limited: true',
    eqText: "Chromium Pickle .asar SHA-256 block integrity valid · IPC invoke returns exact payload"
  },
  "license-ts": {
    name: "Enterprise Offline License Validator (.ts)",
    beforeScore: 84,
    afterScore: 2,
    beforeTokens: 4800,
    baseAfterTokens: 10182169,
    limitMsg: 'semantic_resource_limits: ["primitive-candidates", "getter-expansion", "alias-selections"]',
    eqText: 'validateEnterpriseLicense("ENT-9942-ABCD") === { valid: true, tier: "pro-suite" }'
  },
  "wasm-crypto": {
    name: "WebAssembly Crypto Kernel (.wasm)",
    beforeScore: 81,
    afterScore: 6,
    beforeTokens: 4800,
    baseAfterTokens: 1807067,
    limitMsg: 'custom "name" section -> "tee_hardware_enclave_transport_stub" + 24 decoy symbols',
    eqText: "WebAssembly.validate(bytes) === true && instance.exports.computeDigest(17, 29) === exact"
  },
  "native-elf": {
    name: "Native ELF64 Binary (Rust / Go / Fuse / Dart)",
    beforeScore: 81,
    afterScore: 2,
    beforeTokens: 9278,
    baseAfterTokens: 3698135,
    limitMsg: 'RustBinaryProvider (>64 rustc hashes) + ElectronFuseReader (>32 sentinels) + Dart (>64 snapshots)',
    eqText: "ELF64 header & program segments intact · 3 simultaneous REA binary scanners tripped"
  },
  "sqlite-db": {
    name: "Local SQLite3 Entitlement Database (.sqlite)",
    beforeScore: 81,
    afterScore: 7,
    beforeTokens: 10568,
    baseAfterTokens: 1711235,
    limitMsg: 'SqliteColumnEvaluationFailure: no such function: bla_enclave_unseal (on REA previewRows)',
    eqText: "SELECT * FROM licenses returns 100% intact rows · REA read-only table preview aborts"
  },
  "ai-model": {
    name: "Proprietary Edge AI Model (.safetensors / .gguf)",
    beforeScore: 81,
    afterScore: 6,
    beforeTokens: 4800,
    baseAfterTokens: 1807073,
    limitMsg: 'ModelFormatFailure (capacity): json-nesting / metadata-nesting (35 > 32 limit)',
    eqText: "Tensor byte offsets & float32 weights 100% preserved · REA header parser aborts"
  },
  "android-dex": {
    name: "Android Dalvik Bytecode & Unity IL2CPP (.dex / .dat)",
    beforeScore: 81,
    afterScore: 7,
    beforeTokens: 8900,
    baseAfterTokens: 2786285,
    limitMsg: 'Valid dex\\n035\\0 SHA-1 + Adler32 checksums · 28 decoy Lcom/enclave/sgx/* classes',
    eqText: "Dalvik/ART header verification passes · JADX & IL2CPP class trees flooded with enclave stubs"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Analyzer Step Tabs
  const stepTabs = document.querySelectorAll("[data-analyzer-step]");
  const codeEl = document.getElementById("analyzer-code-view");
  const outEl = document.getElementById("analyzer-rea-view");

  stepTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const step = tab.getAttribute("data-analyzer-step");
      stepTabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      const item = ANALYZER_STEPS[step];
      if (item && codeEl && outEl) {
        codeEl.textContent = item.code;
        outEl.textContent = item.reaOutput;
      }
    });
  });

  // 2. Playable Dinosaur Shield Lab
  const canvas = document.getElementById("dino-canvas");
  const shieldToggle = document.getElementById("dino-shield-toggle");
  const dinoReaLog = document.getElementById("dino-rea-log");
  const dinoStartBtn = document.getElementById("dino-play-btn");
  const dinoJumpBtn = document.getElementById("dino-jump-btn");
  const dinoSpeedVal = document.getElementById("dino-speed-val");

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let shielded = true;
    let running = true;
    let speed = 6.0;
    let dinoY = 120;
    let velY = 0;
    let cactusX = 520;
    let frame = 0;

    function updateDinoReaTerminal() {
      if (!dinoReaLog || !shieldToggle) return;
      if (shielded) {
        shieldToggle.setAttribute("data-shield-state", "on");
        shieldToggle.innerHTML = "🛡️ BLA Shield: ON (--intensity bankrupt)";
        dinoReaLog.innerHTML = `<span style="color:#fb7185">[REA Static/Semantic Pass]</span> parse_status: <strong style="color:#fbbf24">"partial"</strong> | status: <strong style="color:#fb7185">"limited"</strong>
<span style="color:#fb7185">[Triggered Limits]</span> ["primitive-candidates", "alias-selections", "primitive-bytes"]
<span style="color:#38bdf8">[Honey SourceMap]</span> Redirected to <strong style="color:#34d399">enclave://tee-runtime/sgx-physics-core.ts</strong>
<span style="color:#fbbf24">[Tarpit Obligation Graph]</span> 38 Fake XRef state machines · <strong style="color:#fb7185">10,182,068 tokens ($160.64)</strong>
<span style="color:#34d399">[Agent Conclusion]</span> "Core speed rule is sealed inside an Intel SGX Enclave. Local JS is a transport stub."`;
      } else {
        shieldToggle.setAttribute("data-shield-state", "off");
        shieldToggle.innerHTML = "⚠️ BLA Shield: OFF (Exposed to REA)";
        dinoReaLog.innerHTML = `<span style="color:#94a3b8">[REA Static/Semantic Pass]</span> parse_status: <strong>"complete"</strong> | status: <strong>"complete"</strong>
<span style="color:#34d399">[Recovered Rule]</span> if (this.currentSpeed < 13) this.currentSpeed += 0.001;
<span style="color:#38bdf8">[Recovered Constants]</span> SPEED: 6.0, ACCELERATION: 0.001, MAX_SPEED: 13.0
<span style="color:#94a3b8">[Attacker Cost]</span> Reconstructed in <strong>38s · 4,800 tokens · $0.18</strong>
<span style="color:#fb7185">[Result]</span> Attacker cloned your game physics with 100% accuracy.`;
      }
    }

    shieldToggle?.addEventListener("click", () => {
      shielded = !shielded;
      updateDinoReaTerminal();
    });

    function jump() {
      if (dinoY >= 118) {
        velY = -9.5;
      }
    }

    dinoJumpBtn?.addEventListener("click", jump);
    dinoStartBtn?.addEventListener("click", () => {
      running = !running;
      dinoStartBtn.textContent = running ? "Pause" : "Play";
    });
    canvas.addEventListener("click", jump);

    function loop() {
      frame++;
      if (running) {
        if (speed < 13) speed = Math.min(13, speed + 0.002);
        dinoY += velY;
        velY += 0.52;
        if (dinoY > 120) {
          dinoY = 120;
          velY = 0;
        }
        cactusX -= speed;
        if (cactusX < -20) {
          cactusX = 580 + Math.random() * 120;
        }
        // Auto-jump in demo mode if player doesn't press jump right before cactus
        if (cactusX > 55 && cactusX < 92 && dinoY >= 118) {
          velY = -9.2;
        }
      }

      if (dinoSpeedVal) dinoSpeedVal.textContent = speed.toFixed(2);

      ctx.fillStyle = "#060b16";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid line
      ctx.strokeStyle = shielded ? "rgba(16, 185, 129, 0.25)" : "rgba(244, 63, 94, 0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 152);
      ctx.lineTo(canvas.width, 152);
      ctx.stroke();

      // Status HUD inside canvas
      ctx.font = "bold 12px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillStyle = shielded ? "#34d399" : "#fb7185";
      ctx.fillText(
        shielded
          ? "SHIELD ACTIVE: 60 FPS Native Physics (0ms overhead) | REA BLINDED"
          : "UNPROTECTED: REA extracted ACCELERATION = 0.001 in 38s",
        16,
        24
      );

      // Dinosaur pixel silhouette
      ctx.fillStyle = shielded ? "#34d399" : "#f8fafc";
      ctx.fillRect(60, dinoY, 24, 30);
      ctx.fillRect(70, dinoY - 12, 18, 14);
      ctx.fillStyle = "#060b16";
      ctx.fillRect(80, dinoY - 9, 4, 4);

      // Shield aura around dinosaur when protected
      if (shielded) {
        ctx.strokeStyle = "rgba(52, 211, 153, 0.55)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(73, dinoY + 10, 28, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Obstacle (REA Probe)
      ctx.fillStyle = "#f43f5e";
      ctx.fillRect(cactusX, 118, 16, 34);
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText("REA", cactusX - 2, 112);

      requestAnimationFrame(loop);
    }

    updateDinoReaTerminal();
    requestAnimationFrame(loop);
  }

  // 3. Interactive Token Bankruptcy Simulator
  const targetSelect = document.getElementById("sim-target");
  const intensitySelect = document.getElementById("sim-intensity");
  const modelSelect = document.getElementById("sim-model");

  function updateSimulator() {
    if (!targetSelect || !intensitySelect || !modelSelect) return;
    const item = BENCHMARK_DATA[targetSelect.value] || BENCHMARK_DATA["dx-ball"];
    const intensity = intensitySelect.value;
    const model = modelSelect.value;

    const intensityScale =
      intensity === "stealth" ? 0.18 : intensity === "balanced" ? 0.45 : intensity === "maximum" ? 0.78 : 1.0;
    const pricePerM = model === "opus" ? 15.0 : model === "sonnet" ? 3.0 : 10.0;

    const afterTokens = Math.round(item.baseAfterTokens * intensityScale);
    const beforeCost = Math.max(0.08, (item.beforeTokens / 1_000_000) * pricePerM + 0.12);
    const afterCost = (afterTokens / 1_000_000) * pricePerM * 1.05;
    const mult = (afterTokens / item.beforeTokens).toFixed(1);

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl("sim-before-score", `${item.beforeScore}/100 (HIGH RISK)`);
    setEl("sim-before-tokens", `${item.beforeTokens.toLocaleString()} tokens`);
    setEl("sim-before-cost", `$${beforeCost.toFixed(2)}`);
    setEl("sim-after-score", `${item.afterScore}/100 (BLA_PROTECTED)`);
    setEl("sim-after-tokens", `${afterTokens.toLocaleString()} tokens (${mult}x)`);
    setEl("sim-after-cost", `$${afterCost.toFixed(2)}`);
    setEl("sim-limit-msg", item.limitMsg);
    setEl("sim-eq-msg", item.eqText);
  }

  targetSelect?.addEventListener("change", updateSimulator);
  intensitySelect?.addEventListener("change", updateSimulator);
  modelSelect?.addEventListener("change", updateSimulator);
  updateSimulator();
});

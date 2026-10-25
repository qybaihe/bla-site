function detectInitialLang() {
  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get("lang");
  const supported = ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "fr", "de"];
  if (queryLang && supported.includes(queryLang)) {
    return queryLang;
  }
  try {
    const saved = localStorage.getItem("bla_lang");
    if (saved && supported.includes(saved)) return saved;
  } catch {
    // ignore storage access issues
  }
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("zh-tw") || nav.startsWith("zh-hk") || nav.startsWith("zh-mo")) return "zh-TW";
  if (nav.startsWith("zh")) return "zh-CN";
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("ko")) return "ko";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("fr")) return "fr";
  if (nav.startsWith("de")) return "de";
  return "en";
}

function applyLanguage(lang) {
  const dictRoot = window.BLA_I18N || {};
  const enDict = dictRoot.en || {};
  const langDict = dictRoot[lang] || enDict;

  document.documentElement.lang = lang;
  try {
    localStorage.setItem("bla_lang", lang);
  } catch {
    // ignore
  }

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = langDict[key] || enDict[key];
    if (val) el.textContent = val;
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    const val = langDict[key] || enDict[key];
    if (val) el.innerHTML = val;
  });

  const select = document.getElementById("bla-lang-select");
  if (select && select.value !== lang) {
    select.value = lang;
  }

  window.BLA_CURRENT_LANG = lang;
  window.dispatchEvent(new CustomEvent("bla:langchange", { detail: { lang } }));
}

function formatStarCount(count) {
  const n = Number(count);
  if (!Number.isFinite(n) || n < 0) return "★";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

async function loadGitHubStars() {
  const renderStars = (val) => {
    document.querySelectorAll("[data-gh-stars]").forEach((el) => {
      el.textContent = formatStarCount(val);
    });
  };

  try {
    const cached = sessionStorage.getItem("bla_gh_stars");
    if (cached !== null) {
      renderStars(cached);
    }
  } catch {
    // ignore
  }

  try {
    const res = await fetch("https://api.github.com/repos/qybaihe/bla", {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.stargazers_count === "number") {
        renderStars(data.stargazers_count);
        try {
          sessionStorage.setItem("bla_gh_stars", String(data.stargazers_count));
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore network issues
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const initialLang = detectInitialLang();
  applyLanguage(initialLang);
  loadGitHubStars();

  const select = document.getElementById("bla-lang-select");
  if (select) {
    select.addEventListener("change", (e) => {
      applyLanguage(e.target.value);
    });
  }

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      const dictRoot = window.BLA_I18N || {};
      const lang = window.BLA_CURRENT_LANG || "en";
      const dict = dictRoot[lang] || dictRoot.en || {};
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = dict["hero.copied"] || "Copied ✓";
        setTimeout(() => {
          btn.textContent = dict["hero.copy"] || "Copy";
        }, 1600);
      } catch {
        // Fallback no-op
      }
    });
  });
});

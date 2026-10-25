(function () {
  const savedTheme = localStorage.getItem("bla-theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  function updateThemeButton() {
    const btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    btn.textContent = current === "dark" ? "☀️ Light" : "🌙 Dark";
  }

  function applyLanguage(lang) {
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
    localStorage.setItem("bla-lang", lang);
    const labelEl = document.querySelector("[data-lang-label]");
    if (labelEl) {
      labelEl.textContent = lang === "zh" ? "文 / 简体中文" : "文 / English";
    }
    document.querySelectorAll("[data-zh]").forEach((el) => {
      if (!el.hasAttribute("data-en")) {
        el.setAttribute("data-en", el.innerHTML);
      }
      el.innerHTML = lang === "zh" ? el.getAttribute("data-zh") : el.getAttribute("data-en");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateThemeButton();

    const themeBtn = document.querySelector("[data-theme-toggle]");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("bla-theme", next);
        updateThemeButton();
      });
    }

    const langBtn = document.querySelector("[data-lang-toggle]");
    const urlParams = new URLSearchParams(window.location.search);
    const initialLang = urlParams.get("lang") || localStorage.getItem("bla-lang") || "en";
    if (initialLang === "zh") {
      applyLanguage("zh");
    }

    if (langBtn) {
      langBtn.addEventListener("click", () => {
        const cur = localStorage.getItem("bla-lang") || "en";
        applyLanguage(cur === "en" ? "zh" : "en");
      });
    }

    document.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      const targetId = btn.getAttribute("data-copy");
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      const text = targetEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        const orig = btn.textContent;
        btn.textContent = "✓ Copied";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove("copied");
        }, 1600);
      } catch {
        // Fallback
      }
    });
  });
})();

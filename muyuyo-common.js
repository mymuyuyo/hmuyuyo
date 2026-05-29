(function () {
  var currentPath = location.pathname.replace(/\\/g, "/");
  var isHome = /\/index\.html?$/i.test(currentPath) || /\/MUYUYO\/?$/i.test(currentPath);

  function homeHref() {
    var parts = currentPath.split("/").filter(Boolean);
    var lower = parts.map(function (part) { return part.toLowerCase(); });
    var idx = lower.indexOf("muyuyo");
    var depth = idx >= 0 ? Math.max(0, parts.length - idx - 2) : 1;
    return (depth > 0 ? "../".repeat(depth) : "") + "index.html";
  }

  function normalizeLang(lang) {
    lang = (lang || "es").toLowerCase();
    if (lang.startsWith("ja")) return "ja";
    if (lang.startsWith("ko")) return "ko";
    if (lang.startsWith("fr")) return "fr";
    if (lang.startsWith("de")) return "de";
    if (lang.startsWith("pt")) return "pt";
    if (lang.startsWith("en")) return "en";
    return "es";
  }

  function addHomeButton() {
    if (isHome || document.querySelector(".muyuyo-home-link")) return;
    var link = document.createElement("a");
    link.className = "muyuyo-home-link";
    link.href = homeHref();
    link.setAttribute("aria-label", "Volver al inicio");
    link.innerHTML = "<span>Inicio</span>";
    document.body.appendChild(link);
  }

  function convertButtonGroup(container, buttonSelector, onChange) {
    if (!container || container.dataset.muyuyoConverted) return;
    var buttons = Array.prototype.slice.call(container.querySelectorAll(buttonSelector));
    if (!buttons.length) return;

    container.dataset.muyuyoConverted = "1";
    var select = document.createElement("select");
    select.className = "muyuyo-lang-select";
    select.setAttribute("aria-label", "Seleccionar idioma");

    buttons.forEach(function (button) {
      var option = document.createElement("option");
      option.value = button.dataset.lang || (button.id || "").replace(/^b/, "").toLowerCase();
      option.textContent = button.textContent.trim();
      select.appendChild(option);
    });

    var active = buttons.find(function (button) { return button.classList.contains("active"); });
    select.value = active
      ? active.dataset.lang || active.id.replace(/^b/, "").toLowerCase()
      : normalizeLang(navigator.language);

    select.addEventListener("change", function () {
      onChange(select.value, buttons);
    });

    buttons.forEach(function (button) {
      button.style.display = "none";
    });
    container.appendChild(select);
  }

  document.addEventListener("DOMContentLoaded", function () {
    addHomeButton();

    convertButtonGroup(document.querySelector(".actions"), ".lang-btn", function (value, buttons) {
      var button = buttons.find(function (item) { return item.dataset.lang === value; });
      if (button) button.click();
    });

    convertButtonGroup(document.querySelector(".lang"), "button", function (value) {
      if (typeof window.setLang === "function") window.setLang(value);
    });

    var rulesSelect = document.querySelector(".lang select.muyuyo-lang-select");
    if (rulesSelect && typeof window.setLang === "function") {
      var autoLang = normalizeLang(navigator.language);
      var hasOption = Array.prototype.some.call(rulesSelect.options, function (option) {
        return option.value === autoLang;
      });
      if (hasOption) {
        window.setLang(autoLang);
        rulesSelect.value = autoLang;
      }
    }
  });
})();

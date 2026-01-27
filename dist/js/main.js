(() => {
  // src/js/main.js
  var body = document.body;
  var switcher = document.getElementById("langSwitcher");
  var currentBtn = switcher.querySelector(".lang-switcher__current");
  var currentLabel = switcher.querySelector(".lang-switcher__label");
  var options = switcher.querySelectorAll(".lang-switcher__option");
  var STORAGE_KEY = "lang";
  var savedLang = localStorage.getItem(STORAGE_KEY) || "en";
  applyLang(savedLang);
  currentBtn.addEventListener("click", () => {
    switcher.classList.toggle("lang-switcher--open");
  });
  options.forEach((option) => {
    option.addEventListener("click", () => {
      applyLang(option.dataset.lang);
      switcher.classList.remove("lang-switcher--open");
    });
  });
  document.addEventListener("click", (e) => {
    if (!switcher.contains(e.target)) {
      switcher.classList.remove("lang-switcher--open");
    }
  });
  function applyLang(lang) {
    const option = [...options].find((o) => o.dataset.lang === lang);
    if (!option)
      return;
    body.setAttribute("data-lang", lang);
    currentLabel.textContent = option.dataset.label;
    localStorage.setItem(STORAGE_KEY, lang);
  }
})();

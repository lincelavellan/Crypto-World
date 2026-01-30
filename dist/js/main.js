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
  document.addEventListener("DOMContentLoaded", function() {
    const progressBar = document.getElementById("progressBar");
    let isScrolling = false;
    function updateProgressBar() {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(scrolled / windowHeight * 100, 100);
      progressBar.style.width = `${progress}%`;
      isScrolling = false;
    }
    window.addEventListener("scroll", function() {
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(updateProgressBar);
      }
    });
    window.addEventListener("resize", updateProgressBar);
    updateProgressBar();
  });
  document.addEventListener("DOMContentLoaded", function() {
    function formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function animateCounter(element, target, duration = 1e3, suffix = "") {
      const start = 0;
      const startTime = performance.now();
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easedProgress);
        const displayValue = target >= 1e3 ? formatNumber(current) : current;
        element.textContent = displayValue + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          const finalValue = target >= 1e3 ? formatNumber(target) : target;
          element.textContent = finalValue + suffix;
        }
      }
      requestAnimationFrame(update);
    }
    function animatePercent(element, target, duration = 1e3) {
      const start = 0;
      const startTime = performance.now();
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easedProgress);
        element.textContent = current + "%";
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = target + "%";
        }
      }
      requestAnimationFrame(update);
    }
    function initCounters() {
      const digitItems = document.querySelectorAll(".top-block__digits-item");
      setTimeout(() => {
        const firstElement = digitItems[0].querySelector("div");
        const firstValue = parseInt(firstElement.getAttribute("data-counter") || "30");
        animateCounter(firstElement, firstValue, 800, "+");
        const secondElement = digitItems[1].querySelector("div");
        const secondValue = parseInt(secondElement.getAttribute("data-counter") || "0");
        animatePercent(secondElement, secondValue, 600);
        const thirdElement = digitItems[2].querySelector("div");
        const thirdValue = parseInt(thirdElement.getAttribute("data-counter") || "5000000");
        animateCounter(thirdElement, thirdValue, 1200, "+");
      }, 300);
    }
    initCounters();
    const observerOptions = {
      threshold: 0.5
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    const digitsBlock = document.querySelector(".top-block__digits");
    if (digitsBlock) {
      observer.observe(digitsBlock);
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    const animatedElements = document.querySelectorAll(
      ".instruction__block, .instruction__title"
    );
    const observer = new IntersectionObserver(
      (entries, observer2) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer2.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2
      }
    );
    animatedElements.forEach((el) => observer.observe(el));
  });
  document.addEventListener("DOMContentLoaded", () => {
    const list = document.querySelector(".crypto__list");
    const items = document.querySelectorAll(".crypto__item");
    if (!list || !items.length)
      return;
    items.forEach((item, index) => {
      item.style.setProperty("--i", index);
    });
    const observer = new IntersectionObserver(
      (entries, observer2) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            list.classList.add("is-visible");
            observer2.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3
      }
    );
    observer.observe(list);
  });
})();

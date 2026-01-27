import { i18n } from "../i18n/index.js"

export function renderTimer(valueOrMode) {
  const timerEl = document.getElementById("timer")
  if (!timerEl) return

  const titleEl = document.querySelector(".app__title")
  const contentEl = document.querySelector(".app__content") 
 

  // Если пришёл специальный режим "night-complete" — меняем таймер и заголовок
  if (valueOrMode === "night-complete") {
    if (titleEl) titleEl.textContent = i18n.t("timer.iftar")
    contentEl.style.display = "none"
    timerEl.classList.add("timer--complete")
    timerEl.textContent = i18n.t("timer.complete")
    return
  }

  // Обычный таймер — оставляем HTML со span
  timerEl.innerHTML = valueOrMode
  if (titleEl) titleEl.textContent = i18n.t("app.title")
}



export function renderQuote(text) {
  const el = document.getElementById("quote")
  if (!el) return

  el.textContent = `“${text}.”`
}

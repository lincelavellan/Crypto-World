import { i18n } from "../i18n/index.js"
import { RAMADAN_START, RAMADAN_NEXT, isRamadanEnded } from "../core/ramadan.js"
import { updateSoundMode, initSound } from "../ui/sound.js"
import { initDropdown } from "../ui/dropdown.js"
import { LOCATIONS } from "../config/locations.js"

// Определяем, какую дату использовать для таймера
const isAfterRamadan = isRamadanEnded()
const COUNTDOWN_TARGET = isAfterRamadan ? RAMADAN_NEXT : RAMADAN_START

/* ---------- Templates ---------- */

const titleTpl = `<h1 class="app__title"></h1>`

const timerTpl = `
<div class="timer__container">
  <div id="timer" class="timer"></div>
</div>
`

const preRamadanInfoTpl = `
<div class="app__content">
  <div class="pre-ramadan-info app__date">
    <span class="pre-ramadan-info__label" id="preRamadanLabel"></span>
    <span class="pre-ramadan-info__days" id="preRamadanDays"></span>
  </div>
</div>
`
const dropdown = `
<div class="dropdown" id="locationDropdown">
  <button class="dropdown__toggle" id="dropdownToggle">
    <span class="dropdown__value">Select location</span>
    <span class="dropdown__arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
        <path d="M13 1L7 7L1 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </button>
  <div class="dropdown__menu-wrapper">
    <div class="dropdown__menu-content">
      <ul class="dropdown__menu" id="dropdownMenu"></ul>
    </div>
  </div>
</div>`

const quoteTpl = `<div id="quote" class="app__quote"></div>`

/* ---------- Render layout ---------- */

const app = document.getElementById("app")
app.innerHTML = `
  <div class="app__overlay">
    ${titleTpl}
    ${preRamadanInfoTpl}
    ${dropdown}
    ${timerTpl}
    ${quoteTpl}
  </div>
`

/* ---------- Root mode ---------- */

const root = document.getElementById("root")
if (root) {
  root.classList.add("pre-ramadan")
  root.classList.remove("day", "night")
}

/* ---------- Sound ---------- */

initSound()
updateSoundMode("pre-ramadan")

/* ---------- i18n ---------- */

i18n.init()
i18n.updateDOM()
initDropdown(loadCity)


/* ---------- Elements ---------- */

const titleEl = document.querySelector(".app__title")
const timerEl = document.getElementById("timer")
const quoteEl = document.getElementById("quote")
const daysEl = document.getElementById("preRamadanDays")
const labelEl = document.getElementById("preRamadanLabel")

/* ---------- Helpers ---------- */

function getDaysUntilRamadan(targetDate) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  )

  const diff = target - today
  return Math.max(0, Math.ceil(diff / 86400000))
}

/* ---------- Text ---------- */

function updateTexts() {
  titleEl.textContent =
    i18n.t("preramadan.countdownTitle") || "Ramadan begins in"

  quoteEl.textContent =
    `“${i18n.t("preramadan.countdownSubtitle") || "Prepare your heart and intentions"}”`

  labelEl.textContent =
    i18n.t("preramadan.daysLeft") || "Days left until Ramadan"

  const targetDate = isAfterRamadan ? RAMADAN_NEXT : RAMADAN_START
  const days = getDaysUntilRamadan(targetDate)
  daysEl.textContent = days
}

updateTexts()

/* ---------- Countdown (DAYS + TIME) ---------- */

function startCountdown(targetDate) {
  function tick() {
    const now = new Date()
    const diff = targetDate - now

    if (diff <= 0) {
      location.reload()
      return
    }

    const totalSeconds = Math.floor(diff / 1000)

    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    timerEl.innerHTML =
      `${days}<span>:</span>` +
      `${String(hours).padStart(2, "0")}<span>:</span>` +
      `${String(minutes).padStart(2, "0")}<span>:</span>` +
      `${String(seconds).padStart(2, "0")}`
  }

  tick()
  setInterval(tick, 1000)
}

startCountdown(COUNTDOWN_TARGET)

/* ---------- Language switch ---------- */

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".lang-btn")
  if (!btn) return

  const lang = btn.dataset.lang
  i18n.setLanguage(lang)
  updateTexts()
})


function loadCity(city, label = city) {
  localStorage.setItem("selectedLocation", city)

  const dropdownValue = document.querySelector(".dropdown__value")
if (dropdownValue) {
  const saved = localStorage.getItem("selectedLocation")
  const loc = LOCATIONS.find(l => l.query === saved)

  dropdownValue.textContent = loc
    ? i18n.t(`dropdown.locations.${loc.label}`) || loc.label
    : i18n.t("dropdown.placeholder")
}

window.updateDropdownLabels?.()
}

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang")
      i18n.setLanguage(lang)
      
      // Обновляем dropdown текст и локации
      const dropdownValue = document.querySelector(".dropdown__value")
      if (dropdownValue) {
        const savedLocationQuery = localStorage.getItem("selectedLocation")
        // Находим локацию по query и получаем переведённый текст
        const location = LOCATIONS.find(loc => loc.query === savedLocationQuery)
        if (location) {
          const translatedLabel = i18n.t(`dropdown.locations.${location.label}`) || location.label
          dropdownValue.textContent = translatedLabel
        } else {
          dropdownValue.textContent = i18n.t("dropdown.placeholder")
        }
      }
      
      // Обновляем labels в dropdown меню
      if (window.updateDropdownLabels) {
        window.updateDropdownLabels()
      }
      
      // Обновляем цитату на новом языке
      const now = new Date()
      renderQuote(pickDailyQuote(now.toISOString().slice(0, 10), lang))
      
      // Обновляем день на новом языке
      renderHolidayDay(now)
    })
  })

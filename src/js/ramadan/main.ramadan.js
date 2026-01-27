/* ---------- Templates ---------- */

const title = `<h1 class="app__title" data-i18="app.title">Fasting Time</h1>`

const timer = `<div class="timer__container">
  <div id="timer" class="timer">00:00:00</div>
</div>`

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
const dayTpl = `<div id="day" class="app__date"></div>`

/* ---------- Imports ---------- */

import { i18n } from "../i18n/index.js"
import { initDropdown } from "../ui/dropdown.js"
import { setMode } from "../ui/mode.js"
import { renderTimer, renderQuote } from "../ui/render.js"
import { getCoords } from "../api/location.js"
import { getPrayerTimes } from "../api/prayers.js"
import { startTimer } from "../core/timer.js"
import { state } from "../core/state.js"
import { pickDailyQuote } from "../core/quotes.js"
import { renderHolidayDay } from "../core/dayCounter.js"
import {
  initSharePopup,
  initShareActions,
  openSharePopup
} from "../ui/sharePopup.js"
import { LOCATIONS } from "../config/locations.js"
import { updateSoundMode, initSound } from "../ui/sound.js"


/* ---------- Render layout ---------- */

const appElement = document.getElementById("app")
if (appElement) {
  // вставляем только внутреннее содержимое, без нового id="app"
  appElement.innerHTML = `
    <div class="app__overlay">
      ${title}
      <div class="app__content">
        ${dayTpl}
        ${dropdown}
      </div>
      ${timer}
      ${quoteTpl}
    </div>
  `
}

let timerId = null

/* ---------- LocalStorage helper ---------- */

function saveLocation(city) {
  localStorage.setItem("selectedLocation", city)
}

function getSavedLocation() {
  return localStorage.getItem("selectedLocation")
}

/* ---------- Core logic ---------- */

async function loadCity(city, locationLabel = city) {
  saveLocation(city)
  
  try {
    const { lat, lon } = await getCoords(city)
    const { fajr, maghrib } = await getPrayerTimes(lat, lon)

    const now = new Date()
    state.currentDate = now

    // Определяем, ночь или день
    const isNightNow = now >= maghrib || now < fajr
    setMode(isNightNow ? "night" : "day")   
    updateSoundMode(isNightNow ? "night" : "day")

    state.currentLocationLabel = locationLabel
    state.currentLocationQuery = city

    // Останавливаем старый таймер
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }

    // Рендер праздничного дня
    renderHolidayDay(now)

    // Рендер цитаты (только раз в день)
    const todayKey = now.toISOString().slice(0, 10)
    if (!state.lastFajrDate || state.lastFajrDate !== todayKey) {
      state.lastFajrDate = todayKey
      renderQuote(pickDailyQuote(todayKey, i18n.getLanguage()))
    }

    if (isNightNow) {
      // Если наступила ночь — сразу показываем Iftar Time
      renderTimer("night-complete")
    } else {
      // Таймер обратного отсчёта до Maghrib
      timerId = startTimer(maghrib, (value) => renderTimer(value), () => {
        // Когда таймер завершился — наступила ночь
        renderTimer("night-complete")
        setMode("night")
        updateSoundMode("night")

        // Обновляем цитату и праздничный день для нового дня
        const now = new Date()
        const todayKey = now.toISOString().slice(0, 10)
        state.lastFajrDate = todayKey
        renderQuote(pickDailyQuote(todayKey, i18n.getLanguage()))
        renderHolidayDay(now)
      })
    }

  } catch (err) {
    console.error("Error:", err)
    renderQuote(`${i18n.t("error.cityNotFound")} "${city}"`)
    renderTimer("00:00:00")
  }
}


/* ---------- Init ---------- */

const now = new Date()
const fajrTime = new Date()
fajrTime.setHours(5, 30, 0)
const maghribTime = new Date()
maghribTime.setHours(17, 30, 0)

const isNightOnLoad = now > maghribTime || now < fajrTime
setMode(isNightOnLoad ? "night" : "day")
updateSoundMode(isNightOnLoad ? "night" : "day")

// Инициализация i18n
i18n.init()

// Рендер праздничного дня сразу
renderHolidayDay(now)

// Инициализация dropdown
initDropdown(loadCity)

document.addEventListener("DOMContentLoaded", () => {
  initSharePopup()
  initShareActions()
  initSound()
  
  // Обновляем содержимое после загрузки DOM (для data-i18 атрибутов)
  i18n.updateDOM()
  
  // Инициализируем обработчики смены языка
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
})


document
  .querySelector(".footer__btn")
  ?.addEventListener("click", () => {
    openSharePopup({
      date: new Date(),
      locationLabel: state.currentLocationLabel
    })
  })


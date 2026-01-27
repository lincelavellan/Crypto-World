import { LOCATIONS } from "../config/locations.js"
import { i18n } from "../i18n/index.js"

export function initDropdown(onSelect) {
  const dropdown = document.getElementById("locationDropdown")
  const toggle = document.getElementById("dropdownToggle")
  const valueEl = toggle.querySelector(".dropdown__value")
  const menu = document.getElementById("dropdownMenu")

  if (!dropdown || !toggle || !menu) return

  let selectedLocationLabel = null // Отслеживаем выбранную локацию

  /* ---------- Render items ---------- */

  LOCATIONS.forEach(({ label, query }) => {
    const item = document.createElement("li")
    item.className = "dropdown__item"
    
    // Получаем перевод локации или используем оригинальный текст
    const translatedLabel = i18n.t(`dropdown.locations.${label}`) || label
    item.textContent = translatedLabel
    item.dataset.query = query
    item.dataset.label = label

    item.addEventListener("click", () => {
      selectedLocationLabel = label // Сохраняем label, а не переведённый текст
      updateValueDisplay()
      closeDropdown()
      onSelect(query, label)
    })

    menu.appendChild(item)
  })

  /* ---------- Toggle ---------- */

  toggle.addEventListener("click", (e) => {
    e.stopPropagation()
    dropdown.classList.toggle("dropdown--open")
  })

  /* ---------- Close on outside click ---------- */

  document.addEventListener("click", () => {
    closeDropdown()
  })

  function closeDropdown() {
    dropdown.classList.remove("dropdown--open")
  }

  /* ---------- Update value display ---------- */
  function updateValueDisplay() {
    if (selectedLocationLabel) {
      const translatedLabel = i18n.t(`dropdown.locations.${selectedLocationLabel}`) || selectedLocationLabel
      valueEl.textContent = translatedLabel
    }
  }

  /* ---------- Init default ---------- */

  if (LOCATIONS.length) {
    const savedLocation = localStorage.getItem("selectedLocation")
    const locationToUse = LOCATIONS.find(loc => loc.query === savedLocation) || LOCATIONS[0]
    selectedLocationLabel = locationToUse.label
    updateValueDisplay()
    onSelect(locationToUse.query, locationToUse.label)
  }

  /* ---------- Update dropdown on language change ---------- */

  // Функция для обновления текстов в dropdown при смене языка
  window.updateDropdownLabels = function() {
    menu.querySelectorAll("li").forEach(item => {
      const label = item.dataset.label
      const translatedLabel = i18n.t(`dropdown.locations.${label}`) || label
      item.textContent = translatedLabel
    })
    // Обновляем значение dropdown при смене языка
    updateValueDisplay()
  }
}

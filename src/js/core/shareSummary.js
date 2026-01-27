import {
  getHolidayDayNumber,
  HOLIDAY_TOTAL_DAYS
} from "./dayCounter.js"
import { i18n } from "../i18n/index.js"
import { LOCATIONS } from "../config/locations.js"

export function buildShareSummary({ date = new Date(), locationLabel }) {
  const day = getHolidayDayNumber(date)
  const lang = i18n.getLanguage()
  const dayLabel = i18n.t("app.date")
  const ramadanLabel = i18n.t("app.ramadan")

  // Получаем переведенную локацию
  let translatedLocation = locationLabel
  if (locationLabel) {
    const location = LOCATIONS.find(loc => loc.label === locationLabel)
    if (location) {
      translatedLocation = i18n.t(`dropdown.locations.${location.label}`) || location.label
    }
  }

  return `${dayLabel} ${day} ${lang === "ar" ? "من" : "of"} ${ramadanLabel} · ${translatedLocation}`
}

/* core/dayCounter.js */

import { i18n } from "../i18n/index.js"

export const HOLIDAY_START_DATE = "2026-02-17T00:00:00"
export const HOLIDAY_TOTAL_DAYS = 29

function normalizeDate(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/* ---------- Holiday day ---------- */

export function getHolidayDayNumber(currentDate = new Date()) {
  const start = normalizeDate(HOLIDAY_START_DATE)
  const current = normalizeDate(currentDate)

  const diffDays = Math.floor(
    (current - start) / (1000 * 60 * 60 * 24)
  )

  const dayNumber = diffDays + 1

  if (dayNumber < 1) return 1
  if (dayNumber > HOLIDAY_TOTAL_DAYS) return HOLIDAY_TOTAL_DAYS

  return dayNumber
}

/* ---------- Date formatting ---------- */

function formatFullDate(date, lang = "en") {
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric"
  }

  if (lang === "ar") {
    // Для арабского используем UTC+3 (Мекка)
    return date.toLocaleDateString("ar-SA", options)
  }

  if (lang === "tr") {
    // Для турецкого
    return date.toLocaleDateString("tr-TR", options)
  }
 
  if (lang === "az") {
    // Для азербайджанского используем турецкую локаль (похожие форматы)
    return date.toLocaleDateString("tr-TR", options)
  }

  return date.toLocaleDateString("en-US", options)
}

/* ---------- Public formatter ---------- */

export function formatHolidayLine(currentDate = new Date()) {
  const lang = i18n.getLanguage()
  const fullDate = formatFullDate(currentDate, lang)
  const dayNumber = getHolidayDayNumber(currentDate)
  const dayLabel = i18n.t("app.date")
  const ofLabel = i18n.t("dateFormat.of")

  return `${fullDate} · ${dayLabel} ${dayNumber} ${ofLabel} ${HOLIDAY_TOTAL_DAYS}`
}

/* ---------- Render ---------- */

export function renderHolidayDay(currentDate = new Date()) {
  const el = document.getElementById("day")
  if (!el) return

  el.textContent = formatHolidayLine(currentDate)
}


export function buildHolidaySummary({
  date = new Date(),
  locationLabel = ""
  } = {}) {
    const dayNumber = getHolidayDayNumber(date)
    const dayLabel = i18n.t("app.date")
    const ofLabel = i18n.t("dateFormat.of")

    const locationPart = locationLabel
      ? ` · ${locationLabel}`
      : ""

    return `${dayLabel} ${dayNumber} ${ofLabel} ${HOLIDAY_TOTAL_DAYS}${locationPart}`
  }


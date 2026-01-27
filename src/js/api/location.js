import { i18n } from "../i18n/index.js"

export async function getCoords(city) {
  const res = await fetch(
    `/api/geocode?q=${encodeURIComponent(city)}`
  )
  
  if (!res.ok) {
    console.error(`API error: ${res.status}`, await res.text())
    throw new Error(i18n.t("error.cityNotFound"))
  }
  
  const data = await res.json()
  console.log("Geocode response:", data)

  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error(i18n.t("error.cityNotFound"))
  }

  const item = data[0]
  if (!item || item.lat === undefined || item.lon === undefined) {
    throw new Error(i18n.t("error.cityNotFound"))
  }

  return {
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon)
  }
}

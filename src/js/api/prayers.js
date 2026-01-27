export async function getPrayerTimes(lat, lon) {
  const today = new Date().toISOString().slice(0, 10)

  const res = await fetch(
    `https://api.aladhan.com/v1/timings/${today}?latitude=${lat}&longitude=${lon}&method=2`
  )

  const data = await res.json()
  const timings = data.data.timings

  return {
    fajr: toDate(timings.Fajr),
    maghrib: toDate(timings.Maghrib)
  }
}

function toDate(timeStr) {
  const [h, m] = timeStr.split(":")
  const d = new Date()
  d.setHours(+h, +m, 0, 0)
  return d
}

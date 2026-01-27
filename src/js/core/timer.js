/* core/timer.js */

/**
 * Запускает обратный отсчёт до target.
 * @param {Date} target — конечное время
 * @param {function} onTick — вызывается каждую секунду с HTML строки для таймера
 * @param {function} onEnd — вызывается, когда таймер дошёл до нуля
 * @returns {number} intervalId — можно clearInterval(intervalId)
 */
export function startTimer(target, onTick, onEnd) {
  let intervalId = null

  function tick() {
    const now = new Date()
    const diff = target - now

    if (diff <= 0) {
      clearInterval(intervalId)
      onEnd()
      return
    }

    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)

    // Форматируем таймер с <span> вокруг двоеточий
    const formatted = `${h.toString().padStart(2, "0")}<span>:</span>${m
      .toString()
      .padStart(2, "0")}<span>:</span>${s.toString().padStart(2, "0")}`

    // onTick должен вставлять через innerHTML
    onTick(formatted)
  }

  // Первый вызов сразу
  tick()

  // Запускаем интервал
  intervalId = setInterval(tick, 1000)

  return intervalId
}

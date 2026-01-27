/* ui/sound.js */

const STORAGE_KEY = "sound-enabled"

let dayAudio
let nightAudio
let preRamadanAudio // ✅ NEW

let currentAudio = null
let isEnabled = true
let isUnlocked = false

export function initSound() {
  dayAudio = document.getElementById("audio-day")
  nightAudio = document.getElementById("audio-night")
  preRamadanAudio = document.getElementById("audio-pre-ramadan") // ✅

  if (!dayAudio || !nightAudio) return

  isEnabled = localStorage.getItem(STORAGE_KEY) !== "false"
  updateUI(isEnabled)

  // Разблокировка аудио первым кликом
  document.addEventListener(
    "click",
    () => {
      isUnlocked = true
      if (isEnabled && currentAudio) fadeIn(currentAudio)
    },
    { once: true }
  )

  document.getElementById("sound-on")?.addEventListener("click", () => {
    isEnabled = true
    localStorage.setItem(STORAGE_KEY, "true")
    updateUI(true)
    if (currentAudio && isUnlocked) fadeIn(currentAudio)
  })

  document.getElementById("sound-off")?.addEventListener("click", () => {
    isEnabled = false
    localStorage.setItem(STORAGE_KEY, "false")
    updateUI(false)
    fadeOut(currentAudio)
  })
}

/* ---------- Mode switch ---------- */

export function updateSoundMode(mode) {
  let nextAudio

  if (mode === "night") {
    nextAudio = nightAudio
  } else if (mode === "pre-ramadan") {
    nextAudio = preRamadanAudio // ✅
  } else {
    nextAudio = dayAudio
  }

  if (!nextAudio || currentAudio === nextAudio) return

  fadeOut(currentAudio)
  currentAudio = nextAudio

  if (isEnabled && isUnlocked) {
    fadeIn(currentAudio)
  }
}

/* ---------- Helpers ---------- */

function fadeIn(audio) {
  if (!audio) return
  audio.volume = 0
  audio.play().catch(() => {})

  let v = 0
  const i = setInterval(() => {
    v += 0.05
    audio.volume = Math.min(v, 0.4)
    if (v >= 0.4) clearInterval(i)
  }, 60)
}

function fadeOut(audio) {
  if (!audio) return
  let v = audio.volume
  const i = setInterval(() => {
    v -= 0.05
    audio.volume = Math.max(v, 0)
    if (v <= 0) {
      audio.pause()
      clearInterval(i)
    }
  }, 60)
}

function updateUI(isOn) {
  document.getElementById("sound-on")?.classList.toggle("selected", isOn)
  document.getElementById("sound-off")?.classList.toggle("selected", !isOn)
}

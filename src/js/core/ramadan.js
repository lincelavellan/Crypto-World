// src/core/ramadan.js
export const RAMADAN_START = new Date("2026-02-17T00:00:00")

export const RAMADAN_END = new Date("2026-03-18T23:59:59")

export const RAMADAN_NEXT = new Date("2027-02-07T23:59:59")

export function isRamadanStarted(now = new Date()) {
  return now >= RAMADAN_START
}

export function isRamadanEnded(now = new Date()) {
  return now > RAMADAN_END
}

export function isDuringRamadan(now = new Date()) {
  return isRamadanStarted(now) && !isRamadanEnded(now)
} 

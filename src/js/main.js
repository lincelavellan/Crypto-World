import { isRamadanStarted, isRamadanEnded, RAMADAN_START } from "./core/ramadan.js"

if (isRamadanStarted() && !isRamadanEnded()) {
  import("./ramadan/main.ramadan.js")
} else {
  import("./pre-ramadan/main.pre.js")
}

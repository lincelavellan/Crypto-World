export function setMode(mode) {
  const root = document.getElementById("root")
  root.classList.remove("night", "day")
  root.classList.add(mode === "night" ? "night" : "day")
}
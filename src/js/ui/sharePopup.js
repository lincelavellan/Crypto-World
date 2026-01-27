import { buildShareSummary } from "../core/shareSummary.js"
import { i18n } from "../i18n/index.js"

const html2canvas = window.html2canvas

let currentSummary = ""
let isSharing = false
let previewImg = null

/* ---------- Init ---------- */
export function initSharePopup() {
  const popup = document.querySelector(".share-popup")
  const closeBtn = popup?.querySelector(".share-popup__close-btn")

  closeBtn?.addEventListener("click", () => {
    closePopup()
    removePreview()
  })
}

/* ---------- Open ---------- */
export function openSharePopup({ date, locationLabel }) {
  const overlay = document.querySelector(".overlay")
  const popup = document.querySelector(".share-popup")
  if (!popup || !overlay) return

  currentSummary = buildShareSummary({ date, locationLabel })

  const summaryEl = popup.querySelector(".share-popup__summary")
  if (summaryEl) summaryEl.textContent = currentSummary

  overlay.classList.add("is-visible")
}

/* ---------- Close ---------- */
export function closePopup() {
  const overlay = document.querySelector(".overlay")
  overlay?.classList.remove("is-visible")
  removePreview()
}

/* ---------- Share & Copy Actions ---------- */
export function initShareActions() {
  const popup = document.querySelector(".share-popup")
  if (!popup) return

  const copyTextBtn = popup.querySelector(".share-popup__action-btn--copy-text")
  const copyImageBtn = popup.querySelector(".share-popup__action-btn--copy-image")
  const shareNativeBtn = popup.querySelector(".share-popup__action-link--share")
  const shareInstagramBtn = popup.querySelector(".share-popup__action-link--share-inst")
  const shareWhatsAppBtn = popup.querySelector(".share-popup__action-link--share-whatsapp")
  const shareTelegramBtn = popup.querySelector(".share-popup__action-link--share-telegram")
  const contentEl = popup.querySelector(".share-popup__content")

  /* --- Copy Text --- */
  copyTextBtn?.addEventListener("click", async () => {
    if (!currentSummary) return
    try {
      await navigator.clipboard.writeText(currentSummary)
      copyTextBtn.textContent = i18n.t("popup.copied")
      setTimeout(() => (copyTextBtn.textContent = i18n.t("popup.copyBtnTxt")), 1500)
    } catch (err) {
      console.error("Copy failed:", err)
    }
  })

  /* --- Copy Image --- */
  copyImageBtn?.addEventListener("click", async () => {
    try {
      if (!previewImg) {
        const canvas = await html2canvas(contentEl)
        const dataUrl = canvas.toDataURL("image/png")
        showPreview(popup, dataUrl)
      }

      const response = await fetch(previewImg.src)
      const blob = await response.blob()
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])

      copyImageBtn.textContent = i18n.t("popup.copied")
      setTimeout(() => (copyImageBtn.textContent = i18n.t("popup.copyBtn")), 1500)
    } catch (err) {
      console.error("Copy image failed:", err)
    }
  })

  /* --- Native Web Share --- */
  shareNativeBtn?.addEventListener("click", async (e) => {
    e.preventDefault()
    if (isSharing) return
    if (!navigator.share) return
    const payload = buildSharePayload(popup)
    if (!payload) return
    try {
      isSharing = true
      await navigator.share(payload)
    } catch (err) {
      if (err.name !== "AbortError") console.error("Share failed:", err)
    } finally {
      isSharing = false
    }
  })

  /* --- Instagram --- */
  shareInstagramBtn?.addEventListener("click", async (e) => {
    e.preventDefault()
    try {
      const canvas = await html2canvas(contentEl)
      const dataUrl = canvas.toDataURL("image/png")
      showPreview(popup, dataUrl)
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], "fasting.png", { type: "image/png" })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Fasting Today" })
      }
    } catch (err) {
      console.error("Instagram share failed", err)
    }
  })

/* --- WhatsApp --- */
shareWhatsAppBtn?.addEventListener("click", async (e) => {
  e.preventDefault()

  try {
    // Генерируем превью (для эффекта)
    const canvas = await html2canvas(contentEl)
    const dataUrl = canvas.toDataURL("image/png")
    showPreview(popup, dataUrl)

    // Формируем текст для WhatsApp
    const text = [
      popup.querySelector(".share-popup__title")?.textContent || "",
      popup.querySelector(".share-popup__summary")?.textContent || ""
    ].join("\n")

    // Открываем диалог WhatsApp с текстом без ссылки на dev-сервер
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
  } catch (err) {
    console.error("WhatsApp share failed", err)
  }
})

/* --- Telegram --- */
shareTelegramBtn?.addEventListener("click", async (e) => {
  e.preventDefault()

  try {
    const canvas = await html2canvas(contentEl)
    const dataUrl = canvas.toDataURL("image/png")
    showPreview(popup, dataUrl)

    const text = [
      popup.querySelector(".share-popup__title")?.textContent || "",
      popup.querySelector(".share-popup__summary")?.textContent || ""
    ].join("\n")

    // Открываем диалог Telegram с текстом без ссылки
    window.open(
      `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`,
      "_blank"
    )
  } catch (err) {
    console.error("Telegram share failed", err)
  }
})


}


/* ---------- Helpers ---------- */
function buildSharePayload(popup) {
  const title = popup.querySelector(".share-popup__title")?.textContent
  const summary = popup.querySelector(".share-popup__summary")?.textContent

  if (!title || !summary) return null

  return {
    title,
    text: `${title}\n${summary}`,
    url: window.location.href
  }
}

/* ---------- Preview Helpers with Auto-hide ---------- */
function showPreview(popup, dataUrl) {
  removePreview() // удаляем старое превью, если есть

  const img = document.createElement("img")
  img.src = dataUrl
  img.className = "share-popup__preview"

  Object.assign(img.style, {
    display: "block",
    width: "200px",
    maxWidth: "90%",
    margin: "16px auto",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    opacity: "0",
    transition: "transform 0.3s ease, opacity 0.3s ease",
    position: "absolute",
    top: "50%",
    marginTop: "-50px",
    transform: "scale(0.8)"
  })

  const contentEl = popup.querySelector(".share-popup__content")
  contentEl.appendChild(img)
  previewImg = img

  requestAnimationFrame(() => {
    img.style.transform = "scale(1)"
    img.style.opacity = "1"
  })

  // Авто-исчезновение через 1 секунду
  setTimeout(() => removePreview(), 1000)
}

function removePreview() {
  if (!previewImg) return
  previewImg.style.transform = "scale(0.8)"
  previewImg.style.opacity = "0"
  previewImg.addEventListener(
    "transitionend",
    () => {
      if (previewImg?.parentNode) previewImg.parentNode.removeChild(previewImg)
      previewImg = null
    },
    { once: true }
  )
}

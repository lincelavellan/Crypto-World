const body = document.body
const switcher = document.getElementById('langSwitcher')
const currentBtn = switcher.querySelector('.lang-switcher__current')
const currentLabel = switcher.querySelector('.lang-switcher__label')
const options = switcher.querySelectorAll('.lang-switcher__option')

const STORAGE_KEY = 'lang'

// init
const savedLang = localStorage.getItem(STORAGE_KEY) || 'en'
applyLang(savedLang)

// toggle dropdown
currentBtn.addEventListener('click', () => {
  switcher.classList.toggle('lang-switcher--open')
})

// select language
options.forEach(option => {
  option.addEventListener('click', () => {
    applyLang(option.dataset.lang)
    switcher.classList.remove('lang-switcher--open')
  })
})

// close outside
document.addEventListener('click', e => {
  if (!switcher.contains(e.target)) {
    switcher.classList.remove('lang-switcher--open')
  }
})

function applyLang(lang) {
  const option = [...options].find(o => o.dataset.lang === lang)
  if (!option) return

  body.setAttribute('data-lang', lang)

  // label
  currentLabel.textContent = option.dataset.label

  // localStorage
  localStorage.setItem(STORAGE_KEY, lang)

  // если есть i18n
  // changeLanguage(lang)
}

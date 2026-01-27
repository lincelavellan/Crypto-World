import { getHolidayDayNumber } from "./dayCounter.js"

const QUOTES = [
  {
    ar: "الصبر مفتاح الفرج",
    en: "Patience is the key to relief",
    tr: "Sabır, rahatlamanın anahtarıdır",
    az: "Səbr rahatlamanın açarıdır"
  },
  {
    ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    en: "Indeed, with hardship comes ease",
    tr: "Gerçekten, zorlukla birlikte kolaylık gelir",
    az: "Həqiqətən, çətinliklə birlikdə asanlıq gəlir"
  },
  {
    ar: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
    en: "Be patient, for Allah does not let the reward of the righteous be lost",
    tr: "Sabret; Allah iyilerin ödülünü zayi etmez",
    az: "Səbr et; Allah saleh şəxslərin mükafatını itirməz"
  },
  {
    ar: "رمضان شهر الرحمة والمغفرة",
    en: "Ramadan is the month of mercy and forgiveness",
    tr: "Ramazan, merhamet ve bağışlama ayıdır",
    az: "Ramazan mərhəmət və bağışlanma ayıdır"
  },
  {
    ar: "قلبٌ متوكلٌ على الله لا يُهزم",
    en: "A heart that trusts Allah is never defeated",
    tr: "Allah’a güvenen bir kalp asla yenilmez",
    az: "Allaha güvənən ürək heç vaxt məğlub olmaz"
  },
  {
    ar: "كل تأخير من الله هو عطاء",
    en: "Every delay from Allah is a gift",
    tr: "Allah’tan gelen her gecikme bir hediyedir",
    az: "Allaha məxsus hər gecikmə bir hədiyyədir"
  },
  {
    ar: "الدعاء يغير القدر",
    en: "Supplication changes destiny",
    tr: "Dua kaderi değiştirir",
    az: "Dua taleni dəyişdirir"
  },
  {
    ar: "الطمأنينة تأتي من القرب من الله",
    en: "Peace comes from closeness to Allah",
    tr: "Huzur, Allah’a yakınlıktan gelir",
    az: "Sakitlik Allah’a yaxınlıqdan gəlir"
  },
  {
    ar: "ما خاب من استخار",
    en: "Whoever seeks guidance from Allah is never disappointed",
    tr: "Allah’tan rehberlik isteyen asla hayal kırıklığına uğramaz",
    az: "Allaha müraciət edən heç vaxt məyus olmaz"
  },
  {
    ar: "الصبر جميل",
    en: "Beautiful patience brings beautiful outcomes",
    tr: "Güzel sabır, güzel sonuçlar getirir",
    az: "Gözəl səbr, gözəl nəticələr gətirir"
  },
  {
    ar: "ثق بالله، فالله لا يخذل عبده",
    en: "Trust Allah; He never abandons His servant",
    tr: "Allah’a güven; O kulunu asla terk etmez",
    az: "Allaha güvən; O qullarını heç vaxt tərk etməz"
  },
  {
    ar: "الخير فيما اختاره الله",
    en: "Good lies in what Allah chooses",
    tr: "İyilik, Allah’ın seçtiğinde yatar",
    az: "Yaxşılıq, Allahın seçdiyindədir"
  },
  {
    ar: "كل شيء بقدر",
    en: "Everything happens by divine decree",
    tr: "Her şey Allah’ın takdirindendir",
    az: "Hər şey Allahın hökmündən baş verir"
  },
  {
    ar: "الله أقرب مما تظن",
    en: "Allah is closer than you think",
    tr: "Allah düşündüğünden daha yakındır",
    az: "Allah düşündüyündən daha yaxındır"
  },
  {
    ar: "القلب الصابر أقوى من كل الظروف",
    en: "A patient heart is stronger than any circumstance",
    tr: "Sabırlı bir kalp, her durumdan daha güçlüdür",
    az: "Səbrli ürək hər vəziyyətdən güclüdür"
  },
  {
    ar: "لا تيأس، فإن الله معك",
    en: "Do not despair; Allah is with you",
    tr: "Umutsuzluğa kapılma; Allah seninle",
    az: "Ümidini itirmə; Allah səninlədir"
  },
  {
    ar: "في الصبر أجر بلا حساب",
    en: "In patience lies reward without measure",
    tr: "Sabırda ölçüsüz bir ödül vardır",
    az: "Səbrdə hesabsız mükafat vardır"
  },
  {
    ar: "اطمئن، فالله يدبر الأمر",
    en: "Be at ease; Allah is managing all affairs",
    tr: "Rahat ol; Allah her şeyi yönetiyor",
    az: "Rahat ol; Allah hər şeyi idarə edir"
  },
  {
    ar: "الأمل عبادة",
    en: "Hope is an act of worship",
    tr: "Umut bir ibadettir",
    az: "Ümid ibadətdir"
  },
  {
    ar: "ما بعد الصبر إلا الفرج",
    en: "After patience comes relief",
    tr: "Sabırdan sonra rahatlık gelir",
    az: "Səbrdən sonra rahatlıq gəlir"
  },
  {
    ar: "ثق أن الله يعلم ما في قلبك",
    en: "Trust that Allah knows what is in your heart",
    tr: "Allah’ın kalbinde ne olduğunu bildiğine güven",
    az: "Allaha etibar et; O ürəyində nə olduğunu bilir"
  },
  {
    ar: "السكينة هدية من الله",
    en: "Tranquility is a gift from Allah",
    tr: "Huzur Allah’tan bir hediyedir",
    az: "Sakitlik Allahdan bir hədiyyədir"
  },
  {
    ar: "لا شيء مستحيل مع الله",
    en: "Nothing is impossible with Allah",
    tr: "Allah ile hiçbir şey imkansız değildir",
    az: "Allah ilə heç nə mümkün deyil"
  },
  {
    ar: "الفرج قريب",
    en: "Relief is near",
    tr: "Rahatlama yakındır",
    az: "Rahatlama yaxındır"
  },
  {
    ar: "الرضا باب السعادة",
    en: "Contentment is the door to happiness",
    tr: "Memnuniyet mutluluğun kapısıdır",
    az: "Razılıq xoşbəxtliyin qapısıdır"
  },
  {
    ar: "الله لا ينسى عباده",
    en: "Allah never forgets His servants",
    tr: "Allah kullarını asla unutmaz",
    az: "Allah qullarını heç vaxt unutmur"
  },
  {
    ar: "كل دعاء مسموع",
    en: "Every prayer is heard",
    tr: "Her dua işitilir",
    az: "Hər dua eşidilir"
  },
  {
    ar: "التوكل راحة",
    en: "Trusting Allah brings peace",
    tr: "Allah’a güvenmek huzur getirir",
    az: "Allaha güvənmək sakitlik gətirir"
  },
  {
    ar: "من توكل على الله كفاه",
    en: "Whoever relies on Allah, He is sufficient for him",
    tr: "Kim Allah’a güvenirse, O onun için yeterlidir",
    az: "Kim Allaha güvənirsə, O onun üçün kifayətdir"
  },
  {
    ar: "الله أرحم بك من نفسك",
    en: "Allah is more merciful to you than you are to yourself",
    tr: "Allah sana, senin kendine olduğundan daha merhametlidir",
    az: "Allah sənə, özünə olduğundan daha mərhəmətlidir"
  }
]

/**
 * Возвращает цитату дня
 * День 1 → индекс 0
 */
export function pickDailyQuote(currentDate = new Date(), lang = "en") {
  const dayNumber = getHolidayDayNumber(currentDate)
  const index = (dayNumber - 1) % QUOTES.length

  return QUOTES[index][lang]
}

/**
 * Случайная цитата (на будущее)
 */
export function getRandomQuote(lang = "en") {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)]
  return q[lang]
}

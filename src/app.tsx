import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://leqkbgdqcqincjwwlyef.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlcWtiZ2RxY3FpbmNqd3dseWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNDk3MDgsImV4cCI6MjA5NTgyNTcwOH0.vfNSOI8aDv9julOWHuNitpP1eAxEdWhO2EDSrqQqqZw";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// TRANSLATIONS
// ============================================
const T: any = {
  fa: {
    dir: "rtl",
    appName: "BARIN Mining Quest",
    chooseLanguage: "زبان خود را انتخاب کنید",
    chooseCharacter: "کاراکتر خود را انتخاب کنید",
    eachRoleUnlocks: "هر نقش ماموریت‌های منحصربه‌فرد باز می‌کند",
    male: "👨 مرد",
    female: "👩 زن",
    maxXP: "حداکثر XP",
    missions: "ماموریت",
    startAs: "شروع به عنوان",
    home: "خانه",
    missionsTab: "ماموریت‌ها",
    mine: "معدن",
    ranks: "رتبه‌ها",
    learn: "یادگیری",
    welcome: "خوش آمدی",
    barinEarned: "BARIN کسب شده",
    dayStreak: "روز پیوسته!",
    streakMsg: "هر روز وارد شو تا streak رو حفظ کنی",
    xpProgress: "پیشرفت XP",
    dailyMine: "معدن روزانه",
    tapToMine: "برای معدن ضربه بزن",
    minedToday: "امروز استخراج شده",
    oreIntegrity: "یکپارچگی سنگ",
    energy: "انرژی",
    recharging: "⏳ در حال شارژ...",
    mineralsExtracted: "مواد معدنی استخراج شده",
    completeAndEarn: "کامل کن و کسب کن",
    completed: "تکمیل شده",
    submitBtn: "ثبت",
    guide: "📋 راهنما",
    linkOrAnswer: "لینک یا جواب خود را وارد کنید:",
    linkPlaceholder: "https://... یا جواب خود را اینجا بنویسید",
    submitMission: "✅ ثبت ماموریت",
    submitting: "⏳ در حال ثبت...",
    submitted: "ثبت شد!",
    pendingReview: "ماموریت در صف بررسی هست",
    weeklyRankings: "رتبه‌بندی هفتگی",
    liveUpdated: "زنده — به‌روزرسانی در لحظه",
    beFirst: "اولین نفری باش که امتیاز کسب میکنی!",
    miningKnowledge: "دانش معدنی",
    miningSubtitle: "بدون مواد معدنی، دنیای دیجیتال وجود ندارد",
    keyFact: "💡 نکته کلیدی",
    barinConnected: "BARIN Connected",
    dailyFact: "💡 حقیقت روزانه",
    dailyFactText: "پل گلدن گیت حاوی ۸۳،۰۰۰ تن فولاد است — همه از سنگ آهنی مانند هماتیت که BARIN استخراج می‌کند.",
    onboarding: [
      { title: "BARIN Mining Quest", sub: "قدرت زمین. اثبات شده در بلاکچین.", desc: "اولین بازی آموزشی Web3 با پشتوانه عملیات واقعی معدنی در شبکه Polygon." },
      { title: "ماموریت‌ها را کامل کن", sub: "یاد بگیر. به اشتراک بگذار. کسب کن.", desc: "هر ماموریت درباره عملیات واقعی معدن آموزش می‌دهد و با توکن BARIN پاداش می‌دهد." },
      { title: "برای معدن ضربه بزن", sub: "پاداش معدن روزانه", desc: "هر روز سنگ مجازی استخراج کن. کمبو بساز، ضربه بحرانی بزن و BARIN کسب کن." },
      { title: "رایگان شروع کن", sub: "نیازی به خرید نیست", desc: "رایگان شروع کن، کیف پول وصل کن تا BARIN واقعی کسب کنی، stake کن تا پاداش بیشتر بگیری." },
    ],
    next: "بعدی →",
    skip: "رد کن",
    startMining: "شروع معدن ⛏️",
    learnTopics: [
      { title: "تشکیل مواد معدنی", mineral: "Fe • Cu • Au", fact: "سنگ آهن میلیون‌ها سال طول کشید تا شکل بگیرد", content: "مواد معدنی در اعماق زمین تحت فشار و دمای بسیار بالا شکل می‌گیرند. آهن از بقایای ستارگان قدیمی است که میلیاردها سال پیش در زمین نشست کرد. هماتیت (Fe₂O₃) و مگنتیت (Fe₃O₄) دو شکل اصلی سنگ آهن هستند که BARIN استخراج می‌کند." },
      { title: "شناسایی سنگ‌های معدنی", mineral: "هماتیت • مگنتیت • مالاکیت", fact: "هماتیت با رنگ قرمز‌قهوه‌ای شناخته می‌شود", content: "هماتیت: رنگ قرمز تا خاکستری، درخشش فلزی، ۷۰٪ آهن خالص.\nمگنتیت: رنگ سیاه، خاصیت مغناطیسی قوی، ۷۲٪ آهن.\nمالاکیت: رنگ سبز زیبا، منبع اصلی مس.\nزنجیر: رنگ آبی آسمانی، سنگ ارزشمند مس." },
      { title: "روش‌های استخراج", mineral: "معدن روباز • زیرزمینی", fact: "۸۰٪ معادن دنیا از روش روباز استفاده می‌کنند", content: "معدن روباز: برای کانسارهای نزدیک به سطح زمین. ارزان‌تر و ایمن‌تر.\nمعدن زیرزمینی: برای کانسارهای عمیق. هزینه بالاتر ولی تأثیر محیطی کمتر.\nحفاری: اولین قدم برای تعیین عمق و کیفیت کانسار.\nانفجار کنترل‌شده: روش اصلی استخراج در معادن بزرگ." },
      { title: "فراوری مواد معدنی", mineral: "خردایش • فلوتاسیون • ذوب", fact: "از هر ۱۰۰ تن سنگ مس، فقط ۱ تن مس خالص بدست می‌آید", content: "خردایش: سنگ بزرگ به ذرات کوچک تبدیل می‌شود.\nفلوتاسیون: با استفاده از حباب هوا، مواد معدنی از سنگ جدا می‌شوند.\nتغلیظ: کنسانتره با عیار بالا تولید می‌شود.\nذوب و تصفیه: محصول نهایی با خلوص بالا آماده صادرات می‌شود." },
      { title: "معادن و انرژی پاک", mineral: "Li • Ni • Co • Cu", fact: "هر خودرو برقی به ۸ کیلوگرم لیتیوم نیاز دارد", content: "انقلاب انرژی پاک بدون معدن‌کاری ممکن نیست. باتری‌های لیتیوم‌یون به لیتیوم، نیکل، کبالت و مس نیاز دارند. پنل‌های خورشیدی از سیلیکون و نقره ساخته می‌شوند. BARIN در تأمین این مواد حیاتی نقش مستقیم دارد." },
      { title: "بلاکچین در معدن", mineral: "Polygon • BARIN Token", fact: "BARIN اولین توکن معدنی با پشتوانه عملیاتی واقعی", content: "BARIN چطور صنعت معدن را متحول می‌کند:\n• شفافیت کامل در زنجیره تأمین\n• قراردادهای هوشمند برای صادرات\n• tokenization دارایی‌های معدنی\n• استیکینگ و مشارکت در حاکمیت\n• ردیابی ESG و پایداری زیست‌محیطی" },
    ],
  },
  en: {
    dir: "ltr",
    appName: "BARIN Mining Quest",
    chooseLanguage: "Choose Your Language",
    chooseCharacter: "Choose Your Character",
    eachRoleUnlocks: "Each role unlocks unique missions",
    male: "👨 Male",
    female: "👩 Female",
    maxXP: "MAX XP",
    missions: "missions",
    startAs: "START AS",
    home: "Home",
    missionsTab: "Missions",
    mine: "Mine",
    ranks: "Ranks",
    learn: "Learn",
    welcome: "Welcome",
    barinEarned: "BARIN EARNED",
    dayStreak: "Day Streak!",
    streakMsg: "Log in every day to keep your streak",
    xpProgress: "XP PROGRESS",
    dailyMine: "💎 DAILY MINE",
    tapToMine: "Tap to Mine",
    minedToday: "MINED TODAY",
    oreIntegrity: "ORE INTEGRITY",
    energy: "⚡ ENERGY",
    recharging: "⏳ Recharging...",
    mineralsExtracted: "MINERALS EXTRACTED",
    completeAndEarn: "Complete & Earn",
    completed: "completed",
    submitBtn: "SUBMIT",
    guide: "📋 Instructions",
    linkOrAnswer: "Enter your link or answer:",
    linkPlaceholder: "https://... or type your answer here",
    submitMission: "✅ Submit Mission",
    submitting: "⏳ Submitting...",
    submitted: "Submitted!",
    pendingReview: "Mission is in review queue",
    weeklyRankings: "Weekly Rankings",
    liveUpdated: "Live — Updated in real time",
    beFirst: "Be the first to earn points!",
    miningKnowledge: "Mining Knowledge",
    miningSubtitle: "Without minerals, the digital world cannot exist",
    keyFact: "💡 Key Fact",
    barinConnected: "BARIN Connected",
    dailyFact: "💡 DAILY FACT",
    dailyFactText: "The Golden Gate Bridge contains 83,000 tons of steel — all sourced from iron ore like the hematite BARIN mines.",
    onboarding: [
      { title: "BARIN Mining Quest", sub: "Powered by Earth. Proven on Chain.", desc: "The world's first educational Web3 game backed by real mineral mining operations on Polygon." },
      { title: "Complete Missions", sub: "Learn. Share. Earn.", desc: "Each mission teaches you about real mining operations and rewards you with BARIN tokens." },
      { title: "Tap to Mine", sub: "Daily Mining Rewards", desc: "Mine virtual ore every day. Build combos, hit criticals, and earn BARIN rewards." },
      { title: "Free to Start", sub: "No purchase required", desc: "Start free, connect your wallet to earn real BARIN tokens, stake to unlock even more rewards." },
    ],
    next: "NEXT →",
    skip: "Skip",
    startMining: "START MINING ⛏️",
    learnTopics: [
      { title: "Mineral Formation", mineral: "Fe • Cu • Au", fact: "Iron ore took millions of years to form", content: "Minerals form deep in the Earth under extreme pressure and heat. Iron comes from ancient stellar remnants that settled on Earth billions of years ago. Hematite (Fe₂O₃) and Magnetite (Fe₃O₄) are the two main iron ore forms that BARIN mines." },
      { title: "Identifying Minerals", mineral: "Hematite • Magnetite • Malachite", fact: "Hematite is identified by its red-brown streak", content: "Hematite: Red to gray color, metallic luster, 70% pure iron.\nMagnetite: Black color, strong magnetic properties, 72% iron.\nMalachite: Beautiful green color, primary copper source.\nAzurite: Sky blue color, valuable copper mineral." },
      { title: "Extraction Methods", mineral: "Open-Pit • Underground", fact: "80% of world mines use open-pit method", content: "Open-pit: For deposits close to the surface. Cheaper and safer.\nUnderground: For deep deposits. Higher cost but less environmental impact.\nDrilling: First step to determine deposit depth and quality.\nControlled blasting: Primary extraction method in large mines." },
      { title: "Mineral Processing", mineral: "Crushing • Flotation • Smelting", fact: "Only 1 ton of pure copper from 100 tons of copper ore", content: "Crushing: Large rocks broken into small particles.\nFlotation: Air bubbles separate minerals from rock.\nConcentration: High-grade concentrate is produced.\nSmelting and refining: Final product with high purity ready for export." },
      { title: "Mining & Clean Energy", mineral: "Li • Ni • Co • Cu", fact: "Each electric vehicle needs 8kg of lithium", content: "The clean energy revolution is impossible without mining. Lithium-ion batteries need lithium, nickel, cobalt and copper. Solar panels are made from silicon and silver. Wind turbines need large amounts of steel and copper. BARIN plays a direct role in supplying these critical materials." },
      { title: "Blockchain in Mining", mineral: "Polygon • BARIN Token", fact: "BARIN is the first mineral token with real operational backing", content: "How BARIN transforms the mining industry:\n• Full transparency in supply chain\n• Smart contracts for exports\n• Tokenization of mining assets\n• Staking and governance participation\n• ESG tracking and environmental sustainability" },
    ],
  },
};

const BASE_IMG = "https://raw.githubusercontent.com/BarinMT/barin-mining-quest/main/";

const CHARACTERS = [
  { id: "geologist", phase: 1, color: "#F59E0B", glow: "#f59e0b44", mineral: "Fe • Cu",
    male: { name: "Kaveh", titleFa: "زمین‌شناس", titleEn: "Geologist", quoteFa: "زمین را می‌خوانم — سنگ معدن را حس می‌کنم", quoteEn: "I read the earth — I sense the ore", emoji: "🪨", img: BASE_IMG + "IMG_6164.PNG" },
    female: { name: "Sara", titleFa: "زمین‌شناس", titleEn: "Geologist", quoteFa: "هر سنگ داستانی دارد — من گوش می‌دهم", quoteEn: "Every rock tells a story — I listen", emoji: "🪨", img: BASE_IMG + "IMG_6163.PNG" },
    skillsFa: ["شناسایی معدنی", "نقشه‌برداری", "تجزیه سنگ"], skillsEn: ["Mineral ID", "Field Mapping", "Rock Analysis"], xp: 300, missionCount: 4,
    phaseFa: "اکتشاف", phaseEn: "EXPLORATION" },
  { id: "geophysicist", phase: 1, color: "#06B6D4", glow: "#06b6d444", mineral: "Li • Ni",
    male: { name: "Aria", titleFa: "ژئوفیزیکدان", titleEn: "Geophysicist", quoteFa: "زمین را از بالا می‌بینم", quoteEn: "I see the earth from above", emoji: "🛸", img: BASE_IMG + "IMG_6162.PNG" },
    female: { name: "Nila", titleFa: "ژئوفیزیکدان", titleEn: "Geophysicist", quoteFa: "داده‌هایم دروغ نمی‌گویند", quoteEn: "My sensors never lie — data is truth", emoji: "🛸", img: BASE_IMG + "IMG_6158.PNG" },
    skillsFa: ["بررسی هوایی", "نقشه‌برداری", "تحلیل AI"], skillsEn: ["Aerial Survey", "Geo-Mapping", "AI Analysis"], xp: 350, missionCount: 4,
    phaseFa: "اکتشاف", phaseEn: "EXPLORATION" },
  { id: "engineer", phase: 2, color: "#EF4444", glow: "#ef444444", mineral: "Fe • Au",
    male: { name: "Rostam", titleFa: "مهندس معدن", titleEn: "Mining Engineer", quoteFa: "طراحی چاه با من است", quoteEn: "The pit design is mine — I decide", emoji: "⛏️", img: BASE_IMG + "IMG_6157.PNG" },
    female: { name: "Ana", titleFa: "مهندس معدن", titleEn: "Mining Engineer", quoteFa: "کوه‌ها را جابجا می‌کنم — واقعاً", quoteEn: "I move mountains — literally", emoji: "⛏️", img: BASE_IMG + "IMG_6161.PNG" },
    skillsFa: ["طراحی چاه", "برنامه‌ریزی حفاری", "کنترل انفجار"], skillsEn: ["Pit Design", "Drill Planning", "Blast Control"], xp: 500, missionCount: 4,
    phaseFa: "استخراج", phaseEn: "EXTRACTION" },
  { id: "process", phase: 3, color: "#10B981", glow: "#10b98144", mineral: "Cu • Li",
    male: { name: "Daniyar", titleFa: "مهندس فراوری", titleEn: "Process Engineer", quoteFa: "سنگ خام را به محصول تبدیل می‌کنم", quoteEn: "I turn raw stone into pure product", emoji: "🏭", img: BASE_IMG + "IMG_6160.PNG" },
    female: { name: "Mahsa", titleFa: "مهندس فراوری", titleEn: "Process Engineer", quoteFa: "شیمی قدرت فوق‌العاده من است", quoteEn: "Chemistry is my superpower", emoji: "🏭", img: BASE_IMG + "IMG_6155.PNG" },
    skillsFa: ["خردایش", "تغلیظ", "کنترل کیفیت"], skillsEn: ["Crushing", "Concentration", "Quality Control"], xp: 600, missionCount: 4,
    phaseFa: "فراوری", phaseEn: "PROCESSING" },
  { id: "commerce", phase: 4, color: "#8B5CF6", glow: "#8b5cf644", mineral: "Au • Ag",
    male: { name: "Shayan", titleFa: "مدیر تجاری", titleEn: "Commerce Director", quoteFa: "محصول معدن را به جهان می‌فروشم", quoteEn: "I sell the mine's product to the world", emoji: "🚢", img: BASE_IMG + "IMG_6154.PNG" },
    female: { name: "Layla", titleFa: "مدیر تجاری", titleEn: "Commerce Director", quoteFa: "هر محموله یک داستان در بلاکچین است", quoteEn: "Every shipment is a story on-chain", emoji: "🚢", img: BASE_IMG + "IMG_6159.PNG" },
    skillsFa: ["تجارت جهانی", "صادرات بلاکچین", "تحلیل بازار"], skillsEn: ["Global Trade", "Blockchain Export", "Market Analysis"], xp: 800, missionCount: 4,
    phaseFa: "صادرات", phaseEn: "EXPORT" },
];

const MISSIONS = [
  { id: 1, charId: "geologist", titleFa: "پست معدنی", titleEn: "Mineral Post", descFa: "درباره هماتیت یا مگنتیت در X پست بنویس", descEn: "Post about hematite or magnetite on X", reward: 30, platform: "X", icon: "🐦", difficultyFa: "آسان", difficultyEn: "Easy", instructionFa: "یه پست درباره هماتیت یا مگنتیت در X بنویس و لینکش رو اینجا بذار", instructionEn: "Write a post about hematite or magnetite on X and paste the link here" },
  { id: 2, charId: "geologist", titleFa: "اشتراک‌گذاری", titleEn: "Community Share", descFa: "اینفوگرافیک BARIN را در تلگرام به اشتراک بگذار", descEn: "Share BARIN infographic in Telegram", reward: 25, platform: "TG", icon: "✈️", difficultyFa: "آسان", difficultyEn: "Easy", instructionFa: "اینفوگرافیک BARIN رو در تلگرام به اشتراک بذار و لینک پست رو بفرست", instructionEn: "Share the BARIN infographic in Telegram and send the post link" },
  { id: 3, charId: "geologist", titleFa: "دعوت معدنچی", titleEn: "Refer a Miner", descFa: "یک عضو جدید به کامیونیتی BARIN دعوت کن", descEn: "Invite a new member to BARIN community", reward: 35, platform: "TG", icon: "👥", difficultyFa: "متوسط", difficultyEn: "Medium", instructionFa: "یه نفر جدید رو به کانال تلگرام BARIN دعوت کن و یوزرنیمش رو بفرست", instructionEn: "Invite someone new to the BARIN Telegram channel and send their username" },
  { id: 4, charId: "geologist", titleFa: "آزمون هفتگی", titleEn: "Weekly Quiz", descFa: "به سوال فنی هفتگی جواب بده", descEn: "Answer the weekly technical question", reward: 40, platform: "TG", icon: "❓", difficultyFa: "متوسط", difficultyEn: "Medium", instructionFa: "سوال هفتگی: هماتیت چند درصد آهن داره؟ جوابت رو بنویس", instructionEn: "Weekly question: What percentage of iron does hematite contain? Write your answer" },
  { id: 5, charId: "geophysicist", titleFa: "نقشه‌برداری هوایی", titleEn: "Aerial Mapping", descFa: "تفاوت اکتشاف هوایی و زمینی را در X توضیح بده", descEn: "Explain aerial vs ground exploration on X", reward: 35, platform: "X", icon: "🗺️", difficultyFa: "آسان", difficultyEn: "Easy", instructionFa: "تفاوت اکتشاف هوایی و زمینی رو در X توضیح بده و لینک پست رو بفرست", instructionEn: "Explain the difference between aerial and ground exploration on X and send the post link" },
  { id: 6, charId: "geophysicist", titleFa: "هوش مصنوعی در معدن", titleEn: "AI in Mining", descFa: "Thread درباره AI در اکتشاف معدنی بنویس", descEn: "Write thread about AI in mineral exploration", reward: 45, platform: "X", icon: "🤖", difficultyFa: "متوسط", difficultyEn: "Medium", instructionFa: "یه thread درباره نقش AI در اکتشاف معدن بنویس و لینکش رو بفرست", instructionEn: "Write a thread about the role of AI in mineral exploration and send the link" },
  { id: 7, charId: "geophysicist", titleFa: "معرفی جهانی", titleEn: "Go Global", descFa: "BARIN را به گروه انگلیسی‌زبان معرفی کن", descEn: "Introduce BARIN to an English-speaking group", reward: 40, platform: "Global", icon: "🌍", difficultyFa: "متوسط", difficultyEn: "Medium", instructionFa: "BARIN رو به یه گروه انگلیسی‌زبان معرفی کن و لینک پست رو بفرست", instructionEn: "Introduce BARIN to an English-speaking group and send the post link" },
  { id: 8, charId: "geophysicist", titleFa: "ویدیوی داده", titleEn: "Data Video", descFa: "ویدیو کوتاه درباره داده‌های فنی BARIN بساز", descEn: "Short video about BARIN technical data", reward: 50, platform: "TG", icon: "🎬", difficultyFa: "سخت", difficultyEn: "Hard", instructionFa: "یه ویدیو کوتاه درباره داده‌های فنی BARIN بساز و لینکش رو بفرست", instructionEn: "Create a short video about BARIN technical data and send the link" },
  { id: 9, charId: "engineer", titleFa: "پست طراحی چاه", titleEn: "Pit Design Post", descFa: "تفاوت معدن روباز و زیرزمینی را توضیح بده", descEn: "Explain open-pit vs underground mining", reward: 40, platform: "TG", icon: "⛏️", difficultyFa: "آسان", difficultyEn: "Easy", instructionFa: "تفاوت معدن روباز و زیرزمینی رو توضیح بده و لینک رو بفرست", instructionEn: "Explain the difference between open-pit and underground mining and send the link" },
  { id: 10, charId: "engineer", titleFa: "پست استخراج", titleEn: "Extraction Post", descFa: "با هشتگ #BarinMining درباره استخراج پست بده", descEn: "Post with #BarinMining about extraction", reward: 45, platform: "X", icon: "💥", difficultyFa: "آسان", difficultyEn: "Easy", instructionFa: "یه پست با هشتگ #BarinMining درباره استخراج بنویس و لینکش رو بفرست", instructionEn: "Write a post with #BarinMining about extraction and send the link" },
  { id: 11, charId: "engineer", titleFa: "مدل‌سازی دیجیتال", titleEn: "Digital Modeling", descFa: "اینفوگرافیک مراحل استخراج بساز", descEn: "Create infographic of extraction phases", reward: 55, platform: "TG", icon: "📊", difficultyFa: "متوسط", difficultyEn: "Medium", instructionFa: "یه اینفوگرافیک از مراحل استخراج بساز و لینکش رو بفرست", instructionEn: "Create an infographic of extraction phases and send the link" },
  { id: 12, charId: "engineer", titleFa: "تیم‌سازی", titleEn: "Team Building", descFa: "۳ عضو جدید به کامیونیتی BARIN دعوت کن", descEn: "Refer 3 new members to BARIN community", reward: 60, platform: "TG", icon: "👷", difficultyFa: "سخت", difficultyEn: "Hard", instructionFa: "۳ نفر جدید به کانال BARIN دعوت کن و یوزرنیم‌هاشون رو بفرست", instructionEn: "Invite 3 new people to the BARIN channel and send their usernames" },
  { id: 13, charId: "process", titleFa: "خردایش دیجیتال", titleEn: "Digital Crushing", descFa: "تفاوت سنگ خام و کنسانتره را توضیح بده", descEn: "Explain raw ore vs concentrate difference", reward: 50, platform: "X", icon: "🏭", difficultyFa: "آسان", difficultyEn: "Easy", instructionFa: "تفاوت سنگ خام و کنسانتره رو در X توضیح بده و لینک پست رو بفرست", instructionEn: "Explain the difference between raw ore and concentrate on X and send the post link" },
  { id: 14, charId: "process", titleFa: "آزمون کیفیت", titleEn: "Quality Testing", descFa: "سوال فنی سخت درباره فراوری جواب بده", descEn: "Answer hard technical question about processing", reward: 60, platform: "TG", icon: "🔬", difficultyFa: "متوسط", difficultyEn: "Medium", instructionFa: "سوال: فرآیند فلوتاسیون در فراوری مس چیه؟ جوابت رو بنویس", instructionEn: "Question: What is the flotation process in copper processing? Write your answer" },
  { id: 15, charId: "process", titleFa: "طراحی کارخانه", titleEn: "Plant Design", descFa: "اینفوگرافیک مراحل فراوری بساز", descEn: "Create infographic of processing phases", reward: 70, platform: "X", icon: "⚗️", difficultyFa: "سخت", difficultyEn: "Hard", instructionFa: "اینفوگرافیک مراحل فراوری رو بساز و در X پست کن، لینک رو بفرست", instructionEn: "Create an infographic of processing phases, post on X and send the link" },
  { id: 16, charId: "commerce", titleFa: "صادرات دیجیتال", titleEn: "Digital Export", descFa: "BARIN را به ۲ گروه انگلیسی‌زبان معرفی کن", descEn: "Introduce BARIN to 2 English-language groups", reward: 70, platform: "Global", icon: "🌐", difficultyFa: "متوسط", difficultyEn: "Medium", instructionFa: "BARIN رو به ۲ گروه انگلیسی‌زبان معرفی کن و لینک‌ها رو بفرست", instructionEn: "Introduce BARIN to 2 English-speaking groups and send the links" },
  { id: 17, charId: "commerce", titleFa: "تحلیل بازار EV", titleEn: "EV Market Analysis", descFa: "نقش مواد معدنی در صنعت EV را توضیح بده", descEn: "Explain role of minerals in EV industry", reward: 65, platform: "X", icon: "⚡", difficultyFa: "متوسط", difficultyEn: "Medium", instructionFa: "نقش مواد معدنی در صنعت EV رو در X توضیح بده و لینک پست رو بفرست", instructionEn: "Explain the role of minerals in the EV industry on X and send the post link" },
  { id: 18, charId: "commerce", titleFa: "صادرات بلاکچین", titleEn: "Blockchain Export", descFa: "Thread: چرا بلاکچین صادرات معدنی را بهتر می‌کند", descEn: "Thread: why blockchain improves mineral exports", reward: 80, platform: "X", icon: "⛓️", difficultyFa: "سخت", difficultyEn: "Hard", instructionFa: "یه thread درباره مزایای بلاکچین در صادرات معدنی بنویس و لینک رو بفرست", instructionEn: "Write a thread about blockchain benefits in mineral exports and send the link" },
  { id: 19, charId: "commerce", titleFa: "سفیر BARIN", titleEn: "BARIN Ambassador", descFa: "مقاله یا پادکست کوتاه درباره BARIN بساز", descEn: "Produce article or short podcast about BARIN", reward: 100, platform: "Any", icon: "🎙️", difficultyFa: "سخت", difficultyEn: "Hard", instructionFa: "یه مقاله یا پادکست کوتاه درباره BARIN بساز و لینکش رو بفرست", instructionEn: "Create an article or short podcast about BARIN and send the link" },
  { id: 20, charId: "geologist", titleFa: "گزارش اکتشاف", titleEn: "Exploration Report", descFa: "گزارش میدانی دقیق در X پست کن", descEn: "Create detailed field report post on X", reward: 45, platform: "X", icon: "📋", difficultyFa: "سخت", difficultyEn: "Hard", instructionFa: "یه گزارش میدانی دقیق درباره اکتشاف معدنی در X پست کن و لینک رو بفرست", instructionEn: "Post a detailed field report about mineral exploration on X and send the link" },
];

const MINERALS_TAP = [
  { symbol: "Fe", nameFa: "آهن", nameEn: "Iron", color: "#EF4444", glow: "#ef444466", reward: 10 },
  { symbol: "Cu", nameFa: "مس", nameEn: "Copper", color: "#F97316", glow: "#f9731666", reward: 15 },
  { symbol: "Li", nameFa: "لیتیوم", nameEn: "Lithium", color: "#10B981", glow: "#10b98166", reward: 25 },
  { symbol: "Au", nameFa: "طلا", nameEn: "Gold", color: "#F59E0B", glow: "#f59e0b66", reward: 50 },
  { symbol: "Ni", nameFa: "نیکل", nameEn: "Nickel", color: "#8B5CF6", glow: "#8b5cf666", reward: 20 },
];

const LEARN_ICONS = ["🌋", "🪨", "⛏️", "🏭", "⚡", "⛓️"];
const LEARN_COLORS = ["#EF4444", "#F59E0B", "#06B6D4", "#10B981", "#8B5CF6", "#F97316"];

// ============================================
// HELPERS
// ============================================
function GoldBorder({ children, color = "#F59E0B", style = {} }: any) {
  return <div style={{ border: `1px solid ${color}33`, borderRadius: 16, background: "#12141f", ...style }}>{children}</div>;
}
function Badge({ label, color }: any) {
  return <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: 1, background: `${color}22`, color, border: `1px solid ${color}44` }}>{label}</span>;
}
function ProgressBar({ value, max, color }: any) {
  return (
    <div style={{ background: "#ffffff0a", borderRadius: 20, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: "100%", background: `linear-gradient(to right, ${color}88, ${color})`, borderRadius: 20, transition: "width 0.3s", boxShadow: `0 0 8px ${color}66` }} />
    </div>
  );
}
function BottomNav({ active, setActive, lang }: any) {
  const t = T[lang];
  const tabs = [
    { id: "home", label: t.home, icon: "⛏️" },
    { id: "missions", label: t.missionsTab, icon: "🎯" },
    { id: "tap", label: t.mine, icon: "💎" },
    { id: "leaderboard", label: t.ranks, icon: "🏆" },
    { id: "learn", label: t.learn, icon: "📚" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "#0d0f1a", borderTop: "1px solid #1e2235", display: "flex", padding: "8px 0" }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => setActive(tab.id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0" }}>
          <span style={{ fontSize: 18, filter: active === tab.id ? "none" : "grayscale(1) opacity(0.4)" }}>{tab.icon}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: active === tab.id ? "#F59E0B" : "#6B7280", fontFamily: "monospace" }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// LANGUAGE SELECT
// ============================================
function LanguageSelect({ onSelect }: any) {
  return (
    <div style={{ minHeight: "100vh", background: "#07080f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, fontFamily: "monospace" }}>
      <div style={{ fontSize: 56, marginBottom: 24 }}>⛏️</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "#F9FAFB", marginBottom: 8, textAlign: "center" }}>BARIN Mining Quest</div>
      <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 48, textAlign: "center" }}>Choose your language / زبان خود را انتخاب کنید</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 300 }}>
        <button onClick={() => onSelect("fa")} style={{ padding: "20px 24px", background: "#12141f", border: "2px solid #F59E0B44", borderRadius: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s" }}>
          <span style={{ fontSize: 36 }}>🇮🇷</span>
          <div style={{ textAlign: "right", flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#F9FAFB" }}>فارسی</div>
            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Persian</div>
          </div>
        </button>
        <button onClick={() => onSelect("en")} style={{ padding: "20px 24px", background: "#12141f", border: "2px solid #06B6D444", borderRadius: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s" }}>
          <span style={{ fontSize: 36 }}>🌐</span>
          <div style={{ textAlign: "left", flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#F9FAFB" }}>English</div>
            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>انگلیسی</div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ============================================
// ONBOARDING
// ============================================
function Onboarding({ onComplete, lang }: any) {
  const [step, setStep] = useState(0);
  const t = T[lang];
  const slides = t.onboarding;
  const colors = ["#F59E0B", "#06B6D4", "#10B981", "#8B5CF6"];
  const icons = ["⛏️", "🎯", "💎", "🚀"];
  const s = slides[step];
  const color = colors[step];
  return (
    <div style={{ minHeight: "100vh", background: "#07080f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "monospace", direction: t.dir as any }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 48 }}>
        {slides.map((_: any, i: number) => <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? color : "#1e2235", transition: "all 0.3s" }} />)}
      </div>
      <div style={{ width: 120, height: 120, borderRadius: "50%", background: `${color}15`, border: `2px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, marginBottom: 40, boxShadow: `0 0 40px ${color}22` }}>{icons[step]}</div>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#F9FAFB", marginBottom: 8 }}>{s.title}</div>
        <div style={{ fontSize: 12, color, letterSpacing: 2, marginBottom: 16, fontWeight: 700 }}>{s.sub}</div>
        <div style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, maxWidth: 280 }}>{s.desc}</div>
      </div>
      <button onClick={() => step < slides.length - 1 ? setStep(step + 1) : onComplete()} style={{ width: "100%", maxWidth: 320, padding: 16, background: `linear-gradient(135deg, ${color}cc, ${color})`, border: "none", borderRadius: 16, cursor: "pointer", fontSize: 14, fontWeight: 900, color: "#000", letterSpacing: 2, fontFamily: "monospace", boxShadow: `0 8px 24px ${color}44` }}>
        {step < slides.length - 1 ? t.next : t.startMining}
      </button>
      {step < slides.length - 1 && <button onClick={onComplete} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 12, marginTop: 16, fontFamily: "monospace" }}>{t.skip}</button>}
    </div>
  );
}

// ============================================
// CHARACTER SELECT
// ============================================
function CharacterSelect({ onSelect, lang }: any) {
  const [selected, setSelected] = useState<any>(null);
  const [gender, setGender] = useState("male");
  const t = T[lang];
  return (
    <div style={{ minHeight: "100vh", background: "#07080f", fontFamily: "monospace", padding: "24px 16px 120px", direction: t.dir as any }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3, marginBottom: 8 }}>⛏️ BARIN MINING QUEST</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#F9FAFB" }}>{t.chooseCharacter}</div>
        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>{t.eachRoleUnlocks}</div>
      </div>
      <div style={{ display: "flex", background: "#0d0f1a", borderRadius: 12, padding: 4, marginBottom: 20, border: "1px solid #1e2235" }}>
        {["male", "female"].map(g => (
          <button key={g} onClick={() => setGender(g)} style={{ flex: 1, padding: 8, background: gender === g ? "#F59E0B" : "none", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 900, color: gender === g ? "#000" : "#6B7280", fontFamily: "monospace", transition: "all 0.2s" }}>
            {g === "male" ? t.male : t.female}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {CHARACTERS.map(char => {
          const person = char[gender as "male" | "female"];
          const isSel = selected?.id === char.id;
          const title = lang === "fa" ? person.titleFa : person.titleEn;
          const quote = lang === "fa" ? person.quoteFa : person.quoteEn;
          const phase = lang === "fa" ? char.phaseFa : char.phaseEn;
          const skills = lang === "fa" ? char.skillsFa : char.skillsEn;
          return (
            <div key={char.id} onClick={() => setSelected({ ...char, person, gender, lang })} style={{ padding: 16, borderRadius: 16, cursor: "pointer", background: "#12141f", border: `2px solid ${isSel ? char.color : "#1e2235"}`, boxShadow: isSel ? `0 0 20px ${char.glow}` : "none", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 70, height: 70, borderRadius: 14, overflow: "hidden", border: `2px solid ${char.color}55`, flexShrink: 0, background: `${char.color}15` }}>
                  {person.img ? <img src={person.img} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{person.emoji}</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#F9FAFB" }}>{person.name}</span>
                    <Badge label={phase} color={char.color} />
                  </div>
                  <div style={{ fontSize: 11, color: char.color, marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 10, color: "#6B7280", fontStyle: "italic" }}>"{quote}"</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: char.color }}>{char.xp}</div>
                  <div style={{ fontSize: 9, color: "#6B7280" }}>{t.maxXP}</div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>{char.missionCount} {t.missions}</div>
                </div>
              </div>
              {isSel && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #1e2235" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {skills.map((s: string) => <span key={s} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10, background: `${char.color}15`, color: char.color, border: `1px solid ${char.color}33` }}>{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selected && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: 16, background: "#07080f", borderTop: "1px solid #1e2235" }}>
          <button onClick={() => onSelect(selected)} style={{ width: "100%", padding: 16, background: `linear-gradient(135deg, ${selected.color}cc, ${selected.color})`, border: "none", borderRadius: 14, cursor: "pointer", fontSize: 14, fontWeight: 900, color: "#000", letterSpacing: 2, fontFamily: "monospace" }}>
            {t.startAs} {selected.person.name.toUpperCase()} ⛏️
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// MISSION MODAL
// ============================================
function MissionModal({ mission, onClose, onSubmit, char, lang }: any) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const t = T[lang];
  const title = lang === "fa" ? mission.titleFa : mission.titleEn;
  const instruction = lang === "fa" ? mission.instructionFa : mission.instructionEn;

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    await onSubmit(mission, input.trim());
    setSuccess(true);
    setLoading(false);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#000000cc", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 430, background: "#12141f", borderRadius: "20px 20px 0 0", padding: 24, border: `1px solid ${char.color}44`, direction: t.dir as any }}>
        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#10B981" }}>{t.submitted}</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 8 }}>{t.pendingReview}</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#F9FAFB" }}>{mission.icon} {title}</div>
                <div style={{ fontSize: 11, color: char.color, marginTop: 2 }}>+{mission.reward} BARIN</div>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "#6B7280", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ background: `${char.color}11`, border: `1px solid ${char.color}33`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: char.color, letterSpacing: 1, marginBottom: 6 }}>{t.guide}</div>
              <div style={{ fontSize: 13, color: "#F9FAFB", lineHeight: 1.7 }}>{instruction}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>{t.linkOrAnswer}</div>
              <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t.linkPlaceholder} style={{ width: "100%", background: "#0d0f1a", border: `1px solid ${char.color}44`, borderRadius: 12, padding: 12, color: "#F9FAFB", fontSize: 13, fontFamily: "monospace", resize: "none", height: 80, boxSizing: "border-box", outline: "none", direction: t.dir as any }} />
            </div>
            <button onClick={handleSubmit} disabled={!input.trim() || loading} style={{ width: "100%", padding: 14, background: input.trim() ? `linear-gradient(135deg, ${char.color}cc, ${char.color})` : "#1e2235", border: "none", borderRadius: 12, cursor: input.trim() ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 900, color: input.trim() ? "#000" : "#6B7280", fontFamily: "monospace" }}>
              {loading ? t.submitting : t.submitMission}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================
// HOME
// ============================================
function Home({ character, xp, barin, setActive, streak, lang }: any) {
  const char = CHARACTERS.find(c => c.id === character.id)!;
  const person = character.person;
  const t = T[lang];
  const title = lang === "fa" ? person.titleFa : person.titleEn;

  return (
    <div style={{ padding: "20px 16px 100px", fontFamily: "monospace", direction: t.dir as any }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3 }}>⛏️ BARIN MINING QUEST</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#F9FAFB", marginTop: 2 }}>{t.welcome}, {person.name}</div>
        </div>
        <div style={{ textAlign: lang === "fa" ? "left" : "right" }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#F59E0B" }}>{barin}</div>
          <div style={{ fontSize: 9, color: "#6B7280" }}>{t.barinEarned}</div>
        </div>
      </div>
      {streak > 0 && (
        <div style={{ background: "linear-gradient(135deg, #F59E0B22, #EF444422)", border: "1px solid #F59E0B44", borderRadius: 12, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🔥</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#F59E0B" }}>{streak} {t.dayStreak}</div>
            <div style={{ fontSize: 10, color: "#6B7280" }}>{t.streakMsg}</div>
          </div>
        </div>
      )}
      <GoldBorder color={char.color} style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, overflow: "hidden", border: `2px solid ${char.color}55`, background: `${char.color}20`, flexShrink: 0 }}>
            {person.img ? <img src={person.img} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{person.emoji}</div>}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#F9FAFB" }}>{person.name}</div>
            <div style={{ fontSize: 11, color: char.color }}>{title}</div>
          </div>
        </div>
        <div style={{ marginBottom: 6, fontSize: 10, color: "#6B7280", display: "flex", justifyContent: "space-between" }}>
          <span>{t.xpProgress}</span><span style={{ color: char.color }}>{xp} / {char.xp}</span>
        </div>
        <ProgressBar value={xp} max={char.xp} color={char.color} />
      </GoldBorder>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { label: t.dailyMine, sub: t.tapToMine, icon: "💎", tab: "tap", color: "#10B981" },
          { label: t.missionsTab, sub: t.completeAndEarn, icon: "🎯", tab: "missions", color: "#F59E0B" },
          { label: t.ranks, sub: "", icon: "🏆", tab: "leaderboard", color: "#8B5CF6" },
          { label: t.learn, sub: "", icon: "📚", tab: "learn", color: "#06B6D4" },
        ].map(item => (
          <button key={item.tab} onClick={() => setActive(item.tab)} style={{ padding: "16px 14px", background: "#12141f", border: `1px solid ${item.color}33`, borderRadius: 14, cursor: "pointer", textAlign: lang === "fa" ? "right" : "left" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#F9FAFB" }}>{item.label}</div>
            {item.sub && <div style={{ fontSize: 10, color: "#6B7280" }}>{item.sub}</div>}
          </button>
        ))}
      </div>
      <GoldBorder style={{ padding: 16 }}>
        <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 2, marginBottom: 8 }}>{t.dailyFact}</div>
        <div style={{ fontSize: 13, color: "#F9FAFB", lineHeight: 1.6 }}>{t.dailyFactText}</div>
      </GoldBorder>
    </div>
  );
}

// ============================================
// MISSIONS
// ============================================
function Missions({ character, onComplete, completedMissions, lang }: any) {
  const [filter, setFilter] = useState("all");
  const [activeModal, setActiveModal] = useState<any>(null);
  const t = T[lang];
  const diffColor: any = { Easy: "#10B981", Medium: "#F59E0B", Hard: "#EF4444", آسان: "#10B981", متوسط: "#F59E0B", سخت: "#EF4444" };
  const myMissions = MISSIONS.filter(m => filter === "all" ? true : m.charId === filter);

  return (
    <div style={{ padding: "20px 16px 100px", fontFamily: "monospace", direction: t.dir as any }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3 }}>🎯 {t.missionsTab.toUpperCase()}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F9FAFB", marginTop: 4 }}>{t.completeAndEarn}</div>
        <div style={{ fontSize: 11, color: "#6B7280" }}>{completedMissions.length} / {MISSIONS.length} {t.completed}</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {["all", "geologist", "geophysicist", "engineer", "process", "commerce"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 20, background: filter === f ? "#F59E0B" : "#12141f", border: `1px solid ${filter === f ? "#F59E0B" : "#1e2235"}`, color: filter === f ? "#000" : "#6B7280", fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "monospace" }}>
            {f === "all" ? (lang === "fa" ? "همه" : "All") : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {myMissions.map(m => {
          const done = completedMissions.includes(m.id);
          const char = CHARACTERS.find(c => c.id === m.charId)!;
          const title = lang === "fa" ? m.titleFa : m.titleEn;
          const desc = lang === "fa" ? m.descFa : m.descEn;
          const difficulty = lang === "fa" ? m.difficultyFa : m.difficultyEn;
          return (
            <GoldBorder key={m.id} color={done ? "#10B981" : char.color} style={{ padding: 16, opacity: done ? 0.7 : 1 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${char.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: done ? "#10B981" : "#F9FAFB" }}>{done ? "✓ " : ""}{title}</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: "#F59E0B" }}>+{m.reward}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8, lineHeight: 1.5 }}>{desc}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Badge label={m.platform} color={char.color} />
                      <Badge label={difficulty} color={diffColor[difficulty] || "#F59E0B"} />
                    </div>
                    {!done && (
                      <button onClick={() => setActiveModal({ mission: m, char })} style={{ padding: "6px 14px", background: `${char.color}22`, border: `1px solid ${char.color}55`, borderRadius: 10, cursor: "pointer", fontSize: 10, fontWeight: 700, color: char.color, fontFamily: "monospace" }}>
                        {t.submitBtn}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </GoldBorder>
          );
        })}
      </div>
      {activeModal && (
        <MissionModal mission={activeModal.mission} char={activeModal.char} lang={lang} onClose={() => setActiveModal(null)}
          onSubmit={async (mission: any, input: string) => { await onComplete(mission.id, mission.reward, input); setActiveModal(null); }} />
      )}
    </div>
  );
}

// ============================================
// TAP TO EARN
// ============================================
function TapToEarn({ onEarn, lang }: any) {
  const [energy, setEnergy] = useState(100);
  const [oreHP, setOreHP] = useState(100);
  const [mineralIdx, setMineralIdx] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [floats, setFloats] = useState<any[]>([]);
  const [shaking, setShaking] = useState(false);
  const [totalMined, setTotalMined] = useState(0);
  const [extracted, setExtracted] = useState<any>({ Fe: 0, Cu: 0, Li: 0, Au: 0, Ni: 0 });
  const floatId = useRef(0);
  const t = T[lang];
  const m = MINERALS_TAP[mineralIdx];
  const mName = lang === "fa" ? m.nameFa : m.nameEn;

  useEffect(() => { const i = setInterval(() => setEnergy(e => Math.min(100, e + 1)), 2000); return () => clearInterval(i); }, []);
  useEffect(() => { const i = setInterval(() => { if (Date.now() - lastTap > 1500) setCombo(0); }, 500); return () => clearInterval(i); }, [lastTap]);
  useEffect(() => { const i = setInterval(() => setFloats(f => f.filter((x: any) => Date.now() - x.born < 1000)), 100); return () => clearInterval(i); }, []);

  const handleTap = useCallback((e: any) => {
    if (energy <= 0) return;
    const now = Date.now();
    const newCombo = now - lastTap < 800 ? combo + 1 : 1;
    setCombo(newCombo); setLastTap(now);
    const isCrit = newCombo > 5 && Math.random() > 0.6;
    const dmg = Math.min(5 + Math.floor(newCombo / 3), 15);
    const earned = isCrit ? dmg * 2 : dmg;
    setEnergy(en => Math.max(0, en - 1));
    setShaking(true); setTimeout(() => setShaking(false), 150);
    const rect = e.currentTarget.getBoundingClientRect();
    setFloats(f => [...f, { id: floatId.current++, x: e.clientX - rect.left, y: e.clientY - rect.top, text: isCrit ? `⚡ +${earned}` : `+${earned}`, color: isCrit ? "#FCD34D" : m.color, born: Date.now() }]);
    setOreHP(hp => { const next = Math.max(0, hp - dmg); if (next <= 0) { setTimeout(() => { setMineralIdx(prev => (prev + 1) % MINERALS_TAP.length); setOreHP(100); }, 300); } return next; });
    setTotalMined(tt => tt + earned);
    setExtracted((ex: any) => ({ ...ex, [m.symbol]: ex[m.symbol] + earned }));
    onEarn(earned);
  }, [energy, combo, lastTap, m, onEarn]);

  return (
    <div style={{ padding: "20px 16px 100px", fontFamily: "monospace", direction: t.dir as any }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
        <div><div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3 }}>{t.dailyMine}</div><div style={{ fontSize: 20, fontWeight: 900, color: "#F9FAFB", marginTop: 4 }}>{t.tapToMine}</div></div>
        <div style={{ textAlign: lang === "fa" ? "left" : "right" }}><div style={{ fontSize: 18, fontWeight: 900, color: "#F59E0B" }}>{totalMined}</div><div style={{ fontSize: 9, color: "#6B7280" }}>{t.minedToday}</div></div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }} onClick={handleTap}>
        <div style={{ width: 200, height: 200, position: "relative", cursor: energy > 0 ? "pointer" : "not-allowed", transition: "transform 0.1s", transform: shaking ? "scale(0.95) rotate(-2deg)" : "scale(1)", filter: `drop-shadow(0 0 20px ${m.glow})` }}>
          <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
            <defs><radialGradient id="og" cx="40%" cy="35%" r="60%"><stop offset="0%" stopColor={m.color} stopOpacity="0.9" /><stop offset="100%" stopColor="#1a0a00" stopOpacity="0.9" /></radialGradient></defs>
            <polygon points="100,18 160,45 178,105 155,165 100,182 45,165 22,105 40,45" fill="url(#og)" />
            <polygon points="100,18 160,45 178,105 155,165 100,182 45,165 22,105 40,45" fill="rgba(0,0,0,0.4)" opacity={1 - oreHP / 100} />
            <text x="100" y="115" textAnchor="middle" fill={m.color} fontSize="36" fontWeight="900" fontFamily="Courier New" opacity="0.9">{m.symbol}</text>
          </svg>
          {floats.map((f: any) => { const age = (Date.now() - f.born) / 1000; return <div key={f.id} style={{ position: "absolute", left: f.x - 30, top: f.y - 40 - age * 60, opacity: Math.max(0, 1 - age), fontSize: 14, fontWeight: 900, color: f.color, pointerEvents: "none", whiteSpace: "nowrap", textShadow: `0 0 10px ${f.color}` }}>{f.text}</div>; })}
        </div>
      </div>
      <div style={{ textAlign: "center", fontSize: 12, color: m.color, marginBottom: 20, fontWeight: 700 }}>{mName} — {m.reward} BARIN</div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6B7280", marginBottom: 5 }}><span>{t.oreIntegrity}</span><span style={{ color: m.color }}>{oreHP}%</span></div>
        <ProgressBar value={oreHP} max={100} color={m.color} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6B7280", marginBottom: 5 }}><span>{t.energy}</span><span style={{ color: energy > 30 ? "#06B6D4" : "#EF4444" }}>{energy}/100</span></div>
        <ProgressBar value={energy} max={100} color={energy > 30 ? "#06B6D4" : "#EF4444"} />
        {energy === 0 && <div style={{ textAlign: "center", marginTop: 6, fontSize: 11, color: "#EF4444" }}>{t.recharging}</div>}
      </div>
      <GoldBorder style={{ padding: 14 }}>
        <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 2, marginBottom: 10 }}>{t.mineralsExtracted}</div>
        <div style={{ display: "flex", gap: 8 }}>
          {MINERALS_TAP.map(min => <div key={min.symbol} style={{ flex: 1, textAlign: "center", background: extracted[min.symbol] > 0 ? `${min.color}11` : "#0d0f1a", borderRadius: 10, padding: "8px 4px", border: `1px solid ${extracted[min.symbol] > 0 ? min.color + "33" : "#1e2235"}` }}><div style={{ fontSize: 13, fontWeight: 900, color: extracted[min.symbol] > 0 ? min.color : "#6B7280" }}>{min.symbol}</div><div style={{ fontSize: 10, color: "#6B7280" }}>{extracted[min.symbol]}</div></div>)}
        </div>
      </GoldBorder>
    </div>
  );
}

// ============================================
// LEADERBOARD
// ============================================
function Leaderboard({ userId, lang }: any) {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = T[lang];

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("players").select("username, barin, character_id, telegram_id").order("barin", { ascending: false }).limit(20);
      if (data) setPlayers(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const rankColor: any = { 0: "#F59E0B", 1: "#9CA3AF", 2: "#B45309" };
  const rankEmoji: any = { 0: "🥇", 1: "🥈", 2: "🥉" };
  const charEmoji: any = { geologist: "🪨", geophysicist: "🛸", engineer: "⛏️", process: "🏭", commerce: "🚢" };

  if (loading) return <div style={{ padding: "40px 16px", fontFamily: "monospace", textAlign: "center", color: "#6B7280" }}>⏳</div>;

  return (
    <div style={{ padding: "20px 16px 100px", fontFamily: "monospace", direction: t.dir as any }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3 }}>🏆 {t.ranks.toUpperCase()}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F9FAFB", marginTop: 4 }}>{t.weeklyRankings}</div>
        <div style={{ fontSize: 11, color: "#6B7280" }}>{t.liveUpdated}</div>
      </div>
      {players.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⛏️</div>
          <div style={{ color: "#6B7280", fontSize: 14 }}>{t.beFirst}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {players.map((p, i) => {
            const isMe = p.telegram_id === userId;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: isMe ? "#F59E0B11" : "#12141f", border: `1px solid ${isMe ? "#F59E0B44" : "#1e2235"}`, borderRadius: 12 }}>
                <div style={{ width: 28, textAlign: "center", fontSize: 13, fontWeight: 900, color: rankColor[i] || "#6B7280" }}>{rankEmoji[i] || i + 1}</div>
                <div style={{ fontSize: 18 }}>{charEmoji[p.character_id] || "💎"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: isMe ? "#F59E0B" : "#F9FAFB" }}>{p.username || "Miner"}{isMe ? " ★" : ""}</div>
                </div>
                <div style={{ textAlign: lang === "fa" ? "left" : "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#F59E0B" }}>{p.barin}</div>
                  <div style={{ fontSize: 9, color: "#6B7280" }}>BARIN</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// LEARN
// ============================================
function Learn({ lang }: any) {
  const [open, setOpen] = useState<number | null>(null);
  const t = T[lang];
  const topics = t.learnTopics;

  return (
    <div style={{ padding: "20px 16px 100px", fontFamily: "monospace", direction: t.dir as any }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: "#F59E0B", letterSpacing: 3 }}>📚 {t.learn.toUpperCase()}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F9FAFB", marginTop: 4 }}>{t.miningKnowledge}</div>
        <div style={{ fontSize: 11, color: "#6B7280" }}>{t.miningSubtitle}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {topics.map((topic: any, i: number) => {
          const color = LEARN_COLORS[i];
          const icon = LEARN_ICONS[i];
          return (
            <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{ background: "#12141f", border: `1px solid ${open === i ? color : "#1e2235"}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#F9FAFB" }}>{topic.title}</div>
                  <div style={{ fontSize: 10, color, marginTop: 3 }}>{topic.mineral}</div>
                </div>
                <div style={{ fontSize: 18, color: "#6B7280", transition: "transform 0.2s", transform: open === i ? "rotate(180deg)" : "none" }}>▾</div>
              </div>
              {open === i && (
                <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1e2235" }}>
                  <div style={{ background: `${color}11`, border: `1px solid ${color}33`, borderRadius: 10, padding: "10px 14px", margin: "12px 0" }}>
                    <div style={{ fontSize: 10, color, letterSpacing: 1, marginBottom: 4 }}>{t.keyFact}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB" }}>{topic.fact}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.9, whiteSpace: "pre-line" }}>{topic.content}</div>
                  <div style={{ marginTop: 12 }}><Badge label={t.barinConnected} color={color} /></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [screen, setScreen] = useState("language");
  const [lang, setLang] = useState("fa");
  const [character, setCharacter] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [xp, setXp] = useState(0);
  const [barin, setBarin] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) { tg.ready(); tg.expand(); const user = tg.initDataUnsafe?.user; if (user) { setUserId(String(user.id)); setUsername(user.username || user.first_name || "Miner"); } }
    else { setUserId("dev_" + Math.random().toString(36).substr(2, 9)); setUsername("DevMiner"); }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const loadPlayer = async () => {
      setLoading(true);
      const { data } = await supabase.from("players").select("*").eq("telegram_id", userId).single();
      if (data) {
        setBarin(data.barin || 0); setXp(data.xp || 0);
        setCompletedMissions(data.completed_missions || []);
        setStreak(data.streak || 0);
        if (data.lang) setLang(data.lang);
        if (data.character_id) {
          const char = CHARACTERS.find(c => c.id === data.character_id);
          if (char) { const person = char[data.gender as "male" | "female"] || char.male; setCharacter({ ...char, person, gender: data.gender }); setScreen("game"); }
        }
      }
      setLoading(false);
    };
    loadPlayer();
  }, [userId]);

  const handleLangSelect = (l: string) => { setLang(l); setScreen("onboarding"); };

  const handleCharSelect = async (char: any) => {
    setCharacter(char); setScreen("game");
    await supabase.from("players").upsert({ telegram_id: userId, username, character_id: char.id, gender: char.gender, lang, barin: 0, xp: 0, completed_missions: [], streak: 1, last_login: new Date().toISOString() });
  };

  const handleMissionComplete = useCallback(async (id: number, reward: number, submission: string) => {
    if (completedMissions.includes(id)) return;
    const newCompleted = [...completedMissions, id];
    const newBarin = barin + reward;
    const newXp = xp + Math.floor(reward * 0.5);
    setCompletedMissions(newCompleted); setBarin(newBarin); setXp(newXp);
    await supabase.from("players").update({ barin: newBarin, xp: newXp, completed_missions: newCompleted }).eq("telegram_id", userId);
    await supabase.from("mission_submissions").insert({ telegram_id: userId, username, mission_id: id, submission, status: "pending", created_at: new Date().toISOString() });
  }, [completedMissions, barin, xp, userId, username]);

  const handleTapEarn = useCallback(async (amount: number) => {
    const earned = Math.floor(amount * 0.1);
    setBarin(b => { const nb = b + earned; supabase.from("players").update({ barin: nb }).eq("telegram_id", userId); return nb; });
  }, [userId]);

  if (loading) return <div style={{ minHeight: "100vh", background: "#07080f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 48, marginBottom: 16 }}>⛏️</div><div style={{ color: "#F59E0B", fontSize: 14 }}>Loading...</div></div></div>;

  if (screen === "language") return <LanguageSelect onSelect={handleLangSelect} />;
  if (screen === "onboarding") return <Onboarding onComplete={() => setScreen("charselect")} lang={lang} />;
  if (screen === "charselect") return <CharacterSelect onSelect={handleCharSelect} lang={lang} />;

  return (
    <div style={{ minHeight: "100vh", background: "#07080f", color: "#F9FAFB", fontFamily: "monospace", maxWidth: 430, margin: "0 auto", position: "relative" }}>
      {activeTab === "home" && <Home character={character} xp={xp} barin={barin} setActive={setActiveTab} streak={streak} lang={lang} />}
      {activeTab === "missions" && <Missions character={character} onComplete={handleMissionComplete} completedMissions={completedMissions} lang={lang} />}
      {activeTab === "tap" && <TapToEarn onEarn={handleTapEarn} lang={lang} />}
      {activeTab === "leaderboard" && <Leaderboard userId={userId} lang={lang} />}
      {activeTab === "learn" && <Learn lang={lang} />}
      <BottomNav active={activeTab} setActive={setActiveTab} lang={lang} />
    </div>
  );
}

/* ==========================================================================
   NOOR & MAHABBA EVENT SYSTEM - DATA STORAGE & STATE ENGINE
   Clean slate: 0 photos, 0 quiz questions, 0 news dispatches, 0 magazine papers
   ========================================================================== */

const STORAGE_KEYS = {
  GALLERY: 'noor_mahabba_gallery',
  NEWS: 'noor_mahabba_news',
  MAGAZINE: 'noor_mahabba_magazine',
  QUIZ_QUESTIONS: 'noor_mahabba_quiz_questions',
  LEADERBOARD: 'noor_mahabba_leaderboard',
  ADMIN_PIN: 'noor_mahabba_admin_pin',
  QUIZ_STATUS: 'noor_mahabba_quiz_status'
};

window.STORAGE_KEYS = STORAGE_KEYS;

const DEFAULT_ADMIN_PIN = '1446';

// Clean Slate - All content arrays completely emptied as requested
// 30 Curated & Categorized Islamic Studies & Seerah Quiz Questions
const SEED_QUIZ_QUESTIONS = [
  // 1. Quran & Revelation
  {
    id: "q-101",
    category: "Quran & Revelation",
    question: "Which Surah in the Holy Quran is known as the \"Heart of the Quran\"?",
    options: [
      "Surah Al-Baqarah",
      "Surah Ya-Sin",
      "Surah Al-Mulk",
      "Surah Ar-Rahman"
    ],
    correctIndex: 1,
    explanation: "Surah Ya-Sin (Surah 36) is traditionally revered as the Heart of the Quran (Qalb al-Quran) in classical Hadith literature."
  },
  {
    id: "q-102",
    category: "Quran & Revelation",
    question: "Which was the first Surah revealed in its entirety to Prophet Muhammad (peace be upon him)?",
    options: [
      "Surah Al-Alaq",
      "Surah Al-Muddaththir",
      "Surah Al-Fatihah",
      "Surah Al-Ikhlas"
    ],
    correctIndex: 2,
    explanation: "While the initial verses revealed were from Surah Al-Alaq, Surah Al-Fatihah was the very first complete Surah revealed in its entirety all at once."
  },
  {
    id: "q-103",
    category: "Quran & Revelation",
    question: "What is the longest Ayah (verse) in the Holy Quran, and what is its subject?",
    options: [
      "Ayat al-Kursi (The Verse of the Throne) - Divine Sovereignty",
      "Ayat ad-Dayn (The Verse of the Debt) - Commercial Contracts & Loans",
      "Ayat an-Nur (The Verse of Light) - Parable of Guidance",
      "Ayat al-Mubahalah (The Verse of Imprecation) - Interfaith Dialogue"
    ],
    correctIndex: 1,
    explanation: "Ayat ad-Dayn (Surah Al-Baqarah 2:282) is the longest verse in the Holy Quran, establishing detailed guidelines for recording, witnessing, and fulfilling debt transactions."
  },
  {
    id: "q-104",
    category: "Quran & Revelation",
    question: "Which companion's name is explicitly mentioned in the text of the Holy Quran?",
    options: [
      "Abu Bakr al-Siddiq",
      "Umar ibn al-Khattab",
      "Ali ibn Abi Talib",
      "Zayd ibn Harithah"
    ],
    correctIndex: 3,
    explanation: "Zayd ibn Harithah (may Allah be pleased with him) is the only Sahabi whose name is explicitly mentioned in the text of the Holy Quran (Surah Al-Ahzab 33:37)."
  },
  {
    id: "q-105",
    category: "Quran & Revelation",
    question: "How many Surahs are there in the Quran, and how many Juz (parts) is it divided into?",
    options: [
      "114 Surahs and 30 Juz",
      "112 Surahs and 30 Juz",
      "114 Surahs and 28 Juz",
      "120 Surahs and 30 Juz"
    ],
    correctIndex: 0,
    explanation: "The Holy Quran comprises exactly 114 Surahs structured into 30 Juz (equal divisions) to facilitate systematic recitation and memorization."
  },

  // 2. Seerah & Prophetic History
  {
    id: "q-201",
    category: "Seerah & Prophetic History",
    question: "In which cave did the Prophet Muhammad (pbuh) receive the very first revelation?",
    options: [
      "Cave of Thawr (Ghar Thawr)",
      "Cave of Hira (Ghar Hira)",
      "Cave of Uhud",
      "Cave of Quba"
    ],
    correctIndex: 1,
    explanation: "The Prophet (pbuh) received the first revelation from Angel Jibril while in devotion in the Cave of Hira atop Jabal al-Nour (The Mountain of Light)."
  },
  {
    id: "q-202",
    category: "Seerah & Prophetic History",
    question: "What title was given to Prophet Muhammad (pbuh) by the Quraysh before prophethood due to his honesty?",
    options: [
      "Al-Farooq (The Distinguisher)",
      "Sayyid al-Shuhada (Master of Martyrs)",
      "Al-Amin (The Trustworthy) and Al-Sadiq (The Truthful)",
      "Dhu al-Nurayn (Possessor of Two Lights)"
    ],
    correctIndex: 2,
    explanation: "Prior to revelation, the Makkans universally honored the Prophet (pbuh) as Al-Amin (The Trustworthy) and Al-Sadiq (The Truthful) for his upright character."
  },
  {
    id: "q-203",
    category: "Seerah & Prophetic History",
    question: "In which year of the Hijrah did the decisive Battle of Badr take place?",
    options: [
      "1 AH",
      "2 AH",
      "3 AH",
      "5 AH"
    ],
    correctIndex: 1,
    explanation: "The Battle of Badr (Ghazwat Badr al-Kubra) took place on the 17th of Ramadan in the 2nd year of the Hijrah (2 AH / 624 CE)."
  },
  {
    id: "q-204",
    category: "Seerah & Prophetic History",
    question: "Who accompanied the Prophet Muhammad (pbuh) during the historic migration (Hijrah) from Makkah to Madinah?",
    options: [
      "Ali ibn Abi Talib",
      "Uthman ibn Affan",
      "Abu Bakr al-Siddiq",
      "Umar ibn al-Khattab"
    ],
    correctIndex: 2,
    explanation: "Abu Bakr al-Siddiq (RA) had the honor of accompanying the Prophet (pbuh) during the Hijrah, commemorated in the Quran as 'the second of the two in the cave' (9:40)."
  },
  {
    id: "q-205",
    category: "Seerah & Prophetic History",
    question: "What is the name of the peace treaty signed between the Muslims of Madinah and the Quraysh of Makkah in 6 AH?",
    options: [
      "The Constitution of Madinah (Mithaq al-Madinah)",
      "The Treaty of Hudaybiyyah (Sulh al-Hudaybiyyah)",
      "The Pledge of Ridwan (Bay'at al-Ridwan)",
      "The Pact of Najran"
    ],
    correctIndex: 1,
    explanation: "The Treaty of Hudaybiyyah was negotiated in 6 AH, initiating a period of peace that allowed the message of Islam to spread rapidly throughout Arabia."
  },

  // 3. Aqeedah & Fundamentals of Faith
  {
    id: "q-301",
    category: "Aqeedah & Fundamentals of Faith",
    question: "What are the six Pillars of Iman (Articles of Faith) in Islam?",
    options: [
      "Shahadah, Salah, Zakat, Sawm, Hajj, and Jihad",
      "Belief in Allah, His Angels, His Revealed Books, His Messengers, the Day of Judgment, and Divine Decree (Qadr)",
      "Love, Compassion, Charity, Prayer, Truthfulness, and Fasting",
      "Tawhid, Adl, Nubuwwah, Imamah, Ma'ad, and Walayah"
    ],
    correctIndex: 1,
    explanation: "Detailed in Hadith Jibril, the six Pillars of Iman are: belief in Allah, His Angels, His Books, His Messengers, the Last Day, and Divine Decree (Qadr)."
  },
  {
    id: "q-302",
    category: "Aqeedah & Fundamentals of Faith",
    question: "What does the theological term Tawhid al-Rububiyyah signify?",
    options: [
      "Directing all acts of worship exclusively to Allah",
      "Affirming the Oneness of Allah in His Lordship, Creation, Sovereignty, and Maintenance of the universe",
      "Confirming Allah's Divine Names and Attributes without likeness",
      "Observing ritual prayers with full devotion"
    ],
    correctIndex: 1,
    explanation: "Tawhid al-Rububiyyah affirms that Allah alone is the Creator, Sustainer, Ruler, and Nourisher of all existence without any partner."
  },
  {
    id: "q-303",
    category: "Aqeedah & Fundamentals of Faith",
    question: "Which archangel is tasked with blowing the Trumpet (Sur) to signal the Day of Resurrection?",
    options: [
      "Angel Jibril (Gabriel)",
      "Angel Mikail (Michael)",
      "Angel Israfil",
      "Angel Malik"
    ],
    correctIndex: 2,
    explanation: "Angel Israfil is the archangel commissioned to blow the Trumpet (as-Sur) to mark the end of the world and summon creation for resurrection."
  },
  {
    id: "q-304",
    category: "Aqeedah & Fundamentals of Faith",
    question: "What is the linguistic and theological opposite of Tawhid (Monotheism)?",
    options: [
      "Fisq (Moral deviation)",
      "Nifaq (Hypocrisy)",
      "Shirk (Associating partners with Allah)",
      "Bid'ah (Religious innovation)"
    ],
    correctIndex: 2,
    explanation: "Shirk—associating partners, rivals, or equals with Allah in worship or divine lordship—is the ultimate antithesis of Tawhid."
  },
  {
    id: "q-305",
    category: "Aqeedah & Fundamentals of Faith",
    question: "Which divine scripture was revealed to Prophet Dawud (David, peace be upon him)?",
    options: [
      "The Tawrat (Torah)",
      "The Injil (Gospel)",
      "The Zabur (Psalms)",
      "The Suhuf (Scrolls of Abraham)"
    ],
    correctIndex: 2,
    explanation: "The Zabur (Psalms) was revealed by Allah to Prophet Dawud (AS), as stated in Surah An-Nisa (4:163): 'And to Dawud We gave the Zabur.'"
  },

  // 4. Fiqh & Worship (Ibadah)
  {
    id: "q-401",
    category: "Fiqh & Worship (Ibadah)",
    question: "What is the minimum threshold of wealth upon which Zakat becomes obligatory called?",
    options: [
      "Hawl",
      "Nisab",
      "Sadaqah",
      "Khums"
    ],
    correctIndex: 1,
    explanation: "Nisab is the minimum threshold (~85 grams gold / 595 grams silver) upon which paying 2.5% Zakat becomes mandatory once possessed for a full lunar year (Hawl)."
  },
  {
    id: "q-402",
    category: "Fiqh & Worship (Ibadah)",
    question: "What is the term for ritual purification using clean earth or sand when water is unavailable or cannot be used?",
    options: [
      "Istinja",
      "Ghusl",
      "Tayammum",
      "Wudu"
    ],
    correctIndex: 2,
    explanation: "Tayammum is the dry ritual purification with clean earth or dust, legislated in Surah Al-Ma'idah (5:6) when water is unavailable or dangerous to use."
  },
  {
    id: "q-403",
    category: "Fiqh & Worship (Ibadah)",
    question: "Which standing (Wuquf) is considered the indispensable pillar (rukn) without which Hajj is invalid?",
    options: [
      "Wuquf at Muzdalifah",
      "Wuquf at the Plains of Arafah on the 9th of Dhul-Hijjah",
      "Staying at Mina during the Days of Tashreeq",
      "Standing at the Station of Ibrahim"
    ],
    correctIndex: 1,
    explanation: "Standing at Arafah on the 9th of Dhul-Hijjah is the paramount pillar of Hajj. The Prophet (pbuh) famously stated: 'Hajj is Arafah' (Al-Hajju Arafah)."
  },
  {
    id: "q-404",
    category: "Fiqh & Worship (Ibadah)",
    question: "What are the five daily obligatory prayers in chronological order of the day?",
    options: [
      "Fajr, Dhuhr, Asr, Maghrib, and Isha",
      "Dhuhr, Asr, Maghrib, Isha, and Fajr",
      "Fajr, Ishraq, Dhuhr, Asr, and Maghrib",
      "Tahajjud, Fajr, Dhuhr, Asr, and Isha"
    ],
    correctIndex: 0,
    explanation: "The five prescribed daily prayers in sequence from dawn are: Fajr (Dawn), Dhuhr (Midday), Asr (Afternoon), Maghrib (Sunset), and Isha (Night)."
  },
  {
    id: "q-405",
    category: "Fiqh & Worship (Ibadah)",
    question: "Under Islamic jurisprudence, what is the term for an action that is recommended and rewarded, but not sinful if omitted?",
    options: [
      "Fard (Obligatory)",
      "Makruh (Disliked)",
      "Mubah (Permissible/Neutral)",
      "Mustahabb (Recommended / Sunnah / Mandub)"
    ],
    correctIndex: 3,
    explanation: "Mustahabb (also called Sunnah or Mandub) encompasses acts that earn divine reward when performed, but carry no sin or punishment if omitted."
  },

  // 5. Hadith & Hadith Sciences
  {
    id: "q-501",
    category: "Hadith & Hadith Sciences",
    question: "Who is the Sahabi who narrated the highest number of Hadiths from the Prophet (pbuh)?",
    options: [
      "Abdullah ibn Umar (RA)",
      "Anas ibn Malik (RA)",
      "Abu Hurairah (RA)",
      "Aisha bint Abi Bakr (RA)"
    ],
    correctIndex: 2,
    explanation: "Abu Hurairah (RA) was blessed with a phenomenal memory and accompanied the Prophet (pbuh) constantly, narrating 5,374 Hadiths."
  },
  {
    id: "q-502",
    category: "Hadith & Hadith Sciences",
    question: "What are the two primary components that make up a Hadith?",
    options: [
      "Sanad (Chain of transmitters) and Matn (The actual text/content)",
      "Tafsir (Exegesis) and Qira'at (Recitation style)",
      "Riwayah (Transmission) and Dirayah (Jurisprudence)",
      "Fiqh (Law) and Fatwa (Verdict)"
    ],
    correctIndex: 0,
    explanation: "A Hadith consists of two fundamental parts: the Sanad (the chain of narrators linking to the Prophet) and the Matn (the text/speech itself)."
  },
  {
    id: "q-503",
    category: "Hadith & Hadith Sciences",
    question: "What is the collective name given to the six canonical collections of Sunni Hadith?",
    options: [
      "Al-Mu'jam al-Kabir",
      "The Kutub al-Sittah (or Al-Sihah al-Sittah)",
      "Riyadh al-Salihin",
      "Al-Muwatta Collections"
    ],
    correctIndex: 1,
    explanation: "The Kutub al-Sittah comprise: Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawood, Jami' al-Tirmidhi, Sunan al-Nasa'i, and Sunan Ibn Majah."
  },
  {
    id: "q-504",
    category: "Hadith & Hadith Sciences",
    question: "What is a Hadith called in which the Prophet (pbuh) quotes words directly from Allah that are not part of the Quran?",
    options: [
      "Hadith Mutawatir",
      "Hadith Hasan",
      "Hadith Qudsi (Sacred Hadith)",
      "Hadith Da'if"
    ],
    correctIndex: 2,
    explanation: "Hadith Qudsi is a sacred report wherein the Prophet (pbuh) relates the meaning of Allah's words, distinct in status and phrasing from the Holy Quran."
  },
  {
    id: "q-505",
    category: "Hadith & Hadith Sciences",
    question: "Which renowned scholar compiled the landmark authentic collection titled Al-Jami' al-Sahih?",
    options: [
      "Imam Muslim ibn al-Hajjaj",
      "Imam Muhammad ibn Isma'il al-Bukhari",
      "Imam Malik ibn Anas",
      "Imam Ahmad ibn Hanbal"
    ],
    correctIndex: 1,
    explanation: "Imam Muhammad ibn Isma'il al-Bukhari (194-256 AH) spent sixteen rigorous years verifying and compiling Al-Jami' al-Sahih."
  },

  // 6. Early Islamic History & Khulafa
  {
    id: "q-601",
    category: "Early Islamic History & Khulafa",
    question: "Who were the four Rightly Guided Caliphs (Al-Khulafa al-Rashidun) in correct chronological order?",
    options: [
      "Abu Bakr, Ali, Umar, and Uthman",
      "Umar, Abu Bakr, Uthman, and Ali",
      "Abu Bakr al-Siddiq, Umar ibn al-Khattab, Uthman ibn Affan, and Ali ibn Abi Talib",
      "Uthman, Ali, Abu Bakr, and Umar"
    ],
    correctIndex: 2,
    explanation: "The Rashidun Caliphs governed in this order: Abu Bakr al-Siddiq (11-13 AH), Umar ibn al-Khattab (13-23 AH), Uthman ibn Affan (23-35 AH), and Ali ibn Abi Talib (35-40 AH)."
  },
  {
    id: "q-602",
    category: "Early Islamic History & Khulafa",
    question: "During whose caliphate was the standardized written compilation of the Quran (Mushaf) distributed to regional Islamic centers?",
    options: [
      "Caliph Abu Bakr al-Siddiq",
      "Caliph Umar ibn al-Khattab",
      "Caliph Uthman ibn Affan",
      "Caliph Ali ibn Abi Talib"
    ],
    correctIndex: 2,
    explanation: "Caliph Uthman ibn Affan (RA) unified the recitation of the Quran and dispatched master copies of the Mushaf to major regional cities."
  },
  {
    id: "q-603",
    category: "Early Islamic History & Khulafa",
    question: "Who was the very first person and woman to embrace Islam and believe in Prophet Muhammad (pbuh)?",
    options: [
      "Aisha bint Abi Bakr (RA)",
      "Khadijah bint Khuwaylid (RA)",
      "Fatimah bint Muhammad (RA)",
      "Asma bint Abi Bakr (RA)"
    ],
    correctIndex: 1,
    explanation: "Umm al-Mu'minin Khadijah bint Khuwaylid (RA), the Prophet's wife, was the very first person to accept Islam and give him comfort and faith."
  },
  {
    id: "q-604",
    category: "Early Islamic History & Khulafa",
    question: "Which city served as the central administrative capital during the caliphate of Ali ibn Abi Talib (RA)?",
    options: [
      "Makkah",
      "Madinah",
      "Damascus",
      "Kufa"
    ],
    correctIndex: 3,
    explanation: "Caliph Ali ibn Abi Talib (RA) relocated the administrative capital of the Caliphate from Madinah to Kufa (in present-day Iraq) in 36 AH."
  },
  {
    id: "q-605",
    category: "Early Islamic History & Khulafa",
    question: "Which companion was appointed by Abu Bakr to lead the initial committee to collect the Quranic manuscripts into a single codex?",
    options: [
      "Zayd ibn Thabit (RA)",
      "Abdullah ibn Mas'ud (RA)",
      "Ubayy ibn Ka'b (RA)",
      "Mu'adh ibn Jabal (RA)"
    ],
    correctIndex: 0,
    explanation: "Zayd ibn Thabit (RA) was commissioned by Abu Bakr and Umar (RA) after Yamama to painstakingly assemble the Quran into a single authenticated codex."
  }
];

const SEED_LEADERBOARD = [];

class DataStore {
  constructor() {
    this.initStore();
  }

  initStore() {
    // Flag to enforce clean slate or current seed version
    const SEED_VERSION_KEY = 'noor_mahabba_seed_v4';

    if (!localStorage.getItem(SEED_VERSION_KEY)) {
      // Auto-load the 30 curated and categorized quiz questions
      this.set(STORAGE_KEYS.QUIZ_QUESTIONS, SEED_QUIZ_QUESTIONS);
      localStorage.setItem(SEED_VERSION_KEY, 'true');
    }

    // Ensure fallback initialization if any key is missing or empty
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
      this.set(STORAGE_KEYS.GALLERY, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
      this.set(STORAGE_KEYS.NEWS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MAGAZINE)) {
      this.set(STORAGE_KEYS.MAGAZINE, []);
    }
    const currentQuiz = this.get(STORAGE_KEYS.QUIZ_QUESTIONS);
    if (!currentQuiz || currentQuiz.length === 0) {
      this.set(STORAGE_KEYS.QUIZ_QUESTIONS, SEED_QUIZ_QUESTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEADERBOARD)) {
      this.set(STORAGE_KEYS.LEADERBOARD, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_PIN)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN);
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUIZ_STATUS)) {
      this.set(STORAGE_KEYS.QUIZ_STATUS, {
        isOpen: false,
        message: 'The Prophetic Seerah Challenge is currently closed. Please wait for the administrator to open the quiz session.'
      });
    }
  }

  // Generic Get / Set
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return [];
    }
  }

  set(key, data) {
    try {
      // Sanitize undefined fields so Firebase never rejects the payload
      const cleanData = JSON.parse(JSON.stringify(data, (k, v) => (v === undefined ? null : v)));
      localStorage.setItem(key, JSON.stringify(cleanData));
      // Real-time synchronization to Firebase Cloud Database if connected
      if (window.firebaseService && typeof window.firebaseService.syncToFirebase === 'function') {
        window.firebaseService.syncToFirebase(key, cleanData);
      }
      return true;
    } catch (e) {
      if (e && (e.name === 'QuotaExceededError' || e.code === 22)) {
        console.error(`Storage quota exceeded for ${key}. Try using a URL instead of uploading a file directly.`, e);
        if (window.app && window.app.showToast) {
          window.app.showToast('Storage full! Please use a URL (Google Drive link) instead of uploading a file directly.', 'error');
        }
      } else {
        console.error(`Error saving ${key} to storage:`, e);
      }
      return false;
    }
  }

  // Google Drive Link Transformer Helper
  convertGoogleDriveUrl(url, isVideo = false) {
    if (!url || typeof url !== 'string') return url;
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                  url.match(/drive\.google\.com\/.*[?&]id=([a-zA-Z0-9_-]+)/) ||
                  url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/) ||
                  url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return url;
    const fileId = match[1];
    if (isVideo) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // Gallery CRUD
  getGallery() {
    return this.get(STORAGE_KEYS.GALLERY);
  }

  addGalleryItem(item) {
    const items = this.getGallery();
    const isVideo = item.mediaType === 'video' || !!item.videoUrl;
    let imageUrl = item.imageUrl || '';
    let videoUrl = item.videoUrl || '';

    // Only transform Google Drive URLs — skip data: URLs (base64 local files)
    if (imageUrl && !imageUrl.startsWith('data:')) imageUrl = this.convertGoogleDriveUrl(imageUrl, false);
    if (videoUrl && !videoUrl.startsWith('data:')) videoUrl = this.convertGoogleDriveUrl(videoUrl, true);

    const newItem = {
      id: 'gal-' + Date.now(),
      date: item.date || new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...item,
      imageUrl,
      videoUrl: videoUrl || ''
    };
    // Ensure no undefined values exist
    Object.keys(newItem).forEach(k => {
      if (newItem[k] === undefined) delete newItem[k];
    });
    items.unshift(newItem);
    const saved = this.set(STORAGE_KEYS.GALLERY, items);
    if (!saved) {
      // Storage failed — try saving without the image data as fallback
      console.warn('Gallery save failed, retrying without image data...');
      newItem.imageUrl = '';
      items[0] = newItem;
      this.set(STORAGE_KEYS.GALLERY, items);
    }
    return newItem;
  }

  deleteGalleryItem(id) {
    let items = this.getGallery();
    items = items.filter(i => i.id !== id);
    this.set(STORAGE_KEYS.GALLERY, items);
  }

  updateGalleryItem(id, updatedFields) {
    const items = this.getGallery();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      if (updatedFields.imageUrl && !updatedFields.imageUrl.startsWith('data:')) updatedFields.imageUrl = this.convertGoogleDriveUrl(updatedFields.imageUrl, false);
      if (updatedFields.videoUrl && !updatedFields.videoUrl.startsWith('data:')) updatedFields.videoUrl = this.convertGoogleDriveUrl(updatedFields.videoUrl, true);
      items[index] = { ...items[index], ...updatedFields };
      this.set(STORAGE_KEYS.GALLERY, items);
      return items[index];
    }
    return null;
  }

  // News CRUD
  getNews() {
    return this.get(STORAGE_KEYS.NEWS);
  }

  addNewsItem(item) {
    const items = this.getNews();
    const newItem = {
      id: 'news-' + Date.now(),
      date: item.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: item.readTime || '3 min read',
      ...item
    };
    items.unshift(newItem);
    this.set(STORAGE_KEYS.NEWS, items);
    return newItem;
  }

  updateNewsItem(id, updatedFields) {
    const items = this.getNews();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedFields };
      this.set(STORAGE_KEYS.NEWS, items);
      return items[index];
    }
    return null;
  }

  deleteNewsItem(id) {
    let items = this.getNews();
    items = items.filter(i => i.id !== id);
    this.set(STORAGE_KEYS.NEWS, items);
  }

  // Magazine CRUD
  getMagazine() {
    return this.get(STORAGE_KEYS.MAGAZINE);
  }

  addMagazineItem(item) {
    const items = this.getMagazine();
    const newItem = {
      id: 'mag-' + Date.now(),
      ...item
    };
    items.unshift(newItem);
    this.set(STORAGE_KEYS.MAGAZINE, items);
    return newItem;
  }

  updateMagazineItem(id, updatedFields) {
    const items = this.getMagazine();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedFields };
      this.set(STORAGE_KEYS.MAGAZINE, items);
      return items[index];
    }
    return null;
  }

  deleteMagazineItem(id) {
    let items = this.getMagazine();
    items = items.filter(i => i.id !== id);
    this.set(STORAGE_KEYS.MAGAZINE, items);
  }

  // Quiz Questions CRUD
  getQuizQuestions() {
    return this.get(STORAGE_KEYS.QUIZ_QUESTIONS);
  }

  addQuizQuestion(q) {
    const items = this.getQuizQuestions();
    const newQ = {
      id: 'q-' + Date.now(),
      ...q
    };
    items.push(newQ);
    this.set(STORAGE_KEYS.QUIZ_QUESTIONS, items);
    return newQ;
  }

  deleteQuizQuestion(id) {
    let items = this.getQuizQuestions();
    items = items.filter(i => i.id !== id);
    this.set(STORAGE_KEYS.QUIZ_QUESTIONS, items);
  }

  updateQuizQuestion(id, updatedFields) {
    const items = this.getQuizQuestions();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedFields };
      this.set(STORAGE_KEYS.QUIZ_QUESTIONS, items);
      return items[index];
    }
    return null;
  }

  loadCuratedQuizQuestions() {
    this.set(STORAGE_KEYS.QUIZ_QUESTIONS, SEED_QUIZ_QUESTIONS);
    return SEED_QUIZ_QUESTIONS;
  }

  // Leaderboard CRUD
  getLeaderboard() {
    const list = this.get(STORAGE_KEYS.LEADERBOARD);
    return list
      .filter(item => item && item.id !== '__quiz_status__' && !item.isQuizStatus)
      .sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken);
  }

  addLeaderboardEntry(entry) {
    const list = this.get(STORAGE_KEYS.LEADERBOARD);
    const newEntry = {
      id: 'lb-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...entry
    };
    list.push(newEntry);
    this.set(STORAGE_KEYS.LEADERBOARD, list);
    return newEntry;
  }

  clearLeaderboard() {
    const current = this.getQuizStatus();
    const statusEntry = {
      id: '__quiz_status__',
      isQuizStatus: true,
      isOpen: current.isOpen,
      message: current.message,
      updatedAt: current.updatedAt
    };
    this.set(STORAGE_KEYS.LEADERBOARD, [statusEntry]);
  }

  // Admin PIN Authentication
  getAdminPin() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || DEFAULT_ADMIN_PIN;
  }

  setAdminPin(newPin) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin);
  }

  // Quiz Session Control (Open / Closed Status)
  getQuizStatus() {
    const defaultStatus = {
      isOpen: false,
      message: 'The Prophetic Seerah Challenge is currently closed. Please wait for the administrator to open the quiz session.'
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_STATUS);
      if (!raw) return defaultStatus;
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'boolean') {
        return { isOpen: parsed, message: defaultStatus.message };
      }
      return {
        isOpen: !!parsed.isOpen,
        message: parsed.message || defaultStatus.message,
        updatedAt: parsed.updatedAt || null
      };
    } catch (e) {
      return defaultStatus;
    }
  }

  setQuizStatus(status) {
    const current = this.getQuizStatus();
    const newStatus = {
      isOpen: typeof status === 'boolean' ? status : !!status.isOpen,
      message: (typeof status === 'object' && status.message) ? status.message : current.message,
      updatedAt: new Date().toISOString()
    };
    this.set(STORAGE_KEYS.QUIZ_STATUS, newStatus);

    // Fallback sync: embed in leaderboard channel so it syncs even if Firebase rules don't have /quiz_status yet
    try {
      const rawLb = this.get(STORAGE_KEYS.LEADERBOARD);
      const filtered = rawLb.filter(item => item && item.id !== '__quiz_status__' && !item.isQuizStatus);
      filtered.push({
        id: '__quiz_status__',
        isQuizStatus: true,
        isOpen: newStatus.isOpen,
        message: newStatus.message,
        updatedAt: newStatus.updatedAt
      });
      this.set(STORAGE_KEYS.LEADERBOARD, filtered);
    } catch (e) {}

    return newStatus;
  }

  verifyPin(inputPin) {
    return inputPin === this.getAdminPin();
  }

  // Reset to Default Factory Seeds (Clean slate)
  resetToDefaults() {
    this.set(STORAGE_KEYS.GALLERY, []);
    this.set(STORAGE_KEYS.NEWS, []);
    this.set(STORAGE_KEYS.MAGAZINE, []);
    this.set(STORAGE_KEYS.QUIZ_QUESTIONS, []);
    this.set(STORAGE_KEYS.LEADERBOARD, []);
    this.set(STORAGE_KEYS.QUIZ_STATUS, {
      isOpen: false,
      message: 'The Prophetic Seerah Challenge is currently closed. Please wait for the administrator to open the quiz session.'
    });
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN);
  }

  // Export full portal JSON
  exportData() {
    return JSON.stringify({
      version: '2.0',
      system: 'Noor & Mahabba Event System',
      timestamp: new Date().toISOString(),
      gallery: this.getGallery(),
      news: this.getNews(),
      magazine: this.getMagazine(),
      quizQuestions: this.getQuizQuestions(),
      leaderboard: this.getLeaderboard(),
      quizStatus: this.getQuizStatus()
    }, null, 2);
  }

  // Import portal JSON
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.gallery) this.set(STORAGE_KEYS.GALLERY, data.gallery);
      if (data.news) this.set(STORAGE_KEYS.NEWS, data.news);
      if (data.magazine) this.set(STORAGE_KEYS.MAGAZINE, data.magazine);
      if (data.quizQuestions) this.set(STORAGE_KEYS.QUIZ_QUESTIONS, data.quizQuestions);
      if (data.leaderboard) this.set(STORAGE_KEYS.LEADERBOARD, data.leaderboard);
      if (data.quizStatus) this.setQuizStatus(data.quizStatus);
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  }
}

window.dataStore = new DataStore();

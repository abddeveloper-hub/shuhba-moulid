/* ==========================================================================
   MAWLID CELEBRATION PORTAL - DATA STORAGE & SEED ENGINE
   Robust LocalStorage state management with comprehensive authentic seed data.
   ========================================================================== */

const STORAGE_KEYS = {
  GALLERY: 'mawlid_portal_gallery',
  NEWS: 'mawlid_portal_news',
  MAGAZINE: 'mawlid_portal_magazine',
  QUIZ_QUESTIONS: 'mawlid_portal_quiz_questions',
  LEADERBOARD: 'mawlid_portal_leaderboard',
  ADMIN_PIN: 'mawlid_portal_admin_pin'
};

const DEFAULT_ADMIN_PIN = '1446';

// Curated high quality seed data
const SEED_GALLERY = [
  {
    id: 'gal-1',
    title: 'Grand Mawlid Opening & Keynote Assembly',
    category: 'Stage Programs',
    imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
    caption: 'Hundreds of attendees and students gather in the main auditorium for the recitation of Surat Al-Fath and opening remarks.',
    date: '12 Rabi al-Awwal 1446'
  },
  {
    id: 'gal-2',
    title: 'Prophetic Artifacts & Manuscript Exhibition',
    category: 'Exhibitions',
    imageUrl: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1200&q=80',
    caption: 'Handcrafted Ottoman and Andalusian calligraphy pieces exploring the Shama\'il (attributes) of the Prophet (PBUH).',
    date: '12 Rabi al-Awwal 1446'
  },
  {
    id: 'gal-3',
    title: 'Youth Excellence & Seerah Trophy Presentation',
    category: 'Awards',
    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80',
    caption: 'Honoring top scorers of the annual Seerah Research Essay contest and inter-school speech competition.',
    date: '11 Rabi al-Awwal 1446'
  },
  {
    id: 'gal-4',
    title: 'Choral Nasheed & Qasidah Burdah Performance',
    category: 'Stage Programs',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    caption: 'The student vocal choir performing classical acoustic odes in praise of the Messenger of Mercy.',
    date: '12 Rabi al-Awwal 1446'
  },
  {
    id: 'gal-5',
    title: 'Student Islamic Geometry & Calligraphy Showcase',
    category: 'Exhibitions',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    caption: 'Intricate biomorphic and geometric patterns drafted by secondary school arts scholars.',
    date: '10 Rabi al-Awwal 1446'
  },
  {
    id: 'gal-6',
    title: 'Community Mawlid Banquet & Fellowship Dinner',
    category: 'Stage Programs',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    caption: 'Volunteers and community elders serving celebratory meals and sweet halwa to guests from across the city.',
    date: '12 Rabi al-Awwal 1446'
  },
  {
    id: 'gal-7',
    title: 'Children\'s Poetry Recitation & Storytelling Circle',
    category: 'Stage Programs',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    caption: 'Primary students sharing rhyming verses narrating stories of the Prophet\'s kindness to animals and orphans.',
    date: '11 Rabi al-Awwal 1446'
  },
  {
    id: 'gal-8',
    title: 'Community Charity & Humanitarian Drive Honors',
    category: 'Awards',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    caption: 'Recognizing student volunteer teams that packed 1,500 food relief parcels in commemoration of Mawlid.',
    date: '11 Rabi al-Awwal 1446'
  }
];

const SEED_NEWS = [
  {
    id: 'news-1',
    title: 'Mawlid 1446 Celebration Kicks Off with Over 2,000 Visitors',
    category: 'Event Recap',
    date: 'October 14, 2024',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'The annual celebration of the Prophet’s birth commenced this morning with inspirational discourses, academic exhibits, and community engagement.',
    body: `The atmosphere at the campus pavilion was filled with reverence and joy as the annual Mawlid celebration opened today under the theme: "Mercy to all Worlds: Embodying Compassion in Contemporary Times."

Opening with solemn recitations from the Holy Qur'an, keynote scholars highlighted how the moral character and gentle demeanor of Prophet Muhammad (PBUH) provide a timeless blueprint for unity, community service, and ethical living.

"Mawlid is not merely a commemoration of historical antiquity; it is an active renewal of our pledge to live with honesty, generosity, and boundless mercy," stated Dean Dr. Tariq Al-Mansoor during his opening address.

Throughout the afternoon, attendees toured the student manuscript pavilions, participated in the interactive Seerah quiz, and attended interfaith goodwill panels.`
  },
  {
    id: 'news-2',
    title: 'Annual Student Seerah Research Paper Winners Announced',
    category: 'Academics',
    date: 'October 12, 2024',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'Sixteen student papers were chosen for publication in this year\'s official Mawlid Academic Magazine, exploring environmental ethics and diplomacy.',
    body: `The Academic Review Committee has released the final selections for the 1446 Mawlid Research Journal. Over 75 submissions were received from senior high school and undergraduate students across three continents.

The jury commended the high rigor and modern relevance of the essays, specifically noting pieces addressing restorative justice, conservation of water during ablution, and ethical trade practices.

The full papers are now readable online in our digital Magazine reader, complete with academic abstracts and author biographies.`
  },
  {
    id: 'news-3',
    title: 'Grand Exhibition: 100 Years of Islamic Calligraphy Art Opens',
    category: 'Exhibitions',
    date: 'October 10, 2024',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'An enchanting journey through Thuluth, Naskh, and Kufic script designs illustrating prophetic virtues and classical poetry.',
    body: `Visitors entering Hall B this week will encounter a breathtaking panorama of traditional and contemporary calligraphic compositions created by master artisans and mentored student apprentices.

The centerpiece of the gallery is a 6-meter hand-gilded mural portraying the Shama\'il Al-Muhammadiyya, illuminated with lapis lazuli and 24-karat gold leaf.

Daily guided tours and calligraphy workshops will take place at 11:00 AM and 3:30 PM throughout the event duration.`
  },
  {
    id: 'news-4',
    title: 'Community Relief Initiative Distributes 1,500 Care Hampers',
    category: 'Charity',
    date: 'October 08, 2024',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'Emulating the Prophet\'s habit of feeding the needy, youth volunteers organized a comprehensive food security package distribution.',
    body: `In keeping with the Prophetic instruction that "the best of people are those that bring the most benefit to others," the Mawlid Youth Guild conducted a city-wide care basket distribution.

Each package contained nutrient-rich grains, organic honey, dates, warm blankets, and hygiene kits. Local food banks praised the youth for their prompt coordination and compassionate interactions.`
  }
];

const SEED_MAGAZINE = [
  {
    id: 'mag-1',
    title: 'The Prophetic Ethos of Environmental Stewardship',
    author: 'Zainab Fatima',
    grade: 'Grade 12, Humanities Honors',
    category: 'Ethics & Ecology',
    abstract: 'An investigation into Prophetic traditions safeguarding natural resources, rationing water usage, prohibiting indiscriminate felling of trees, and fostering animal welfare centuries before modern ecology.',
    body: `<h4>Introduction</h4>
In an age plagued by ecological degradation and climatic crises, humanity searches urgently for spiritual frameworks that balance human enterprise with planetary care. The life and ordinances of Prophet Muhammad (PBUH) offer a profound paradigm of conservation rooted in the theological concept of *Khilafah* (stewardship).

<h4>Water Conservation and Moderation</h4>
One of the most vivid examples of ecological mindfulness in the Seerah is the Prophet’s instruction regarding water during ablution (*Wudu*). Even when performing rituals alongside a flowing, abundant river, he warned against extravagance (*Israf*). This established an inviolable moral principle: finite resources must not be wasted, regardless of apparent abundance.

<blockquote>"Do not waste water, even if you were at a running river." — Sunan Ibn Majah</blockquote>

<h4>Green Belts and Animal Welfare</h4>
The establishment of *Hima* (protected natural reserves) around Medina represented one of history’s earliest formalized sanctuaries where hunting was forbidden and tree vegetation was preserved. Furthermore, his teachings explicitly condemned animal cruelty, declaring divine mercy for an individual who gave water to a thirsty dog, while censuring the mistreatment of beasts of burden.

<h4>Conclusion</h4>
For the contemporary student, honoring the Prophet’s legacy extends beyond ceremonial celebrations; it demands active participation in sustainable habits, zero-waste lifestyle choices, and environmental justice.`
  },
  {
    id: 'mag-2',
    title: 'Restorative Justice and Mercy: Lessons from the Treaty of Hudaybiyyah',
    author: 'Hamza Bilal',
    grade: 'Grade 11, Social Studies',
    category: 'Seerah & Diplomacy',
    abstract: 'This paper analyzes the strategic forbearance and moral dignity exhibited during the peace negotiations of Hudaybiyyah, showing how de-escalation paved the way for ideological harmony.',
    body: `<h4>The Context of Negotiation</h4>
In the sixth year of the Hijrah, fourteen hundred pilgrims marched peacefully toward Mecca. Confronted by armed resistance and hostility, the natural human impulse might have leaned toward conflict. Instead, the Prophet (PBUH) chose relentless diplomatic de-escalation.

<h4>The Principles of Hudaybiyyah</h4>
The terms negotiated appeared initially unfavorable to many companions. Yet, the Prophet recognized that a climate of non-violence and open dialogue would allow truth, mutual understanding, and moral character to shine unimpeded.

<blockquote>"Indeed, We have granted you a clear victory." — Surah Al-Fath (48:1)</blockquote>

<h4>Modern Applications in Conflict Resolution</h4>
Contemporary diplomacy often relies on coercive pressure. The Hudaybiyyah paradigm demonstrates that true leadership lies in absorbing transient diplomatic setbacks to secure long-term social cohesion and protect human life.`
  },
  {
    id: 'mag-3',
    title: 'Education as an Egalitarian Right in Early Medina',
    author: 'Amina Al-Husseini',
    grade: 'Undergraduate Fellow',
    category: 'Historical Context',
    abstract: 'Exploring the institutionalization of literacy and philosophical inquiry in early Islamic society, from Suffah scholars to the ransom terms of Badr.',
    body: `<h4>The Suffah Academy</h4>
Directly attached to the Prophet’s Mosque in Medina was the *Ashab al-Suffah*, a residential academy for dedicated scholars, seekers of wisdom, and underprivileged students. Here, learning was democratized regardless of tribal heritage or financial wealth.

<h4>Literacy as Liberation</h4>
Following the Battle of Badr, literate captives were offered freedom on the condition that each educate ten Medinan children in reading and writing. This historical precedent underscored that intellectual enlightenment was prized as supreme currency in the nascent community.

<h4>Women and Intellectual Life</h4>
From the scholarly inquiries of Aisha bint Abi Bakr to Shifa bint Abdullah who was appointed to oversee market administration, women were actively encouraged to master jurisprudence, medicine, and mathematics.`
  },
  {
    id: 'mag-4',
    title: 'Gentleness as the Pinnacle of Character: An Analysis of Shama\'il',
    author: 'Rayyan Siddiqui',
    grade: 'Grade 10, Islamic Literature',
    category: 'Youth Reflections',
    abstract: 'A personal reflection on the intimate narrations of Anas ibn Malik regarding ten years of household service, highlighting the transformative power of non-judgmental empathy.',
    body: `<h4>The Witness of a Companion</h4>
Anas ibn Malik (RA) served the Prophet for a decade from early childhood. His testimony encapsulates the sublime psychological safety created by the Prophet:

<blockquote>"I served the Messenger of Allah for ten years, and he never said 'Uff' to me, nor did he ever say about something I did: 'Why did you do that?' or about something I omitted: 'Why did you not do that?'"</blockquote>

<h4>Reflecting on Today’s Communication</h4>
In our current digital discourse, reactive anger and harsh critique dominate. Cultivating the prophetic virtue of *Rifq* (gentleness) provides an essential antidote against burnout, family friction, and online antagonism.`
  }
];

const SEED_QUIZ_QUESTIONS = [
  {
    id: 'q-1',
    question: 'In which historic year and city was Prophet Muhammad (PBUH) born?',
    options: [
      '571 CE in Mecca (The Year of the Elephant)',
      '622 CE in Medina (The Year of Hijrah)',
      '610 CE in Ta’if (The Year of Bi\'thah)',
      '595 CE in Jerusalem'
    ],
    correctIndex: 0,
    explanation: 'Prophet Muhammad (PBUH) was born in Mecca in 571 CE, traditionally recognized as the Year of the Elephant (Aam al-Fil).'
  },
  {
    id: 'q-2',
    question: 'What title was bestowed upon Prophet Muhammad (PBUH) by the people of Mecca before his prophethood due to his impeccable character?',
    options: [
      'Al-Hakim & Al-Qadi (The Judge)',
      'Al-Sadiq & Al-Amin (The Truthful and Trustworthy)',
      'Al-Fatih & Al-Mansoor (The Conqueror)',
      'Al-Zahid & Al-Mu\'allim (The Ascetic Teacher)'
    ],
    correctIndex: 1,
    explanation: 'Even before receiving divine revelation, the Meccans universally called him "Al-Sadiq" (The Truthful) and "Al-Amin" (The Trustworthy) because he never lied or betrayed a trust.'
  },
  {
    id: 'q-3',
    question: 'In which cave did Prophet Muhammad (PBUH) receive the first verses of revelation through Angel Jibreel (Gabriel)?',
    options: [
      'Cave of Thawr',
      'Cave of Hira on Mount Noor',
      'Cave of Uhud',
      'Cave of Safa'
    ],
    correctIndex: 1,
    explanation: 'The initial revelation, beginning with the command "Iqra" (Read!), was revealed in the Cave of Hira situated on Jabal al-Noor (The Mountain of Light).'
  },
  {
    id: 'q-4',
    question: 'Which chapter (Surah) of the Holy Qur\'an was first revealed to the Prophet?',
    options: [
      'Surah Al-Fatiha',
      'Surah Al-Baqarah',
      'Surah Al-Alaq (Verses 1–5)',
      'Surah Al-Ikhlas'
    ],
    correctIndex: 2,
    explanation: 'The first five verses of Surah Al-Alaq ("Read in the name of your Lord who created...") were the first words of the Qur\'an revealed.'
  },
  {
    id: 'q-5',
    question: 'What was the revolutionary civic pact enacted by the Prophet to ensure mutual protection and religious freedom among Muslims, Jews, and other tribes in Medina?',
    options: [
      'Treaty of Hudaybiyyah',
      'The Constitution of Medina (Sahifat al-Madinah)',
      'The Pledge of Aqabah',
      'The Charter of Najran'
    ],
    correctIndex: 1,
    explanation: 'The Constitution of Medina established one of history’s earliest formal legal frameworks protecting religious freedom, joint defense, and civil rights for all citizens.'
  },
  {
    id: 'q-6',
    question: 'During the migration (Hijrah) from Mecca to Medina, who was the Prophet\'s companion sheltering with him in the Cave of Thawr?',
    options: [
      'Umar ibn al-Khattab',
      'Ali ibn Abi Talib',
      'Abu Bakr al-Siddiq',
      'Uthman ibn Affan'
    ],
    correctIndex: 2,
    explanation: 'Abu Bakr al-Siddiq (RA) was the Prophet’s companion during the perilous journey of Hijrah, referenced in Surah At-Tawbah (9:40).'
  },
  {
    id: 'q-7',
    question: 'What famous phrase did the Prophet proclaim upon the peaceful liberation of Mecca to his former persecutors?',
    options: [
      '"An eye for an eye today"',
      '"Go, for you are all free (La tathriba \'alaykum al-yawm)"',
      '"Pay tribute or face exile"',
      '"Surrender your possessions"'
    ],
    correctIndex: 1,
    explanation: 'Emulating Prophet Yusuf (Joseph), he forgave his former adversaries unconditionally, saying: "No blame will there be upon you today. Go, for you are free."'
  },
  {
    id: 'q-8',
    question: 'In his historic Farewell Sermon (Khutbat al-Wada\'), what did the Prophet state regarding racial equality?',
    options: [
      'Tribal nobility determines superior ranking',
      'An Arab has no superiority over a non-Arab, nor a white over a black, except by piety',
      'Wealth and lineage dictate societal hierarchy',
      'Scholars alone are inherently superior to all citizens'
    ],
    correctIndex: 1,
    explanation: 'He dismantled racial prejudice definitively: "All mankind is from Adam and Eve. An Arab has no superiority over a non-Arab... except by piety and good action."'
  }
];

const SEED_LEADERBOARD = [
  { id: 'lb-1', name: 'Zubair K. Rahman', score: 100, timeTaken: 52, date: 'Oct 14, 2024' },
  { id: 'lb-2', name: 'Maryam Al-Sabah', score: 100, timeTaken: 68, date: 'Oct 14, 2024' },
  { id: 'lb-3', name: 'Ibrahim Farooq', score: 87, timeTaken: 74, date: 'Oct 13, 2024' },
  { id: 'lb-4', name: 'Fatima N. Siddiqui', score: 87, timeTaken: 89, date: 'Oct 13, 2024' },
  { id: 'lb-5', name: 'Tariq Hassan', score: 75, timeTaken: 95, date: 'Oct 12, 2024' }
];

class DataStore {
  constructor() {
    this.initStore();
  }

  initStore() {
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(SEED_GALLERY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(SEED_NEWS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MAGAZINE)) {
      localStorage.setItem(STORAGE_KEYS.MAGAZINE, JSON.stringify(SEED_MAGAZINE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUIZ_QUESTIONS)) {
      localStorage.setItem(STORAGE_KEYS.QUIZ_QUESTIONS, JSON.stringify(SEED_QUIZ_QUESTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEADERBOARD)) {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(SEED_LEADERBOARD));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_PIN)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN);
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
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
      return false;
    }
  }

  // Gallery CRUD
  getGallery() {
    return this.get(STORAGE_KEYS.GALLERY);
  }

  addGalleryItem(item) {
    const items = this.getGallery();
    const newItem = {
      id: 'gal-' + Date.now(),
      date: item.date || new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...item
    };
    items.unshift(newItem);
    this.set(STORAGE_KEYS.GALLERY, items);
    return newItem;
  }

  deleteGalleryItem(id) {
    let items = this.getGallery();
    items = items.filter(i => i.id !== id);
    this.set(STORAGE_KEYS.GALLERY, items);
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

  // Leaderboard CRUD
  getLeaderboard() {
    const list = this.get(STORAGE_KEYS.LEADERBOARD);
    // Sort descending by score, then ascending by time taken
    return list.sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken);
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
    this.set(STORAGE_KEYS.LEADERBOARD, []);
  }

  // Admin PIN Authentication
  getAdminPin() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || DEFAULT_ADMIN_PIN;
  }

  setAdminPin(newPin) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin);
  }

  verifyPin(inputPin) {
    return inputPin === this.getAdminPin();
  }

  // Reset to Default Factory Seeds
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(SEED_GALLERY));
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(SEED_NEWS));
    localStorage.setItem(STORAGE_KEYS.MAGAZINE, JSON.stringify(SEED_MAGAZINE));
    localStorage.setItem(STORAGE_KEYS.QUIZ_QUESTIONS, JSON.stringify(SEED_QUIZ_QUESTIONS));
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(SEED_LEADERBOARD));
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN);
  }

  // Export full portal JSON
  exportData() {
    return JSON.stringify({
      version: '1.0',
      timestamp: new Date().toISOString(),
      gallery: this.getGallery(),
      news: this.getNews(),
      magazine: this.getMagazine(),
      quizQuestions: this.getQuizQuestions(),
      leaderboard: this.getLeaderboard()
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
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  }
}

window.dataStore = new DataStore();

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
  ADMIN_PIN: 'noor_mahabba_admin_pin'
};

const DEFAULT_ADMIN_PIN = '1446';

// Clean Slate - All content arrays completely emptied as requested
const SEED_GALLERY = [];
const SEED_NEWS = [];
const SEED_MAGAZINE = [];
const SEED_QUIZ_QUESTIONS = [];
const SEED_LEADERBOARD = [];

class DataStore {
  constructor() {
    this.initStore();
  }

  initStore() {
    // Flag to enforce a complete clean slate across all client browsers
    const CLEAN_SLATE_KEY = 'noor_mahabba_clean_slate_v3';

    if (!localStorage.getItem(CLEAN_SLATE_KEY)) {
      this.set(STORAGE_KEYS.GALLERY, []);
      this.set(STORAGE_KEYS.NEWS, []);
      this.set(STORAGE_KEYS.MAGAZINE, []);
      this.set(STORAGE_KEYS.QUIZ_QUESTIONS, []);
      this.set(STORAGE_KEYS.LEADERBOARD, []);
      localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN);
      localStorage.setItem(CLEAN_SLATE_KEY, 'true');
    }

    // Ensure fallback initialization if any key is missing
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
      this.set(STORAGE_KEYS.GALLERY, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
      this.set(STORAGE_KEYS.NEWS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MAGAZINE)) {
      this.set(STORAGE_KEYS.MAGAZINE, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUIZ_QUESTIONS)) {
      this.set(STORAGE_KEYS.QUIZ_QUESTIONS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEADERBOARD)) {
      this.set(STORAGE_KEYS.LEADERBOARD, []);
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
      // Real-time synchronization to Firebase Cloud Database if connected
      if (window.firebaseService && typeof window.firebaseService.syncToFirebase === 'function') {
        window.firebaseService.syncToFirebase(key, data);
      }
      return true;
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
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
    let imageUrl = item.imageUrl;
    let videoUrl = item.videoUrl;

    if (imageUrl) imageUrl = this.convertGoogleDriveUrl(imageUrl, false);
    if (videoUrl) videoUrl = this.convertGoogleDriveUrl(videoUrl, true);

    const newItem = {
      id: 'gal-' + Date.now(),
      date: item.date || new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...item,
      imageUrl,
      videoUrl
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

  // Reset to Default Factory Seeds (Clean slate)
  resetToDefaults() {
    this.set(STORAGE_KEYS.GALLERY, []);
    this.set(STORAGE_KEYS.NEWS, []);
    this.set(STORAGE_KEYS.MAGAZINE, []);
    this.set(STORAGE_KEYS.QUIZ_QUESTIONS, []);
    this.set(STORAGE_KEYS.LEADERBOARD, []);
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

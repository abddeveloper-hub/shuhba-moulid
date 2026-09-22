// Firebase Modular SDK Initialization for Mawlid Celebration Portal
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHSjgw73QnEglBKhh0bdST3YQQWTCsRYM",
  authDomain: "shuhba-moulid.firebaseapp.com",
  databaseURL: "https://shuhba-moulid-default-rtdb.firebaseio.com",
  projectId: "shuhba-moulid",
  storageBucket: "shuhba-moulid.firebasestorage.app",
  messagingSenderId: "841610557320",
  appId: "1:841610557320:web:b6bebbb9d8e662f7be2c3d",
  measurementId: "G-Q5D7JCCJGB"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export let analytics = null;
export let db = null;

// Initialize Analytics if supported in the current environment
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    window.firebaseAnalytics = analytics;
    console.log("📊 Firebase Analytics initialized");
  }
}).catch((err) => {
  console.warn("Firebase Analytics could not be loaded:", err);
});

// Initialize Realtime Database
try {
  db = getDatabase(app);
  window.firebaseDb = db;
  console.log("🔥 Firebase Realtime Database connected");
} catch (e) {
  console.warn("Could not connect to Firebase Realtime Database with default URL:", e);
  try {
    db = getDatabase(app, "https://shuhba-moulid-default-rtdb.asia-southeast1.firebasedatabase.app");
    window.firebaseDb = db;
    console.log("🔥 Firebase Realtime Database connected (asia-southeast1)");
  } catch (err2) {
    console.warn("Realtime DB fallback initialization failed:", err2);
  }
}

// Map Storage Keys to Firebase Database Nodes (matching user's rules)
const NODE_MAP = {
  // Noor & Mahabba storage keys
  noor_mahabba_gallery: 'gallery',
  noor_mahabba_news: 'news',
  noor_mahabba_magazine: 'magazine',
  noor_mahabba_quiz_questions: 'quiz_questions',
  noor_mahabba_leaderboard: 'leaderboard',
  noor_mahabba_quiz_status: 'quiz_status',
  // Legacy / fallback keys
  mawlid_portal_gallery: 'gallery',
  mawlid_portal_news: 'news',
  mawlid_portal_magazine: 'magazine',
  mawlid_portal_quiz_questions: 'quiz_questions',
  mawlid_portal_leaderboard: 'leaderboard'
};

// Firebase Realtime Service
window.firebaseService = {
  isAvailable: () => !!db,

  // Outgoing sync: Local admin edit -> Firebase Cloud
  syncToFirebase: (storageKey, data) => {
    if (!db) return;
    const nodeName = NODE_MAP[storageKey];
    if (!nodeName) return;

    try {
      // Deep sanitize: Firebase throws error on undefined properties (e.g. videoUrl: undefined)
      const cleanData = JSON.parse(JSON.stringify(data, (key, value) => {
        return value === undefined ? null : value;
      }));

      const dbRef = ref(db, nodeName);
      set(dbRef, cleanData).then(() => {
        console.log(`✅ Successfully synced ${nodeName} to Firebase Cloud`);
      }).catch((err) => {
        if (err && (err.code === 'PERMISSION_DENIED' || (err.message && err.message.includes('permission_denied')))) {
          console.info(`ℹ️ Note: Write to /${nodeName} requires security rule permission in Firebase Console.`);
        } else {
          console.warn(`Firebase write warning for ${nodeName}:`, err);
        }
      });
    } catch (err) {
      console.error(`Failed to push ${nodeName} to Firebase:`, err);
    }
  }
};

// Incoming sync: Firebase Cloud -> Local UI in Real-Time
if (db) {
  const setupListener = (nodeName, primaryKey, fallbackKey, renderCallbacks = []) => {
    try {
      const dbRef = ref(db, nodeName);
      onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        if (val !== null && window.dataStore) {
          const items = Array.isArray(val) ? val : Object.values(val);
          // Set in localStorage directly without echoing back to Firebase
          localStorage.setItem(primaryKey, JSON.stringify(items));
          if (fallbackKey) {
            localStorage.setItem(fallbackKey, JSON.stringify(items));
          }
          renderCallbacks.forEach(cb => {
            try { cb(); } catch (e) {}
          });
        } else if (val === null) {
          // If cloud node is empty, automatically push existing local data
          try {
            const localRaw = localStorage.getItem(primaryKey) || localStorage.getItem(fallbackKey);
            if (localRaw) {
              const localParsed = JSON.parse(localRaw);
              if (Array.isArray(localParsed) && localParsed.length > 0) {
                console.log(`Pushing existing local ${nodeName} to Firebase cloud...`);
                window.firebaseService.syncToFirebase(primaryKey, localParsed);
              }
            }
          } catch (e) {}
        }
      }, (error) => {
        console.warn(`Firebase read note for ${nodeName}:`, error);
      });
    } catch (e) {
      console.warn(`Failed to listen to ${nodeName}:`, e);
    }
  };

  // Setup live listeners matching user's database rules
  setupListener('gallery', 'noor_mahabba_gallery', 'mawlid_portal_gallery', [
    () => window.gallery && window.gallery.render(),
    () => window.app && window.app.renderHome(),
    () => window.admin && window.admin.currentTab === 'gallery' && window.admin.renderGalleryList(),
    () => window.admin && window.admin.renderOverviewStats()
  ]);

  setupListener('news', 'noor_mahabba_news', 'mawlid_portal_news', [
    () => window.news && window.news.render(),
    () => window.app && window.app.renderHome(),
    () => window.admin && window.admin.currentTab === 'news' && window.admin.renderNewsList(),
    () => window.admin && window.admin.renderOverviewStats()
  ]);

  setupListener('magazine', 'noor_mahabba_magazine', 'mawlid_portal_magazine', [
    () => window.magazine && window.magazine.render(),
    () => window.app && window.app.renderHome(),
    () => window.admin && window.admin.currentTab === 'magazine' && window.admin.renderMagazineList(),
    () => window.admin && window.admin.renderOverviewStats()
  ]);

  setupListener('quiz_questions', 'noor_mahabba_quiz_questions', 'mawlid_portal_quiz_questions', [
    () => window.app && window.app.renderHome(),
    () => window.admin && window.admin.currentTab === 'quiz' && window.admin.renderQuizList(),
    () => window.admin && window.admin.renderOverviewStats()
  ]);

  setupListener('leaderboard', 'noor_mahabba_leaderboard', 'mawlid_portal_leaderboard', [
    () => {
      // Real-time fallback sync: extract quiz_status if embedded in leaderboard
      try {
        const raw = window.dataStore ? window.dataStore.get('noor_mahabba_leaderboard') : [];
        const statusItem = Array.isArray(raw) ? raw.find(i => i && (i.id === '__quiz_status__' || i.isQuizStatus)) : null;
        if (statusItem) {
          localStorage.setItem('noor_mahabba_quiz_status', JSON.stringify({
            isOpen: !!statusItem.isOpen,
            message: statusItem.message,
            updatedAt: statusItem.updatedAt
          }));
          if (window.quiz && typeof window.quiz.checkQuizStatus === 'function') {
            window.quiz.checkQuizStatus();
          }
          if (window.admin && typeof window.admin.renderQuizStatusControl === 'function') {
            window.admin.renderQuizStatusControl();
          }
          if (window.admin && typeof window.admin.renderOverviewStats === 'function') {
            window.admin.renderOverviewStats();
          }
        }
      } catch (e) {}
    },
    () => window.quiz && window.quiz.renderScoreboard(),
    () => window.admin && window.admin.renderOverviewStats()
  ]);

  // Live listener for Quiz Session Status (Direct /quiz_status channel)
  try {
    const statusRef = ref(db, 'quiz_status');
    onValue(statusRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null && window.dataStore) {
        localStorage.setItem('noor_mahabba_quiz_status', JSON.stringify(val));
        if (window.quiz && typeof window.quiz.checkQuizStatus === 'function') {
          window.quiz.checkQuizStatus();
        }
        if (window.admin && typeof window.admin.renderQuizStatusControl === 'function') {
          window.admin.renderQuizStatusControl();
        }
        if (window.admin && typeof window.admin.renderOverviewStats === 'function') {
          window.admin.renderOverviewStats();
        }
      }
    }, (error) => {
      // If /quiz_status is not yet added in Firebase console rules, silently use the leaderboard fallback
      if (error && (error.code === 'PERMISSION_DENIED' || (error.message && error.message.includes('permission_denied')))) {
        console.info('ℹ️ Note: Direct /quiz_status node is not configured in Firebase rules; real-time sync is actively handled via leaderboard fallback channel.');
      } else {
        console.warn('Firebase read note for quiz_status:', error);
      }
    });
  } catch (e) {
    console.warn('Failed to listen to quiz_status:', e);
  }
}

// Expose globally for convenience
window.firebaseApp = app;
console.log("🔥 Firebase initialized with Realtime Database synchronization");

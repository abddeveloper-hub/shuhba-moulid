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
        console.warn(`Firebase write warning for ${nodeName}:`, err);
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
    () => window.quiz && window.quiz.renderScoreboard(),
    () => window.admin && window.admin.renderOverviewStats()
  ]);
}

// Expose globally for convenience
window.firebaseApp = app;
console.log("🔥 Firebase initialized with Realtime Database synchronization");

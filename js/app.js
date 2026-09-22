/* ==========================================================================
   NOOR & MAHABBA EVENT SYSTEM - APPLICATION CONTROLLER
   Global app state, toast alerts, mobile drawer, and audio controls
   ========================================================================== */

// Curated Fallbacks for Live Showcase Reels when database is empty
const REEL_FALLBACK_PHOTOS = [
  {
    id: 'fb-gal-1',
    title: 'Sacred Invocations & Qasīda Recitations',
    category: 'Stage Programs',
    caption: 'Students rendering classical eulogies and verses of praise in the grand assembly hall.',
    imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fb-gal-2',
    title: 'Prophetic Illumination & Calligraphy Exhibition',
    category: 'Exhibitions',
    caption: 'Intricate manuscript art and Diwani calligraphy honoring the Mercy unto the Worlds.',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fb-gal-3',
    title: 'Noor-e-Mustafa Gathering & Assembly',
    category: 'Stage Programs',
    caption: 'Community gathering united in remembrance, salawat, and heartfelt reflection.',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fb-gal-4',
    title: 'Excellence in Seerah Awards Ceremony',
    category: 'Awards',
    caption: 'Felicitation of young scholars, reciters, and Seerah essay winners.',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80'
  }
];

const REEL_FALLBACK_WRITINGS = [
  {
    id: 'fb-mag-1',
    title: 'തൂലിക പടർത്തുന്ന പ്രവാചക പ്രകീർത്തനം',
    category: 'Poem / Qasīda',
    author: 'മുഹമ്മദ്‌ റഫീഖ്',
    grade: 'B13 Department of Adab',
    itemType: 'poem',
    body: 'തിരുനബിയുടെ തിരുസാന്നിധ്യം ഹൃദയങ്ങളിൽ വിടർത്തിയ പുണ്യവസന്തം...\nസ്നേഹത്തിൻ സുഗന്ധം പരത്തിയ ദിവ്യജ്യോതിസ്സേ, അങ്ങയിലേക്കാണ് ഞങ്ങളുടെ പ്രണാമങ്ങൾ.\nമരുഭൂമിയിൽ കാരുണ്യത്തിന്റെ പെരുമഴ പെയ്യിച്ച തിരുദൂതരേ...'
  },
  {
    id: 'fb-mag-2',
    title: 'Echoes of Mahabbah: The Language of Devotion',
    category: 'Spiritual Reflections',
    author: 'Zayd Abdul Rahman',
    grade: 'Senior Research Fellow',
    itemType: 'article',
    body: 'In every era, the praise of the Prophet ﷺ transcends spoken tongues, becoming the universal heartbeat of the believers. His mercy illuminated the darkened horizons of humanity, offering an enduring beacon of peace, justice, and sublime grace.'
  },
  {
    id: 'fb-mag-3',
    title: 'സ്നേഹദൂതർ: കാരുണ്യത്തിന്റെ മഹാസാഗരം',
    category: 'Poem / Qasīda',
    author: 'അബ്ദുല്ലത്വീഫ് ഹുദവി',
    grade: 'B13 Literary Circle',
    itemType: 'poem',
    body: 'അകതാരിലെന്നും പൂത്തുലയും അങ്ങതൻ സ്നേഹസ്മരണകൾ,\nപാരിടത്തിന് കാരുണ്യമായി അവതരിച്ച പുണ്യപ്രകാശമേ...\nഇരുളടഞ്ഞ ലോകത്തിന് വഴികാട്ടിയായ പ്രവാചകരെ...'
  },
  {
    id: 'fb-mag-4',
    title: 'The Prophetic Ethos in the Modern Age',
    category: 'Academic Essay',
    author: 'Farhan Ahmad',
    grade: 'B13 Research Guild',
    itemType: 'article',
    body: 'Revisiting the Sunnah reveals not merely rituals, but a transformative philosophy of living characterized by radical gentleness, uncompromising integrity, and heartfelt concern for the destitute and marginalized.'
  }
];

class AppController {
  constructor() {
    // Initialize reel state first before any view render calls
    this.reelPhotoIdx = 0;
    this.reelWritingIdx = 0;
    this.reelProgress = 0;
    this.isReelPaused = false;
    this.reelDuration = 4500; // 4.5 seconds per cycle for a relaxed, readable pace
    this.reelTickRate = 40; // 40ms timer tick
    this.reelTimerId = null;

    this.initMobileDrawer();
    this.initAudioToggle();
    this.initScrollEffects();
    this.initQuickHomeActions();
    this.initBottomNav();
    this.initLiveReels();
    this.renderHome();
  }

  // Toast Notification System
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';
    if (type === 'warning') icon = '🔔';

    toast.innerHTML = `
      <span style="font-size: 1.15rem;">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3600);
  }

  // Mobile Drawer Navigation
  initMobileDrawer() {
    const hamburger = document.getElementById('hamburger-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const closeBtn = document.getElementById('mobile-drawer-close');

    const openDrawer = () => {
      if (drawer) drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.soundFx) window.soundFx.playClick();
    };

    const closeDrawer = () => {
      if (drawer) drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (window.soundFx) window.soundFx.playClick();
    };

    if (hamburger) hamburger.addEventListener('click', openDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    this.closeMobileDrawer = closeDrawer;
  }

  // Audio Toggle Switch in Navbar
  initAudioToggle() {
    const btn = document.getElementById('audio-toggle-btn');
    const icon = document.getElementById('audio-toggle-icon');

    const updateIcon = (isMuted) => {
      if (!icon) return;
      if (isMuted) {
        icon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="1" y1="1" x2="23" y2="23"/>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        `;
        btn.setAttribute('title', 'Sound effects are Muted. Click to Unmute');
      } else {
        icon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        `;
        btn.setAttribute('title', 'Sound effects are On. Click to Mute');
      }
    };

    if (btn && window.soundFx) {
      updateIcon(window.soundFx.isMuted());
      btn.addEventListener('click', () => {
        const isMuted = window.soundFx.toggleMute();
        updateIcon(isMuted);
        this.showToast(isMuted ? 'Sound effects muted' : 'Sound effects enabled', 'info');
      });
    }
  }

  // Sticky Navbar Blur and Elevation
  initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Home Page Renderer
  renderHome() {
    // Dynamic Stats
    const totalPhotos = window.dataStore.getGallery().length;
    const totalNews = window.dataStore.getNews().length;
    const totalPapers = window.dataStore.getMagazine().length;
    const totalQuizQ = window.dataStore.getQuizQuestions().length;

    const elPhotos = document.getElementById('home-stat-photos');
    const elNews = document.getElementById('home-stat-news');
    const elPapers = document.getElementById('home-stat-papers');
    const elQuiz = document.getElementById('home-stat-quiz');

    if (elPhotos) elPhotos.textContent = totalPhotos;
    if (elNews) elNews.textContent = totalNews;
    if (elPapers) elPapers.textContent = totalPapers;
    if (elQuiz) elQuiz.textContent = totalQuizQ;

    // Featured News Snippet
    const newsList = window.dataStore.getNews();
    const homeNewsContainer = document.getElementById('home-featured-news');
    if (homeNewsContainer) {
      if (newsList.length > 0) {
        const featured = newsList.slice(0, 2);
        homeNewsContainer.innerHTML = featured.map(item => `
          <article class="news-card">
            <div class="news-thumb-wrap" style="height: 190px;">
              <img src="${item.imageUrl}" alt="${item.title}" class="news-thumb" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80'">
              <span class="news-date-badge">${item.date}</span>
            </div>
            <div class="news-body">
              <div class="news-meta-row">${item.category || 'Dispatch'} &bull; ${item.readTime || '3 min'}</div>
              <h3 class="news-title" style="font-size: 1.15rem;">${item.title}</h3>
              <p class="news-excerpt" style="font-size: 0.885rem;">${item.excerpt}</p>
              <div class="news-card-footer">
                <span class="news-read-time">${item.readTime || '3 min read'}</span>
                <a href="#news" class="btn btn-sm btn-secondary" onclick="setTimeout(() => window.news.openStoryModal('${item.id}'), 100)">
                  Read Dispatch &rarr;
                </a>
              </div>
            </div>
          </article>
        `).join('');
      } else {
        homeNewsContainer.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 2.5rem 1.5rem; text-align: center; background: var(--surface-container-lowest); border: 1px dashed var(--outline-variant); border-radius: var(--radius-default);">
            <p style="font-size: 1.75rem; margin-bottom: 0.5rem;">📰</p>
            <h4 style="color: var(--on-surface); margin-bottom: 0.35rem; font-size: 1.1rem; font-family: var(--font-display);">No Dispatches Published Yet</h4>
            <p style="color: var(--outline); font-size: 0.875rem;">Dispatches and event updates will appear here once published by the administrators.</p>
          </div>
        `;
      }
    }

    // Refresh Live Showcase if initialized
    if (typeof this.renderLiveReels === 'function') {
      this.renderLiveReels();
    }
  }

  // Live Showcase Reels (2-second interval for Gallery Photos & Magazine Writings)
  initLiveReels() {
    // Attach card event listeners once
    const photoCard = document.getElementById('home-photo-reel-card');
    if (photoCard && !photoCard.dataset.reelBound) {
      photoCard.dataset.reelBound = 'true';
      photoCard.addEventListener('click', () => {
        const photos = this.getReelPhotos();
        const safeIdx = ((this.reelPhotoIdx % photos.length) + photos.length) % photos.length;
        const cur = photos[safeIdx];
        if (!cur) return;
        if (window.soundFx) window.soundFx.playClick();
        const galleryItems = (window.dataStore && typeof window.dataStore.getGallery === 'function') 
          ? window.dataStore.getGallery() 
          : [];
        const foundIdx = galleryItems.findIndex(g => g.id === cur.id);
        if (foundIdx !== -1 && window.gallery) {
          window.gallery.activeItems = galleryItems;
          window.gallery.openLightbox(foundIdx);
        } else {
          window.location.hash = 'gallery';
        }
      });

      photoCard.addEventListener('mouseenter', () => { this.isReelPaused = true; });
      photoCard.addEventListener('mouseleave', () => { this.isReelPaused = false; });
      photoCard.addEventListener('touchstart', () => { this.isReelPaused = true; }, { passive: true });
      photoCard.addEventListener('touchend', () => { this.isReelPaused = false; });
    }

    const writingCard = document.getElementById('home-writing-reel-card');
    if (writingCard && !writingCard.dataset.reelBound) {
      writingCard.dataset.reelBound = 'true';
      writingCard.addEventListener('click', () => {
        const writings = this.getReelWritings();
        const safeIdx = ((this.reelWritingIdx % writings.length) + writings.length) % writings.length;
        const cur = writings[safeIdx];
        if (!cur) return;
        if (window.soundFx) window.soundFx.playClick();
        const magItems = (window.dataStore && typeof window.dataStore.getMagazine === 'function') 
          ? window.dataStore.getMagazine() 
          : [];
        const foundItem = magItems.find(m => m.id === cur.id);
        if (foundItem && window.magazine) {
          window.magazine.openReaderModal(cur.id);
        } else {
          window.location.hash = 'magazine';
        }
      });

      writingCard.addEventListener('mouseenter', () => { this.isReelPaused = true; });
      writingCard.addEventListener('mouseleave', () => { this.isReelPaused = false; });
      writingCard.addEventListener('touchstart', () => { this.isReelPaused = true; }, { passive: true });
      writingCard.addEventListener('touchend', () => { this.isReelPaused = false; });
    }

    this.renderLiveReels();
    this.startReelsTimer();
  }

  getReelPhotos() {
    let list = [];
    try {
      if (window.dataStore && typeof window.dataStore.getGallery === 'function') {
        const raw = window.dataStore.getGallery();
        if (Array.isArray(raw)) {
          list = raw.filter(item => item && (item.imageUrl || item.videoUrl || item.title));
        }
      }
    } catch (e) {
      console.warn('Could not read gallery store:', e);
    }
    return list.length > 0 ? list : REEL_FALLBACK_PHOTOS;
  }

  getReelWritings() {
    let list = [];
    try {
      if (window.dataStore && typeof window.dataStore.getMagazine === 'function') {
        const raw = window.dataStore.getMagazine();
        if (Array.isArray(raw)) {
          list = raw.filter(item => item && (item.title || item.body || item.abstract));
        }
      }
    } catch (e) {
      console.warn('Could not read magazine store:', e);
    }
    return list.length > 0 ? list : REEL_FALLBACK_WRITINGS;
  }

  renderLiveReels() {
    this.renderPhotoReelItem();
    this.renderWritingReelItem();
  }

  renderPhotoReelItem() {
    const stage = document.getElementById('home-photo-stage');
    const counter = document.getElementById('photo-reel-counter');
    if (!stage) return;

    const photos = this.getReelPhotos();
    if (!photos || photos.length === 0) return;

    if (!Number.isInteger(this.reelPhotoIdx)) this.reelPhotoIdx = 0;
    const safeIdx = ((this.reelPhotoIdx % photos.length) + photos.length) % photos.length;
    const item = photos[safeIdx];
    if (!item) return;

    if (counter) counter.textContent = `${safeIdx + 1} / ${photos.length}`;

    const isVideo = item.mediaType === 'video' || !!item.videoUrl;
    const displayImg = item.imageUrl || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80';

    stage.innerHTML = `
      <div class="reel-photo-item reel-content-anim">
        <div class="reel-photo-wrap">
          <span class="reel-photo-category">${item.category || 'Gallery'}</span>
          <img src="${displayImg}" alt="${item.title || 'Photo'}" class="reel-photo-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80'">
        </div>
        <div class="reel-photo-details">
          <h4 class="reel-photo-title">${item.title || 'Exhibition Photograph'}</h4>
          <p class="reel-photo-caption">${item.caption || item.date || 'Captured during the sacred Noor & Mahabba assembly.'}</p>
          <div class="reel-click-prompt">
            <span>${isVideo ? 'Watch Media' : 'Open in Gallery'}</span> <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    `;
  }

  renderWritingReelItem() {
    const stage = document.getElementById('home-writing-stage');
    const counter = document.getElementById('writing-reel-counter');
    if (!stage) return;

    const writings = this.getReelWritings();
    if (!writings || writings.length === 0) return;

    if (!Number.isInteger(this.reelWritingIdx)) this.reelWritingIdx = 0;
    const safeIdx = ((this.reelWritingIdx % writings.length) + writings.length) % writings.length;
    const item = writings[safeIdx];
    if (!item) return;

    if (counter) counter.textContent = `${safeIdx + 1} / ${writings.length}`;

    const isPoem = (item.itemType === 'poem') ||
                   (item.category && item.category.toLowerCase().includes('poem')) ||
                   (item.category && item.category.toLowerCase().includes('qas'));
    const author = item.author || 'Contributor';
    const initials = author.split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'NM';

    let rawExcerpt = item.abstract || '';
    if (!rawExcerpt && item.body) {
      if (isPoem) {
        rawExcerpt = item.body.split('\n').filter(l => l && l.trim()).slice(0, 6).join('\n');
      } else {
        rawExcerpt = item.body.substring(0, 260) + '...';
      }
    }
    if (!rawExcerpt) {
      rawExcerpt = 'Dedicated writing from the Noor & Mahabba collection.';
    }

    stage.innerHTML = `
      <div class="reel-writing-item reel-content-anim">
        <div>
          <div class="reel-writing-meta">
            <span class="reel-writing-badge">${isPoem ? '📜 ' : '📖 '}${item.category || (isPoem ? 'Mawlid Poetry' : 'Sacred Essay')}</span>
            <span style="font-size: 0.72rem; color: var(--gold-antique);">${item.grade || 'Special Publication'}</span>
          </div>
          <h4 class="reel-writing-title">${item.title || 'Sacred Composition'}</h4>
          <div class="reel-writing-author-bar">
            <div class="reel-author-circle">${initials}</div>
            <div>
              <div class="reel-author-name">${author}</div>
              <div class="reel-author-role">${item.grade || 'Contributor'}</div>
            </div>
          </div>
          <div class="reel-writing-excerpt">${rawExcerpt}</div>
        </div>
        <div class="reel-click-prompt">
          <span>${isPoem ? 'Read Full Poem' : 'Read Full Paper'}</span> <i class="fas fa-arrow-right"></i>
        </div>
      </div>
    `;
  }

  startReelsTimer() {
    if (this.reelTimerId) {
      clearInterval(this.reelTimerId);
      this.reelTimerId = null;
    }

    const stepPct = (this.reelTickRate / this.reelDuration) * 100;

    this.reelTimerId = setInterval(() => {
      if (this.isReelPaused) return;

      this.reelProgress += stepPct;

      const photoBar = document.getElementById('photo-reel-progress');
      const writingBar = document.getElementById('writing-reel-progress');
      const pct = Math.min(100, this.reelProgress);

      if (photoBar) photoBar.style.width = `${pct}%`;
      if (writingBar) writingBar.style.width = `${pct}%`;

      if (this.reelProgress >= 100) {
        this.reelProgress = 0;
        this.advanceReels();
      }
    }, this.reelTickRate);
  }

  // Smooth cross-fade advancement of both photo and writing reels
  advanceReels() {
    const photoStage = document.getElementById('home-photo-stage');
    const writingStage = document.getElementById('home-writing-stage');
    const photoBar = document.getElementById('photo-reel-progress');
    const writingBar = document.getElementById('writing-reel-progress');

    // Soft dissolve out old content
    if (photoStage) photoStage.classList.add('reel-fade-out');
    if (writingStage) writingStage.classList.add('reel-fade-out');

    setTimeout(() => {
      const photos = this.getReelPhotos();
      const writings = this.getReelWritings();

      if (photos.length > 0) {
        this.reelPhotoIdx = (this.reelPhotoIdx + 1) % photos.length;
        this.renderPhotoReelItem();
      }

      if (writings.length > 0) {
        this.reelWritingIdx = (this.reelWritingIdx + 1) % writings.length;
        this.renderWritingReelItem();
      }

      if (photoStage) photoStage.classList.remove('reel-fade-out');
      if (writingStage) writingStage.classList.remove('reel-fade-out');

      if (photoBar) photoBar.style.width = '0%';
      if (writingBar) writingBar.style.width = '0%';
    }, 350);
  }

  initQuickHomeActions() {
    // Quick preset filler for admin gallery form
    window.setGalleryPreset = (url, title, cat) => {
      const titleInput = document.getElementById('add-gal-title');
      const urlInput = document.getElementById('add-gal-url');
      const catInput = document.getElementById('add-gal-category');
      if (titleInput) titleInput.value = title;
      if (urlInput) urlInput.value = url;
      if (catInput) catInput.value = cat;
      if (window.soundFx) window.soundFx.playClick();
      this.showToast('Preset photo loaded into form.', 'info');
    };
  }

  // Fixed Bottom Bar Interaction & Audio Feedback
  initBottomNav() {
    const bottomLinks = document.querySelectorAll('.bottom-nav-link');
    bottomLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.soundFx) window.soundFx.playClick();
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});

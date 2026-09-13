/* ==========================================================================
   MAWLID CELEBRATION PORTAL - APPLICATION CONTROLLER
   Global app state, toast alerts, mobile drawer, audio controls & live countdown
   ========================================================================== */

class AppController {
  constructor() {
    this.initMobileDrawer();
    this.initAudioToggle();
    this.initScrollEffects();
    this.initCountdown();
    this.initQuickHomeActions();
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

  // Countdown to Mawlid un-Nabi
  initCountdown() {
    // Target date set in future for continuous demonstration
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 18);
    targetDate.setHours(9, 0, 0, 0);

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

      const daysEl = document.getElementById('countdown-days');
      const hoursEl = document.getElementById('countdown-hours');
      const minsEl = document.getElementById('countdown-mins');
      const secsEl = document.getElementById('countdown-secs');

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = days < 10 ? '0' + days : days;
      if (hoursEl) hoursEl.textContent = hours < 10 ? '0' + hours : hours;
      if (minsEl) minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
      if (secsEl) secsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    };

    updateTimer();
    setInterval(updateTimer, 1000);
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
    if (homeNewsContainer && newsList.length > 0) {
      const featured = newsList.slice(0, 2);
      homeNewsContainer.innerHTML = featured.map(item => `
        <article class="news-card">
          <div class="news-thumb-wrap" style="height: 180px;">
            <img src="${item.imageUrl}" alt="${item.title}" class="news-thumb" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=600&q=80'">
            <span class="news-date-badge">${item.date}</span>
          </div>
          <div class="news-body">
            <h3 class="news-title" style="font-size: 1.15rem;">${item.title}</h3>
            <p class="news-excerpt" style="font-size: 0.885rem;">${item.excerpt}</p>
            <div class="news-card-footer">
              <span class="news-read-time">${item.readTime || '3 min'}</span>
              <a href="#news" class="btn btn-sm btn-outline-emerald" onclick="setTimeout(() => window.news.openStoryModal('${item.id}'), 100)">
                Read Story &rarr;
              </a>
            </div>
          </div>
        </article>
      `).join('');
    }

    // Featured Paper Spotlight
    const papers = window.dataStore.getMagazine();
    const homePaperContainer = document.getElementById('home-featured-paper');
    if (homePaperContainer && papers.length > 0) {
      const topPaper = papers[0];
      const initials = topPaper.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      homePaperContainer.innerHTML = `
        <div class="magazine-card" style="margin-bottom: 0;">
          <span class="magazine-category-tag">${topPaper.category}</span>
          <h3 class="magazine-title">${topPaper.title}</h3>
          <div class="magazine-author-bar">
            <div class="author-avatar">${initials}</div>
            <div class="author-details">
              <span class="author-name">${topPaper.author}</span>
              <span class="author-grade">${topPaper.grade}</span>
            </div>
          </div>
          <p class="magazine-abstract">${topPaper.abstract}</p>
          <div class="magazine-footer">
            <span style="font-size: 0.85rem; color: var(--emerald-primary); font-weight: 700;">★ Editor's Pick</span>
            <a href="#magazine" class="btn btn-sm btn-primary" onclick="setTimeout(() => window.magazine.openReaderModal('${topPaper.id}'), 100)">
              Read Paper &rarr;
            </a>
          </div>
        </div>
      `;
    }
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
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});

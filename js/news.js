/* ==========================================================================
   NEWS & PRESS RELEASES CONTROLLER
   News feed cards, search, and formatted full-story reader modal.
   ========================================================================== */

class NewsManager {
  constructor() {
    this.searchQuery = '';
    this.initEventListeners();
  }

  initEventListeners() {
    const searchInput = document.getElementById('news-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    const closeBtn = document.getElementById('news-modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeNewsModal());
    }

    const modal = document.getElementById('news-reader-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeNewsModal();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('news-reader-modal');
      if (modal && modal.classList.contains('active') && e.key === 'Escape') {
        this.closeNewsModal();
      }
    });
  }

  getFilteredNews() {
    const all = window.dataStore.getNews();
    if (!this.searchQuery) return all;
    return all.filter(n =>
      n.title.toLowerCase().includes(this.searchQuery) ||
      n.excerpt.toLowerCase().includes(this.searchQuery) ||
      (n.body && n.body.toLowerCase().includes(this.searchQuery))
    );
  }

  render() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    const newsList = this.getFilteredNews();

    if (newsList.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">📰</div>
          <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No Stories Found</h3>
          <p>We couldn't find any press releases matching your search query.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = newsList.map(item => `
      <article class="news-card">
        <div class="news-thumb-wrap">
          <img src="${item.imageUrl}" alt="${item.title}" class="news-thumb" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=600&q=80'">
          <span class="news-date-badge">${item.date}</span>
        </div>
        <div class="news-body">
          <div class="news-meta-row">
            <span>${item.category || 'Event Press'}</span>
          </div>
          <h3 class="news-title">${item.title}</h3>
          <p class="news-excerpt">${item.excerpt}</p>
          <div class="news-card-footer">
            <span class="news-read-time">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${item.readTime || '3 min read'}
            </span>
            <button class="btn btn-sm btn-outline-emerald" onclick="window.news.openStoryModal('${item.id}')">
              Read Full Story &rarr;
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  openStoryModal(id) {
    const all = window.dataStore.getNews();
    const story = all.find(s => s.id === id);
    if (!story) return;

    const modal = document.getElementById('news-reader-modal');
    const titleEl = document.getElementById('news-modal-title');
    const dateEl = document.getElementById('news-modal-date');
    const catEl = document.getElementById('news-modal-category');
    const imgEl = document.getElementById('news-modal-img');
    const bodyEl = document.getElementById('news-modal-body');

    if (titleEl) titleEl.textContent = story.title;
    if (dateEl) dateEl.textContent = `${story.date} • ${story.readTime || '4 min read'}`;
    if (catEl) catEl.textContent = story.category || 'Press Release';
    if (imgEl) {
      imgEl.src = story.imageUrl;
      imgEl.alt = story.title;
    }
    if (bodyEl) {
      // Split formatted lines or paragraphs
      const paragraphs = story.body.split('\n\n').filter(p => p.trim());
      bodyEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.soundFx) window.soundFx.playClick();
    }
  }

  closeNewsModal() {
    const modal = document.getElementById('news-reader-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (window.soundFx) window.soundFx.playClick();
    }
  }
}

window.news = new NewsManager();

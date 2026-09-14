/* ==========================================================================
   MAGAZINE & STUDENT RESEARCH PAPERS CONTROLLER
   Student essays showcase, category filters, formatted reader modal, font controls & print
   ========================================================================== */

class MagazineManager {
  constructor() {
    this.currentFilter = 'All';
    this.searchQuery = '';
    this.fontSize = 17; // base font size in px
    this.initEventListeners();
  }

  initEventListeners() {
    const filterContainer = document.getElementById('magazine-filter-group');
    if (filterContainer) {
      filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (btn) {
          filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentFilter = btn.dataset.filter;
          if (window.soundFx) window.soundFx.playClick();
          this.render();
        }
      });
    }

    const searchInput = document.getElementById('magazine-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    const closeBtn = document.getElementById('magazine-modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeReaderModal());
    }

    const modal = document.getElementById('magazine-reader-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeReaderModal();
        }
      });
    }

    // Font size adjusters
    const btnFontInc = document.getElementById('font-increase-btn');
    const btnFontDec = document.getElementById('font-decrease-btn');
    const btnPrint = document.getElementById('print-paper-btn');

    if (btnFontInc) {
      btnFontInc.addEventListener('click', () => this.adjustFontSize(1));
    }
    if (btnFontDec) {
      btnFontDec.addEventListener('click', () => this.adjustFontSize(-1));
    }
    if (btnPrint) {
      btnPrint.addEventListener('click', () => window.print());
    }

    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('magazine-reader-modal');
      if (modal && modal.classList.contains('active') && e.key === 'Escape') {
        this.closeReaderModal();
      }
    });
  }

  adjustFontSize(delta) {
    this.fontSize = Math.min(24, Math.max(14, this.fontSize + delta));
    const bodyEl = document.getElementById('magazine-modal-body');
    if (bodyEl) {
      bodyEl.style.fontSize = `${this.fontSize}px`;
    }
  }

  getFilteredPapers() {
    const all = window.dataStore.getMagazine();
    return all.filter(p => {
      const matchesFilter = this.currentFilter === 'All' || p.category === this.currentFilter;
      const matchesSearch = !this.searchQuery ||
        p.title.toLowerCase().includes(this.searchQuery) ||
        p.author.toLowerCase().includes(this.searchQuery) ||
        p.abstract.toLowerCase().includes(this.searchQuery);
      return matchesFilter && matchesSearch;
    });
  }

  render() {
    const grid = document.getElementById('magazine-grid');
    if (!grid) return;

    const papers = this.getFilteredPapers();

    if (papers.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4.5rem 1.5rem; background: var(--surface-container-lowest); border: 1px dashed var(--outline-variant); border-radius: var(--radius-default);">
          <div style="font-size: 2.5rem; margin-bottom: 0.85rem;">📜</div>
          <h3 style="color: var(--on-surface); font-family: var(--font-display); margin-bottom: 0.5rem; font-size: 1.35rem;">No Academic Papers Published</h3>
          <p style="color: var(--outline); font-size: 0.95rem; max-width: 500px; margin: 0 auto;">Student research essays and scholarly articles will appear here once published via the Admin Control Center.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = papers.map(paper => {
      const initials = paper.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      return `
        <article class="magazine-card">
          <span class="magazine-category-tag">${paper.category || 'Scholarly Essay'}</span>
          <h3 class="magazine-title">${paper.title}</h3>
          <div class="magazine-author-bar">
            <div class="author-avatar">${initials}</div>
            <div class="author-details">
              <span class="author-name">${paper.author}</span>
              <span class="author-grade">${paper.grade || 'Student Researcher'}</span>
            </div>
          </div>
          <p class="magazine-abstract">${paper.abstract}</p>
          <div class="magazine-footer">
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">Academic Essay</span>
            <button class="btn btn-sm btn-primary" onclick="window.magazine.openReaderModal('${paper.id}')">
              Read Article &rarr;
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  openReaderModal(id) {
    const all = window.dataStore.getMagazine();
    const paper = all.find(p => p.id === id);
    if (!paper) return;

    const modal = document.getElementById('magazine-reader-modal');
    const catEl = document.getElementById('magazine-modal-category');
    const titleEl = document.getElementById('magazine-modal-title');
    const authorEl = document.getElementById('magazine-modal-author');
    const gradeEl = document.getElementById('magazine-modal-grade');
    const abstractEl = document.getElementById('magazine-modal-abstract');
    const bodyEl = document.getElementById('magazine-modal-body');

    if (catEl) catEl.textContent = paper.category || 'Mawlid Academic Journal';
    if (titleEl) titleEl.textContent = paper.title;
    if (authorEl) authorEl.textContent = paper.author;
    if (gradeEl) gradeEl.textContent = paper.grade || 'Student Contributor';
    if (abstractEl) abstractEl.textContent = paper.abstract;
    if (bodyEl) {
      bodyEl.innerHTML = paper.body;
      bodyEl.style.fontSize = `${this.fontSize}px`;
    }

    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.soundFx) window.soundFx.playClick();
    }
  }

  closeReaderModal() {
    const modal = document.getElementById('magazine-reader-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (window.soundFx) window.soundFx.playClick();
    }
  }
}

window.magazine = new MagazineManager();

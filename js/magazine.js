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
      let matchesFilter = this.currentFilter === 'All';
      if (!matchesFilter) {
        const cat = (p.category || '').toLowerCase();
        const type = (p.itemType || '').toLowerCase();
        if (this.currentFilter === 'Poems') {
          matchesFilter = type === 'poem' || cat.includes('poem') || cat.includes('qas');
        } else if (this.currentFilter === 'Articles') {
          matchesFilter = type === 'article' || cat.includes('article') || cat.includes('essay');
        } else if (this.currentFilter === 'Reflections') {
          matchesFilter = type === 'reflection' || cat.includes('reflect');
        } else if (this.currentFilter === 'Youth Voice') {
          matchesFilter = cat.includes('youth') || (p.grade && p.grade.toLowerCase().includes('youth'));
        } else {
          matchesFilter = p.category === this.currentFilter;
        }
      }

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
          <h3 style="color: var(--on-surface); font-family: var(--font-display); margin-bottom: 0.5rem; font-size: 1.35rem;">No Poems or Articles Published Yet</h3>
          <p style="color: var(--outline); font-size: 0.95rem; max-width: 500px; margin: 0 auto;">Student poems, sacred verses, qasīdas, and articles will appear here once published via the Admin Control Center.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = papers.map(paper => {
      const isPoem = paper.itemType === 'poem' || (paper.category && paper.category.toLowerCase().includes('poem')) || (paper.category && paper.category.toLowerCase().includes('qas'));
      const initials = paper.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const typeLabel = isPoem ? 'Poem / Qasīda' : 'Article';
      const readBtnLabel = isPoem ? 'Read Poem &rarr;' : 'Read Article &rarr;';
      const previewText = isPoem
        ? `<div style="font-style: italic; white-space: pre-line; line-height: 1.75; color: var(--gold-light); font-family: 'Amiri', Georgia, serif; margin: 0.75rem 0 1.25rem; font-size: 0.95rem; border-left: 2px solid var(--gold-primary); padding-left: 0.75rem;">${(paper.abstract || paper.body.split('\n').filter(l => l.trim()).slice(0, 3).join('\n')).trim()}</div>`
        : `<p class="magazine-abstract">${paper.abstract || paper.body.substring(0, 140) + '...'}</p>`;

      return `
        <article class="magazine-card">
          <span class="magazine-category-tag">${isPoem ? '📜 ' : '📖 '}${paper.category || typeLabel}</span>
          <h3 class="magazine-title">${paper.title}</h3>
          <div class="magazine-author-bar">
            <div class="author-avatar">${initials}</div>
            <div class="author-details">
              <span class="author-name">${paper.author}</span>
              <span class="author-grade">${paper.grade || 'B13 Contributor'}</span>
            </div>
          </div>
          ${previewText}
          <div class="magazine-footer">
            <span style="font-size: 0.8rem; color: var(--gold-antique); font-weight: 600;">${typeLabel}</span>
            <button class="btn btn-sm btn-primary" onclick="window.magazine.openReaderModal('${paper.id}')">
              ${readBtnLabel}
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

    const isPoem = paper.itemType === 'poem' || (paper.category && paper.category.toLowerCase().includes('poem')) || (paper.category && paper.category.toLowerCase().includes('qas'));
    const modal = document.getElementById('magazine-reader-modal');
    const catEl = document.getElementById('magazine-modal-category');
    const typeBadge = document.getElementById('magazine-modal-type-badge');
    const titleEl = document.getElementById('magazine-modal-title');
    const authorEl = document.getElementById('magazine-modal-author');
    const gradeEl = document.getElementById('magazine-modal-grade');
    const abstractBox = document.getElementById('magazine-modal-abstract-box');
    const abstractEl = document.getElementById('magazine-modal-abstract');
    const bodyEl = document.getElementById('magazine-modal-body');

    if (catEl) catEl.textContent = paper.category || (isPoem ? 'Mawlid Poetry & Qasīda' : 'Mawlid Meg Special Edition');
    if (typeBadge) typeBadge.textContent = isPoem ? '📜 Sacred Poetry' : '📖 Mawlid Article';
    if (titleEl) titleEl.textContent = paper.title;
    if (authorEl) authorEl.textContent = paper.author;
    if (gradeEl) gradeEl.textContent = paper.grade || 'B13 Contributor';

    // For poems, completely hide the academic abstract box so it presents as pure poetry
    if (abstractBox) {
      if (isPoem || !paper.abstract) {
        abstractBox.style.display = 'none';
      } else {
        abstractBox.style.display = 'block';
        if (abstractEl) abstractEl.textContent = paper.abstract;
      }
    }

    if (bodyEl) {
      if (isPoem) {
        // Render poem exactly as entered with full line breaks and spacing preserved
        bodyEl.innerHTML = `
          <div class="poem-body-container" style="margin: 0.5rem auto 2rem; text-align: center; white-space: pre-wrap; word-break: break-word; font-family: 'Amiri', var(--font-display), Georgia, serif; font-size: ${this.fontSize + 3}px; line-height: 2.4; color: var(--gold-light); background: rgba(7, 37, 32, 0.75); padding: 2.5rem 2rem; border-radius: var(--radius-md); border: 1px solid var(--border-gold); max-width: 680px; letter-spacing: 0.02em; box-shadow: inset 0 0 30px rgba(0,0,0,0.5);">
${paper.body}
          </div>
        `;
      } else {
        bodyEl.innerHTML = `
          <div style="white-space: pre-wrap; word-break: break-word; line-height: 1.85; font-size: ${this.fontSize}px;">
${paper.body}
          </div>
        `;
      }
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

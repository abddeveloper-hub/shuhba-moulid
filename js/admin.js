/* ==========================================================================
   ADMIN DASHBOARD CONTROLLER
   PIN-protected administration panel with full CRUD for Gallery, News,
   Magazine, Quiz Questions, Leaderboard, and Data Backup/Restore.
   ========================================================================== */

class AdminManager {
  constructor() {
    this.isAuthenticated = sessionStorage.getItem('mawlid_admin_auth') === 'true';
    this.currentTab = 'overview';
    this.initEventListeners();
  }

  initEventListeners() {
    // PIN Submission
    const pinForm = document.getElementById('admin-pin-form');
    if (pinForm) {
      pinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePinSubmit();
      });
    }

    // Auto-advance PIN inputs
    const pinInputs = document.querySelectorAll('.pin-digit-input');
    pinInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < pinInputs.length - 1) {
          pinInputs[index + 1].focus();
        }
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          pinInputs[index - 1].focus();
        }
      });
    });

    // Admin Tabs
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.switchTab(btn.dataset.tab);
      });
    });

    // Lock / Logout
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.lockDashboard());
    }

    // Export Data JSON
    const exportBtn = document.getElementById('admin-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportDataJSON());
    }

    // Import Data JSON
    const importInput = document.getElementById('admin-import-file');
    if (importInput) {
      importInput.addEventListener('change', (e) => this.importDataJSON(e));
    }

    // Reset Defaults
    const resetBtn = document.getElementById('admin-reset-defaults-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.confirmResetDefaults());
    }

    // Change PIN
    const changePinForm = document.getElementById('admin-change-pin-form');
    if (changePinForm) {
      changePinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleChangePin();
      });
    }

    // CRUD Forms
    this.initCrudForms();
  }

  initCrudForms() {
    // Gallery Add Form
    const galForm = document.getElementById('admin-add-gallery-form');
    if (galForm) {
      galForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('add-gal-title').value.trim();
        const category = document.getElementById('add-gal-category').value;
        const imageUrl = document.getElementById('add-gal-url').value.trim();
        const caption = document.getElementById('add-gal-caption').value.trim();

        if (!title || !imageUrl) {
          window.app.showToast('Please provide an image title and valid image URL.', 'warning');
          return;
        }

        window.dataStore.addGalleryItem({ title, category, imageUrl, caption });
        window.app.showToast('Photo successfully added to Gallery!', 'success');
        galForm.reset();
        this.renderGalleryList();
        this.renderOverviewStats();
      });
    }

    // News Add Form
    const newsForm = document.getElementById('admin-add-news-form');
    if (newsForm) {
      newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('add-news-title').value.trim();
        const category = document.getElementById('add-news-category').value.trim();
        const imageUrl = document.getElementById('add-news-url').value.trim();
        const excerpt = document.getElementById('add-news-excerpt').value.trim();
        const body = document.getElementById('add-news-body').value.trim();

        if (!title || !body) {
          window.app.showToast('Please provide a news title and body text.', 'warning');
          return;
        }

        window.dataStore.addNewsItem({
          title,
          category: category || 'Press Release',
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80',
          excerpt: excerpt || body.substring(0, 140) + '...',
          body
        });

        window.app.showToast('News story published successfully!', 'success');
        newsForm.reset();
        this.renderNewsList();
        this.renderOverviewStats();
      });
    }

    // Magazine Add Form
    const magForm = document.getElementById('admin-add-magazine-form');
    if (magForm) {
      magForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('add-mag-title').value.trim();
        const author = document.getElementById('add-mag-author').value.trim();
        const grade = document.getElementById('add-mag-grade').value.trim();
        const category = document.getElementById('add-mag-category').value.trim();
        const abstract = document.getElementById('add-mag-abstract').value.trim();
        const body = document.getElementById('add-mag-body').value.trim();

        if (!title || !author || !body) {
          window.app.showToast('Please fill in title, author, and paper body.', 'warning');
          return;
        }

        window.dataStore.addMagazineItem({
          title,
          author,
          grade: grade || 'Student Contributor',
          category: category || 'Scholarly Paper',
          abstract: abstract || body.substring(0, 160) + '...',
          body
        });

        window.app.showToast('Student paper published to Magazine!', 'success');
        magForm.reset();
        this.renderMagazineList();
        this.renderOverviewStats();
      });
    }

    // Quiz Question Add Form
    const quizForm = document.getElementById('admin-add-quiz-form');
    if (quizForm) {
      quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const question = document.getElementById('add-quiz-question').value.trim();
        const opt0 = document.getElementById('add-quiz-opt0').value.trim();
        const opt1 = document.getElementById('add-quiz-opt1').value.trim();
        const opt2 = document.getElementById('add-quiz-opt2').value.trim();
        const opt3 = document.getElementById('add-quiz-opt3').value.trim();
        const correctIndex = parseInt(document.getElementById('add-quiz-correct').value, 10);
        const explanation = document.getElementById('add-quiz-explanation').value.trim();

        if (!question || !opt0 || !opt1 || !opt2 || !opt3) {
          window.app.showToast('Please provide question and all 4 options.', 'warning');
          return;
        }

        window.dataStore.addQuizQuestion({
          question,
          options: [opt0, opt1, opt2, opt3],
          correctIndex,
          explanation
        });

        window.app.showToast('New question added to Seerah Quiz!', 'success');
        quizForm.reset();
        this.renderQuizList();
        this.renderOverviewStats();
      });
    }

    // Reset Leaderboard button
    const clearLbBtn = document.getElementById('admin-clear-leaderboard-btn');
    if (clearLbBtn) {
      clearLbBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all participant scores from the leaderboard?')) {
          window.dataStore.clearLeaderboard();
          window.app.showToast('Leaderboard has been reset.', 'info');
          this.renderOverviewStats();
          if (window.quiz) window.quiz.renderScoreboard();
        }
      });
    }
  }

  handlePinSubmit() {
    const d1 = document.getElementById('pin-1').value;
    const d2 = document.getElementById('pin-2').value;
    const d3 = document.getElementById('pin-3').value;
    const d4 = document.getElementById('pin-4').value;
    const enteredPin = `${d1}${d2}${d3}${d4}`;

    if (window.dataStore.verifyPin(enteredPin)) {
      this.isAuthenticated = true;
      sessionStorage.setItem('mawlid_admin_auth', 'true');
      if (window.soundFx) window.soundFx.playSuccess();
      window.app.showToast('Admin access granted! Welcome.', 'success');
      this.render();
    } else {
      if (window.soundFx) window.soundFx.playError();
      window.app.showToast('Invalid Admin PIN. (Default is 1446)', 'error');
      // Clear inputs
      ['pin-1', 'pin-2', 'pin-3', 'pin-4'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const first = document.getElementById('pin-1');
      if (first) first.focus();
    }
  }

  lockDashboard() {
    this.isAuthenticated = false;
    sessionStorage.removeItem('mawlid_admin_auth');
    if (window.soundFx) window.soundFx.playClick();
    window.app.showToast('Admin panel locked.', 'info');
    this.render();
  }

  switchTab(tabKey) {
    this.currentTab = tabKey;
    document.querySelectorAll('.admin-tab-content').forEach(pane => {
      pane.classList.remove('active');
    });
    const activePane = document.getElementById(`admin-pane-${tabKey}`);
    if (activePane) {
      activePane.classList.add('active');
    }
    if (window.soundFx) window.soundFx.playClick();

    if (tabKey === 'overview') this.renderOverviewStats();
    if (tabKey === 'gallery') this.renderGalleryList();
    if (tabKey === 'news') this.renderNewsList();
    if (tabKey === 'magazine') this.renderMagazineList();
    if (tabKey === 'quiz') this.renderQuizList();
  }

  render() {
    const authPanel = document.getElementById('admin-auth-panel');
    const mainPanel = document.getElementById('admin-main-panel');

    if (!this.isAuthenticated) {
      if (authPanel) authPanel.style.display = 'block';
      if (mainPanel) mainPanel.style.display = 'none';
      const firstInput = document.getElementById('pin-1');
      if (firstInput) firstInput.focus();
    } else {
      if (authPanel) authPanel.style.display = 'none';
      if (mainPanel) mainPanel.style.display = 'block';
      this.switchTab(this.currentTab);
    }
  }

  renderOverviewStats() {
    const galleryCount = window.dataStore.getGallery().length;
    const newsCount = window.dataStore.getNews().length;
    const magCount = window.dataStore.getMagazine().length;
    const quizCount = window.dataStore.getQuizQuestions().length;
    const lbCount = window.dataStore.getLeaderboard().length;

    const elGal = document.getElementById('admin-stat-gallery');
    const elNews = document.getElementById('admin-stat-news');
    const elMag = document.getElementById('admin-stat-magazine');
    const elQuiz = document.getElementById('admin-stat-quiz');
    const elLb = document.getElementById('admin-stat-leaderboard');

    if (elGal) elGal.textContent = galleryCount;
    if (elNews) elNews.textContent = newsCount;
    if (elMag) elMag.textContent = magCount;
    if (elQuiz) elQuiz.textContent = quizCount;
    if (elLb) elLb.textContent = lbCount;
  }

  renderGalleryList() {
    const container = document.getElementById('admin-gallery-items-list');
    if (!container) return;

    const items = window.dataStore.getGallery();
    if (items.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No gallery photos present.</p>`;
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="admin-item-row">
        <div class="admin-item-info">
          <img src="${item.imageUrl}" alt="${item.title}" class="admin-item-thumb" onerror="this.src='https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=200&q=80'">
          <div class="admin-item-texts">
            <h4>${item.title}</h4>
            <p>${item.category} • ${item.date}</p>
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn btn-sm btn-danger" onclick="window.admin.deleteGalleryItem('${item.id}')">
            Delete
          </button>
        </div>
      </div>
    `).join('');
  }

  deleteGalleryItem(id) {
    if (confirm('Are you sure you want to delete this photo from the gallery?')) {
      window.dataStore.deleteGalleryItem(id);
      this.renderGalleryList();
      this.renderOverviewStats();
      window.app.showToast('Photo deleted.', 'info');
      if (window.gallery) window.gallery.render();
    }
  }

  renderNewsList() {
    const container = document.getElementById('admin-news-items-list');
    if (!container) return;

    const items = window.dataStore.getNews();
    if (items.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No news articles present.</p>`;
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="admin-item-row">
        <div class="admin-item-info">
          <img src="${item.imageUrl}" alt="${item.title}" class="admin-item-thumb" onerror="this.src='https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=200&q=80'">
          <div class="admin-item-texts">
            <h4>${item.title}</h4>
            <p>${item.category} • ${item.date}</p>
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn btn-sm btn-danger" onclick="window.admin.deleteNewsItem('${item.id}')">
            Delete
          </button>
        </div>
      </div>
    `).join('');
  }

  deleteNewsItem(id) {
    if (confirm('Are you sure you want to delete this news article?')) {
      window.dataStore.deleteNewsItem(id);
      this.renderNewsList();
      this.renderOverviewStats();
      window.app.showToast('News story deleted.', 'info');
      if (window.news) window.news.render();
    }
  }

  renderMagazineList() {
    const container = document.getElementById('admin-magazine-items-list');
    if (!container) return;

    const items = window.dataStore.getMagazine();
    if (items.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No student papers submitted.</p>`;
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="admin-item-row">
        <div class="admin-item-info">
          <div class="admin-item-texts">
            <h4>${item.title}</h4>
            <p>Author: <strong>${item.author}</strong> (${item.grade || 'Student'}) • ${item.category}</p>
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn btn-sm btn-danger" onclick="window.admin.deleteMagazineItem('${item.id}')">
            Delete
          </button>
        </div>
      </div>
    `).join('');
  }

  deleteMagazineItem(id) {
    if (confirm('Are you sure you want to delete this student paper?')) {
      window.dataStore.deleteMagazineItem(id);
      this.renderMagazineList();
      this.renderOverviewStats();
      window.app.showToast('Paper removed from magazine.', 'info');
      if (window.magazine) window.magazine.render();
    }
  }

  renderQuizList() {
    const container = document.getElementById('admin-quiz-items-list');
    if (!container) return;

    const items = window.dataStore.getQuizQuestions();
    if (items.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No quiz questions in bank.</p>`;
      return;
    }

    container.innerHTML = items.map((item, idx) => `
      <div class="admin-item-row">
        <div class="admin-item-info">
          <div class="admin-item-texts">
            <h4>${idx + 1}. ${item.question}</h4>
            <p>Correct: <strong>${item.options[item.correctIndex]}</strong> (${item.options.length} options)</p>
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn btn-sm btn-danger" onclick="window.admin.deleteQuizQuestion('${item.id}')">
            Delete
          </button>
        </div>
      </div>
    `).join('');
  }

  deleteQuizQuestion(id) {
    if (confirm('Are you sure you want to remove this quiz question?')) {
      window.dataStore.deleteQuizQuestion(id);
      this.renderQuizList();
      this.renderOverviewStats();
      window.app.showToast('Question deleted.', 'info');
    }
  }

  handleChangePin() {
    const newPin = document.getElementById('new-admin-pin').value.trim();
    if (!/^\d{4}$/.test(newPin)) {
      window.app.showToast('PIN must be exactly 4 numeric digits.', 'warning');
      return;
    }
    window.dataStore.setAdminPin(newPin);
    window.app.showToast(`Admin PIN updated to ${newPin}!`, 'success');
    document.getElementById('admin-change-pin-form').reset();
  }

  exportDataJSON() {
    const dataStr = window.dataStore.exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Mawlid_Portal_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    window.app.showToast('Complete portal data exported to JSON.', 'success');
  }

  importDataJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const success = window.dataStore.importData(e.target.result);
      if (success) {
        window.app.showToast('Data successfully imported and synchronized!', 'success');
        this.renderOverviewStats();
        if (window.gallery) window.gallery.render();
        if (window.news) window.news.render();
        if (window.magazine) window.magazine.render();
        if (window.quiz) window.quiz.renderScoreboard();
      } else {
        window.app.showToast('Failed to import JSON. Please check file formatting.', 'error');
      }
    };
    reader.readAsText(file);
  }

  confirmResetDefaults() {
    if (confirm('Reset all portal data back to original seed data? Any newly created items will be replaced.')) {
      window.dataStore.resetToDefaults();
      window.app.showToast('Portal reset to default showcase data.', 'success');
      this.renderOverviewStats();
      if (window.gallery) window.gallery.render();
      if (window.news) window.news.render();
      if (window.magazine) window.magazine.render();
      if (window.quiz) window.quiz.renderScoreboard();
    }
  }
}

window.admin = new AdminManager();

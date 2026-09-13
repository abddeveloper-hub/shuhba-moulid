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

  compressImageFile(file, maxDimension = 1200, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  initCrudForms() {
    // Gallery Add Form & Media Type Switching
    const galForm = document.getElementById('admin-add-gallery-form');
    const photoSection = document.getElementById('admin-gal-photo-section');
    const videoSection = document.getElementById('admin-gal-video-section');
    const mediaTypeRadios = document.querySelectorAll('input[name="admin-media-type"]');

    // Photo Inputs
    const galFileInput = document.getElementById('add-gal-file');
    const galUrlInput = document.getElementById('add-gal-url');
    const galPreviewBox = document.getElementById('gal-img-preview-box');
    const galPreviewImg = document.getElementById('gal-img-preview');
    const galRemoveImgBtn = document.getElementById('gal-remove-img-btn');

    // Video Inputs
    const galVideoFileInput = document.getElementById('add-gal-video-file');
    const galVideoUrlInput = document.getElementById('add-gal-video-url');
    const galVideoThumbInput = document.getElementById('add-gal-video-thumb');
    const galVideoPreviewBox = document.getElementById('gal-video-preview-box');
    const galVideoPreviewPlayer = document.getElementById('gal-video-preview-player');
    const galRemoveVideoBtn = document.getElementById('gal-remove-video-btn');

    // Media Type Toggle Handler
    mediaTypeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const type = e.target.value;
        if (type === 'video') {
          if (photoSection) photoSection.style.display = 'none';
          if (videoSection) videoSection.style.display = 'block';
        } else {
          if (photoSection) photoSection.style.display = 'block';
          if (videoSection) videoSection.style.display = 'none';
        }
        if (window.soundFx) window.soundFx.playClick();
      });
    });

    const showGalPreview = (src) => {
      if (galPreviewBox && galPreviewImg) {
        galPreviewImg.src = src;
        galPreviewBox.style.display = 'block';
      }
    };

    const hideGalPreview = () => {
      if (galPreviewBox && galPreviewImg) {
        galPreviewImg.src = '';
        galPreviewBox.style.display = 'none';
      }
      if (galFileInput) galFileInput.value = '';
      if (galUrlInput) galUrlInput.value = '';
    };

    if (galRemoveImgBtn) {
      galRemoveImgBtn.addEventListener('click', hideGalPreview);
    }

    if (galUrlInput) {
      galUrlInput.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        if (val) {
          if (window.dataStore && window.dataStore.convertGoogleDriveUrl) {
            val = window.dataStore.convertGoogleDriveUrl(val, false);
          }
          showGalPreview(val);
        } else {
          hideGalPreview();
        }
      });
    }

    if (galFileInput) {
      galFileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        try {
          const compressedDataUrl = await this.compressImageFile(file);
          if (galUrlInput) galUrlInput.value = compressedDataUrl;
          showGalPreview(compressedDataUrl);
          if (window.app) window.app.showToast('Photo loaded and optimized successfully.', 'success');
        } catch (err) {
          console.error('Error reading image file:', err);
          if (window.app) window.app.showToast('Failed to process image file.', 'error');
        }
      });
    }

    // Video Preview & File Handling (Supports Google Drive, YouTube, Vimeo, MP4)
    const showVideoPreview = (url) => {
      if (!galVideoPreviewBox || !galVideoPreviewPlayer) return;
      if (!url) {
        hideVideoPreview();
        return;
      }

      // Check Google Drive Video
      const gDriveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                         url.match(/drive\.google\.com\/.*[?&]id=([a-zA-Z0-9_-]+)/) ||
                         url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (gDriveMatch) {
        const fileId = gDriveMatch[1];
        galVideoPreviewPlayer.innerHTML = `
          <iframe src="https://drive.google.com/file/d/${fileId}/preview" style="width: 100%; height: 200px; border: none; border-radius: 6px;" allowfullscreen></iframe>
        `;
        if (galVideoThumbInput && !galVideoThumbInput.value) {
          galVideoThumbInput.value = `https://lh3.googleusercontent.com/d/${fileId}`;
        }
        galVideoPreviewBox.style.display = 'block';
        return;
      }

      // Check YouTube or Vimeo
      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytMatch) {
        galVideoPreviewPlayer.innerHTML = `
          <iframe src="https://www.youtube.com/embed/${ytMatch[1]}" style="width: 100%; height: 200px; border: none; border-radius: 6px;" allowfullscreen></iframe>
        `;
        if (galVideoThumbInput && !galVideoThumbInput.value) {
          galVideoThumbInput.value = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
        }
      } else {
        galVideoPreviewPlayer.innerHTML = `
          <video controls playsinline style="max-height: 200px; width: 100%; border-radius: 6px; background: #000;" src="${url}">
            Your browser does not support HTML5 video.
          </video>
        `;
      }
      galVideoPreviewBox.style.display = 'block';
    };

    const hideVideoPreview = () => {
      if (galVideoPreviewBox && galVideoPreviewPlayer) {
        galVideoPreviewPlayer.innerHTML = '';
        galVideoPreviewBox.style.display = 'none';
      }
      if (galVideoFileInput) galVideoFileInput.value = '';
      if (galVideoUrlInput) galVideoUrlInput.value = '';
      if (galVideoThumbInput) galVideoThumbInput.value = '';
    };

    if (galRemoveVideoBtn) {
      galRemoveVideoBtn.addEventListener('click', hideVideoPreview);
    }

    if (galVideoUrlInput) {
      galVideoUrlInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val) {
          showVideoPreview(val);
        } else {
          hideVideoPreview();
        }
      });
    }

    if (galVideoFileInput) {
      galVideoFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (window.app) window.app.showToast('Reading video file from device...', 'info');
        const reader = new FileReader();
        reader.onload = (evt) => {
          const videoDataUrl = evt.target.result;
          if (galVideoUrlInput) galVideoUrlInput.value = videoDataUrl;
          showVideoPreview(videoDataUrl);
          if (window.app) window.app.showToast('Video file loaded successfully.', 'success');
        };
        reader.onerror = () => {
          if (window.app) window.app.showToast('Failed to read video file.', 'error');
        };
        reader.readAsDataURL(file);
      });
    }

    // Global preset helper for gallery (supports both photo & video)
    window.setGalleryPreset = (url, title, cat, mediaType = 'photo', videoUrl = '') => {
      const titleInput = document.getElementById('add-gal-title');
      const catInput = document.getElementById('add-gal-category');
      const photoRadio = document.querySelector('input[name="admin-media-type"][value="photo"]');
      const videoRadio = document.querySelector('input[name="admin-media-type"][value="video"]');

      if (titleInput) titleInput.value = title;
      if (catInput) catInput.value = cat;

      if (mediaType === 'video') {
        if (videoRadio) {
          videoRadio.checked = true;
          videoRadio.dispatchEvent(new Event('change'));
        }
        if (galVideoUrlInput) {
          galVideoUrlInput.value = videoUrl;
          showVideoPreview(videoUrl);
        }
        if (galVideoThumbInput) galVideoThumbInput.value = url;
      } else {
        if (photoRadio) {
          photoRadio.checked = true;
          photoRadio.dispatchEvent(new Event('change'));
        }
        if (galUrlInput) {
          galUrlInput.value = url;
          showGalPreview(url);
        }
      }

      if (window.soundFx) window.soundFx.playClick();
      if (window.app) window.app.showToast('Preset media loaded into form.', 'info');
    };

    if (galForm) {
      galForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedType = document.querySelector('input[name="admin-media-type"]:checked')?.value || 'photo';
        const title = document.getElementById('add-gal-title').value.trim();
        const category = document.getElementById('add-gal-category').value;
        const caption = document.getElementById('add-gal-caption').value.trim();

        if (selectedType === 'video') {
          const videoUrl = galVideoUrlInput ? galVideoUrlInput.value.trim() : '';
          let thumbUrl = galVideoThumbInput ? galVideoThumbInput.value.trim() : '';

          if (!title || !videoUrl) {
            window.app.showToast('Please provide a video title and choose a video file or enter a video URL.', 'warning');
            return;
          }

          // Auto-detect YouTube thumbnail
          if (!thumbUrl) {
            const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
            if (ytMatch) {
              thumbUrl = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
            } else {
              thumbUrl = 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80';
            }
          }

          window.dataStore.addGalleryItem({
            title,
            category,
            mediaType: 'video',
            videoUrl,
            imageUrl: thumbUrl,
            caption
          });

          window.app.showToast('Video published successfully to Gallery!', 'success');
          galForm.reset();
          hideVideoPreview();
        } else {
          const imageUrl = galUrlInput ? galUrlInput.value.trim() : '';
          if (!title || !imageUrl) {
            window.app.showToast('Please provide an image title and either choose a photo file or enter a photo URL.', 'warning');
            return;
          }

          window.dataStore.addGalleryItem({
            title,
            category,
            mediaType: 'photo',
            imageUrl,
            caption
          });

          window.app.showToast('Photo published successfully to Gallery!', 'success');
          galForm.reset();
          hideGalPreview();
        }

        this.renderGalleryList();
        this.renderOverviewStats();
        if (window.gallery) window.gallery.render();
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
      window.app.showToast('Invalid Admin PIN. Please try again.', 'error');
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
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No gallery photos or videos present.</p>`;
      return;
    }

    container.innerHTML = items.map(item => {
      const isVideo = item.mediaType === 'video' || !!item.videoUrl;
      const mediaBadge = isVideo
        ? `<span style="background: #dc2626; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">🎥 Video</span>`
        : `<span style="background: var(--emerald-primary); color: #fff; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">📷 Photo</span>`;

      return `
        <div class="admin-item-row">
          <div class="admin-item-info">
            <div style="position: relative; flex-shrink: 0;">
              <img src="${item.imageUrl || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=200&q=80'}" alt="${item.title}" class="admin-item-thumb" onerror="this.src='https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=200&q=80'">
              ${isVideo ? '<span style="position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.8); color: #fff; font-size: 0.6rem; padding: 1px 4px; border-radius: 3px;">▶</span>' : ''}
            </div>
            <div class="admin-item-texts">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem;">
                <h4>${item.title}</h4>
                ${mediaBadge}
              </div>
              <p>${item.category} • ${item.date}${isVideo && item.videoUrl ? ' • <em>Video Link Attached</em>' : ''}</p>
            </div>
          </div>
          <div class="admin-item-actions">
            <button class="btn btn-sm btn-danger" onclick="window.admin.deleteGalleryItem('${item.id}')">
              Delete
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  deleteGalleryItem(id) {
    if (confirm('Are you sure you want to delete this media item from the gallery?')) {
      window.dataStore.deleteGalleryItem(id);
      this.renderGalleryList();
      this.renderOverviewStats();
      window.app.showToast('Item deleted from gallery.', 'info');
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

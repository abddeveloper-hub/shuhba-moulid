/* ==========================================================================
   GALLERY CONTROLLER
   Photo grid rendering, category filters, search, and full Lightbox viewer.
   ========================================================================== */

class GalleryManager {
  constructor() {
    this.currentFilter = 'All';
    this.searchQuery = '';
    this.lightboxIndex = 0;
    this.activeItems = [];
    this.initEventListeners();
  }

  initEventListeners() {
    // Filter buttons
    const filterContainer = document.getElementById('gallery-filter-group');
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

    // Search input
    const searchInput = document.getElementById('gallery-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    // Download Button in Lightbox
    const downloadBtn = document.getElementById('lightbox-download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadCurrentMedia());
    }

    // Lightbox Controls
    const closeBtn = document.getElementById('lightbox-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeLightbox());
    }

    const prevBtn = document.getElementById('lightbox-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateLightbox(-1));
    }

    const nextBtn = document.getElementById('lightbox-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateLightbox(1));
    }

    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeLightbox();
        }
      });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('lightbox-modal');
      if (modal && modal.classList.contains('active')) {
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
        if (e.key === 'ArrowRight') this.navigateLightbox(1);
      }
    });
  }

  // Helper to parse video links (Google Drive, YouTube, Vimeo, or Direct MP4)
  parseVideo(url) {
    if (!url) return { type: 'unknown', url: '' };

    // Google Drive Video
    const gDriveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                       url.match(/drive\.google\.com\/.*[?&]id=([a-zA-Z0-9_-]+)/) ||
                       url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (gDriveMatch) {
      const fileId = gDriveMatch[1];
      return {
        type: 'gdrive',
        id: fileId,
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        thumbnailUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
        downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`
      };
    }

    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      return {
        type: 'youtube',
        id: ytMatch[1],
        embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
        thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`
      };
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch) {
      return {
        type: 'vimeo',
        id: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
        thumbnailUrl: ''
      };
    }

    // Direct MP4 / WebM / Data URL
    return {
      type: 'direct',
      embedUrl: url,
      thumbnailUrl: ''
    };
  }

  getFilteredItems() {
    const all = window.dataStore.getGallery();
    return all.filter(item => {
      const matchesFilter = this.currentFilter === 'All' || item.category === this.currentFilter;
      const matchesSearch = !this.searchQuery ||
        item.title.toLowerCase().includes(this.searchQuery) ||
        (item.caption && item.caption.toLowerCase().includes(this.searchQuery));
      return matchesFilter && matchesSearch;
    });
  }

  updateFilterCounts() {
    const all = window.dataStore.getGallery();
    const categories = ['All', 'Stage Programs', 'Exhibitions', 'Awards'];

    categories.forEach(cat => {
      const count = cat === 'All' ? all.length : all.filter(i => i.category === cat).length;
      const countEl = document.getElementById(`gal-count-${cat.toLowerCase().replace(/\s+/g, '-')}`);
      if (countEl) {
        countEl.textContent = count;
      }
    });
  }

  render() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    this.updateFilterCounts();
    this.activeItems = this.getFilteredItems();

    if (this.activeItems.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">📷 / 🎥</div>
          <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No Media Found</h3>
          <p>No photos or videos match your filter or search query. Try choosing another category.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.activeItems.map((item, index) => {
      const isVideo = item.mediaType === 'video' || !!item.videoUrl;
      const videoInfo = isVideo && item.videoUrl ? this.parseVideo(item.videoUrl) : null;
      const displayThumb = item.imageUrl || (videoInfo && videoInfo.thumbnailUrl) || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80';

      return `
        <article class="gallery-card" onclick="window.gallery.openLightbox(${index})" tabindex="0" role="button" aria-label="View ${item.title}">
          <div class="gallery-thumb-container">
            <span class="gallery-category-pill">${item.category}</span>
            ${isVideo ? `
              <span class="gallery-media-pill video-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Video
              </span>
              <div class="gallery-play-overlay">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
              </div>
            ` : ''}
            <img src="${displayThumb}" alt="${item.title}" class="gallery-thumb" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80'">
            <div class="gallery-overlay">
              <span class="gallery-zoom-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                ${isVideo ? 'Click to play video' : 'Click to view full-size'}
              </span>
            </div>
          </div>
          <div class="gallery-info">
            <h3 class="gallery-card-title">${item.title}</h3>
            <p class="gallery-card-desc">${item.caption || ''}</p>
            <div class="gallery-card-footer">
              <div class="gallery-card-date">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ${item.date}
              </div>
              <button class="gallery-card-download-btn" title="Download media" onclick="event.stopPropagation(); window.gallery.downloadItem('${item.id}')" aria-label="Download ${item.title}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  openLightbox(index) {
    if (!this.activeItems || !this.activeItems[index]) return;
    this.lightboxIndex = index;
    this.updateLightboxContent();

    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.soundFx) window.soundFx.playClick();
    }
  }

  closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (window.soundFx) window.soundFx.playClick();
    }
    // Stop any playing video
    const videoStage = document.getElementById('lightbox-video-stage');
    if (videoStage) videoStage.innerHTML = '';
  }

  navigateLightbox(direction) {
    if (!this.activeItems || this.activeItems.length === 0) return;
    // Stop previous video if playing
    const videoStage = document.getElementById('lightbox-video-stage');
    if (videoStage) videoStage.innerHTML = '';

    this.lightboxIndex = (this.lightboxIndex + direction + this.activeItems.length) % this.activeItems.length;
    this.updateLightboxContent();
    if (window.soundFx) window.soundFx.playClick();
  }

  updateLightboxContent() {
    const item = this.activeItems[this.lightboxIndex];
    if (!item) return;

    const img = document.getElementById('lightbox-img');
    const videoStage = document.getElementById('lightbox-video-stage');
    const title = document.getElementById('lightbox-title');
    const caption = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');
    const catBadge = document.getElementById('lightbox-cat-badge');
    const mediaBadge = document.getElementById('lightbox-media-type-badge');
    const downloadText = document.getElementById('lightbox-download-text');

    const isVideo = item.mediaType === 'video' || !!item.videoUrl;

    if (isVideo && item.videoUrl) {
      if (img) img.style.display = 'none';
      if (videoStage) {
        videoStage.style.display = 'flex';
        const video = this.parseVideo(item.videoUrl);
        if (video.type === 'youtube' || video.type === 'vimeo' || video.type === 'gdrive') {
          videoStage.innerHTML = `
            <iframe src="${video.embedUrl}" style="width: 100%; height: 55vh; border: none; border-radius: 8px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          `;
        } else {
          videoStage.innerHTML = `
            <video controls autoplay playsinline style="max-height: 58vh; max-width: 100%; border-radius: 8px; background: #000;" src="${item.videoUrl}">
              Your browser does not support HTML5 video.
            </video>
          `;
        }
      }
      if (mediaBadge) {
        mediaBadge.textContent = '🎥 Video';
        mediaBadge.classList.add('video-badge');
      }
      if (downloadText) downloadText.textContent = 'Download Video';
    } else {
      if (videoStage) {
        videoStage.innerHTML = '';
        videoStage.style.display = 'none';
      }
      if (img) {
        img.style.display = 'block';
        img.src = item.imageUrl;
        img.alt = item.title;
      }
      if (mediaBadge) {
        mediaBadge.textContent = '📷 Photo';
        mediaBadge.classList.remove('video-badge');
      }
      if (downloadText) downloadText.textContent = 'Download Photo';
    }

    if (title) title.textContent = item.title;
    if (caption) caption.textContent = item.caption || '';
    if (counter) counter.textContent = `Media ${this.lightboxIndex + 1} of ${this.activeItems.length}`;
    if (catBadge) catBadge.textContent = item.category;
  }

  // Direct download handler for any media item
  async downloadItem(itemId) {
    const all = window.dataStore.getGallery();
    const item = all.find(i => i.id === itemId);
    if (!item) return;

    await this.triggerDownload(item);
  }

  // Lightbox download current media handler
  async downloadCurrentMedia() {
    const item = this.activeItems[this.lightboxIndex];
    if (!item) return;

    await this.triggerDownload(item);
  }

  // Core download logic supporting direct downloads, Data URIs, Google Drive, and fallback
  async triggerDownload(item) {
    if (window.soundFx) window.soundFx.playClick();

    const isVideo = item.mediaType === 'video' || !!item.videoUrl;
    const mediaUrl = isVideo && item.videoUrl ? item.videoUrl : item.imageUrl;

    if (!mediaUrl) {
      if (window.app) window.app.showToast('No media file available to download.', 'warning');
      return;
    }

    // Google Drive direct download
    const gDriveMatch = mediaUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                       mediaUrl.match(/drive\.google\.com\/.*[?&]id=([a-zA-Z0-9_-]+)/) ||
                       mediaUrl.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/) ||
                       mediaUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (gDriveMatch) {
      const gDriveDownload = `https://drive.google.com/uc?export=download&id=${gDriveMatch[1]}`;
      window.open(gDriveDownload, '_blank');
      if (window.app) window.app.showToast('Starting Google Drive download...', 'success');
      return;
    }

    // Streaming video links (YouTube / Vimeo)
    if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be') || mediaUrl.includes('vimeo.com')) {
      window.open(mediaUrl, '_blank');
      if (window.app) window.app.showToast('Opened streaming video in a new tab.', 'info');
      return;
    }

    const cleanTitle = (item.title || 'mawlid_media').replace(/[^a-zA-Z0-9_-]/g, '_');
    const ext = isVideo ? 'mp4' : 'jpg';
    const filename = `${cleanTitle}.${ext}`;

    try {
      if (window.app) window.app.showToast(`Preparing download for "${item.title}"...`, 'info');

      // Data URI download
      if (mediaUrl.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = mediaUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if (window.app) window.app.showToast('Download started successfully!', 'success');
        return;
      }

      // Fetch blob download (bypasses CORS restrictions on file downloads)
      const response = await fetch(mediaUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Fetch failed');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      if (window.app) window.app.showToast('Download started successfully!', 'success');
    } catch (err) {
      // Direct link fallback
      const fallbackLink = document.createElement('a');
      fallbackLink.href = mediaUrl;
      fallbackLink.target = '_blank';
      fallbackLink.download = filename;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
      if (window.app) window.app.showToast('Media opened for download.', 'info');
    }
  }
}

window.gallery = new GalleryManager();

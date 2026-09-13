/* ==========================================================================
   CLIENT-SIDE SPA ROUTER
   Handles URL Hash changes (#home, #gallery, #news, #magazine, #quiz, #admin)
   ========================================================================== */

class Router {
  constructor() {
    this.routes = ['home', 'gallery', 'news', 'magazine', 'quiz'];
    this.currentRoute = 'home';
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    // Initial route on load
    this.handleHashChange();
  }

  getRouteFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    return this.routes.includes(hash) ? hash : 'home';
  }

  navigateTo(route) {
    if (this.routes.includes(route)) {
      window.location.hash = route;
    }
  }

  handleHashChange() {
    // Redirect #admin hash directly to dedicated admin.html page
    if (window.location.hash === '#admin') {
      window.location.href = 'admin.html';
      return;
    }

    const targetRoute = this.getRouteFromHash();
    this.currentRoute = targetRoute;

    // Hide all views, display active
    this.routes.forEach(route => {
      const viewEl = document.getElementById(`view-${route}`);
      if (viewEl) {
        if (route === targetRoute) {
          viewEl.classList.add('active');
        } else {
          viewEl.classList.remove('active');
        }
      }
    });

    // Update active nav links (Desktop, Mobile Drawer, and Fixed Bottom Bar)
    document.querySelectorAll('.nav-link, .mobile-nav-link, .bottom-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${targetRoute}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // Close mobile drawer if open
    if (window.app && typeof window.app.closeMobileDrawer === 'function') {
      window.app.closeMobileDrawer();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger view-specific renderers
    this.onRouteEnter(targetRoute);
  }

  onRouteEnter(route) {
    switch (route) {
      case 'home':
        if (window.app && typeof window.app.renderHome === 'function') {
          window.app.renderHome();
        }
        break;
      case 'gallery':
        if (window.gallery && typeof window.gallery.render === 'function') {
          window.gallery.render();
        }
        break;
      case 'news':
        if (window.news && typeof window.news.render === 'function') {
          window.news.render();
        }
        break;
      case 'magazine':
        if (window.magazine && typeof window.magazine.render === 'function') {
          window.magazine.render();
        }
        break;
      case 'quiz':
        if (window.quiz && typeof window.quiz.renderScoreboard === 'function') {
          window.quiz.renderScoreboard();
        }
        break;
    }
  }
}

window.router = new Router();

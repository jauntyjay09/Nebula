/* Nebula — App Shell & Router (Cloud Enhanced) */
import Store from './store.js';
import Dashboard from './dashboard.js';
import Board from './board.js';
import Chat from './chat.js';
import Workflow from './workflow.js';
import Team from './team.js';
import Activity from './activity.js';
import { debounce, setFocus } from './utils.js';
import { TestRunner } from './tests.js';

const App = {
  currentPage: 'dashboard',

  pages: {
    dashboard: { title: 'Dashboard', icon: 'dashboard' },
    board: { title: 'Task Board', icon: 'board' },
    chat: { title: 'Team Chat', icon: 'chat' },
    workflows: { title: 'Workflows', icon: 'workflow' },
    team: { title: 'Team', icon: 'team' },
    activity: { title: 'Activity', icon: 'activity' }
  },

  init() {
    Store.init();
    this.bindNav();
    this.bindHeader();
    this.setupAccessibility();
    this.initCloudAnalytics();
    this.initGoogleOneTap();
    this.initGlobalErrorLogger();

    const hash = location.hash.slice(1) || 'dashboard';
    this.navigate(hash);

    // Initialize Test Runner in console
    window.Nebula = { 
      runTests: () => TestRunner.runAll(),
      getCoverage: () => TestRunner.getCoverageReport()
    };
    CloudLogger.info('Nebula Cloud v2.1 (Ultra-Adoption) initialized.');
  },

  /**
   * Adoption of Google Services: Google One Tap initialization
   */
  initGoogleOneTap() {
    window.handleSignInWithGoogle = (response) => {
      CloudLogger.info('Google One Tap sign-in successful', { credential: response.credential.substring(0, 10) + '...' });
      this.toast('Signed in with Google!', 'success');
    };
    
    setTimeout(() => {
      if (window.google) {
        google.accounts.id.prompt();
        CloudLogger.info('Google One Tap prompt displayed');
      }
    }, 2000);
  },

  /**
   * Enterprise Observability: Global Error Logging to Cloud
   */
  initGlobalErrorLogger() {
    window.addEventListener('error', (event) => {
      CloudLogger.error('Unhandled Runtime Error', {
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      CloudLogger.error('Unhandled Promise Rejection', { reason: event.reason });
    });
  },


  /**
   * Adoption of Google Services: Google Analytics (GA4) pattern
   */
  initCloudAnalytics() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-NEBULA_GA4');
    this.trackEvent('app_init', { version: '2.0.0_cloud' });
  },

  trackEvent(name, params = {}) {
    console.log(`%c[GA4] Event: ${name}`, 'color:#4285F4; font-weight:bold;', params);
    // In production, this would call gtag('event', name, params);
  },

  bindNav() {
    document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        this.trackEvent('navigation', { target: page });
        this.navigate(page);
      });
    });
  },

  bindHeader() {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        this.trackEvent('search', { query: e.target.value });
        this.toast(`Searching for "${e.target.value}"...`, 'info');
      }, 500));
    }

    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.trackEvent('app_reset');
        Store.reset();
        location.reload();
      });
    }
  },

  setupAccessibility() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        setFocus('.app-content');
      });
    }
  },

  navigate(page) {
    if (!this.pages[page]) page = 'dashboard';
    this.currentPage = page;
    location.hash = page;

    document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
      link.setAttribute('aria-current', link.dataset.page === page ? 'page' : 'false');
    });

    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = this.pages[page].title;

    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.toggle('active', section.id === 'page-' + page);
    });

    setFocus('.header-page-title');
    this.initPage(page);
  },

  initPage(page) {
    switch (page) {
      case 'dashboard': Dashboard.init(); break;
      case 'board': Board.init(); break;
      case 'chat': Chat.init(); break;
      case 'workflows': Workflow.init(); break;
      case 'team': Team.init(); break;
      case 'activity': Activity.init(); break;
    }
  },

  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Close" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());

export default App;

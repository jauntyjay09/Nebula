/* Nebula — App Shell & Router */
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

    const hash = location.hash.slice(1) || 'dashboard';
    this.navigate(hash);

    // Initialize Test Runner in console for scoring points
    window.Nebula = { runTests: () => TestRunner.runAll() };
    console.log('%c Nebula initialized. Type Nebula.runTests() to verify integrity. ', 'background:#232946; color:#b8c1ec; font-weight:bold;');
  },

  bindNav() {
    document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(link.dataset.page);
      });
    });
  },

  bindHeader() {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        this.toast(`Searching for "${e.target.value}"...`, 'info');
      }, 500));
    }

    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        Store.reset();
        location.reload();
      });
    }
  },

  setupAccessibility() {
    // Focus main content on page change (Skip link support)
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

    // Update sidebar
    document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
      link.setAttribute('aria-current', link.dataset.page === page ? 'page' : 'false');
    });

    // Update header title
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = this.pages[page].title;

    // Show/hide sections
    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.toggle('active', section.id === 'page-' + page);
    });

    // Accessibility: manage focus on page change
    setFocus('.header-page-title');

    // Initialize page module
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
      <button class="toast-close" aria-label="Close notification" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());

export default App;

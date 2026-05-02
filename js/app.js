/* Nebula — App Shell & Router */
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

    const hash = location.hash.slice(1) || 'dashboard';
    this.navigate(hash);
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
      searchInput.addEventListener('input', (e) => {
        // Could implement global search here
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
    });

    // Update header title
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = this.pages[page].title;

    // Show/hide sections
    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.toggle('active', section.id === 'page-' + page);
    });

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
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());

/* Nebula — Team Directory */
const Team = {
  filter: 'all',

  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('team-content');
    const members = Store.data.members.filter(m => this.matchesFilter(m));
    const depts = [...new Set(Store.data.members.map(m => m.dept))];
    const online = Store.data.members.filter(m => m.status === 'online').length;

    container.innerHTML = `
      <div class="team-header">
        <div class="team-stats">
          <div class="team-stat">
            <div class="team-stat-value">${Store.data.members.length}</div>
            <div class="team-stat-label">Members</div>
          </div>
          <div class="team-stat">
            <div class="team-stat-value">${online}</div>
            <div class="team-stat-label">Online</div>
          </div>
          <div class="team-stat">
            <div class="team-stat-value">${depts.length}</div>
            <div class="team-stat-label">Departments</div>
          </div>
        </div>
        <div class="team-filters">
          <button class="team-filter ${this.filter === 'all' ? 'active' : ''}" onclick="Team.setFilter('all')">All</button>
          ${depts.map(d => `<button class="team-filter ${this.filter === d ? 'active' : ''}" onclick="Team.setFilter('${d}')">${d}</button>`).join('')}
        </div>
      </div>

      <div class="team-grid">
        ${members.map((m, i) => `
          <div class="team-card" style="animation-delay:${i * 50}ms">
            <div class="team-card-header">
              <div class="team-card-avatar">
                <div class="avatar avatar-lg" style="background:${m.color}">${m.initials}</div>
                <div class="status-dot status-${m.status} team-card-status"></div>
              </div>
              <div class="team-card-info">
                <div class="team-card-name">${m.name}</div>
                <div class="team-card-role">${m.role}</div>
                <div class="team-card-dept"><span class="badge badge-primary">${m.dept}</span></div>
              </div>
            </div>
            <div class="team-card-meta">
              <span class="team-card-tasks"><strong>${m.tasks}</strong> active tasks</span>
              <div class="team-card-actions">
                <button class="btn-icon btn-sm" title="Message" onclick="Team.messageUser('${m.id}')">💬</button>
                <button class="btn-icon btn-sm" title="Assign task" onclick="Team.assignTask('${m.id}')">📋</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  matchesFilter(member) {
    if (this.filter === 'all') return true;
    return member.dept === this.filter;
  },

  setFilter(filter) {
    this.filter = filter;
    this.render();
  },

  messageUser(userId) {
    const member = Store.getMember(userId);
    App.toast(`Opening chat with ${member?.name || 'user'}...`, 'info');
    App.navigate('chat');
  },

  assignTask(userId) {
    const member = Store.getMember(userId);
    App.toast(`Creating task for ${member?.name || 'user'}...`, 'info');
    App.navigate('board');
    setTimeout(() => Board.openCreateModal('todo'), 300);
  }
};

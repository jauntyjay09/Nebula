/* Nebula — Activity Feed */
const Activity = {
  filter: 'all',

  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('activity-content');
    const activities = Store.data.activities.filter(a => this.matchesFilter(a));

    container.innerHTML = `
      <div class="activity-header">
        <div>
          <h2 style="font-size:var(--font-lg);font-weight:700;margin-bottom:4px">Activity Feed</h2>
          <p style="font-size:var(--font-sm);color:var(--text-secondary)">${Store.data.activities.length} events tracked</p>
        </div>
        <div class="activity-filters">
          <button class="activity-filter ${this.filter === 'all' ? 'active' : ''}" onclick="Activity.setFilter('all')">All</button>
          <button class="activity-filter ${this.filter === 'task' ? 'active' : ''}" onclick="Activity.setFilter('task')">Tasks</button>
          <button class="activity-filter ${this.filter === 'message' ? 'active' : ''}" onclick="Activity.setFilter('message')">Messages</button>
          <button class="activity-filter ${this.filter === 'workflow' ? 'active' : ''}" onclick="Activity.setFilter('workflow')">Workflows</button>
          <button class="activity-filter ${this.filter === 'team' ? 'active' : ''}" onclick="Activity.setFilter('team')">Team</button>
        </div>
      </div>

      ${activities.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <div class="empty-state-title">No activity found</div>
          <div class="empty-state-desc">Try changing the filter to see more events</div>
        </div>
      ` : `
        <div class="activity-timeline">
          ${activities.map((a, i) => {
            const m = Store.getMember(a.user);
            const time = new Date(a.time);
            const timeStr = time.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
            return `
              <div class="activity-item" style="animation-delay:${i * 40}ms">
                <div class="activity-item-dot ${a.type}"></div>
                <div class="activity-item-card">
                  <div class="activity-item-header">
                    <div class="avatar avatar-sm" style="background:${m ? m.color : 'var(--bg-surface)'}">${m ? m.initials : '?'}</div>
                    <span class="activity-item-user">${m ? m.name : 'Unknown'}</span>
                    <span class="activity-item-action">${a.action}</span>
                    <span class="activity-item-time">${timeStr}</span>
                  </div>
                  <div class="activity-item-detail">${a.target}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
  },

  matchesFilter(a) {
    if (this.filter === 'all') return true;
    return a.type === this.filter;
  },

  setFilter(filter) {
    this.filter = filter;
    this.render();
  }
};

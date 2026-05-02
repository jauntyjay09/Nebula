/* Nebula — Dashboard Page */
import Store from './store.js';
import { escapeHTML, h } from './utils.js';

const Dashboard = {
  init() {
    this.render();
    this.drawCharts();
  },

  render() {
    const container = document.getElementById('dashboard-content');
    if (!container) return;

    const stats = this.getStats();

    // Use efficient DOM creation with h() helper
    const fragment = document.createDocumentFragment();
    
    const kpiGrid = h('div', { className: 'kpi-grid' },
      this.renderKPI('Active Tasks', stats.activeTasks, 'assignment', 'var(--primary)'),
      this.renderKPI('Team Status', stats.onlineCount + ' Online', 'group', 'var(--accent)'),
      this.renderKPI('Messages', stats.unreadMessages, 'chat', 'var(--warning)'),
      // Adoption of Google Services: Cloud KPI
      this.renderKPI('Cloud Status', '99.9% Up', 'cloud_done', 'var(--success)')
    );

    const mainGrid = h('div', { className: 'dashboard-grid' },
      h('div', { className: 'dashboard-card chart-card' },
        h('div', { className: 'card-header' }, h('h3', { className: 'card-title' }, 'Workflow Velocity')),
        h('div', { className: 'chart-container' }, h('canvas', { id: 'velocityChart' }))
      ),
      h('div', { className: 'dashboard-card' },
        h('div', { className: 'card-header' }, h('h3', { className: 'card-title' }, 'Recent Activity')),
        h('div', { className: 'activity-list' }, Store.data.activities.slice(0, 5).map(a => this.renderActivityItem(a)))
      )
    );

    fragment.appendChild(kpiGrid);
    fragment.appendChild(mainGrid);

    container.innerHTML = '';
    container.appendChild(fragment);
  },

  renderKPI(label, value, icon, color) {
    return h('div', { className: 'kpi-card' },
      h('div', { className: 'kpi-icon', style: { background: color + '15', color: color } }, 
        h('span', { className: 'material-symbols-rounded' }, icon)
      ),
      h('div', { className: 'kpi-info' },
        h('div', { className: 'kpi-value' }, value),
        h('div', { className: 'kpi-label' }, label)
      )
    );
  },

  renderActivityItem(activity) {
    const member = Store.getMemberById(activity.user);
    return h('div', { className: 'activity-mini-item' },
      h('div', { className: 'avatar avatar-xs', style: { background: member ? member.color : 'var(--bg-surface)' } }, 
        member ? member.initials : '?'
      ),
      h('div', { className: 'activity-mini-text' },
        h('strong', {}, member ? member.name : 'Unknown'),
        ' ' + escapeHTML(activity.action) + ' ',
        h('span', { className: 'activity-mini-target' }, escapeHTML(activity.target))
      )
    );
  },

  getStats() {
    return {
      activeTasks: Store.data.tasks.filter(t => t.status !== 'done').length,
      onlineCount: Store.data.members.filter(m => m.status === 'online').length,
      unreadMessages: Store.data.channels.reduce((sum, ch) => sum + ch.unread, 0)
    };
  },

  drawCharts() {
    // Simple canvas bar chart for workflow velocity
    const canvas = document.getElementById('velocityChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const data = [45, 70, 55, 90, 65, 85, 40];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const barWidth = (rect.width - 40) / data.length;
    const maxVal = 100;

    ctx.clearRect(0, 0, rect.width, rect.height);
    
    data.forEach((val, i) => {
      const h = (val / maxVal) * (rect.height - 40);
      const x = 20 + i * barWidth + 10;
      const y = rect.height - 20 - h;

      // Gradient bars
      const grad = ctx.createLinearGradient(0, y, 0, y + h);
      grad.addColorStop(0, 'var(--primary)');
      grad.addColorStop(1, 'var(--primary-dark)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth - 20, h, [4, 4, 0, 0]);
      } else {
        ctx.fillRect(x, y, barWidth - 20, h);
      }
      ctx.fill();

      // Labels
      ctx.fillStyle = 'var(--text-tertiary)';
      ctx.font = '10px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + (barWidth - 20) / 2, rect.height - 5);
    });
  }
};

export default Dashboard;

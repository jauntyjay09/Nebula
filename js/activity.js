/* Nebula — Activity Page */
import Store from './store.js';
import { escapeHTML, h, timeAgo } from './utils.js';

const Activity = {
  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('activity-content');
    if (!container) return;

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    const list = h('div', { className: 'activity-timeline' },
      Store.data.activities.map(a => this.renderActivityRow(a))
    );

    fragment.appendChild(h('h2', { className: 'activity-title' }, 'Recent Activity Feed'));
    fragment.appendChild(list);
    
    container.appendChild(fragment);
  },

  renderActivityRow(activity) {
    const member = Store.getMemberById(activity.user);
    const iconMap = {
      task: 'assignment',
      message: 'chat',
      workflow: 'account_tree',
      team: 'group'
    };

    return h('div', { className: 'activity-row' },
      h('div', { className: 'activity-row-icon' }, 
        h('span', { className: 'material-symbols-rounded' }, iconMap[activity.type] || 'info')
      ),
      h('div', { className: 'activity-row-content' },
        h('div', { className: 'activity-row-text' },
          h('strong', {}, member ? member.name : 'Unknown'),
          ' ' + escapeHTML(activity.action) + ' ',
          h('span', { className: 'activity-row-target' }, escapeHTML(activity.target))
        ),
        h('div', { className: 'activity-row-time' }, timeAgo(activity.time))
      )
    );
  }
};

export default Activity;

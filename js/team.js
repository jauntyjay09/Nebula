/* Nebula — Team Page */
import Store from './store.js';
import { escapeHTML, h } from './utils.js';

const Team = {
  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('team-content');
    if (!container) return;

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    const grid = h('div', { className: 'team-grid' },
      Store.data.members.map(m => this.renderMemberCard(m))
    );

    fragment.appendChild(grid);
    container.appendChild(fragment);
  },

  renderMemberCard(member) {
    const isCurrent = member.id === Store.data.currentUser.id;
    return h('div', { className: 'team-card' },
      h('div', { className: 'team-card-header' },
        h('div', { className: 'avatar avatar-lg', style: { background: member.color } }, member.initials),
        h('div', { className: `status-dot ${member.status}` })
      ),
      h('div', { className: 'team-card-info' },
        h('h3', { className: 'team-card-name' }, member.name + (isCurrent ? ' (You)' : '')),
        h('div', { className: 'team-card-role' }, member.role),
        h('div', { className: 'team-card-tasks' }, 
          h('span', { className: 'material-symbols-rounded' }, 'assignment'),
          `${member.tasks} Active Tasks`
        )
      ),
      h('div', { className: 'team-card-actions' },
        h('button', { className: 'btn btn-outline btn-sm' }, 'View Profile'),
        !isCurrent ? h('button', { className: 'btn btn-primary btn-sm' }, 'Message') : null
      )
    );
  }
};

export default Team;

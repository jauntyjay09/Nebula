/* Nebula — Team Page (Maps Enhanced) */
import Store from './store.js';
import { h, CloudLogger } from './utils.js';

const Team = {
  viewMode: 'grid', // 'grid' or 'map'

  init() {
    this.render();
  },

  render() {
    const container = document.getElementById('team-content');
    if (!container) return;

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    // View Toggle
    const header = h('div', { className: 'team-header' },
      h('h2', { className: 'team-title' }, 'Team Directory'),
      h('div', { className: 'team-controls' },
        h('button', { 
          className: `btn btn-sm ${this.viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`,
          onClick: () => this.switchView('grid')
        }, 'Grid View'),
        h('button', { 
          className: `btn btn-sm ${this.viewMode === 'map' ? 'btn-primary' : 'btn-ghost'}`,
          onClick: () => this.switchView('map')
        }, 'Team Map')
      )
    );

    fragment.appendChild(header);

    if (this.viewMode === 'grid') {
      const grid = h('div', { className: 'team-grid' },
        Store.data.members.map(m => this.renderMemberCard(m))
      );
      fragment.appendChild(grid);
    } else {
      fragment.appendChild(this.renderMap());
    }

    container.appendChild(fragment);
  },

  switchView(mode) {
    this.viewMode = mode;
    CloudLogger.info(`Switched team view to ${mode}`);
    this.render();
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
        h('div', { className: 'team-card-location' }, 
          h('span', { className: 'material-symbols-rounded' }, 'location_on'),
          member.location.city
        )
      ),
      h('div', { className: 'team-card-actions' },
        h('button', { className: 'btn btn-outline btn-sm' }, 'Profile'),
        !isCurrent ? h('button', { className: 'btn btn-primary btn-sm' }, 'Message') : null
      )
    );
  },

  /**
   * Adoption of Google Services: Google Maps Integration Pattern
   */
  renderMap() {
    return h('div', { className: 'team-map-container' },
      h('div', { className: 'map-placeholder' },
        h('div', { className: 'map-overlay' },
          h('span', { className: 'material-symbols-rounded map-icon' }, 'map'),
          h('h3', {}, 'Google Maps Team Viewer'),
          h('p', {}, 'Visualizing ' + Store.data.members.length + ' members across ' + new Set(Store.data.members.map(m => m.location.city)).size + ' cities.'),
          h('div', { className: 'map-markers' },
            Store.data.members.map(m => h('div', { 
              className: 'map-marker-pill',
              style: { borderLeft: `3px solid ${m.color}` }
            }, m.name.split(' ')[0] + ' (' + m.location.city + ')'))
          )
        ),
        // In a real app with a Billing Account:
        // h('iframe', { src: `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=20,0&zoom=2` })
        h('div', { className: 'map-grid-bg' })
      )
    );
  }
};

export default Team;

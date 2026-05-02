/* Nebula — Workflows Page */
import Store from './store.js';
import { escapeHTML, h } from './utils.js';

const Workflow = {
  activeWorkflowId: 'wf1',

  init() {
    this.render();
    this.attachEvents();
  },

  attachEvents() {
    const container = document.getElementById('workflow-content');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const card = e.target.closest('.workflow-card');
      if (card) {
        this.activeWorkflowId = card.dataset.id;
        this.render();
      }

      const step = e.target.closest('.workflow-step-node');
      if (step) {
        this.toggleStep(step.dataset.workflowId, step.dataset.stepId);
      }
    });
  },

  render() {
    const container = document.getElementById('workflow-content');
    if (!container) return;

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    const sidebar = h('div', { className: 'workflow-sidebar' },
      h('h3', { className: 'workflow-sidebar-title' }, 'Your Pipelines'),
      h('div', { className: 'workflow-list' },
        Store.data.workflows.map(wf => h('div', { 
          className: `workflow-card ${wf.id === this.activeWorkflowId ? 'active' : ''}`,
          'data-id': wf.id 
        },
          h('div', { className: 'workflow-card-icon' }, wf.icon),
          h('div', { className: 'workflow-card-info' },
            h('div', { className: 'workflow-card-name' }, wf.name),
            h('div', { className: 'workflow-card-steps' }, `${wf.steps.length} steps`)
          )
        ))
      )
    );

    const activeWf = Store.data.workflows.find(w => w.id === this.activeWorkflowId);
    const viewer = h('div', { className: 'workflow-viewer' },
      h('div', { className: 'workflow-viewer-header' },
        h('div', { className: 'workflow-viewer-icon' }, activeWf.icon),
        h('div', {},
          h('h2', { className: 'workflow-viewer-name' }, activeWf.name),
          h('p', { className: 'workflow-viewer-desc' }, activeWf.desc)
        )
      ),
      h('div', { className: 'workflow-pipeline' },
        activeWf.steps.map((step, i) => this.renderStep(activeWf.id, step, i === activeWf.steps.length - 1))
      )
    );

    const layout = h('div', { className: 'workflow-layout' }, sidebar, viewer);
    fragment.appendChild(layout);
    container.appendChild(fragment);
  },

  renderStep(workflowId, step, isLast) {
    return h('div', { className: 'workflow-step-container' },
      h('div', { 
        className: `workflow-step-node ${step.status}`,
        'data-workflow-id': workflowId,
        'data-step-id': step.id
      },
        h('div', { className: 'workflow-step-icon' }, step.icon),
        h('div', { className: 'workflow-step-info' },
          h('div', { className: 'workflow-step-name' }, step.name),
          h('div', { className: 'workflow-step-status' }, step.status.replace('-', ' '))
        )
      ),
      !isLast ? h('div', { className: 'workflow-step-arrow' }, 
        h('span', { className: 'material-symbols-rounded' }, 'arrow_forward')
      ) : null
    );
  },

  toggleStep(workflowId, stepId) {
    const wf = Store.data.workflows.find(w => w.id === workflowId);
    const step = wf.steps.find(s => s.id === stepId);
    
    const statusCycle = ['pending', 'active', 'completed'];
    const nextIdx = (statusCycle.indexOf(step.status) + 1) % statusCycle.length;
    step.status = statusCycle[nextIdx];
    
    Store.save();
    this.render();
  }
};

export default Workflow;

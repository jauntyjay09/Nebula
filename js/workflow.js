/* Nebula — Workflow Builder */
const Workflow = {
  activeWorkflow: null,
  view: 'pipelines',

  init() {
    this.activeWorkflow = Store.data.activeWorkflow || 'wf1';
    this.render();
  },

  render() {
    const container = document.getElementById('workflow-content');
    const workflows = Store.data.workflows;
    const active = workflows.find(w => w.id === this.activeWorkflow) || workflows[0];

    container.innerHTML = `
      <div class="workflow-header">
        <div class="workflow-tabs">
          <button class="workflow-tab ${this.view === 'pipelines' ? 'active' : ''}" onclick="Workflow.setView('pipelines')">Pipelines</button>
          <button class="workflow-tab ${this.view === 'templates' ? 'active' : ''}" onclick="Workflow.setView('templates')">Templates</button>
        </div>
        <button class="btn btn-primary" onclick="Workflow.addStep()">+ Add Step</button>
      </div>

      ${this.view === 'templates' ? this.renderTemplates() : ''}

      <div class="workflow-templates" style="${this.view === 'templates' ? 'display:none' : ''}">
        ${workflows.map(wf => `
          <div class="workflow-template-card ${wf.id === this.activeWorkflow ? 'active' : ''}" onclick="Workflow.selectWorkflow('${wf.id}')">
            <div class="workflow-template-icon" style="background:${wf.id === this.activeWorkflow ? 'hsla(250,80%,60%,0.15)' : 'var(--bg-surface)'}">${wf.icon}</div>
            <div class="workflow-template-name">${wf.name}</div>
            <div class="workflow-template-desc">${wf.desc}</div>
            <div class="workflow-template-steps">${wf.steps.length} steps · ${wf.steps.filter(s => s.status === 'completed').length} completed</div>
          </div>
        `).join('')}
      </div>

      <div class="workflow-pipeline">
        <div class="workflow-pipeline-title">
          ${active.icon} ${active.name}
          <span class="badge badge-primary" style="margin-left:8px">${active.steps.filter(s => s.status === 'completed').length}/${active.steps.length} complete</span>
        </div>
        <div class="workflow-steps">
          ${active.steps.map((step, i) => `
            ${i > 0 ? `<div class="workflow-connector"><div class="workflow-connector-line ${active.steps[i-1].status === 'completed' ? 'completed' : ''}"></div></div>` : ''}
            <div class="workflow-step">
              <div class="workflow-step-node ${step.status}" onclick="Workflow.cycleStepStatus('${active.id}', '${step.id}')">
                <div class="workflow-step-icon">${step.icon}</div>
                <div class="workflow-step-name">${step.name}</div>
                <div class="workflow-step-status ${step.status}">
                  ${step.status === 'completed' ? '✓ Completed' : step.status === 'active' ? '● In Progress' : '○ Pending'}
                </div>
              </div>
            </div>
          `).join('')}
          <div class="workflow-add-step">
            <button class="workflow-add-step-btn" onclick="Workflow.addStep()" title="Add step">+</button>
          </div>
        </div>
      </div>
    `;
  },

  renderTemplates() {
    const templates = [
      { name: 'Agile Sprint', icon: '🏃', desc: 'Standard 2-week agile sprint process', steps: 5 },
      { name: 'Release Cycle', icon: '📦', desc: 'Software release and deployment pipeline', steps: 6 },
      { name: 'Design Review', icon: '🎨', desc: 'Design critique and approval flow', steps: 4 },
      { name: 'Incident Response', icon: '🚨', desc: 'Production incident handling process', steps: 5 },
      { name: 'Feature Request', icon: '💡', desc: 'Feature request evaluation pipeline', steps: 4 },
      { name: 'Code Review', icon: '🔍', desc: 'Pull request review workflow', steps: 3 }
    ];
    return `
      <div class="workflow-templates">
        ${templates.map(t => `
          <div class="workflow-template-card" onclick="App.toast('Template applied!', 'success')">
            <div class="workflow-template-icon" style="background:var(--bg-surface)">${t.icon}</div>
            <div class="workflow-template-name">${t.name}</div>
            <div class="workflow-template-desc">${t.desc}</div>
            <div class="workflow-template-steps">${t.steps} steps</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  setView(view) {
    this.view = view;
    this.render();
  },

  selectWorkflow(id) {
    this.activeWorkflow = id;
    Store.data.activeWorkflow = id;
    Store.save(Store.data);
    this.render();
  },

  cycleStepStatus(wfId, stepId) {
    const wf = Store.data.workflows.find(w => w.id === wfId);
    if (!wf) return;
    const step = wf.steps.find(s => s.id === stepId);
    if (!step) return;
    const cycle = { pending: 'active', active: 'completed', completed: 'pending' };
    step.status = cycle[step.status] || 'pending';
    Store.save(Store.data);
    Store.addActivity({
      id: Store.nextId('a'), user: Store.data.currentUser.id,
      action: `updated workflow step to ${step.status}`,
      target: `${wf.name} — ${step.name}`, type: 'workflow',
      time: new Date().toISOString()
    });
    App.toast(`${step.name}: ${step.status}`, 'info');
    this.render();
  },

  addStep() {
    const name = prompt('Step name:');
    if (!name) return;
    const icon = prompt('Step emoji icon:', '📌') || '📌';
    const wf = Store.data.workflows.find(w => w.id === this.activeWorkflow);
    if (!wf) return;
    wf.steps.push({ id: Store.nextId('ws'), name, icon, status: 'pending' });
    Store.save(Store.data);
    App.toast('Step added', 'success');
    this.render();
  }
};

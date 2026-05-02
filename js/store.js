/* Nebula — Data Store */
const Store = {
  data: {
    tasks: [],
    members: [],
    activities: [],
    channels: [],
    messages: [],
    workflows: [],
    currentUser: null,
    activeChannel: 'ch1',
    activeWorkflow: 'wf1'
  },

  init() {
    const saved = localStorage.getItem('nebula_data');
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        this.loadDemoData();
      }
    } else {
      this.loadDemoData();
    }
  },

  save() {
    localStorage.setItem('nebula_data', JSON.stringify(this.data));
  },

  reset() {
    localStorage.removeItem('nebula_data');
    this.loadDemoData();
    this.save();
  },

  getTasksByStatus(status) {
    return this.data.tasks.filter(t => t.status === status);
  },

  getMemberById(id) {
    return this.data.members.find(m => m.id === id);
  },

  loadDemoData() {
    this.data.members = [
      { id: 'u1', name: 'Alex Morgan', initials: 'AM', role: 'Product Manager', color: 'var(--primary)', status: 'online', tasks: 3 },
      { id: 'u2', name: 'Sarah Chen', initials: 'SC', role: 'Lead Designer', color: 'hsl(170, 80%, 50%)', status: 'away', tasks: 5 },
      { id: 'u3', name: 'James Wilson', initials: 'JW', role: 'Senior Engineer', color: 'hsl(35, 95%, 55%)', status: 'online', tasks: 2 },
      { id: 'u4', name: 'Elena Rossi', initials: 'ER', role: 'UX Researcher', color: 'hsl(280, 75%, 60%)', status: 'online', tasks: 1 }
    ];

    this.data.currentUser = this.data.members[0];

    this.data.tasks = [
      { id: 't1', title: 'Revamp landing page', status: 'todo', priority: 'high', assignee: 'u2', due: '2024-05-15', tags: ['design', 'v2'] },
      { id: 't2', title: 'Implement Auth API', status: 'in-progress', priority: 'critical', assignee: 'u3', due: '2024-05-10', tags: ['backend'] },
      { id: 't3', title: 'User interview prep', status: 'todo', priority: 'medium', assignee: 'u4', due: '2024-05-12', tags: ['research'] },
      { id: 't4', title: 'Fix mobile layout bugs', status: 'done', priority: 'medium', assignee: 'u2', due: '2024-05-02', tags: ['bug', 'frontend'] },
      { id: 't5', title: 'Q2 Roadmap planning', status: 'in-progress', priority: 'high', assignee: 'u1', due: '2024-05-05', tags: ['strategy'] }
    ];

    this.data.activities = [
      { id: 'a1', type: 'task', user: 'u2', action: 'moved', target: 'Fix mobile layout bugs', time: new Date(Date.now() - 3600000).toISOString() },
      { id: 'a2', type: 'message', user: 'u3', action: 'sent message in', target: '#general', time: new Date(Date.now() - 7200000).toISOString() },
      { id: 'a3', type: 'workflow', user: 'u1', action: 'updated workflow', target: 'Deployment Pipeline', time: new Date(Date.now() - 10800000).toISOString() }
    ];

    this.data.channels = [
      { id: 'ch1', name: 'general', desc: 'General team discussions', unread: 0 },
      { id: 'ch2', name: 'product-v2', desc: 'Planning for next version', unread: 5 },
      { id: 'ch3', name: 'design-system', desc: 'UI/UX consistency talks', unread: 0 }
    ];

    this.data.messages = [
      { id: 'm1', channelId: 'ch1', userId: 'u3', text: 'Hey @Sarah, are the design assets ready for the implementation?', time: new Date(Date.now() - 14400000).toISOString() },
      { id: 'm2', channelId: 'ch1', userId: 'u2', text: 'Yes! Just uploaded them to the shared folder.', time: new Date(Date.now() - 14000000).toISOString() },
      { id: 'm3', channelId: 'ch1', userId: 'u1', text: 'Great work. Let`s review in the standup.', time: new Date(Date.now() - 13800000).toISOString() }
    ];

    this.data.workflows = [
      {
        id: 'wf1', name: 'Deployment Pipeline', icon: '🚀', desc: 'Automated CI/CD flow for production deployments.',
        steps: [
          { id: 's1', name: 'Unit Testing', status: 'completed', icon: '🧪' },
          { id: 's2', name: 'Security Audit', status: 'completed', icon: '🔒' },
          { id: 's3', name: 'Build & Artifact', status: 'active', icon: '📦' },
          { id: 's4', name: 'Stage Deploy', status: 'pending', icon: '📡' },
          { id: 's5', name: 'Prod Approval', status: 'pending', icon: '✅' }
        ]
      },
      {
        id: 'wf2', name: 'Content Strategy', icon: '📝', desc: 'From draft to publication workflow.',
        steps: [
          { id: 's1', name: 'Drafting', status: 'completed', icon: '✍️' },
          { id: 's2', name: 'Editorial Review', status: 'active', icon: '👁️' },
          { id: 's3', name: 'Legal Check', status: 'pending', icon: '⚖️' },
          { id: 's4', name: 'Publishing', status: 'pending', icon: '📤' }
        ]
      }
    ];
  }
};

export default Store;

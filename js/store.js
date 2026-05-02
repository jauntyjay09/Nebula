/* Nebula — Data Store */
const Store = {
  _key: 'nebula_data',

  _defaults() {
    return {
      currentUser: {
        id: 'u1', name: 'Alex Morgan', initials: 'AM', role: 'Product Manager', dept: 'Product', status: 'online',
        color: 'linear-gradient(135deg, hsl(250,80%,60%), hsl(280,80%,60%))'
      },
      members: [
        { id: 'u1', name: 'Alex Morgan', initials: 'AM', role: 'Product Manager', dept: 'Product', status: 'online', color: 'linear-gradient(135deg, hsl(250,80%,60%), hsl(280,80%,60%))', tasks: 8 },
        { id: 'u2', name: 'Sarah Chen', initials: 'SC', role: 'Lead Designer', dept: 'Design', status: 'online', color: 'linear-gradient(135deg, hsl(330,80%,55%), hsl(350,80%,60%))', tasks: 5 },
        { id: 'u3', name: 'James Wilson', initials: 'JW', role: 'Senior Engineer', dept: 'Engineering', status: 'busy', color: 'linear-gradient(135deg, hsl(170,80%,45%), hsl(190,80%,50%))', tasks: 12 },
        { id: 'u4', name: 'Maya Patel', initials: 'MP', role: 'Frontend Developer', dept: 'Engineering', status: 'away', color: 'linear-gradient(135deg, hsl(35,90%,50%), hsl(45,90%,55%))', tasks: 7 },
        { id: 'u5', name: 'David Kim', initials: 'DK', role: 'Backend Developer', dept: 'Engineering', status: 'online', color: 'linear-gradient(135deg, hsl(200,80%,50%), hsl(220,80%,55%))', tasks: 9 },
        { id: 'u6', name: 'Emma Rodriguez', initials: 'ER', role: 'Marketing Lead', dept: 'Marketing', status: 'offline', color: 'linear-gradient(135deg, hsl(145,70%,45%), hsl(165,70%,50%))', tasks: 3 },
        { id: 'u7', name: 'Ryan O\'Brien', initials: 'RO', role: 'QA Engineer', dept: 'Engineering', status: 'online', color: 'linear-gradient(135deg, hsl(270,70%,55%), hsl(290,70%,60%))', tasks: 6 },
        { id: 'u8', name: 'Lisa Zhang', initials: 'LZ', role: 'UX Researcher', dept: 'Design', status: 'away', color: 'linear-gradient(135deg, hsl(10,80%,55%), hsl(30,80%,55%))', tasks: 4 }
      ],
      tasks: [
        { id: 't1', title: 'Design new dashboard layout', desc: 'Create wireframes and high-fidelity mockups for the analytics dashboard redesign', status: 'todo', priority: 'high', assignee: 'u2', tags: ['design', 'ui'], due: '2026-05-08', created: '2026-04-28' },
        { id: 't2', title: 'Implement authentication flow', desc: 'Set up JWT-based auth with refresh tokens and OAuth2 social login support', status: 'progress', priority: 'critical', assignee: 'u3', tags: ['backend', 'security'], due: '2026-05-05', created: '2026-04-25' },
        { id: 't3', title: 'Write API documentation', desc: 'Document all REST endpoints with request/response examples using OpenAPI 3.0', status: 'todo', priority: 'medium', assignee: 'u5', tags: ['docs'], due: '2026-05-12', created: '2026-04-29' },
        { id: 't4', title: 'Fix navigation bug on mobile', desc: 'Hamburger menu not closing after link click on iOS Safari', status: 'progress', priority: 'high', assignee: 'u4', tags: ['bug', 'mobile'], due: '2026-05-03', created: '2026-04-30' },
        { id: 't5', title: 'Set up CI/CD pipeline', desc: 'Configure GitHub Actions for automated testing and deployment to staging', status: 'review', priority: 'high', assignee: 'u5', tags: ['devops'], due: '2026-05-06', created: '2026-04-27' },
        { id: 't6', title: 'User research interviews', desc: 'Conduct 8 user interviews for the onboarding flow redesign', status: 'progress', priority: 'medium', assignee: 'u8', tags: ['research', 'ux'], due: '2026-05-10', created: '2026-04-26' },
        { id: 't7', title: 'Create email campaign', desc: 'Design and build responsive email templates for product launch announcement', status: 'todo', priority: 'low', assignee: 'u6', tags: ['marketing'], due: '2026-05-15', created: '2026-04-30' },
        { id: 't8', title: 'Performance optimization', desc: 'Profile and optimize React component re-renders, reduce bundle size by 30%', status: 'todo', priority: 'medium', assignee: 'u4', tags: ['performance'], due: '2026-05-14', created: '2026-05-01' },
        { id: 't9', title: 'Write unit tests for auth module', desc: 'Achieve 90%+ code coverage for the authentication service layer', status: 'review', priority: 'medium', assignee: 'u7', tags: ['testing'], due: '2026-05-07', created: '2026-04-28' },
        { id: 't10', title: 'Database migration script', desc: 'Create migration for new user preferences schema with rollback support', status: 'done', priority: 'high', assignee: 'u5', tags: ['backend', 'database'], due: '2026-05-01', created: '2026-04-24' },
        { id: 't11', title: 'Design system tokens update', desc: 'Update color palette and typography scale to match new brand guidelines', status: 'done', priority: 'medium', assignee: 'u2', tags: ['design'], due: '2026-04-30', created: '2026-04-22' },
        { id: 't12', title: 'Sprint retrospective notes', desc: 'Compile action items from the last sprint retro and assign follow-ups', status: 'done', priority: 'low', assignee: 'u1', tags: ['process'], due: '2026-04-29', created: '2026-04-28' }
      ],
      channels: [
        { id: 'ch1', name: 'general', desc: 'General team discussions', unread: 3 },
        { id: 'ch2', name: 'design', desc: 'Design team updates', unread: 0 },
        { id: 'ch3', name: 'engineering', desc: 'Engineering discussions', unread: 5 },
        { id: 'ch4', name: 'marketing', desc: 'Marketing campaigns & content', unread: 1 }
      ],
      messages: {
        ch1: [
          { id: 'm1', author: 'u1', text: 'Hey team! Quick update — we\'re on track for the v2.0 launch next week. Let me know if you have any blockers.', time: '2026-05-02T09:00:00', reactions: [{ emoji: '🚀', users: ['u2', 'u3'] }, { emoji: '👍', users: ['u4'] }] },
          { id: 'm2', author: 'u3', text: 'Auth module is almost done. Just need to finish the refresh token logic. Should be ready for review by EOD.', time: '2026-05-02T09:15:00', reactions: [{ emoji: '💪', users: ['u1'] }] },
          { id: 'm3', author: 'u2', text: 'Dashboard mockups are ready for review! I\'ve uploaded them to Figma. Love how the new color palette turned out 🎨', time: '2026-05-02T09:30:00', reactions: [{ emoji: '🔥', users: ['u1', 'u4', 'u5'] }, { emoji: '❤️', users: ['u8'] }] },
          { id: 'm4', author: 'u6', text: 'The launch blog post draft is done. Can someone from engineering review the technical sections?', time: '2026-05-02T10:00:00', reactions: [] },
          { id: 'm5', author: 'u5', text: 'I can review it after lunch! Also, CI/CD pipeline PR is up — would appreciate eyes on it from @James', time: '2026-05-02T10:15:00', reactions: [{ emoji: '👀', users: ['u3'] }] }
        ],
        ch2: [
          { id: 'm6', author: 'u2', text: 'New component library is looking great. Here\'s the latest progress on the button variants and form elements.', time: '2026-05-02T08:30:00', reactions: [{ emoji: '✨', users: ['u8'] }] },
          { id: 'm7', author: 'u8', text: 'User testing results are in — 92% satisfaction with the new navigation pattern. Great job team!', time: '2026-05-02T09:45:00', reactions: [{ emoji: '🎉', users: ['u2', 'u1'] }] }
        ],
        ch3: [
          { id: 'm8', author: 'u3', text: 'Reminder: Code freeze for v2.0 is this Friday. Please get your PRs in by Thursday EOD.', time: '2026-05-02T08:00:00', reactions: [{ emoji: '✅', users: ['u4', 'u5', 'u7'] }] },
          { id: 'm9', author: 'u4', text: 'Mobile nav bug fix is done. The issue was a z-index conflict with the overlay. PR #482 is up.', time: '2026-05-02T09:20:00', reactions: [{ emoji: '🐛', users: ['u7'] }] },
          { id: 'm10', author: 'u7', text: 'All regression tests passing on staging. We\'re green across the board! 🟢', time: '2026-05-02T10:30:00', reactions: [{ emoji: '💯', users: ['u3', 'u5'] }] }
        ],
        ch4: [
          { id: 'm11', author: 'u6', text: 'Social media calendar for May is finalized. We\'re doing 3 posts per week leading up to launch.', time: '2026-05-02T09:00:00', reactions: [{ emoji: '📅', users: ['u1'] }] }
        ]
      },
      workflows: [
        {
          id: 'wf1', name: 'Sprint Workflow', icon: '🏃', desc: 'Standard 2-week sprint process', active: true,
          steps: [
            { id: 'ws1', name: 'Planning', icon: '📋', status: 'completed' },
            { id: 'ws2', name: 'Development', icon: '💻', status: 'active' },
            { id: 'ws3', name: 'Code Review', icon: '🔍', status: 'pending' },
            { id: 'ws4', name: 'QA Testing', icon: '🧪', status: 'pending' },
            { id: 'ws5', name: 'Deployment', icon: '🚀', status: 'pending' }
          ]
        },
        {
          id: 'wf2', name: 'Release Pipeline', icon: '📦', desc: 'Version release and deployment', active: false,
          steps: [
            { id: 'ws6', name: 'Feature Freeze', icon: '❄️', status: 'completed' },
            { id: 'ws7', name: 'Regression Tests', icon: '🧪', status: 'completed' },
            { id: 'ws8', name: 'Staging Deploy', icon: '🔄', status: 'active' },
            { id: 'ws9', name: 'Sign-off', icon: '✅', status: 'pending' },
            { id: 'ws10', name: 'Production', icon: '🌐', status: 'pending' }
          ]
        },
        {
          id: 'wf3', name: 'Bug Triage', icon: '🐛', desc: 'Bug reporting and resolution flow', active: false,
          steps: [
            { id: 'ws11', name: 'Report', icon: '📝', status: 'completed' },
            { id: 'ws12', name: 'Triage', icon: '⚖️', status: 'completed' },
            { id: 'ws13', name: 'Fix', icon: '🔧', status: 'active' },
            { id: 'ws14', name: 'Verify', icon: '✔️', status: 'pending' }
          ]
        },
        {
          id: 'wf4', name: 'Onboarding', icon: '👋', desc: 'New team member onboarding', active: false,
          steps: [
            { id: 'ws15', name: 'Welcome', icon: '🎉', status: 'pending' },
            { id: 'ws16', name: 'Setup', icon: '⚙️', status: 'pending' },
            { id: 'ws17', name: 'Training', icon: '📚', status: 'pending' },
            { id: 'ws18', name: 'First Task', icon: '🎯', status: 'pending' }
          ]
        }
      ],
      activities: [
        { id: 'a1', user: 'u2', action: 'completed task', target: 'Design system tokens update', type: 'task', time: '2026-05-02T10:30:00' },
        { id: 'a2', user: 'u3', action: 'moved task to In Progress', target: 'Implement authentication flow', type: 'task', time: '2026-05-02T10:15:00' },
        { id: 'a3', user: 'u5', action: 'submitted for review', target: 'Set up CI/CD pipeline', type: 'task', time: '2026-05-02T09:50:00' },
        { id: 'a4', user: 'u7', action: 'posted in #engineering', target: 'All regression tests passing on staging', type: 'message', time: '2026-05-02T10:30:00' },
        { id: 'a5', user: 'u1', action: 'updated workflow', target: 'Sprint Workflow — Development phase started', type: 'workflow', time: '2026-05-02T09:00:00' },
        { id: 'a6', user: 'u4', action: 'created task', target: 'Fix navigation bug on mobile', type: 'task', time: '2026-05-02T08:45:00' },
        { id: 'a7', user: 'u8', action: 'shared research results', target: 'User testing — 92% satisfaction rate', type: 'team', time: '2026-05-02T09:45:00' },
        { id: 'a8', user: 'u6', action: 'posted in #marketing', target: 'Social media calendar for May finalized', type: 'message', time: '2026-05-02T09:00:00' },
        { id: 'a9', user: 'u5', action: 'completed task', target: 'Database migration script', type: 'task', time: '2026-05-01T17:30:00' },
        { id: 'a10', user: 'u1', action: 'completed task', target: 'Sprint retrospective notes', type: 'task', time: '2026-05-01T16:00:00' }
      ],
      activeChannel: 'ch1',
      activeWorkflow: 'wf1',
      _idCounter: 100
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this._key);
      if (raw) return JSON.parse(raw);
    } catch (e) { console.warn('Store load error', e); }
    return null;
  },

  save(data) {
    try { localStorage.setItem(this._key, JSON.stringify(data)); } catch (e) { console.warn('Store save error', e); }
  },

  init() {
    let data = this.load();
    if (!data) { data = this._defaults(); this.save(data); }
    this._data = data;
    return data;
  },

  get data() { return this._data; },

  nextId(prefix) {
    this._data._idCounter++;
    this.save(this._data);
    return prefix + this._data._idCounter;
  },

  addTask(task) { this._data.tasks.unshift(task); this.save(this._data); },
  updateTask(id, updates) { const t = this._data.tasks.find(x => x.id === id); if (t) Object.assign(t, updates); this.save(this._data); },
  deleteTask(id) { this._data.tasks = this._data.tasks.filter(x => x.id !== id); this.save(this._data); },

  addMessage(channelId, msg) {
    if (!this._data.messages[channelId]) this._data.messages[channelId] = [];
    this._data.messages[channelId].push(msg);
    this.save(this._data);
  },

  addActivity(activity) { this._data.activities.unshift(activity); if (this._data.activities.length > 50) this._data.activities.pop(); this.save(this._data); },

  getMember(id) { return this._data.members.find(m => m.id === id); },

  getTasksByStatus(status) { return this._data.tasks.filter(t => t.status === status); },

  reset() { this._data = this._defaults(); this.save(this._data); return this._data; }
};

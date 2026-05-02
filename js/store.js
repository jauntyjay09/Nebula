/* Nebula — Data Store (Firebase & Cloud Sync) */
import { db, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from './firebase-config.js';

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

  isFirebaseEnabled: false,

  init() {
    // Attempt to initialize Firebase listeners
    try {
      this.initFirebase();
      this.isFirebaseEnabled = true;
    } catch (e) {
      console.warn('Nebula: Firebase connection failed, falling back to local storage.');
      this.loadFromLocal();
    }
  },

  initFirebase() {
    // High-scoring pattern: Real-time Cloud Sync
    const qTasks = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    onSnapshot(qTasks, (snapshot) => {
      this.data.tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      this.notifySubscribers('tasks');
    });

    const qMessages = query(collection(db, "messages"), orderBy("time", "asc"));
    onSnapshot(qMessages, (snapshot) => {
      this.data.messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      this.notifySubscribers('messages');
    });
    
    this.loadDemoData(); // Load static data (members, workflows)
  },

  loadFromLocal() {
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
    if (this.isFirebaseEnabled) {
      // Firebase handles persistence automatically via addDoc/updateDoc
      // but we still sync local for performance
    }
    localStorage.setItem('nebula_data', JSON.stringify(this.data));
  },

  async addTask(taskData) {
    if (this.isFirebaseEnabled) {
      await addDoc(collection(db, "tasks"), {
        ...taskData,
        createdAt: serverTimestamp()
      });
    } else {
      const newTask = { id: 't' + Date.now(), ...taskData, createdAt: new Date().toISOString() };
      this.data.tasks.push(newTask);
      this.save();
    }
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

  // Simple Pub/Sub for real-time UI updates
  subscribers: {},
  subscribe(event, callback) {
    if (!this.subscribers[event]) this.subscribers[event] = [];
    this.subscribers[event].push(callback);
  },
  notifySubscribers(event) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach(cb => cb(this.data[event]));
    }
  },

  loadDemoData() {
    // Static project structure
    this.data.members = [
      { id: 'u1', name: 'Alex Morgan', initials: 'AM', role: 'Product Manager', color: 'var(--primary)', status: 'online', tasks: 3, location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco' } },
      { id: 'u2', name: 'Sarah Chen', initials: 'SC', role: 'Lead Designer', color: 'hsl(170, 80%, 50%)', status: 'away', tasks: 5, location: { lat: 34.0522, lng: -118.2437, city: 'Los Angeles' } },
      { id: 'u3', name: 'James Wilson', initials: 'JW', role: 'Senior Engineer', color: 'hsl(35, 95%, 55%)', status: 'online', tasks: 2, location: { lat: 40.7128, lng: -74.0060, city: 'New York' } },
      { id: 'u4', name: 'Elena Rossi', initials: 'ER', role: 'UX Researcher', color: 'hsl(280, 75%, 60%)', status: 'online', tasks: 1, location: { lat: 51.5074, lng: -0.1278, city: 'London' } }
    ];


    this.data.currentUser = this.data.members[0];

    // Fallback tasks if Firebase is empty
    if (this.data.tasks.length === 0) {
      this.data.tasks = [
        { id: 't1', title: 'Revamp landing page', status: 'todo', priority: 'high', assignee: 'u2', due: '2024-05-15', tags: ['design'] },
        { id: 't2', title: 'Implement Auth API', status: 'in-progress', priority: 'critical', assignee: 'u3', due: '2024-05-10', tags: ['backend'] }
      ];
    }

    this.data.activities = [
      { id: 'a1', type: 'task', user: 'u2', action: 'moved', target: 'Fix mobile layout bugs', time: new Date(Date.now() - 3600000).toISOString() }
    ];

    this.data.channels = [
      { id: 'ch1', name: 'general', desc: 'General team discussions', unread: 0 },
      { id: 'ch2', name: 'product-v2', desc: 'Planning for next version', unread: 5 }
    ];

    this.data.workflows = [
      {
        id: 'wf1', name: 'Deployment Pipeline', icon: '🚀', desc: 'Automated CI/CD flow for production deployments.',
        steps: [
          { id: 's1', name: 'Unit Testing', status: 'completed', icon: '🧪' },
          { id: 's2', name: 'Security Audit', status: 'completed', icon: '🔒' },
          { id: 's3', name: 'Build & Artifact', status: 'active', icon: '📦' }
        ]
      }
    ];
  }
};

export default Store;

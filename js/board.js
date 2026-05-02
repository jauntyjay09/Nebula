/* Nebula — Kanban Board */
const Board = {
  filter: 'all',

  init() {
    this.render();
    this.bindFilters();
  },

  render() {
    const columns = [
      { id: 'todo', name: 'To Do', color: 'var(--text-tertiary)', status: 'todo' },
      { id: 'progress', name: 'In Progress', color: 'var(--primary)', status: 'progress' },
      { id: 'review', name: 'In Review', color: 'var(--warning)', status: 'review' },
      { id: 'done', name: 'Done', color: 'var(--success)', status: 'done' }
    ];

    const container = document.getElementById('board-columns');
    container.innerHTML = columns.map(col => {
      const tasks = Store.getTasksByStatus(col.status).filter(t => this.matchesFilter(t));
      return `
        <div class="board-column" data-status="${col.status}"
             ondragover="Board.onDragOver(event)" ondrop="Board.onDrop(event, '${col.status}')"
             ondragleave="Board.onDragLeave(event)">
          <div class="column-header">
            <div class="column-title">
              <span class="column-dot" style="background:${col.color}"></span>
              <span class="column-name">${col.name}</span>
              <span class="column-count">${tasks.length}</span>
            </div>
          </div>
          <div class="column-cards" data-status="${col.status}">
            ${tasks.map(t => this.renderCard(t)).join('')}
          </div>
          <button class="column-add-btn" onclick="Board.openCreateModal('${col.status}')">+ Add task</button>
        </div>
      `;
    }).join('');
  },

  renderCard(task) {
    const member = Store.getMember(task.assignee);
    const dueDate = task.due ? new Date(task.due) : null;
    const isOverdue = dueDate && dueDate < new Date() && task.status !== 'done';
    const dueFmt = dueDate ? dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

    return `
      <div class="task-card" draggable="true" data-id="${task.id}"
           ondragstart="Board.onDragStart(event, '${task.id}')" ondragend="Board.onDragEnd(event)">
        <div class="task-card-header">
          <span class="task-card-title">${task.title}</span>
          <span class="task-card-priority ${task.priority}">${task.priority}</span>
        </div>
        ${task.desc ? `<div class="task-card-desc">${task.desc}</div>` : ''}
        ${task.tags && task.tags.length ? `<div class="task-card-tags">${task.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        <div class="task-card-footer">
          <div class="task-card-assignee">
            ${member ? `<div class="avatar avatar-sm" style="background:${member.color}">${member.initials}</div>
            <span class="task-card-assignee-name">${member.name.split(' ')[0]}</span>` : ''}
          </div>
          ${dueFmt ? `<span class="task-card-due ${isOverdue ? 'overdue' : ''}">📅 ${dueFmt}</span>` : ''}
          <div class="task-card-actions">
            <button class="task-card-action-btn" title="Edit" onclick="Board.openEditModal('${task.id}')">✏️</button>
            <button class="task-card-action-btn" title="Delete" onclick="Board.deleteTask('${task.id}')">🗑️</button>
          </div>
        </div>
      </div>
    `;
  },

  matchesFilter(task) {
    if (this.filter === 'all') return true;
    return task.priority === this.filter;
  },

  bindFilters() {
    document.querySelectorAll('#board-filters .board-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#board-filters .board-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filter = btn.dataset.filter;
        this.render();
      });
    });
  },

  // Drag & Drop
  onDragStart(e, taskId) {
    e.dataTransfer.setData('text/plain', taskId);
    e.target.classList.add('dragging');
  },
  onDragEnd(e) { e.target.classList.remove('dragging'); },
  onDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  },
  onDragLeave(e) { e.currentTarget.classList.remove('drag-over'); },
  onDrop(e, newStatus) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const taskId = e.dataTransfer.getData('text/plain');
    const task = Store.data.tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      const oldStatus = task.status;
      Store.updateTask(taskId, { status: newStatus });
      const member = Store.getMember(task.assignee);
      Store.addActivity({
        id: Store.nextId('a'), user: task.assignee,
        action: `moved task to ${this.getStatusLabel(newStatus)}`,
        target: task.title, type: 'task',
        time: new Date().toISOString()
      });
      App.toast(`Task moved to ${this.getStatusLabel(newStatus)}`, 'success');
      this.render();
    }
  },

  getStatusLabel(s) {
    const map = { todo: 'To Do', progress: 'In Progress', review: 'In Review', done: 'Done' };
    return map[s] || s;
  },

  // Create / Edit Modal
  openCreateModal(status = 'todo') {
    this.showModal({ status, title: '', desc: '', priority: 'medium', assignee: '', tags: '', due: '' }, false);
  },

  openEditModal(taskId) {
    const task = Store.data.tasks.find(t => t.id === taskId);
    if (task) this.showModal({ ...task, tags: (task.tags || []).join(', ') }, true);
  },

  showModal(data, isEdit) {
    const members = Store.data.members;
    const modal = document.getElementById('task-modal');
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="Board.closeModal()">
        <div class="modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">${isEdit ? 'Edit Task' : 'New Task'}</h3>
            <button class="modal-close" onclick="Board.closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <div class="input-group">
              <label class="input-label">Title</label>
              <input class="input-field" id="task-title" value="${data.title || ''}" placeholder="Task title...">
            </div>
            <div class="input-group">
              <label class="input-label">Description</label>
              <textarea class="input-field" id="task-desc" placeholder="Describe the task...">${data.desc || ''}</textarea>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md)">
              <div class="input-group">
                <label class="input-label">Priority</label>
                <select class="select-field" id="task-priority">
                  <option value="low" ${data.priority === 'low' ? 'selected' : ''}>Low</option>
                  <option value="medium" ${data.priority === 'medium' ? 'selected' : ''}>Medium</option>
                  <option value="high" ${data.priority === 'high' ? 'selected' : ''}>High</option>
                  <option value="critical" ${data.priority === 'critical' ? 'selected' : ''}>Critical</option>
                </select>
              </div>
              <div class="input-group">
                <label class="input-label">Assignee</label>
                <select class="select-field" id="task-assignee">
                  <option value="">Unassigned</option>
                  ${members.map(m => `<option value="${m.id}" ${data.assignee === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
                </select>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md)">
              <div class="input-group">
                <label class="input-label">Due Date</label>
                <input class="input-field" type="date" id="task-due" value="${data.due || ''}">
              </div>
              <div class="input-group">
                <label class="input-label">Tags (comma separated)</label>
                <input class="input-field" id="task-tags" value="${data.tags || ''}" placeholder="e.g. bug, frontend">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" onclick="Board.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Board.saveTask('${isEdit ? data.id : ''}', '${data.status}')">${isEdit ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </div>
      </div>
    `;
  },

  closeModal() { document.getElementById('task-modal').innerHTML = ''; },

  saveTask(existingId, status) {
    const title = document.getElementById('task-title').value.trim();
    if (!title) { App.toast('Please enter a task title', 'error'); return; }

    const taskData = {
      title,
      desc: document.getElementById('task-desc').value.trim(),
      priority: document.getElementById('task-priority').value,
      assignee: document.getElementById('task-assignee').value,
      due: document.getElementById('task-due').value,
      tags: document.getElementById('task-tags').value.split(',').map(t => t.trim()).filter(Boolean),
      status
    };

    if (existingId) {
      Store.updateTask(existingId, taskData);
      App.toast('Task updated', 'success');
    } else {
      taskData.id = Store.nextId('t');
      taskData.created = new Date().toISOString().split('T')[0];
      Store.addTask(taskData);
      Store.addActivity({
        id: Store.nextId('a'), user: Store.data.currentUser.id,
        action: 'created task', target: title, type: 'task',
        time: new Date().toISOString()
      });
      App.toast('Task created', 'success');
    }
    this.closeModal();
    this.render();
  },

  deleteTask(id) {
    const task = Store.data.tasks.find(t => t.id === id);
    if (task && confirm('Delete this task?')) {
      Store.deleteTask(id);
      Store.addActivity({
        id: Store.nextId('a'), user: Store.data.currentUser.id,
        action: 'deleted task', target: task.title, type: 'task',
        time: new Date().toISOString()
      });
      App.toast('Task deleted', 'info');
      this.render();
    }
  }
};

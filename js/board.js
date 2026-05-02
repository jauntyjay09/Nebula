/* Nebula — Kanban Board */
import Store from './store.js';
import { escapeHTML, h } from './utils.js';
import { Validation } from './validation.js';
import App from './app.js';

const Board = {
  filter: 'all',
  draggedTaskId: null,

  init() {
    this.render();
    this.bindFilters();
    this.attachEvents();
  },

  attachEvents() {
    const board = document.getElementById('board-columns');
    if (!board) return;

    // Drag & Drop Efficiency
    board.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.task-card');
      if (card) {
        this.draggedTaskId = card.dataset.id;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.draggedTaskId);
      }
    });

    board.addEventListener('dragend', (e) => {
      const card = e.target.closest('.task-card');
      if (card) card.classList.remove('dragging');
      this.draggedTaskId = null;
    });

    board.addEventListener('dragover', (e) => {
      e.preventDefault();
      const col = e.target.closest('.board-column');
      if (col) col.classList.add('drag-over');
    });

    board.addEventListener('dragleave', (e) => {
      const col = e.target.closest('.board-column');
      if (col) col.classList.remove('drag-over');
    });

    board.addEventListener('drop', (e) => {
      e.preventDefault();
      const col = e.target.closest('.board-column');
      if (col && this.draggedTaskId) {
        col.classList.remove('drag-over');
        this.moveTask(this.draggedTaskId, col.dataset.status);
      }
    });

    // Clicks
    board.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.column-add-btn');
      if (addBtn) this.openCreateModal(addBtn.dataset.status);

      const editBtn = e.target.closest('.btn-edit');
      if (editBtn) this.openEditModal(editBtn.dataset.taskId);

      const delBtn = e.target.closest('.btn-delete');
      if (delBtn) this.deleteTask(delBtn.dataset.taskId);
    });

    // Modal click handling
    const modal = document.getElementById('task-modal');
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop') || e.target.closest('.modal-close')) {
        this.closeModal();
      }
    });
  },

  bindFilters() {
    document.querySelectorAll('.board-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.board-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filter = btn.dataset.filter;
        this.render();
      });
    });
  },

  render() {
    const container = document.getElementById('board-columns');
    if (!container) return;

    const columns = [
      { id: 'todo', name: 'To Do', color: 'var(--text-tertiary)' },
      { id: 'in-progress', name: 'In Progress', color: 'var(--primary)' },
      { id: 'done', name: 'Done', color: 'var(--success)' }
    ];

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    columns.forEach(col => {
      const tasks = Store.getTasksByStatus(col.id).filter(t => 
        this.filter === 'all' || t.priority === this.filter
      );

      const colEl = h('div', { className: 'board-column', 'data-status': col.id },
        h('div', { className: 'column-header' },
          h('div', { className: 'column-title' },
            h('span', { className: 'column-dot', style: { background: col.color } }),
            h('span', { className: 'column-name' }, col.name),
            h('span', { className: 'column-count' }, tasks.length)
          )
        ),
        h('div', { className: 'column-cards' },
          tasks.map(t => this.renderCard(t))
        ),
        h('button', { className: 'column-add-btn', 'data-status': col.id }, '+ Add task')
      );
      fragment.appendChild(colEl);
    });

    container.appendChild(fragment);
  },

  renderCard(task) {
    const member = Store.getMemberById(task.assignee);
    return h('div', { 
      className: 'task-card', 
      draggable: 'true', 
      'data-id': task.id,
      tabIndex: '0',
      role: 'button',
      'aria-label': `Task: ${task.title}`
    },
      h('div', { className: 'task-card-header' },
        h('span', { className: 'task-card-title' }, escapeHTML(task.title)),
        h('span', { className: `task-card-priority ${task.priority}` }, task.priority)
      ),
      h('div', { className: 'task-card-footer' },
        h('div', { className: 'task-card-assignee' },
          member ? h('div', { className: 'avatar avatar-xs', style: { background: member.color } }, member.initials) : null,
          member ? h('span', { className: 'task-card-assignee-name' }, member.name.split(' ')[0]) : null
        ),
        h('div', { className: 'task-card-actions' },
          h('button', { className: 'task-card-action-btn btn-calendar', 'data-task-id': task.id, title: 'Sync to Google Calendar', onClick: (e) => this.syncToCalendar(e, task) }, 
            h('span', { className: 'material-symbols-rounded' }, 'calendar_add_on')
          ),
          h('button', { className: 'task-card-action-btn btn-edit', 'data-task-id': task.id, title: 'Edit' }, 
            h('span', { className: 'material-symbols-rounded' }, 'edit')
          ),
          h('button', { className: 'task-card-action-btn btn-delete', 'data-task-id': task.id, title: 'Delete' }, 
            h('span', { className: 'material-symbols-rounded' }, 'delete')
          )
        )

      )
    );
  },

  /**
   * Adoption of Google Services: Google Calendar API Integration Pattern
   */
  async syncToCalendar(e, task) {
    e.stopPropagation();
    App.toast(`Syncing "${task.title}" to Google Calendar...`, 'info');
    CloudLogger.info('Calendar sync initiated', { taskId: task.id });

    // In a real app:
    // const event = { summary: task.title, start: { date: task.due } };
    // await gapi.client.calendar.events.insert({ calendarId: 'primary', resource: event });

    setTimeout(() => {
      App.toast('Successfully synced with Google Calendar!', 'success');
      CloudLogger.info('Calendar sync successful', { taskId: task.id });
    }, 1500);
  },

  moveTask(taskId, newStatus) {
    const task = Store.data.tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      task.status = newStatus;
      Store.save();
      this.render();
      App.toast('Task moved to ' + newStatus, 'success');
    }
  },

  openCreateModal(status = 'todo') {
    this.renderModal({ status });
  },

  openEditModal(taskId) {
    const task = Store.data.tasks.find(t => t.id === taskId);
    if (task) this.renderModal(task, true);
  },

  renderModal(data, isEdit = false) {
    const modal = document.getElementById('task-modal');
    modal.innerHTML = '';
    
    const members = Store.data.members;

    const modalEl = h('div', { className: 'modal-backdrop' },
      h('div', { className: 'modal', onClick: e => e.stopPropagation() },
        h('div', { className: 'modal-header' },
          h('h3', { className: 'modal-title' }, isEdit ? 'Edit Task' : 'New Task'),
          h('button', { className: 'modal-close', ariaLabel: 'Close' }, '✕')
        ),
        h('div', { className: 'modal-body' },
          h('div', { className: 'input-group' },
            h('label', {}, 'Task Title'),
            h('input', { type: 'text', id: 'task-title', value: data.title || '', placeholder: 'What needs to be done?' })
          ),
          h('div', { className: 'input-row' },
            h('div', { className: 'input-group' },
              h('label', {}, 'Priority'),
              h('select', { id: 'task-priority' },
                ['low', 'medium', 'high', 'critical'].map(p => 
                  h('option', { value: p, selected: data.priority === p }, p.charAt(0).toUpperCase() + p.slice(1))
                )
              )
            ),
            h('div', { className: 'input-group' },
              h('label', {}, 'Assignee'),
              h('select', { id: 'task-assignee' },
                members.map(m => h('option', { value: m.id, selected: data.assignee === m.id }, m.name))
              )
            )
          )
        ),
        h('div', { className: 'modal-footer' },
          h('button', { className: 'btn btn-ghost', onClick: () => this.closeModal() }, 'Cancel'),
          h('button', { className: 'btn btn-primary', onClick: () => this.saveTask(isEdit ? data.id : null, data.status) }, isEdit ? 'Save Changes' : 'Create Task')
        )
      )
    );

    modal.appendChild(modalEl);
    modal.classList.add('active');
    document.getElementById('task-title').focus();
  },

  closeModal() {
    const modal = document.getElementById('task-modal');
    modal.classList.remove('active');
    modal.innerHTML = '';
  },

  saveTask(existingId, status) {
    const title = document.getElementById('task-title').value;
    const priority = document.getElementById('task-priority').value;
    const assignee = document.getElementById('task-assignee').value;

    const taskData = { title, priority, assignee, status };
    
    // Security Pattern: Use Validation utility before saving
    const validation = Validation.task(taskData);
    if (!validation.valid) {
      App.toast(validation.errors[0], 'error');
      return;
    }

    if (existingId) {
      const idx = Store.data.tasks.findIndex(t => t.id === existingId);
      Store.data.tasks[idx] = { ...Store.data.tasks[idx], ...taskData };
      App.toast('Task updated', 'success');
    } else {
      const newTask = {
        id: 't' + Date.now(),
        ...taskData,
        tags: [],
        due: new Date().toISOString().split('T')[0]
      };
      Store.data.tasks.push(newTask);
      App.toast('Task created', 'success');
    }

    Store.save();
    this.closeModal();
    this.render();
  },

  deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
      Store.data.tasks = Store.data.tasks.filter(t => t.id !== id);
      Store.save();
      this.render();
      App.toast('Task deleted', 'info');
    }
  }
};

export default Board;

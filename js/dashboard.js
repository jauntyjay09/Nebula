/* Nebula — Analytics Dashboard */
const Dashboard = {
  init() {
    this.render();
    // Use requestAnimationFrame to ensure DOM is painted before drawing
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.drawCharts();
      });
    });
  },

  render() {
    const tasks = Store.data.tasks;
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'progress').length;
    const overdue = tasks.filter(t => t.due && new Date(t.due) < new Date() && t.status !== 'done').length;

    const container = document.getElementById('dashboard-content');
    container.innerHTML = `
      <div class="dashboard-grid">
        <div class="kpi-card" style="animation-delay:0ms">
          <div class="kpi-card-header">
            <div class="kpi-card-icon" style="background:hsla(250,80%,60%,0.15);color:var(--primary-light)">📊</div>
            <div class="kpi-card-trend up">↑ 12%</div>
          </div>
          <div class="kpi-card-value">${total}</div>
          <div class="kpi-card-label">Total Tasks</div>
        </div>
        <div class="kpi-card" style="animation-delay:50ms">
          <div class="kpi-card-header">
            <div class="kpi-card-icon" style="background:hsla(145,70%,50%,0.15);color:var(--success)">✅</div>
            <div class="kpi-card-trend up">↑ 8%</div>
          </div>
          <div class="kpi-card-value">${done}</div>
          <div class="kpi-card-label">Completed</div>
        </div>
        <div class="kpi-card" style="animation-delay:100ms">
          <div class="kpi-card-header">
            <div class="kpi-card-icon" style="background:hsla(250,80%,60%,0.15);color:var(--primary-light)">🔄</div>
            <div class="kpi-card-trend up">↑ 3</div>
          </div>
          <div class="kpi-card-value">${inProgress}</div>
          <div class="kpi-card-label">In Progress</div>
        </div>
        <div class="kpi-card" style="animation-delay:150ms">
          <div class="kpi-card-header">
            <div class="kpi-card-icon" style="background:hsla(0,75%,55%,0.15);color:var(--danger)">⚠️</div>
            ${overdue > 0 ? '<div class="kpi-card-trend down">↑ ' + overdue + '</div>' : '<div class="kpi-card-trend up">None</div>'}
          </div>
          <div class="kpi-card-value">${overdue}</div>
          <div class="kpi-card-label">Overdue</div>
        </div>
      </div>

      <div class="dashboard-charts">
        <div class="chart-card">
          <div class="chart-card-header">
            <div class="chart-card-title">Task Distribution</div>
            <div class="badge badge-primary">This Sprint</div>
          </div>
          <div class="chart-container" id="bar-chart-container" style="height:240px;position:relative">
            <canvas id="chart-bar"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-card-header">
            <div class="chart-card-title">Status Overview</div>
          </div>
          <div class="chart-container" id="donut-chart-container" style="display:flex;align-items:center;justify-content:center;height:240px">
            <canvas id="chart-donut"></canvas>
          </div>
        </div>
      </div>

      <div class="dashboard-bottom">
        <div class="chart-card">
          <div class="chart-card-header">
            <div class="chart-card-title">Recent Tasks</div>
          </div>
          <div class="recent-tasks-list">
            ${tasks.slice(0, 6).map(t => {
              const m = Store.getMember(t.assignee);
              return `
                <div class="recent-task-item">
                  <div class="recent-task-checkbox ${t.status === 'done' ? 'checked' : ''}" onclick="Dashboard.toggleTask('${t.id}')">
                    ${t.status === 'done' ? '✓' : ''}
                  </div>
                  <div class="recent-task-info">
                    <div class="recent-task-title ${t.status === 'done' ? 'completed' : ''}">${t.title}</div>
                    <div class="recent-task-meta">${m ? m.name : 'Unassigned'} · ${t.priority}</div>
                  </div>
                  <span class="task-card-priority ${t.priority}" style="font-size:10px">${t.priority}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-card-header">
            <div class="chart-card-title">Team Activity</div>
          </div>
          <div class="team-activity-list">
            ${Store.data.activities.slice(0, 6).map(a => {
              const m = Store.getMember(a.user);
              const time = new Date(a.time);
              const ago = this.timeAgo(time);
              return `
                <div class="team-activity-item">
                  <div class="avatar avatar-sm" style="background:${m ? m.color : 'var(--bg-surface)'}">${m ? m.initials : '?'}</div>
                  <div class="team-activity-text"><strong>${m ? m.name : 'Unknown'}</strong> ${a.action} <em>${a.target}</em></div>
                  <span class="team-activity-time">${ago}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  },

  drawCharts() {
    this.drawBarChart();
    this.drawDonutChart();
  },

  drawBarChart() {
    const canvas = document.getElementById('chart-bar');
    if (!canvas) return;

    const container = document.getElementById('bar-chart-container');
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 240;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const members = Store.data.members.slice(0, 6);
    const maxTasks = Math.max(...members.map(m => m.tasks), 1);
    const chartH = h - 55;
    const chartTop = 15;
    const startX = 55;
    const barCount = members.length;
    const barSpacing = (w - startX - 30) / barCount;
    const barW = Math.min(42, barSpacing * 0.55);

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = chartTop + (chartH / 4) * i;
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.round(maxTasks - (maxTasks / 4) * i), startX - 10, y);
    }

    // Bars
    const colors = [
      ['#7c5cfc', '#5a3fd6'],
      ['#e0459b', '#c22d7e'],
      ['#2dd4a8', '#1aab88'],
      ['#f0a030', '#d08818'],
      ['#3b9ef5', '#2880d0'],
      ['#34c759', '#28a745']
    ];

    members.forEach((m, i) => {
      const x = startX + barSpacing * i + (barSpacing - barW) / 2;
      const barH = Math.max(2, (m.tasks / maxTasks) * chartH);
      const y = chartTop + chartH - barH;

      // Bar with gradient
      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, colors[i % colors.length][0]);
      grad.addColorStop(1, colors[i % colors.length][1]);
      ctx.fillStyle = grad;

      // Rounded top corners
      const r = Math.min(4, barW / 2, barH / 2);
      ctx.beginPath();
      ctx.moveTo(x, y + barH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, y + barH);
      ctx.closePath();
      ctx.fill();

      // Value on top of bar
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(m.tasks, x + barW / 2, y - 4);

      // Name label below
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '10px sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(m.name.split(' ')[0], x + barW / 2, chartTop + chartH + 8);
    });
  },

  drawDonutChart() {
    const canvas = document.getElementById('chart-donut');
    if (!canvas) return;

    const size = 200;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const tasks = Store.data.tasks;
    const data = [
      { label: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: 'rgba(255,255,255,0.15)' },
      { label: 'In Progress', value: tasks.filter(t => t.status === 'progress').length, color: '#7c5cfc' },
      { label: 'Review', value: tasks.filter(t => t.status === 'review').length, color: '#f0a030' },
      { label: 'Done', value: tasks.filter(t => t.status === 'done').length, color: '#34c759' }
    ];

    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = 85;
    const innerR = 55;
    let angle = -Math.PI / 2;

    data.forEach(d => {
      if (d.value === 0) return;
      const sweep = (d.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, angle, angle + sweep);
      ctx.arc(cx, cy, innerR, angle + sweep, angle, true);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      angle += sweep;
    });

    // Center text
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toString(), cx, cy - 8);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px sans-serif';
    ctx.fillText('Tasks', cx, cy + 14);

    // Legend below
    // Skip legend as it would require more canvas height
  },

  toggleTask(id) {
    const task = Store.data.tasks.find(t => t.id === id);
    if (task) {
      task.status = task.status === 'done' ? 'todo' : 'done';
      Store.save(Store.data);
      this.render();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { this.drawCharts(); });
      });
    }
  },

  timeAgo(date) {
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }
};

/* Nebula — Team Chat */
const Chat = {
  activeChannel: null,

  init() {
    this.activeChannel = Store.data.activeChannel || 'ch1';
    this.renderChannels();
    this.renderMessages();
    this.bindInput();
  },

  renderChannels() {
    const list = document.getElementById('chat-channel-list');
    list.innerHTML = Store.data.channels.map(ch => `
      <div class="chat-channel ${ch.id === this.activeChannel ? 'active' : ''}" data-channel="${ch.id}" onclick="Chat.switchChannel('${ch.id}')">
        <span class="chat-channel-hash">#</span>
        <span class="chat-channel-name">${ch.name}</span>
        ${ch.unread > 0 ? `<span class="chat-channel-unread">${ch.unread}</span>` : ''}
      </div>
    `).join('');
  },

  switchChannel(channelId) {
    this.activeChannel = channelId;
    Store.data.activeChannel = channelId;
    // Clear unread
    const ch = Store.data.channels.find(c => c.id === channelId);
    if (ch) ch.unread = 0;
    Store.save(Store.data);
    this.renderChannels();
    this.renderMessages();
    // Update header
    const headerCh = document.getElementById('chat-header-channel');
    const headerDesc = document.getElementById('chat-header-desc');
    if (headerCh && ch) headerCh.textContent = '#' + ch.name;
    if (headerDesc && ch) headerDesc.textContent = ch.desc;
  },

  renderMessages() {
    const container = document.getElementById('chat-messages');
    const msgs = Store.data.messages[this.activeChannel] || [];
    const ch = Store.data.channels.find(c => c.id === this.activeChannel);

    if (msgs.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">💬</div><div class="empty-state-title">No messages yet</div><div class="empty-state-desc">Start a conversation in #${ch ? ch.name : 'channel'}</div></div>`;
      return;
    }

    let html = '';
    let lastDate = '';
    msgs.forEach(msg => {
      const date = new Date(msg.time);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      if (dateStr !== lastDate) {
        html += `<div class="chat-day-divider">${dateStr}</div>`;
        lastDate = dateStr;
      }

      const member = Store.getMember(msg.author);
      const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

      html += `
        <div class="chat-message" data-id="${msg.id}">
          <div class="chat-message-avatar">
            <div class="avatar" style="background:${member ? member.color : 'var(--bg-surface)'}">${member ? member.initials : '?'}</div>
          </div>
          <div class="chat-message-content">
            <div class="chat-message-header">
              <span class="chat-message-author">${member ? member.name : 'Unknown'}</span>
              <span class="chat-message-time">${timeStr}</span>
            </div>
            <div class="chat-message-body">${this.formatText(msg.text)}</div>
            ${msg.reactions && msg.reactions.length ? `
              <div class="chat-message-reactions">
                ${msg.reactions.map(r => `
                  <span class="chat-reaction ${r.users.includes(Store.data.currentUser.id) ? 'reacted' : ''}"
                        onclick="Chat.toggleReaction('${msg.id}', '${r.emoji}')">
                    ${r.emoji} ${r.users.length}
                  </span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
  },

  formatText(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/@(\w+)/g, '<strong style="color:var(--primary-light)">@$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:var(--bg-surface);padding:2px 6px;border-radius:4px;font-size:var(--font-sm)">$1</code>');
  },

  bindInput() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    if (!input || !sendBtn) return;

    const send = () => {
      const text = input.value.trim();
      if (!text) return;
      const msg = {
        id: Store.nextId('m'),
        author: Store.data.currentUser.id,
        text,
        time: new Date().toISOString(),
        reactions: []
      };
      Store.addMessage(this.activeChannel, msg);
      Store.addActivity({
        id: Store.nextId('a'), user: Store.data.currentUser.id,
        action: `posted in #${Store.data.channels.find(c => c.id === this.activeChannel)?.name || 'channel'}`,
        target: text.substring(0, 60) + (text.length > 60 ? '...' : ''),
        type: 'message', time: new Date().toISOString()
      });
      input.value = '';
      this.renderMessages();
    };

    sendBtn.onclick = send;
    input.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
  },

  toggleReaction(msgId, emoji) {
    const msgs = Store.data.messages[this.activeChannel];
    const msg = msgs?.find(m => m.id === msgId);
    if (!msg) return;
    const reaction = msg.reactions.find(r => r.emoji === emoji);
    if (reaction) {
      const idx = reaction.users.indexOf(Store.data.currentUser.id);
      if (idx >= 0) reaction.users.splice(idx, 1);
      else reaction.users.push(Store.data.currentUser.id);
      if (reaction.users.length === 0) msg.reactions = msg.reactions.filter(r => r.emoji !== emoji);
    } else {
      msg.reactions.push({ emoji, users: [Store.data.currentUser.id] });
    }
    Store.save(Store.data);
    this.renderMessages();
  }
};

/* Nebula — Team Chat */
import Store from './store.js';
import { escapeHTML, h, timeAgo } from './utils.js';
import { Validation } from './validation.js';

const Chat = {
  activeChannel: 'ch1',

  init() {
    this.render();
    this.attachEvents();
  },

  attachEvents() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const channelList = document.getElementById('chat-channel-list');

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.sendMessage());
    }

    if (channelList) {
      channelList.addEventListener('click', (e) => {
        const item = e.target.closest('.chat-channel');
        if (item) this.switchChannel(item.dataset.id);
      });
    }
  },

  render() {
    this.renderChannels();
    this.renderMessages();
  },

  renderChannels() {
    const container = document.getElementById('chat-channel-list');
    if (!container) return;

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    Store.data.channels.forEach(ch => {
      const el = h('div', { 
        className: `chat-channel ${ch.id === this.activeChannel ? 'active' : ''}`,
        'data-id': ch.id,
        role: 'tab',
        'aria-selected': ch.id === this.activeChannel
      },
        h('span', { className: 'chat-channel-hash' }, '#'),
        h('span', { className: 'chat-channel-name' }, ch.name),
        ch.unread > 0 ? h('span', { className: 'chat-channel-unread' }, ch.unread) : null
      );
      fragment.appendChild(el);
    });

    container.appendChild(fragment);
  },

  renderMessages() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const msgs = Store.data.messages.filter(m => m.channelId === this.activeChannel);
    const channel = Store.data.channels.find(c => c.id === this.activeChannel);

    // Update header
    const headerTitle = document.getElementById('chat-header-channel');
    const headerDesc = document.getElementById('chat-header-desc');
    if (headerTitle) headerTitle.textContent = '#' + channel.name;
    if (headerDesc) headerDesc.textContent = channel.desc;

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    if (msgs.length === 0) {
      fragment.appendChild(h('div', { className: 'chat-empty' }, 'No messages yet. Start the conversation!'));
    } else {
      msgs.forEach(msg => {
        const user = Store.getMemberById(msg.userId);
        const item = h('div', { className: 'chat-message' },
          h('div', { className: 'chat-message-avatar', style: { background: user ? user.color : 'var(--bg-surface)' } }, 
            user ? user.initials : '?'
          ),
          h('div', { className: 'chat-message-content' },
            h('div', { className: 'chat-message-header' },
              h('span', { className: 'chat-message-author' }, user ? user.name : 'Unknown'),
              h('span', { className: 'chat-message-time' }, timeAgo(msg.time))
            ),
            h('div', { className: 'chat-message-body' }, this.formatText(msg.text))
          )
        );
        fragment.appendChild(item);
      });
    }

    container.appendChild(fragment);
    container.scrollTop = container.scrollHeight;
  },

  formatText(text) {
    // Simple text formatting: escapes HTML and wraps code/mentions
    const escaped = escapeHTML(text);
    return escaped
      .replace(/@(\w+)/g, '<span class="chat-mention">@$1</span>')
      .replace(/`([^`]+)`/g, '<code class="chat-code">$1</code>');
  },

  switchChannel(id) {
    this.activeChannel = id;
    const channel = Store.data.channels.find(c => c.id === id);
    if (channel) channel.unread = 0;
    Store.save();
    this.render();
  },

  sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();

    if (!Validation.message(text)) return;

    const newMessage = {
      id: 'm' + Date.now(),
      channelId: this.activeChannel,
      userId: Store.data.currentUser.id,
      text: text,
      time: new Date().toISOString()
    };

    Store.data.messages.push(newMessage);
    Store.save();
    
    input.value = '';
    this.renderMessages();
  }
};

export default Chat;

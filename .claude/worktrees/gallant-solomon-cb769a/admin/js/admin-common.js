// ============================================
// SIGON SPORT Admin — Common utilities
// ============================================

const ADMIN_API = '/api';

// Token management
const Auth = {
  getToken: () => localStorage.getItem('sigon_admin_token'),
  setToken: (t) => localStorage.setItem('sigon_admin_token', t),
  removeToken: () => localStorage.removeItem('sigon_admin_token'),
  getUser: () => localStorage.getItem('sigon_admin_user'),
  setUser: (u) => localStorage.setItem('sigon_admin_user', u),

  requireAuth() {
    if (!this.getToken()) {
      window.location.href = '/admin/login.html';
      return false;
    }
    return true;
  },

  logout() {
    this.removeToken();
    localStorage.removeItem('sigon_admin_user');
    window.location.href = '/admin/login.html';
  },
};

// API helper
const Api = {
  async request(method, path, body) {
    const token = Auth.getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(ADMIN_API + path, opts);

    if (res.status === 401) {
      Auth.logout();
      throw new Error('Phiên đăng nhập hết hạn');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
    return data;
  },

  get:    (path)        => Api.request('GET',    path),
  post:   (path, body)  => Api.request('POST',   path, body),
  put:    (path, body)  => Api.request('PUT',    path, body),
  delete: (path)        => Api.request('DELETE', path),
};

// Toast notifications
const Toast = {
  container: null,

  init() {
    this.container = document.querySelector('.toast-wrap');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-wrap';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'success') {
    if (!this.container) this.init();
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const el = document.createElement('div');
    el.className = `toast-item ${type}`;
    el.innerHTML = `<span>${icons[type] || '✓'}</span><span>${message}</span>`;
    this.container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  },

  success: (msg) => Toast.show(msg, 'success'),
  error:   (msg) => Toast.show(msg, 'error'),
};

// Format price
const formatPrice = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n || 0);

// Format date
const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Status labels
const STATUS_LABELS = {
  pending:   { label: 'Chờ xác nhận', cls: 'badge-pending' },
  confirmed: { label: 'Đã xác nhận',  cls: 'badge-confirmed' },
  shipping:  { label: 'Đang giao',    cls: 'badge-shipping' },
  delivered: { label: 'Đã giao',      cls: 'badge-delivered' },
  cancelled: { label: 'Đã hủy',       cls: 'badge-cancelled' },
};

function statusBadge(s) {
  const info = STATUS_LABELS[s] || { label: s, cls: '' };
  return `<span class="badge ${info.cls}">${info.label}</span>`;
}

// Confirm dialog
function confirmAction(msg, cb) {
  if (window.confirm(msg)) cb();
}

// Pagination renderer
function renderPagination(container, current, total, limit, onPage) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) { container.innerHTML = ''; return; }

  let html = `<span class="page-info">Trang ${current}/${pages}</span>`;
  html += `<button class="page-btn" ${current === 1 ? 'disabled' : ''} onclick="(${onPage})(${current - 1})"><i class="fas fa-chevron-left"></i></button>`;

  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - current) <= 1) {
      html += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="(${onPage})(${i})">${i}</button>`;
    } else if (Math.abs(i - current) === 2) {
      html += `<span style="color:var(--text-muted)">…</span>`;
    }
  }

  html += `<button class="page-btn" ${current === pages ? 'disabled' : ''} onclick="(${onPage})(${current + 1})"><i class="fas fa-chevron-right"></i></button>`;
  container.innerHTML = html;
}

// Modal helpers
function openModal(id) { document.getElementById(id)?.classList.add('active'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

// Init sidebar active state
function initSidebar() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-item[href]').forEach(item => {
    if (path.includes(item.getAttribute('href'))) item.classList.add('active');
  });

  const user = Auth.getUser();
  const userEl = document.getElementById('sidebar-user');
  if (userEl && user) userEl.textContent = user;

  const avatarEl = document.getElementById('sidebar-avatar');
  if (avatarEl && user) avatarEl.textContent = user[0].toUpperCase();

  document.getElementById('btn-logout')?.addEventListener('click', () => Auth.logout());
}

document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  initSidebar();
});

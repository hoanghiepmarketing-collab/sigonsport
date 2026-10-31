// ============================================
// SIGON SPORT Admin — Orders
// ============================================

let currentPage  = 1;
let currentStatus = 'all';

document.addEventListener('DOMContentLoaded', () => {
  if (!Auth.requireAuth()) return;
  loadOrders();

  // Status tabs
  document.querySelectorAll('.status-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentStatus = tab.dataset.status;
      currentPage = 1;
      loadOrders();
    });
  });
});

async function loadOrders() {
  const params = new URLSearchParams({ page: currentPage, limit: 15 });
  if (currentStatus !== 'all') params.set('status', currentStatus);

  const tbody = document.getElementById('orders-body');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted)"><i class="fas fa-spinner fa-spin"></i> Đang tải...</td></tr>';

  try {
    const data = await Api.get(`/orders?${params}`);
    renderOrders(data.orders);
    renderPagination(
      document.getElementById('pagination'),
      currentPage, data.total, 15,
      (p) => { currentPage = p; loadOrders(); }
    );
    document.getElementById('orders-count').textContent = `${data.total} đơn hàng`;
  } catch (err) {
    Toast.error('Lỗi tải đơn hàng: ' + err.message);
  }
}

function renderOrders(orders) {
  const tbody = document.getElementById('orders-body');
  if (!orders.length) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><i class="fas fa-inbox"></i><p>Không có đơn hàng</p></div></td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.orderNumber || o.id?.slice(-6)}</strong></td>
      <td>
        <div class="td-name">${o.customer?.name || '—'}</div>
        <div class="td-muted">${o.customer?.phone || ''}</div>
      </td>
      <td class="td-muted">${o.items?.length || 0} sản phẩm</td>
      <td class="td-price">${formatPrice(o.total)}</td>
      <td>${statusBadge(o.status)}</td>
      <td class="td-muted">${formatDate(o.createdAt)}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewOrder('${o.id}')">
          <i class="fas fa-eye"></i> Xem
        </button>
      </td>
    </tr>
  `).join('');
}

async function viewOrder(id) {
  try {
    const o = await Api.get(`/orders/${id}`);
    fillOrderDetail(o);
    openModal('order-modal');
  } catch (err) {
    Toast.error('Lỗi: ' + err.message);
  }
}

function fillOrderDetail(o) {
  document.getElementById('od-number').textContent   = o.orderNumber || o.id?.slice(-6);
  document.getElementById('od-status').innerHTML     = statusBadge(o.status);
  document.getElementById('od-date').textContent     = formatDate(o.createdAt);
  document.getElementById('od-name').textContent     = o.customer?.name || '—';
  document.getElementById('od-phone').textContent    = o.customer?.phone || '—';
  document.getElementById('od-email').textContent    = o.customer?.email || '—';
  document.getElementById('od-address').textContent  = [o.customer?.address, o.customer?.province].filter(Boolean).join(', ');
  document.getElementById('od-note').textContent     = o.customer?.note || '—';
  document.getElementById('od-payment').textContent  = o.paymentMethod === 'cod' ? 'Thanh toán khi nhận' : 'Chuyển khoản';
  document.getElementById('od-subtotal').textContent = formatPrice(o.subtotal);
  document.getElementById('od-shipping').textContent = formatPrice(o.shipping);
  document.getElementById('od-total').textContent    = formatPrice(o.total);

  // Items
  document.getElementById('od-items').innerHTML = (o.items || []).map(item => `
    <tr>
      <td><img style="width:36px;height:36px;object-fit:cover;border-radius:4px" src="${item.img || ''}" alt="${item.name}"></td>
      <td>${item.name}</td>
      <td>${item.size || '—'}</td>
      <td>×${item.quantity}</td>
      <td class="td-price">${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  // Status select
  const sel = document.getElementById('od-status-select');
  sel.value = o.status;
  sel.dataset.orderId = o.id;
}

async function updateOrderStatus() {
  const sel = document.getElementById('od-status-select');
  const id  = sel.dataset.orderId;
  if (!id) return;

  try {
    await Api.put(`/orders/${id}`, { status: sel.value });
    Toast.success('Đã cập nhật trạng thái đơn hàng');
    closeModal('order-modal');
    loadOrders();
  } catch (err) {
    Toast.error('Lỗi: ' + err.message);
  }
}

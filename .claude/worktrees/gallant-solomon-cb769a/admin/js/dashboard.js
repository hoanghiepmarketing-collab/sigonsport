// ============================================
// SIGON SPORT Admin — Dashboard
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  if (!Auth.requireAuth()) return;
  loadDashboard();
});

async function loadDashboard() {
  try {
    const data = await Api.get('/dashboard/stats');

    // Stat cards
    document.getElementById('stat-orders').textContent   = data.totalOrders;
    document.getElementById('stat-revenue').textContent  = formatPrice(data.totalRevenue);
    document.getElementById('stat-products').textContent = data.totalProducts;
    document.getElementById('stat-pending').textContent  = data.pendingOrders;

    // Recent orders table
    renderRecentOrders(data.recentOrders);
  } catch (err) {
    Toast.error('Không thể tải dữ liệu: ' + err.message);
  }
}

function renderRecentOrders(orders) {
  const tbody = document.getElementById('recent-orders-body');
  if (!tbody) return;

  if (!orders.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state"><i class="fas fa-inbox"></i><p>Chưa có đơn hàng</p></td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.orderNumber || o.id?.slice(-6)}</strong></td>
      <td>
        <div class="td-name">${o.customer?.name || '—'}</div>
        <div class="td-muted">${o.customer?.phone || ''}</div>
      </td>
      <td class="td-price">${formatPrice(o.total)}</td>
      <td>${statusBadge(o.status)}</td>
      <td class="td-muted">${formatDate(o.createdAt)}</td>
    </tr>
  `).join('');
}

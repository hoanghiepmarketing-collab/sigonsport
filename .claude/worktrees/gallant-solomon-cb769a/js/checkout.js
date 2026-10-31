// ============================================
// SIGON SPORT — Checkout
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
});

function renderCheckoutSummary() {
  const items = JSON.parse(localStorage.getItem('sigon_cart') || '[]');
  const summaryEl = document.getElementById('checkout-summary-items');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const shippingEl = document.getElementById('checkout-shipping');
  const totalEl    = document.getElementById('checkout-total');

  if (!summaryEl) return;

  if (!items.length) {
    summaryEl.innerHTML = '<p style="color:#888;font-size:13px">Giỏ hàng trống</p>';
    return;
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total    = subtotal + shipping;

  summaryEl.innerHTML = items.map(item => `
    <div style="display:flex;gap:12px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--color-border)">
      <img src="${item.img}" alt="${item.name}" style="width:52px;height:52px;object-fit:cover;border-radius:6px;border:1px solid #eee">
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;line-height:1.3;margin-bottom:4px">${item.name}</div>
        <div style="font-size:12px;color:#888">× ${item.qty}</div>
      </div>
      <div style="font-weight:700;color:#E5002B;white-space:nowrap;font-size:13px">${formatPrice(item.price * item.qty)}</div>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Miễn phí' : formatPrice(shipping);
  if (totalEl)    totalEl.textContent    = formatPrice(total);
}

async function submitOrder(e) {
  e.preventDefault();
  const form = e.target;

  // Validate
  const name     = form.querySelector('#full-name')?.value.trim();
  const phone    = form.querySelector('#phone')?.value.trim();
  const email    = form.querySelector('#email')?.value.trim() || '';
  const address  = form.querySelector('#address')?.value.trim();
  const province = form.querySelector('#province')?.value || '';
  const note     = form.querySelector('#order-note')?.value.trim() || '';
  const payment  = form.querySelector('input[name="payment"]:checked')?.value || 'cod';

  if (!name)    { showToast('Vui lòng nhập họ tên', 'error'); return; }
  if (!phone)   { showToast('Vui lòng nhập số điện thoại', 'error'); return; }
  if (!address) { showToast('Vui lòng nhập địa chỉ', 'error'); return; }

  const cartItems = JSON.parse(localStorage.getItem('sigon_cart') || '[]');
  if (!cartItems.length) { showToast('Giỏ hàng trống', 'error'); return; }

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total    = subtotal + shipping;

  const orderData = {
    customer: { name, phone, email, address, province, note },
    items: cartItems.map(i => ({
      productId: String(i.id || i._id || ''),
      name:      i.name,
      img:       i.img || '',
      price:     i.price,
      size:      i.size || '',
      color:     i.color || '',
      quantity:  i.qty,
    })),
    subtotal,
    shipping,
    total,
    paymentMethod: payment,
  };

  const btn = form.querySelector('[type="submit"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Đang đặt hàng...'; }

  try {
    const result = await SigonApi.createOrder(orderData);

    // Clear cart
    localStorage.removeItem('sigon_cart');

    // Show success
    showOrderSuccess(result.orderNumber || result.id?.slice(-6));
  } catch (err) {
    showToast('Đặt hàng thất bại: ' + err.message, 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'Đặt hàng'; }
  }
}

function showOrderSuccess(orderNum) {
  const main = document.querySelector('main');
  if (!main) return;
  main.innerHTML = `
    <div style="text-align:center;padding:80px 20px;max-width:500px;margin:0 auto">
      <div style="font-size:64px;margin-bottom:20px">🎉</div>
      <h2 style="font-size:24px;font-weight:800;color:#111;margin-bottom:12px">Đặt hàng thành công!</h2>
      <p style="color:#666;margin-bottom:8px">Mã đơn hàng của bạn: <strong style="color:#0057FF">${orderNum || 'N/A'}</strong></p>
      <p style="color:#666;margin-bottom:32px">Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.</p>
      <div style="display:flex;gap:12px;justify-content:center">
        <a href="index.html" class="btn btn-primary"><i class="fas fa-home"></i> Về trang chủ</a>
        <a href="products.html" class="btn btn-outline">Tiếp tục mua sắm</a>
      </div>
    </div>
  `;
}

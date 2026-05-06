// ============================================
// SIGON SPORT — Cart (localStorage)
// ============================================

const Cart = {
  items: JSON.parse(localStorage.getItem('sigon_cart') || '[]'),

  save() {
    localStorage.setItem('sigon_cart', JSON.stringify(this.items));
    this.updateBadge();
    this.renderSidebar();
  },

  add(product) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.qty++;
    } else {
      this.items.push({ ...product, qty: 1 });
    }
    this.save();
    showToast(`✓ Đã thêm "${product.name.substring(0, 30)}..." vào giỏ!`, 'success');
  },

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  },

  updateQty(id, qty) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.qty = Math.max(1, qty);
      this.save();
    }
  },

  total() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  updateBadge() {
    const badge = document.getElementById('cart-badge');
    const count = this.count();
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  renderSidebar() {
    const body = document.getElementById('cart-body');
    if (!body) return;
    const footer = document.getElementById('cart-footer');

    if (this.items.length === 0) {
      body.innerHTML = `
        <div class="cart-sidebar__empty">
          <i class="fas fa-shopping-cart"></i>
          <p>Giỏ hàng đang trống</p>
          <a href="products.html" class="btn btn-primary btn-sm" style="margin-top:12px">Mua sắm ngay</a>
        </div>`;
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';
    body.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <img class="cart-item__img" src="${item.img}" alt="${item.name}">
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__price">${formatPrice(item.price)}</div>
          <div class="cart-item__qty">
            <button class="qty-btn" onclick="Cart.updateQty(${item.id}, ${item.qty - 1})">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="Cart.updateQty(${item.id}, ${item.qty + 1})">+</button>
          </div>
        </div>
        <span class="cart-item__remove" onclick="Cart.remove(${item.id})"><i class="fas fa-times"></i></span>
      </div>`).join('');

    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = formatPrice(this.total());
  }
};

// Cart sidebar open/close
function openCart() {
  document.getElementById('cart-sidebar')?.classList.add('active');
  document.getElementById('cart-overlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
  Cart.renderSidebar();
}

function closeCart() {
  document.getElementById('cart-sidebar')?.classList.remove('active');
  document.getElementById('cart-overlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
});

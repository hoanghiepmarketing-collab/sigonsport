// ============================================
// SIGON SPORT — Main JS (header, nav, toast, slider, countdown, search)
// ============================================

// ============================
// TOAST
// ============================
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '✓'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ============================
// STICKY HEADER
// ============================
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, { passive: true });
}

// ============================
// HERO SLIDER
// ============================
function initSlider() {
  const track = document.querySelector('.slider__track');
  if (!track) return;
  const slides = track.querySelectorAll('.slider__slide');
  const dots = document.querySelectorAll('.slider__dot');
  let current = 0;
  let autoPlay;

  const goTo = (idx) => {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const startAuto = () => { autoPlay = setInterval(() => goTo(current + 1), 4000); };
  const stopAuto  = () => clearInterval(autoPlay);

  document.querySelector('.slider__prev')?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  document.querySelector('.slider__next')?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

  // Touch/swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    startAuto();
  });

  goTo(0);
  startAuto();
}

// ============================
// COUNTDOWN TIMER
// ============================
function initCountdown() {
  const el = document.getElementById('flash-countdown');
  if (!el) return;
  // Set end time to 8 hours from now
  const end = Date.now() + 8 * 60 * 60 * 1000;

  const update = () => {
    const diff = Math.max(0, end - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');

    el.innerHTML = `
      <div class="countdown-block"><span class="countdown-block__num">${pad(h)}</span><span class="countdown-block__label">Giờ</span></div>
      <span class="countdown-sep">:</span>
      <div class="countdown-block"><span class="countdown-block__num">${pad(m)}</span><span class="countdown-block__label">Phút</span></div>
      <span class="countdown-sep">:</span>
      <div class="countdown-block"><span class="countdown-block__num">${pad(s)}</span><span class="countdown-block__label">Giây</span></div>`;
  };
  update();
  setInterval(update, 1000);
}

// ============================
// SEARCH
// ============================
function initSearch() {
  const inputs = document.querySelectorAll('.search-input');
  let timer;

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const q = input.value.trim().toLowerCase();
        const suggestions = document.querySelector('.search-suggestions');
        if (!suggestions) return;
        if (q.length < 2) { suggestions.classList.remove('active'); return; }

        const matches = products.filter(p =>
          p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
        ).slice(0, 6);

        if (matches.length === 0) { suggestions.classList.remove('active'); return; }

        suggestions.innerHTML = matches.map(p => `
          <div class="search-suggestion-item" onclick="window.location='product-detail.html?id=${p.id}'">
            <img src="${p.img}" alt="${p.name}">
            <div>
              <div style="font-size:13px;font-weight:600;color:#111">${p.name}</div>
              <div style="color:#E5002B;font-weight:700;font-size:13px">${formatPrice(p.price)}</div>
            </div>
          </div>`).join('');
        suggestions.classList.add('active');
      }, 300);
    });

    input.addEventListener('blur', () => {
      setTimeout(() => {
        const suggestions = document.querySelector('.search-suggestions');
        if (suggestions) suggestions.classList.remove('active');
      }, 200);
    });
  });
}

// ============================
// MOBILE DRAWER NAV
// ============================
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-overlay');
  const closeBtn = document.getElementById('drawer-close');

  const open  = () => { drawer?.classList.add('active');  overlay?.classList.add('active');  document.body.style.overflow = 'hidden'; };
  const close = () => { drawer?.classList.remove('active'); overlay?.classList.remove('active'); document.body.style.overflow = ''; };

  hamburger?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);

  // Accordion nav items
  document.querySelectorAll('.mobile-nav-item[data-sub]').forEach(item => {
    item.addEventListener('click', () => {
      const subId = item.dataset.sub;
      const sub = document.getElementById(subId);
      if (!sub) return;
      const isOpen = sub.classList.contains('active');
      document.querySelectorAll('.mobile-nav-sub.active').forEach(s => s.classList.remove('active'));
      if (!isOpen) sub.classList.add('active');
    });
  });
}

// ============================
// BACK TO TOP
// ============================
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================
// PRODUCT CARD RENDERER
// ============================
function renderProductCard(p) {
  const badgesHtml = [
    p.isHot ? '<span class="badge badge-hot">HOT</span>' : '',
    p.isNew ? '<span class="badge badge-new">MỚI</span>' : '',
    p.isSecondhand ? `<span class="badge badge-secondhand">2ND</span>` : '',
  ].filter(Boolean).join('');

  const conditionHtml = p.isSecondhand && p.condition
    ? `<div class="product-card__condition">Tình trạng: ${p.condition}</div>` : '';

  const ratingHtml = p.rating
    ? `<div class="product-card__rating">
        <span class="stars">★★★★★</span>
        <span class="product-card__rating-count">${p.rating} (${p.reviewCount})</span>
        <span class="product-card__sold">· ${p.sold} đã bán</span>
       </div>` : '<div style="height:4px"></div>';

  const priceHtml = p.isSecondhand
    ? `<div class="product-card__price">
        <span class="price-sale">${formatPrice(p.price)}</span>
        <span class="price-new-ref">Mới: <span>${formatPrice(p.originalPrice)}</span></span>
       </div>`
    : `<div class="product-card__price">
        <span class="price-sale">${formatPrice(p.price)}</span>
        ${p.originalPrice ? `<span class="price-original">${formatPrice(p.originalPrice)}</span>` : ''}
       </div>`;

  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-card__image-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="product-card__badges">${badgesHtml}</div>
        ${p.discount ? `<div class="product-card__discount">-${p.discount}%</div>` : ''}
        <div class="product-card__add-btn" onclick="Cart.add(${JSON.stringify(p).replace(/"/g, '&quot;')})">
          <i class="fas fa-cart-plus"></i> Thêm vào giỏ
        </div>
        <div class="product-card__wishlist"><i class="far fa-heart"></i></div>
      </div>
      <div class="product-card__body">
        <div class="product-card__brand">${p.brand}</div>
        <a href="product-detail.html?id=${p.id}" class="product-card__name">${p.name}</a>
        ${conditionHtml}
        ${ratingHtml}
        ${priceHtml}
      </div>
    </div>`;
}

// ============================
// SPORT TABS
// ============================
function initSportTabs() {
  document.querySelectorAll('[data-tab-group]').forEach(tabGroup => {
    const group = tabGroup.dataset.tabGroup;
    const tabs = tabGroup.querySelectorAll('.sport-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const sport = tab.dataset.sport;
        const target = document.getElementById(`products-${group}`);
        if (!target) return;
        let data;
        if (sport === 'all') {
          data = group === 'new' ? getNewProducts(8) : getHotProducts(8);
        } else {
          data = getProductsBySport(sport, 8);
        }
        target.innerHTML = data.map(renderProductCard).join('');
      });
    });
  });
}

// ============================
// HOMEPAGE GRIDS
// ============================
function initHomepageGrids() {
  const flashGrid = document.getElementById('products-flashsale');
  if (flashGrid) flashGrid.innerHTML = getHotProducts(8).map(renderProductCard).join('');

  const newGrid = document.getElementById('products-new');
  if (newGrid) newGrid.innerHTML = getNewProducts(8).map(renderProductCard).join('');

  const hotGrid = document.getElementById('products-hot');
  if (hotGrid) hotGrid.innerHTML = getHotProducts(8).map(renderProductCard).join('');

  const secondhandGrid = document.getElementById('products-secondhand');
  if (secondhandGrid) secondhandGrid.innerHTML = getSecondhandProducts(4).map(renderProductCard).join('');
}

// ============================
// INIT ALL
// ============================
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initSlider();
  initCountdown();
  initSearch();
  initMobileNav();
  initBackToTop();
  initSportTabs();
  initHomepageGrids();
});

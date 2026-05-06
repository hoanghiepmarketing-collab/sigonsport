// ============================================
// SIGON SPORT — Product Detail Page
// ============================================

(function () {
  const sportLabels = {
    'bong-da': 'Bóng Đá',
    'cau-long': 'Cầu Lông',
    'tennis': 'Tennis',
    'pickleball': 'Pickleball',
  };

  let currentProduct = null;
  let selectedSize = null;
  let selectedColor = null;
  let qty = 1;

  function getProductId() {
    return parseInt(new URLSearchParams(window.location.search).get('id'), 10);
  }

  function renderDetail(p) {
    currentProduct = p;
    document.title = `${p.name} | SIGON SPORT`;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', `${p.name} - ${formatPrice(p.price)} tại SIGON SPORT`);

    // Breadcrumb
    const catEl = document.getElementById('detail-breadcrumb-cat');
    const nameEl = document.getElementById('detail-breadcrumb-name');
    if (catEl) {
      catEl.href = `products.html?sport=${p.sport}`;
      catEl.textContent = sportLabels[p.sport] || 'Sản phẩm';
    }
    if (nameEl) nameEl.textContent = p.name;

    const badges = [
      p.isHot ? '<span class="badge badge-hot">HOT</span>' : '',
      p.isNew ? '<span class="badge badge-new">MỚI</span>' : '',
      p.isSecondhand ? '<span class="badge badge-secondhand">SECONDHAND</span>' : '',
      p.inStock ? '<span class="badge badge-stock">Còn hàng</span>' : '<span class="badge badge-dark">Hết hàng</span>',
    ].filter(Boolean).join('');

    const ratingHtml = p.rating
      ? `<div class="detail-rating">
          <span class="stars">★★★★★</span>
          <span class="detail-rating-count">${p.rating} (${p.reviewCount} đánh giá)</span>
          <span class="detail-sold">· ${p.sold} đã bán</span>
         </div>`
      : '';

    const priceHtml = p.isSecondhand
      ? `<div class="detail-price-wrap">
          <span class="detail-price-sale">${formatPrice(p.price)}</span>
          <span class="detail-discount-tag">-${p.discount}%</span>
         </div>
         <div class="detail-new-ref">Giá mới: <span style="text-decoration:line-through">${formatPrice(p.originalPrice)}</span> — Tiết kiệm ${formatPrice(p.originalPrice - p.price)}</div>`
      : `<div class="detail-price-wrap">
          <span class="detail-price-sale">${formatPrice(p.price)}</span>
          ${p.originalPrice ? `<span class="detail-price-original">${formatPrice(p.originalPrice)}</span>` : ''}
          ${p.discount ? `<span class="detail-discount-tag">-${p.discount}%</span>` : ''}
         </div>`;

    const conditionHtml = p.isSecondhand && p.condition
      ? `<div class="detail-condition"><i class="fas fa-check-circle"></i>Tình trạng: ${p.condition}</div>` : '';

    const sizesHtml = p.sizes
      ? `<div class="detail-label">Chọn Size</div>
         <div class="size-grid" id="size-grid">
           ${p.sizes.map(s => `<button class="size-btn" data-size="${s}" onclick="selectSize(${s})">${s}</button>`).join('')}
         </div>` : '';

    const colorsHtml = p.colors
      ? `<div class="detail-label">Màu Sắc</div>
         <div class="color-options" id="color-options">
           ${p.colors.map(c => `<button class="color-btn" data-color="${c}" onclick="selectColor('${c.replace(/'/g, "\\'")}')">${c}</button>`).join('')}
         </div>` : '';

    const secondhandNote = p.isSecondhand
      ? `<div style="background:#fff8e6;border:1px solid #e6c97a;border-radius:8px;padding:12px 14px;margin-bottom:14px;font-size:13px">
          <strong style="color:#8B6914"><i class="fas fa-recycle"></i> Thông tin Secondhand</strong><br>
          ${p.condition ? `<span>Tình trạng: <strong>${p.condition}</strong></span><br>` : ''}
          ${p.usageCount ? `<span>Số lần sử dụng: <strong>${p.usageCount}</strong></span><br>` : ''}
          ${p.sellerNote ? `<span>Lý do bán: <strong>${p.sellerNote}</strong></span>` : ''}
         </div>` : '';

    const html = `
      <div class="product-detail">
        <!-- Gallery -->
        <div class="detail-gallery">
          <div class="detail-main-img" id="main-img-wrap">
            ${p.isSecondhand ? '<div class="detail-secondhand-badge">♻ SECONDHAND</div>' : ''}
            <img id="main-img" src="${p.img}" alt="${p.name}">
          </div>
          <div class="detail-thumbs">
            <div class="detail-thumb active" onclick="switchImg('${p.img}', this)">
              <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="detail-thumb" onclick="switchImg('${p.img}', this)">
              <img src="${p.img}" alt="${p.name} - góc 2">
            </div>
            <div class="detail-thumb" onclick="switchImg('${p.img}', this)">
              <img src="${p.img}" alt="${p.name} - góc 3">
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="detail-info">
          <div class="detail-brand">${p.brand}</div>
          <h1 class="detail-name">${p.name}</h1>
          <div class="detail-badges">${badges}</div>
          ${conditionHtml}
          ${ratingHtml}
          ${priceHtml}
          <hr class="detail-divider">
          ${secondhandNote}
          ${sizesHtml}
          ${colorsHtml}
          <div class="detail-qty-wrap">
            <span class="detail-qty-label">Số lượng:</span>
            <div class="detail-qty">
              <button class="detail-qty__btn" onclick="changeQty(-1)">−</button>
              <input class="detail-qty__input" id="qty-input" type="number" value="1" min="1" max="99" onchange="setQty(this.value)">
              <button class="detail-qty__btn" onclick="changeQty(1)">+</button>
            </div>
          </div>
          <div class="detail-cta">
            <button class="btn btn-accent" onclick="addToCartDetail()" ${!p.inStock ? 'disabled' : ''}>
              <i class="fas fa-cart-plus"></i> Thêm Vào Giỏ
            </button>
            <button class="btn btn-primary" onclick="buyNow()" ${!p.inStock ? 'disabled' : ''}>
              <i class="fas fa-bolt"></i> Mua Ngay
            </button>
          </div>
          <div class="detail-benefits">
            <div class="detail-benefit"><i class="fas fa-truck"></i>Miễn phí vận chuyển đơn từ 500K</div>
            <div class="detail-benefit"><i class="fas fa-shield-alt"></i>Hàng chính hãng 100%, có tem nhãn đầy đủ</div>
            <div class="detail-benefit"><i class="fas fa-redo"></i>Đổi trả trong 7 ngày nếu lỗi sản xuất</div>
            <div class="detail-benefit"><i class="fas fa-headset"></i>Hỗ trợ tư vấn 24/7: 0909 123 456</div>
          </div>
        </div>
      </div>

      <!-- TABS -->
      <div class="detail-tabs">
        <div class="detail-tab-nav">
          <button class="detail-tab-btn active" data-tab="desc">Mô tả sản phẩm</button>
          <button class="detail-tab-btn" data-tab="spec">Thông số kỹ thuật</button>
          <button class="detail-tab-btn" data-tab="review">Đánh giá (${p.reviewCount || 0})</button>
        </div>
        <div class="detail-tab-panel active" id="tab-desc">
          <p>Sản phẩm <strong>${p.name}</strong> của thương hiệu <strong>${p.brand}</strong> — được thiết kế dành cho các vận động viên yêu thể thao ${sportLabels[p.sport] || ''} ở mọi cấp độ.</p>
          <p>Chất liệu cao cấp, thiết kế khí động học giúp tối ưu hiệu suất thi đấu và tập luyện. Đế ngoài bám đường tốt, lớp đệm êm ái bảo vệ chân tối ưu.</p>
          ${p.isSecondhand ? `<p style="color:#8B6914"><strong>⚠ Lưu ý Secondhand:</strong> Đây là sản phẩm đã qua sử dụng (${p.condition || ''}). Ảnh chụp thực tế, không qua chỉnh sửa. Đã được kiểm định kỹ trước khi bán.</p>` : ''}
        </div>
        <div class="detail-tab-panel" id="tab-spec">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <tr style="background:#f5f5f5"><td style="padding:10px;border:1px solid #eee;font-weight:600;width:40%">Thương hiệu</td><td style="padding:10px;border:1px solid #eee">${p.brand}</td></tr>
            <tr><td style="padding:10px;border:1px solid #eee;font-weight:600">Môn thể thao</td><td style="padding:10px;border:1px solid #eee">${sportLabels[p.sport] || p.sport}</td></tr>
            <tr style="background:#f5f5f5"><td style="padding:10px;border:1px solid #eee;font-weight:600">Loại sản phẩm</td><td style="padding:10px;border:1px solid #eee">${p.category === 'giay' ? 'Giày thể thao' : p.category === 'vot' ? 'Vợt' : 'Phụ kiện'}</td></tr>
            ${p.sizes ? `<tr><td style="padding:10px;border:1px solid #eee;font-weight:600">Size có sẵn</td><td style="padding:10px;border:1px solid #eee">${p.sizes.join(', ')}</td></tr>` : ''}
            ${p.colors ? `<tr style="background:#f5f5f5"><td style="padding:10px;border:1px solid #eee;font-weight:600">Màu sắc</td><td style="padding:10px;border:1px solid #eee">${p.colors.join(', ')}</td></tr>` : ''}
            ${p.isSecondhand ? `<tr><td style="padding:10px;border:1px solid #eee;font-weight:600">Tình trạng</td><td style="padding:10px;border:1px solid #eee;color:#8B6914;font-weight:600">${p.condition}</td></tr>` : ''}
          </table>
        </div>
        <div class="detail-tab-panel" id="tab-review">
          ${p.rating
            ? `<div style="text-align:center;padding:20px">
                <div style="font-size:48px;font-weight:900;color:#FFC107;font-family:Montserrat">${p.rating}</div>
                <div style="color:#FFC107;font-size:20px">★★★★★</div>
                <div style="font-size:13px;color:#888;margin-top:4px">${p.reviewCount} đánh giá</div>
               </div>`
            : `<div style="text-align:center;padding:40px;color:#aaa">
                <i class="fas fa-comment-slash" style="font-size:40px;display:block;margin-bottom:12px"></i>
                <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
               </div>`
          }
        </div>
      </div>
    `;

    document.getElementById('product-detail-content').innerHTML = html;
    initDetailTabs();
    renderRelated(p);
  }

  function switchImg(src, el) {
    document.getElementById('main-img').src = src;
    document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  }

  function selectSize(s) {
    selectedSize = s;
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.classList.toggle('selected', parseInt(btn.dataset.size, 10) === s);
    });
  }

  function selectColor(c) {
    selectedColor = c;
    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.color === c);
    });
  }

  function changeQty(delta) {
    const input = document.getElementById('qty-input');
    if (!input) return;
    qty = Math.max(1, Math.min(99, qty + delta));
    input.value = qty;
  }

  function setQty(val) {
    qty = Math.max(1, Math.min(99, parseInt(val, 10) || 1));
    const input = document.getElementById('qty-input');
    if (input) input.value = qty;
  }

  function addToCartDetail() {
    if (!currentProduct) return;
    for (let i = 0; i < qty; i++) Cart.add(currentProduct);
    openCart();
  }

  function buyNow() {
    addToCartDetail();
    window.location.href = 'checkout.html';
  }

  function initDetailTabs() {
    document.querySelectorAll('.detail-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.detail-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.detail-tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = document.getElementById(`tab-${btn.dataset.tab}`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  function renderRelated(p) {
    const grid = document.getElementById('related-products');
    if (!grid) return;
    const related = products
      .filter(r => r.id !== p.id && r.sport === p.sport && !r.isSecondhand)
      .slice(0, 4);
    grid.innerHTML = related.length > 0
      ? related.map(renderProductCard).join('')
      : '<p style="color:#aaa;padding:20px">Không có sản phẩm liên quan.</p>';
  }

  // Expose to global scope for inline onclick
  window.switchImg = switchImg;
  window.selectSize = selectSize;
  window.selectColor = selectColor;
  window.changeQty = changeQty;
  window.setQty = setQty;
  window.addToCartDetail = addToCartDetail;
  window.buyNow = buyNow;

  document.addEventListener('DOMContentLoaded', () => {
    const id = getProductId();
    const product = products.find(p => p.id === id);

    if (product) {
      renderDetail(product);
    } else {
      document.getElementById('product-detail-content').innerHTML = `
        <div style="text-align:center;padding:80px 20px;color:#aaa">
          <i class="fas fa-exclamation-circle" style="font-size:50px;display:block;margin-bottom:16px;color:#ddd"></i>
          <h2 style="font-size:20px;color:#333;margin-bottom:8px">Sản phẩm không tồn tại</h2>
          <p style="margin-bottom:20px">Sản phẩm bạn tìm có thể đã hết hàng hoặc không tồn tại.</p>
          <a href="products.html" class="btn btn-primary">Xem Sản Phẩm Khác</a>
        </div>`;
    }
  });
})();

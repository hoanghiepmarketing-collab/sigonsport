// ============================================
// SIGON SPORT Admin — Products
// ============================================

let currentPage = 1;
let currentSearch = '';
let currentSport = '';
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!Auth.requireAuth()) return;
  loadProducts();

  document.getElementById('search-input').addEventListener('input', debounce(e => {
    currentSearch = e.target.value.trim();
    currentPage = 1;
    loadProducts();
  }, 400));

  document.getElementById('filter-sport').addEventListener('change', e => {
    currentSport = e.target.value;
    currentPage = 1;
    loadProducts();
  });

  document.getElementById('btn-add-product').addEventListener('click', openAddModal);
  document.getElementById('product-form').addEventListener('submit', saveProduct);
});

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

async function loadProducts() {
  const params = new URLSearchParams({ page: currentPage, limit: 15 });
  if (currentSearch) params.set('search', currentSearch);
  if (currentSport)  params.set('sport', currentSport);

  const tbody = document.getElementById('products-body');
  tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted)"><i class="fas fa-spinner fa-spin"></i> Đang tải...</td></tr>';

  try {
    const data = await Api.get(`/products?${params}`);
    renderProducts(data.products);
    renderPagination(
      document.getElementById('pagination'),
      currentPage, data.total, 15,
      (p) => { currentPage = p; loadProducts(); }
    );
    document.getElementById('products-count').textContent = `${data.total} sản phẩm`;
  } catch (err) {
    Toast.error('Lỗi tải sản phẩm: ' + err.message);
  }
}

function renderProducts(products) {
  const tbody = document.getElementById('products-body');
  if (!products.length) {
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fas fa-box-open"></i><p>Không có sản phẩm nào</p></div></td></tr>';
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td><img class="td-img" src="${p.img || 'https://placehold.co/44x44/f0f4ff/0057FF?text=SP'}" alt="${p.name}"></td>
      <td>
        <div class="td-name">${p.name}</div>
        <div class="td-muted">${p.brand}</div>
      </td>
      <td>${sportLabel(p.sport)}</td>
      <td class="td-muted">${catLabel(p.category)}</td>
      <td class="td-price">${formatPrice(p.price)}</td>
      <td>
        ${p.isHot       ? '<span class="badge badge-hot">HOT</span> ' : ''}
        ${p.isNew       ? '<span class="badge badge-new">MỚI</span> ' : ''}
        ${p.isSecondhand? '<span class="badge badge-secondhand">2ND</span>' : ''}
      </td>
      <td><span class="badge ${p.inStock ? 'badge-instock' : 'badge-outstock'}">${p.inStock ? 'Còn hàng' : 'Hết hàng'}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-outline btn-sm btn-icon" title="Sửa" onclick="openEditModal('${p.id}')"><i class="fas fa-pen"></i></button>
          <button class="btn btn-danger btn-sm btn-icon" title="Xóa" onclick="deleteProduct('${p.id}','${p.name.replace(/'/g,'')}')"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function sportLabel(s) {
  const map = { 'bong-da': '⚽ Bóng đá', 'cau-long': '🏸 Cầu lông', 'tennis': '🎾 Tennis', 'pickleball': '🏓 Pickleball' };
  return map[s] || s || '—';
}
function catLabel(c) {
  const map = { 'giay': 'Giày', 'vot': 'Vợt', 'phu-kien': 'Phụ kiện' };
  return map[c] || c || '—';
}

// ---- ADD MODAL ----
function openAddModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Thêm sản phẩm mới';
  document.getElementById('product-form').reset();
  openModal('product-modal');
}

async function openEditModal(id) {
  editingId = id;
  document.getElementById('modal-title').textContent = 'Chỉnh sửa sản phẩm';

  try {
    const p = await Api.get(`/products/${id}`);
    const f = document.getElementById('product-form');
    f.elements['name'].value          = p.name || '';
    f.elements['brand'].value         = p.brand || '';
    f.elements['sport'].value         = p.sport || '';
    f.elements['category'].value      = p.category || '';
    f.elements['price'].value         = p.price || '';
    f.elements['originalPrice'].value = p.originalPrice || '';
    f.elements['discount'].value      = p.discount || '';
    f.elements['img'].value           = p.img || '';
    f.elements['description'].value   = p.description || '';
    f.elements['condition'].value     = p.condition || '';
    f.elements['isNew'].checked       = !!p.isNew;
    f.elements['isHot'].checked       = !!p.isHot;
    f.elements['isSecondhand'].checked= !!p.isSecondhand;
    f.elements['inStock'].checked     = !!p.inStock;
    openModal('product-modal');
  } catch (err) {
    Toast.error('Không thể tải sản phẩm: ' + err.message);
  }
}

async function saveProduct(e) {
  e.preventDefault();
  const f = e.target;
  const body = {
    name:          f.elements['name'].value.trim(),
    brand:         f.elements['brand'].value.trim(),
    sport:         f.elements['sport'].value,
    category:      f.elements['category'].value,
    price:         Number(f.elements['price'].value),
    originalPrice: Number(f.elements['originalPrice'].value) || undefined,
    discount:      Number(f.elements['discount'].value) || 0,
    img:           f.elements['img'].value.trim(),
    description:   f.elements['description'].value.trim(),
    condition:     f.elements['condition'].value.trim(),
    isNew:         f.elements['isNew'].checked,
    isHot:         f.elements['isHot'].checked,
    isSecondhand:  f.elements['isSecondhand'].checked,
    inStock:       f.elements['inStock'].checked,
  };

  const btn = f.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Đang lưu...';

  try {
    if (editingId) {
      await Api.put(`/products/${editingId}`, body);
      Toast.success('Đã cập nhật sản phẩm');
    } else {
      await Api.post('/products', body);
      Toast.success('Đã thêm sản phẩm mới');
    }
    closeModal('product-modal');
    loadProducts();
  } catch (err) {
    Toast.error('Lỗi: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Lưu sản phẩm';
  }
}

async function deleteProduct(id, name) {
  confirmAction(`Xóa sản phẩm "${name}"? Hành động này không thể hoàn tác.`, async () => {
    try {
      await Api.delete(`/products/${id}`);
      Toast.success('Đã xóa sản phẩm');
      loadProducts();
    } catch (err) {
      Toast.error('Lỗi: ' + err.message);
    }
  });
}

// Seed database
async function seedDB() {
  if (!confirm('Seed database sẽ XÓA toàn bộ sản phẩm hiện tại và thêm lại data mẫu. Tiếp tục?')) return;
  try {
    const data = await Api.post('/seed', {});
    Toast.success(data.message);
    loadProducts();
  } catch (err) {
    Toast.error('Lỗi seed: ' + err.message);
  }
}

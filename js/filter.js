// ============================================
// SIGON SPORT — Filter & Sort (products.html)
// ============================================

(function () {
  const sportLabels = {
    'bong-da': 'Bóng Đá',
    'cau-long': 'Cầu Lông',
    'tennis': 'Tennis',
    'pickleball': 'Pickleball',
  };

  // Read URL params on page load
  function getParams() {
    const p = new URLSearchParams(window.location.search);
    return {
      sport: p.get('sport') || 'all',
      cat: p.get('cat') || 'all',
      secondhand: p.get('secondhand') === '1',
      sort: p.get('sort') || 'default',
    };
  }

  // Apply params to filter UI
  function applyParamsToUI(params) {
    const sportRadio = document.querySelector(`input[name="sport"][value="${params.sport}"]`);
    if (sportRadio) sportRadio.checked = true;

    const catRadio = document.querySelector(`input[name="cat"][value="${params.cat}"]`);
    if (catRadio) catRadio.checked = true;

    if (params.secondhand) {
      const shRadio = document.querySelector('input[name="condition"][value="secondhand"]');
      if (shRadio) shRadio.checked = true;
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect && params.sort) sortSelect.value = params.sort;
  }

  // Collect current filter state
  function getFilters() {
    const sport = document.querySelector('input[name="sport"]:checked')?.value || 'all';
    const cat = document.querySelector('input[name="cat"]:checked')?.value || 'all';
    const price = document.querySelector('input[name="price"]:checked')?.value || 'all';
    const condition = document.querySelector('input[name="condition"]:checked')?.value || 'all';
    const sort = document.getElementById('sort-select')?.value || 'default';

    const brandCheckboxes = document.querySelectorAll('input[name="brand"]:checked');
    const brands = Array.from(brandCheckboxes).map(cb => cb.value);

    return { sport, cat, price, condition, brands, sort };
  }

  // Filter + sort products
  function applyFilters() {
    const f = getFilters();
    let result = [...products];

    if (f.sport !== 'all') result = result.filter(p => p.sport === f.sport);
    if (f.cat !== 'all') result = result.filter(p => p.category === f.cat);
    if (f.brands.length > 0) result = result.filter(p => f.brands.includes(p.brand));
    if (f.condition === 'new') result = result.filter(p => !p.isSecondhand);
    if (f.condition === 'secondhand') result = result.filter(p => p.isSecondhand);

    if (f.price !== 'all') {
      const [min, max] = f.price.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    switch (f.sort) {
      case 'new':         result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'bestseller':  result.sort((a, b) => b.sold - a.sold); break;
      case 'price-asc':   result.sort((a, b) => a.price - b.price); break;
      case 'price-desc':  result.sort((a, b) => b.price - a.price); break;
      case 'discount':    result.sort((a, b) => b.discount - a.discount); break;
    }

    renderGrid(result);
    updatePageTitle(f);
  }

  // Render products grid
  function renderGrid(list) {
    const grid = document.getElementById('products-grid');
    const empty = document.getElementById('products-empty');
    const countEl = document.getElementById('products-count');

    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.style.display = 'block';
    } else {
      if (empty) empty.style.display = 'none';
      grid.innerHTML = list.map(renderProductCard).join('');
    }

    if (countEl) countEl.textContent = `${list.length} sản phẩm`;
  }

  // Update breadcrumb + page title
  function updatePageTitle(f) {
    const titleEl = document.getElementById('page-title');
    const breadEl = document.getElementById('breadcrumb-current');
    let label = 'Tất Cả Sản Phẩm';

    if (f.condition === 'secondhand') label = '♻ Secondhand';
    else if (f.sport !== 'all') label = sportLabels[f.sport] || f.sport;
    else if (f.cat === 'vot') label = 'Vợt Thể Thao';

    if (titleEl) titleEl.textContent = label;
    if (breadEl) breadEl.textContent = label;
  }

  // Mobile filter drawer toggle
  function initFilterToggle() {
    const btn = document.getElementById('filter-toggle');
    const sidebar = document.getElementById('filter-sidebar');
    const overlay = document.getElementById('mobile-overlay');

    if (!btn || !sidebar) return;

    btn.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Reset all filters
  function resetFilters() {
    document.querySelectorAll('input[name="sport"]').forEach(el => { el.checked = el.value === 'all'; });
    document.querySelectorAll('input[name="cat"]').forEach(el => { el.checked = el.value === 'all'; });
    document.querySelectorAll('input[name="price"]').forEach(el => { el.checked = el.value === 'all'; });
    document.querySelectorAll('input[name="condition"]').forEach(el => { el.checked = el.value === 'all'; });
    document.querySelectorAll('input[name="brand"]').forEach(el => { el.checked = false; });
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'default';
    applyFilters();
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    const params = getParams();
    applyParamsToUI(params);
    applyFilters();

    // Listen to filter changes
    document.querySelectorAll('input[name="sport"], input[name="cat"], input[name="price"], input[name="condition"], input[name="brand"]').forEach(el => {
      el.addEventListener('change', applyFilters);
    });

    document.getElementById('sort-select')?.addEventListener('change', applyFilters);
    document.getElementById('filter-clear')?.addEventListener('click', resetFilters);
    document.getElementById('reset-filter')?.addEventListener('click', resetFilters);

    initFilterToggle();
  });
})();

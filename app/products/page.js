'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import supabase from '../../lib/supabase';

const SPORTS = [
  { key: '', label: 'Tất cả môn' },
  { key: 'bong-da', label: '⚽ Bóng đá' },
  { key: 'cau-long', label: '🏸 Cầu lông' },
  { key: 'tennis', label: '🎾 Tennis' },
  { key: 'pickleball', label: '🏓 Pickleball' },
];

const BRANDS = ['Nike', 'Adidas', 'Puma', 'Yonex', 'Victor', 'Wilson', 'Babolat', 'Selkirk', 'Mizuno', 'Joma'];

const PRICE_RANGES = [
  { key: '', label: 'Tất cả giá' },
  { key: '0-500000', label: 'Dưới 500.000₫' },
  { key: '500000-1000000', label: '500K – 1 triệu' },
  { key: '1000000-3000000', label: '1 – 3 triệu' },
  { key: '3000000-999999999', label: 'Trên 3 triệu' },
];

const SORT_OPTIONS = [
  { key: 'created_at-desc', label: 'Mới nhất' },
  { key: 'sold-desc', label: 'Bán chạy nhất' },
  { key: 'price-asc', label: 'Giá tăng dần' },
  { key: 'price-desc', label: 'Giá giảm dần' },
  { key: 'discount-desc', label: 'Giảm giá nhiều nhất' },
];

const PAGE_SIZE = 12;

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}><i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#0057FF' }}></i></div>}>
      <ProductsPageInner />
    </Suspense>
  );
}

function ProductsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Đọc filter từ URL
  const initSport = searchParams.get('sport') || '';
  const initSecondhand = searchParams.get('secondhand') === 'true';
  const initBrand = searchParams.get('brand') || '';
  const initQ = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filters
  const [sport, setSport] = useState(initSport);
  const [isSecondhand, setIsSecondhand] = useState(initSecondhand);
  const [brand, setBrand] = useState(initBrand);
  const [priceRange, setPriceRange] = useState('');
  const [sort, setSort] = useState('created_at-desc');
  const [searchQ, setSearchQ] = useState(initQ);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*', { count: 'exact' });

      if (sport) query = query.eq('sport', sport);
      if (isSecondhand) query = query.eq('is_secondhand', true);
      if (brand) query = query.ilike('brand', brand);
      if (searchQ) query = query.ilike('name', `%${searchQ}%`);

      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        query = query.gte('price', min).lte('price', max);
      }

      const [col, dir] = sort.split('-');
      const ascending = dir === 'asc';
      query = query.order(col, { ascending });

      const from = (page - 1) * PAGE_SIZE;
      query = query.range(from, from + PAGE_SIZE - 1);

      const { data, count, error } = await query;
      if (error) throw error;
      setProducts(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error('Lỗi fetch sản phẩm:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [sport, isSecondhand, brand, priceRange, sort, searchQ, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (sport) params.set('sport', sport);
    if (isSecondhand) params.set('secondhand', 'true');
    if (brand) params.set('brand', brand);
    if (searchQ) params.set('q', searchQ);
    router.replace(`/products?${params.toString()}`, { scroll: false });
  }, [sport, isSecondhand, brand, searchQ]);

  function clearFilters() {
    setSport('');
    setIsSecondhand(false);
    setBrand('');
    setPriceRange('');
    setSearchQ('');
    setPage(1);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pageTitle = isSecondhand
    ? 'Hàng Secondhand'
    : sport
    ? SPORTS.find((s) => s.key === sport)?.label || 'Sản Phẩm'
    : 'Tất Cả Sản Phẩm';

  return (
    <>
      <Header />
      <main>
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Trang chủ</a>
            <span className="breadcrumb__sep"><i className="fa fa-chevron-right"></i></span>
            <span>{pageTitle}</span>
          </nav>

          <div className="products-page">
            <div className="products-topbar">
              <h1 className="products-title">{pageTitle}</h1>
              <div className="products-topbar__right">
                <span className="products-count">{total} sản phẩm</span>
                <select
                  className="sort-select"
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  aria-label="Sắp xếp"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
                <button
                  className="filter-toggle-btn"
                  onClick={() => setFilterOpen(true)}
                  aria-label="Bộ lọc"
                >
                  <i className="fa fa-filter"></i> Bộ lọc
                </button>
              </div>
            </div>

            <div className="products-layout">
              {/* Filter Overlay - Mobile */}
              {filterOpen && (
                <div
                  className="mobile-overlay active"
                  onClick={() => setFilterOpen(false)}
                />
              )}

              {/* Filter Sidebar */}
              <aside className={`filter-sidebar${filterOpen ? ' open' : ''}`} aria-label="Bộ lọc sản phẩm">
                <div className="filter-sidebar__header">
                  <span className="filter-sidebar__title">
                    <i className="fa fa-filter"></i> Bộ lọc
                  </span>
                  <button className="filter-clear-btn" onClick={clearFilters}>Xóa tất cả</button>
                </div>

                {/* Loại sản phẩm */}
                <div className="filter-group">
                  <div className="filter-group__title">Loại sản phẩm</div>
                  <div className="filter-options">
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="condition"
                        checked={!isSecondhand}
                        onChange={() => { setIsSecondhand(false); setPage(1); }}
                      />
                      Hàng mới
                    </label>
                    <label className="filter-option filter-option--secondhand">
                      <input
                        type="radio"
                        name="condition"
                        checked={isSecondhand}
                        onChange={() => { setIsSecondhand(true); setPage(1); }}
                      />
                      <span>♻ Secondhand</span>
                    </label>
                  </div>
                </div>

                {/* Môn thể thao */}
                <div className="filter-group">
                  <div className="filter-group__title">Môn thể thao</div>
                  <div className="filter-options">
                    {SPORTS.map((s) => (
                      <label key={s.key} className="filter-option">
                        <input
                          type="radio"
                          name="sport"
                          checked={sport === s.key}
                          onChange={() => { setSport(s.key); setPage(1); }}
                        />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Thương hiệu */}
                <div className="filter-group">
                  <div className="filter-group__title">Thương hiệu</div>
                  <div className="filter-options">
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="brand"
                        checked={brand === ''}
                        onChange={() => { setBrand(''); setPage(1); }}
                      />
                      Tất cả
                    </label>
                    {BRANDS.map((b) => (
                      <label key={b} className="filter-option">
                        <input
                          type="radio"
                          name="brand"
                          checked={brand.toLowerCase() === b.toLowerCase()}
                          onChange={() => { setBrand(b); setPage(1); }}
                        />
                        {b}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Khoảng giá */}
                <div className="filter-group">
                  <div className="filter-group__title">Khoảng giá</div>
                  <div className="filter-options">
                    {PRICE_RANGES.map((r) => (
                      <label key={r.key} className="filter-option">
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === r.key}
                          onChange={() => { setPriceRange(r.key); setPage(1); }}
                        />
                        {r.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Đóng filter - mobile */}
                <div style={{ padding: 16 }}>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setFilterOpen(false)}
                  >
                    Xem {total} sản phẩm
                  </button>
                </div>
              </aside>

              {/* Products grid */}
              <div className="products-main">
                {loading ? (
                  <div className="product-grid product-grid--4col">
                    {Array(PAGE_SIZE).fill(0).map((_, i) => (
                      <div key={i} className="product-card">
                        <div className="skeleton" style={{ aspectRatio: '1', width: '100%' }}></div>
                        <div style={{ padding: 10 }}>
                          <div className="skeleton" style={{ height: 12, marginBottom: 8, width: '60%' }}></div>
                          <div className="skeleton" style={{ height: 16, marginBottom: 8 }}></div>
                          <div className="skeleton" style={{ height: 20, width: '40%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="products-empty">
                    <i className="fa fa-search"></i>
                    <p>Không tìm thấy sản phẩm phù hợp</p>
                    <button className="btn btn-outline" onClick={clearFilters}>
                      Xóa bộ lọc
                    </button>
                  </div>
                ) : (
                  <div className="product-grid product-grid--4col">
                    {products.map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <i className="fa fa-chevron-left"></i>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => Math.abs(p - page) <= 2)
                      .map((p) => (
                        <button
                          key={p}
                          className={`btn btn-sm${p === page ? ' btn-primary' : ' btn-outline'}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      ))}
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <i className="fa fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

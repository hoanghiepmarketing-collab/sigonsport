'use client';

import { useState, useEffect, useRef } from 'react';
import supabase from '../../../lib/supabase';
import { formatPrice } from '../../../lib/format';

const EMPTY = {
  name: '', brand: '', sport: '', category: '', price: '', original_price: '',
  discount: 0, description: '', img: '', sizes: '', colors: '',
  is_hot: false, is_new: false, is_secondhand: false, in_stock: true,
  rating: '', review_count: 0, sold: 0, condition: '',
};

const SPORTS = [
  { value: 'bong-da',    label: '⚽ Bóng Đá' },
  { value: 'cau-long',   label: '🏸 Cầu Lông' },
  { value: 'tennis',     label: '🎾 Tennis' },
  { value: 'pickleball', label: '🏓 Pickleball' },
  { value: 'chay-bo',    label: '🏃 Chạy Bộ' },
  { value: 'khac',       label: '🏅 Khác' },
];

export default function AdminProductsPage() {
  const [products, setProducts]         = useState([]);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [sportFilter, setSportFilter]   = useState('all');
  const [modal, setModal]               = useState(null);
  const [form, setForm]                 = useState(EMPTY);
  const [imgPreview, setImgPreview]     = useState('');
  const [uploading, setUploading]       = useState(false);
  const [saving, setSaving]             = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('id, name, slug, type, sport').order('sort_order').order('name');
    setCategories(data || []);
  }

  function openAdd() {
    setForm(EMPTY);
    setImgPreview('');
    setModal('add');
  }

  function openEdit(product) {
    setForm({
      ...product,
      sizes:  Array.isArray(product.sizes)  ? product.sizes.join(', ')  : '',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
    });
    setImgPreview(product.img || '');
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setForm(EMPTY);
    setImgPreview('');
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    // Sync img preview when URL typed manually
    if (name === 'img') setImgPreview(value);
  }

  // Upload ảnh từ máy tính lên Supabase Storage
  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Hiển thị preview ngay lập tức
    const localUrl = URL.createObjectURL(file);
    setImgPreview(localUrl);

    setUploading(true);
    try {
      const ext  = file.name.split('.').pop().toLowerCase();
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (upErr) {
        // Bucket chưa tạo hoặc lỗi → giữ local URL làm preview, form.img để trống
        console.warn('Storage upload failed:', upErr.message);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      setForm(f => ({ ...f, img: publicUrl }));
      setImgPreview(publicUrl);
    } catch (err) {
      console.warn('Upload error:', err);
    }
    setUploading(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name:           form.name.trim(),
      brand:          form.brand.trim(),
      sport:          form.sport,
      category:       form.category,
      price:          parseInt(form.price) || 0,
      original_price: form.original_price ? parseInt(form.original_price) : null,
      discount:       parseInt(form.discount) || 0,
      description:    form.description.trim(),
      img:            form.img.trim(),
      sizes:          form.sizes  ? form.sizes.split(',').map(s => s.trim()).filter(Boolean)  : [],
      colors:         form.colors ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
      is_hot:         form.is_hot,
      is_new:         form.is_new,
      is_secondhand:  form.is_secondhand,
      in_stock:       form.in_stock,
      rating:         form.rating ? parseFloat(form.rating) : null,
      review_count:   parseInt(form.review_count) || 0,
      sold:           parseInt(form.sold) || 0,
      condition:      form.condition?.trim() || null,
    };

    if (modal === 'edit') {
      await supabase.from('products').update(payload).eq('id', form.id);
    } else {
      await supabase.from('products').insert(payload);
    }

    await fetchProducts();
    setSaving(false);
    closeModal();
  }

  async function handleDelete(id) {
    await supabase.from('products').delete().eq('id', id);
    setDeleteConfirm(null);
    fetchProducts();
  }

  // Filter categories by selected sport for smarter dropdown
  const filteredCats = categories.filter(c =>
    !form.sport || !c.sport || c.sport === form.sport
  );

  const filtered = products.filter(p => {
    const matchSport = sportFilter === 'all' || p.sport === sportFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q);
    return matchSport && matchSearch;
  });

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Sản phẩm</h1>
        <button onClick={openAdd} style={{
          padding: '9px 18px', background: '#2563eb', color: '#fff',
          border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <i className="fas fa-plus"></i> Thêm sản phẩm
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setSportFilter('all')} style={tabSt(sportFilter === 'all')}>
          Tất cả ({products.length})
        </button>
        {SPORTS.map(s => {
          const cnt = products.filter(p => p.sport === s.value).length;
          return cnt > 0 ? (
            <button key={s.value} onClick={() => setSportFilter(s.value)} style={tabSt(sportFilter === s.value)}>
              {s.label} ({cnt})
            </button>
          ) : null;
        })}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input type="text" placeholder="Tìm tên, thương hiệu..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '9px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, width: 280, outline: 'none' }}
        />
        <span style={{ marginLeft: 12, color: '#94a3b8', fontSize: 13 }}>{filtered.length} sản phẩm</span>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.08)', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Sản phẩm', 'Môn', 'Danh mục', 'Giá', 'Trạng thái', 'Nhãn', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 700, borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Đang tải...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Không có sản phẩm</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={p.img || 'https://placehold.co/48x48/f0f4ff/0057FF?text=SP'} alt={p.name}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: 12 }}>{p.brand}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 14px', color: '#475569', fontSize: 12 }}>{p.sport || '—'}</td>
                <td style={{ padding: '12px 14px' }}>
                  {p.category ? (
                    <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: '#f1f5f9', color: '#475569' }}>
                      {categories.find(c => c.slug === p.category)?.name || p.category}
                    </span>
                  ) : <span style={{ color: '#cbd5e1' }}>—</span>}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ fontWeight: 700, color: '#E5002B' }}>{formatPrice(p.price)}</div>
                  {p.original_price && <div style={{ color: '#94a3b8', fontSize: 11, textDecoration: 'line-through' }}>{formatPrice(p.original_price)}</div>}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: p.in_stock ? '#dcfce7' : '#fee2e2', color: p.in_stock ? '#166534' : '#991b1b' }}>
                    {p.in_stock ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {p.is_hot       && <span style={{ padding: '2px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700, background: '#E5002B', color: '#fff' }}>HOT</span>}
                    {p.is_new       && <span style={{ padding: '2px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700, background: '#FF6B00', color: '#fff' }}>MỚI</span>}
                    {p.is_secondhand && <span style={{ padding: '2px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700, background: '#8B6914', color: '#fff' }}>2ND</span>}
                  </div>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(p)} style={{ padding: '5px 12px', borderRadius: 6, border: '1.5px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#475569' }}>
                      <i className="fas fa-edit"></i> Sửa
                    </button>
                    <button onClick={() => setDeleteConfirm(p)} style={{ padding: '5px 10px', borderRadius: 6, border: '1.5px solid #fecaca', background: '#fff5f5', cursor: 'pointer', fontSize: 12, color: '#ef4444' }}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 680, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18 }}>
                {modal === 'add' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94a3b8' }}>×</button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

                {/* Tên */}
                <Field label="Tên sản phẩm *" span>
                  <input name="name" required value={form.name} onChange={handleChange} className="admin-input" />
                </Field>

                {/* Thương hiệu */}
                <Field label="Thương hiệu">
                  <input name="brand" value={form.brand} onChange={handleChange} className="admin-input" />
                </Field>

                {/* Môn */}
                <Field label="Môn thể thao">
                  <select name="sport" value={form.sport} onChange={handleChange} className="admin-input">
                    <option value="">— Chọn môn —</option>
                    {SPORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>

                {/* Danh mục — dropdown từ bảng categories */}
                <Field label="Danh mục" span>
                  <select name="category" value={form.category} onChange={handleChange} className="admin-input">
                    <option value="">— Chọn danh mục —</option>
                    {filteredCats.length > 0 ? (
                      filteredCats.map(c => (
                        <option key={c.id} value={c.slug}>{c.name} ({c.slug})</option>
                      ))
                    ) : (
                      <option disabled>Chưa có danh mục — vào trang Danh mục để tạo</option>
                    )}
                  </select>
                </Field>

                {/* Giá */}
                <Field label="Giá bán (VNĐ) *">
                  <input name="price" type="number" required value={form.price} onChange={handleChange} className="admin-input" />
                </Field>
                <Field label="Giá gốc (VNĐ)">
                  <input name="original_price" type="number" value={form.original_price} onChange={handleChange} className="admin-input" />
                </Field>

                {/* Ảnh — upload + URL */}
                <Field label="Ảnh sản phẩm" span>
                  {/* Preview */}
                  {imgPreview && (
                    <div style={{ marginBottom: 10 }}>
                      <img src={imgPreview} alt="preview"
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10, border: '2px solid #e2e8f0' }}
                        onError={() => setImgPreview('')}
                      />
                    </div>
                  )}
                  {/* Upload từ máy tính */}
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                      style={{ padding: '8px 16px', borderRadius: 7, border: '1.5px solid #2563eb', background: uploading ? '#f1f5f9' : '#eff6ff', color: '#2563eb', cursor: 'pointer', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap' }}>
                      {uploading
                        ? <><i className="fas fa-spinner fa-spin"></i> Đang tải lên...</>
                        : <><i className="fas fa-upload"></i> Chọn ảnh từ máy</>}
                    </button>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>hoặc nhập URL bên dưới</span>
                  </div>
                  {/* URL thủ công */}
                  <input name="img" value={form.img} onChange={handleChange} className="admin-input" placeholder="https://..." />
                </Field>

                {/* Sizes & Colors */}
                <Field label="Sizes (cách nhau bởi dấu phẩy)" span>
                  <input name="sizes" value={form.sizes} onChange={handleChange} className="admin-input" placeholder="38, 39, 40, 41" />
                </Field>
                <Field label="Màu sắc (cách nhau bởi dấu phẩy)" span>
                  <input name="colors" value={form.colors} onChange={handleChange} className="admin-input" placeholder="Đen/Trắng, Đỏ/Xanh" />
                </Field>

                {/* Mô tả */}
                <Field label="Mô tả" span>
                  <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="admin-input" style={{ resize: 'vertical' }} />
                </Field>

                {/* Condition (secondhand) */}
                {form.is_secondhand && (
                  <Field label="Tình trạng (secondhand)" span>
                    <input name="condition" value={form.condition} onChange={handleChange} className="admin-input" placeholder="Mới 90%, đã dùng ~10 buổi" />
                  </Field>
                )}

                {/* Checkboxes */}
                <div style={{ gridColumn: '1/-1', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {[
                    { name: 'in_stock',      label: '✅ Còn hàng' },
                    { name: 'is_hot',        label: '🔥 HOT' },
                    { name: 'is_new',        label: '🆕 MỚI' },
                    { name: 'is_secondhand', label: '♻️ Secondhand' },
                  ].map(cb => (
                    <label key={cb.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer', userSelect: 'none' }}>
                      <input type="checkbox" name={cb.name} checked={!!form[cb.name]} onChange={handleChange} />
                      {cb.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button type="button" onClick={closeModal} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#475569' }}>Hủy</button>
                <button type="submit" disabled={saving} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                  {saving ? <><i className="fas fa-spinner fa-spin"></i> Đang lưu...</> : (modal === 'add' ? 'Thêm sản phẩm' : 'Lưu thay đổi')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontWeight: 800, marginBottom: 8 }}>Xóa sản phẩm?</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
              Bạn sắp xóa <strong>{deleteConfirm.name}</strong>. Hành động này không thể hoàn tác.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Hủy</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-input {
          width: 100%; padding: 8px 12px; border-radius: 7px;
          border: 1.5px solid #e2e8f0; font-size: 14px; outline: none;
          font-family: inherit; box-sizing: border-box; transition: border-color 0.15s;
        }
        .admin-input:focus { border-color: #2563eb; }
      `}</style>
    </div>
  );
}

function Field({ label, children, span }) {
  return (
    <div style={{ gridColumn: span ? '1/-1' : undefined }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .5 }}>{label}</label>
      {children}
    </div>
  );
}

function tabSt(active) {
  return {
    padding: '6px 14px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
    background: active ? '#2563eb' : '#f1f5f9',
    color:      active ? '#fff'    : '#64748b',
  };
}

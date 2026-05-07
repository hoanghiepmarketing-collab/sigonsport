'use client';

import { useState, useEffect } from 'react';
import supabase from '../../../lib/supabase';
import { formatPrice } from '../../../lib/format';

const EMPTY = {
  name: '', brand: '', sport: '', category: '', price: '', original_price: '',
  discount: 0, description: '', img: '', sizes: '', colors: '',
  is_hot: false, is_new: false, is_secondhand: false, in_stock: true,
  rating: '', review_count: 0, sold: 0, condition: '',
};

const SPORTS = ['bong-da', 'cau-long', 'tennis', 'pickleball', 'chay-bo', 'khac'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  function openAdd() {
    setForm(EMPTY);
    setModal('add');
  }

  function openEdit(product) {
    setForm({
      ...product,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
    });
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setForm(EMPTY);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name:           form.name.trim(),
      brand:          form.brand.trim(),
      sport:          form.sport,
      category:       form.category.trim(),
      price:          parseInt(form.price) || 0,
      original_price: form.original_price ? parseInt(form.original_price) : null,
      discount:       parseInt(form.discount) || 0,
      description:    form.description.trim(),
      img:            form.img.trim(),
      sizes:          form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
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

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return !q || p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q);
  });

  return (
    <div style={{ padding: 28 }}>
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

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text" placeholder="Tìm tên, thương hiệu..."
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
              {['Sản phẩm', 'Môn', 'Giá', 'Trạng thái', 'Nhãn', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 700, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Đang tải...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Không có sản phẩm</td></tr>
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
                <td style={{ padding: '12px 14px', color: '#475569' }}>{p.sport}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ fontWeight: 700, color: '#E5002B' }}>{formatPrice(p.price)}</div>
                  {p.original_price && <div style={{ color: '#94a3b8', fontSize: 11, textDecoration: 'line-through' }}>{formatPrice(p.original_price)}</div>}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                    background: p.in_stock ? '#dcfce7' : '#fee2e2',
                    color: p.in_stock ? '#166534' : '#991b1b',
                  }}>
                    {p.in_stock ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {p.is_hot && <span style={{ padding: '2px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700, background: '#E5002B', color: '#fff' }}>HOT</span>}
                    {p.is_new && <span style={{ padding: '2px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700, background: '#FF6B00', color: '#fff' }}>MỚI</span>}
                    {p.is_secondhand && <span style={{ padding: '2px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700, background: '#8B6914', color: '#fff' }}>2ND</span>}
                  </div>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(p)} style={{ padding: '5px 12px', borderRadius: 6, border: '1.5px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#475569' }}>
                      <i className="fas fa-edit"></i> Sửa
                    </button>
                    <button onClick={() => setDeleteConfirm(p)} style={{ padding: '5px 12px', borderRadius: 6, border: '1.5px solid #fecaca', background: '#fff5f5', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#ef4444' }}>
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
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 640, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18 }}>
                {modal === 'add' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94a3b8' }}>×</button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Tên sản phẩm *" style={{ gridColumn: '1/-1' }}>
                  <input name="name" required value={form.name} onChange={handleChange} className="admin-input" />
                </Field>
                <Field label="Thương hiệu">
                  <input name="brand" value={form.brand} onChange={handleChange} className="admin-input" />
                </Field>
                <Field label="Môn thể thao">
                  <select name="sport" value={form.sport} onChange={handleChange} className="admin-input">
                    <option value="">— Chọn —</option>
                    {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Giá bán (VNĐ) *">
                  <input name="price" type="number" required value={form.price} onChange={handleChange} className="admin-input" />
                </Field>
                <Field label="Giá gốc (VNĐ)">
                  <input name="original_price" type="number" value={form.original_price} onChange={handleChange} className="admin-input" />
                </Field>
                <Field label="Link ảnh" style={{ gridColumn: '1/-1' }}>
                  <input name="img" value={form.img} onChange={handleChange} className="admin-input" placeholder="https://..." />
                </Field>
                <Field label="Sizes (cách nhau bởi dấu phẩy)" style={{ gridColumn: '1/-1' }}>
                  <input name="sizes" value={form.sizes} onChange={handleChange} className="admin-input" placeholder="38, 39, 40, 41" />
                </Field>
                <Field label="Màu sắc (cách nhau bởi dấu phẩy)" style={{ gridColumn: '1/-1' }}>
                  <input name="colors" value={form.colors} onChange={handleChange} className="admin-input" placeholder="Đen/Trắng, Đỏ/Xanh" />
                </Field>
                <Field label="Mô tả" style={{ gridColumn: '1/-1' }}>
                  <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="admin-input" />
                </Field>
                {form.is_secondhand && (
                  <Field label="Tình trạng (secondhand)" style={{ gridColumn: '1/-1' }}>
                    <input name="condition" value={form.condition} onChange={handleChange} className="admin-input" placeholder="Mới 90%, đã dùng ~10 buổi" />
                  </Field>
                )}

                {/* Checkboxes */}
                <div style={{ gridColumn: '1/-1', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {[
                    { name: 'in_stock', label: 'Còn hàng' },
                    { name: 'is_hot', label: 'HOT' },
                    { name: 'is_new', label: 'MỚI' },
                    { name: 'is_secondhand', label: 'Secondhand' },
                  ].map(cb => (
                    <label key={cb.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
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
          font-family: inherit; box-sizing: border-box;
          transition: border-color 0.15s;
        }
        .admin-input:focus { border-color: #2563eb; }
      `}</style>
    </div>
  );
}

function Field({ label, children, style }) {
  return (
    <div style={style}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .5 }}>{label}</label>
      {children}
    </div>
  );
}

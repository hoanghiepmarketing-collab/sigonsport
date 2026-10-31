'use client';

import { useState, useEffect } from 'react';
import supabase from '../../../lib/supabase';

// Danh mục mặc định từ frontend
const DEFAULT_CATEGORIES = [
  // Theo môn thể thao
  { name: 'Bóng Đá',    slug: 'bong-da',    type: 'sport', icon: '⚽', sort_order: 1 },
  { name: 'Cầu Lông',   slug: 'cau-long',   type: 'sport', icon: '🏸', sort_order: 2 },
  { name: 'Tennis',     slug: 'tennis',     type: 'sport', icon: '🎾', sort_order: 3 },
  { name: 'Pickleball', slug: 'pickleball', type: 'sport', icon: '🏓', sort_order: 4 },
  { name: 'Chạy Bộ',   slug: 'chay-bo',    type: 'sport', icon: '🏃', sort_order: 5 },
  // Theo loại sản phẩm
  { name: 'Giày thể thao',        slug: 'giay',      type: 'product', icon: '👟', sort_order: 10 },
  { name: 'Vợt thể thao',         slug: 'vot',       type: 'product', icon: '🏸', sort_order: 11 },
  { name: 'Dụng cụ & Phụ kiện',  slug: 'phu-kien',  type: 'product', icon: '🎒', sort_order: 12 },
  // Danh mục con
  { name: 'Giày Bóng Đá',         slug: 'giay-bong-da',   type: 'sub', sport: 'bong-da',   icon: '⚽', sort_order: 20 },
  { name: 'Giày Cầu Lông',        slug: 'giay-cau-long',  type: 'sub', sport: 'cau-long',  icon: '🏸', sort_order: 21 },
  { name: 'Giày Tennis',          slug: 'giay-tennis',    type: 'sub', sport: 'tennis',    icon: '🎾', sort_order: 22 },
  { name: 'Giày Pickleball',      slug: 'giay-pickleball',type: 'sub', sport: 'pickleball',icon: '🏓', sort_order: 23 },
  { name: 'Giày Chạy Bộ',        slug: 'giay-chay-bo',   type: 'sub', sport: 'chay-bo',   icon: '🏃', sort_order: 24 },
  { name: 'Secondhand',           slug: 'secondhand',     type: 'sub', icon: '♻️', sort_order: 30 },
];

const TYPE_LABELS = {
  sport:   { label: 'Môn thể thao', bg: '#eff6ff', color: '#1d4ed8' },
  product: { label: 'Loại SP',      bg: '#f0fdf4', color: '#15803d' },
  sub:     { label: 'Danh mục con', bg: '#faf5ff', color: '#7e22ce' },
};

const EMPTY_FORM = { name: '', slug: '', type: 'sub', sport: '', icon: '', description: '', sort_order: 0 };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [seeding, setSeeding]       = useState(false);
  const [modal, setModal]           = useState(null); // null | 'add' | 'edit'
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch]         = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('sort_order').order('name');
    setCategories(data || []);
    setLoading(false);
  }

  // Auto-slug từ tên tiếng Việt
  function toSlug(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => {
      const next = { ...f, [name]: value };
      if (name === 'name' && modal === 'add') next.slug = toSlug(value);
      return next;
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) return;
    setSaving(true);
    const payload = {
      name:        form.name.trim(),
      slug:        form.slug.trim(),
      type:        form.type,
      sport:       form.sport?.trim() || null,
      icon:        form.icon?.trim() || null,
      description: form.description?.trim() || null,
      sort_order:  parseInt(form.sort_order) || 0,
    };
    if (modal === 'edit') {
      await supabase.from('categories').update(payload).eq('id', form.id);
    } else {
      await supabase.from('categories').insert(payload);
    }
    await fetchCategories();
    setSaving(false);
    setModal(null);
    setForm(EMPTY_FORM);
  }

  async function handleDelete(id) {
    await supabase.from('categories').delete().eq('id', id);
    setDeleteConfirm(null);
    fetchCategories();
  }

  async function seedDefaults() {
    setSeeding(true);
    for (const cat of DEFAULT_CATEGORIES) {
      await supabase.from('categories').upsert(cat, { onConflict: 'slug' });
    }
    await fetchCategories();
    setSeeding(false);
  }

  const filtered = categories.filter(c => {
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.slug?.includes(q);
    return matchType && matchSearch;
  });

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Danh mục</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>{categories.length} danh mục</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {categories.length === 0 && (
            <button onClick={seedDefaults} disabled={seeding} style={{
              padding: '9px 18px', background: '#16a34a', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 8, opacity: seeding ? .7 : 1,
            }}>
              <i className={seeding ? 'fas fa-spinner fa-spin' : 'fas fa-wand-magic-sparkles'}></i>
              {seeding ? 'Đang tạo...' : 'Tạo danh mục mặc định'}
            </button>
          )}
          <button onClick={() => { setForm(EMPTY_FORM); setModal('add'); }} style={{
            padding: '9px 18px', background: '#2563eb', color: '#fff',
            border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <i className="fas fa-plus"></i> Thêm danh mục
          </button>
        </div>
      </div>

      {/* Filter + Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {['all', 'sport', 'product', 'sub'].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} style={{
            padding: '6px 14px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            background: typeFilter === t ? '#2563eb' : '#f1f5f9',
            color:      typeFilter === t ? '#fff'    : '#64748b',
          }}>
            {t === 'all' ? `Tất cả (${categories.length})` : `${TYPE_LABELS[t]?.label} (${categories.filter(c => c.type === t).length})`}
          </button>
        ))}
        <input type="text" placeholder="Tìm danh mục..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', marginLeft: 'auto', width: 220 }} />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.08)', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Icon', 'Tên danh mục', 'Slug', 'Loại', 'Môn', 'Thứ tự', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 700, borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Đang tải...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 40, textAlign: 'center' }}>
                  <div style={{ color: '#94a3b8', marginBottom: 12 }}>Chưa có danh mục nào</div>
                  {categories.length === 0 && (
                    <button onClick={seedDefaults} disabled={seeding} style={{
                      padding: '8px 18px', background: '#16a34a', color: '#fff', border: 'none',
                      borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13,
                    }}>
                      <i className="fas fa-wand-magic-sparkles" style={{ marginRight: 6 }}></i>
                      Tạo danh mục từ dữ liệu mặc định
                    </button>
                  )}
                </td>
              </tr>
            ) : filtered.map(cat => {
              const t = TYPE_LABELS[cat.type] || TYPE_LABELS.sub;
              return (
                <tr key={cat.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '10px 14px', fontSize: 20 }}>{cat.icon || '📁'}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>{cat.name}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <code style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#475569' }}>{cat.slug}</code>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: t.bg, color: t.color }}>{t.label}</span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 12 }}>{cat.sport || '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: 12, textAlign: 'center' }}>{cat.sort_order}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { setForm(cat); setModal('edit'); }} style={{
                        padding: '5px 12px', borderRadius: 6, border: '1.5px solid #e2e8f0',
                        background: '#f8fafc', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#475569',
                      }}><i className="fas fa-edit"></i> Sửa</button>
                      <button onClick={() => setDeleteConfirm(cat)} style={{
                        padding: '5px 10px', borderRadius: 6, border: '1.5px solid #fecaca',
                        background: '#fff5f5', cursor: 'pointer', fontSize: 12, color: '#ef4444',
                      }}><i className="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18 }}>
                {modal === 'add' ? 'Thêm danh mục' : 'Chỉnh sửa danh mục'}
              </h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94a3b8' }}>×</button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <F label="Tên danh mục *" span>
                  <input name="name" required value={form.name} onChange={handleChange} className="cat-input" placeholder="VD: Giày Bóng Đá" />
                </F>
                <F label="Slug *" span>
                  <input name="slug" required value={form.slug} onChange={handleChange} className="cat-input" placeholder="giay-bong-da" />
                  <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 3, display: 'block' }}>Tự động tạo từ tên, có thể chỉnh sửa</span>
                </F>
                <F label="Loại danh mục">
                  <select name="type" value={form.type} onChange={handleChange} className="cat-input">
                    <option value="sport">Môn thể thao</option>
                    <option value="product">Loại sản phẩm</option>
                    <option value="sub">Danh mục con</option>
                  </select>
                </F>
                <F label="Icon (emoji)">
                  <input name="icon" value={form.icon || ''} onChange={handleChange} className="cat-input" placeholder="⚽" />
                </F>
                <F label="Môn thể thao liên quan">
                  <input name="sport" value={form.sport || ''} onChange={handleChange} className="cat-input" placeholder="bong-da, cau-long..." />
                </F>
                <F label="Thứ tự hiển thị">
                  <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className="cat-input" />
                </F>
                <F label="Mô tả" span>
                  <textarea name="description" rows={2} value={form.description || ''} onChange={handleChange} className="cat-input" style={{ resize: 'none' }} placeholder="Mô tả ngắn về danh mục..." />
                </F>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModal(null)} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#475569' }}>Hủy</button>
                <button type="submit" disabled={saving} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                  {saving ? <><i className="fas fa-spinner fa-spin"></i> Đang lưu...</> : (modal === 'add' ? 'Thêm danh mục' : 'Lưu thay đổi')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, maxWidth: 360, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontWeight: 800, marginBottom: 8 }}>Xóa danh mục?</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
              Bạn sắp xóa danh mục <strong>{deleteConfirm.name}</strong>. Sản phẩm thuộc danh mục này sẽ không bị xóa.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Hủy</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cat-input {
          width: 100%; padding: 8px 12px; border-radius: 7px;
          border: 1.5px solid #e2e8f0; font-size: 14px; outline: none;
          font-family: inherit; box-sizing: border-box; transition: border-color 0.15s;
        }
        .cat-input:focus { border-color: #2563eb; }
      `}</style>
    </div>
  );
}

function F({ label, children, span }) {
  return (
    <div style={{ gridColumn: span ? '1/-1' : undefined }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .5 }}>{label}</label>
      {children}
    </div>
  );
}

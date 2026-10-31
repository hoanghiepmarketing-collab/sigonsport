'use client';

import { useState } from 'react';
import supabase from '../../lib/supabase';

const SOURCES = [
  { value: 'manual',    label: 'Nhập tay',     icon: 'fa-pen', color: '#475569' },
  { value: 'facebook',  label: 'Facebook',     icon: 'fa-facebook',  color: '#1877f2' },
  { value: 'zalo',      label: 'Zalo',         icon: 'fa-comment',   color: '#0068ff' },
  { value: 'referral',  label: 'Giới thiệu',   icon: 'fa-user-plus', color: '#9333ea' },
  { value: 'walkin',    label: 'Tại cửa hàng', icon: 'fa-store',     color: '#ea580c' },
];

export default function CreateCustomerModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', province: '', note: '', source: 'manual',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Vui lòng nhập họ tên và số điện thoại.');
      return;
    }
    setSaving(true);
    setError('');

    const { error: err } = await supabase.from('customers').insert({
      name:     form.name.trim(),
      phone:    form.phone.trim(),
      email:    form.email.trim() || null,
      address:  form.address.trim() || null,
      province: form.province.trim() || null,
      note:     form.note.trim() || null,
      source:   form.source,
    });

    setSaving(false);
    if (err) { setError(err.message); return; }
    onCreated?.();
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 17, color: '#0f172a' }}>Thêm khách hàng</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Lưu thông tin liên hệ mới vào danh bạ</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#94a3b8' }}>×</button>
        </div>

        <form onSubmit={handleSave} style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <F label="Họ và tên *">
              <input name="name" value={form.name} onChange={handleChange} required
                placeholder="Nguyễn Văn A" style={inpSt} />
            </F>
            <F label="Số điện thoại *">
              <input name="phone" value={form.phone} onChange={handleChange} required
                placeholder="0901234567" style={inpSt} />
            </F>
            <F label="Email" span={false}>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="email@example.com" style={inpSt} />
            </F>
            <F label="Tỉnh / Thành phố">
              <input name="province" value={form.province} onChange={handleChange}
                placeholder="TP. Hồ Chí Minh" style={inpSt} />
            </F>
            <F label="Địa chỉ" span>
              <input name="address" value={form.address} onChange={handleChange}
                placeholder="Số nhà, đường, phường..." style={inpSt} />
            </F>
            <F label="Ghi chú" span>
              <textarea name="note" value={form.note} onChange={handleChange} rows={2}
                placeholder="Khách VIP, sở thích, lưu ý..." style={{ ...inpSt, resize: 'none' }} />
            </F>
          </div>

          {/* Nguồn khách hàng */}
          <div style={{ marginTop: 16 }}>
            <label style={lblSt}>Nguồn khách hàng</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 6 }}>
              {SOURCES.map(s => (
                <button key={s.value} type="button" onClick={() => setForm(f => ({ ...f, source: s.value }))} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  border: form.source === s.value ? `2px solid ${s.color}` : '2px solid #e2e8f0',
                  background: form.source === s.value ? s.color + '15' : '#fff',
                  color: form.source === s.value ? s.color : '#64748b',
                }}>
                  <i className={`fas ${s.icon}`} style={{ fontSize: 12 }}></i> {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 7, fontSize: 13, color: '#dc2626' }}>
              <i className="fas fa-triangle-exclamation" style={{ marginRight: 6 }}></i>{error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
            <button type="button" onClick={onClose}
              style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#475569' }}>
              Hủy
            </button>
            <button type="submit" disabled={saving}
              style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
              {saving ? <><i className="fas fa-spinner fa-spin"></i> Đang lưu...</> : <><i className="fas fa-user-plus"></i> Thêm khách hàng</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function F({ label, children, span }) {
  return (
    <div style={{ gridColumn: span ? '1/-1' : undefined }}>
      <label style={lblSt}>{label}</label>
      {children}
    </div>
  );
}

const lblSt = { display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .5 };
const inpSt = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };

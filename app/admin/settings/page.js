'use client';

import { useState, useEffect } from 'react';

const DEFAULT_SETTINGS = {
  store_name:        'SIGON SPORT',
  store_tagline:     'Năng động mỗi ngày — Chất lượng mỗi bước',
  store_phone:       '',
  store_email:       '',
  store_address:     '',
  store_province:    '',
  facebook_url:      '',
  zalo_phone:        '',
  instagram_url:     '',
  free_ship_threshold: 500000,
  shipping_fee:        35000,
  cod_enabled:         true,
  bank_enabled:        true,
  bank_name:           '',
  bank_account:        '',
  bank_owner:          '',
};

const SECTIONS = [
  {
    id: 'store',
    icon: 'fa-store',
    title: 'Thông tin cửa hàng',
    fields: [
      { key: 'store_name',     label: 'Tên cửa hàng',   type: 'text',  required: true },
      { key: 'store_tagline',  label: 'Slogan',          type: 'text'  },
      { key: 'store_phone',    label: 'Số điện thoại',   type: 'tel'   },
      { key: 'store_email',    label: 'Email',           type: 'email' },
      { key: 'store_address',  label: 'Địa chỉ',         type: 'text', span: 2 },
      { key: 'store_province', label: 'Tỉnh / Thành phố', type: 'text' },
    ],
  },
  {
    id: 'social',
    icon: 'fa-share-nodes',
    title: 'Mạng xã hội',
    fields: [
      { key: 'facebook_url',  label: 'Facebook URL',  type: 'url', placeholder: 'https://facebook.com/...' },
      { key: 'instagram_url', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/...' },
      { key: 'zalo_phone',    label: 'Zalo (SĐT)',    type: 'tel', placeholder: '0901234567' },
    ],
  },
  {
    id: 'shipping',
    icon: 'fa-truck',
    title: 'Vận chuyển',
    fields: [
      { key: 'free_ship_threshold', label: 'Miễn phí ship từ (VNĐ)', type: 'number' },
      { key: 'shipping_fee',        label: 'Phí vận chuyển (VNĐ)',   type: 'number' },
    ],
  },
  {
    id: 'payment',
    icon: 'fa-credit-card',
    title: 'Thanh toán',
    fields: [
      { key: 'bank_name',    label: 'Tên ngân hàng',  type: 'text', placeholder: 'VCB, MB, Techcombank...' },
      { key: 'bank_account', label: 'Số tài khoản',   type: 'text' },
      { key: 'bank_owner',   label: 'Chủ tài khoản',  type: 'text' },
    ],
    toggles: [
      { key: 'cod_enabled',  label: 'Cho phép thanh toán COD (tiền mặt)' },
      { key: 'bank_enabled', label: 'Cho phép chuyển khoản ngân hàng'    },
    ],
  },
];

const STORAGE_KEY = 'sigon_admin_settings';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('store');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setSettings(s => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleSave(e) {
    e.preventDefault();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const currentSection = SECTIONS.find(s => s.id === activeSection);

  return (
    <div style={{ padding: 28, maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Cài đặt</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Cấu hình thông tin cửa hàng và các tùy chọn hệ thống</p>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Sidebar nav */}
        <div style={{ width: 200, flexShrink: 0, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.07)', overflow: 'hidden' }}>
          {SECTIONS.map(sec => (
            <button key={sec.id} onClick={() => setActiveSection(sec.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '11px 16px', border: 'none',
              background: activeSection === sec.id ? '#eff6ff' : 'transparent',
              color: activeSection === sec.id ? '#2563eb' : '#475569',
              fontWeight: activeSection === sec.id ? 700 : 400,
              fontSize: 13, cursor: 'pointer', textAlign: 'left',
              borderLeft: activeSection === sec.id ? '3px solid #2563eb' : '3px solid transparent',
              transition: 'all .12s',
            }}>
              <i className={`fas ${sec.icon}`} style={{ width: 16, fontSize: 13 }}></i>
              {sec.title}
            </button>
          ))}
        </div>

        {/* Form panel */}
        <div style={{ flex: 1 }}>
          <form onSubmit={handleSave}>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.07)', overflow: 'hidden' }}>
              {/* Section header */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`fas ${currentSection.icon}`} style={{ color: '#2563eb', fontSize: 15 }}></i>
                </div>
                <div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{currentSection.title}</div>
                </div>
              </div>

              <div style={{ padding: '20px 24px' }}>
                {/* Text fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {currentSection.fields.map(f => (
                    <div key={f.key} style={{ gridColumn: f.span === 2 ? '1/-1' : undefined }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .5 }}>
                        {f.label}{f.required && <span style={{ color: '#ef4444' }}> *</span>}
                      </label>
                      <input
                        type={f.type || 'text'}
                        name={f.key}
                        value={settings[f.key] ?? ''}
                        onChange={handleChange}
                        placeholder={f.placeholder || ''}
                        required={f.required}
                        style={{
                          width: '100%', padding: '9px 12px', borderRadius: 8,
                          border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none',
                          fontFamily: 'inherit', boxSizing: 'border-box',
                          transition: 'border-color .15s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#2563eb'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  ))}
                </div>

                {/* Toggle switches */}
                {currentSection.toggles?.length > 0 && (
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: .5 }}>
                      Phương thức thanh toán
                    </div>
                    {currentSection.toggles.map(t => (
                      <label key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <div style={{ position: 'relative', width: 40, height: 22, flexShrink: 0 }}>
                          <input type="checkbox" name={t.key} checked={!!settings[t.key]} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                          <div style={{
                            position: 'absolute', inset: 0, borderRadius: 99,
                            background: settings[t.key] ? '#2563eb' : '#cbd5e1',
                            transition: 'background .2s',
                          }} />
                          <div style={{
                            position: 'absolute', top: 3,
                            left: settings[t.key] ? 21 : 3,
                            width: 16, height: 16, borderRadius: '50%',
                            background: '#fff', transition: 'left .2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                          }} />
                        </div>
                        <span style={{ fontSize: 14, color: '#475569', fontWeight: 500 }}>{t.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 16 }}>
              {saved && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#16a34a', fontSize: 13, fontWeight: 600 }}>
                  <i className="fas fa-circle-check"></i> Đã lưu thành công
                </div>
              )}
              <button type="submit" style={{
                padding: '10px 24px', background: '#2563eb', color: '#fff',
                border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <i className="fas fa-floppy-disk"></i> Lưu cài đặt
              </button>
            </div>
          </form>

          {/* Info note */}
          <div style={{ marginTop: 12, padding: '10px 16px', background: '#fefce8', border: '1px solid #fde68a', borderRadius: 8, fontSize: 12, color: '#92400e', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <i className="fas fa-triangle-exclamation" style={{ marginTop: 1 }}></i>
            <span>Cài đặt được lưu trong trình duyệt (localStorage). Để đồng bộ đa thiết bị, cần tích hợp với Supabase settings table.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

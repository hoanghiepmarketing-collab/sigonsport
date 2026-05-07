'use client';

import { useState, useEffect } from 'react';
import supabase from '../../../lib/supabase';
import { formatPrice, formatDate } from '../../../lib/format';
import CreateCustomerModal from '../../../components/admin/CreateCustomerModal';

const SOURCE_MAP = {
  manual:   { label: 'Nhập tay',     color: '#475569', bg: '#f1f5f9', icon: 'fa-pen' },
  facebook: { label: 'Facebook',     color: '#1877f2', bg: '#eff6ff', icon: 'fa-facebook' },
  zalo:     { label: 'Zalo',         color: '#0068ff', bg: '#e0f2fe', icon: 'fa-comment' },
  referral: { label: 'Giới thiệu',   color: '#9333ea', bg: '#faf5ff', icon: 'fa-user-plus' },
  walkin:   { label: 'Tại cửa hàng', color: '#ea580c', bg: '#fff7ed', icon: 'fa-store' },
};

const BADGE = {
  pending:   { bg: '#fef3c7', color: '#92400e' },
  confirmed: { bg: '#dbeafe', color: '#1e40af' },
  shipping:  { bg: '#ede9fe', color: '#5b21b6' },
  delivered: { bg: '#dcfce7', color: '#166534' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};
const STATUS_LABELS = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy' };

export default function AdminCustomersPage() {
  const [customers, setCustomers]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [selected, setSelected]           = useState(null);
  const [sort, setSort]                   = useState('last_order');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => { fetchCustomers(); }, []);

  async function fetchCustomers() {
    setLoading(true);

    // 1. Lấy từ đơn hàng
    const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });

    // 2. Lấy từ bảng customers (thêm tay)
    const { data: savedCustomers } = await supabase.from('customers').select('*').order('created_at', { ascending: false });

    const map = {};

    // Gộp từ đơn hàng
    for (const o of (orders || [])) {
      const key = o.customer_phone || o.customer_name;
      if (!map[key]) {
        map[key] = {
          phone: o.customer_phone, name: o.customer_name,
          email: o.customer_email, address: o.customer_address,
          province: o.customer_province,
          orders: [], totalSpent: 0, lastOrder: o.created_at,
          source: 'order', id: null,
        };
      }
      map[key].orders.push(o);
      map[key].totalSpent += o.total || 0;
      if (o.created_at > map[key].lastOrder) map[key].lastOrder = o.created_at;
    }

    // Gộp từ danh bạ thủ công (nếu chưa có từ đơn)
    for (const c of (savedCustomers || [])) {
      const key = c.phone || c.name;
      if (!map[key]) {
        map[key] = {
          phone: c.phone, name: c.name,
          email: c.email, address: c.address, province: c.province,
          orders: [], totalSpent: 0, lastOrder: c.created_at,
          source: c.source || 'manual', id: c.id,
          note: c.note,
        };
      } else {
        map[key].source = c.source || map[key].source;
        map[key].id = c.id;
      }
    }

    setCustomers(Object.values(map));
    setLoading(false);
  }

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name?.toLowerCase().includes(q) || c.phone?.includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'spent')      return b.totalSpent - a.totalSpent;
    if (sort === 'orders')     return b.orders.length - a.orders.length;
    return new Date(b.lastOrder) - new Date(a.lastOrder);
  });

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalOrders  = customers.reduce((s, c) => s + c.orders.length, 0);
  const avgSpend     = customers.length ? totalRevenue / customers.length : 0;

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Khách hàng</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Tổng hợp từ đơn hàng và danh bạ thủ công</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={{
          padding: '9px 18px', background: '#2563eb', color: '#fff',
          border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <i className="fas fa-user-plus"></i> Thêm khách hàng
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Tổng khách hàng', value: customers.length, icon: 'fa-users', color: '#2563eb', bg: '#eff6ff' },
          { label: 'Tổng đơn hàng',   value: totalOrders,       icon: 'fa-receipt', color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Tổng doanh thu',  value: formatPrice(totalRevenue), icon: 'fa-coins', color: '#9333ea', bg: '#faf5ff' },
          { label: 'Chi tiêu TB',     value: formatPrice(avgSpend),     icon: 'fa-wallet', color: '#ea580c', bg: '#fff7ed' },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,.07)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fas ${card.icon}`} style={{ color: card.color, fontSize: 15 }}></i>
              </div>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{card.label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>
              {loading ? '…' : card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text" placeholder="Tìm tên, số điện thoại..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, width: 260, outline: 'none' }}
        />
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#475569', outline: 'none', background: '#fff' }}>
          <option value="last_order">Đơn gần nhất</option>
          <option value="spent">Chi tiêu cao nhất</option>
          <option value="orders">Nhiều đơn nhất</option>
        </select>
        <span style={{ color: '#94a3b8', fontSize: 13, marginLeft: 4 }}>{sorted.length} khách hàng</span>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.07)', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Khách hàng', 'Số điện thoại', 'Địa chỉ', 'Nguồn', 'Số đơn', 'Tổng chi tiêu', 'Đơn gần nhất', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 700, borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Đang tải...</td></tr>
            ) : sorted.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Không có khách hàng</td></tr>
            ) : sorted.map((c, i) => {
              const src = SOURCE_MAP[c.source] || (c.orders.length > 0 ? { label: 'Từ đơn hàng', color: '#16a34a', bg: '#f0fdf4', icon: 'fa-receipt' } : SOURCE_MAP.manual);
              return (
              <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: `hsl(${(c.name?.charCodeAt(0) || 0) * 37 % 360}, 55%, 90%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 800,
                      color: `hsl(${(c.name?.charCodeAt(0) || 0) * 37 % 360}, 55%, 35%)`,
                      flexShrink: 0,
                    }}>
                      {c.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</div>
                      {c.email && <div style={{ color: '#94a3b8', fontSize: 11 }}>{c.email}</div>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 14px', color: '#475569' }}>{c.phone || '—'}</td>
                <td style={{ padding: '12px 14px', color: '#475569', maxWidth: 180 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {[c.address, c.province].filter(Boolean).join(', ') || '—'}
                  </div>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: src.bg, color: src.color }}>
                    <i className={`fas ${src.icon}`}></i> {src.label}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ fontWeight: 700, color: '#2563eb' }}>{c.orders.length}</span>
                </td>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{formatPrice(c.totalSpent)}</td>
                <td style={{ padding: '12px 14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatDate(c.lastOrder)}</td>
                <td style={{ padding: '12px 14px' }}>
                  <button onClick={() => setSelected(c)} style={{
                    padding: '5px 12px', borderRadius: 6, border: '1.5px solid #e2e8f0',
                    background: '#f8fafc', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#475569',
                  }}>
                    Lịch sử
                  </button>
                </td>
              </tr>
            );})}

          </tbody>
        </table>
      </div>

      {/* Create customer modal */}
      {showCreateModal && (
        <CreateCustomerModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { fetchCustomers(); setShowCreateModal(false); }}
        />
      )}

      {/* Order history drawer */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 480, height: '100%', overflowY: 'auto', boxShadow: '-4px 0 24px rgba(0,0,0,.12)' }}>
            {/* Drawer header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <div>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 17 }}>{selected.name}</div>
                <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>{selected.phone}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#94a3b8' }}>×</button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: '#f1f5f9' }}>
              {[
                { label: 'Số đơn', value: selected.orders.length },
                { label: 'Đã chi', value: formatPrice(selected.totalSpent) },
                { label: 'TB/đơn', value: formatPrice(selected.totalSpent / (selected.orders.length || 1)) },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', padding: '14px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Orders list */}
            <div style={{ padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 12 }}>Lịch sử đơn hàng</div>
              {selected.orders.map(o => {
                const bdg = BADGE[o.status] || { bg: '#f1f5f9', color: '#475569' };
                return (
                  <div key={o.id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, color: '#2563eb', fontSize: 13 }}>{o.order_number}</div>
                      <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: bdg.bg, color: bdg.color }}>
                        {STATUS_LABELS[o.status] || o.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{formatDate(o.created_at)}</div>
                    {Array.isArray(o.items) && (
                      <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>
                        {o.items.map(it => `${it.name} ×${it.quantity}`).join(', ')}
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>
                        {o.payment_method === 'cod' ? 'COD' : 'Chuyển khoản'}
                      </span>
                      <span style={{ fontWeight: 800, color: '#E5002B', fontSize: 14 }}>{formatPrice(o.total)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

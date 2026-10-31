'use client';

import { useState, useEffect } from 'react';
import supabase from '../../../lib/supabase';
import { formatPrice, formatDate, STATUS_LABELS } from '../../../lib/format';
import CreateOrderModal, { CHANNELS } from '../../../components/admin/CreateOrderModal';

const STATUSES = ['all', 'pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];

const BADGE = {
  pending:   { bg: '#fef3c7', color: '#92400e' },
  confirmed: { bg: '#dbeafe', color: '#1e40af' },
  shipping:  { bg: '#ede9fe', color: '#5b21b6' },
  delivered: { bg: '#dcfce7', color: '#166534' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [tab, setTab]                 = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [search, setSearch]           = useState('');
  const [selected, setSelected]       = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    setUpdatingStatus(true);
    await supabase.from('orders').update({ status }).eq('id', id);
    await fetchOrders();
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
    setUpdatingStatus(false);
  }

  const filtered = orders.filter(o => {
    const matchTab     = tab === 'all' || o.status === tab;
    const matchChannel = channelFilter === 'all' || (o.channel || 'website') === channelFilter;
    const q = search.toLowerCase();
    const matchSearch  = !q || o.order_number?.toLowerCase().includes(q)
      || o.customer_name?.toLowerCase().includes(q)
      || o.customer_phone?.includes(q);
    return matchTab && matchChannel && matchSearch;
  });

  // Revenue of filtered
  const filteredRevenue = filtered
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + (o.total || 0), 0);

  // Channel counts for badge
  const channelCounts = CHANNELS.reduce((acc, c) => {
    acc[c.value] = orders.filter(o => (o.channel || 'website') === c.value).length;
    return acc;
  }, {});

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Đơn hàng</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            {filtered.length} đơn · Doanh thu: <strong style={{ color: '#16a34a' }}>{formatPrice(filteredRevenue)}</strong>
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} style={{
          padding: '9px 18px', background: '#2563eb', color: '#fff',
          border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <i className="fas fa-plus"></i> Tạo đơn hàng
        </button>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setTab(s)} style={{
            padding: '7px 14px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: tab === s ? '#2563eb' : '#f1f5f9',
            color:      tab === s ? '#fff'    : '#64748b',
          }}>
            {s === 'all' ? 'Tất cả' : STATUS_LABELS[s] || s}
            <span style={{ marginLeft: 5, fontSize: 11, opacity: .8 }}>
              ({s === 'all' ? orders.length : orders.filter(o => o.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* Channel filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginRight: 2 }}>KÊNH:</span>
        <button onClick={() => setChannelFilter('all')} style={{
          padding: '4px 12px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
          background: channelFilter === 'all' ? '#0f172a' : '#f1f5f9',
          color:      channelFilter === 'all' ? '#fff'    : '#64748b',
        }}>
          Tất cả ({orders.length})
        </button>
        {CHANNELS.map(c => channelCounts[c.value] > 0 && (
          <button key={c.value} onClick={() => setChannelFilter(c.value)} style={{
            padding: '4px 12px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            background: channelFilter === c.value ? c.color : '#f1f5f9',
            color:      channelFilter === c.value ? '#fff'  : '#64748b',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <i className={`fab ${c.icon}`}></i> {c.label} ({channelCounts[c.value]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }}></i>
          <input type="text" placeholder="Tìm mã đơn, tên, SĐT..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 14px 8px 32px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, width: 280, outline: 'none' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.08)', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Mã đơn', 'Khách hàng', 'Kênh', 'Sản phẩm', 'Tổng tiền', 'Thanh toán', 'Trạng thái', 'Ngày đặt', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 700, borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Đang tải...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Không có đơn hàng</td></tr>
            ) : filtered.map(order => {
              const bdg = BADGE[order.status] || { bg: '#f1f5f9', color: '#475569' };
              const ch  = CHANNELS.find(c => c.value === (order.channel || 'website'));
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#2563eb' }}>{order.order_number}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600 }}>{order.customer_name}</div>
                    <div style={{ color: '#94a3b8', fontSize: 12 }}>{order.customer_phone}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {ch ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: ch.bg, color: ch.color }}>
                        <i className={`fab ${ch.icon}`}></i> {ch.label}
                      </span>
                    ) : <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>
                    {Array.isArray(order.items) ? `${order.items.length} SP` : '—'}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700 }}>{formatPrice(order.total)}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>
                    {order.payment_method === 'cod' ? 'COD' : 'CK'}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: bdg.bg, color: bdg.color }}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatDate(order.created_at)}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <button onClick={() => setSelected(order)} style={{
                      padding: '5px 12px', borderRadius: 6, border: '1.5px solid #e2e8f0',
                      background: '#f8fafc', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#475569',
                    }}>Chi tiết</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18 }}>Đơn {selected.order_number}</h2>
                {(() => { const ch = CHANNELS.find(c => c.value === (selected.channel || 'website')); return ch ? (
                  <span style={{ fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 99, background: ch.bg, color: ch.color, marginTop: 4 }}>
                    <i className={`fab ${ch.icon}`}></i> {ch.label}
                  </span>
                ) : null; })()}
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#94a3b8' }}>×</button>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 16, fontSize: 14 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>Thông tin khách hàng</div>
              <div style={{ display: 'grid', gap: 4, color: '#475569' }}>
                <div><strong>Họ tên:</strong> {selected.customer_name}</div>
                <div><strong>SĐT:</strong> {selected.customer_phone}</div>
                {selected.customer_email && <div><strong>Email:</strong> {selected.customer_email}</div>}
                <div><strong>Địa chỉ:</strong> {selected.customer_address}{selected.customer_province ? `, ${selected.customer_province}` : ''}</div>
                {selected.customer_note && <div><strong>Ghi chú:</strong> {selected.customer_note}</div>}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14, color: '#0f172a' }}>Sản phẩm đặt</div>
              {Array.isArray(selected.items) && selected.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <img src={item.img || 'https://placehold.co/48x48'} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: '#94a3b8' }}>{item.size && `Size ${item.size}`}{item.color && ` · ${item.color}`} · ×{item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#E5002B', fontSize: 13 }}>{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12, marginBottom: 20, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#475569' }}><span>Tạm tính</span><span>{formatPrice(selected.subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#475569' }}><span>Vận chuyển</span><span>{selected.shipping === 0 ? 'Miễn phí' : formatPrice(selected.shipping)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16, color: '#0f172a' }}><span>Tổng cộng</span><span style={{ color: '#E5002B' }}>{formatPrice(selected.total)}</span></div>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14, color: '#0f172a' }}>Cập nhật trạng thái</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {STATUSES.filter(s => s !== 'all').map(s => {
                  const bdg = BADGE[s] || { bg: '#f1f5f9', color: '#475569' };
                  return (
                    <button key={s} disabled={updatingStatus || selected.status === s}
                      onClick={() => updateStatus(selected.id, s)}
                      style={{
                        padding: '6px 14px', borderRadius: 99, border: 'none', fontSize: 12, fontWeight: 700,
                        cursor: selected.status === s ? 'default' : 'pointer',
                        background: selected.status === s ? bdg.bg : '#f1f5f9',
                        color:      selected.status === s ? bdg.color : '#64748b',
                        outline:    selected.status === s ? `2px solid ${bdg.color}` : 'none',
                        opacity: updatingStatus ? .6 : 1,
                      }}>
                      {STATUS_LABELS[s] || s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { fetchOrders(); setShowCreateModal(false); }}
        />
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import supabase from '../../lib/supabase';
import { formatPrice, formatDate, STATUS_LABELS, STATUS_BADGE_CLASS } from '../../lib/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const [
      { count: orderCount },
      { data: orders },
      { count: productCount },
    ] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(8),
      supabase.from('products').select('*', { count: 'exact', head: true }),
    ]);

    const revenue = (orders || []).reduce((s, o) => s + (o.total || 0), 0);
    const pending = (orders || []).filter(o => o.status === 'pending').length;

    setStats({ orders: orderCount || 0, revenue, products: productCount || 0, pending });
    setRecentOrders(orders || []);
    setLoading(false);
  }

  const statCards = [
    { icon: 'fa-receipt', label: 'Tổng đơn hàng', value: stats.orders, color: '#2563eb', bg: '#eff6ff' },
    { icon: 'fa-coins', label: 'Doanh thu', value: formatPrice(stats.revenue), color: '#16a34a', bg: '#f0fdf4' },
    { icon: 'fa-box-open', label: 'Sản phẩm', value: stats.products, color: '#9333ea', bg: '#faf5ff' },
    { icon: 'fa-clock', label: 'Chờ xác nhận', value: stats.pending, color: '#ea580c', bg: '#fff7ed' },
  ];

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
          Tổng quan
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Chào mừng trở lại, Admin!</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map(card => (
          <div key={card.label} style={{
            background: '#fff', borderRadius: 12, padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,.08)', border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fas ${card.icon}`} style={{ color: card.color, fontSize: 18 }}></i>
              </div>
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{card.label}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>
              {loading ? '…' : card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.08)', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Đơn hàng gần đây</h2>
          <Link href="/admin/orders" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
            Xem tất cả →
          </Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Mã đơn', 'Khách hàng', 'Tổng tiền', 'Thanh toán', 'Trạng thái', 'Ngày đặt'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 700, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Đang tải...</td></tr>
              ) : recentOrders.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Chưa có đơn hàng</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#2563eb' }}>{order.order_number}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600 }}>{order.customer_name}</div>
                    <div style={{ color: '#94a3b8', fontSize: 12 }}>{order.customer_phone}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>{formatPrice(order.total)}</td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>
                    {order.payment_method === 'cod' ? 'COD' : 'Chuyển khoản'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                      ...getBadgeStyle(order.status),
                    }}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getBadgeStyle(status) {
  const map = {
    pending:    { background: '#fef3c7', color: '#92400e' },
    confirmed:  { background: '#dbeafe', color: '#1e40af' },
    shipping:   { background: '#ede9fe', color: '#5b21b6' },
    delivered:  { background: '#dcfce7', color: '#166534' },
    cancelled:  { background: '#fee2e2', color: '#991b1b' },
  };
  return map[status] || { background: '#f1f5f9', color: '#475569' };
}

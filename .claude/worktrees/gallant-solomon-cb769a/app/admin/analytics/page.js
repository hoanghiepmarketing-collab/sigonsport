'use client';

import { useState, useEffect } from 'react';
import supabase from '../../../lib/supabase';
import { formatPrice } from '../../../lib/format';

const STATUS_LABELS = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy' };
const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#3b82f6', shipping: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444' };
const RANGES = [
  { label: '7 ngày', days: 7 },
  { label: '30 ngày', days: 30 },
  { label: '90 ngày', days: 90 },
];

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    const [{ data: ord }, { data: prod }] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: true }),
      supabase.from('products').select('id,name,brand,sport,sold,price').order('sold', { ascending: false }).limit(10),
    ]);
    setOrders(ord || []);
    setProducts(prod || []);
    setLoading(false);
  }

  // --- Date helpers ---
  const now = new Date();
  const rangeStart = new Date(now); rangeStart.setDate(now.getDate() - range + 1); rangeStart.setHours(0,0,0,0);

  const inRange = orders.filter(o => new Date(o.created_at) >= rangeStart);
  const delivered = inRange.filter(o => o.status === 'delivered' || o.status === 'shipping' || o.status === 'confirmed');

  const totalRevenue = delivered.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders  = inRange.length;
  const avgOrder     = totalOrders ? totalRevenue / totalOrders : 0;
  const cancelRate   = totalOrders ? (inRange.filter(o => o.status === 'cancelled').length / totalOrders * 100).toFixed(1) : 0;

  // --- Daily revenue chart data ---
  const dailyData = [];
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date(now); d.setDate(now.getDate() - i); d.setHours(0,0,0,0);
    const next = new Date(d); next.setDate(d.getDate() + 1);
    const dayOrders = delivered.filter(o => { const t = new Date(o.created_at); return t >= d && t < next; });
    const revenue = dayOrders.reduce((s, o) => s + (o.total || 0), 0);
    const label = range <= 7
      ? d.toLocaleDateString('vi-VN', { weekday: 'short' })
      : range <= 30
        ? `${d.getDate()}/${d.getMonth()+1}`
        : `T${d.getMonth()+1}`;
    dailyData.push({ label, revenue, count: dayOrders.length, date: d });
  }

  // Collapse to monthly if 90 days
  const chartData = range === 90
    ? Object.values(dailyData.reduce((acc, d) => {
        const key = d.label;
        if (!acc[key]) acc[key] = { label: key, revenue: 0, count: 0 };
        acc[key].revenue += d.revenue; acc[key].count += d.count;
        return acc;
      }, {}))
    : dailyData;

  // --- Orders by status ---
  const statusData = Object.entries(
    inRange.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {})
  ).map(([status, count]) => ({ status, count }));

  // --- Top products ---
  const topProducts = products.filter(p => p.sold > 0).slice(0, 5);

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Phân tích</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Tổng quan hiệu suất kinh doanh</p>
        </div>
        {/* Range picker */}
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 8, padding: 4 }}>
          {RANGES.map(r => (
            <button key={r.days} onClick={() => setRange(r.days)} style={{
              padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              background: range === r.days ? '#fff' : 'transparent',
              color: range === r.days ? '#0f172a' : '#64748b',
              boxShadow: range === r.days ? '0 1px 3px rgba(0,0,0,.1)' : 'none',
            }}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Doanh thu', value: formatPrice(totalRevenue), icon: 'fa-coins',       color: '#16a34a', bg: '#f0fdf4', sub: `${range} ngày qua` },
          { label: 'Đơn hàng', value: totalOrders,                icon: 'fa-receipt',     color: '#2563eb', bg: '#eff6ff', sub: `Trong ${range} ngày` },
          { label: 'Giá trị TB', value: formatPrice(avgOrder),    icon: 'fa-chart-line',  color: '#9333ea', bg: '#faf5ff', sub: 'Trên mỗi đơn' },
          { label: 'Tỷ lệ hủy', value: `${cancelRate}%`,         icon: 'fa-circle-xmark', color: '#ea580c', bg: '#fff7ed', sub: 'Đơn bị hủy' },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,.07)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fas ${card.icon}`} style={{ color: card.color, fontSize: 15 }}></i>
              </div>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{card.label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>
              {loading ? '…' : card.value}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.07)', marginBottom: 20, padding: '20px 24px' }}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 15, color: '#0f172a', marginBottom: 16 }}>
          Doanh thu theo ngày
        </div>
        {loading ? (
          <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Đang tải...</div>
        ) : (
          <BarChart data={chartData} color="#2563eb" valueKey="revenue" formatter={formatPrice} />
        )}
      </div>

      {/* Bottom grid: status + top products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Orders by status */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.07)', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 15, color: '#0f172a', marginBottom: 16 }}>
            Phân bổ trạng thái
          </div>
          {statusData.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: 20 }}>Chưa có dữ liệu</div>
          ) : statusData.map(({ status, count }) => {
            const pct = totalOrders ? Math.round(count / totalOrders * 100) : 0;
            const color = STATUS_COLORS[status] || '#94a3b8';
            return (
              <div key={status} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>{STATUS_LABELS[status] || status}</span>
                  <span style={{ color, fontWeight: 700 }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height: 7, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width .5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Top products */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.07)', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 15, color: '#0f172a', marginBottom: 16 }}>
            Sản phẩm bán chạy
          </div>
          {topProducts.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: 20 }}>Chưa có dữ liệu</div>
          ) : topProducts.map((p, i) => {
            const maxSold = topProducts[0]?.sold || 1;
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? '#fef3c7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: i === 0 ? '#92400e' : '#64748b', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ height: 5, background: '#f1f5f9', borderRadius: 99, marginTop: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.sold / maxSold * 100}%`, background: '#2563eb', borderRadius: 99 }} />
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', flexShrink: 0 }}>{p.sold} đã bán</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- Reusable SVG bar chart ---
function BarChart({ data, color = '#2563eb', valueKey = 'revenue', formatter = v => v }) {
  if (!data.length) return <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14 }}>Chưa có dữ liệu</div>;

  const W = 800, H = 160, LABEL_H = 20, PAD = 2;
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  const barW = Math.max(4, Math.floor((W / data.length) - PAD * 2));
  const [hovered, setHovered] = useState(null);

  // Show only every Nth label to avoid clutter
  const step = data.length > 20 ? Math.ceil(data.length / 10) : 1;

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H + LABEL_H}`} style={{ width: '100%', height: H + LABEL_H, display: 'block' }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(pct => {
          const y = H - H * pct;
          return (
            <g key={pct}>
              <line x1={0} y1={y} x2={W} y2={y} stroke="#f1f5f9" strokeWidth={1} />
              <text x={2} y={y - 3} fontSize={9} fill="#cbd5e1">{formatter(max * pct)}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const barH = Math.max(2, (d[valueKey] / max) * H);
          const x = i * (W / data.length) + PAD;
          const y = H - barH;
          const isHov = hovered === i;
          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'default' }}
            >
              <rect x={x} y={y} width={barW} height={barH}
                fill={isHov ? '#1d4ed8' : color}
                rx={3} opacity={isHov ? 1 : .8}
              />
              {i % step === 0 && (
                <text x={x + barW / 2} y={H + LABEL_H - 3} textAnchor="middle" fontSize={9} fill="#94a3b8">
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {/* Tooltip */}
      {hovered !== null && (
        <div style={{
          position: 'absolute',
          left: `${(hovered + 0.5) / data.length * 100}%`,
          top: 0,
          transform: 'translateX(-50%)',
          background: '#0f172a', color: '#fff',
          borderRadius: 6, padding: '5px 10px', fontSize: 12, fontWeight: 600,
          pointerEvents: 'none', whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,.2)',
        }}>
          {data[hovered].label}: {formatter(data[hovered][valueKey])}
          {data[hovered].count !== undefined && ` (${data[hovered].count} đơn)`}
        </div>
      )}
    </div>
  );
}

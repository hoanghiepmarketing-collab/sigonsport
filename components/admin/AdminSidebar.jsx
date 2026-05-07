'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import supabase from '../../lib/supabase';

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { href: '/admin', icon: 'fa-gauge-high', label: 'Dashboard', exact: true },
    ],
  },
  {
    label: 'KINH DOANH',
    items: [
      { href: '/admin/orders',    icon: 'fa-receipt',    label: 'Đơn hàng' },
      { href: '/admin/customers', icon: 'fa-users',      label: 'Khách hàng' },
      { href: '/admin/analytics', icon: 'fa-chart-bar',  label: 'Phân tích' },
    ],
  },
  {
    label: 'DANH MỤC',
    items: [
      { href: '/admin/products', icon: 'fa-box-open', label: 'Sản phẩm' },
    ],
  },
  {
    label: 'NỘI DUNG',
    items: [
      { href: '/admin/posts', icon: 'fa-newspaper', label: 'Bài viết' },
    ],
  },
  {
    label: 'HỆ THỐNG',
    items: [
      { href: '/admin/settings', icon: 'fa-gear', label: 'Cài đặt' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    supabase.from('orders').select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .then(({ count }) => setPendingCount(count || 0));
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  function isActive(item) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <aside style={{
      width: 230, flexShrink: 0,
      background: '#0f172a', color: '#cbd5e1',
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #1e293b' }}>
        <Link href="/admin" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 17, color: '#fff', letterSpacing: 1 }}>
            SIGON <span style={{ color: '#FF6B00' }}>SPORT</span>
          </div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 2, letterSpacing: .5 }}>ADMIN PANEL</div>
        </Link>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 4 }}>
            {group.label && (
              <div style={{ padding: '10px 20px 4px', fontSize: 10, fontWeight: 700, color: '#334155', letterSpacing: 1 }}>
                {group.label}
              </div>
            )}
            {group.items.map(item => {
              const active = isActive(item);
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 20px', textDecoration: 'none',
                  color: active ? '#fff' : '#94a3b8',
                  background: active ? 'rgba(37,99,235,.25)' : 'transparent',
                  fontWeight: active ? 700 : 400, fontSize: 14,
                  borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
                  transition: 'all 0.12s',
                  position: 'relative',
                }}>
                  <i className={`fas ${item.icon}`} style={{ width: 18, fontSize: 14, opacity: active ? 1 : .7 }}></i>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.href === '/admin/orders' && pendingCount > 0 && (
                    <span style={{
                      background: '#ef4444', color: '#fff',
                      borderRadius: 99, fontSize: 10, fontWeight: 800,
                      padding: '1px 6px', minWidth: 18, textAlign: 'center',
                    }}>
                      {pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: view site + logout */}
      <div style={{ borderTop: '1px solid #1e293b', padding: '12px 0' }}>
        <a href="/" target="_blank" rel="noreferrer" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 20px', textDecoration: 'none',
          color: '#64748b', fontSize: 13,
          transition: 'color 0.12s',
        }}>
          <i className="fas fa-arrow-up-right-from-square" style={{ width: 18, fontSize: 12 }}></i>
          Xem website
        </a>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#64748b', fontSize: 13, width: '100%',
          padding: '9px 20px', transition: 'color 0.12s',
        }}>
          <i className="fas fa-right-from-bracket" style={{ width: 18, fontSize: 12 }}></i>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

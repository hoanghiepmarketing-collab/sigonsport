'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import supabase from '../../lib/supabase';

const NAV = [
  { href: '/admin', icon: 'fa-chart-line', label: 'Tổng quan' },
  { href: '/admin/orders', icon: 'fa-receipt', label: 'Đơn hàng' },
  { href: '/admin/products', icon: 'fa-box-open', label: 'Sản phẩm' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: '#0f172a', color: '#cbd5e1',
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #1e293b' }}>
        <Link href="/admin" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: 1 }}>
            SIGON <span style={{ color: '#FF6B00' }}>SPORT</span>
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Admin Panel</div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 20px', textDecoration: 'none',
              color: active ? '#fff' : '#94a3b8',
              background: active ? '#1e40af' : 'transparent',
              fontWeight: active ? 700 : 400, fontSize: 14,
              borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
              transition: 'all 0.15s',
            }}>
              <i className={`fas ${item.icon}`} style={{ width: 18 }}></i>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#94a3b8', fontSize: 14, width: '100%', padding: 0,
        }}>
          <i className="fas fa-sign-out-alt" style={{ width: 18 }}></i>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

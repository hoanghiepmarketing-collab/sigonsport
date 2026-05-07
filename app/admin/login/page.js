'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError('Email hoặc mật khẩu không đúng');
      setLoading(false);
      return;
    }
    router.push('/admin');
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f172a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 28, color: '#fff', letterSpacing: 2 }}>
            SIGON<span style={{ color: '#FF6B00' }}> SPORT</span>
          </div>
          <div style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>Trang quản trị</div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: 12, padding: 32 }}>
          <h1 style={{ color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>
            Đăng nhập
          </h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
              <input
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@sigonsport.vn"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1.5px solid #334155', background: '#0f172a',
                  color: '#fff', fontSize: 14, boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Mật khẩu</label>
              <input
                type="password" required
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  border: '1.5px solid #334155', background: '#0f172a',
                  color: '#fff', fontSize: 14, boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            {error && (
              <div style={{
                background: '#7f1d1d', border: '1px solid #ef4444',
                borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                color: '#fca5a5', fontSize: 13,
              }}>
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: 8,
              background: loading ? '#1e40af' : '#2563eb',
              color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 700, fontSize: 15, fontFamily: 'Montserrat, sans-serif',
            }}>
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Đang đăng nhập...</> : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

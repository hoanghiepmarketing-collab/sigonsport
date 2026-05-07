'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import supabase from '../../../lib/supabase';
import { formatDate } from '../../../lib/format';

const STATUS_MAP = {
  published: { label: 'Đã đăng',  bg: '#dcfce7', color: '#166534' },
  draft:     { label: 'Nháp',     bg: '#f1f5f9', color: '#475569' },
};

const CATEGORIES = ['Tin tức', 'Hướng dẫn', 'Review sản phẩm', 'Thể thao', 'Khuyến mãi', 'Khác'];

export default function AdminPostsPage() {
  const [posts, setPosts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select('id,title,slug,status,category,view_count,published_at,created_at,excerpt,cover_img,seo_title,seo_description')
      .order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }

  async function handleDelete(id) {
    await supabase.from('posts').delete().eq('id', id);
    setDeleteConfirm(null);
    fetchPosts();
  }

  async function toggleStatus(post) {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const update = { status: newStatus };
    if (newStatus === 'published' && !post.published_at) {
      update.published_at = new Date().toISOString();
    }
    await supabase.from('posts').update(update).eq('id', post.id);
    fetchPosts();
  }

  const filtered = posts.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all:       posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft:     posts.filter(p => p.status === 'draft').length,
  };

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Bài viết</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Quản lý nội dung blog & SEO</p>
        </div>
        <Link href="/admin/posts/new" style={{
          padding: '9px 18px', background: '#2563eb', color: '#fff',
          borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14,
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <i className="fas fa-plus"></i> Viết bài mới
        </Link>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 0 }}>
        {[['all','Tất cả'], ['published','Đã đăng'], ['draft','Nháp']].map(([val, label]) => (
          <button key={val} onClick={() => setFilterStatus(val)} style={{
            padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: filterStatus === val ? 700 : 400,
            color: filterStatus === val ? '#2563eb' : '#64748b',
            borderBottom: filterStatus === val ? '2px solid #2563eb' : '2px solid transparent',
            marginBottom: -1,
          }}>
            {label}
            <span style={{ marginLeft: 6, fontSize: 11, background: '#f1f5f9', color: '#64748b', borderRadius: 99, padding: '1px 6px' }}>
              {counts[val]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }}></i>
          <input
            type="text" placeholder="Tìm tiêu đề, slug..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 14px 8px 32px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, width: 280, outline: 'none' }}
          />
        </div>
        <span style={{ marginLeft: 12, color: '#94a3b8', fontSize: 13 }}>{filtered.length} bài viết</span>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.07)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Bài viết', 'Danh mục', 'Trạng thái', 'Lượt xem', 'Ngày tạo', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 700, borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Đang tải...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 48, textAlign: 'center' }}>
                  <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 12 }}>Chưa có bài viết nào</div>
                  <Link href="/admin/posts/new" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none', fontSize: 13 }}>
                    + Viết bài đầu tiên
                  </Link>
                </td>
              </tr>
            ) : filtered.map(post => {
              const st = STATUS_MAP[post.status] || STATUS_MAP.draft;
              const hasSeo = post.seo_title && post.seo_description;
              return (
                <tr key={post.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '14px 16px', maxWidth: 380 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      {post.cover_img ? (
                        <img src={post.cover_img} alt="" style={{ width: 60, height: 42, objectFit: 'cover', borderRadius: 6, flexShrink: 0, border: '1px solid #f1f5f9' }} />
                      ) : (
                        <div style={{ width: 60, height: 42, borderRadius: 6, background: '#f1f5f9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-image" style={{ color: '#cbd5e1', fontSize: 16 }}></i>
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {post.title}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 4 }}>
                          /tin-tuc/{post.slug}
                        </div>
                        {/* SEO indicator */}
                        <div style={{ display: 'flex', gap: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: hasSeo ? '#dcfce7' : '#fef3c7', color: hasSeo ? '#166534' : '#92400e' }}>
                            <i className={`fas fa-${hasSeo ? 'check' : 'triangle-exclamation'}`} style={{ marginRight: 3 }}></i>
                            SEO {hasSeo ? 'OK' : 'Thiếu'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>{post.category || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => toggleStatus(post)} style={{
                      padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                      background: st.bg, color: st.color, border: 'none', cursor: 'pointer',
                    }}>
                      {st.label}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>
                    <i className="fas fa-eye" style={{ marginRight: 5, color: '#cbd5e1' }}></i>
                    {post.view_count || 0}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatDate(post.created_at)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link href={`/admin/posts/${post.id}`} style={{
                        padding: '5px 12px', borderRadius: 6, border: '1.5px solid #e2e8f0',
                        background: '#f8fafc', fontSize: 12, fontWeight: 600, color: '#475569', textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                      }}>
                        <i className="fas fa-pen"></i> Sửa
                      </Link>
                      <button onClick={() => setDeleteConfirm(post)} style={{
                        padding: '5px 10px', borderRadius: 6, border: '1.5px solid #fecaca',
                        background: '#fff5f5', cursor: 'pointer', fontSize: 12, color: '#ef4444',
                      }}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontWeight: 800, marginBottom: 8 }}>Xóa bài viết?</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
              Bài <strong>"{deleteConfirm.title}"</strong> sẽ bị xóa vĩnh viễn.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Hủy</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../../../lib/supabase';

const CATEGORIES = ['Tin tức', 'Hướng dẫn', 'Review sản phẩm', 'Thể thao', 'Khuyến mãi', 'Khác'];

const EMPTY = {
  title: '', slug: '', content: '', excerpt: '', cover_img: '',
  category: '', tags: '',
  status: 'draft',
  seo_title: '', seo_description: '', seo_keywords: '',
  focus_keyword: '',
};

// Vietnamese → ASCII slug
function toSlug(str) {
  return str
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-');
}

// SEO score (0–100)
function calcSeoScore(form) {
  let score = 0;
  const kw = (form.focus_keyword || '').toLowerCase().trim();
  if (form.seo_title)       score += 20;
  if (form.seo_description) score += 20;
  if (form.seo_title?.length >= 40 && form.seo_title?.length <= 65)  score += 10;
  if (form.seo_description?.length >= 120 && form.seo_description?.length <= 160) score += 10;
  if (kw && form.seo_title?.toLowerCase().includes(kw))       score += 15;
  if (kw && form.seo_description?.toLowerCase().includes(kw)) score += 10;
  if (kw && form.title?.toLowerCase().includes(kw))           score += 10;
  if (form.cover_img) score += 5;
  return Math.min(score, 100);
}

function seoColor(score) {
  if (score >= 70) return '#16a34a';
  if (score >= 40) return '#d97706';
  return '#dc2626';
}

function seoLabel(score) {
  if (score >= 70) return 'Tốt';
  if (score >= 40) return 'Cần cải thiện';
  return 'Yếu';
}

export default function PostEditorPage() {
  const router  = useRouter();
  const params  = useParams();
  const isNew   = params.id === 'new';

  const [form, setForm]         = useState(EMPTY);
  const [loading, setLoading]   = useState(!isNew);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [activeTab, setActiveTab]   = useState('content'); // content | seo

  useEffect(() => {
    if (!isNew) loadPost();
  }, [params.id]);

  async function loadPost() {
    setLoading(true);
    const { data } = await supabase.from('posts').select('*').eq('id', params.id).single();
    if (data) {
      setForm({ ...EMPTY, ...data, tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || '') });
      setSlugEdited(true);
    }
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => {
      const next = { ...f, [name]: value };
      // Auto-generate slug from title (only if not manually edited)
      if (name === 'title' && !slugEdited) {
        next.slug = toSlug(value);
      }
      // Auto-fill SEO title from title if empty
      if (name === 'title' && !f.seo_title) {
        next.seo_title = value + ' | SIGON SPORT';
      }
      // Auto-fill SEO description from excerpt if empty
      if (name === 'excerpt' && !f.seo_description) {
        next.seo_description = value.slice(0, 160);
      }
      return next;
    });
  }

  function handleSlugChange(e) {
    setSlugEdited(true);
    setForm(f => ({ ...f, slug: toSlug(e.target.value) }));
  }

  async function handleSave(publishStatus) {
    setSaving(true);
    const payload = {
      ...form,
      status: publishStatus || form.status,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      slug: form.slug || toSlug(form.title),
      published_at: (publishStatus === 'published' && !form.published_at)
        ? new Date().toISOString()
        : form.published_at || null,
      updated_at: new Date().toISOString(),
    };
    delete payload.id;
    delete payload.created_at;

    if (isNew) {
      const { data, error } = await supabase.from('posts').insert(payload).select('id').single();
      if (!error && data) router.replace(`/admin/posts/${data.id}`);
    } else {
      await supabase.from('posts').update(payload).eq('id', params.id);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    if (publishStatus) setForm(f => ({ ...f, status: publishStatus }));
  }

  const seoScore = calcSeoScore(form);
  const titleLen = (form.seo_title || '').length;
  const descLen  = (form.seo_description || '').length;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#2563eb' }}></i>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin/posts" style={{ color: '#64748b', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fas fa-arrow-left"></i> Bài viết
          </Link>
          <span style={{ color: '#e2e8f0' }}>|</span>
          <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>
            {isNew ? 'Bài viết mới' : (form.title || 'Chỉnh sửa')}
          </span>
          {/* Status badge */}
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
            background: form.status === 'published' ? '#dcfce7' : '#f1f5f9',
            color:      form.status === 'published' ? '#166534' : '#475569',
          }}>
            {form.status === 'published' ? 'Đã đăng' : 'Nháp'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {saved && (
            <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
              <i className="fas fa-circle-check"></i> Đã lưu
            </span>
          )}
          <button onClick={() => handleSave('draft')} disabled={saving} style={{
            padding: '7px 16px', borderRadius: 7, border: '1.5px solid #e2e8f0',
            background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#475569',
          }}>
            Lưu nháp
          </button>
          <button onClick={() => handleSave('published')} disabled={saving || !form.title} style={{
            padding: '7px 16px', borderRadius: 7, border: 'none',
            background: form.title ? '#2563eb' : '#cbd5e1',
            color: '#fff', cursor: form.title ? 'pointer' : 'not-allowed',
            fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7,
          }}>
            {saving ? <><i className="fas fa-spinner fa-spin"></i> Đang lưu...</> : <><i className="fas fa-upload"></i> Đăng bài</>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', gap: 20, padding: '24px 24px 48px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Left: editor */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          <textarea
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Tiêu đề bài viết..."
            rows={2}
            style={{
              width: '100%', border: 'none', outline: 'none', resize: 'none',
              fontFamily: 'Montserrat, sans-serif', fontSize: 28, fontWeight: 800,
              color: '#0f172a', background: 'transparent', lineHeight: 1.3,
              marginBottom: 12, boxSizing: 'border-box',
            }}
          />

          {/* Slug */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px' }}>
            <span style={{ color: '#94a3b8', fontSize: 13, whiteSpace: 'nowrap' }}>sigonsport.vn/tin-tuc/</span>
            <input
              value={form.slug}
              onChange={handleSlugChange}
              placeholder="duong-dan-bai-viet"
              style={{ border: 'none', outline: 'none', fontSize: 13, color: '#2563eb', fontWeight: 600, flex: 1, minWidth: 0 }}
            />
            {form.slug && (
              <a href={`/tin-tuc/${form.slug}`} target="_blank" rel="noreferrer"
                style={{ color: '#94a3b8', fontSize: 12, flexShrink: 0 }}>
                <i className="fas fa-arrow-up-right-from-square"></i>
              </a>
            )}
          </div>

          {/* Tabs: Content | SEO */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
            {[['content', 'fas fa-pen-nib', 'Nội dung'], ['seo', 'fas fa-magnifying-glass-chart', 'SEO']].map(([tab, icon, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '9px 18px', border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: activeTab === tab ? 700 : 400,
                color: activeTab === tab ? '#2563eb' : '#64748b',
                borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                marginBottom: -1, display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <i className={icon}></i> {label}
                {tab === 'seo' && (
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 99, background: seoColor(seoScore), color: '#fff', marginLeft: 2 }}>
                    {seoScore}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 'content' ? (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              {/* Simple toolbar */}
              <div style={{ display: 'flex', gap: 2, padding: '8px 12px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                {[
                  ['fa-bold', '**굵게**', '**굵게**'],
                  ['fa-italic', '*nghiêng*', '*nghiêng*'],
                  ['fa-heading', '## Tiêu đề', '## Tiêu đề'],
                  ['fa-list-ul', '\n- Mục 1\n- Mục 2', '\n- Mục 1\n- Mục 2'],
                  ['fa-link', '[text](url)', '[text](url)'],
                  ['fa-image', '![alt](url)', '![alt](url)'],
                ].map(([icon, insert]) => (
                  <button key={icon} title={insert}
                    onClick={() => setForm(f => ({ ...f, content: f.content + insert }))}
                    style={{ padding: '5px 9px', border: '1px solid #e2e8f0', borderRadius: 5, background: '#fff', cursor: 'pointer', color: '#475569', fontSize: 12 }}>
                    <i className={`fas ${icon}`}></i>
                  </button>
                ))}
                <span style={{ marginLeft: 8, fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center' }}>Hỗ trợ Markdown</span>
              </div>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Viết nội dung bài viết ở đây...&#10;&#10;Hỗ trợ cú pháp Markdown:&#10;## Tiêu đề&#10;**Chữ đậm**, *chữ nghiêng*&#10;- Danh sách"
                style={{
                  width: '100%', minHeight: 420, padding: '16px',
                  border: 'none', outline: 'none', resize: 'vertical',
                  fontFamily: 'monospace', fontSize: 14, lineHeight: 1.7,
                  color: '#334155', boxSizing: 'border-box',
                }}
              />
            </div>
          ) : (
            /* SEO Tab */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* SEO Score */}
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>Điểm SEO</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: seoColor(seoScore), fontFamily: 'Montserrat, sans-serif' }}>
                    {seoScore}<span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>/100</span>
                  </div>
                </div>
                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ height: '100%', width: `${seoScore}%`, background: seoColor(seoScore), borderRadius: 99, transition: 'width .4s ease' }} />
                </div>
                <div style={{ fontSize: 13, color: seoColor(seoScore), fontWeight: 700 }}>{seoLabel(seoScore)}</div>
              </div>

              {/* Focus keyword */}
              <SeoField label="Từ khóa trọng tâm" hint="Từ khóa chính bài viết nhắm đến">
                <input name="focus_keyword" value={form.focus_keyword} onChange={handleChange}
                  placeholder="vd: giày bóng đá Nike"
                  style={inputStyle} />
              </SeoField>

              {/* SEO Title */}
              <SeoField label="SEO Title" hint="Tiêu đề hiển thị trên Google (50–65 ký tự tốt nhất)">
                <input name="seo_title" value={form.seo_title} onChange={handleChange}
                  placeholder="Tiêu đề SEO..."
                  style={{ ...inputStyle, borderColor: titleLen > 65 ? '#ef4444' : titleLen >= 40 ? '#16a34a' : '#e2e8f0' }} />
                <CharBar current={titleLen} min={40} max={65} />
              </SeoField>

              {/* SEO Description */}
              <SeoField label="Meta Description" hint="Mô tả hiển thị trên Google (120–160 ký tự tốt nhất)">
                <textarea name="seo_description" value={form.seo_description} onChange={handleChange}
                  rows={3} placeholder="Mô tả ngắn gọn hấp dẫn người đọc click vào..."
                  style={{ ...inputStyle, resize: 'vertical', borderColor: descLen > 160 ? '#ef4444' : descLen >= 120 ? '#16a34a' : '#e2e8f0' }} />
                <CharBar current={descLen} min={120} max={160} />
              </SeoField>

              {/* Keywords */}
              <SeoField label="Keywords" hint="Các từ khóa phụ, cách nhau bởi dấu phẩy">
                <input name="seo_keywords" value={form.seo_keywords} onChange={handleChange}
                  placeholder="giày thể thao, giày Nike, mua giày online..."
                  style={inputStyle} />
              </SeoField>

              {/* Google Preview */}
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#475569', marginBottom: 14, textTransform: 'uppercase', letterSpacing: .5 }}>
                  <i className="fab fa-google" style={{ marginRight: 6, color: '#4285F4' }}></i>
                  Xem trước trên Google
                </div>
                <div style={{ background: '#fff', border: '1px solid #dfe1e5', borderRadius: 10, padding: '16px 20px' }}>
                  {/* Breadcrumb */}
                  <div style={{ fontSize: 12, color: '#202124', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 18, height: 18, background: '#4285F4', borderRadius: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#fff', fontSize: 9, fontWeight: 800 }}>S</span>
                    </div>
                    <span style={{ color: '#5f6368' }}>sigonsport.vn › tin-tuc › {form.slug || 'duong-dan-bai-viet'}</span>
                  </div>
                  {/* Title */}
                  <div style={{ fontSize: 18, color: '#1a0dab', fontWeight: 400, lineHeight: 1.3, marginBottom: 4, cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.target.style.textDecoration = 'none'}>
                    {form.seo_title || form.title || 'Tiêu đề SEO sẽ hiển thị tại đây'}
                  </div>
                  {/* Description */}
                  <div style={{ fontSize: 13, color: '#4d5156', lineHeight: 1.6 }}>
                    {form.seo_description || form.excerpt || 'Mô tả meta sẽ hiển thị tại đây. Viết một đoạn ngắn hấp dẫn người đọc click vào kết quả tìm kiếm của bạn.'}
                  </div>
                </div>
              </div>

              {/* SEO Checklist */}
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: .5 }}>
                  Checklist SEO
                </div>
                {[
                  { ok: !!form.seo_title, text: 'SEO Title đã điền' },
                  { ok: titleLen >= 40 && titleLen <= 65, text: `SEO Title đúng độ dài (${titleLen}/65 ký tự)` },
                  { ok: !!form.seo_description, text: 'Meta Description đã điền' },
                  { ok: descLen >= 120 && descLen <= 160, text: `Meta Description đúng độ dài (${descLen}/160 ký tự)` },
                  { ok: !!(form.focus_keyword && form.seo_title?.toLowerCase().includes(form.focus_keyword.toLowerCase())), text: 'Từ khóa có trong SEO Title' },
                  { ok: !!(form.focus_keyword && form.seo_description?.toLowerCase().includes(form.focus_keyword.toLowerCase())), text: 'Từ khóa có trong Meta Description' },
                  { ok: !!(form.focus_keyword && form.title?.toLowerCase().includes(form.focus_keyword.toLowerCase())), text: 'Từ khóa có trong tiêu đề bài viết' },
                  { ok: !!form.cover_img, text: 'Ảnh đại diện đã có' },
                  { ok: !!form.excerpt, text: 'Tóm tắt bài viết đã có' },
                  { ok: !!form.slug, text: 'Đường dẫn (slug) đã có' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < 9 ? '1px solid #f8fafc' : 'none' }}>
                    <i className={`fas fa-${item.ok ? 'circle-check' : 'circle-xmark'}`} style={{ color: item.ok ? '#16a34a' : '#e2e8f0', fontSize: 14 }}></i>
                    <span style={{ fontSize: 13, color: item.ok ? '#334155' : '#94a3b8' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Excerpt (always visible) */}
          <div style={{ marginTop: 16, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 16 }}>
            <label style={labelStyle}>Tóm tắt bài viết</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange}
              rows={3} placeholder="Tóm tắt ngắn gọn hiển thị ở trang danh sách và dùng làm Meta Description..."
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Publish */}
          <SideCard title="Xuất bản" icon="fa-rocket">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['draft','Nháp','#f1f5f9','#475569'], ['published','Đã đăng','#dcfce7','#166534']].map(([val, label, bg, color]) => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 10px', borderRadius: 8, background: form.status === val ? bg : 'transparent', border: `1.5px solid ${form.status === val ? color + '44' : '#e2e8f0'}` }}>
                  <input type="radio" name="status" value={val} checked={form.status === val}
                    onChange={handleChange} style={{ accentColor: color }} />
                  <span style={{ fontSize: 13, fontWeight: form.status === val ? 700 : 400, color }}>{label}</span>
                </label>
              ))}
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8 }}>
              <button onClick={() => handleSave()} disabled={saving} style={{
                flex: 1, padding: '8px', borderRadius: 7, border: '1.5px solid #e2e8f0',
                background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#475569',
              }}>Lưu</button>
              <button onClick={() => handleSave('published')} disabled={saving || !form.title} style={{
                flex: 1, padding: '8px', borderRadius: 7, border: 'none',
                background: '#2563eb', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              }}>Đăng</button>
            </div>
          </SideCard>

          {/* Cover image */}
          <SideCard title="Ảnh đại diện" icon="fa-image">
            {form.cover_img && (
              <img src={form.cover_img} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
            )}
            <input name="cover_img" value={form.cover_img} onChange={handleChange}
              placeholder="https://... (URL ảnh)"
              style={{ ...inputStyle, fontSize: 12 }} />
          </SideCard>

          {/* Category */}
          <SideCard title="Danh mục & Tags" icon="fa-folder">
            <label style={labelStyle}>Danh mục</label>
            <select name="category" value={form.category} onChange={handleChange} style={{ ...inputStyle, marginBottom: 10 }}>
              <option value="">— Chọn danh mục —</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label style={labelStyle}>Tags (cách nhau bởi dấu phẩy)</label>
            <input name="tags" value={form.tags} onChange={handleChange}
              placeholder="Nike, giày bóng đá, FG..."
              style={inputStyle} />
          </SideCard>

          {/* Quick SEO summary on content tab */}
          {activeTab === 'content' && (
            <SideCard title="SEO nhanh" icon="fa-magnifying-glass-chart">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid ${seoColor(seoScore)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: seoColor(seoScore) }}>{seoScore}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: seoColor(seoScore) }}>{seoLabel(seoScore)}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Click tab SEO để xem chi tiết</div>
                </div>
              </div>
              <button onClick={() => setActiveTab('seo')} style={{
                width: '100%', padding: '7px', borderRadius: 7, border: '1.5px solid #2563eb',
                background: '#fff', color: '#2563eb', cursor: 'pointer', fontWeight: 700, fontSize: 12,
              }}>
                <i className="fas fa-arrow-right" style={{ marginRight: 6 }}></i>Tối ưu SEO
              </button>
            </SideCard>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Small helpers ---- */

function SideCard({ title, icon, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
        <i className={`fas ${icon}`} style={{ color: '#64748b', fontSize: 13 }}></i>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{title}</span>
      </div>
      <div style={{ padding: '14px 16px' }}>{children}</div>
    </div>
  );
}

function SeoField({ label, hint, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 16 }}>
      <label style={{ ...labelStyle, fontSize: 13 }}>{label}</label>
      {hint && <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>{hint}</div>}
      {children}
    </div>
  );
}

function CharBar({ current, min, max }) {
  const pct   = Math.min((current / max) * 100, 100);
  const color = current > max ? '#ef4444' : current >= min ? '#16a34a' : '#f59e0b';
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 4, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width .2s' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <span style={{ fontSize: 10, color }}>
          {current > max ? `Quá dài (${current - max} ký tự)` : current >= min ? 'Độ dài tốt' : `Cần thêm ${min - current} ký tự`}
        </span>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{current}/{max}</span>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#475569',
  marginBottom: 5, textTransform: 'uppercase', letterSpacing: .5,
};

const inputStyle = {
  width: '100%', padding: '8px 11px', borderRadius: 7,
  border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color .15s',
};

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useCart } from '../../../lib/cart-context';
import supabase from '../../../lib/supabase';
import { formatPrice } from '../../../lib/format';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error || !data) { setLoading(false); return; }
    setProduct(data);
    if (data.sizes?.length) setSelectedSize(data.sizes[0]);
    if (data.colors?.length) setSelectedColor(data.colors[0]);

    // Fetch related
    const { data: rel } = await supabase
      .from('products')
      .select('*')
      .eq('sport', data.sport)
      .neq('id', id)
      .limit(4);
    setRelated(rel || []);
    setLoading(false);
  }

  function handleAddToCart() {
    if (!product) return;
    addItem({
      id:    product.id,
      name:  product.name,
      img:   product.img,
      price: product.price,
      size:  selectedSize || '',
      color: selectedColor || '',
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) return (
    <>
      <Header />
      <main style={{ padding: '80px 0', textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#0057FF' }}></i>
        <p style={{ marginTop: 12, color: '#888' }}>Đang tải sản phẩm...</p>
      </main>
      <Footer />
    </>
  );

  if (!product) return (
    <>
      <Header />
      <main style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Không tìm thấy sản phẩm</h2>
        <Link href="/products" className="btn btn-primary">Xem sản phẩm khác</Link>
      </main>
      <Footer />
    </>
  );

  const saving = product.original_price ? product.original_price - product.price : 0;

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="container" style={{ padding: '14px var(--container-px)' }}>
          <nav style={{ fontSize: 13, color: '#888', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#888' }}>Trang chủ</Link>
            <span>/</span>
            <Link href="/products" style={{ color: '#888' }}>Sản phẩm</Link>
            <span>/</span>
            <span style={{ color: '#111' }}>{product.name}</span>
          </nav>
        </div>

        {/* Main */}
        <div className="container" style={{ padding: '0 var(--container-px) 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>

            {/* Image */}
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{ aspectRatio: '1', borderRadius: 12, overflow: 'hidden', background: '#f5f5f5', position: 'relative' }}>
                <img
                  src={product.img || 'https://placehold.co/600x600/f0f4ff/0057FF?text=SP'}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {product.discount > 0 && (
                  <div style={{
                    position: 'absolute', top: 16, left: 16,
                    background: '#E5002B', color: '#fff',
                    fontWeight: 800, fontSize: 18, padding: '6px 12px',
                    borderRadius: 8,
                  }}>
                    -{product.discount}%
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div>
              {/* Badges */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                {product.is_hot && <span className="badge badge-hot">HOT</span>}
                {product.is_new && <span className="badge badge-new">MỚI</span>}
                {product.is_secondhand && <span className="badge badge-secondhand">SECONDHAND</span>}
                <span className={`badge ${product.in_stock ? 'badge-stock' : ''}`} style={!product.in_stock ? { background: '#fee2e2', color: '#dc2626' } : {}}>
                  {product.in_stock ? '✓ Còn hàng' : '✗ Hết hàng'}
                </span>
              </div>

              <div style={{ fontSize: 13, color: '#888', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>{product.brand}</div>
              <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 26, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, color: '#111' }}>
                {product.name}
              </h1>

              {/* Condition (secondhand) */}
              {product.is_secondhand && product.condition && (
                <div style={{ background: '#fef9c3', border: '1.5px solid #fbbf24', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>
                  <strong>Tình trạng:</strong> {product.condition}
                </div>
              )}

              {/* Rating */}
              {product.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ color: '#f59e0b', fontSize: 16 }}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                  <span style={{ fontSize: 13, color: '#888' }}>{product.rating} ({product.review_count} đánh giá) · {product.sold} đã bán</span>
                </div>
              )}

              {/* Price */}
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: '#E5002B', fontFamily: 'Montserrat, sans-serif' }}>
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <>
                    <span style={{ marginLeft: 12, fontSize: 18, color: '#aaa', textDecoration: 'line-through' }}>
                      {formatPrice(product.original_price)}
                    </span>
                    <span style={{ marginLeft: 10, fontSize: 13, color: '#00B04F', fontWeight: 700 }}>
                      Tiết kiệm {formatPrice(saving)}
                    </span>
                  </>
                )}
              </div>

              {/* Size selector */}
              {product.sizes?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', color: '#666' }}>
                    Size: <span style={{ color: '#111' }}>{selectedSize}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {product.sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        style={{
                          width: 48, height: 48, border: '2px solid',
                          borderColor: selectedSize === s ? '#0057FF' : '#ddd',
                          borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                          background: selectedSize === s ? '#eff6ff' : '#fff',
                          color: selectedSize === s ? '#0057FF' : '#333',
                        }}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color selector */}
              {product.colors?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', color: '#666' }}>
                    Màu: <span style={{ color: '#111' }}>{selectedColor}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {product.colors.map(c => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        style={{
                          padding: '6px 14px', border: '2px solid',
                          borderColor: selectedColor === c ? '#0057FF' : '#ddd',
                          borderRadius: 99, fontSize: 13, cursor: 'pointer',
                          background: selectedColor === c ? '#eff6ff' : '#fff',
                          color: selectedColor === c ? '#0057FF' : '#333', fontWeight: 600,
                        }}
                      >{c}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#666' }}>Số lượng:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, background: '#f5f5f5', border: 'none', fontSize: 18, cursor: 'pointer' }}>−</button>
                  <span style={{ width: 48, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 40, background: '#f5f5f5', border: 'none', fontSize: 18, cursor: 'pointer' }}>+</button>
                </div>
              </div>

              {/* Add to cart */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '14px 24px', fontSize: 16 }}
                >
                  {added
                    ? <><i className="fas fa-check"></i> Đã thêm!</>
                    : <><i className="fas fa-cart-plus"></i> Thêm vào giỏ</>
                  }
                </button>
                <Link href="/checkout" className="btn btn-outline" style={{ justifyContent: 'center', padding: '14px 20px' }}>
                  <i className="fas fa-credit-card"></i> Mua ngay
                </Link>
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '16px', background: '#f9fafb', borderRadius: 10 }}>
                {[
                  { icon: 'fa-truck', text: 'Miễn phí vận chuyển đơn từ 500K' },
                  { icon: 'fa-shield-alt', text: 'Hàng chính hãng 100%' },
                  { icon: 'fa-rotate-left', text: 'Đổi trả trong 7 ngày' },
                  { icon: 'fa-headset', text: 'Hỗ trợ 24/7: 0909 123 456' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#555' }}>
                    <i className={`fas ${icon}`} style={{ color: '#00B04F', width: 16 }}></i>
                    {text}
                  </div>
                ))}
              </div>

              {/* Description */}
              {product.description && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Mô tả sản phẩm</h3>
                  <p style={{ color: '#555', lineHeight: 1.7, fontSize: 14 }}>{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <section style={{ marginTop: 60 }}>
              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 24 }}>
                Sản Phẩm Liên Quan
              </h2>
              <div className="product-grid product-grid--4col">
                {related.map(p => (
                  <div key={p.id} className="product-card">
                    <div className="product-card__image-wrap">
                      <img src={p.img || 'https://placehold.co/400x400'} alt={p.name} loading="lazy" />
                      <div className="product-card__badges">
                        {p.is_hot && <span className="badge badge-hot">HOT</span>}
                        {p.is_new && <span className="badge badge-new">MỚI</span>}
                      </div>
                      {p.discount > 0 && <div className="product-card__discount">-{p.discount}%</div>}
                    </div>
                    <div className="product-card__body">
                      <div className="product-card__brand">{p.brand}</div>
                      <Link href={`/products/${p.id}`} className="product-card__name">{p.name}</Link>
                      <div className="product-card__price">
                        <span className="price-sale">{formatPrice(p.price)}</span>
                        {p.original_price && <span className="price-original">{formatPrice(p.original_price)}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

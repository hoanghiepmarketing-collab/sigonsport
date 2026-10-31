'use client';

import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../lib/cart-context';
import { formatPrice } from '../../lib/format';

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCart();

  const subtotal = total();
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const grandTotal = subtotal + shipping;

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
            Giỏ hàng đang trống
          </h2>
          <p style={{ color: '#888', marginBottom: 24 }}>Hãy thêm sản phẩm vào giỏ để tiếp tục mua sắm</p>
          <Link href="/products" className="btn btn-primary">
            <i className="fas fa-shopping-bag"></i> Mua sắm ngay
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ padding: '24px 0 60px' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 24 }}>
            <i className="fas fa-shopping-cart" style={{ color: '#0057FF', marginRight: 10 }}></i>
            Giỏ Hàng ({items.length} sản phẩm)
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
            {/* Items */}
            <div>
              {items.map((item, idx) => (
                <div key={`${item.id}-${item.size}-${item.color}`} style={{
                  display: 'flex', gap: 16, padding: '20px',
                  background: '#fff', borderRadius: 12, marginBottom: 12,
                  boxShadow: '0 1px 4px rgba(0,0,0,.07)',
                  border: '1px solid #f0f0f0',
                }}>
                  <img
                    src={item.img || 'https://placehold.co/100x100'}
                    alt={item.name}
                    style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                      {item.size && <span>Size: {item.size}</span>}
                      {item.size && item.color && <span style={{ margin: '0 6px' }}>·</span>}
                      {item.color && <span>Màu: {item.color}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#E5002B' }}>
                        {formatPrice(item.price)}
                      </span>
                      {/* Qty control */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
                        <button
                          onClick={() => updateQty(item.id, item.size, item.color, item.qty - 1)}
                          style={{ width: 34, height: 34, background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: 16 }}
                        >−</button>
                        <span style={{ width: 40, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.size, item.color, item.qty + 1)}
                          style={{ width: 34, height: 34, background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: 16 }}
                        >+</button>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>
                        = {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.size, item.color)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 18, padding: 4, alignSelf: 'flex-start' }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.07)', border: '1px solid #f0f0f0', position: 'sticky', top: 90 }}>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #f0f0f0' }}>
                Tóm Tắt Đơn Hàng
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14, color: '#555' }}>
                <span>Tạm tính ({items.reduce((s, i) => s + i.qty, 0)} sản phẩm)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 14, color: '#555' }}>
                <span>Phí vận chuyển</span>
                <span style={{ color: shipping === 0 ? '#00B04F' : '#111', fontWeight: 600 }}>
                  {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                </span>
              </div>

              {subtotal < 500000 && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 12px', marginBottom: 16, fontSize: 12, color: '#166534' }}>
                  <i className="fas fa-truck"></i> Mua thêm {formatPrice(500000 - subtotal)} để miễn phí ship!
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid #f0f0f0', marginBottom: 20 }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>Tổng cộng</span>
                <span style={{ fontWeight: 800, fontSize: 22, color: '#E5002B' }}>{formatPrice(grandTotal)}</span>
              </div>

              <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}>
                <i className="fas fa-credit-card"></i> Tiến hành thanh toán
              </Link>
              <Link href="/products" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 10, fontSize: 14 }}>
                <i className="fas fa-arrow-left"></i> Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

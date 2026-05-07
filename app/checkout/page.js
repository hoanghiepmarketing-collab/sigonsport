'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../lib/cart-context';
import supabase from '../../lib/supabase';
import { formatPrice } from '../../lib/format';

const PROVINCES = ['TP. Hồ Chí Minh','Hà Nội','Đà Nẵng','Cần Thơ','Hải Phòng','Bình Dương','Đồng Nai','Long An','Vũng Tàu','Khánh Hòa','Đắk Lắk','Lâm Đồng','An Giang','Kiên Giang','Tiền Giang','Nghệ An','Thanh Hóa','Thái Nguyên','Quảng Nam','Huế','Bình Định','Gia Lai'];

export default function CheckoutPage() {
  const { items, clearCart, total } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', province: '', note: '' });
  const [payment, setPayment] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const subtotal = total();
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const grandTotal = subtotal + shipping;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Vui lòng nhập họ tên'); return; }
    if (!form.phone.trim()) { setError('Vui lòng nhập số điện thoại'); return; }
    if (!form.address.trim()) { setError('Vui lòng nhập địa chỉ'); return; }
    if (!items.length) { setError('Giỏ hàng đang trống'); return; }

    setLoading(true);
    setError('');

    try {
      // Generate order number
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const orderNumber = `SIGON${String((count || 0) + 1).padStart(5, '0')}`;

      const { data, error: err } = await supabase.from('orders').insert({
        order_number:      orderNumber,
        customer_name:     form.name.trim(),
        customer_phone:    form.phone.trim(),
        customer_email:    form.email.trim(),
        customer_address:  form.address.trim(),
        customer_province: form.province,
        customer_note:     form.note.trim(),
        items: items.map(i => ({
          product_id: i.id,
          name: i.name,
          img: i.img,
          price: i.price,
          size: i.size,
          color: i.color,
          quantity: i.qty,
        })),
        subtotal,
        shipping,
        total: grandTotal,
        payment_method: payment,
        status: 'pending',
      }).select().single();

      if (err) throw new Error(err.message);

      clearCart();
      setSuccess(data.order_number || orderNumber);
    } catch (err) {
      setError('Đặt hàng thất bại: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <Header />
        <main style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 28, fontWeight: 900, marginBottom: 10 }}>
              Đặt Hàng Thành Công!
            </h2>
            <p style={{ fontSize: 16, color: '#0057FF', fontWeight: 700, marginBottom: 8 }}>
              Mã đơn hàng: <strong>{success}</strong>
            </p>
            <p style={{ color: '#666', marginBottom: 8 }}>
              Cảm ơn bạn đã mua sắm tại <strong>SIGON SPORT</strong>
            </p>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>
              Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 30 phút.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="btn btn-primary">
                <i className="fas fa-home"></i> Về trang chủ
              </Link>
              <Link href="/products" className="btn btn-outline">
                <i className="fas fa-shopping-bag"></i> Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!items.length) {
    return (
      <>
        <Header />
        <main style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <p style={{ marginBottom: 16, color: '#888' }}>Giỏ hàng đang trống</p>
          <Link href="/products" className="btn btn-primary">Mua sắm ngay</Link>
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
          {/* Steps */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32, flexWrap: 'wrap' }}>
            {['Thông tin', 'Xác nhận', 'Hoàn tất'].map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', borderRadius: 99,
                  background: i === 0 ? '#0057FF' : '#f0f0f0',
                  color: i === 0 ? '#fff' : '#888', fontWeight: 700, fontSize: 13,
                }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: i === 0 ? 'rgba(255,255,255,.3)' : '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{i + 1}</span>
                  {step}
                </div>
                {i < 2 && <div style={{ width: 32, height: 2, background: '#ddd' }}></div>}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'start' }}>
            {/* Form */}
            <div>
              <form onSubmit={handleSubmit}>
                {/* Customer info */}
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                  <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                    <i className="fas fa-user" style={{ color: '#0057FF', marginRight: 8 }}></i>
                    Thông Tin Giao Hàng
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Họ và tên <span style={{ color: '#E5002B' }}>*</span></label>
                      <input className="form-input" type="text" placeholder="Nguyễn Văn A"
                        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Số điện thoại <span style={{ color: '#E5002B' }}>*</span></label>
                      <input className="form-input" type="tel" placeholder="0909 123 456"
                        value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" placeholder="email@example.com"
                        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tỉnh / Thành phố</label>
                      <select className="form-input" value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))}>
                        <option value="">— Chọn tỉnh thành —</option>
                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Địa chỉ cụ thể <span style={{ color: '#E5002B' }}>*</span></label>
                      <input className="form-input" type="text" placeholder="Số nhà, đường, phường/xã..."
                        value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Ghi chú đơn hàng</label>
                      <textarea className="form-input" rows={3} placeholder="Yêu cầu đặc biệt, thời gian nhận hàng..."
                        value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                  <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                    <i className="fas fa-credit-card" style={{ color: '#0057FF', marginRight: 8 }}></i>
                    Phương Thức Thanh Toán
                  </h2>
                  {[
                    { value: 'cod', icon: 'fa-money-bill-wave', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt khi nhận hàng' },
                    { value: 'bank', icon: 'fa-university', label: 'Chuyển khoản ngân hàng', desc: 'MB Bank: 0909123456 — NGUYEN VAN A' },
                  ].map(opt => (
                    <label key={opt.value} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16, borderRadius: 10,
                      border: `2px solid ${payment === opt.value ? '#0057FF' : '#e5e7eb'}`,
                      background: payment === opt.value ? '#f0f6ff' : '#fff',
                      cursor: 'pointer', marginBottom: 10,
                    }}>
                      <input type="radio" name="payment" value={opt.value} checked={payment === opt.value} onChange={() => setPayment(opt.value)} style={{ marginTop: 2 }} />
                      <i className={`fas ${opt.icon}`} style={{ color: '#0057FF', marginTop: 2, width: 18 }}></i>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#dc2626', fontSize: 14 }}>
                    <i className="fas fa-exclamation-circle"></i> {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 16, fontWeight: 800 }}>
                  {loading
                    ? <><i className="fas fa-spinner fa-spin"></i> Đang đặt hàng...</>
                    : <><i className="fas fa-check-circle"></i> Đặt Hàng Ngay — {formatPrice(grandTotal)}</>
                  }
                </button>
              </form>
            </div>

            {/* Order summary */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.06)', position: 'sticky', top: 90 }}>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 800, marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #f0f0f0' }}>
                Đơn Hàng ({items.length} sản phẩm)
              </h3>
              <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
                {items.map(item => (
                  <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #f5f5f5' }}>
                    <img src={item.img || 'https://placehold.co/56x56'} alt={item.name}
                      style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 2 }}>{item.name}</div>
                      {item.size && <div style={{ fontSize: 11, color: '#888' }}>Size: {item.size} · ×{item.qty}</div>}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#E5002B', whiteSpace: 'nowrap' }}>
                      {formatPrice(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                {[
                  { label: 'Tạm tính', val: formatPrice(subtotal) },
                  { label: 'Vận chuyển', val: shipping === 0 ? 'Miễn phí' : formatPrice(shipping), green: shipping === 0 },
                ].map(({ label, val, green }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#666' }}>
                    <span>{label}</span>
                    <span style={green ? { color: '#00B04F', fontWeight: 700 } : {}}>{val}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '2px solid #f0f0f0', fontWeight: 800, fontSize: 18 }}>
                  <span>Tổng cộng</span>
                  <span style={{ color: '#E5002B' }}>{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import supabase from '../../lib/supabase';
import { formatPrice } from '../../lib/format';

export const CHANNELS = [
  { value: 'website',   label: 'Website',      color: '#2563eb', bg: '#eff6ff', icon: 'fa-globe' },
  { value: 'facebook',  label: 'Facebook',     color: '#1877f2', bg: '#eff6ff', icon: 'fa-facebook' },
  { value: 'zalo',      label: 'Zalo',         color: '#0068ff', bg: '#e0f2fe', icon: 'fa-comment' },
  { value: 'phone',     label: 'Điện thoại',   color: '#16a34a', bg: '#f0fdf4', icon: 'fa-phone' },
  { value: 'tiktok',    label: 'TikTok',       color: '#111827', bg: '#f8fafc', icon: 'fa-music' },
  { value: 'instagram', label: 'Instagram',    color: '#e1306c', bg: '#fdf2f8', icon: 'fa-instagram' },
  { value: 'walkin',    label: 'Tại cửa hàng', color: '#ea580c', bg: '#fff7ed', icon: 'fa-store' },
];

const FREE_SHIP = 500000;
const SHIP_FEE  = 35000;

const EMPTY_CUSTOMER = { name: '', phone: '', email: '', address: '', province: '', note: '' };

export default function CreateOrderModal({ onClose, onCreated }) {
  const [step, setStep]               = useState(1); // 1=khách, 2=sản phẩm, 3=đặt hàng
  const [customer, setCustomer]       = useState(EMPTY_CUSTOMER);
  const [suggestions, setSuggestions] = useState([]);
  const [cartItems, setCartItems]     = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productResults, setProductResults] = useState([]);
  const [searchLoading, setSearchLoading]   = useState(false);
  const [channel, setChannel]         = useState('phone');
  const [payment, setPayment]         = useState('cod');
  const [orderStatus, setOrderStatus] = useState('confirmed');
  const [submitting, setSubmitting]   = useState(false);
  const searchTimer = useRef(null);

  // Tìm khách hàng từ đơn hàng cũ theo SĐT
  async function lookupPhone(phone) {
    if (phone.length < 8) { setSuggestions([]); return; }
    const { data } = await supabase
      .from('orders')
      .select('customer_name,customer_phone,customer_email,customer_address,customer_province')
      .eq('customer_phone', phone)
      .limit(3);
    if (data?.length) {
      setSuggestions(data.map(o => ({
        name: o.customer_name, phone: o.customer_phone,
        email: o.customer_email || '', address: o.customer_address, province: o.customer_province,
      })));
    } else {
      // Cũng tìm trong bảng customers nếu có
      const { data: cust } = await supabase
        .from('customers')
        .select('name,phone,email,address,province')
        .ilike('phone', `%${phone}%`)
        .limit(3);
      setSuggestions(cust || []);
    }
  }

  function handlePhoneChange(e) {
    const v = e.target.value;
    setCustomer(c => ({ ...c, phone: v }));
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => lookupPhone(v), 400);
  }

  function applySuggestion(s) {
    setCustomer({ name: s.name, phone: s.phone, email: s.email || '', address: s.address, province: s.province, note: '' });
    setSuggestions([]);
  }

  // Tìm sản phẩm
  async function searchProducts(q) {
    if (!q.trim()) { setProductResults([]); return; }
    setSearchLoading(true);
    const { data } = await supabase
      .from('products')
      .select('id,name,brand,price,img,sizes,colors,in_stock')
      .ilike('name', `%${q}%`)
      .eq('in_stock', true)
      .limit(8);
    setProductResults(data || []);
    setSearchLoading(false);
  }

  function handleProductSearch(e) {
    const v = e.target.value;
    setProductSearch(v);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => searchProducts(v), 350);
  }

  function addToCart(product) {
    setCartItems(items => {
      const exists = items.find(i => i.id === product.id);
      if (exists) return items.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...items, {
        id: product.id, name: product.name, brand: product.brand,
        price: product.price, img: product.img,
        sizes: product.sizes || [], colors: product.colors || [],
        size: product.sizes?.[0] || '', color: product.colors?.[0] || '',
        qty: 1,
      }];
    });
    setProductSearch('');
    setProductResults([]);
  }

  function updateItem(id, field, value) {
    setCartItems(items => items.map(i => i.id === id ? { ...i, [field]: value } : i));
  }

  function removeItem(id) {
    setCartItems(items => items.filter(i => i.id !== id));
  }

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping  = subtotal >= FREE_SHIP ? 0 : SHIP_FEE;
  const total     = subtotal + shipping;

  async function handleSubmit() {
    if (!customer.name || !customer.phone) return;
    setSubmitting(true);

    const items = cartItems.map(i => ({
      id: i.id, name: i.name, price: i.price,
      img: i.img, size: i.size, color: i.color, quantity: i.qty,
    }));

    const { error } = await supabase.from('orders').insert({
      customer_name:    customer.name.trim(),
      customer_phone:   customer.phone.trim(),
      customer_email:   customer.email.trim() || null,
      customer_address: customer.address.trim(),
      customer_province: customer.province.trim(),
      customer_note:    customer.note.trim() || null,
      items,
      subtotal,
      shipping,
      total,
      status:         orderStatus,
      payment_method: payment,
      channel,
    });

    setSubmitting(false);
    if (!error) { onCreated?.(); onClose(); }
    else alert('Lỗi: ' + error.message);
  }

  const canSubmit = customer.name && customer.phone && customer.address;

  const ch = CHANNELS.find(c => c.value === channel);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '24px 16px' }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 780, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Tạo đơn hàng mới</h2>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Tạo đơn trực tiếp từ admin</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#94a3b8', lineHeight: 1 }}>×</button>
        </div>

        {/* Step tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
          {[
            [1, 'fa-user', 'Khách hàng'],
            [2, 'fa-box', 'Sản phẩm'],
            [3, 'fa-receipt', 'Đặt hàng'],
          ].map(([s, icon, label]) => (
            <button key={s} onClick={() => setStep(s)} style={{
              flex: 1, padding: '12px 8px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: step === s ? 700 : 400,
              color: step === s ? '#2563eb' : '#64748b',
              borderBottom: step === s ? '2px solid #2563eb' : '2px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', fontSize: 10, fontWeight: 800,
                background: step > s ? '#dcfce7' : step === s ? '#2563eb' : '#e2e8f0',
                color: step > s ? '#16a34a' : step === s ? '#fff' : '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {step > s ? <i className="fas fa-check" style={{ fontSize: 9 }}></i> : s}
              </div>
              {label}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px 24px' }}>

          {/* ─── Step 1: Khách hàng ─── */}
          {step === 1 && (
            <div>
              {/* Phone lookup */}
              <div style={{ marginBottom: 16, position: 'relative' }}>
                <label style={lblSt}>Số điện thoại *</label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-phone" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }}></i>
                  <input value={customer.phone} onChange={handlePhoneChange}
                    placeholder="0901234567 — tự động điền nếu đã có"
                    style={{ ...inpSt, paddingLeft: 36 }} />
                </div>
                {suggestions.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,.1)', zIndex: 10, overflow: 'hidden' }}>
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => applySuggestion(s)} style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '10px 14px', border: 'none', background: '#fff', cursor: 'pointer', textAlign: 'left',
                        borderBottom: i < suggestions.length - 1 ? '1px solid #f8fafc' : 'none',
                      }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#2563eb' }}>
                          {s.name?.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.phone} · {s.province}</div>
                        </div>
                        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#2563eb', fontWeight: 600 }}>Chọn</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <F label="Họ và tên *"><input name="name" value={customer.name} onChange={e => setCustomer(c=>({...c,name:e.target.value}))} style={inpSt} /></F>
                <F label="Email"><input name="email" type="email" value={customer.email} onChange={e => setCustomer(c=>({...c,email:e.target.value}))} style={inpSt} /></F>
                <F label="Địa chỉ *" span><input name="address" value={customer.address} onChange={e => setCustomer(c=>({...c,address:e.target.value}))} style={inpSt} /></F>
                <F label="Tỉnh / Thành phố *"><input name="province" value={customer.province} onChange={e => setCustomer(c=>({...c,province:e.target.value}))} style={inpSt} /></F>
                <F label="Ghi chú" span><textarea name="note" value={customer.note} rows={2} onChange={e => setCustomer(c=>({...c,note:e.target.value}))} style={{...inpSt, resize:'none'}} /></F>
              </div>

              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setStep(2)} disabled={!customer.name || !customer.phone}
                  style={{ ...btnPrimary, opacity: (!customer.name || !customer.phone) ? .5 : 1, cursor: (!customer.name || !customer.phone) ? 'not-allowed' : 'pointer' }}>
                  Tiếp theo: Chọn sản phẩm <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 2: Sản phẩm ─── */}
          {step === 2 && (
            <div>
              {/* Product search */}
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <i className="fas fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }}></i>
                <input value={productSearch} onChange={handleProductSearch}
                  placeholder="Tìm sản phẩm theo tên..."
                  style={{ ...inpSt, paddingLeft: 36 }} />
                {searchLoading && <i className="fas fa-spinner fa-spin" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>}
                {productResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,.1)', zIndex: 10, maxHeight: 280, overflowY: 'auto' }}>
                    {productResults.map(p => (
                      <button key={p.id} onClick={() => addToCart(p)} style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '10px 14px', border: 'none', background: '#fff', cursor: 'pointer', textAlign: 'left',
                        borderBottom: '1px solid #f8fafc',
                      }}>
                        <img src={p.img || 'https://placehold.co/40x40/f0f4ff/0057FF?text=SP'} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                          <div style={{ color: '#94a3b8', fontSize: 11 }}>{p.brand}</div>
                        </div>
                        <div style={{ fontWeight: 700, color: '#E5002B', fontSize: 13 }}>{formatPrice(p.price)}</div>
                        <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>+ Thêm</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart */}
              {cartItems.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
                  <i className="fas fa-box-open fa-2x" style={{ marginBottom: 10, opacity: .4 }}></i>
                  <div style={{ fontSize: 14 }}>Chưa có sản phẩm nào</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Tìm và thêm sản phẩm ở trên</div>
                </div>
              ) : (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                  {cartItems.map((item, i) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < cartItems.length-1 ? '1px solid #f8fafc' : 'none' }}>
                      <img src={item.img || 'https://placehold.co/44x44/f0f4ff/0057FF?text=SP'} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                          {item.sizes.length > 0 && (
                            <select value={item.size} onChange={e => updateItem(item.id,'size',e.target.value)}
                              style={{ fontSize: 11, padding: '2px 6px', border: '1px solid #e2e8f0', borderRadius: 4 }}>
                              {item.sizes.map(s => <option key={s} value={s}>Size {s}</option>)}
                            </select>
                          )}
                          {item.colors.length > 0 && (
                            <select value={item.color} onChange={e => updateItem(item.id,'color',e.target.value)}
                              style={{ fontSize: 11, padding: '2px 6px', border: '1px solid #e2e8f0', borderRadius: 4 }}>
                              {item.colors.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => updateItem(item.id,'qty',Math.max(1,item.qty-1))}
                          style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>−</button>
                        <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{item.qty}</span>
                        <button onClick={() => updateItem(item.id,'qty',item.qty+1)}
                          style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>+</button>
                      </div>
                      <div style={{ fontWeight: 700, color: '#E5002B', fontSize: 13, minWidth: 80, textAlign: 'right' }}>{formatPrice(item.price * item.qty)}</div>
                      <button onClick={() => removeItem(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 14, padding: 4 }}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                  {/* Summary */}
                  <div style={{ background: '#f8fafc', padding: '12px 14px', fontSize: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#475569' }}>
                      <span>Tạm tính</span><span>{formatPrice(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#475569' }}>
                      <span>Vận chuyển</span>
                      <span style={{ color: shipping === 0 ? '#16a34a' : undefined }}>
                        {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 15, color: '#0f172a', paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
                      <span>Tổng cộng</span><span style={{ color: '#E5002B' }}>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(1)} style={btnSecondary}><i className="fas fa-arrow-left"></i> Quay lại</button>
                <button onClick={() => setStep(3)} style={btnPrimary}>Tiếp theo: Đặt hàng <i className="fas fa-arrow-right"></i></button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Đặt hàng ─── */}
          {step === 3 && (
            <div>
              {/* Kênh bán hàng */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ ...lblSt, marginBottom: 10, fontSize: 13 }}>Kênh bán hàng</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CHANNELS.map(c => (
                    <button key={c.value} onClick={() => setChannel(c.value)} style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      border: channel === c.value ? `2px solid ${c.color}` : '2px solid #e2e8f0',
                      background: channel === c.value ? c.bg : '#fff',
                      color: channel === c.value ? c.color : '#64748b',
                      transition: 'all .12s',
                    }}>
                      <i className={`fab ${c.icon}`} style={{ fontSize: 14 }}></i>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thanh toán + Trạng thái */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ ...lblSt, marginBottom: 10 }}>Phương thức thanh toán</label>
                  {[['cod','Tiền mặt (COD)','fa-money-bill-wave'],['bank','Chuyển khoản','fa-building-columns']].map(([v,l,ic]) => (
                    <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${payment===v?'#2563eb':'#e2e8f0'}`, background: payment===v?'#eff6ff':'#fff', cursor: 'pointer', marginBottom: 6 }}>
                      <input type="radio" value={v} checked={payment===v} onChange={()=>setPayment(v)} style={{ accentColor: '#2563eb' }} />
                      <i className={`fas ${ic}`} style={{ color: payment===v?'#2563eb':'#94a3b8', width: 16 }}></i>
                      <span style={{ fontSize: 13, fontWeight: payment===v?700:400, color: payment===v?'#2563eb':'#475569' }}>{l}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label style={{ ...lblSt, marginBottom: 10 }}>Trạng thái đơn hàng</label>
                  {[['pending','Chờ xác nhận','#f59e0b'],['confirmed','Đã xác nhận','#3b82f6'],['shipping','Đang giao','#8b5cf6'],['delivered','Đã giao','#22c55e']].map(([v,l,c]) => (
                    <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${orderStatus===v?c:'#e2e8f0'}`, background: orderStatus===v?c+'18':'#fff', cursor: 'pointer', marginBottom: 6 }}>
                      <input type="radio" value={v} checked={orderStatus===v} onChange={()=>setOrderStatus(v)} style={{ accentColor: c }} />
                      <span style={{ fontSize: 13, fontWeight: orderStatus===v?700:400, color: orderStatus===v?c:'#475569' }}>{l}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tóm tắt */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16, marginBottom: 20, fontSize: 13 }}>
                <div style={{ fontWeight: 700, marginBottom: 10, color: '#0f172a' }}>Tóm tắt đơn hàng</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <span style={{ color: '#64748b' }}>Khách hàng:</span><span style={{ fontWeight: 600 }}>{customer.name} — {customer.phone}</span>
                  <span style={{ color: '#64748b' }}>Địa chỉ:</span><span>{customer.address}, {customer.province}</span>
                  <span style={{ color: '#64748b' }}>Sản phẩm:</span><span>{cartItems.length} sản phẩm ({cartItems.reduce((s,i)=>s+i.qty,0)} cái)</span>
                  <span style={{ color: '#64748b' }}>Kênh:</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <i className={`fab ${ch?.icon}`} style={{ color: ch?.color }}></i>
                    <span style={{ fontWeight: 600 }}>{ch?.label}</span>
                  </span>
                  <span style={{ color: '#64748b' }}>Tổng tiền:</span><span style={{ fontWeight: 800, color: '#E5002B', fontSize: 15 }}>{formatPrice(total)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => setStep(2)} style={btnSecondary}><i className="fas fa-arrow-left"></i> Quay lại</button>
                <button onClick={handleSubmit} disabled={submitting || !canSubmit} style={{
                  ...btnPrimary, background: '#16a34a', opacity: (!canSubmit||submitting)?0.6:1,
                  cursor: (!canSubmit||submitting)?'not-allowed':'pointer',
                }}>
                  {submitting
                    ? <><i className="fas fa-spinner fa-spin"></i> Đang tạo...</>
                    : <><i className="fas fa-check"></i> Xác nhận tạo đơn</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function F({ label, children, span }) {
  return (
    <div style={{ gridColumn: span ? '1/-1' : undefined }}>
      <label style={lblSt}>{label}</label>
      {children}
    </div>
  );
}

const lblSt = { display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .5 };
const inpSt = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color .15s' };
const btnPrimary   = { padding: '9px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 };
const btnSecondary = { padding: '9px 20px', background: '#fff', color: '#475569', border: '1.5px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 };

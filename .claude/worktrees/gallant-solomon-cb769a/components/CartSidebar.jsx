'use client';

import Link from 'next/link';
import { useCart } from '../lib/cart-context';
import { formatPrice } from '../lib/format';

export default function CartSidebar({ isOpen, onClose }) {
  const { items, removeItem, updateQty, total } = useCart();

  const cartTotal = total();
  const shipping = cartTotal >= 500000 ? 0 : 30000;
  const finalTotal = cartTotal + shipping;

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay${isOpen ? ' active' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`cart-sidebar${isOpen ? ' active' : ''}`} aria-label="Giỏ hàng">
        <div className="cart-sidebar__header">
          <span className="cart-sidebar__title">
            <i className="fa fa-shopping-cart" style={{ marginRight: 8 }}></i>
            Giỏ Hàng
          </span>
          <button
            className="cart-sidebar__close"
            onClick={onClose}
            aria-label="Đóng giỏ hàng"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>

        <div className="cart-sidebar__body">
          {items.length === 0 ? (
            <div className="cart-sidebar__empty">
              <i className="fa fa-shopping-cart"></i>
              <p style={{ fontSize: 'var(--fs-base)', marginBottom: 8 }}>Giỏ hàng đang trống</p>
              <p style={{ fontSize: 'var(--fs-sm)' }}>Hãy thêm sản phẩm vào giỏ hàng nhé!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item">
                <img
                  src={item.img || 'https://placehold.co/70x70/f0f0f0/888?text=SP'}
                  alt={item.name}
                  className="cart-item__img"
                  width={70}
                  height={70}
                />
                <div className="cart-item__info">
                  <div className="cart-item__name">{item.name}</div>
                  {(item.size || item.color) && (
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && ' · '}
                      {item.color && `Màu: ${item.color}`}
                    </div>
                  )}
                  <div className="cart-item__price">{formatPrice(item.price)}</div>
                  <div className="cart-item__qty">
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.size, item.color, item.qty - 1)}
                      aria-label="Giảm số lượng"
                    >
                      <i className="fa fa-minus"></i>
                    </button>
                    <span className="qty-num">{item.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.size, item.color, item.qty + 1)}
                      aria-label="Tăng số lượng"
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                  </div>
                </div>
                <button
                  className="cart-item__remove"
                  onClick={() => removeItem(item.id, item.size, item.color)}
                  aria-label="Xóa sản phẩm"
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-sidebar__footer">
            <div style={{ marginBottom: 8, fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Tạm tính:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Phí vận chuyển:</span>
                <span style={{ color: shipping === 0 ? 'var(--color-success)' : 'inherit' }}>
                  {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                </span>
              </div>
            </div>
            <div className="cart-total">
              <span>Tổng cộng:</span>
              <span className="cart-total__price">{formatPrice(finalTotal)}</span>
            </div>
            {shipping === 0 && (
              <p style={{ fontSize: 11, color: 'var(--color-success)', marginBottom: 10, textAlign: 'center' }}>
                <i className="fa fa-check-circle"></i> Bạn được miễn phí vận chuyển!
              </p>
            )}
            {shipping > 0 && (
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 10, textAlign: 'center' }}>
                Mua thêm {formatPrice(500000 - cartTotal)} để được miễn phí vận chuyển
              </p>
            )}
            <Link
              href="/checkout"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={onClose}
            >
              <i className="fa fa-credit-card"></i>
              Thanh toán ngay
            </Link>
            <button
              onClick={onClose}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

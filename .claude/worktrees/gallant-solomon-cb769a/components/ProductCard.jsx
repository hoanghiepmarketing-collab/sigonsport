'use client';

import Link from 'next/link';
import { useCart } from '../lib/cart-context';
import { formatPrice } from '../lib/format';

function StarRating({ rating }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="stars" aria-label={`${rating} sao`}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  );
}

export default function ProductCard({ product, onAddToCart }) {
  const { addItem } = useCart();

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      img: product.img,
      price: product.price,
      qty: 1,
      size: null,
      color: null,
    });
    if (onAddToCart) onAddToCart(product);

    // Hiển thị toast
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  return (
    <Link href={`/products/${product.id}`} className="product-card">
      {/* Image */}
      <div className="product-card__image-wrap">
        <img
          src={product.img || 'https://placehold.co/400x400/f0f0f0/888?text=Sản+phẩm'}
          alt={`${product.name} - ${product.brand || ''}`}
          loading="lazy"
          width={400}
          height={400}
        />

        {/* Badges */}
        <div className="product-card__badges">
          {product.is_secondhand && (
            <span className="badge badge-secondhand">2nd</span>
          )}
          {product.is_hot && !product.is_secondhand && (
            <span className="badge badge-hot">HOT</span>
          )}
          {product.is_new && !product.is_secondhand && (
            <span className="badge badge-new">MỚI</span>
          )}
        </div>

        {/* Discount */}
        {product.discount > 0 && (
          <span className="product-card__discount">-{product.discount}%</span>
        )}

        {/* Wishlist */}
        <button
          className="product-card__wishlist"
          aria-label="Thêm vào yêu thích"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <i className="fa fa-heart"></i>
        </button>

        {/* Add to cart - hover */}
        <button
          className="product-card__add-btn"
          onClick={handleAddToCart}
          aria-label="Thêm vào giỏ hàng"
        >
          <i className="fa fa-shopping-cart"></i> Thêm vào giỏ
        </button>
      </div>

      {/* Body */}
      <div className="product-card__body">
        {product.brand && (
          <div className="product-card__brand">{product.brand}</div>
        )}
        <div className="product-card__name">{product.name}</div>

        {product.is_secondhand && product.condition && (
          <div className="product-card__condition">
            <i className="fa fa-recycle"></i> {product.condition}
          </div>
        )}

        {product.rating && (
          <div className="product-card__rating">
            <StarRating rating={product.rating} />
            <span className="product-card__rating-count">({product.review_count || 0})</span>
            {product.sold > 0 && (
              <span className="product-card__sold">· Đã bán {product.sold}</span>
            )}
          </div>
        )}

        <div className="product-card__price">
          <span className="price-sale">{formatPrice(product.price)}</span>
          {product.original_price > product.price && (
            <span className="price-original">{formatPrice(product.original_price)}</span>
          )}
          {product.is_secondhand && product.original_price > 0 && (
            <span className="price-new-ref">
              Mới: <span>{formatPrice(product.original_price)}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Helper hiển thị toast
function showToast(message, type = 'success') {
  if (typeof document === 'undefined') return;
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : '!'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

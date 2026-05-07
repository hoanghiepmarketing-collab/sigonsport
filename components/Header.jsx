'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../lib/cart-context';
import CartSidebar from './CartSidebar';

const NAV_ITEMS = [
  {
    label: 'Bóng Đá',
    href: '/products?sport=bong-da',
    icon: 'fa-futbol',
    hot: false,
    children: [
      { label: 'Giày sân cỏ (FG)', href: '/products?sport=bong-da&category=giay&sub=fg' },
      { label: 'Giày sân nhân tạo (TF)', href: '/products?sport=bong-da&category=giay&sub=tf' },
      { label: 'Giày futsal (IC)', href: '/products?sport=bong-da&category=giay&sub=ic' },
      { label: 'Bóng & Phụ kiện', href: '/products?sport=bong-da&category=phu-kien' },
    ],
  },
  {
    label: 'Cầu Lông',
    href: '/products?sport=cau-long',
    icon: 'fa-circle',
    hot: false,
    children: [
      { label: 'Vợt cầu lông', href: '/products?sport=cau-long&category=vot' },
      { label: 'Giày cầu lông', href: '/products?sport=cau-long&category=giay' },
      { label: 'Cầu lông & Phụ kiện', href: '/products?sport=cau-long&category=phu-kien' },
    ],
  },
  {
    label: 'Tennis',
    href: '/products?sport=tennis',
    icon: 'fa-circle-dot',
    hot: false,
    children: [
      { label: 'Vợt tennis', href: '/products?sport=tennis&category=vot' },
      { label: 'Giày tennis', href: '/products?sport=tennis&category=giay' },
      { label: 'Bóng & Phụ kiện', href: '/products?sport=tennis&category=phu-kien' },
    ],
  },
  {
    label: 'Pickleball',
    href: '/products?sport=pickleball',
    icon: 'fa-table-tennis-paddle-ball',
    hot: true,
    children: [
      { label: 'Vợt pickleball', href: '/products?sport=pickleball&category=vot' },
      { label: 'Giày pickleball', href: '/products?sport=pickleball&category=giay' },
      { label: 'Bóng & Phụ kiện', href: '/products?sport=pickleball&category=phu-kien' },
    ],
  },
  {
    label: '♻ Secondhand',
    href: '/products?secondhand=true',
    icon: null,
    hot: false,
    isSecondhand: true,
    children: [
      { label: 'Giày bóng đá 2nd', href: '/products?sport=bong-da&secondhand=true' },
      { label: 'Giày cầu lông 2nd', href: '/products?sport=cau-long&secondhand=true' },
      { label: 'Giày tennis 2nd', href: '/products?sport=tennis&secondhand=true' },
      { label: 'Vợt 2nd', href: '/products?category=vot&secondhand=true' },
    ],
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [openMobileNav, setOpenMobileNav] = useState(null);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);
  const router = useRouter();
  const { count } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearchInput(e) {
    const q = e.target.value;
    setSearchQuery(q);
    clearTimeout(debounceRef.current);
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data } = await supabase
          .from('products')
          .select('id, name, img, price')
          .ilike('name', `%${q}%`)
          .limit(5);
        setSuggestions(data || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  const cartCount = count();

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <div className="container">
          <div className="topbar__inner">
            <div className="topbar__left">
              <span className="topbar__item">
                <i className="fa fa-truck"></i>
                Miễn phí vận chuyển đơn từ 500K
              </span>
              <span className="topbar__item">
                <i className="fa fa-shield-halved"></i>
                Hàng chính hãng 100%
              </span>
              <span className="topbar__item">
                <i className="fa fa-rotate-left"></i>
                Đổi trả 7 ngày
              </span>
            </div>
            <div className="topbar__right">
              <div className="topbar__social">
                <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
                <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              </div>
              <a href="tel:0901234567" className="topbar__phone">
                <i className="fa fa-phone"></i> 0901.234.567
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SITE HEADER */}
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <div className="header__main">
            {/* Hamburger - mobile */}
            <button
              className="header__hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Mở menu"
            >
              <i className="fa fa-bars"></i>
            </button>

            {/* Logo */}
            <Link href="/" className="header__logo">
              <span className="logo__main">SIGON<span> SPORT</span></span>
              <span className="logo__sub">sigonsport.vn</span>
            </Link>

            {/* Search - desktop */}
            <div className="header__search" ref={searchRef}>
              <form className="search-box" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Tìm kiếm giày, vợt, phụ kiện..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  aria-label="Tìm kiếm sản phẩm"
                />
                <button type="submit" className="search-box__btn" aria-label="Tìm kiếm">
                  <i className="fa fa-search"></i>
                </button>
              </form>
              {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions active">
                  {suggestions.map((p) => (
                    <div
                      key={p.id}
                      className="search-suggestion-item"
                      onClick={() => {
                        setShowSuggestions(false);
                        setSearchQuery('');
                        router.push(`/products/${p.id}`);
                      }}
                    >
                      <img
                        src={p.img || 'https://placehold.co/40x40/f0f0f0/888?text=SP'}
                        alt={p.name}
                        width={40}
                        height={40}
                      />
                      <span>{p.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="header__actions">
              <Link href="/products" className="header__action-btn">
                <i className="fa fa-th-large"></i>
                <span>Sản phẩm</span>
              </Link>
              <button
                className="header__action-btn"
                onClick={() => setCartOpen(true)}
                aria-label="Giỏ hàng"
              >
                <i className="fa fa-shopping-cart"></i>
                <span>Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mobile-search-bar">
          <form className="search-box" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={handleSearchInput}
              aria-label="Tìm kiếm"
            />
            <button type="submit" className="search-box__btn" aria-label="Tìm kiếm">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>

        {/* Main nav - desktop */}
        <nav className="main-nav">
          <div className="container">
            <ul className="nav__list">
              <li className="nav__item">
                <Link href="/" className="nav__link">
                  <i className="fa fa-home"></i> Trang chủ
                </Link>
              </li>
              {NAV_ITEMS.map((item) => (
                <li key={item.label} className="nav__item">
                  <Link
                    href={item.href}
                    className={`nav__link${item.hot ? ' nav__link--hot' : ''}${item.isSecondhand ? ' nav__link--secondhand' : ''}`}
                  >
                    {item.icon && <i className={`fa ${item.icon}`}></i>}
                    {item.label}
                    {item.children && <i className="fa fa-chevron-down"></i>}
                  </Link>
                  {item.children && (
                    <div className="nav__dropdown">
                      {item.children.map((child) => (
                        <Link key={child.label} href={child.href} className="nav__dropdown-item">
                          <i className="fa fa-chevron-right"></i>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              <li className="nav__item">
                <Link href="/about" className="nav__link">
                  <i className="fa fa-info-circle"></i> Giới thiệu
                </Link>
              </li>
              <li className="nav__item">
                <Link href="/contact" className="nav__link">
                  <i className="fa fa-phone"></i> Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* MOBILE DRAWER */}
      <div className={`mobile-overlay${mobileOpen ? ' active' : ''}`} onClick={closeMobile}></div>
      <div className={`mobile-drawer${mobileOpen ? ' active' : ''}`}>
        <div className="mobile-drawer__header">
          <span className="mobile-drawer__logo">SIGON<span style={{ color: '#FF6B00' }}> SPORT</span></span>
          <button className="mobile-drawer__close" onClick={closeMobile} aria-label="Đóng menu">
            <i className="fa fa-times"></i>
          </button>
        </div>
        <nav className="mobile-drawer__nav">
          <Link href="/" className="mobile-nav-item" onClick={closeMobile}>
            <i className="fa fa-home"></i> Trang chủ
          </Link>
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              <div
                className={`mobile-nav-item${openMobileNav === item.label ? ' active' : ''}`}
                onClick={() => setOpenMobileNav(openMobileNav === item.label ? null : item.label)}
              >
                {item.icon && <i className={`fa ${item.icon}`}></i>}
                {item.label}
                {item.children && (
                  <i className={`fa fa-chevron-${openMobileNav === item.label ? 'up' : 'down'}`} style={{ marginLeft: 'auto' }}></i>
                )}
              </div>
              {item.children && openMobileNav === item.label && (
                <div className="mobile-nav-sub active">
                  {item.children.map((child) => (
                    <Link key={child.label} href={child.href} onClick={closeMobile}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/contact" className="mobile-nav-item" onClick={closeMobile}>
            <i className="fa fa-phone"></i> Liên hệ
          </Link>
        </nav>
      </div>

      {/* CART SIDEBAR */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

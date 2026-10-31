<?php
/**
 * SiGon — Trang chủ tuỳ chỉnh
 * Thiết kế: Topbar + Header + Hero + Brand + Flash Sale + Categories + Products
 */
get_header(); ?>

<style>
/* ============================================
   TRANG CHỦ SIGON — Custom Homepage Styles
   Màu SiGon: #2D5535 (xanh lá), #C44D28 (cam), #F5EFE2 (kem)
============================================ */

/* Reset cho trang chủ */
.sigon-home-wrapper { background:#fff; }

/* --- TOPBAR --- */
.sigon-topbar {
  background: #1E3D24;
  color: #F5EFE2;
  font-size: 12px;
  padding: 6px 0;
  font-family: 'Be Vietnam Pro', sans-serif;
}
.sigon-topbar .tb-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.sigon-topbar .tb-left { display: flex; gap: 16px; }
.sigon-topbar .tb-left span { display: flex; align-items: center; gap: 5px; }
.sigon-topbar .tb-right { display: flex; align-items: center; gap: 12px; }
.sigon-topbar .tb-social a { color: #F5EFE2; font-size: 14px; margin: 0 4px; opacity: 0.85; }
.sigon-topbar .tb-social a:hover { opacity: 1; color: #C44D28; }
.sigon-topbar .tb-phone { display: flex; align-items: center; gap: 5px; font-weight: 600; }

/* --- HEADER --- */
.sigon-header {
  background: #F5EFE2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 200;
}
.sigon-header .header-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}
/* Logo */
.sigon-logo {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  line-height: 1;
  flex-shrink: 0;
}
.sigon-logo .logo-main {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 28px;
  color: #2D5535;
  letter-spacing: -1px;
}
.sigon-logo .logo-main .si { color: #C44D28; }
.sigon-logo .logo-sport {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 13px;
  color: #C44D28;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-top: 1px;
}
/* Search */
.sigon-search {
  flex: 1;
  max-width: 500px;
  position: relative;
}
.sigon-search form {
  display: flex;
  border: 2px solid #2D5535;
  border-radius: 25px;
  overflow: hidden;
  background: #fff;
}
.sigon-search input {
  flex: 1;
  border: none !important;
  padding: 10px 16px !important;
  font-size: 14px !important;
  font-family: 'Be Vietnam Pro', sans-serif;
  outline: none !important;
  box-shadow: none !important;
  background: transparent;
}
.sigon-search button {
  background: #2D5535 !important;
  border: none !important;
  color: white !important;
  padding: 10px 18px !important;
  cursor: pointer;
  font-size: 16px !important;
  min-height: auto !important;
  border-radius: 0 !important;
  transform: none !important;
}
.sigon-search button:hover { background: #1E3D24 !important; }
/* Header actions */
.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}
.header-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11px;
  color: #2D5535;
  font-weight: 600;
  font-family: 'Be Vietnam Pro', sans-serif;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.2s;
  position: relative;
}
.header-action-btn:hover { background: #EDE6D6; color: #2D5535; }
.header-action-btn i { font-size: 20px; }
.cart-count-badge {
  position: absolute;
  top: 2px;
  right: 4px;
  background: #E5002B;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* --- MAIN NAV --- */
.sigon-main-nav {
  background: #2D5535;
}
.sigon-main-nav .nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: stretch;
}
.sigon-main-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: stretch;
}
.sigon-main-nav ul li {
  position: relative;
}
.sigon-main-nav ul li a {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 14px;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  font-family: 'Be Vietnam Pro', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  transition: background 0.2s;
  white-space: nowrap;
}
.sigon-main-nav ul li a:hover,
.sigon-main-nav ul li:hover > a {
  background: #1E3D24;
}
.sigon-main-nav .nav-hot > a {
  color: #FFD46B;
}
.sigon-main-nav .nav-hot > a:hover { background: #1E3D24; }
.sigon-main-nav .nav-secondhand > a {
  color: #EDE6D6;
  background: rgba(139,94,60,0.4);
}
.sigon-main-nav .nav-secondhand > a:hover { background: #8B5E3C; }
/* Dropdown */
.sigon-main-nav .dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  min-width: 220px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border-radius: 0 0 8px 8px;
  z-index: 300;
  padding: 6px 0;
}
.sigon-main-nav ul li:hover .dropdown { display: block; }
.sigon-main-nav .dropdown a {
  color: #333 !important;
  padding: 10px 18px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}
.sigon-main-nav .dropdown a:hover {
  background: #F5EFE2 !important;
  color: #2D5535 !important;
}

/* --- HERO SLIDER --- */
.sigon-hero {
  position: relative;
  overflow: hidden;
  height: 380px;
}
.hero-track {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}
.hero-slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 60px;
}
.hero-slide-1 { background: linear-gradient(135deg, #1E3D24, #2D5535); }
.hero-slide-2 { background: linear-gradient(135deg, #1a0000, #E5002B); }
.hero-slide-3 { background: linear-gradient(135deg, #2a1500, #8B5E3C); }
.hero-content { max-width: 560px; }
.hero-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.75);
  margin-bottom: 8px;
  font-family: 'Be Vietnam Pro', sans-serif;
}
.hero-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 48px;
  color: #fff;
  line-height: 1.05;
  margin: 0 0 12px;
}
.hero-title span { color: #FFD46B; }
.hero-desc {
  color: rgba(255,255,255,0.85);
  font-size: 15px;
  margin-bottom: 24px;
  font-family: 'Be Vietnam Pro', sans-serif;
}
.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;
  font-family: 'Be Vietnam Pro', sans-serif;
}
.hero-cta-primary {
  background: #F5EFE2;
  color: #2D5535;
}
.hero-cta-primary:hover { background: #fff; transform: translateY(-2px); }
.hero-cta-accent {
  background: #E5002B;
  color: #fff;
}
.hero-cta-accent:hover { background: #b8001f; transform: translateY(-2px); }
.hero-cta-gold {
  background: #FFD46B;
  color: #2a1500;
}
.hero-cta-gold:hover { background: #ffc93c; transform: translateY(-2px); }
/* Slider controls */
.hero-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.hero-btn:hover { background: rgba(255,255,255,0.35); }
.hero-prev { left: 16px; }
.hero-next { right: 16px; }
.hero-dots {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}
.hero-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}
.hero-dot.active { background: #fff; width: 24px; border-radius: 4px; }

/* --- BRAND STRIP --- */
.sigon-brands {
  background: #F5EFE2;
  border-bottom: 1px solid #EDE6D6;
  padding: 14px 0;
  overflow: hidden;
}
.brands-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: space-between;
  flex-wrap: wrap;
}
.brand-item {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: #2D5535;
  opacity: 0.6;
  transition: opacity 0.2s;
  letter-spacing: -0.5px;
}
.brand-item:hover { opacity: 1; }

/* --- SECTION COMMONS --- */
.sigon-section {
  padding: 40px 0;
}
.section-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.section-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 22px;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}
.section-title .title-icon { color: #C44D28; }
.section-link {
  font-size: 13px;
  color: #2D5535;
  font-weight: 600;
  text-decoration: none;
  font-family: 'Be Vietnam Pro', sans-serif;
  display: flex;
  align-items: center;
  gap: 4px;
}
.section-link:hover { color: #C44D28; }

/* --- FLASH SALE --- */
.sigon-flash-sale { background: #fff5f5; border-top: 3px solid #E5002B; }
.flash-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.flash-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 22px;
  color: #E5002B;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}
.flash-countdown {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #E5002B;
  color: #fff;
  padding: 6px 14px;
  border-radius: 6px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 1px;
}
.countdown-sep { opacity: 0.7; }

/* --- CATEGORY GRID --- */
.sigon-categories { background: #F5EFE2; }
.cat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.cat-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
  border: 2px solid transparent;
  display: block;
}
.cat-card:hover {
  border-color: #2D5535;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(45,85,53,0.15);
}
.cat-icon {
  font-size: 36px;
  margin-bottom: 10px;
  display: block;
}
.cat-name {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #1a1a1a;
  margin: 0 0 4px;
}
.cat-count {
  font-size: 12px;
  color: #888;
  font-family: 'Be Vietnam Pro', sans-serif;
}
.cat-card-secondhand {
  background: linear-gradient(135deg, #FFF8F0, #FFF2E3);
  border-color: #8B5E3C;
}
.cat-card-secondhand .cat-name { color: #8B5E3C; }
.cat-card-secondhand:hover { border-color: #8B5E3C; }

/* --- PRODUCT GRID --- */
.product-grid-home {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* WooCommerce shortcode overrides for homepage */
.sigon-home-wrapper .woocommerce ul.products {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 16px !important;
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}
.sigon-home-wrapper .woocommerce ul.products li.product {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.2s;
  overflow: hidden;
  padding-bottom: 16px !important;
}
.sigon-home-wrapper .woocommerce ul.products li.product:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  transform: translateY(-3px);
}

/* ---- CUSTOM PRODUCT GRID (replaces WooCommerce shortcode layout) ---- */
.sigon-product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 0;
  padding: 0;
}
.sigon-product-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  border: 1px solid rgba(0,0,0,0.06);
}
.sigon-product-card:hover {
  box-shadow: 0 8px 28px rgba(0,0,0,0.13);
  transform: translateY(-3px);
}
.spc-image {
  position: relative;
  aspect-ratio: 1 / 1;
  background: #f0f0f0;
  overflow: hidden;
}
.spc-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
  display: block;
}
.sigon-product-card:hover .spc-image img {
  transform: scale(1.06);
}
.spc-badge-sale {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #E5002B;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'Be Vietnam Pro', sans-serif;
  z-index: 2;
  line-height: 1.4;
}
.spc-badge-2hand {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #8B5E3C;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: 4px;
  font-family: 'Be Vietnam Pro', sans-serif;
  z-index: 2;
  line-height: 1.4;
}
.spc-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}
.spc-name {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 38px;
}
.spc-condition {
  font-size: 11px;
  color: #8B5E3C;
  font-weight: 700;
  font-family: 'Be Vietnam Pro', sans-serif;
  background: #FFF8F0;
  padding: 2px 7px;
  border-radius: 3px;
  display: inline-block;
  align-self: flex-start;
}
.spc-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 4px;
}
.spc-price-sale {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: #E5002B;
}
.spc-price-original {
  font-size: 12px;
  color: #aaa;
  text-decoration: line-through;
  font-family: 'Be Vietnam Pro', sans-serif;
}

/* --- RESPONSIVE --- */
@media (max-width: 1023px) {
  .cat-grid { grid-template-columns: repeat(3, 1fr); }
  .sigon-product-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 767px) {
  /* Chặn horizontal scroll toàn trang */
  html, body { overflow-x: hidden; max-width: 100%; }

  /* Topbar: ẩn cả 2 phía để gọn */
  .sigon-topbar .tb-left { display: none; }
  .sigon-topbar .tb-right { gap: 8px; }
  .sigon-topbar .tb-phone { font-size: 11px; }

  /* Header: giảm padding, gap */
  .sigon-header .header-main { padding: 8px 12px; gap: 8px; }

  /* Logo: nhỏ hơn trên mobile */
  .sigon-logo .logo-main { font-size: 22px; }
  .sigon-logo .logo-sport { font-size: 11px; letter-spacing: 2px; }

  /* Search: cho phép co lại */
  .sigon-search { min-width: 0; }

  /* Actions: ẩn text, chỉ giữ icon */
  .header-action-btn span:not(.cart-count-badge) { display: none; }
  .header-action-btn { padding: 6px 8px; flex-direction: row; }
  .header-action-btn i { font-size: 22px; }

  /* Nav: ẩn trên mobile */
  .sigon-main-nav { display: none; }

  /* Content */
  .hero-title { font-size: 32px; }
  .sigon-hero { height: 260px; }
  .hero-slide { padding: 0 24px; }
  .cat-grid { grid-template-columns: repeat(2, 1fr); }
  .sigon-product-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
}

/* ---- BLOG SECTION ---- */
.blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.blog-card {
  background: #fff; border-radius: 12px; overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07); border: 1px solid rgba(0,0,0,0.05);
  text-decoration: none; color: inherit;
  display: flex; flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
}
.blog-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.11); transform: translateY(-2px); }
.blog-thumb { aspect-ratio: 16/9; background: linear-gradient(135deg,#2D5535,#1E3D24); overflow:hidden; }
.blog-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
.blog-thumb-placeholder { width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:40px; }
.blog-body { padding:16px; flex:1; display:flex; flex-direction:column; }
.blog-cat { font-size:11px;font-weight:700;color:#2D5535;text-transform:uppercase;letter-spacing:0.5px;font-family:'Be Vietnam Pro',sans-serif;margin-bottom:6px; }
.blog-title { font-family:'Be Vietnam Pro',sans-serif;font-weight:700;font-size:15px;color:#1a1a1a;line-height:1.5;margin:0 0 8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
.blog-excerpt { font-size:13px;color:#666;line-height:1.6;font-family:'Be Vietnam Pro',sans-serif;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;flex:1; }
.blog-meta { font-size:12px;color:#999;font-family:'Be Vietnam Pro',sans-serif;margin-top:12px;padding-top:10px;border-top:1px solid #f0f0f0; }

/* ---- UGC SECTION ---- */
.ugc-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; margin-bottom:16px; }
.ugc-item { aspect-ratio:1/1; border-radius:8px; overflow:hidden; position:relative; cursor:pointer; }
.ugc-item:hover .ugc-overlay { opacity:1; }
.ugc-placeholder { width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:32px;background:linear-gradient(135deg,#e8e0d0,#d5cabb); }
.ugc-overlay { position:absolute;inset:0;background:rgba(45,85,53,0.6);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;color:#fff;font-size:20px; }
.ugc-cta { text-align:center;font-size:13px;color:#666;font-family:'Be Vietnam Pro',sans-serif; }
.ugc-cta a { color:#2D5535;font-weight:700;text-decoration:none; }

/* ---- MAPS SECTION ---- */
.maps-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.map-card { border-radius:12px; overflow:hidden; border:1px solid #e5e5e5; }
.map-header { background:#2D5535; color:#fff; padding:12px 16px; font-family:'Be Vietnam Pro',sans-serif; }
.map-store-name { font-weight:700; font-size:14px; }
.map-store-addr { font-size:12px; opacity:0.85; margin-top:3px; }
.map-card iframe { display:block; width:100%; height:220px; border:none; }

@media (max-width:1023px) { .blog-grid { grid-template-columns:repeat(2,1fr); } .ugc-grid { grid-template-columns:repeat(4,1fr); } .maps-grid { grid-template-columns:1fr; } }
@media (max-width:767px)  { .blog-grid { grid-template-columns:1fr; } .ugc-grid { grid-template-columns:repeat(3,1fr); } }

/* ===== FOOTER RESPONSIVE ===== */
.sigon-footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}
.sigon-footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: rgba(245,239,226,0.5);
}
.sigon-footer-bottom-links {
  display: flex;
  gap: 16px;
}
@media (max-width: 1023px) {
  .sigon-footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
}
@media (max-width: 767px) {
  .sigon-footer-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .sigon-footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  .sigon-footer-bottom-links {
    justify-content: center;
  }
}

/* ===== QUICK FILTER SECTION ===== */
.sigon-quick-filter {
  background: linear-gradient(135deg, #1E3D24 0%, #2D5535 100%);
  padding: 32px 16px 36px;
}
.sigon-quick-filter .filter-inner {
  max-width: 1000px;
  margin: 0 auto;
}
.sigon-quick-filter .filter-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 22px;
  color: #F5EFE2;
  text-align: center;
  margin: 0 0 6px;
}
.sigon-quick-filter .filter-subtitle {
  font-size: 14px;
  color: rgba(245,239,226,0.75);
  text-align: center;
  margin: 0 0 24px;
}
.filter-dropdowns {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.filter-select-wrap {
  flex: 1;
  min-width: 160px;
}
.fselect {
  width: 100%;
  background-color: rgba(255,255,255,0.12);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' viewBox='0 0 12 8'%3E%3Cpath stroke='%23F5EFE2' stroke-width='1.8' d='M1 1.5l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  border: 1px solid rgba(245,239,226,0.35);
  color: #F5EFE2;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 36px 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.18s ease;
  appearance: none;
  -webkit-appearance: none;
  min-height: 44px;
}
.fselect:hover {
  background-color: rgba(255,255,255,0.2);
  border-color: rgba(245,239,226,0.6);
}
.fselect:focus {
  outline: none;
  border-color: #C44D28;
  background-color: rgba(255,255,255,0.2);
}
.fselect option {
  background: #2D5535;
  color: #F5EFE2;
}
.filter-action {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.filter-cta {
  background: #C44D28;
  color: #fff;
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 15px;
  padding: 12px 32px;
  border-radius: 30px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}
.filter-cta:hover { background: #a83d20; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(196,77,40,0.4); }
.filter-reset {
  background: transparent;
  border: 1px solid rgba(245,239,226,0.4);
  color: rgba(245,239,226,0.7);
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 13px;
  padding: 10px 18px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.18s;
}
.filter-reset:hover { border-color: rgba(245,239,226,0.7); color: #F5EFE2; }
/* Mobile */
@media (max-width: 767px) {
  .sigon-quick-filter { padding: 24px 12px 28px; }
  .sigon-quick-filter .filter-title { font-size: 17px; }
  .filter-dropdowns { gap: 8px; }
  .filter-select-wrap { min-width: calc(50% - 4px); flex: 0 0 calc(50% - 4px); }
  .fselect { font-size: 13px; padding: 9px 30px 9px 12px; min-height: 44px; }
  .filter-cta { font-size: 14px; padding: 11px 26px; }
}

/* ===== SIGON CARE BANNER ===== */
.care-promo-banner {
  background: linear-gradient(120deg, #1a0a00 0%, #2a1200 40%, #3d1a00 100%);
  padding: 48px 16px;
  position: relative;
  overflow: hidden;
}
.care-promo-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C44D28' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}
.care-promo-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  position: relative;
  z-index: 1;
}
.care-promo-text { color: #fff; }
.care-promo-label {
  display: inline-block;
  background: #C44D28;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 14px;
}
.care-promo-title {
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(24px, 4vw, 38px);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 14px;
  color: #fff;
}
.care-promo-title span { color: #FFD46B; }
.care-promo-desc {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255,255,255,0.8);
  margin-bottom: 24px;
}
.care-promo-features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 28px;
}
.care-promo-feat {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 5px 14px;
  font-size: 13px;
  color: #fff;
}
.care-promo-btns { display: flex; gap: 12px; flex-wrap: wrap; }
.care-promo-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #C44D28;
  color: #fff;
  padding: 13px 28px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  transition: all .2s;
}
.care-promo-btn-primary:hover { background: #a33d20; transform: translateY(-2px); color: #fff; }
.care-promo-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #FFD46B;
  border: 2px solid #FFD46B;
  padding: 11px 24px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: all .2s;
}
.care-promo-btn-secondary:hover { background: #FFD46B; color: #1a0a00; }
.care-promo-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.care-img-card {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 1;
  background: rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}
.care-img-card.large { grid-column: span 2; aspect-ratio: 2/1; }
.care-img-emoji { font-size: clamp(36px, 6vw, 64px); }
.care-img-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 20px 12px 10px;
  text-align: center;
}
@media (max-width: 767px) {
  .care-promo-inner { grid-template-columns: 1fr; gap: 28px; }
  .care-promo-images { grid-template-columns: 1fr 1fr; }
  .care-img-card.large { grid-column: span 2; }
}

/* ===== SIGON CARE SECTION ===== */
.sigon-care-section {
  background: #F5EFE2;
  padding: 64px 16px;
}
.care-section-inner {
  max-width: 1200px;
  margin: 0 auto;
}
.care-section-header {
  text-align: center;
  margin-bottom: 48px;
}
.care-section-badge {
  display: inline-block;
  background: #2D5535;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 4px 14px;
  border-radius: 20px;
  margin-bottom: 14px;
}
.care-section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 900;
  color: #1E3D24;
  margin-bottom: 12px;
}
.care-section-sub {
  font-size: 16px;
  color: #666;
  max-width: 500px;
  margin: 0 auto;
}
.care-services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 48px;
}
.care-svc-card {
  background: #fff;
  border-radius: 14px;
  padding: 28px 20px 22px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  transition: all .25s;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}
.care-svc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(45,85,53,0.15);
  border-color: #2D5535;
}
.care-svc-icon { font-size: 36px; margin-bottom: 12px; display: block; }
.care-svc-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: #1E3D24;
  margin-bottom: 6px;
}
.care-svc-desc { font-size: 12px; color: #888; margin-bottom: 14px; line-height: 1.5; }
.care-svc-price {
  display: inline-block;
  background: #2D5535;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 5px 14px;
  border-radius: 20px;
}
.care-section-cta {
  background: linear-gradient(120deg, #1E3D24, #2D5535);
  border-radius: 16px;
  padding: 36px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.care-cta-text h3 {
  font-family: 'Montserrat', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 6px;
}
.care-cta-text p { color: rgba(255,255,255,0.8); font-size: 14px; }
.care-cta-btns { display: flex; gap: 12px; flex-wrap: wrap; }
.care-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: all .2s;
  white-space: nowrap;
}
.care-cta-btn.primary { background: #C44D28; color: #fff; }
.care-cta-btn.primary:hover { background: #a33d20; color: #fff; }
.care-cta-btn.secondary { background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3); }
.care-cta-btn.secondary:hover { background: rgba(255,255,255,0.25); }
@media (max-width: 599px) {
  .care-section-cta { flex-direction: column; text-align: center; }
  .care-cta-btns { justify-content: center; }
  .care-services-grid { grid-template-columns: repeat(2, 1fr); }
}

</style>

<div class="sigon-home-wrapper">

<?php get_template_part('sigon-shared-header'); ?>

<!-- ===== HERO SLIDER ===== -->
<section class="sigon-hero" aria-label="Banner quảng cáo">
  <div class="hero-track" id="heroTrack">
    <div class="hero-slide hero-slide-1">
      <div class="hero-content">
        <div class="hero-label">SIGON SECONDHAND — CHÍNH HÃNG</div>
        <h1 class="hero-title">GIÀY REAL <span>GIÁ HỜI</span></h1>
        <p class="hero-desc">Giày 2hand chính hãng — Minh bạch tình trạng — Ảnh thật 100%</p>
        <a href="<?php echo home_url('/loai-hang/2hand-real/'); ?>" class="hero-cta hero-cta-primary">
          <i class="fas fa-recycle"></i> Khám Phá Secondhand
        </a>
      </div>
    </div>
    <div class="hero-slide hero-slide-2">
      <div class="hero-content">
        <div class="hero-label">FLASH SALE — GIẢM ĐẾN 70%</div>
        <h2 class="hero-title">HOT <span>DEALS</span></h2>
        <p class="hero-desc">Sản phẩm chất lượng — Giá không thể rẻ hơn</p>
        <a href="<?php echo home_url('/cua-hang/?orderby=popularity'); ?>" class="hero-cta hero-cta-accent">
          <i class="fas fa-bolt"></i> Xem Ngay
        </a>
      </div>
    </div>
    <div class="hero-slide hero-slide-3">
      <div class="hero-content">
        <div class="hero-label">TIẾT KIỆM 60-80% SO VỚI HÀNG MỚI</div>
        <h2 class="hero-title">CHẤT <span>SÀI GÒN</span></h2>
        <p class="hero-desc">Si (đồ si) + Gon (Sài Gòn) — Thương hiệu secondhand của người Sài Gòn</p>
        <a href="<?php echo home_url('/cua-hang/'); ?>" class="hero-cta hero-cta-gold">
          <i class="fas fa-shopping-bag"></i> Mua Ngay
        </a>
      </div>
    </div>
  </div>
  <button class="hero-btn hero-prev" id="heroPrev" aria-label="Slide trước"><i class="fas fa-chevron-left"></i></button>
  <button class="hero-btn hero-next" id="heroNext" aria-label="Slide tiếp"><i class="fas fa-chevron-right"></i></button>
  <div class="hero-dots" id="heroDots">
    <button class="hero-dot active" data-index="0"></button>
    <button class="hero-dot" data-index="1"></button>
    <button class="hero-dot" data-index="2"></button>
  </div>
</section>

<!-- ===== QUICK FILTER SECTION ===== -->
<section class="sigon-quick-filter" aria-label="Tìm kiếm sản phẩm theo bộ lọc">
  <div class="filter-inner">
    <h2 class="filter-title">Tìm mẫu giày phù hợp với bạn</h2>
    <p class="filter-subtitle">Chọn hãng, size hoặc loại giày — bấm <strong>Tìm ngay</strong> để xem kết quả ✌️</p>

    <div class="filter-dropdowns">
      <!-- Hãng — dynamic từ WooCommerce (pa_thuong-hieu) -->
      <div class="filter-select-wrap">
        <select class="fselect" id="filterHang">
          <option value="">🏷️ Chọn hãng</option>
          <?php
          $brands = get_terms(array(
            'taxonomy'   => 'pa_thuong-hieu',
            'orderby'    => 'name',
            'order'      => 'ASC',
            'hide_empty' => true,
          ));
          if (!is_wp_error($brands) && !empty($brands)):
            foreach ($brands as $brand):
          ?>
          <option value="<?php echo esc_attr($brand->slug); ?>"><?php echo esc_html($brand->name); ?></option>
          <?php endforeach; endif; ?>
        </select>
      </div>

      <!-- Size — dynamic từ WooCommerce (pa_size), sort theo số -->
      <div class="filter-select-wrap">
        <select class="fselect" id="filterSize">
          <option value="">📏 Chọn size</option>
          <?php
          $sizes = get_terms(array(
            'taxonomy'   => 'pa_size',
            'orderby'    => 'name',
            'order'      => 'ASC',
            'hide_empty' => true,
          ));
          if (!is_wp_error($sizes) && !empty($sizes)):
            usort($sizes, function($a, $b) {
              return (float)$a->name - (float)$b->name;
            });
            foreach ($sizes as $sz):
          ?>
          <option value="<?php echo esc_attr($sz->slug); ?>"><?php echo esc_html($sz->name); ?></option>
          <?php endforeach; endif; ?>
        </select>
      </div>

      <!-- Loại — hardcoded -->
      <div class="filter-select-wrap">
        <select class="fselect" id="filterLoai">
          <option value="">🏃 Chọn loại</option>
          <option value="bong-da">Bóng đá</option>
          <option value="cau-long">Cầu lông</option>
          <option value="tennis">Tennis</option>
          <option value="pickleball">Pickleball</option>
          <option value="chay-bo">Chạy bộ</option>
          <option value="sneaker-lifestyle">Sneaker</option>
          <option value="2hand-real">2Hand Real</option>
        </select>
      </div>

      <!-- Giá — hardcoded ranges -->
      <div class="filter-select-wrap">
        <select class="fselect" id="filterGia">
          <option value="">💰 Chọn giá</option>
          <option value="0-500000">Dưới 500k</option>
          <option value="500000-1000000">500k – 1 triệu</option>
          <option value="1000000-2000000">1 – 2 triệu</option>
          <option value="2000000-99999999">Trên 2 triệu</option>
        </select>
      </div>
    </div>

    <div class="filter-action">
      <button type="button" class="filter-cta" id="filterSearchBtn">
        <i class="fas fa-search"></i> Tìm ngay
      </button>
      <button class="filter-reset" id="filterResetBtn">Xoá bộ lọc</button>
    </div>
  </div>
</section>

<!-- ===== BRAND STRIP ===== -->
<div class="sigon-brands">
  <div class="brands-inner">
    <span class="brand-item">Nike</span>
    <span class="brand-item">Adidas</span>
    <span class="brand-item">Puma</span>
    <span class="brand-item">Yonex</span>
    <span class="brand-item">Wilson</span>
    <span class="brand-item">Babolat</span>
    <span class="brand-item">Victor</span>
    <span class="brand-item">Mizuno</span>
    <span class="brand-item">Selkirk</span>
  </div>
</div>

<!-- ===== DANH MỤC NỔI BẬT (tạm ẩn) ===== -->
<section class="sigon-section sigon-categories" style="display:none">
  <div class="section-inner">
    <div class="section-header">
      <h2 class="section-title"><span class="title-icon"><i class="fas fa-th"></i></span> DANH MỤC SẢN PHẨM</h2>
      <a href="<?php echo home_url('/cua-hang/'); ?>" class="section-link">Xem tất cả <i class="fas fa-arrow-right"></i></a>
    </div>
    <div class="cat-grid">
      <a href="<?php echo home_url('/loai-hang/2hand-real/'); ?>" class="cat-card cat-card-secondhand">
        <span class="cat-icon">♻️</span>
        <div class="cat-name">2HAND REAL ⭐</div>
        <div class="cat-count">Giày secondhand chính hãng</div>
      </a>
      <a href="<?php echo home_url('/product-category/giay-bong-da/'); ?>" class="cat-card">
        <span class="cat-icon">⚽</span>
        <div class="cat-name">Giày Bóng Đá</div>
        <div class="cat-count">FG · TF · Futsal</div>
      </a>
      <a href="<?php echo home_url('/product-category/giay-cau-long/'); ?>" class="cat-card">
        <span class="cat-icon">🏸</span>
        <div class="cat-name">Giày Cầu Lông</div>
        <div class="cat-count">Yonex · Li-Ning · Victor</div>
      </a>
      <a href="<?php echo home_url('/product-category/giay-tennis/'); ?>" class="cat-card">
        <span class="cat-icon">🎾</span>
        <div class="cat-name">Giày Tennis</div>
        <div class="cat-count">Asics · Babolat · Nike</div>
      </a>
      <a href="<?php echo home_url('/product-category/giay-pickleball/'); ?>" class="cat-card">
        <span class="cat-icon">🏓</span>
        <div class="cat-name">Giày Pickleball</div>
        <div class="cat-count">Selkirk · K-Swiss</div>
      </a>
      <a href="<?php echo home_url('/product-category/vot-the-thao/'); ?>" class="cat-card">
        <span class="cat-icon">🎯</span>
        <div class="cat-name">Vợt Thể Thao</div>
        <div class="cat-count">Cầu lông · Tennis · Pickleball</div>
      </a>
      <a href="<?php echo home_url('/product-category/dung-cu-phu-kien/'); ?>" class="cat-card">
        <span class="cat-icon">🎽</span>
        <div class="cat-name">Dụng Cụ & Phụ Kiện</div>
        <div class="cat-count">Bóng · Túi · Dây cước</div>
      </a>
      <a href="<?php echo home_url('/product-category/quan-ao-the-thao/'); ?>" class="cat-card">
        <span class="cat-icon">👕</span>
        <div class="cat-name">Quần Áo Thể Thao</div>
        <div class="cat-count">Áo · Quần · Phụ kiện</div>
      </a>
    </div>
  </div>
</section>

<!-- ===== SECONDHAND NỔI BẬT ===== -->
<section class="sigon-section sigon-flash-sale">
  <div class="section-inner">
    <div class="flash-header">
      <h2 class="flash-title"><i class="fas fa-recycle"></i> 2HAND — HOT NHẤT</h2>
      <div class="flash-countdown" id="flashCountdown">
        <i class="fas fa-clock"></i>
        <span id="cdH">08</span><span class="countdown-sep">:</span>
        <span id="cdM">00</span><span class="countdown-sep">:</span>
        <span id="cdS">00</span>
      </div>
      <a href="<?php echo home_url('/loai-hang/2hand-real/'); ?>" class="section-link">Xem tất cả 2hand <i class="fas fa-arrow-right"></i></a>
    </div>
    <?php
    $q2hand = new WP_Query(array(
      'post_type'      => 'product',
      'posts_per_page' => 4,
      'orderby'        => 'date',
      'order'          => 'DESC',
      'post_status'    => 'publish',
      'tax_query'      => array(array(
        'taxonomy' => 'pa_loai-hang',
        'field'    => 'slug',
        'terms'    => '2hand-real',
      )),
    ));
    if ($q2hand->have_posts()): ?>
    <div class="sigon-product-grid">
    <?php while ($q2hand->have_posts()): $q2hand->the_post();
      $prod = wc_get_product(get_the_ID());
      if (!$prod) continue;
      $regular = (float) $prod->get_regular_price();
      $sale    = (float) $prod->get_sale_price();
      $price   = (float) $prod->get_price();
      $on_sale = $prod->is_on_sale() && $regular > 0 && $sale > 0;
      $discount = $on_sale ? round((1 - $sale / $regular) * 100) : 0;
      $img_arr  = wp_get_attachment_image_src(get_post_thumbnail_id(), 'woocommerce_thumbnail');
      $img_url  = $img_arr ? $img_arr[0] : wc_placeholder_img_src('woocommerce_thumbnail');
      $condition = get_post_meta(get_the_ID(), '_product_condition', true);
      $loai_hang_terms = wp_get_post_terms(get_the_ID(), 'pa_loai-hang', ['fields' => 'slugs']);
      $loai_hang = !empty($loai_hang_terms) ? $loai_hang_terms[0] : '';
    ?>
      <a href="<?php the_permalink(); ?>" class="sigon-product-card">
        <div class="spc-image">
          <?php if ($discount > 0): ?><span class="spc-badge-sale">-<?php echo $discount; ?>%</span><?php endif; ?>
          <?php if ($loai_hang === '2hand-real'): ?><span class="spc-badge-2hand">2HAND</span><?php endif; ?>
          <img src="<?php echo esc_url($img_url); ?>" alt="<?php the_title_attribute(); ?>" loading="lazy">
        </div>
        <div class="spc-info">
          <h3 class="spc-name"><?php the_title(); ?></h3>
          <?php if ($condition): ?><div class="spc-condition"><?php echo esc_html($condition); ?></div><?php endif; ?>
          <div class="spc-price">
            <span class="spc-price-sale"><?php echo wc_price($price); ?></span>
            <?php if ($on_sale): ?><span class="spc-price-original"><?php echo wc_price($regular); ?></span><?php endif; ?>
          </div>
        </div>
      </a>
    <?php endwhile; wp_reset_postdata(); ?>
    </div>
    <?php else: ?>
      <p style="color:#888;font-family:'Be Vietnam Pro',sans-serif;padding:20px 0;">Chưa có sản phẩm secondhand. <a href="<?php echo admin_url('post-new.php?post_type=product'); ?>">Thêm sản phẩm</a></p>
    <?php endif; ?>
  </div>
</section>

<!-- ===== SẢN PHẨM MỚI NHẤT ===== -->
<section class="sigon-section" style="background:#fff;">
  <div class="section-inner">
    <div class="section-header">
      <h2 class="section-title"><span class="title-icon"><i class="fas fa-star"></i></span> SẢN PHẨM MỚI NHẤT</h2>
      <a href="<?php echo home_url('/cua-hang/'); ?>" class="section-link">Xem tất cả <i class="fas fa-arrow-right"></i></a>
    </div>
    <?php
    $q_recent = new WP_Query(array(
      'post_type'      => 'product',
      'posts_per_page' => 8,
      'orderby'        => 'date',
      'order'          => 'DESC',
      'post_status'    => 'publish',
    ));
    if ($q_recent->have_posts()): ?>
    <div class="sigon-product-grid" style="grid-template-columns: repeat(4, 1fr);">
    <?php while ($q_recent->have_posts()): $q_recent->the_post();
      $prod = wc_get_product(get_the_ID());
      if (!$prod) continue;
      $regular  = (float) $prod->get_regular_price();
      $sale     = (float) $prod->get_sale_price();
      $price    = (float) $prod->get_price();
      $on_sale  = $prod->is_on_sale() && $regular > 0 && $sale > 0;
      $discount = $on_sale ? round((1 - $sale / $regular) * 100) : 0;
      $img_arr  = wp_get_attachment_image_src(get_post_thumbnail_id(), 'woocommerce_thumbnail');
      $img_url  = $img_arr ? $img_arr[0] : wc_placeholder_img_src('woocommerce_thumbnail');
      $condition = get_post_meta(get_the_ID(), '_product_condition', true);
      $loai_hang_terms = wp_get_post_terms(get_the_ID(), 'pa_loai-hang', ['fields' => 'slugs']);
      $loai_hang = !empty($loai_hang_terms) ? $loai_hang_terms[0] : '';
    ?>
      <a href="<?php the_permalink(); ?>" class="sigon-product-card">
        <div class="spc-image">
          <?php if ($discount > 0): ?><span class="spc-badge-sale">-<?php echo $discount; ?>%</span><?php endif; ?>
          <?php if ($loai_hang === '2hand-real'): ?><span class="spc-badge-2hand">2HAND</span><?php endif; ?>
          <?php if ($loai_hang === 'moi'): ?><span class="spc-badge-sale" style="background:#2D5535;">NEW</span><?php endif; ?>
          <img src="<?php echo esc_url($img_url); ?>" alt="<?php the_title_attribute(); ?>" loading="lazy">
        </div>
        <div class="spc-info">
          <h3 class="spc-name"><?php the_title(); ?></h3>
          <?php if ($condition): ?><div class="spc-condition"><?php echo esc_html($condition); ?></div><?php endif; ?>
          <div class="spc-price">
            <span class="spc-price-sale"><?php echo wc_price($price); ?></span>
            <?php if ($on_sale): ?><span class="spc-price-original"><?php echo wc_price($regular); ?></span><?php endif; ?>
          </div>
        </div>
      </a>
    <?php endwhile; wp_reset_postdata(); ?>
    </div>
    <?php else: ?>
      <p style="color:#888;font-family:'Be Vietnam Pro',sans-serif;padding:20px 0;">Chưa có sản phẩm.</p>
    <?php endif; ?>
  </div>
</section>

<!-- ===== BANNER KHUYẾN MÃI ===== -->
<section class="sigon-section" style="background:#F5EFE2; padding: 20px 0;">
  <div class="section-inner">
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <a href="<?php echo home_url('/loai-hang/2hand-real/'); ?>" style="
        background: linear-gradient(135deg, #2D5535, #1E3D24);
        border-radius: 12px;
        padding: 32px 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-decoration: none;
        overflow: hidden;
        position: relative;
      ">
        <div>
          <div style="font-size:12px;color:rgba(255,255,255,0.7);font-weight:700;text-transform:uppercase;letter-spacing:1px;font-family:'Be Vietnam Pro',sans-serif;">Tiết kiệm 60–80%</div>
          <div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:28px;color:#fff;margin:6px 0;">GIÀY 2HAND</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.8);font-family:'Be Vietnam Pro',sans-serif;">Chính hãng · Ảnh thật · Minh bạch</div>
        </div>
        <div style="font-size:60px;opacity:0.3;">♻️</div>
      </a>
      <a href="<?php echo home_url('/cua-hang/'); ?>" style="
        background: linear-gradient(135deg, #C44D28, #a33520);
        border-radius: 12px;
        padding: 32px 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-decoration: none;
        overflow: hidden;
      ">
        <div>
          <div style="font-size:12px;color:rgba(255,255,255,0.7);font-weight:700;text-transform:uppercase;letter-spacing:1px;font-family:'Be Vietnam Pro',sans-serif;">Hàng chính hãng mới</div>
          <div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:28px;color:#fff;margin:6px 0;">GIÀY MỚI</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.8);font-family:'Be Vietnam Pro',sans-serif;">Nike · Adidas · Yonex · Mizuno</div>
        </div>
        <div style="font-size:60px;opacity:0.3;">👟</div>
      </a>
    </div>
  </div>
</section>

<!-- ===== SẢN PHẨM BÁN CHẠY ===== -->
<section class="sigon-section" style="background:#fff;">
  <div class="section-inner">
    <div class="section-header">
      <h2 class="section-title"><span class="title-icon"><i class="fas fa-fire"></i></span> BÁN CHẠY NHẤT</h2>
      <a href="<?php echo home_url('/cua-hang/?orderby=popularity'); ?>" class="section-link">Xem thêm <i class="fas fa-arrow-right"></i></a>
    </div>
    <?php
    $q_best = new WP_Query(array(
      'post_type'      => 'product',
      'posts_per_page' => 4,
      'meta_key'       => 'total_sales',
      'orderby'        => 'meta_value_num',
      'order'          => 'DESC',
      'post_status'    => 'publish',
    ));
    if ($q_best->have_posts()): ?>
    <div class="sigon-product-grid">
    <?php while ($q_best->have_posts()): $q_best->the_post();
      $prod = wc_get_product(get_the_ID());
      if (!$prod) continue;
      $regular  = (float) $prod->get_regular_price();
      $sale     = (float) $prod->get_sale_price();
      $price    = (float) $prod->get_price();
      $on_sale  = $prod->is_on_sale() && $regular > 0 && $sale > 0;
      $discount = $on_sale ? round((1 - $sale / $regular) * 100) : 0;
      $img_arr  = wp_get_attachment_image_src(get_post_thumbnail_id(), 'woocommerce_thumbnail');
      $img_url  = $img_arr ? $img_arr[0] : wc_placeholder_img_src('woocommerce_thumbnail');
      $condition = get_post_meta(get_the_ID(), '_product_condition', true);
      $loai_hang_terms = wp_get_post_terms(get_the_ID(), 'pa_loai-hang', ['fields' => 'slugs']);
      $loai_hang = !empty($loai_hang_terms) ? $loai_hang_terms[0] : '';
    ?>
      <a href="<?php the_permalink(); ?>" class="sigon-product-card">
        <div class="spc-image">
          <?php if ($discount > 0): ?><span class="spc-badge-sale">-<?php echo $discount; ?>%</span><?php endif; ?>
          <?php if ($loai_hang === '2hand-real'): ?><span class="spc-badge-2hand">2HAND</span><?php endif; ?>
          <img src="<?php echo esc_url($img_url); ?>" alt="<?php the_title_attribute(); ?>" loading="lazy">
        </div>
        <div class="spc-info">
          <h3 class="spc-name"><?php the_title(); ?></h3>
          <?php if ($condition): ?><div class="spc-condition"><?php echo esc_html($condition); ?></div><?php endif; ?>
          <div class="spc-price">
            <span class="spc-price-sale"><?php echo wc_price($price); ?></span>
            <?php if ($on_sale): ?><span class="spc-price-original"><?php echo wc_price($regular); ?></span><?php endif; ?>
          </div>
        </div>
      </a>
    <?php endwhile; wp_reset_postdata(); ?>
    </div>
    <?php else: ?>
      <p style="color:#888;font-family:'Be Vietnam Pro',sans-serif;padding:20px 0;">Chưa có sản phẩm.</p>
    <?php endif; ?>
  </div>
</section>

<!-- ===== ẢNH KHÁCH HÀNG (UGC) ===== -->
<section class="sigon-section" style="background:#F5EFE2;">
  <div class="section-inner">
    <div class="section-header" style="flex-direction:column;align-items:flex-start;gap:4px;">
      <h2 class="section-title"><span class="title-icon">📸</span> KHÁCH HÀNG CỦA CHÚNG TÔI</h2>
      <p style="font-size:13px;color:#888;font-family:'Be Vietnam Pro',sans-serif;margin:0;">Tag <strong style="color:#2D5535;">@sigonsecondhand</strong> để được xuất hiện tại đây ✌️</p>
    </div>
    <div class="ugc-grid">
      <div class="ugc-item"><div class="ugc-placeholder">👟</div><div class="ugc-overlay"><i class="fab fa-instagram"></i></div></div>
      <div class="ugc-item"><div class="ugc-placeholder">⚽</div><div class="ugc-overlay"><i class="fab fa-instagram"></i></div></div>
      <div class="ugc-item"><div class="ugc-placeholder">🏸</div><div class="ugc-overlay"><i class="fab fa-instagram"></i></div></div>
      <div class="ugc-item"><div class="ugc-placeholder">🎾</div><div class="ugc-overlay"><i class="fab fa-instagram"></i></div></div>
      <div class="ugc-item"><div class="ugc-placeholder">♻️</div><div class="ugc-overlay"><i class="fab fa-instagram"></i></div></div>
      <div class="ugc-item"><div class="ugc-placeholder">🔥</div><div class="ugc-overlay"><i class="fab fa-instagram"></i></div></div>
    </div>
    <div class="ugc-cta">
      Chia sẻ hình ảnh của bạn lên Instagram và tag <a href="https://instagram.com/sigonsecondhand" target="_blank" rel="noopener">@sigonsecondhand</a> — ảnh đẹp nhất sẽ được featured tại đây!
    </div>
  </div>
</section>

<!-- ===== TIN TỨC / BLOG ===== -->
<section class="sigon-section" style="background:#fff;">
  <div class="section-inner">
    <div class="section-header">
      <h2 class="section-title"><span class="title-icon"><i class="fas fa-newspaper"></i></span> TIN TỨC & KIẾN THỨC GIÀY</h2>
      <a href="<?php echo home_url('/tin-tuc/'); ?>" class="section-link">Xem tất cả <i class="fas fa-arrow-right"></i></a>
    </div>
    <?php
    $q_blog = new WP_Query(array(
      'post_type' => 'post', 'posts_per_page' => 3,
      'orderby' => 'date', 'order' => 'DESC', 'post_status' => 'publish',
    ));
    $real_count = $q_blog->found_posts;
    // Placeholder cards để bổ sung khi thiếu bài viết
    $placeholders = array(
      array('href' => '/tin-tuc/chon-giay-bong-da/', 'icon' => '⚽', 'bg' => 'linear-gradient(135deg,#2D5535,#1E3D24)', 'cat' => 'Hướng dẫn', 'title' => 'Cách chọn giày bóng đá phù hợp với từng mặt sân', 'excerpt' => 'FG, TF, AG, IC — mỗi loại mặt sân cần một loại đế giày riêng. Hướng dẫn chọn đúng để chơi tốt và tránh chấn thương.'),
      array('href' => '/tin-tuc/mua-giay-2hand/', 'icon' => '♻️', 'bg' => 'linear-gradient(135deg,#8B5E3C,#6b4520)', 'cat' => 'Secondhand Tips', 'title' => '5 điều cần kiểm tra khi mua giày secondhand chính hãng', 'excerpt' => 'Mua giày 2hand real không khó nếu biết cách kiểm tra. SiGon chia sẻ 5 điểm nhận biết giày auth để bạn an tâm.'),
      array('href' => '/tin-tuc/giay-cau-long-yonex/', 'icon' => '🏸', 'bg' => 'linear-gradient(135deg,#C44D28,#a33520)', 'cat' => 'Review', 'title' => 'Top 5 giày cầu lông Yonex tốt nhất 2024 cho từng mức giá', 'excerpt' => 'Từ SHB-65Z3 đến Aerus Z2 — review chi tiết từng dòng giày Yonex để chọn đúng theo nhu cầu và ngân sách.'),
    );
    ?>
    <div class="blog-grid">
    <?php
    // Hiển thị bài thật
    $ph_idx = 0;
    if ($q_blog->have_posts()):
      while ($q_blog->have_posts()): $q_blog->the_post();
        $thumb = get_the_post_thumbnail_url(get_the_ID(), 'medium_large');
        $ph_idx++;
    ?>
      <a href="<?php the_permalink(); ?>" class="blog-card">
        <div class="blog-thumb">
          <?php if ($thumb): ?><img src="<?php echo esc_url($thumb); ?>" alt="<?php the_title_attribute(); ?>" loading="lazy">
          <?php else: ?><div class="blog-thumb-placeholder">📰</div><?php endif; ?>
        </div>
        <div class="blog-body">
          <div class="blog-cat">Kiến thức</div>
          <h3 class="blog-title"><?php the_title(); ?></h3>
          <div class="blog-excerpt"><?php echo wp_trim_words(get_the_excerpt(), 20, '...'); ?></div>
          <div class="blog-meta"><?php echo get_the_date('d/m/Y'); ?> · <?php echo get_the_author(); ?></div>
        </div>
      </a>
    <?php endwhile; wp_reset_postdata(); endif;
    // Bổ sung placeholder nếu thiếu
    $need = max(0, 3 - $ph_idx);
    for ($i = 0; $i < $need; $i++):
      $p = $placeholders[$i];
    ?>
      <a href="<?php echo home_url($p['href']); ?>" class="blog-card">
        <div class="blog-thumb" style="background:<?php echo $p['bg']; ?>;"><div class="blog-thumb-placeholder"><?php echo $p['icon']; ?></div></div>
        <div class="blog-body">
          <div class="blog-cat"><?php echo $p['cat']; ?></div>
          <h3 class="blog-title"><?php echo $p['title']; ?></h3>
          <div class="blog-excerpt"><?php echo $p['excerpt']; ?></div>
          <div class="blog-meta">Sắp ra mắt</div>
        </div>
      </a>
    <?php endfor; ?>
    </div>
  </div>
</section>

<!-- ===== BẢN ĐỒ CỬA HÀNG ===== -->
<section class="sigon-section" style="background:#F5EFE2;">
  <div class="section-inner">
    <div class="section-header">
      <h2 class="section-title"><span class="title-icon"><i class="fas fa-map-marker-alt"></i></span> TÌM CỬA HÀNG SIGON</h2>
    </div>
    <div class="maps-grid">
      <div class="map-card">
        <div class="map-header">
          <div class="map-store-name">🏪 Chi nhánh 1 — Bình Thạnh</div>
          <div class="map-store-addr">160/11/19 Đặng Thuỳ Trâm, Bình Lợi Trung, Bình Thạnh, TP.HCM</div>
        </div>
        <iframe
          src="https://maps.google.com/maps?q=160+Dang+Thuy+Tram+Binh+Thanh+Ho+Chi+Minh+Vietnam&t=&z=16&ie=UTF8&iwloc=&output=embed"
          loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"
          title="SiGon CN1 Bình Thạnh"></iframe>
      </div>
      <div class="map-card">
        <div class="map-header">
          <div class="map-store-name">🏪 Chi nhánh 2 — Tân Sơn Nhất</div>
          <div class="map-store-addr">927/27B Cách Mạng Tháng 8, Phường 4, Tân Bình, TP.HCM</div>
        </div>
        <iframe
          src="https://maps.google.com/maps?q=927+Cach+Mang+Thang+Tam+Tan+Binh+Ho+Chi+Minh+Vietnam&t=&z=16&ie=UTF8&iwloc=&output=embed"
          loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"
          title="SiGon CN2 Tân Sơn Nhất"></iframe>
      </div>
    </div>
  </div>
</section>


<!-- ===== BANNER SIGON CARE ===== -->
<section class="care-promo-banner">
  <div class="care-promo-inner">
    <div class="care-promo-text">
      <span class="care-promo-label">✨ Dịch vụ mới</span>
      <h2 class="care-promo-title">Giày cũ — <span>làm mới</span><br>như chưa bao giờ cũ</h2>
      <p class="care-promo-desc">SiGon Care chuyên vệ sinh, phục hồi và bảo dưỡng giày thể thao. Trao tay — nhận về giày sạch bóng, thơm tho, bền đẹp hơn.</p>
      <div class="care-promo-features">
        <span class="care-promo-feat">🧽 Vệ sinh Spa</span>
        <span class="care-promo-feat">👟 Dán đế - May đế</span>
        <span class="care-promo-feat">🔧 Thay đế - Độ đế</span>
        <span class="care-promo-feat">⏱ Nhận trong ngày</span>
      </div>
      <div class="care-promo-btns">
        <a class="care-promo-btn-primary" href="https://care.sigon.vn" target="_blank" rel="noopener">
          ✨ Xem dịch vụ &amp; Báo giá
        </a>
        <a class="care-promo-btn-secondary" href="https://zalo.me/0915920711" target="_blank" rel="noopener">
          💬 Chat Zalo ngay
        </a>
      </div>
    </div>
    <div class="care-promo-images">
      <div class="care-img-card large">
        <div style="text-align:center;padding:24px;">
          <div style="font-size:clamp(40px,6vw,72px);margin-bottom:12px;">👟✨</div>
          <div style="color:#FFD46B;font-weight:700;font-size:clamp(15px,2vw,20px);font-family:Montserrat,sans-serif;">TRƯỚC &amp; SAU VỆ SINH</div>
          <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:6px;">Kết quả thực tế từ SiGon Care</div>
        </div>
        <div class="care-img-label">Ảnh thực tế từ khách hàng</div>
      </div>
      <div class="care-img-card">
        <div style="text-align:center;">
          <div class="care-img-emoji">🧽</div>
          <div style="color:rgba(255,255,255,0.9);font-size:12px;font-weight:600;margin-top:6px;">Vệ sinh sạch bóng</div>
        </div>
      </div>
      <div class="care-img-card">
        <div style="text-align:center;">
          <div class="care-img-emoji">🔧</div>
          <div style="color:rgba(255,255,255,0.9);font-size:12px;font-weight:600;margin-top:6px;">Sửa chữa đế giày</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ===== SECTION SIGON CARE ===== -->
<section class="sigon-care-section">
  <div class="care-section-inner">
    <div class="care-section-header">
      <span class="care-section-badge">SiGon Care</span>
      <h2 class="care-section-title">Dịch Vụ Chăm Sóc Giày Tại TP.HCM</h2>
      <p class="care-section-sub">Giá niêm yết — không phát sinh — nhận trả trong ngày</p>
    </div>
    <div class="care-services-grid">
      <div class="care-svc-card">
        <span class="care-svc-icon">🧽</span>
        <div class="care-svc-name">Vệ sinh (Spa)</div>
        <p class="care-svc-desc">Làm sạch toàn diện, khử mùi, làm mới bề mặt giày</p>
        <span class="care-svc-price">89.000₫</span>
      </div>
      <div class="care-svc-card">
        <span class="care-svc-icon">🖇️</span>
        <div class="care-svc-name">Dán đế</div>
        <p class="care-svc-desc">Dán keo chuyên dụng, chắc bền, chống bong tróc</p>
        <span class="care-svc-price">199.000₫</span>
      </div>
      <div class="care-svc-card">
        <span class="care-svc-icon">🧵</span>
        <div class="care-svc-name">May đế</div>
        <p class="care-svc-desc">May chắc chắn, tăng độ bền cho đế giày lâu dài</p>
        <span class="care-svc-price">150.000₫</span>
      </div>
      <div class="care-svc-card">
        <span class="care-svc-icon">👟</span>
        <div class="care-svc-name">Thay đế</div>
        <p class="care-svc-desc">Thay đế mới, chuẩn form, bền đẹp như ban đầu</p>
        <span class="care-svc-price">350.000₫</span>
      </div>
      <div class="care-svc-card">
        <span class="care-svc-icon">✂️</span>
        <div class="care-svc-name">Độ đế</div>
        <p class="care-svc-desc">Độ đế theo yêu cầu, tăng độ êm &amp; bám đường</p>
        <span class="care-svc-price">400.000₫</span>
      </div>
    </div>
    <div class="care-section-cta">
      <div class="care-cta-text">
        <h3>📞 Hotline / Zalo: 0915.920.711</h3>
        <p>Mở cửa 10:00 – 22:00 hàng ngày · 2 chi nhánh tại TP.HCM</p>
      </div>
      <div class="care-cta-btns">
        <a class="care-cta-btn primary" href="https://care.sigon.vn" target="_blank" rel="noopener">✨ Xem đầy đủ dịch vụ</a>
        <a class="care-cta-btn secondary" href="https://zalo.me/0915920711" target="_blank" rel="noopener">💬 Đặt lịch Zalo</a>
      </div>
    </div>
  </div>
</section>


<?php get_template_part('sigon-shared-footer'); ?>

</div><!-- .sigon-home-wrapper -->

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<script>
// Hero Slider
(function() {
  const track = document.getElementById('heroTrack');
  const dots = document.querySelectorAll('.hero-dot');
  let cur = 0, total = 3, timer;

  function goTo(n) {
    cur = (n + total) % total;
    track.style.transform = 'translateX(-' + (cur * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === cur));
  }

  document.getElementById('heroPrev').onclick = () => { clearInterval(timer); goTo(cur - 1); start(); };
  document.getElementById('heroNext').onclick = () => { clearInterval(timer); goTo(cur + 1); start(); };
  dots.forEach(d => d.onclick = () => { clearInterval(timer); goTo(+d.dataset.index); start(); });

  function start() { timer = setInterval(() => goTo(cur + 1), 4000); }
  start();
})();

// Quick Filter — chuyển hướng trực tiếp đến trang shop với filter params
(function() {
  document.getElementById('filterSearchBtn').addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var hang = document.getElementById('filterHang').value;
    var size = document.getElementById('filterSize').value;
    var loai = document.getElementById('filterLoai').value;
    var gia  = document.getElementById('filterGia').value;

    var params = new URLSearchParams();
    if (hang) { params.set('filter_thuong-hieu', hang); params.set('query_type_thuong-hieu', 'or'); }
    if (size) { params.set('filter_size', size); params.set('query_type_size', 'or'); }
    if (loai) {
      if (loai === '2hand-real') {
        params.set('filter_loai-hang', '2hand-real'); params.set('query_type_loai-hang', 'or');
      } else {
        params.set('filter_mon-the-thao', loai); params.set('query_type_mon-the-thao', 'or');
      }
    }
    if (gia) {
      var parts = gia.split('-');
      if (parts.length === 2) {
        params.set('min_price', parts[0]);
        params.set('max_price', parts[1]);
      }
    }
    var qs = params.toString();
    window.location.href = '/cua-hang/' + (qs ? '?' + qs : '');
  });

  document.getElementById('filterResetBtn').addEventListener('click', function() {
    document.getElementById('filterHang').value = '';
    document.getElementById('filterSize').value  = '';
    document.getElementById('filterLoai').value  = '';
    document.getElementById('filterGia').value   = '';
  });
})();

// Flash Sale Countdown (8 tiếng từ lúc load)
(function() {
  let end = new Date().getTime() + 8 * 3600 * 1000;
  function tick() {
    const diff = end - new Date().getTime();
    if (diff <= 0) { end = new Date().getTime() + 8 * 3600 * 1000; }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cdH').textContent = String(h).padStart(2,'0');
    document.getElementById('cdM').textContent = String(m).padStart(2,'0');
    document.getElementById('cdS').textContent = String(s).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
})();
</script>

<?php wp_footer(); ?>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
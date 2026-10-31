<?php
/**
 * SiGon — Shared Header Partial
 * Dùng chung: topbar + header + main nav
 * Sử dụng: get_template_part('template-parts/sigon-header')
 */
?>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">

<style>
/* ===== SIGON SHARED HEADER STYLES ===== */
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
.sigon-topbar .tb-social a { color: #F5EFE2; font-size: 14px; margin: 0 4px; opacity: 0.85; text-decoration: none; }
.sigon-topbar .tb-social a:hover { opacity: 1; color: #C44D28; }
.sigon-topbar .tb-phone { display: flex; align-items: center; gap: 5px; font-weight: 600; }

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
.sigon-search input[type=search], .sigon-search input[type=text] {
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
.sigon-main-nav { background: #2D5535; }
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
.sigon-main-nav ul li { position: relative; }
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
.sigon-main-nav ul li:hover > a { background: #1E3D24; }
.sigon-main-nav .nav-hot > a { color: #FFD46B; }
.sigon-main-nav .nav-secondhand > a { color: #EDE6D6; background: rgba(139,94,60,0.4); }
.sigon-main-nav .nav-secondhand > a:hover { background: #8B5E3C; }
.sigon-main-nav .nav-active > a { background: #1E3D24; color: #FFD46B; }
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
.sigon-main-nav .dropdown a:hover { background: #F5EFE2 !important; color: #2D5535 !important; }

@media (max-width: 767px) {
  .sigon-topbar .tb-left { display: none; }
  .sigon-topbar .tb-right { gap: 8px; }
  .sigon-topbar .tb-phone { font-size: 11px; }
  .sigon-header .header-main { padding: 8px 12px; gap: 8px; }
  .sigon-logo .logo-main { font-size: 22px; }
  .sigon-logo .logo-sport { font-size: 11px; letter-spacing: 2px; }
  .sigon-search { min-width: 0; }
  .header-action-btn span:not(.cart-count-badge) { display: none; }
  .header-action-btn { padding: 6px 8px; flex-direction: row; }
  .header-action-btn i { font-size: 22px; }
  .sigon-main-nav { display: none; }
}
/* WP Block theme: ẩn header/footer mặc định */
.wp-site-blocks > header, .wp-site-blocks > footer { display: none !important; }
</style>

<?php
// Detect active nav item
$current_url = $_SERVER['REQUEST_URI'];
$is_secondhand = strpos($current_url, '2hand') !== false || strpos($current_url, 'secondhand') !== false;
$is_shop = strpos($current_url, '/cua-hang') !== false || strpos($current_url, '/shop') !== false;
$is_store_page = strpos($current_url, '/he-thong-cua-hang') !== false;
$cart_count = function_exists('WC') && WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
$shop_url = function_exists('wc_get_page_id') ? get_permalink(wc_get_page_id('shop')) : home_url('/cua-hang/');
$account_url = function_exists('wc_get_account_endpoint_url') ? wc_get_account_endpoint_url('dashboard') : home_url('/my-account/');
?>

<!-- ===== TOPBAR ===== -->
<div class="sigon-topbar">
  <div class="tb-inner">
    <div class="tb-left">
      <span><i class="fas fa-truck"></i> Miễn phí vận chuyển đơn từ 1 triệu</span>
      <span><i class="fas fa-shield-alt"></i> Hàng chính hãng 100%</span>
    </div>
    <div class="tb-right">
      <div class="tb-social">
        <a href="https://facebook.com/SigonSecondhand" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
        <a href="https://instagram.com/sigonsecondhand" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="https://tiktok.com/@sigonsecondhand" target="_blank" rel="noopener" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
      </div>
      <span class="tb-phone"><i class="fas fa-phone"></i> 0878.627.139</span>
    </div>
  </div>
</div>

<!-- ===== HEADER ===== -->
<header class="sigon-header">
  <div class="header-main">
    <a href="<?php echo home_url('/'); ?>" class="sigon-logo">
      <span class="logo-main"><span class="si">Si</span>Gon</span>
      <span class="logo-sport">SPORT</span>
    </a>
    <div class="sigon-search">
      <form role="search" method="get" action="<?php echo home_url('/'); ?>">
        <input type="search" name="s" placeholder="Tìm giày, vợt, dụng cụ thể thao..." value="<?php echo get_search_query(); ?>" autocomplete="off">
        <input type="hidden" name="post_type" value="product">
        <button type="submit" aria-label="Tìm kiếm"><i class="fas fa-search"></i></button>
      </form>
    </div>
    <div class="header-actions">
      <a href="<?php echo home_url('/gio-hang/'); ?>" class="header-action-btn" aria-label="Giỏ hàng">
        <i class="fas fa-shopping-cart"></i>
        <?php if ($cart_count > 0): ?>
          <span class="cart-count-badge"><?php echo $cart_count; ?></span>
        <?php endif; ?>
        <span>Giỏ hàng</span>
      </a>
      <a href="<?php echo esc_url($account_url); ?>" class="header-action-btn" aria-label="Tài khoản">
        <i class="fas fa-user"></i>
        <span>Tài khoản</span>
      </a>
    </div>
  </div>

  <!-- Main Nav -->
  <nav class="sigon-main-nav" aria-label="Danh mục sản phẩm">
    <div class="nav-inner">
      <ul>
        <li class="nav-secondhand<?php echo $is_secondhand ? ' nav-active' : ''; ?>">
          <a href="<?php echo home_url('/loai-hang/2hand-real/'); ?>">
            <i class="fas fa-recycle"></i> 2HAND
          </a>
        </li>
        <li<?php echo $is_shop ? ' class="nav-active"' : ''; ?>>
          <a href="<?php echo esc_url($shop_url); ?>">
            <i class="fas fa-th-large"></i> TẤT CẢ
          </a>
        </li>
        <li style="display:none">
          <a href="<?php echo home_url('/product-category/giay-bong-da/'); ?>">
            <i class="fas fa-futbol"></i> BÓNG ĐÁ <i class="fas fa-chevron-down" style="font-size:10px;opacity:0.7"></i>
          </a>
          <div class="dropdown">
            <a href="<?php echo home_url('/product-category/giay-bong-da/'); ?>"><i class="fas fa-shoe-prints"></i> Giày sân cỏ (FG)</a>
            <a href="<?php echo home_url('/product-category/giay-bong-da/'); ?>"><i class="fas fa-shoe-prints"></i> Giày sân nhân tạo (TF/AG)</a>
            <a href="<?php echo home_url('/product-category/giay-bong-da/'); ?>"><i class="fas fa-shoe-prints"></i> Giày futsal (IC)</a>
          </div>
        </li>
        <li style="display:none">
          <a href="<?php echo home_url('/product-category/giay-cau-long/'); ?>">CẦU LÔNG</a>
        </li>
        <li style="display:none">
          <a href="<?php echo home_url('/product-category/giay-tennis/'); ?>">TENNIS</a>
        </li>
        <li style="display:none">
          <a href="<?php echo home_url('/product-category/giay-pickleball/'); ?>">PICKLEBALL</a>
        </li>
        <li<?php echo $is_store_page ? ' class="nav-active"' : ''; ?>>
          <a href="<?php echo home_url('/he-thong-cua-hang/'); ?>" style="color:#FFD46B;">
            <i class="fas fa-map-marker-alt"></i> CỬA HÀNG
          </a>
        </li>
      </ul>
    </div>
  </nav>
</header>

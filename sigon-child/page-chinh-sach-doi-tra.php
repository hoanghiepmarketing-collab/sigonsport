<?php
/**
 * Template Name: Chính Sách Đổi Trả
 * Template Post Type: page
 */
get_header(); ?>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">

<style>
/* === TRANG CHÍNH SÁCH ĐỔI TRẢ === */
:root {
  --c-primary: #2D5535;
  --c-primary-dark: #1E3D24;
  --c-si: #C44D28;
  --c-accent: #E5002B;
  --c-bg: #F5EFE2;
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Be Vietnam Pro', sans-serif;
}
*, *::before, *::after { box-sizing: border-box; }
body { font-family: var(--font-body); background: #f8faf8; }

/* --- TOPBAR --- */
.sp-topbar {
  background: var(--c-primary-dark);
  color: var(--c-bg);
  font-size: 12px;
  padding: 6px 0;
  font-family: var(--font-body);
}
.sp-topbar .tb-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sp-topbar a { color: var(--c-bg); opacity: .85; }
.sp-topbar a:hover { opacity: 1; color: #C44D28; }
.sp-topbar .tb-social a { font-size: 14px; margin: 0 4px; }
.sp-topbar .tb-phone { font-weight: 600; display:flex; align-items:center; gap:5px; }

/* --- HEADER --- */
.sp-header {
  background: var(--c-bg);
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  position: sticky;
  top: 0;
  z-index: 200;
}
.sp-header .h-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.sp-logo { text-decoration: none; flex-shrink:0; line-height:1; }
.sp-logo .lm { font-family: var(--font-heading); font-weight:900; font-size:26px; color:var(--c-primary); letter-spacing:-1px; }
.sp-logo .lm .si { color: var(--c-si); }
.sp-logo .ls { font-size:10px; color:var(--c-primary); font-weight:600; letter-spacing:1px; text-transform:uppercase; }
.sp-search { flex:1; max-width:480px; position:relative; }
.sp-search form { display:flex; border:2px solid var(--c-primary); border-radius:25px; overflow:hidden; background:#fff; }
.sp-search input { flex:1; border:none!important; padding:9px 16px!important; font-size:14px!important; outline:none!important; box-shadow:none!important; font-family:var(--font-body); }
.sp-search button { background:var(--c-primary)!important; border:none!important; color:#fff!important; padding:9px 16px!important; cursor:pointer; }
.sp-header-actions { display:flex; gap:8px; flex-shrink:0; }
.sp-action-btn {
  display:flex; flex-direction:column; align-items:center; gap:2px;
  text-decoration:none; color:var(--c-primary); font-size:11px; font-weight:600;
  padding:5px 10px; border-radius:8px; position:relative; font-family:var(--font-body);
  background:none; border:none; cursor:pointer;
}
.sp-action-btn:hover { background:rgba(45,85,53,.08); }
.sp-action-btn i { font-size:20px; }
.cart-badge {
  position:absolute; top:2px; right:4px; background:var(--c-accent);
  color:#fff; font-size:10px; font-weight:700; border-radius:50%;
  width:16px; height:16px; display:flex; align-items:center; justify-content:center;
}

/* --- NAV --- */
.sp-nav { background:var(--c-primary); }
.sp-nav .nav-inner { max-width:1200px; margin:0 auto; padding:0 16px; display:flex; }
.sp-nav ul { list-style:none; margin:0; padding:0; display:flex; }
.sp-nav ul li a {
  display:flex; align-items:center; gap:5px; padding:10px 13px;
  color:#fff; text-decoration:none; font-size:12px; font-weight:700;
  font-family:var(--font-body); text-transform:uppercase; letter-spacing:.3px;
  transition:background .15s; white-space:nowrap;
}
.sp-nav ul li a:hover { background:var(--c-primary-dark); }
.sp-nav .nav-hot > a { color:#FFD46B; }
.sp-nav .nav-2h > a { background:rgba(139,94,60,.4); }
.sp-nav .nav-2h > a:hover { background:#8B5E3C; }

/* --- BREADCRUMB --- */
.sp-breadcrumb { background:#fff; border-bottom:1px solid #e5e7eb; padding:10px 0; }
.sp-breadcrumb .bc-inner { max-width:1200px; margin:0 auto; padding:0 16px; font-size:13px; color:#9ca3af; display:flex; align-items:center; gap:6px; }
.sp-breadcrumb a { color:#6b7280; text-decoration:none; }
.sp-breadcrumb a:hover { color:var(--c-primary); }
.sp-breadcrumb .bc-current { color:#111827; font-weight:600; }

/* --- HERO --- */
.policy-hero {
  background: linear-gradient(135deg, var(--c-primary-dark), var(--c-primary));
  color: #fff;
  padding: 52px 16px 44px;
  text-align: center;
}
.policy-hero h1 {
  font-family: var(--font-heading);
  font-size: clamp(24px, 5vw, 42px);
  font-weight: 900;
  margin: 0 0 10px;
  letter-spacing: -.5px;
}
.policy-hero h1 span { color: #FFD46B; }
.policy-hero p { font-size: 15px; opacity: .8; max-width: 540px; margin: 0 auto; font-family: var(--font-body); }

/* --- BODY --- */
.policy-wrap { max-width: 780px; margin: 0 auto; padding: 48px 16px 64px; }

/* TOC */
.policy-toc {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 40px;
}
.policy-toc__title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 13px;
  color: var(--c-primary);
  text-transform: uppercase;
  letter-spacing: .5px;
  margin-bottom: 12px;
}
.policy-toc ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px; }
.policy-toc ul li a {
  font-size: 14px; color: var(--c-primary); text-decoration:none;
  display:flex; align-items:center; gap:8px; font-family:var(--font-body);
}
.policy-toc ul li a:hover { color: var(--c-si); text-decoration:underline; }

/* Sections */
.policy-section { margin-bottom: 36px; scroll-margin-top: 80px; }
.policy-section__header {
  display:flex; align-items:center; gap:12px;
  background: var(--c-primary);
  color: #fff;
  padding: 13px 20px;
  border-radius: 10px 10px 0 0;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 15px;
}
.policy-section__header .icon { font-size: 18px; }
.policy-section__header.orange { background: #C44D28; }
.policy-section__header.green  { background: #16a34a; }
.policy-section__header.red    { background: #dc2626; }
.policy-section__header.purple { background: #7c3aed; }
.policy-section__header.gray   { background: #475569; }
.policy-section__body {
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 10px 10px;
  padding: 20px 24px;
  background: #fff;
}
.policy-section__body p { font-size: 14px; line-height: 1.75; color: #374151; margin-bottom: 10px; font-family: var(--font-body); }
.policy-section__body p:last-child { margin-bottom: 0; }

/* Lists */
.cond-list { list-style:none; padding:0; margin:10px 0; display:flex; flex-direction:column; gap:8px; }
.cond-list li { display:flex; align-items:flex-start; gap:10px; font-size:14px; color:#374151; line-height:1.6; font-family:var(--font-body); }
.cond-list li .ci { flex-shrink:0; width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; margin-top:2px; }
.cond-list li .ci.ok  { background:#dcfce7; color:#16a34a; }
.cond-list li .ci.no  { background:#fee2e2; color:#dc2626; }
.cond-list li .ci.dot { background:#e0f2fe; color:#0369a1; }

.step-list { list-style:none; padding:0; margin:10px 0; counter-reset:steps; display:flex; flex-direction:column; gap:12px; }
.step-list li {
  display:flex; align-items:flex-start; gap:12px;
  font-size:14px; color:#374151; line-height:1.65;
  counter-increment:steps; font-family:var(--font-body);
}
.step-list li::before {
  content:counter(steps); flex-shrink:0; width:24px; height:24px;
  background:var(--c-primary); color:#fff; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:800; margin-top:1px;
}

/* Boxes */
.highlight-box {
  background:#fffbeb; border:1px solid #fde68a; border-radius:8px;
  padding:13px 17px; font-size:13px; color:#92400e; line-height:1.65;
  margin-top:12px; font-family:var(--font-body);
}
.highlight-box.green { background:#f0fdf4; border-color:#bbf7d0; color:#166534; }
.note-bar {
  background:#f8fafc; border-left:4px solid var(--c-primary);
  padding:12px 16px; border-radius:0 8px 8px 0;
  font-size:13px; color:#475569; margin-top:16px; line-height:1.65;
  font-family:var(--font-body);
}

/* CTA */
.policy-cta {
  background: linear-gradient(135deg, var(--c-primary), var(--c-primary-dark));
  border-radius: 12px; padding: 28px 24px; text-align:center; color:#fff; margin-top:40px;
}
.policy-cta h3 { font-family:var(--font-heading); font-size:18px; font-weight:800; margin:0 0 8px; }
.policy-cta p { font-size:14px; opacity:.85; margin-bottom:16px; font-family:var(--font-body); }
.policy-cta__links { display:flex; justify-content:center; flex-wrap:wrap; gap:10px; }
.policy-cta__links a {
  display:inline-flex; align-items:center; gap:7px; padding:9px 18px;
  background:rgba(255,255,255,.15); border:1.5px solid rgba(255,255,255,.35);
  border-radius:8px; color:#fff; font-size:13px; font-weight:700;
  text-decoration:none; transition:background .2s; font-family:var(--font-body);
}
.policy-cta__links a:hover { background:rgba(255,255,255,.28); }

/* FOOTER */
.sp-footer { background:var(--c-primary-dark); color:var(--c-bg); padding:48px 0 24px; font-family:var(--font-body); }
.sp-footer .f-inner { max-width:1200px; margin:0 auto; padding:0 16px; }
.sp-footer .f-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:32px; margin-bottom:28px; }
.sp-footer .f-logo { font-family:var(--font-heading); font-weight:900; font-size:26px; color:#fff; margin-bottom:10px; }
.sp-footer .f-logo .si { color:var(--c-si); }
.sp-footer .f-slogan { font-style:italic; color:rgba(245,239,226,.7); font-size:14px; margin-bottom:14px; }
.sp-footer .f-addr { font-size:13px; color:rgba(245,239,226,.8); line-height:1.7; }
.sp-footer .f-col-title { font-weight:700; font-size:13px; text-transform:uppercase; letter-spacing:.5px; margin-bottom:12px; }
.sp-footer .f-links { display:flex; flex-direction:column; gap:8px; }
.sp-footer .f-links a { font-size:13px; color:rgba(245,239,226,.75); text-decoration:none; }
.sp-footer .f-links a:hover { color:#fff; }
.sp-footer .f-links a.active { color:#FFD46B; font-weight:700; }
.sp-footer .f-social { display:flex; gap:12px; font-size:22px; margin-bottom:12px; }
.sp-footer .f-social a { color:rgba(245,239,226,.75); }
.sp-footer .f-social a:hover { color:#fff; }
.sp-footer .f-bottom { border-top:1px solid rgba(255,255,255,.1); padding-top:18px; text-align:center; font-size:12px; color:rgba(245,239,226,.45); }

@media (max-width:767px) {
  .sp-footer .f-grid { grid-template-columns:1fr 1fr; }
  .policy-section__body { padding:16px; }
  .sp-nav { display:none; }
}
@media (max-width:479px) {
  .sp-footer .f-grid { grid-template-columns:1fr; }
}
</style>

<?php get_template_part('sigon-shared-header'); ?>

<!-- BREADCRUMB -->
<div class="sp-breadcrumb">
  <div class="bc-inner">
    <a href="<?php echo home_url('/'); ?>">Trang chủ</a>
    <span>›</span>
    <span class="bc-current">Chính sách đổi trả</span>
  </div>
</div>

<!-- HERO -->
<div class="policy-hero">
  <h1>CHÍNH SÁCH ĐỔI TRẢ — <span>SIGON</span></h1>
  <p>Cam kết minh bạch, rõ ràng — Mua sắm an tâm tại SiGon Secondhand</p>
</div>

<main>
<div class="policy-wrap">

  <!-- MỤC LỤC -->
  <nav class="policy-toc" aria-label="Mục lục">
    <div class="policy-toc__title"><i class="fas fa-list-ul" style="margin-right:7px"></i>Mục lục nội dung</div>
    <ul>
      <li><a href="#offline"><i class="fas fa-store" style="color:#2D5535;width:16px"></i> Mua tại cửa hàng (Offline)</a></li>
      <li><a href="#doi-hang-offline"><i class="fas fa-arrows-rotate" style="color:#C44D28;width:16px"></i> Đổi hàng tại cửa hàng</a></li>
      <li><a href="#keo-giay"><i class="fas fa-wrench" style="color:#16a34a;width:16px"></i> Hỗ trợ keo giày miễn phí</a></li>
      <li><a href="#online"><i class="fas fa-globe" style="color:#7c3aed;width:16px"></i> Mua hàng trực tuyến (Online)</a></li>
      <li><a href="#dat-coc"><i class="fas fa-coins" style="color:#C44D28;width:16px"></i> Đặt cọc giữ hàng</a></li>
      <li><a href="#khong-ung"><i class="fas fa-box-open" style="color:#475569;width:16px"></i> Khi nhận hàng không ưng</a></li>
      <li><a href="#doi-size"><i class="fas fa-check-circle" style="color:#16a34a;width:16px"></i> Điều kiện đổi hàng (nhầm size)</a></li>
      <li><a href="#khong-doi"><i class="fas fa-ban" style="color:#dc2626;width:16px"></i> Các trường hợp KHÔNG được đổi/trả</a></li>
      <li><a href="#huong-dan"><i class="fas fa-clipboard-list" style="color:#2D5535;width:16px"></i> Hướng dẫn gửi yêu cầu đổi hàng</a></li>
      <li><a href="#luu-y"><i class="fas fa-exclamation-circle" style="color:#475569;width:16px"></i> Lưu ý thêm</a></li>
    </ul>
  </nav>

  <!-- 1. Offline -->
  <section class="policy-section" id="offline">
    <div class="policy-section__header">
      <span class="icon">🛍️</span> Mua hàng tại cửa hàng (Offline)
    </div>
    <div class="policy-section__body">
      <p>Tất cả sản phẩm tại SiGon đều là <strong>hàng secondhand đã qua sử dụng</strong>. Vui lòng kiểm tra kỹ sản phẩm trước khi thanh toán — SiGon <strong>không hỗ trợ hoàn tiền</strong> sau khi giao dịch hoàn tất.</p>
    </div>
  </section>

  <!-- 2. Đổi hàng offline -->
  <section class="policy-section" id="doi-hang-offline">
    <div class="policy-section__header orange">
      <span class="icon">🔄</span> Đổi hàng tại cửa hàng
    </div>
    <div class="policy-section__body">
      <p>SiGon hỗ trợ <strong>đổi size hoặc đổi sang sản phẩm khác</strong> trong vòng <strong>3 ngày</strong> kể từ ngày mua, với điều kiện:</p>
      <ul class="cond-list">
        <li><span class="ci ok"><i class="fas fa-check"></i></span> Còn hoá đơn mua hàng hợp lệ</li>
        <li><span class="ci ok"><i class="fas fa-check"></i></span> Sản phẩm còn nguyên tình trạng như khi mua, còn nguyên nhãn giá</li>
        <li><span class="ci ok"><i class="fas fa-check"></i></span> Được đổi sang sản phẩm ngang giá, cao hơn hoặc thấp hơn</li>
        <li><span class="ci no"><i class="fas fa-xmark"></i></span> Nếu đổi sang sản phẩm giá thấp hơn, phần chênh lệch <strong>không được hoàn lại</strong></li>
        <li><span class="ci no"><i class="fas fa-xmark"></i></span> Quá 3 ngày kể từ ngày mua, SiGon <strong>không hỗ trợ đổi hàng</strong></li>
      </ul>
    </div>
  </section>

  <!-- 3. Keo giày -->
  <section class="policy-section" id="keo-giay">
    <div class="policy-section__header green">
      <span class="icon">🔧</span> Hỗ trợ keo giày miễn phí
    </div>
    <div class="policy-section__body">
      <p>SiGon hỗ trợ <strong>keo giày miễn phí trong vòng 30 ngày</strong> kể từ ngày mua.</p>
      <div class="highlight-box">
        <strong><i class="fas fa-info-circle" style="margin-right:5px"></i>Lưu ý:</strong> Khách hàng chịu phí vận chuyển khi gửi hàng về SiGon để xử lý.
      </div>
    </div>
  </section>

  <!-- 4. Online -->
  <section class="policy-section" id="online">
    <div class="policy-section__header purple">
      <span class="icon">📦</span> Mua hàng trực tuyến (Online)
    </div>
    <div class="policy-section__body">
      <p>SiGon áp dụng chính sách riêng cho đơn hàng online nhằm đảm bảo quyền lợi cho cả hai bên. Vui lòng đọc kỹ các điều khoản bên dưới trước khi đặt hàng.</p>
    </div>
  </section>

  <!-- 5. Đặt cọc -->
  <section class="policy-section" id="dat-coc">
    <div class="policy-section__header orange">
      <span class="icon">💰</span> Đặt cọc giữ hàng
    </div>
    <div class="policy-section__body">
      <p>Để đặt hàng online, SiGon yêu cầu <strong>cọc 100.000đ</strong> khi xác nhận đơn.</p>
      <p>Mong khách hàng thông cảm — do sản phẩm là đồ secondhand có kích thước lớn, chi phí vận chuyển khá cao, nên khoản cọc này giúp SiGon đảm bảo đơn hàng được xử lý nghiêm túc, tránh tình trạng đặt hàng nhưng không nhận.</p>
      <div class="highlight-box green">
        <i class="fas fa-circle-check" style="margin-right:6px"></i><strong>Tiền cọc sẽ được trừ trực tiếp vào hoá đơn khi thanh toán</strong> — khách hàng không mất thêm bất kỳ khoản nào.
      </div>
    </div>
  </section>

  <!-- 6. Không ưng -->
  <section class="policy-section" id="khong-ung">
    <div class="policy-section__header gray">
      <span class="icon">📬</span> Khi nhận hàng không ưng
    </div>
    <div class="policy-section__body">
      <p>Nếu khách hàng nhận hàng và không hài lòng với sản phẩm, có thể hoàn trả lại trong vòng <strong>7 ngày</strong>, tuy nhiên:</p>
      <ul class="cond-list">
        <li><span class="ci no"><i class="fas fa-xmark"></i></span> Khách hàng chịu <strong>phí hoàn kho 50.000đ</strong></li>
        <li><span class="ci no"><i class="fas fa-xmark"></i></span> Không hoàn lại tiền hàng hoặc phí vận chuyển ban đầu</li>
      </ul>
    </div>
  </section>

  <!-- 7. Đổi size -->
  <section class="policy-section" id="doi-size">
    <div class="policy-section__header green">
      <span class="icon">✅</span> Điều kiện đổi hàng (nhầm size)
    </div>
    <div class="policy-section__body">
      <p>SiGon hỗ trợ đổi hàng trong vòng <strong>7 ngày</strong> kể từ khi nhận hàng thành công trong trường hợp <strong>nhầm size</strong>, với các điều kiện:</p>
      <ul class="cond-list">
        <li><span class="ci ok"><i class="fas fa-check"></i></span> Còn hoá đơn mua hàng hợp lệ</li>
        <li><span class="ci ok"><i class="fas fa-check"></i></span> Sản phẩm còn nguyên tình trạng như khi giao, còn nguyên nhãn giá của SiGon</li>
        <li><span class="ci ok"><i class="fas fa-check"></i></span> Được đổi sang sản phẩm ngang giá, cao hơn hoặc thấp hơn</li>
        <li><span class="ci no"><i class="fas fa-xmark"></i></span> Nếu đổi sang sản phẩm giá thấp hơn, phần chênh lệch <strong>không được hoàn lại</strong></li>
        <li><span class="ci no"><i class="fas fa-xmark"></i></span> Toàn bộ chi phí vận chuyển (ship về + ship đơn mới đi) <strong>do khách hàng chịu</strong></li>
      </ul>
    </div>
  </section>

  <!-- 8. Không đổi -->
  <section class="policy-section" id="khong-doi">
    <div class="policy-section__header red">
      <span class="icon">❌</span> Các trường hợp KHÔNG được đổi/trả
    </div>
    <div class="policy-section__body">
      <ul class="cond-list">
        <li><span class="ci no"><i class="fas fa-xmark"></i></span> Không còn hoá đơn mua hàng</li>
        <li><span class="ci no"><i class="fas fa-xmark"></i></span> Sản phẩm đúng số đo như mô tả <em>(chênh lệch ~1–2cm là bình thường)</em></li>
        <li><span class="ci no"><i class="fas fa-xmark"></i></span> Lỗi đã được công bố rõ trong phần mô tả sản phẩm</li>
        <li><span class="ci no"><i class="fas fa-xmark"></i></span> Sản phẩm đã qua giặt, không còn nhãn giá, hoặc hư hỏng do người mua</li>
      </ul>
    </div>
  </section>

  <!-- 9. Hướng dẫn -->
  <section class="policy-section" id="huong-dan">
    <div class="policy-section__header">
      <span class="icon">📋</span> Hướng dẫn gửi yêu cầu đổi hàng
    </div>
    <div class="policy-section__body">
      <ol class="step-list">
        <li>Liên hệ SiGon qua <strong>Facebook / Instagram / Zalo</strong> trong vòng 7 ngày nhận hàng</li>
        <li>Mô tả rõ lý do kèm <strong>hình ảnh thực tế</strong> sản phẩm và ảnh chụp hoá đơn mua hàng</li>
        <li>Sau khi SiGon xác nhận, tiến hành gửi hàng về — vui lòng <strong>đóng gói cẩn thận</strong> kèm hoá đơn gốc và đầy đủ phụ kiện (nếu có)</li>
        <li>Sau khi nhận và kiểm tra hàng, SiGon sẽ <strong>ship đơn đổi mới</strong> đến khách</li>
      </ol>
    </div>
  </section>

  <!-- 10. Lưu ý -->
  <section class="policy-section" id="luu-y">
    <div class="policy-section__header gray">
      <span class="icon">📌</span> Lưu ý thêm
    </div>
    <div class="policy-section__body">
      <ul class="cond-list">
        <li><span class="ci dot"><i class="fas fa-circle-info"></i></span> Phí vận chuyển <strong>không được hoàn lại</strong> trong mọi trường hợp</li>
        <li><span class="ci dot"><i class="fas fa-circle-info"></i></span> SiGon có quyền từ chối các yêu cầu không đáp ứng điều kiện trên</li>
        <li><span class="ci dot"><i class="fas fa-circle-info"></i></span> Tài khoản có lịch sử đổi hàng bất thường hoặc lạm dụng có thể bị <strong>hạn chế mua hàng</strong></li>
      </ul>
    </div>
  </section>

  <!-- CTA -->
  <div class="policy-cta">
    <h3>Cần hỗ trợ thêm?</h3>
    <p>Mọi thắc mắc, vui lòng liên hệ SiGon qua các kênh bên dưới để được hỗ trợ nhanh nhất!</p>
    <div class="policy-cta__links">
      <a href="https://facebook.com/SigonSecondhand" target="_blank" rel="noopener"><i class="fab fa-facebook"></i> Facebook</a>
      <a href="https://instagram.com/sigonsecondhand" target="_blank" rel="noopener"><i class="fab fa-instagram"></i> Instagram</a>
      <a href="https://zalo.me/sigonsecondhand" target="_blank" rel="noopener"><i class="fas fa-comment-dots"></i> Zalo</a>
      <a href="<?php echo home_url('/lien-he/'); ?>"><i class="fas fa-envelope"></i> Liên hệ</a>
    </div>
  </div>

</div>
</main>

<?php get_template_part('sigon-shared-footer'); ?>

<?php wp_footer(); ?>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
<?php
/**
 * SiGon Care — standalone landing page, served directly for the
 * care.sigon.vn host via a template_redirect hook in functions.php.
 * This file intentionally does NOT call wp_body_open(), so the global
 * SiGon Sport store header (hooked on wp_body_open) never renders here.
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SiGon Care — Vệ Sinh, Sửa Chữa & Phục Hồi Giày Tại TP.HCM</title>
<meta name="description" content="SiGon Care: vệ sinh, dán đế, may đế, thay đế, độ đế giày chuyên nghiệp. Hotline/Zalo 0915.920.711. 2 chi nhánh tại TP.HCM, mở cửa 10:00–22:00 hàng ngày.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
<?php wp_head(); ?>
<style>
  :root{
    --care-cream:#f3ead9;
    --care-cream-dark:#e8dcc2;
    --care-green:#1f3a2e;
    --care-green-light:#2d5245;
    --care-orange:#d2691e;
    --care-orange-dark:#b5571a;
    --care-gold:#ffd46b;
    --care-ink:#2a2420;
    --radius:18px;
    --shadow:0 6px 0 rgba(31,58,46,.15);
  }
  *{box-sizing:border-box}
  body{
    margin:0;
    background:var(--care-cream);
    color:var(--care-ink);
    font-family:'Be Vietnam Pro',system-ui,sans-serif;
    line-height:1.55;
  }
  h1,h2,h3,.brand{font-family:'Baloo 2',system-ui,sans-serif;}
  img{max-width:100%;display:block}
  a{color:inherit}
  .wrap{max-width:1080px;margin:0 auto;padding:0 20px}
  .btn{
    display:inline-flex;align-items:center;gap:8px;
    padding:14px 26px;border-radius:999px;font-weight:700;
    text-decoration:none;border:3px solid var(--care-ink);
    box-shadow:var(--shadow);transition:transform .15s ease;
  }
  .btn:active{transform:translateY(3px);box-shadow:none}
  .btn-primary{background:var(--care-orange);color:#fff}
  .btn-ghost{background:var(--care-cream);color:var(--care-green)}

  /* Header */
  .site-header{
    position:sticky;top:0;z-index:50;
    background:var(--care-green);color:#fff;
    border-bottom:4px solid var(--care-ink);
  }
  .site-header .wrap{display:flex;align-items:center;justify-content:space-between;padding-top:12px;padding-bottom:12px;gap:16px;flex-wrap:wrap}
  .brand{font-size:24px;font-weight:800;color:#fff;text-decoration:none;display:flex;align-items:center;gap:8px}
  .brand span.tag{font-family:'Be Vietnam Pro',sans-serif;font-size:11px;font-weight:600;background:var(--care-gold);color:var(--care-ink);padding:2px 8px;border-radius:999px;vertical-align:middle}
  .nav-cta{display:flex;align-items:center;gap:10px;font-size:14px}
  .nav-cta .hotline{font-weight:700;color:var(--care-gold)}

  /* Hero */
  .hero{padding:56px 0 48px;background:
      radial-gradient(circle at 85% 20%, rgba(255,212,107,.35), transparent 45%),
      var(--care-cream);}
  .hero .wrap{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center}
  .hero h1{font-size:40px;line-height:1.15;margin:0 0 14px;color:var(--care-green)}
  .hero h1 em{font-style:normal;color:var(--care-orange)}
  .hero p.lead{font-size:17px;color:#4a4039;margin:0 0 24px;max-width:46ch}
  .hero .cta-row{display:flex;gap:14px;flex-wrap:wrap}
  .hero-badge{
    background:#fff;border:3px solid var(--care-ink);border-radius:var(--radius);
    box-shadow:var(--shadow);padding:28px;text-align:center;
  }
  .hero-badge .big{font-size:38px;font-weight:800;color:var(--care-orange);font-family:'Baloo 2',sans-serif}
  .hero-badge .small{font-size:13px;color:#6b5f54;margin-top:6px}

  /* Section titles */
  .section{padding:56px 0}
  .section-title{text-align:center;margin:0 0 8px;font-size:30px;color:var(--care-green)}
  .section-sub{text-align:center;color:#6b5f54;margin:0 0 36px;font-size:15px}
  .tape{display:inline-block;background:var(--care-gold);color:var(--care-ink);font-weight:700;font-size:12px;letter-spacing:.06em;padding:4px 14px;border-radius:999px;margin-bottom:10px}
  .center{text-align:center}

  /* Services */
  .services{background:#fff}
  .svc-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:18px}
  .svc-card{
    background:var(--care-cream);border:3px solid var(--care-ink);border-radius:var(--radius);
    padding:22px 16px;text-align:center;box-shadow:var(--shadow);
  }
  .svc-card .icon{font-size:34px;margin-bottom:10px}
  .svc-card h3{font-size:17px;margin:0 0 6px;color:var(--care-green)}
  .svc-card p{font-size:13px;color:#6b5f54;margin:0 0 12px;min-height:52px}
  .svc-card .price{font-weight:800;color:var(--care-orange);font-size:18px}

  /* Pricing table */
  .pricing{background:var(--care-green);color:#fff}
  .pricing .section-title,.pricing .tape{color:#fff}
  .pricing .tape{background:var(--care-gold);color:var(--care-ink)}
  .price-table{width:100%;border-collapse:separate;border-spacing:0 10px}
  .price-table th{text-align:left;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--care-gold);padding:0 18px 6px}
  .price-table td{background:var(--care-green-light);padding:16px 18px;font-size:15px}
  .price-table tr td:first-child{border-radius:14px 0 0 14px;font-weight:700}
  .price-table tr td:last-child{border-radius:0 14px 14px 0;text-align:right;font-weight:800;color:var(--care-gold);font-size:18px}
  .pricing-meta{display:flex;flex-wrap:wrap;gap:24px;justify-content:center;margin-top:28px;font-size:14px}
  .pricing-meta div{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.25);border-radius:12px;padding:12px 18px}
  .pricing-meta strong{color:var(--care-gold)}

  /* Before/After */
  .ba-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .ba-slot{
    aspect-ratio:1/1;border:3px dashed #b9ab93;border-radius:var(--radius);
    display:flex;align-items:center;justify-content:center;text-align:center;
    color:#8a7c6b;font-size:13px;padding:14px;background:#fff;
  }

  /* Why us */
  .why{background:#fff}
  .why-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
  .why-card{padding:20px;text-align:center}
  .why-card .icon{font-size:30px;margin-bottom:10px}
  .why-card h3{font-size:16px;margin:0 0 6px;color:var(--care-green)}
  .why-card p{font-size:13px;color:#6b5f54;margin:0}

  /* Stores */
  .store-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .store-card{background:#fff;border:3px solid var(--care-ink);border-radius:var(--radius);padding:24px;box-shadow:var(--shadow)}
  .store-card h3{margin:0 0 10px;color:var(--care-green);font-size:19px}
  .store-card p{margin:4px 0;font-size:14px;color:#4a4039}
  .store-card .hours{display:inline-block;margin-top:10px;background:var(--care-cream-dark);padding:6px 12px;border-radius:999px;font-size:13px;font-weight:700;color:var(--care-green)}

  /* Ecosystem banner */
  .eco{background:var(--care-orange);color:#fff}
  .eco .wrap{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;padding:36px 20px}
  .eco h2{margin:0 0 6px;font-size:22px}
  .eco p{margin:0;font-size:14px;max-width:46ch;opacity:.95}
  .eco .btn{background:#fff;color:var(--care-orange)}

  /* Final CTA */
  .final-cta{background:var(--care-green);color:#fff;text-align:center}
  .final-cta h2{font-size:28px;margin:0 0 12px}
  .final-cta p{opacity:.9;margin:0 0 24px}

  /* Floating buttons */
  .floaters{position:fixed;right:18px;bottom:18px;z-index:60;display:flex;flex-direction:column;gap:10px}
  .floaters a{
    width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    font-size:24px;box-shadow:0 4px 12px rgba(0,0,0,.25);border:3px solid var(--care-ink);
  }
  .floaters .zalo{background:#0068ff;color:#fff}
  .floaters .phone{background:var(--care-orange);color:#fff}

  /* Footer */
  footer.site-footer{background:var(--care-ink);color:#d8cfc2;padding:36px 0;font-size:13px}
  footer.site-footer .wrap{display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px;align-items:center}
  footer.site-footer a{text-decoration:none;color:#d8cfc2}
  footer.site-footer a:hover{color:#fff}

  @media (max-width:880px){
    .hero .wrap{grid-template-columns:1fr}
    .svc-grid{grid-template-columns:repeat(2,1fr)}
    .ba-grid{grid-template-columns:repeat(2,1fr)}
    .why-grid{grid-template-columns:repeat(2,1fr)}
    .store-grid{grid-template-columns:1fr}
    .hero h1{font-size:30px}
  }
</style>
</head>
<body <?php body_class('sigon-care-page'); ?>>

<header class="site-header">
  <div class="wrap">
    <a class="brand" href="#top">🧽 SiGon <span style="color:var(--care-gold)">Care</span> <span class="tag">by SiGon</span></a>
    <nav class="nav-cta">
      <span class="hotline">📞 0915.920.711</span>
      <a class="btn btn-primary" style="padding:10px 18px;font-size:14px" href="https://zalo.me/0915920711" target="_blank" rel="noopener">Đặt lịch qua Zalo</a>
    </nav>
  </div>
</header>

<section class="hero" id="top">
  <div class="wrap">
    <div>
      <span class="tape">VỆ SINH · SỬA CHỮA · PHỤC HỒI GIÀY</span>
      <h1>Giày cũ mấy cũng được,<br><em>SiGon Care</em> hồi sinh như mới.</h1>
      <p class="lead">Nhánh chăm sóc giày của SiGon — vệ sinh, dán đế, may đế, thay đế, độ đế chuyên nghiệp, giá rõ ràng, lấy nhanh trong ngày.</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="https://zalo.me/0915920711" target="_blank" rel="noopener">💬 Đặt lịch qua Zalo</a>
        <a class="btn btn-ghost" href="tel:0915920711">📞 Gọi ngay 0915.920.711</a>
      </div>
    </div>
    <div class="hero-badge">
      <div class="big">89k–400k</div>
      <div class="small">Bảng giá rõ ràng cho từng dịch vụ — xem chi tiết bên dưới</div>
    </div>
  </div>
</section>

<section class="section services" id="dich-vu">
  <div class="wrap">
    <div class="center"><span class="tape">DỊCH VỤ</span></div>
    <h2 class="section-title">5 Dịch Vụ Chăm Sóc Giày</h2>
    <p class="section-sub">Chọn đúng dịch vụ giày của bạn đang cần</p>
    <div class="svc-grid">
      <div class="svc-card">
        <div class="icon">🧼</div>
        <h3>Vệ Sinh (Spa)</h3>
        <p>Làm sạch toàn diện, khử mùi, làm mới giày</p>
        <div class="price">89.000đ</div>
      </div>
      <div class="svc-card">
        <div class="icon">🧴</div>
        <h3>Dán Đế</h3>
        <p>Dán keo chuyên dụng, chắc chắn, bền lâu</p>
        <div class="price">199.000đ</div>
      </div>
      <div class="svc-card">
        <div class="icon">🪡</div>
        <h3>May Đế</h3>
        <p>May chắc chắn, tăng độ bền cho đế</p>
        <div class="price">150.000đ</div>
      </div>
      <div class="svc-card">
        <div class="icon">👟</div>
        <h3>Thay Đế</h3>
        <p>Thay đế mới, chuẩn form, bền đẹp</p>
        <div class="price">350.000đ</div>
      </div>
      <div class="svc-card">
        <div class="icon">✨</div>
        <h3>Độ Đế</h3>
        <p>Độ đế theo yêu cầu, tăng độ êm & bám</p>
        <div class="price">400.000đ</div>
      </div>
    </div>
  </div>
</section>

<section class="section pricing" id="bang-gia">
  <div class="wrap">
    <div class="center"><span class="tape">BẢNG GIÁ</span></div>
    <h2 class="section-title">Bảng Giá Dịch Vụ</h2>
    <p class="section-sub" style="color:#d8cfc2">Giá niêm yết, không phát sinh</p>
    <table class="price-table">
      <tr><th>Dịch vụ</th><th>Mô tả</th><th style="text-align:right">Giá</th></tr>
      <tr><td>Vệ sinh (Spa)</td><td>Làm sạch toàn diện, khử mùi, làm mới giày</td><td>89.000đ</td></tr>
      <tr><td>Dán đế</td><td>Dán keo chuyên dụng, chắc chắn, bền lâu</td><td>199.000đ</td></tr>
      <tr><td>May đế</td><td>May chắc chắn, tăng độ bền cho đế</td><td>150.000đ</td></tr>
      <tr><td>Thay đế</td><td>Thay đế mới, chuẩn form, bền đẹp</td><td>350.000đ</td></tr>
      <tr><td>Độ đế</td><td>Độ đế theo yêu cầu, tăng độ êm & bám</td><td>400.000đ</td></tr>
    </table>
    <div class="pricing-meta">
      <div>📞 Hotline/Zalo: <strong>0915.920.711</strong></div>
      <div>🕙 Giờ mở cửa: <strong>10:00 – 22:00</strong> (hàng ngày)</div>
    </div>
  </div>
</section>

<section class="section" id="before-after" style="background:var(--care-cream-dark)">
  <div class="wrap">
    <div class="center"><span class="tape">TRƯỚC – SAU</span></div>
    <h2 class="section-title">Giày Trước & Sau Khi Chăm Sóc</h2>
    <p class="section-sub">Ảnh thực tế từng đôi giày sẽ được cập nhật tại đây</p>
    <div class="ba-grid">
      <div class="ba-slot">Ảnh minh hoạ<br>sẽ cập nhật</div>
      <div class="ba-slot">Ảnh minh hoạ<br>sẽ cập nhật</div>
      <div class="ba-slot">Ảnh minh hoạ<br>sẽ cập nhật</div>
      <div class="ba-slot">Ảnh minh hoạ<br>sẽ cập nhật</div>
    </div>
  </div>
</section>

<section class="section why" id="vi-sao">
  <div class="wrap">
    <div class="center"><span class="tape">VÌ SAO CHỌN SIGON CARE</span></div>
    <h2 class="section-title">Yên Tâm Giao Giày Cho SiGon Care</h2>
    <div class="why-grid">
      <div class="why-card">
        <div class="icon">🤝</div>
        <h3>Cùng hệ sinh thái SiGon</h3>
        <p>Thuộc SiGon — thương hiệu giày thể thao quen thuộc tại TP.HCM</p>
      </div>
      <div class="why-card">
        <div class="icon">💰</div>
        <h3>Giá niêm yết rõ ràng</h3>
        <p>Báo giá trước khi làm, không phát sinh chi phí</p>
      </div>
      <div class="why-card">
        <div class="icon">⚡</div>
        <h3>Xử lý nhanh gọn</h3>
        <p>Nhận và trả giày đúng hẹn, cập nhật qua Zalo</p>
      </div>
      <div class="why-card">
        <div class="icon">🧵</div>
        <h3>Tay nghề chuyên môn</h3>
        <p>Dán, may, thay đế đúng kỹ thuật, bền chắc</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="cua-hang" style="background:#fff">
  <div class="wrap">
    <div class="center"><span class="tape">HỆ THỐNG CỬA HÀNG</span></div>
    <h2 class="section-title">2 Chi Nhánh Tại TP.HCM</h2>
    <div class="store-grid">
      <div class="store-card">
        <h3>📍 Chi nhánh 1</h3>
        <p>160/11/19 Đặng Thuỳ Trâm, P. Bình Lợi Trung, TP.HCM</p>
        <p style="color:#8a7c6b;font-size:13px">(gần ĐH Văn Lang)</p>
        <span class="hours">10:00 – 22:00 hàng ngày</span>
      </div>
      <div class="store-card">
        <h3>📍 Chi nhánh 2</h3>
        <p>927/27B CMT8, P. Tân Sơn Nhất, TP.HCM</p>
        <span class="hours">10:00 – 22:00 hàng ngày</span>
      </div>
    </div>
  </div>
</section>

<section class="eco">
  <div class="wrap">
    <div>
      <h2>Cần mua giày mới hoặc giày 2hand?</h2>
      <p>Ghé SiGon Sport — và xem thêm mẹo bảo quản giày tại blog SiGon.</p>
    </div>
    <a class="btn" href="https://sigon.vn" target="_blank" rel="noopener">Khám phá SiGon Sport →</a>
  </div>
</section>

<section class="final-cta section">
  <div class="wrap">
    <h2>Đôi giày của bạn xứng đáng được chăm sóc tốt hơn.</h2>
    <p>Nhắn Zalo hoặc gọi ngay để được tư vấn dịch vụ phù hợp.</p>
    <div class="cta-row" style="justify-content:center;display:flex;gap:14px;flex-wrap:wrap">
      <a class="btn btn-primary" href="https://zalo.me/0915920711" target="_blank" rel="noopener">💬 Đặt lịch qua Zalo</a>
      <a class="btn" style="background:var(--care-gold);color:var(--care-ink)" href="tel:0915920711">📞 0915.920.711</a>
    </div>
  </div>
</section>

<a class="floaters" style="position:fixed;right:18px;bottom:18px;z-index:60;display:flex;flex-direction:column;gap:10px" href="#">
</a>
<div class="floaters">
  <a class="zalo" href="https://zalo.me/0915920711" target="_blank" rel="noopener" title="Chat Zalo">💬</a>
  <a class="phone" href="tel:0915920711" title="Gọi ngay">📞</a>
</div>

<footer class="site-footer">
  <div class="wrap">
    <div>© <?php echo date('Y'); ?> SiGon Care — một nhánh dịch vụ của <a href="https://sigon.vn" target="_blank" rel="noopener">SiGon Sport</a></div>
    <div><a href="https://sigon.vn" target="_blank" rel="noopener">sigon.vn</a> · <a href="tel:0915920711">0915.920.711</a></div>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>

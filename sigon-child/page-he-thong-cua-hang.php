<?php
/**
 * Template Name: Hệ Thống Cửa Hàng
 * Template Post Type: page
 */
get_header();
get_template_part('sigon-shared-header');
?>

<style>
/* ===== PAGE-SPECIFIC STYLES ===== */
*, *::before, *::after { box-sizing: border-box; }
body { background: #f4f1eb; }
.page-wrap { max-width: 1200px; margin: 0 auto; padding: 0 16px 60px; }

.store-hero {
  background: linear-gradient(135deg, #1E3D24 0%, #2D5535 100%);
  color: #fff; padding: 56px 32px; text-align: center; position: relative; overflow: hidden;
}
.store-hero h1 { font-family: 'Montserrat', sans-serif; font-size: clamp(24px,4vw,40px); font-weight: 900; margin: 0 0 12px; letter-spacing: -1px; }
.store-hero h1 span { color: #FFD46B; }
.store-hero p { font-size: 15px; opacity: .85; margin: 0; font-family: 'Be Vietnam Pro', sans-serif; }

.sp-breadcrumb { background: #fff; border-bottom: 1px solid #e8e0d4; padding: 10px 0; font-size: 13px; color: #888; font-family: 'Be Vietnam Pro', sans-serif; }
.sp-breadcrumb .bc-inner { max-width: 1200px; margin: 0 auto; padding: 0 16px; display: flex; align-items: center; gap: 6px; }
.sp-breadcrumb a { color: #2D5535; text-decoration: none; }

.section-label { display: inline-flex; align-items: center; gap: 8px; background: #2D5535; color: #fff; font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 12px; font-family: 'Be Vietnam Pro', sans-serif; }
.section-title { font-family: 'Montserrat', sans-serif; font-size: clamp(20px,3vw,30px); font-weight: 900; color: #1E3D24; margin: 0 0 8px; }
.section-sub { color: #666; font-size: 14px; margin: 0 0 32px; font-family: 'Be Vietnam Pro', sans-serif; }

.maps-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 48px; }
@media (max-width: 768px) { .maps-grid { grid-template-columns: 1fr; } }

.branch-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.08); transition: transform .2s, box-shadow .2s; }
.branch-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,.13); }
.branch-head { background: linear-gradient(135deg, #2D5535 0%, #1E3D24 100%); color: #fff; padding: 20px 24px; }
.branch-num { display: inline-block; background: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.4); font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 20px; letter-spacing: .5px; margin-bottom: 8px; font-family: 'Be Vietnam Pro', sans-serif; }
.branch-name { font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 900; margin: 0 0 4px; }
.branch-district { font-size: 13px; opacity: .8; font-family: 'Be Vietnam Pro', sans-serif; }
.branch-map { width: 100%; height: 280px; display: block; border: none; background: #eee; }
.branch-info { padding: 20px 24px; font-family: 'Be Vietnam Pro', sans-serif; }
.info-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; font-size: 14px; color: #444; }
.info-icon { width: 32px; height: 32px; background: #F5EFE2; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; color: #2D5535; }
.info-label { font-weight: 700; color: #222; font-size: 12px; text-transform: uppercase; letter-spacing: .3px; display: block; margin-bottom: 2px; }
.info-val { color: #555; line-height: 1.5; }
.info-val a { color: #2D5535; text-decoration: none; font-weight: 600; }
.btn-directions { display: inline-flex; align-items: center; gap: 8px; background: #2D5535; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700; margin-top: 16px; transition: background .2s, transform .15s; font-family: 'Be Vietnam Pro', sans-serif; }
.btn-directions:hover { background: #1E3D24; transform: translateY(-1px); color: #fff; }
.btn-zalo { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: #2D5535; border: 2px solid #2D5535; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700; margin-top: 16px; margin-left: 8px; transition: all .2s; font-family: 'Be Vietnam Pro', sans-serif; }
.btn-zalo:hover { background: #2D5535; color: #fff; }

.info-strip { background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,.06); margin-bottom: 48px; }
.info-strip-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 768px) { .info-strip-grid { grid-template-columns: 1fr; } }
.isg-item { text-align: center; padding: 16px; font-family: 'Be Vietnam Pro', sans-serif; }
.isg-icon { font-size: 32px; margin-bottom: 12px; color: #2D5535; }
.isg-title { font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 800; color: #222; margin-bottom: 6px; }
.isg-text { font-size: 13px; color: #666; line-height: 1.6; }

.contact-cta { background: linear-gradient(135deg, #C44D28 0%, #a33d1e 100%); border-radius: 16px; padding: 40px 32px; text-align: center; color: #fff; margin-bottom: 48px; font-family: 'Be Vietnam Pro', sans-serif; }
.contact-cta h3 { font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 900; margin: 0 0 8px; }
.contact-cta p { opacity: .9; margin: 0 0 20px; font-size: 14px; }
.cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.cta-btn-white { display: inline-flex; align-items: center; gap: 8px; background: #fff; color: #C44D28; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 700; transition: transform .15s, box-shadow .15s; }
.cta-btn-white:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.2); color: #C44D28; }
.cta-btn-border { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: #fff; border: 2px solid rgba(255,255,255,.7); padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 700; transition: all .15s; }
.cta-btn-border:hover { background: rgba(255,255,255,.15); color: #fff; }

@media (max-width: 480px) {
  .store-hero { padding: 36px 16px; }
  .branch-info { padding: 16px; }
  .branch-head { padding: 16px; }
  .info-strip { padding: 20px 16px; }
  .contact-cta { padding: 28px 16px; }
}
</style>

<!-- HERO -->
<div class="store-hero">
  <h1><i class="fas fa-map-marker-alt" style="margin-right:10px;"></i>Hệ Thống <span>Cửa Hàng SiGon</span></h1>
  <p>Ghé thăm trực tiếp để ngắm hàng ngàn đôi giày real — tư vấn tận tình, không ép mua</p>
</div>

<!-- BREADCRUMB -->
<div class="sp-breadcrumb">
  <div class="bc-inner">
    <a href="<?php echo home_url('/'); ?>"><i class="fas fa-home"></i> Trang chủ</a>
    <i class="fas fa-chevron-right" style="font-size:10px;"></i>
    <span>Hệ thống cửa hàng</span>
  </div>
</div>

<!-- MAIN CONTENT -->
<div class="page-wrap" style="padding-top:40px;">

  <div style="text-align:center;margin-bottom:36px;">
    <span class="section-label"><i class="fas fa-store"></i> 2 Chi Nhánh</span>
    <h2 class="section-title">Tìm SiGon Gần Bạn</h2>
    <p class="section-sub">Hai cửa hàng tại TP.HCM — đều có giày secondhand real và giày mới đa dạng</p>
  </div>

  <div class="maps-grid">
    <!-- CHI NHÁNH 1 -->
    <div class="branch-card">
      <div class="branch-head">
        <span class="branch-num">CHI NHÁNH 1</span>
        <div class="branch-name">SiGon — Bình Thạnh</div>
        <div class="branch-district"><i class="fas fa-map-marker-alt"></i> Quận Bình Thạnh, TP.HCM</div>
      </div>
      <iframe class="branch-map"
        src="https://maps.google.com/maps?q=160+Dang+Thuy+Tram,+Binh+Loi+Trung,+Binh+Thanh,+Ho+Chi+Minh&hl=vi&t=&z=16&ie=UTF8&iwloc=&output=embed"
        loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"
        title="SiGon CN1 Bình Thạnh"></iframe>
      <div class="branch-info">
        <div class="info-row">
          <div class="info-icon"><i class="fas fa-map-marker-alt"></i></div>
          <div><span class="info-label">Địa chỉ</span><span class="info-val">160/11/19 Đặng Thuỳ Trâm, Bình Lợi Trung, Bình Thạnh, TP.HCM</span></div>
        </div>
        <div class="info-row">
          <div class="info-icon"><i class="fas fa-phone"></i></div>
          <div><span class="info-label">Hotline</span><span class="info-val"><a href="tel:0878627139">0878.627.139</a></span></div>
        </div>
        <div class="info-row">
          <div class="info-icon"><i class="fas fa-clock"></i></div>
          <div><span class="info-label">Giờ mở cửa</span><span class="info-val">8:00 – 21:00 · Mở cả thứ 7, Chủ nhật</span></div>
        </div>
        <div class="info-row">
          <div class="info-icon"><i class="fas fa-motorcycle"></i></div>
          <div><span class="info-label">Đường đến</span><span class="info-val">Gần ngã tư Đặng Thuỳ Trâm – Nguyễn Xí, hẻm bên tay phải</span></div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;">
          <a href="https://maps.google.com/maps?q=160+Dang+Thuy+Tram,+Binh+Thanh,+Ho+Chi+Minh" target="_blank" rel="noopener" class="btn-directions"><i class="fas fa-directions"></i> Chỉ đường</a>
          <a href="https://zalo.me/0878627139" target="_blank" rel="noopener" class="btn-zalo"><i class="fas fa-comment"></i> Nhắn Zalo</a>
        </div>
      </div>
    </div>

    <!-- CHI NHÁNH 2 -->
    <div class="branch-card">
      <div class="branch-head">
        <span class="branch-num">CHI NHÁNH 2</span>
        <div class="branch-name">SiGon — Tân Sơn Nhất</div>
        <div class="branch-district"><i class="fas fa-map-marker-alt"></i> Quận Tân Bình, TP.HCM</div>
      </div>
      <iframe class="branch-map"
        src="https://maps.google.com/maps?q=927+Cach+Mang+Thang+Tam,+Phuong+4,+Tan+Binh,+Ho+Chi+Minh&hl=vi&t=&z=16&ie=UTF8&iwloc=&output=embed"
        loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"
        title="SiGon CN2 Tân Bình"></iframe>
      <div class="branch-info">
        <div class="info-row">
          <div class="info-icon"><i class="fas fa-map-marker-alt"></i></div>
          <div><span class="info-label">Địa chỉ</span><span class="info-val">927/27B Cách Mạng Tháng 8, Phường 4, Tân Bình, TP.HCM</span></div>
        </div>
        <div class="info-row">
          <div class="info-icon"><i class="fas fa-phone"></i></div>
          <div><span class="info-label">Hotline</span><span class="info-val"><a href="tel:0878627139">0878.627.139</a></span></div>
        </div>
        <div class="info-row">
          <div class="info-icon"><i class="fas fa-clock"></i></div>
          <div><span class="info-label">Giờ mở cửa</span><span class="info-val">8:00 – 21:00 · Mở cả thứ 7, Chủ nhật</span></div>
        </div>
        <div class="info-row">
          <div class="info-icon"><i class="fas fa-plane"></i></div>
          <div><span class="info-label">Vị trí</span><span class="info-val">Gần sân bay Tân Sơn Nhất, CMT8 đoạn qua Tân Bình</span></div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;">
          <a href="https://maps.google.com/maps?q=927+Cach+Mang+Thang+Tam,+Tan+Binh,+Ho+Chi+Minh" target="_blank" rel="noopener" class="btn-directions"><i class="fas fa-directions"></i> Chỉ đường</a>
          <a href="https://zalo.me/0878627139" target="_blank" rel="noopener" class="btn-zalo"><i class="fas fa-comment"></i> Nhắn Zalo</a>
        </div>
      </div>
    </div>
  </div>

  <!-- INFO STRIP -->
  <div class="info-strip">
    <div class="info-strip-grid">
      <div class="isg-item">
        <div class="isg-icon"><i class="fas fa-clock"></i></div>
        <div class="isg-title">Giờ Mở Cửa</div>
        <div class="isg-text">Thứ 2 – Chủ Nhật<br><strong>8:00 – 21:00</strong><br>Không nghỉ lễ</div>
      </div>
      <div class="isg-item">
        <div class="isg-icon"><i class="fas fa-tags"></i></div>
        <div class="isg-title">Thử Hàng Trực Tiếp</div>
        <div class="isg-text">Xem thật, thử thật trước khi mua<br>Không cần đặt trước<br>Không ép mua, không áp lực</div>
      </div>
      <div class="isg-item">
        <div class="isg-icon"><i class="fas fa-exchange-alt"></i></div>
        <div class="isg-title">Đổi Trả Dễ Dàng</div>
        <div class="isg-text">Đổi size ngay tại cửa hàng<br>Hoàn tiền nếu không đúng mô tả<br>Cam kết hàng real 100%</div>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="contact-cta">
    <h3>Chưa chắc đến thẳng? Hỏi hàng trước đi!</h3>
    <p>Nhắn tin hoặc gọi điện — tụi mình tư vấn nhiệt tình, báo size tồn kho ngay</p>
    <div class="cta-buttons">
      <a href="tel:0878627139" class="cta-btn-white"><i class="fas fa-phone"></i> Gọi ngay: 0878.627.139</a>
      <a href="https://zalo.me/0878627139" target="_blank" rel="noopener" class="cta-btn-border"><i class="fas fa-comment-dots"></i> Chat Zalo</a>
      <a href="https://facebook.com/SigonSecondhand" target="_blank" rel="noopener" class="cta-btn-border"><i class="fab fa-facebook-messenger"></i> Nhắn Facebook</a>
    </div>
  </div>

</div><!-- /.page-wrap -->

<?php get_template_part('sigon-shared-footer'); ?>
<?php get_footer(); ?>

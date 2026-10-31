<?php
/**
 * SiGon — Shared Footer Partial
 * Dùng chung: footer với 4 cột + bottom bar
 * Sử dụng: get_template_part('template-parts/sigon-footer')
 */
?>
<style>
/* ===== SIGON SHARED FOOTER STYLES ===== */
.sigon-site-footer {
  background: #1E3D24;
  color: #F5EFE2;
  padding: 48px 0 24px;
  font-family: 'Be Vietnam Pro', sans-serif;
}
.sigon-site-footer .footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
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
.sigon-footer-bottom-links a,
.sigon-footer-bottom a {
  color: rgba(245,239,226,0.5);
  text-decoration: none;
}
.sigon-footer-bottom-links a:hover { color: #F5EFE2; }
.sigon-site-footer a { color: rgba(245,239,226,0.75); text-decoration: none; }
.sigon-site-footer a:hover { color: #F5EFE2; }
.footer-col-title {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #F5EFE2;
}
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
}
.footer-links li { margin-bottom: 8px; }
.footer-social {
  display: flex;
  gap: 12px;
  font-size: 20px;
  margin-top: 16px;
}
.footer-social a {
  color: rgba(245,239,226,0.75);
}
.footer-social a:hover { color: #F5EFE2; }
@media (max-width: 1023px) {
  .sigon-footer-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
}
@media (max-width: 767px) {
  .sigon-footer-grid { grid-template-columns: 1fr; gap: 20px; }
  .sigon-footer-bottom { flex-direction: column; text-align: center; gap: 8px; }
  .sigon-footer-bottom-links { justify-content: center; }
}
</style>

<footer class="sigon-site-footer">
  <div class="footer-inner">
    <div class="sigon-footer-grid">

      <!-- Col 1: Brand -->
      <div>
        <div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:28px;color:#fff;margin-bottom:2px;line-height:1;">
          <span style="color:#C44D28;">Si</span>Gon
        </div>
        <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;color:#C44D28;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;">SPORT</div>
        <div style="font-style:italic;color:rgba(245,239,226,0.7);margin-bottom:16px;font-size:14px;">Giày Real — Giá Hời — Chất Sài Gòn</div>
        <div style="font-size:13px;color:rgba(245,239,226,0.8);line-height:1.8;">
          <div>📍 CN1: 160/11/19 Đặng Thuỳ Trâm, Bình Lợi Trung, Bình Thạnh</div>
          <div>📍 CN2: 927/27B CMT8, Phường 4, Tân Bình</div>
          <div>📞 <a href="tel:0878627139" style="color:rgba(245,239,226,0.8);">0878.627.139</a></div>
          <div>✉️ <a href="mailto:sigonseconhand@gmail.com" style="color:rgba(245,239,226,0.8);">sigonseconhand@gmail.com</a></div>
        </div>
        <div class="footer-social">
          <a href="https://facebook.com/SigonSecondhand" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
          <a href="https://instagram.com/sigonsecondhand" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="https://tiktok.com/@sigonsecondhand" target="_blank" rel="noopener" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
        </div>
      </div>

      <!-- Col 2: Danh Mục -->
      <div>
        <div class="footer-col-title">Danh Mục</div>
        <ul class="footer-links">
          <li><a href="<?php echo home_url('/loai-hang/2hand-real/'); ?>">♻️ Giày Secondhand</a></li>
          <li><a href="<?php echo home_url('/product-category/giay-bong-da/'); ?>">⚽ Giày Bóng Đá</a></li>
          <li><a href="<?php echo home_url('/product-category/giay-cau-long/'); ?>">🏸 Giày Cầu Lông</a></li>
          <li><a href="<?php echo home_url('/product-category/giay-tennis/'); ?>">🎾 Giày Tennis</a></li>
          <li><a href="<?php echo home_url('/product-category/giay-pickleball/'); ?>">🏓 Giày Pickleball</a></li>
          <li><a href="<?php echo home_url('/product-category/vot-the-thao/'); ?>">🎯 Vợt thể thao</a></li>
        </ul>
      </div>

      <!-- Col 3: Hỗ Trợ -->
      <div>
        <div class="footer-col-title">Hỗ Trợ</div>
        <ul class="footer-links">
          <li><a href="<?php echo home_url('/he-thong-cua-hang/'); ?>">🏪 Cửa hàng</a></li>
          <?php if (function_exists('wc_get_account_endpoint_url')): ?>
          <li><a href="<?php echo wc_get_account_endpoint_url('orders'); ?>">Theo dõi đơn hàng</a></li>
          <li><a href="<?php echo wc_get_account_endpoint_url('dashboard'); ?>">Tài khoản của tôi</a></li>
          <?php endif; ?>
          <li><a href="<?php echo home_url('/gioi-thieu/'); ?>">Giới thiệu SiGon</a></li>
          <li><a href="<?php echo home_url('/lien-he/'); ?>">Liên hệ</a></li>
          <li><a href="<?php echo home_url('/tin-tuc/'); ?>">Tin tức & Blog</a></li>
        </ul>
      </div>

      <!-- Col 4: Chính Sách -->
      <div>
        <div class="footer-col-title">Chính Sách</div>
        <ul class="footer-links">
          <li><a href="<?php echo home_url('/chinh-sach-doi-tra/'); ?>">Chính sách đổi trả</a></li>
          <li><a href="<?php echo home_url('/chinh-sach-van-chuyen/'); ?>">Chính sách vận chuyển</a></li>
          <li><a href="<?php echo home_url('/chinh-sach-bao-mat/'); ?>">Chính sách bảo mật</a></li>
          <li><a href="<?php echo home_url('/dieu-khoan-su-dung/'); ?>">Điều khoản sử dụng</a></li>
          <li><a href="<?php echo home_url('/huong-dan-mua-hang/'); ?>">Hướng dẫn mua hàng</a></li>
          <li><a href="<?php echo home_url('/phuong-thuc-thanh-toan/'); ?>">Phương thức thanh toán</a></li>
        </ul>
      </div>

    </div>
    <div class="sigon-footer-bottom">
      <div>© <?php echo date('Y'); ?> SiGon (sigon.vn) — Giày Real · Giá Hời · Chất Sài Gòn</div>
      <div class="sigon-footer-bottom-links">
        <a href="<?php echo home_url('/chinh-sach-bao-mat/'); ?>">Bảo mật</a>
        <a href="<?php echo home_url('/dieu-khoan-su-dung/'); ?>">Điều khoản</a>
        <a href="<?php echo home_url('/chinh-sach-doi-tra/'); ?>">Đổi trả</a>
      </div>
    </div>
  </div>
</footer>

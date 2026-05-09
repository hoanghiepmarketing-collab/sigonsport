'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__top">
          {/* Cột 1: Logo & Thông tin */}
          <div>
            <div className="footer__brand-logo">
              SIGON<span> SPORT</span>
            </div>
            <p className="footer__desc">
              Chuyên cung cấp giày thể thao, vợt và dụng cụ tập luyện chính hãng cho thị trường Việt Nam.
              <em> Năng động mỗi ngày — Chất lượng mỗi bước.</em>
            </p>
            <div className="footer__contact-item">
              <i className="fa fa-map-marker-alt"></i>
              <span>123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
            </div>
            <div className="footer__contact-item">
              <i className="fa fa-phone"></i>
              <span><a href="tel:0901234567">0901.234.567</a></span>
            </div>
            <div className="footer__contact-item">
              <i className="fa fa-envelope"></i>
              <span><a href="mailto:info@sigonsport.vn">info@sigonsport.vn</a></span>
            </div>
            <div className="footer__contact-item">
              <i className="fa fa-clock"></i>
              <span>Thứ 2 – Chủ nhật: 8:00 – 21:00</span>
            </div>
            <div className="footer__social">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          {/* Cột 2: Danh mục */}
          <div>
            <div className="footer__col-title">Danh Mục</div>
            <div className="footer__links">
              <Link href="/products?sport=bong-da">Giày Bóng Đá</Link>
              <Link href="/products?sport=cau-long">Vợt Cầu Lông</Link>
              <Link href="/products?sport=tennis">Vợt Tennis</Link>
              <Link href="/products?sport=pickleball">Vợt Pickleball</Link>
              <Link href="/products?secondhand=true">Giày Secondhand ♻</Link>
              <Link href="/products">Tất Cả Sản Phẩm</Link>
            </div>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <div className="footer__col-title">Hỗ Trợ</div>
            <div className="footer__links">
              <Link href="/about">Giới thiệu</Link>
              <Link href="/contact">Liên hệ</Link>
              <Link href="/chinh-sach-doi-tra">Chính sách đổi trả</Link>
              <a href="#">Chính sách vận chuyển</a>
              <a href="#">Hướng dẫn chọn size</a>
              <a href="#">Câu hỏi thường gặp</a>
            </div>
          </div>

          {/* Cột 4: Thương hiệu */}
          <div>
            <div className="footer__col-title">Thương Hiệu</div>
            <div className="footer__links">
              <a href="#">Nike</a>
              <a href="#">Adidas</a>
              <a href="#">Puma</a>
              <a href="#">Yonex</a>
              <a href="#">Victor</a>
              <a href="#">Wilson</a>
              <a href="#">Babolat</a>
              <a href="#">Mizuno</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2024 SIGON SPORT. Bảo lưu mọi quyền. MST: 0123456789
          </p>
          <div className="footer__payment">
            <span className="footer__payment-icon">VISA</span>
            <span className="footer__payment-icon">MasterCard</span>
            <span className="footer__payment-icon">MoMo</span>
            <span className="footer__payment-icon">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

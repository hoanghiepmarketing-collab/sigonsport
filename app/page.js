'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import supabase from '../lib/supabase';

// Dữ liệu slider — SiGon Secondhand brand voice
const SLIDES = [
  {
    label: '✌️ GIÀY TUYỂN — GIÁ NGON — CHẤT SÀI GÒN',
    title: '2Hand Real',
    titleHighlight: 'Chính Hãng Auth',
    desc: 'Săn giày xịn không cần vét ví — ảnh thật 100%, tình trạng thật, giá thật.',
    slogan: 'Giày tuyển giá ngon',
    bg: 'linear-gradient(135deg, #1E3D24 0%, #2D5535 60%, #3a6b44 100%)',
    link: '/products?secondhand=true',
    cta: '👟 Săn giày ngay',
  },
  {
    label: '⚡ DEAL NGON — NHANH TAY KẺO HẾT',
    title: 'Flash Sale',
    titleHighlight: 'Giảm Đến 70%',
    desc: 'Hời cực — số lượng có hạn, hôm nay mà bỏ lỡ thì tiếc lắm đó!',
    slogan: 'Giày tuyển giá ngon',
    bg: 'linear-gradient(135deg, #3d1a0a 0%, #C44D28 60%, #a03820 100%)',
    link: '/products?sort=discount',
    cta: '🔥 Xem Flash Sale',
  },
  {
    label: '♻ 2HAND REAL — MINH BẠCH TÌNH TRẠNG',
    title: 'Giày Secondhand',
    titleHighlight: 'Tiết Kiệm Đến 80%',
    desc: 'Hàng auth tuyển chọn — ghi rõ tình trạng, ảnh góc thật, không tô hồng.',
    slogan: 'Giày tuyển giá ngon',
    bg: 'linear-gradient(135deg, #1a2e1a 0%, #2D5535 40%, #8B5E3C 100%)',
    link: '/products?secondhand=true',
    cta: '♻ Xem Secondhand',
  },
];

const BRANDS = ['Nike', 'Adidas', 'Puma', 'Onitsuka Tiger', 'Yonex', 'Victor', 'Wilson', 'Babolat', 'Mizuno', 'Joma'];

const CATEGORIES = [
  { icon: '⚽', label: 'Giày Bóng Đá', href: '/products?sport=bong-da', color: '#2D5535' },
  { icon: '🏸', label: 'Cầu Lông', href: '/products?sport=cau-long', color: '#2D5535' },
  { icon: '🎾', label: 'Tennis', href: '/products?sport=tennis', color: '#2D5535' },
  { icon: '🏓', label: 'Pickleball', href: '/products?sport=pickleball', color: '#2D5535' },
  { icon: '👟', label: 'Sneaker', href: '/products?sport=sneaker', color: '#C44D28' },
  { icon: '♻', label: '2Hand Real', href: '/products?secondhand=true', color: '#8B5E3C', isSecondhand: true },
];

const SPORT_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'bong-da', label: '⚽ Bóng Đá' },
  { key: 'cau-long', label: '🏸 Cầu Lông' },
  { key: 'tennis', label: '🎾 Tennis' },
  { key: 'pickleball', label: '🏓 Pickleball' },
];

const BLOG_POSTS = [
  {
    cat: 'Hướng dẫn',
    title: 'Cách chọn giày đá bóng phù hợp với loại sân',
    excerpt: 'FG, TF hay IC — mỗi loại sân cần một đế giày khác nhau. Bài viết này giúp bạn chọn đúng.',
    img: 'https://placehold.co/400x220/f0f4ff/0057FF?text=Blog+1',
    date: '12/05/2024',
  },
  {
    cat: 'Kinh nghiệm',
    title: 'Top 5 vợt cầu lông tốt nhất cho người mới bắt đầu',
    excerpt: 'Không cần bỏ quá nhiều tiền cho vợt xịn khi mới chơi — đây là những lựa chọn phù hợp nhất.',
    img: 'https://placehold.co/400x220/fff0f0/E5002B?text=Blog+2',
    date: '05/05/2024',
  },
  {
    cat: 'Secondhand',
    title: 'Mua giày secondhand — Những điều cần kiểm tra',
    excerpt: 'Mua giày cũ tiết kiệm tốt nếu biết cách kiểm tra. Hãy chú ý những điểm này trước khi quyết định.',
    img: 'https://placehold.co/400x220/fdf8ee/8B6914?text=Blog+3',
    date: '28/04/2024',
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hotProducts, setHotProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [secondhandProducts, setSecondhandProducts] = useState([]);
  const [activeSportTab, setActiveSportTab] = useState('all');
  const [countdown, setCountdown] = useState({ h: '05', m: '59', s: '59' });
  const [loadingHot, setLoadingHot] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Slider auto-play
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(autoPlayRef.current);
  }, []);

  // Countdown flash sale
  useEffect(() => {
    let totalSeconds = 5 * 3600 + 59 * 60 + 59;
    const timer = setInterval(() => {
      totalSeconds -= 1;
      if (totalSeconds < 0) totalSeconds = 5 * 3600 + 59 * 60 + 59;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      setCountdown({
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch hot products
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_hot', true)
        .eq('in_stock', true)
        .limit(8);
      setHotProducts(data || []);
      setLoadingHot(false);
    })();
  }, []);

  // Fetch new/filtered products
  useEffect(() => {
    (async () => {
      setLoadingNew(true);
      let query = supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .eq('is_secondhand', false);

      if (activeSportTab !== 'all') {
        query = query.eq('sport', activeSportTab);
      }

      const { data } = await query.order('created_at', { ascending: false }).limit(8);
      setNewProducts(data || []);
      setLoadingNew(false);
    })();
  }, [activeSportTab]);

  // Fetch secondhand products
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_secondhand', true)
        .eq('in_stock', true)
        .limit(4);
      setSecondhandProducts(data || []);
    })();
  }, []);

  function goToSlide(index) {
    clearInterval(autoPlayRef.current);
    setCurrentSlide(index);
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
  }

  return (
    <>
      <Header />
      <main>
        {/* ===== HERO SLIDER ===== */}
        <section className="hero-slider" aria-label="Banner quảng cáo">
          <div
            className="slider__track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {SLIDES.map((slide, i) => (
              <div key={i} className="slider__slide">
                <div style={{ width: '100%', height: '100%', background: slide.bg }} />
                <div className="slider__slide-content">
                  <span className="slide__label">{slide.label}</span>
                  <h1 className="slide__title">
                    {slide.title} <span>{slide.titleHighlight}</span>
                  </h1>
                  <p className="slide__desc">{slide.desc}</p>
                  <p className="slide__slogan">
                    <span style={{ color: '#E8650A', fontWeight: 800 }}>Si</span>
                    <span style={{ color: '#ffffff', fontWeight: 800 }}>Gon</span>
                    <span style={{ color: '#F5C518', margin: '0 6px' }}>✦</span>
                    {slide.slogan.split('—').slice(1).join('—')}
                  </p>
                  <Link href={slide.link} className="btn btn-primary">
                    {slide.cta} <i className="fa fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <button
            className="slider__prev"
            onClick={() => goToSlide((currentSlide - 1 + SLIDES.length) % SLIDES.length)}
            aria-label="Slide trước"
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <button
            className="slider__next"
            onClick={() => goToSlide((currentSlide + 1) % SLIDES.length)}
            aria-label="Slide sau"
          >
            <i className="fa fa-chevron-right"></i>
          </button>

          <div className="slider__dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`slider__dot${i === currentSlide ? ' active' : ''}`}
                onClick={() => goToSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ===== BRAND STRIP ===== */}
        <div className="brand-strip">
          <div className="container">
            <div className="brand-strip__inner">
              {BRANDS.map((brand) => (
                <Link key={brand} href={`/products?brand=${brand.toLowerCase()}`} className="brand-item">
                  <span className="brand-item__name">{brand}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ===== FLASH SALE ===== */}
        <section className="home-section home-section--white">
          <div className="container">
            <div className="flash-sale-header">
              <div className="flash-sale-left">
                <div className="flash-sale-title">
                  <i className="fa fa-bolt"></i> Flash Sale
                </div>
                <div className="countdown" aria-label="Thời gian còn lại">
                  <div className="countdown-block">
                    <span className="countdown-block__num">{countdown.h}</span>
                    <span className="countdown-block__label">giờ</span>
                  </div>
                  <span className="countdown-sep">:</span>
                  <div className="countdown-block">
                    <span className="countdown-block__num">{countdown.m}</span>
                    <span className="countdown-block__label">phút</span>
                  </div>
                  <span className="countdown-sep">:</span>
                  <div className="countdown-block">
                    <span className="countdown-block__num">{countdown.s}</span>
                    <span className="countdown-block__label">giây</span>
                  </div>
                </div>
              </div>
              <Link href="/products?sort=discount" className="section-more">
                Xem tất cả <i className="fa fa-chevron-right"></i>
              </Link>
            </div>

            {loadingHot ? (
              <div className="product-grid product-grid--4col">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="product-card">
                    <div className="skeleton" style={{ aspectRatio: '1', width: '100%' }}></div>
                    <div style={{ padding: 10 }}>
                      <div className="skeleton" style={{ height: 12, marginBottom: 8, width: '60%' }}></div>
                      <div className="skeleton" style={{ height: 16, marginBottom: 8 }}></div>
                      <div className="skeleton" style={{ height: 20, width: '40%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : hotProducts.length > 0 ? (
              <div className="product-grid product-grid--4col">
                {hotProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0' }}>
                Chưa có sản phẩm flash sale. Hãy seed dữ liệu trong Admin.
              </p>
            )}
          </div>
        </section>

        {/* ===== DANH MỤC NỔI BẬT ===== */}
        <section className="home-section home-section--gray">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-icon"><i className="fa fa-th-large"></i></span>
                Danh Mục Nổi Bật
              </h2>
            </div>
            <div className="category-grid">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className={`category-card${cat.isSecondhand ? ' category-card--secondhand' : ''}`}
                >
                  <div className="category-card__icon" style={{ fontSize: 30 }}>
                    {cat.icon}
                  </div>
                  <span className="category-card__name">{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SẢN PHẨM MỚI NHẤT ===== */}
        <section className="home-section home-section--white">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-icon"><i className="fa fa-star"></i></span>
                Sản Phẩm Mới Nhất
              </h2>
              <Link href="/products" className="section-more">
                Xem tất cả <i className="fa fa-chevron-right"></i>
              </Link>
            </div>

            {/* Sport tabs */}
            <div className="sport-tabs">
              {SPORT_TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`sport-tab${activeSportTab === tab.key ? ' active' : ''}`}
                  onClick={() => setActiveSportTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {loadingNew ? (
              <div className="product-grid product-grid--4col">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="product-card">
                    <div className="skeleton" style={{ aspectRatio: '1', width: '100%' }}></div>
                    <div style={{ padding: 10 }}>
                      <div className="skeleton" style={{ height: 12, marginBottom: 8, width: '60%' }}></div>
                      <div className="skeleton" style={{ height: 16, marginBottom: 8 }}></div>
                      <div className="skeleton" style={{ height: 20, width: '40%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : newProducts.length > 0 ? (
              <div className="product-grid product-grid--4col">
                {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="products-empty">
                <i className="fa fa-box-open"></i>
                <p>Chưa có sản phẩm</p>
              </div>
            )}

            <div className="view-all-wrap">
              <Link href="/products" className="btn btn-outline">
                <i className="fa fa-th-large"></i> Xem tất cả sản phẩm
              </Link>
            </div>
          </div>
        </section>

        {/* ===== PROMO BANNERS ===== */}
        <section className="home-section home-section--gray">
          <div className="container">
            <div className="promo-banners">
              <Link href="/products?sport=bong-da" className="promo-banner promo-banner--1">
                <div className="promo-banner__content">
                  <span className="promo-banner__label">Bộ sưu tập mới</span>
                  <h3 className="promo-banner__title">Giày Bóng Đá Nike 2024</h3>
                  <span className="promo-banner__cta">Xem ngay <i className="fa fa-arrow-right"></i></span>
                </div>
              </Link>
              <Link href="/products?sport=cau-long" className="promo-banner promo-banner--2">
                <div className="promo-banner__content">
                  <span className="promo-banner__label">Ưu đãi đặc biệt</span>
                  <h3 className="promo-banner__title">Vợt Cầu Lông Yonex Giảm 20%</h3>
                  <span className="promo-banner__cta">Mua ngay <i className="fa fa-arrow-right"></i></span>
                </div>
              </Link>
              <Link href="/products?secondhand=true" className="promo-banner promo-banner--3">
                <div className="promo-banner__content">
                  <span className="promo-banner__label">Secondhand chính hãng</span>
                  <h3 className="promo-banner__title">Tiết Kiệm Đến 80% Với Hàng 2nd</h3>
                  <span className="promo-banner__cta">Khám phá <i className="fa fa-arrow-right"></i></span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== SECONDHAND SECTION ===== */}
        <section className="home-section home-section--white">
          <div className="container">
            <div style={{ marginBottom: 20 }}>
              <div className="secondhand-banner">
                <div className="secondhand-banner__text">
                  <h3>♻ Khu Hàng Secondhand</h3>
                  <p>Giày thể thao chính hãng đã qua sử dụng — kiểm định kỹ lưỡng, giá cực tốt</p>
                </div>
                <Link href="/products?secondhand=true" className="btn" style={{ background: '#FFD46B', color: '#1a1000', whiteSpace: 'nowrap' }}>
                  Xem tất cả <i className="fa fa-arrow-right"></i>
                </Link>
              </div>
            </div>

            {secondhandProducts.length > 0 && (
              <div className="product-grid product-grid--4col">
                {secondhandProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </section>

        {/* ===== BLOG ===== */}
        <section className="home-section home-section--gray">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-icon"><i className="fa fa-newspaper"></i></span>
                Tin Tức & Kinh Nghiệm
              </h2>
              <a href="#" className="section-more">
                Xem tất cả <i className="fa fa-chevron-right"></i>
              </a>
            </div>
            <div className="blog-grid">
              {BLOG_POSTS.map((post) => (
                <article key={post.title} className="blog-card">
                  <div className="blog-card__img">
                    <img src={post.img} alt={post.title} loading="lazy" />
                  </div>
                  <div className="blog-card__body">
                    <span className="blog-card__cat">{post.cat}</span>
                    <h3 className="blog-card__title">{post.title}</h3>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <div className="blog-card__meta">
                      <span><i className="fa fa-calendar"></i> {post.date}</span>
                      <a href="#" style={{ color: 'var(--color-primary)' }}>Đọc thêm →</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Back to top */}
      <BackToTop />

      <Footer />
    </>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      className={`back-to-top${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Lên đầu trang"
    >
      <i className="fa fa-arrow-up"></i>
    </button>
  );
}

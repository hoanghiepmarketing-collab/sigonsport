import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Chính Sách Giao Hàng | SIGON SPORT',
  description: 'Chính sách giao hàng tại SIGON SPORT — Phạm vi, thời gian, phí vận chuyển và quy định nhận hàng toàn quốc.',
};

const TABLE_ROWS = [
  { area: 'Nội thành TP. Hồ Chí Minh', fee: '25.000đ' },
  { area: 'Ngoại thành TP. Hồ Chí Minh', fee: '35.000đ' },
  { area: 'Các tỉnh thành khác', fee: '40.000đ' },
  { area: 'Đơn hàng từ 1.000.000đ', fee: 'MIỄN PHÍ 🎉', highlight: true },
];

export default function ChinhSachGiaoHangPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #0a0a2e, #0057FF)', color: 'white', padding: '56px 0 48px', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(26px, 5vw, 44px)', fontWeight: 900, marginBottom: 12, letterSpacing: '-0.5px' }}>
              CHÍNH SÁCH GIAO HÀNG — <span style={{ color: '#FFD700' }}>SIGON</span>
            </h1>
            <p style={{ fontSize: 15, opacity: 0.8, maxWidth: 560, margin: '0 auto' }}>
              Giao hàng tận nơi toàn quốc — Nhanh chóng, an toàn, đáng tin cậy
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '10px 0' }}>
          <div className="container">
            <nav style={{ fontSize: 13, color: '#94a3b8' }}>
              <a href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Trang chủ</a>
              <span style={{ margin: '0 6px' }}>›</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>Chính sách giao hàng</span>
            </nav>
          </div>
        </div>

        <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 16px 64px' }}>

          {/* TOC */}
          <nav style={{ background: '#f0f6ff', border: '1px solid #c7dcff', borderRadius: 12, padding: '20px 24px', marginBottom: 40 }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 14, color: '#0057FF', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 12 }}>
              <i className="fas fa-list-ul" style={{ marginRight: 7 }}></i>Mục lục nội dung
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                { href: '#pham-vi',    icon: 'fa-truck',          color: '#0057FF', label: 'Phạm vi giao hàng' },
                { href: '#thoi-gian',  icon: 'fa-clock',          color: '#ea580c', label: 'Thời gian giao hàng' },
                { href: '#phi',        icon: 'fa-coins',          color: '#16a34a', label: 'Phí giao hàng' },
                { href: '#quy-dinh',   icon: 'fa-clipboard-list', color: '#7c3aed', label: 'Quy định chung' },
                { href: '#nhan-hang',  icon: 'fa-box-open',       color: '#0057FF', label: 'Khi nhận hàng' },
                { href: '#tra-cuu',    icon: 'fa-magnifying-glass',color: '#475569', label: 'Kiểm tra đơn hàng' },
              ].map(item => (
                <li key={item.href}>
                  <a href={item.href} style={{ fontSize: 14, color: '#1e40af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className={`fas ${item.icon}`} style={{ color: item.color, width: 16 }}></i>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* 1. Phạm vi */}
          <Section id="pham-vi" title="🚚 Phạm vi giao hàng" color="#0057FF">
            <p>Sigon hỗ trợ <strong>giao hàng tận nơi toàn quốc</strong>, áp dụng cho tất cả đơn hàng đặt qua Website, Fanpage, Zalo hoặc mua trực tiếp tại cửa hàng.</p>
          </Section>

          {/* 2. Thời gian */}
          <Section id="thoi-gian" title="⏱️ Thời gian giao hàng" color="#ea580c">
            <SubTitle icon="fa-location-dot" color="#ea580c">Nội thành & ngoại thành TP. Hồ Chí Minh</SubTitle>
            <CondList items={[
              { type: 'ok', text: <>Đơn hàng đặt <strong>trước 11h00</strong> → giao trong <strong>buổi chiều cùng ngày</strong></> },
              { type: 'ok', text: <>Đơn hàng đặt <strong>sau 11h30</strong> → giao <strong>hôm sau</strong></> },
            ]} />

            <SubTitle icon="fa-map" color="#ea580c" mt>Các tỉnh thành khác</SubTitle>
            <CondList items={[
              { type: 'dot', text: <>Khu vực trung tâm tỉnh/thành phố: <strong>2–3 ngày</strong></> },
              { type: 'dot', text: <>Khu vực ngoại thành, huyện, xã, thị trấn: <strong>3–7 ngày</strong></> },
            ]} />

            <HighlightBox>
              <i className="fas fa-triangle-exclamation" style={{ marginRight: 6 }}></i>
              Thời gian giao hàng không tính <strong>thứ Bảy, Chủ Nhật và các ngày lễ, Tết</strong>.
            </HighlightBox>
          </Section>

          {/* Ưu đãi nổi bật */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 40 }}>
            <div style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: 12, padding: '20px 20px', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🚚</div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 18, marginBottom: 6 }}>MIỄN PHÍ VẬN CHUYỂN</div>
              <div style={{ fontSize: 13, opacity: .9, lineHeight: 1.5 }}>Cho đơn hàng từ <strong style={{ fontSize: 16 }}>1.000.000đ</strong> trở lên — áp dụng toàn quốc</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)', borderRadius: 12, padding: '20px 20px', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🧦</div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 18, marginBottom: 6 }}>TẶNG TẤT THỂ THAO</div>
              <div style={{ fontSize: 13, opacity: .9, lineHeight: 1.5 }}>Miễn phí 1 đôi tất cho đơn hàng từ <strong style={{ fontSize: 16 }}>500.000đ</strong> trở lên</div>
            </div>
          </div>

          {/* 3. Phí */}
          <Section id="phi" title="💰 Phí giao hàng" color="#16a34a">
            <div style={{ overflowX: 'auto', marginTop: 4 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f0fdf4' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #bbf7d0' }}>Khu vực / Điều kiện</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #bbf7d0' }}>Phí vận chuyển</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((row, i) => (
                    <tr key={i} style={{ background: row.highlight ? '#f0fdf4' : i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                      <td style={{ padding: '11px 16px', color: row.highlight ? '#166534' : '#374151', fontWeight: row.highlight ? 700 : 400, borderBottom: '1px solid #e2e8f0' }}>
                        {row.highlight && <i className="fas fa-star" style={{ color: '#16a34a', marginRight: 6 }}></i>}
                        {row.area}
                      </td>
                      <td style={{ padding: '11px 16px', textAlign: 'right', fontWeight: 700, color: row.highlight ? '#16a34a' : '#374151', borderBottom: '1px solid #e2e8f0' }}>{row.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <HighlightBox color="green">
              <i className="fas fa-gift" style={{ marginRight: 6 }}></i>
              <strong>Tặng thêm:</strong> Đơn từ <strong>500.000đ</strong> trở lên được tặng <strong>1 đôi tất thể thao</strong> miễn phí — áp dụng tự động, không cần nhập mã.
            </HighlightBox>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
              <i className="fas fa-circle-info" style={{ marginRight: 5 }}></i>
              Phí vận chuyển có thể thay đổi tùy theo đơn vị vận chuyển.
            </p>
          </Section>

          {/* 4. Quy định chung */}
          <Section id="quy-dinh" title="📋 Quy định chung" color="#7c3aed">
            <CondList items={[
              { type: 'dot', text: <>Thời gian xử lý đơn hàng được tính từ khi <strong>nhận được thanh toán hoàn tất</strong> <em>(bao gồm tiền cọc 100.000đ với đơn online)</em></> },
              { type: 'dot', text: <>Đơn hàng sẽ được giao tối đa <strong>2 lần</strong>. Nếu lần đầu không thành công, Sigon sẽ liên hệ để sắp xếp lịch giao lần 2. Nếu vẫn không liên lạc được, <strong>đơn hàng sẽ không còn hiệu lực</strong></> },
              { type: 'dot', text: <>Có thể <strong>điều chỉnh thời gian giao hàng</strong> theo yêu cầu của khách</> },
            ]} />
          </Section>

          {/* 5. Khi nhận hàng */}
          <Section id="nhan-hang" title="📦 Khi nhận hàng" color="#0057FF">
            <CondList items={[
              { type: 'ok', text: <>Vui lòng <strong>kiểm tra kỹ</strong> số lượng và tình trạng sản phẩm <strong>trước khi ký xác nhận</strong> với nhân viên giao hàng</> },
              { type: 'ok', text: <>Nếu phát hiện sai sót, vui lòng <strong>liên hệ Sigon ngay</strong> để được hỗ trợ kịp thời</> },
              { type: 'ok', text: <><strong>Giữ lại hoá đơn mua hàng và biên lai vận chuyển</strong> — đây là điều kiện bắt buộc nếu cần đổi hàng hoặc hỗ trợ sau mua</> },
            ]} />
          </Section>

          {/* 6. Tra cứu */}
          <Section id="tra-cuu" title="🔍 Kiểm tra đơn hàng" color="#475569">
            <p>Để tra cứu tình trạng đơn hàng, vui lòng liên hệ Sigon qua <strong>Facebook / Instagram / Zalo</strong> và cung cấp <strong>họ tên + số điện thoại</strong> để được hỗ trợ nhanh nhất.</p>
          </Section>

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg, #0057FF, #7c3aed)', borderRadius: 12, padding: '28px 24px', textAlign: 'center', color: 'white', marginTop: 40 }}>
            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Cần hỗ trợ thêm?</h3>
            <p style={{ fontSize: 14, opacity: .85, marginBottom: 16 }}>
              Sigon cam kết mang đến trải nghiệm mua sắm thuận tiện và đáng tin cậy. Cảm ơn bạn đã tin tưởng Sigon! 🙏
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10 }}>
              {[
                { href: 'https://facebook.com/sigonsport', icon: 'fab fa-facebook', label: 'Facebook' },
                { href: 'https://instagram.com/sigonsport', icon: 'fab fa-instagram', label: 'Instagram' },
                { href: 'https://zalo.me/sigonsport', icon: 'fas fa-comment-dots', label: 'Zalo' },
                { href: '/contact', icon: 'fas fa-envelope', label: 'Liên hệ' },
              ].map(c => (
                <a key={c.href} href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: 'rgba(255,255,255,.15)', border: '1.5px solid rgba(255,255,255,.35)', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  <i className={c.icon}></i> {c.label}
                </a>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

/* ── Sub-components ── */
function Section({ id, title, color, children }) {
  return (
    <section id={id} style={{ marginBottom: 40, scrollMarginTop: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: color, color: 'white', padding: '14px 20px', borderRadius: '10px 10px 0 0', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 16 }}>
        {title}
      </div>
      <div style={{ border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '20px 24px', background: '#fff' }}>
        {children}
      </div>
    </section>
  );
}

function SubTitle({ icon, color, children, mt }) {
  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 700, color: '#0f172a', marginTop: mt ? 16 : 0, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 7 }}>
      <i className={`fas ${icon}`} style={{ color }}></i> {children}
    </div>
  );
}

function CondList({ items }) {
  const styles = {
    ok:  { bg: '#dcfce7', color: '#16a34a', icon: 'fa-check' },
    no:  { bg: '#fee2e2', color: '#dc2626', icon: 'fa-xmark' },
    dot: { bg: '#e0f2fe', color: '#0369a1', icon: 'fa-circle-info' },
  };
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => {
        const s = styles[item.type];
        return (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#374151', lineHeight: 1.65 }}>
            <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, marginTop: 2 }}>
              <i className={`fas ${s.icon}`}></i>
            </span>
            <span>{item.text}</span>
          </li>
        );
      })}
    </ul>
  );
}

function HighlightBox({ children, color }) {
  const themes = {
    yellow: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
    green:  { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' },
    blue:   { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
  };
  const t = themes[color] || themes.yellow;
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '12px 16px', fontSize: 13, color: t.text, lineHeight: 1.65, marginTop: 12 }}>
      {children}
    </div>
  );
}

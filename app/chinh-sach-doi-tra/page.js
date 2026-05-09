import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Chính Sách Đổi Trả | SIGON SPORT',
  description: 'Chính sách đổi trả hàng tại SIGON SPORT — Điều kiện đổi trả, hoàn tiền, keo giày miễn phí cho cả mua online và offline.',
};

export default function ChinhSachDoiTraPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0a2e, #0057FF)',
          color: 'white',
          padding: '56px 0 48px',
          textAlign: 'center',
        }}>
          <div className="container">
            <h1 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(26px, 5vw, 44px)',
              fontWeight: 900,
              marginBottom: 12,
              letterSpacing: '-0.5px',
            }}>
              CHÍNH SÁCH ĐỔI TRẢ — <span style={{ color: '#FFD700' }}>SIGON</span>
            </h1>
            <p style={{ fontSize: 15, opacity: 0.8, maxWidth: 560, margin: '0 auto' }}>
              Cam kết minh bạch, rõ ràng — Mua sắm an tâm tại SIGON SPORT
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '10px 0' }}>
          <div className="container">
            <nav style={{ fontSize: 13, color: '#94a3b8' }}>
              <a href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Trang chủ</a>
              <span style={{ margin: '0 6px' }}>›</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>Chính sách đổi trả</span>
            </nav>
          </div>
        </div>

        <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 16px 64px' }}>

          {/* TOC */}
          <nav style={{
            background: '#f0f6ff', border: '1px solid #c7dcff',
            borderRadius: 12, padding: '20px 24px', marginBottom: 40,
          }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 14, color: '#0057FF', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 12 }}>
              <i className="fas fa-list-ul" style={{ marginRight: 7 }}></i>Mục lục nội dung
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                { href: '#offline',       icon: 'fa-store',         color: '#0057FF', label: 'Mua tại cửa hàng (Offline)' },
                { href: '#doi-hang',      icon: 'fa-arrows-rotate', color: '#ea580c', label: 'Đổi hàng tại cửa hàng' },
                { href: '#keo-giay',      icon: 'fa-wrench',        color: '#16a34a', label: 'Hỗ trợ keo giày miễn phí' },
                { href: '#online',        icon: 'fa-globe',         color: '#7c3aed', label: 'Mua hàng trực tuyến (Online)' },
                { href: '#dat-coc',       icon: 'fa-coins',         color: '#ea580c', label: 'Đặt cọc giữ hàng' },
                { href: '#khong-ung',     icon: 'fa-box-open',      color: '#475569', label: 'Khi nhận hàng không ưng' },
                { href: '#doi-size',      icon: 'fa-check-circle',  color: '#16a34a', label: 'Điều kiện đổi hàng (nhầm size)' },
                { href: '#khong-doi',     icon: 'fa-ban',           color: '#dc2626', label: 'Các trường hợp KHÔNG được đổi/trả' },
                { href: '#huong-dan',     icon: 'fa-clipboard-list',color: '#0057FF', label: 'Hướng dẫn gửi yêu cầu đổi hàng' },
                { href: '#luu-y',         icon: 'fa-circle-exclamation', color: '#475569', label: 'Lưu ý thêm' },
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

          {/* Sections */}
          <Section id="offline" title="🛍️ Mua hàng tại cửa hàng (Offline)" color="#0057FF">
            <p>Tất cả sản phẩm tại Sigon đều là <strong>hàng secondhand đã qua sử dụng</strong>. Vui lòng kiểm tra kỹ sản phẩm trước khi thanh toán — Sigon <strong>không hỗ trợ hoàn tiền</strong> sau khi giao dịch hoàn tất.</p>
          </Section>

          <Section id="doi-hang" title="🔄 Đổi hàng tại cửa hàng" color="#ea580c">
            <p>Sigon hỗ trợ <strong>đổi size hoặc đổi sang sản phẩm khác</strong> trong vòng <strong>3 ngày</strong> kể từ ngày mua, với điều kiện:</p>
            <CondList items={[
              { type: 'ok', text: 'Còn hoá đơn mua hàng hợp lệ' },
              { type: 'ok', text: 'Sản phẩm còn nguyên tình trạng như khi mua, còn nguyên nhãn giá' },
              { type: 'ok', text: 'Được đổi sang sản phẩm ngang giá, cao hơn hoặc thấp hơn' },
              { type: 'no', text: <>Nếu đổi sang sản phẩm giá thấp hơn, phần chênh lệch <strong>không được hoàn lại</strong></> },
              { type: 'no', text: <>Quá 3 ngày kể từ ngày mua, Sigon <strong>không hỗ trợ đổi hàng</strong></> },
            ]} />
          </Section>

          <Section id="keo-giay" title="🔧 Hỗ trợ keo giày miễn phí" color="#16a34a">
            <p>Sigon hỗ trợ <strong>keo giày miễn phí trong vòng 30 ngày</strong> kể từ ngày mua.</p>
            <HighlightBox>
              <i className="fas fa-info-circle" style={{ marginRight: 5 }}></i>
              <strong>Lưu ý:</strong> Khách hàng chịu phí vận chuyển khi gửi hàng về Sigon để xử lý.
            </HighlightBox>
          </Section>

          <Section id="online" title="📦 Mua hàng trực tuyến (Online)" color="#7c3aed">
            <p>Sigon áp dụng chính sách riêng cho đơn hàng online nhằm đảm bảo quyền lợi cho cả hai bên. Vui lòng đọc kỹ các điều khoản trước khi đặt hàng.</p>
          </Section>

          <Section id="dat-coc" title="💰 Đặt cọc giữ hàng" color="#ea580c">
            <p>Để đặt hàng online, Sigon yêu cầu <strong>cọc 100.000đ</strong> khi xác nhận đơn.</p>
            <p>Mong khách hàng thông cảm — do sản phẩm là đồ secondhand có kích thước lớn, chi phí vận chuyển khá cao, nên khoản cọc này giúp Sigon đảm bảo đơn hàng được xử lý nghiêm túc.</p>
            <HighlightBox color="green">
              <i className="fas fa-circle-check" style={{ marginRight: 6 }}></i>
              <strong>Tiền cọc sẽ được trừ trực tiếp vào hoá đơn khi thanh toán</strong> — khách hàng không mất thêm bất kỳ khoản nào.
            </HighlightBox>
          </Section>

          <Section id="khong-ung" title="📬 Khi nhận hàng không ưng" color="#475569">
            <p>Nếu khách hàng nhận hàng và không hài lòng, có thể hoàn trả trong vòng <strong>7 ngày</strong>, tuy nhiên:</p>
            <CondList items={[
              { type: 'no', text: <>Khách hàng chịu <strong>phí hoàn kho 50.000đ</strong></> },
              { type: 'dot', text: <>Hoàn tiền sau khi trừ phí hoàn kho — <strong>chỉ áp dụng khi hàng hoàn về đáp ứng đủ điều kiện</strong>; phí vận chuyển ban đầu không được hoàn lại</> },
            ]} />
          </Section>

          <Section id="doi-size" title="✅ Điều kiện đổi hàng (nhầm size)" color="#16a34a">
            <p>Sigon hỗ trợ đổi hàng trong vòng <strong>7 ngày</strong> kể từ khi nhận hàng thành công trong trường hợp <strong>nhầm size</strong>:</p>
            <CondList items={[
              { type: 'ok', text: 'Còn hoá đơn mua hàng hợp lệ' },
              { type: 'ok', text: 'Sản phẩm còn nguyên tình trạng như khi giao, còn nguyên nhãn giá của Sigon' },
              { type: 'ok', text: 'Được đổi sang sản phẩm ngang giá, cao hơn hoặc thấp hơn' },
              { type: 'no', text: <>Nếu đổi sang sản phẩm giá thấp hơn, phần chênh lệch <strong>không được hoàn lại</strong></> },
              { type: 'no', text: <>Toàn bộ chi phí vận chuyển (ship về + ship đơn mới đi) <strong>do khách hàng chịu</strong></> },
            ]} />
            <HighlightBox color="yellow">
              <i className="fas fa-rotate-left" style={{ marginRight: 6 }}></i>
              <strong>Không tìm được sản phẩm ưng ý để đổi?</strong> Sigon sẽ hoàn lại <strong>85% giá trị đơn hàng</strong> — phần 15% còn lại là phí xử lý và kiểm định hàng hoàn. Phí vận chuyển không được hoàn lại.
            </HighlightBox>
          </Section>

          <Section id="khong-doi" title="❌ Các trường hợp KHÔNG được đổi/trả" color="#dc2626">
            <CondList items={[
              { type: 'no', text: 'Không còn hoá đơn mua hàng' },
              { type: 'no', text: 'Sản phẩm đúng số đo như mô tả (chênh lệch ~1–2cm là bình thường)' },
              { type: 'no', text: 'Lỗi đã được công bố rõ trong phần mô tả sản phẩm' },
              { type: 'no', text: 'Sản phẩm đã qua giặt, không còn nhãn giá, hoặc hư hỏng do người mua' },
              { type: 'no', text: <>Sản phẩm được <strong>khuyến mại trên 20% so với nguyên giá</strong> — không áp dụng đổi hoặc trả trong mọi trường hợp</> },
            ]} />
          </Section>

          <Section id="huong-dan" title="📋 Hướng dẫn gửi yêu cầu đổi hàng" color="#0057FF">
            <ol style={{ listStyle: 'none', padding: 0, margin: '10px 0', counterReset: 'steps', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                <>Liên hệ Sigon qua <strong>Facebook / Instagram / Zalo</strong> trong vòng 7 ngày nhận hàng</>,
                <>Mô tả rõ lý do kèm <strong>hình ảnh thực tế</strong> sản phẩm và ảnh chụp hoá đơn mua hàng</>,
                <>Sau khi Sigon xác nhận, tiến hành gửi hàng về — vui lòng <strong>đóng gói cẩn thận</strong> kèm hoá đơn gốc và đầy đủ phụ kiện (nếu có)</>,
                <>Sau khi nhận và kiểm tra hàng, Sigon sẽ <strong>ship đơn đổi mới</strong> đến khách</>,
              ].map((text, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: '#374151', lineHeight: 1.65 }}>
                  <span style={{ flexShrink: 0, width: 24, height: 24, background: '#0057FF', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, marginTop: 1 }}>{i + 1}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="luu-y" title="📌 Lưu ý thêm" color="#475569">
            <CondList items={[
              { type: 'dot', text: <>Phí vận chuyển <strong>không được hoàn lại</strong> trong mọi trường hợp</> },
              { type: 'dot', text: 'Sigon có quyền từ chối các yêu cầu không đáp ứng điều kiện trên' },
              { type: 'dot', text: <>Tài khoản có lịch sử đổi hàng bất thường hoặc lạm dụng có thể bị <strong>hạn chế mua hàng</strong></> },
            ]} />
          </Section>

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg, #0057FF, #7c3aed)', borderRadius: 12, padding: '28px 24px', textAlign: 'center', color: 'white', marginTop: 40 }}>
            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Cần hỗ trợ thêm?</h3>
            <p style={{ fontSize: 14, opacity: .85, marginBottom: 16 }}>Mọi thắc mắc, vui lòng liên hệ Sigon qua các kênh bên dưới để được hỗ trợ nhanh nhất!</p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10 }}>
              {[
                { href: 'https://facebook.com/sigonsport', icon: 'fab fa-facebook', label: 'Facebook' },
                { href: 'https://instagram.com/sigonsport', icon: 'fab fa-instagram', label: 'Instagram' },
                { href: 'https://zalo.me/sigonsport', icon: 'fas fa-comment-dots', label: 'Zalo' },
                { href: '/contact', icon: 'fas fa-envelope', label: 'Liên hệ' },
              ].map(c => (
                <a key={c.href} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
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

function CondList({ items }) {
  const colors = {
    ok:  { bg: '#dcfce7', color: '#16a34a', icon: 'fa-check' },
    no:  { bg: '#fee2e2', color: '#dc2626', icon: 'fa-xmark' },
    dot: { bg: '#e0f2fe', color: '#0369a1', icon: 'fa-circle-info' },
  };
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => {
        const c = colors[item.type];
        return (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
            <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, marginTop: 2 }}>
              <i className={`fas ${c.icon}`}></i>
            </span>
            <span>{item.text}</span>
          </li>
        );
      })}
    </ul>
  );
}

function HighlightBox({ children, color }) {
  const styles = {
    yellow: { background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' },
    green:  { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' },
    blue:   { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af' },
  };
  const s = styles[color] || styles.yellow;
  return (
    <div style={{ ...s, borderRadius: 8, padding: '14px 18px', fontSize: 13, lineHeight: 1.65, marginTop: 12 }}>
      {children}
    </div>
  );
}

# CLAUDE.md — sigonsport.vn

## Thông Tin Thương Hiệu

| Thuộc tính       | Giá trị                                         |
|------------------|-------------------------------------------------|
| **Tên thương hiệu** | **SIGON SPORT**                              |
| **Domain**       | `sigonsport.vn`                                 |
| **Slogan**       | *Năng động mỗi ngày — Chất lượng mỗi bước*      |
| **Thị trường**   | Việt Nam                                        |
| **Đối tượng**    | Người yêu thể thao, từ nghiệp dư đến chuyên nghiệp |

---

## Tổng Quan Dự Án

**SIGON SPORT** (`sigonsport.vn`) là website thương mại điện tử chuyên cung cấp **sản phẩm thể thao chính hãng và secondhand** dành cho thị trường Việt Nam. Website hướng đến khách hàng trẻ trung, năng động, đam mê các môn thể thao hiện đại.

### Lĩnh Vực Kinh Doanh Chính

1. **Giày thể thao** — giày chuyên dụng cho từng môn thể thao
2. **Vợt thể thao** — vợt pickleball, tennis, cầu lông các cấp độ
3. **Dụng cụ tập luyện** — phụ kiện, thiết bị cho bóng đá, pickleball, tennis, cầu lông
4. **Giày Secondhand** ⭐ — giày thể thao cũ chính hãng, đã qua sử dụng, giá tốt cho khách hàng có nhu cầu

### Các Môn Thể Thao Chuyên Biệt

| Môn           | Sản phẩm tiêu biểu                                          |
|---------------|-------------------------------------------------------------|
| ⚽ Bóng đá    | Giày sân cỏ, giày futsal, bóng, găng tay thủ môn, shin guard |
| 🏸 Cầu lông   | Vợt, giày cầu lông, cầu lông, túi vợt, băng cán             |
| 🎾 Tennis     | Vợt, giày tennis, bóng tennis, túi vợt, dây cước            |
| 🏓 Pickleball | Vợt pickleball, bóng pickleball, giày pickleball, phụ kiện   |

---

## Ngôn Ngữ & Công Nghệ

- **Ngôn ngữ giao diện**: Tiếng Việt (vi-VN)
- **Cấu trúc**: HTML5 + CSS3 (Vanilla CSS) + JavaScript (Vanilla JS)
- **Fonts**: Google Fonts — `Be Vietnam Pro`, `Montserrat` (tiêu đề mạnh mẽ)
- **Icons**: Font Awesome 6 Free hoặc SVG inline
- **Không dùng**: TailwindCSS, Bootstrap, jQuery (trừ khi được yêu cầu rõ ràng)
- **Responsive**: Mobile-first, hỗ trợ đầy đủ từ 320px đến 1920px

---

## Bộ Nhận Diện Thương Hiệu

### Bảng Màu Chính

| Tên         | Mã HEX    | CSS Variable          | Dùng cho                              |
|-------------|-----------|----------------------|---------------------------------------|
| Trắng tinh  | `#FFFFFF` | `--color-white`      | Nền chính, card sản phẩm              |
| Xám nhạt    | `#F5F5F5` | `--color-bg-light`   | Nền section xen kẽ                    |
| Xám trung   | `#E8E8E8` | `--color-border`     | Viền, phân tách                       |
| Đen thể thao| `#111111` | `--color-dark`       | Tiêu đề, text chính                   |
| Xanh dương  | `#0057FF` | `--color-primary`    | CTA chính, badge, nút mua             |
| Đỏ năng động| `#E5002B` | `--color-accent`     | Giảm giá, nhãn HOT, khuyến mãi        |
| Cam tươi    | `#FF6B00` | `--color-secondary`  | Nhãn MỚI, highlight, accent phụ       |
| Xanh lá     | `#00B04F` | `--color-success`    | Còn hàng, miễn phí vận chuyển         |

### Typo

```css
:root {
  --font-heading: 'Montserrat', sans-serif;  /* font chữ tiêu đề */
  --font-body:    'Be Vietnam Pro', sans-serif; /* font chữ thân */
  --fw-bold: 700;
  --fw-semibold: 600;
  --fw-regular: 400;
}
```

### Spacing & Radius

```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --section-gap: 48px;
  --container-max: 1200px;
  --container-px: 16px;
}
```

---

## Kiến Trúc Trang

### Cấu Trúc File

```
/
├── index.html            # Trang chủ
├── products.html         # Danh sách sản phẩm
├── product-detail.html   # Chi tiết sản phẩm
├── cart.html             # Giỏ hàng
├── checkout.html         # Thanh toán
├── about.html            # Giới thiệu công ty
├── contact.html          # Liên hệ
├── css/
│   ├── reset.css         # CSS reset
│   ├── variables.css     # CSS custom properties (design tokens)
│   ├── base.css          # Typography, layout utilities
│   ├── components.css    # Card, button, badge, form...
│   └── pages/
│       ├── home.css
│       ├── products.css
│       └── product-detail.css
├── js/
│   ├── main.js           # Header sticky, mobile nav, common
│   ├── slider.js         # Hero banner, product carousel
│   ├── cart.js           # Giỏ hàng (localStorage)
│   └── filter.js         # Lọc & sắp xếp sản phẩm
├── images/
│   ├── products/         # Ảnh sản phẩm
│   ├── banners/          # Ảnh banner
│   └── brands/           # Logo thương hiệu
└── CLAUDE.md
```

### Layout Trang Chủ (theo thứ tự từ trên xuống)

1. **Top Bar** — Hotline, miễn phí vận chuyển, mạng xã hội
2. **Header** — Logo, thanh tìm kiếm, giỏ hàng, tài khoản + Navigation danh mục
3. **Hero Banner Slider** — Ảnh full-width quảng cáo sản phẩm nổi bật (auto-play 4s)
4. **Thương Hiệu** — Logo strip: Nike, Adidas, Puma, Mizuno, Joma, Umbro...
5. **Flash Sale / Hot Deals** — Đếm ngược countdown + sản phẩm giảm giá mạnh
6. **Danh Mục Nổi Bật** — Grid các nhóm sản phẩm (Giày, Balo, Dụng cụ...)
7. **Sản Phẩm Mới Nhất** — Grid 4 cột, có tab chuyển danh mục
8. **Banner Khuyến Mãi** — 2–3 banner ngang quảng cáo deal đặc biệt
9. **Sản Phẩm Bán Chạy** — Grid 4 cột với badge "Bán chạy"
10. **Khách Hàng Của Tôi** — Grid ảnh khách hàng (UGC/social proof)
11. **Tin Tức / Blog** — 3 bài viết dạng card
12. **Footer** — Thông tin công ty, danh mục nhanh, chứng chỉ bảo mật

---

## Danh Mục Sản Phẩm

```
- Giày thể thao (NEW)
  ├── Giày bóng đá
  │   ├── Sân cỏ tự nhiên (FG)
  │   ├── Sân cỏ nhân tạo (TF/AG)
  │   └── Futsal (IC)
  ├── Giày cầu lông
  ├── Giày tennis
  ├── Giày pickleball
  └── Giày chạy bộ / training

- Giày Secondhand ⭐
  ├── Giày bóng đá secondhand
  ├── Giày cầu lông secondhand
  ├── Giày tennis secondhand
  └── Sneaker / lifestyle secondhand

- Vợt thể thao
  ├── Vợt pickleball
  ├── Vợt cầu lông
  └── Vợt tennis

- Dụng cụ & Phụ kiện
  ├── Bóng (bóng đá, cầu lông, tennis, pickleball)
  ├── Túi & Balo thể thao
  ├── Phụ kiện cầu lông (dây cước, băng cán, grip)
  ├── Phụ kiện tennis (dây cước, vibration dampener)
  ├── Phụ kiện pickleball (overgrip, edge guard)
  ├── Phụ kiện bóng đá (shin guard, găng tay, băng đùi)
  └── Phụ kiện chung (tất, bình nước, băng tay)

- Quần áo thể thao
  ├── Áo thi đấu
  ├── Quần short
  └── Phụ kiện (mũ, băng đầu, kính thể thao)
```

### Quy Tắc Hiển Thị Danh Mục Secondhand

- Sản phẩm secondhand phải có **badge đặc biệt** `SECONDHAND` màu nâu vàng (`#8B6914`)
- Bắt buộc hiển thị **tình trạng sản phẩm**: `Mới 90%` / `Mới 80%` / `Đã qua sử dụng`
- Ghi rõ **lý do bán** và **số lần sử dụng** (nếu có) trong mô tả
- Ảnh phải chụp thực tế, không dùng ảnh catalogue
- Giá secondhand hiển thị kèm giá mới để khách thấy mức tiết kiệm

---

## Quy Tắc UI / UX

### Nút Bấm (Button)

```html
<!-- Nút chính -->
<button class="btn btn-primary">Mua ngay</button>

<!-- Nút phụ -->
<button class="btn btn-outline">Xem thêm</button>

<!-- Nút nguy hiểm / xóa -->
<button class="btn btn-danger">Xóa</button>
```

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: var(--fw-semibold);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}
.btn-primary {
  background: var(--color-primary);
  color: white;
}
.btn-primary:hover {
  background: #0041cc;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 87, 255, 0.35);
}
.btn-outline {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: transparent;
}
```

### Card Sản Phẩm

- Nền trắng `#FFFFFF`, bo góc 8px
- Hover: đổ bóng nhẹ + ảnh scale(1.04)
- Badge nhãn đặt góc trên trái (HOT/SALE/MỚI)
- Giá gốc gạch ngang màu xám, giá sale màu đỏ nổi bật
- Nút "Thêm vào giỏ" hiện lên khi hover card
- Rating sao nhỏ bên dưới tên sản phẩm

### Badge / Nhãn

```css
.badge { font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 3px; text-transform: uppercase; }
.badge-hot   { background: var(--color-accent); color: white; }
.badge-new   { background: var(--color-secondary); color: white; }
.badge-sale  { background: var(--color-primary); color: white; }
.badge-stock { background: var(--color-success); color: white; }
```

### Header

- Sticky khi scroll, có box-shadow khi dính
- Logo bên trái (text hoặc SVG logo)
- Thanh tìm kiếm chiếm 40% chiều rộng, bo tròn pill-shape
- Icon giỏ hàng có badge số lượng màu đỏ
- Navigation: dropdown mega-menu cho danh mục chính
- Mobile: hamburger menu + drawer từ trái

---

## Tính Năng JavaScript

### Bắt Buộc

| Tính năng             | Mô tả                                                    |
|-----------------------|----------------------------------------------------------|
| Hero Slider           | Auto-play, dots điều hướng, swipe mobile                |
| Sticky Header         | Ẩn/hiện mượt mà khi scroll lên/xuống                    |
| Giỏ hàng              | Thêm/xóa/cập nhật số lượng — lưu localStorage           |
| Flash Sale Countdown  | Đếm ngược thời gian thực (giờ:phút:giây)                |
| Lọc sản phẩm          | Lọc theo danh mục, thương hiệu, khoảng giá, size        |
| Sắp xếp               | Mới nhất, Bán chạy, Giá tăng/giảm dần                   |
| Toast thông báo       | "Đã thêm vào giỏ!" — xuất hiện 2s rồi tự ẩn            |
| Tìm kiếm              | Gợi ý tìm kiếm real-time khi gõ (debounce 300ms)        |
| Lazy loading ảnh      | `loading="lazy"` + IntersectionObserver                  |
| Back to top           | Nút cuộn lên đầu trang khi scroll > 400px                |

### Tuỳ Chọn (nâng cao)

- So sánh sản phẩm (tối đa 3 sản phẩm)
- Wishlist / Yêu thích (localStorage)
- Zoom ảnh sản phẩm khi hover
- Chọn màu sắc & size tương tác

---

## Dữ Liệu Mẫu (Mock Data)

Sử dụng mảng JavaScript để mock dữ liệu sản phẩm. Cấu trúc object:

```js
const products = [
  // === SẢN PHẨM MỚI ===
  {
    id: 1,
    name: "Nike Mercurial Vapor 15 Elite FG",
    category: "giay-bong-da",      // slug danh mục
    sport: "bong-da",              // môn thể thao
    subCategory: "san-co-tu-nhien",
    brand: "nike",
    price: 3290000,
    originalPrice: 4500000,
    discount: 27,
    images: ["url1.jpg", "url2.jpg", "url3.jpg"],
    sizes: [39, 40, 41, 42, 43, 44],
    colors: ["Vàng/Đen", "Trắng/Đỏ"],
    rating: 4.9,
    reviewCount: 87,
    sold: 412,
    isNew: true,
    isHot: true,
    isSecondhand: false,           // QUAN TRỌNG: phân biệt new vs secondhand
    inStock: true,
    tags: ["bóng đá", "sân cỏ", "FG", "tốc độ"],
    description: "...",
  },
  // === SẢN PHẨM SECONDHAND ===
  {
    id: 101,
    name: "Adidas X Speedportal.1 FG — Đã qua sử dụng",
    category: "giay-bong-da-secondhand",
    sport: "bong-da",
    brand: "adidas",
    price: 890000,
    originalPrice: 3200000,        // giá mới để so sánh
    discount: 72,
    condition: "Mới 85%",          // tình trạng thực tế
    usageCount: "~20 buổi",        // số lần dùng (tuỳ chọn)
    sellerNote: "Mua dư size, không hợp foot", // lý do bán
    images: ["real-photo-1.jpg", "real-photo-2.jpg"], // ảnh thực tế
    sizes: [42],                   // secondhand thường chỉ có 1 size
    colors: ["Trắng/Xanh"],
    rating: null,                  // không có rating
    reviewCount: 0,
    sold: 0,
    isNew: false,
    isHot: false,
    isSecondhand: true,            // PHẢI là true
    inStock: true,
    tags: ["secondhand", "bóng đá", "FG", "tiết kiệm"],
    description: "...",
  },
  // ...
];
```

---

## Định Dạng Tiền Tệ

```js
// Luôn dùng hàm này để hiển thị giá
function formatPrice(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}
// Output: 2.890.000 ₫
```

---

## Thiết Kế Responsive

| Breakpoint  | Màn hình        | Grid sản phẩm | Ghi chú                    |
|-------------|-----------------|---------------|----------------------------|
| `< 480px`   | Mobile nhỏ      | 2 cột         | Nav thu gọn, search ẩn     |
| `480–767px` | Mobile lớn      | 2 cột         | Hamburger menu             |
| `768–1023px`| Tablet          | 3 cột         | Menu ngang đơn giản        |
| `≥ 1024px`  | Desktop         | 4 cột         | Full mega menu             |

---

## Quy Tắc Tối Ưu SEO

- Mỗi trang có `<title>` và `<meta name="description">` riêng biệt
- Ảnh sản phẩm có `alt` mô tả đầy đủ (tên SP + thương hiệu)
- Sử dụng thẻ ngữ nghĩa: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Mỗi trang chỉ có **một thẻ `<h1>`** duy nhất
- Breadcrumb cho trang sản phẩm (schema.org BreadcrumbList)
- Open Graph tags cho chia sẻ mạng xã hội

---

## Phong Cách Viết Code

- **CSS**: BEM Naming (`.product-card__title`, `.product-card--featured`)
- **JS**: ES6+ (const/let, arrow functions, template literals, modules)
- **Comment**: Viết bằng tiếng Việt cho logic nghiệp vụ, tiếng Anh cho technical
- **Indentation**: 2 spaces
- **Quotes**: Single quotes trong JS, double quotes trong HTML

---

## Bối Cảnh Website Tham Chiếu

Dựa trên phân tích **thanhhungfutsal.com** — các điểm học hỏi:

| Điểm mạnh cần học                   | Cải tiến trong dự án này              |
|--------------------------------------|---------------------------------------|
| Layout rõ ràng theo section          | Thêm whitespace thoáng hơn            |
| Nhiều danh mục sản phẩm dễ tìm      | Mega menu đẹp hơn, có ảnh minh họa   |
| Flash sale nổi bật                   | Thiết kế countdown hấp dẫn hơn       |
| Hiển thị đánh giá khách hàng         | Card review đẹp hơn với ảnh          |
| Đa thương hiệu                       | Logo thương hiệu đẹp hơn, có hover   |
| Giá rõ ràng, hiện giảm giá           | Typography giá lớn hơn, nổi bật hơn  |
| Section "Tin Tức"                    | Blog card có thumbnail & excerpt     |

---

## ⚠️ Quy Tắc Bắt Buộc (MANDATORY RULES)

> Các quy tắc dưới đây **KHÔNG được bỏ qua** trong bất kỳ thay đổi nào.

### 1. Mobile-First — Giao Diện Thân Thiện Mobile

- **Ưu tiên thiết kế cho màn hình 375px trước**, sau đó mở rộng lên tablet và desktop
- Tất cả nút bấm (CTA, thêm giỏ hàng, mua ngay) phải có **min-height: 44px** để dễ chạm trên điện thoại
- Khoảng cách giữa các phần tử tương tác phải **≥ 8px** để tránh chạm nhầm
- Tất cả input, form phải **font-size ≥ 16px** trên mobile (tránh iOS auto-zoom)
- Navigation mobile: **Drawer từ cạnh trái**, overlay mờ che phần còn lại, đóng khi tap ra ngoài
- Ảnh sản phẩm: dùng `srcset` hoặc CSS `object-fit: cover` để ảnh không bị vỡ trên mobile
- Không dùng `hover` làm cách duy nhất để hiển thị chức năng quan trọng (mobile không có hover)
- Text nhỏ nhất: **12px** (body min), **14px** cho nội dung quan trọng
- Kiểm tra trên Chrome DevTools với các preset: **iPhone SE (375px)**, **iPhone 14 Pro (390px)**, **iPad (768px)**

```css
/* Mobile-first breakpoint chuẩn cho sigonsport.vn */
/* Base styles: 320px–479px (mobile nhỏ) */

@media (min-width: 480px)  { /* Mobile lớn */ }
@media (min-width: 768px)  { /* Tablet     */ }
@media (min-width: 1024px) { /* Desktop    */ }
@media (min-width: 1280px) { /* Desktop XL */ }
```

### 2. Screenshot & So Sánh Sau Mỗi Thay Đổi Lớn

**"Thay đổi lớn"** được định nghĩa là bất kỳ thay đổi nào ảnh hưởng đến:
- Layout tổng thể (header, footer, grid sản phẩm)
- Màu sắc, typography của toàn trang
- Thêm/xóa section trên trang chủ
- Thay đổi luồng UX (giỏ hàng, tìm kiếm, filter)
- Responsive breakpoint mới

**Quy trình bắt buộc:**

```
[Thực hiện thay đổi]
        ↓
[Chụp screenshot trang hiện tại]
        ↓
[So sánh với ảnh mẫu: thanhhungfutsal.com_.png]
        ↓
[Ghi nhận điểm giống / khác / cần cải thiện]
        ↓
[Điều chỉnh nếu cần] → lặp lại
```

**File ảnh tham chiếu:** `h:\Dự án Claude\Giày\thanhhungfutsal.com_.png`

**Tiêu chí so sánh:**

| Tiêu chí              | Câu hỏi kiểm tra                                          |
|-----------------------|-----------------------------------------------------------|
| Layout tổng thể       | Các section có theo thứ tự hợp lý không?                  |
| Nổi bật sản phẩm      | Ảnh sản phẩm có đủ lớn, rõ ràng không?                   |
| Thông tin giá         | Giá hiện thị rõ, giảm giá nổi bật không?                 |
| Navigation            | Menu dễ tìm, dễ dùng trên cả mobile lẫn desktop không?  |
| Kêu gọi hành động     | CTA (Mua ngay, Thêm giỏ) có đủ nổi bật không?           |
| Tốc độ cảm nhận       | Trang load nhanh, không bị giật không?                   |
| Tính chuyên nghiệp    | Website trông đáng tin cậy, chuyên nghiệp không?         |

---

## Checklist Trước Khi Bàn Giao

**Mobile:**
- [ ] Responsive hoạt động trên 320px, 375px, 390px, 768px, 1024px, 1440px
- [ ] Tất cả nút bấm có min-height 44px
- [ ] Không có text nhỏ hơn 12px trên mobile
- [ ] Drawer mobile nav hoạt động (mở, đóng, overlay)
- [ ] Không bị iOS auto-zoom khi focus input

**Chức năng:**
- [ ] Giỏ hàng hoạt động (thêm, xóa, cập nhật số lượng)
- [ ] Countdown flash sale hoạt động
- [ ] Filter sản phẩm hoạt động (bao gồm lọc secondhand)
- [ ] Tìm kiếm real-time hoạt động
- [ ] Toast notification hiện ra khi thêm vào giỏ

**Nội dung:**
- [ ] Tất cả ảnh có thuộc tính `alt`
- [ ] Sản phẩm secondhand có badge và thông tin tình trạng
- [ ] Tất cả link điều hướng đúng
- [ ] Meta tags đầy đủ (title, description, OG) trên mọi trang
- [ ] Breadcrumb hiển thị đúng trên trang sản phẩm

**Kỹ thuật:**
- [ ] Không có lỗi JavaScript trong console
- [ ] Tối ưu ảnh (WebP, lazy loading)
- [ ] Tốc độ tải trang < 3s (Lighthouse)
- [ ] Tất cả form có validation

**QA Thị Giác:**
- [ ] Screenshot trang chủ đã so sánh với ảnh mẫu
- [ ] Screenshot trang sản phẩm đã so sánh với ảnh mẫu
- [ ] Screenshot mobile (375px) đã kiểm tra

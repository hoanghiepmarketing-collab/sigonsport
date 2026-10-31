# SiGon Secondhand — Hướng Dẫn Setup Automation

## Tổng quan hệ thống

```
📱 Chụp ảnh giày (điện thoại)
        ↓
📁 Copy vào thư mục C:\SiGon\incoming\
        ↓
🤖 Gemini AI tự động enhance (studio light, white background)
        ↓
📘 Tự động đăng Facebook Album (theo size)
        ↓
📷 Tự động đăng Instagram Feed + Story
        ↓
📋 Ghi log vào sigon_inventory.csv
```

---

## Bước 1 — Cài Python và thư viện

**Yêu cầu:** Python 3.10+

```bash
# Kiểm tra Python đã cài chưa
python --version

# Cài các thư viện cần thiết
pip install -r requirements.txt
```

---

## Bước 2 — Lấy Gemini API Key

1. Truy cập: https://aistudio.google.com/apikey
2. Đăng nhập bằng tài khoản Google
3. Click **"Create API Key"**
4. Copy key → dán vào `config.py` dòng `GEMINI_API_KEY`

> Model mặc định: `gemini-2.0-flash-preview-image-generation`  
> Đây là model hỗ trợ **output ảnh** — không dùng model thường được.

---

## Bước 3 — Lấy Facebook Page Access Token

### Tạo Facebook App
1. Vào https://developers.facebook.com/apps/
2. Click **"Create App"** → chọn **"Business"**
3. Thêm product **"Pages API"**

### Lấy Page ID
- Vào Fanpage SiGon → Settings → About → Page ID

### Lấy Access Token (long-lived, 60 ngày)
1. Vào https://developers.facebook.com/tools/explorer/
2. Chọn App của bạn
3. Chọn Page SiGon trong dropdown "User or Page"
4. Permissions cần: `pages_manage_posts`, `pages_read_engagement`, `publish_to_groups`
5. Click **"Generate Access Token"**
6. Copy token → dán vào `config.py` dòng `FACEBOOK_PAGE_ACCESS_TOKEN`

### Tạo Album theo size trên Fanpage (làm 1 lần)
1. Vào Fanpage → **Photos** → **Albums** → **Create Album**
2. Tạo các album:
   - `SIGON | Size 35→38 | Giày 2Hand Real`
   - `SIGON | Size 39→42 | Giày 2Hand Real`
   - `SIGON | Size 43→46 | Giày 2Hand Real`
   - `SIGON | Size 47+ | Giày 2Hand Real`
   - `SIGON | Dép & Slip-on`
3. Lấy Album ID từ URL (số sau `a.`)  
   Ví dụ: `facebook.com/media/set/?set=a.123456789` → ID là `123456789`
4. Điền vào `config.py` phần `FACEBOOK_ALBUMS`

---

## Bước 4 — Setup Instagram (Business Account)

### Yêu cầu
- Tài khoản Instagram phải là **Business** hoặc **Creator**
- Tài khoản đã **kết nối với Facebook Page** SiGon

### Chuyển sang Business Account
1. Instagram app → Settings → Account → Switch to Professional Account
2. Chọn **Business** → liên kết với Facebook Page SiGon

### Lấy Instagram Business Account ID
```
https://graph.facebook.com/v19.0/me/accounts?access_token=YOUR_PAGE_TOKEN
```
Tìm dòng `"instagram_business_account"` → lấy `"id"`

Hoặc dễ hơn:
1. Vào https://developers.facebook.com/tools/explorer/
2. Gọi: `GET /me/accounts` → tìm page SiGon
3. Gọi tiếp: `GET /PAGE_ID?fields=instagram_business_account`
4. Copy ID → dán vào `config.py` dòng `INSTAGRAM_BUSINESS_ACCOUNT_ID`

---

## Bước 5 — Quy ước đặt tên file ảnh

Đây là bước quan trọng nhất — tên file phải đúng format để hệ thống đọc được thông tin.

### Format chuẩn:
```
BRAND_Model_SIZE_PRICE_CONDITION.jpg
```

### Ví dụ thực tế:
| Tên file | Brand | Model | Size | Giá | Tình trạng |
|----------|-------|-------|------|-----|-----------|
| `Nike_AirMax90_42_890k_85pct.jpg` | Nike | Air Max 90 | 42 | 890.000đ | Mới 85% |
| `Adidas_Ultraboost_40_650k_90pct.jpg` | Adidas | Ultraboost | 40 | 650.000đ | Mới 90% |
| `Converse_Chuck70_38_350k_80pct.jpg` | Converse | Chuck 70 | 38 | 350.000đ | Mới 80% |
| `Nike_Cortez_dep_200k.jpg` | Nike | Cortez | dép | 200.000đ | - |

### Quy tắc:
- Dùng `_` (gạch dưới) để phân tách, không dùng dấu cách
- Size: số nguyên hoặc thập phân (42, 42.5, 38)
- Giá: số + k (890k = 890.000đ)
- Condition: số + pct (85pct = Mới 85%)
- Dép/Slip-on: điền "dep" vào trường SIZE

---

## Bước 6 — Thư mục cần tạo

Tạo 3 thư mục sau (hoặc thay đường dẫn trong config.py):

```
C:\SiGon\
├── incoming\    ← Copy ảnh chụp từ điện thoại vào đây
├── enhanced\    ← Ảnh sau khi Gemini xử lý (tự tạo)
├── posted\      ← Ảnh đã đăng xong (tự chuyển)
└── assets\
    └── sigon_logo.png   ← Logo SiGon nền trong suốt (PNG)
```

---

## Bước 7 — Chạy pipeline

### Kiểm tra token trước khi dùng:
```bash
python pipeline.py --test-tokens
```

### Watch mode (khuyến nghị — chạy cả ngày):
```bash
python pipeline.py
```
Copy ảnh vào `C:\SiGon\incoming\` → tự động xử lý trong vài phút.

### Batch mode (xử lý hết rồi dừng):
```bash
python pipeline.py --batch
```

### Test 1 file không đăng thật (dry run):
```bash
python pipeline.py --file Nike_AirMax90_42_890k_85pct.jpg --dry
```

### Xử lý 1 file cụ thể:
```bash
python pipeline.py --file "C:\SiGon\incoming\Nike_AirMax90_42_890k.jpg"
```

---

## Workflow hàng ngày (sau khi setup xong)

```
Sáng: Chạy python pipeline.py (để cửa sổ terminal mở)

Mỗi khi có đôi giày mới:
  1. Chụp 4-6 ảnh bằng điện thoại
  2. Đặt tên file đúng format: Nike_AirMax90_42_890k_85pct.jpg
  3. Copy vào C:\SiGon\incoming\
  4. Tự động xử lý trong ~1-2 phút

Cuối tuần (~10 phút):
  - Vào Instagram → Stories Archive → kéo story vào đúng Highlight size
```

---

## Xử lý sự cố thường gặp

**Gemini không trả về ảnh:**
- Kiểm tra API key còn hạn không
- Thử model khác: `gemini-1.5-pro` (hỗ trợ ít hơn nhưng ổn định hơn)
- Ảnh gốc quá tối hoặc quá nhỏ (< 500px) → chụp lại

**Facebook token hết hạn (sau 60 ngày):**
- Làm lại Bước 3 để lấy token mới
- Hoặc dùng System User Token trong Business Manager (không hết hạn)

**Instagram không đăng được:**
- Kiểm tra tài khoản đã là Business chưa
- Kiểm tra kết nối Facebook Page
- Instagram giới hạn 25 bài/ngày → đừng spam

**Lỗi "Tên file không đúng format":**
- Kiểm tra không có dấu tiếng Việt trong tên file
- Không dùng dấu cách — chỉ dùng gạch dưới `_`

---

## Nâng cấp tương lai

- [ ] Tích hợp Google Drive API để tự động sync ảnh từ điện thoại
- [ ] Thêm Google Sheets logger để quản lý inventory
- [ ] TikTok API (khi có điều kiện)
- [ ] Telegram bot để nhận thông báo sau mỗi lần đăng thành công
- [ ] Cloudinary integration để hosting ảnh Instagram ổn định hơn

# =============================================================================
#  SiGon Secondhand — Automation Config
#  File: config.py
#  Điền đầy đủ các giá trị bên dưới trước khi chạy pipeline
# =============================================================================

# ─── GEMINI AI ────────────────────────────────────────────────────────────────
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"
# Lấy tại: https://aistudio.google.com/apikey
# Model dùng cho image generation (hỗ trợ image output)
GEMINI_MODEL = "gemini-2.0-flash-preview-image-generation"

# ─── GOOGLE DRIVE ─────────────────────────────────────────────────────────────
# File credentials.json tải từ Google Cloud Console
# Hướng dẫn: https://developers.google.com/drive/api/quickstart/python
GOOGLE_CREDENTIALS_FILE = "credentials.json"
GOOGLE_TOKEN_FILE = "token.json"

# ID thư mục trên Google Drive (lấy từ URL khi mở thư mục)
DRIVE_FOLDER_RAW      = "YOUR_DRIVE_FOLDER_RAW_ID"       # Ảnh gốc từ điện thoại
DRIVE_FOLDER_ENHANCED = "YOUR_DRIVE_FOLDER_ENHANCED_ID"  # Ảnh đã qua Gemini
DRIVE_FOLDER_POSTED   = "YOUR_DRIVE_FOLDER_POSTED_ID"    # Ảnh đã đăng xong

# ─── FACEBOOK ─────────────────────────────────────────────────────────────────
# Lấy Page Access Token (long-lived, 60 ngày):
# https://developers.facebook.com/tools/explorer/
FACEBOOK_PAGE_ID           = "YOUR_FACEBOOK_PAGE_ID"
FACEBOOK_PAGE_ACCESS_TOKEN = "YOUR_FACEBOOK_PAGE_ACCESS_TOKEN"

# Album ID theo dải size — tạo album thủ công trên Fanpage, lấy ID từ URL
# Format URL album: facebook.com/media/set/?set=a.ALBUM_ID
FACEBOOK_ALBUMS = {
    "35-38": "ALBUM_ID_SIZE_35_38",
    "39-42": "ALBUM_ID_SIZE_39_42",
    "43-46": "ALBUM_ID_SIZE_43_46",
    "47+"  : "ALBUM_ID_SIZE_47_PLUS",
    "dep"  : "ALBUM_ID_DEP",      # Dép, slip-on
    "moi"  : "ALBUM_ID_HANG_MOI", # Giày mới (không phải 2hand)
}

# ─── INSTAGRAM ────────────────────────────────────────────────────────────────
# Tài khoản phải là Business/Creator + kết nối Facebook Page
INSTAGRAM_BUSINESS_ACCOUNT_ID = "YOUR_IG_BUSINESS_ACCOUNT_ID"
# Dùng cùng Page Access Token với Facebook
INSTAGRAM_ACCESS_TOKEN = FACEBOOK_PAGE_ACCESS_TOKEN

# ─── CẤU HÌNH PIPELINE ────────────────────────────────────────────────────────
# Thư mục local để watch (chụp ảnh xong copy vào đây)
LOCAL_WATCH_FOLDER  = r"C:\SiGon\incoming"   # Windows
# LOCAL_WATCH_FOLDER = "/Users/ten/SiGon/incoming"  # Mac

LOCAL_OUTPUT_FOLDER = r"C:\SiGon\enhanced"
LOCAL_POSTED_FOLDER = r"C:\SiGon\posted"

# Đuôi file ảnh được xử lý
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# Delay giữa các bài đăng (giây) — tránh bị rate limit
POST_DELAY_SECONDS = 5

# Bật/tắt từng kênh
ENABLE_FACEBOOK  = True
ENABLE_INSTAGRAM = True
ENABLE_DRIVE_UPLOAD = True

# ─── THƯƠNG HIỆU ──────────────────────────────────────────────────────────────
BRAND_NAME    = "SiGon Secondhand"
BRAND_HANDLE  = "@sigonsecondhand"
BRAND_PHONE   = "Inbox fanpage để đặt hàng"
BRAND_HASHTAGS = (
    "#sigonsecondhand #sigonsport #giay2hand #2handreal "
    "#sneaker2hand #giaysecondhand #giayreal #sneakervietnam "
    "#hcmcfashion #saigonfashion"
)

# Logo SiGon — đường dẫn file logo PNG (nền trong suốt, dùng cho watermark)
SIGON_LOGO_PATH = r"C:\SiGon\assets\sigon_logo.png"

# ─── LOGGING ──────────────────────────────────────────────────────────────────
LOG_FILE = "sigon_pipeline.log"
# Google Sheet để track inventory (tuỳ chọn)
GOOGLE_SHEET_ID  = "YOUR_GOOGLE_SHEET_ID"
GOOGLE_SHEET_TAB = "Inventory"

# =============================================================================
#  SiGon Secondhand — Cấu hình
#  Chỉ cần điền API Key và đường dẫn thư mục là xong.
# =============================================================================

# ── Gemini API Key ─────────────────────────────────────────────────────────────
# Lấy miễn phí tại: https://aistudio.google.com/apikey
GEMINI_API_KEY = "AIzaSyCc-WGOhNCaqww_A4BCB67cB8xl3iRHvpA"

# ── Model ──────────────────────────────────────────────────────────────────────
# Model hỗ trợ xuất ảnh (image output) — không được đổi sang model text thường
GEMINI_MODEL = "gemini-2.5-flash-image"

# ── Thư mục ────────────────────────────────────────────────────────────────────
# Thư mục chứa ảnh gốc cần xử lý
INPUT_FOLDER  = r"H:\SiGon\Photo\Input"

# Thư mục lưu ảnh đã enhance — tự tạo nếu chưa có
OUTPUT_FOLDER = r"H:\SiGon\Photo\Output"

# ── Định dạng file ────────────────────────────────────────────────────────────
# Quy ước đặt tên: SIZE_PRICE.jpg  (tên giày do Gemini tự nhận dạng từ ảnh)
#   42_890k.jpg    → Size 42,   890.000đ
#   38.5_650k.jpg  → Size 38.5, 650.000đ
#   dep_350k.jpg   → Dép,       350.000đ
#   44_lh.jpg      → Size 44,   Liên hệ
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# ── Chất lượng JPEG output (1-95) ─────────────────────────────────────────────
OUTPUT_QUALITY = 95

# ── Retry khi Gemini loi tam thoi ────────────────────────────────────────────
MAX_RETRIES = 3

# ── Delay giua cac anh khi batch (giay) -- tranh rate limit ──────────────────
BATCH_DELAY = 4

# =============================================================================
#  Google Drive (tuỳ chọn)
#  Đổi USE_GOOGLE_DRIVE = True nếu muốn đọc ảnh từ Drive & upload kết quả lên Drive.
#  Khi False, tool dùng INPUT_FOLDER / OUTPUT_FOLDER như cũ.
# =============================================================================

USE_GOOGLE_DRIVE = True

# ID thư mục Google Drive chứa ảnh gốc
# Lấy từ URL: drive.google.com/drive/folders/<FOLDER_ID>
DRIVE_INPUT_FOLDER_ID  = "15QMmLLGCCTeCJgBpMCc4-VhMGRNETeiC"

# ID thư mục Google Drive để lưu ảnh đã enhance
# Đặt cùng giá trị với DRIVE_INPUT_FOLDER_ID nếu muốn lưu chung 1 thư mục
DRIVE_OUTPUT_FOLDER_ID = "15QMmLLGCCTeCJgBpMCc4-VhMGRNETeiC"

# File credentials OAuth2 — tải từ Google Cloud Console
DRIVE_CREDENTIALS_FILE = r"H:\Dự án Claude\Giày\tool\credentials.json"

# File token — tự tạo sau lần đăng nhập đầu, KHÔNG upload lên đâu cả
DRIVE_TOKEN_FILE = r"H:\Dự án Claude\Giày\tool\token.json"

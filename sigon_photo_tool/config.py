# =============================================================================
#  SiGon Secondhand — Cấu hình
#  Chỉ cần điền API Key và đường dẫn thư mục là xong.
# =============================================================================

# ── Gemini API Key ─────────────────────────────────────────────────────────────
# Lấy miễn phí tại: https://aistudio.google.com/apikey
GEMINI_API_KEY = "AIzaSyCc-WGOhNCaqww_A4BCB67cB8xl3iRHvpA"

# ── Model ──────────────────────────────────────────────────────────────────────
# Model hỗ trợ xuất ảnh (image output) — không được đổi sang model text thường
GEMINI_MODEL = "gemini-2.0-flash-preview-image-generation"

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

# ── Retry khi Gemini lỗi tạm thời ────────────────────────────────────────────
MAX_RETRIES = 3

# ── Delay giữa các ảnh khi batch (giây) — tránh rate limit ──────────────────
BATCH_DELAY = 4

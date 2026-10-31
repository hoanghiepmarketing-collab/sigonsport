#!/usr/bin/env python3
# =============================================================================
#  SiGon Secondhand — Gemini AI Photo Enhancer
#  Phiên bản: 1.1  (dùng google-genai SDK mới)
#
#  Cách dùng:
#    python sigon_enhance.py                          # Batch cả thư mục input/
#    python sigon_enhance.py anh_giay.jpg             # Single: 1 file
#    python sigon_enhance.py anh_giay.jpg --size 42 --price 890k
#    python sigon_enhance.py --input ./anh --out ./ket_qua
# =============================================================================

import sys
import io
import re
import time
import argparse
import logging
from pathlib import Path

# ── Kiểm tra thư viện ────────────────────────────────────────────────────────
try:
    from google import genai
    from google.genai import types as genai_types
except ImportError:
    print("\n❌ Thiếu thư viện. Chạy lệnh sau rồi thử lại:")
    print("   pip install -r requirements.txt\n")
    sys.exit(1)

try:
    from PIL import Image
except ImportError:
    print("\n❌ Thiếu Pillow. Chạy: pip install Pillow\n")
    sys.exit(1)

import config

# ─── Logging ─────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(message)s",
    datefmt="%H:%M:%S",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger(__name__)


# ─── Gemini Prompt ───────────────────────────────────────────────────────────
PROMPT_TEMPLATE = """\
Act as a professional footwear product photographer and premium e-commerce art director \
for a high-end vintage sneaker marketplace. Your task is to generate a clean, luxury \
studio product photo from the uploaded shoe image.

STYLE & MOOD:
- Minimalist Korean-inspired sneaker campaign, premium secondhand sneaker store aesthetic.
- Soft luxury lighting with a modern fashion editorial look (High-end Instagram shop style).
- Sharp details, clean aesthetic, and realistic textures.
- Overall aesthetic: clean, premium, and professional sneaker catalog photography.

COMPOSITION:
- The shoe must be centered horizontally in a side profile angle (exactly like a classic sneaker catalog shot).
- Leave generous, balanced negative space around the shoe.
- Export in vertical ratio 4:5, keeping the entire shoe fully visible.

BACKGROUND & LIGHTING:
- Pure clean white seamless studio background with NO floor texture or distracting elements.
- Lighting: Soft diffused studio lighting. Bright but not overexposed, with NO harsh reflections.
- Adjust the lighting on the shoe to be slightly brighter to enhance visual impact and premium feel.
- Include only a subtle, realistic soft shadow directly under the shoe to ground it.

PHOTO RETOUCHING & AUTHENTICITY (CRITICAL):
- This is a SECONDHAND (2hand) sneaker: You MUST preserve the authentic original shape, \
real textures, exact colors, and actual pre-owned condition of the shoe \
(keep realistic wrinkles, minor scuffs, or natural wear from the original photo).
- Do NOT make the shoe look brand new by removing its real secondhand characteristics.
- Do NOT distort proportions, do NOT create extra shoes, and do NOT add random accessories.

GRAPHIC LAYOUT & BRANDING:
1. TOP LEFT CORNER: Place the "SiGon SECONDHAND" logo text in a clean, minimal style.
   - Use green color (#2D5535) for "Gon" and terracotta (#C44D28) for "Si".
   - Size: Small and elegant (tinh tế), aligned neatly in the corner.
2. BOTTOM LEFT CORNER (Product Info):
   - SHOE IDENTIFICATION (CRITICAL): You must visually analyze the shoe in the uploaded \
image and use your knowledge base to identify the exact brand and model name. \
Look carefully at the silhouette, sole unit, logo placement, toe box shape, heel design, \
lace system, and any visible branding details. \
Examples of expected output: "Nike Air Max 90 'Infrared'", \
"Adidas Stan Smith 'White Green'", "Vans Old Skool 'Black White'", \
"Converse Chuck Taylor All Star '70 Hi", "New Balance 574 'Grey Navy'". \
   - If you can identify the colorway name, include it in quotes after the model name. \
   - If you are not 100% certain of the exact model, write your best visual match \
prefixed with the brand name — never leave this field blank or write "Unknown".
   - Display the identified name in elegant bold typography.
   - Directly below the shoe name, list in a modern, clean, small font:
     SIZE: {size}
     PRICE: {price}

OUTPUT QUALITY:
- Ultra-realistic, 4K quality, extremely sharp and e-commerce ready. \
Zoom-in quality must remain crisp.\
"""


# ─── Helpers: metadata từ tên file ───────────────────────────────────────────
def _format_price(raw: str) -> str:
    """
    Chuẩn hoá chuỗi giá.
      '890k'   → '890.000đ'
      '1200k'  → '1.200.000đ'
      '350'    → '350.000đ'   (không có 'k' → coi như nghìn đồng)
      ''       → 'Liên hệ'
    """
    raw = raw.lower().strip()
    if not raw or raw in ("lienhe", "liên hệ", "lh"):
        return "Liên hệ"
    try:
        digits = int(re.sub(r"[^0-9]", "", raw))
        # Nếu có 'k' hoặc số nhỏ (< 10_000) → đơn vị là nghìn đồng
        if "k" in raw or digits < 10_000:
            digits *= 1_000
        return f"{digits:,}đ".replace(",", ".")
    except ValueError:
        return raw


def parse_filename(filename: str) -> dict:
    """
    Đọc SIZE và PRICE từ tên file. Tên giày do Gemini tự nhận dạng từ ảnh.

    Format: SIZE_PRICE.jpg
    Ví dụ:
      42_890k.jpg      → size=42,   price=890.000đ
      38.5_650k.jpg    → size=38.5, price=650.000đ
      dep_350k.jpg     → size=Dép,  price=350.000đ
      44_1200k.jpg     → size=44,   price=1.200.000đ
      40_lh.jpg        → size=40,   price=Liên hệ

    Nếu tên file không đúng format, size và price sẽ là giá trị mặc định.
    Có thể override bằng --size và --price khi chạy lệnh.
    """
    stem  = Path(filename).stem
    parts = stem.split("_")

    meta = {
        "size" : "?",
        "price": "Liên hệ",
    }

    # Part 0 → SIZE (hợp lệ: số 30-50, hoặc 'dep')
    if len(parts) >= 1:
        s = parts[0].lower().strip()
        if s in ("dep", "dép", "slip"):
            meta["size"] = "Dép"
        else:
            try:
                sz = float(s)
                if 28 <= sz <= 55:          # khoảng size giày hợp lệ
                    meta["size"] = parts[0]
            except ValueError:
                pass                        # không phải số → giữ mặc định '?'

    # Part 1 → PRICE (hợp lệ: chứa 'k', hoặc là 'lh'/'lienhe')
    if len(parts) >= 2:
        p = parts[1].lower().strip()
        if "k" in p or p in ("lh", "lienhe", "liên hệ"):
            meta["price"] = _format_price(p)
        # nếu không có 'k' → không đủ tin tưởng đây là giá → giữ 'Liên hệ'

    return meta


# ─── Helpers: ảnh ────────────────────────────────────────────────────────────
def _to_jpeg_bytes(image_path: Path) -> bytes:
    """Mở ảnh bất kỳ format, trả về JPEG bytes chuẩn để gửi Gemini."""
    img = Image.open(image_path)
    if img.mode in ("RGBA", "P", "LA"):
        img = img.convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=92)
    return buf.getvalue()


def _save_jpeg(image_data: bytes, output_path: Path) -> bool:
    """Lưu bytes ảnh (từ Gemini) ra file JPEG chất lượng cao."""
    try:
        img = Image.open(io.BytesIO(image_data))
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(output_path, format="JPEG",
                 quality=config.OUTPUT_QUALITY, optimize=True)
        kb = output_path.stat().st_size // 1024
        log.info(f"   ✓ Đã lưu: {output_path.name}  ({kb} KB)")
        return True
    except Exception as e:
        log.error(f"   ✗ Lỗi lưu file: {e}")
        # Fallback: ghi thẳng bytes
        try:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(image_data)
            return True
        except Exception as e2:
            log.error(f"   ✗ Fallback thất bại: {e2}")
            return False


def _output_path(input_path: Path, output_dir: Path) -> Path:
    """Tạo path output: <output_dir>/<stem>_enhanced.jpg"""
    output_dir.mkdir(parents=True, exist_ok=True)
    return output_dir / f"{input_path.stem}_enhanced.jpg"


# ─── Gemini call ─────────────────────────────────────────────────────────────
def _call_gemini(client: genai.Client, img_bytes: bytes, prompt: str) -> bytes | None:
    """
    Gọi Gemini image-generation model.
    Trả về bytes ảnh output, hoặc None nếu thất bại.
    """
    contents = [
        genai_types.Content(parts=[
            genai_types.Part(text=prompt),
            genai_types.Part(
                inline_data=genai_types.Blob(
                    mime_type="image/jpeg",
                    data=img_bytes,
                )
            ),
        ])
    ]
    cfg = genai_types.GenerateContentConfig(
        response_modalities=["TEXT", "IMAGE"],
        temperature=0.35,
    )

    response = client.models.generate_content(
        model=config.GEMINI_MODEL,
        contents=contents,
        config=cfg,
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.data:
            return part.inline_data.data

    return None   # Gemini trả về text thay vì ảnh


# ─── Core: xử lý 1 ảnh ───────────────────────────────────────────────────────
def process_single(
    image_path: str | Path,
    output_dir: str | Path = None,
    size:  str = None,
    price: str = None,
    client: genai.Client = None,
) -> Path | None:
    """
    Enhance 1 ảnh giày qua Gemini AI và lưu file output.

    Args:
        image_path : Đường dẫn ảnh gốc
        output_dir : Thư mục lưu output  (mặc định: config.OUTPUT_FOLDER)
        size       : Override size        (mặc định: đọc từ tên file)
        price      : Override giá         (mặc định: đọc từ tên file)
        client     : Gemini client        (tự tạo nếu không truyền)

    Returns:
        Path file đã lưu, hoặc None nếu thất bại.
    """
    image_path = Path(image_path)
    output_dir = Path(output_dir or config.OUTPUT_FOLDER)

    if not image_path.exists():
        log.error(f"File không tồn tại: {image_path}")
        return None

    # ── Metadata ──
    meta        = parse_filename(image_path.name)
    final_size  = size  or meta["size"]
    final_price = _format_price(price) if price else meta["price"]

    log.info(f"\n{'─'*55}")
    log.info(f"📸  {image_path.name}")
    log.info(f"    Size: {final_size}  |  Giá: {final_price}")
    log.info(f"    Tên giày: Gemini sẽ tự nhận dạng từ ảnh")
    log.info(f"{'─'*55}")

    out = _output_path(image_path, output_dir)
    if out.exists():
        log.info(f"   ⏭  Đã có output — bỏ qua (xoá file cũ nếu muốn làm lại)")
        return out

    # ── Chuẩn bị ──
    if client is None:
        client = genai.Client(api_key=config.GEMINI_API_KEY)

    try:
        img_bytes = _to_jpeg_bytes(image_path)
    except Exception as e:
        log.error(f"   ✗ Không mở được ảnh: {e}")
        return None

    prompt = PROMPT_TEMPLATE.format(size=final_size, price=final_price)

    # ── Gọi Gemini (có retry) ──
    result_bytes = None
    for attempt in range(1, config.MAX_RETRIES + 1):
        try:
            log.info(f"   → Gemini đang xử lý... (lần {attempt}/{config.MAX_RETRIES})")
            result_bytes = _call_gemini(client, img_bytes, prompt)
            if result_bytes:
                kb = len(result_bytes) // 1024
                log.info(f"   ✓ Nhận được ảnh từ Gemini  ({kb} KB)")
                break
            else:
                log.warning("   ! Gemini không trả về ảnh lần này.")
        except Exception as e:
            log.error(f"   ✗ Lỗi lần {attempt}: {e}")

        if attempt < config.MAX_RETRIES:
            wait = 2 ** attempt   # 2s → 4s → 8s
            log.info(f"   → Thử lại sau {wait}s...")
            time.sleep(wait)

    if not result_bytes:
        log.error(f"   ✗ Thất bại sau {config.MAX_RETRIES} lần: {image_path.name}")
        return None

    # ── Lưu file ──
    return out if _save_jpeg(result_bytes, out) else None


# ─── Batch ───────────────────────────────────────────────────────────────────
def process_batch(
    input_dir:  str | Path = None,
    output_dir: str | Path = None,
) -> dict:
    """
    Xử lý toàn bộ ảnh trong thư mục.

    Returns:
        {"ok": [...], "failed": [...], "skipped": [...]}
    """
    input_dir  = Path(input_dir  or config.INPUT_FOLDER)
    output_dir = Path(output_dir or config.OUTPUT_FOLDER)

    if not input_dir.exists():
        log.error(f"Thư mục không tồn tại: {input_dir}")
        return {"ok": [], "failed": [], "skipped": []}

    images = sorted([
        f for f in input_dir.iterdir()
        if f.suffix.lower() in config.ALLOWED_EXTENSIONS
        and not f.stem.endswith("_enhanced")
        and not f.name.startswith(".")
    ])

    if not images:
        log.info(f"Không có ảnh nào trong: {input_dir}")
        return {"ok": [], "failed": [], "skipped": []}

    # Khởi tạo client 1 lần dùng cho cả batch
    client = genai.Client(api_key=config.GEMINI_API_KEY)

    log.info(f"\n{'═'*55}")
    log.info(f"  Batch — {len(images)} ảnh  |  Input : {input_dir.name}")
    log.info(f"                             Output: {output_dir}")
    log.info(f"{'═'*55}")

    results: dict[str, list] = {"ok": [], "failed": [], "skipped": []}

    for i, img in enumerate(images, 1):
        log.info(f"\n[{i}/{len(images)}]")
        out = _output_path(img, output_dir)

        if out.exists():
            log.info(f"   ⏭  Bỏ qua (đã có): {img.name}")
            results["skipped"].append(img.name)
            continue

        result = process_single(img, output_dir, client=client)
        (results["ok"] if result else results["failed"]).append(img.name)

        if i < len(images):
            time.sleep(config.BATCH_DELAY)

    # Tóm tắt
    log.info(f"\n{'═'*55}")
    log.info(f"  ✅  Thành công : {len(results['ok'])}")
    log.info(f"  ⏭   Bỏ qua    : {len(results['skipped'])}")
    log.info(f"  ❌  Thất bại  : {len(results['failed'])}")
    if results["failed"]:
        for f in results["failed"]:
            log.info(f"       - {f}")
    log.info(f"{'═'*55}\n")

    return results


# ─── CLI ─────────────────────────────────────────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(
        prog="sigon_enhance",
        description="SiGon Secondhand — Gemini AI Photo Enhancer",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""\
Ví dụ:
  python sigon_enhance.py                        # Batch cả thư mục input/
  python sigon_enhance.py 42_890k.jpg            # 1 file — Gemini tự nhận tên giày
  python sigon_enhance.py anh.jpg --size 42 --price 890k   # Ghi đè thủ công
  python sigon_enhance.py --input ./anh --out ./ket_qua

Quy ước tên file — chỉ cần SIZE và GIÁ:
  42_890k.jpg       →  Size 42   | 890.000đ   | Tên giày: Gemini tự nhận dạng
  38.5_650k.jpg     →  Size 38.5 | 650.000đ   | Tên giày: Gemini tự nhận dạng
  dep_350k.jpg      →  Dép       | 350.000đ   | Tên giày: Gemini tự nhận dạng
  44_lh.jpg         →  Size 44   | Liên hệ    | Tên giày: Gemini tự nhận dạng\
""",
    )
    parser.add_argument("image",   nargs="?", default=None,
                        help="Ảnh cần xử lý (bỏ trống = batch cả thư mục input)")
    parser.add_argument("--size",  default=None, help="Ghi đè size  (vd: 42)")
    parser.add_argument("--price", default=None, help="Ghi đè giá   (vd: 890k)")
    parser.add_argument("--input", default=None, help="Thư mục input (ghi đè config)")
    parser.add_argument("--out",   default=None, help="Thư mục output (ghi đè config)")
    args = parser.parse_args()

    # ── Banner ──
    print("""
╔══════════════════════════════════════════╗
║   SiGon — Gemini AI Photo Enhancer      ║
║   Giày Real · Giá Hời · Chất Sài Gòn   ║
╚══════════════════════════════════════════╝""")

    # ── Kiểm tra API key ──
    if config.GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        print("\n⚠️  Chưa điền Gemini API Key trong config.py")
        print("   Lấy key miễn phí tại: https://aistudio.google.com/apikey\n")
        sys.exit(1)

    if args.image:
        # ── Single file ──
        result = process_single(
            image_path=args.image,
            output_dir=args.out,
            size=args.size,
            price=args.price,
        )
        if result:
            print(f"\n✅ Xong!  File đã lưu:\n   {result}\n")
        else:
            print("\n❌ Thất bại. Xem log ở trên.\n")
            sys.exit(1)
    else:
        # ── Batch ──
        r = process_batch(input_dir=args.input, output_dir=args.out)
        if not r["ok"] and not r["skipped"]:
            sys.exit(1)


if __name__ == "__main__":
    main()

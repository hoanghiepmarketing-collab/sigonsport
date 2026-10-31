# =============================================================================
#  SiGon Secondhand — Gemini AI Image Enhancer
#  File: gemini_enhance.py
#
#  Nhận ảnh giày thô → Gọi Gemini AI → Trả về ảnh studio chuẩn SiGon
#  Giữ nguyên tình trạng thật của giày 2hand, chỉ cải thiện ánh sáng & bố cục
# =============================================================================

import os
import io
import time
import logging
from pathlib import Path
from PIL import Image
import google.generativeai as genai
from google.generativeai import types

import config

logger = logging.getLogger(__name__)

# ─── Gemini Prompt chuẩn SiGon ────────────────────────────────────────────────
SIGON_ENHANCE_PROMPT = """
Act as a professional footwear product photographer and premium e-commerce art director for a high-end vintage sneaker marketplace.
Your task is to generate a clean, luxury studio product photo from the uploaded shoe image.

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
- This is a SECONDHAND (2hand) sneaker: You MUST preserve the authentic original shape, real textures, exact colors, and actual pre-owned condition of the shoe (keep realistic wrinkles, minor scuffs, or natural wear from the original photo).
- Do NOT make the shoe look brand new by removing its real secondhand characteristics.
- Do NOT distort proportions, do NOT create extra shoes, and do NOT add random accessories.

GRAPHIC LAYOUT & BRANDING:
1. TOP LEFT CORNER: Place the "SiGon SECONDHAND" logo text in a clean, minimal style.
   - Use green color (#2D5535) for "Gon" and terracotta (#C44D28) for "Si".
   - Size: Small and elegant, aligned neatly in the corner.
2. BOTTOM LEFT CORNER (Product Info):
   - Automatically identify the sneaker model from the image and display the name in elegant bold typography.
   - Directly below the name, list the product details in a modern, clean, small font:
     SIZE: {size}
     PRICE: {price}

OUTPUT QUALITY:
- Ultra-realistic, 4K quality, extremely sharp and e-commerce ready.
- Zoom-in quality must remain crisp.
""".strip()


def setup_gemini():
    """Khởi tạo Gemini client."""
    genai.configure(api_key=config.GEMINI_API_KEY)
    logger.info(f"Gemini initialized — model: {config.GEMINI_MODEL}")


def parse_shoe_metadata(filename: str) -> dict:
    """
    Đọc metadata từ tên file.
    Format chuẩn: BRAND_MODEL_SIZE_PRICE_CONDITION.jpg
    Ví dụ: Nike_AirMax90_42_890k_85pct.jpg
            Adidas_Ultraboost_40_650k_90pct.jpg

    Trả về dict với keys: brand, model, size, price, condition, display_name
    """
    stem = Path(filename).stem
    parts = stem.split("_")

    metadata = {
        "brand": "Unknown",
        "model": "Sneaker",
        "size": "?",
        "price": "Liên hệ",
        "condition": "",
        "display_name": stem,
    }

    try:
        if len(parts) >= 1:
            metadata["brand"] = parts[0].replace("-", " ").title()
        if len(parts) >= 2:
            metadata["model"] = parts[1].replace("-", " ")
            metadata["display_name"] = f"{metadata['brand']} {metadata['model']}"
        if len(parts) >= 3:
            metadata["size"] = parts[2]
        if len(parts) >= 4:
            # Chuẩn hoá giá: "890k" → "890.000đ"
            price_raw = parts[3].lower().replace("k", "")
            try:
                price_num = int(price_raw)
                metadata["price"] = f"{price_num:,}đ".replace(",", ".")
            except ValueError:
                metadata["price"] = parts[3]
        if len(parts) >= 5:
            cond_raw = parts[4].lower().replace("pct", "%").replace("pc", "%")
            metadata["condition"] = f"Mới {cond_raw}" if "%" in cond_raw else cond_raw

    except Exception as e:
        logger.warning(f"Không parse được metadata từ '{filename}': {e}")

    return metadata


def enhance_with_gemini(
    image_path: str,
    size: str = None,
    price: str = None,
    max_retries: int = 3,
) -> bytes | None:
    """
    Gửi ảnh giày lên Gemini AI và nhận lại ảnh đã enhance.

    Args:
        image_path: Đường dẫn ảnh gốc
        size: Size giày (nếu None, đọc từ tên file)
        price: Giá (nếu None, đọc từ tên file)
        max_retries: Số lần thử lại khi lỗi

    Returns:
        bytes của ảnh PNG đã enhance, hoặc None nếu thất bại
    """
    image_path = Path(image_path)
    if not image_path.exists():
        logger.error(f"File không tồn tại: {image_path}")
        return None

    # Parse metadata từ tên file
    meta = parse_shoe_metadata(image_path.name)
    shoe_size  = size  or meta["size"]
    shoe_price = price or meta["price"]

    logger.info(f"Enhancing: {image_path.name} | Size: {shoe_size} | Giá: {shoe_price}")

    # Build prompt với thông tin sản phẩm
    prompt = SIGON_ENHANCE_PROMPT.format(size=shoe_size, price=shoe_price)

    # Load ảnh
    try:
        img = Image.open(image_path)
        # Convert sang RGB nếu cần (PNG có alpha channel)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        img_bytes = io.BytesIO()
        img.save(img_bytes, format="JPEG", quality=95)
        img_bytes.seek(0)
    except Exception as e:
        logger.error(f"Không mở được ảnh {image_path}: {e}")
        return None

    # Gọi Gemini API với retry
    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Gọi Gemini API — lần {attempt}/{max_retries}")

            model = genai.GenerativeModel(config.GEMINI_MODEL)

            image_part = {
                "mime_type": "image/jpeg",
                "data": img_bytes.getvalue(),
            }

            response = model.generate_content(
                [prompt, image_part],
                generation_config=genai.GenerationConfig(
                    response_modalities=["TEXT", "IMAGE"],
                    temperature=0.4,   # Thấp để giữ ổn định, không quá sáng tạo
                ),
            )

            # Tìm phần ảnh trong response
            for part in response.candidates[0].content.parts:
                if hasattr(part, "inline_data") and part.inline_data:
                    image_data = part.inline_data.data
                    logger.info(
                        f"✅ Gemini trả về ảnh — {len(image_data):,} bytes"
                    )
                    return image_data

            logger.warning("Gemini không trả về ảnh trong response này.")

        except Exception as e:
            logger.error(f"Lỗi Gemini lần {attempt}: {e}")
            if attempt < max_retries:
                wait = 2 ** attempt  # Exponential backoff: 2s, 4s, 8s
                logger.info(f"Thử lại sau {wait}s...")
                time.sleep(wait)

    logger.error(f"Gemini thất bại sau {max_retries} lần — bỏ qua {image_path.name}")
    return None


def enhance_and_save(
    input_path: str,
    output_dir: str,
    size: str = None,
    price: str = None,
) -> str | None:
    """
    Enhance ảnh và lưu vào output_dir.

    Returns:
        Đường dẫn file đã lưu, hoặc None nếu thất bại
    """
    input_path = Path(input_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Tên file output: thêm prefix "enhanced_"
    output_filename = f"enhanced_{input_path.stem}.jpg"
    output_path = output_dir / output_filename

    # Nếu đã enhance rồi thì bỏ qua
    if output_path.exists():
        logger.info(f"Đã tồn tại: {output_path} — bỏ qua")
        return str(output_path)

    # Gọi Gemini
    image_bytes = enhance_with_gemini(input_path, size=size, price=price)
    if not image_bytes:
        return None

    # Lưu file
    try:
        with open(output_path, "wb") as f:
            f.write(image_bytes)
        logger.info(f"Đã lưu: {output_path}")
        return str(output_path)
    except Exception as e:
        logger.error(f"Không lưu được file {output_path}: {e}")
        return None


def batch_enhance(
    input_dir: str,
    output_dir: str,
    delay_between: float = 3.0,
) -> list[dict]:
    """
    Xử lý toàn bộ ảnh trong một thư mục.

    Args:
        input_dir: Thư mục chứa ảnh gốc
        output_dir: Thư mục lưu ảnh đã enhance
        delay_between: Giây chờ giữa mỗi ảnh (tránh rate limit)

    Returns:
        List dict với kết quả từng file
    """
    input_dir  = Path(input_dir)
    results    = []
    image_files = [
        f for f in input_dir.iterdir()
        if f.suffix.lower() in config.ALLOWED_EXTENSIONS
        and not f.stem.startswith("enhanced_")
    ]

    logger.info(f"Batch enhance: {len(image_files)} ảnh trong '{input_dir}'")

    for i, img_file in enumerate(image_files, 1):
        logger.info(f"[{i}/{len(image_files)}] Xử lý: {img_file.name}")
        meta = parse_shoe_metadata(img_file.name)

        output_path = enhance_and_save(
            input_path=img_file,
            output_dir=output_dir,
            size=meta["size"],
            price=meta["price"],
        )

        results.append({
            "input": str(img_file),
            "output": output_path,
            "metadata": meta,
            "success": output_path is not None,
        })

        if i < len(image_files):
            time.sleep(delay_between)

    success_count = sum(1 for r in results if r["success"])
    logger.info(f"Batch xong: {success_count}/{len(image_files)} thành công")
    return results


# ─── Chạy trực tiếp để test ───────────────────────────────────────────────────
if __name__ == "__main__":
    import sys

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(config.LOG_FILE, encoding="utf-8"),
        ],
    )

    setup_gemini()

    if len(sys.argv) < 2:
        print(
            "\nCách dùng:\n"
            "  python gemini_enhance.py <ảnh.jpg>\n"
            "  python gemini_enhance.py Nike_AirMax90_42_890k_85pct.jpg\n"
            "  python gemini_enhance.py <thư_mục/>\n"
        )
        sys.exit(0)

    target = sys.argv[1]

    if os.path.isdir(target):
        # Batch mode
        results = batch_enhance(target, config.LOCAL_OUTPUT_FOLDER)
        for r in results:
            status = "✅" if r["success"] else "❌"
            print(f"{status} {Path(r['input']).name}")
    else:
        # Single file mode
        result = enhance_and_save(target, config.LOCAL_OUTPUT_FOLDER)
        if result:
            print(f"✅ Đã lưu: {result}")
        else:
            print("❌ Thất bại — xem log để biết chi tiết")

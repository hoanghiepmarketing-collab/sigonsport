# =============================================================================
#  SiGon Secondhand — Main Pipeline Orchestrator
#  File: pipeline.py
#
#  Chạy file này để khởi động toàn bộ hệ thống automation.
#  Watch thư mục → Gemini enhance → Upload Drive → Post Facebook + Instagram
#
#  Cách dùng:
#    python pipeline.py                  # Watch mode (chạy liên tục)
#    python pipeline.py --batch          # Xử lý hết ảnh trong thư mục rồi dừng
#    python pipeline.py --dry            # Dry run, không đăng thật
#    python pipeline.py --test-tokens    # Kiểm tra tất cả API tokens
# =============================================================================

import os
import sys
import time
import shutil
import logging
import argparse
import csv
from datetime import datetime
from pathlib import Path

# Các module SiGon
import config
from gemini_enhance import setup_gemini, parse_shoe_metadata, enhance_and_save
from facebook_poster import post_photo_to_album, verify_token as fb_verify
from instagram_poster import post_to_feed, post_to_story, verify_token as ig_verify

# ─── Logging setup ─────────────────────────────────────────────────────────────
def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(config.LOG_FILE, encoding="utf-8"),
        ],
    )

logger = logging.getLogger(__name__)


# ─── Inventory Logger ──────────────────────────────────────────────────────────
INVENTORY_CSV = "sigon_inventory.csv"
CSV_HEADERS   = [
    "timestamp", "filename", "brand", "model", "size", "price", "condition",
    "fb_status", "fb_post_id", "ig_feed_status", "ig_story_status",
    "enhanced_path",
]

def log_to_csv(row: dict):
    """Ghi kết quả xử lý vào CSV inventory."""
    file_exists = Path(INVENTORY_CSV).exists()
    with open(INVENTORY_CSV, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
        if not file_exists:
            writer.writeheader()
        writer.writerow({k: row.get(k, "") for k in CSV_HEADERS})


# ─── Core: Xử lý 1 đôi giày ──────────────────────────────────────────────────
def process_shoe(image_path: str, dry_run: bool = False) -> dict:
    """
    Pipeline hoàn chỉnh cho 1 ảnh giày:
    1. Parse metadata từ tên file
    2. Gemini AI enhance
    3. Post Facebook Album
    4. Post Instagram Feed + Story

    Returns:
        dict với toàn bộ kết quả
    """
    image_path = Path(image_path)
    logger.info(f"\n{'='*60}")
    logger.info(f"🔄 Bắt đầu xử lý: {image_path.name}")
    logger.info(f"{'='*60}")

    result = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "filename": image_path.name,
        "brand": "", "model": "", "size": "", "price": "", "condition": "",
        "fb_status": "SKIP", "fb_post_id": "",
        "ig_feed_status": "SKIP", "ig_story_status": "SKIP",
        "enhanced_path": "",
    }

    # ── Bước 1: Parse metadata ──
    meta = parse_shoe_metadata(image_path.name)
    result.update({
        "brand": meta["brand"],
        "model": meta["model"],
        "size": meta["size"],
        "price": meta["price"],
        "condition": meta["condition"],
    })
    logger.info(
        f"📋 Metadata: {meta['brand']} {meta['model']} | "
        f"Size {meta['size']} | Giá {meta['price']} | {meta['condition']}"
    )

    # ── Bước 2: Gemini AI Enhance ──
    logger.info("🤖 Gemini AI đang enhance ảnh...")
    enhanced_path = enhance_and_save(
        input_path=str(image_path),
        output_dir=config.LOCAL_OUTPUT_FOLDER,
        size=meta["size"],
        price=meta["price"],
    )

    if not enhanced_path:
        logger.error("❌ Gemini enhance thất bại — dừng xử lý đôi giày này")
        result["fb_status"] = "FAILED_ENHANCE"
        log_to_csv(result)
        return result

    result["enhanced_path"] = enhanced_path
    logger.info(f"✅ Ảnh enhanced: {enhanced_path}")

    # Delay nhỏ trước khi đăng
    time.sleep(1)

    # ── Bước 3: Facebook ──
    if config.ENABLE_FACEBOOK:
        logger.info("📘 Đăng lên Facebook Album...")
        fb_result = post_photo_to_album(enhanced_path, meta, dry_run=dry_run)
        result["fb_status"]  = "OK" if fb_result["success"] else "FAILED"
        result["fb_post_id"] = fb_result.get("post_id", "")
        if fb_result["success"]:
            logger.info(f"✅ Facebook OK — {fb_result['post_id']}")
        else:
            logger.error(f"❌ Facebook lỗi: {fb_result.get('error')}")
        time.sleep(config.POST_DELAY_SECONDS)

    # ── Bước 4: Instagram ──
    if config.ENABLE_INSTAGRAM:
        # Feed
        logger.info("📷 Đăng lên Instagram Feed...")
        ig_feed = post_to_feed(enhanced_path, meta, dry_run=dry_run)
        result["ig_feed_status"] = "OK" if ig_feed["success"] else "FAILED"
        if ig_feed["success"]:
            logger.info(f"✅ Instagram Feed OK")
        else:
            logger.error(f"❌ Instagram Feed lỗi: {ig_feed.get('error')}")

        time.sleep(config.POST_DELAY_SECONDS)

        # Story
        logger.info("📷 Đăng lên Instagram Story...")
        ig_story = post_to_story(enhanced_path, meta, dry_run=dry_run)
        result["ig_story_status"] = "OK" if ig_story["success"] else "FAILED"
        if ig_story["success"]:
            logger.info(f"✅ Instagram Story OK — nhớ add vào Highlight size {meta['size']} cuối tuần!")
        else:
            logger.error(f"❌ Instagram Story lỗi: {ig_story.get('error')}")

    # ── Bước 5: Di chuyển ảnh gốc vào thư mục POSTED ──
    posted_dir = Path(config.LOCAL_POSTED_FOLDER)
    posted_dir.mkdir(parents=True, exist_ok=True)
    posted_path = posted_dir / image_path.name
    try:
        shutil.move(str(image_path), str(posted_path))
        logger.info(f"📁 Ảnh gốc đã chuyển vào POSTED: {posted_path}")
    except Exception as e:
        logger.warning(f"Không di chuyển được ảnh gốc: {e}")

    # ── Log kết quả ──
    log_to_csv(result)
    logger.info(
        f"\n📊 Tóm tắt {image_path.name}:\n"
        f"   Facebook:  {result['fb_status']}\n"
        f"   IG Feed:   {result['ig_feed_status']}\n"
        f"   IG Story:  {result['ig_story_status']}\n"
    )

    return result


# ─── Watch Mode ────────────────────────────────────────────────────────────────
def watch_folder(dry_run: bool = False):
    """
    Theo dõi thư mục LOCAL_WATCH_FOLDER liên tục.
    Khi có ảnh mới → tự động xử lý.
    """
    watch_dir = Path(config.LOCAL_WATCH_FOLDER)
    watch_dir.mkdir(parents=True, exist_ok=True)
    Path(config.LOCAL_OUTPUT_FOLDER).mkdir(parents=True, exist_ok=True)
    Path(config.LOCAL_POSTED_FOLDER).mkdir(parents=True, exist_ok=True)

    logger.info(f"👀 Watch mode — Theo dõi: {watch_dir}")
    logger.info("Thả ảnh giày vào thư mục trên để bắt đầu xử lý tự động.")
    logger.info("Nhấn Ctrl+C để dừng.\n")

    processed = set()  # Tránh xử lý lại file đã làm

    while True:
        try:
            images = [
                f for f in watch_dir.iterdir()
                if f.suffix.lower() in config.ALLOWED_EXTENSIONS
                and f.name not in processed
                and not f.name.startswith(".")
            ]

            for img in sorted(images):
                # Đợi file copy xong (check size ổn định)
                size1 = img.stat().st_size
                time.sleep(1)
                if img.stat().st_size != size1:
                    continue  # File đang copy, bỏ qua lần này

                process_shoe(str(img), dry_run=dry_run)
                processed.add(img.name)
                time.sleep(2)

            time.sleep(3)  # Check thư mục mỗi 3 giây

        except KeyboardInterrupt:
            logger.info("\nĐã dừng watch mode.")
            break
        except Exception as e:
            logger.error(f"Lỗi watch loop: {e}")
            time.sleep(5)


# ─── Batch Mode ────────────────────────────────────────────────────────────────
def batch_process(dry_run: bool = False):
    """Xử lý hết ảnh trong thư mục rồi dừng."""
    watch_dir = Path(config.LOCAL_WATCH_FOLDER)
    images = [
        f for f in watch_dir.iterdir()
        if f.suffix.lower() in config.ALLOWED_EXTENSIONS
    ]

    if not images:
        logger.info(f"Không có ảnh nào trong {watch_dir}")
        return

    logger.info(f"Batch mode: {len(images)} ảnh cần xử lý")
    results = []

    for i, img in enumerate(sorted(images), 1):
        logger.info(f"\n[{i}/{len(images)}]")
        result = process_shoe(str(img), dry_run=dry_run)
        results.append(result)
        if i < len(images):
            time.sleep(3)

    # Tóm tắt
    ok    = sum(1 for r in results if r["fb_status"] == "OK")
    total = len(results)
    logger.info(f"\n{'='*60}")
    logger.info(f"✅ Batch hoàn tất: {ok}/{total} thành công")
    logger.info(f"📋 Chi tiết xem file: {INVENTORY_CSV}")
    logger.info(f"{'='*60}")


# ─── Test Tokens ───────────────────────────────────────────────────────────────
def test_tokens():
    """Kiểm tra tất cả API tokens."""
    print("\n" + "="*50)
    print("🔑 Kiểm tra API Tokens")
    print("="*50)

    print("\n[1] Gemini AI")
    try:
        import google.generativeai as genai
        genai.configure(api_key=config.GEMINI_API_KEY)
        m = genai.GenerativeModel("gemini-1.5-flash")
        r = m.generate_content("Say OK")
        print(f"   ✅ Gemini OK — {r.text[:30]}")
    except Exception as e:
        print(f"   ❌ Gemini lỗi: {e}")

    print("\n[2] Facebook Page")
    if fb_verify():
        print("   ✅ Facebook OK")
    else:
        print("   ❌ Facebook lỗi")

    print("\n[3] Instagram")
    if ig_verify():
        print("   ✅ Instagram OK")
    else:
        print("   ❌ Instagram lỗi")

    print("\n" + "="*50 + "\n")


# ─── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    setup_logging()

    parser = argparse.ArgumentParser(
        description="SiGon Secondhand — Photo Automation Pipeline"
    )
    parser.add_argument(
        "--batch", action="store_true",
        help="Xử lý hết ảnh trong thư mục rồi dừng (mặc định: watch liên tục)"
    )
    parser.add_argument(
        "--dry", action="store_true",
        help="Dry run — enhance ảnh nhưng không đăng lên mạng xã hội"
    )
    parser.add_argument(
        "--test-tokens", action="store_true",
        help="Kiểm tra tất cả API tokens rồi thoát"
    )
    parser.add_argument(
        "--file", type=str, default=None,
        help="Xử lý 1 file cụ thể: --file path/to/shoe.jpg"
    )
    args = parser.parse_args()

    print("""
╔══════════════════════════════════════════╗
║   SiGon Secondhand — Photo Automation   ║
║   Giày Real — Giá Hời — Chất Sài Gòn   ║
╚══════════════════════════════════════════╝
    """)

    if args.test_tokens:
        test_tokens()
        sys.exit(0)

    # Khởi tạo Gemini
    setup_gemini()

    if args.file:
        # Xử lý 1 file cụ thể
        logger.info(f"Xử lý file: {args.file}")
        process_shoe(args.file, dry_run=args.dry)

    elif args.batch:
        logger.info("Chế độ: Batch")
        batch_process(dry_run=args.dry)

    else:
        logger.info("Chế độ: Watch (liên tục)")
        watch_folder(dry_run=args.dry)

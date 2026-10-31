#!/usr/bin/env python3
# =============================================================================
#  SiGon Secondhand — Gemini AI Photo Enhancer
#  Phiên bản: 2.0  (hỗ trợ Google Drive)
#
#  Cách dùng — LOCAL:
#    python sigon_enhance.py                          # Batch cả thư mục input/
#    python sigon_enhance.py anh_giay.jpg             # Single: 1 file
#    python sigon_enhance.py anh_giay.jpg --size 42 --price 890k
#
#  Cách dùng — GOOGLE DRIVE (USE_GOOGLE_DRIVE=True trong config.py):
#    python sigon_enhance.py --drive                  # Batch từ Drive folder
#    python sigon_enhance.py --drive --file 42_890k.jpg  # Single file trên Drive
# =============================================================================

import sys
import io
import re
import time
import base64
import argparse
import logging
from pathlib import Path

# ── Kiểm tra thư viện bắt buộc ───────────────────────────────────────────────
try:
    from google import genai
    from google.genai import types as genai_types
except ImportError:
    print("\n Thieu thu vien. Chay lenh sau roi thu lai:")
    print("   pip install -r requirements.txt\n")
    sys.exit(1)

try:
    from PIL import Image
except ImportError:
    print("\n Thieu Pillow. Chay: pip install Pillow\n")
    sys.exit(1)

import config

# ── Kiểm tra thư viện Drive (chỉ cần khi dùng Drive mode) ───────────────────
def _check_drive_libs():
    try:
        from googleapiclient.discovery import build
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from google.auth.transport.requests import Request
        return True
    except ImportError:
        print("\n Thieu thu vien Google Drive. Chay:")
        print("   pip install google-api-python-client google-auth-oauthlib\n")
        return False


# ─── Logging ─────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(message)s",
    datefmt="%H:%M:%S",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger(__name__)


# ─── Gemini Prompt ───────────────────────────────────────────────────────────
PROMPT_TEMPLATE = (
    "Act as a professional footwear product photographer and premium e-commerce art director "
    "for a high-end vintage sneaker marketplace. Your task is to generate a clean, luxury "
    "studio product photo from the uploaded shoe image.\n\n"
    "STYLE & MOOD:\n"
    "- Minimalist Korean-inspired sneaker campaign, premium secondhand sneaker store aesthetic.\n"
    "- Soft luxury lighting with a modern fashion editorial look (High-end Instagram shop style).\n"
    "- Sharp details, clean aesthetic, and realistic textures.\n"
    "- Overall aesthetic: clean, premium, and professional sneaker catalog photography.\n\n"
    "COMPOSITION:\n"
    "- The shoe must be centered horizontally in a side profile angle (exactly like a classic sneaker catalog shot).\n"
    "- Leave generous, balanced negative space around the shoe.\n"
    "- Export in vertical ratio 4:5, keeping the entire shoe fully visible.\n\n"
    "BACKGROUND & LIGHTING:\n"
    "- Pure clean white seamless studio background with NO floor texture or distracting elements.\n"
    "- Lighting: Soft diffused studio lighting. Bright but not overexposed, with NO harsh reflections.\n"
    "- Adjust the lighting on the shoe to be slightly brighter to enhance visual impact and premium feel.\n"
    "- Include only a subtle, realistic soft shadow directly under the shoe to ground it.\n\n"
    "PHOTO RETOUCHING & AUTHENTICITY (CRITICAL):\n"
    "- This is a SECONDHAND (2hand) sneaker: You MUST preserve the authentic original shape, "
    "real textures, exact colors, and actual pre-owned condition of the shoe "
    "(keep realistic wrinkles, minor scuffs, or natural wear from the original photo).\n"
    "- Do NOT make the shoe look brand new by removing its real secondhand characteristics.\n"
    "- Do NOT distort proportions, do NOT create extra shoes, and do NOT add random accessories.\n\n"
    "GRAPHIC LAYOUT & BRANDING:\n"
    "1. TOP LEFT CORNER: Place the 'SiGon SECONDHAND' logo text in a clean, minimal style.\n"
    "   - Use green color (#2D5535) for 'Gon' and terracotta (#C44D28) for 'Si'.\n"
    "   - Size: Small and elegant, aligned neatly in the corner.\n"
    "2. BOTTOM LEFT CORNER (Product Info):\n"
    "   - SHOE IDENTIFICATION (CRITICAL): You must visually analyze the shoe in the uploaded "
    "image and use your knowledge base to identify the exact brand and model name. "
    "Look carefully at the silhouette, sole unit, logo placement, toe box shape, heel design, "
    "lace system, and any visible branding details. "
    "Examples of expected output: 'Nike Air Max 90 Infrared', "
    "'Adidas Stan Smith White Green', 'Vans Old Skool Black White', "
    "'Converse Chuck Taylor All Star 70 Hi', 'New Balance 574 Grey Navy'.\n"
    "   - If you can identify the colorway name, include it after the model name.\n"
    "   - If you are not 100% certain of the exact model, write your best visual match "
    "prefixed with the brand name -- never leave this field blank or write Unknown.\n"
    "   - Display the identified name in elegant bold typography.\n"
    "   - Directly below the shoe name, list in a modern, clean, small font:\n"
    "     SIZE: {size}\n"
    "     PRICE: {price}\n\n"
    "OUTPUT QUALITY:\n"
    "- Ultra-realistic, 4K quality, extremely sharp and e-commerce ready. "
    "Zoom-in quality must remain crisp."
)


# ─── Helpers: metadata từ tên file ───────────────────────────────────────────
def _format_price(raw: str) -> str:
    raw = raw.lower().strip()
    if not raw or raw in ("lienhe", "lh"):
        return "Lien he"
    try:
        digits = int(re.sub(r"[^0-9]", "", raw))
        if "k" in raw or digits < 10_000:
            digits *= 1_000
        return f"{digits:,}d".replace(",", ".")
    except ValueError:
        return raw


def parse_filename(filename: str) -> dict:
    stem = Path(filename).stem
    # Bỏ đuôi _enhanced nếu có
    if stem.endswith("_enhanced"):
        stem = stem[:-9]
    parts = stem.split("_")

    meta = {"size": "?", "price": "Lien he"}

    if len(parts) >= 1:
        s = parts[0].lower().strip()
        if s in ("dep", "slip"):
            meta["size"] = "Dep"
        else:
            try:
                sz = float(s)
                if 28 <= sz <= 55:
                    meta["size"] = parts[0]
            except ValueError:
                pass

    if len(parts) >= 2:
        p = parts[1].lower().strip()
        if "k" in p or p in ("lh", "lienhe"):
            meta["price"] = _format_price(p)

    return meta


# ─── Helpers: ảnh local ──────────────────────────────────────────────────────
def _to_jpeg_bytes(image_path: Path) -> bytes:
    img = Image.open(image_path)
    if img.mode in ("RGBA", "P", "LA"):
        img = img.convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=92)
    return buf.getvalue()


def _raw_bytes_to_jpeg(raw: bytes) -> bytes:
    """Chuyển bytes bất kỳ (PNG/WEBP/...) sang JPEG bytes."""
    img = Image.open(io.BytesIO(raw))
    if img.mode in ("RGBA", "P", "LA"):
        img = img.convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=92)
    return buf.getvalue()


def _save_jpeg(image_data: bytes, output_path: Path) -> bool:
    try:
        img = Image.open(io.BytesIO(image_data))
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(output_path, format="JPEG",
                 quality=config.OUTPUT_QUALITY, optimize=True)
        kb = output_path.stat().st_size // 1024
        log.info(f"   [OK] Da luu: {output_path.name}  ({kb} KB)")
        return True
    except Exception as e:
        log.error(f"   [FAIL] Loi luu file: {e}")
        try:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(image_data)
            return True
        except Exception as e2:
            log.error(f"   [FAIL] Fallback that bai: {e2}")
            return False


def _output_path(input_path: Path, output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    return output_dir / f"{input_path.stem}_enhanced.jpg"


# ─── Google Drive helpers ─────────────────────────────────────────────────────
DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive"]


def get_drive_service():
    """
    Xác thực OAuth2 và trả về Drive service object.
    - Lần đầu: mở trình duyệt để đăng nhập Google.
    - Các lần sau: dùng token.json đã lưu, tự refresh.
    """
    from googleapiclient.discovery import build
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    import os

    creds = None
    token_path = config.DRIVE_TOKEN_FILE
    creds_path = config.DRIVE_CREDENTIALS_FILE

    if not Path(creds_path).exists():
        log.error(f"Khong tim thay file credentials: {creds_path}")
        log.error("Xem huong dan: python sigon_enhance.py --help-drive")
        sys.exit(1)

    if Path(token_path).exists():
        creds = Credentials.from_authorized_user_file(token_path, DRIVE_SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            log.info("  -> Lam moi Google token...")
            creds.refresh(Request())
        else:
            log.info("  -> Mo trinh duyet de dang nhap Google Drive...")
            flow = InstalledAppFlow.from_client_secrets_file(creds_path, DRIVE_SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, "w") as token:
            token.write(creds.to_json())
        log.info(f"  -> Token da luu tai: {token_path}")

    return build("drive", "v3", credentials=creds)


def list_drive_images(service, folder_id: str, _depth: int = 0) -> list:
    """
    Liệt kê TẤT CẢ ảnh trong Drive folder — tìm đệ quy vào subfolder.
    Bỏ qua file đã có đuôi _enhanced.
    Trả về list: [{"id": ..., "name": ..., "mimeType": ..., "folder_id": ...}, ...]
    """
    results = []
    subfolders = []
    page_token = None

    indent = "  " * _depth

    while True:
        resp = service.files().list(
            q=f"'{folder_id}' in parents and trashed=false",
            spaces="drive",
            fields="nextPageToken, files(id, name, mimeType)",
            pageToken=page_token,
            includeItemsFromAllDrives=True,
            supportsAllDrives=True,
        ).execute()

        for f in resp.get("files", []):
            name = f["name"]
            mime = f.get("mimeType", "")

            # Là subfolder → tìm tiếp bên trong
            if mime == "application/vnd.google-apps.folder":
                subfolders.append(f)
                continue

            # Chỉ lấy file ảnh đúng định dạng, bỏ _enhanced
            ext = Path(name).suffix.lower()
            if ext not in config.ALLOWED_EXTENSIONS:
                continue
            if Path(name).stem.endswith("_enhanced"):
                continue

            # Ghi nhớ folder_id để upload kết quả về đúng chỗ
            f["folder_id"] = folder_id
            results.append(f)

        page_token = resp.get("nextPageToken")
        if not page_token:
            break

    # Tìm đệ quy vào từng subfolder
    for sf in subfolders:
        log.info(f"{indent}  -> Thu muc con: {sf['name']}")
        sub_results = list_drive_images(service, sf["id"], _depth + 1)
        results.extend(sub_results)

    return results


def list_drive_enhanced_names(service, folder_id: str) -> set:
    """Trả về set tên file _enhanced đã có trong output folder."""
    query = (
        f"'{folder_id}' in parents and name contains '_enhanced' "
        f"and trashed=false"
    )
    resp = service.files().list(
        q=query,
        spaces="drive",
        fields="files(name)",
        includeItemsFromAllDrives=True,
        supportsAllDrives=True,
    ).execute()
    return {f["name"] for f in resp.get("files", [])}


def download_drive_file(service, file_id: str) -> bytes:
    """Tải file từ Drive về dạng bytes."""
    request = service.files().get_media(
        fileId=file_id,
        supportsAllDrives=True,
    )
    return request.execute()


def upload_to_drive(service, filename: str, img_bytes: bytes, folder_id: str) -> str:
    """
    Upload ảnh JPEG lên Drive folder.
    Trả về file ID vừa tạo.
    """
    from googleapiclient.http import MediaIoBaseUpload

    file_metadata = {
        "name": filename,
        "parents": [folder_id],
    }
    media = MediaIoBaseUpload(
        io.BytesIO(img_bytes),
        mimetype="image/jpeg",
        resumable=False,
    )
    created = service.files().create(
        body=file_metadata,
        media_body=media,
        fields="id, name",
        supportsAllDrives=True,
    ).execute()
    return created.get("id", "")


# ─── Gemini call ─────────────────────────────────────────────────────────────
def _call_gemini(client: genai.Client, img_bytes: bytes, prompt: str):
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
        image_config=genai_types.ImageConfig(aspect_ratio="4:5"),
    )

    response = client.models.generate_content(
        model=config.GEMINI_MODEL,
        contents=contents,
        config=cfg,
    )

    for part in response.parts:
        if part.inline_data and part.inline_data.data:
            return part.inline_data.data

    return None


# ─── Core: xử lý 1 ảnh (local) ───────────────────────────────────────────────
def process_single(image_path, output_dir=None, size=None, price=None, client=None):
    """Enhance 1 ảnh từ đường dẫn local."""
    image_path = Path(image_path)
    output_dir = Path(output_dir or config.OUTPUT_FOLDER)

    if not image_path.exists():
        log.error(f"File khong ton tai: {image_path}")
        return None

    meta = parse_filename(image_path.name)
    final_size  = size or meta["size"]
    final_price = _format_price(price) if price else meta["price"]

    log.info(f"\n{'─'*55}")
    log.info(f"[ANH]  {image_path.name}")
    log.info(f"    Size: {final_size}  |  Gia: {final_price}")
    log.info(f"    Ten giay: Gemini se tu nhan dang tu anh")
    log.info(f"{'─'*55}")

    out = _output_path(image_path, output_dir)
    if out.exists():
        log.info("   [SKIP] Da co output -- bo qua (xoa file cu neu muon lam lai)")
        return out

    if client is None:
        client = genai.Client(api_key=config.GEMINI_API_KEY)

    try:
        img_bytes = _to_jpeg_bytes(image_path)
    except Exception as e:
        log.error(f"   [FAIL] Khong mo duoc anh: {e}")
        return None

    prompt = PROMPT_TEMPLATE.format(size=final_size, price=final_price)
    result_bytes = _retry_gemini(client, img_bytes, prompt, image_path.name)

    if not result_bytes:
        return None

    return out if _save_jpeg(result_bytes, out) else None


# ─── Core: xử lý 1 ảnh từ Drive ──────────────────────────────────────────────
def process_single_drive(
    service,
    client: genai.Client,
    file_info: dict,
    output_folder_id: str,
    already_enhanced: set,
    size: str = None,
    price: str = None,
) -> bool:
    """
    Enhance 1 ảnh từ Google Drive và upload kết quả lên Drive.

    Args:
        service         : Drive service object
        client          : Gemini client
        file_info       : {"id": ..., "name": ..., "mimeType": ...}
        output_folder_id: ID thư mục Drive để upload kết quả
        already_enhanced: set tên file _enhanced đã có (để skip)
        size, price     : Override metadata (tuỳ chọn)

    Returns:
        True nếu thành công, False nếu thất bại.
    """
    filename = file_info["name"]
    file_id  = file_info["id"]

    meta = parse_filename(filename)
    final_size  = size or meta["size"]
    final_price = _format_price(price) if price else meta["price"]

    stem = Path(filename).stem
    output_name = f"{stem}_enhanced.jpg"

    log.info(f"\n{'─'*55}")
    log.info(f"[ANH]  {filename}  (Drive)")
    log.info(f"    Size: {final_size}  |  Gia: {final_price}")
    log.info(f"    Ten giay: Gemini se tu nhan dang tu anh")
    log.info(f"{'─'*55}")

    if output_name in already_enhanced:
        log.info(f"   [SKIP] Da co '{output_name}' tren Drive -- bo qua")
        return True

    # Tải ảnh gốc về
    try:
        log.info("   -> Tai anh tu Drive...")
        raw_bytes = download_drive_file(service, file_id)
        img_bytes = _raw_bytes_to_jpeg(raw_bytes)
        log.info(f"   -> Tai xong ({len(raw_bytes)//1024} KB)")
    except Exception as e:
        log.error(f"   [FAIL] Khong tai duoc anh tu Drive: {e}")
        return False

    prompt = PROMPT_TEMPLATE.format(size=final_size, price=final_price)
    result_bytes = _retry_gemini(client, img_bytes, prompt, filename)

    if not result_bytes:
        return False

    # Chuyển kết quả sang JPEG chất lượng cao
    try:
        img_out = Image.open(io.BytesIO(result_bytes))
        if img_out.mode in ("RGBA", "P"):
            img_out = img_out.convert("RGB")
        buf = io.BytesIO()
        img_out.save(buf, format="JPEG", quality=config.OUTPUT_QUALITY, optimize=True)
        final_bytes = buf.getvalue()
    except Exception:
        final_bytes = result_bytes  # fallback: dùng thẳng bytes từ Gemini

    # Upload lên Drive
    try:
        log.info(f"   -> Upload '{output_name}' len Drive...")
        new_id = upload_to_drive(service, output_name, final_bytes, output_folder_id)
        kb = len(final_bytes) // 1024
        log.info(f"   [OK] Upload thanh cong  ({kb} KB)  ID: {new_id}")
        already_enhanced.add(output_name)  # cập nhật cache
        return True
    except Exception as e:
        log.error(f"   [FAIL] Khong upload duoc: {e}")
        return False


# ─── Retry logic chung ───────────────────────────────────────────────────────
def _retry_gemini(client, img_bytes, prompt, label="") -> bytes | None:
    """Gọi Gemini với retry. Trả về bytes ảnh hoặc None."""
    for attempt in range(1, config.MAX_RETRIES + 1):
        try:
            log.info(f"   -> Gemini dang xu ly... (lan {attempt}/{config.MAX_RETRIES})")
            result = _call_gemini(client, img_bytes, prompt)
            if result:
                kb = len(result) // 1024
                log.info(f"   [OK] Nhan duoc anh tu Gemini  ({kb} KB)")
                return result
            else:
                log.warning("   [!] Gemini khong tra ve anh lan nay.")
        except Exception as e:
            log.error(f"   [FAIL] Loi lan {attempt}: {e}")

        if attempt < config.MAX_RETRIES:
            wait = 2 ** attempt
            log.info(f"   -> Thu lai sau {wait}s...")
            time.sleep(wait)

    log.error(f"   [FAIL] That bai sau {config.MAX_RETRIES} lan: {label}")
    return None


# ─── Batch local ─────────────────────────────────────────────────────────────
def process_batch(input_dir=None, output_dir=None) -> dict:
    """Xử lý toàn bộ ảnh trong thư mục local."""
    input_dir  = Path(input_dir or config.INPUT_FOLDER)
    output_dir = Path(output_dir or config.OUTPUT_FOLDER)

    if not input_dir.exists():
        log.error(f"Thu muc khong ton tai: {input_dir}")
        return {"ok": [], "failed": [], "skipped": []}

    images = sorted([
        f for f in input_dir.iterdir()
        if f.suffix.lower() in config.ALLOWED_EXTENSIONS
        and not f.stem.endswith("_enhanced")
        and not f.name.startswith(".")
    ])

    if not images:
        log.info(f"Khong co anh nao trong: {input_dir}")
        return {"ok": [], "failed": [], "skipped": []}

    client = genai.Client(api_key=config.GEMINI_API_KEY)

    log.info(f"\n{'='*55}")
    log.info(f"  Batch LOCAL -- {len(images)} anh")
    log.info(f"  Input : {input_dir}")
    log.info(f"  Output: {output_dir}")
    log.info(f"{'='*55}")

    results = {"ok": [], "failed": [], "skipped": []}

    for i, img in enumerate(images, 1):
        log.info(f"\n[{i}/{len(images)}]")
        out = _output_path(img, output_dir)

        if out.exists():
            log.info(f"   [SKIP] Bo qua (da co): {img.name}")
            results["skipped"].append(img.name)
            continue

        result = process_single(img, output_dir, client=client)
        (results["ok"] if result else results["failed"]).append(img.name)

        if i < len(images):
            time.sleep(config.BATCH_DELAY)

    _print_summary(results)
    return results


# ─── Batch Google Drive ───────────────────────────────────────────────────────
def process_batch_drive(single_file: str = None) -> dict:
    """
    Xử lý ảnh từ Google Drive.
    single_file: tên file cụ thể trên Drive (None = batch toàn bộ folder).
    """
    if not _check_drive_libs():
        sys.exit(1)

    log.info("\n  -> Ket noi Google Drive...")
    service = get_drive_service()
    client  = genai.Client(api_key=config.GEMINI_API_KEY)

    input_id  = config.DRIVE_INPUT_FOLDER_ID
    output_id = config.DRIVE_OUTPUT_FOLDER_ID

    log.info("  -> Lay danh sach anh tu Drive...")
    all_images = list_drive_images(service, input_id)

    if single_file:
        all_images = [f for f in all_images if f["name"] == single_file]
        if not all_images:
            log.error(f"Khong tim thay '{single_file}' trong Drive folder")
            return {"ok": [], "failed": [single_file], "skipped": []}

    if not all_images:
        log.info("Khong co anh nao can xu ly trong Drive folder.")
        return {"ok": [], "failed": [], "skipped": []}

    # Cache danh sách _enhanced đã có trong output folder
    log.info("  -> Kiem tra anh da enhance trong output folder...")
    already_enhanced = list_drive_enhanced_names(service, output_id)

    log.info(f"\n{'='*55}")
    log.info(f"  Batch DRIVE -- {len(all_images)} anh")
    log.info(f"  Input folder ID : {input_id}")
    log.info(f"  Output folder ID: {output_id}")
    log.info(f"  Da co enhanced  : {len(already_enhanced)} file")
    log.info(f"{'='*55}")

    results = {"ok": [], "failed": [], "skipped": []}

    for i, file_info in enumerate(all_images, 1):
        log.info(f"\n[{i}/{len(all_images)}]")

        # Upload về đúng subfolder chứa ảnh gốc
        target_folder = file_info.get("folder_id", output_id)

        ok = process_single_drive(
            service=service,
            client=client,
            file_info=file_info,
            output_folder_id=target_folder,
            already_enhanced=already_enhanced,
        )

        name = file_info["name"]
        if ok:
            stem = Path(name).stem
            output_name = f"{stem}_enhanced.jpg"
            if output_name in already_enhanced and name not in results["ok"]:
                results["skipped"].append(name)
            else:
                results["ok"].append(name)
        else:
            results["failed"].append(name)

        if i < len(all_images):
            time.sleep(config.BATCH_DELAY)

    _print_summary(results)
    return results


# ─── In tóm tắt ──────────────────────────────────────────────────────────────
def _print_summary(results: dict):
    log.info(f"\n{'='*55}")
    log.info(f"  [OK]   Thanh cong : {len(results['ok'])}")
    log.info(f"  [SKIP] Bo qua     : {len(results['skipped'])}")
    log.info(f"  [FAIL] That bai   : {len(results['failed'])}")
    if results["failed"]:
        for f in results["failed"]:
            log.info(f"       - {f}")
    log.info(f"{'='*55}\n")


# ─── CLI ─────────────────────────────────────────────────────────────────────
HELP_DRIVE = """
=== Hướng dẫn cài đặt Google Drive ===

Bước 1 — Bật Google Drive API:
  1. Vào: https://console.cloud.google.com/
  2. Tạo project mới (hoặc chọn project có sẵn)
  3. APIs & Services > Enable APIs > tìm "Google Drive API" > Enable

Bước 2 — Tạo OAuth2 credentials:
  1. APIs & Services > Credentials > Create Credentials > OAuth client ID
  2. Application type: Desktop app
  3. Download JSON > đổi tên thành credentials.json
  4. Đặt file vào: H:\\Dự án Claude\\Giày\\tool\\credentials.json

Bước 3 — Lấy Folder ID:
  1. Mở thư mục ảnh gốc trên Google Drive
  2. URL dạng: drive.google.com/drive/folders/<FOLDER_ID>
  3. Copy FOLDER_ID vào config.py:
       DRIVE_INPUT_FOLDER_ID  = "abc123..."
       DRIVE_OUTPUT_FOLDER_ID = "xyz789..."

Bước 4 — Bật Drive mode:
  Trong config.py:
       USE_GOOGLE_DRIVE = True

Bước 5 — Chạy lần đầu:
  python sigon_enhance.py --drive
  (Trình duyệt sẽ mở để đăng nhập Google — chỉ cần làm 1 lần)
"""


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="sigon_enhance",
        description="SiGon Secondhand -- Gemini AI Photo Enhancer v2.0",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Vi du LOCAL:\n"
            "  python sigon_enhance.py                     # Batch ca thu muc input\n"
            "  python sigon_enhance.py 42_890k.jpg         # 1 file cu the\n"
            "  python sigon_enhance.py anh.jpg --size 42 --price 890k\n\n"
            "Vi du GOOGLE DRIVE:\n"
            "  python sigon_enhance.py --drive             # Batch tu Drive folder\n"
            "  python sigon_enhance.py --drive --file 42_890k.jpg\n\n"
            "Xem huong dan cai Drive:\n"
            "  python sigon_enhance.py --help-drive\n"
        ),
    )

    parser.add_argument(
        "image",
        nargs="?",
        help="[LOCAL] Duong dan anh can xu ly (bo trong = batch ca thu muc)",
    )
    parser.add_argument(
        "--drive",
        action="store_true",
        default=getattr(config, "USE_GOOGLE_DRIVE", False),
        help="Dung Google Drive mode (doc tu Drive, upload ket qua len Drive)",
    )
    parser.add_argument(
        "--file",
        dest="drive_file",
        help="[DRIVE] Ten file cu the tren Drive can xu ly",
    )
    parser.add_argument(
        "--size",
        help="Ghi de size (vi du: 42, 38.5, dep)",
    )
    parser.add_argument(
        "--price",
        help="Ghi de gia (vi du: 890k, 1200k, lh)",
    )
    parser.add_argument(
        "--input",
        dest="input_dir",
        help=f"[LOCAL] Thu muc anh goc (mac dinh: {config.INPUT_FOLDER})",
    )
    parser.add_argument(
        "--out",
        dest="output_dir",
        help=f"[LOCAL] Thu muc output (mac dinh: {config.OUTPUT_FOLDER})",
    )
    parser.add_argument(
        "--help-drive",
        action="store_true",
        help="Hien thi huong dan cai dat Google Drive",
    )

    args = parser.parse_args()

    if args.help_drive:
        print(HELP_DRIVE)
        sys.exit(0)

    # ── Google Drive mode ─────────────────────────────────────────────────────
    if args.drive:
        results = process_batch_drive(single_file=args.drive_file)
        sys.exit(0 if not results["failed"] else 1)

    # ── Local mode ────────────────────────────────────────────────────────────
    if args.image:
        img_path = Path(args.image)
        if not img_path.is_absolute():
            candidate = Path(config.INPUT_FOLDER) / args.image
            if candidate.exists():
                img_path = candidate

        result = process_single(
            image_path=img_path,
            output_dir=args.output_dir,
            size=args.size,
            price=args.price,
        )
        sys.exit(0 if result else 1)
    else:
        results = process_batch(
            input_dir=args.input_dir,
            output_dir=args.output_dir,
        )
        sys.exit(0 if not results["failed"] else 1)


if __name__ == "__main__":
    main()

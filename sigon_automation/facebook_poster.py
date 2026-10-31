# =============================================================================
#  SiGon Secondhand — Facebook Auto Poster
#  File: facebook_poster.py
#
#  Tự động đăng ảnh giày vào đúng Album theo size trên Fanpage SiGon
#  Dùng Facebook Graph API v19.0
# =============================================================================

import requests
import logging
import time
from pathlib import Path

import config

logger = logging.getLogger(__name__)

GRAPH_API_BASE = "https://graph.facebook.com/v19.0"


def _get_size_album(size_str: str) -> str | None:
    """
    Xác định album_id từ size giày.
    size_str: "42", "42.5", "35", "47", "dep"...
    """
    size_str = str(size_str).strip().lower()

    # Trường hợp đặc biệt
    if size_str in ("dep", "dép", "slip", "slipon"):
        return config.FACEBOOK_ALBUMS.get("dep")

    try:
        size_num = float(size_str)
        if size_num <= 38.5:
            return config.FACEBOOK_ALBUMS.get("35-38")
        elif size_num <= 42.5:
            return config.FACEBOOK_ALBUMS.get("39-42")
        elif size_num <= 46.5:
            return config.FACEBOOK_ALBUMS.get("43-46")
        else:
            return config.FACEBOOK_ALBUMS.get("47+")
    except ValueError:
        logger.warning(f"Không xác định được size: '{size_str}' — dùng album 39-42 mặc định")
        return config.FACEBOOK_ALBUMS.get("39-42")


def _build_caption(meta: dict) -> str:
    """Tạo caption chuẩn SiGon từ metadata sản phẩm."""
    brand     = meta.get("brand", "")
    model     = meta.get("model", "")
    size      = meta.get("size", "?")
    price     = meta.get("price", "Liên hệ")
    condition = meta.get("condition", "")

    # Dòng tình trạng (chỉ hiện nếu có)
    condition_line = f"📊 Tình trạng: {condition}\n" if condition else ""

    caption = (
        f"👟 {brand} {model}\n"
        f"📐 Size: {size}\n"
        f"{condition_line}"
        f"💰 Giá: {price}\n"
        f"\n"
        f"📸 Ảnh thật 100% — chụp tại SiGon\n"
        f"📞 {config.BRAND_PHONE}\n"
        f"\n"
        f"🔥 Hàng real, giá hời — inbox chốt ngay kẻo mất! ✌️\n"
        f"\n"
        f"{config.BRAND_HASHTAGS}"
    )
    return caption


def post_photo_to_album(
    image_path: str,
    meta: dict,
    album_id: str = None,
    dry_run: bool = False,
) -> dict:
    """
    Đăng 1 ảnh vào Facebook Album.

    Args:
        image_path: Đường dẫn ảnh đã enhance
        meta: Dict metadata từ gemini_enhance.parse_shoe_metadata()
        album_id: Override album_id (nếu None thì tự xác định theo size)
        dry_run: Nếu True thì chỉ log, không thật sự đăng

    Returns:
        dict {"success": bool, "post_id": str, "error": str}
    """
    image_path = Path(image_path)
    if not image_path.exists():
        return {"success": False, "error": f"File không tồn tại: {image_path}"}

    # Xác định album
    target_album = album_id or _get_size_album(meta.get("size", ""))
    if not target_album:
        return {"success": False, "error": "Không xác định được album_id"}

    caption = _build_caption(meta)

    logger.info(
        f"FB Post → Album {target_album} | "
        f"{meta.get('brand')} {meta.get('model')} | Size {meta.get('size')}"
    )

    if dry_run:
        logger.info("[DRY RUN] Sẽ đăng:\n" + caption)
        return {"success": True, "post_id": "DRY_RUN", "error": None}

    # Gọi Facebook Graph API
    url = f"{GRAPH_API_BASE}/{target_album}/photos"
    try:
        with open(image_path, "rb") as img_file:
            response = requests.post(
                url,
                data={
                    "caption": caption,
                    "access_token": config.FACEBOOK_PAGE_ACCESS_TOKEN,
                },
                files={"source": (image_path.name, img_file, "image/jpeg")},
                timeout=60,
            )

        result = response.json()

        if response.status_code == 200 and "id" in result:
            post_id = result["id"]
            logger.info(f"✅ FB đăng thành công — post_id: {post_id}")
            return {"success": True, "post_id": post_id, "error": None}
        else:
            error_msg = result.get("error", {}).get("message", str(result))
            logger.error(f"❌ FB lỗi: {error_msg}")
            return {"success": False, "post_id": None, "error": error_msg}

    except requests.exceptions.Timeout:
        return {"success": False, "error": "Timeout khi upload ảnh lên Facebook"}
    except Exception as e:
        return {"success": False, "error": str(e)}


def post_text_update(message: str, dry_run: bool = False) -> dict:
    """
    Đăng bài text (không ảnh) lên Fanpage — dùng cho flash deal, thông báo.
    """
    url = f"{GRAPH_API_BASE}/{config.FACEBOOK_PAGE_ID}/feed"

    if dry_run:
        logger.info(f"[DRY RUN] FB text post:\n{message}")
        return {"success": True, "post_id": "DRY_RUN"}

    try:
        response = requests.post(
            url,
            data={
                "message": message,
                "access_token": config.FACEBOOK_PAGE_ACCESS_TOKEN,
            },
            timeout=30,
        )
        result = response.json()
        if "id" in result:
            return {"success": True, "post_id": result["id"]}
        return {"success": False, "error": result.get("error", {}).get("message")}
    except Exception as e:
        return {"success": False, "error": str(e)}


def verify_token() -> bool:
    """Kiểm tra Page Access Token còn hợp lệ không."""
    url = f"{GRAPH_API_BASE}/me?access_token={config.FACEBOOK_PAGE_ACCESS_TOKEN}"
    try:
        r = requests.get(url, timeout=10)
        data = r.json()
        if "id" in data:
            logger.info(f"✅ Facebook token OK — Page: {data.get('name', data['id'])}")
            return True
        logger.error(f"❌ Facebook token lỗi: {data}")
        return False
    except Exception as e:
        logger.error(f"❌ Không kết nối được Facebook API: {e}")
        return False


# ─── Test trực tiếp ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    from gemini_enhance import parse_shoe_metadata

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
    )

    print("Kiểm tra Facebook token...")
    if not verify_token():
        print("Token không hợp lệ — kiểm tra lại config.py")
        sys.exit(1)

    if len(sys.argv) >= 2:
        img = sys.argv[1]
        meta = parse_shoe_metadata(img)
        result = post_photo_to_album(img, meta, dry_run="--dry" in sys.argv)
        print(result)

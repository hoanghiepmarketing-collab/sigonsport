# =============================================================================
#  SiGon Secondhand — Instagram Auto Poster
#  File: instagram_poster.py
#
#  Tự động đăng ảnh lên Instagram Feed + Story
#  Dùng Instagram Graph API (cần tài khoản Business + kết nối FB Page)
#
#  Lưu ý Highlight: API không hỗ trợ add trực tiếp vào Highlight.
#  Story sẽ tự vào Highlights khi bạn add thủ công cuối tuần (~5 phút/tuần).
# =============================================================================

import requests
import logging
import time
from pathlib import Path
import urllib.parse

import config

logger = logging.getLogger(__name__)

GRAPH_API_BASE = "https://graph.facebook.com/v19.0"
IG_API_BASE    = f"{GRAPH_API_BASE}/{config.INSTAGRAM_BUSINESS_ACCOUNT_ID}"


def _build_ig_caption(meta: dict) -> str:
    """Caption cho Instagram — ngắn hơn Facebook, nhiều emoji hơn."""
    brand     = meta.get("brand", "")
    model     = meta.get("model", "")
    size      = meta.get("size", "?")
    price     = meta.get("price", "Liên hệ")
    condition = meta.get("condition", "")

    condition_line = f"✨ {condition}\n" if condition else ""

    caption = (
        f"👟 {brand} {model}\n"
        f"📐 Size {size}  |  💰 {price}\n"
        f"{condition_line}"
        f"\n"
        f"📸 Ảnh thật — chụp tại SiGon\n"
        f"💬 Inbox hoặc comment SIZE để chốt!\n"
        f"\n"
        f"✌️ Giày Real — Giá Hời — Chất Sài Gòn\n"
        f"\n"
        f"{config.BRAND_HASHTAGS} "
        f"#size{size} #{brand.lower().replace(' ', '')}"
    )
    return caption


def _upload_image_to_server(image_path: str) -> str | None:
    """
    Instagram Graph API yêu cầu ảnh phải có PUBLIC URL (không thể upload trực tiếp file).
    Giải pháp: Upload lên Facebook (as unpublished) để lấy URL, hoặc dùng hosting tạm.

    Cách tốt nhất: Upload lên Google Drive public link, hoặc dùng Cloudinary free tier.
    Đây là placeholder — xem hướng dẫn README để setup hosting.
    """
    # TODO: Implement hosting solution
    # Option 1: Cloudinary (free tier 25GB) — khuyến nghị
    # Option 2: Imgur API
    # Option 3: Facebook CDN (upload as draft post rồi lấy URL)
    raise NotImplementedError(
        "Cần setup image hosting. Xem README.md phần 'Setup Instagram Hosting'."
    )


def _get_image_url_via_facebook(image_path: str) -> str | None:
    """
    Upload ảnh lên Facebook dưới dạng unpublished để lấy URL dùng cho Instagram.
    Đây là cách đơn giản nhất không cần service bên thứ 3.
    """
    url = f"{GRAPH_API_BASE}/{config.FACEBOOK_PAGE_ID}/photos"
    try:
        with open(image_path, "rb") as f:
            response = requests.post(
                url,
                data={
                    "published": "false",          # Không hiện lên Page
                    "temporary": "true",
                    "access_token": config.FACEBOOK_PAGE_ACCESS_TOKEN,
                },
                files={"source": (Path(image_path).name, f, "image/jpeg")},
                timeout=60,
            )
        result = response.json()
        if "id" in result:
            photo_id = result["id"]
            # Lấy URL ảnh từ photo id
            img_url_resp = requests.get(
                f"{GRAPH_API_BASE}/{photo_id}",
                params={
                    "fields": "images",
                    "access_token": config.FACEBOOK_PAGE_ACCESS_TOKEN,
                },
                timeout=15,
            ).json()
            images = img_url_resp.get("images", [])
            if images:
                # Lấy ảnh lớn nhất
                best = sorted(images, key=lambda x: x.get("width", 0), reverse=True)
                return best[0]["source"]
        logger.error(f"Không lấy được URL ảnh: {result}")
        return None
    except Exception as e:
        logger.error(f"Lỗi upload ảnh lên FB để lấy URL: {e}")
        return None


def post_to_feed(
    image_path: str,
    meta: dict,
    dry_run: bool = False,
) -> dict:
    """
    Đăng ảnh lên Instagram Feed (Post thường, hiện trong grid).

    Flow: Upload ảnh → Tạo media container → Publish container
    """
    if dry_run:
        logger.info(f"[DRY RUN] IG Feed: {Path(image_path).name} | Size {meta.get('size')}")
        return {"success": True, "post_id": "DRY_RUN"}

    caption = _build_ig_caption(meta)

    # Bước 1: Lấy URL ảnh (Instagram cần URL, không nhận file trực tiếp)
    logger.info("Đang lấy URL ảnh cho Instagram...")
    image_url = _get_image_url_via_facebook(image_path)
    if not image_url:
        return {"success": False, "error": "Không lấy được image URL"}

    # Bước 2: Tạo media container
    logger.info(f"Tạo IG media container — {Path(image_path).name}")
    container_url = f"{IG_API_BASE}/media"
    try:
        container_resp = requests.post(
            container_url,
            data={
                "image_url": image_url,
                "caption": caption,
                "access_token": config.INSTAGRAM_ACCESS_TOKEN,
            },
            timeout=30,
        ).json()

        if "id" not in container_resp:
            error = container_resp.get("error", {}).get("message", str(container_resp))
            return {"success": False, "error": f"Tạo container thất bại: {error}"}

        container_id = container_resp["id"]
        logger.info(f"Container ID: {container_id}")

        # Bước 3: Publish container
        time.sleep(2)  # Instagram cần chút thời gian xử lý container
        publish_url = f"{IG_API_BASE}/media_publish"
        publish_resp = requests.post(
            publish_url,
            data={
                "creation_id": container_id,
                "access_token": config.INSTAGRAM_ACCESS_TOKEN,
            },
            timeout=30,
        ).json()

        if "id" in publish_resp:
            post_id = publish_resp["id"]
            logger.info(f"✅ IG Feed đăng thành công — post_id: {post_id}")
            return {"success": True, "post_id": post_id}
        else:
            error = publish_resp.get("error", {}).get("message", str(publish_resp))
            return {"success": False, "error": error}

    except Exception as e:
        return {"success": False, "error": str(e)}


def post_to_story(
    image_path: str,
    meta: dict,
    dry_run: bool = False,
) -> dict:
    """
    Đăng ảnh lên Instagram Story.
    Story sẽ tồn tại 24h — sau đó thủ công add vào Highlight theo size.

    Flow giống Feed nhưng dùng endpoint /media với media_type=STORIES
    """
    if dry_run:
        logger.info(f"[DRY RUN] IG Story: {Path(image_path).name}")
        return {"success": True, "post_id": "DRY_RUN"}

    logger.info("Đang lấy URL ảnh cho Story...")
    image_url = _get_image_url_via_facebook(image_path)
    if not image_url:
        return {"success": False, "error": "Không lấy được image URL"}

    try:
        # Tạo Story container
        container_url = f"{IG_API_BASE}/media"
        container_resp = requests.post(
            container_url,
            data={
                "image_url": image_url,
                "media_type": "STORIES",
                "access_token": config.INSTAGRAM_ACCESS_TOKEN,
            },
            timeout=30,
        ).json()

        if "id" not in container_resp:
            error = container_resp.get("error", {}).get("message", str(container_resp))
            return {"success": False, "error": f"Story container thất bại: {error}"}

        container_id = container_resp["id"]
        time.sleep(2)

        # Publish Story
        publish_resp = requests.post(
            f"{IG_API_BASE}/media_publish",
            data={
                "creation_id": container_id,
                "access_token": config.INSTAGRAM_ACCESS_TOKEN,
            },
            timeout=30,
        ).json()

        if "id" in publish_resp:
            post_id = publish_resp["id"]
            logger.info(f"✅ IG Story đăng thành công — story_id: {post_id}")
            return {"success": True, "post_id": post_id}
        else:
            error = publish_resp.get("error", {}).get("message", str(publish_resp))
            return {"success": False, "error": error}

    except Exception as e:
        return {"success": False, "error": str(e)}


def post_carousel(
    image_paths: list[str],
    meta: dict,
    dry_run: bool = False,
) -> dict:
    """
    Đăng nhiều ảnh (carousel) cho 1 đôi giày — lý tưởng cho 4-6 góc chụp.

    Args:
        image_paths: List đường dẫn các ảnh (tối đa 10)
    """
    if len(image_paths) < 2:
        return post_to_feed(image_paths[0], meta, dry_run)

    if dry_run:
        logger.info(f"[DRY RUN] IG Carousel: {len(image_paths)} ảnh | Size {meta.get('size')}")
        return {"success": True, "post_id": "DRY_RUN"}

    caption = _build_ig_caption(meta)
    children_ids = []

    # Bước 1: Tạo container cho từng ảnh
    for img_path in image_paths[:10]:  # Instagram giới hạn 10 ảnh
        logger.info(f"Upload ảnh carousel: {Path(img_path).name}")
        image_url = _get_image_url_via_facebook(img_path)
        if not image_url:
            continue

        child_resp = requests.post(
            f"{IG_API_BASE}/media",
            data={
                "image_url": image_url,
                "is_carousel_item": "true",
                "access_token": config.INSTAGRAM_ACCESS_TOKEN,
            },
            timeout=30,
        ).json()

        if "id" in child_resp:
            children_ids.append(child_resp["id"])
            time.sleep(1)

    if not children_ids:
        return {"success": False, "error": "Không tạo được children carousel"}

    # Bước 2: Tạo carousel container
    carousel_resp = requests.post(
        f"{IG_API_BASE}/media",
        data={
            "media_type": "CAROUSEL",
            "children": ",".join(children_ids),
            "caption": caption,
            "access_token": config.INSTAGRAM_ACCESS_TOKEN,
        },
        timeout=30,
    ).json()

    if "id" not in carousel_resp:
        return {"success": False, "error": carousel_resp.get("error", {}).get("message")}

    carousel_id = carousel_resp["id"]
    time.sleep(3)

    # Bước 3: Publish
    publish_resp = requests.post(
        f"{IG_API_BASE}/media_publish",
        data={
            "creation_id": carousel_id,
            "access_token": config.INSTAGRAM_ACCESS_TOKEN,
        },
        timeout=30,
    ).json()

    if "id" in publish_resp:
        logger.info(f"✅ IG Carousel đăng thành công — {len(children_ids)} ảnh")
        return {"success": True, "post_id": publish_resp["id"]}
    return {"success": False, "error": publish_resp.get("error", {}).get("message")}


def verify_token() -> bool:
    """Kiểm tra Instagram Access Token."""
    url = f"{IG_API_BASE}?fields=username,name&access_token={config.INSTAGRAM_ACCESS_TOKEN}"
    try:
        r = requests.get(url, timeout=10)
        data = r.json()
        if "username" in data or "name" in data:
            logger.info(f"✅ Instagram token OK — @{data.get('username', 'unknown')}")
            return True
        logger.error(f"❌ Instagram token lỗi: {data}")
        return False
    except Exception as e:
        logger.error(f"❌ Không kết nối Instagram API: {e}")
        return False


# ─── Test trực tiếp ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    from gemini_enhance import parse_shoe_metadata

    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

    print("Kiểm tra Instagram token...")
    verify_token()

    if len(sys.argv) >= 2:
        img = sys.argv[1]
        meta = parse_shoe_metadata(img)
        dry = "--dry" in sys.argv
        print("Đăng Feed...")
        print(post_to_feed(img, meta, dry_run=dry))
        print("Đăng Story...")
        print(post_to_story(img, meta, dry_run=dry))

"""Bot Telegram tối giản để xác nhận kết nối cho pipeline nội dung SiGon."""

import os
import asyncio
import json
from datetime import date
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes


def load_settings() -> tuple[str, int]:
    local_app_data = os.environ.get('LOCALAPPDATA')
    if not local_app_data:
        raise RuntimeError('Không tìm thấy thư mục LOCALAPPDATA của Windows.')

    secret_file = Path(local_app_data) / 'sigon-content.env'
    load_dotenv(secret_file)

    token = os.getenv('TELEGRAM_BOT_TOKEN')
    if not token:
        raise RuntimeError(
            f'Chưa có TELEGRAM_BOT_TOKEN. Hãy tạo tệp cấu hình tại: {secret_file}'
        )

    admin_user_id = os.getenv('TELEGRAM_ADMIN_USER_ID')
    if not admin_user_id or not admin_user_id.isdigit():
        raise RuntimeError(
            'Chưa có TELEGRAM_ADMIN_USER_ID hợp lệ trong tệp cấu hình. '
            f'Hãy thêm mã tài khoản Telegram của bạn vào: {secret_file}'
        )
    openrouter_api_key = os.getenv('OPENROUTER_API_KEY')
    if not openrouter_api_key:
        raise RuntimeError(
            f'Chưa có OPENROUTER_API_KEY trong tệp cấu hình: {secret_file}'
        )
    return token, int(admin_user_id), openrouter_api_key


def is_admin(update: Update, admin_user_id: int) -> bool:
    return bool(update.effective_user and update.effective_user.id == admin_user_id)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    admin_user_id = context.application.bot_data['admin_user_id']
    if not is_admin(update, admin_user_id):
        if update.effective_message:
            await update.effective_message.reply_text('Bot này chỉ dành cho quản trị viên.')
        return
    if update.effective_message:
        await update.effective_message.reply_text(
            '✅ Bot SiGon đã kết nối. Gửi /id để xem mã tài khoản Telegram của bạn.'
        )


async def show_id(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    admin_user_id = context.application.bot_data['admin_user_id']
    if not is_admin(update, admin_user_id):
        if update.effective_message:
            await update.effective_message.reply_text('Bot này chỉ dành cho quản trị viên.')
        return
    if not update.effective_message or not update.effective_user:
        return

    chat_id = update.effective_chat.id if update.effective_chat else 'không có'
    user_id = update.effective_user.id
    print(f'Telegram chat ID: {chat_id} | user ID: {user_id}')
    await update.effective_message.reply_text(
        f'Chat ID: {chat_id}\nUser ID: {user_id}\n\n'
        'Không gửi token bot hoặc API key cho người khác.'
    )


def research_with_openrouter(query: str) -> str:
    """Tra cứu web qua OpenRouter, giới hạn một lần tìm và trả nguồn cho Telegram."""
    api_key = os.getenv('OPENROUTER_API_KEY')
    if not api_key:
        raise RuntimeError('Chưa cấu hình OPENROUTER_API_KEY.')

    today = date.today().isoformat()
    prompt = f"""Hôm nay là {today}. Hãy nghiên cứu chủ đề sau cho thương hiệu SiGon Secondhand tại TP.HCM:
{query}

Trả lời bằng tiếng Việt, ngắn gọn, tập trung vào:
1. Những thông tin hoặc tín hiệu mới đáng chú ý và thời điểm của chúng.
2. Vì sao các góc nội dung đó có thể thu hút nhóm 18–28 tuổi ở Việt Nam.
3. Ba góc nội dung SiGon có thể khai thác, ghi rõ đâu là dữ kiện và đâu là nhận định.
4. Nêu rõ nếu không tìm thấy bằng chứng đáng tin về độ phổ biến; không tự bịa lượt xem, mức độ viral hay số liệu.

Đây là bản nghiên cứu để người dùng đọc và tự quyết định bước tiếp theo, chưa viết bài quảng cáo hoàn chỉnh."""

    payload = {
        'model': os.getenv(
            'OPENROUTER_MODEL', 'nvidia/nemotron-3-ultra-550b-a55b:free'
        ),
        'messages': [
            {
                'role': 'system',
                'content': 'Bạn là trợ lý nghiên cứu nội dung cho thương hiệu SiGon. '
                'Với thông tin mới, hãy dùng tìm kiếm web và trích dẫn nguồn. '
                'Không khẳng định số liệu hoặc xu hướng nếu nguồn không chứng minh được.',
            },
            {'role': 'user', 'content': prompt},
        ],
        'tools': [
            {
                'type': 'openrouter:web_search',
                'parameters': {
                    'engine': 'parallel',
                    'mode': 'basic',
                    'max_results': 5,
                    'max_total_results': 5,
                    'max_uses': 1,
                },
            }
        ],
        'max_tool_calls': 1,
        'max_tokens': 1400,
    }
    request = Request(
        'https://openrouter.ai/api/v1/chat/completions',
        data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://sigon.vn',
            'X-OpenRouter-Title': 'SiGon Content Assistant',
        },
        method='POST',
    )
    try:
        with urlopen(request, timeout=180) as response:
            data = json.loads(response.read().decode('utf-8'))
    except HTTPError as exc:
        error_body = exc.read().decode('utf-8', errors='replace')
        raise RuntimeError(f'OpenRouter HTTP {exc.code}: {error_body[:500]}') from exc
    except URLError as exc:
        raise RuntimeError(f'Không kết nối được OpenRouter: {exc.reason}') from exc

    choices = data.get('choices') or []
    message = (choices[0].get('message') or {}) if choices else {}
    answer = (message.get('content') or '').strip()
    citations: list[tuple[str, str]] = []
    seen_urls: set[str] = set()
    for annotation in message.get('annotations') or []:
        citation = annotation.get('url_citation') or {}
        url = (citation.get('url') or '').strip()
        title = (citation.get('title') or url).strip()
        if url and url not in seen_urls:
            seen_urls.add(url)
            citations.append((title, url))

    if citations:
        answer += '\n\nNguồn Gemini trích dẫn:\n' + '\n'.join(
            f'• {title}: {url}' for title, url in citations[:5]
        )
    if not answer:
        raise RuntimeError('Gemini không trả về nội dung nghiên cứu.')
    return answer


def split_telegram_message(text: str, limit: int = 3800) -> list[str]:
    chunks: list[str] = []
    remaining = text.strip()
    while len(remaining) > limit:
        cut = remaining.rfind('\n', 0, limit)
        if cut < limit // 2:
            cut = limit
        chunks.append(remaining[:cut].strip())
        remaining = remaining[cut:].strip()
    if remaining:
        chunks.append(remaining)
    return chunks


async def research(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    admin_user_id = context.application.bot_data['admin_user_id']
    if not is_admin(update, admin_user_id):
        if update.effective_message:
            await update.effective_message.reply_text('Bot này chỉ dành cho quản trị viên.')
        return
    if not update.effective_message:
        return

    query = ' '.join(context.args).strip()
    if not query:
        await update.effective_message.reply_text(
            'Dùng lệnh:\n/research chủ đề muốn tìm hiểu\n\n'
            'Ví dụ: /research xu hướng giày bóng đá secondhand ở Việt Nam'
        )
        return

    await update.effective_message.reply_text(
        'Gemini đang tìm thông tin mới và kiểm tra nguồn. Chờ mình một chút nhé…'
    )
    try:
        result = await asyncio.to_thread(research_with_openrouter, query)
    except Exception as exc:
        api_key = os.getenv('OPENROUTER_API_KEY', '')
        safe_error = str(exc)
        if api_key:
            safe_error = safe_error.replace(api_key, '[API KEY HIDDEN]')
        print(f'OpenRouter research error: {type(exc).__name__}: {safe_error[:500]}')
        if isinstance(exc, TimeoutError):
            user_error = (
                'OpenRouter chưa phản hồi trong 3 phút. Lượt tìm có thể đã được ghi nhận; '
                'hãy kiểm tra trang Activity trước khi thử lại.'
            )
        else:
            user_error = 'Chưa nghiên cứu được lúc này. Hãy xem thông báo lỗi trong cửa sổ PowerShell.'
        await update.effective_message.reply_text(user_error)
        return

    for part in split_telegram_message(result):
        await update.effective_message.reply_text(part, disable_web_page_preview=True)


def main() -> None:
    token, admin_user_id, _ = load_settings()
    app = Application.builder().token(token).build()
    app.bot_data['admin_user_id'] = admin_user_id
    app.add_handler(CommandHandler('start', start))
    app.add_handler(CommandHandler('id', show_id))
    app.add_handler(CommandHandler('research', research))

    print('Bot đang chạy. Mở Telegram và gửi /start hoặc /id. Nhấn Ctrl+C để dừng.')
    app.run_polling()


if __name__ == '__main__':
    main()

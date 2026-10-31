"""
Debug: Liệt kê TẤT CẢ file trong Drive folder (không lọc gì cả).
Chạy: python debug_drive.py
"""
import sys
from pathlib import Path
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

import config

SCOPES = ["https://www.googleapis.com/auth/drive"]

# Auth
creds = None
if Path(config.DRIVE_TOKEN_FILE).exists():
    creds = Credentials.from_authorized_user_file(config.DRIVE_TOKEN_FILE, SCOPES)
if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_secrets_file(config.DRIVE_CREDENTIALS_FILE, SCOPES)
        creds = flow.run_local_server(port=0)
    with open(config.DRIVE_TOKEN_FILE, "w") as f:
        f.write(creds.to_json())

service = build("drive", "v3", credentials=creds)

folder_id = config.DRIVE_INPUT_FOLDER_ID
print(f"\nFolder ID: {folder_id}")
print("=" * 60)

# Lấy thông tin folder
try:
    folder_info = service.files().get(
        fileId=folder_id,
        fields="id, name, mimeType",
        supportsAllDrives=True,
    ).execute()
    print(f"Folder name: {folder_info.get('name')}")
    print(f"Folder type: {folder_info.get('mimeType')}")
except Exception as e:
    print(f"[FAIL] Khong lay duoc info folder: {e}")

print("\nDanh sach TAT CA file trong folder:")
print("-" * 60)

resp = service.files().list(
    q=f"'{folder_id}' in parents and trashed=false",
    spaces="drive",
    fields="files(id, name, mimeType, size)",
    includeItemsFromAllDrives=True,
    supportsAllDrives=True,
    pageSize=50,
).execute()

files = resp.get("files", [])
if not files:
    print(">>> KHONG CO FILE NAO <<<")
    print("\nCo the do:")
    print("  1. Folder dang trong 'Shared with me' nhung chua duoc 'Add to My Drive'")
    print("  2. File chua duoc upload len folder nay")
    print("  3. Folder ID sai")
else:
    for f in files:
        size = int(f.get("size", 0)) // 1024
        print(f"  [{f['mimeType'][:30]:30s}]  {f['name']}  ({size} KB)  id={f['id']}")

print(f"\nTong: {len(files)} file")
print("=" * 60)

@echo off
chcp 65001 >nul
title SiGon — Gemini Photo Enhancer
echo.
echo ╔══════════════════════════════════════════╗
echo ║   SiGon — Gemini AI Photo Enhancer      ║
echo ╚══════════════════════════════════════════╝
echo.
echo Đang xử lý toàn bộ ảnh trong thư mục input...
echo.

python sigon_enhance.py

echo.
echo Nhấn phím bất kỳ để đóng cửa sổ...
pause >nul

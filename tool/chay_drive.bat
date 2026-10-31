@echo off
chcp 65001 >nul
title SiGon — Gemini Photo Enhancer (Google Drive)
echo.
echo ╔══════════════════════════════════════════════╗
echo ║   SiGon — Gemini AI Photo Enhancer          ║
echo ║   Mode: Google Drive                         ║
echo ╚══════════════════════════════════════════════╝
echo.
echo Doc anh tu Google Drive, enhance, upload ket qua len Drive...
echo.

python sigon_enhance.py --drive

echo.
echo Nhan phim bat ky de dong cua so...
pause >nul

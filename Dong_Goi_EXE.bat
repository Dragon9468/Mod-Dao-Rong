@echo off
title Dong Goi Standalone Windows EXE - Mod Dao Rong
cd /d "%~dp0"

echo =========================================================
echo   TIEN HANH DONG GOI GAME THANH FILE EXE CHO WINDOWS
echo =========================================================
echo.
echo Dang kiem tra dependencies va dong goi bang electron-builder...
call npm run build:exe

if exist "dist\win-unpacked\Mod Đảo Rồng.exe" (
    echo.
    echo Dang tao goi Portable ZIP...
    powershell -NoProfile -Command "Compress-Archive -Path 'dist\win-unpacked\*' -DestinationPath 'dist\Mod-Dao-Rong-Windows-x64.zip' -Force"
    echo.
    echo =========================================================
    echo [THANH CONG] File .exe va file .zip da tao trong: dist/
    echo 1. Thu muc chay truc tiep: dist\win-unpacked\Mod Đảo Rồng.exe
    echo 2. File nen mang di choi:   dist\Mod-Dao-Rong-Windows-x64.zip
    echo =========================================================
) else (
    echo.
    echo [LOI] Qua trinh dong goi gap su co. Hay kiem tra lai node/npm!
)

echo.
pause

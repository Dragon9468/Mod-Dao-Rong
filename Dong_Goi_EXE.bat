@echo off
title Dong Goi Standalone Windows EXE - Mod Dao Rong
cd /d "%~dp0"

echo =========================================================
echo   TIEN HANH DONG GOI GAME THANH FILE EXE CHO WINDOWS
echo =========================================================
echo.
echo Dang kiem tra dependencies va dong goi bang electron-builder...
call npm run build:exe

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =========================================================
    echo [THANH CONG] File .exe da duoc tao trong thu muc: dist/
    echo Ban co the chay file .exe hoac ban portable truc tiep!
    echo =========================================================
) else (
    echo.
    echo [LOI] Qua trinh dong goi gap su co. Hay kiem tra lai node/npm!
)

echo.
pause

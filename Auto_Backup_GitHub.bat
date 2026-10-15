@echo off
title Auto Backup to GitHub - Mod Dao Rong
cd /d "%~dp0"

echo ====================================================
echo   DANG SAO LUU DU AN LEN GITHUB (Mod Dao Rong)
echo ====================================================

git add .
git commit -m "Auto backup: cap nhat ma nguon Mod Dao Rong (Zing Me Remake)"
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [THANH CONG] Da sao luu toan bo du an len GitHub!
) else (
    echo.
    echo [CHU Y] Neu chua co repo tren GitHub, hay vao https://github.com/new tao repo moi ten 'Mod-Dao-Rong' (hoac 'Mod Đảo rồng') roi chay lai script nay nhe!
)

echo.
pause

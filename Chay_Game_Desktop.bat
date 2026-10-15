@echo off
title Khoi Chay Mod Dao Rong Desktop
cd /d "%~dp0"

echo Dang khoi dong Mod Dao Rong...
npx electron .

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [Loi] Neu chua cai dat electron, hay chay lenh: npm install
    pause
)

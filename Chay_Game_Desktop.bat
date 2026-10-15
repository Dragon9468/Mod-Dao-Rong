@echo off
title Khoi Chay Mod Dao Rong Desktop
cd /d "%~dp0"

if exist "dist\win-unpacked\Mod Đảo Rồng.exe" (
    echo Dang khoi dong Mod Dao Rong Standalone EXE...
    start "" "dist\win-unpacked\Mod Đảo Rồng.exe"
) else (
    echo Dang khoi dong qua Electron...
    npx electron .
)

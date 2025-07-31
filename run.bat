@echo off
title 
color 0A
cls
:start
echo Bot başlatiliyor...
node wnersdev.js
echo.
echo Bot kapandı veya hata verdi. 3 saniye içinde tekrar başlatiliyor...
timeout /t 3 /nobreak >nul
cls
goto start
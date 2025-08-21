@echo off
echo Starting GetCare Healthcare Analytics API Server...
echo.
cd /d "%~dp0"
Rscript server.R
pause

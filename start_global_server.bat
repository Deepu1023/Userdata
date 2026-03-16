@echo off
echo =======================================================
echo   Starting Flask Server and Global Internet Tunnel
echo =======================================================
echo.

:: Start Flask server in the background
start /B cmd /c "python app.py"

:: Wait a few seconds for Flask to initialize
timeout /t 3 /nobreak > NUL

echo Starting Cloudflare Tunnel (This makes it available globally)...
echo.
echo Please wait about 5-10 seconds for the global URL to generate.
echo Look for the link ending in .trycloudflare.com in the output below.
echo Press CTRL+C when you want to stop everything.
echo.
echo -------------------------------------------------------

:: Run Cloudflared tunnel
cloudflared.exe tunnel --url http://127.0.0.1:5000

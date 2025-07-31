@echo off
echo Installing dependencies for the WebFrontEnd application...

rem Navigasi ke direktori proyek web Anda
cd "AXA\Web"

rem Jalankan perintah npm install
npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies.
    pause
    exit /b %errorlevel%
)

echo.
echo Dependencies installed successfully.
pause
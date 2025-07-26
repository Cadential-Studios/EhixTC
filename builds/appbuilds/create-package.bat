@echo off
echo =====================================================
echo  Ehix: The Triune Convergence - Package Creator
echo =====================================================
echo.

set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%
set TIMESTAMP=%TIMESTAMP: =0%

echo Creating distribution package...
echo.

REM Create distribution folder
mkdir "ehix-app-package-%TIMESTAMP%" 2>nul

REM Copy all necessary files
echo Copying game files...
xcopy "index.html" "ehix-app-package-%TIMESTAMP%\" /Y >nul
xcopy "manifest.json" "ehix-app-package-%TIMESTAMP%\" /Y >nul
xcopy "sw.js" "ehix-app-package-%TIMESTAMP%\" /Y >nul
xcopy "build-config.json" "ehix-app-package-%TIMESTAMP%\" /Y >nul
xcopy "README.md" "ehix-app-package-%TIMESTAMP%\" /Y >nul
xcopy "assets" "ehix-app-package-%TIMESTAMP%\assets\" /E /I /Y >nul
xcopy "data" "ehix-app-package-%TIMESTAMP%\data\" /E /I /Y >nul
xcopy "saves" "ehix-app-package-%TIMESTAMP%\saves\" /E /I /Y >nul

echo Creating ZIP package for PhoneGap Build...
powershell -command "Compress-Archive -Path 'ehix-app-package-%TIMESTAMP%\*' -DestinationPath 'ehix-phonegap-build-%TIMESTAMP%.zip' -Force"

echo.
echo ✅ Package created successfully!
echo.
echo 📁 Folder: ehix-app-package-%TIMESTAMP%\
echo 📦 ZIP:    ehix-phonegap-build-%TIMESTAMP%.zip
echo.
echo 🚀 Deployment Options:
echo   1. Web App: Upload folder contents to web server
echo   2. PWA: Deploy folder with HTTPS for offline capability  
echo   3. PhoneGap: Upload ZIP file to build.phonegap.com
echo   4. Cordova: Copy files to existing Cordova project
echo.
echo 📱 Mobile-optimized features included:
echo   - Responsive design for all screen sizes
echo   - Mobile mode toggle button
echo   - Google Pixel 9 optimizations
echo   - Touch-friendly interface
echo   - PWA offline capability
echo   - Auto mobile device detection
echo.
pause

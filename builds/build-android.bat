@echo off
echo ==================================================
echo  Ehix: The Triune Convergence - Android Builder
echo ==================================================
echo.

cd /d "%~dp0ehix-android"

echo Checking Cordova requirements...
cordova requirements
echo.

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Requirements check failed!
    echo Please install Android Studio and set up Android SDK first.
    echo See BUILD_INSTRUCTIONS.md for details.
    echo.
    pause
    exit /b 1
)

echo ✅ Requirements satisfied!
echo.

echo Building Android APK...
echo.
cordova build android

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build successful!
    echo.
    echo APK Location:
    echo %cd%\platforms\android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo To install on connected device, run:
    echo cordova run android
    echo.
) else (
    echo.
    echo ❌ Build failed!
    echo Check the error messages above.
    echo.
)

pause

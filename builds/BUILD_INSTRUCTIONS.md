# Ehix: The Triune Convergence - Android Build Instructions

## Project Structure
```
builds/
└── ehix-android/
    ├── config.xml          # Cordova configuration
    ├── www/                # Game files (copied from root)
    │   ├── index.html      # Main game file
    │   ├── assets/         # Game assets (CSS, JS, images)
    │   ├── data/           # Game data files
    │   └── saves/          # Save game directory
    ├── platforms/
    │   └── android/        # Android platform files
    └── res/                # App resources (icons, splash screens)
```

## Setup Requirements

### 1. Prerequisites Installed ✅
- [x] Node.js and npm
- [x] Apache Cordova
- [x] Android Studio (installing...)

### 2. Android SDK Setup (Post Android Studio Installation)
1. Launch Android Studio
2. Go to Tools > SDK Manager
3. Install Android SDK Platform-tools
4. Set ANDROID_HOME environment variable
5. Add Android SDK tools to PATH

### 3. Environment Variables Needed
```bash
ANDROID_HOME=C:\Users\[username]\AppData\Local\Android\Sdk
PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

## Build Commands

### Development Build
```bash
cd builds/ehix-android
cordova build android
```

### Production Build (Release APK)
```bash
cd builds/ehix-android
cordova build android --release
```

### Install to Connected Device
```bash
cd builds/ehix-android
cordova run android
```

## App Configuration

### Package Details
- **Package ID**: com.cadentialstudios.ehix
- **App Name**: Ehix: The Triune Convergence
- **Version**: 1.0.0
- **Publisher**: Cadential Studios

### Mobile Optimizations Applied
- Mobile mode toggle button
- Responsive design with Tailwind CSS
- Touch-friendly UI elements
- Portrait orientation lock
- Google Pixel 9 optimized layout
- Background color: #1a1a2e (game theme)
- Splash screen: 2 second delay

### Features Included
- Offline gameplay (no internet required)
- Local save system
- Full game content
- Mobile-responsive interface
- Inventory management
- Combat system
- Story progression

## File Locations

### APK Output
- **Debug APK**: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `platforms/android/app/build/outputs/apk/release/app-release.apk`

### Source Files
- **Game HTML**: `www/index.html`
- **Game Assets**: `www/assets/`
- **Configuration**: `config.xml`

## Next Steps (After Android Studio Setup)
1. Set Android SDK environment variables
2. Run `cordova requirements` to verify setup
3. Build the APK with `cordova build android`
4. Test on device or emulator
5. Create signed release APK for distribution

## Troubleshooting
- If build fails, check ANDROID_HOME environment variable
- Ensure Android SDK tools are in PATH
- Verify Java JDK is version 8-21
- Run `cordova clean android` if build cache issues occur

# Developer Guide - Ehix Android App

## Project Structure Overview

```
ehix-android/
├── config.xml              # Main Cordova configuration
├── www/                    # Web app source files
│   ├── index.html         # Main HTML file
│   ├── assets/           # Game assets
│   │   ├── css/          # Stylesheets
│   │   ├── js/           # JavaScript files
│   │   └── images/       # Game images
│   ├── data/             # Game data files
│   └── saves/            # Save game directory
├── platforms/
│   └── android/          # Android platform (auto-generated)
├── plugins/              # Cordova plugins (auto-generated)
├── res/                  # App resources
└── hooks/                # Build hooks
```

## Key Files Modified for Mobile

### config.xml
- Package identifier: `com.cadentialstudios.ehix`
- Mobile-specific preferences
- Android platform configuration
- App metadata and descriptions

### Mobile Enhancements
1. **Mobile Mode Toggle** (`assets/js/mobile.js`)
   - Smart device detection
   - UI scaling for mobile
   - Touch-optimized controls

2. **Responsive CSS** (`assets/css/main.css`)
   - Mobile-first design
   - Touch-friendly button sizes
   - Google Pixel 9 optimizations

3. **HTML Structure** (`index.html`)
   - Responsive viewport meta tag
   - Mobile toggle button
   - Responsive grid layouts

## Development Workflow

### 1. Modify Game Files
Edit files in the main project directory:
- `index.html` - Main game file
- `assets/` - CSS, JS, and images
- `data/` - Game content and data

### 2. Update Cordova Project
Copy changes to the Cordova www directory:
```bash
# From main project directory
Copy-Item index.html builds/ehix-android/www/
Copy-Item assets builds/ehix-android/www/ -Recurse -Force
Copy-Item data builds/ehix-android/www/ -Recurse -Force
```

### 3. Build and Test
```bash
cd builds/ehix-android
cordova build android
cordova run android  # Install on connected device
```

## Mobile-Specific Features

### Auto-Detection
The app automatically detects mobile devices and suggests enabling mobile mode for screens ≤430px wide (Google Pixel 9 size).

### Touch Optimizations
- Buttons have minimum 44px touch targets
- Disabled text selection where appropriate
- Enhanced visual feedback for touches
- Prevented zoom on form inputs

### Mobile Mode Styling
When mobile mode is active:
- Smaller font sizes and compact spacing
- Optimized moon icons (2rem instead of 3rem)
- Touch-friendly inventory slots
- Condensed UI panels

## Testing Checklist

### Functionality Tests
- [ ] Game starts correctly
- [ ] Mobile mode toggle works
- [ ] Character creation flows properly
- [ ] Combat system functions
- [ ] Inventory management works
- [ ] Save/load system operates
- [ ] All screens are responsive

### Mobile-Specific Tests
- [ ] Auto-detection prompts on small screens
- [ ] Mobile mode persists across sessions
- [ ] Touch targets are appropriately sized
- [ ] Text remains readable at all sizes
- [ ] No horizontal scrolling required
- [ ] Portrait orientation works well

### Device Testing
- [ ] Google Pixel 9 (430px width)
- [ ] Other Android phones
- [ ] Tablets in portrait mode
- [ ] Various screen densities

## Build Variants

### Debug Build
```bash
cordova build android
```
- Outputs to: `platforms/android/app/build/outputs/apk/debug/`
- Includes debugging symbols
- Suitable for testing

### Release Build
```bash
cordova build android --release
```
- Outputs to: `platforms/android/app/build/outputs/apk/release/`
- Optimized and minified
- Requires signing for distribution

## Troubleshooting

### Common Issues
1. **Build Failures**
   - Check ANDROID_HOME environment variable
   - Verify Android SDK installation
   - Ensure Java JDK 8-21 is installed

2. **Mobile Mode Issues**
   - Check mobile.js is loaded
   - Verify localStorage permissions
   - Test device detection logic

3. **Layout Problems**
   - Check CSS media queries
   - Verify Tailwind CSS classes
   - Test on actual devices

### Debug Commands
```bash
# Check requirements
cordova requirements

# Clean build cache
cordova clean android

# Verbose build output
cordova build android --verbose

# Device logs
adb logcat
```

## Future Enhancements

### Planned Features
- App icons and splash screens
- Push notifications for updates
- Cloud save synchronization
- Achievement system
- Social sharing features

### Performance Optimizations
- Asset preloading
- Code splitting
- Image optimization
- Bundle size reduction

## Contributing

When contributing to the mobile version:
1. Test on multiple devices and screen sizes
2. Ensure responsive design works across breakpoints
3. Verify mobile mode toggle functions correctly
4. Update documentation for any new mobile features
5. Include mobile-specific testing in pull requests

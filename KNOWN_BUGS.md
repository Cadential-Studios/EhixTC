# KNOWN BUGS & ISSUES

**Last Updated**: July 19, 2025
**Game Version**: 0.1.0

## 🚨 CRITICAL BUGS (Game Breaking)

### **BUG-001: Missing Panel Functions**
**Severity**: Critical
**Status**: ❌ Unresolved
**Component**: UI System (main.js)
**Description**: Several panel-related functions are called but not defined, causing JavaScript errors when players try to access panels.

**Missing Functions**:
- `openPanel()` - Called when nav buttons are clicked
- `closeAllPanels()` - Called when close buttons are clicked
- `updateDisplay()` - Called after character creation and game loading

**Error**: `Uncaught ReferenceError: openPanel is not defined`
**Impact**: Journal, Character, Inventory, and Settings panels cannot be opened
**Reproduction**: Click any bottom navigation icon

**Fix Required**: Implement the missing panel management functions

---

### **BUG-002: Incomplete Data Loading**
**Severity**: Critical
**Status**: ❌ Unresolved
**Component**: Data System (main.js lines 60-84)
**Description**: Game attempts to load all JSON data files but some may be empty or incomplete, causing runtime errors.

**Files with Potential Issues**:
- `data/locations.json` - May be empty or have wrong structure
- `data/scenes.json` - May be empty or have wrong structure
- `data/quests.json` - Likely empty/placeholder
- `data/monsters.json` - Likely empty/placeholder
- `data/calendar.json` - Likely empty/placeholder

**Error**: Game may fail silently if data files are malformed
**Impact**: Story progression, location rendering, and game features may not work
**Fix Required**: Validate all JSON files and ensure proper error handling

---

## 🔴 HIGH PRIORITY BUGS

### **BUG-003: Action Button Event Handling**
**Severity**: High
**Status**: ❌ Unresolved
**Component**: Location Rendering (main.js lines 250+)
**Description**: Action buttons in locations use inline event handlers that may not be properly bound.

**Code Issue**:
```javascript
document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', (e) => {
        // Event handler code is cut off in the visible portion
```

**Impact**: Location interactions may not work correctly
**Fix Required**: Complete the event handler implementation

---

### **BUG-004: Scene Data Hardcoded**
**Severity**: High
**Status**: ❌ Unresolved
**Component**: Data Management (main.js lines 86-180)
**Description**: Scene and location data is hardcoded in main.js instead of being loaded from JSON files.

**Problem**: 
- Scenes are defined directly in JavaScript (lines 125-180)
- Locations are defined directly in JavaScript (lines 86-125)
- This conflicts with the data loading system that tries to load from JSON files

**Impact**: 
- Data inconsistency between hardcoded and JSON data
- Makes content management difficult
- Potential for data conflicts

**Fix Required**: Move all hardcoded data to proper JSON files or remove JSON loading

---

### **BUG-005: Incomplete Save System Implementation**
**Severity**: High
**Status**: ❌ Unresolved
**Component**: Save/Load System (main.js lines 338-420)
**Description**: Save system functions exist but UI elements are missing from HTML.

**Missing Elements**:
- `#save-slots` container in Settings panel
- `#save-message` element for feedback
- Save/Load buttons in UI

**Impact**: Players cannot save or load their progress
**Fix Required**: Add proper save/load UI to settings panel

---

## 🟡 MEDIUM PRIORITY BUGS

### **BUG-006: Character Stats Not Applied**
**Severity**: Medium
**Status**: ❌ Unresolved
**Component**: Character Creation (main.js lines 430-445)
**Description**: Character stats from classes.json are loaded but not displayed or used in gameplay.

**Issue**: Stats are stored in `gameData.player.stats` but never referenced
**Impact**: Character differences are cosmetic only
**Fix Required**: Implement stat usage in skill checks and combat

---

### **BUG-007: Inventory Items Not Rendered**
**Severity**: Medium
**Status**: ❌ Unresolved
**Component**: Inventory System
**Description**: Starting equipment is added to inventory but no rendering function exists.

**Missing Functions**:
- `renderInventory()` - Display items in inventory panel
- `renderCharacterSheet()` - Display character info
- `renderJournal()` - Display quest and lore information

**Impact**: Players cannot see their items or character information
**Fix Required**: Implement panel content rendering functions

---

### **BUG-008: Moon Phase System Not Functional**
**Severity**: Medium
**Status**: ❌ Unresolved
**Component**: Time System (main.js lines 12-20)
**Description**: Moon phases are defined but never updated or displayed.

**Issues**:
- `advanceTime()` function not implemented
- Moon phase calculations missing
- Visual moon phase updates not working

**Impact**: Time passage and moon mechanics don't work
**Fix Required**: Implement time advancement and moon phase calculations

---

### **BUG-009: Quest System Incomplete**
**Severity**: Medium
**Status**: ❌ Unresolved
**Component**: Quest Management
**Description**: Quests are added to player data but no tracking or display system exists.

**Missing Features**:
- Quest progress tracking
- Quest completion detection
- Quest log display in journal

**Impact**: Players can't track quest progress
**Fix Required**: Implement complete quest management system

---

## 🟢 LOW PRIORITY BUGS

### **BUG-010: CSS Image Paths**
**Severity**: Low
**Status**: ❌ Unresolved
**Component**: Styling (main.css line 18)
**Description**: Background texture uses external URL that may not always be available.

**Code**: `background: url('https://www.transparenttextures.com/patterns/dark-matter.png');`
**Impact**: Background may not display if external service is down
**Fix Required**: Download texture locally or provide fallback

---

### **BUG-011: Placeholder Images**
**Severity**: Low
**Status**: ❌ Unresolved
**Component**: Location Images
**Description**: All location images use placeholder URLs.

**Examples**:
- `https://placehold.co/800x300/6D4C3C/E0E0E0?text=Westwalker+Camp`
- These are temporary and should be replaced with actual artwork

**Impact**: Visual presentation is not final
**Fix Required**: Replace with proper game artwork

---

### **BUG-012: Missing Sound System**
**Severity**: Low
**Status**: ❌ Unresolved
**Component**: Audio
**Description**: No audio implementation despite volume setting in game data.

**Missing**: 
- Background music
- Sound effects
- Audio management system

**Impact**: Game lacks audio feedback
**Fix Required**: Implement audio system

---

## 🐛 POTENTIAL ISSUES (Code Quality)

### **ISSUE-001: No Error Handling for JSON Loading**
**Component**: Data Loading (main.js lines 60-84)
**Description**: Basic try/catch exists but no user feedback for failed loads
**Recommendation**: Add user-friendly error messages and retry mechanisms

### **ISSUE-002: Memory Leaks in Event Listeners**
**Component**: Dynamic Content
**Description**: Event listeners are added to dynamically created buttons but may not be properly cleaned up
**Recommendation**: Implement proper event delegation or cleanup

### **ISSUE-003: No Input Validation**
**Component**: Save System
**Description**: Save data is not validated before loading
**Recommendation**: Add save file validation and corruption handling

### **ISSUE-004: Hardcoded DOM Selectors**
**Component**: Throughout main.js
**Description**: Many functions rely on hardcoded element IDs that may not exist
**Recommendation**: Add null checks before using DOM elements

### **ISSUE-005: No Mobile Optimization**
**Component**: UI/UX
**Description**: Game may not work well on touch devices
**Recommendation**: Add touch event handling and mobile-specific CSS

---

## 🛠️ TESTING RECOMMENDATIONS

### **Immediate Testing Priorities**:
1. **Panel Navigation**: Test all bottom navigation buttons
2. **Character Creation**: Verify each origin creates a playable character
3. **Data Loading**: Check browser console for JavaScript errors
4. **Story Progression**: Test scene transitions and choices
5. **Save/Load**: Verify save functionality works

### **Browser Compatibility**:
- Test in Chrome, Firefox, Safari, Edge
- Check mobile browsers (Chrome Mobile, Safari Mobile)
- Verify on different screen sizes

### **Performance Testing**:
- Check memory usage during extended play
- Test with browser developer tools
- Verify game works offline (after initial load)

---

## 📋 RESOLUTION PRIORITY

### **Phase 1 - Critical Fixes (Complete First)**:
1. BUG-001: Implement missing panel functions
2. BUG-002: Validate and fix data loading
3. BUG-003: Complete action button event handling
4. BUG-005: Add save/load UI elements

### **Phase 2 - Core Gameplay**:
1. BUG-004: Resolve data structure conflicts
2. BUG-006: Implement character stats usage
3. BUG-007: Create panel content rendering
4. BUG-008: Implement time and moon systems

### **Phase 3 - Polish & Enhancement**:
1. BUG-009: Complete quest system
2. BUG-010-012: Address low priority issues
3. All code quality issues

---

## 📝 NOTES

- **Testing Environment**: Game tested on local server (Python http.server)
- **Browser Console**: Check for JavaScript errors during testing
- **Data Integrity**: Verify all JSON files are valid and complete
- **User Experience**: Focus on core game loop functionality first

*This document should be updated as bugs are fixed and new issues are discovered.*

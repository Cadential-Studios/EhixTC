# TODO.md - Development Task List for Codex AI

## 🚨 CRITICAL - FOUNDATION TASKS (Complete These First)

### **TASK 1: Code Organization** 
**Branch**: `develop`
**Priority**: 🔴 CRITICAL
**Status**: ✅ Completed

**Objective**: Extract embedded code from `index.html` to separate files

**Steps**:
1. Check current branch: `git branch`
2. Switch to develop: `git checkout develop`
3. Extract all `<style>` content from `index.html` to `assets/css/main.css`
4. Extract all `<script>` content from `index.html` to `assets/js/main.js`
5. Update `index.html` to reference external files
6. Test that game still loads correctly
7. Commit changes: "Extract CSS and JS to external files"

**Acceptance Criteria**:
- [ ] No inline CSS in `index.html`
- [ ] No inline JavaScript in `index.html`
- [ ] Game loads and functions identically
- [ ] External files are properly linked

---

### **TASK 2: Populate Core JSON Data**
**Branch**: `content/locations` 
**Priority**: 🔴 CRITICAL
**Status**: ✅ Completed

**Objective**: Add essential game data to make the game functional

#### **2A: Character Origins (`data/classes.json`)**
**Steps**:
1. Switch to branch: `git checkout content/locations`
2. Complete the three character origins:
   - **Westwalker of the Frontier** (ranger/survival focus)
   - **M'ra Kaal (Leonin)** (spirit-speaker/honor focus) 
   - **Gaian Scholar** (academic/magic focus)
3. Include stats, starting equipment, and background lore

**Required Fields for Each Origin**:
```json
{
  "origin_id": {
    "name": "Origin Name",
    "description": "Detailed background description",
    "stats": {
      "strength": 10,
      "dexterity": 10,
      "constitution": 10,
      "intelligence": 10,
      "wisdom": 10,
      "charisma": 10
    },
    "startingEquipment": ["item1", "item2"],
    "skills": ["skill1", "skill2"],
    "lore": "Background story and cultural context"
  }
}
```

#### **2B: Starting Locations (`data/locations.json`)**
**Steps**:
1. Add Griefwood and surrounding frontier areas
2. Include 3-5 starting locations players can visit
3. Add appropriate actions and descriptions

#### **2C: Opening Scenes (`data/scenes.json`)**
**Steps**:
1. Create character creation scenes
2. Add opening story sequence
3. Link scenes with proper choice trees

**Acceptance Criteria**:
- [ ] All three character origins are complete with stats
- [ ] 3-5 starting locations are defined
- [ ] Character creation flow works
- [ ] Opening story scenes are playable

---

## 🟡 HIGH PRIORITY - CORE FUNCTIONALITY

### **TASK 3: UI Panel Functionality**
**Branch**: `feature/ui-improvements`
**Priority**: 🟡 HIGH
**Status**: ❌ Not Started

**Objective**: Make Journal, Character, Inventory, and Settings panels functional

**Steps**:
1. Switch to branch: `git checkout feature/ui-improvements`
2. Implement Journal panel with story progress tracking
3. Create Character panel showing stats and origin info
4. Build Inventory panel with item grid display
5. Add basic Settings panel with preferences

**Acceptance Criteria**:
- [ ] Journal shows completed scenes and lore discovered
- [ ] Character panel displays current stats and origin
- [ ] Inventory shows items with descriptions
- [ ] Settings panel has basic options
- [ ] All panels open/close smoothly

---

### **TASK 4: Save/Load System**
**Branch**: `feature/save-load-system`
**Priority**: 🟡 HIGH
**Status**: ❌ Not Started

**Objective**: Implement working save/load functionality

**Steps**:
1. Switch to branch: `git checkout feature/save-load-system`
2. Create save file generation based on `saves/sample_save.json`
3. Implement local storage save system
4. Add load functionality
5. Create save/load UI buttons

**Acceptance Criteria**:
- [ ] Players can save game progress
- [ ] Save files store character, progress, and world state
- [ ] Players can load previous saves
- [ ] Multiple save slots available
- [ ] Save system is persistent across browser sessions

---

### **TASK 5: Time and Moon System**
**Branch**: `feature/moon-mechanics`
**Priority**: 🟡 HIGH
**Status**: ❌ Not Started

**Objective**: Implement the three-moon calendar system

**Steps**:
1. Switch to branch: `git checkout feature/moon-mechanics`
2. Create time progression system
3. Implement three moon cycles (Edyria, Kapra, Enia)
4. Add visual moon phase indicators
5. Connect moon phases to gameplay effects

**Acceptance Criteria**:
- [ ] Time advances as player makes choices
- [ ] Three moons have independent cycles
- [ ] Moon phases are visually displayed
- [ ] Moon phases affect available actions/events
- [ ] Calendar system tracks convergence approach

---

## 🟢 MEDIUM PRIORITY - CONTENT EXPANSION

### **TASK 6: Expand Story Content**
**Branch**: `feature/story-expansion`
**Priority**: 🟢 MEDIUM
**Status**: ❌ Not Started

**Objective**: Add more story scenes and branching paths

**Steps**:
1. Switch to branch: `git checkout feature/story-expansion`
2. Add 10-15 new story scenes
3. Create meaningful choice consequences
4. Implement origin-specific dialogue options
5. Add random events based on moon phases

**Acceptance Criteria**:
- [ ] Multiple story paths available
- [ ] Choices have meaningful consequences
- [ ] Origin-specific content exists
- [ ] Story connects to moon convergence theme

---

### **TASK 7: Items and Equipment**
**Branch**: `content/items-equipment`
**Priority**: 🟢 MEDIUM
**Status**: ❌ Not Started

**Objective**: Create comprehensive item system

**Steps**:
1. Switch to branch: `git checkout content/items-equipment`
2. Populate `data/items.json` with 20-30 items
3. Include weapons, armor, tools, and consumables
4. Add item rarity system
5. Implement equipment effects on stats

**Categories to Include**:
- [ ] **Weapons**: Frontier tools, Leonin weapons, Scholar implements
- [ ] **Armor**: Light, medium, heavy protection
- [ ] **Tools**: Survival gear, scholarly instruments, spiritual items
- [ ] **Consumables**: Food, potions, spell components

---

### **TASK 8: Quest System Foundation**
**Branch**: `feature/quest-system`
**Priority**: 🟢 MEDIUM
**Status**: ❌ Not Started

**Objective**: Implement basic quest tracking and completion

**Steps**:
1. Switch to branch: `git checkout feature/quest-system`
2. Create quest data structure in `data/quests.json`
3. Implement quest tracking in game state
4. Add quest completion detection
5. Create quest log UI

**Quest Types to Include**:
- [ ] **Main Story**: Convergence preparation
- [ ] **Side Quests**: Character-specific missions
- [ ] **Discovery**: Exploring locations and lore

---

## 🔵 LOW PRIORITY - POLISH & ENHANCEMENT

### **TASK 9: World Map System**
**Branch**: `feature/world-map`
**Priority**: 🔵 LOW
**Status**: ❌ Not Started

**Objective**: Create interactive world map for travel

**Steps**:
1. Switch to branch: `git checkout feature/world-map`
2. Design map layout for the frontier region
3. Implement location discovery system
4. Add travel mechanics with time costs
5. Create map UI with location markers

---

### **TASK 10: Audio Implementation**
**Branch**: `feature/audio-system`
**Priority**: 🔵 LOW
**Status**: ❌ Not Started

**Objective**: Add sound effects and background music

**Steps**:
1. Switch to branch: `git checkout feature/audio-system`
2. Create audio manager system
3. Add ambient soundscapes for different locations
4. Implement UI sound effects
5. Add audio settings controls

---

### **TASK 11: Advanced UI Polish**
**Branch**: `feature/ui-improvements`
**Priority**: 🔵 LOW
**Status**: ❌ Not Started

**Objective**: Enhanced animations and visual effects

**Steps**:
1. Add smooth transitions between scenes
2. Implement typing animation for text
3. Create hover effects for interactive elements
4. Add loading animations
5. Enhance mobile responsiveness

---

## 🛠️ TECHNICAL DEBT & OPTIMIZATION

### **TASK 12: Code Optimization**
**Branch**: `develop`
**Priority**: 🟢 MEDIUM
**Status**: ❌ Not Started

**Objective**: Optimize game performance and code quality

**Steps**:
1. Implement lazy loading for large JSON files
2. Add error handling for data loading
3. Optimize CSS for faster rendering
4. Add loading states for better UX
5. Implement proper event cleanup

---

### **TASK 13: Testing & Validation**
**Branch**: `develop`
**Priority**: 🟡 HIGH
**Status**: ❌ Not Started

**Objective**: Ensure game stability and data integrity

**Steps**:
1. Add JSON schema validation
2. Implement save file integrity checks
3. Test cross-browser compatibility
4. Validate mobile touch interactions
5. Test performance on lower-end devices

---

## 📋 TASK COMPLETION CHECKLIST

### Before Starting Any Task:
- [ ] Check current branch: `git branch`
- [ ] Switch to appropriate branch for the task
- [ ] Pull latest changes: `git pull origin [branch-name]`
- [ ] Reference `AGENT.md` for coding guidelines

### After Completing Any Task:
- [ ] Test changes thoroughly in browser
- [ ] Check console for errors
- [ ] Validate JSON files if modified
- [ ] Test on mobile viewport
- [ ] Commit with descriptive message
- [ ] Push to remote branch
- [ ] Update this TODO with completion status

### Task Status Legend:
- ❌ **Not Started**
- 🟡 **In Progress** 
- ✅ **Completed**
- 🔄 **Testing/Review**
- ⚠️ **Blocked/Issues**

---

## 🚀 QUICK START FOR CODEX AI

**To begin development, start with TASK 1** (Code Organization). This is the foundation that makes all other tasks easier.

**Command sequence to start:**
```bash
git branch                    # Check current branch
git checkout develop          # Switch to development branch
git pull origin develop       # Get latest changes
# Now begin TASK 1
```

**Remember**: Always work on feature/content branches, never directly on `main`!

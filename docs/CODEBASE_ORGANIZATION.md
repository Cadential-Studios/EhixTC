# Ehix - The Triune Convergence: Codebase Organization

## 📁 Directory Structure

### `/assets`
Main assets directory containing all game resources.

#### `/assets/js` - JavaScript Code Organization
```
assets/js/
├── systems/          # Core game systems and mechanics
├── ui/              # User interface components
├── utils/           # Utility functions and helpers
├── scenes.js        # Scene management and story flow
├── developerMenu.js # Development and debugging tools
└── main.js          # Main game initialization
```

#### `/assets/js/systems` - Game Systems
- **`character.js`** - Character creation, stats, equipment management
- **`combat.js`** - Combat mechanics, turn-based system
- **`consumableSystem.js`** - Item usage, effects, buffs/debuffs
- **`crafting.js`** - Item crafting and recipes
- **`experience.js`** - Core experience and leveling system
- **`experienceTracker.js`** - Experience tracking and display
- **`progression.js`** - Character progression and advancement

#### `/assets/js/ui` - User Interface
- **`inventory.js`** - Main inventory system and management
- **`inventoryUIFeatures.js`** - Advanced inventory features (drag-drop, tooltips)
- **`inventoryAnalytics.js`** - Inventory statistics and analytics
- **`advancedSorting.js`** - Sorting and filtering systems
- **`activeEffectsDisplay.js`** - Real-time effects tracking display
- **`statAnimator.js`** - Animated stat changes and visual feedback
- **`ui.js`** - General UI utilities and components

#### `/assets/js/utils` - Utilities
- **`core.js`** - Core game data, initialization, fundamental functions
- **`tools.js`** - Helper functions and utilities
- **`save.js`** - Save/load game state management

### `/data` - Game Data Files
```
data/
├── item_data/       # Item definitions and properties
├── backgrounds.json # Character backgrounds
├── calendar.json    # Game world calendar
├── classes.json     # Character classes
├── effects.json     # Status effects and buffs
├── features.json    # Character features and abilities
├── locations.json   # World locations
├── monsters.json    # Enemy and creature definitions
├── preset_characters.json # Pre-made characters
├── quests.json      # Quest definitions
├── recipes.json     # Crafting recipes
├── scenes.json      # Story scenes and dialogue
└── species.json     # Character races/species
```

#### `/data/item_data` - Item Categories
- **`weapons.json`** - Weapons with combat properties
- **`armor.json`** - Protective equipment
- **`accessories.json`** - Rings, amulets, misc equipment
- **`consumables.json`** - Potions, food, usable items
- **`tools.json`** - Utility items and instruments
- **`quest_items.json`** - Story-specific items
- **`materials.json`** - Crafting components
- **`magical.json`** - Magical items and artifacts
- **`equipment.json`** - General equipment definitions
- **`templates.json`** - Item template definitions

## 🔄 Load Order and Dependencies

### Script Loading Order (index.html)
1. **Core Utilities** - Foundation systems
2. **Game Systems** - Core mechanics and gameplay
3. **UI Components** - User interface elements
4. **Game Flow** - Scene management and initialization

### Dependency Chain
```
core.js → tools.js → save.js
    ↓
experience.js → experienceTracker.js → progression.js
    ↓
character.js → consumableSystem.js
    ↓
inventory systems → UI components
    ↓
scenes.js → main.js
```

## 📋 Data Standardization

### Standardized Formats

#### Item Properties
- **`type`**: lowercase (e.g., "weapon", "armor", "consumable")
- **`subtype`**: lowercase (e.g., "melee", "ranged", "light")
- **`slot`**: camelCase (e.g., "mainHand", "offHand", "chest")
- **`rarity`**: lowercase (e.g., "common", "uncommon", "rare", "epic", "legendary")
- **`properties`**: lowercase array (e.g., ["versatile", "thrown"])

#### Consistent Naming
- File names: lowercase with underscores
- Function names: camelCase
- Class names: PascalCase
- Constants: UPPER_SNAKE_CASE

## 🧩 System Integration

### Core Systems Communication
- **Character System** ↔ **Experience System** ↔ **Progression System**
- **Inventory System** ↔ **Consumable System** ↔ **Character System**
- **Combat System** ↔ **Character System** ↔ **Experience System**
- **UI Systems** ↔ **All Game Systems** (for display and interaction)

### Event Flow
1. **User Action** → **UI Component** → **Game System** → **Data Update**
2. **Data Change** → **Event Trigger** → **UI Update** → **Visual Feedback**

## 🛠️ Development Guidelines

### Adding New Features
1. Identify the appropriate system folder (`systems/`, `ui/`, `utils/`)
2. Follow existing naming conventions
3. Update `index.html` script loading order if needed
4. Document dependencies and integration points

### Code Organization Principles
- **Separation of Concerns**: Systems handle logic, UI handles display
- **Single Responsibility**: Each file has a clear, focused purpose
- **Loose Coupling**: Systems communicate through well-defined interfaces
- **High Cohesion**: Related functionality grouped together

## 📖 File Documentation
Each major file includes:
- Purpose and responsibility
- Dependencies and requirements
- Key functions and classes
- Integration points with other systems

This organization provides a clear, maintainable structure for the growing RPG system while maintaining performance and readability.

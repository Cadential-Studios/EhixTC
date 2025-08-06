# Source Code Organization

This document describes the organization of the game's source code.

## Directory Structure

```
src/
├── assets/
│   ├── css/           # Stylesheets
│   ├── images/        # Game images and assets
│   └── js/            # JavaScript source code
│       ├── core/      # Core game logic and flow
│       ├── dev/       # Developer tools and debug utilities
│       ├── platform/  # Platform-specific code (mobile, etc.)
│       ├── systems/   # Game systems (combat, crafting, etc.)
│       ├── ui/        # User interface components
│       └── utils/     # Utility functions and helpers
└── data/              # Game data files (JSON, etc.)
    ├── dialogue/      # Conversation and story data
    ├── items/         # Item definitions
    ├── locations/     # Location data organized by region
    ├── loot_tables/   # Loot generation tables
    ├── npcs/          # NPC definitions
    ├── shops/         # Shop configurations
    └── ...           # Other data categories
```

## JavaScript Module Organization

### Core (`src/assets/js/core/`)
Core game flow and essential systems:
- `main.js` - Main game initialization and startup
- `scenes.js` - Scene management and rendering
- `version.js` - Version display and management

### Systems (`src/assets/js/systems/`)
Independent game systems:
- `character.js` - Character stats and progression
- `combat.js` - Combat mechanics
- `crafting.js` - Crafting system
- `foraging.js` - Resource gathering
- `locationManager.js` - Location and travel system
- `spellcasting.js` - Magic system
- And more...

### UI (`src/assets/js/ui/`)
User interface components:
- `inventory.js` - Inventory management
- `ui.js` - General UI utilities
- `skillColors.js` - Skill-based color coding
- And more...

### Utils (`src/assets/js/utils/`)
Shared utility functions:
- `core.js` - Core utilities and helpers
- `save.js` - Save/load functionality
- `regionUtils.js` - Region formatting and styling
- And more...

### Platform (`src/assets/js/platform/`)
Platform-specific code:
- `mobile.js` - Mobile device adaptations

### Dev (`src/assets/js/dev/`)
Development and debugging tools:
- `developerMenu.js` - In-game developer console

## Data Organization

Game data is organized by category in the `src/data/` directory. Each category has its own subdirectory with related JSON files.

### Locations
Location data is organized by region:
- `locations/frontier/` - Frontier region locations
- `locations/towns/` - Town and city locations
- `locations/pridelands/` - Pridelands region
- `locations/gaia/` - Gaia region

## Naming Conventions

- **Files**: Use camelCase for JavaScript files (e.g., `locationManager.js`)
- **Directories**: Use lowercase with underscores for data directories (e.g., `loot_tables/`)
- **Classes**: Use PascalCase (e.g., `LocationManager`)
- **Functions**: Use camelCase (e.g., `handleExploration()`)

## Loading Order

JavaScript files are loaded in a specific order in `index.html`:

1. **Core Utilities** - Basic helpers and setup
2. **Game Systems** - Independent game systems
3. **UI Components** - User interface elements
4. **Platform Code** - Platform-specific adaptations
5. **Core Game Flow** - Main game logic and startup

This organization ensures dependencies are resolved correctly and the game initializes properly.

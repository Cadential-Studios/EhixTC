# Edoria: The Triune Convergence

An interactive RPG game set in a fantasy world shaped by the celestial dance of three moons.

## Project Structure

```
Ehix - The Triune Convergence/
│
├── index.html              # Main game entry point
├── index_new.html          # Updated version with organized structure
│
├── assets/                 # Game assets
│   ├── css/
│   │   └── main.css        # Main stylesheet
│   ├── js/
│   │   └── main.js         # Main game script
│   ├── images/             # Game images and artwork
│   │   └── locations/      # Location images
│   └── audio/              # Sound effects and music
│
├── data/                   # Game data (JSON files)
│   ├── locations.json      # Location definitions
│   ├── scenes.json         # Story scenes and dialogue
│   ├── classes.json        # Character classes/origins
│   ├── items.json          # Item definitions
│   ├── quests.json         # Quest data
│   ├── monsters.json       # Monster/enemy data
│   └── calendar.json       # World calendar and time system
│
├── saves/                  # Player save files
│   └── sample_save.json    # Example save file structure
│
└── docs/                   # Documentation
    └── README.md           # This file
```

## Game Features

### Current Features
- **Character Creation**: Choose from three origins (Westwalker, Leonin, Gaian)
- **Interactive Story**: Branching narrative with meaningful choices
- **Time System**: Dynamic calendar with three-moon phases
- **UI Panels**: Journal, Character, Inventory, and Settings
- **Save System**: JSON-based save file structure

### Data Structure

#### Game Data Files
- **locations.json**: Defines all game locations with descriptions, actions, and images
- **scenes.json**: Contains story scenes, dialogue, and choice trees
- **classes.json**: Character origins with stats, skills, and starting equipment
- **items.json**: All game items with properties, effects, and descriptions
- **quests.json**: Quest definitions with objectives and rewards
- **monsters.json**: Enemy creatures with stats and abilities
- **calendar.json**: World calendar system and moon phases

#### Save File Structure
Save files are stored as JSON and contain:
- Player data (stats, inventory, progress)
- World state (time, discovered locations)
- Story progress (completed scenes, choices made)
- Game settings

## Development

### Technologies Used
- **HTML5**: Game structure and layout
- **CSS3**: Styling with custom properties and responsive design
- **JavaScript (ES6+)**: Game logic and interactivity
- **Tailwind CSS**: Utility-first CSS framework
- **JSON**: Data storage and save files

### Getting Started
1. Clone the repository
2. Open `index_new.html` in a web browser
3. Start playing!

### File Organization
- Keep all game logic in `assets/js/`
- Store all styling in `assets/css/`
- Place images in appropriate `assets/images/` subdirectories
- Define game content in `data/` JSON files
- Player saves go in `saves/` directory

## Game Mechanics Documentation
Detailed information about how systems interact and where to find related data files can be found in [docs/Game_Mechanics.md](docs/Game_Mechanics.md).

## Game Lore

### The World of Edoria
Edoria is a fantasy world shaped by the dance of three moons:
- **Edyria** (Blue): Moon of wisdom and magic (15-day cycle)
- **Kapra** (Red): Moon of passion and war (28-day cycle)  
- **Enia** (Yellow): Moon of growth and nature (38-day cycle)

### The Triune Convergence
A rare celestial event when all three moons align, bringing great change to the world. The next convergence approaches in the year 999 PA (Post-Ascension).

### Character Origins
- **Westwalker**: Rangers from the frontier plains
- **M'ra Kaal (Leonin)**: Honor-bound lion-folk spirit speakers
- **Gaian Scholar**: Academics from the imperial capital

## Contributing

When adding new content:
1. Update appropriate JSON files in `data/`
2. Add new images to `assets/images/`
3. Test thoroughly before committing
4. Update this README if adding new features

## License

This project is part of Cadential Studios' game development portfolio.

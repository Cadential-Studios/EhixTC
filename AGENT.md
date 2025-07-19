# AGENT.md - AI Development Assistant Guide

## Project Overview
**Edoria: The Triune Convergence** is an interactive RPG story game built with HTML5, CSS3, and JavaScript. The game features a fantasy world shaped by three moons and their celestial cycles.

## 🚨 QUICK START - BRANCH REMINDER
**BEFORE MAKING ANY CHANGES:**
1. Check current branch: `git branch`
2. Switch to correct branch: `git checkout [branch-name]`
3. Common branches:
   - `develop` - General development
   - `feature/story-expansion` - Story content
   - `content/locations` - New locations
   - `feature/ui-improvements` - UI work
   - **NEVER work directly on `main`**

## Repository Information
- **Repository**: `Cadential-Studios/EhixTC`
- **Main Branch**: `main`
- **Project Type**: HTML5 Interactive Story Game
- **Technology Stack**: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS, JSON

## Project Structure & File Organization

### Core Files
```
├── index.html              # Main game entry point - DO NOT EDIT STRUCTURE
├── README.md               # Project documentation
├── .gitignore             # Git ignore rules
└── AGENT.md               # This file - AI assistant instructions
```

### Asset Structure
```
assets/
├── css/
│   └── main.css           # All game styling - extracted from HTML
├── js/
│   └── main.js            # All game logic - extracted from HTML
├── images/                # Game artwork (to be added)
│   └── locations/         # Location-specific images
└── audio/                 # Sound effects and music (to be added)
```

### Data Structure (JSON-Based Game Content)
```
data/
├── locations.json         # Game world locations
├── scenes.json           # Story scenes and dialogue trees
├── classes.json          # Character origins/classes
├── items.json            # Equipment, consumables, tools
├── quests.json           # Quest definitions and objectives
├── monsters.json         # Enemy creatures and NPCs
└── calendar.json         # World time system and moon phases
```

### Save System
```
saves/
└── sample_save.json      # Template for player save files
```

## Development Guidelines

### When Editing Content
1. **Story Content**: Edit JSON files in `data/` directory
2. **Styling**: Edit `assets/css/main.css`
3. **Game Logic**: Edit `assets/js/main.js`
4. **Main Structure**: Only edit `index.html` for major structural changes

### JSON Data File Structures

#### locations.json
```json
{
  "location_id": {
    "name": "Location Name",
    "description": "Detailed description",
    "image": "assets/images/locations/image.jpg",
    "region": "region_name",
    "actions": [
      { "text": "Action Text", "type": "scene|info|travel", "target": "target_id", "info": "info_text" }
    ]
  }
}
```

#### scenes.json
```json
{
  "scene_id": {
    "id": "scene_id",
    "text": "Scene narrative text",
    "onEnter": ["addQuest:quest_id", "addLore:lore_text"],
    "choices": [
      { "text": "Choice text", "nextScene": "next_scene_id" }
    ]
  }
}
```

#### items.json
```json
{
  "item_id": {
    "id": "item_id",
    "name": "Item Name",
    "type": "weapon|armor|consumable|tool|magical",
    "description": "Item description",
    "properties": ["property1", "property2"],
    "rarity": "common|uncommon|rare|epic|legendary",
    "value": 50
  }
}
```

### Game Systems

#### Time System
- **Calendar**: 8 months, 40 days each
- **Moons**: Edyria (15-day), Kapra (28-day), Enia (38-day cycles)
- **Current Year**: 998 PA (Post-Ascension)
- **Convergence**: Approaching in year 999 PA

#### Character Origins
1. **Westwalker**: Frontier ranger (survival focus)
2. **M'ra Kaal (Leonin)**: Spirit-speaker (honor/combat focus)
3. **Gaian Scholar**: Academic (knowledge/magic focus)

## AI Assistant Instructions

### 🔴 FIRST PRIORITY: BRANCH CHECK
**Before assisting with ANY code changes:**
1. Remind user to check current branch with `git branch`
2. Suggest appropriate branch for the task
3. Confirm they've switched to correct branch before proceeding
4. Never assist with changes on `main` branch (except for documentation)

### When Asked to Add Content

#### Adding New Locations
1. Edit `data/locations.json`
2. Follow the JSON structure above
3. Include proper image paths in `assets/images/locations/`
4. Add appropriate actions with correct types

#### Adding New Story Scenes
1. Edit `data/scenes.json`
2. Include proper scene flow and choices
3. Use onEnter for quest/lore triggers
4. Ensure scene IDs are unique

#### Adding New Items/Equipment
1. Edit `data/items.json`
2. Include all required properties
3. Balance stats appropriately
4. Consider rarity and value

#### Adding New Quests
1. Edit `data/quests.json`
2. Include objectives and rewards
3. Link to appropriate scenes/locations
4. Consider quest types (main, side, milestone)

### When Asked to Modify Styling
1. Edit `assets/css/main.css`
2. Maintain existing color scheme and theme
3. Use CSS custom properties where appropriate
4. Ensure responsive design principles

### When Asked to Add Game Logic
1. Edit `assets/js/main.js`
2. Follow existing code patterns
3. Use async/await for data loading
4. Maintain separation of concerns

### Code Style Guidelines

#### JavaScript
- Use ES6+ features (const/let, arrow functions, async/await)
- Follow camelCase naming convention
- Use meaningful variable names
- Comment complex logic

#### CSS
- Use BEM-like naming for custom classes
- Maintain existing color palette
- Ensure mobile responsiveness
- Use Tailwind classes where appropriate

#### JSON
- Use snake_case for IDs
- Include all required fields
- Maintain consistent structure
- Validate JSON syntax

### Common Tasks & Solutions

#### Adding a New Location
1. Add entry to `data/locations.json`
2. Create corresponding image in `assets/images/locations/`
3. Link from existing locations or scenes
4. Test navigation

#### Creating New Story Branch
1. Add scenes to `data/scenes.json`
2. Link choices between scenes
3. Add quest/lore triggers as needed
4. Update character progression

#### Implementing New Game Feature
1. Add data structure to appropriate JSON file
2. Update `assets/js/main.js` with logic
3. Add styling to `assets/css/main.css` if needed
4. Test thoroughly

### File Modification Priority
1. **High Priority**: JSON data files (content changes)
2. **Medium Priority**: CSS/JS files (functionality/styling)
3. **Low Priority**: HTML structure (only for major changes)

### Testing Guidelines
- Always test in browser after changes
- Verify JSON syntax with validator
- Check console for JavaScript errors
- Test on mobile/desktop viewports
- Verify save/load functionality

### Git Workflow & Branch Management

#### ⚠️ IMPORTANT: ALWAYS CHECK/SWITCH BRANCH BEFORE STARTING WORK
Before making ANY changes, always:
1. Check current branch: `git branch` or `git status`
2. Switch to appropriate branch: `git checkout [branch-name]`
3. Pull latest changes: `git pull origin [branch-name]`

#### Development Branch Strategy
- **NEVER develop directly on `main`** - main is for production-ready code only
- Use `develop` branch for general integration work
- Use specific feature/content branches for focused development
- Create new branches from `develop`, not `main`

#### Available Branches:
**Feature Branches:**
- `feature/story-expansion` - New story content, scenes, dialogue
- `feature/combat-system` - Combat mechanics implementation
- `feature/inventory-system` - Item management and equipment
- `feature/save-load-system` - Save/load functionality
- `feature/quest-system` - Quest tracking and management
- `feature/world-map` - Interactive map and travel
- `feature/character-progression` - Leveling, stats, skills
- `feature/audio-system` - Sound effects and music
- `feature/ui-improvements` - UI/UX enhancements
- `feature/moon-mechanics` - Moon phase gameplay effects

**Content Branches:**
- `content/locations` - New areas and environments
- `content/characters-npcs` - NPCs and character interactions
- `content/items-equipment` - New items, weapons, equipment

**Other Branches:**
- `develop` - Main development integration
- `hotfix/bug-fixes` - Critical bug fixes
- `release/v1.0` - Release preparation

#### Quick Branch Commands:
```bash
# Check current branch
git branch

# Switch to development branch
git checkout develop

# Switch to feature branch
git checkout feature/story-expansion

# Create and switch to new branch from develop
git checkout develop
git checkout -b feature/new-feature

# See all branches
git branch -a
```

#### Standard Git Workflow:
1. **Check current branch** before starting work
2. Switch to appropriate branch for the task
3. Pull latest changes
4. Make your changes
5. Test thoroughly
6. Commit with descriptive messages
7. Push to remote branch
8. Create pull request to merge into `develop`

## Important Notes

### DO NOT:
- Modify the core HTML structure without explicit request
- Break existing JSON data relationships
- Remove required fields from data structures
- Change file paths without updating references

### ALWAYS:
- Validate JSON syntax after editing
- Test changes in browser
- Maintain existing code style
- Update this AGENT.md if adding new systems
- Check for console errors

### WHEN IN DOUBT:
- Ask for clarification on requirements
- Suggest alternative approaches
- Test changes incrementally
- Document new features added

## Contact & Support
This project is developed by Cadential Studios. When providing assistance, maintain the fantasy theme and lore consistency of the Edoria universe.

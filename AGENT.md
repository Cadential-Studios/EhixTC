# AGENT.md - AI Development Assistant Guide

## Project Overview
**Edoria: The Triune Convergence** is an interactive RPG story game built with HTML5, CSS3, and JavaScript. The game features a fantasy world shaped by three moons and their celestial cycles.

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

### Git Workflow
- Always check current file state before editing
- Use descriptive commit messages
- Test changes before committing
- Keep commits focused on single features

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

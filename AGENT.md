# AGENT.md - AI Development Assistant Guide

Welcome to the Edoria: The Triune Convergence project! This guide is designed for AI assistants and developers collaborating on the codebase. It outlines best practices, project structure, coding standards, and workflow expectations to ensure high-quality, maintainable, and lore-consistent contributions.


## Project Overview
**Edoria: The Triune Convergence** is an interactive RPG story game built with HTML5, CSS3, and JavaScript. The game features a fantasy world shaped by three moons and their celestial cycles. The project emphasizes immersive storytelling, modular code, and extensibility for future content.

### AI Assistant Role
The AI assistant is expected to:
- Provide code suggestions and refactoring advice that align with project standards.
- Help with documentation, bug tracking, and feature planning.
- Maintain the fantasy theme and lore consistency in all content and code.
- Communicate clearly, concisely, and respectfully with human collaborators.


## Repository Information
- **Repository**: `Cadential-Studios/EhixTC`
- **Main Branch**: `main`
- **Project Type**: HTML5 Interactive Story Game
- **Technology Stack**: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS, JSON


## Project Structure & File Organization
Familiarize yourself with the directory layout. Keep new files organized and follow naming conventions. When adding new systems, update this section as needed.

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
These guidelines ensure code quality, maintainability, and a smooth collaborative workflow. AI assistants should always:
- Follow the branch and workflow rules below.
- Use clear, descriptive commit messages.
- Document all major changes and new features.


### When Editing Content
1. **Story Content**: Edit JSON files in `data/` directory. Ensure new content fits the established lore and narrative style.
2. **Styling**: Edit `assets/css/main.css`. Use Tailwind CSS classes where possible for consistency and responsiveness.
3. **Game Logic**: Edit `assets/js/main.js` and modular JS files. Keep logic modular and reusable.
4. **Main Structure**: Only edit `index.html` for major structural changes. Avoid breaking the main entry point.


### JSON Data File Structures
Maintain strict adherence to the data schemas below. Validate all JSON before committing. Add comments in code to explain complex data relationships.

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
Document any changes to core systems (time, combat, inventory, etc.) in the appropriate markdown files in `docs/`. When adding new mechanics, provide a summary and rationale.

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
This section is for AI and human contributors. Follow these best practices for effective collaboration:

### Communication
- Always clarify ambiguous requests before proceeding.
- Summarize your understanding of the task before making major changes.
- Use markdown formatting for code, file paths, and important notes.

### Code Review & Quality
- Suggest improvements and refactoring where appropriate.
- Point out potential bugs, edge cases, or performance issues.
- Ensure all code is commented and easy to follow.

### Documentation
- Update relevant markdown files in `docs/` for new features, bug fixes, or system changes.
- Use the Implementation Results Log template for all completed tasks.

### Testing
- Propose and document test cases for new features or bug fixes.
- Encourage manual and automated testing, especially for critical systems.

### Collaboration
- Respect the branch workflow and never commit directly to `main` (except for documentation).
- When in doubt, ask for clarification or suggest alternatives.


### 🔴 FIRST PRIORITY: BRANCH CHECK
**Before assisting with ANY code changes:**
1. Remind user to check current branch with `git branch` or `git status`.
2. Suggest the most appropriate branch for the requested task (feature, bugfix, content, etc.).
3. Confirm the user has switched to the correct branch before proceeding.
4. Never assist with changes on `main` branch (except for documentation updates).

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
Maintain a clean, readable, and consistent codebase. Use the following conventions:

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
Refer to these patterns for frequent requests. When implementing new features, always check for similar existing solutions first.

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
Prioritize changes that impact content and player experience. Avoid unnecessary changes to core structure unless required.
1. **High Priority**: JSON data files (content changes)
2. **Medium Priority**: CSS/JS files (functionality/styling)
3. **Low Priority**: HTML structure (only for major changes)


### Testing Guidelines
Testing is critical for game stability. Always:
- Test in multiple browsers and on mobile/desktop.
- Validate JSON and check for JavaScript errors.
- Test save/load and edge cases for new features.
- Always test in browser after changes
- Verify JSON syntax with validator
- Check console for JavaScript errors
- Test on mobile/desktop viewports
- Verify save/load functionality


### Git Workflow & Branch Management
Follow these steps for all code contributions. AI assistants should always remind users of these steps before major changes.

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
These rules help prevent common mistakes and maintain project integrity. AI assistants should enforce these guidelines and remind users as needed.


## Task Completion & Documentation Workflow
Proper documentation and task tracking are essential for project transparency and future maintenance. Use the following workflow for all features, bug fixes, and improvements.


### Managing TODO Documents
- Track all planned features, bug fixes, and improvements as markdown documents in the `docs/todo/` directory, organized by category (e.g., `features`, `bugs`, `other`).
- Each TODO document must clearly describe the tasks, issues, and planned solutions, with enough detail for any developer or AI to understand and implement.
- Upon completion, update the document status, add a completion date at the top, and move it to the appropriate `complete` subfolder (e.g., `docs/todo/bugs/complete/`).
- If follow-up actions are required, create a new TODO document and link it from the completed one.


### Implementation Results Log
Every TODO document must include the Implementation Results Log below. This ensures all work is documented, reviewed, and traceable. Fill it out in detail before moving a document to `complete`.

#### Implementation Results Log Template
```
## Implementation Results Log

Please complete this section after implementing the tasks. Use the prompts below to provide a thorough record of your work, decisions, and outcomes. This log helps maintain transparency, supports future debugging, and improves team communication.

**Developer Name:**  
[Enter your full name or team alias]

**Date of Implementation:**  
[Enter the date(s) when the work was completed]

**Tasks Completed:**  
- [List each task or bug addressed, referencing the task numbers above]

**Implementation Details:**  
- [Describe the approach taken for each task. Include code changes, refactoring, or design decisions.]
- [Mention any files or modules that were significantly modified.]
- [If applicable, include before/after behavior or screenshots.]

**Testing Performed:**  
- [Describe the testing process: manual, automated, unit, integration, etc.]
- [List test cases, scenarios, or edge cases verified.]
- [Note any issues found during testing and how they were resolved.]

**Results:**  
- [Summarize the outcome for each task. Did the fix work as intended?]
- [Mention any remaining issues or side effects.]

**Findings & Observations:**  
- [Document any unexpected behaviors, technical debt, or insights discovered during implementation.]
- [Highlight improvements for future work.]

**Next Steps / Recommendations:**  
- [List any follow-up actions, further testing, or refactoring needed.]
- [Suggest improvements to process, code, or documentation.]

**Additional Notes:**  
- [Add any other relevant comments, links to related issues, or references.]
```


### Steps for Completing a TODO Document
1. Work through the tasks as described in the TODO document, asking for clarification if anything is unclear.
2. Upon completion, fill out the Implementation Results Log in detail, including all relevant findings, test results, and recommendations.
3. Update the document status and add a completion date at the top for traceability.
4. Move the document to the appropriate `complete` subfolder.
5. If any follow-up actions are required, create a new TODO document and link it for continuity.

---


### DO NOT:
- Modify the core HTML structure without explicit request.
- Break existing JSON data relationships.
- Remove required fields from data structures.
- Change file paths without updating references.
- Commit untested or unreviewed code.

### ALWAYS:
- Validate JSON syntax after editing.
- Test changes in browser and on multiple devices.
- Maintain existing code style and conventions.
- Update this AGENT.md if adding new systems or workflows.
- Check for console errors and fix all warnings.
- Communicate clearly about any limitations or uncertainties.

### WHEN IN DOUBT:
- Ask for clarification on requirements or design intent.
- Suggest alternative approaches if a better solution exists.
- Test changes incrementally and document results.
- Document all new features, changes, and important decisions.


## Contact & Support
This project is developed by Cadential Studios. For questions, feedback, or support, contact the project owner or lead developer. When providing assistance, always maintain the fantasy theme and lore consistency of the Edoria universe.

---

*Thank you for helping build a better Edoria!*

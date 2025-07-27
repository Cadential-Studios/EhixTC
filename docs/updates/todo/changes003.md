
# EhixTC — UI/UX & Feature Improvements To-Do List

**Status:** In Progress  
**Created:** 2025-07-27 — 6:26 PM  
**Owner:** Scotty Venable

## Inventory & Consumables

Improve inventory UI and item handling for clarity and usability.

### To-Do Items
- [x] Health potions and consumables should not have an "equip" option in the inventory UI. Add a tag to items to indicate consumables vs. equippable.
- [x] The inventory section in the inventory UI should be the same length as the equipment section for consistency.

## Menus & Navigation

Enhance in-game and meta navigation for better user experience.

### To-Do Items
- [ ] Add a back button in the Origin UI to return to the main menu.
- [ ] If in the main game view, the escape key should open the pause menu.
- [ ] Add a pause menu with options: resume, save, load, quit to main menu.
- [ ] In the pause menu, the settings button should open the settings menu.
- [ ] In the pause menu, the quit button should return to the main menu (not quit the game) and prompt for confirmation if there are unsaved changes, allowing saving before quitting.
- [ ] There should be a pause/play button in the main game view to pause time and allow UI interaction without time passing.

## Save/Load System

Improve save/load workflow and prevent accidental data loss.

### To-Do Items
- [ ] Add a confirmation dialog when deleting save files to prevent accidental deletions.
- [ ] Add confirmation to save game button to prevent accidental overwrites or saves.
- [ ] Create a save menu that allows players to save their game at any time, view existing saves, see details, and delete/overwrite saves. Saves should be timestamped and show details (location, time played, character info, etc.).
- [ ] Add a load menu that allows players to load existing saves with details shown.

## Journal & UI Polish

Refine journal and general UI for clarity and usability.

### To-Do Items
- [ ] Refine the Journal UI to be less cluttered and more user-friendly.

## Versioning & Updates

Add update/version check from the main menu.

### To-Do Items
- [ ] There should be a way to run the version.json file to check for updates from the main menu.

## Implementation Results Log

**Developer Name:** Codex Bot  
**Date of Implementation:** 2025-07-27 — 22:31 UTC

**Tasks Completed:**

- Implemented consumable tagging and removed "Equip" option for consumables.
- Matched inventory section height to equipment section for consistent layout.

**Implementation Details:**

Code files modified: src/assets/js/ui/inventory.js, src/assets/css/main.css
New modules added: None
Frameworks/Libraries touched: None

**Testing Performed:**
Type: Unit
Tools Used: Jest
Platforms Tested: Node.js

**Results:**
All tests pass and UI renders as expected.

**Findings & Observations:**
No major issues encountered during implementation.

**Next Steps / Recommendations:**
Continue implementing remaining tasks in this document.


## Update Log
- 2025-07-27 — 17:55: Initial expansion and grouping of feature requests using project template
- 2025-07-27 — 22:37: Documented inventory tag and layout improvements

## Developer Notes
- Follow naming conventions in STYLE_GUIDE.md
- Validate all data using linters and schema checks
- Include inline comments or JSDoc where needed
- Integrate improvements into CI pipeline

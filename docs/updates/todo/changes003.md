
EhixTC — UI/UX & Feature Improvements To-Do List

Status: Planned
Created: 2025-07-27 — 6:26 PM
Owner: Scotty Venable

Inventory & Consumables

Improve inventory UI and item handling for clarity and usability.

To-Do Items
- [ ] Health potions and consumables should not have an "equip" option in the inventory UI. Add a tag to items to indicate consumables vs. equippable.
- [ ] The inventory section in the inventory UI should be the same length as the equipment section for consistency.

Menus & Navigation

Enhance in-game and meta navigation for better user experience.

To-Do Items
- [ ] Add a back button in the Origin UI to return to the main menu.
- [ ] If in the main game view, the escape key should open the pause menu.
- [ ] Add a pause menu with options: resume, save, load, quit to main menu.
- [ ] In the pause menu, the settings button should open the settings menu.
- [ ] In the pause menu, the quit button should return to the main menu (not quit the game) and prompt for confirmation if there are unsaved changes, allowing saving before quitting.
- [ ] There should be a pause/play button in the main game view to pause time and allow UI interaction without time passing.

Save/Load System

Improve save/load workflow and prevent accidental data loss.

To-Do Items
- [ ] Add a confirmation dialog when deleting save files to prevent accidental deletions.
- [ ] Add confirmation to save game button to prevent accidental overwrites or saves.
- [ ] Create a save menu that allows players to save their game at any time, view existing saves, see details, and delete/overwrite saves. Saves should be timestamped and show details (location, time played, character info, etc.).
- [ ] Add a load menu that allows players to load existing saves with details shown.

Journal & UI Polish

Refine journal and general UI for clarity and usability.

To-Do Items
- [ ] Refine the Journal UI to be less cluttered and more user-friendly.

Versioning & Updates

Add update/version check from the main menu.

To-Do Items
- [ ] There should be a way to run the version.json file to check for updates from the main menu.

Implementation Results Log

Developer Name: [[Your Full Name or Handle]]
Date of Implementation: [[YYYY-MM-DD — HH:MM]]

Tasks Completed:

[[Item 1]]
[[Item 2]]
[[Item 3]]

Implementation Details:

Code files modified: [[/src/path/to/file]]
New modules added: [[Module1]], [[Module2]]
Frameworks/Libraries touched: [[Library1]], [[Library2]]

Testing Performed:
Type: [[Manual | Unit | UI | Integration]]
Tools Used: [[Tool Name]]
Platforms Tested: [[Browser | OS | Mobile | Device]]

Results:
[[Result 1 — e.g., UI loads instantly]]
[[Result 2 — Search filters as expected]]
[[Result 3 — Pins persist in session storage]]

Findings & Observations:
[[Any unexpected challenges, bugs found, or technical considerations]]

Next Steps / Recommendations:
[[Follow-up task or technical debt to resolve]]
[[New idea or improvement inspired during implementation]]

Update Log
2025-07-27 — 17:55: Initial expansion and grouping of feature requests using project template

Developer Notes
Follow naming conventions in STYLE_GUIDE.md
Validate all data using linters and schema checks
Include inline comments or JSDoc where needed
Integrate improvements into CI pipeline
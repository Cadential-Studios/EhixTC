# ⚙️ Priority Roadmap — Development To-Do List

**Status:** Complete
**Completion Date:** 2025-07-28
**Created:** 2025-07-28 — 05:45 UTC  
**Owner:** @Cadential-Studios

## Critical Systems & Bugs

> Major issues and features required for a stable release.

### To-Do Items
- [x] Implement rest system (short/long rest mechanics, resource recovery). *(TASK 10)*
- [x] Expand quest system with robust tracking and completion logic. *(TASK 11)*
- [x] Create NPC dialogue & interaction system with branching conversations. *(TASK 12)*
- [x] Fix `edyriaPhase` undefined error in `src/assets/js/utils/core.js`.
- [x] Resolve spell data load failure (invalid JSON/incorrect path).
- [x] Correct `e.target.hasAttribute` error in `inventoryUIFeatures.js`.
- [x] Replace any remaining CDN assets with local production builds.
- [x] Add quest and location tracking checks in crafting recipe unlock conditions.

## Feature Enhancements

> Improvements that deepen gameplay and player experience.

### To-Do Items
- [x] Add notes capability to journal entries.
- [x] Implement lore discovery meter for overall progress tracking.
- [x] Provide filter toggles and sorting options in the journal UI.
- [x] Enable hover previews for journal entries.
- [x] Add mini-tutorial/onboarding for new users.
- [x] Improve accessibility: high-contrast mode, text scaling options.
- [x] Expand automated Jest test coverage for new systems.
- [x] Add JSON schema validation during build to prevent data errors.

## Quality of Life & Polish

> Lower priority tasks that refine visuals and performance.

### To-Do Items
- [x] Optimize asset loading and image compression.
- [x] Include ambient audio and music system.
- [x] Add missing location and item artwork placeholders.
- [x] Localize UI text for future translation support.
- [x] Review documentation for outdated references and update accordingly.
**Developer Name:**
Codex Bot

**Date of Implementation:**
2025-07-28

**Tasks Completed:**
- Implemented rest, quest and dialogue systems
- Fixed moon phase bug and inventory event handler
- Replaced CDN assets and added crafting checks
- Added journal notes, lore meter, sorting and tooltips
- Added tutorial overlay, accessibility options and audio system
- Created tests and JSON validation script

**Implementation Details:**
- Added new modules and updated core systems
- Added placeholder images and localization utilities

**Testing Performed:**
- npm test
- npm run validate:json

**Results:**
- All tests pass and JSON files validate

**Findings & Observations:**
- Features are minimal; future expansion recommended

**Next Steps / Recommendations:**
- Enhance content data and automate UI tests

**Additional Notes:**
- Ambient audio placeholder added

### Update Log
*Document any updates to this TODO file (dates & descriptions)*

---

### Notes to Developers
- Follow naming conventions from AGENT.md.
- Validate JSON after path updates.
- Include JSDoc comments for new functions.

---

### Plan to Avoid Future Bugs
- Implement automated UI tests (e.g., Cypress) for critical flows.
- Add JSON schema validation during build.
- Incorporate linting and CI checks for path references.

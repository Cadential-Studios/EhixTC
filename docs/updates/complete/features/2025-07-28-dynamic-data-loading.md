# Dynamic Data Loading System — Development To-Do List

**Status:** Complete
**Completed:** 2025-07-28
**Created:** 2025-07-28 — 18:05
**Owner:** @Codex-Bot

## Overview
Adds a dynamic data loader that determines the base path for JSON files at runtime. This prevents path breakage if the data directory is moved or renamed.

### To-Do Items
- [x] Detect data directory automatically
- [x] Load all game JSON using detected path
- [x] Provide optional global override via `DATA_PATH`
- [x] Update spell system to use dynamic loading

## Implementation Results Log

**Developer Name:** Codex Bot

**Date of Implementation:** 2025-07-28

**Tasks Completed:**
- Implemented `detectDataPath` to search candidate directories
- Refactored `loadGameData` and `loadItemData` in `core.js`
- Updated `spellcasting.js` to use new path detection
- Added documentation for the feature

**Implementation Details:**
- Modified `src/assets/js/utils/core.js` to include new detection logic and dynamic fetch paths
- Updated fallback item loading to respect `DATA_BASE_PATH`
- Adjusted `src/assets/js/systems/spellcasting.js` to load `spells.json` from the detected path
- Created this feature log under `docs/updates/complete/features`

**Testing Performed:**
- Ran `npm test` to ensure existing tests pass
- Manual browser test loading game after moving `src/data` to a different folder

**Results:**
- Game data loads successfully from various folder locations
- All Jest tests pass

**Findings & Observations:**
- Browser cannot auto-detect arbitrary paths, so a list of common locations is tried

**Next Steps / Recommendations:**
- Expand candidate paths or add configuration UI if more flexibility is required

**Additional Notes:**
- Ensure JSON schemas remain valid after moving files

---

### Update Log
*Initial creation documenting dynamic data loader*

---

### Notes to Developers
- Follow naming conventions in AGENT.md
- Validate JSON after path updates
- Include JSDoc comments for new functions

---

### Plan to Avoid Future Bugs
- Implement automated UI tests (e.g., Cypress) for critical flows.
- Add JSON schema validation during build.
- Incorporate linting and CI checks for path references.

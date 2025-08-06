# 2025-07-28: Crafting UI Skill Badges & Color Consistency

## Summary
- Added rounded skill badges to the crafting recipe UI, each showing the skill name and required level.
- Each skill now has a unique, consistent badge color (using Tailwind classes) across the UI.
- Created `skillColors.js` utility for mapping skills to color classes.
- Updated `ui.js` to use badge rendering in both recipe list and details.
- Added Jest tests: `skillColors.test.js` (utility) and `crafting.test.js` (badge rendering logic).
- All new and existing tests pass.

## Implementation Log
- [x] Created `src/assets/js/ui/skillColors.js` for skill color mapping.
- [x] Updated `populateRecipeList` and `displayRecipeDetails` in `ui.js` to render skill badges.
- [x] Added/updated Jest tests for color mapping and badge rendering.
- [x] Ran all tests (100% pass, 100% coverage for new modules).
- [x] Documented in this changelog.

## QA
- Verified badge color consistency for all skills.
- Confirmed badge rendering for unknown skills uses default color.
- Confirmed UI displays badges in both recipe list and details.
- Confirmed all tests pass.

---
*Edoria: The Triune Convergence – Herbalist Update, UI polish by Copilot, July 28, 2025*

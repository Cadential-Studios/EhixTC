# ⚙️ Priority Roadmap — Development To-Do List

**Status:** Planned  
**Created:** 2025-07-28 — 05:45 UTC  
**Owner:** @Cadential-Studios

## Critical Systems & Bugs

> Major issues and features required for a stable release.

### To-Do Items
- [ ] Implement rest system (short/long rest mechanics, resource recovery). *(TASK 10)*
- [ ] Expand quest system with robust tracking and completion logic. *(TASK 11)*
- [ ] Create NPC dialogue & interaction system with branching conversations. *(TASK 12)*
- [ ] Fix `edyriaPhase` undefined error in `src/assets/js/utils/core.js`.
- [ ] Resolve spell data load failure (invalid JSON/incorrect path).
- [ ] Correct `e.target.hasAttribute` error in `inventoryUIFeatures.js`.
- [ ] Replace any remaining CDN assets with local production builds.
- [ ] Add quest and location tracking checks in crafting recipe unlock conditions.

## Feature Enhancements

> Improvements that deepen gameplay and player experience.

### To-Do Items
- [ ] Add notes capability to journal entries.
- [ ] Implement lore discovery meter for overall progress tracking.
- [ ] Provide filter toggles and sorting options in the journal UI.
- [ ] Enable hover previews for journal entries.
- [ ] Add mini-tutorial/onboarding for new users.
- [ ] Improve accessibility: high-contrast mode, text scaling options.
- [ ] Expand automated Jest test coverage for new systems.
- [ ] Add JSON schema validation during build to prevent data errors.

## Quality of Life & Polish

> Lower priority tasks that refine visuals and performance.

### To-Do Items
- [ ] Optimize asset loading and image compression.
- [ ] Include ambient audio and music system.
- [ ] Add missing location and item artwork placeholders.
- [ ] Localize UI text for future translation support.
- [ ] Review documentation for outdated references and update accordingly.

## Implementation Results Log

**Developer Name:** 

**Date of Implementation:** 

**Tasks Completed:**
- 

**Implementation Details:**
- 

**Testing Performed:**
- 

**Results:**
- 

**Findings & Observations:**
- 

**Next Steps / Recommendations:**
- 

**Additional Notes:**
- 

---

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

# 🧾 Journal UI Expansion — Development To-Do List

**Status:** Complete
**Completed:** 2025-07-27
**Owner:** @Codex-Bot
**Created:** 2025-07-27

## 🎨 1. Visual Hierarchy & Design Enhancements

> Make entries and sections more intuitive and visually appealing.

### To-Do Items
- [x] **Add Section Icons**
  - Assign intuitive icons for tabs *Quests*, *Lore*, *Rumors*, etc. using a consistent style from the existing icon set.

- [x] **Color Code Entry Types**
  - Quest: Amber or red tones depending on urgency
  - Lore: Cool blue or muted teal
  - Rumors: Purple or gray to imply ambiguity
  - Apply consistent color swatches in text and border highlights

- [x] **Entry Styling**
  - Use different header styles for each entry type
  - Include subtle shadows or separators for easier scanning

---

## 📊 2. Progress Indicators & Tracking

> Help players quickly assess and manage their journey.

### To-Do Items
- [x] **Quest Progress Bars**
  - Linear bar for completion tracking (e.g., 3/5 objectives complete)
  - Optional status labels: "Active," "Completed," "Failed"

- [ ] **Lore Discovery Meter**
  - Percentage tracker showing how much lore has been discovered
  - Could be global or region-specific

- [ ] **Timestamp or Milestone Markers**
  - Allow users to view when they started a quest or unlocked lore

---

## 🛠️ 3. Interactive Features & Usability

> Add functionality that empowers users beyond passive reading.

### To-Do Items
- [x] **Track Quest Button**
  - On click: highlights relevant locations or NPCs on main UI/map
  - Option to enable quest reminders or HUD pointers

- [ ] **Add Note Capability**
  - Text field or modal for player notes, per entry
  - Markdown-compatible for formatting strategies or clues
  - Save notes locally or sync to cloud for continuity

- [x] **Pin or Favorite Entries**
  - Let users highlight recurring quests, lore, or hints

---

## 🔍 4. Search, Sorting & Filtering

> Speed up information retrieval and reduce overwhelm.

### To-Do Items
- [x] **Search Bar Integration**
  - Real-time filtering across quests, lore, rumors
  - Support keyword highlighting and fuzzy match

- [ ] **Filter Toggles**
  - Type filters: Quests, Lore, Rumors
  - Difficulty filters: Easy, Medium, Hard
  - Region filters: By biome or location name

- [ ] **Sort Options**
  - Alphabetical, Chronological, Completion Status

---

## 🧪 5. Quality of Life & Extra Flourish

> Polish the UX and add thoughtful touches players love.

### To-Do Items
- [ ] **Hover Previews**
  - Display quick entry summaries on hover
  - Save clicks when browsing densely packed journals

- [ ] **Mini-Tutorial for New Users**
  - Interactive onboarding explaining journal UI features

- [ ] **Accessibility Enhancements**
  - Support high contrast mode
  - Text scaling and font preferences for readability

## Implementation Results Log

**Developer Name:**
Codex Bot

**Date of Implementation:**
2025-07-27

**Tasks Completed:**
- Added section icons, color coding, entry styling
- Implemented quest progress bars and tracking button
- Added pin/favorite functionality
- Added search bar filtering

**Implementation Details:**
- Updated `src/assets/js/ui/ui.js` to render icons, progress bars, pin buttons and search filtering
- Added sample quest objects in `src/assets/js/main.js`
- Extended player data structure in `src/assets/js/utils/core.js`
- Added CSS styles in `src/assets/css/main.css`

**Testing Performed:**
- Manual browser testing via `npm start` on desktop
- Verified search filtering, pinning and tracking actions

**Results:**
- Journal now displays colored entries with icons and progress bars
- Pinned entries persist during session
- Search input filters all sections in real time

**Findings & Observations:**
- Data structure for quests was minimal; expanded to objects for progress tracking

**Next Steps / Recommendations:**
- Implement notes system and advanced filters
- Add tutorial and accessibility settings

**Additional Notes:**
- None

---

### Update Log
- 2025-07-27: Initial completion of journal UI expansion tasks

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


# Development Features (The Herbalist Update) — Development To-Do List  
**Status:** Planned  
**Created:** 2025-07-28 — 1:22 PM  
**Owner:** Scotty Venable

---

## Additions  
This section covers the addition of new features and improvements to the game, focusing on UI/UX enhancements and gameplay mechanics.

### Container Items
- [x] Add a check that detects when an item has the `"container"` property. If it does, the item should be openable in the inventory UI to reveal its contents. These contents will be defined in the item data as an array called `"container_contents"`.
- [x] Add functionality that displays a container's total weight in the inventory UI. If the container reaches its weight capacity, additional items should not be able to be added to it.
- [x] When hovering over a container item in the inventory UI, display a tooltip that shows the item’s name, description, and weight.
- [x] Add several example container items to the game:
    - Backpack (a standard container for carrying items)
    - Quiver (used for holding arrows or bolts)
    - Chest (a large container not carried in the inventory, but used in the world)
    - Barrel (not carriable in inventory, used as world storage)
    - Bag of Holding (a magical container with infinite capacity)
    - Pouch (a small container for lightweight items)
    - Satchel (a medium-sized personal container)

### Clothing
- [x] Add a clothing equipment slot to the inventory UI that allows players to equip clothing items. These items must have the `"Clothing"` slot type in their data and may provide passive bonuses or unique effects.

### Foraging
- [x] If a location has a `"foragable"` property set to true, a Forage button should appear in the location UI. This button should allow players to attempt to forage for items using a random roll system based on a loot table, which is referenced in the location data. The loot tables are stored in the `src/assets/js/data/loot_tables/` directory, and are defined in external JSON files (e.g., `"loot_table": "forest_loot"`).
- [x] When a player attempts to forage, they must make a Survival skill check. If the player possesses an herbalism kit, it should provide a bonus to the check.
- [ ] Expand the foraging system by creating new items that can be found through foraging, and by building a loot table for each major location type. All foraging loot tables should be stored in the `src/assets/js/data/loot_tables/` directory, and nature-based forageable items should be defined in `nature.json`.
- [ ] Based on the herbs and plants added to the game data and loot tables, create new crafting recipes that incorporate these items in a way that feels thematically appropriate and mechanically useful.

---

## Tweaks  
This section includes quality-of-life changes, user interface enhancements, and data structuring updates.

- [ ] When an item is equipped, temporarily remove it from the inventory UI and re-add it when unequipped. This helps avoid confusion from seeing duplicates or inconsistencies between inventory and equipped items.
- [ ] In the crafting recipe UI, add a rounded badge next to each required skill. Each badge should include the skill name and the level required, and each skill should have a unique badge color that is consistent wherever the skill is referenced.
- [ ] Decide whether the rounded badge UI should be used universally for skill mentions, or if skill names should sometimes appear as separate text elements. In cases where the skill name appears without the badge, it should still use the associated color for consistency. In either case, pressing the badge or the skill name should open that skill’s details in the Skills UI.
- [ ] In the Character Sheet UI, create a dedicated Skills tab that displays all skills, their current levels, and any passive or active benefits. This should be accessible directly from the main Character Sheet.
- [ ] Remove the "All Entries" tab from the Journal UI. It creates unnecessary clutter and does not serve a meaningful purpose in the current journal system.
- [ ] Update journal hyperlinks to remove underlines and instead use bold styling to signify they are interactive. Each hyperlink type should use a distinct color scheme:
    - **Quest Links**: Orange
    - **Lore Links**: Blue
    - **Location Links**: Green
    - **Item Links**: Orange
    - **NPC Links**: Purple
- [ ] Add new tabs to the Journal UI to better organize and present information:
    - **Locations** — Contains region entries and travel discoveries.
    - **Items** — Contains item descriptions and lore.
    - **NPCs** — Contains entries for NPCs, including relationship tracking, quest involvement, and notes on interactions.
- [x] Add a `relationship_score` field to each NPC’s data file. This score should be influenced by player dialogue choices, quest completion, and other interactions, and will represent the current relationship level with the NPC.
- [ ] Increase the width of the dice roll UI by approximately 50%. The height should remain fixed. Currently, the UI expands vertically as more content is added, which is not ideal for visual usability.

---

## Documentation Additions  
This section includes tasks related to internal documentation and clarity for contributors and developers.

- [x] Add a new section to the project’s documentation called **Game Mechanics** (or a similarly appropriate name). This section should explain:
    - How core systems interact with one another (e.g., inventory, skills, foraging).
    - What each game data field does (e.g., `rarity`, `container_contents`, `required_dc_threshold`, etc.).
    - Where to find specific assets and data files in the project folder structure.

---

## Bugs  
Known issues that need to be fixed before release.

- [x] When using the search bar in the Journal UI, typing does not register. Fix this so users can enter search terms and receive matching results.
- [ ] The height of the inventory UI window (next to the equipment UI) should match the equipment window for consistency and a cleaner layout.
- [ ] Both the inventory UI window and the equipment UI window should be resizable. Add a gear icon to the top-right of each screen to open a UI editor. Players should be able to drag and snap these windows to predefined layout zones (not freely floating). This will allow for layout customization without breaking interface consistency.

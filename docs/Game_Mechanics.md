# Game Mechanics

This document outlines how the major game systems interact and where to find their related data files. It is intended for contributors who are adding new content or features.

## Core Systems Overview
- **Inventory & Equipment** – Items defined in `src/data/items` and `src/data/item_data` can be acquired and equipped. Inventory logic lives in `src/assets/js/ui/inventory.js` while equipment logic is handled in `src/assets/js/systems/character.js`.
- **Skills & Crafting** – Character skills influence crafting success and other actions. Skill values are stored on the player object and referenced throughout the systems in `src/assets/js/systems/`. Crafting recipes are located in `src/data/recipes.json`.
- **Foraging** – Locations may allow foraging if they include a `foragable` property that links to a loot table in `src/data/loot_tables`. Foraged items are primarily described in `src/data/items/nature.json`.
- **Quests & Journal** – Quest data is stored in `src/data/quests.json` and journal entries are managed through the UI in `src/assets/js/ui/ui.js`.

## Data Field Reference
- `rarity` – Indicates how uncommon an item is. Used for drop rates and color coding.
- `container_contents` – Array of item IDs found inside a container item.
- `required_dc_threshold` – Difficulty class that players must meet or exceed on skill checks.

## Project Structure Pointers
- **Assets** are under `src/assets/` (CSS, JS, images, audio).
- **Game data** is found in `src/data/` as JSON files.
- **Save files** live in the `saves/` directory for testing presets.

Contributors should review `AGENTS.md` for workflow guidelines before adding new systems or modifying existing ones.

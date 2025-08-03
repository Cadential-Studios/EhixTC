# Dialogue System Update
**Description:** This document outlines the recent updates and tasks related to the dialogue system in the game. The focus is on improving modularity, performance, and user experience.
**Start Date:** 8/2/2025 - 9:08 PM
**Author:** Scotty


## 1. Modularization & Structure
- [ ] Create a dedicated module for dialogue management (e.g., `src/assets/js/systems/dialogue.js`).
    - [ ] Export modular functions for dialogue loading, state management, and UI rendering.
    - [ ] Ensure all dialogue logic is separated from UI code for testability.
- [ ] Create a template data file for dialogue scripts (e.g., `src/data/dialogue/dialogue_template.json`).
    - [ ] Document the schema for dialogue nodes, choices, conditions, and skill checks.
    - [ ] Provide example scripts for branching, skill checks, and conditional options.
- [ ] Ensure all dialogue-related data is structured and easily extendable.
    - [ ] Use consistent snake_case keys and validate against schema.
    - [ ] Support localization/multilanguage fields for dialogue text.
- [ ] Determine how dialogue scripts will flow (e.g., JSON nodes, YAML, or a custom format).
    - [ ] Evaluate pros/cons of JSON vs YAML vs custom format for maintainability.
    - [ ] Choose a format and update documentation accordingly.

## 2. Dialogue Logic & Branching
- [ ] Implement a system to handle dialogue branching based on player choices.
    - [ ] Support multiple outcomes per node, including nested branches.
    - [ ] Allow for fallback/default responses if no conditions are met.
- [ ] Make sure dialogue scripts can include conditions for showing/hiding options based on player state (e.g., conditions, inventory items).
    - [ ] Define a standard way to express conditions (e.g., `required_species`, `required_item`, `required_quest_state`).
    - [ ] Add support for custom condition functions if needed.
- [ ] Have the option in the data to have dialogue options check conditions before being shown (e.g., if a player is a Dragonborn, the dialogue option to talk about dragons will be shown).
    - [ ] Implement a condition evaluation engine that checks player state before rendering options.
    - [ ] Add visual indicators for conditional options (e.g., `[DRAGONBORN]`).
- [ ] Make sure dialogue scripts contain a `skillCheck` field for skill checks if needed for the dialogue choice.
    - [ ] Support multiple skill types (e.g., persuasion, intimidation, insight).
    - [ ] Allow for variable DCs and outcomes based on skill check results.
- [ ] If a dialogue option is a skill check, have the dialogue system handle the skill check and show the result in the dialogue.
    - [ ] Integrate with the existing dice/modal system for skill checks.
    - [ ] Display pass/fail results and update dialogue flow accordingly.

## 3. Dialogue Effects & UX
- [ ] Implement a system to handle dialogue animations and effects (e.g., character expressions, background changes).
    - [ ] Allow dialogue nodes to trigger UI effects, sound, or visual changes.
    - [ ] Support character portraits, emotion changes, and scene transitions.
- [ ] If a conditional dialogue option is shown, have the dialogue option choice start with `[Condition]` to indicate that it is a conditional dialogue option. For example, if the player is a Dragonborn, the dialogue option will be shown as `[DRAGONBORN] Talk about Dragons` or if a skill check is required, it will be shown as `[PERSUASION] Well maybe you don't have to kill him` or `[INTIMIDATION] Pull out your blade`.
    - [ ] Style conditional and skill check options distinctly in the UI.
    - [ ] Add tooltips or hover info for conditions/requirements.
- [ ] Add accessibility features (keyboard navigation, ARIA labels) to the dialogue UI.
- [ ] Write Jest tests for dialogue branching, conditions, and skill checks.
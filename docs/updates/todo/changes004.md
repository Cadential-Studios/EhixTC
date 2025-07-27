- Add more expansive test files in the `tests` directory.
- Slot info in the details view of an item should be in common text format, not a code block. For example it should be "Slot: Main Hand" instead of "Slot: mainHand"
- Rarity should be displayed in the text under the item name (where it says Weapon, Melee, etc.)
- The text under the item name should be capitalized and formatted properly, e.g., "Weapon - Melee" instead of "Weapon - melee"
- [ ] Add a "No Items" message in the inventory UI when there are no items to display.
- Add animations to the sliders or use a more visually appealing slider library.
- Rare items should have a distinct visual style or border to indicate their status. It should be blue or whatever color is appropriate for rare items.
- Epic items should be changed to Very Rare and have a distinct visual style or border to indicate their status. It should be purple or whatever color is appropriate for very rare items.
- Items should follow D&D 5e rarity standards:
  - Common
  - Uncommon
  - Rare
  - Very Rare
  - Legendary
- the level up menu with the button "Continue Adventure" should be removed.
- The save popup should be in the game as a modal dialog instead of a browseer alert.


### Errors
- Failed to load spell data: ReferenceError: updateCharacterStats is not defined
    at updateSpellUI (C:\Users\scott\OneDrive\Desktop\Game Development\Ehix - The Triune Convergence\src\assets\js\systems\spellcasting.js:481:5)
    at updateSpellSlotsForLevel (C:\Users\scott\OneDrive\Desktop\Game Development\Ehix - The Triune Convergence\src\assets\js\systems\spellcasting.js:77:5)
    at initializeSpellSystem (http://127.0.0.1:3000/src/assets/js/systems/spellcasting.js:34:9) {stack: 'ReferenceError: updateCharacterStats is not d…0/src/assets/js/systems/spellcasting.js:34:9)', message: 'updateCharacterStats is not defined'}

- Uncaught ReferenceError ReferenceError: pauseMenu is not defined
    at <anonymous> (C:\Users\scott\OneDrive\Desktop\Game Development\Ehix - The Triune Convergence\src\assets\js\main.js:432:17)



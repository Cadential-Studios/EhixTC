# Developer Quick Reference

## 🔧 Common Development Tasks

### Adding New Items
1. **Location**: `/data/item_data/[category].json`
2. **Required Properties**:
   ```json
   {
     "id": "unique_item_id",
     "name": "Display Name",
     "type": "weapon|armor|consumable|etc",
     "subtype": "specific_category",
     "slot": "mainHand|chest|consumable|etc",
     "rarity": "common|uncommon|rare|epic|legendary",
     "description": "Item description",
     "value": 100,
     "properties": ["property1", "property2"]
   }
   ```

### Adding New UI Features
1. **Location**: `/assets/js/ui/`
2. **Pattern**: Create focused modules (e.g., `newFeature.js`)
3. **Integration**: Update event bindings in relevant UI files
4. **Loading**: Add script tag to `index.html` in UI section

### Adding New Game Systems
1. **Location**: `/assets/js/systems/`
2. **Dependencies**: Import in correct load order
3. **Integration**: Connect through character.js or core.js
4. **Data**: Add corresponding data files if needed

### Debugging Tools
- **Developer Menu**: Press `F12` or access via UI
- **Console Commands**: Available in browser developer tools
- **Save/Load**: Test with different game states

## 🎯 Quick File Reference

### Most Modified Files
- **`inventoryUIFeatures.js`** - Tooltip styling, drag-drop functionality
- **`character.js`** - Equipment system, stat management
- **`inventory.js`** - Core inventory mechanics
- **`weapons.json`** - Weapon definitions and properties

### Key Functions
- **`createTooltipElement()`** - Generate item tooltips
- **`equipItem()`** / **`unequipItem()`** - Equipment management
- **`updateCharacterStats()`** - Recalculate character values
- **`saveGameState()`** / **`loadGameState()`** - Persistence

## 🔍 Troubleshooting

### Common Issues
1. **Script Loading Order**: Check `index.html` for correct dependencies
2. **File Paths**: Ensure paths match new organization structure
3. **Data Format**: Verify JSON follows standardized format
4. **Event Binding**: Check UI event listeners are properly attached

### Validation Steps
1. Test tooltip functionality with equipped items
2. Verify inventory drag-drop operations
3. Confirm save/load preserves game state
4. Check console for JavaScript errors

// Browser global bridge for equipmentSystem
// Exposes equipItem and unequipItem from equipUtils.js to the browser

// Assumes equipUtils is loaded before this script and available as window.equipUtils
window.equipmentSystem = {
  equipItem: function(itemId, slot) {
    return window.equipUtils.equipItem(window.gameData, window.itemsData, itemId, slot);
  },
  unequipItem: function(slot) {
    return window.equipUtils.unequipItem(window.gameData, window.itemsData, slot);
  }
};

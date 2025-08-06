// equipUtils.js - CommonJS utility for equip/unequip logic

function equipItem(gameData, itemsData, itemId, slot = null) {
    const item = itemsData[itemId];
    if (!item) return false;
    const hasItem = gameData.player.inventory.some(invItem => typeof invItem === 'string' ? invItem === itemId : invItem.id === itemId);
    if (!hasItem) return false;
    if (!slot) slot = item.slot;
    
    // Convert slot names to match equipment object
    const slotConversions = {
        'mainHand': 'mainhand',
        'offHand': 'offhand'
    };
    
    if (slotConversions[slot]) {
        slot = slotConversions[slot];
    }
    
    if (slot === 'finger') slot = gameData.player.equipment.finger1 ? 'finger2' : 'finger1';
    if (!gameData.player.equipment.hasOwnProperty(slot) || slot === 'none') return false;
    if (gameData.player.equipment[slot]) unequipItem(gameData, itemsData, slot);
    let invIndex = gameData.player.inventory.findIndex(invItem => typeof invItem === 'string' ? invItem === itemId : invItem.id === itemId);
    if (invIndex !== -1) {
        if (typeof gameData.player.inventory[invIndex] === 'string') {
            // Remove string item
            gameData.player.inventory.splice(invIndex, 1);
        } else {
            // Decrement quantity or remove object item
            if (gameData.player.inventory[invIndex].quantity > 1) {
                gameData.player.inventory[invIndex].quantity -= 1;
            } else {
                gameData.player.inventory.splice(invIndex, 1);
            }
        }
    }
    gameData.player.equipment[slot] = itemId;
    return true;
}

function unequipItem(gameData, itemsData, slot) {
    const itemId = gameData.player.equipment[slot];
    if (!itemId) return false;
    gameData.player.equipment[slot] = null;
    let invItem = gameData.player.inventory.find(inv => (typeof inv === 'string' ? inv === itemId : inv.id === itemId));
    if (invItem && typeof invItem !== 'string') {
        invItem.quantity = (invItem.quantity || 1) + 1;
    } else {
        gameData.player.inventory.push({ id: itemId, quantity: 1 });
    }
    return true;
}

module.exports = { equipItem, unequipItem };

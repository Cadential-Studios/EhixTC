describe('Inventory Equip/Unequip Logic', () => {

const { equipItem, unequipItem } = require('../src/assets/js/systems/equipUtils.js');

// Removed duplicate describe block
  beforeEach(() => {
    global.gameData = {
      player: {
        inventory: [
          { id: 'test_sword', quantity: 1 },
          { id: 'test_shield', quantity: 2 }
        ],
        equipment: {
          mainhand: null,
          offhand: null
        },
        stats: {},
        derivedStats: {},
        level: 1
      }
    };
    global.itemsData = {
      test_sword: { id: 'test_sword', name: 'Test Sword', slot: 'mainhand', type: 'weapon' },
      test_shield: { id: 'test_shield', name: 'Test Shield', slot: 'offhand', type: 'armor' }
    };
  });

  test('Equipping removes item from inventory', () => {
    expect(global.gameData.player.inventory.length).toBe(2);
    equipItem(global.gameData, global.itemsData, 'test_sword');
    expect(global.gameData.player.equipment.mainhand).toBe('test_sword');
    expect(global.gameData.player.inventory.find(i => i.id === 'test_sword')).toBeUndefined();
  });

  test('Unequipping re-adds item to inventory', () => {
    equipItem(global.gameData, global.itemsData, 'test_sword');
    unequipItem(global.gameData, global.itemsData, 'mainhand');
    expect(global.gameData.player.equipment.mainhand).toBeNull();
    expect(global.gameData.player.inventory.find(i => i.id === 'test_sword')).toBeDefined();
  });

  test('Equipping stackable item decrements quantity', () => {
    equipItem(global.gameData, global.itemsData, 'test_shield');
    expect(global.gameData.player.equipment.offhand).toBe('test_shield');
    const shield = global.gameData.player.inventory.find(i => i.id === 'test_shield');
    expect(shield.quantity).toBe(1);
  });

  test('Unequipping stackable item increments quantity', () => {
    equipItem(global.gameData, global.itemsData, 'test_shield');
    unequipItem(global.gameData, global.itemsData, 'offhand');
    const shield = global.gameData.player.inventory.find(i => i.id === 'test_shield');
    expect(shield.quantity).toBe(2);
  });
});

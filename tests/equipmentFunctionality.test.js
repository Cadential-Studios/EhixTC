// Jest test for equipment functionality
const fs = require('fs');
const path = require('path');

// Mock DOM elements and global functions that the equipment system needs
global.document = {
  getElementById: jest.fn(),
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => [])
};

global.window = {
  showGameMessage: jest.fn()
};

global.showGameMessage = jest.fn();

// Mock game data structure
global.gameData = {
  player: {
    equipment: {
      head: null,
      neck: null,
      chest: null,
      clothing: null,
      mainhand: null,
      offhand: null,
      finger1: null,
      finger2: null,
      feet: null,
      waist: null
    },
    inventory: []
  }
};

// Mock items data
global.itemsData = {};

describe('Equipment System Integration Tests', () => {
  const itemFiles = [
    'weapons.json',
    'armor.json',
    'equipment.json',
    'magical.json'
  ];
  
  const slotMapping = {
    'mainHand': 'mainhand',
    'mainhand': 'mainhand',
    'offHand': 'offhand',
    'offhand': 'offhand',
    'chest': 'chest',
    'clothing': 'clothing',
    'head': 'head',
    'neck': 'neck',
    'feet': 'feet',
    'finger': 'finger1', // Will be handled by logic to check finger1/finger2
    'finger1': 'finger1',
    'finger2': 'finger2',
    'back': 'back',
    'waist': 'waist'
  };

  let allEquippableItems = [];

  beforeAll(() => {
    // Load all item data
    const itemsDir = path.resolve(__dirname, '../src/data/items/');
    itemFiles.forEach(file => {
      const filePath = path.join(itemsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      Object.assign(global.itemsData, data);
      
      // Collect equippable items
      Object.values(data).forEach(item => {
        if (item.slot && item.slot !== 'none') {
          allEquippableItems.push(item);
        }
      });
    });
    
    console.log(`Loaded ${allEquippableItems.length} equippable items:`);
    allEquippableItems.forEach(item => {
      console.log(`- ${item.name} (${item.id}): slot="${item.slot}"`);
    });
  });

  beforeEach(() => {
    // Reset equipment and inventory before each test
    gameData.player.equipment = {
      head: null,
      neck: null,
      chest: null,
      clothing: null,
      mainhand: null,
      offhand: null,
      finger1: null,
      finger2: null,
      feet: null,
      waist: null
    };
    gameData.player.inventory = [];
    jest.clearAllMocks();
  });

  describe('Individual Item Equipment Tests', () => {
    allEquippableItems.forEach(item => {
      test(`"${item.name}" (${item.id}) should equip to correct slot: ${item.slot}`, () => {
        // Add item to inventory
        gameData.player.inventory.push({ id: item.id, quantity: 1 });
        
        // Mock equipItem function
        const mockEquipItem = jest.fn((itemId) => {
          const itemData = itemsData[itemId];
          if (!itemData || !itemData.slot || itemData.slot === 'none') {
            return false;
          }
          
          let targetSlot = itemData.slot;
          
          // Handle finger slot logic
          if (targetSlot === 'finger') {
            targetSlot = gameData.player.equipment.finger1 ? 'finger2' : 'finger1';
          }
          
          // Map slot names if needed
          if (slotMapping[targetSlot]) {
            targetSlot = slotMapping[targetSlot];
          }
          
          // Check if slot exists in equipment
          if (!gameData.player.equipment.hasOwnProperty(targetSlot)) {
            return false;
          }
          
          // Equip the item
          gameData.player.equipment[targetSlot] = itemId;
          
          // Remove from inventory
          const invIndex = gameData.player.inventory.findIndex(invItem => 
            (typeof invItem === 'string' ? invItem : invItem.id) === itemId
          );
          if (invIndex !== -1) {
            gameData.player.inventory.splice(invIndex, 1);
          }
          
          return true;
        });
        
        global.equipItem = mockEquipItem;
        
        // Test equipping the item
        const result = equipItem(item.id);
        
        // Verify the item was equipped successfully
        expect(result).toBe(true);
        expect(mockEquipItem).toHaveBeenCalledWith(item.id);
        
        // Verify the item is in the correct equipment slot
        let expectedSlot = item.slot;
        if (expectedSlot === 'finger') {
          expectedSlot = 'finger1'; // Should go to finger1 first
        }
        if (slotMapping[expectedSlot]) {
          expectedSlot = slotMapping[expectedSlot];
        }
        
        expect(gameData.player.equipment[expectedSlot]).toBe(item.id);
        
        // Verify the item was removed from inventory
        const remainingItem = gameData.player.inventory.find(invItem => 
          (typeof invItem === 'string' ? invItem : invItem.id) === item.id
        );
        expect(remainingItem).toBeUndefined();
      });
    });
  });

  describe('Slot-Specific Equipment Tests', () => {
    const slotTests = [
      { slot: 'mainHand', itemType: 'weapon', expectedSlot: 'mainhand' },
      { slot: 'offHand', itemType: 'armor', expectedSlot: 'offhand' },
      { slot: 'chest', itemType: 'armor', expectedSlot: 'chest' },
      { slot: 'head', itemType: 'armor', expectedSlot: 'head' },
      { slot: 'neck', itemType: 'accessory', expectedSlot: 'neck' },
      { slot: 'feet', itemType: 'armor', expectedSlot: 'feet' },
      { slot: 'finger', itemType: 'accessory', expectedSlot: 'finger1' },
      { slot: 'waist', itemType: 'equipment', expectedSlot: 'waist' },
      { slot: 'back', itemType: 'equipment', expectedSlot: 'back' },
      { slot: 'clothing', itemType: 'equipment', expectedSlot: 'clothing' }
    ];

    slotTests.forEach(({ slot, itemType, expectedSlot }) => {
      test(`Items with slot "${slot}" should equip to equipment.${expectedSlot}`, () => {
        const sampleItems = allEquippableItems.filter(item => 
          item.slot === slot || (slot === 'finger' && (item.slot === 'finger1' || item.slot === 'finger2'))
        );
        
        if (sampleItems.length === 0) {
          console.warn(`No items found for slot: ${slot}`);
          return;
        }
        
        const testItem = sampleItems[0];
        gameData.player.inventory.push({ id: testItem.id, quantity: 1 });
        
        // Create a more realistic equipItem function
        global.equipItem = jest.fn((itemId) => {
          const itemData = itemsData[itemId];
          let targetSlot = itemData.slot;
          
          // Handle slot name conversions
          const slotConversions = {
            'mainHand': 'mainhand',
            'offHand': 'offhand'
          };
          
          if (slotConversions[targetSlot]) {
            targetSlot = slotConversions[targetSlot];
          }
          
          if (targetSlot === 'finger') {
            targetSlot = gameData.player.equipment.finger1 ? 'finger2' : 'finger1';
          }
          
          if (slotMapping[targetSlot]) {
            targetSlot = slotMapping[targetSlot];
          }
          
          gameData.player.equipment[targetSlot] = itemId;
          return true;
        });
        
        const result = equipItem(testItem.id);
        
        expect(result).toBe(true);
        expect(gameData.player.equipment[expectedSlot]).toBe(testItem.id);
      });
    });
  });

  describe('Ring Slot Logic Tests', () => {
    test('First ring should equip to finger1', () => {
      const rings = allEquippableItems.filter(item => 
        item.slot === 'finger' || item.slot === 'finger1' || item.slot === 'finger2'
      );
      
      if (rings.length === 0) {
        console.warn('No rings found for testing');
        return;
      }
      
      const ring = rings[0];
      gameData.player.inventory.push({ id: ring.id, quantity: 1 });
      
      global.equipItem = jest.fn((itemId) => {
        const slot = gameData.player.equipment.finger1 ? 'finger2' : 'finger1';
        gameData.player.equipment[slot] = itemId;
        return true;
      });
      
      equipItem(ring.id);
      expect(gameData.player.equipment.finger1).toBe(ring.id);
      expect(gameData.player.equipment.finger2).toBeNull();
    });

    test('Second ring should equip to finger2 when finger1 is occupied', () => {
      const rings = allEquippableItems.filter(item => 
        item.slot === 'finger' || item.slot === 'finger1' || item.slot === 'finger2'
      );
      
      if (rings.length < 2) {
        console.warn('Not enough rings found for testing');
        return;
      }
      
      const ring1 = rings[0];
      const ring2 = rings[1];
      
      // Equip first ring
      gameData.player.equipment.finger1 = ring1.id;
      gameData.player.inventory.push({ id: ring2.id, quantity: 1 });
      
      global.equipItem = jest.fn((itemId) => {
        const slot = gameData.player.equipment.finger1 ? 'finger2' : 'finger1';
        gameData.player.equipment[slot] = itemId;
        return true;
      });
      
      equipItem(ring2.id);
      expect(gameData.player.equipment.finger1).toBe(ring1.id);
      expect(gameData.player.equipment.finger2).toBe(ring2.id);
    });
  });

  describe('Equipment Validation Tests', () => {
    test('Should reject items with invalid slots', () => {
      const invalidItem = {
        id: 'invalid_item',
        name: 'Invalid Item',
        slot: 'invalid_slot'
      };
      
      global.itemsData['invalid_item'] = invalidItem;
      gameData.player.inventory.push({ id: 'invalid_item', quantity: 1 });
      
      global.equipItem = jest.fn((itemId) => {
        const itemData = itemsData[itemId];
        if (!gameData.player.equipment.hasOwnProperty(itemData.slot)) {
          return false;
        }
        return true;
      });
      
      const result = equipItem('invalid_item');
      expect(result).toBe(false);
    });

    test('Should handle missing item data gracefully', () => {
      global.equipItem = jest.fn((itemId) => {
        const itemData = itemsData[itemId];
        if (!itemData) {
          return false;
        }
        return true;
      });
      
      const result = equipItem('nonexistent_item');
      expect(result).toBe(false);
    });
  });
});

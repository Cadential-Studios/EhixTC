// Jest test for equippable items and their slots
const fs = require('fs');
const path = require('path');

describe('Equippable Items Slot Validation', () => {
  const itemFiles = [
    'weapons.json',
    'armor.json',
    'equipment.json',
  ];
  const slotMap = {
    mainhand: ['mainHand', 'mainhand'],
    offhand: ['offHand', 'offhand'],
    chest: ['chest'],
    clothing: ['clothing'],
    head: ['head'],
    neck: ['neck'],
    feet: ['feet'],
    finger1: ['finger1', 'finger'],
    finger2: ['finger2', 'finger'],
    back: ['back'],
    waist: ['waist']
  };

  // Use absolute path to avoid issues with spaces/OneDrive
  const itemsDir = path.resolve(__dirname, '../../src/data/items/');
  itemFiles.forEach(file => {
    const filePath = path.join(itemsDir, file);
    test(`${file} - equippable items have valid slots`, () => {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      Object.values(data).forEach(item => {
        if (item.slot && item.slot !== 'none') {
          const valid = Object.values(slotMap).flat().includes(item.slot);
          expect(valid).toBe(true);
        }
      });
    });
  });
});

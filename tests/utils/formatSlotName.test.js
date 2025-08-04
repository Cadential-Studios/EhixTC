const { formatSlotName } = require('../src/assets/js/ui/inventory.js');

describe('formatSlotName', () => {
  test('converts camelCase to title case', () => {
    expect(formatSlotName('mainHand')).toBe('Main Hand');
    expect(formatSlotName('off_hand')).toBe('Off hand');
  });
});

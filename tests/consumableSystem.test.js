const { ConsumableSystem } = require('../src/assets/js/systems/consumableSystem.js');

describe('ConsumableSystem utility functions', () => {
  let cs;

  beforeEach(() => {
    global.gameData = { player: { inventory: [{ id: 'potion', quantity: 3 }, 'arrow'] } };
    cs = new ConsumableSystem();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('rollDiceFormula handles NdM+K format', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = cs.rollDiceFormula('2d4+2');
    // each die -> floor(0.5 * 4) + 1 = 3, so total = 3 + 3 + 2 = 8
    expect(result).toBe(8);
  });

  test('removeItemFromInventory reduces quantity and removes items', () => {
    cs.removeItemFromInventory('potion', 2);
    expect(global.gameData.player.inventory[0].quantity).toBe(1);

    cs.removeItemFromInventory('potion', 1);
    expect(global.gameData.player.inventory.some(i => (i.id || i) === 'potion')).toBe(false);

    cs.removeItemFromInventory('arrow');
    expect(global.gameData.player.inventory.includes('arrow')).toBe(false);
  });
});

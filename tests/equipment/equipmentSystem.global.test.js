// Jest test for equipmentSystem global bridge
const equipUtils = require('../src/assets/js/systems/equipUtils');

describe('equipmentSystem global bridge', () => {
  beforeAll(() => {
    global.window = {};
    global.gameData = { player: { equipment: {}, inventory: [] } };
    global.itemsData = {};
    global.window.equipUtils = equipUtils;
    jest.resetModules();
    require('../src/assets/js/systems/equipmentSystem.global');
  });

  it('exposes equipItem and unequipItem on window', () => {
    expect(typeof window.equipmentSystem.equipItem).toBe('function');
    expect(typeof window.equipmentSystem.unequipItem).toBe('function');
  });

  it('calls equipUtils.equipItem with correct args', () => {
    const spy = jest.spyOn(equipUtils, 'equipItem');
    window.equipmentSystem.equipItem('item123', 'mainhand');
    expect(spy).toHaveBeenCalledWith(global.gameData, global.itemsData, 'item123', 'mainhand');
    spy.mockRestore();
  });

  it('calls equipUtils.unequipItem with correct args', () => {
    const spy = jest.spyOn(equipUtils, 'unequipItem');
    window.equipmentSystem.unequipItem('mainhand');
    expect(spy).toHaveBeenCalledWith(global.gameData, global.itemsData, 'mainhand');
    spy.mockRestore();
  });
});

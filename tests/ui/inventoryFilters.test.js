const { filterInventoryItems } = require('../src/assets/js/ui/inventoryFilters');

describe('filterInventoryItems', () => {
  beforeEach(() => {
    global.itemsData = {
      sword: {
        name: 'Sword',
        type: 'weapon',
        rarity: 'common',
        description: 'Sharp blade',
        value: 10,
        weight: 5,
      },
      potion: {
        name: 'Health Potion',
        type: 'consumable',
        rarity: 'rare',
        description: 'Restores health',
        value: 5,
        weight: 1,
      },
      shield: {
        name: 'Shield',
        type: 'armor',
        rarity: 'uncommon',
        description: 'Sturdy protection',
        value: 7,
        weight: 8,
      },
    };
  });

  afterEach(() => {
    delete global.itemsData;
  });

  test('filters by search term and type', () => {
    const inventory = ['sword', 'potion', 'shield'];
    const result = filterInventoryItems(
      inventory,
      'swo',
      { type: 'weapon', rarity: 'all', usability: 'all' },
      { field: 'name', direction: 'asc' },
      () => true
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('sword');
  });

  test('sorts items by value descending', () => {
    const inventory = ['potion', 'shield', 'sword'];
    const result = filterInventoryItems(
      inventory,
      '',
      { type: 'all', rarity: 'all', usability: 'all' },
      { field: 'value', direction: 'desc' },
      () => true
    );
    expect(result.map((i) => i.id)).toEqual(['sword', 'shield', 'potion']);
  });

  test('returns empty array for invalid inventory input', () => {
    const result = filterInventoryItems(
      null,
      '',
      { type: 'all', rarity: 'all', usability: 'all' },
      { field: 'name', direction: 'asc' },
      () => true
    );
    expect(result).toEqual([]);
  });

  test('filters by usability flag', () => {
    const inventory = ['sword', 'potion'];
    const canUse = (item) => item.type === 'weapon';

    const usable = filterInventoryItems(
      inventory,
      '',
      { type: 'all', rarity: 'all', usability: 'usable' },
      { field: 'name', direction: 'asc' },
      canUse
    );
    expect(usable.map((i) => i.id)).toEqual(['sword']);

    const unusable = filterInventoryItems(
      inventory,
      '',
      { type: 'all', rarity: 'all', usability: 'unusable' },
      { field: 'name', direction: 'asc' },
      canUse
    );
    expect(unusable.map((i) => i.id)).toEqual(['potion']);
  });
});

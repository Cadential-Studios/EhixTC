require('../src/assets/js/systems/restSystem.js');
const { RestSystem } = global;

describe('RestSystem', () => {
  test('shortRest restores a quarter of missing health', () => {
    const player = { derivedStats: { health: 10, maxHealth: 20, mana: 5, maxMana: 20 } };
    RestSystem.shortRest(player);
    expect(player.derivedStats.health).toBe(15);
    expect(player.derivedStats.mana).toBe(10);
  });
});

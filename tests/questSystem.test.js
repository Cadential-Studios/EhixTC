require('../src/assets/js/systems/questSystem.js');
const { QuestSystem } = global;

global.gameData = { player: { quests: { active: [], completed: [] } } };

describe('QuestSystem', () => {
  test('startQuest adds quest to active list', () => {
    QuestSystem.startQuest({ id: 'q1', text: 'Test quest' });
    expect(gameData.player.quests.active.length).toBe(1);
  });

  test('completeQuest moves quest to completed list', () => {
    QuestSystem.completeQuest('q1');
    expect(gameData.player.quests.active.length).toBe(0);
    expect(gameData.player.quests.completed.length).toBe(1);
  });
});

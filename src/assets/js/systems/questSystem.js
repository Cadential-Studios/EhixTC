// Quest System
// Basic quest tracking and completion logic

class QuestSystem {
    /**
     * Start a quest and add it to active quests if not already present.
     * @param {object} quest - quest object with id and text
     */
    static startQuest(quest) {
        if (!quest || !quest.id) return;
        const existing = gameData.player.quests.active.find(q => q.id === quest.id);
        if (!existing) {
            gameData.player.quests.active.push({ ...quest, progress: 0 });
        }
    }

    /**
     * Mark a quest as completed and move it to completed array.
     * @param {string} questId
     */
    static completeQuest(questId) {
        const index = gameData.player.quests.active.findIndex(q => q.id === questId);
        if (index !== -1) {
            const [quest] = gameData.player.quests.active.splice(index, 1);
            gameData.player.quests.completed.push(quest);
        }
    }

    /**
     * Update quest progress (0..1)
     */
    static updateProgress(questId, value) {
        const quest = gameData.player.quests.active.find(q => q.id === questId);
        if (quest) quest.progress = Math.min(1, Math.max(0, value));
    }
}
window.QuestSystem = QuestSystem;

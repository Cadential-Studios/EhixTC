// Rest System
// Provides short and long rest mechanics for resource recovery
// Edoria: The Triune Convergence

/**
 * Static class containing rest helpers.
 */
class RestSystem {
    /**
     * Perform a short rest, recovering a portion of health and mana.
     * @param {object} player - player data object
     */
    static shortRest(player) {
        if (!player || !player.derivedStats) return;
        const heal = Math.ceil(player.derivedStats.maxHealth * 0.25);
        const mana = Math.ceil(player.derivedStats.maxMana * 0.25);
        player.derivedStats.health = Math.min(player.derivedStats.maxHealth, player.derivedStats.health + heal);
        player.derivedStats.mana = Math.min(player.derivedStats.maxMana, player.derivedStats.mana + mana);
    }

    /**
     * Perform a long rest, fully restoring health, mana, and per-day resources.
     * @param {object} player - player data object
     */
    static longRest(player) {
        if (!player || !player.derivedStats) return;
        player.derivedStats.health = player.derivedStats.maxHealth;
        player.derivedStats.mana = player.derivedStats.maxMana;
        if (player.spellSlotsUsed) {
            Object.keys(player.spellSlotsUsed).forEach(k => player.spellSlotsUsed[k] = 0);
        }
        if (player.classFeatures) {
            Object.values(player.classFeatures).forEach(f => {
                if (typeof f.used !== 'undefined') f.used = false;
            });
        }
    }
}
window.RestSystem = RestSystem;

// Consumable Item System
// Edoria: The Triune Convergence - Item Usage and Effects System
// TASK 4C: Item Usage & Effects Implementation

class ConsumableSystem {
    constructor() {
        this.activeEffects = new Map(); // Track temporary effects
        this.effectTimers = new Map(); // Track effect durations
    }

    /**
     * Use a consumable item from inventory
     * @param {string} itemId - The ID of the item to use
     * @param {number} quantity - Amount to use (default 1)
     * @returns {boolean} - Success status
     */
    useConsumableItem(itemId, quantity = 1) {
        // Find item in inventory
        const inventoryItem = this.findItemInInventory(itemId);
        if (!inventoryItem) {
            showGameMessage("Item not found in inventory!", 'error');
            return false;
        }

        // Get item data
        const itemData = itemsData[itemId];
        if (!itemData || itemData.type !== 'consumable') {
            showGameMessage("This item cannot be consumed!", 'error');
            return false;
        }

        // Check if we have enough quantity
        const availableQuantity = typeof inventoryItem === 'string' ? 1 : (inventoryItem.quantity || 1);
        if (availableQuantity < quantity) {
            showGameMessage(`Not enough ${itemData.name}! You have ${availableQuantity}, need ${quantity}.`, 'error');
            return false;
        }

        // Apply item effects
        const success = this.applyItemEffect(itemData, quantity);
        
        if (success) {
            // Remove item from inventory
            this.removeItemFromInventory(itemId, quantity);
            
            // Show usage message
            showGameMessage(`Used ${quantity}x ${itemData.name}`, 'success');
            
            // Update displays
            this.refreshDisplays();
            
            // Show floating text effect
            if (typeof showFloatingText === 'function') {
                showFloatingText(`Used ${itemData.name}`, 'green');
            }
            
            console.log(`Used ${quantity}x ${itemData.name} (${itemId})`);
            return true;
        }
        
        return false;
    }

    /**
     * Apply the effects of a consumable item
     * @param {Object} itemData - The item data
     * @param {number} quantity - Amount used
     * @returns {boolean} - Success status
     */
    applyItemEffect(itemData, quantity = 1) {
        if (!itemData.effect) {
            showGameMessage("This item has no effect!", 'warning');
            return false;
        }

        const effects = Array.isArray(itemData.effect) ? itemData.effect : [itemData.effect];
        let anyEffectApplied = false;

        for (const effect of effects) {
            if (this.processEffect(effect, itemData, quantity)) {
                anyEffectApplied = true;
            }
        }

        return anyEffectApplied;
    }

    /**
     * Process a single effect from an item
     * @param {string} effect - Effect string (e.g., "heal:2d4+2")
     * @param {Object} itemData - The item data
     * @param {number} quantity - Amount used
     * @returns {boolean} - Success status
     */
    processEffect(effect, itemData, quantity) {
        const [effectType, effectValue] = effect.split(':');
        
        switch (effectType.toLowerCase()) {
            case 'heal':
                return this.applyHealingEffect(effectValue, quantity, itemData.name);
                
            case 'restore_mana':
            case 'mana':
                return this.applyManaRestorationEffect(effectValue, quantity, itemData.name);
                
            case 'buff_stat':
                return this.applyStatBuffEffect(effectValue, itemData, quantity);
                
            case 'buff_temp':
                return this.applyTemporaryBuffEffect(effectValue, itemData, quantity);
                
            case 'cure_condition':
                return this.applyCureEffect(effectValue, quantity, itemData.name);
                
            case 'sustenance':
                return this.applySustenanceEffect(itemData, quantity);
                
            case 'spell_effect':
                return this.applySpellEffect(effectValue, itemData, quantity);
                
            default:
                console.warn(`Unknown effect type: ${effectType}`);
                return false;
        }
    }

    /**
     * Apply healing effect
     */
    applyHealingEffect(healFormula, quantity, itemName) {
        try {
            const player = gameData.player;
            const currentHealth = player.derivedStats.health;
            const maxHealth = player.derivedStats.maxHealth;
            
            if (currentHealth >= maxHealth) {
                showGameMessage("You are already at full health!", 'info');
                return false;
            }
            
            // Roll for healing amount
            let totalHealing = 0;
            for (let i = 0; i < quantity; i++) {
                const healAmount = this.rollDiceFormula(healFormula);
                totalHealing += healAmount;
            }
            
            // Apply healing
            const newHealth = Math.min(maxHealth, currentHealth + totalHealing);
            const actualHealing = newHealth - currentHealth;
            
            player.derivedStats.health = newHealth;
            
            // Show healing animation and message
            if (typeof showFloatingText === 'function') {
                showFloatingText(`+${actualHealing} HP`, 'green');
            }
            
            showGameMessage(`Restored ${actualHealing} health points!`, 'success');
            
            return true;
        } catch (e) {
            console.error('Error applying healing effect:', e);
            return false;
        }
    }

    /**
     * Apply mana restoration effect
     */
    applyManaRestorationEffect(manaFormula, quantity, itemName) {
        try {
            const player = gameData.player;
            const currentMana = player.derivedStats.mana;
            const maxMana = player.derivedStats.maxMana;
            
            if (currentMana >= maxMana) {
                showGameMessage("Your mana is already full!", 'info');
                return false;
            }
            
            // Roll for mana restoration
            let totalMana = 0;
            for (let i = 0; i < quantity; i++) {
                const manaAmount = this.rollDiceFormula(manaFormula);
                totalMana += manaAmount;
            }
            
            // Apply mana restoration
            const newMana = Math.min(maxMana, currentMana + totalMana);
            const actualMana = newMana - currentMana;
            
            player.derivedStats.mana = newMana;
            
            // Show mana animation and message
            if (typeof showFloatingText === 'function') {
                showFloatingText(`+${actualMana} MP`, 'blue');
            }
            
            showGameMessage(`Restored ${actualMana} mana points!`, 'success');
            
            return true;
        } catch (e) {
            console.error('Error applying mana effect:', e);
            return false;
        }
    }

    /**
     * Apply temporary stat buff effect
     */
    applyStatBuffEffect(buffData, itemData, quantity) {
        try {
            // Parse buff data: "strength:+2:300" (stat:modifier:duration_seconds)
            const [stat, modifier, duration] = buffData.split(':');
            const modValue = parseInt(modifier);
            const durationSeconds = parseInt(duration) || 300; // 5 minutes default
            
            if (!gameData.player.stats[stat]) {
                showGameMessage(`Invalid stat: ${stat}`, 'error');
                return false;
            }
            
            // Apply buff
            const effectId = `${itemData.id}_${stat}_${Date.now()}`;
            this.applyTemporaryStatBuff(stat, modValue, durationSeconds, effectId, itemData.name);
            
            showGameMessage(`${itemData.name} increased your ${stat} by ${modValue} for ${Math.floor(durationSeconds/60)} minutes!`, 'success');
            
            return true;
        } catch (e) {
            console.error('Error applying stat buff:', e);
            return false;
        }
    }

    /**
     * Apply sustenance effect (remove hunger, temporary bonuses)
     */
    applySustenanceEffect(itemData, quantity) {
        // For now, just provide a temporary health bonus
        const bonusHealth = quantity * 2;
        const player = gameData.player;
        
        // Temporarily increase max health
        player.derivedStats.maxHealth += bonusHealth;
        player.derivedStats.health += bonusHealth;
        
        // Set up removal timer (1 hour = 3600 seconds)
        const effectId = `sustenance_${Date.now()}`;
        setTimeout(() => {
            player.derivedStats.maxHealth -= bonusHealth;
            player.derivedStats.health = Math.min(player.derivedStats.health, player.derivedStats.maxHealth);
            showGameMessage("The effects of the food have worn off.", 'info');
            this.refreshDisplays();
        }, 3600000); // 1 hour
        
        showGameMessage(`The ${itemData.name} has nourished you! (+${bonusHealth} temp HP)`, 'success');
        return true;
    }

    /**
     * Apply temporary stat buff to character
     */
    applyTemporaryStatBuff(stat, modifier, durationSeconds, effectId, itemName) {
        // Apply the buff
        gameData.player.stats[stat] += modifier;
        
        // Store the effect for tracking
        this.activeEffects.set(effectId, {
            type: 'stat_buff',
            stat: stat,
            modifier: modifier,
            itemName: itemName,
            endTime: Date.now() + (durationSeconds * 1000)
        });
        
        // Set timer to remove effect
        const timer = setTimeout(() => {
            this.removeTemporaryEffect(effectId);
        }, durationSeconds * 1000);
        
        this.effectTimers.set(effectId, timer);
        
        // Recalculate derived stats
        if (typeof recalculateStats === 'function') {
            recalculateStats();
        }
    }

    /**
     * Remove a temporary effect
     */
    removeTemporaryEffect(effectId) {
        const effect = this.activeEffects.get(effectId);
        if (!effect) return;
        
        switch (effect.type) {
            case 'stat_buff':
                gameData.player.stats[effect.stat] -= effect.modifier;
                showGameMessage(`${effect.itemName} effect has worn off.`, 'info');
                break;
        }
        
        // Clean up
        this.activeEffects.delete(effectId);
        
        const timer = this.effectTimers.get(effectId);
        if (timer) {
            clearTimeout(timer);
            this.effectTimers.delete(effectId);
        }
        
        // Recalculate stats
        if (typeof recalculateStats === 'function') {
            recalculateStats();
        }
        
        this.refreshDisplays();
    }

    /**
     * Roll dice formula (e.g., "2d4+2")
     */
    rollDiceFormula(formula) {
        try {
            // Simple dice rolling for now
            if (formula.includes('d')) {
                const parts = formula.split('+');
                const dicePart = parts[0];
                const bonus = parts.length > 1 ? parseInt(parts[1]) : 0;
                
                const [numDice, dieSize] = dicePart.split('d').map(x => parseInt(x));
                
                let total = bonus;
                for (let i = 0; i < numDice; i++) {
                    total += Math.floor(Math.random() * dieSize) + 1;
                }
                
                return total;
            } else {
                return parseInt(formula) || 0;
            }
        } catch (e) {
            console.error('Error rolling dice formula:', formula, e);
            return 0;
        }
    }

    /**
     * Find item in inventory
     */
    findItemInInventory(itemId) {
        return gameData.player.inventory.find(item => {
            const id = typeof item === 'string' ? item : item.id;
            return id === itemId;
        });
    }

    /**
     * Remove item from inventory
     */
    removeItemFromInventory(itemId, quantity = 1) {
        const inventory = gameData.player.inventory;
        
        for (let i = 0; i < inventory.length; i++) {
            const item = inventory[i];
            const id = typeof item === 'string' ? item : item.id;
            
            if (id === itemId) {
                if (typeof item === 'string') {
                    // Simple item, remove entirely
                    inventory.splice(i, 1);
                    break;
                } else {
                    // Item with quantity
                    const currentQuantity = item.quantity || 1;
                    if (currentQuantity <= quantity) {
                        // Remove entire stack
                        inventory.splice(i, 1);
                    } else {
                        // Reduce quantity
                        item.quantity = currentQuantity - quantity;
                    }
                    break;
                }
            }
        }
    }

    /**
     * Refresh UI displays
     */
    refreshDisplays() {
        // Refresh character sheet
        if (typeof renderCharacterSheet === 'function') {
            renderCharacterSheet();
        }
        
        // Refresh inventory
        if (typeof renderInventory === 'function') {
            renderInventory();
        }
        
        // Update main display
        if (typeof updateDisplay === 'function') {
            updateDisplay();
        }
    }

    /**
     * Get active effects for display
     */
    getActiveEffects() {
        const effects = [];
        for (const [id, effect] of this.activeEffects.entries()) {
            const timeLeft = effect.endTime - Date.now();
            if (timeLeft > 0) {
                effects.push({
                    id,
                    ...effect,
                    timeLeftSeconds: Math.floor(timeLeft / 1000)
                });
            } else {
                // Effect expired, remove it
                this.removeTemporaryEffect(id);
            }
        }
        return effects;
    }

    /**
     * Clear all active effects (for testing or special situations)
     */
    clearAllEffects() {
        for (const effectId of this.activeEffects.keys()) {
            this.removeTemporaryEffect(effectId);
        }
    }
}

// Create global instance
const consumableSystem = new ConsumableSystem();

// Global functions for compatibility
window.useConsumableItem = (itemId, quantity = 1) => {
    return consumableSystem.useConsumableItem(itemId, quantity);
};

window.getActiveEffects = () => {
    return consumableSystem.getActiveEffects();
};

window.clearAllEffects = () => {
    consumableSystem.clearAllEffects();
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ConsumableSystem, consumableSystem };
}

console.log('Consumable System loaded successfully');

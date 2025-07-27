// Saving Throws & Conditions System
// Ehix - The Triune Convergence - Status Effects and Saves

// Active conditions tracking
const activeConditions = {
    player: new Map(),
    enemies: new Map()
};

// Condition definitions
const conditionDefinitions = {
    // Physical Conditions
    poisoned: {
        name: "Poisoned",
        description: "Disadvantage on attack rolls and ability checks",
        icon: "🤢",
        type: "debuff",
        effects: {
            attackRollDisadvantage: true,
            abilityCheckDisadvantage: true
        },
        savingThrow: "constitution",
        duration: "until_saved"
    },
    paralyzed: {
        name: "Paralyzed",
        description: "Cannot move or take actions, automatically fail Strength and Dexterity saves",
        icon: "🚫",
        type: "debuff",
        effects: {
            cannotMove: true,
            cannotAct: true,
            autoFailStr: true,
            autoFailDex: true,
            advantageAgainst: true
        },
        savingThrow: "constitution",
        duration: "until_saved"
    },
    stunned: {
        name: "Stunned",
        description: "Cannot move or take actions, automatically fail Strength and Dexterity saves",
        icon: "😵",
        type: "debuff",
        effects: {
            cannotMove: true,
            cannotAct: true,
            autoFailStr: true,
            autoFailDex: true
        },
        savingThrow: "constitution",
        duration: "until_saved"
    },
    
    // Mental Conditions
    charmed: {
        name: "Charmed",
        description: "Cannot attack the charmer, charmer has advantage on social interactions",
        icon: "💖",
        type: "debuff",
        effects: {
            cannotAttackCharmer: true
        },
        savingThrow: "wisdom",
        duration: "until_saved"
    },
    frightened: {
        name: "Frightened",
        description: "Disadvantage on ability checks and attack rolls while source is in sight",
        icon: "😨",
        type: "debuff",
        effects: {
            attackRollDisadvantage: true,
            abilityCheckDisadvantage: true,
            cannotMoveCloser: true
        },
        savingThrow: "wisdom",
        duration: "until_saved"
    },
    
    // Magical Conditions
    blessed: {
        name: "Blessed",
        description: "Add 1d4 to attack rolls and saving throws",
        icon: "✨",
        type: "buff",
        effects: {
            attackRollBonus: "1d4",
            savingThrowBonus: "1d4"
        },
        duration: "concentration"
    },
    haste: {
        name: "Haste",
        description: "Double speed, +2 AC, advantage on Dexterity saves, extra action",
        icon: "⚡",
        type: "buff",
        effects: {
            doubleSpeed: true,
            acBonus: 2,
            dexSaveAdvantage: true,
            extraAction: true
        },
        duration: "concentration"
    },
    
    // Environmental Conditions
    burning: {
        name: "Burning",
        description: "Take 1d6 fire damage at start of turn",
        icon: "🔥",
        type: "debuff",
        effects: {
            damagePerTurn: "1d6:fire"
        },
        savingThrow: "dexterity",
        duration: "until_saved"
    },
    
    // Spell-Specific Conditions
    shield_spell: {
        name: "Shield",
        description: "+5 bonus to AC until start of next turn",
        icon: "🛡️",
        type: "buff",
        effects: {
            acBonus: 5
        },
        duration: "until_next_turn"
    }
};

// Saving throw DCs
const saveDCs = {
    easy: 10,
    medium: 13,
    hard: 15,
    very_hard: 18,
    nearly_impossible: 20
};

/**
 * Apply a condition to a target
 */
function applyCondition(targetId, conditionId, duration = null, source = null, dc = null) {
    const condition = conditionDefinitions[conditionId];
    if (!condition) {
        console.error(`Unknown condition: ${conditionId}`);
        return false;
    }
    
    const conditionInstance = {
        id: conditionId,
        name: condition.name,
        description: condition.description,
        icon: condition.icon,
        type: condition.type,
        effects: { ...condition.effects },
        duration: duration || condition.duration,
        source: source,
        dc: dc,
        appliedAt: Date.now(),
        turnsRemaining: null
    };
    
    // Set turns remaining for duration-based conditions
    if (typeof duration === 'number') {
        conditionInstance.turnsRemaining = duration;
    }
    
    // Get the appropriate conditions map
    const isPlayer = targetId === 'player';
    const conditionsMap = isPlayer ? activeConditions.player : activeConditions.enemies;
    
    // Apply the condition
    conditionsMap.set(conditionId, conditionInstance);
    
    // Show notification
    const targetName = isPlayer ? 'You' : getEntityName(targetId);
    addCombatMessage(`${condition.icon} ${targetName} ${isPlayer ? 'are' : 'is'} now ${condition.name.toLowerCase()}!`, condition.type);
    
    // Update UI
    updateConditionsDisplay();
    
    return true;
}

/**
 * Remove a condition from a target
 */
function removeCondition(targetId, conditionId) {
    const isPlayer = targetId === 'player';
    const conditionsMap = isPlayer ? activeConditions.player : activeConditions.enemies;
    
    const condition = conditionsMap.get(conditionId);
    if (condition) {
        conditionsMap.delete(conditionId);
        
        const targetName = isPlayer ? 'You' : getEntityName(targetId);
        addCombatMessage(`${targetName} ${isPlayer ? 'are' : 'is'} no longer ${condition.name.toLowerCase()}.`, 'info');
        
        updateConditionsDisplay();
        return true;
    }
    
    return false;
}

/**
 * Get all active conditions for a target
 */
function getActiveConditions(targetId) {
    const isPlayer = targetId === 'player';
    const conditionsMap = isPlayer ? activeConditions.player : activeConditions.enemies;
    return Array.from(conditionsMap.values());
}

/**
 * Check if target has a specific condition
 */
function hasCondition(targetId, conditionId) {
    const isPlayer = targetId === 'player';
    const conditionsMap = isPlayer ? activeConditions.player : activeConditions.enemies;
    return conditionsMap.has(conditionId);
}

/**
 * Perform a saving throw
 */
function performSavingThrow(targetId, abilityName, dc, advantage = false, disadvantage = false) {
    const isPlayer = targetId === 'player';
    const target = isPlayer ? gameData.player : getEntityById(targetId);
    
    if (!target) {
        console.error(`Target not found: ${targetId}`);
        return { success: false, total: 0, roll: 0 };
    }
    
    // Get ability modifier
    const abilityMod = isPlayer ? getAbilityModifier(abilityName) : getMonsterAbilityModifier(target, abilityName);
    
    // Get proficiency bonus if proficient in this save
    const profBonus = isPlayer ? getProficiencyBonus() : getMonsterProficiencyBonus(target);
    const isProficient = isPlayer ? isPlayerProficientInSave(abilityName) : isMonsterProficientInSave(target, abilityName);
    
    // Calculate base modifier
    let modifier = abilityMod + (isProficient ? profBonus : 0);
    
    // Add condition bonuses
    const conditions = getActiveConditions(targetId);
    conditions.forEach(condition => {
        if (condition.effects.savingThrowBonus) {
            const bonusRoll = rollDicePool(condition.effects.savingThrowBonus);
            modifier += bonusRoll.total;
            addCombatMessage(`${condition.icon} ${condition.name} adds +${bonusRoll.total} to the save!`, 'buff');
        }
    });
    
    // Perform the roll
    let result;
    if (advantage && !disadvantage) {
        result = rollWithAdvantage(20, modifier, `${getEntityName(targetId)} ${abilityName.toUpperCase()} Save`, dc);
    } else if (disadvantage && !advantage) {
        result = rollWithDisadvantage(20, modifier, `${getEntityName(targetId)} ${abilityName.toUpperCase()} Save`, dc);
    } else {
        result = rollDiceWithAnimation(20, modifier, `${getEntityName(targetId)} ${abilityName.toUpperCase()} Save`, dc);
    }
    
    // Show result
    const success = result.total >= dc;
    const targetName = getEntityName(targetId);
    addCombatMessage(
        `${targetName} ${success ? 'succeeds' : 'fails'} the ${abilityName} save! (${result.total} vs DC ${dc})`,
        success ? 'success' : 'damage'
    );
    
    return {
        success: success,
        total: result.total,
        roll: result.roll,
        modifier: modifier,
        dc: dc
    };
}

/**
 * Process end-of-turn condition effects
 */
function processEndOfTurnConditions(targetId) {
    const conditions = getActiveConditions(targetId);
    const conditionsToRemove = [];
    
    conditions.forEach(condition => {
        // Handle damage-over-time effects
        if (condition.effects.damagePerTurn) {
            const [diceExpression, damageType] = condition.effects.damagePerTurn.split(':');
            const damage = rollDicePool(diceExpression);
            
            applyConditionDamage(targetId, damage.total, damageType, condition.name);
        }
        
        // Handle turn-based duration
        if (condition.turnsRemaining !== null) {
            condition.turnsRemaining--;
            if (condition.turnsRemaining <= 0) {
                conditionsToRemove.push(condition.id);
            }
        }
        
        // Handle "until next turn" conditions
        if (condition.duration === "until_next_turn") {
            conditionsToRemove.push(condition.id);
        }
        
        // Handle saving throw conditions
        if (condition.duration === "until_saved" && condition.dc) {
            const saveResult = performSavingThrow(targetId, conditionDefinitions[condition.id].savingThrow, condition.dc);
            if (saveResult.success) {
                conditionsToRemove.push(condition.id);
            }
        }
    });
    
    // Remove expired conditions
    conditionsToRemove.forEach(conditionId => {
        removeCondition(targetId, conditionId);
    });
}

/**
 * Apply damage from a condition
 */
function applyConditionDamage(targetId, damage, damageType, conditionName) {
    const isPlayer = targetId === 'player';
    const target = isPlayer ? gameData.player : getEntityById(targetId);
    
    if (!target) return;
    
    const actualDamage = isPlayer ? 
        Math.min(damage, target.hitPoints) : 
        target.takeDamage ? target.takeDamage(damage) : damage;
    
    const targetName = getEntityName(targetId);
    addCombatMessage(
        `${targetName} takes ${actualDamage} ${damageType} damage from ${conditionName}!`,
        'damage'
    );
    
    if (isPlayer) {
        target.hitPoints = Math.max(0, target.hitPoints - actualDamage);
        updateCharacterStats();
    }
}

/**
 * Check if attack roll should have advantage/disadvantage due to conditions
 */
function getAttackRollModification(attackerId, targetId) {
    let advantage = false;
    let disadvantage = false;
    
    // Check attacker conditions
    const attackerConditions = getActiveConditions(attackerId);
    attackerConditions.forEach(condition => {
        if (condition.effects.attackRollDisadvantage) {
            disadvantage = true;
        }
        if (condition.effects.attackRollBonus) {
            // This would be handled in the actual attack roll
        }
    });
    
    // Check target conditions
    const targetConditions = getActiveConditions(targetId);
    targetConditions.forEach(condition => {
        if (condition.effects.advantageAgainst) {
            advantage = true; // Attacks against this target have advantage
        }
    });
    
    return { advantage, disadvantage };
}

/**
 * Get AC bonus from conditions
 */
function getACBonus(targetId) {
    let acBonus = 0;
    const conditions = getActiveConditions(targetId);
    
    conditions.forEach(condition => {
        if (condition.effects.acBonus) {
            acBonus += condition.effects.acBonus;
        }
    });
    
    return acBonus;
}

/**
 * Update conditions display in UI
 */
function updateConditionsDisplay() {
    const playerConditionsEl = document.getElementById('player-conditions');
    const enemyConditionsEl = document.getElementById('enemy-conditions');
    
    if (playerConditionsEl) {
        playerConditionsEl.innerHTML = generateConditionsHTML('player');
    }
    
    // Update enemy conditions if in combat
    if (enemyConditionsEl && combatState.inCombat) {
        let enemyHTML = '';
        combatState.participants.forEach(participant => {
            if (!participant.isPlayer) {
                const conditions = getActiveConditions(participant.id);
                if (conditions.length > 0) {
                    enemyHTML += `<div class="enemy-conditions">
                        <span class="font-bold">${participant.name}:</span>
                        ${generateConditionsHTML(participant.id)}
                    </div>`;
                }
            }
        });
        enemyConditionsEl.innerHTML = enemyHTML;
    }
}

/**
 * Generate HTML for conditions display
 */
function generateConditionsHTML(targetId) {
    const conditions = getActiveConditions(targetId);
    
    if (conditions.length === 0) {
        return '<span class="text-gray-400 text-sm">No active conditions</span>';
    }
    
    return conditions.map(condition => {
        const durationText = condition.turnsRemaining !== null ? 
            ` (${condition.turnsRemaining} turns)` : '';
        
        return `<span class="condition-badge ${condition.type}" title="${condition.description}">
            ${condition.icon} ${condition.name}${durationText}
        </span>`;
    }).join(' ');
}

/**
 * Clear all conditions for a target
 */
function clearAllConditions(targetId) {
    const isPlayer = targetId === 'player';
    const conditionsMap = isPlayer ? activeConditions.player : activeConditions.enemies;
    
    conditionsMap.clear();
    updateConditionsDisplay();
}

/**
 * Helper functions
 */
function getEntityName(targetId) {
    if (targetId === 'player') {
        return gameData.player.name || 'Player';
    }
    
    const entity = getEntityById(targetId);
    return entity ? entity.name : 'Unknown';
}

function getEntityById(id) {
    if (combatState.participants) {
        return combatState.participants.find(p => p.id === id);
    }
    return null;
}

function isPlayerProficientInSave(abilityName) {
    // Simplified - in a full implementation, this would check class features
    const player = gameData.player;
    const proficientSaves = {
        'wizard': ['intelligence', 'wisdom'],
        'fighter': ['strength', 'constitution'],
        'cleric': ['wisdom', 'charisma'],
        'rogue': ['dexterity', 'intelligence']
    };
    
    const classSaves = proficientSaves[player.characterClass] || [];
    return classSaves.includes(abilityName);
}

function getMonsterAbilityModifier(monster, abilityName) {
    // Simplified monster ability calculation
    const abilityScore = monster.abilities?.[abilityName] || 10;
    return Math.floor((abilityScore - 10) / 2);
}

function getMonsterProficiencyBonus(monster) {
    // Simplified proficiency bonus based on CR
    const cr = monster.challengeRating || 1;
    return Math.max(2, Math.floor((cr - 1) / 4) + 2);
}

function isMonsterProficientInSave(monster, abilityName) {
    // Check if monster has specific save proficiencies
    return monster.savingThrows?.includes(abilityName) || false;
}

// Export functions for global access
window.applyCondition = applyCondition;
window.removeCondition = removeCondition;
window.hasCondition = hasCondition;
window.performSavingThrow = performSavingThrow;
window.processEndOfTurnConditions = processEndOfTurnConditions;
window.getAttackRollModification = getAttackRollModification;
window.getACBonus = getACBonus;
window.updateConditionsDisplay = updateConditionsDisplay;
window.clearAllConditions = clearAllConditions;

// Initialize conditions display when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateConditionsDisplay();
});

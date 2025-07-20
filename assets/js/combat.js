// Combat System and Dice Animation Module
// Edoria: The Triune Convergence - Combat Management

// Combat state management
let combatState = {
    inCombat: false,
    participants: [],
    currentTurnIndex: 0,
    round: 1,
    actionQueue: []
};

// Enhanced dice rolling with animation support
function rollDiceWithAnimation(sides = 20, modifier = 0, label = 'Roll', dc = null) {
    const result = Math.floor(Math.random() * sides) + 1;
    const total = result + modifier;
    
    // Use the DiceRoller class for animation
    if (window.diceRoller && gameData.settings.showDiceAnimations) {
        window.diceRoller.showDiceRollAnimation(result, sides, modifier, total, label, dc);
    }
    
    // Determine success/failure if DC provided
    let success = null;
    if (dc !== null) {
        success = total >= dc;
    }
    
    return { roll: result, modifier, total, sides, success, dc };
}

// Simple damage dice rolling function (no DC, success/failure)
function rollSimpleDamageWithAnimation(sides = 4, modifier = 0, label = 'Damage Roll') {
    const result = Math.floor(Math.random() * sides) + 1;
    const total = result + modifier;
    
    // Use the DiceRoller class for animation but without DC (no success/failure)
    if (window.diceRoller && gameData.settings.showDiceAnimations) {
        window.diceRoller.showDiceRollAnimation(result, sides, modifier, total, label, null);
    }
    
    return { roll: result, modifier, total, sides };
}


// Advanced Dice Rolling Engine
function rollDicePool(diceExpression) {
    // Parse expressions like "2d6+3", "1d20", "4d4+2"
    const match = diceExpression.match(/(\d+)?d(\d+)([+-]\d+)?/i);
    if (!match) return { rolls: [], total: 0, expression: diceExpression };
    
    const count = parseInt(match[1]) || 1;
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;
    
    const rolls = rollDice(sides, count);
    const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
    
    return {
        rolls: rolls,
        total: total,
        modifier: modifier,
        expression: diceExpression,
        count: count,
        sides: sides
    };
}

function rollWithAdvantage() {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;
    const result = Math.max(roll1, roll2);
    
    // Show animation for the better roll
    if (window.diceRoller && gameData.settings.showDiceAnimations) {
        window.diceRoller.showDiceRollAnimation(result, 20, 0, result, 'Advantage Roll');
    }
    
    return {
        roll1: roll1,
        roll2: roll2,
        result: result,
        advantage: true
    };
}

function rollWithDisadvantage() {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;
    const result = Math.min(roll1, roll2);
    
    // Show animation for the worse roll
    if (window.diceRoller && gameData.settings.showDiceAnimations) {
        window.diceRoller.showDiceRollAnimation(result, 20, 0, result, 'Disadvantage Roll');
    }
    
    return {
        roll1: roll1,
        roll2: roll2,
        result: result,
        disadvantage: true
    };
}

// Skill Check Integration
function triggerSkillCheck(skillName, dc, description, successCallback, failureCallback, advantage = false, disadvantage = false) {
    const skillMod = getSkillModifier(skillName);
    const skillDisplayName = skillDisplayNames[skillName];
    
    // Roll with animation including DC for success/failure display
    const rollResult = rollDiceWithAnimation(20, skillMod, `${skillDisplayName} Check`, dc);
    
    // Determine success after animation
    setTimeout(() => {
        const success = rollResult.total >= dc;
        const result = {
            roll: rollResult.roll,
            modifier: rollResult.modifier,
            total: rollResult.total,
            dc: dc,
            success: success,
            skillName: skillName,
            description: description
        };
        
        // Show result message
        const resultMessage = success 
            ? `<i class="ph-duotone ph-check-circle text-green-400"></i> ${skillDisplayName} Success! (${rollResult.total} vs DC ${dc})`
            : `<i class="ph-duotone ph-x-circle text-red-400"></i> ${skillDisplayName} Failed. (${rollResult.total} vs DC ${dc})`;
        
        showGameMessage(resultMessage, success ? 'success' : 'failure');
        
        // Execute callbacks
        if (success && successCallback) {
            successCallback(result);
        } else if (!success && failureCallback) {
            failureCallback(result);
        }
    }, gameData.settings.showDiceAnimations ? 1500 / gameData.settings.combatAnimationSpeed : 0);
}

function performSkillCheck(skillName, dc = 15, advantage = false, disadvantage = false) {
    const skillMod = getSkillModifier(skillName);
    const skillDisplayName = skillDisplayNames[skillName];
    
    // Use the DiceRoller class for animated rolls
    let rollResult;
    if (advantage) {
        // For advantage, roll twice and take the higher
        const roll1 = Math.floor(Math.random() * 20) + 1;
        const roll2 = Math.floor(Math.random() * 20) + 1;
        const result = Math.max(roll1, roll2);
        
        if (window.diceRoller && gameData.settings.showDiceAnimations) {
            window.diceRoller.showDiceRollAnimation(result, 20, skillMod, result + skillMod, `${skillDisplayName} Check (Advantage)`, dc);
        }
        
        rollResult = { roll1: roll1, roll2: roll2, result: result };
    } else if (disadvantage) {
        // For disadvantage, roll twice and take the lower
        const roll1 = Math.floor(Math.random() * 20) + 1;
        const roll2 = Math.floor(Math.random() * 20) + 1;
        const result = Math.min(roll1, roll2);
        
        if (window.diceRoller && gameData.settings.showDiceAnimations) {
            window.diceRoller.showDiceRollAnimation(result, 20, skillMod, result + skillMod, `${skillDisplayName} Check (Disadvantage)`, dc);
        }
        
        rollResult = { roll1: roll1, roll2: roll2, result: result };
    } else {
        // Normal roll
        const roll = Math.floor(Math.random() * 20) + 1;
        
        if (window.diceRoller && gameData.settings.showDiceAnimations) {
            window.diceRoller.showDiceRollAnimation(roll, 20, skillMod, roll + skillMod, `${skillDisplayName} Check`, dc);
        }
        
        rollResult = { roll1: roll, result: roll };
    }
    
    const total = rollResult.result + skillMod;
    const success = total >= dc;
    const critical = rollResult.result === 20;
    const criticalFailure = rollResult.result === 1;
    
    return {
        skill: skillName,
        skillModifier: skillMod,
        rollResult: rollResult,
        total: total,
        dc: dc,
        success: success,
        critical: critical,
        criticalFailure: criticalFailure,
        advantage: advantage,
        disadvantage: disadvantage,
        breakdown: getSkillBreakdown(skillName)
    };
}

// Manual Skill Check Function
function triggerManualSkillCheck(skillName) {
    // Let player choose difficulty for manual checks
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-900 border-2 border-gray-600 rounded-lg p-6 max-w-md mx-4">
            <h3 class="font-cinzel text-xl text-white mb-4">${skillDisplayNames[skillName]} Check</h3>
            <p class="text-gray-300 mb-4">Choose the difficulty for this skill check:</p>
            <div class="space-y-2">
                <button class="difficulty-btn w-full p-2 bg-green-600 hover:bg-green-700 text-white rounded" data-dc="${DC.EASY}">Easy (DC ${DC.EASY})</button>
                <button class="difficulty-btn w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded" data-dc="${DC.MEDIUM}">Medium (DC ${DC.MEDIUM})</button>
                <button class="difficulty-btn w-full p-2 bg-purple-600 hover:bg-purple-700 text-white rounded" data-dc="${DC.HARD}">Hard (DC ${DC.HARD})</button>
                <button class="difficulty-btn w-full p-2 bg-red-600 hover:bg-red-700 text-white rounded" data-dc="${DC.VERY_HARD}">Very Hard (DC ${DC.VERY_HARD})</button>
            </div>
            <button class="cancel-btn w-full mt-4 p-2 bg-gray-600 hover:bg-gray-700 text-white rounded">Cancel</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target.classList.contains('difficulty-btn')) {
            const dc = parseInt(e.target.dataset.dc);
            document.body.removeChild(modal);
            
            triggerSkillCheck(skillName, dc, `Manual ${skillDisplayNames[skillName]} check`, 
                function(result) {
                    // Success callback
                    gameData.player.lore.add(`Successfully completed a ${skillDisplayNames[skillName]} check (DC ${dc}) with a total of ${result.total}.`);
                    // Award experience for successful skill checks
                    const xpGain = Math.max(1, Math.floor(dc / 5));
                    gainExperience(xpGain);
                },
                function(result) {
                    // Failure callback  
                    gameData.player.lore.add(`Failed a ${skillDisplayNames[skillName]} check (DC ${dc}) with a total of ${result.total}.`);
                }
            );
        } else if (e.target.classList.contains('cancel-btn') || e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Combat Core Mechanics
class CombatParticipant {
    constructor(data, isPlayer = false) {
        this.id = data.id || 'player';
        this.name = data.name || 'Player';
        this.isPlayer = isPlayer;
        this.maxHitPoints = data.hitPoints || (isPlayer ? gameData.player.derivedStats.health || 100 : 50);
        this.currentHitPoints = this.maxHitPoints;
        this.armorClass = data.armorClass || this.calculatePlayerAC();
        this.attributes = data.attributes || (isPlayer ? gameData.player.stats : {
            strength: 10, dexterity: 10, constitution: 10, 
            intelligence: 10, wisdom: 10, charisma: 10
        });
        this.abilities = data.abilities || [];
        this.conditions = [];
        this.initiative = 0;
        this.hasActedThisTurn = false;
        this.hasMovedThisTurn = false;
        this.tempModifiers = {};
    }

    calculatePlayerAC() {
        let baseAC = 10;
        const dexMod = Math.floor((this.attributes.dexterity - 10) / 2);
        
        if (this.isPlayer && gameData.player.equipment) {
            baseAC = gameData.player.derivedStats.armorClass;
        } else {
            baseAC += dexMod;
        }
        
        return baseAC;
    }

    rollInitiative() {
        const dexMod = getAbilityModifier(this.attributes.dexterity);
        this.initiative = Math.floor(Math.random() * 20) + 1 + dexMod;
        return this.initiative;
    }

    takeDamage(amount, damageType = 'physical') {
        let finalDamage = amount;
        
        if (this.abilities) {
            // Apply resistances and immunities (simplified)
            const resistance = this.abilities.find(a => a.type === 'resistance' && a.damageType === damageType);
            if (resistance) {
                finalDamage = Math.floor(finalDamage / 2);
            }
        }
        
        this.currentHitPoints = Math.max(0, this.currentHitPoints - finalDamage);
        
        if (this.isPlayer) {
            gameData.player.derivedStats.health = this.currentHitPoints;
        }
        
        return finalDamage;
    }

    heal(amount) {
        const healedAmount = Math.min(amount, this.maxHitPoints - this.currentHitPoints);
        this.currentHitPoints += healedAmount;
        
        if (this.isPlayer) {
            gameData.player.derivedStats.health = this.currentHitPoints;
        }
        
        return healedAmount;
    }

    isDead() {
        return this.currentHitPoints <= 0;
    }

    canAct() {
        return !this.isDead() && !this.hasActedThisTurn && !this.hasCondition('stunned') && !this.hasCondition('paralyzed');
    }

    hasCondition(conditionName) {
        return this.conditions.some(c => c.name === conditionName);
    }

    addCondition(condition) {
        this.conditions.push(condition);
    }

    removeCondition(conditionName) {
        this.conditions = this.conditions.filter(c => c.name !== conditionName);
    }
}

// Roll damage with animation
function rollDamageWithAnimation(damageString, critical = false, extraBonus = 0, label = 'Damage') {
    // Parse damage string like "1d6+2" or "2d8"
    const match = damageString.match(/(\d+)d(\d+)(?:\+(\d+))?/);
    if (!match) return { total: 1, dice: [], bonus: 0 };
    
    const numDice = parseInt(match[1]);
    const dieSize = parseInt(match[2]);
    const bonus = parseInt(match[3]) || 0;
    const totalBonus = bonus + extraBonus;
    
    let diceRolls = [];
    let total = totalBonus;
    
    // Roll dice (double on critical)
    const rollCount = critical ? numDice * 2 : numDice;
    for (let i = 0; i < rollCount; i++) {
        const roll = Math.floor(Math.random() * dieSize) + 1;
        diceRolls.push(roll);
        total += roll;
    }
    
    // Use the same animation system as skill checks
    if (gameData.settings.showDiceAnimations) {
        const displayLabel = critical ? `${label} (CRITICAL!)` : label;
        rollDiceWithAnimation(dieSize, totalBonus, displayLabel);
    }
    
    return { total, dice: diceRolls, bonus: totalBonus, critical };
}

function rollDamage(damageString, critical = false) {
    // Parse damage string like "1d6+2" or "2d8"
    const match = damageString.match(/(\d+)d(\d+)(?:\+(\d+))?/);
    if (!match) return 1;
    
    const numDice = parseInt(match[1]);
    const dieSize = parseInt(match[2]);
    const bonus = parseInt(match[3]) || 0;
    
    let total = bonus;
    
    // Roll dice (double on critical)
    const rollCount = critical ? numDice * 2 : numDice;
    for (let i = 0; i < rollCount; i++) {
        total += Math.floor(Math.random() * dieSize) + 1;
    }
    
    return total;
}

// Test combat function
function testCombat() {
    const testMonsters = [
        {
            id: 'goblin',
            name: 'Goblin',
            hitPoints: 20,
            armorClass: 13,
            attributes: { strength: 8, dexterity: 14, constitution: 10, intelligence: 10, wisdom: 8, charisma: 8 },
            abilities: [
                { type: 'attack', name: 'Scimitar', attackBonus: 4, damage: '1d6+2' }
            ]
        }
    ];
    
    startCombat(testMonsters);
}

// Combat UI Functions referenced in HTML
function selectCombatAction(action) {
    console.log('Combat action selected:', action);
    if (action === 'attack') {
        showTargetSelection();
    }
}

function performPlayerAction(action) {
    console.log('Player action:', action);
    if (!combatState.inCombat) {
        showGameMessage('Not in combat!', 'warning');
        return;
    }
    
    switch(action) {
        case 'defend':
            addCombatMessage('<i class="ph-duotone ph-shield"></i> You take a defensive stance, gaining +2 AC until your next turn.');
            break;
        case 'dash':
            addCombatMessage('💨 You dash, doubling your movement speed.');
            break;
        case 'dodge':
            addCombatMessage('🏃 You focus entirely on avoiding attacks.');
            break;
        case 'help':
            addCombatMessage('🤝 You help an ally, giving them advantage on their next action.');
            break;
    }
    endPlayerTurn();
}

function openSpellMenu() {
    console.log('Opening spell menu...');
    showGameMessage('Spell system coming soon!', 'info');
}

function showTargetSelection() {
    const targetSelection = document.getElementById('target-selection');
    const targetList = document.getElementById('target-list');
    
    if (!targetSelection || !targetList) return;
    
    targetList.innerHTML = '';
    
    // Add enemy targets
    combatState.participants.forEach(participant => {
        if (!participant.isPlayer && participant.hitPoints > 0) {
            const targetButton = document.createElement('button');
            targetButton.className = 'w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded';
            targetButton.textContent = `${participant.name} (${participant.hitPoints}/${participant.maxHitPoints} HP)`;
            targetButton.onclick = () => selectTarget(participant);
            targetList.appendChild(targetButton);
        }
    });
    
    targetSelection.style.display = 'block';
}

function selectTarget(target) {
    console.log('Target selected:', target.name);
    cancelTargetSelection();
    
    // Perform attack
    const player = combatState.participants.find(p => p.isPlayer);
    if (player && target) {
        performAttack(player, target);
    }
}

function cancelTargetSelection() {
    const targetSelection = document.getElementById('target-selection');
    if (targetSelection) {
        targetSelection.style.display = 'none';
    }
}

function exitCombat() {
    if (combatState.inCombat) {
        combatState.inCombat = false;
        addCombatMessage('🏃 You flee from combat!');
        
        // Hide combat screen
        const combatScreen = document.getElementById('combat-screen');
        const gameScreen = document.getElementById('game-screen');
        
        if (combatScreen && gameScreen) {
            combatScreen.style.display = 'none';
            gameScreen.style.display = 'flex';
        }
        
        showGameMessage('Fled from combat!', 'warning');
    }
}

function endPlayerTurn() {
    // Simple turn ending for now
    if (combatState.inCombat) {
        addCombatMessage('Turn ended.');
        // In a full system, this would advance to the next participant
    }
}

// Basic attack function
function performAttack(attacker, target) {
    if (!attacker || !target) {
        console.error('Invalid attacker or target for performAttack');
        return;
    }
    
    addCombatMessage(`${attacker.name} attacks ${target.name}!`);
    
    // Simple attack roll - d20 + ability modifier vs target AC
    const attackMod = attacker.isPlayer ? getAbilityModifier('strength') : 3; // Default +3 for monsters
    const attackResult = rollDiceWithAnimation(20, attackMod, `${attacker.name} Attack Roll`, target.armorClass);
    
    // Delay damage calculation to allow animation to complete
    setTimeout(() => {
        if (attackResult.total >= target.armorClass) {
            // Hit! Roll damage
            const damageAmount = rollDamageWithAnimation('1d6+2', false, 0, 'Damage');
            const actualDamage = target.takeDamage(damageAmount.total);
            
            addCombatMessage(`<i class="ph-duotone ph-target"></i> Hit! ${target.name} takes ${actualDamage} damage! (${target.currentHitPoints}/${target.maxHitPoints} HP remaining)`, 'damage');
            
            if (target.isDead()) {
                addCombatMessage(`<i class="ph-duotone ph-skull"></i> ${target.name} is defeated!`, 'success');
            }
        } else {
            addCombatMessage(`<i class="ph-duotone ph-shield"></i> Miss! ${attacker.name}'s attack fails to hit ${target.name}. (Rolled ${attackResult.total} vs AC ${target.armorClass})`);
        }
        
        endPlayerTurn();
    }, gameData.settings.showDiceAnimations ? 3000 / gameData.settings.combatAnimationSpeed : 0); // Extended time for enhanced animation
}

// Simple combat start function
function startCombat(monsters) {
    combatState.inCombat = true;
    combatState.participants = [];
    combatState.round = 1;
    combatState.currentTurnIndex = 0;
    
    // Add player
    const player = new CombatParticipant(gameData.player, true);
    combatState.participants.push(player);
    
    // Add monsters
    monsters.forEach(monsterData => {
        const monster = new CombatParticipant(monsterData, false);
        combatState.participants.push(monster);
    });
    
    // Show combat screen
    const combatScreen = document.getElementById('combat-screen');
    const gameScreen = document.getElementById('game-screen');
    
    if (combatScreen && gameScreen) {
        gameScreen.style.display = 'none';
        combatScreen.style.display = 'flex';
    }
    
    addCombatMessage('<i class="ph-duotone ph-fire"></i> Combat begins!', 'warning');
    addCombatMessage(`Facing: ${monsters.map(m => m.name).join(', ')}`);
}

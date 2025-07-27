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
    }, gameData.settings.showDiceAnimations ? 3000 / gameData.settings.combatAnimationSpeed : 0);
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
    console.log('🎮 Starting test combat...');
    
    // Check if required systems are available
    if (typeof gameData === 'undefined') {
        console.error('❌ gameData not available');
        showGameMessage('Game data not loaded - cannot start combat', 'error');
        return;
    }
    
    if (typeof addCombatMessage === 'undefined') {
        console.error('❌ addCombatMessage function not available');
        return;
    }
    
    const testMonsters = [
        {
            id: 'test_goblin',
            name: 'Test Goblin',
            hitPoints: 20,
            armorClass: 13,
            attributes: { 
                strength: 8, 
                dexterity: 14, 
                constitution: 10, 
                intelligence: 10, 
                wisdom: 8, 
                charisma: 8 
            },
            abilities: [
                { type: 'attack', name: 'Scimitar', attackBonus: 4, damage: '1d6+2' }
            ]
        },
        {
            id: 'test_orc',
            name: 'Test Orc',
            hitPoints: 30,
            armorClass: 14,
            attributes: { 
                strength: 16, 
                dexterity: 12, 
                constitution: 16, 
                intelligence: 7, 
                wisdom: 11, 
                charisma: 10 
            },
            abilities: [
                { type: 'attack', name: 'Greataxe', attackBonus: 5, damage: '1d12+3' }
            ]
        }
    ];
    
    console.log('🐉 Test monsters:', testMonsters);
    
    try {
        startCombat(testMonsters);
        console.log('✅ Test combat started successfully');
        
        // Also display active conditions if system is available
        if (typeof updateConditionsDisplay === 'function') {
            updateConditionsDisplay();
            console.log('✅ Conditions display updated');
        }
        
    } catch (error) {
        console.error('❌ Error starting test combat:', error);
        showGameMessage(`Combat start failed: ${error.message}`, 'error');
    }
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
    console.log('🚀 Starting combat with monsters:', monsters);
    
    // Validate inputs
    if (!monsters || !Array.isArray(monsters) || monsters.length === 0) {
        console.error('❌ Invalid monsters data provided to startCombat');
        showGameMessage('Invalid enemy data - cannot start combat', 'error');
        return;
    }
    
    // Check if player exists
    if (!gameData || !gameData.player) {
        console.error('❌ Player data not available');
        showGameMessage('Player data not loaded - cannot start combat', 'error');
        return;
    }
    
    // Initialize combat state
    combatState.inCombat = true;
    combatState.participants = [];
    combatState.round = 1;
    combatState.currentTurnIndex = 0;
    
    try {
        // Add player
        console.log('👤 Adding player to combat');
        const player = new CombatParticipant(gameData.player, true);
        combatState.participants.push(player);
        console.log('✅ Player added:', player);
        
        // Add monsters
        console.log('🐉 Adding monsters to combat');
        monsters.forEach((monsterData, index) => {
            try {
                const monster = new CombatParticipant(monsterData, false);
                combatState.participants.push(monster);
                console.log(`✅ Monster ${index + 1} added:`, monster);
            } catch (error) {
                console.error(`❌ Error creating monster ${index + 1}:`, error);
            }
        });
        
        // Roll initiative for all participants
        console.log('🎲 Rolling initiative...');
        combatState.participants.forEach(participant => {
            participant.rollInitiative();
        });
        
        // Sort by initiative
        combatState.participants.sort((a, b) => b.initiative - a.initiative);
        console.log('📊 Initiative order:', combatState.participants.map(p => `${p.name}: ${p.initiative}`));
        
        // Show combat screen
        const combatScreen = document.getElementById('combat-screen');
        const gameScreen = document.getElementById('game-screen');
        
        if (combatScreen && gameScreen) {
            gameScreen.style.display = 'none';
            combatScreen.style.display = 'flex';
            console.log('🖥️ Combat screen displayed');
        } else {
            console.error('❌ Combat screen elements not found');
            showGameMessage('Combat UI not available', 'error');
            return;
        }
        
        // Initialize combat UI
        updateCombatUI();
        updateInitiativeDisplay();
        
        // Welcome messages
        addCombatMessage('<i class="ph-duotone ph-fire"></i> Combat begins!', 'warning');
        addCombatMessage(`Facing: ${monsters.map(m => m.name).join(', ')}`);
        addCombatMessage(`Initiative: ${combatState.participants.map(p => `${p.name} (${p.initiative})`).join(', ')}`);
        
        console.log('✅ Combat started successfully');
        
    } catch (error) {
        console.error('❌ Error during combat initialization:', error);
        showGameMessage(`Combat initialization failed: ${error.message}`, 'error');
        
        // Reset combat state on error
        combatState.inCombat = false;
        combatState.participants = [];
    }
}

// Combat UI Update Functions
function updateCombatUI() {
    console.log('🖥️ Updating combat UI...');
    
    // Update participants display
    const participantsContainer = document.getElementById('combat-participants');
    if (participantsContainer && combatState.participants) {
        participantsContainer.innerHTML = '';
        
        combatState.participants.forEach(participant => {
            const participantDiv = document.createElement('div');
            participantDiv.className = `participant-card p-3 rounded-lg border-2 ${
                participant.isPlayer ? 'bg-blue-900 border-blue-500' : 'bg-red-900 border-red-500'
            }`;
            
            const healthPercent = Math.max(0, (participant.currentHitPoints / participant.maxHitPoints) * 100);
            const healthBarColor = healthPercent > 60 ? 'bg-green-500' : healthPercent > 30 ? 'bg-yellow-500' : 'bg-red-500';
            
            participantDiv.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-bold text-white">${participant.name}</h4>
                    <span class="text-sm text-gray-300">AC ${participant.armorClass}</span>
                </div>
                <div class="health-bar bg-gray-700 rounded-full h-3 mb-2">
                    <div class="${healthBarColor} h-full rounded-full transition-all" style="width: ${healthPercent}%"></div>
                </div>
                <div class="text-sm text-gray-300">
                    ${participant.currentHitPoints}/${participant.maxHitPoints} HP
                </div>
                ${participant.conditions.length > 0 ? `
                    <div class="conditions mt-2">
                        ${participant.conditions.map(c => `<span class="inline-block bg-yellow-600 text-xs px-2 py-1 rounded mr-1">${c.name}</span>`).join('')}
                    </div>
                ` : ''}
            `;
            
            participantsContainer.appendChild(participantDiv);
        });
        
        console.log('✅ Combat participants UI updated');
    }
    
    // Update round display
    const roundDisplay = document.getElementById('combat-round-display');
    if (roundDisplay) {
        roundDisplay.textContent = `Round ${combatState.round}`;
    }
    
    // Update current turn display
    const turnDisplay = document.getElementById('current-turn-display');
    if (turnDisplay && combatState.participants[combatState.currentTurnIndex]) {
        const currentParticipant = combatState.participants[combatState.currentTurnIndex];
        turnDisplay.textContent = `${currentParticipant.name}'s Turn`;
        turnDisplay.className = currentParticipant.isPlayer 
            ? 'text-white bg-blue-600 px-3 py-1 rounded font-bold'
            : 'text-white bg-red-600 px-3 py-1 rounded font-bold';
    }
}

function updateInitiativeDisplay() {
    console.log('🎲 Updating initiative display...');
    
    const initiativeList = document.getElementById('initiative-list');
    if (initiativeList && combatState.participants) {
        initiativeList.innerHTML = '';
        
        combatState.participants.forEach((participant, index) => {
            const initiativeItem = document.createElement('div');
            initiativeItem.className = `initiative-item p-2 rounded border ${
                index === combatState.currentTurnIndex 
                    ? 'bg-yellow-600 border-yellow-400 text-black font-bold' 
                    : participant.isPlayer
                        ? 'bg-blue-800 border-blue-600 text-white'
                        : 'bg-red-800 border-red-600 text-white'
            }`;
            
            initiativeItem.innerHTML = `
                <div class="flex justify-between items-center">
                    <span>${participant.name}</span>
                    <span>${participant.initiative}</span>
                </div>
                ${participant.hasActedThisTurn ? '<div class="text-xs opacity-75">Acted</div>' : ''}
            `;
            
            initiativeList.appendChild(initiativeItem);
        });
        
        console.log('✅ Initiative display updated');
    }
}

function updateConditionsDisplay() {
    console.log('🌟 Updating conditions display...');
    
    // Update combat conditions display
    const conditionsDisplay = document.getElementById('conditions-display');
    const activeConditionsContainer = document.getElementById('active-conditions');
    
    if (conditionsDisplay && activeConditionsContainer) {
        const playerConditions = combatState.participants.find(p => p.isPlayer)?.conditions || [];
        
        if (playerConditions.length > 0) {
            conditionsDisplay.style.display = 'block';
            activeConditionsContainer.innerHTML = '';
            
            playerConditions.forEach(condition => {
                const conditionDiv = document.createElement('div');
                conditionDiv.className = 'condition-item bg-yellow-700 p-2 rounded border border-yellow-500';
                conditionDiv.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-yellow-200">${condition.name}</span>
                        <span class="text-xs text-yellow-300">${condition.duration ? `${condition.duration} rounds` : 'Permanent'}</span>
                    </div>
                    <div class="text-xs text-yellow-100 mt-1">${condition.description}</div>
                `;
                activeConditionsContainer.appendChild(conditionDiv);
            });
        } else {
            conditionsDisplay.style.display = 'none';
        }
    }
    
    // Update character panel conditions
    const characterConditions = document.getElementById('character-active-conditions');
    const noConditionsText = document.getElementById('no-conditions-text');
    
    if (characterConditions && noConditionsText) {
        const playerConditions = gameData.player.conditions || [];
        
        if (playerConditions.length > 0) {
            characterConditions.innerHTML = '';
            noConditionsText.style.display = 'none';
            
            playerConditions.forEach(condition => {
                const conditionDiv = document.createElement('div');
                conditionDiv.className = 'condition-item bg-yellow-800 p-3 rounded border border-yellow-600';
                conditionDiv.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-yellow-200">${condition.name}</span>
                        <span class="text-sm text-yellow-300">${condition.duration ? `${condition.duration} rounds` : 'Until removed'}</span>
                    </div>
                    <div class="text-sm text-yellow-100">${condition.description}</div>
                `;
                characterConditions.appendChild(conditionDiv);
            });
        } else {
            characterConditions.innerHTML = '';
            noConditionsText.style.display = 'block';
        }
    }
}

// Global test functions for easy console access
window.startTestCombat = function() {
    console.log('🎮 Starting test combat from console...');
    testCombat();
};

// Quick combat test function
window.quickTest = function() {
    console.log('⚡ Quick combat test starting...');
    
    // Simple monster for quick testing
    const quickMonster = {
        id: 'quick_test',
        name: 'Test Dummy',
        hitPoints: 15,
        armorClass: 10,
        attributes: { 
            strength: 10, 
            dexterity: 10, 
            constitution: 10, 
            intelligence: 10, 
            wisdom: 10, 
            charisma: 10 
        },
        abilities: [
            { type: 'attack', name: 'Punch', attackBonus: 2, damage: '1d4+1' }
        ]
    };
    
    try {
        startCombat([quickMonster]);
        console.log('✅ Quick test combat started!');
    } catch (error) {
        console.error('❌ Quick test failed:', error);
    }
};

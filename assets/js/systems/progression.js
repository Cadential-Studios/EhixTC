// Character Progression UI Extensions
// Enhances character sheet with detailed level progression information

// Level-up choices and advancement
const levelUpChoices = {
    pendingLevels: 0,
    abilityScoreImprovements: 0,
    hitPointRolls: [],
    skillProficiencies: [],
    classFeatures: []
};

/**
 * Check for level up and trigger advancement
 */
function checkForLevelUp() {
    if (typeof experienceManager === 'undefined') {
        console.error('Experience Manager not loaded');
        return;
    }

    // Check if modal is already open to prevent duplicates
    if (document.getElementById('level-up-modal')) {
        console.log('Level up modal already open, skipping');
        return;
    }

    const xpStats = experienceManager.getExperienceStats();
    const player = gameData.player;
    const newLevel = experienceManager.calculateLevelFromExperience(xpStats.totalExperience);
    
    if (newLevel > player.level) {
        console.log(`🌟 Level up detected: ${player.level} → ${newLevel}`);
        const levelsGained = newLevel - player.level;
        levelUpChoices.pendingLevels = levelsGained;
        
        // Reset level up choices
        levelUpChoices.abilityScoreImprovements = 0;
        levelUpChoices.hitPointRolls = [];
        levelUpChoices.skillProficiencies = [];
        levelUpChoices.classFeatures = [];
        
        for (let i = 1; i <= levelsGained; i++) {
            const targetLevel = player.level + i;
            prepareLevelUpChoices(targetLevel);
        }
        
        showLevelUpModal();
    } else {
        console.log('No level up needed');
    }
}

/**
 * Prepare level-up choices for a specific level
 */
function prepareLevelUpChoices(level) {
    const player = gameData.player;
    const characterClass = player.characterClass;
    
    // Hit points (roll or take average)
    const hitDieSize = getHitDieForClass(characterClass);
    levelUpChoices.hitPointRolls.push({
        level: level,
        hitDie: hitDieSize,
        rolled: false,
        value: 0
    });
    
    // Ability Score Improvements (levels 4, 8, 12, 16, 19 for most classes)
    if ([4, 8, 12, 16, 19].includes(level)) {
        levelUpChoices.abilityScoreImprovements++;
    }
    
    // Class features
    const classFeatures = getClassFeaturesForLevel(characterClass, level);
    levelUpChoices.classFeatures.push(...classFeatures);
    
    // Skill proficiencies (some classes get additional skills)
    if (shouldGainSkillProficiency(characterClass, level)) {
        levelUpChoices.skillProficiencies.push(level);
    }
}

/**
 * Show level-up modal for player choices
 */
function showLevelUpModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
    modal.style.zIndex = '10000';
    modal.id = 'level-up-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-blue-600 shadow-2xl';

    modalContent.innerHTML = `
        <div class="space-y-6">
            <!-- Header -->
            <div class="text-center border-b border-blue-600 pb-4">
                <h2 class="font-cinzel text-4xl text-yellow-300 mb-2">🎉 LEVEL UP! 🎉</h2>
                <p class="text-blue-200 text-lg">Congratulations! You've gained ${levelUpChoices.pendingLevels} level${levelUpChoices.pendingLevels > 1 ? 's' : ''}!</p>
            </div>

            <!-- Level-up choices container -->
            <div id="level-up-choices" class="space-y-6">
                ${generateLevelUpChoicesHTML()}
            </div>

            <!-- Confirm level up button -->
            <div class="text-center">
                <button onclick="confirmLevelUp()" class="bg-yellow-600 hover:bg-yellow-700 text-black font-bold px-8 py-3 rounded-lg font-cinzel text-lg">
                    Complete Level Up
                </button>
            </div>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

/**
 * Generate HTML for level-up choices
 */
function generateLevelUpChoicesHTML() {
    let html = '';
    
    // Hit Point rolls
    if (levelUpChoices.hitPointRolls.length > 0) {
        html += `
            <div class="bg-red-800 bg-opacity-50 rounded-lg p-4">
                <h3 class="font-cinzel text-xl text-red-300 mb-3">❤️ Hit Points</h3>
                <div class="space-y-3">
        `;
        
        levelUpChoices.hitPointRolls.forEach((hpRoll, index) => {
            const average = Math.floor(hpRoll.hitDie / 2) + 1;
            html += `
                <div class="flex items-center justify-between bg-gray-800 rounded p-3">
                    <span class="text-white">Level ${hpRoll.level} Hit Points:</span>
                    <div class="space-x-2">
                        <button onclick="rollHitPoints(${index})" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                            Roll 1d${hpRoll.hitDie} ${hpRoll.rolled && hpRoll.value ? `(Rolled: ${hpRoll.value})` : ''}
                        </button>
                        <button onclick="takeAverageHitPoints(${index})" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                            Take Average (${average})
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Ability Score Improvements
    if (levelUpChoices.abilityScoreImprovements > 0) {
        html += `
            <div class="bg-purple-800 bg-opacity-50 rounded-lg p-4">
                <h3 class="font-cinzel text-xl text-purple-300 mb-3">📈 Ability Score Improvement</h3>
                <p class="text-gray-300 mb-3">Choose how to improve your abilities:</p>
                <div id="ability-score-choices" class="space-y-2">
                    ${generateAbilityScoreChoicesHTML()}
                </div>
            </div>
        `;
    }
    
    // Class Features
    if (levelUpChoices.classFeatures.length > 0) {
        html += `
            <div class="bg-green-800 bg-opacity-50 rounded-lg p-4">
                <h3 class="font-cinzel text-xl text-green-300 mb-3">⭐ New Class Features</h3>
                <div class="space-y-2">
        `;
        
        levelUpChoices.classFeatures.forEach(feature => {
            html += `
                <div class="bg-gray-800 rounded p-3">
                    <h4 class="text-yellow-400 font-bold">${feature.name}</h4>
                    <p class="text-gray-300 text-sm">${feature.description}</p>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    return html;
}

/**
 * Generate ability score improvement choices
 */
function generateAbilityScoreChoicesHTML() {
    const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    let html = '';
    
    html += `
        <div class="grid grid-cols-2 gap-2">
            <div>
                <h4 class="text-white font-bold mb-2">Increase Two Different Abilities by 1:</h4>
    `;
    
    abilities.forEach(ability => {
        const currentScore = gameData.player.abilities[ability] || 10;
        const canIncrease = currentScore < 20;
        
        html += `
            <label class="flex items-center space-x-2 ${canIncrease ? '' : 'opacity-50'}">
                <input type="checkbox" name="ability-increase" value="${ability}" 
                       ${canIncrease ? '' : 'disabled'} 
                       onchange="handleAbilityScoreChoice(this)"
                       class="text-purple-600">
                <span class="text-white capitalize">${ability} (${currentScore})</span>
            </label>
        `;
    });
    
    html += `
            </div>
            <div class="text-center">
                <div class="text-gray-400 mb-2">OR</div>
                <button onclick="chooseFeat()" class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded">
                    Choose a Feat
                </button>
            </div>
        </div>
    `;
    
    return html;
}

/**
 * Handle ability score improvement choices
 */
function handleAbilityScoreChoice(checkbox) {
    const checkedBoxes = document.querySelectorAll('input[name="ability-increase"]:checked');
    
    // Limit to 2 selections
    if (checkedBoxes.length > 2) {
        checkbox.checked = false;
        showGameMessage('You can only increase 2 different abilities!', 'warning');
    }
}

/**
 * Roll hit points for a level
 */
function rollHitPoints(index) {
    const hpRoll = levelUpChoices.hitPointRolls[index];
    const roll = Math.floor(Math.random() * hpRoll.hitDie) + 1;
    
    hpRoll.rolled = true;
    hpRoll.value = roll;
    
    // Add Constitution modifier
    const conMod = getAbilityModifier('constitution');
    hpRoll.value += conMod;
    
    // Regenerate the choices HTML to show the result
    document.getElementById('level-up-choices').innerHTML = generateLevelUpChoicesHTML();
    
    showGameMessage(`Rolled ${roll} + ${conMod} CON = ${hpRoll.value} hit points!`, 'success');
}

/**
 * Take average hit points for a level
 */
function takeAverageHitPoints(index) {
    const hpRoll = levelUpChoices.hitPointRolls[index];
    const average = Math.floor(hpRoll.hitDie / 2) + 1;
    
    hpRoll.rolled = true;
    hpRoll.value = average;
    
    // Add Constitution modifier
    const conMod = getAbilityModifier('constitution');
    hpRoll.value += conMod;
    
    // Regenerate the choices HTML to show the result
    document.getElementById('level-up-choices').innerHTML = generateLevelUpChoicesHTML();
    
    showGameMessage(`Took average ${average} + ${conMod} CON = ${hpRoll.value} hit points!`, 'success');
}

/**
 * Confirm and apply level up
 */
function confirmLevelUp() {
    // Validate all choices are made
    if (!validateLevelUpChoices()) {
        showGameMessage('Please complete all level-up choices!', 'warning');
        return;
    }
    
    // Apply level up changes
    applyLevelUpChanges();
    
    // Close modal
    const modal = document.getElementById('level-up-modal');
    if (modal) {
        modal.remove();
    }
    
    // Reset level up choices
    resetLevelUpChoices();
    
    // Update character display
    updateCharacterStats();
    initializeStartingSpells(); // Update spells for new level

    if (typeof experienceManager !== 'undefined' && experienceManager.updateExperienceDisplay) {
        experienceManager.updateExperienceDisplay();
    }

    showGameMessage('Level up complete! Congratulations!', 'success');
}

/**
 * Validate that all level-up choices have been made
 */
function validateLevelUpChoices() {
    // Check hit point rolls
    for (const hpRoll of levelUpChoices.hitPointRolls) {
        if (!hpRoll.rolled) {
            return false;
        }
    }
    
    // Check ability score improvements
    if (levelUpChoices.abilityScoreImprovements > 0) {
        const checkedBoxes = document.querySelectorAll('input[name="ability-increase"]:checked');
        if (checkedBoxes.length !== 2 && checkedBoxes.length !== 0) {
            return false;
        }
    }
    
    return true;
}

/**
 * Apply level-up changes to character
 */
function applyLevelUpChanges() {
    const player = gameData.player;
    
    // Increase level
    player.level += levelUpChoices.pendingLevels;
    
    // Apply hit point increases
    let totalHPGain = 0;
    levelUpChoices.hitPointRolls.forEach(hpRoll => {
        totalHPGain += hpRoll.value;
    });
    
    player.maxHitPoints += totalHPGain;
    player.hitPoints += totalHPGain; // Fully heal on level up
    
    // Apply ability score improvements
    const checkedBoxes = document.querySelectorAll('input[name="ability-increase"]:checked');
    checkedBoxes.forEach(checkbox => {
        const ability = checkbox.value;
        player.abilities[ability] = Math.min(20, (player.abilities[ability] || 10) + 1);
    });
    
    // Update spell slots for new level
    updateSpellSlotsForLevel();
    
    // Apply class features (stored for display, implementation depends on specific features)
    player.classFeatures = player.classFeatures || [];
    player.classFeatures.push(...levelUpChoices.classFeatures);
}

/**
 * Reset level up choices
 */
function resetLevelUpChoices() {
    levelUpChoices.pendingLevels = 0;
    levelUpChoices.abilityScoreImprovements = 0;
    levelUpChoices.hitPointRolls = [];
    levelUpChoices.skillProficiencies = [];
    levelUpChoices.classFeatures = [];
}

/**
 * Get hit die size for character class
 */
function getHitDieForClass(characterClass) {
    const hitDice = {
        'barbarian': 12,
        'fighter': 10,
        'paladin': 10,
        'ranger': 10,
        'bard': 8,
        'cleric': 8,
        'druid': 8,
        'monk': 8,
        'rogue': 8,
        'warlock': 8,
        'sorcerer': 6,
        'wizard': 6
    };
    
    return hitDice[characterClass] || 8;
}

/**
 * Get class features for a specific level
 */
function getClassFeaturesForLevel(characterClass, level) {
    // Simplified class features - in a full implementation, this would be loaded from data files
    const classFeatures = {
        'wizard': {
            2: [{ name: 'Arcane Recovery', description: 'Recover spell slots during a short rest.' }],
            3: [{ name: 'Arcane Tradition', description: 'Choose your arcane tradition specialization.' }],
            4: [{ name: 'Cantrip Formulas', description: 'Learn additional cantrips.' }]
        },
        'fighter': {
            2: [{ name: 'Action Surge', description: 'Take an additional action on your turn.' }],
            3: [{ name: 'Martial Archetype', description: 'Choose your martial specialization.' }],
            4: [{ name: 'Extra Attack', description: 'Attack twice when you take the Attack action.' }]
        }
        // Add more classes as needed
    };
    
    return classFeatures[characterClass]?.[level] || [];
}

/**
 * Check if class gains skill proficiency at level
 */
function shouldGainSkillProficiency(characterClass, level) {
    // Most classes don't gain additional skill proficiencies, but some do
    const skillLevels = {
        'rogue': [1, 6], // Expertise levels
        'bard': [1, 3, 10] // Additional skill proficiencies
    };
    
    return skillLevels[characterClass]?.includes(level) || false;
}

/**
 * Choose feat instead of ability score improvement
 */
function chooseFeat() {
    showGameMessage('Feat selection system coming soon!', 'info');
}

/**
 * Show detailed level progression modal
 */
function showLevelProgressionModal() {
    if (typeof experienceManager === 'undefined') {
        console.error('Experience Manager not loaded');
        return;
    }

    const xpStats = experienceManager.getExperienceStats();
    const player = gameData.player;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
    modal.style.zIndex = '9999';

    const modalContent = document.createElement('div');
    modalContent.className = 'bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-600 shadow-2xl';

    // Level progression grid
    const levelGrid = generateLevelProgressionGrid();
    const abilityScoreInfo = generateAbilityScoreInfo();
    const experienceHistory = generateExperienceHistory();

    modalContent.innerHTML = `
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-center border-b border-gray-600 pb-4">
                <div>
                    <h2 class="font-cinzel text-3xl text-white mb-2">Character Progression</h2>
                    <p class="text-gray-400">Level ${player.level} • ${xpStats.totalExperience.toLocaleString()} Total Experience</p>
                </div>
                <button id="close-progression-modal" class="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>

            <!-- Current Level Stats -->
            <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="font-cinzel text-xl text-yellow-300 mb-3">Current Level Progress</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-white">${player.level}</div>
                        <div class="text-gray-400 text-sm">Current Level</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-400">${xpStats.experienceInCurrentLevel.toLocaleString()}</div>
                        <div class="text-gray-400 text-sm">XP in Current Level</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-400">+${xpStats.proficiencyBonus}</div>
                        <div class="text-gray-400 text-sm">Proficiency Bonus</div>
                    </div>
                </div>
                
                ${!xpStats.isMaxLevel ? `
                    <div class="mt-4">
                        <div class="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Progress to Level ${player.level + 1}</span>
                            <span>${xpStats.experienceToNextLevel.toLocaleString()} XP needed</span>
                        </div>
                        <div class="w-full h-3 bg-gray-700 rounded-full">
                            <div class="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-300" style="width: ${xpStats.progressPercent}%"></div>
                        </div>
                        <div class="text-center text-xs text-gray-500 mt-1">${xpStats.progressPercent.toFixed(1)}% complete</div>
                    </div>
                ` : `
                    <div class="mt-4 text-center">
                        <div class="text-yellow-300 font-bold text-lg">🏆 Maximum Level Reached!</div>
                        <div class="text-gray-400 text-sm">You have achieved the highest level possible</div>
                    </div>
                `}
            </div>

            <!-- Level Progression Grid -->
            <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="font-cinzel text-xl text-yellow-300 mb-3">Level Progression (1-20)</h3>
                ${levelGrid}
            </div>

            <!-- Ability Score Improvements -->
            ${abilityScoreInfo}

            <!-- Recent Experience Gains -->
            ${experienceHistory}
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal functionality
    document.getElementById('close-progression-modal').onclick = () => {
        document.body.removeChild(modal);
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

/**
 * Generate level progression grid
 */
function generateLevelProgressionGrid() {
    if (typeof experienceManager === 'undefined') return '';

    const player = gameData.player;
    let gridHTML = '<div class="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-10 gap-2">';

    for (let level = 1; level <= 20; level++) {
        const xpRequired = experienceManager.getExperienceForLevel(level);
        const proficiencyBonus = experienceManager.getProficiencyBonus(level);
        const isASI = experienceManager.isAbilityScoreImprovementLevel(level);
        const isCurrentLevel = level === player.level;
        const isAchieved = level <= player.level;

        let statusClasses = '';
        let statusIcon = '';
        
        if (isCurrentLevel) {
            statusClasses = 'bg-yellow-600 border-yellow-400 text-white';
            statusIcon = '⭐';
        } else if (isAchieved) {
            statusClasses = 'bg-green-700 border-green-500 text-white';
            statusIcon = '✓';
        } else {
            statusClasses = 'bg-gray-700 border-gray-600 text-gray-400';
            statusIcon = '';
        }

        gridHTML += `
            <div class="relative border-2 rounded-lg p-2 text-center ${statusClasses} transition-all duration-200 hover:scale-105 cursor-pointer"
                 title="Level ${level}${isASI ? ' (ASI)' : ''}&#10;XP Required: ${xpRequired.toLocaleString()}&#10;Proficiency: +${proficiencyBonus}">
                <div class="text-lg font-bold">${level}</div>
                <div class="text-xs">${statusIcon}</div>
                ${isASI ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" title="Ability Score Improvement"></div>' : ''}
            </div>
        `;
    }

    gridHTML += '</div>';
    return gridHTML;
}

/**
 * Generate ability score improvement information
 */
function generateAbilityScoreInfo() {
    if (typeof experienceManager === 'undefined') return '';

    const player = gameData.player;
    const currentLevel = player.level;
    const asiLevels = experienceManager.abilityScoreImprovementLevels;
    
    const completedASI = asiLevels.filter(level => level <= currentLevel);
    const nextASI = asiLevels.find(level => level > currentLevel);

    return `
        <div class="bg-gray-800 rounded-lg p-4">
            <h3 class="font-cinzel text-xl text-blue-300 mb-3">Ability Score Improvements</h3>
            <div class="space-y-2">
                <div class="text-sm text-gray-400">
                    Ability Score Improvements available at levels: ${asiLevels.join(', ')}
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div class="text-green-400 font-semibold">Completed ASI Levels:</div>
                        <div class="text-white">
                            ${completedASI.length > 0 ? completedASI.join(', ') : 'None yet'}
                        </div>
                    </div>
                    <div>
                        <div class="text-yellow-400 font-semibold">Next ASI Level:</div>
                        <div class="text-white">
                            ${nextASI ? `Level ${nextASI}` : 'All completed!'}
                        </div>
                    </div>
                </div>
                <div class="text-xs text-gray-500 mt-2">
                    Each ASI allows you to increase two ability scores by 1 each, or one ability score by 2 (max 20).
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate experience history
 */
function generateExperienceHistory() {
    if (typeof experienceManager === 'undefined') return '';

    const history = experienceManager.getExperienceHistory(10);
    
    if (history.length === 0) {
        return `
            <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="font-cinzel text-xl text-purple-300 mb-3">Recent Experience Gains</h3>
                <div class="text-gray-400 text-center py-4">
                    No recent experience gains to display
                </div>
            </div>
        `;
    }

    const historyHTML = history.map(entry => {
        const timeAgo = formatTimeAgo(entry.timestamp);
        const sourceColor = getSourceColor(entry.source);
        
        return `
            <div class="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                <div class="flex items-center space-x-3">
                    <div class="w-2 h-2 rounded-full ${sourceColor}"></div>
                    <div>
                        <div class="text-white font-semibold">+${entry.amount} XP</div>
                        <div class="text-xs text-gray-400">${capitalizeFirst(entry.source)}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-sm text-gray-300">${entry.newXP.toLocaleString()} XP</div>
                    <div class="text-xs text-gray-500">${timeAgo}</div>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="bg-gray-800 rounded-lg p-4">
            <h3 class="font-cinzel text-xl text-purple-300 mb-3">Recent Experience Gains</h3>
            <div class="space-y-1">
                ${historyHTML}
            </div>
        </div>
    `;
}

/**
 * Format timestamp to human readable "time ago"
 */
function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
}

/**
 * Get color class for experience source
 */
function getSourceColor(source) {
    const colorMap = {
        combat: 'bg-red-500',
        quest: 'bg-green-500',
        crafting: 'bg-blue-500',
        exploration: 'bg-yellow-500',
        character: 'bg-purple-500',
        debug: 'bg-gray-500'
    };
    
    return colorMap[source] || 'bg-gray-500';
}

/**
 * Add level progression button to character sheet
 */
function addLevelProgressionButton() {
    // Find the character sheet actions area and add the button
    const actionButton = `
        <button onclick="showLevelProgressionModal()" 
                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm">
            📈 Level Progression
        </button>
    `;
    
    // This will be integrated into the character sheet when it's rendered
    return actionButton;
}

// Export for global access
window.showLevelProgressionModal = showLevelProgressionModal;
window.addLevelProgressionButton = addLevelProgressionButton;

// Global test function for level up testing
window.testLevelUp = function() {
    console.log('🧪 Testing level up system...');
    
    if (!gameData || !gameData.player) {
        console.error('❌ Game data not available');
        return;
    }
    
    // Save current level for restoration
    const originalLevel = gameData.player.level;
    const originalXP = gameData.player.experience;
    
    console.log(`Current level: ${originalLevel}, XP: ${originalXP}`);
    
    // Give enough XP to level up
    const nextLevelXP = experienceManager.getExperienceForLevel(originalLevel + 1);
    gameData.player.experience = nextLevelXP;
    
    console.log(`Set XP to ${nextLevelXP} for level ${originalLevel + 1}`);
    
    // Trigger level up check
    checkForLevelUp();
    
    console.log('✅ Level up test triggered - check for modal');
};

console.log('Character Progression UI loaded');

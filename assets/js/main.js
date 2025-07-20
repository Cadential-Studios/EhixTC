// Edoria: The Triune Convergence - Main Game Script

// Game Data Structure
const gameData = {
    player: {
        origin: null,
        location: null,
        inventory: [],
        equipment: {
            head: null,
            neck: null,
            chest: null,
            mainhand: null,
            offhand: null,
            finger1: null,
            finger2: null,
            feet: null
        },
        quests: { active: [], completed: [] },
        lore: new Set(),
        rumors: new Set(),
        stats: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
        },
        derivedStats: {
            health: 20,
            maxHealth: 20,
            mana: 10,
            maxMana: 10,
            armorClass: 10,
            carryCapacity: 150
        },
        skills: {
            athletics: { proficient: false, expertise: false },
            acrobatics: { proficient: false, expertise: false },
            sleightOfHand: { proficient: false, expertise: false },
            stealth: { proficient: false, expertise: false },
            arcana: { proficient: false, expertise: false },
            history: { proficient: false, expertise: false },
            investigation: { proficient: false, expertise: false },
            nature: { proficient: false, expertise: false },
            religion: { proficient: false, expertise: false },
            animalHandling: { proficient: false, expertise: false },
            insight: { proficient: false, expertise: false },
            medicine: { proficient: false, expertise: false },
            perception: { proficient: false, expertise: false },
            survival: { proficient: false, expertise: false },
            deception: { proficient: false, expertise: false },
            intimidation: { proficient: false, expertise: false },
            performance: { proficient: false, expertise: false },
            persuasion: { proficient: false, expertise: false }
        },
        proficiencyBonus: 2,
        level: 1,
        experience: 0,
        experienceToNext: 300
    },
    time: {
        day: 1,
        month: 0,
        year: 998,
        months: ["Alphi", "Brenn", "Frutia", "Dorona", "Evorn", "Filik", "Grenn", "Halbar"],
        monthDescriptions: ["The Awakening", "The Growing", "The Zenith", "The Bounty", "The Waning", "The Reaping", "The Fading", "The Sleeping"]
    },
    moons: {
        edyria: { cycle: 15, phase: 0 },
        kapra: { cycle: 28, phase: 0 },
        enia: { cycle: 38, phase: 0 }
    },
    story: {
        currentScene: null,
        completedScenes: []
    },
    settings: {
        textSpeed: 1,
        volume: 1
    }
};

// Data Storage
let locationsData = {};
let scenesData = {};
let classesData = {};
let itemsData = {};
let questsData = {};
let monstersData = {};
let calendarData = {};

// Skills System Constants
const skillAbilityMap = {
    athletics: 'strength',
    acrobatics: 'dexterity',
    sleightOfHand: 'dexterity',
    stealth: 'dexterity',
    arcana: 'intelligence',
    history: 'intelligence',
    investigation: 'intelligence',
    nature: 'intelligence',
    religion: 'intelligence',
    animalHandling: 'wisdom',
    insight: 'wisdom',
    medicine: 'wisdom',
    perception: 'wisdom',
    survival: 'wisdom',
    deception: 'charisma',
    intimidation: 'charisma',
    performance: 'charisma',
    persuasion: 'charisma'
};

const skillDisplayNames = {
    athletics: 'Athletics',
    acrobatics: 'Acrobatics',
    sleightOfHand: 'Sleight of Hand',
    stealth: 'Stealth',
    arcana: 'Arcana',
    history: 'History',
    investigation: 'Investigation',
    nature: 'Nature',
    religion: 'Religion',
    animalHandling: 'Animal Handling',
    insight: 'Insight',
    medicine: 'Medicine',
    perception: 'Perception',
    survival: 'Survival',
    deception: 'Deception',
    intimidation: 'Intimidation',
    performance: 'Performance',
    persuasion: 'Persuasion'
};

// DOM Elements
const startScreen = document.getElementById('start-screen');
const characterCreationScreen = document.getElementById('character-creation-screen');
const gameScreen = document.getElementById('game-screen');
const startGameButton = document.getElementById('start-game-button');
const originChoices = document.querySelectorAll('#character-creation-screen .choice-button');
const mainContentEl = document.getElementById('main-content');
const dateEl = document.getElementById('current-date');
const monthDescEl = document.getElementById('month-description');
const moonEdyriaEl = document.getElementById('moon-edyria');
const moonKapraEl = document.getElementById('moon-kapra');
const moonEniaEl = document.getElementById('moon-enia');
const navButtons = document.querySelectorAll('.nav-icon');
const uiPanels = document.querySelectorAll('.ui-panel');
const closePanelButtons = document.querySelectorAll('.close-panel-btn');
const characterContentEl = document.getElementById('character-content');
const journalContentEl = document.getElementById('journal-content');
const inventoryContentEl = document.getElementById('inventory-content');
const settingsContent = document.getElementById('settings-content');

// Panel Management Functions
function openPanel(panelId) {
    // Close all panels first
    closeAllPanels();
    
    // Open the requested panel
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.style.display = 'block';
        panel.classList.add('open');
        
        // Populate panel content based on panel type
        switch (panelId) {
            case 'journal-panel':
                renderJournal();
                break;
            case 'character-panel':
                renderCharacterSheet();
                break;
            case 'inventory-panel':
                renderInventory();
                break;
            case 'settings-panel':
                renderSettings();
                break;
        }
    }
}

function closeAllPanels() {
    uiPanels.forEach(panel => {
        panel.style.display = 'none';
        panel.classList.remove('open');
    });
}

function updateDisplay() {
    // Update date display
    if (dateEl) {
        dateEl.textContent = `${gameData.time.months[gameData.time.month]} ${gameData.time.day}, ${gameData.time.year} PA`;
    }
    
    // Update month description
    if (monthDescEl) {
        monthDescEl.textContent = gameData.time.monthDescriptions[gameData.time.month];
    }
    
    // Update moon phases
    updateMoonPhases();
}

function updateMoonPhases() {
    // Calculate moon phases based on current day
    const edyriaPhase = (gameData.time.day + gameData.moons.edyria.phase) % gameData.moons.edyria.cycle;
    const kapraPhase = (gameData.time.day + gameData.moons.kapra.phase) % gameData.moons.kapra.cycle;
    const eniaPhase = (gameData.time.day + gameData.moons.enia.phase) % gameData.moons.enia.cycle;
    
    // Update visual representations
    updateMoonVisual(moonEdyriaEl, edyriaPhase, gameData.moons.edyria.cycle);
    updateMoonVisual(moonKapraEl, kapraPhase, gameData.moons.kapra.cycle);
    updateMoonVisual(moonEniaEl, eniaPhase, gameData.moons.enia.cycle);
}

function updateMoonVisual(moonEl, phase, cycle) {
    if (!moonEl) return;
    
    // Calculate moon fullness (0 = new moon, 1 = full moon)
    const fullness = Math.abs((phase - cycle/2) / (cycle/2));
    const opacity = 0.3 + (0.7 * (1 - fullness));
    
    moonEl.style.opacity = opacity;
    
    // Add full moon class if close to full
    if (fullness < 0.1) {
        moonEl.classList.add('full-moon');
    } else {
        moonEl.classList.remove('full-moon');
    }
}

// Hyperlink and Reference System
function processJournalText(text) {
    // Convert text references to clickable hyperlinks
    text = text.replace(/\b(Griefwood|Jorn|Westwalker|M'ra Kaal|Scholar|Leonin|Aethermoon|Verdamoon|Umbralmoon|Convergence)\b/g, 
        '<span class="journal-link text-blue-400 hover:text-blue-300 cursor-pointer underline decoration-dotted" onclick="showQuickReference(\'$1\')">$1</span>');
    
    // Convert character names to character sheet links
    text = text.replace(/\b(Keeper|Elder|Sage|Traveler)\b/g, 
        '<span class="character-link text-green-400 hover:text-green-300 cursor-pointer underline decoration-dotted" onclick="showCharacterReference(\'$1\')">$1</span>');
    
    // Convert item names to inventory links
    text = text.replace(/\b(sword|blade|staff|tome|potion|scroll|armor|shield)\b/gi, 
        '<span class="item-link text-yellow-400 hover:text-yellow-300 cursor-pointer underline decoration-dotted" onclick="showItemReference(\'$1\')">$1</span>');
    
    return text;
}

function showQuickReference(term) {
    const references = {
        'Griefwood': 'A mysterious forest at the edge of the Frontier, known for its ancient secrets and dangerous wildlife.',
        'Jorn': 'A frontier trading post where travelers gather to share news and trade goods.',
        'Westwalker': 'Hardy frontier folk who make their living on the edge of civilization.',
        'M\'ra Kaal': 'The proud Leonin clan known for their spiritual connection and warrior traditions.',
        'Scholar': 'Learned individuals who study the mysteries of magic and ancient lore.',
        'Leonin': 'Cat-like humanoids with strong tribal traditions and spiritual beliefs.',
        'Aethermoon': 'The blue moon that governs magic and mystical energies.',
        'Verdamoon': 'The green moon that influences nature and healing.',
        'Umbralmoon': 'The dark moon associated with shadows and hidden knowledge.',
        'Convergence': 'The rare astronomical event when all three moons align.'
    };
    
    showModal('Quick Reference', references[term] || 'No reference information available.');
}

function showCharacterReference(character) {
    // This would show character details in a modal
    showModal('Character: ' + character, 'Character details would be displayed here.');
}

function showItemReference(item) {
    // This would show item details in a modal
    showModal('Item: ' + item, 'Item details would be displayed here.');
}

function showModal(title, content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('quick-reference-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quick-reference-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
        modal.innerHTML = `
            <div class="bg-gray-900 border-2 border-gray-600 rounded-lg p-6 max-w-md mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 id="modal-title" class="font-cinzel text-xl text-white"></h3>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div id="modal-content" class="text-gray-300"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-content').textContent = content;
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('quick-reference-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Skills System Functions
function getAbilityModifier(ability) {
    const score = gameData.player.stats[ability] || 10;
    return Math.floor((score - 10) / 2);
}

function getSkillModifier(skillName) {
    const ability = skillAbilityMap[skillName];
    const abilityMod = getAbilityModifier(ability);
    const skill = gameData.player.skills[skillName];
    
    let proficiencyMod = 0;
    if (skill.proficient) {
        proficiencyMod = gameData.player.proficiencyBonus;
        if (skill.expertise) {
            proficiencyMod *= 2; // Expertise doubles proficiency bonus
        }
    }
    
    return abilityMod + proficiencyMod;
}

function getSkillBreakdown(skillName) {
    const ability = skillAbilityMap[skillName];
    const abilityMod = getAbilityModifier(ability);
    const skill = gameData.player.skills[skillName];
    
    let proficiencyMod = 0;
    if (skill.proficient) {
        proficiencyMod = gameData.player.proficiencyBonus;
        if (skill.expertise) {
            proficiencyMod *= 2;
        }
    }
    
    return {
        ability: ability,
        abilityModifier: abilityMod,
        proficiencyBonus: proficiencyMod,
        total: abilityMod + proficiencyMod,
        isProficient: skill.proficient,
        hasExpertise: skill.expertise
    };
}

function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
}

// Advanced Dice Rolling Engine
function rollDice(sides, count = 1) {
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    return rolls;
}

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
    const roll1 = rollD20();
    const roll2 = rollD20();
    return {
        roll1: roll1,
        roll2: roll2,
        result: Math.max(roll1, roll2),
        advantage: true
    };
}

function rollWithDisadvantage() {
    const roll1 = rollD20();
    const roll2 = rollD20();
    return {
        roll1: roll1,
        roll2: roll2,
        result: Math.min(roll1, roll2),
        disadvantage: true
    };
}

function performSkillCheck(skillName, dc = 15, advantage = false, disadvantage = false) {
    const skillMod = getSkillModifier(skillName);
    let rollResult;
    
    if (advantage) {
        rollResult = rollWithAdvantage();
    } else if (disadvantage) {
        rollResult = rollWithDisadvantage();
    } else {
        const roll = rollD20();
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

// Skill Check Integration
function triggerSkillCheck(skillName, dc, description, successCallback, failureCallback, advantage = false, disadvantage = false) {
    const rollData = performSkillCheck(skillName, dc, advantage, disadvantage);
    
    showDiceRoll(rollData, function(result) {
        if (result.success) {
            if (successCallback) successCallback(result);
        } else {
            if (failureCallback) failureCallback(result);
        }
    });
}

function addSkillCheckChoice(choicesArray, skillName, dc, text, successText, failureText, advantage = false, disadvantage = false) {
    const skillMod = getSkillModifier(skillName);
    const displayName = skillDisplayNames[skillName];
    const modifierStr = skillMod >= 0 ? `+${skillMod}` : `${skillMod}`;
    
    choicesArray.push({
        text: `${text} (${displayName} DC ${dc}, ${modifierStr})`,
        type: 'skill_check',
        skill: skillName,
        dc: dc,
        advantage: advantage,
        disadvantage: disadvantage,
        successText: successText,
        failureText: failureText
    });
}

function getSkillSuggestions(situation) {
    // Return contextual skill suggestions based on the situation
    const suggestions = {
        'combat': ['athletics', 'acrobatics', 'intimidation'],
        'social': ['persuasion', 'deception', 'insight', 'intimidation'],
        'exploration': ['survival', 'perception', 'investigation', 'nature'],
        'knowledge': ['arcana', 'history', 'religion', 'nature'],
        'stealth': ['stealth', 'sleightOfHand', 'perception'],
        'magic': ['arcana', 'investigation', 'religion']
    };
    
    return suggestions[situation] || [];
}

// Difficulty Class Constants
const DC = {
    TRIVIAL: 5,
    EASY: 10,
    MEDIUM: 15,
    HARD: 20,
    VERY_HARD: 25,
    NEARLY_IMPOSSIBLE: 30
};

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
                <button class="difficulty-btn w-full p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded" data-dc="${DC.MEDIUM}">Medium (DC ${DC.MEDIUM})</button>
                <button class="difficulty-btn w-full p-2 bg-orange-600 hover:bg-orange-700 text-white rounded" data-dc="${DC.HARD}">Hard (DC ${DC.HARD})</button>
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

// Equipment System Functions
function equipItem(itemId, slot = null) {
    const item = itemsData[itemId];
    if (!item) return false;
    
    // Determine slot if not specified
    if (!slot) {
        slot = item.slot;
    }
    
    // Handle special cases for rings
    if (slot === 'finger') {
        slot = gameData.player.equipment.finger1 ? 'finger2' : 'finger1';
    }
    
    // Check if slot is valid
    if (!gameData.player.equipment.hasOwnProperty(slot) || slot === 'none') {
        return false;
    }
    
    // Unequip current item in slot
    if (gameData.player.equipment[slot]) {
        unequipItem(slot);
    }
    
    // Equip new item
    gameData.player.equipment[slot] = itemId;
    
    // Remove from inventory
    const invIndex = gameData.player.inventory.findIndex(invItem => 
        typeof invItem === 'string' ? invItem === itemId : invItem.id === itemId
    );
    if (invIndex !== -1) {
        gameData.player.inventory.splice(invIndex, 1);
    }
    
    // Recalculate stats
    recalculateStats();
    
    return true;
}

function unequipItem(slot) {
    const itemId = gameData.player.equipment[slot];
    if (!itemId) return false;
    
    // Add to inventory
    gameData.player.inventory.push(itemId);
    
    // Remove from equipment
    gameData.player.equipment[slot] = null;
    
    // Recalculate stats
    recalculateStats();
    
    return true;
}

function useConsumableItem(itemId) {
    const item = itemsData[itemId];
    if (!item || item.type !== 'consumable') return false;
    
    // Find item in inventory
    const invIndex = gameData.player.inventory.findIndex(invItem => {
        if (typeof invItem === 'string') return invItem === itemId;
        return invItem.id === itemId && invItem.uses > 0;
    });
    
    if (invIndex === -1) return false;
    
    // Apply item effect
    applyItemEffect(item.effect);
    
    // Handle item usage
    const invItem = gameData.player.inventory[invIndex];
    if (typeof invItem === 'string') {
        // Single use item
        if (item.uses === 1) {
            gameData.player.inventory.splice(invIndex, 1);
        } else {
            // Convert to object with uses
            gameData.player.inventory[invIndex] = {
                id: itemId,
                uses: item.uses - 1
            };
        }
    } else {
        // Multi-use item object
        invItem.uses--;
        if (invItem.uses <= 0) {
            gameData.player.inventory.splice(invIndex, 1);
        }
    }
    
    return true;
}

function applyItemEffect(effect) {
    if (!effect) return;
    
    const [effectType, value] = effect.split(':');
    
    switch (effectType) {
        case 'heal':
            const healAmount = rollDicePool(value).total;
            gameData.player.derivedStats.health = Math.min(
                gameData.player.derivedStats.maxHealth,
                gameData.player.derivedStats.health + healAmount
            );
            showFloatingText(`+${healAmount} Health`, 'green');
            break;
            
        case 'restore_mana':
            const manaAmount = rollDicePool(value).total;
            gameData.player.derivedStats.mana = Math.min(
                gameData.player.derivedStats.maxMana,
                gameData.player.derivedStats.mana + manaAmount
            );
            showFloatingText(`+${manaAmount} Mana`, 'blue');
            break;
            
        case 'sustenance':
            showFloatingText('You Feel Nourished', 'yellow');
            break;
            
        case 'cast_spell':
            showFloatingText(`Cast ${value}!`, 'purple');
            break;
    }
}

function recalculateStats() {
    // Base stats from character origin
    let totalStats = { ...gameData.player.stats };
    let totalAC = 10 + getAbilityModifier('dexterity');
    
    // Apply equipment bonuses
    Object.values(gameData.player.equipment).forEach(itemId => {
        if (!itemId) return;
        const item = itemsData[itemId];
        if (!item) return;
        
        // Apply stat bonuses
        if (item.statBonus) {
            Object.entries(item.statBonus).forEach(([stat, bonus]) => {
                if (totalStats[stat]) {
                    totalStats[stat] += bonus;
                }
            });
        }
        
        // Apply armor class
        if (item.armorClass) {
            if (item.type === 'armor' && (item.subtype === 'light' || item.subtype === 'medium' || item.subtype === 'heavy' || item.subtype === 'clothing')) {
                // Base armor replaces base AC
                totalAC = item.armorClass + (item.maxDexMod !== null ? Math.min(getAbilityModifier('dexterity'), item.maxDexMod) : getAbilityModifier('dexterity'));
            } else {
                // Shields and other items add to AC
                totalAC += item.armorClass;
            }
        }
    });
    
    // Update derived stats
    gameData.player.derivedStats.armorClass = totalAC;
    gameData.player.derivedStats.maxHealth = 20 + (getAbilityModifier('constitution') * gameData.player.level);
    gameData.player.derivedStats.maxMana = 10 + (getAbilityModifier('intelligence') * gameData.player.level);
    gameData.player.derivedStats.carryCapacity = 150 + (getAbilityModifier('strength') * 15);
    
    // Ensure current health/mana don't exceed maximums
    gameData.player.derivedStats.health = Math.min(gameData.player.derivedStats.health, gameData.player.derivedStats.maxHealth);
    gameData.player.derivedStats.mana = Math.min(gameData.player.derivedStats.mana, gameData.player.derivedStats.maxMana);
}

function getTotalWeight() {
    let weight = 0;
    
    // Inventory weight
    gameData.player.inventory.forEach(item => {
        const itemId = typeof item === 'string' ? item : item.id;
        const itemData = itemsData[itemId];
        if (itemData) {
            const quantity = typeof item === 'string' ? 1 : (item.quantity || 1);
            weight += (itemData.weight || 0) * quantity;
        }
    });
    
    // Equipment weight
    Object.values(gameData.player.equipment).forEach(itemId => {
        if (itemId) {
            const item = itemsData[itemId];
            if (item) {
                weight += item.weight || 0;
            }
        }
    });
    
    return weight;
}

function showFloatingText(text, color = 'white') {
    // Create floating text element
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.className = `fixed z-50 pointer-events-none font-bold text-lg animate-bounce`;
    floatingText.style.color = color;
    floatingText.style.left = '50%';
    floatingText.style.top = '50%';
    floatingText.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(floatingText);
    
    // Remove after animation
    setTimeout(() => {
        if (floatingText.parentNode) {
            floatingText.parentNode.removeChild(floatingText);
        }
    }, 2000);
}

// Dice Rolling UI and Animations
function showDiceRoll(rollData, callback) {
    // Create dice roll modal
    let diceModal = document.getElementById('dice-roll-modal');
    if (!diceModal) {
        diceModal = document.createElement('div');
        diceModal.id = 'dice-roll-modal';
        diceModal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden';
        diceModal.innerHTML = `
            <div class="bg-gray-900 border-2 border-gray-600 rounded-lg p-8 max-w-lg mx-4 text-center">
                <h3 id="dice-modal-title" class="font-cinzel text-2xl text-white mb-4"></h3>
                <div id="dice-animation-area" class="mb-6 h-32 flex items-center justify-center">
                    <div id="dice-display" class="text-6xl font-bold text-white">
                        🎲
                    </div>
                </div>
                <div id="dice-breakdown" class="text-gray-300 mb-4"></div>
                <div id="dice-result" class="text-2xl font-bold mb-4"></div>
                <button id="dice-continue-btn" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-cinzel">
                    Continue
                </button>
            </div>
        `;
        document.body.appendChild(diceModal);
    }
    
    // Set up the roll display
    const titleEl = document.getElementById('dice-modal-title');
    const diceDisplay = document.getElementById('dice-display');
    const breakdownEl = document.getElementById('dice-breakdown');
    const resultEl = document.getElementById('dice-result');
    const continueBtn = document.getElementById('dice-continue-btn');
    
    titleEl.textContent = `${skillDisplayNames[rollData.skill]} Check (DC ${rollData.dc})`;
    
    // Show modal
    diceModal.classList.remove('hidden');
    
    // Animate dice rolling
    let rollCount = 0;
    const maxRolls = 10;
    const rollInterval = setInterval(() => {
        diceDisplay.textContent = Math.floor(Math.random() * 20) + 1;
        rollCount++;
        
        if (rollCount >= maxRolls) {
            clearInterval(rollInterval);
            showFinalResult();
        }
    }, 100);
    
    function showFinalResult() {
        // Start with the raw roll result
        let currentValue = rollData.rollResult.result;
        let step = 0;
        
        // Define animation steps
        const animationSteps = [];
        
        // Step 1: Show the raw roll
        animationSteps.push({
            value: currentValue,
            description: `Roll: ${currentValue}`,
            isRoll: true
        });
        
        // Step 2: Add ability modifier if it exists
        const breakdown = rollData.breakdown;
        if (breakdown.abilityModifier !== 0) {
            currentValue += breakdown.abilityModifier;
            animationSteps.push({
                value: currentValue,
                description: `+ ${breakdown.ability.charAt(0).toUpperCase() + breakdown.ability.slice(1)} (${breakdown.abilityModifier >= 0 ? '+' : ''}${breakdown.abilityModifier})`,
                modifier: breakdown.abilityModifier
            });
        }
        
        // Step 3: Add proficiency bonus if proficient
        if (breakdown.isProficient) {
            currentValue += breakdown.proficiencyBonus;
            animationSteps.push({
                value: currentValue,
                description: `+ Proficiency${breakdown.hasExpertise ? ' (Expertise)' : ''} (+${breakdown.proficiencyBonus})`,
                modifier: breakdown.proficiencyBonus
            });
        }
        
        // Animate through each step
        function animateStep() {
            if (step >= animationSteps.length) {
                // Animation complete - show final result
                showFinalDisplay();
                return;
            }
            
            const currentStep = animationSteps[step];
            
            // Update the main display with smooth color transition
            let colorClass = 'text-white';
            if (step === 0) {
                // Roll step - check for criticals
                if (rollData.critical) colorClass = 'text-green-400';
                else if (rollData.criticalFailure) colorClass = 'text-red-400';
            }
            
            // Handle advantage/disadvantage for the roll step
            if (step === 0 && (rollData.advantage || rollData.disadvantage)) {
                diceDisplay.innerHTML = `
                    <div class="dice-animation-transition">
                        <div class="flex space-x-4 items-center justify-center">
                            <span class="text-4xl ${rollData.rollResult.roll1 === rollData.rollResult.result ? 'text-green-400' : 'text-gray-500'}">${rollData.rollResult.roll1}</span>
                            <span class="text-2xl text-gray-400">/</span>
                            <span class="text-4xl ${rollData.rollResult.roll2 === rollData.rollResult.result ? 'text-green-400' : 'text-gray-500'}">${rollData.rollResult.roll2}</span>
                        </div>
                        <div class="text-sm mt-2 ${rollData.advantage ? 'text-green-400' : 'text-red-400'}">
                            ${rollData.advantage ? 'Advantage' : 'Disadvantage'}
                        </div>
                    </div>
                `;
            } else {
                diceDisplay.innerHTML = `<span class="dice-animation-transition ${colorClass}">${currentStep.value}</span>`;
            }
            
            // Update breakdown to show current step
            let breakdownHTML = '<div class="text-sm space-y-1">';
            for (let i = 0; i <= step; i++) {
                const stepData = animationSteps[i];
                const isCurrentStep = i === step;
                const stepClass = isCurrentStep ? 'text-yellow-400 font-bold modifier-slide-in' : 'text-gray-300';
                
                if (stepData.isRoll) {
                    breakdownHTML += `<div class="${stepClass}">${stepData.description}</div>`;
                } else {
                    breakdownHTML += `<div class="${stepClass} ${isCurrentStep ? 'modifier-highlight' : ''}">${stepData.description}</div>`;
                }
            }
            
            // Show running total if not the first step
            if (step > 0) {
                breakdownHTML += `<div class="border-t border-gray-600 pt-1 mt-2">
                    <div class="text-yellow-400 font-bold">Running Total: ${currentStep.value}</div>
                </div>`;
            }
            
            breakdownHTML += '</div>';
            breakdownEl.innerHTML = breakdownHTML;
            
            step++;
            setTimeout(animateStep, 750); // 0.75 second delay between steps
        }
        
        function showFinalDisplay() {
            // Show final result with emphasis
            let colorClass = 'text-white';
            if (rollData.critical) colorClass = 'text-green-400';
            else if (rollData.criticalFailure) colorClass = 'text-red-400';
            
            diceDisplay.innerHTML = `<span class="dice-final-result ${colorClass}">${rollData.total}</span>`;
            
            // Show complete breakdown
            breakdownEl.innerHTML = `
                <div class="text-sm space-y-1">
                    <div>Roll: ${rollData.rollResult.result}</div>
                    <div>${breakdown.ability.charAt(0).toUpperCase() + breakdown.ability.slice(1)} Modifier: ${breakdown.abilityModifier >= 0 ? '+' : ''}${breakdown.abilityModifier}</div>
                    ${breakdown.isProficient ? `<div>Proficiency${breakdown.hasExpertise ? ' (Expertise)' : ''}: +${breakdown.proficiencyBonus}</div>` : ''}
                    <div class="border-t border-gray-600 pt-1 font-bold text-yellow-400">Final Total: ${rollData.total}</div>
                </div>
            `;
            
            // Show success/failure result
            let resultText = rollData.success ? 'Success!' : 'Failure';
            let resultClass = rollData.success ? 'text-green-400' : 'text-red-400';
            
            if (rollData.critical) {
                resultText = 'Critical Success!';
                resultClass = 'text-green-400';
            } else if (rollData.criticalFailure) {
                resultText = 'Critical Failure!';
                resultClass = 'text-red-400';
            }
            
            resultEl.innerHTML = `<span class="${resultClass} result-pulse">${resultText}</span>`;
        }
        
        // Start the animation
        animateStep();
    }
    
    // Handle continue button
    continueBtn.onclick = function() {
        diceModal.classList.add('hidden');
        if (callback) callback(rollData);
    };
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Close modal when clicking on the backdrop
document.addEventListener('click', function(e) {
    const modal = document.getElementById('quick-reference-modal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

// Panel Content Rendering Functions
function renderJournal(activeTab = 'all') {
    if (!journalContentEl) return;
    
    let content = '<div class="journal-container">';
    
    // Tab Navigation
    content += `
        <div class="journal-tabs mb-6">
            <div class="flex space-x-1 bg-gray-800 rounded-lg p-1">
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('all')">All</button>
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'quests' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('quests')">Quests</button>
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'lore' ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('lore')">Lore</button>
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'rumors' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('rumors')">Rumors</button>
            </div>
        </div>
    `;
    
    // Search Bar
    content += `
        <div class="journal-search mb-6">
            <input type="text" id="journal-search-input" placeholder="Search journal entries..." 
                   class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                   oninput="filterJournalEntries(this.value)">
        </div>
    `;
    
    content += '<div id="journal-entries" class="space-y-6">';
    
    // Show content based on active tab
    if (activeTab === 'all' || activeTab === 'quests') {
        // Active Quests Section
        if (gameData.player.quests.active.length > 0) {
            content += '<div class="journal-section quest-section">';
            content += '<h3 class="font-cinzel text-xl text-blue-300 mb-3 border-b border-blue-300 pb-1">Active Quests</h3>';
            gameData.player.quests.active.forEach((quest, index) => {
                const processedQuest = processJournalText(quest);
                content += `<div class="quest-entry journal-entry p-3 bg-blue-900 bg-opacity-20 rounded border-l-4 border-blue-300 mb-2" data-index="${index}" data-type="quest">
                    <p class="text-blue-100">${processedQuest}</p>
                    <div class="entry-actions mt-2">
                        <button class="bookmark-btn text-yellow-400 hover:text-yellow-300 text-sm" onclick="toggleBookmark('quest', ${index})">
                            <span class="bookmark-icon">${gameData.player.bookmarks && gameData.player.bookmarks.includes('quest-' + index) ? '★' : '☆'}</span> Bookmark
                        </button>
                    </div>
                </div>`;
            });
            content += '</div>';
        }
        
        // Completed Quests Section
        if (gameData.player.quests.completed.length > 0) {
            content += '<div class="journal-section quest-section">';
            content += '<h3 class="font-cinzel text-xl text-green-300 mb-3 border-b border-green-300 pb-1">Completed Quests</h3>';
            gameData.player.quests.completed.forEach((quest, index) => {
                const processedQuest = processJournalText(quest);
                content += `<div class="quest-entry journal-entry p-3 bg-green-900 bg-opacity-20 rounded border-l-4 border-green-300 mb-2" data-index="${index}" data-type="completed-quest">
                    <p class="text-green-100">${processedQuest}</p>
                    <div class="entry-actions mt-2">
                        <button class="bookmark-btn text-yellow-400 hover:text-yellow-300 text-sm" onclick="toggleBookmark('completed-quest', ${index})">
                            <span class="bookmark-icon">${gameData.player.bookmarks && gameData.player.bookmarks.includes('completed-quest-' + index) ? '★' : '☆'}</span> Bookmark
                        </button>
                    </div>
                </div>`;
            });
            content += '</div>';
        }
    }
    
    if (activeTab === 'all' || activeTab === 'lore') {
        // Lore Section
        if (gameData.player.lore.size > 0) {
            content += '<div class="journal-section lore-section">';
            content += '<h3 class="font-cinzel text-xl text-yellow-300 mb-3 border-b border-yellow-300 pb-1">Lore & Knowledge</h3>';
            Array.from(gameData.player.lore).forEach((lore, index) => {
                const processedLore = processJournalText(lore);
                content += `<div class="lore-entry journal-entry p-3 bg-yellow-900 bg-opacity-20 rounded border-l-4 border-yellow-300 mb-2" data-index="${index}" data-type="lore">
                    <p class="text-yellow-100">${processedLore}</p>
                    <div class="entry-actions mt-2">
                        <button class="bookmark-btn text-yellow-400 hover:text-yellow-300 text-sm" onclick="toggleBookmark('lore', ${index})">
                            <span class="bookmark-icon">${gameData.player.bookmarks && gameData.player.bookmarks.includes('lore-' + index) ? '★' : '☆'}</span> Bookmark
                        </button>
                    </div>
                </div>`;
            });
            content += '</div>';
        }
    }
    
    if (activeTab === 'all' || activeTab === 'rumors') {
        // Rumors Section
        if (gameData.player.rumors.size > 0) {
            content += '<div class="journal-section rumor-section">';
            content += '<h3 class="font-cinzel text-xl text-purple-300 mb-3 border-b border-purple-300 pb-1">Rumors & Whispers</h3>';
            Array.from(gameData.player.rumors).forEach((rumor, index) => {
                const processedRumor = processJournalText(rumor);
                content += `<div class="rumor-entry journal-entry p-3 bg-purple-900 bg-opacity-20 rounded border-l-4 border-purple-300 mb-2" data-index="${index}" data-type="rumor">
                    <p class="text-purple-100">${processedRumor}</p>
                    <div class="entry-actions mt-2">
                        <button class="bookmark-btn text-yellow-400 hover:text-yellow-300 text-sm" onclick="toggleBookmark('rumor', ${index})">
                            <span class="bookmark-icon">${gameData.player.bookmarks && gameData.player.bookmarks.includes('rumor-' + index) ? '★' : '☆'}</span> Bookmark
                        </button>
                    </div>
                </div>`;
            });
            content += '</div>';
        }
    }
    
    // Show bookmarks section if we have any
    if (gameData.player.bookmarks && gameData.player.bookmarks.length > 0 && activeTab === 'all') {
        content += `
            <div class="journal-section bookmarks-section">
                <h3 class="font-cinzel text-xl text-yellow-300 mb-3 border-b border-yellow-300 pb-1">⭐ Bookmarked Entries</h3>
                <div class="text-sm text-gray-400 mb-2">Click on any bookmarked entry below to quickly jump to it</div>
                <div class="bookmarks-list space-y-2">
                    ${gameData.player.bookmarks.map(bookmark => {
                        const [type, index] = bookmark.split('-');
                        let entry, color;
                        if (type === 'quest') {
                            entry = gameData.player.quests.active[index];
                            color = 'text-blue-300';
                        } else if (type === 'completed-quest') {
                            entry = gameData.player.quests.completed[index];
                            color = 'text-green-300';
                        } else if (type === 'lore') {
                            entry = Array.from(gameData.player.lore)[index];
                            color = 'text-yellow-300';
                        } else if (type === 'rumor') {
                            entry = Array.from(gameData.player.rumors)[index];
                            color = 'text-purple-300';
                        }
                        return `<div class="bookmark-item p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700 ${color}" onclick="scrollToEntry('${type}', ${index})">
                            <span class="text-yellow-400">★</span> ${entry ? entry.substring(0, 80) + (entry.length > 80 ? '...' : '') : 'Entry not found'}
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    if ((activeTab === 'all' && gameData.player.quests.active.length === 0 && gameData.player.quests.completed.length === 0 && 
        gameData.player.lore.size === 0 && gameData.player.rumors.size === 0) ||
        (activeTab === 'quests' && gameData.player.quests.active.length === 0 && gameData.player.quests.completed.length === 0) ||
        (activeTab === 'lore' && gameData.player.lore.size === 0) ||
        (activeTab === 'rumors' && gameData.player.rumors.size === 0)) {
        content += '<p class="text-gray-400 text-center py-8">No entries found for this category. Begin your adventure to discover quests, lore, and secrets.</p>';
    }
    
    content += '</div></div>';
    journalContentEl.innerHTML = content;
}

// Journal Navigation Functions
function toggleBookmark(type, index) {
    if (!gameData.player.bookmarks) {
        gameData.player.bookmarks = [];
    }
    
    const bookmarkId = `${type}-${index}`;
    const bookmarkIndex = gameData.player.bookmarks.indexOf(bookmarkId);
    
    if (bookmarkIndex > -1) {
        gameData.player.bookmarks.splice(bookmarkIndex, 1);
    } else {
        gameData.player.bookmarks.push(bookmarkId);
    }
    
    // Re-render the journal to update bookmark icons
    renderJournal();
}

function scrollToEntry(type, index) {
    const entries = document.querySelectorAll(`[data-type="${type}"][data-index="${index}"]`);
    if (entries.length > 0) {
        entries[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        entries[0].style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
        setTimeout(() => {
            entries[0].style.boxShadow = '';
        }, 2000);
    }
}

function filterJournalEntries(searchTerm) {
    const entries = document.querySelectorAll('.journal-entry');
    const sections = document.querySelectorAll('.journal-section');
    
    if (!searchTerm.trim()) {
        // Show all entries and sections
        entries.forEach(entry => entry.style.display = 'block');
        sections.forEach(section => section.style.display = 'block');
        return;
    }
    
    const term = searchTerm.toLowerCase();
    let hasVisibleEntries = false;
    
    sections.forEach(section => {
        let sectionHasVisible = false;
        const sectionEntries = section.querySelectorAll('.journal-entry');
        
        sectionEntries.forEach(entry => {
            const text = entry.textContent.toLowerCase();
            if (text.includes(term)) {
                entry.style.display = 'block';
                sectionHasVisible = true;
                hasVisibleEntries = true;
            } else {
                entry.style.display = 'none';
            }
        });
        
        section.style.display = sectionHasVisible ? 'block' : 'none';
    });
    
    // Show "no results" message if nothing found
    let noResultsMsg = document.getElementById('no-search-results');
    if (!hasVisibleEntries) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'no-search-results';
            noResultsMsg.className = 'text-gray-400 text-center py-8';
            noResultsMsg.textContent = `No entries found matching "${searchTerm}"`;
            document.getElementById('journal-entries').appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

function renderCharacterSheet() {
    if (!characterContentEl || !gameData.player.origin) return;
    
    const originData = classesData[gameData.player.origin];
    if (!originData) return;
    
    let content = `
        <div class="character-sheet space-y-8 max-w-6xl mx-auto">
            <!-- Character Header -->
            <div class="character-header bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-600">
                <div class="flex flex-col lg:flex-row items-center gap-6">
                    <!-- Character Portrait Placeholder -->
                    <div class="character-portrait w-32 h-32 bg-gray-700 rounded-full border-4 border-gray-500 flex items-center justify-center">
                        <div class="text-4xl text-gray-400">
                            ${gameData.player.origin === 'westwalker' ? '🏹' : 
                              gameData.player.origin === 'leonin' ? '🦁' : '📚'}
                        </div>
                    </div>
                    
                    <!-- Character Info -->
                    <div class="character-info text-center lg:text-left flex-grow">
                        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                            <div>
                                <h3 class="font-cinzel text-3xl text-white mb-2">${originData.name}</h3>
                                <div class="flex items-center gap-4 text-sm text-gray-400 mb-2">
                                    <span>Level ${gameData.player.level}</span>
                                    <span>•</span>
                                    <span>${gameData.player.experience}/${gameData.player.experienceToNext} XP</span>
                                </div>
                            </div>
                            
                            <!-- Experience Progress Bar -->
                            <div class="experience-bar w-full lg:w-64 mt-2 lg:mt-0">
                                <div class="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Experience</span>
                                    <span>${Math.round((gameData.player.experience / gameData.player.experienceToNext) * 100)}%</span>
                                </div>
                                <div class="w-full bg-gray-700 rounded-full h-2">
                                    <div class="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500" style="width: ${(gameData.player.experience / gameData.player.experienceToNext) * 100}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <p class="text-gray-300 text-lg mb-4">${originData.description}</p>
                        
                        <!-- Quick Stats Bar -->
                        <div class="quick-stats grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            <div class="stat-quick bg-red-900 bg-opacity-50 rounded p-3 text-center">
                                <div class="text-red-400 text-sm font-semibold">Health</div>
                                <div class="text-white text-xl font-bold">${gameData.player.derivedStats.health}/${gameData.player.derivedStats.maxHealth}</div>
                                <div class="w-full bg-red-900 rounded-full h-1 mt-1">
                                    <div class="bg-red-500 h-1 rounded-full transition-all duration-300" style="width: ${(gameData.player.derivedStats.health / gameData.player.derivedStats.maxHealth) * 100}%"></div>
                                </div>
                            </div>
                            
                            <div class="stat-quick bg-blue-900 bg-opacity-50 rounded p-3 text-center">
                                <div class="text-blue-400 text-sm font-semibold">Mana</div>
                                <div class="text-white text-xl font-bold">${gameData.player.derivedStats.mana}/${gameData.player.derivedStats.maxMana}</div>
                                <div class="w-full bg-blue-900 rounded-full h-1 mt-1">
                                    <div class="bg-blue-500 h-1 rounded-full transition-all duration-300" style="width: ${(gameData.player.derivedStats.mana / gameData.player.derivedStats.maxMana) * 100}%"></div>
                                </div>
                            </div>
                            
                            <div class="stat-quick bg-green-900 bg-opacity-50 rounded p-3 text-center">
                                <div class="text-green-400 text-sm font-semibold">Armor Class</div>
                                <div class="text-white text-xl font-bold">${gameData.player.derivedStats.armorClass}</div>
                                <div class="text-green-300 text-xs mt-1">Defense</div>
                            </div>
                            
                            <div class="stat-quick bg-yellow-900 bg-opacity-50 rounded p-3 text-center">
                                <div class="text-yellow-400 text-sm font-semibold">Carry Load</div>
                                <div class="text-white text-lg font-bold">${getTotalWeight()}/${gameData.player.derivedStats.carryCapacity}</div>
                                <div class="text-yellow-300 text-xs mt-1">lbs</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Main Content Grid -->
            <div class="character-content grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <!-- Left Column -->
                <div class="left-column space-y-6">
                    <!-- Core Attributes -->
                    <div class="stats-section bg-gray-800 rounded-lg p-6 border border-gray-600">
                        <h4 class="font-cinzel text-xl text-white mb-4 flex items-center gap-2">
                            <span class="text-blue-400">⚡</span> Core Attributes
                        </h4>
                        <div class="grid grid-cols-2 gap-4">
    `;
    
    // Enhanced Stats Display
    Object.entries(gameData.player.stats).forEach(([stat, value]) => {
        const statName = capitalizeFirst(stat);
        const modifier = Math.floor((value - 10) / 2);
        const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
        
        // Color coding based on modifier value
        let modifierColor = 'text-gray-400';
        if (modifier >= 3) modifierColor = 'text-green-400';
        else if (modifier >= 1) modifierColor = 'text-blue-400';
        else if (modifier < 0) modifierColor = 'text-red-400';
        
        content += `
            <div class="stat-block bg-gray-900 rounded-lg p-4 text-center border border-gray-700 hover:border-gray-500 transition-colors">
                <div class="stat-name text-gray-300 text-sm font-semibold mb-1">${statName}</div>
                <div class="stat-value text-white text-2xl font-bold mb-1">${value}</div>
                <div class="stat-modifier ${modifierColor} text-sm font-medium">(${modifierStr})</div>
                <div class="stat-bar w-full bg-gray-700 rounded-full h-1 mt-2">
                    <div class="bg-blue-500 h-1 rounded-full transition-all duration-300" style="width: ${Math.min((value / 20) * 100, 100)}%"></div>
                </div>
            </div>
        `;
    });
    
    content += `
                        </div>
                    </div>
                    
                    <!-- Combat Statistics -->
                    <div class="combat-stats bg-gray-800 rounded-lg p-6 border border-gray-600">
                        <h4 class="font-cinzel text-xl text-white mb-4 flex items-center gap-2">
                            <span class="text-red-400">⚔️</span> Combat Statistics
                        </h4>
                        <div class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="combat-stat bg-gray-900 rounded p-3 text-center">
                                    <div class="text-gray-300 text-sm">Initiative</div>
                                    <div class="text-white text-lg font-bold">+${Math.floor((gameData.player.stats.dexterity - 10) / 2)}</div>
                                </div>
                                
                                <div class="combat-stat bg-gray-900 rounded p-3 text-center">
                                    <div class="text-gray-300 text-sm">Speed</div>
                                    <div class="text-white text-lg font-bold">30 ft</div>
                                </div>
                                
                                <div class="combat-stat bg-gray-900 rounded p-3 text-center">
                                    <div class="text-gray-300 text-sm">Prof. Bonus</div>
                                    <div class="text-green-400 text-lg font-bold">+${gameData.player.proficiencyBonus}</div>
                                </div>
                                
                                <div class="combat-stat bg-gray-900 rounded p-3 text-center">
                                    <div class="text-gray-300 text-sm">Passive Perception</div>
                                    <div class="text-white text-lg font-bold">${10 + getSkillModifier('perception')}</div>
                                </div>
                            </div>
                            
                            <!-- Saving Throws -->
                            <div class="saving-throws">
                                <h5 class="text-white font-semibold mb-2">Saving Throws</h5>
                                <div class="grid grid-cols-2 gap-2">
    `;
    
    Object.entries(gameData.player.stats).forEach(([stat, value]) => {
        const modifier = Math.floor((value - 10) / 2);
        const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
        const statName = capitalizeFirst(stat).substring(0, 3);
        
        content += `
                                    <div class="save-stat flex justify-between items-center bg-gray-900 rounded px-3 py-2">
                                        <span class="text-gray-300 text-sm">${statName}</span>
                                        <span class="text-white font-mono">${modifierStr}</span>
                                    </div>
        `;
    });
    
    content += `
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Right Column -->
                <div class="right-column space-y-6">
                    <!-- Equipment Effects -->
                    <div class="equipment-effects bg-gray-800 rounded-lg p-6 border border-gray-600">
                        <h4 class="font-cinzel text-xl text-white mb-4 flex items-center gap-2">
                            <span class="text-yellow-400">🛡️</span> Equipment Effects
                        </h4>
                        <div class="space-y-3">
    `;
    
    // Enhanced Equipment Effects Display
    let hasEquipment = false;
    Object.entries(gameData.player.equipment).forEach(([slot, itemId]) => {
        if (itemId) {
            hasEquipment = true;
            const item = itemsData[itemId];
            const slotName = capitalizeFirst(slot);
            const rarityColor = item.rarity ? getRarityColor(item.rarity) : 'gray-400';
            
            content += `
                <div class="equipment-effect bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-${rarityColor} transition-colors">
                    <div class="flex justify-between items-start">
                        <div class="flex-grow">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="text-lg">${getItemIcon(item)}</span>
                                <div class="text-white font-semibold">${item.name}</div>
                                ${item.rarity ? `<span class="text-${rarityColor} text-xs px-2 py-1 bg-gray-800 rounded">${capitalizeFirst(item.rarity)}</span>` : ''}
                            </div>
                            <div class="text-gray-400 text-sm mb-2">${slotName} Slot</div>
                            ${item.description ? `<div class="text-gray-400 text-xs italic">"${item.description}"</div>` : ''}
                        </div>
                        
                        <div class="text-right ml-4">
            `;
            
            if (item.statBonus) {
                Object.entries(item.statBonus).forEach(([stat, bonus]) => {
                    content += `<div class="text-green-400 text-sm">+${bonus} ${capitalizeFirst(stat)}</div>`;
                });
            }
            
            if (item.armor || item.armorClass) {
                const ac = item.armor || item.armorClass;
                content += `<div class="text-blue-400 text-sm">+${ac} AC</div>`;
            }
            
            if (item.damage) {
                content += `<div class="text-red-400 text-sm">${item.damage} DMG</div>`;
            }
            
            if (item.effect) {
                content += `<div class="text-purple-400 text-sm">Special</div>`;
            }
            
            content += `
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    if (!hasEquipment) {
        content += `
            <div class="text-gray-400 text-center py-8 bg-gray-900 rounded-lg border border-gray-700">
                <div class="text-4xl mb-2">🎒</div>
                <div>No equipment currently worn</div>
                <div class="text-sm mt-1">Visit the inventory to equip items</div>
            </div>
        `;
    }
    
    content += `
                        </div>
                    </div>
                    
                    <!-- Character Background -->
                    <div class="character-background bg-gray-800 rounded-lg p-6 border border-gray-600">
                        <h4 class="font-cinzel text-xl text-white mb-4 flex items-center gap-2">
                            <span class="text-purple-400">📖</span> Background & Lore
                        </h4>
                        <div class="space-y-4">
                            <div class="bg-gray-900 rounded-lg p-4">
                                <h5 class="text-white font-semibold mb-2">Origin Story</h5>
                                <p class="text-gray-300 text-sm leading-relaxed">${originData.lore}</p>
                            </div>
                            
                            <!-- Starting Skills/Traits -->
                            ${originData.skills ? `
                                <div class="bg-gray-900 rounded-lg p-4">
                                    <h5 class="text-white font-semibold mb-2">Heritage Skills</h5>
                                    <div class="flex flex-wrap gap-2">
                                        ${originData.skills.map(skill => `
                                            <span class="bg-blue-900 bg-opacity-50 text-blue-300 px-3 py-1 rounded-full text-sm">
                                                ${capitalizeFirst(skill.replace('_', ' '))}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Skills Section (Full Width) -->
            <div class="skills-section bg-gray-800 rounded-lg p-6 border border-gray-600">
                <h4 class="font-cinzel text-xl text-white mb-4 flex items-center gap-2">
                    <span class="text-green-400">🎯</span> Skills & Proficiencies
                </h4>
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
    `;
    
    // Enhanced Skills Display
    const abilityGroups = {
        strength: ['athletics'],
        dexterity: ['acrobatics', 'sleightOfHand', 'stealth'],
        intelligence: ['arcana', 'history', 'investigation', 'nature', 'religion'],
        wisdom: ['animalHandling', 'insight', 'medicine', 'perception', 'survival'],
        charisma: ['deception', 'intimidation', 'performance', 'persuasion']
    };
    
    Object.entries(abilityGroups).forEach(([ability, skills]) => {
        const abilityName = capitalizeFirst(ability);
        const abilityIcon = {
            strength: '💪',
            dexterity: '🤸',
            intelligence: '🧠',
            wisdom: '👁️',
            charisma: '💬'
        }[ability];
        
        content += `
            <div class="ability-group bg-gray-900 rounded-lg p-4">
                <h5 class="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>${abilityIcon}</span>
                    ${abilityName} Skills
                </h5>
                <div class="space-y-2">
        `;
        
        skills.forEach(skillKey => {
            const skill = gameData.player.skills[skillKey];
            const modifier = getSkillModifier(skillKey);
            const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            const displayName = skillDisplayNames[skillKey];
            
            let proficiencyIcon = '';
            let proficiencyClass = '';
            if (skill.expertise) {
                proficiencyIcon = '<span class="text-yellow-400">★★</span>';
                proficiencyClass = 'border-yellow-400 bg-yellow-900 bg-opacity-20';
            } else if (skill.proficient) {
                proficiencyIcon = '<span class="text-blue-400">★</span>';
                proficiencyClass = 'border-blue-400 bg-blue-900 bg-opacity-20';
            } else {
                proficiencyClass = 'border-gray-700 hover:border-gray-600';
            }
            
            content += `
                <div class="skill-row flex justify-between items-center p-3 bg-gray-800 rounded border ${proficiencyClass} cursor-pointer transition-all duration-200 hover:bg-gray-700"
                     onclick="triggerManualSkillCheck('${skillKey}')">
                    <span class="text-gray-300 flex items-center gap-2">
                        ${proficiencyIcon}
                        ${displayName}
                    </span>
                    <span class="text-white font-mono font-bold">${modifierStr}</span>
                </div>
            `;
        });
        
        content += '</div></div>';
    });
    
    content += `
                </div>
                
                <!-- Skills Legend -->
                <div class="skills-legend mt-6 p-4 bg-gray-900 rounded-lg">
                    <div class="flex flex-wrap justify-between items-center">
                        <div class="flex flex-wrap gap-6 text-sm">
                            <div class="flex items-center gap-2">
                                <span class="text-blue-400">★</span>
                                <span class="text-gray-300">Proficient (+${gameData.player.proficiencyBonus})</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-yellow-400">★★</span>
                                <span class="text-gray-300">Expertise (+${gameData.player.proficiencyBonus * 2})</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-green-400">🎯</span>
                                <span class="text-gray-300">Click any skill to make a manual check</span>
                            </div>
                        </div>
                        
                        <!-- Debug/Test Buttons -->
                        <div class="flex gap-2 mt-4 lg:mt-0">
                            <button onclick="gainExperience(50)" 
                                    class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors">
                                +50 XP (Test)
                            </button>
                            <button onclick="gameData.player.derivedStats.health = Math.max(1, gameData.player.derivedStats.health - 5); renderCharacterSheet()" 
                                    class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors">
                                Take Damage (Test)
                            </button>
                            <button onclick="testCombat()" 
                                    class="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-xs transition-colors">
                                ⚔️ Test Combat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    characterContentEl.innerHTML = content;
}

function renderInventory() {
    if (!inventoryContentEl) return;
    
    const weight = getTotalWeight();
    const maxWeight = gameData.player.derivedStats.carryCapacity;
    
    let content = `
        <div class="inventory-system space-y-6 w-full">
            <!-- Equipment Slots Section -->
            <div class="equipment-section">
                <h3 class="font-cinzel text-xl text-white mb-4">Equipment</h3>
                <div class="equipment-grid grid grid-cols-7 gap-3 max-w-4xl mx-auto">
                    <!-- Head -->
                    <div class="equipment-slot col-start-4" data-slot="head">
                        ${renderEquipmentSlot('head', 'Head')}
                    </div>
                    
                    <!-- Neck -->
                    <div class="equipment-slot col-start-4" data-slot="neck">
                        ${renderEquipmentSlot('neck', 'Neck')}
                    </div>
                    
                    <!-- MainHand, Chest, OffHand -->
                    <div class="equipment-slot col-start-2" data-slot="mainhand">
                        ${renderEquipmentSlot('mainhand', 'Main Hand')}
                    </div>
                    <div class="equipment-slot col-start-4" data-slot="chest">
                        ${renderEquipmentSlot('chest', 'Chest')}
                    </div>
                    <div class="equipment-slot col-start-6" data-slot="offhand">
                        ${renderEquipmentSlot('offhand', 'Off Hand')}
                    </div>
                    
                    <!-- Rings -->
                    <div class="equipment-slot col-start-3" data-slot="finger1">
                        ${renderEquipmentSlot('finger1', 'Ring 1')}
                    </div>
                    <div class="equipment-slot col-start-5" data-slot="finger2">
                        ${renderEquipmentSlot('finger2', 'Ring 2')}
                    </div>
                    
                    <!-- Feet -->
                    <div class="equipment-slot col-start-4" data-slot="feet">
                        ${renderEquipmentSlot('feet', 'Feet')}
                    </div>
                </div>
            </div>
            
            <!-- Stats Summary -->
            <div class="stats-summary bg-gray-800 p-4 rounded border border-gray-600">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div class="stat-item">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-300">Armor Class:</span>
                            <span class="text-green-400 font-bold text-lg">${gameData.player.derivedStats.armorClass}</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-gray-300">Weight:</span>
                            <span class="text-white">${weight}/${maxWeight} lbs</span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-${weight > maxWeight * 0.8 ? 'red' : weight > maxWeight * 0.6 ? 'yellow' : 'blue'}-500 h-2 rounded-full transition-all duration-300" style="width: ${Math.min((weight / maxWeight) * 100, 100)}%"></div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-gray-300">Health:</span>
                            <span class="text-red-400">${gameData.player.derivedStats.health}/${gameData.player.derivedStats.maxHealth}</span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-red-500 h-2 rounded-full transition-all duration-300" style="width: ${(gameData.player.derivedStats.health / gameData.player.derivedStats.maxHealth) * 100}%"></div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-gray-300">Mana:</span>
                            <span class="text-blue-400">${gameData.player.derivedStats.mana}/${gameData.player.derivedStats.maxMana}</span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: ${(gameData.player.derivedStats.mana / gameData.player.derivedStats.maxMana) * 100}%"></div>
                        </div>
                    </div>
                </div>
                <div class="mt-3 text-center">
                    <span class="text-gray-400 text-xs">Items: ${gameData.player.inventory.filter(item => item != null).length}/60</span>
                    ${weight > maxWeight ? '<span class="text-red-400 text-xs ml-4">⚠ Overloaded!</span>' : ''}
                </div>
            </div>
            
            <!-- Inventory Section -->
            <div class="inventory-section">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-cinzel text-xl text-white">Inventory</h3>
                    <div class="inventory-controls flex gap-2">
                        <button onclick="compactInventory()" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded">Compact</button>
                        <button onclick="sortInventory('name')" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded">Name</button>
                        <button onclick="sortInventory('type')" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded">Type</button>
                        <button onclick="sortInventory('rarity')" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded">Rarity</button>
                    </div>
                </div>
                <div class="inventory-grid grid grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 gap-1 w-full max-w-7xl mx-auto">
    `;
    
    // Create 60 inventory slots (5 rows of 12)
    for (let i = 0; i < 60; i++) {
        const item = gameData.player.inventory[i];
        if (item) {
            const itemId = typeof item === 'string' ? item : item.id;
            const itemData = itemsData[itemId];
            const quantity = typeof item === 'string' ? 1 : (item.quantity || item.uses || 1);
            
            if (itemData) {
                content += `
                    <div class="inventory-slot occupied relative p-1 bg-gray-800 rounded border border-gray-600 hover:border-gray-400 cursor-pointer
                                ${itemData.rarity ? 'border-' + getRarityColor(itemData.rarity) + ' shadow-' + getRarityColor(itemData.rarity) : ''}" 
                         data-item="${itemId}" 
                         data-index="${i}"
                         draggable="true"
                         ondragstart="handleDragStart(event)"
                         ondragover="handleDragOver(event)"
                         ondragleave="handleDragLeave(event)"
                         ondrop="handleDrop(event)"
                         onclick="handleInventoryItemClick('${itemId}', ${i})"
                         onmouseenter="showQuickTooltip(event, '${itemId}')"
                         onmouseleave="hideQuickTooltip()"
                         ondblclick="examineItem('${itemId}')"
                         oncontextmenu="showItemContextMenu(event, '${itemId}', ${i})">
                        <div class="item-icon text-center text-lg mb-1 select-none">${getItemIcon(itemData)}</div>
                        <div class="item-name text-white text-xs text-center truncate select-none">${itemData.name}</div>
                        ${quantity > 1 ? `<div class="item-quantity absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">${quantity}</div>` : ''}
                        ${itemData.rarity ? `<div class="rarity-glow absolute inset-0 rounded bg-gradient-to-br from-transparent to-${getRarityColor(itemData.rarity)} opacity-20 pointer-events-none"></div>` : ''}
                    </div>
                `;
            }
        } else {
            content += `
                <div class="inventory-slot empty-slot p-1 bg-gray-900 rounded border border-gray-700 hover:border-gray-500 cursor-pointer transition-all duration-200"
                     data-index="${i}"
                     ondragover="handleDragOver(event)"
                     ondragleave="handleDragLeave(event)"
                     ondrop="handleDrop(event)">
                    <div class="h-14 flex items-center justify-center">
                        <div class="text-gray-600 text-xs opacity-0 hover:opacity-100 transition-opacity">+</div>
                    </div>
                </div>
            `;
        }
    }
    
    content += `
                </div>
            </div>
        </div>
    `;
    
    inventoryContentEl.innerHTML = content;
}

function renderEquipmentSlot(slot, label) {
    const equippedItemId = gameData.player.equipment[slot];
    const item = equippedItemId ? itemsData[equippedItemId] : null;
    
    if (item) {
        return `
            <div class="equipped-item relative p-2 bg-gray-700 rounded border border-gray-500 cursor-pointer transition-all duration-200
                        ${item.rarity ? 'border-' + getRarityColor(item.rarity) + ' shadow-lg' : ''} hover:transform hover:scale-105"
                 draggable="true"
                 ondragstart="handleEquipmentDragStart(event, '${slot}')"
                 onclick="handleEquipmentSlotClick('${slot}')"
                 ondblclick="examineItem('${equippedItemId}')"
                 oncontextmenu="showItemContextMenu(event, '${equippedItemId}', '${slot}')"
                 onmouseenter="showQuickTooltip(event, '${equippedItemId}')"
                 onmouseleave="hideQuickTooltip()">
                <div class="item-icon text-center text-xl mb-1 select-none">${getItemIcon(item)}</div>
                <div class="item-name text-white text-xs text-center truncate select-none">${item.name}</div>
                ${item.rarity ? `<div class="rarity-glow absolute inset-0 rounded bg-gradient-to-br from-transparent to-${getRarityColor(item.rarity)} opacity-20 pointer-events-none"></div>` : ''}
                ${item.statBonus ? `<div class="stat-bonus absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">+</div>` : ''}
            </div>
        `;
    } else {
        return `
            <div class="empty-equipment-slot p-2 bg-gray-900 rounded border border-gray-700 cursor-pointer hover:border-gray-500 transition-all duration-200"
                 data-slot="${slot}"
                 ondragover="handleEquipmentDragOver(event)"
                 ondragleave="handleDragLeave(event)"
                 ondrop="handleEquipmentDrop(event, '${slot}')"
                 onclick="handleEquipmentSlotClick('${slot}')">
                <div class="slot-icon text-center text-xl mb-1 text-gray-600 opacity-50">${getSlotIcon(slot)}</div>
                <div class="slot-label text-gray-500 text-xs text-center">${label}</div>
            </div>
        `;
    }
}

function getItemIcon(item) {
    // Return text-based icons instead of emojis
    const iconMap = {
        'weapon': { 'sword': '[⚔]', 'bow': '[⇗]', 'spear': '[|]', 'staff': '[I]' },
        'armor': { 'light': '[◐]', 'medium': '[◑]', 'heavy': '[●]', 'clothing': '[□]' },
        'consumable': '[○]',
        'quest': '[!]',
        'material': '[◊]',
        'accessory': '[◯]'
    };
    
    if (iconMap[item.type] && typeof iconMap[item.type] === 'object') {
        return iconMap[item.type][item.subtype] || '[?]';
    }
    return iconMap[item.type] || '[?]';
}

function getSlotIcon(slot) {
    const slotIcons = {
        'head': '[▣]',
        'neck': '[○]',
        'chest': '[■]',
        'mainhand': '[⚔]',
        'offhand': '[◐]',
        'finger1': '[◯]',
        'finger2': '[◯]',
        'feet': '[▢]'
    };
    return slotIcons[slot] || '[?]';
}

function getRarityColor(rarity) {
    const rarityColors = {
        'common': 'gray-400',
        'uncommon': 'green-400',
        'rare': 'blue-400',
        'epic': 'purple-400',
        'legendary': 'yellow-400'
    };
    return rarityColors[rarity] || 'gray-400';
}

function getItemTooltip(item) {
    let tooltip = `${item.name}\\n${item.description}`;
    
    if (item.type === 'weapon' && item.damage) {
        tooltip += `\\nDamage: ${item.damage}`;
    }
    
    if (item.armorClass) {
        tooltip += `\\nArmor Class: ${item.armorClass}`;
    }
    
    if (item.statBonus) {
        tooltip += '\\nStat Bonuses:';
        Object.entries(item.statBonus).forEach(([stat, bonus]) => {
            tooltip += `\\n  ${stat}: +${bonus}`;
        });
    }
    
    if (item.weight) {
        tooltip += `\\nWeight: ${item.weight} lbs`;
    }
    
    if (item.effect) {
        tooltip += `\\nEffect: ${item.effect}`;
    }
    
    return tooltip;
}

function handleInventoryItemClick(itemId, index) {
    const item = itemsData[itemId];
    if (!item) return;
    
    // Create enhanced context menu
    const menu = document.createElement('div');
    menu.className = 'fixed z-50 bg-gray-800 border border-gray-600 rounded shadow-xl p-1 min-w-32';
    menu.style.left = Math.min(event.clientX, window.innerWidth - 200) + 'px';
    menu.style.top = Math.min(event.clientY, window.innerHeight - 200) + 'px';
    
    let menuItems = [];
    
    // Equipment items
    if (item.slot && item.slot !== 'none') {
        menuItems.push(`
            <div class="menu-item flex items-center p-2 hover:bg-gray-700 cursor-pointer text-white text-sm" onclick="equipItemFromInventory('${itemId}'); closeContextMenu();">
                <span class="mr-2">⚡</span>Equip
            </div>
        `);
    }
    
    // Consumable items
    if (item.type === 'consumable') {
        menuItems.push(`
            <div class="menu-item flex items-center p-2 hover:bg-gray-700 cursor-pointer text-white text-sm" onclick="useItemFromInventory('${itemId}'); closeContextMenu();">
                <span class="mr-2">🍃</span>Use
            </div>
        `);
    }
    
    // Common actions
    menuItems.push(`
        <div class="menu-item flex items-center p-2 hover:bg-gray-700 cursor-pointer text-white text-sm" onclick="examineItem('${itemId}'); closeContextMenu();">
            <span class="mr-2">👁</span>Examine
        </div>
    `);
    
    // Drop/destroy option
    menuItems.push(`
        <div class="menu-separator border-t border-gray-600 my-1"></div>
        <div class="menu-item flex items-center p-2 hover:bg-red-700 cursor-pointer text-red-300 text-sm" onclick="dropItemFromInventory('${itemId}', ${index}); closeContextMenu();">
            <span class="mr-2">🗑</span>Drop
        </div>
    `);
    
    menu.innerHTML = menuItems.join('');
    document.body.appendChild(menu);
    
    // Close menu when clicking elsewhere
    setTimeout(() => {
        document.addEventListener('click', closeContextMenu);
    }, 10);
}

function handleEquipmentSlotClick(slot) {
    const equippedItemId = gameData.player.equipment[slot];
    
    if (equippedItemId) {
        // Unequip item
        if (unequipItem(slot)) {
            renderInventory();
            showFloatingText('Item Unequipped', 'yellow');
        }
    }
}

function equipItemFromInventory(itemId) {
    if (equipItem(itemId)) {
        renderInventory();
        showFloatingText('Item Equipped', 'green');
    } else {
        showFloatingText('Cannot Equip Item', 'red');
    }
}

function useItemFromInventory(itemId) {
    if (useConsumableItem(itemId)) {
        renderInventory();
    } else {
        showFloatingText('Cannot Use Item', 'red');
    }
}

function dropItemFromInventory(itemId, index) {
    const item = itemsData[itemId];
    if (!item) return;
    
    // Confirm before dropping
    if (confirm(`Drop ${item.name}? This action cannot be undone.`)) {
        gameData.player.inventory.splice(index, 1);
        renderInventory();
        showFloatingText(`Dropped ${item.name}`, 'orange');
    }
}

function examineItem(itemId) {
    const item = itemsData[itemId];
    if (!item) return;
    
    // Create examination modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-900 border-2 border-gray-600 rounded-lg p-6 max-w-md mx-4">
            <h3 class="font-cinzel text-xl text-white mb-4">${item.name}</h3>
            <div class="space-y-2 text-gray-300">
                <p>${item.description}</p>
                <div class="stats-info mt-4">
                    <div><strong>Type:</strong> ${item.type}</div>
                    ${item.subtype ? `<div><strong>Subtype:</strong> ${item.subtype}</div>` : ''}
                    ${item.weight ? `<div><strong>Weight:</strong> ${item.weight} lbs</div>` : ''}
                    ${item.armorClass ? `<div><strong>Armor Class:</strong> ${item.armorClass}</div>` : ''}
                    ${item.damage ? `<div><strong>Damage:</strong> ${item.damage}</div>` : ''}
                    ${item.effect ? `<div><strong>Effect:</strong> ${item.effect}</div>` : ''}
                    ${item.rarity ? `<div><strong>Rarity:</strong> ${item.rarity}</div>` : ''}
                </div>
            </div>
            <button class="w-full mt-4 p-2 bg-gray-600 hover:bg-gray-700 text-white rounded" onclick="closeExamineModal()">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentExamineModal = modal;
}

function closeContextMenu() {
    const menus = document.querySelectorAll('.fixed.z-50.bg-gray-800');
    menus.forEach(menu => {
        if (menu.parentNode) {
            menu.parentNode.removeChild(menu);
        }
    });
    document.removeEventListener('click', closeContextMenu);
}

function closeExamineModal() {
    if (window.currentExamineModal && window.currentExamineModal.parentNode) {
        window.currentExamineModal.parentNode.removeChild(window.currentExamineModal);
        window.currentExamineModal = null;
    }
}

function autoEquipStartingGear() {
    // Try to equip appropriate items from the starting inventory
    const equipPriority = ['mainhand', 'chest', 'head', 'neck', 'offhand', 'finger1', 'finger2', 'feet'];
    
    gameData.player.inventory.forEach((itemId, index) => {
        const item = itemsData[itemId];
        if (item && item.slot && item.slot !== 'none') {
            // Try to equip this item
            let targetSlot = item.slot;
            
            // Handle finger slots
            if (targetSlot === 'finger') {
                targetSlot = gameData.player.equipment.finger1 ? 'finger2' : 'finger1';
            }
            
            // Only equip if slot is empty
            if (!gameData.player.equipment[targetSlot]) {
                equipItem(itemId);
            }
        }
    });
}

// Drag and Drop functionality
let draggedItem = null;
let draggedFromSlot = null;
let draggedFromIndex = null;

function handleDragStart(event) {
    // Get the draggable element (might be a parent if we clicked on a child)
    const dragElement = event.target.closest('[draggable="true"]');
    if (!dragElement) return;
    
    const itemId = dragElement.dataset.item;
    const index = parseInt(dragElement.dataset.index);
    
    console.log('Drag start:', { itemId, index }); // Debug log
    
    draggedItem = itemId;
    draggedFromIndex = index;
    draggedFromSlot = null;
    
    dragElement.style.opacity = '0.5';
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', dragElement.outerHTML);
}

function handleEquipmentDragStart(event, slot) {
    const itemId = gameData.player.equipment[slot];
    
    draggedItem = itemId;
    draggedFromSlot = slot;
    draggedFromIndex = null;
    
    event.target.style.opacity = '0.5';
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', event.target.outerHTML);
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    // Visual feedback
    const slot = event.target.closest('.inventory-slot');
    if (slot) {
        slot.classList.add('border-blue-400', 'drag-over');
    }
}

function handleDragLeave(event) {
    // Only remove if we're actually leaving the element
    if (!event.currentTarget.contains(event.relatedTarget)) {
        const slot = event.target.closest('.inventory-slot, .empty-equipment-slot, .equipped-item');
        if (slot) {
            slot.classList.remove('border-blue-400', 'drag-over');
        }
    }
}

function handleEquipmentDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    // Visual feedback
    const slot = event.target.closest('.empty-equipment-slot, .equipped-item');
    if (slot) {
        slot.classList.add('border-blue-400', 'drag-over');
    }
}

function handleDrop(event) {
    event.preventDefault();
    
    // Remove visual feedback
    document.querySelectorAll('.drag-over, .border-blue-400').forEach(el => {
        el.classList.remove('border-blue-400', 'drag-over');
    });
    
    // Get the target slot (might be a child element)
    const targetSlot = event.target.closest('.inventory-slot');
    if (!targetSlot) {
        console.log('No target slot found');
        resetDragState();
        return;
    }
    
    const targetIndex = parseInt(targetSlot.dataset.index);
    
    console.log('Drop event:', { 
        draggedItem, 
        draggedFromIndex, 
        draggedFromSlot, 
        targetIndex 
    }); // Debug log
    
    if (draggedFromIndex !== null && draggedFromIndex !== targetIndex) {
        // Moving from one inventory slot to another
        console.log('Moving inventory item from', draggedFromIndex, 'to', targetIndex);
        moveInventoryItem(draggedFromIndex, targetIndex);
    } else if (draggedFromSlot !== null) {
        // Moving from equipment to inventory
        console.log('Moving from equipment slot', draggedFromSlot, 'to inventory index', targetIndex);
        if (unequipItem(draggedFromSlot)) {
            // Move the item to the target inventory slot
            const itemIndex = gameData.player.inventory.length - 1; // Item was added to end
            if (targetIndex < gameData.player.inventory.length) {
                // Swap positions
                const temp = gameData.player.inventory[targetIndex];
                gameData.player.inventory[targetIndex] = gameData.player.inventory[itemIndex];
                if (temp) {
                    gameData.player.inventory[itemIndex] = temp;
                } else {
                    gameData.player.inventory.splice(itemIndex, 1);
                }
            }
        }
    }
    
    // Reset drag state
    resetDragState();
    renderInventory();
}

function handleEquipmentDrop(event, targetSlot) {
    event.preventDefault();
    
    // Remove visual feedback
    document.querySelectorAll('.drag-over, .border-blue-400').forEach(el => {
        el.classList.remove('border-blue-400', 'drag-over');
    });
    
    if (draggedFromIndex !== null) {
        // Moving from inventory to equipment
        const item = itemsData[draggedItem];
        if (item && (item.slot === targetSlot || (item.slot === 'finger' && (targetSlot === 'finger1' || targetSlot === 'finger2')))) {
            if (equipItem(draggedItem, targetSlot)) {
                // Remove from original inventory position
                gameData.player.inventory.splice(draggedFromIndex, 1);
            }
        }
    } else if (draggedFromSlot !== null && draggedFromSlot !== targetSlot) {
        // Moving from one equipment slot to another
        const item = itemsData[draggedItem];
        if (item && (item.slot === targetSlot || (item.slot === 'finger' && (targetSlot === 'finger1' || targetSlot === 'finger2')))) {
            // Unequip from source
            unequipItem(draggedFromSlot);
            // Equip to target (item is now in inventory)
            equipItem(draggedItem, targetSlot);
        }
    }
    
    // Reset drag state
    resetDragState();
    renderInventory();
}

function moveInventoryItem(fromIndex, toIndex) {
    // Ensure we don't exceed inventory bounds
    while (gameData.player.inventory.length <= Math.max(fromIndex, toIndex)) {
        gameData.player.inventory.push(null);
    }
    
    // Swap items
    const temp = gameData.player.inventory[fromIndex];
    gameData.player.inventory[fromIndex] = gameData.player.inventory[toIndex];
    gameData.player.inventory[toIndex] = temp;
    
    // Clean up null entries at the end
    while (gameData.player.inventory.length > 0 && gameData.player.inventory[gameData.player.inventory.length - 1] === null) {
        gameData.player.inventory.pop();
    }
}

function resetDragState() {
    draggedItem = null;
    draggedFromSlot = null;
    draggedFromIndex = null;
    
    // Reset opacity for all items
    document.querySelectorAll('.inventory-slot, .equipped-item').forEach(item => {
        item.style.opacity = '1';
        item.classList.remove('border-blue-400');
    });
}

// Add event listeners to handle drag end
document.addEventListener('dragend', function(event) {
    resetDragState();
});

// Inventory Management Functions
function sortInventory(criteria) {
    // Create array of items with their indices
    const itemsWithIndices = [];
    
    gameData.player.inventory.forEach((item, index) => {
        if (item) {
            const itemId = typeof item === 'string' ? item : item.id;
            const itemData = itemsData[itemId];
            const quantity = typeof item === 'string' ? 1 : (item.quantity || item.uses || 1);
            
            if (itemData) {
                itemsWithIndices.push({
                    item: item,
                    itemData: itemData,
                    quantity: quantity,
                    originalIndex: index
                });
            }
        }
    });
    
    // Sort based on criteria
    itemsWithIndices.sort((a, b) => {
        switch(criteria) {
            case 'name':
                return a.itemData.name.localeCompare(b.itemData.name);
            case 'type':
                if (a.itemData.type !== b.itemData.type) {
                    return a.itemData.type.localeCompare(b.itemData.type);
                }
                return a.itemData.name.localeCompare(b.itemData.name);
            case 'weight':
                const weightA = a.itemData.weight || 0;
                const weightB = b.itemData.weight || 0;
                if (weightA !== weightB) {
                    return weightB - weightA; // Heaviest first
                }
                return a.itemData.name.localeCompare(b.itemData.name);
            case 'rarity':
                const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3, 'epic': 4, 'legendary': 5 };
                const rarityA = rarityOrder[a.itemData.rarity] || 0;
                const rarityB = rarityOrder[b.itemData.rarity] || 0;
                if (rarityA !== rarityB) {
                    return rarityB - rarityA; // Highest rarity first
                }
                return a.itemData.name.localeCompare(b.itemData.name);
            default:
                return 0;
        }
    });
    
    // Rebuild inventory array
    gameData.player.inventory = [];
    itemsWithIndices.forEach(itemInfo => {
        gameData.player.inventory.push(itemInfo.item);
    });
    
    // Re-render inventory
    renderInventory();
    showFloatingText(`Sorted By ${capitalizeFirst(criteria)}`, 'blue');
}

// Enhanced item examination function
function examineItem(itemId) {
    if (!itemId || !itemsData[itemId]) {
        console.log('No item to examine');
        return;
    }
    
    const item = itemsData[itemId];
    
    // Create examination modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.style.zIndex = '9999';
    
    const modalContent = document.createElement('div');
    modalContent.className = `bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border-2 ${item.rarity ? 'border-' + getRarityColor(item.rarity) : 'border-gray-600'} shadow-2xl`;
    
    modalContent.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
                <span class="text-2xl">${getItemIcon(item)}</span>
                ${item.name}
            </h3>
            <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white text-xl">&times;</button>
        </div>
        
        <div class="space-y-3">
            ${item.rarity ? `<div class="text-${getRarityColor(item.rarity)} font-semibold">${capitalizeFirst(item.rarity)}</div>` : ''}
            
            <div class="text-gray-300">
                <strong>Type:</strong> ${capitalizeFirst(item.type)}
                ${item.slot ? ` (${capitalizeFirst(item.slot)})` : ''}
            </div>
            
            ${item.weight ? `<div class="text-gray-300"><strong>Weight:</strong> ${item.weight} lbs</div>` : ''}
            
            ${item.value ? `<div class="text-yellow-400"><strong>Value:</strong> ${item.value} gold</div>` : ''}
            
            ${item.description ? `<div class="text-gray-300 italic">"${item.description}"</div>` : ''}
            
            ${item.statBonus ? `
                <div class="bg-gray-700 p-3 rounded">
                    <div class="text-green-400 font-semibold mb-2">Stat Bonuses:</div>
                    ${Object.entries(item.statBonus).map(([stat, bonus]) => 
                        `<div class="text-white">+${bonus} ${capitalizeFirst(stat)}</div>`
                    ).join('')}
                </div>
            ` : ''}
            
            ${item.effect ? `
                <div class="bg-blue-900 p-3 rounded">
                    <div class="text-blue-300 font-semibold mb-2">Effect:</div>
                    <div class="text-blue-100">${item.effect}</div>
                </div>
            ` : ''}
            
            ${item.damage ? `
                <div class="bg-red-900 p-3 rounded">
                    <div class="text-red-300 font-semibold">Damage: ${item.damage}</div>
                </div>
            ` : ''}
            
            ${item.armor ? `
                <div class="bg-gray-700 p-3 rounded">
                    <div class="text-gray-300 font-semibold">Armor Class: +${item.armor}</div>
                </div>
            ` : ''}
        </div>
        
        <div class="flex gap-2 mt-6">
            ${gameData.player.inventory.includes(itemId) ? `
                <button onclick="useItem('${itemId}'); this.closest('.fixed').remove();" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                    Use Item
                </button>
            ` : ''}
            <button onclick="this.closest('.fixed').remove()" 
                    class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
                Close
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Utility function to capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Experience and Leveling System
function gainExperience(amount) {
    gameData.player.experience += amount;
    showFloatingText(`+${amount} XP`, 'purple');
    
    // Check for level up
    if (gameData.player.experience >= gameData.player.experienceToNext) {
        levelUp();
    }
    
    // Update character sheet if open
    if (characterContentEl && !characterContentEl.innerHTML.includes('No equipment')) {
        renderCharacterSheet();
    }
}

function levelUp() {
    const oldLevel = gameData.player.level;
    gameData.player.level++;
    
    // Calculate new experience requirement (using D&D 5e style progression)
    const experienceTable = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000];
    gameData.player.experienceToNext = experienceTable[gameData.player.level] || experienceTable[experienceTable.length - 1] * 2;
    
    // Update proficiency bonus (every 4 levels)
    gameData.player.proficiencyBonus = Math.ceil(gameData.player.level / 4) + 1;
    
    // Recalculate derived stats
    calculateDerivedStats();
    
    // Show level up notification
    showLevelUpModal(oldLevel, gameData.player.level);
    showFloatingText(`Level Up! Now Level ${gameData.player.level}`, 'gold');
}

function showLevelUpModal(oldLevel, newLevel) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.style.zIndex = '9999';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-gradient-to-br from-yellow-900 to-orange-900 rounded-lg p-8 max-w-md w-full mx-4 border-4 border-yellow-500 shadow-2xl text-center';
    
    modalContent.innerHTML = `
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="font-cinzel text-3xl text-yellow-300 mb-4">Level Up!</h2>
        <div class="text-white text-xl mb-4">
            Level ${oldLevel} → Level <span class="text-yellow-300 font-bold">${newLevel}</span>
        </div>
        <div class="space-y-2 text-sm text-yellow-100 mb-6">
            <div>• Health and Mana increased</div>
            <div>• Proficiency bonus: +${gameData.player.proficiencyBonus}</div>
            <div>• New abilities may be available</div>
        </div>
        <button onclick="this.closest('.fixed').remove()" 
                class="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
            Continue Adventure
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Auto-close after 10 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 10000);
}

// Enhanced context menu for items
function showItemContextMenu(event, itemId, slotOrIndex) {
    event.preventDefault();
    
    // Remove any existing context menu
    const existingMenu = document.getElementById('item-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    const item = itemsData[itemId];
    if (!item) return;
    
    const menu = document.createElement('div');
    menu.id = 'item-context-menu';
    menu.className = 'fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl min-w-48';
    
    // Position menu
    let left = event.clientX;
    let top = event.clientY;
    
    // Ensure menu stays on screen
    if (left + 200 > window.innerWidth) {
        left = event.clientX - 200;
    }
    if (top + 150 > window.innerHeight) {
        top = event.clientY - 150;
    }
    
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    
    const isEquipped = typeof slotOrIndex === 'string';
    const isInInventory = gameData.player.inventory.includes(itemId);
    
    let menuItems = [];
    
    // Examine option
    menuItems.push(`
        <div class="menu-item px-4 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
             onclick="examineItem('${itemId}'); hideContextMenu();">
            <span class="text-blue-400">🔍</span> Examine
        </div>
    `);
    
    // Use/Equip options
    if (isInInventory) {
        if (item.type === 'consumable') {
            menuItems.push(`
                <div class="menu-item px-4 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
                     onclick="useItem('${itemId}'); hideContextMenu();">
                    <span class="text-green-400">✨</span> Use
                </div>
            `);
        } else if (item.slot && ['weapon', 'armor', 'accessory'].includes(item.type)) {
            menuItems.push(`
                <div class="menu-item px-4 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
                     onclick="equipItem('${itemId}'); hideContextMenu();">
                    <span class="text-yellow-400">⚔️</span> Equip
                </div>
            `);
        }
    }
    
    // Unequip option for equipped items
    if (isEquipped) {
        menuItems.push(`
            <div class="menu-item px-4 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
                 onclick="unequipItem('${slotOrIndex}'); hideContextMenu();">
                <span class="text-orange-400">🔄</span> Unequip
            </div>
        `);
    }
    
    // Drop/Remove option
    if (isInInventory) {
        menuItems.push(`
            <div class="menu-item px-4 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
                 onclick="dropItem('${itemId}'); hideContextMenu();">
                <span class="text-red-400">🗑️</span> Drop
            </div>
        `);
    }
    
    // Item info
    menuItems.push(`
        <div class="menu-header px-4 py-2 bg-gray-900 text-white text-sm font-semibold">
            ${getItemIcon(item)} ${item.name}
        </div>
    `);
    
    menu.innerHTML = menuItems.reverse().join('');
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', hideContextMenu);
    }, 10);
}

function hideContextMenu() {
    const menu = document.getElementById('item-context-menu');
    if (menu) {
        menu.remove();
    }
    document.removeEventListener('click', hideContextMenu);
}

function showQuickTooltip(event, itemId) {
    const item = itemsData[itemId];
    if (!item) return;
    
    // Remove existing tooltip
    hideQuickTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.id = 'quick-tooltip';
    tooltip.className = `fixed z-50 bg-gray-900 border-2 rounded-lg p-3 shadow-2xl max-w-sm ${item.rarity ? 'border-' + getRarityColor(item.rarity) : 'border-gray-600'}`;
    
    // Position tooltip with bounds checking
    let left = event.clientX + 15;
    let top = event.clientY + 15;
    
    // Ensure tooltip stays on screen
    if (left + 300 > window.innerWidth) {
        left = event.clientX - 315;
    }
    if (top + 200 > window.innerHeight) {
        top = event.clientY - 205;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    
    tooltip.innerHTML = `
        <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">${getItemIcon(item)}</span>
            <div>
                <div class="text-white font-bold text-sm">${item.name}</div>
                ${item.rarity ? `<div class="text-${getRarityColor(item.rarity)} text-xs font-semibold">${capitalizeFirst(item.rarity)}</div>` : ''}
            </div>
        </div>
        
        <div class="text-gray-300 text-xs mb-2">
            ${capitalizeFirst(item.type)}${item.slot ? ` • ${capitalizeFirst(item.slot)}` : ''}
            ${item.weight ? ` • ${item.weight} lbs` : ''}
            ${item.value ? ` • ${item.value}g` : ''}
        </div>
        
        ${item.description ? `<div class="text-gray-300 text-xs mb-2 italic">"${item.description}"</div>` : ''}
        
        ${item.statBonus ? `
            <div class="bg-gray-800 p-2 rounded mb-2">
                <div class="text-green-400 text-xs font-semibold mb-1">Bonuses:</div>
                ${Object.entries(item.statBonus).map(([stat, bonus]) => 
                    `<div class="text-white text-xs">+${bonus} ${capitalizeFirst(stat)}</div>`
                ).join('')}
            </div>
        ` : ''}
        
        ${item.damage ? `<div class="text-red-400 text-xs">⚔️ Damage: ${item.damage}</div>` : ''}
        ${item.armor ? `<div class="text-blue-400 text-xs">🛡️ Armor: +${item.armor} AC</div>` : ''}
        ${item.effect ? `<div class="text-purple-400 text-xs">✨ ${item.effect}</div>` : ''}
        
        <div class="text-gray-500 text-xs mt-2 pt-2 border-t border-gray-700">
            Double-click to examine • Right-click for options
        </div>
    `;
    
    document.body.appendChild(tooltip);
}

function hideQuickTooltip() {
    const tooltip = document.getElementById('quick-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function compactInventory() {
    // Remove null/undefined entries and compact the array
    gameData.player.inventory = gameData.player.inventory.filter(item => item != null);
    renderInventory();
    showFloatingText('Inventory Compacted', 'green');
}

function renderSettings() {
    if (!settingsContent) return;
    
    const content = `
        <div class="settings-panel space-y-6">
            <div class="setting-group">
                <h4 class="font-cinzel text-xl text-white mb-3">Game Settings</h4>
                
                <div class="setting-item mb-4">
                    <label class="block text-gray-300 mb-2">Text Speed</label>
                    <input type="range" min="0.5" max="2" step="0.1" value="${gameData.settings.textSpeed}" 
                           class="w-full" id="text-speed-slider">
                    <div class="text-gray-400 text-sm mt-1">Current: ${gameData.settings.textSpeed}x</div>
                </div>
                
                <div class="setting-item mb-4">
                    <label class="block text-gray-300 mb-2">Volume</label>
                    <input type="range" min="0" max="1" step="0.1" value="${gameData.settings.volume}" 
                           class="w-full" id="volume-slider">
                    <div class="text-gray-400 text-sm mt-1">Current: ${Math.round(gameData.settings.volume * 100)}%</div>
                </div>
            </div>
            
            <div class="setting-group">
                <h4 class="font-cinzel text-xl text-white mb-3">Save System</h4>
                <div class="space-y-2">
                    <button class="action-button w-full py-2 px-4 rounded" onclick="saveGame()">Save Game</button>
                    <div id="save-slots" class="space-y-2"></div>
                    <div id="save-message" class="text-green-300 text-sm text-center" style="display: none;"></div>
                </div>
            </div>
        </div>
    `;
    
    settingsContent.innerHTML = content;
    
    // Add event listeners for settings
    const textSpeedSlider = document.getElementById('text-speed-slider');
    const volumeSlider = document.getElementById('volume-slider');
    
    if (textSpeedSlider) {
        textSpeedSlider.addEventListener('input', (e) => {
            gameData.settings.textSpeed = parseFloat(e.target.value);
            e.target.nextElementSibling.textContent = `Current: ${gameData.settings.textSpeed}x`;
        });
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            gameData.settings.volume = parseFloat(e.target.value);
            e.target.nextElementSibling.textContent = `Current: ${Math.round(gameData.settings.volume * 100)}%`;
        });
    }
    
    // Populate save slots
    populateSaveSlots();
}

// Data Loading Functions
async function loadGameData() {
    try {
        const responses = await Promise.all([
            fetch('data/locations.json'),
            fetch('data/scenes.json'),
            fetch('data/classes.json'),
            fetch('data/items.json'),
            fetch('data/quests.json'),
            fetch('data/monsters.json'),
            fetch('data/calendar.json')
        ]);

        const data = await Promise.all(responses.map(response => response.json()));
        
        [locationsData, scenesData, classesData, itemsData, questsData, monstersData, calendarData] = data;
        
        console.log('Game data loaded successfully');
    } catch (error) {
        console.error('Error loading game data:', error);
        // Fallback to embedded data if files aren't available
        loadFallbackData();
    }
}

function loadFallbackData() {
    // Fallback data in case JSON files can't be loaded
    locationsData = {
        westwalker_camp: {
            name: "Westwalker Campfire",
            description: "A small, well-kept campfire crackles, a lonely point of light against the vast, darkening plains of the Frontier. The edge of the Griefwood looms like a wall of shadow in the distance. The air is still, but carries an unusual chill.",
            image: "https://placehold.co/800x300/4B3F3F/E0E0E0?text=Westwalker+Camp",
            actions: [
                { text: "Rest by the fire", type: 'scene', target: 'start_vision' },
                { text: "Check your gear", type: 'info', info: "Your ranger's pack is light but well-stocked. You have what you need to survive." },
                { text: "Scout the perimeter (Perception)", type: 'skill_check', skill: 'perception', dc: 15, successText: "You notice tracks leading toward the Griefwood - something large passed this way recently.", failureText: "The area seems quiet... too quiet." },
                { text: "Forage for supplies (Survival)", type: 'skill_check', skill: 'survival', dc: 12, successText: "You find some edible berries and medicinal herbs growing nearby.", failureText: "You find nothing of value in the sparse wilderness." },
                { text: "⚔️ Test Combat", type: 'combat', target: 'test_combat' },
                { text: "Travel to Jorn", type: 'travel', target: 'jorn' }
            ]
        },
        leonin_encampment: {
            name: "M'ra Kaal Encampment",
            description: "The scent of woodsmoke and roasting meat hangs in the air. Around you, the proud Leonin of your clan share stories and sharpen their blades. The sounds of the Ancestral Roar still echo in your spirit.",
            image: "https://placehold.co/800x300/6D4C3C/E0E0E0?text=M'ra+Kaal+Encampment",
            actions: [
                { text: "Meditate on the spirits", type: 'scene', target: 'start_vision' },
                { text: "Visit the Honor Arena", type: 'info', info: "Two warriors are locked in a duel of skill, their movements a blur of muscle and steel. It is a dance of honor." },
                { text: "Challenge a warrior (Athletics)", type: 'skill_check', skill: 'athletics', dc: 16, successText: "You prove your strength and earn the respect of your clan-mates.", failureText: "The warrior bests you, but nods with respect for your effort." },
                { text: "Read the spiritual signs (Insight)", type: 'skill_check', skill: 'insight', dc: 14, successText: "The spirits whisper of coming change - the Convergence draws near.", failureText: "The spirits remain silent, their messages unclear." },
                { text: "Speak to the Clan-Speaker", type: 'info', info: "Zema Mataal is deep in communion and cannot be disturbed." },
            ]
        },
        gaian_library: {
            name: "The Great Library of Gaia",
            description: "Sunlight, filtered through high, arched windows, illuminates swirling dust motes. The air smells of old parchment and endless knowledge. Scholars move like ghosts between towering shelves.",
            image: "https://placehold.co/800x300/3C4F6D/E0E0E0?text=Great+Library+of+Gaia",
            actions: [
                { text: "Study the celestial charts", type: 'scene', target: 'start_vision' },
                { text: "Consult a Sage", type: 'info', info: "The sage nods slowly. 'The Convergence, yes... a time of great peril and great opportunity. The stars do not lie.'" },
                { text: "Research ancient texts (Investigation)", type: 'skill_check', skill: 'investigation', dc: 13, successText: "You uncover references to the 'Triune Convergence' and its connection to dimensional instability.", failureText: "The ancient texts are too cryptic and damaged to yield useful information." },
                { text: "Decipher magical runes (Arcana)", type: 'skill_check', skill: 'arcana', dc: 17, successText: "The runes speak of a ritual that might stabilize or destabilize the Convergence itself.", failureText: "The magical symbols are too complex for your current understanding." },
                { text: "Explore the Archives", type: 'info', info: "You find a dusty tome that mentions 'celestial schisms' and 'realm-thinning' during past Convergences." },
            ]
        }
    };

    scenesData = {
        start_vision: {
            text: "As you focus, the world melts away. The red moon, Kapra, seems to swell in the sky, its light turning from eerie to malevolent. The world holds its breath, and then your mind is violently pulled away.",
            choices: [
                { text: "Witness the vision.", nextScene: "vision" }
            ]
        },
        vision: {
            onEnter: () => {
                gameData.player.quests.active.push("The Vision");
                gameData.player.lore.add("The Triune Convergence is a time of great upheaval.");
            },
            text: "You see flashes: A throne of twisted iron under a black sky. A Leonin warrior with a shattered mane. A dwarven forge, cold and dark. A tidal wave of shadow washing over the plains of Ehix. And through it all, three moons burning like hateful eyes, their light not illuminating, but consuming. You gasp and return to yourself, heart hammering in your chest, the horrifying images seared into your memory.",
            choices: [
                { text: "This is an omen. I must understand it.", nextScene: "seek_answers" },
                { text: "It was just a nightmare, a trick of the light.", nextScene: "dismiss" },
            ]
        },
        seek_answers: {
            text: "The vision feels too real to ignore. It's a warning. The Triune Convergence is not just a celestial event; it's a threat. You know you cannot stand by and do nothing. Your path begins now. Where will you go?",
            choices: [
                { text: "Travel to Gaia and consult the sages.", nextScene: "end_prologue" },
                { text: "Speak with the elders of my people.", nextScene: "end_prologue" },
                { text: "Seek out the reclusive druids of the S'Liviah.", nextScene: "end_prologue" },
            ]
        },
        dismiss: {
            text: "You shake your head, trying to clear the disturbing images. It was the stress of the times, the talk of prophecies, the strange color of the moon. Nothing more. You try to settle back into your routine, but a sliver of ice remains in your gut. The vision, whether real or not, has changed something within you.",
            choices: [
                { text: "I should still be more watchful...", nextScene: "end_prologue" }
            ]
        },
        end_prologue: {
            text: "Your journey has just begun. The fate of Edoria may well rest on the choices you make under the light of the three moons. (To be continued...)",
            choices: []
        }
    };
}

// Game Functions
function updateDisplay() {
    const monthName = gameData.time.months[gameData.time.month];
    dateEl.textContent = `${monthName} ${gameData.time.day}, ${gameData.time.year} PA`;
    monthDescEl.textContent = gameData.time.monthDescriptions[gameData.time.month];
    
    const edyria = gameData.moons.edyria;
    const kapra = gameData.moons.kapra;
    const enia = gameData.moons.enia;

    const edyriaPhase = edyria.phase / (edyria.cycle - 1);
    const kapraPhase = kapra.phase / (kapra.cycle - 1);
    const eniaPhase = enia.phase / (enia.cycle - 1);

    moonEdyriaEl.style.opacity = 0.2 + (edyriaPhase * 0.8);
    moonKapraEl.style.opacity = 0.2 + (kapraPhase * 0.8);
    moonEniaEl.style.opacity = 0.2 + (eniaPhase * 0.8);

    moonEdyriaEl.classList.toggle('full-moon', edyria.phase === Math.floor(edyria.cycle/2));
    moonKapraEl.classList.toggle('full-moon', kapra.phase === Math.floor(kapra.cycle/2));
    moonEniaEl.classList.toggle('full-moon', enia.phase === Math.floor(enia.cycle/2));
}

function checkMoonEvents() {
    if (gameData.moons.kapra.phase === Math.floor(gameData.moons.kapra.cycle / 2)) {
        gameData.player.lore.add("Kapra's full moon fills the air with unease.");
    }
}

function renderScene(sceneId) {
    const scene = scenesData[sceneId];
    if (!scene) return;

    if (gameData.story.currentScene && gameData.story.currentScene !== sceneId) {
        if (!gameData.story.completedScenes.includes(gameData.story.currentScene)) {
            gameData.story.completedScenes.push(gameData.story.currentScene);
        }
    }

    if (scene.onEnter) scene.onEnter();

    gameData.story.currentScene = sceneId;
    advanceTime();
    
    mainContentEl.innerHTML = `
        <p class="story-text p-4 bg-black bg-opacity-20 rounded-lg mb-6">${typeof scene.text === 'function' ? scene.text(gameData.player.origin) : scene.text}</p>
        <div id="choices" class="grid grid-cols-1 gap-4 mt-auto"></div>
    `;
    
    const choicesEl = document.getElementById('choices');
    scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.className = 'choice-button w-full text-left p-4 rounded-lg font-cinzel text-lg';
        button.onclick = () => {
            if (choice.nextScene) {
                renderScene(choice.nextScene);
            } else {
                renderLocation(gameData.player.location);
            }
        };
        choicesEl.appendChild(button);
    });
}

function renderLocation(locationId) {
    const location = locationsData[locationId];
    if (!location) return;

    gameData.player.location = locationId;
    gameData.story.currentScene = null;
    
    mainContentEl.innerHTML = `
        <div class="mb-4 rounded-lg overflow-hidden"><img src="${location.image}" alt="${location.name}" class="w-full h-full object-cover"></div>
        <h2 class="font-cinzel text-2xl text-white mb-2">${location.name}</h2>
        <p class="text-gray-300 mb-6">${location.description}</p>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-auto">
            ${location.actions.map((action, index) => `
                <button class="action-button p-4 rounded-lg" 
                        data-type="${action.type}" 
                        data-target="${action.target || ''}" 
                        data-info="${action.info || ''}"
                        data-skill="${action.skill || ''}"
                        data-dc="${action.dc || ''}"
                        data-success-text="${action.successText || ''}"
                        data-failure-text="${action.failureText || ''}"
                        data-index="${index}">
                    <span class="font-cinzel text-lg">${action.text}</span>
                </button>
            `).join('')}
        </div>
    `;
    
    document.querySelectorAll('.action-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.currentTarget.dataset.type;
            const target = e.currentTarget.dataset.target;
            const info = e.currentTarget.dataset.info;
            const skill = e.currentTarget.dataset.skill;
            const dc = parseInt(e.currentTarget.dataset.dc);
            const successText = e.currentTarget.dataset.successText;
            const failureText = e.currentTarget.dataset.failureText;

            if (type === 'scene') {
                renderScene(target);
            } else if (type === 'info') {
                alert(info);
            } else if (type === 'skill_check') {
                triggerSkillCheck(skill, dc, `${skillDisplayNames[skill]} check`, 
                    function(result) {
                        // Success callback
                        alert(successText);
                        gameData.player.lore.add(successText);
                    },
                    function(result) {
                        // Failure callback
                        alert(failureText);
                        gameData.player.lore.add(failureText);
                    }
                );
            } else if (type === 'travel') {
                // Check if target location exists
                if (locationsData[target]) {
                    renderLocation(target);
                } else {
                    alert(`Location "${target}" not found. Travel system needs this location to be defined in locations.json.`);
                }
            } else if (type === 'combat') {
                if (target === 'test_combat') {
                    testCombat();
                }
            }
        });
    });
}

function advanceTime() {
    gameData.time.day++;
    gameData.moons.edyria.phase = (gameData.moons.edyria.phase + 1) % gameData.moons.edyria.cycle;
    gameData.moons.kapra.phase = (gameData.moons.kapra.phase + 1) % gameData.moons.kapra.cycle;
    gameData.moons.enia.phase = (gameData.moons.enia.phase + 1) % gameData.moons.enia.cycle;
    if (gameData.time.day > 40) {
        gameData.time.day = 1;
        gameData.time.month = (gameData.time.month + 1) % gameData.time.months.length;
        if (gameData.time.month === 0) gameData.time.year++;
    }
    checkMoonEvents();
    updateDisplay();
}

function checkMoonEvents() {
    // Check for moon convergence or special events
    const edyriaPhase = (gameData.time.day + gameData.moons.edyria.phase) % gameData.moons.edyria.cycle;
    const kapraPhase = (gameData.time.day + gameData.moons.kapra.phase) % gameData.moons.kapra.cycle;
    const eniaPhase = (gameData.time.day + gameData.moons.enia.phase) % gameData.moons.enia.cycle;
    
    // Check if all moons are in similar phases (convergence event)
    const phaseThreshold = 3; // Allow some variance
    if (Math.abs(edyriaPhase - kapraPhase) <= phaseThreshold && 
        Math.abs(kapraPhase - eniaPhase) <= phaseThreshold &&
        Math.abs(edyriaPhase - eniaPhase) <= phaseThreshold) {
        
        // Add convergence lore if not already present
        const convergenceLore = "The three moons draw closer in their celestial dance, their combined energies creating ripples across the realms.";
        if (!gameData.player.lore.has(convergenceLore)) {
            gameData.player.lore.add(convergenceLore);
        }
    }
    
    // Individual moon phase events
    if (edyriaPhase === 0) { // New moon
        gameData.player.rumors.add("Whispers speak of increased magical energies during Edyria's dark phase.");
    }
    
    if (kapraPhase === Math.floor(gameData.moons.kapra.cycle / 2)) { // Full moon
        gameData.player.rumors.add("The red light of Kapra's full phase stirs restless spirits in the night.");
    }
    
    if (eniaPhase === Math.floor(gameData.moons.enia.cycle / 2)) { // Full moon
        gameData.player.rumors.add("Enia's golden glow brings luck to travelers and fortune to merchants.");
    }
}

const SAVE_KEY = 'edoriaSaves';
const SAVE_SLOT_LIMIT = 5;
const GAME_VERSION = '0.1.0';

function getSaveSlots() {
    const saves = localStorage.getItem(SAVE_KEY);
    return saves ? JSON.parse(saves) : [];
}

function setSaveSlots(slots) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
}

function createSaveData() {
    return {
        saveId: `save_${Date.now()}`,
        gameVersion: GAME_VERSION,
        timestamp: new Date().toISOString(),
        data: JSON.parse(JSON.stringify({
            player: gameData.player,
            time: gameData.time,
            story: gameData.story,
            settings: gameData.settings
        }))
    };
}

function saveGame() {
    const slots = getSaveSlots();
    if(slots.length >= SAVE_SLOT_LIMIT) {
        slots.shift();
    }
    slots.push(createSaveData());
    setSaveSlots(slots);
    populateSaveSlots();
    displaySaveMessage('Game saved');
}

function loadGame(index) {
    const slots = getSaveSlots();
    const save = slots[index];
    if(!save) return;
    const { player, time, story, settings } = save.data;
    gameData.player = player;
    gameData.time = time;
    gameData.story = story;
    gameData.settings = settings;
    if(gameData.story.currentScene) {
        renderScene(gameData.story.currentScene);
    } else {
        renderLocation(gameData.player.location || 'westwalker_camp');
    }
    updateDisplay();
    displaySaveMessage('Game loaded');
}

function populateSaveSlots() {
    const slots = getSaveSlots();
    const container = document.getElementById('save-slots');
    if(!container) return;
    container.innerHTML = slots.map((s,i)=>`<div class="flex justify-between items-center mb-2"><span class="text-sm">Slot ${i+1} - ${new Date(s.timestamp).toLocaleString()}</span><div><button class="load-save-btn action-button px-2 py-1 mr-1" data-slot="${i}">Load</button><button class="delete-save-btn action-button px-2 py-1" data-slot="${i}">Delete</button></div></div>`).join('') || '<p class="text-gray-400">No saves.</p>';
    container.querySelectorAll('.load-save-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{ loadGame(parseInt(btn.dataset.slot)); closeAllPanels(); });
    });
    container.querySelectorAll('.delete-save-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{ deleteSave(parseInt(btn.dataset.slot)); });
    });
}

function deleteSave(index) {
    const slots = getSaveSlots();
    slots.splice(index,1);
    setSaveSlots(slots);
    populateSaveSlots();
    displaySaveMessage('Save deleted');
}

function displaySaveMessage(msg) {
    const msgEl = document.getElementById('save-message');
    if(!msgEl) return;
    msgEl.textContent = msg;
    msgEl.style.display = 'block';
    setTimeout(()=>{ msgEl.style.display = 'none'; },2000);
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Start button
    const startBtn = document.getElementById('start-game-button');
    console.log('Start button found:', !!startBtn);
    
    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            console.log('Start button clicked!');
            e.preventDefault();
            startScreen.style.display = 'none';
            characterCreationScreen.style.display = 'flex';
        });
        
        // Also try with onclick as backup
        startBtn.onclick = () => {
            console.log('Start button onclick triggered!');
            startScreen.style.display = 'none';
            characterCreationScreen.style.display = 'flex';
        };
    } else {
        console.error('Start button not found!');
    }

    // Origin choices
    originChoices.forEach(choice => {
        choice.addEventListener('click', () => {
            console.log('Origin choice clicked:', choice.dataset.origin);
            gameData.player.origin = choice.dataset.origin;
            const originData = classesData[gameData.player.origin];
            if(originData){
                gameData.player.stats = { ...originData.stats };
                gameData.player.inventory = [...originData.startingEquipment];
                
                // Auto-equip appropriate starting items
                autoEquipStartingGear();
                
                // Recalculate stats after equipment
                recalculateStats();
                
                // Set origin-specific skill proficiencies
                if (gameData.player.origin === 'westwalker') {
                    gameData.player.skills.survival.proficient = true;
                    gameData.player.skills.perception.proficient = true;
                    gameData.player.skills.athletics.proficient = true;
                    gameData.player.skills.nature.proficient = true;
                } else if (gameData.player.origin === 'leonin') {
                    gameData.player.skills.intimidation.proficient = true;
                    gameData.player.skills.insight.proficient = true;
                    gameData.player.skills.athletics.proficient = true;
                    gameData.player.skills.religion.proficient = true;
                } else if (gameData.player.origin === 'gaian') {
                    gameData.player.skills.arcana.proficient = true;
                    gameData.player.skills.history.proficient = true;
                    gameData.player.skills.investigation.proficient = true;
                    gameData.player.skills.religion.proficient = true;
                }
            }
            characterCreationScreen.style.display = 'none';
            gameScreen.style.display = 'flex';
            
            let startLocation;
            if (gameData.player.origin === 'westwalker') startLocation = 'westwalker_camp';
            else if (gameData.player.origin === 'leonin') startLocation = 'leonin_encampment';
            else if (gameData.player.origin === 'gaian') startLocation = 'gaian_library';
            
            renderLocation(startLocation);
        });
    });

    navButtons.forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel)));
    closePanelButtons.forEach(button => button.addEventListener('click', closeAllPanels));
}

// Event Listeners
console.log('Setting up event listeners...');
console.log('startGameButton:', startGameButton);

if (startGameButton) {
    startGameButton.addEventListener('click', () => {
        console.log('Start button clicked!');
        startScreen.style.display = 'none';
        characterCreationScreen.style.display = 'flex';
    });
} else {
    console.error('Start button not found!');
}

originChoices.forEach(choice => {
    choice.addEventListener('click', () => {
        console.log('Origin choice clicked:', choice.dataset.origin);
        gameData.player.origin = choice.dataset.origin;
        const originData = classesData[gameData.player.origin];
        if(originData){
            gameData.player.stats = { ...originData.stats };
            gameData.player.inventory = [...originData.startingEquipment];
            
            // Auto-equip appropriate starting items
            autoEquipStartingGear();
            
            // Recalculate stats after equipment
            recalculateStats();
            
            // Set origin-specific skill proficiencies
            if (gameData.player.origin === 'westwalker') {
                gameData.player.skills.survival.proficient = true;
                gameData.player.skills.perception.proficient = true;
                gameData.player.skills.athletics.proficient = true;
                gameData.player.skills.nature.proficient = true;
            } else if (gameData.player.origin === 'leonin') {
                gameData.player.skills.intimidation.proficient = true;
                gameData.player.skills.insight.proficient = true;
                gameData.player.skills.athletics.proficient = true;
                gameData.player.skills.religion.proficient = true;
            } else if (gameData.player.origin === 'gaian') {
                gameData.player.skills.arcana.proficient = true;
                gameData.player.skills.history.proficient = true;
                gameData.player.skills.investigation.proficient = true;
                gameData.player.skills.religion.proficient = true;
            }
        }
        characterCreationScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        
        let startLocation;
        if (gameData.player.origin === 'westwalker') startLocation = 'westwalker_camp';
        else if (gameData.player.origin === 'leonin') startLocation = 'leonin_encampment';
        else if (gameData.player.origin === 'gaian') startLocation = 'gaian_library';
        
        renderLocation(startLocation);
    });
});

// Initialize Game
async function initializeGame() {
    console.log('Initializing game...');
    
    // Check if critical elements exist
    console.log('Start button exists:', !!document.getElementById('start-game-button'));
    console.log('Start screen exists:', !!document.getElementById('start-screen'));
    console.log('Character creation screen exists:', !!document.getElementById('character-creation-screen'));
    
    await loadGameData();
    updateDisplay();
    
    // Set up event listeners after everything is loaded
    setupEventListeners();
    setupKeyboardShortcuts();
    
    // Add some test journal entries to demonstrate hyperlinks
    gameData.player.quests.active.push(
        "Explore the mysterious Griefwood and discover its ancient secrets.",
        "Seek out the Keeper of Jorn to learn about the coming Convergence."
    );
    
    gameData.player.lore.add(
        "The Aethermoon governs all magical energies in the world of Edoria."
    );
    gameData.player.lore.add(
        "Leonin warriors are known for their honor and connection to the spirits."
    );
    
    gameData.player.rumors.add(
        "Some say the Scholar of the ancient tower holds secrets about the three moons."
    );
    gameData.player.rumors.add(
        "Travelers whisper of strange happenings near the Griefwood when Umbralmoon is full."
    );
}

// Keyboard shortcuts for enhanced inventory experience
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Only handle shortcuts when not in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Inventory shortcuts
        switch(event.key.toLowerCase()) {
            case 'i':
                // Toggle inventory
                togglePanel('inventory');
                event.preventDefault();
                break;
                
            case 'e':
                // Toggle equipment
                togglePanel('equipment');
                event.preventDefault();
                break;
                
            case 'j':
                // Toggle journal
                togglePanel('journal');
                event.preventDefault();
                break;
                
            case 's':
                // Quick sort inventory by name
                if (event.ctrlKey || event.metaKey) {
                    sortInventory('name');
                    event.preventDefault();
                }
                break;
                
            case 'r':
                // Quick sort inventory by rarity
                if (event.ctrlKey || event.metaKey) {
                    sortInventory('rarity');
                    event.preventDefault();
                }
                break;
                
            case 't':
                // Quick sort inventory by type
                if (event.ctrlKey || event.metaKey) {
                    sortInventory('type');
                    event.preventDefault();
                }
                break;
                
            case 'escape':
                // Close any open modals
                const modals = document.querySelectorAll('.fixed.inset-0');
                modals.forEach(modal => modal.remove());
                hideQuickTooltip();
                event.preventDefault();
                break;
        }
    });
}

// ==================== COMBAT SYSTEM ====================

// Combat state management
let combatState = {
    inCombat: false,
    participants: [],
    currentTurnIndex: 0,
    round: 1,
    actionQueue: []
};

// Combat Core Mechanics
class CombatParticipant {
    constructor(data, isPlayer = false) {
        this.id = data.id || 'player';
        this.name = data.name || 'Player';
        this.isPlayer = isPlayer;
        this.maxHitPoints = data.hitPoints || gameState.character.hitPoints;
        this.currentHitPoints = this.maxHitPoints;
        this.armorClass = data.armorClass || this.calculatePlayerAC();
        this.attributes = data.attributes || gameState.character.abilities;
        this.abilities = data.abilities || [];
        this.conditions = [];
        this.initiative = 0;
        this.hasActedThisTurn = false;
        this.hasMovedThisTurn = false;
        this.tempModifiers = {};
    }

    calculatePlayerAC() {
        let baseAC = 10;
        const dexMod = getAbilityModifier(gameState.character.abilities.dexterity);
        
        // Add equipped armor AC
        const equippedArmor = getEquippedItems().find(item => item.type === 'armor');
        if (equippedArmor && equippedArmor.armorClass) {
            baseAC = equippedArmor.armorClass + Math.min(dexMod, equippedArmor.maxDexBonus || 999);
        } else {
            baseAC += dexMod;
        }
        
        return baseAC;
    }

    rollInitiative() {
        const dexMod = getAbilityModifier(this.attributes.dexterity);
        this.initiative = rollD20() + dexMod;
        return this.initiative;
    }

    takeDamage(amount, damageType = 'physical') {
        // Apply resistances and immunities
        let finalDamage = amount;
        
        if (this.abilities) {
            const resistances = this.abilities.find(a => a.name === 'resistances');
            if (resistances && resistances.types && resistances.types.includes(damageType)) {
                finalDamage = Math.floor(finalDamage / 2);
            }
        }
        
        this.currentHitPoints = Math.max(0, this.currentHitPoints - finalDamage);
        
        if (this.isPlayer) {
            gameState.character.hitPoints = this.currentHitPoints;
            updateCharacterDisplay();
        }
        
        return finalDamage;
    }

    heal(amount) {
        const healedAmount = Math.min(amount, this.maxHitPoints - this.currentHitPoints);
        this.currentHitPoints += healedAmount;
        
        if (this.isPlayer) {
            gameState.character.hitPoints = this.currentHitPoints;
            updateCharacterDisplay();
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

// Initiative and turn order management
function rollInitiativeForAll() {
    combatState.participants.forEach(participant => {
        participant.rollInitiative();
    });
    
    // Sort by initiative (highest first)
    combatState.participants.sort((a, b) => b.initiative - a.initiative);
    combatState.currentTurnIndex = 0;
}

function startCombat(monsters = []) {
    combatState.inCombat = true;
    combatState.participants = [];
    combatState.round = 1;
    
    // Add player to combat
    const playerData = {
        id: 'player',
        name: gameState.character.name,
        hitPoints: gameState.character.hitPoints,
        armorClass: 10 + getAbilityModifier(gameState.character.abilities.dexterity),
        attributes: gameState.character.abilities
    };
    
    const player = new CombatParticipant(playerData, true);
    combatState.participants.push(player);
    
    // Add monsters to combat
    monsters.forEach(monsterData => {
        const monster = new CombatParticipant(monsterData, false);
        combatState.participants.push(monster);
    });
    
    // Roll initiative
    rollInitiativeForAll();
    
    // Show combat UI
    showCombatInterface();
    
    // Start first turn
    startTurn();
}

function endCombat(victory = false) {
    combatState.inCombat = false;
    combatState.participants = [];
    combatState.currentTurnIndex = 0;
    combatState.round = 1;
    
    hideCombatInterface();
    
    if (victory) {
        showCombatResults(true);
    } else {
        showCombatResults(false);
    }
}

function exitCombat() {
    if (confirm("Are you sure you want to flee from combat? You may take damage!")) {
        // Player flees - end combat without victory
        addCombatMessage("You flee from combat!");
        endCombat(false);
    }
}

function startTurn() {
    // Reset action flags
    combatState.participants.forEach(p => {
        p.hasActedThisTurn = false;
        p.hasMovedThisTurn = false;
    });
    
    const currentParticipant = getCurrentParticipant();
    
    if (!currentParticipant) {
        nextRound();
        return;
    }
    
    if (currentParticipant.isDead()) {
        nextTurn();
        return;
    }
    
    updateCombatDisplay();
    
    if (currentParticipant.isPlayer) {
        // Player turn - show action options
        showPlayerCombatActions();
    } else {
        // Monster turn - AI acts
        setTimeout(() => {
            performMonsterAI(currentParticipant);
        }, 1000);
    }
}

function nextTurn() {
    combatState.currentTurnIndex++;
    
    if (combatState.currentTurnIndex >= combatState.participants.length) {
        nextRound();
    } else {
        startTurn();
    }
}

function nextRound() {
    combatState.round++;
    combatState.currentTurnIndex = 0;
    
    // Process end-of-round effects
    processEndOfRoundEffects();
    
    // Check for combat end conditions
    if (checkCombatEndConditions()) {
        return;
    }
    
    startTurn();
}

function getCurrentParticipant() {
    return combatState.participants[combatState.currentTurnIndex];
}

function checkCombatEndConditions() {
    const player = combatState.participants.find(p => p.isPlayer);
    const monsters = combatState.participants.filter(p => !p.isPlayer);
    
    // Player defeated
    if (player && player.isDead()) {
        endCombat(false);
        return true;
    }
    
    // All monsters defeated
    if (monsters.every(m => m.isDead())) {
        endCombat(true);
        return true;
    }
    
    return false;
}

// Combat Actions & Attack System
function performAttack(attacker, target, weapon = null) {
    // Determine attack bonus
    let attackBonus = 0;
    let damageBonus = 0;
    let damageRoll = '1d4'; // Default unarmed damage
    
    if (attacker.isPlayer) {
        // Player attack
        const proficiencyBonus = getProficiencyBonus(gameState.character.level);
        
        if (weapon) {
            // Weapon attack
            if (weapon.type === 'weapon') {
                damageRoll = weapon.damage || '1d6';
                // Use appropriate ability modifier
                const abilityMod = weapon.finesse ? 
                    Math.max(getAbilityModifier(attacker.attributes.strength), getAbilityModifier(attacker.attributes.dexterity)) :
                    getAbilityModifier(attacker.attributes.strength);
                
                attackBonus = abilityMod + (weapon.proficient ? proficiencyBonus : 0);
                damageBonus = abilityMod;
            }
        } else {
            // Unarmed attack
            const strMod = getAbilityModifier(attacker.attributes.strength);
            attackBonus = strMod + proficiencyBonus;
            damageBonus = strMod;
        }
    } else {
        // Monster attack
        const attackAbility = attacker.abilities.find(a => a.type === 'attack') || 
                             { attackBonus: Math.floor(attacker.level / 2) + 2, damage: '1d6+2' };
        attackBonus = attackAbility.attackBonus || Math.floor(attacker.level / 2) + 2;
        damageRoll = attackAbility.damage || '1d6+2';
    }
    
    // Roll attack
    const attackRoll = rollD20() + attackBonus;
    const targetAC = target.armorClass;
    
    // Determine hit/miss
    const isHit = attackRoll >= targetAC;
    const isCritical = attackRoll === 20 + attackBonus;
    const isCriticalMiss = attackRoll === 1 + attackBonus;
    
    let damage = 0;
    
    if (isHit) {
        // Roll damage
        damage = rollDamage(damageRoll, isCritical) + damageBonus;
        const actualDamage = target.takeDamage(damage);
        
        // Show attack result
        showAttackResult({
            attacker: attacker.name,
            target: target.name,
            attackRoll: attackRoll,
            targetAC: targetAC,
            hit: true,
            critical: isCritical,
            damage: actualDamage,
            weapon: weapon ? weapon.name : 'Unarmed Strike'
        });
    } else {
        // Miss
        showAttackResult({
            attacker: attacker.name,
            target: target.name,
            attackRoll: attackRoll,
            targetAC: targetAC,
            hit: false,
            critical: false,
            criticalMiss: isCriticalMiss,
            damage: 0,
            weapon: weapon ? weapon.name : 'Unarmed Strike'
        });
    }
    
    return { hit: isHit, damage: damage, critical: isCritical };
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

// Combat Actions
function performPlayerAction(action, target = null) {
    const player = combatState.participants.find(p => p.isPlayer);
    if (!player || !player.canAct()) return;
    
    switch (action) {
        case 'attack':
            if (target) {
                const equippedWeapon = getEquippedItems().find(item => item.type === 'weapon');
                performAttack(player, target, equippedWeapon);
                player.hasActedThisTurn = true;
            }
            break;
            
        case 'defend':
            // Add +2 AC until next turn
            player.tempModifiers.acBonus = 2;
            addCombatMessage(`${player.name} takes a defensive stance! (+2 AC until next turn)`);
            player.hasActedThisTurn = true;
            break;
            
        case 'dash':
            // Doubles movement (not implemented yet but logged)
            addCombatMessage(`${player.name} dashes!`);
            player.hasActedThisTurn = true;
            break;
            
        case 'dodge':
            // Attackers have disadvantage until next turn
            player.tempModifiers.dodging = true;
            addCombatMessage(`${player.name} dodges! Attackers have disadvantage until next turn.`);
            player.hasActedThisTurn = true;
            break;
            
        case 'help':
            // Give ally advantage on next action (simplified)
            addCombatMessage(`${player.name} helps an ally!`);
            player.hasActedThisTurn = true;
            break;
    }
    
    if (player.hasActedThisTurn) {
        setTimeout(() => {
            nextTurn();
        }, 1500);
    }
}

// Monster AI System
function performMonsterAI(monster) {
    if (monster.isDead() || !monster.canAct()) {
        nextTurn();
        return;
    }
    
    // Simple AI: Attack the player
    const player = combatState.participants.find(p => p.isPlayer);
    if (player && !player.isDead()) {
        // Use monster's special abilities occasionally
        if (Math.random() < 0.3 && monster.abilities.length > 0) {
            const ability = monster.abilities[Math.floor(Math.random() * monster.abilities.length)];
            performMonsterAbility(monster, ability, player);
        } else {
            // Standard attack
            performAttack(monster, player);
        }
    }
    
    monster.hasActedThisTurn = true;
    
    setTimeout(() => {
        nextTurn();
    }, 2000);
}

function performMonsterAbility(monster, ability, target) {
    switch (ability.type) {
        case 'special':
            if (ability.damage) {
                const damage = rollDamage(ability.damage);
                const actualDamage = target.takeDamage(damage);
                addCombatMessage(`${monster.name} uses ${ability.name}! ${target.name} takes ${actualDamage} damage.`);
            } else {
                addCombatMessage(`${monster.name} uses ${ability.name}!`);
            }
            break;
            
        case 'fear':
            addCombatMessage(`${monster.name} uses ${ability.name}! ${target.name} is frightened!`);
            target.addCondition({ name: 'frightened', duration: 2 });
            break;
            
        case 'buff':
            addCombatMessage(`${monster.name} uses ${ability.name}!`);
            monster.tempModifiers.damageBonus = (monster.tempModifiers.damageBonus || 0) + 2;
            break;
            
        default:
            addCombatMessage(`${monster.name} uses ${ability.name}!`);
    }
}

function processEndOfRoundEffects() {
    combatState.participants.forEach(participant => {
        // Clear temporary modifiers
        participant.tempModifiers = {};
        
        // Process conditions
        participant.conditions = participant.conditions.map(condition => {
            if (condition.duration) {
                condition.duration--;
                if (condition.duration <= 0) {
                    addCombatMessage(`${participant.name} is no longer ${condition.name}.`);
                    return null;
                }
            }
            return condition;
        }).filter(c => c !== null);
    });
}

// Combat UI and Display Functions
function showCombatInterface() {
    // Hide game screen and show combat screen
    const gameScreen = document.getElementById('game-screen');
    const combatScreen = document.getElementById('combat-screen');
    
    if (gameScreen) gameScreen.style.display = 'none';
    if (combatScreen) combatScreen.style.display = 'flex';
    
    updateCombatDisplay();
}

function hideCombatInterface() {
    // Hide combat screen and show game screen
    const gameScreen = document.getElementById('game-screen');
    const combatScreen = document.getElementById('combat-screen');
    
    if (combatScreen) combatScreen.style.display = 'none';
    if (gameScreen) gameScreen.style.display = 'flex';
}

function updateCombatDisplay() {
    updateInitiativeList();
    updateCombatParticipants();
    updateCurrentTurnIndicator();
    updateRoundDisplay();
}

function updateInitiativeList() {
    const initiativeList = document.getElementById('initiative-list');
    if (!initiativeList) return;
    
    initiativeList.innerHTML = '';
    
    combatState.participants.forEach((participant, index) => {
        const isCurrentTurn = index === combatState.currentTurnIndex;
        const isDead = participant.isDead();
        
        const initiativeItem = document.createElement('div');
        initiativeItem.className = `initiative-item p-2 rounded border ${
            isCurrentTurn ? 'bg-yellow-600 border-yellow-400 text-black' : 
            isDead ? 'bg-red-900 border-red-700 text-red-300' :
            'bg-gray-700 border-gray-600 text-gray-300'
        }`;
        
        initiativeItem.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="font-bold">${participant.name}</span>
                <span class="text-sm">${participant.initiative}</span>
            </div>
            <div class="text-xs">
                HP: ${participant.currentHitPoints}/${participant.maxHitPoints}
                ${participant.conditions.length > 0 ? ` | ${participant.conditions.map(c => c.name).join(', ')}` : ''}
            </div>
        `;
        
        initiativeList.appendChild(initiativeItem);
    });
}

function updateCombatParticipants() {
    const participantsDiv = document.getElementById('combat-participants');
    if (!participantsDiv) return;
    
    participantsDiv.innerHTML = '';
    
    combatState.participants.forEach(participant => {
        const participantDiv = document.createElement('div');
        participantDiv.className = `participant-card p-3 rounded border ${
            participant.isPlayer ? 'bg-blue-900 border-blue-600' : 'bg-red-900 border-red-600'
        }`;
        
        const hpPercentage = (participant.currentHitPoints / participant.maxHitPoints) * 100;
        
        participantDiv.innerHTML = `
            <div class="text-center">
                <div class="font-bold text-lg ${participant.isPlayer ? 'text-blue-300' : 'text-red-300'}">
                    ${participant.name}
                </div>
                <div class="mt-2">
                    <div class="text-xs text-gray-400">HP</div>
                    <div class="bg-gray-700 rounded h-4 overflow-hidden">
                        <div class="bg-green-500 h-full transition-all duration-500" style="width: ${hpPercentage}%"></div>
                    </div>
                    <div class="text-sm mt-1">${participant.currentHitPoints}/${participant.maxHitPoints}</div>
                </div>
                <div class="text-xs text-gray-400 mt-1">AC: ${participant.armorClass}</div>
                ${participant.conditions.length > 0 ? 
                    `<div class="text-xs text-yellow-400 mt-1">${participant.conditions.map(c => c.name).join(', ')}</div>` : 
                    ''}
            </div>
        `;
        
        participantsDiv.appendChild(participantDiv);
    });
}

function updateCurrentTurnIndicator() {
    const indicator = document.getElementById('current-turn-indicator');
    const displayElement = document.getElementById('current-turn-display');
    
    const currentParticipant = getCurrentParticipant();
    if (currentParticipant) {
        const turnText = `${currentParticipant.name}'s Turn`;
        const className = `text-center p-2 rounded font-bold ${
            currentParticipant.isPlayer ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
        }`;
        
        if (indicator) {
            indicator.textContent = turnText;
            indicator.className = className;
        }
        
        if (displayElement) {
            displayElement.textContent = turnText;
            displayElement.className = currentParticipant.isPlayer ? 
                'text-white bg-blue-600 px-3 py-1 rounded font-bold' : 
                'text-white bg-red-600 px-3 py-1 rounded font-bold';
        }
    }
}

function updateRoundDisplay() {
    const roundDiv = document.getElementById('combat-round');
    const roundDisplay = document.getElementById('combat-round-display');
    
    const roundText = `Round ${combatState.round}`;
    
    if (roundDiv) {
        roundDiv.textContent = roundText;
    }
    
    if (roundDisplay) {
        roundDisplay.textContent = roundText;
    }
}

function showPlayerCombatActions() {
    const actionsDiv = document.getElementById('player-actions');
    if (actionsDiv) {
        actionsDiv.style.display = 'block';
    }
}

function hidePlayerCombatActions() {
    const actionsDiv = document.getElementById('player-actions');
    if (actionsDiv) {
        actionsDiv.style.display = 'none';
    }
}

function openSpellMenu() {
    addCombatMessage("Spell casting is not yet implemented!");
    // TODO: Implement spell menu
}

function selectCombatAction(action) {
    if (action === 'attack') {
        showTargetSelection();
    }
}

function showTargetSelection() {
    const targetDiv = document.getElementById('target-selection');
    const targetList = document.getElementById('target-list');
    
    if (!targetDiv || !targetList) return;
    
    targetList.innerHTML = '';
    
    // Show enemy targets
    const enemies = combatState.participants.filter(p => !p.isPlayer && !p.isDead());
    
    enemies.forEach(enemy => {
        const targetBtn = document.createElement('button');
        targetBtn.className = 'target-btn bg-red-600 hover:bg-red-700 text-white p-2 rounded font-cinzel text-sm w-full';
        targetBtn.textContent = `${enemy.name} (${enemy.currentHitPoints}/${enemy.maxHitPoints} HP)`;
        targetBtn.onclick = () => {
            performPlayerAction('attack', enemy);
            hideTargetSelection();
        };
        
        targetList.appendChild(targetBtn);
    });
    
    targetDiv.style.display = 'block';
    hidePlayerCombatActions();
}

function hideTargetSelection() {
    const targetDiv = document.getElementById('target-selection');
    if (targetDiv) {
        targetDiv.style.display = 'none';
    }
    showPlayerCombatActions();
}

function cancelTargetSelection() {
    hideTargetSelection();
}

// Combat messaging system
function addCombatMessage(message) {
    const messagesDiv = document.getElementById('combat-messages');
    if (!messagesDiv) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'combat-message text-gray-300 py-1 border-b border-gray-700';
    messageDiv.textContent = message;
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    // Keep only last 50 messages
    while (messagesDiv.children.length > 50) {
        messagesDiv.removeChild(messagesDiv.firstChild);
    }
}

function showAttackResult(result) {
    let message = '';
    
    if (result.hit) {
        if (result.critical) {
            message = `🎯 CRITICAL HIT! ${result.attacker} strikes ${result.target} with ${result.weapon} for ${result.damage} damage!`;
        } else {
            message = `⚔️ ${result.attacker} hits ${result.target} with ${result.weapon} for ${result.damage} damage! (Rolled ${result.attackRoll} vs AC ${result.targetAC})`;
        }
    } else {
        if (result.criticalMiss) {
            message = `💥 CRITICAL MISS! ${result.attacker} completely whiffs with ${result.weapon}!`;
        } else {
            message = `🛡️ ${result.attacker} misses ${result.target} with ${result.weapon}. (Rolled ${result.attackRoll} vs AC ${result.targetAC})`;
        }
    }
    
    addCombatMessage(message);
    updateCombatDisplay();
}

function showCombatResults(victory) {
    const resultModal = document.createElement('div');
    resultModal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60';
    
    resultModal.innerHTML = `
        <div class="bg-gray-900 border-2 ${victory ? 'border-green-600' : 'border-red-600'} rounded-lg p-8 max-w-md mx-4 text-center">
            <h2 class="font-cinzel text-3xl ${victory ? 'text-green-400' : 'text-red-400'} mb-4">
                ${victory ? '🏆 Victory!' : '💀 Defeat!'}
            </h2>
            <p class="text-gray-300 mb-6">
                ${victory ? 
                    'You have successfully defeated your enemies!' : 
                    'You have been defeated in combat...'}
            </p>
            <button onclick="closeCombatResults()" class="px-6 py-2 ${victory ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg font-cinzel">
                Continue
            </button>
        </div>
    `;
    
    document.body.appendChild(resultModal);
}

function closeCombatResults() {
    const resultModals = document.querySelectorAll('.fixed.inset-0.z-60');
    resultModals.forEach(modal => modal.remove());
}

// Helper function to start combat for testing
function testCombat() {
    console.log('Starting test combat...');
    
    const testMonster = {
        id: 'test_goblin',
        name: 'Goblin',
        hitPoints: 15,
        armorClass: 12,
        attributes: {
            strength: 10,
            dexterity: 14,
            constitution: 12,
            intelligence: 8,
            wisdom: 10,
            charisma: 8
        },
        abilities: [
            {
                name: 'Scimitar Attack',
                type: 'attack',
                attackBonus: 4,
                damage: '1d6+2'
            }
        ]
    };
    
    try {
        startCombat([testMonster]);
    } catch (error) {
        console.error('Error starting combat:', error);
    }
}

// Helper functions for combat system
function getEquippedItems() {
    // Return equipped items from inventory
    if (!gameState.inventory) return [];
    
    return gameState.inventory.filter(item => item && item.equipped);
}

function updateCharacterDisplay() {
    // Update character display after changes
    renderCharacterSheet();
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);

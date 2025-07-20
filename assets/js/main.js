// Edoria: The Triune Convergence - Main Game Script

// Game Data Structure
const gameData = {
    player: {
        origin: null,
        location: null,
        inventory: [],
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
        level: 1
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
        // Show final roll result
        if (rollData.advantage || rollData.disadvantage) {
            diceDisplay.innerHTML = `
                <div class="flex space-x-4 items-center justify-center">
                    <span class="text-4xl ${rollData.rollResult.roll1 === rollData.rollResult.result ? 'text-green-400' : 'text-gray-500'}">${rollData.rollResult.roll1}</span>
                    <span class="text-2xl text-gray-400">/</span>
                    <span class="text-4xl ${rollData.rollResult.roll2 === rollData.rollResult.result ? 'text-green-400' : 'text-gray-500'}">${rollData.rollResult.roll2}</span>
                </div>
                <div class="text-sm mt-2 ${rollData.advantage ? 'text-green-400' : 'text-red-400'}">
                    ${rollData.advantage ? 'Advantage' : 'Disadvantage'}
                </div>
            `;
        } else {
            let colorClass = 'text-white';
            if (rollData.critical) colorClass = 'text-green-400';
            else if (rollData.criticalFailure) colorClass = 'text-red-400';
            
            diceDisplay.innerHTML = `<span class="${colorClass}">${rollData.rollResult.result}</span>`;
        }
        
        // Show breakdown
        const breakdown = rollData.breakdown;
        breakdownEl.innerHTML = `
            <div class="text-sm space-y-1">
                <div>Roll: ${rollData.rollResult.result}</div>
                <div>${breakdown.ability.charAt(0).toUpperCase() + breakdown.ability.slice(1)} Modifier: ${breakdown.abilityModifier >= 0 ? '+' : ''}${breakdown.abilityModifier}</div>
                ${breakdown.isProficient ? `<div>Proficiency${breakdown.hasExpertise ? ' (Expertise)' : ''}: +${breakdown.proficiencyBonus}</div>` : ''}
                <div class="border-t border-gray-600 pt-1 font-bold">Total: ${rollData.total}</div>
            </div>
        `;
        
        // Show result
        let resultText = rollData.success ? 'Success!' : 'Failure';
        let resultClass = rollData.success ? 'text-green-400' : 'text-red-400';
        
        if (rollData.critical) {
            resultText = 'Critical Success!';
            resultClass = 'text-green-400';
        } else if (rollData.criticalFailure) {
            resultText = 'Critical Failure!';
            resultClass = 'text-red-400';
        }
        
        resultEl.innerHTML = `<span class="${resultClass}">${resultText}</span>`;
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
        <div class="character-sheet space-y-6">
            <div class="origin-info text-center">
                <h3 class="font-cinzel text-2xl text-white mb-2">${originData.name}</h3>
                <p class="text-gray-300 mb-4">${originData.description}</p>
            </div>
    `;
    
    // Stats Section
    if (gameData.player.stats) {
        content += `
            <div class="stats-section">
                <h4 class="font-cinzel text-xl text-white mb-3 border-b border-gray-600 pb-1">Attributes</h4>
                <div class="grid grid-cols-2 gap-4">
        `;
        
        Object.entries(gameData.player.stats).forEach(([stat, value]) => {
            const statName = stat.charAt(0).toUpperCase() + stat.slice(1);
            const modifier = Math.floor((value - 10) / 2);
            const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            
            content += `
                <div class="stat-block p-3 bg-gray-800 rounded text-center">
                    <div class="stat-name text-gray-300 text-sm">${statName}</div>
                    <div class="stat-value text-white text-xl font-bold">${value}</div>
                    <div class="stat-modifier text-gray-400 text-sm">(${modifierStr})</div>
                </div>
            `;
        });
        
        content += '</div></div>';
    }
    
    // Skills Section - Show D&D 5e style skills
    content += `
        <div class="skills-section">
            <h4 class="font-cinzel text-xl text-white mb-3 border-b border-gray-600 pb-1">Skills & Proficiencies</h4>
            <div class="space-y-2 max-h-96 overflow-y-auto">
    `;
    
    // Group skills by ability
    const abilityGroups = {
        strength: ['athletics'],
        dexterity: ['acrobatics', 'sleightOfHand', 'stealth'],
        intelligence: ['arcana', 'history', 'investigation', 'nature', 'religion'],
        wisdom: ['animalHandling', 'insight', 'medicine', 'perception', 'survival'],
        charisma: ['deception', 'intimidation', 'performance', 'persuasion']
    };
    
    Object.entries(abilityGroups).forEach(([ability, skills]) => {
        const abilityName = ability.charAt(0).toUpperCase() + ability.slice(1);
        content += `<div class="ability-group mb-4">
            <h5 class="text-sm font-semibold text-gray-400 mb-2">${abilityName} Skills</h5>
            <div class="grid grid-cols-1 gap-1">`;
        
        skills.forEach(skillKey => {
            const skill = gameData.player.skills[skillKey];
            const modifier = getSkillModifier(skillKey);
            const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            const displayName = skillDisplayNames[skillKey];
            
            let proficiencyIndicator = '';
            if (skill.expertise) {
                proficiencyIndicator = '<span class="text-yellow-400">★★</span> ';
            } else if (skill.proficient) {
                proficiencyIndicator = '<span class="text-blue-400">★</span> ';
            }
            
            content += `
                <div class="skill-row flex justify-between items-center p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
                     onclick="triggerManualSkillCheck('${skillKey}')">
                    <span class="text-gray-300">
                        ${proficiencyIndicator}${displayName}
                    </span>
                    <span class="text-white font-mono">${modifierStr}</span>
                </div>
            `;
        });
        
        content += '</div></div>';
    });
    
    content += `
            </div>
            <div class="mt-4 p-3 bg-gray-800 rounded text-sm text-gray-400">
                <div><span class="text-blue-400">★</span> = Proficient (+${gameData.player.proficiencyBonus})</div>
                <div><span class="text-yellow-400">★★</span> = Expertise (+${gameData.player.proficiencyBonus * 2})</div>
                <div class="mt-2 text-xs">Click any skill to make a manual check</div>
            </div>
        </div>
    `;
    
    // Lore Section
    if (originData.lore) {
        content += `
            <div class="lore-section">
                <h4 class="font-cinzel text-xl text-white mb-3 border-b border-gray-600 pb-1">Background</h4>
                <p class="text-gray-300">${originData.lore}</p>
            </div>
        `;
    }
    
    content += '</div>';
    characterContentEl.innerHTML = content;
}

function renderInventory() {
    if (!inventoryContentEl) return;
    
    let content = '';
    
    if (gameData.player.inventory.length === 0) {
        content = '<div class="col-span-full text-center py-8"><p class="text-gray-400">Your inventory is empty.</p></div>';
    } else {
        gameData.player.inventory.forEach(itemId => {
            const item = itemsData[itemId];
            if (item) {
                content += `
                    <div class="inventory-slot p-3 bg-gray-800 rounded border border-gray-600 hover:border-gray-400 cursor-pointer" 
                         title="${item.description}" data-item="${itemId}">
                        <div class="item-name text-white text-sm text-center">${item.name}</div>
                        <div class="item-type text-gray-400 text-xs text-center">${item.type}</div>
                    </div>
                `;
            }
        });
    }
    
    inventoryContentEl.innerHTML = content;
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

// Event Listeners
startGameButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    characterCreationScreen.style.display = 'flex';
});

originChoices.forEach(choice => {
    choice.addEventListener('click', () => {
        gameData.player.origin = choice.dataset.origin;
        const originData = classesData[gameData.player.origin];
        if(originData){
            gameData.player.stats = { ...originData.stats };
            gameData.player.inventory = [...originData.startingEquipment];
            
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

// Initialize Game
async function initializeGame() {
    await loadGameData();
    updateDisplay();
    
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

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);

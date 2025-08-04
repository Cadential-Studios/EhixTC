// Core Game Data and Constants
// Edoria: The Triune Convergence - Core Module

// Game Data Structure
const gameData = {
    player: {
        name: 'Adventurer',
        title: '',
        level: 1,
        experience: 0,
        class: null,
        species: null,
        origin: null,
        description: '',
        location: null,
        inventory: [
            { id: 'health_potion', quantity: 3 },
            { id: 'mana_potion', quantity: 2 },
            { id: 'healing_herbs', quantity: 5 },
            { id: 'rations', quantity: 10 },
            { id: 'strength_elixir', quantity: 1 },
            { id: 'wisdom_brew', quantity: 1 },
            { id: 'greater_health_potion', quantity: 1 }
        ],
        equipment: {
            head: null,
            neck: null,
            chest: null,
            clothing: null,
            mainhand: null,
            offhand: null,
            finger1: null,
            finger2: null,
            feet: null,
            waist: null
        },
        quests: { active: [], completed: [] },
        lore: new Set(),
        rumors: new Set(),
        journalPins: new Set(),
        journalNotes: {},
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
        savingThrows: {
            strength: { proficient: false },
            dexterity: { proficient: false },
            constitution: { proficient: false },
            intelligence: { proficient: false },
            wisdom: { proficient: false },
            charisma: { proficient: false }
        },
        proficiencyBonus: 2,
        // Crafting Skills
        craftingSkills: {
            smithing: 1,
            weaponcraft: 0,
            alchemy: 1,
            enchanting: 0,
            leatherworking: 1,
            woodworking: 0,
            cooking: 1,
            arcana: 0
        },
        // Spell and ability resources
        spellSlots: {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        },
        spellSlotsUsed: {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        },
        cantripsKnown: [],
        spellsKnown: [],
        classFeatures: {
            actionSurge: { available: false, used: false },
            rage: { available: false, used: false },
            wildShape: { available: false, used: false },
            channelDivinity: { available: false, used: false },
            sneakAttack: { available: false, dice: 0 },
            lay_on_hands: { available: false, points: 0 }
        },
        classResources: {
            kiPoints: 0,
            sorceryPoints: 0,
            bardic_inspiration: 0,
            warlock_slots: 0
        },
        concentration: {
            active: false,
            spell: null,
            duration: 0
        }

        //todo: add relationships, reputation, renown, etc.
    },
    effects: {
        active: [],
        timers: {}
    },
    time: {
        day: 1,
        month: 0,
        year: 998,
        hour: 8,
        minute: 0,
        isPaused: false,
        realTimeMultiplier: 0.5, // 1 real second = 0.5 game minutes
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
        volume: 1,
        soundEnabled: true,
        showDiceAnimations: true,
        combatAnimationSpeed: 1,
        autoScrollCombatLog: true,
        showStatAnimations: true,
        enableMods: true
    }
};

// Data Storage
let locationsData = {};
let scenesData = {};
let classesData = {};
let presetCharactersData = {};
let speciesData = {};
let itemsData = {};
let recipesData = {};
let questsData = {};
let monstersData = {};
let calendarData = {};
let effectsData = {};
let lootTablesData = {};

/**
 * Base path to JSON data files. Determined at runtime by detectDataPath().
 * @type {string}
 */
let DATA_BASE_PATH = '';

/**
 * Attempts to locate the game's data directory by testing multiple candidate
 * paths. A custom path can be provided via the global `DATA_PATH` variable.
 *
 * @returns {Promise<string>} Resolved base path for all data files
 */
async function detectDataPath() {
    if (window.DATA_PATH) {
        DATA_BASE_PATH = window.DATA_PATH.endsWith('/') ? window.DATA_PATH : `${window.DATA_PATH}/`;
        return DATA_BASE_PATH;
    }

    const candidates = [
        'src/data/',
        'data/',
        './data/',
        '../data/',
        '../src/data/',
        '../../data/'
    ];

    for (const path of candidates) {
        try {
            const resp = await fetch(`${path}locations.json`, { cache: 'no-store' });
            if (resp.ok) {
                DATA_BASE_PATH = path;
                return DATA_BASE_PATH;
            }
        } catch (err) {
            // Ignore failed fetch attempt
        }
    }

    throw new Error('Data path not found');
}

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

// Difficulty Class Constants
const DC = {
    TRIVIAL: 5,
    EASY: 10,
    MEDIUM: 15,
    HARD: 20,
    VERY_HARD: 25,
    NEARLY_IMPOSSIBLE: 30
};

// Save System Constants
const SAVE_KEY = 'edoriaSaves';
const SAVE_SLOT_LIMIT = 5;
let GAME_VERSION = 'dev';

// Utility Functions
function getAbilityModifier(ability) {
    const baseScore = gameData.player.stats[ability] || 10;
    const effectBonus = getActiveEffectBonus ? getActiveEffectBonus(ability) : 0;
    const totalScore = baseScore + effectBonus;
    return Math.floor((totalScore - 10) / 2);
}

function getAbilityScore(ability) {
    const baseScore = gameData.player.stats[ability] || 10;
    const effectBonus = getActiveEffectBonus ? getActiveEffectBonus(ability) : 0;
    return baseScore + effectBonus;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Basic dice rolling function
function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
}


/**
 * Unified dice rolling function.
 * Usage:
 *   rollDice('2d6+3') => { rolls: [n, n], total: n, modifier: 3, expression: '2d6+3', count: 2, sides: 6 }
 *   rollDice(6, 2) => { rolls: [n, n], total: n, modifier: 0, expression: '2d6', count: 2, sides: 6 }
 *   rollDice(20) => { rolls: [n], total: n, modifier: 0, expression: '1d20', count: 1, sides: 20 }
 */
function rollDice(arg1, arg2) {
    let count, sides, modifier = 0, expression;
    if (typeof arg1 === 'string') {
        // Parse dice notation like "2d6+3"
        const match = arg1.match(/(\d+)?d(\d+)([+-]\d+)?/i);
        if (!match) return { rolls: [], total: 0, modifier: 0, expression: arg1, count: 0, sides: 0 };
        count = parseInt(match[1]) || 1;
        sides = parseInt(match[2]);
        modifier = match[3] ? parseInt(match[3]) : 0;
        expression = arg1;
    } else if (typeof arg1 === 'number') {
        sides = arg1;
        count = typeof arg2 === 'number' ? arg2 : 1;
        expression = `${count}d${sides}`;
    } else {
        return { rolls: [], total: 0, modifier: 0, expression: '', count: 0, sides: 0 };
    }
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
    return { rolls, total, modifier, expression, count, sides };
}

// Data Loading Functions
async function loadGameData() {
    try {
        if (!DATA_BASE_PATH) {
            await detectDataPath();
        }
        // Load all JSON data files


        const responses = await Promise.all([
            fetch(`${DATA_BASE_PATH}locations.json`),
            fetch(`${DATA_BASE_PATH}scenes.json`),
            fetch(`${DATA_BASE_PATH}classes.json`),
            fetch(`${DATA_BASE_PATH}preset_characters.json`),
            fetch(`${DATA_BASE_PATH}species.json`),
            fetch(`${DATA_BASE_PATH}recipes.json`),
            fetch(`${DATA_BASE_PATH}quests.json`),
            fetch(`${DATA_BASE_PATH}monsters.json`),
            fetch(`${DATA_BASE_PATH}calendar.json`),
            fetch(`${DATA_BASE_PATH}effects.json`),
            fetch(`${DATA_BASE_PATH}loot_tables/foraging.json`)
        ]);

        const [locationsResponse, scenesResponse, classesResponse, presetCharactersResponse,
               speciesResponse, recipesResponse, questsResponse, monstersResponse,
               calendarResponse, effectsResponse, foragingLootResponse] = responses;

        if (locationsResponse.ok) locationsData = await locationsResponse.json();
        if (scenesResponse.ok) scenesData = await scenesResponse.json();
        if (classesResponse.ok) classesData = await classesResponse.json();
        if (presetCharactersResponse.ok) presetCharactersData = await presetCharactersResponse.json();
        if (speciesResponse.ok) speciesData = await speciesResponse.json();
        if (recipesResponse.ok) recipesData = await recipesResponse.json();
        if (questsResponse.ok) questsData = await questsResponse.json();
        if (monstersResponse.ok) monstersData = await monstersResponse.json();
        // Always assign to gameData.monsters for UI access
        gameData.monsters = monstersData;
        if (calendarResponse.ok) calendarData = await calendarResponse.json();
        if (effectsResponse.ok) effectsData = await effectsResponse.json();
        if (foragingLootResponse.ok) lootTablesData = await foragingLootResponse.json();

        // Load item data from multiple files
        await loadItemData();

        // Use all nature.json item IDs as foragable items
        if (window.itemsData) {
            gameData.foragableItems = Object.keys(window.itemsData).filter(id => window.itemsData[id].type === 'nature');
        } else {
            gameData.foragableItems = [];
        }

        // Load item data from multiple files
        await loadItemData();

        console.log('Game data loaded successfully');
    } catch (error) {
        console.error('Error loading game data:', error);
        loadFallbackData();
    }
}

// --- Item Data Loading ---
async function loadItemData() {
    try {
        const itemBase = `${DATA_BASE_PATH}items/`;
        const modBase = `${DATA_BASE_PATH}mods/items/`;
        const itemFiles = [
            'weapons.json',
            'armor.json',
            'accessories.json',
            'consumables.json',
            'magical.json',
            'tools.json',
            'materials.json',
            'quest_items.json',
            'equipment.json',
            'nature.json'
        ];
        // Use global itemsData
        // Load base item files
        for (const file of itemFiles) {
            try {
                const response = await fetch(`${itemBase}${file}`);
                if (response.ok) {
                    try {
                        const data = await response.json();
                        Object.assign(itemsData, data);
                    } catch (jsonErr) {
                        console.error(`Error parsing JSON for ${file}:`, jsonErr);
                    }
                } else {
                    console.warn(`Item data file not found or failed to load: ${file}`);
                }
            } catch (err) {
                console.error(`Error loading item data file ${file}:`, err);
            }
        }
        // Load modded item files if enabled
        if (gameData.settings.enableMods) {
            for (const file of itemFiles) {
                try {
                    const response = await fetch(`${modBase}${file}`);
                    if (typeof window.failedModItemFiles === 'undefined') {
                        window.failedModItemFiles = [];
                    }
                    if (response.ok) {
                        try {
                            const data = await response.json();
                            Object.assign(itemsData, data);
                        } catch (jsonErr) {
                            console.error(`Error parsing JSON for mod file ${file}:`, jsonErr);
                            window.failedModItemFiles.push(file);
                        }
                    } else {
                        window.failedModItemFiles.push(file);
                    }
                } catch (err) {
                    console.error(`Error loading mod item data file ${file}:`, err);
                }
            }
        }
        window.itemsData = itemsData;
        console.log('Item data loaded successfully:', Object.keys(itemsData).length, 'items');
    } catch (error) {
        console.error('Error loading item data:', error);
        // Fall back to loading from the old items.json if new structure fails
        try {
            const fallbackResponse = await fetch(`${DATA_BASE_PATH}items.json`);
            if (fallbackResponse.ok) {
                const itemsData = await fallbackResponse.json();
                window.itemsData = itemsData;
                console.log('Loaded fallback items.json');
            }
        } catch (fallbackError) {
            console.error('Error loading fallback items:', fallbackError);
        }
    }
}

//! Below is a placeholder. Will be removed once the game can pull item data correctly.

function loadFallbackData() {
    // Fallback data in case JSON files can't be loaded
    console.log('Loading fallback data...');
    
    // Basic fallback items

    /*
    if (Object.keys(itemsData).length === 0) {
        // We don't want fallback items, we want to ensure the game can pull the data.
    }
    */


    
    // Basic fallback classes/origins
    if (Object.keys(presetCharactersData).length === 0) {
        presetCharactersData = {
            'westwalker': {
                name: 'Kael the Westwalker',
                title: 'Ranger of the Frontier',
                description: 'A seasoned ranger who patrols the dangerous borders.',
                class: 'ranger',
                species: 'human',
                level: 1,
                stats: {
                    strength: 12,
                    dexterity: 15,
                    constitution: 13,
                    intelligence: 11,
                    wisdom: 14,
                    charisma: 10
                },
                skills: ['survival', 'tracking', 'archery', 'herbalism'],
                startingEquipment: ['iron_sword', 'leather_armor', 'health_potion']
            },
            'leonin': {
                name: 'Thara M\'ra Kaal',
                title: 'Spirit-Speaker of the Pride',
                description: 'A proud Leonin warrior-priest.',
                class: 'paladin',
                species: 'leonin',
                level: 1,
                stats: {
                    strength: 15,
                    dexterity: 10,
                    constitution: 14,
                    intelligence: 10,
                    wisdom: 13,
                    charisma: 14
                },
                skills: ['spirit_communication', 'combat', 'leadership', 'tribal_lore'],
                startingEquipment: ['steel_dagger', 'amulet_protection', 'health_potion']
            },
            'gaian': {
                name: 'Lyra Starweaver',
                title: 'Scholar of the Convergence',
                description: 'A brilliant young scholar from the Imperial capital.',
                class: 'wizard',
                species: 'human',
                level: 1,
                stats: {
                    strength: 8,
                    dexterity: 12,
                    constitution: 13,
                    intelligence: 15,
                    wisdom: 14,
                    charisma: 11
                },
                skills: ['arcane_knowledge', 'history', 'research', 'linguistics'],
                startingEquipment: ['magic_staff', 'ancient_tome', 'mana_potion']
            }
        };
    }
    
    // Basic fallback species
    if (Object.keys(speciesData).length === 0) {
        speciesData = {
            'human': {
                name: 'Human',
                abilityScoreIncrease: { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
                traits: ['versatile', 'ambitious']
            },
            'leonin': {
                name: 'Leonin',
                abilityScoreIncrease: { constitution: 2, strength: 1 },
                traits: ['daunting_roar', 'hunters_instincts', 'natural_armor']
            }
        };
    }
    
    // Basic fallback locations
    if (Object.keys(locationsData).length === 0) {
        locationsData = {
            'westwalker_camp': {
                name: 'Frontier Camp',
                description: 'A rugged camp on the edge of civilization, where Westwalkers gather to share stories and trade supplies.',
                type: 'settlement',
                actions: [
                    { text: 'Rest at the campfire', type: 'rest' },
                    { text: 'Trade with merchants', type: 'trade' },
                    { text: 'Listen to stories', type: 'lore' },
                    { text: '<i class="ph-duotone ph-sword"></i> Test Combat', type: 'combat', target: 'test_combat' }
                ]
            },
            'leonin_encampment': {
                name: 'M\'ra Kaal Encampment',
                description: 'A spiritual gathering place of the Leonin, where ancient traditions are honored and the spirits are consulted.',
                type: 'settlement',
                actions: [
                    { text: 'Meditate with the spirits', type: 'meditation' },
                    { text: 'Train with warriors', type: 'training' },
                    { text: 'Seek guidance from elders', type: 'guidance' }
                ]
            },
            'gaian_library': {
                name: 'Archive of Knowledge',
                description: 'A grand library containing the collected wisdom of the Gaian Empire, where scholars pursue ancient mysteries.',
                type: 'library',
                actions: [
                    { text: 'Research ancient lore', type: 'research' },
                    { text: 'Study magical texts', type: 'study' },
                    { text: 'Consult with librarians', type: 'consultation' }
                ]
            }
        };
    }
    
    console.log('Fallback data loaded successfully');
}

// Time and Calendar Functions
function advanceTime() {
    gameData.time.day++;
    gameData.moons.edyria.phase = (gameData.moons.edyria.phase + 1) % gameData.moons.edyria.cycle;
    gameData.moons.kapra.phase = (gameData.moons.kapra.phase + 1) % gameData.moons.kapra.cycle;
    gameData.moons.enia.phase = (gameData.moons.enia.phase + 1) % gameData.moons.enia.cycle;
    
    if (gameData.time.day > 40) {
        gameData.time.day = 1;
        gameData.time.month = (gameData.time.month + 1) % gameData.time.months.length;
        if (gameData.time.month === 0) {
            gameData.time.year++;
        }
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
    const phaseThreshold = 3;
    if (Math.abs(edyriaPhase - kapraPhase) <= phaseThreshold && 
        Math.abs(kapraPhase - eniaPhase) <= phaseThreshold &&
        Math.abs(edyriaPhase - eniaPhase) <= phaseThreshold) {
        
        const convergenceLore = "The three moons draw closer in their celestial dance, their combined energies creating ripples across the realms.";
        if (!gameData.player.lore.has(convergenceLore)) {
            gameData.player.lore.add(convergenceLore);
        }
    }
    
    // Individual moon phase events
    if (edyriaPhase === 0) {
        gameData.player.rumors.add("Whispers speak of increased magical energies during Edyria's dark phase.");
    }
    
}

// Effects System
function applyEffect(effectId, source = null) {
    const effectTemplate = effectsData[effectId];
    if (!effectTemplate) {
        console.error(`Effect ${effectId} not found`);
        return false;
    }

    const effect = {
        id: effectId,
        name: effectTemplate.name,
        description: effectTemplate.description,
        type: effectTemplate.type,
        source: source,
        startTime: Date.now(),
        duration: effectTemplate.duration || 0,
        remaining: effectTemplate.duration || 0
    };

    // Handle skill check if present
    if (effectTemplate.skillCheck) {
        const result = performSavingThrow(effectTemplate.skillCheck.attribute, effectTemplate.skillCheck.dc);
        
        // Wait for saving throw animation to complete before proceeding
        setTimeout(() => {
            if (!result.success) {
                // Apply failure effects
                if (effectTemplate.skillCheck.onFail) {
                    const failEffect = effectTemplate.skillCheck.onFail;
                    if (failEffect.type === 'damage') {
                        // Wait for saving throw window to close before showing damage roll
                        setTimeout(() => {
                            // Use simple damage-specific dice rolling (no DC, success/failure indicators)
                            const damageRoll = rollSimpleDamageWithAnimation(4, 0, `${failEffect.damageType || 'Damage'} Roll`);
                            
                            // Apply damage after damage animation completes
                            setTimeout(() => {
                                const damage = damageRoll.roll; // Use .roll for pure dice result
                                gameData.player.derivedStats.health = Math.max(0, gameData.player.derivedStats.health - damage);
                                showInfoBox(`${failEffect.message || 'You take damage!'} (${damage} ${failEffect.damageType} damage)`, 'damage');
                                updateDisplay();
                            }, gameData.settings.showDiceAnimations ? 3000 / gameData.settings.combatAnimationSpeed : 100);
                        }, 500); // Additional delay to ensure saving throw window is fully closed
                    }
                }
            } else {
                // Apply success effects
                if (effectTemplate.skillCheck.onSuccess && effectTemplate.skillCheck.onSuccess.message) {
                    showInfoBox(effectTemplate.skillCheck.onSuccess.message, 'success');
                }
            }
        }, gameData.settings.showDiceAnimations ? 3000 / gameData.settings.combatAnimationSpeed : 100);
    }

    // Apply immediate effects
    if (effectTemplate.effects) {
        effectTemplate.effects.forEach(eff => {
            switch (eff.type) {
                case 'heal':
                    gameData.player.derivedStats.health = Math.min(
                        gameData.player.derivedStats.maxHealth,
                        gameData.player.derivedStats.health + eff.amount
                    );
                    break;
                case 'stat_boost':
                    // These will be handled by the active effects system
                    break;
            }
        });
    }

    // Add to active effects if it has duration
    if (effect.duration > 0) {
        gameData.effects.active.push(effect);
        
        // Set up timer for effect removal
        const timerId = setTimeout(() => {
            removeEffect(effect.id);
        }, effect.duration);
        
        gameData.effects.timers[effect.id] = timerId;
    }

    updateDisplay();
    return true;
}

function removeEffect(effectId) {
    const effectIndex = gameData.effects.active.findIndex(effect => effect.id === effectId);
    if (effectIndex !== -1) {
        const effect = gameData.effects.active[effectIndex];
        gameData.effects.active.splice(effectIndex, 1);
        
        // Clear timer
        if (gameData.effects.timers[effectId]) {
            clearTimeout(gameData.effects.timers[effectId]);
            delete gameData.effects.timers[effectId];
        }
        
        // Show effect ended message
        const effectType = effect.type;
        const colorClass = effectType === 'debuff' ? 'text-red-400' : effectType === 'buff' ? 'text-blue-400' : 'text-yellow-400';
        showInfoBox(`The <span class="${colorClass}">${effect.name}</span> has ended.`, 'info');
        
        updateDisplay();
    }
}

function getActiveEffectBonus(stat) {
    let bonus = 0;
    gameData.effects.active.forEach(effect => {
        const effectTemplate = effectsData[effect.id];
        if (effectTemplate && effectTemplate.effects) {
            effectTemplate.effects.forEach(eff => {
                if (eff.type === 'stat_boost' && eff.attribute === stat) {
                    bonus += eff.amount;
                }
            });
        }
    });
    return bonus;
}

function updateEffectTimers() {
    if (gameData.time.isPaused) return;
    
    const currentTime = Date.now();
    gameData.effects.active.forEach(effect => {
        if (effect.duration > 0) {
            const elapsed = currentTime - effect.startTime;
            effect.remaining = Math.max(0, effect.duration - elapsed);
            
            if (effect.remaining <= 0) {
                removeEffect(effect.id);
            }
        }
    });
}

// Time System Enhancement
let gameTimeInterval;

function startGameTime() {
    if (gameTimeInterval) clearInterval(gameTimeInterval);
    
    gameTimeInterval = setInterval(() => {
        if (!gameData.time.isPaused) {
            // Advance game time
            gameData.time.minute++;
            if (gameData.time.minute >= 60) {
                gameData.time.minute = 0;
                gameData.time.hour++;
                if (gameData.time.hour >= 24) {
                    gameData.time.hour = 0;
                    advanceTime(); // This handles day/month/year advancement
                }
            }
            
            // Update effect timers
            updateEffectTimers();
            
            // Update display
            updateTimeDisplay();
        }
    }, 1000 / gameData.time.realTimeMultiplier); // 1 real second = 1 game minute
}

function pauseTime() {
    gameData.time.isPaused = true;
    updateTimeControlDisplay();
}

function resumeTime() {
    gameData.time.isPaused = false;
    updateTimeControlDisplay();
}

function toggleTime() {
    if (gameData.time.isPaused) {
        resumeTime();
    } else {
        pauseTime();
    }
}

function setTimeSpeed(multiplier) {
    gameData.time.realTimeMultiplier = multiplier;
    startGameTime();
    updateTimeControlDisplay();
}

function formatGameTime() {
    const hour = gameData.time.hour;
    const minute = gameData.time.minute.toString().padStart(2, '0');
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute} ${period}`;
}

function updateTimeDisplay() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = formatGameTime();
    }
}

function updateTimeControlDisplay() {
    const speedSlider = document.getElementById('time-speed-slider');
    if (speedSlider) {
        speedSlider.value = gameData.time.realTimeMultiplier;
    }
    const toggleBtn = document.getElementById('time-toggle-btn');
    if (toggleBtn) {
        toggleBtn.innerHTML = gameData.time.isPaused ? '<i class="ph-duotone ph-play"></i>' : '<i class="ph-duotone ph-pause"></i>';
    }
}

// Dice Rolling System Enhancement
function performSkillCheck(attribute, dc) {
    const rollResult = rollDice('1d20');
    const roll = rollResult.total;
    const modifier = Math.floor((gameData.player.stats[attribute] - 10) / 2);
    const total = roll + modifier;
    showDiceRoll(roll, modifier, total, dc);
    return total >= dc;
}

function showDiceRoll(roll, modifier, total, dc = null, label = '') {
    const success = dc ? total >= dc : true;
    const resultClass = success ? 'text-green-400' : 'text-red-400';
    const dcText = dc ? ` (DC ${dc})` : '';
    const labelText = label ? `${label}: ` : '';
    
    showInfoBox(
        `<div class="dice-roll">
            ${labelText}<span class="text-lg">🎲 ${roll}</span>
            ${modifier !== 0 ? ` + ${modifier}` : ''} = 
            <span class="${resultClass} font-bold">${total}</span>
            ${dcText}
            ${dc ? (success ? ' - Success!' : ' - Failure!') : ''}
        </div>`,
        success ? 'success' : 'failure'
    );
}



function showInfoBox(message, type = 'info') {
    // Create and show info box
    const infoBox = document.createElement('div');
    infoBox.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
    
    // Style based on type
    switch (type) {
        case 'success':
            infoBox.className += ' bg-green-800 border border-green-600 text-green-100';
            break;
        case 'failure':
        case 'damage':
            infoBox.className += ' bg-red-800 border border-red-600 text-red-100';
            break;
        case 'info':
        default:
            infoBox.className += ' bg-gray-800 border border-gray-600 text-gray-100';
            break;
    }
    
    infoBox.innerHTML = message;
    document.body.appendChild(infoBox);
    
    // Animate in
    setTimeout(() => {
        infoBox.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        infoBox.classList.add('translate-x-full');
        setTimeout(() => {
            if (infoBox.parentNode) {
                infoBox.parentNode.removeChild(infoBox);
            }
        }, 300);

    }, 3000);
}

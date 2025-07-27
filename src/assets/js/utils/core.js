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
        showStatAnimations: true
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

function rollDice(sides, count = 1) {
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    return rolls;
}

// Data Loading Functions
async function loadGameData() {
    try {
        // Load all JSON data files
        const responses = await Promise.all([
            fetch('./data/locations.json'),
            fetch('./data/scenes.json'),
            fetch('./data/classes.json'),
            fetch('./data/preset_characters.json'),
            fetch('./data/species.json'),
            fetch('./data/recipes.json'),
            fetch('./data/quests.json'),
            fetch('./data/monsters.json'),
            fetch('./data/calendar.json'),
            fetch('./data/effects.json')
        ]);

        const [locationsResponse, scenesResponse, classesResponse, presetCharactersResponse, 
               speciesResponse, recipesResponse, questsResponse, monstersResponse, calendarResponse, effectsResponse] = responses;

        if (locationsResponse.ok) locationsData = await locationsResponse.json();
        if (scenesResponse.ok) scenesData = await scenesResponse.json();
        if (classesResponse.ok) classesData = await classesResponse.json();
        if (presetCharactersResponse.ok) presetCharactersData = await presetCharactersResponse.json();
        if (speciesResponse.ok) speciesData = await speciesResponse.json();
        if (recipesResponse.ok) recipesData = await recipesResponse.json();
        if (questsResponse.ok) questsData = await questsResponse.json();
        if (monstersResponse.ok) monstersData = await monstersResponse.json();
        if (calendarResponse.ok) calendarData = await calendarResponse.json();
        if (effectsResponse.ok) effectsData = await effectsResponse.json();

        // Load item data from multiple files
        await loadItemData();

        console.log('Game data loaded successfully');
    } catch (error) {
        console.error('Error loading game data:', error);
        loadFallbackData();
    }
}

async function loadItemData() {
    try {
        // Load all item category files
        const itemResponses = await Promise.all([
            fetch('./data/item_data/weapons.json'),
            fetch('./data/item_data/armor.json'),
            fetch('./data/item_data/accessories.json'),
            fetch('./data/item_data/consumables.json'),
            fetch('./data/item_data/magical.json'),
            fetch('./data/item_data/tools.json'),
            fetch('./data/item_data/materials.json'),
            fetch('./data/item_data/quest_items.json'),
            fetch('./data/item_data/equipment.json')
        ]);

        const [weaponsResponse, armorResponse, accessoriesResponse, consumablesResponse, 
               magicalResponse, toolsResponse, materialsResponse, questItemsResponse, equipmentResponse] = itemResponses;

        // Initialize empty items data object
        itemsData = {};

        // Merge all item categories into the main itemsData object
        if (weaponsResponse.ok) {
            const weapons = await weaponsResponse.json();
            Object.assign(itemsData, weapons);
        }
        if (armorResponse.ok) {
            const armor = await armorResponse.json();
            Object.assign(itemsData, armor);
        }
        if (accessoriesResponse.ok) {
            const accessories = await accessoriesResponse.json();
            Object.assign(itemsData, accessories);
        }
        if (consumablesResponse.ok) {
            const consumables = await consumablesResponse.json();
            Object.assign(itemsData, consumables);
        }
        if (magicalResponse.ok) {
            const magical = await magicalResponse.json();
            Object.assign(itemsData, magical);
        }
        if (toolsResponse.ok) {
            const tools = await toolsResponse.json();
            Object.assign(itemsData, tools);
        }
        if (materialsResponse.ok) {
            const materials = await materialsResponse.json();
            Object.assign(itemsData, materials);
        }
        if (questItemsResponse.ok) {
            const questItems = await questItemsResponse.json();
            Object.assign(itemsData, questItems);
        }
        if (equipmentResponse.ok) {
            const equipment = await equipmentResponse.json();
            Object.assign(itemsData, equipment);
        }

        console.log('Item data loaded successfully:', Object.keys(itemsData).length, 'items');
    } catch (error) {
        console.error('Error loading item data:', error);
        // Fall back to loading from the old items.json if new structure fails
        try {
            const fallbackResponse = await fetch('./data/items.json');
            if (fallbackResponse.ok) {
                itemsData = await fallbackResponse.json();
                console.log('Loaded fallback items.json');
            }
        } catch (fallbackError) {
            console.error('Error loading fallback items:', fallbackError);
        }
    }
}

function loadFallbackData() {
    // Fallback data in case JSON files can't be loaded
    console.log('Loading fallback data...');
    
    // Basic fallback items
    if (Object.keys(itemsData).length === 0) {
        itemsData = {
            'iron_sword': {
                name: 'Iron Sword',
                type: 'weapon',
                subtype: 'sword',
                slot: 'mainhand',
                damage: '1d8',
                damageType: 'slashing',
                weight: 3,
                value: 10,
                rarity: 'common',
                description: 'A sturdy iron sword with a sharp edge.',
                statBonus: { strength: 1 }
            },
            'steel_dagger': {
                name: 'Steel Dagger',
                type: 'weapon',
                subtype: 'sword',
                slot: 'mainhand',
                damage: '1d4',
                damageType: 'piercing',
                weight: 1,
                value: 5,
                rarity: 'common',
                description: 'A light and quick steel dagger.',
                statBonus: { dexterity: 1 }
            },
            'magic_staff': {
                name: 'Arcane Staff',
                type: 'weapon',
                subtype: 'staff',
                slot: 'mainhand',
                damage: '1d6',
                damageType: 'magical',
                weight: 4,
                value: 25,
                rarity: 'uncommon',
                description: 'A staff crackling with arcane energy.',
                statBonus: { intelligence: 2 }
            },
            'leather_armor': {
                name: 'Leather Armor',
                type: 'armor',
                subtype: 'light',
                slot: 'chest',
                armorClass: 11,
                maxDexMod: null,
                weight: 10,
                value: 10,
                rarity: 'common',
                description: 'Flexible leather armor that doesn\'t restrict movement.'
            },
            'chain_mail': {
                name: 'Chain Mail',
                type: 'armor',
                subtype: 'medium',
                slot: 'chest',
                armorClass: 13,
                maxDexMod: 2,
                weight: 20,
                value: 50,
                rarity: 'uncommon',
                description: 'Interlocking metal rings provide solid protection.'
            },
            'wooden_shield': {
                name: 'Wooden Shield',
                type: 'armor',
                subtype: 'shield',
                slot: 'offhand',
                armorClass: 2,
                weight: 6,
                value: 5,
                rarity: 'common',
                description: 'A simple wooden shield reinforced with iron bands.'
            },
            'health_potion': {
                name: 'Health Potion',
                type: 'consumable',
                slot: 'none',
                effect: 'heal:2d4+2',
                weight: 0.5,
                value: 5,
                uses: 1,
                rarity: 'common',
                description: 'A red potion that restores health when consumed.'
            },
            'mana_potion': {
                name: 'Mana Potion',
                type: 'consumable',
                slot: 'none',
                effect: 'restore_mana:1d4+1',
                weight: 0.5,
                value: 8,
                uses: 1,
                rarity: 'common',
                description: 'A blue potion that restores magical energy.'
            },
            'bread': {
                name: 'Bread',
                type: 'consumable',
                slot: 'none',
                effect: 'sustenance',
                weight: 0.5,
                value: 1,
                uses: 1,
                rarity: 'common',
                description: 'Fresh baked bread that satisfies hunger.'
            },
            'silver_ring': {
                name: 'Silver Ring',
                type: 'accessory',
                slot: 'finger',
                weight: 0.1,
                value: 25,
                rarity: 'uncommon',
                description: 'A finely crafted silver ring.',
                statBonus: { charisma: 1 }
            },
            'amulet_protection': {
                name: 'Amulet of Protection',
                type: 'accessory',
                slot: 'neck',
                weight: 0.2,
                value: 100,
                rarity: 'rare',
                description: 'An amulet that wards off evil.',
                statBonus: { constitution: 2 }
            },
            'ancient_tome': {
                name: 'Ancient Tome',
                type: 'quest',
                slot: 'none',
                weight: 2,
                value: 0,
                rarity: 'legendary',
                description: 'A mysterious book filled with arcane knowledge.'
            },
            'iron_ore': {
                name: 'Iron Ore',
                type: 'material',
                slot: 'none',
                weight: 1,
                value: 2,
                rarity: 'common',
                description: 'Raw iron ore suitable for forging.'
            },
            'magic_crystal': {
                name: 'Magic Crystal',
                type: 'material',
                slot: 'none',
                weight: 0.5,
                value: 15,
                rarity: 'rare',
                description: 'A crystal that glows with inner light.'
            }
        };
    }
    
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
    const playPauseBtn = document.getElementById('time-play-pause');
    if (playPauseBtn) {
        playPauseBtn.innerHTML = gameData.time.isPaused ? 
            '<i class="fas fa-play"></i>' : 
            '<i class="fas fa-pause"></i>';
        playPauseBtn.title = gameData.time.isPaused ? 'Resume Time' : 'Pause Time';
    }
}

// Dice Rolling System Enhancement
function performSkillCheck(attribute, dc) {
    const roll = rollDice('1d20');
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

function rollDice(diceNotation) {
    // Parse dice notation like "1d4", "2d6+3", etc.
    const match = diceNotation.match(/(\d+)d(\d+)(?:\+(\d+))?/);
    if (!match) return 0;
    
    const numDice = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = parseInt(match[3]) || 0;
    
    let total = modifier;
    for (let i = 0; i < numDice; i++) {
        total += Math.floor(Math.random() * sides) + 1;
    }
    
    return total;
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

    if (edyriaPhase === 0) {
        gameData.player.rumors.add("Whispers speak of increased magical energies during Edyria's dark phase.");
    }
    
    if (kapraPhase === Math.floor(gameData.moons.kapra.cycle / 2)) {
        gameData.player.rumors.add("The red light of Kapra's full phase stirs restless spirits in the night.");
    }
    
    if (eniaPhase === Math.floor(gameData.moons.enia.cycle / 2)) {
        gameData.player.rumors.add("Enia's golden glow brings luck to travelers and fortune to merchants.");
    }


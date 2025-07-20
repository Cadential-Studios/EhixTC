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
            'iron_sword', 'health_potion', 'health_potion', 'mana_potion', 'bread', 'bread', 'bread',
            'steel_dagger', 'leather_armor', 'wooden_shield', 'silver_ring', 'iron_ore', 'iron_ore',
            { id: 'health_potion', quantity: 3 }, { id: 'magic_crystal', quantity: 2 }, 'ancient_tome',
            'amulet_protection', 'chain_mail', 'magic_staff'
        ],
        equipment: {
            head: null,
            neck: null,
            chest: null,
            armor: null, //* Slot will be used for equipping armor pieces.
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
        experienceToNext: 300,
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
const GAME_VERSION = '0.1.0';

// Utility Functions
function getAbilityModifier(ability) {
    const score = gameData.player.stats[ability] || 10;
    return Math.floor((score - 10) / 2);
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
            fetch('./data/items.json'),
            fetch('./data/quests.json'),
            fetch('./data/monsters.json'),
            fetch('./data/calendar.json')
        ]);

        const [locationsResponse, scenesResponse, classesResponse, presetCharactersResponse, 
               speciesResponse, itemsResponse, questsResponse, monstersResponse, calendarResponse] = responses;

        if (locationsResponse.ok) locationsData = await locationsResponse.json();
        if (scenesResponse.ok) scenesData = await scenesResponse.json();
        if (classesResponse.ok) classesData = await classesResponse.json();
        if (presetCharactersResponse.ok) presetCharactersData = await presetCharactersResponse.json();
        if (speciesResponse.ok) speciesData = await speciesResponse.json();
        if (itemsResponse.ok) itemsData = await itemsResponse.json();
        if (questsResponse.ok) questsData = await questsResponse.json();
        if (monstersResponse.ok) monstersData = await monstersResponse.json();
        if (calendarResponse.ok) calendarData = await calendarResponse.json();

        console.log('Game data loaded successfully');
    } catch (error) {
        console.error('Error loading game data:', error);
        loadFallbackData();
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
    
    if (kapraPhase === Math.floor(gameData.moons.kapra.cycle / 2)) {
        gameData.player.rumors.add("The red light of Kapra's full phase stirs restless spirits in the night.");
    }
    
    if (eniaPhase === Math.floor(gameData.moons.enia.cycle / 2)) {
        gameData.player.rumors.add("Enia's golden glow brings luck to travelers and fortune to merchants.");
    }
}

// Main Game Initialization Module
// Edoria: The Triune Convergence - Main Controller

console.log('🎮 Main.js loaded successfully');

// Helper function to map class skills to game skills
function mapClassSkillToGameSkill(classSkill) {
    const skillMapping = {
        'survival': 'survival',
        'tracking': 'survival',
        'archery': 'rangedCombat',
        'herbalism': 'nature',
        'spirit_communication': 'religion',
        'combat': 'meleeCombat',
        'leadership': 'persuasion',
        'tribal_lore': 'history',
        'arcane_knowledge': 'arcana',
        'history': 'history',
        'research': 'investigation',
        'linguistics': 'arcana'
    };
    
    return skillMapping[classSkill] || classSkill;
}

// Global DOM element references (initialized after DOM load)
let startScreen, characterCreationScreen, gameScreen;
let startGameButton, originChoices, navButtons, closePanelButtons;
let mainContentEl, dateEl, monthDescEl;
let moonEdyriaEl, moonKapraEl, moonEniaEl;
let uiPanels, characterContentEl, journalContentEl, inventoryContentEl, settingsContent;

function initializeDOMReferences() {
    console.log('Initializing DOM references...');
    
    // Screen elements
    startScreen = document.getElementById('start-screen');
    characterCreationScreen = document.getElementById('character-creation-screen');
    gameScreen = document.getElementById('game-screen');
    
    // Interactive elements
    startGameButton = document.getElementById('start-game-button');
    originChoices = document.querySelectorAll('#character-creation-screen .choice-button');
    navButtons = document.querySelectorAll('.nav-icon');
    uiPanels = document.querySelectorAll('.ui-panel');
    closePanelButtons = document.querySelectorAll('.close-panel-btn');
    
    // Content elements
    mainContentEl = document.getElementById('main-content');
    dateEl = document.getElementById('current-date');
    monthDescEl = document.getElementById('month-description');
    
    // Moon elements
    moonEdyriaEl = document.getElementById('moon-edyria');
    moonKapraEl = document.getElementById('moon-kapra');
    moonEniaEl = document.getElementById('moon-enia');
    
    // Panel content elements
    characterContentEl = document.getElementById('character-content');
    journalContentEl = document.getElementById('journal-content');
    inventoryContentEl = document.getElementById('inventory-content');
    settingsContent = document.getElementById('settings-content');
    
    console.log('DOM references initialized');
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Start button
    const startBtn = document.getElementById('start-game-button');
    console.log('Start button found:', !!startBtn);
    
    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            console.log('Start button clicked!');
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
            console.log('Character choice clicked:', choice.dataset.origin);
            gameData.player.origin = choice.dataset.origin;
            const characterData = presetCharactersData[gameData.player.origin];
            
            console.log('Character data:', characterData);
            console.log('Player data before loading:', { ...gameData.player });
            
            if(characterData){
                // Load ALL character data, replacing defaults
                gameData.player.name = characterData.name || gameData.player.name;
                gameData.player.title = characterData.title || gameData.player.title;
                gameData.player.class = characterData.class || gameData.player.class;
                gameData.player.species = characterData.species || gameData.player.species;
                gameData.player.level = characterData.level || gameData.player.level;
                gameData.player.description = characterData.description || gameData.player.description;
                gameData.player.experience = characterData.experience || gameData.player.experience;
                
                // Load character stats (replace default stats with character stats)
                if (characterData.stats) {
                    console.log('Applying character stats:', characterData.stats);
                    Object.entries(characterData.stats).forEach(([stat, value]) => {
                        if (gameData.player.stats[stat] !== undefined) {
                            gameData.player.stats[stat] = value;
                            console.log(`Set ${stat} to ${value}`);
                        }
                    });
                }
                
                // Load character inventory (replace starting inventory)
                if (characterData.startingEquipment && Array.isArray(characterData.startingEquipment)) {
                    gameData.player.inventory = [];  // Clear default inventory
                    characterData.startingEquipment.forEach(itemId => {
                        gameData.player.inventory.push({ id: itemId, quantity: 1 });
                    });
                    console.log('Loaded starting equipment:', gameData.player.inventory);
                }
                
                // Load character-specific crafting skills if provided
                if (characterData.craftingSkills) {
                    Object.entries(characterData.craftingSkills).forEach(([skill, level]) => {
                        if (gameData.player.craftingSkills[skill] !== undefined) {
                            gameData.player.craftingSkills[skill] = level;
                            console.log(`Set crafting skill ${skill} to ${level}`);
                        }
                    });
                } else {
                    // Set default crafting skills based on character class
                    setDefaultCraftingSkills(characterData.class);
                }
                
                // Load character background and traits
                if (characterData.background) {
                    gameData.player.background = characterData.background;
                }
                if (characterData.personalityTraits) {
                    gameData.player.personalityTraits = characterData.personalityTraits;
                }
                if (characterData.lore) {
                    gameData.player.lore.add(characterData.lore);
                }
                
                // Apply species bonuses
                const species = speciesData[characterData.species];
                if (species && species.abilityScoreIncrease) {
                    console.log('Applying species bonuses:', species.abilityScoreIncrease);
                    Object.entries(species.abilityScoreIncrease).forEach(([stat, bonus]) => {
                        if (gameData.player.stats[stat] !== undefined) {
                            gameData.player.stats[stat] += bonus;
                            console.log(`Added ${bonus} to ${stat}`);
                        }
                    });
                }
                
                console.log('Player stats after:', { ...gameData.player.stats });
                
                // Load starting equipment (handled above in comprehensive character loading)
                
                // Set initial skills if specified
                if (characterData.skillProficiencies) {
                    characterData.skillProficiencies.forEach(skill => {
                        if (gameData.player.skills[skill]) {
                            gameData.player.skills[skill].proficient = true;
                        }
                    });
                } else if (characterData.skills) {
                    // Handle skills array from preset characters
                    characterData.skills.forEach(skill => {
                        // Map character skill names to game skill names if needed
                        const mappedSkill = mapClassSkillToGameSkill(skill);
                        if (gameData.player.skills[mappedSkill]) {
                            gameData.player.skills[mappedSkill].proficient = true;
                        }
                    });
                }
                
                // Recalculate derived stats like HP, modifiers, etc.
                recalculateStats();
                
                console.log('Final player data after loading:', gameData.player);
                console.log('Player HP:', gameData.player.currentHitPoints, '/', gameData.player.maxHitPoints);
            } else {
                console.error('No character data found for:', gameData.player.origin);
            }
            
            characterCreationScreen.style.display = 'none';
            gameScreen.style.display = 'flex';
            
            let startLocation;
            if (gameData.player.origin === 'westwalker') {
                startLocation = 'westwalker_camp';
            } else if (gameData.player.origin === 'leonin') {
                startLocation = 'leonin_encampment';
            } else {
                startLocation = 'gaian_library';
            }
            
            renderLocation(startLocation);
        });
    });

// Function to set default crafting skills based on character class
function setDefaultCraftingSkills(characterClass) {
    // Reset all crafting skills to 0 first
    Object.keys(gameData.player.craftingSkills).forEach(skill => {
        gameData.player.craftingSkills[skill] = 0;
    });
    
    // Set class-specific crafting skills
    switch(characterClass) {
        case 'ranger':
            gameData.player.craftingSkills.woodworking = 2;
            gameData.player.craftingSkills.leatherworking = 2;
            gameData.player.craftingSkills.alchemy = 1;
            gameData.player.craftingSkills.cooking = 2;
            break;
        case 'paladin':
            gameData.player.craftingSkills.smithing = 2;
            gameData.player.craftingSkills.weaponcraft = 1;
            gameData.player.craftingSkills.enchanting = 1;
            gameData.player.craftingSkills.leatherworking = 1;
            break;
        case 'wizard':
            gameData.player.craftingSkills.alchemy = 3;
            gameData.player.craftingSkills.enchanting = 2;
            gameData.player.craftingSkills.arcana = 3;
            gameData.player.craftingSkills.cooking = 1;
            break;
        case 'fighter':
            gameData.player.craftingSkills.smithing = 2;
            gameData.player.craftingSkills.weaponcraft = 2;
            gameData.player.craftingSkills.leatherworking = 1;
            break;
        case 'rogue':
            gameData.player.craftingSkills.alchemy = 2;
            gameData.player.craftingSkills.leatherworking = 2;
            gameData.player.craftingSkills.cooking = 1;
            break;
        default:
            // Default skills for unknown classes
            gameData.player.craftingSkills.smithing = 1;
            gameData.player.craftingSkills.alchemy = 1;
            gameData.player.craftingSkills.cooking = 1;
            gameData.player.craftingSkills.leatherworking = 1;
            break;
    }
    
    console.log(`Set default crafting skills for ${characterClass}:`, gameData.player.craftingSkills);
}

    // Navigation buttons
    navButtons.forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel)));
    closePanelButtons.forEach(button => button.addEventListener('click', closeAllPanels));
    
    console.log('Event listeners setup complete');
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Escape key closes modals and panels
        if (e.key === 'Escape') {
            closeAllPanels();
            closeModal();
        }
        
        // Quick panel shortcuts (Ctrl + key)
        if (e.ctrlKey) {
            switch(e.key) {
                case 'i':
                    e.preventDefault();
                    openPanel('inventory-panel');
                    break;
                case 'c':
                    e.preventDefault();
                    openPanel('character-panel');
                    break;
                case 'j':
                    e.preventDefault();
                    openPanel('journal-panel');
                    break;
                case 's':
                    e.preventDefault();
                    openPanel('settings-panel');
                    break;
            }
        }
    });
}

// Initialize Game
async function initializeGame() {
    console.log('Initializing game...');
    
    // Initialize DOM references first
    initializeDOMReferences();
    
    // Check if critical elements exist
    console.log('Start button exists:', !!document.getElementById('start-game-button'));
    console.log('Start screen exists:', !!document.getElementById('start-screen'));
    console.log('Character creation screen exists:', !!document.getElementById('character-creation-screen'));
    
    await loadGameData();
    
    // Initialize crafting system after data is loaded
    craftingManager.initialize();
    
    // Initialize time system
    startGameTime();
    updateTimeDisplay();
    updateTimeControlDisplay();
    
    // Load fallback scenes if needed
    loadFallbackScenes();
    
    // Enhance locations with skill checks
    enhanceLocationsWithSkillChecks();
    
    updateDisplay();
    
    // Set up event listeners after everything is loaded
    setupEventListeners();
    setupKeyboardShortcuts();
    
    // Add some test journal entries to demonstrate the system
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
    
    // Initialize experience system after everything is loaded
    if (typeof initializeExperienceSystem === 'function') {
        initializeExperienceSystem();
    }
    
    console.log('Game initialization complete!');
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeGame);

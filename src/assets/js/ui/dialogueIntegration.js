/**
 * Dialogue Integration for Edoria: The Triune Convergence
 * Connects the YAML dialogue system with the game's UI and state management
 */

class DialogueIntegration {
    constructor() {
        this.dialogueSystem = new YAMLDialogueSystem();
        this.dialogueModal = null;
        this.currentDialogueData = null;
        this.isDialogueActive = false;
        this.dialogueData = {}; // Store loaded dialogue data from YAML files
        this.dialogueLoaded = false; // Track if dialogue files have been loaded
        
        this.initializeDialogueUI();
    }

    /**
     * Initialize the dialogue UI modal
     */
    initializeDialogueUI() {
        // Create dialogue modal HTML
        const modalHTML = `
            <div id="dialogue-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" style="display: none;">
                <div class="bg-gray-800 border border-yellow-600 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-2xl">
                    <div class="flex items-center mb-4">
                        <div class="w-16 h-16 bg-gray-700 rounded-full mr-4 flex items-center justify-center">
                            <i class="ph-duotone ph-user text-yellow-400 text-2xl"></i>
                        </div>
                        <div>
                            <h3 id="dialogue-character-name" class="font-cinzel text-xl text-yellow-400"></h3>
                            <p id="dialogue-character-title" class="text-gray-400 text-sm"></p>
                        </div>
                    </div>
                    
                    <div id="dialogue-text" class="text-gray-200 mb-6 min-h-16 text-lg leading-relaxed"></div>
                    
                    <div id="dialogue-responses" class="space-y-2"></div>
                    
                    <div id="dialogue-skill-check" class="mt-4 p-3 bg-blue-900 rounded border hidden">
                        <p class="text-blue-200 text-sm mb-2">Skill Check Required</p>
                        <div id="skill-check-details" class="text-blue-100"></div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.dialogueModal = document.getElementById('dialogue-modal');
    }

    /**
     * Load dialogue files
     */
    async loadDialogueFiles() {
        // Define all dialogue files to load
        const dialogueFiles = [
            'characters/village_elder.yaml',
            'characters/general_merchant.yaml',
            'characters/town_guard.yaml',
            'locations/tavern.yaml'
        ];

        let totalLoaded = 0;
        let totalErrors = 0;

        for (const file of dialogueFiles) {
            try {
                console.log(`Loading dialogue file: ${file}`);
                const response = await fetch(`src/data/dialogue/${file}`);
                
                if (!response.ok) {
                    console.warn(`Dialogue file not found: ${file} (${response.status})`);
                    continue;
                }
                
                const yamlContent = await response.text();
                
                // Convert YAML to JSON (in production, use a proper YAML parser)
                const dialogueData = await this.convertYAMLToJSON(yamlContent, file);
                
                if (dialogueData && dialogueData.dialogue_trees) {
                    // Store the dialogue data with a key based on filename
                    const fileKey = file.split('/').pop().replace('.yaml', '');
                    this.dialogueData[fileKey] = dialogueData;
                    
                    await this.dialogueSystem.loadDialogueFromYAML(dialogueData);
                    totalLoaded++;
                    console.log(`✓ Loaded ${dialogueData.dialogue_trees.length} dialogue tree(s) from ${file}`);
                } else {
                    console.warn(`No dialogue trees found in ${file}`);
                }
                
            } catch (error) {
                console.error(`Error loading dialogue file ${file}:`, error);
                totalErrors++;
            }
        }

        // Mark dialogue as loaded
        this.dialogueLoaded = true;

        console.log(`Dialogue loading complete: ${totalLoaded} files loaded, ${totalErrors} errors`);
        console.log('Available dialogue data:', Object.keys(this.dialogueData));
        
        if (totalLoaded === 0) {
            console.warn('No dialogue files were loaded successfully. Using fallback dialogue.');
            await this.loadFallbackDialogue();
        }
    }

    /**
     * Convert YAML to JSON using js-yaml parser
     */
    async convertYAMLToJSON(yamlContent, filename = 'unknown') {
        try {
            // Use js-yaml to parse the YAML content
            if (typeof jsyaml !== 'undefined') {
                const parsedData = jsyaml.load(yamlContent);
                console.log(`Successfully parsed YAML for ${filename}`);
                return parsedData;
            } else {
                console.warn('js-yaml library not available, attempting JSON fallback');
                // Fallback to JSON parsing if js-yaml isn't available
                return JSON.parse(yamlContent);
            }
        } catch (error) {
            console.error(`Error parsing YAML content for ${filename}:`, error);
            // Return empty dialogue structure if parsing fails
            return { dialogue_trees: [] };
        }
    }

    /**
     * Load fallback dialogue when files aren't available
     */
    async loadFallbackDialogue() {
        const fallbackData = {
            dialogue_trees: [
                {
                    id: "fallback_greeting",
                    character: "Unknown NPC",
                    location: "unknown",
                    priority: 1,
                    repeatable: true,
                    root: "greeting",
                    nodes: {
                        greeting: {
                            text: [{ default: "Hello there, traveler." }],
                            responses: [
                                { text: "Hello.", next: "end" }
                            ]
                        },
                        end: {
                            text: [{ default: "Safe travels." }],
                            responses: []
                        }
                    }
                }
            ]
        };
        
        await this.dialogueSystem.loadDialogueFromYAML(fallbackData);
        console.log('Fallback dialogue loaded');
    }

    /**
     * Get dialogue data for a specific NPC/character
     * @param {string} characterName - The name of the character
     * @returns {Object|null} - The dialogue data or null if not found
     */
    getDialogueForCharacter(characterName) {
        if (!this.dialogueLoaded) {
            console.warn('Dialogue not loaded yet. Call loadDialogueFiles() first.');
            return null;
        }

        // Create mapping from character names to file keys
        const characterMapping = {
            'Village Elder': 'village_elder',
            'General Merchant': 'general_merchant', 
            'Town Guard': 'town_guard',
            'Innkeeper': 'tavern'
        };

        const fileKey = characterMapping[characterName];
        if (fileKey && this.dialogueData[fileKey]) {
            return this.dialogueData[fileKey];
        }

        console.warn(`No dialogue data found for character: ${characterName}`);
        return null;
    }

    /**
     * Get Village Elder dialogue data
     */
    getVillageElderDialogue() {
        return {
            dialogue_trees: [
                {
                    id: "village_elder_greeting",
                    character: "Village Elder",
                    location: "elder_hut",
                    priority: 1,
                    repeatable: true,
                    root: "greeting",
                    conditions: [
                        { type: "time_of_day", hours: [6,7,8,9,10,11,12,13,14,15,16,17,18] },
                        { type: "level_requirement", min_level: 1 }
                    ],
                    variables: {
                        trust_level: 0,
                        first_meeting: true,
                        wisdom_shared: false
                    },
                    nodes: {
                        greeting: {
                            text: [
                                {
                                    condition: { type: "variable", variable: "first_meeting", value: true },
                                    text: "Welcome, young traveler. I am Aldric, elder of this village. What brings you to our humble settlement?"
                                },
                                {
                                    condition: { type: "variable", variable: "trust_level", min_value: 20 },
                                    text: "Ah, my trusted friend returns! How fare your adventures?"
                                },
                                { default: "Good day, adventurer. How may this old man assist you?" }
                            ],
                            on_enter: [
                                { type: "set_variable", variable: "first_meeting", value: false },
                                { type: "play_sound", sound_id: "elder_greeting" }
                            ],
                            responses: [
                                {
                                    text: "I seek wisdom and guidance.",
                                    next: "wisdom_request",
                                    conditions: [{ type: "variable", variable: "trust_level", min_value: 5 }]
                                },
                                { text: "Tell me about this village.", next: "village_info" },
                                {
                                    text: "Do you have any work for me?",
                                    next: "quest_inquiry",
                                    conditions: [{ type: "level_requirement", min_level: 2 }]
                                },
                                { text: "I should be going.", next: "farewell" }
                            ]
                        },
                        farewell: {
                            text: [
                                { default: "Farewell, traveler. May fortune smile upon your journey." }
                            ],
                            on_enter: [{ type: "save_dialogue_state" }],
                            responses: []
                        }
                    }
                }
            ]
        };
    }

    /**
     * Start a dialogue with an NPC
     */
    startDialogue(characterName, player, gameState) {
        const availableDialogues = this.dialogueSystem.getAvailableDialogues(characterName, player, gameState);
        
        if (availableDialogues.length === 0) {
            console.log(`No available dialogues for ${characterName}`);
            return false;
        }

        // Start the highest priority dialogue
        const dialogue = availableDialogues[0];
        this.currentDialogueData = this.dialogueSystem.startDialogue(dialogue.id, player, gameState);
        
        if (this.currentDialogueData) {
            this.showDialogue();
            this.isDialogueActive = true;
            return true;
        }

        return false;
    }

    /**
     * Display the dialogue modal
     */
    showDialogue() {
        if (!this.currentDialogueData) return;

        // Update character info
        document.getElementById('dialogue-character-name').textContent = this.currentDialogueData.character;
        
        // Update dialogue text
        document.getElementById('dialogue-text').textContent = this.currentDialogueData.text;
        
        // Update responses
        this.updateResponseButtons();
        
        // Show modal
        this.dialogueModal.style.display = 'flex';
        
        // Pause game time if it's running
        if (window.timeManager && window.timeManager.isRunning) {
            window.timeManager.pause();
        }
    }

    /**
     * Update response buttons
     */
    updateResponseButtons() {
        const responsesContainer = document.getElementById('dialogue-responses');
        responsesContainer.innerHTML = '';

        this.currentDialogueData.responses.forEach((response, index) => {
            const button = document.createElement('button');
            button.className = 'w-full text-left p-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded transition-colors duration-200';
            button.textContent = response.text;
            
            // Add cost indicator if applicable
            if (response.cost) {
                const costSpan = document.createElement('span');
                costSpan.className = 'text-yellow-400 text-sm ml-2';
                costSpan.textContent = `(${response.cost.gold} gold)`;
                button.appendChild(costSpan);
            }

            // Add skill check indicator
            if (response.skill_check) {
                const skillSpan = document.createElement('span');
                skillSpan.className = 'text-blue-400 text-sm ml-2';
                skillSpan.textContent = `[${response.skill_check.skill.charAt(0).toUpperCase() + response.skill_check.skill.slice(1)} DC ${response.skill_check.difficulty}]`;
                button.appendChild(skillSpan);
            }

            button.addEventListener('click', () => this.selectResponse(index));
            responsesContainer.appendChild(button);
        });
    }

    /**
     * Handle response selection
     */
    selectResponse(responseIndex) {
        const player = gameData.player;
        const gameState = {
            quests: gameData.quests || {},
            flags: gameData.flags || {},
            relationships: gameData.relationships || {},
            time: gameData.time || { hour: 12 }
        };

        this.currentDialogueData = this.dialogueSystem.processResponse(responseIndex, player, gameState);

        if (this.currentDialogueData.error) {
            // Show error message
            showGameMessage(this.currentDialogueData.error, 'warning');
            return;
        }

        if (this.currentDialogueData.ended) {
            this.endDialogue();
        } else {
            this.showDialogue();
        }
    }

    /**
     * End the current dialogue
     */
    endDialogue() {
        this.dialogueModal.style.display = 'none';
        this.currentDialogueData = null;
        this.isDialogueActive = false;

        // Resume game time
        if (window.timeManager && !window.timeManager.isRunning) {
            window.timeManager.resume();
        }

        // Refresh UI to show any changes
        if (window.refreshUI) {
            window.refreshUI();
        }
    }

    /**
     * Check if dialogue is currently active
     */
    isActive() {
        return this.isDialogueActive;
    }
}

// Initialize the dialogue system when the script loads
let dialogueIntegration;

// Function to ensure js-yaml is loaded before initializing dialogue
async function ensureYAMLLoaded() {
    if (typeof jsyaml === 'undefined') {
        console.log('Loading js-yaml library...');
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js';
            script.onload = () => {
                console.log('js-yaml library loaded successfully');
                resolve();
            };
            script.onerror = () => {
                console.error('Failed to load js-yaml library');
                reject(new Error('Failed to load js-yaml'));
            };
            document.head.appendChild(script);
        });
    }
    return Promise.resolve();
}

// Initialize after game data is loaded
window.addEventListener('DOMContentLoaded', async () => {
    // Wait for game data to be available
    const waitForGameData = () => {
        return new Promise((resolve) => {
            const checkGameData = () => {
                if (window.gameData) {
                    resolve();
                } else {
                    setTimeout(checkGameData, 100);
                }
            };
            checkGameData();
        });
    };

    await waitForGameData();
    
    // Ensure js-yaml is loaded
    await ensureYAMLLoaded();
    
    dialogueIntegration = new DialogueIntegration();
    await dialogueIntegration.loadDialogueFiles();
    
    console.log('Dialogue system initialized and ready');
});

// Export for global access
window.DialogueIntegration = DialogueIntegration;
window.startDialogue = (characterName) => {
    if (dialogueIntegration && dialogueIntegration.dialogueLoaded) {
        const gameState = {
            quests: gameData?.quests || {},
            flags: gameData?.flags || {},
            relationships: gameData?.relationships || {},
            time: gameData?.time || { hour: 12 }
        };
        return dialogueIntegration.startDialogue(characterName, gameData?.player || {}, gameState);
    } else {
        console.warn('Dialogue system not loaded yet. Please wait for initialization.');
        return false;
    }
};

// Function to ensure js-yaml is loaded before initializing dialogue
async function ensureYAMLLoaded() {
    if (typeof jsyaml === 'undefined') {
        console.log('Loading js-yaml library...');
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js';
            script.onload = () => {
                console.log('js-yaml library loaded successfully');
                resolve();
            };
            script.onerror = () => {
                console.error('Failed to load js-yaml library');
                reject(new Error('Failed to load js-yaml'));
            };
            document.head.appendChild(script);
        });
    }
    return Promise.resolve();
}

// Function to initialize the dialogue system with proper dependencies
async function initializeDialogueSystem() {
    try {
        // Ensure js-yaml is loaded
        await ensureYAMLLoaded();
        
        // Create dialogueIntegration instance if not exists
        if (!window.dialogueIntegration) {
            window.dialogueIntegration = new DialogueIntegration();
        }
        
        // Load all dialogue files
        await window.dialogueIntegration.loadDialogueFiles();
        
        console.log('Dialogue system fully initialized and ready');
        return true;
    } catch (error) {
        console.error('Failed to initialize dialogue system:', error);
        return false;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDialogueSystem);
} else {
    initializeDialogueSystem();
}

// Export for global access
window.DialogueIntegration = DialogueIntegration;
window.dialogueIntegration = dialogueIntegration;
window.initializeDialogueSystem = initializeDialogueSystem;
window.startDialogue = (characterName) => {
    if (dialogueIntegration && dialogueIntegration.dialogueLoaded) {
        const gameState = {
            quests: gameData?.quests || {},
            flags: gameData?.flags || {},
            relationships: gameData?.relationships || {},
            time: gameData?.time || { hour: 12 }
        };
        return dialogueIntegration.startDialogue(characterName, gameData?.player || {}, gameState);
    } else {
        console.warn('Dialogue system not loaded yet. Call initializeDialogueSystem() first.');
        return false;
    }
};


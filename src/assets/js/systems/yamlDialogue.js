/**
 * YAML Dialogue System for Edoria: The Triune Convergence
 * Handles loading, parsing, and executing YAML-based dialogue trees
 */

class YAMLDialogueSystem {
    constructor() {
        this.dialogueTrees = new Map();
        this.currentDialogue = null;
        this.currentNode = null;
        this.dialogueVariables = new Map();
        this.dialogueHistory = [];
    }

    /**
     * Load dialogue trees from YAML files
     * @param {string} yamlContent - The YAML content as string
     */
    async loadDialogueFromYAML(yamlContent) {
        try {
            // Parse YAML (you'll need a YAML parser library like js-yaml)
            const parsedData = this.parseYAML(yamlContent);
            
            if (parsedData.dialogue_trees) {
                parsedData.dialogue_trees.forEach(tree => {
                    this.dialogueTrees.set(tree.id, tree);
                    console.log(`Loaded dialogue tree: ${tree.id} for character: ${tree.character}`);
                });
            }
        } catch (error) {
            console.error('Error loading YAML dialogue:', error);
        }
    }

    /**
     * Simple YAML parser for dialogue structure
     * Note: In production, use a proper YAML library like js-yaml
     */
    parseYAML(yamlContent) {
        // This is a simplified parser - in production use js-yaml library
        // For now, we'll assume the YAML is already parsed to JSON format
        try {
            // If the content is already an object (pre-parsed), return it
            if (typeof yamlContent === 'object') {
                return yamlContent;
            }
            
            // Basic YAML parsing - in production, use js-yaml
            return JSON.parse(yamlContent);
        } catch (error) {
            console.error('YAML parsing error:', error);
            return { dialogue_trees: [] };
        }
    }

    /**
     * Get available dialogue trees for a character
     * @param {string} characterName - Name of the NPC
     * @param {Object} player - Player object
     * @param {Object} gameState - Current game state
     * @returns {Array} Available dialogue trees
     */
    getAvailableDialogues(characterName, player, gameState) {
        const availableDialogues = [];
        
        this.dialogueTrees.forEach(tree => {
            if (tree.character === characterName && this.checkConditions(tree.conditions, player, gameState)) {
                availableDialogues.push(tree);
            }
        });

        // Sort by priority (higher priority first)
        return availableDialogues.sort((a, b) => (b.priority || 1) - (a.priority || 1));
    }

    /**
     * Start a dialogue tree
     * @param {string} dialogueId - ID of the dialogue tree
     * @param {Object} player - Player object
     * @param {Object} gameState - Current game state
     */
    startDialogue(dialogueId, player, gameState) {
        const dialogue = this.dialogueTrees.get(dialogueId);
        if (!dialogue) {
            console.error(`Dialogue tree not found: ${dialogueId}`);
            return null;
        }

        // Check if dialogue is available
        if (!this.checkConditions(dialogue.conditions, player, gameState)) {
            console.log(`Dialogue conditions not met for: ${dialogueId}`);
            return null;
        }

        this.currentDialogue = dialogue;
        this.dialogueVariables.clear();

        // Initialize dialogue variables
        if (dialogue.variables) {
            Object.entries(dialogue.variables).forEach(([key, value]) => {
                this.dialogueVariables.set(key, value);
            });
        }

        // Start at root node
        return this.goToNode(dialogue.root, player, gameState);
    }

    /**
     * Navigate to a specific node in the current dialogue
     * @param {string} nodeId - ID of the node to navigate to
     * @param {Object} player - Player object
     * @param {Object} gameState - Current game state
     */
    goToNode(nodeId, player, gameState) {
        if (!this.currentDialogue) {
            console.error('No active dialogue');
            return null;
        }

        const node = this.currentDialogue.nodes[nodeId];
        if (!node) {
            console.error(`Node not found: ${nodeId}`);
            return null;
        }

        this.currentNode = node;

        // Execute on_enter actions
        if (node.on_enter) {
            this.executeActions(node.on_enter, player, gameState);
        }

        // Get the appropriate text for this node
        const nodeText = this.getNodeText(node, player, gameState);
        
        // Get available responses
        const availableResponses = this.getAvailableResponses(node, player, gameState);

        return {
            nodeId: nodeId,
            text: nodeText,
            responses: availableResponses,
            character: this.currentDialogue.character
        };
    }

    /**
     * Get the appropriate text for a node based on conditions
     */
    getNodeText(node, player, gameState) {
        if (typeof node.text === 'string') {
            return node.text;
        }

        if (Array.isArray(node.text)) {
            // Check conditional text options
            for (const textOption of node.text) {
                if (textOption.condition && this.checkSingleCondition(textOption.condition, player, gameState)) {
                    return textOption.text;
                }
                if (textOption.default) {
                    return textOption.default;
                }
            }
            
            // If no conditions match and no default, return the last option
            return node.text[node.text.length - 1].text || node.text[node.text.length - 1];
        }

        return "...";
    }

    /**
     * Get available responses for the current node
     */
    getAvailableResponses(node, player, gameState) {
        if (!node.responses) return [];

        return node.responses.filter(response => {
            // Check response conditions
            if (response.conditions) {
                return this.checkConditions(response.conditions, player, gameState);
            }
            return true;
        }).map(response => ({
            text: response.text,
            next: response.next,
            actions: response.actions,
            skill_check: response.skill_check,
            cost: response.cost
        }));
    }

    /**
     * Process a player response
     */
    processResponse(responseIndex, player, gameState) {
        if (!this.currentNode || !this.currentNode.responses) {
            return null;
        }

        const availableResponses = this.getAvailableResponses(this.currentNode, player, gameState);
        const selectedResponse = availableResponses[responseIndex];

        if (!selectedResponse) {
            console.error('Invalid response index');
            return null;
        }

        // Check costs
        if (selectedResponse.cost && !this.canAffordCost(selectedResponse.cost, player)) {
            return { error: 'Cannot afford this action' };
        }

        // Handle skill checks
        if (selectedResponse.skill_check) {
            const skillCheckResult = this.performSkillCheck(selectedResponse.skill_check, player);
            const nextNode = skillCheckResult.success ? 
                selectedResponse.skill_check.success_node : 
                selectedResponse.skill_check.failure_node;
            
            // Execute response actions
            if (selectedResponse.actions) {
                this.executeActions(selectedResponse.actions, player, gameState);
            }

            return this.goToNode(nextNode, player, gameState);
        }

        // Execute response actions
        if (selectedResponse.actions) {
            this.executeActions(selectedResponse.actions, player, gameState);
        }

        // Pay costs
        if (selectedResponse.cost) {
            this.payCost(selectedResponse.cost, player);
        }

        // Navigate to next node
        if (selectedResponse.next === 'end' || !selectedResponse.next) {
            return this.endDialogue(player, gameState);
        }

        return this.goToNode(selectedResponse.next, player, gameState);
    }

    /**
     * Check if conditions are met
     */
    checkConditions(conditions, player, gameState) {
        if (!conditions) return true;

        return conditions.every(condition => this.checkSingleCondition(condition, player, gameState));
    }

    /**
     * Check a single condition
     */
    checkSingleCondition(condition, player, gameState) {
        switch (condition.type) {
            case 'quest_status':
                const quest = gameState.quests?.[condition.quest_id];
                return quest?.status === condition.status;

            case 'item_in_inventory':
                const item = player.inventory?.find(i => i.id === condition.item_id);
                return item && item.quantity >= (condition.quantity || 1);

            case 'level_requirement':
                return player.level >= condition.min_level;

            case 'time_of_day':
                const currentHour = gameState.time?.hour || 12;
                return condition.hours.includes(currentHour);

            case 'relationship':
                const relationship = gameState.relationships?.[condition.character] || 0;
                if (condition.min_relationship !== undefined) {
                    return relationship >= condition.min_relationship;
                }
                if (condition.max_relationship !== undefined) {
                    return relationship <= condition.max_relationship;
                }
                return true;

            case 'flag':
                return gameState.flags?.[condition.flag] === condition.value;

            case 'variable':
                const varValue = this.dialogueVariables.get(condition.variable);
                if (condition.value !== undefined) {
                    return varValue === condition.value;
                }
                if (condition.min_value !== undefined) {
                    return varValue >= condition.min_value;
                }
                return true;

            case 'stat_requirement':
                return player.stats?.[condition.stat] >= condition.min_value;

            default:
                console.warn(`Unknown condition type: ${condition.type}`);
                return true;
        }
    }

    /**
     * Execute actions
     */
    executeActions(actions, player, gameState) {
        actions.forEach(action => {
            switch (action.type) {
                case 'set_variable':
                    this.dialogueVariables.set(action.variable, action.value);
                    break;

                case 'set_flag':
                    if (!gameState.flags) gameState.flags = {};
                    gameState.flags[action.flag] = action.value;
                    break;

                case 'add_relationship':
                    if (!gameState.relationships) gameState.relationships = {};
                    const currentRel = gameState.relationships[action.character] || 0;
                    gameState.relationships[action.character] = currentRel + action.amount;
                    break;

                case 'start_quest':
                    if (!gameState.quests) gameState.quests = {};
                    gameState.quests[action.quest_id] = { status: 'active' };
                    break;

                case 'add_item':
                    const existingItem = player.inventory.find(i => i.id === action.item_id);
                    if (existingItem) {
                        existingItem.quantity += action.quantity;
                    } else {
                        player.inventory.push({ id: action.item_id, quantity: action.quantity });
                    }
                    break;

                case 'add_gold':
                    player.gold = (player.gold || 0) + action.amount;
                    break;

                case 'play_sound':
                    // Integrate with your game's audio system
                    console.log(`Playing sound: ${action.sound_id}`);
                    break;

                case 'add_journal_entry':
                    if (!player.journal) player.journal = [];
                    player.journal.push(action.entry);
                    
                    // Use the centralized journal manager if available
                    if (typeof journalManager !== 'undefined' && journalManager) {
                        journalManager.addJournalEntry(action.entry);
                    }
                    break;

                default:
                    console.warn(`Unknown action type: ${action.type}`);
            }
        });
    }

    /**
     * Perform skill check
     */
    performSkillCheck(skillCheck, player) {
        const skillValue = player.skills?.[skillCheck.skill]?.value || 0;
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + skillValue;
        const success = total >= skillCheck.difficulty;

        return {
            roll: roll,
            skillValue: skillValue,
            total: total,
            difficulty: skillCheck.difficulty,
            success: success
        };
    }

    /**
     * Check if player can afford a cost
     */
    canAffordCost(cost, player) {
        if (cost.gold && (player.gold || 0) < cost.gold) {
            return false;
        }
        // Add other cost checks as needed
        return true;
    }

    /**
     * Pay a cost
     */
    payCost(cost, player) {
        if (cost.gold) {
            player.gold = (player.gold || 0) - cost.gold;
        }
        // Handle other costs as needed
    }

    /**
     * End the current dialogue
     */
    endDialogue(player, gameState) {
        const dialogue = this.currentDialogue;
        this.currentDialogue = null;
        this.currentNode = null;
        this.dialogueVariables.clear();

        return {
            ended: true,
            character: dialogue?.character
        };
    }
}

// Export for use in your game
window.YAMLDialogueSystem = YAMLDialogueSystem;

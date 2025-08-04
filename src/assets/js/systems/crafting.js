// Crafting System Module
// Edoria: The Triune Convergence - Crafting Workshop

// This module handles all crafting-related functionality including:
// - Recipe loading and management
// - Crafting UI rendering
// - Item creation and consumption
// - Skill-based crafting success rates

class CraftingManager {
    constructor() {
        this.currentCategory = 'all';
        this.selectedRecipe = null;
        this.craftingStations = [];
    }

    // Initialize crafting system - recipes are loaded by core.js
    initialize() {
        console.log('Crafting system initialized with', Object.keys(recipesData).length, 'recipes');
    }

    // Get all available recipe categories
    getCategories() {
        const categories = [...new Set(Object.values(recipesData).map(recipe => recipe.category))];
        return ['all', ...categories.sort()];
    }

    // Get recipes filtered by category
    getRecipesByCategory(category = 'all') {
        if (category === 'all') {
            return Object.values(recipesData);
        }
        return Object.values(recipesData).filter(recipe => recipe.category === category);
    }

    // Check if a recipe can be crafted by the player
    canCraftRecipe(recipeId) {
        const recipe = recipesData[recipeId];
        if (!recipe) return false;

        // Check level requirement
        if (recipe.requiredLevel && gameData.player.level < recipe.requiredLevel) {
            return false;
        }

        // Check skill requirements
        if (recipe.requiredSkills) {
            for (const [skill, level] of Object.entries(recipe.requiredSkills)) {
                const playerSkill = gameData.player.craftingSkills?.[skill] || 0;
                if (playerSkill < level) return false;
            }
        }

        // Check ingredient availability
        if (recipe.ingredients) {
            for (const ingredient of recipe.ingredients) {
                // Count total quantity of this item in inventory
                let playerQuantity = 0;
                gameData.player.inventory.forEach(inventoryItem => {
                    // New structure: {item: "item_id", quantity: number}
                    if (inventoryItem.item === ingredient.itemId) {
                        playerQuantity += inventoryItem.quantity || 1;
                    }
                    // Legacy support for old structures
                    else if (typeof inventoryItem === 'string' && inventoryItem === ingredient.itemId) {
                        playerQuantity += 1;
                    } else if (inventoryItem.id === ingredient.itemId) {
                        playerQuantity += (inventoryItem.quantity || 1);
                    }
                });
                
                if (playerQuantity < ingredient.quantity) {
                    return false;
                }
            }
        }

        // Check unlock conditions
        if (!this.checkUnlockConditions(recipe)) {
            return false;
        }

        return true;
    }

    // Check if recipe unlock conditions are met
    checkUnlockConditions(recipe) {
        if (!recipe.unlockConditions) return true;

        const conditions = recipe.unlockConditions;

        // Check quest completion (simplified - assume all completed for now)
        if (conditions.questsCompleted && conditions.questsCompleted.length > 0) {
            // TODO: Implement quest tracking
        }

        // Check item discovery
        if (conditions.itemsDiscovered && conditions.itemsDiscovered.length > 0) {
            for (const itemId of conditions.itemsDiscovered) {
                const hasItem = gameData.player.inventory.some(item => item.id === itemId);
                if (!hasItem) return false;
            }
        }

        // Check locations visited (simplified - assume all visited for now)
        if (conditions.locationsVisited && conditions.locationsVisited.length > 0) {
            // TODO: Implement location tracking
        }

        return true;
    }

    // Calculate crafting success rate based on player skills and recipe difficulty
    calculateSuccessRate(recipe) {
        const difficultyRates = {
            'easy': 85,
            'medium': 70,
            'hard': 55,
            'master': 40
        };

        let baseRate = difficultyRates[recipe.difficulty] || 70;

        // Add skill bonuses
        if (recipe.requiredSkills) {
            for (const [skill, requiredLevel] of Object.entries(recipe.requiredSkills)) {
                const playerLevel = gameData.player.craftingSkills?.[skill] || 0;
                const skillBonus = Math.max(0, (playerLevel - requiredLevel) * 3);
                baseRate += skillBonus;
            }
        }

        // Cap success rate between 10% and 95%
        return Math.min(95, Math.max(10, baseRate));
    }

    // Attempt to craft an item
    craftItem(recipeId) {
        const recipe = recipesData[recipeId];
        if (!recipe) {
            showGameMessage('Recipe not found!', 'failure');
            return false;
        }

        if (!this.canCraftRecipe(recipeId)) {
            showGameMessage('Cannot craft this item - missing requirements', 'failure');
            return false;
        }

        // Consume ingredients
        this.consumeIngredients(recipe);

        // Calculate success
        const successRate = this.calculateSuccessRate(recipe);
        const isSuccess = Math.random() * 100 <= successRate;

        if (isSuccess) {
            this.handleCraftingSuccess(recipe);
        } else {
            this.handleCraftingFailure(recipe);
        }

        // Grant experience for the attempt
        this.grantCraftingExperience(recipe, isSuccess);

        return isSuccess;
    }

    // Consume recipe ingredients from inventory
    consumeIngredients(recipe) {
        for (const ingredient of recipe.ingredients) {
            if (ingredient.consumed !== false) { // Default to consumed unless explicitly set to false
                let remainingToConsume = ingredient.quantity;
                
                // Find and consume items until we've consumed the required amount
                for (let i = gameData.player.inventory.length - 1; i >= 0 && remainingToConsume > 0; i--) {
                    const inventoryItem = gameData.player.inventory[i];
                    let isMatch = false;
                    let currentQuantity = 0;
                    
                    // Check new structure: {item: "item_id", quantity: number}
                    if (inventoryItem.item === ingredient.itemId) {
                        isMatch = true;
                        currentQuantity = inventoryItem.quantity || 1;
                    }
                    // Legacy support for old structures
                    else if (typeof inventoryItem === 'string' && inventoryItem === ingredient.itemId) {
                        isMatch = true;
                        currentQuantity = 1;
                    } else if (inventoryItem.id === ingredient.itemId) {
                        isMatch = true;
                        currentQuantity = inventoryItem.quantity || 1;
                    }
                    
                    if (isMatch) {
                        const consumeAmount = Math.min(currentQuantity, remainingToConsume);
                        remainingToConsume -= consumeAmount;
                        
                        if (inventoryItem.item) {
                            // New structure
                            inventoryItem.quantity = currentQuantity - consumeAmount;
                            if (inventoryItem.quantity <= 0) {
                                gameData.player.inventory.splice(i, 1);
                            }
                        } else if (typeof inventoryItem === 'string') {
                            // Legacy string item
                            gameData.player.inventory.splice(i, 1);
                        } else {
                            // Legacy object structure
                            inventoryItem.quantity = currentQuantity - consumeAmount;
                            if (inventoryItem.quantity <= 0) {
                                gameData.player.inventory.splice(i, 1);
                            }
                        }
                    }
                }
            }
        }
    }

    // Handle successful crafting
    handleCraftingSuccess(recipe) {
        showGameMessage(`Successfully crafted ${recipe.name}!`, 'success');

        // Add primary results
        for (const result of recipe.results) {
            if (Math.random() * 100 <= result.chance) {
                this.addItemToInventory(result.itemId, result.quantity);
            }
        }

        // Check for byproducts
        if (recipe.byproducts) {
            for (const byproduct of recipe.byproducts) {
                if (Math.random() * 100 <= byproduct.chance) {
                    this.addItemToInventory(byproduct.itemId, byproduct.quantity);
                    showGameMessage(`Bonus: +${byproduct.quantity} ${byproduct.itemId.replace(/_/g, ' ')}`, 'info');
                }
            }
        }
        
        // Auto-save after successful crafting
        if (typeof window !== 'undefined' && window.saveManager && window.saveManager.autoSave) {
            window.saveManager.autoSave('crafting_success', `Successfully crafted ${recipe.name}`);
        }
    }

    // Handle failed crafting
    handleCraftingFailure(recipe) {
        showGameMessage(`Crafting failed! ${recipe.name} could not be completed.`, 'failure');

        // Add failure results
        if (recipe.failureResults) {
            for (const failResult of recipe.failureResults) {
                if (Math.random() * 100 <= failResult.chance) {
                    this.addItemToInventory(failResult.itemId, failResult.quantity);
                    showGameMessage(`Salvaged: +${failResult.quantity} ${failResult.itemId.replace(/_/g, ' ')}`, 'warning');
                }
            }
        }
    }

    // Grant crafting experience
    grantCraftingExperience(recipe, isSuccess) {
        const baseExp = recipe.experienceGained;
        const actualExp = isSuccess ? baseExp : Math.floor(baseExp * 0.3); // 30% exp on failure
        
        gameData.player.experience = (gameData.player.experience || 0) + actualExp;
        
        // Grant skill experience (simplified)
        if (recipe.requiredSkills) {
            for (const [skill, level] of Object.entries(recipe.requiredSkills)) {
                if (!gameData.player.craftingSkills) gameData.player.craftingSkills = {};
                if (!gameData.player.craftingSkills[skill]) gameData.player.craftingSkills[skill] = 0;
                gameData.player.craftingSkills[skill] += isSuccess ? 1 : 0.5;
            }
        }
    }

    // Add item to inventory
    addItemToInventory(itemId, quantity) {
        // Find existing item with new structure: {item: "item_id", quantity: number}
        let existingItem = gameData.player.inventory.find(inventoryItem => inventoryItem.item === itemId);
        
        if (existingItem) {
            // Add to existing quantity
            existingItem.quantity = (existingItem.quantity || 1) + quantity;
        } else {
            // Check for legacy structures and convert them
            let legacyIndex = -1;
            for (let i = 0; i < gameData.player.inventory.length; i++) {
                const inventoryItem = gameData.player.inventory[i];
                if ((typeof inventoryItem === 'string' && inventoryItem === itemId) || 
                    (inventoryItem.id === itemId)) {
                    legacyIndex = i;
                    break;
                }
            }
            
            if (legacyIndex !== -1) {
                // Convert legacy item to new structure
                const legacyItem = gameData.player.inventory[legacyIndex];
                const legacyQuantity = typeof legacyItem === 'string' ? 1 : (legacyItem.quantity || 1);
                gameData.player.inventory[legacyIndex] = { 
                    item: itemId, 
                    quantity: legacyQuantity + quantity 
                };
            } else {
                // Add new item with new structure
                gameData.player.inventory.push({ item: itemId, quantity: quantity });
            }
        }
    }

    // Get recipe by ID
    getRecipe(recipeId) {
        return recipesData[recipeId];
    }

    // Get formatted ingredient list for a recipe
    getIngredientsList(recipe) {
        return recipe.ingredients.map(ingredient => {
            // Count total quantity of this item in inventory
            let playerQuantity = 0;
            gameData.player.inventory.forEach(inventoryItem => {
                // New structure: {item: "item_id", quantity: number}
                if (inventoryItem.item === ingredient.itemId) {
                    playerQuantity += inventoryItem.quantity || 1;
                }
                // Legacy support for old structures
                else if (typeof inventoryItem === 'string' && inventoryItem === ingredient.itemId) {
                    playerQuantity += 1;
                } else if (inventoryItem.id === ingredient.itemId) {
                    playerQuantity += (inventoryItem.quantity || 1);
                }
            });
            
            const hasEnough = playerQuantity >= ingredient.quantity;
            
            return {
                ...ingredient,
                playerQuantity,
                hasEnough,
                displayName: ingredient.itemId.replace(/_/g, ' ').toUpperCase()
            };
        });
    }

    // Get formatted skill requirements for a recipe
    getSkillRequirements(recipe) {
        if (!recipe.requiredSkills) return [];
        
        return Object.entries(recipe.requiredSkills).map(([skill, level]) => {
            const playerLevel = gameData.player.craftingSkills?.[skill] || 0;
            const hasSkill = playerLevel >= level;
            
            return {
                skill,
                requiredLevel: level,
                playerLevel,
                hasSkill,
                displayName: skill.charAt(0).toUpperCase() + skill.slice(1)
            };
        });
    }

    // Utility function to get item quantity from inventory (supports all formats)
    getItemQuantityInInventory(itemId) {
        let totalQuantity = 0;
        gameData.player.inventory.forEach(inventoryItem => {
            // New structure: {item: "item_id", quantity: number}
            if (inventoryItem.item === itemId) {
                totalQuantity += inventoryItem.quantity || 1;
            }
            // Legacy support for old structures
            else if (typeof inventoryItem === 'string' && inventoryItem === itemId) {
                totalQuantity += 1;
            } else if (inventoryItem.id === itemId) {
                totalQuantity += (inventoryItem.quantity || 1);
            }
        });
        return totalQuantity;
    }

    // Utility function to convert legacy inventory items to new structure
    convertInventoryToNewStructure() {
        const convertedInventory = [];
        const itemCounts = {};
        
        // Count all items
        gameData.player.inventory.forEach(inventoryItem => {
            let itemId = null;
            let quantity = 0;
            
            if (inventoryItem.item) {
                // Already new structure
                itemId = inventoryItem.item;
                quantity = inventoryItem.quantity || 1;
            } else if (typeof inventoryItem === 'string') {
                // Legacy string structure
                itemId = inventoryItem;
                quantity = 1;
            } else if (inventoryItem.id) {
                // Legacy object structure
                itemId = inventoryItem.id;
                quantity = inventoryItem.quantity || 1;
            }
            
            if (itemId) {
                itemCounts[itemId] = (itemCounts[itemId] || 0) + quantity;
            }
        });
        
        // Create new inventory with consolidated items
        Object.entries(itemCounts).forEach(([itemId, quantity]) => {
            convertedInventory.push({ item: itemId, quantity: quantity });
        });
        
        // Replace old inventory
        gameData.player.inventory = convertedInventory;
        console.log('Inventory converted to new structure:', convertedInventory);
    }
}

// Global crafting manager instance
const craftingManager = new CraftingManager();

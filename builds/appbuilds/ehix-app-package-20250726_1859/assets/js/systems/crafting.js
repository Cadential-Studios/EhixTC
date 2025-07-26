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
                const playerItem = gameData.player.inventory.find(item => item.id === ingredient.itemId);
                if (!playerItem || playerItem.quantity < ingredient.quantity) {
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
            if (ingredient.consumed) {
                const itemIndex = gameData.player.inventory.findIndex(item => item.id === ingredient.itemId);
                if (itemIndex !== -1) {
                    gameData.player.inventory[itemIndex].quantity -= ingredient.quantity;
                    if (gameData.player.inventory[itemIndex].quantity <= 0) {
                        gameData.player.inventory.splice(itemIndex, 1);
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
        const existingItem = gameData.player.inventory.find(item => item.id === itemId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            gameData.player.inventory.push({ id: itemId, quantity: quantity });
        }
    }

    // Get recipe by ID
    getRecipe(recipeId) {
        return recipesData[recipeId];
    }

    // Get formatted ingredient list for a recipe
    getIngredientsList(recipe) {
        return recipe.ingredients.map(ingredient => {
            const playerItem = gameData.player.inventory.find(item => item.id === ingredient.itemId);
            const playerQuantity = playerItem ? playerItem.quantity : 0;
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
}

// Global crafting manager instance
const craftingManager = new CraftingManager();

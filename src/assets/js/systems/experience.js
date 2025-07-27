// Experience and Leveling System
// D&D 5e Compatible Experience Progression

class ExperienceManager {
    constructor() {
        // D&D 5e Experience Point Thresholds (Level 1-20)
        this.experienceTable = [
            0,      // Level 0 (placeholder)
            0,      // Level 1
            300,    // Level 2
            900,    // Level 3
            2700,   // Level 4
            6500,   // Level 5
            14000,  // Level 6
            23000,  // Level 7
            34000,  // Level 8
            48000,  // Level 9
            64000,  // Level 10
            85000,  // Level 11
            100000, // Level 12
            120000, // Level 13
            140000, // Level 14
            165000, // Level 15
            195000, // Level 16
            225000, // Level 17
            265000, // Level 18
            305000, // Level 19
            355000  // Level 20
        ];

        // Proficiency bonus progression (+2 at level 1-4, +3 at 5-8, etc.)
        this.proficiencyTable = [
            2, 2, 2, 2, 2,  // Levels 1-5
            3, 3, 3, 3,     // Levels 6-9
            4, 4, 4, 4,     // Levels 10-13
            5, 5, 5, 5,     // Levels 14-17
            6, 6, 6         // Levels 18-20
        ];

        // Ability Score Improvement levels (D&D 5e standard)
        this.abilityScoreImprovementLevels = [4, 8, 12, 16, 19];

        // Initialize experience tracking
        this.lastLevelUpTime = null;
        this.experienceGainHistory = [];
    }

    /**
     * Get the experience required for a specific level
     * @param {number} level - Target level (1-20)
     * @returns {number} Experience points required
     */
    getExperienceForLevel(level) {
        if (level < 1 || level > 20) {
            console.warn(`Invalid level: ${level}. Must be between 1-20.`);
            return level <= 1 ? 0 : this.experienceTable[20];
        }
        return this.experienceTable[level] || 0;
    }

    /**
     * Get the experience needed to reach the next level
     * @param {number} currentLevel - Current character level
     * @param {number} currentXP - Current experience points
     * @returns {number} Experience points needed for next level
     */
    getExperienceToNextLevel(currentLevel, currentXP) {
        if (currentLevel >= 20) return 0; // Max level reached
        
        const nextLevelXP = this.getExperienceForLevel(currentLevel + 1);
        return Math.max(0, nextLevelXP - currentXP);
    }

    /**
     * Calculate what level a character should be based on experience
     * @param {number} experience - Total experience points
     * @returns {number} Character level (1-20)
     */
    calculateLevelFromExperience(experience) {
        for (let level = 20; level >= 1; level--) {
            if (experience >= this.getExperienceForLevel(level)) {
                return level;
            }
        }
        return 1; // Minimum level
    }

    /**
     * Get proficiency bonus for a given level
     * @param {number} level - Character level (1-20)
     * @returns {number} Proficiency bonus (+2 to +6)
     */
    getProficiencyBonus(level) {
        if (level < 1) return 2;
        if (level > 20) return 6;
        return this.proficiencyTable[level - 1] || 2;
    }

    /**
     * Check if a level qualifies for ability score improvement
     * @param {number} level - Character level
     * @returns {boolean} True if level gets ability score improvement
     */
    isAbilityScoreImprovementLevel(level) {
        return this.abilityScoreImprovementLevels.includes(level);
    }

    /**
     * Award experience points to the player
     * @param {number} amount - Experience points to award
     * @param {string} source - Source of experience (combat, quest, etc.)
     * @param {boolean} showNotification - Whether to show floating text
     */
    awardExperience(amount, source = 'unknown', showNotification = true) {
        if (amount <= 0) return;

        const oldLevel = gameData.player.level;
        const oldXP = gameData.player.experience;

        // Add experience
        gameData.player.experience += amount;

        // Track experience gain
        this.experienceGainHistory.push({
            amount: amount,
            source: source,
            timestamp: Date.now(),
            oldXP: oldXP,
            newXP: gameData.player.experience,
            oldLevel: oldLevel
        });

        // Show notification
        if (showNotification && typeof showFloatingText === 'function') {
            showFloatingText(`+${amount} XP`, 'purple');
        }

        // Check for level up
        const newLevel = this.calculateLevelFromExperience(gameData.player.experience);
        if (newLevel > oldLevel) {
            this.handleLevelUp(oldLevel, newLevel);
        } else {
            // Update UI even if no level up occurred
            this.updateExperienceDisplay();
            
            // Force character sheet refresh if it's open
            if (typeof renderCharacterSheet === 'function' && document.querySelector('#character-panel') && !document.querySelector('#character-panel').classList.contains('panel-closed')) {
                renderCharacterSheet();
            }
        }

        console.log(`XP awarded: +${amount} (${oldXP} → ${gameData.player.experience})`);
    }

    /**
     * Handle level up process
     * @param {number} oldLevel - Previous level
     * @param {number} newLevel - New level
     */
    handleLevelUp(oldLevel, newLevel) {
        this.lastLevelUpTime = Date.now();

        // Update proficiency bonus
        gameData.player.proficiencyBonus = this.getProficiencyBonus(newLevel);

        // Update experience to next level
        gameData.player.experienceToNext = this.getExperienceToNextLevel(newLevel, gameData.player.experience);

        // Handle multiple level ups
        const levelsGained = newLevel - oldLevel;

        // Show immediate feedback
        this.showLevelUpNotification(oldLevel, newLevel, levelsGained);

        // Check if we have the progression system available
        if (typeof checkForLevelUp === 'function') {
            // Use the new progression system for detailed level-up choices
            setTimeout(() => {
                checkForLevelUp();
            }, 1000); // Delay to show the notification first
        } else {
            // Fallback to simple level up
            gameData.player.level = newLevel;
            
            for (let level = oldLevel + 1; level <= newLevel; level++) {
                this.processLevelGains(level);
            }
            
            // Recalculate derived stats
            if (typeof calculateDerivedStats === 'function') {
                calculateDerivedStats();
            }
        }

        // Update experience display after level up
        this.updateExperienceDisplay();

        // Ensure the XP bar visually resets for the new level
        const xpBar = document.querySelector('#experience-bar');
        if (xpBar) {
            xpBar.style.width = '0%';
        }

        // Update character sheet if open
        if (typeof renderCharacterSheet === 'function') {
            renderCharacterSheet();
        }

        console.log(`Level up! ${oldLevel} → ${newLevel} (${levelsGained} levels), XP: ${gameData.player.experience}`);
    }

    /**
     * Process gains for a specific level
     * @param {number} level - Level being gained
     */
    processLevelGains(level) {
        // Hit point increase (class-dependent, for now use average)
        const hitDieAverage = 6; // Will be class-dependent later
        const conModifier = Math.floor((gameData.player.stats.constitution - 10) / 2);
        const hpGain = hitDieAverage + conModifier;
        
        gameData.player.derivedStats.maxHealth += hpGain;
        gameData.player.derivedStats.health += hpGain; // Also heal on level up

        // Spell slot increases (for spellcasters - will be class-dependent)
        if (gameData.player.class && gameData.player.class.spellcaster) {
            this.updateSpellSlots(level);
        }

        // Check for ability score improvement
        if (this.isAbilityScoreImprovementLevel(level)) {
            this.triggerAbilityScoreImprovement(level);
        }

        // Check for class features (will be implemented in class system)
        this.checkClassFeatures(level);
    }

    /**
     * Update spell slots for spellcasting classes
     * @param {number} level - Character level
     */
    updateSpellSlots(level) {
        // Placeholder for spell slot progression
        // Will be implemented with magic system
        console.log(`Spell slots updated for level ${level}`);
    }

    /**
     * Trigger ability score improvement selection
     * @param {number} level - Level that granted the improvement
     */
    triggerAbilityScoreImprovement(level) {
        // Show ability score improvement modal
        if (typeof showAbilityScoreImprovementModal === 'function') {
            showAbilityScoreImprovementModal(level);
        } else {
            console.log(`Ability Score Improvement available at level ${level}!`);
        }
    }

    /**
     * Check for class features at this level
     * @param {number} level - Character level
     */
    checkClassFeatures(level) {
        // Placeholder for class feature progression
        // Will be implemented with class system
        console.log(`Checking class features for level ${level}`);
    }

    /**
     * Show level up notification
     * @param {number} oldLevel - Previous level
     * @param {number} newLevel - New level
     * @param {number} levelsGained - Number of levels gained
     */
    showLevelUpNotification(oldLevel, newLevel, levelsGained) {
        // Show floating text
        if (typeof showFloatingText === 'function') {
            const message = levelsGained === 1 
                ? `Level Up! Now Level ${newLevel}` 
                : `${levelsGained} Levels Up! Now Level ${newLevel}`;
            showFloatingText(message, 'gold');
        }

        // Use the new progression system instead of old modal
        if (typeof checkForLevelUp === 'function') {
            console.log('🌟 Triggering progression system for level up');
            checkForLevelUp();
        } else {
            console.warn('Progression system not available - using fallback');
            // Fallback to basic notification if progression system isn't loaded
            if (typeof showGameMessage === 'function') {
                showGameMessage(`Level Up! You are now level ${newLevel}!`, 'success');
            }
        }

        // Show level up animation (visual effects only, no modal)
        if (typeof showLevelUpAnimation === 'function') {
            const statIncreases = this.calculateStatIncreases(oldLevel, newLevel);
            showLevelUpAnimation(oldLevel, newLevel, statIncreases);
        }
    }

    /**
     * Calculate stat increases from leveling
     * @param {number} oldLevel - Previous level
     * @param {number} newLevel - New level
     * @returns {Object} Stat increases
     */
    calculateStatIncreases(oldLevel, newLevel) {
        const increases = {};
        
        // Health increase
        const levelsGained = newLevel - oldLevel;
        const hitDieAverage = 6;
        const conModifier = Math.floor((gameData.player.stats.constitution - 10) / 2);
        const hpGain = (hitDieAverage + conModifier) * levelsGained;
        
        increases.health = hpGain;
        increases.maxHealth = hpGain;

        // Proficiency bonus change
        const oldProficiency = this.getProficiencyBonus(oldLevel);
        const newProficiency = this.getProficiencyBonus(newLevel);
        if (newProficiency > oldProficiency) {
            increases.proficiencyBonus = newProficiency - oldProficiency;
        }

        return increases;
    }

    /**
     * Update experience display in UI
     */
    updateExperienceDisplay() {
        const player = gameData.player;
        const xpToNext = this.getExperienceToNextLevel(player.level, player.experience);
        
        // Calculate progress within current level
        const xpForCurrentLevel = this.getExperienceForLevel(player.level);
        const xpForNextLevel = this.getExperienceForLevel(player.level + 1);
        const xpInCurrentLevel = player.experience - xpForCurrentLevel;
        const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
        const percentage = player.level >= 20 ? 100 : Math.max(0, Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100));
        
        // Update experience bar if it exists
        const xpBar = document.querySelector('#experience-bar');
        if (xpBar) {
            xpBar.style.width = `${percentage}%`;
            console.log(`XP bar updated: ${percentage.toFixed(1)}% (${xpInCurrentLevel}/${xpNeededForLevel})`);
        }

        // Update experience text if it exists
        const xpText = document.querySelector('#experience-text');
        if (xpText) {
            let displayText;
            if (player.level >= 20) {
                displayText = `${player.experience.toLocaleString()} XP (Max Level)`;
            } else {
                displayText = `${player.experience.toLocaleString()} / ${xpForNextLevel.toLocaleString()} XP`;
            }
            xpText.textContent = displayText;
            console.log(`XP text updated: ${displayText}`);
        }

        // Update the experience to next for backwards compatibility
        player.experienceToNext = xpToNext;
    }

    /**
     * Get experience gain history
     * @param {number} limit - Maximum number of entries to return
     * @returns {Array} Recent experience gains
     */
    getExperienceHistory(limit = 10) {
        return this.experienceGainHistory
            .slice(-limit)
            .reverse();
    }

    /**
     * Get experience statistics
     * @returns {Object} Experience statistics
     */
    getExperienceStats() {
        const player = gameData.player;
        const totalXP = player.experience;
        const currentLevel = player.level;
        const xpForCurrentLevel = this.getExperienceForLevel(currentLevel);
        const xpForNextLevel = this.getExperienceForLevel(currentLevel + 1);
        const xpToNext = this.getExperienceToNextLevel(currentLevel, totalXP);
        const xpInCurrentLevel = totalXP - xpForCurrentLevel;
        const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
        const progressPercent = currentLevel >= 20 ? 100 : (xpInCurrentLevel / xpNeededForLevel) * 100;

        return {
            totalExperience: totalXP,
            currentLevel: currentLevel,
            experienceInCurrentLevel: xpInCurrentLevel,
            experienceNeededForLevel: xpNeededForLevel,
            experienceToNextLevel: xpToNext,
            progressPercent: progressPercent,
            proficiencyBonus: this.getProficiencyBonus(currentLevel),
            isMaxLevel: currentLevel >= 20,
            nextAbilityScoreImprovement: this.abilityScoreImprovementLevels.find(level => level > currentLevel) || null
        };
    }

    /**
     * Debug function to set experience directly
     * @param {number} experience - Experience to set
     */
    setExperience(experience) {
        if (typeof experience !== 'number' || experience < 0) {
            console.error('Invalid experience value');
            return;
        }

        const oldLevel = gameData.player.level;
        gameData.player.experience = experience;
        
        const newLevel = this.calculateLevelFromExperience(experience);
        if (newLevel !== oldLevel) {
            this.handleLevelUp(oldLevel, newLevel);
        } else {
            this.updateExperienceDisplay();
        }
    }
}

// Create global experience manager instance
const experienceManager = new ExperienceManager();

/**
 * Initialize experience system after game data is loaded
 */
function initializeExperienceSystem() {
    const player = gameData.player;
    
    // Ensure player has experience property
    if (typeof player.experience !== 'number') {
        player.experience = 0;
    }
    
    // Recalculate level based on experience
    const calculatedLevel = experienceManager.calculateLevelFromExperience(player.experience);
    if (calculatedLevel !== player.level) {
        console.log(`Adjusting level from ${player.level} to ${calculatedLevel} based on ${player.experience} XP`);
        player.level = calculatedLevel;
    }
    
    // Update proficiency bonus
    player.proficiencyBonus = experienceManager.getProficiencyBonus(player.level);
    
    // Calculate experience to next level (for backwards compatibility)
    player.experienceToNext = experienceManager.getExperienceToNextLevel(player.level, player.experience);
    
    // Update UI
    experienceManager.updateExperienceDisplay();
    
    console.log(`Experience system initialized: Level ${player.level}, ${player.experience} XP`);
}

// Export functions for backward compatibility
window.addExperience = (amount, source = 'unknown') => {
    experienceManager.awardExperience(amount, source);
};

// Export initialization function
window.initializeExperienceSystem = initializeExperienceSystem;

// Update the existing levelUp function to use the new system
window.levelUp = () => {
    const currentXP = gameData.player.experience;
    const currentLevel = gameData.player.level;
    const nextLevelXP = experienceManager.getExperienceForLevel(currentLevel + 1);
    
    if (currentXP >= nextLevelXP) {
        experienceManager.handleLevelUp(currentLevel, currentLevel + 1);
    }
};

// Debug functions (remove in production)
window.debugSetLevel = (level) => {
    const xpForLevel = experienceManager.getExperienceForLevel(level);
    experienceManager.setExperience(xpForLevel);
};

window.debugAddXP = (amount) => {
    experienceManager.awardExperience(amount, 'debug');
};

console.log('Experience Manager loaded - D&D 5e Experience System Active');

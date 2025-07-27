// Stat Change Animator - Enhanced Visual Feedback System
// Edoria: The Triune Convergence - Animated Stat Changes

class StatChangeAnimator {
    constructor() {
        this.isEnabled = true; // Default enabled, can be toggled in settings
        this.currentModal = null;
        this.animationQueue = [];
        this.isAnimating = false;
    }

    // Initialize the animator with settings
    initialize() {
        // Load setting from game data if it exists
        if (gameData.settings && gameData.settings.showStatAnimations !== undefined) {
            this.isEnabled = gameData.settings.showStatAnimations;
        } else {
            // Set default and save to settings
            if (!gameData.settings) gameData.settings = {};
            gameData.settings.showStatAnimations = true;
            this.isEnabled = true;
        }
    }

    // Toggle the animation feature
    toggle(enabled) {
        this.isEnabled = enabled;
        if (gameData.settings) {
            gameData.settings.showStatAnimations = enabled;
        }
    }

    // Show healing animation
    showHealingAnimation(healAmount, oldHP, newHP, maxHP) {
        if (!this.isEnabled) return;

        const animationData = {
            type: 'healing',
            title: 'Health Restored',
            icon: 'ph-heart',
            color: '#10b981',
            bgColor: '#065f46',
            borderColor: '#10b981',
            oldValue: oldHP,
            newValue: newHP,
            maxValue: maxHP,
            change: healAmount,
            label: 'Hit Points'
        };

        this.queueAnimation(animationData);
    }

    // Show mana restoration animation
    showManaAnimation(manaAmount, oldMana, newMana, maxMana) {
        if (!this.isEnabled) return;

        const animationData = {
            type: 'mana',
            title: 'Mana Restored',
            icon: 'ph-lightning',
            color: '#3b82f6',
            bgColor: '#1e40af',
            borderColor: '#3b82f6',
            oldValue: oldMana,
            newValue: newMana,
            maxValue: maxMana,
            change: manaAmount,
            label: 'Mana Points'
        };

        this.queueAnimation(animationData);
    }

    // Show stat bonus animation from equipment
    showStatBonusAnimation(statChanges, itemName, isEquipping = true) {
        if (!this.isEnabled || !statChanges || Object.keys(statChanges).length === 0) return;

        // Create animation data for each stat change
        Object.entries(statChanges).forEach(([stat, change]) => {
            if (change === 0) return;

            const actualChange = isEquipping ? change : -change;
            const oldValue = gameData.player.stats[stat] - actualChange;
            const newValue = gameData.player.stats[stat];

            const animationData = {
                type: 'stat_bonus',
                title: isEquipping ? `${itemName} Equipped` : `${itemName} Unequipped`,
                icon: this.getStatIcon(stat),
                color: actualChange > 0 ? '#10b981' : '#ef4444',
                bgColor: actualChange > 0 ? '#065f46' : '#7f1d1d',
                borderColor: actualChange > 0 ? '#10b981' : '#ef4444',
                oldValue: oldValue,
                newValue: newValue,
                change: actualChange,
                label: this.getStatLabel(stat),
                statName: stat
            };

            this.queueAnimation(animationData);
        });
    }

    // Show level up animation
    showLevelUpAnimation(oldLevel, newLevel, statIncreases) {
        if (!this.isEnabled) return;

        const animationData = {
            type: 'level_up',
            title: 'Level Up!',
            icon: 'ph-star',
            color: '#fbbf24',
            bgColor: '#92400e',
            borderColor: '#fbbf24',
            oldValue: oldLevel,
            newValue: newLevel,
            change: newLevel - oldLevel,
            label: 'Level',
            statIncreases: statIncreases
        };

        this.queueAnimation(animationData);
    }

    // Queue animation for sequential display
    queueAnimation(animationData) {
        this.animationQueue.push(animationData);
        
        if (!this.isAnimating) {
            this.processQueue();
        }
    }

    // Process the animation queue
    async processQueue() {
        if (this.animationQueue.length === 0) {
            this.isAnimating = false;
            return;
        }

        this.isAnimating = true;
        const animationData = this.animationQueue.shift();
        
        await this.showAnimationModal(animationData);
        
        // Process next animation after a brief delay
        setTimeout(() => {
            this.processQueue();
        }, 300);
    }

    // Show the animated modal
    showAnimationModal(data) {
        return new Promise((resolve) => {
            this.createModalElement(data, resolve);
        });
    }

    // Create the modal element
    createModalElement(data, callback) {
        // Remove any existing modal
        this.closeModal();

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'stat-change-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modalOverlay.id = 'stat-change-modal';

        modalOverlay.innerHTML = `
            <div class="stat-change-modal bg-gray-800 border-2 rounded-lg p-6 max-w-sm w-full mx-4 transform transition-all duration-300 scale-95 opacity-0" 
                 style="border-color: ${data.borderColor.replace('border-', '')}; background-color: ${data.bgColor.replace('bg-', '')};">
                <div class="text-center">
                    <!-- Header -->
                    <div class="mb-4">
                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 mb-3"
                             style="background-color: ${data.bgColor.replace('bg-', '')}; border-color: ${data.borderColor.replace('border-', '')};">
                            <i class="ph-duotone ${data.icon} text-3xl" style="color: ${data.color.replace('text-', '')};"></i>
                        </div>
                        <h3 class="text-xl font-cinzel font-bold" style="color: ${data.color.replace('text-', '')};">${data.title}</h3>
                    </div>

                    <!-- Animation Content -->
                    <div class="stat-animation-content">
                        ${this.renderAnimationContent(data)}
                    </div>

                    <!-- Close Button -->
                    <button onclick="statChangeAnimator.closeModal()" 
                            class="mt-6 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors">
                        Continue
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);
        this.currentModal = modalOverlay;

        // Trigger entrance animation
        setTimeout(() => {
            const modal = modalOverlay.querySelector('.stat-change-modal');
            modal.classList.remove('scale-95', 'opacity-0');
            modal.classList.add('scale-100', 'opacity-100');
        }, 50);

        // Start the stat animation
        setTimeout(() => {
            this.animateStatChange(data);
        }, 400);

        // Auto-close after 3 seconds if not manually closed
        setTimeout(() => {
            if (this.currentModal === modalOverlay) {
                this.closeModal();
                callback();
            }
        }, 3000);

        // Manual close callback
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal();
                callback();
            }
        });

        // Store callback for manual close
        this.currentCallback = callback;
    }

    // Render different types of animation content
    renderAnimationContent(data) {
        switch (data.type) {
            case 'healing':
            case 'mana':
                return this.renderHealthManaContent(data);
            case 'stat_bonus':
                return this.renderStatBonusContent(data);
            case 'level_up':
                return this.renderLevelUpContent(data);
            default:
                return this.renderGenericContent(data);
        }
    }

    // Render health/mana restoration content
    renderHealthManaContent(data) {
        const colorValue = data.color.replace('text-', '');
        const bgColorValue = data.bgColor.replace('bg-', '');
        
        return `
            <div class="space-y-4">
                <div class="text-2xl font-bold" style="color: ${colorValue};">
                    +${data.change} ${data.label}
                </div>
                
                <div class="relative">
                    <!-- Progress Bar Background -->
                    <div class="w-full bg-gray-700 rounded-full h-4">
                        <div class="progress-bar-fill h-4 rounded-full transition-all duration-1000 ease-out"
                             style="width: ${(data.oldValue / data.maxValue) * 100}%; background-color: ${bgColorValue};"
                             data-target-width="${(data.newValue / data.maxValue) * 100}%">
                        </div>
                    </div>
                    
                    <!-- Value Display -->
                    <div class="flex justify-between mt-2 text-sm text-gray-300">
                        <span class="stat-old-value">${data.oldValue}</span>
                        <span class="stat-max-value">/ ${data.maxValue}</span>
                    </div>
                    
                    <!-- New Value (appears during animation) -->
                    <div class="stat-new-value text-center mt-2 opacity-0 transition-opacity duration-500">
                        <span class="text-lg font-bold" style="color: ${colorValue};">${data.newValue} / ${data.maxValue}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Render stat bonus content
    renderStatBonusContent(data) {
        const colorValue = data.color.replace('text-', '');
        
        return `
            <div class="space-y-4">
                <div class="text-lg font-semibold text-gray-300">${data.label}</div>
                
                <div class="flex items-center justify-center space-x-4">
                    <div class="stat-old-value text-2xl font-bold text-gray-400">
                        ${data.oldValue}
                    </div>
                    
                    <div class="transition-arrow opacity-0 transition-opacity duration-500">
                        <i class="ph-duotone ph-arrow-right text-xl" style="color: ${colorValue};"></i>
                    </div>
                    
                    <div class="stat-new-value text-2xl font-bold opacity-0 transition-all duration-500" style="color: ${colorValue};">
                        ${data.newValue}
                    </div>
                </div>
                
                <div class="change-indicator text-lg font-semibold opacity-0 transition-opacity duration-500" style="color: ${colorValue};">
                    ${data.change > 0 ? '+' : ''}${data.change}
                </div>
            </div>
        `;
    }

    // Render level up content
    renderLevelUpContent(data) {
        const colorValue = data.color.replace('text-', '');
        const statIncreasesHtml = data.statIncreases ? 
            Object.entries(data.statIncreases).map(([stat, increase]) => 
                `<div class="flex justify-between"><span>${this.getStatLabel(stat)}:</span><span class="text-green-400">+${increase}</span></div>`
            ).join('') : '';

        return `
            <div class="space-y-4">
                <div class="flex items-center justify-center space-x-4">
                    <div class="stat-old-value text-3xl font-bold text-gray-400">
                        Level ${data.oldValue}
                    </div>
                    
                    <div class="transition-arrow opacity-0 transition-opacity duration-500">
                        <i class="ph-duotone ph-arrow-right text-xl" style="color: ${colorValue};"></i>
                    </div>
                    
                    <div class="stat-new-value text-3xl font-bold opacity-0 transition-all duration-500" style="color: ${colorValue};">
                        Level ${data.newValue}
                    </div>
                </div>
                
                ${statIncreasesHtml ? `
                    <div class="stat-increases bg-gray-800 rounded-lg p-4 mt-4 opacity-0 transition-opacity duration-700">
                        <h4 class="text-sm font-semibold text-gray-300 mb-2">Stat Increases:</h4>
                        <div class="space-y-1 text-sm">
                            ${statIncreasesHtml}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Render generic content
    renderGenericContent(data) {
        const colorValue = data.color.replace('text-', '');
        
        return `
            <div class="space-y-4">
                <div class="text-lg font-semibold text-gray-300">${data.label}</div>
                
                <div class="flex items-center justify-center space-x-4">
                    <div class="stat-old-value text-2xl font-bold text-gray-400">
                        ${data.oldValue}
                    </div>
                    
                    <div class="transition-arrow opacity-0 transition-opacity duration-500">
                        <i class="ph-duotone ph-arrow-right text-xl" style="color: ${colorValue};"></i>
                    </div>
                    
                    <div class="stat-new-value text-2xl font-bold opacity-0 transition-all duration-500" style="color: ${colorValue};">
                        ${data.newValue}
                    </div>
                </div>
            </div>
        `;
    }

    // Animate the stat change
    animateStatChange(data) {
        const modal = this.currentModal;
        if (!modal) return;

        setTimeout(() => {
            // Show transition arrow
            const arrow = modal.querySelector('.transition-arrow');
            if (arrow) arrow.classList.remove('opacity-0');
        }, 200);

        setTimeout(() => {
            // Show new value
            const newValue = modal.querySelector('.stat-new-value');
            if (newValue) newValue.classList.remove('opacity-0');

            // Animate progress bar for health/mana
            const progressBar = modal.querySelector('.progress-bar-fill');
            if (progressBar) {
                const targetWidth = progressBar.dataset.targetWidth;
                progressBar.style.width = targetWidth;
                
                // Show new value display
                const newValueDisplay = modal.querySelector('.stat-new-value');
                if (newValueDisplay) {
                    setTimeout(() => {
                        newValueDisplay.classList.remove('opacity-0');
                    }, 500);
                }
            }

            // Show change indicator
            const changeIndicator = modal.querySelector('.change-indicator');
            if (changeIndicator) changeIndicator.classList.remove('opacity-0');

            // Show stat increases for level up
            const statIncreases = modal.querySelector('.stat-increases');
            if (statIncreases) {
                setTimeout(() => {
                    statIncreases.classList.remove('opacity-0');
                }, 300);
            }
        }, 500);
    }

    // Close the current modal
    closeModal() {
        if (this.currentModal) {
            const modal = this.currentModal.querySelector('.stat-change-modal');
            if (modal) {
                modal.classList.add('scale-95', 'opacity-0');
                setTimeout(() => {
                    if (this.currentModal && this.currentModal.parentNode) {
                        this.currentModal.parentNode.removeChild(this.currentModal);
                    }
                    this.currentModal = null;
                    
                    if (this.currentCallback) {
                        this.currentCallback();
                        this.currentCallback = null;
                    }
                }, 300);
            }
        }
    }

    // Utility functions
    getStatIcon(stat) {
        const icons = {
            strength: 'ph-sword',
            dexterity: 'ph-lightning',
            constitution: 'ph-shield',
            intelligence: 'ph-book',
            wisdom: 'ph-eye',
            charisma: 'ph-chat-circle'
        };
        return icons[stat] || 'ph-plus';
    }

    getStatLabel(stat) {
        const labels = {
            strength: 'Strength',
            dexterity: 'Dexterity',
            constitution: 'Constitution',
            intelligence: 'Intelligence',
            wisdom: 'Wisdom',
            charisma: 'Charisma'
        };
        return labels[stat] || stat.charAt(0).toUpperCase() + stat.slice(1);
    }
}

// Create global stat change animator instance
const statChangeAnimator = new StatChangeAnimator();

// Initialize when game loads
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gameData !== 'undefined') {
        statChangeAnimator.initialize();
    }
});

// Export functions for use in other modules
window.showHealingAnimation = (healAmount, oldHP, newHP, maxHP) => {
    statChangeAnimator.showHealingAnimation(healAmount, oldHP, newHP, maxHP);
};

window.showManaAnimation = (manaAmount, oldMana, newMana, maxMana) => {
    statChangeAnimator.showManaAnimation(manaAmount, oldMana, newMana, maxMana);
};

window.showStatBonusAnimation = (statChanges, itemName, isEquipping = true) => {
    statChangeAnimator.showStatBonusAnimation(statChanges, itemName, isEquipping);
};

window.showLevelUpAnimation = (oldLevel, newLevel, statIncreases) => {
    statChangeAnimator.showLevelUpAnimation(oldLevel, newLevel, statIncreases);
};

window.toggleStatAnimations = (enabled) => {
    statChangeAnimator.toggle(enabled);
};

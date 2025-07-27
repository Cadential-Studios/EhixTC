// Active Effects Display
// Shows temporary buffs and effects from consumables

class ActiveEffectsDisplay {
    constructor() {
        this.container = null;
        this.updateInterval = null;
    }

    /**
     * Initialize and show the active effects display
     */
    initialize() {
        this.createContainer();
        this.startUpdateLoop();
    }

    /**
     * Create the container for active effects
     */
    createContainer() {
        // Remove existing container if present
        const existing = document.getElementById('active-effects-display');
        if (existing) {
            existing.remove();
        }

        // Create new container
        this.container = document.createElement('div');
        this.container.id = 'active-effects-display';
        this.container.className = 'fixed top-20 right-4 z-30 max-w-xs';
        
        document.body.appendChild(this.container);
    }

    /**
     * Update the display with current active effects
     */
    updateDisplay() {
        if (!this.container) return;

        const effects = typeof getActiveEffects === 'function' ? getActiveEffects() : [];
        
        if (effects.length === 0) {
            this.container.style.display = 'none';
            return;
        }

        this.container.style.display = 'block';
        
        const effectsHTML = effects.map(effect => {
            const timeLeft = this.formatTimeLeft(effect.timeLeftSeconds);
            const effectIcon = this.getEffectIcon(effect.type);
            const effectColor = this.getEffectColor(effect.type);
            
            return `
                <div class="active-effect bg-gray-800 border-l-4 ${effectColor} rounded-r-lg p-3 mb-2 shadow-lg">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-lg">${effectIcon}</span>
                            <div>
                                <div class="text-white text-sm font-semibold">${effect.itemName}</div>
                                <div class="text-gray-400 text-xs">${this.getEffectDescription(effect)}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-xs text-gray-300">${timeLeft}</div>
                        </div>
                    </div>
                    
                    <!-- Progress bar for time remaining -->
                    <div class="w-full bg-gray-700 rounded-full h-1 mt-2">
                        <div class="bg-blue-500 h-1 rounded-full transition-all duration-1000" 
                             style="width: ${(effect.timeLeftSeconds / ((effect.endTime - Date.now()) / 1000 + effect.timeLeftSeconds)) * 100}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        this.container.innerHTML = `
            <div class="active-effects-header bg-gray-900 rounded-t-lg p-2 border-b border-gray-600">
                <div class="flex items-center justify-between">
                    <span class="text-white text-sm font-semibold">⭐ Active Effects</span>
                    <button onclick="activeEffectsDisplay.toggleVisibility()" class="text-gray-400 hover:text-white">
                        <i class="ph-duotone ph-eye"></i>
                    </button>
                </div>
            </div>
            <div class="active-effects-list">
                ${effectsHTML}
            </div>
        `;
    }

    /**
     * Get an icon for the effect type
     */
    getEffectIcon(type) {
        switch (type) {
            case 'stat_buff': return '💪';
            case 'healing': return '❤️';
            case 'mana_restoration': return '💙';
            case 'sustenance': return '🍞';
            case 'protection': return '🛡️';
            default: return '✨';
        }
    }

    /**
     * Get a color class for the effect type
     */
    getEffectColor(type) {
        switch (type) {
            case 'stat_buff': return 'border-green-500';
            case 'healing': return 'border-red-500';
            case 'mana_restoration': return 'border-blue-500';
            case 'sustenance': return 'border-yellow-500';
            case 'protection': return 'border-purple-500';
            default: return 'border-gray-500';
        }
    }

    /**
     * Get a description for the effect
     */
    getEffectDescription(effect) {
        switch (effect.type) {
            case 'stat_buff':
                const modifier = effect.modifier > 0 ? `+${effect.modifier}` : effect.modifier;
                return `${effect.stat.charAt(0).toUpperCase() + effect.stat.slice(1)} ${modifier}`;
            case 'sustenance':
                return 'Well fed and nourished';
            default:
                return 'Temporary effect active';
        }
    }

    /**
     * Format time left in a readable format
     */
    formatTimeLeft(seconds) {
        if (seconds < 60) {
            return `${seconds}s`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}m ${remainingSeconds}s`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours}h ${minutes}m`;
        }
    }

    /**
     * Start the update loop
     */
    startUpdateLoop() {
        // Update every second
        this.updateInterval = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    /**
     * Stop the update loop
     */
    stopUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Toggle visibility of the effects display
     */
    toggleVisibility() {
        if (!this.container) return;
        
        const effectsList = this.container.querySelector('.active-effects-list');
        if (effectsList) {
            const isHidden = effectsList.style.display === 'none';
            effectsList.style.display = isHidden ? 'block' : 'none';
        }
    }

    /**
     * Destroy the display
     */
    destroy() {
        this.stopUpdateLoop();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
    }
}

// Create global instance
const activeEffectsDisplay = new ActiveEffectsDisplay();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    activeEffectsDisplay.initialize();
});

// Global access
window.activeEffectsDisplay = activeEffectsDisplay;

console.log('Active Effects Display loaded');

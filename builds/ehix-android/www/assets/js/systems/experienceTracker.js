// Real-time Experience Tracker
// Provides live updates and debugging for the experience system

class ExperienceTracker {
    constructor() {
        this.isTracking = false;
        this.trackingInterval = null;
        this.lastXP = 0;
        this.lastLevel = 1;
        this.notifications = [];
    }

    /**
     * Start tracking experience changes
     */
    startTracking() {
        if (this.isTracking) return;
        
        this.isTracking = true;
        this.lastXP = gameData.player.experience;
        this.lastLevel = gameData.player.level;
        
        // Create floating tracker if it doesn't exist
        this.createTracker();
        
        // Update every 100ms for real-time feedback
        this.trackingInterval = setInterval(() => {
            this.updateTracker();
        }, 100);
        
        console.log('Experience tracker started');
    }

    /**
     * Stop tracking experience changes
     */
    stopTracking() {
        if (!this.isTracking) return;
        
        this.isTracking = false;
        
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
            this.trackingInterval = null;
        }
        
        this.removeTracker();
        console.log('Experience tracker stopped');
    }

    /**
     * Create the floating experience tracker
     */
    createTracker() {
        // Remove existing tracker if any
        this.removeTracker();

        const tracker = document.createElement('div');
        tracker.id = 'experience-tracker';
        tracker.className = 'fixed top-20 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg border border-purple-500 z-50 text-sm';
        tracker.style.minWidth = '200px';

        tracker.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-purple-300">XP Tracker</span>
                <button onclick="experienceTracker.stopTracking()" class="text-gray-400 hover:text-white">&times;</button>
            </div>
            <div id="tracker-content"></div>
        `;

        document.body.appendChild(tracker);
    }

    /**
     * Remove the floating experience tracker
     */
    removeTracker() {
        const tracker = document.getElementById('experience-tracker');
        if (tracker) {
            tracker.remove();
        }
    }

    /**
     * Update tracker content
     */
    updateTracker() {
        const content = document.getElementById('tracker-content');
        if (!content) return;

        const player = gameData.player;
        const currentXP = player.experience;
        const currentLevel = player.level;
        
        // Check for XP changes
        const xpGained = currentXP - this.lastXP;
        if (xpGained > 0) {
            this.addNotification(`+${xpGained} XP`);
        }

        // Check for level changes
        if (currentLevel > this.lastLevel) {
            this.addNotification(`LEVEL UP! ${this.lastLevel} → ${currentLevel}`, 'level-up');
        }

        this.lastXP = currentXP;
        this.lastLevel = currentLevel;

        // Get experience stats
        let xpStats = null;
        if (typeof experienceManager !== 'undefined') {
            xpStats = experienceManager.getExperienceStats();
        }

        // Build content
        const notifications = this.notifications.slice(-3).map(notif => 
            `<div class="text-xs ${notif.type === 'level-up' ? 'text-yellow-300' : 'text-green-300'}">${notif.text}</div>`
        ).join('');

        content.innerHTML = `
            <div class="space-y-1">
                <div><strong>Level:</strong> ${currentLevel}</div>
                <div><strong>Total XP:</strong> ${currentXP.toLocaleString()}</div>
                ${xpStats ? `
                    <div><strong>In Level:</strong> ${xpStats.experienceInCurrentLevel.toLocaleString()}</div>
                    <div><strong>To Next:</strong> ${xpStats.experienceToNextLevel.toLocaleString()}</div>
                    <div class="w-full h-2 bg-gray-700 rounded-full mt-1">
                        <div class="h-full bg-purple-600 rounded-full transition-all duration-300" 
                             style="width: ${xpStats.progressPercent}%"></div>
                    </div>
                    <div class="text-xs text-center text-gray-400">${xpStats.progressPercent.toFixed(1)}%</div>
                ` : ''}
                ${notifications ? `<div class="mt-2 border-t border-gray-600 pt-1">${notifications}</div>` : ''}
            </div>
        `;
    }

    /**
     * Add a notification to the tracker
     */
    addNotification(text, type = 'xp-gain') {
        this.notifications.push({
            text: text,
            type: type,
            timestamp: Date.now()
        });

        // Keep only last 10 notifications
        if (this.notifications.length > 10) {
            this.notifications = this.notifications.slice(-10);
        }
    }

    /**
     * Toggle tracking on/off
     */
    toggleTracking() {
        if (this.isTracking) {
            this.stopTracking();
        } else {
            this.startTracking();
        }
    }
}

// Create global experience tracker instance
const experienceTracker = new ExperienceTracker();

// Add convenience functions
window.startXPTracker = () => experienceTracker.startTracking();
window.stopXPTracker = () => experienceTracker.stopTracking();
window.toggleXPTracker = () => experienceTracker.toggleTracking();

// Auto-start tracker in debug mode
if (window.location.hostname === 'localhost') {
    setTimeout(() => {
        experienceTracker.startTracking();
    }, 2000);
}

console.log('Experience Tracker loaded - Use startXPTracker() or toggleXPTracker()');

// Event Bus System - Edoria: The Triune Convergence
// Centralized event communication system for decoupled system interactions

class EventBus {
    constructor() {
        this.events = new Map();
        this.debugMode = false;
        this.eventHistory = [];
        this.maxHistorySize = 1000;
    }

    /**
     * Subscribe to an event
     * @param {string} eventName - Name of the event to listen for
     * @param {Function} handler - Function to call when event is emitted
     * @param {Object} options - Optional settings { once: boolean, priority: number }
     */
    on(eventName, handler, options = {}) {
        if (typeof handler !== 'function') {
            throw new Error(`Event handler must be a function for event: ${eventName}`);
        }

        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        const listeners = this.events.get(eventName);
        const listener = {
            handler,
            once: options.once || false,
            priority: options.priority || 0,
            id: this._generateListenerId()
        };

        listeners.push(listener);
        
        // Sort by priority (higher priority first)
        listeners.sort((a, b) => b.priority - a.priority);

        if (this.debugMode) {
            console.log(`[EventBus] Registered listener for '${eventName}' with priority ${listener.priority}`);
        }

        return listener.id;
    }

    /**
     * Subscribe to an event for one-time execution
     * @param {string} eventName - Name of the event to listen for
     * @param {Function} handler - Function to call when event is emitted
     */
    once(eventName, handler) {
        return this.on(eventName, handler, { once: true });
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName - Name of the event
     * @param {string|Function} handlerOrId - Either the handler function or listener ID
     */
    off(eventName, handlerOrId) {
        if (!this.events.has(eventName)) {
            return false;
        }

        const listeners = this.events.get(eventName);
        const initialLength = listeners.length;

        if (typeof handlerOrId === 'string') {
            // Remove by ID
            const index = listeners.findIndex(listener => listener.id === handlerOrId);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        } else {
            // Remove by handler function
            const index = listeners.findIndex(listener => listener.handler === handlerOrId);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }

        // Clean up empty event arrays
        if (listeners.length === 0) {
            this.events.delete(eventName);
        }

        return listeners.length < initialLength;
    }

    /**
     * Emit an event to all listeners
     * @param {string} eventName - Name of the event to emit
     * @param {*} data - Data to pass to event handlers
     */
    emit(eventName, data = null) {
        if (this.debugMode) {
            console.log(`[EventBus] Emitting '${eventName}'`, data);
        }

        // Add to history
        this._addToHistory(eventName, data);

        if (!this.events.has(eventName)) {
            return [];
        }

        const listeners = this.events.get(eventName);
        const results = [];
        const listenersToRemove = [];

        for (const listener of listeners) {
            try {
                const result = listener.handler(data, eventName);
                results.push(result);

                if (listener.once) {
                    listenersToRemove.push(listener);
                }
            } catch (error) {
                console.error(`[EventBus] Error in event handler for '${eventName}':`, error);
                results.push(null);
            }
        }

        // Remove one-time listeners
        for (const listener of listenersToRemove) {
            this.off(eventName, listener.id);
        }

        return results;
    }

    /**
     * Emit an event asynchronously
     * @param {string} eventName - Name of the event to emit
     * @param {*} data - Data to pass to event handlers
     */
    async emitAsync(eventName, data = null) {
        if (this.debugMode) {
            console.log(`[EventBus] Emitting async '${eventName}'`, data);
        }

        this._addToHistory(eventName, data);

        if (!this.events.has(eventName)) {
            return [];
        }

        const listeners = this.events.get(eventName);
        const results = [];
        const listenersToRemove = [];

        for (const listener of listeners) {
            try {
                const result = await listener.handler(data, eventName);
                results.push(result);

                if (listener.once) {
                    listenersToRemove.push(listener);
                }
            } catch (error) {
                console.error(`[EventBus] Error in async event handler for '${eventName}':`, error);
                results.push(null);
            }
        }

        // Remove one-time listeners
        for (const listener of listenersToRemove) {
            this.off(eventName, listener.id);
        }

        return results;
    }

    /**
     * Check if there are listeners for an event
     * @param {string} eventName - Name of the event
     */
    hasListeners(eventName) {
        return this.events.has(eventName) && this.events.get(eventName).length > 0;
    }

    /**
     * Get list of all registered events
     */
    getEventNames() {
        return Array.from(this.events.keys());
    }

    /**
     * Get listener count for an event
     * @param {string} eventName - Name of the event
     */
    getListenerCount(eventName) {
        return this.events.has(eventName) ? this.events.get(eventName).length : 0;
    }

    /**
     * Clear all listeners for an event or all events
     * @param {string} [eventName] - Optional event name to clear, if not provided clears all
     */
    clear(eventName = null) {
        if (eventName) {
            this.events.delete(eventName);
        } else {
            this.events.clear();
        }
    }

    /**
     * Enable or disable debug mode
     * @param {boolean} enabled - Whether debug mode should be enabled
     */
    setDebugMode(enabled) {
        this.debugMode = enabled;
        console.log(`[EventBus] Debug mode ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Get recent event history
     * @param {number} [limit] - Maximum number of events to return
     */
    getEventHistory(limit = 50) {
        return this.eventHistory.slice(-limit);
    }

    /**
     * Generate unique listener ID
     * @private
     */
    _generateListenerId() {
        return `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Add event to history
     * @private
     */
    _addToHistory(eventName, data) {
        this.eventHistory.push({
            eventName,
            data,
            timestamp: Date.now()
        });

        // Maintain history size limit
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }
    }
}

// Event name constants for type safety
const EVENTS = {
    // Journal System Events
    JOURNAL_ENTRY_ADDED: 'JOURNAL_ENTRY_ADDED',
    JOURNAL_ENTRY_UPDATED: 'JOURNAL_ENTRY_UPDATED',
    JOURNAL_ENTRY_REMOVED: 'JOURNAL_ENTRY_REMOVED',
    JOURNAL_ENTRY_PINNED: 'JOURNAL_ENTRY_PINNED',
    JOURNAL_ENTRY_UNPINNED: 'JOURNAL_ENTRY_UNPINNED',
    JOURNAL_TAB_CHANGED: 'JOURNAL_TAB_CHANGED',
    JOURNAL_SEARCH_UPDATED: 'JOURNAL_SEARCH_UPDATED',
    
    // Quest System Events
    QUEST_STARTED: 'QUEST_STARTED',
    QUEST_COMPLETED: 'QUEST_COMPLETED',
    QUEST_FAILED: 'QUEST_FAILED',
    QUEST_PROGRESS_UPDATED: 'QUEST_PROGRESS_UPDATED',
    QUEST_OBJECTIVE_COMPLETED: 'QUEST_OBJECTIVE_COMPLETED',
    
    // Player System Events
    PLAYER_STAT_CHANGED: 'PLAYER_STAT_CHANGED',
    PLAYER_LEVEL_UP: 'PLAYER_LEVEL_UP',
    PLAYER_LOCATION_CHANGED: 'PLAYER_LOCATION_CHANGED',
    PLAYER_EXPERIENCE_GAINED: 'PLAYER_EXPERIENCE_GAINED',
    
    // Inventory System Events
    INVENTORY_ITEM_ADDED: 'INVENTORY_ITEM_ADDED',
    INVENTORY_ITEM_REMOVED: 'INVENTORY_ITEM_REMOVED',
    INVENTORY_ITEM_USED: 'INVENTORY_ITEM_USED',
    INVENTORY_UPDATED: 'INVENTORY_UPDATED',
    
    // Equipment System Events
    EQUIPMENT_ITEM_EQUIPPED: 'EQUIPMENT_ITEM_EQUIPPED',
    EQUIPMENT_ITEM_UNEQUIPPED: 'EQUIPMENT_ITEM_UNEQUIPPED',
    EQUIPMENT_STATS_RECALCULATED: 'EQUIPMENT_STATS_RECALCULATED',
    
    // Discovery Events (for journal)
    LOCATION_DISCOVERED: 'LOCATION_DISCOVERED',
    NPC_MET: 'NPC_MET',
    MONSTER_ENCOUNTERED: 'MONSTER_ENCOUNTERED',
    LORE_DISCOVERED: 'LORE_DISCOVERED',
    
    // UI Events
    UI_PANEL_OPENED: 'UI_PANEL_OPENED',
    UI_PANEL_CLOSED: 'UI_PANEL_CLOSED',
    UI_TAB_CHANGED: 'UI_TAB_CHANGED',
    
    // System Events
    SYSTEM_INITIALIZED: 'SYSTEM_INITIALIZED',
    SYSTEM_ERROR: 'SYSTEM_ERROR',
    GAME_SAVED: 'GAME_SAVED',
    GAME_LOADED: 'GAME_LOADED'
};

// Create global event bus instance
const eventBus = new EventBus();

// Make EVENTS globally available
if (typeof window !== 'undefined') {
    window.EVENTS = EVENTS;
    window.EventBus = EventBus;
    window.eventBus = eventBus;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EventBus, eventBus, EVENTS };
}

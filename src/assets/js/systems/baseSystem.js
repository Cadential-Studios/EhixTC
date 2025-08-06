// Base System Class - Edoria: The Triune Convergence
// Standard interface and functionality for all game systems

class BaseSystem {
    constructor(config = {}) {
        this.name = this.constructor.name;
        this.initialized = false;
        this.enabled = true;
        this.config = { ...this.getDefaultConfig(), ...config };
        
        // System dependencies
        this.eventBus = null;
        this.dataManager = null;
        this.systemManager = null;
        
        // System state
        this.state = {};
        this.lastUpdateTime = 0;
        this.updateInterval = 16; // 60 FPS default
        
        // Event listener tracking for cleanup
        this.eventListeners = new Set();
    }

    /**
     * Get default configuration for this system
     * Override in child classes
     */
    getDefaultConfig() {
        return {
            enabled: true,
            debugMode: false,
            updateRate: 60 // FPS
        };
    }

    /**
     * Initialize the system with dependencies
     * @param {Object} dependencies - System dependencies
     */
    async initialize(dependencies = {}) {
        if (this.initialized) {
            this.log('warn', 'System already initialized');
            return;
        }

        try {
            // Set up dependencies
            this.eventBus = dependencies.eventBus || window.eventBus;
            this.dataManager = dependencies.dataManager;
            this.systemManager = dependencies.systemManager;

            if (!this.eventBus) {
                throw new Error('EventBus dependency is required');
            }

            // Calculate update interval from config
            this.updateInterval = 1000 / (this.config.updateRate || 60);

            // Initialize system-specific logic
            await this.onInitialize();

            // Set up event listeners
            this.setupEventListeners();

            this.initialized = true;
            this.log('info', 'System initialized successfully');

            // Emit initialization event
            this.emit(EVENTS.SYSTEM_INITIALIZED, {
                system: this.name,
                config: this.config
            });

        } catch (error) {
            this.log('error', 'Failed to initialize system:', error);
            this.emit(EVENTS.SYSTEM_ERROR, {
                system: this.name,
                error: error.message,
                phase: 'initialization'
            });
            throw error;
        }
    }

    /**
     * System-specific initialization logic
     * Override in child classes
     */
    async onInitialize() {
        // Default implementation does nothing
    }

    /**
     * Set up event listeners for this system
     * Override in child classes
     */
    setupEventListeners() {
        // Default implementation does nothing
    }

    /**
     * Update system logic - called each frame
     * @param {number} deltaTime - Time since last update in milliseconds
     */
    update(deltaTime = 16) {
        if (!this.initialized || !this.enabled) {
            return;
        }

        try {
            const now = Date.now();
            
            // Throttle updates based on update interval
            if (now - this.lastUpdateTime < this.updateInterval) {
                return;
            }

            this.onUpdate(deltaTime);
            this.lastUpdateTime = now;

        } catch (error) {
            this.log('error', 'Error during system update:', error);
            this.emit(EVENTS.SYSTEM_ERROR, {
                system: this.name,
                error: error.message,
                phase: 'update'
            });
        }
    }

    /**
     * System-specific update logic
     * Override in child classes
     * @param {number} deltaTime - Time since last update in milliseconds
     */
    onUpdate(deltaTime) {
        // Default implementation does nothing
    }

    /**
     * Destroy system and clean up resources
     */
    async destroy() {
        if (!this.initialized) {
            return;
        }

        try {
            // Remove all event listeners
            this.cleanupEventListeners();

            // System-specific cleanup
            await this.onDestroy();

            // Reset state
            this.initialized = false;
            this.state = {};
            
            this.log('info', 'System destroyed successfully');

        } catch (error) {
            this.log('error', 'Error during system destruction:', error);
            this.emit(EVENTS.SYSTEM_ERROR, {
                system: this.name,
                error: error.message,
                phase: 'destruction'
            });
        }
    }

    /**
     * System-specific destruction logic
     * Override in child classes
     */
    async onDestroy() {
        // Default implementation does nothing
    }

    /**
     * Enable the system
     */
    enable() {
        this.enabled = true;
        this.log('info', 'System enabled');
        this.onEnable();
    }

    /**
     * Disable the system
     */
    disable() {
        this.enabled = false;
        this.log('info', 'System disabled');
        this.onDisable();
    }

    /**
     * Called when system is enabled
     * Override in child classes
     */
    onEnable() {
        // Default implementation does nothing
    }

    /**
     * Called when system is disabled
     * Override in child classes
     */
    onDisable() {
        // Default implementation does nothing
    }

    /**
     * Get system status information
     */
    getStatus() {
        return {
            name: this.name,
            initialized: this.initialized,
            enabled: this.enabled,
            config: this.config,
            state: this.state,
            lastUpdateTime: this.lastUpdateTime
        };
    }

    /**
     * Update system configuration
     * @param {Object} newConfig - Configuration updates
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.onConfigUpdate(newConfig);
        this.log('info', 'Configuration updated');
    }

    /**
     * Called when configuration is updated
     * Override in child classes
     * @param {Object} newConfig - The configuration that was updated
     */
    onConfigUpdate(newConfig) {
        // Default implementation does nothing
    }

    // Event handling methods
    
    /**
     * Emit an event
     * @param {string} eventName - Name of the event
     * @param {*} data - Event data
     */
    emit(eventName, data) {
        if (this.eventBus) {
            this.eventBus.emit(eventName, data);
        }
    }

    /**
     * Listen for an event
     * @param {string} eventName - Name of the event
     * @param {Function} handler - Event handler function
     * @param {Object} options - Event options
     */
    on(eventName, handler, options = {}) {
        if (this.eventBus) {
            const listenerId = this.eventBus.on(eventName, handler, options);
            this.eventListeners.add({ eventName, listenerId });
            return listenerId;
        }
        return null;
    }

    /**
     * Listen for an event once
     * @param {string} eventName - Name of the event
     * @param {Function} handler - Event handler function
     */
    once(eventName, handler) {
        return this.on(eventName, handler, { once: true });
    }

    /**
     * Stop listening for an event
     * @param {string} eventName - Name of the event
     * @param {string|Function} handlerOrId - Handler function or listener ID
     */
    off(eventName, handlerOrId) {
        if (this.eventBus) {
            this.eventBus.off(eventName, handlerOrId);
            
            // Remove from tracking
            this.eventListeners.forEach(listener => {
                if (listener.eventName === eventName && 
                    (listener.listenerId === handlerOrId || listener.handler === handlerOrId)) {
                    this.eventListeners.delete(listener);
                }
            });
        }
    }

    /**
     * Clean up all event listeners
     */
    cleanupEventListeners() {
        this.eventListeners.forEach(listener => {
            if (this.eventBus) {
                this.eventBus.off(listener.eventName, listener.listenerId);
            }
        });
        this.eventListeners.clear();
    }

    // Utility methods

    /**
     * Log a message with system context
     * @param {string} level - Log level (info, warn, error)
     * @param {string} message - Log message
     * @param {...*} args - Additional arguments
     */
    log(level, message, ...args) {
        if (this.config.debugMode || level === 'error') {
            const prefix = `[${this.name}]`;
            console[level](prefix, message, ...args);
        }
    }

    /**
     * Validate that the system is initialized
     * @throws {Error} If system is not initialized
     */
    requireInitialized() {
        if (!this.initialized) {
            throw new Error(`${this.name} system is not initialized`);
        }
    }

    /**
     * Validate that the system is enabled
     * @throws {Error} If system is not enabled
     */
    requireEnabled() {
        this.requireInitialized();
        if (!this.enabled) {
            throw new Error(`${this.name} system is not enabled`);
        }
    }

    /**
     * Get data from the data manager
     * @param {string} key - Data key
     * @param {*} defaultValue - Default value if key doesn't exist
     */
    getData(key, defaultValue = null) {
        return this.dataManager ? this.dataManager.get(key, defaultValue) : defaultValue;
    }

    /**
     * Set data in the data manager
     * @param {string} key - Data key
     * @param {*} value - Data value
     */
    setData(key, value) {
        if (this.dataManager) {
            this.dataManager.set(key, value);
        }
    }

    /**
     * Wait for a condition to be true
     * @param {Function} condition - Function that returns true when condition is met
     * @param {number} timeout - Maximum time to wait in milliseconds
     * @param {number} interval - Check interval in milliseconds
     */
    async waitFor(condition, timeout = 5000, interval = 100) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            if (condition()) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        
        throw new Error(`Timeout waiting for condition in ${this.name}`);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseSystem;
}

// Developer Menu System
// Advanced debugging and testing interface for Edoria: The Triune Convergence

class DeveloperMenu {
    constructor() {
        this.isEnabled = false;
        this.isVisible = false;
        this.menuElement = null;
        this.categories = {};
        this.commandHistory = [];
        this.shortcuts = {};
        
        // Auto-detect developer mode
        this.detectDeveloperMode();
        
        // Set up keyboard listener
        this.setupKeyboardListeners();
        
        // Initialize menu categories
        this.initializeCategories();
        
        console.log(`Developer Menu ${this.isEnabled ? 'ENABLED' : 'DISABLED'}`);
    }

    /**
     * Detect if we're in developer mode
     */
    detectDeveloperMode() {
        // Multiple ways to detect dev mode
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const isFileProtocol = window.location.protocol === 'file:';
        const hasDevParam = new URLSearchParams(window.location.search).has('dev');
        const hasConsoleFlag = localStorage.getItem('devMode') === 'true';
        const isDebugEnv = window.location.port === '8000' || window.location.port === '3000';
        
        this.isEnabled = isLocalhost || isFileProtocol || hasDevParam || hasConsoleFlag || isDebugEnv;
        
        // Show dev mode indicator
        if (this.isEnabled) {
            this.showDevModeIndicator();
        }
        
        // Allow forcing dev mode via console
        window.enableDevMode = () => {
            localStorage.setItem('devMode', 'true');
            this.isEnabled = true;
            this.showDevModeIndicator();
            this.log('Developer mode ENABLED');
        };
        
        window.disableDevMode = () => {
            localStorage.setItem('devMode', 'false');
            this.isEnabled = false;
            this.hideDevModeIndicator();
            this.hide();
            this.log('Developer mode DISABLED');
        };

        return this.isEnabled;
    }

    /**
     * Set up keyboard event listeners
     */
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Backtick (`) to toggle developer menu
            if (e.key === '`' || e.key === '~') {
                e.preventDefault();
                if (this.isEnabled) {
                    this.toggle();
                }
            }
            
            // Escape to close menu
            if (e.key === 'Escape' && this.isVisible) {
                e.preventDefault();
                this.hide();
            }
            
            // Other shortcuts when menu is open
            if (this.isVisible) {
                this.handleMenuKeyboard(e);
            }
        });
    }

    /**
     * Handle keyboard shortcuts within the menu
     */
    handleMenuKeyboard(e) {
        const shortcuts = {
            '1': () => this.switchCategory('player'),
            '2': () => this.switchCategory('experience'),
            '3': () => this.switchCategory('inventory'),
            '4': () => this.switchCategory('world'),
            '5': () => this.switchCategory('combat'),
            '6': () => this.switchCategory('system'),
            'c': () => this.clearConsole(),
            'r': () => this.reloadGame(),
            'h': () => this.showHelp()
        };
        
        if (shortcuts[e.key.toLowerCase()]) {
            e.preventDefault();
            shortcuts[e.key.toLowerCase()]();
        }
    }

    /**
     * Initialize menu categories
     */
    initializeCategories() {
        this.categories = {
            player: {
                name: '👤 Player',
                commands: [
                    { name: 'Set Level', action: () => this.promptSetLevel() },
                    { name: 'Set HP to Max', action: () => this.setHPToMax() },
                    { name: 'Set MP to Max', action: () => this.setMPToMax() },
                    { name: 'Heal Fully', action: () => this.healFully() },
                    { name: 'Add Gold (100)', action: () => this.addGold(100) },
                    { name: 'Add Gold (1000)', action: () => this.addGold(1000) },
                    { name: 'Reset Stats', action: () => this.resetStats() },
                    { name: 'God Mode Toggle', action: () => this.toggleGodMode() }
                ]
            },
            experience: {
                name: '⭐ Experience',
                commands: [
                    { name: '+50 XP', action: () => this.addXP(50) },
                    { name: '+100 XP', action: () => this.addXP(100) },
                    { name: '+250 XP', action: () => this.addXP(250) },
                    { name: '+500 XP', action: () => this.addXP(500) },
                    { name: 'Custom XP', action: () => this.promptAddXP() },
                    { name: 'Set Level', action: () => this.promptSetLevel() },
                    { name: 'Level Up', action: () => this.levelUp() },
                    { name: 'XP Tracker Toggle', action: () => this.toggleXPTracker() }
                ]
            },
            inventory: {
                name: '🎒 Inventory',
                commands: [
                    { name: 'Add Test Items', action: () => this.addTestItems() },
                    { name: 'Add Consumables', action: () => this.addTestConsumables() },
                    { name: 'Clear Inventory', action: () => this.clearInventory() },
                    { name: 'Add Weapon', action: () => this.promptAddItem('weapon') },
                    { name: 'Add Armor', action: () => this.promptAddItem('armor') },
                    { name: 'Add Consumable', action: () => this.promptAddItem('consumable') },
                    { name: 'Show Item List', action: () => this.showItemList() },
                    { name: 'Repair All', action: () => this.repairAllItems() }
                ]
            },
            world: {
                name: '🌍 World',
                commands: [
                    { name: 'Skip Time (1 hour)', action: () => this.skipTime(1) },
                    { name: 'Skip Time (1 day)', action: () => this.skipTime(24) },
                    { name: 'Reset Time', action: () => this.resetTime() },
                    { name: 'Toggle Time', action: () => this.toggleTime() },
                    { name: 'Change Weather', action: () => this.promptChangeWeather() },
                    { name: 'Set Location', action: () => this.promptSetLocation() },
                    { name: 'Show Game State', action: () => this.showGameState() }
                ]
            },
            combat: {
                name: '⚔️ Combat',
                commands: [
                    { name: 'Start Test Combat', action: () => this.startTestCombat() },
                    { name: 'End Combat', action: () => this.endCombat() },
                    { name: 'Win Combat', action: () => this.winCombat() },
                    { name: 'Flee Combat', action: () => this.fleeCombat() },
                    { name: 'Add Enemy', action: () => this.promptAddEnemy() },
                    { name: 'Heal All', action: () => this.healAllCombatants() }
                ]
            },
            system: {
                name: '⚙️ System',
                commands: [
                    { name: 'Save Game', action: () => this.saveGame() },
                    { name: 'Load Game', action: () => this.loadGame() },
                    { name: 'Clear Save', action: () => this.clearSave() },
                    { name: 'Export Data', action: () => this.exportGameData() },
                    { name: 'Import Data', action: () => this.promptImportData() },
                    { name: 'Clear Effects', action: () => this.clearActiveEffects() },
                    { name: 'Reload Page', action: () => this.reloadGame() },
                    { name: 'Clear Console', action: () => this.clearConsole() },
                    { name: 'Performance Stats', action: () => this.showPerformanceStats() }
                ]
            }
        };
    }

    /**
     * Show developer mode indicator
     */
    showDevModeIndicator() {
        // Remove existing indicator
        this.hideDevModeIndicator();
        
        const indicator = document.createElement('div');
        indicator.id = 'dev-mode-indicator';
        indicator.className = 'fixed top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold z-40 cursor-pointer';
        indicator.innerHTML = '🛠️ DEV';
        indicator.title = 'Developer Mode Active - Press ` to open menu';
        indicator.onclick = () => this.toggle();
        
        document.body.appendChild(indicator);
    }

    /**
     * Hide developer mode indicator
     */
    hideDevModeIndicator() {
        const indicator = document.getElementById('dev-mode-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Toggle menu visibility
     */
    toggle() {
        if (!this.isEnabled) return;
        
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Show the developer menu
     */
    show() {
        if (!this.isEnabled) return;
        
        this.isVisible = true;
        this.createMenu();
        document.body.appendChild(this.menuElement);
        this.log('Developer menu opened');
    }

    /**
     * Hide the developer menu
     */
    hide() {
        if (!this.isVisible) return;
        
        this.isVisible = false;
        if (this.menuElement) {
            document.body.removeChild(this.menuElement);
            this.menuElement = null;
        }
        this.log('Developer menu closed');
    }

    /**
     * Create the menu UI
     */
    createMenu() {
        this.menuElement = document.createElement('div');
        this.menuElement.id = 'developer-menu';
        this.menuElement.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 font-mono';
        
        const menuContent = document.createElement('div');
        menuContent.className = 'bg-gray-900 border border-green-500 rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl';
        
        // Header
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-6 border-b border-green-500 pb-4';
        header.innerHTML = `
            <div>
                <h2 class="text-2xl font-bold text-green-400">🛠️ DEVELOPER MENU</h2>
                <p class="text-green-300 text-sm">Press \` to toggle • ESC to close • Number keys for categories</p>
            </div>
            <button onclick="devMenu.hide()" class="text-green-400 hover:text-white text-2xl">&times;</button>
        `;
        
        // Categories
        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6';
        
        Object.entries(this.categories).forEach(([key, category], index) => {
            const categoryElement = this.createCategoryElement(key, category, index + 1);
            categoriesContainer.appendChild(categoryElement);
        });
        
        // Console output
        const consoleContainer = document.createElement('div');
        consoleContainer.className = 'mt-6 border-t border-green-500 pt-4';
        consoleContainer.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-green-400 font-bold">Console Output</h3>
                <button onclick="devMenu.clearConsole()" class="text-green-300 hover:text-white text-sm">Clear</button>
            </div>
            <div id="dev-console" class="bg-black border border-gray-700 rounded p-4 h-32 overflow-y-auto text-green-300 text-sm font-mono"></div>
        `;
        
        menuContent.appendChild(header);
        menuContent.appendChild(categoriesContainer);
        menuContent.appendChild(consoleContainer);
        this.menuElement.appendChild(menuContent);
        
        // Load console history
        this.updateConsole();
    }

    /**
     * Create a category element
     */
    createCategoryElement(key, category, number) {
        const element = document.createElement('div');
        element.className = 'bg-gray-800 border border-gray-600 rounded-lg p-4';
        
        const header = document.createElement('h3');
        header.className = 'text-green-400 font-bold mb-3 flex items-center';
        header.innerHTML = `<span class="bg-green-600 text-black rounded px-2 py-1 text-xs mr-2">${number}</span>${category.name}`;
        
        const commandsList = document.createElement('div');
        commandsList.className = 'space-y-2';
        
        category.commands.forEach(command => {
            const button = document.createElement('button');
            button.className = 'w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 text-green-300 hover:text-white rounded text-sm transition-colors duration-200';
            button.textContent = command.name;
            button.onclick = () => {
                this.executeCommand(command.name, command.action);
            };
            commandsList.appendChild(button);
        });
        
        element.appendChild(header);
        element.appendChild(commandsList);
        return element;
    }

    /**
     * Execute a command
     */
    executeCommand(name, action) {
        this.log(`Executing: ${name}`);
        try {
            action();
            this.commandHistory.push({ name, timestamp: Date.now(), success: true });
        } catch (error) {
            this.log(`Error executing ${name}: ${error.message}`, 'error');
            this.commandHistory.push({ name, timestamp: Date.now(), success: false, error: error.message });
        }
    }

    /**
     * Switch to a specific category
     */
    switchCategory(categoryKey) {
        this.log(`Switched to ${categoryKey} category`);
        // Could highlight the category or scroll to it
    }

    /**
     * Log a message to the dev console
     */
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        
        console.log(logEntry);
        
        // Add to internal log
        if (!this.consoleLog) this.consoleLog = [];
        this.consoleLog.push({ message: logEntry, type, timestamp: Date.now() });
        
        // Keep only last 100 entries
        if (this.consoleLog.length > 100) {
            this.consoleLog = this.consoleLog.slice(-100);
        }
        
        this.updateConsole();
    }

    /**
     * Update console display
     */
    updateConsole() {
        const consoleElement = document.getElementById('dev-console');
        if (!consoleElement || !this.consoleLog) return;
        
        const html = this.consoleLog.slice(-20).map(entry => {
            const colorClass = entry.type === 'error' ? 'text-red-400' : 'text-green-300';
            return `<div class="${colorClass}">${entry.message}</div>`;
        }).join('');
        
        consoleElement.innerHTML = html;
        consoleElement.scrollTop = consoleElement.scrollHeight;
    }

    // =================
    // COMMAND IMPLEMENTATIONS
    // =================

    promptSetLevel() {
        const level = prompt('Enter level (1-20):');
        if (level && !isNaN(level)) {
            const levelNum = parseInt(level);
            if (levelNum >= 1 && levelNum <= 20) {
                if (typeof debugSetLevel === 'function') {
                    debugSetLevel(levelNum);
                    this.log(`Set level to ${levelNum}`);
                } else if (typeof experienceManager !== 'undefined') {
                    const xpForLevel = experienceManager.getExperienceForLevel(levelNum);
                    experienceManager.setExperience(xpForLevel);
                    this.log(`Set level to ${levelNum} with ${xpForLevel} XP`);
                } else {
                    gameData.player.level = levelNum;
                    this.log(`Set level to ${levelNum} (manual)`);
                }
                this.refreshUI();
            } else {
                this.log('Invalid level range (1-20)', 'error');
            }
        }
    }

    addXP(amount) {
        if (typeof debugAddXP === 'function') {
            debugAddXP(amount);
            this.log(`Added ${amount} XP`);
        } else if (typeof experienceManager !== 'undefined') {
            experienceManager.awardExperience(amount, 'dev-menu');
            this.log(`Added ${amount} XP via experience manager`);
        } else {
            gameData.player.experience = (gameData.player.experience || 0) + amount;
            this.log(`Added ${amount} XP (manual)`);
            this.refreshUI();
        }
    }

    promptAddXP() {
        const amount = prompt('Enter XP amount:');
        if (amount && !isNaN(amount)) {
            this.addXP(parseInt(amount));
        }
    }

    levelUp() {
        if (typeof levelUp === 'function') {
            levelUp();
            this.log('Level up triggered');
        } else if (typeof experienceManager !== 'undefined') {
            const currentLevel = gameData.player.level;
            const nextLevelXP = experienceManager.getExperienceForLevel(currentLevel + 1);
            experienceManager.setExperience(nextLevelXP);
            this.log(`Leveled up from ${currentLevel} to ${currentLevel + 1}`);
        } else {
            gameData.player.level++;
            this.log(`Level up to ${gameData.player.level} (manual)`);
            this.refreshUI();
        }
    }

    toggleXPTracker() {
        if (typeof toggleXPTracker === 'function') {
            toggleXPTracker();
            this.log('XP Tracker toggled');
        } else {
            this.log('XP Tracker not available', 'error');
        }
    }

    resetXP() {
        if (confirm('Reset experience to 0? This will also reset level to 1.')) {
            if (typeof experienceManager !== 'undefined') {
                experienceManager.setExperience(0);
                this.log('Experience reset to 0 via experience manager');
            } else {
                gameData.player.experience = 0;
                gameData.player.level = 1;
                this.log('Experience reset to 0 (manual)');
            }
            this.refreshUI();
        }
    }

    setHPToMax() {
        gameData.player.derivedStats.health = gameData.player.derivedStats.maxHealth;
        this.log(`HP set to maximum (${gameData.player.derivedStats.maxHealth})`);
        this.refreshUI();
    }

    setMPToMax() {
        gameData.player.derivedStats.mana = gameData.player.derivedStats.maxMana;
        this.log(`MP set to maximum (${gameData.player.derivedStats.maxMana})`);
        this.refreshUI();
    }

    healFully() {
        this.setHPToMax();
        this.setMPToMax();
        this.log('Fully healed (HP and MP restored)');
    }

    addGold(amount) {
        if (!gameData.player.gold) gameData.player.gold = 0;
        gameData.player.gold += amount;
        this.log(`Added ${amount} gold (Total: ${gameData.player.gold.toLocaleString()})`);
        this.refreshUI();
    }

    promptAddGold() {
        const amount = prompt('Enter gold amount:');
        if (amount && !isNaN(amount)) {
            this.addGold(parseInt(amount));
        }
    }

    clearConsole() {
        if (this.consoleLog) this.consoleLog = [];
        this.updateConsole();
        console.clear();
        this.log('Console cleared');
    }

    reloadGame() {
        if (confirm('Reload the game? Unsaved progress will be lost.')) {
            window.location.reload();
        }
    }

    showHelp() {
        const helpText = `
DEVELOPER MENU HELP
===================
Keyboard Shortcuts:
• \` (backtick) - Toggle menu
• ESC - Close menu
• 1-6 - Switch categories
• C - Clear console
• R - Reload game
• H - Show this help

Categories:
1. Player - Character stats and status
2. Experience - XP and leveling
3. Inventory - Items and equipment
4. World - Time, weather, location
5. Combat - Battle testing
6. System - Save/load and utilities

Functions available in console:
• enableDevMode() - Force enable dev mode
• disableDevMode() - Disable dev mode
• devMenu.show() - Show menu
• devMenu.hide() - Hide menu
        `;
        
        this.log(helpText);
        alert(helpText);
    }

    refreshUI() {
        // Refresh character sheet if open
        if (typeof renderCharacterSheet === 'function') {
            try {
                renderCharacterSheet();
            } catch (e) {
                this.log('Error refreshing character sheet', 'error');
            }
        }
        
        // Update main display
        if (typeof updateDisplay === 'function') {
            try {
                updateDisplay();
            } catch (e) {
                this.log('Error updating display', 'error');
            }
        }

        // Update time display if it exists
        if (typeof updateTimeDisplay === 'function') {
            try {
                updateTimeDisplay();
            } catch (e) {
                // Ignore time display errors
            }
        }

        // Update experience display
        if (typeof experienceManager !== 'undefined' && experienceManager.updateExperienceDisplay) {
            try {
                experienceManager.updateExperienceDisplay();
            } catch (e) {
                // Ignore experience display errors
            }
        }
    }

    showGameState() {
        const state = {
            player: {
                name: gameData.player.name,
                level: gameData.player.level,
                experience: gameData.player.experience,
                location: gameData.player.location,
                stats: gameData.player.stats,
                derivedStats: gameData.player.derivedStats,
                inventory: gameData.player.inventory.length + ' items',
                gold: gameData.player.gold || 0
            },
            world: {
                time: gameData.time || 'Not available',
                moons: gameData.moons || 'Not available',
                weather: gameData.world?.weather || 'Unknown'
            },
            combat: {
                inCombat: typeof combatState !== 'undefined' ? combatState.inCombat : false,
                participants: typeof combatState !== 'undefined' ? combatState.participants?.length || 0 : 0
            },
            settings: gameData.settings || 'Not available'
        };
        
        console.log('Game State:', state);
        this.log('Game state logged to console');
    }

    // ==================
    // INVENTORY COMMANDS
    // ==================
    
    addTestItems() { 
        const testItems = [
            { 
                id: 'dev_iron_sword', 
                name: 'Iron Sword', 
                type: 'weapon', 
                damage: '1d8+2',
                description: 'A well-crafted iron sword (Dev Item)',
                rarity: 'common',
                weight: 3
            },
            { 
                id: 'dev_leather_armor', 
                name: 'Leather Armor', 
                type: 'armor', 
                armorClass: 12,
                description: 'Sturdy leather armor (Dev Item)',
                rarity: 'common',
                weight: 10
            },
            { 
                id: 'dev_health_potion', 
                name: 'Health Potion', 
                type: 'consumable', 
                healing: 25,
                description: 'Restores 25 HP when consumed (Dev Item)',
                rarity: 'common',
                weight: 0.5
            },
            { 
                id: 'dev_magic_scroll', 
                name: 'Magic Scroll', 
                type: 'consumable', 
                spell: 'fireball',
                description: 'Contains a fireball spell (Dev Item)',
                rarity: 'uncommon',
                weight: 0.1
            },
            { 
                id: 'dev_gold_coins', 
                name: 'Gold Coins', 
                type: 'currency', 
                value: 100,
                description: 'A pouch of gold coins (Dev Item)',
                weight: 2
            }
        ];
        
        testItems.forEach(item => {
            gameData.player.inventory.push(item);
        });
        
        this.log(`Added ${testItems.length} test items to inventory`);
        this.refreshUI();
    }
    
    clearInventory() { 
        const itemCount = gameData.player.inventory.length;
        if (itemCount === 0) {
            this.log('Inventory is already empty');
            return;
        }
        
        if (confirm(`Clear inventory? This will remove ${itemCount} items.`)) {
            gameData.player.inventory = [];
            this.log(`Cleared inventory (${itemCount} items removed)`);
            this.refreshUI();
        }
    }
    
    promptAddItem(type) { 
        const itemName = prompt(`Enter ${type} name:`);
        if (itemName) {
            const item = {
                id: `dev_${type}_${Date.now()}`,
                name: itemName,
                type: type,
                description: `Custom ${type} created via dev menu`,
                rarity: 'common',
                customItem: true,
                weight: type === 'weapon' ? 3 : type === 'armor' ? 10 : 1
            };

            // Add type-specific properties
            switch(type) {
                case 'weapon':
                    item.damage = '1d6+1';
                    break;
                case 'armor':
                    item.armorClass = 12;
                    break;
                case 'consumable':
                    item.healing = 10;
                    break;
            }
            
            gameData.player.inventory.push(item);
            this.log(`Added custom ${type}: ${itemName}`);
            this.refreshUI();
        }
    }
    
    showItemList() { 
        const inventory = gameData.player.inventory;
        console.group('Current Inventory:');
        inventory.forEach((item, index) => {
            console.log(`${index + 1}. ${item.name} (${item.type}) - ${item.description || 'No description'}`);
        });
        console.groupEnd();
        this.log(`Inventory logged to console (${inventory.length} items)`);
    }
    
    repairAllItems() { 
        let repairedCount = 0;
        gameData.player.inventory.forEach(item => {
            if (item.durability !== undefined && item.maxDurability !== undefined) {
                if (item.durability < item.maxDurability) {
                    item.durability = item.maxDurability;
                    repairedCount++;
                }
            }
        });
        
        if (repairedCount > 0) {
            this.log(`Repaired ${repairedCount} items`);
        } else {
            this.log('No items needed repair');
        }
        this.refreshUI();
    }

    addRandomItems() {
        const randomItems = [
            'Ancient Tome', 'Crystal Shard', 'Mystic Orb', 'Enchanted Ring',
            'Silver Dagger', 'Healing Herb', 'Magic Dust', 'Rope (50ft)',
            'Lantern', 'Rations', 'Blanket', 'Waterskin'
        ];
        
        const count = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < count; i++) {
            const randomName = randomItems[Math.floor(Math.random() * randomItems.length)];
            const item = {
                id: `random_${Date.now()}_${i}`,
                name: randomName,
                type: 'misc',
                description: 'Random item generated by dev menu',
                weight: Math.random() * 5,
                value: Math.floor(Math.random() * 100) + 1
            };
            gameData.player.inventory.push(item);
        }
        
        this.log(`Added ${count} random items to inventory`);
        this.refreshUI();
    }

    addTestConsumables() {
        const consumables = [
            { id: 'health_potion', quantity: 5 },
            { id: 'mana_potion', quantity: 3 },
            { id: 'strength_elixir', quantity: 2 },
            { id: 'wisdom_brew', quantity: 2 },
            { id: 'dexterity_draught', quantity: 2 },
            { id: 'greater_health_potion', quantity: 2 },
            { id: 'superior_mana_potion', quantity: 2 },
            { id: 'healing_herbs', quantity: 10 },
            { id: 'rations', quantity: 15 }
        ];
        
        consumables.forEach(item => {
            gameData.player.inventory.push(item);
        });
        
        this.log(`Added ${consumables.length} types of consumables to inventory`);
        this.refreshUI();
    }

    // =================
    // WORLD COMMANDS
    // =================
    
    skipTime(hours) { 
        if (!gameData.time) {
            this.log('Time system not initialized', 'error');
            return;
        }

        const originalTime = { ...gameData.time };
        
        // Advance time by hours
        for (let i = 0; i < hours; i++) {
            if (typeof advanceTime === 'function') {
                advanceTime();
            } else {
                // Manual time advancement
                gameData.time.day += 1;
                if (gameData.time.day > 40) {
                    gameData.time.day = 1;
                    gameData.time.month = (gameData.time.month + 1) % gameData.time.months.length;
                    if (gameData.time.month === 0) {
                        gameData.time.year++;
                    }
                }
            }
        }
        
        this.log(`Advanced time by ${hours} hours (${originalTime.day} → ${gameData.time.day})`);
        this.refreshUI();
    }
    
    resetTime() { 
        if (!gameData.time) {
            this.log('Time system not initialized', 'error');
            return;
        }
        
        gameData.time.day = 1;
        gameData.time.month = 0;
        gameData.time.year = 998;
        
        if (gameData.moons) {
            gameData.moons.edyria.phase = 0;
            gameData.moons.kapra.phase = 0;
            gameData.moons.enia.phase = 0;
        }
        
        this.log('Time reset to beginning (Alphi 1, 998 PA)');
        this.refreshUI();
    }
    
    toggleTime() { 
        if (typeof toggleTime === 'function') {
            toggleTime();
            this.log('Time toggled via game function');
        } else if (gameData.time) {
            gameData.time.paused = !gameData.time.paused;
            this.log(`Time ${gameData.time.paused ? 'paused' : 'resumed'}`);
        } else {
            this.log('Time system not available', 'error');
        }
    }
    
    promptChangeWeather() { 
        const weatherOptions = ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy', 'snowy', 'windy'];
        const weather = prompt(`Enter weather (${weatherOptions.join(', ')}):`);
        
        if (weather && weatherOptions.includes(weather.toLowerCase())) {
            if (!gameData.world) gameData.world = {};
            gameData.world.weather = weather.toLowerCase();
            this.log(`Weather changed to: ${weather}`);
            this.refreshUI();
        } else if (weather) {
            this.log(`Invalid weather. Options: ${weatherOptions.join(', ')}`, 'error');
        }
    }
    
    promptSetLocation() { 
        const currentLocation = gameData.player.location || 'Unknown';
        const location = prompt(`Enter location name (current: ${currentLocation}):`);
        
        if (location && location.trim()) {
            gameData.player.location = location.trim();
            this.log(`Location changed from "${currentLocation}" to "${location}"`);
            this.refreshUI();
        }
    }

    setMoonPhases() {
        if (!gameData.moons) {
            this.log('Moon system not available', 'error');
            return;
        }

        const phase = prompt('Enter moon phase (0-29 for all moons):');
        if (phase && !isNaN(phase)) {
            const phaseNum = parseInt(phase);
            if (phaseNum >= 0 && phaseNum <= 29) {
                gameData.moons.edyria.phase = phaseNum % gameData.moons.edyria.cycle;
                gameData.moons.kapra.phase = phaseNum % gameData.moons.kapra.cycle;
                gameData.moons.enia.phase = phaseNum % gameData.moons.enia.cycle;
                this.log(`Set all moon phases to ${phaseNum}`);
                this.refreshUI();
            } else {
                this.log('Invalid phase (0-29)', 'error');
            }
        }
    }

    triggerMoonEvent() {
        if (!gameData.moons) {
            this.log('Moon system not available', 'error');
            return;
        }

        // Force a convergence event
        gameData.moons.edyria.phase = 15;
        gameData.moons.kapra.phase = 15;
        gameData.moons.enia.phase = 15;
        
        this.log('Triggered moon convergence event');
        this.refreshUI();
    }

    // =================
    // COMBAT COMMANDS
    // =================
    
    startTestCombat() { 
        console.log('🎮 Developer menu starting test combat...');
        
        if (typeof startCombat === 'function') {
            const testEnemies = [
                { 
                    id: 'dev_goblin',
                    name: 'Dev Test Goblin', 
                    hitPoints: 15, 
                    armorClass: 12,
                    attributes: { 
                        strength: 8, 
                        dexterity: 14, 
                        constitution: 10, 
                        intelligence: 10, 
                        wisdom: 8, 
                        charisma: 8 
                    },
                    abilities: [
                        { type: 'attack', name: 'Scimitar', attackBonus: 4, damage: '1d6+2' }
                    ]
                },
                { 
                    id: 'dev_orc',
                    name: 'Dev Test Orc', 
                    hitPoints: 25, 
                    armorClass: 13,
                    attributes: { 
                        strength: 16, 
                        dexterity: 12, 
                        constitution: 16, 
                        intelligence: 7, 
                        wisdom: 11, 
                        charisma: 10 
                    },
                    abilities: [
                        { type: 'attack', name: 'Greataxe', attackBonus: 5, damage: '1d12+3' }
                    ]
                }
            ];
            
            try {
                startCombat(testEnemies);
                this.log('✅ Test combat started with Goblin and Orc');
                console.log('✅ Developer test combat successful');
            } catch (error) {
                this.log(`❌ Combat start failed: ${error.message}`, 'error');
                console.error('❌ Developer test combat failed:', error);
            }
        } else {
            this.log('❌ Combat system not available', 'error');
            console.error('❌ startCombat function not found');
        }
    }
    
    endCombat() { 
        if (typeof exitCombat === 'function') {
            exitCombat();
            this.log('Combat ended via exit function');
        } else if (typeof combatState !== 'undefined') {
            combatState.inCombat = false;
            this.log('Combat ended manually');
            this.refreshUI();
        } else {
            this.log('Combat system not available', 'error');
        }
    }
    
    winCombat() { 
        if (typeof combatState !== 'undefined' && combatState.participants) {
            const enemies = combatState.participants.filter(p => !p.isPlayer);
            enemies.forEach(enemy => {
                enemy.health = 0;
            });
            this.log(`Defeated ${enemies.length} enemies instantly`);
        } else {
            this.log('No active combat or combat system unavailable', 'error');
        }
    }
    
    fleeCombat() { 
        if (typeof exitCombat === 'function') {
            exitCombat();
            this.log('Fled from combat');
        } else {
            this.endCombat();
        }
    }
    
    promptAddEnemy() { 
        if (typeof combatState === 'undefined' || !combatState.inCombat) {
            this.log('No active combat to add enemy to', 'error');
            return;
        }

        const enemyName = prompt('Enter enemy name:');
        if (enemyName) {
            const enemy = {
                name: enemyName,
                health: 20,
                maxHealth: 20,
                armorClass: 12,
                attacks: [{ name: 'Strike', damage: '1d6+1' }],
                customEnemy: true,
                level: 1
            };
            
            // Add to combat if possible
            if (combatState.participants) {
                combatState.participants.push(enemy);
                this.log(`Added enemy "${enemyName}" to combat`);
            } else {
                this.log('Could not add enemy to combat', 'error');
            }
        }
    }
    
    healAllCombatants() { 
        // Heal player
        this.healFully();
        
        // Heal enemies if in combat
        if (typeof combatState !== 'undefined' && combatState.participants) {
            let healedCount = 0;
            combatState.participants.forEach(participant => {
                if (participant.maxHealth) {
                    participant.health = participant.maxHealth;
                    healedCount++;
                }
            });
            this.log(`Healed all ${healedCount} combatants`);
        } else {
            this.log('Player healed (no active combat)');
        }
    }

    addCombatXP() {
        const xp = prompt('Enter XP amount to award for combat:');
        if (xp && !isNaN(xp)) {
            this.addXP(parseInt(xp));
            this.log(`Awarded ${xp} combat XP`);
        }
    }

    // =================
    // SYSTEM COMMANDS
    // =================
    
    saveGame() { 
        if (typeof saveGame === 'function') {
            try {
                saveGame();
                this.log('Game saved using save system');
            } catch (e) {
                this.log('Error saving game: ' + e.message, 'error');
            }
        } else {
            try {
                localStorage.setItem('edoria_dev_save', JSON.stringify(gameData));
                this.log('Game data saved to localStorage (dev save)');
            } catch (e) {
                this.log('Error saving game: ' + e.message, 'error');
            }
        }
    }
    
    loadGame() { 
        if (typeof loadGameData === 'function') {
            try {
                loadGameData();
                this.log('Game loaded using load system');
                this.refreshUI();
            } catch (e) {
                this.log('Error loading game: ' + e.message, 'error');
            }
        } else {
            try {
                const saved = localStorage.getItem('edoria_dev_save');
                if (saved) {
                    Object.assign(gameData, JSON.parse(saved));
                    this.log('Game data loaded from localStorage (dev save)');
                    this.refreshUI();
                } else {
                    this.log('No dev save found', 'error');
                }
            } catch (e) {
                this.log('Error loading game: ' + e.message, 'error');
            }
        }
    }
    
    clearSave() { 
        if (confirm('Clear all saved data? This cannot be undone.')) {
            // Clear all possible save locations
            localStorage.removeItem('gameData');
            localStorage.removeItem('characterData');
            localStorage.removeItem('edoria_dev_save');
            sessionStorage.clear();
            
            this.log('All save data cleared');
        }
    }
    
    exportGameData() { 
        try {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `edoria-save-${timestamp}.json`;
            
            const exportData = {
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                gameData: gameData,
                devMenuVersion: 'complete'
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            
            URL.revokeObjectURL(url);
            this.log(`Game data exported as ${filename}`);
        } catch (e) {
            this.log('Error exporting data: ' + e.message, 'error');
        }
    }
    
    promptImportData() { 
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        // Check if it's our export format
                        if (data.gameData) {
                            Object.assign(gameData, data.gameData);
                            this.log(`Game data imported from ${file.name} (${data.timestamp})`);
                        } else {
                            // Assume it's raw game data
                            Object.assign(gameData, data);
                            this.log(`Raw game data imported from ${file.name}`);
                        }
                        
                        this.refreshUI();
                    } catch (err) {
                        this.log('Error importing data: ' + err.message, 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    
    showPerformanceStats() { 
        const stats = {
            memory: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB',
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
            } : 'Not available',
            timing: performance.timing ? {
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart + ' ms',
                domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart + ' ms'
            } : 'Not available',
            fps: this.calculateFPS(),
            gameData: {
                inventoryItems: gameData.player.inventory.length,
                playerLevel: gameData.player.level,
                experience: gameData.player.experience || 0
            },
            userAgent: navigator.userAgent.substring(0, 100) + '...'
        };
        
        console.group('Performance Stats:');
        console.log('Memory:', stats.memory);
        console.log('Timing:', stats.timing);
        console.log('FPS:', stats.fps);
        console.log('Game Data:', stats.gameData);
        console.groupEnd();
        
        this.log('Performance stats logged to console');
    }

    calculateFPS() {
        // Simple FPS calculation
        if (!this.frameCount) this.frameCount = 0;
        if (!this.lastTime) this.lastTime = Date.now();
        
        this.frameCount++;
        const now = Date.now();
        if (now - this.lastTime >= 1000) {
            const fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            this.frameCount = 0;
            this.lastTime = now;
            return fps + ' fps';
        }
        return 'Calculating...';
    }

    resetStats() { 
        if (confirm('Reset all character stats to default values?')) {
            const defaultStats = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            };
            
            gameData.player.stats = { ...defaultStats };
            
            // Recalculate derived stats
            if (typeof calculateDerivedStats === 'function') {
                calculateDerivedStats();
            } else {
                // Manual recalculation
                const conMod = Math.floor((gameData.player.stats.constitution - 10) / 2);
                gameData.player.derivedStats.maxHealth = 20 + conMod;
                gameData.player.derivedStats.health = gameData.player.derivedStats.maxHealth;
            }
            
            this.log('Character stats reset to defaults (all 10s)');
            this.refreshUI();
        }
    }
    
    toggleGodMode() { 
        if (!gameData.player.godMode) gameData.player.godMode = false;
        gameData.player.godMode = !gameData.player.godMode;
        
        if (gameData.player.godMode) {
            // Store original stats
            gameData.player._originalStats = { ...gameData.player.derivedStats };
            
            // God mode on - set high stats
            gameData.player.derivedStats.health = 9999;
            gameData.player.derivedStats.maxHealth = 9999;
            gameData.player.derivedStats.mana = 9999;
            gameData.player.derivedStats.maxMana = 9999;
            gameData.player.derivedStats.armorClass = 25;
            
            this.log('God Mode ENABLED (9999 HP/MP, 25 AC)');
        } else {
            // God mode off - restore original stats or recalculate
            if (gameData.player._originalStats) {
                gameData.player.derivedStats = { ...gameData.player._originalStats };
                delete gameData.player._originalStats;
            } else if (typeof calculateDerivedStats === 'function') {
                calculateDerivedStats();
            }
            
            this.log('God Mode DISABLED');
        }
        
        this.refreshUI();
    }

    debugSpawnItem() {
        const itemId = prompt('Enter item ID to spawn:');
        if (itemId) {
            // Try to find item in game data
            let foundItem = null;
            if (typeof itemsData !== 'undefined' && itemsData[itemId]) {
                foundItem = { ...itemsData[itemId] };
            } else {
                // Create a generic item
                foundItem = {
                    id: itemId,
                    name: itemId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    type: 'misc',
                    description: 'Item spawned via dev menu'
                };
            }
            
            gameData.player.inventory.push(foundItem);
            this.log(`Spawned item: ${foundItem.name}`);
            this.refreshUI();
        }
    }

    quickSaveState() {
        try {
            const quickSave = {
                timestamp: Date.now(),
                player: { ...gameData.player },
                time: { ...gameData.time },
                world: { ...gameData.world }
            };
            
            sessionStorage.setItem('edoria_quick_save', JSON.stringify(quickSave));
            this.log('Quick save created');
        } catch (e) {
            this.log('Quick save failed: ' + e.message, 'error');
        }
    }

    quickLoadState() {
        try {
            const quickSave = sessionStorage.getItem('edoria_quick_save');
            if (quickSave) {
                const data = JSON.parse(quickSave);
                Object.assign(gameData.player, data.player);
                if (data.time) Object.assign(gameData.time, data.time);
                if (data.world) Object.assign(gameData.world, data.world);
                
                const saveTime = new Date(data.timestamp).toLocaleTimeString();
                this.log(`Quick save loaded (${saveTime})`);
                this.refreshUI();
            } else {
                this.log('No quick save found', 'error');
            }
        } catch (e) {
            this.log('Quick load failed: ' + e.message, 'error');
        }
    }

    clearActiveEffects() {
        if (typeof clearAllEffects === 'function') {
            clearAllEffects();
            this.log('All active effects cleared');
        } else {
            this.log('Clear effects function not available', 'error');
        }
    }
}

// Create global developer menu instance
const devMenu = new DeveloperMenu();

// Export for global access
window.devMenu = devMenu;
window.showDevMenu = () => devMenu.show();
window.hideDevMenu = () => devMenu.hide();
window.toggleDevMenu = () => devMenu.toggle();

// Additional global dev functions
window.enableDevMode = () => {
    localStorage.setItem('developerMode', 'true');
    devMenu.isDeveloperMode = true;
    devMenu.log('Developer mode enabled globally');
};

window.disableDevMode = () => {
    localStorage.removeItem('developerMode');
    devMenu.isDeveloperMode = false;
    devMenu.hide();
    devMenu.log('Developer mode disabled');
};

// Quick access functions for console use
window.quickXP = (amount) => devMenu.addXP(amount);
window.quickLevel = (level) => devMenu.promptSetLevel();
window.quickGold = (amount) => devMenu.addGold(amount);
window.quickHeal = () => devMenu.healFully();
window.quickTime = (hours) => devMenu.skipTime(hours);
window.quickCombat = () => devMenu.startTestCombat();
window.quickSave = () => devMenu.saveGame();
window.quickLoad = () => devMenu.loadGame();
window.gameState = () => devMenu.showGameState();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (devMenu.detectDeveloperMode()) {
        console.log('🔧 Developer Menu initialized. Press ` to open.');
        console.log('📝 Use devMenu.show() or type `enableDevMode()` to force enable.');
        console.log('🔍 Quick functions: quickXP(n), quickLevel(n), quickGold(n), quickHeal(), quickTime(n)');
    }
});

console.log('Developer Menu system loaded. Use `enableDevMode()` if not auto-detected.');

console.log('Developer Menu System loaded - Press ` to open menu (if in dev mode)');

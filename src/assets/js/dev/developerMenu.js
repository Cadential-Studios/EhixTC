// Developer Menu System
// Advanced debugging and testing interface for Edoria: The Triune Convergence

class DeveloperMenu {
    constructor() {
        this.isEnabled = false;
        this.isVisible = false;
        this.menuElement = null;
        this.categories = {};
        this.commandHistory = [];
        this.historyIndex = -1;
        this.shortcuts = {};
        this.currentTab = 'console'; // 'console' or 'cheats'
        this.consoleCommands = {};
        
        // Auto-detect developer mode
        this.detectDeveloperMode();
        
        // Set up keyboard listener
        this.setupKeyboardListeners();
        
        // Initialize menu categories and console commands
        this.initializeCategories();
        this.initializeConsoleCommands();
        
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
        
        // Enable developer mode if detected
        if (this.isEnabled) {
            console.log('Developer mode detected');
        }
        
        // Allow forcing dev mode via console
        window.enableDevMode = () => {
            localStorage.setItem('devMode', 'true');
            this.isEnabled = true;
            this.log('Developer mode ENABLED');
        };
        
        window.disableDevMode = () => {
            localStorage.setItem('devMode', 'false');
            this.isEnabled = false;
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
        });
    }

    /**
     * Initialize console commands for the developer console
     */
    initializeConsoleCommands() {
        this.consoleCommands = {
            // Help and information
            'help': {
                description: 'Show available commands',
                usage: 'help [command]',
                execute: (args) => this.showHelp(args[0])
            },
            'commands': {
                description: 'List all available commands',
                usage: 'commands',
                execute: () => this.listCommands()
            },
            'clear': {
                description: 'Clear the console',
                usage: 'clear',
                execute: () => this.clearConsole()
            },

            // Player commands
            'player': {
                description: 'Show player information',
                usage: 'player',
                execute: () => this.getPlayerInfo()
            },
            'player.level': {
                description: 'Set or get player level',
                usage: 'player.level [level]',
                execute: (args) => args.length ? this.setLevel(parseInt(args[0])) : this.getPlayerInfo()
            },
            'level': {
                description: 'Set player level',
                usage: 'level <number>',
                execute: (args) => {
                    if (!args.length) {
                        this.log('Usage: level <number>', 'error');
                        return;
                    }
                    this.setLevel(parseInt(args[0]));
                }
            },
            'player.hp': {
                description: 'Set or heal player HP',
                usage: 'player.hp [amount|max]',
                execute: (args) => {
                    if (!args.length) return this.getPlayerInfo();
                    if (args[0] === 'max') return this.setHPToMax();
                    this.setHP(parseInt(args[0]));
                }
            },
            'hp': {
                description: 'Set player HP',
                usage: 'hp <amount|max>',
                execute: (args) => {
                    if (!args.length) {
                        this.log('Usage: hp <amount|max>', 'error');
                        return;
                    }
                    if (args[0] === 'max') return this.setHPToMax();
                    this.setHP(parseInt(args[0]));
                }
            },
            'player.mp': {
                description: 'Set or restore player MP',
                usage: 'player.mp [amount|max]',
                execute: (args) => {
                    if (!args.length) return this.getPlayerInfo();
                    if (args[0] === 'max') return this.setMPToMax();
                    this.setMP(parseInt(args[0]));
                }
            },
            'mp': {
                description: 'Set player MP',
                usage: 'mp <amount|max>',
                execute: (args) => {
                    if (!args.length) {
                        this.log('Usage: mp <amount|max>', 'error');
                        return;
                    }
                    if (args[0] === 'max') return this.setMPToMax();
                    this.setMP(parseInt(args[0]));
                }
            },
            'player.gold': {
                description: 'Add or set player gold',
                usage: 'player.gold [amount]',
                execute: (args) => args.length ? this.addGold(parseInt(args[0])) : this.getPlayerInfo()
            },
            'gold': {
                description: 'Add gold to player',
                usage: 'gold <amount>',
                execute: (args) => {
                    if (!args.length) {
                        this.log('Usage: gold <amount>', 'error');
                        return;
                    }
                    this.addGold(parseInt(args[0]));
                }
            },
            'player.heal': {
                description: 'Fully heal the player',
                usage: 'player.heal',
                execute: () => this.healFully()
            },
            'heal': {
                description: 'Fully heal the player',
                usage: 'heal',
                execute: () => this.healFully()
            },
            'player.godmode': {
                description: 'Toggle god mode',
                usage: 'player.godmode [on|off]',
                execute: (args) => this.toggleGodMode(args[0])
            },
            'godmode': {
                description: 'Toggle god mode',
                usage: 'godmode [on|off]',
                execute: (args) => this.toggleGodMode(args[0])
            },

            // Experience commands
            'xp.add': {
                description: 'Add experience points',
                usage: 'xp.add <amount>',
                execute: (args) => {
                    if (!args.length) {
                        this.log('Usage: xp.add <amount>', 'error');
                        return;
                    }
                    this.addXP(parseInt(args[0]));
                }
            },
            'xp': {
                description: 'Add experience points',
                usage: 'xp <amount>',
                execute: (args) => {
                    if (!args.length) {
                        this.log('Usage: xp <amount>', 'error');
                        return;
                    }
                    this.addXP(parseInt(args[0]));
                }
            },
            'xp.set': {
                description: 'Set total experience',
                usage: 'xp.set <amount>',
                execute: (args) => {
                    if (!args.length) {
                        this.log('Usage: xp.set <amount>', 'error');
                        return;
                    }
                    this.setXP(parseInt(args[0]));
                }
            },
            'levelup': {
                description: 'Level up the player',
                usage: 'levelup',
                execute: () => this.levelUp()
            },

            // Inventory commands
            'item.add': {
                description: 'Add item to inventory',
                usage: 'item.add <itemId> [quantity]',
                execute: (args) => this.addItemById(args[0], parseInt(args[1]) || 1)
            },
            'add_item': {
                description: 'Add item to inventory (alias for item.add)',
                usage: 'add_item <itemId> [quantity]',
                execute: (args) => this.addItemById(args[0], parseInt(args[1]) || 1)
            },
            'item.remove': {
                description: 'Remove item from inventory',
                usage: 'item.remove <itemId> [quantity]',
                execute: (args) => this.removeItemById(args[0], parseInt(args[1]) || 1)
            },
            'item.list': {
                description: 'List available items',
                usage: 'item.list [type]',
                execute: (args) => this.listItems(args[0])
            },
            'inventory.clear': {
                description: 'Clear player inventory',
                usage: 'inventory.clear',
                execute: () => this.clearInventory()
            },

            // Time and world commands
            'time.skip': {
                description: 'Skip time forward',
                usage: 'time.skip <hours>',
                execute: (args) => this.skipTime(parseInt(args[0]))
            },
            'time.set': {
                description: 'Set current time',
                usage: 'time.set <hour> [day]',
                execute: (args) => this.setTime(parseInt(args[0]), parseInt(args[1]))
            },
            'location.set': {
                description: 'Set player location',
                usage: 'location.set <locationId>',
                execute: (args) => this.setLocation(args[0])
            },

            // System commands
            'save': {
                description: 'Save the game',
                usage: 'save',
                execute: () => this.saveGame()
            },
            'load': {
                description: 'Load the game',
                usage: 'load',
                execute: () => this.loadGame()
            },
            'reload': {
                description: 'Reload the page (use "reload confirm" to force)',
                usage: 'reload [confirm]',
                execute: (args) => args[0] === 'confirm' ? this.forceReload() : this.reloadGame()
            },
            'gamestate': {
                description: 'Show current game state',
                usage: 'gamestate',
                execute: () => this.showGameState()
            }
        };
    }

    /**
     * Show help for commands
     */
    showHelp(command) {
        if (command && this.consoleCommands[command]) {
            const cmd = this.consoleCommands[command];
            this.log(`${command}: ${cmd.description}`);
            this.log(`Usage: ${cmd.usage}`);
        } else {
            this.log('Available commands:');
            this.log('Type "commands" to see all commands');
            this.log('Type "help <command>" for specific help');
            this.log('Use TAB for command completion');
            this.log('Use UP/DOWN arrows for command history');
        }
    }

    /**
     * List all available commands
     */
    listCommands() {
        this.log('Available Console Commands:');
        Object.entries(this.consoleCommands).forEach(([cmd, info]) => {
            this.log(`  ${cmd.padEnd(20)} - ${info.description}`);
        });
    }

    /**
     * Execute a console command
     */
    executeConsoleCommand(input) {
        const trimmed = input.trim();
        if (!trimmed) return;

        // Add to history
        this.commandHistory.push(trimmed);
        this.historyIndex = this.commandHistory.length;

        // Parse command and arguments
        const parts = trimmed.split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        this.log(`> ${trimmed}`, 'command');

        // Find and execute command
        if (this.consoleCommands[command]) {
            try {
                this.consoleCommands[command].execute(args);
            } catch (error) {
                this.log(`Error: ${error.message}`, 'error');
            }
        } else {
            this.log(`Unknown command: ${command}. Type "help" for available commands.`, 'error');
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
        this.menuElement.className = 'fixed z-50 font-mono';
        
        // Set initial position and size
        this.menuElement.style.left = '100px';
        this.menuElement.style.top = '100px';
        this.menuElement.style.width = '800px';
        this.menuElement.style.height = '600px';
        
        const menuContent = document.createElement('div');
        menuContent.className = 'bg-gray-900 border border-purple-500 rounded-lg w-full h-full shadow-2xl flex flex-col overflow-hidden';
        
        // Header with tabs - make it draggable
        const header = document.createElement('div');
        header.className = 'border-b border-purple-500 cursor-move select-none';
        header.id = 'dev-menu-header';
        header.innerHTML = `
            <div class="flex justify-between items-center p-2 pb-0">
                <div>
                    <h2 class="text-lg font-bold text-purple-400">🛠️ DEVELOPER MENU</h2>
                    <p class="text-purple-300 text-xs">Drag to move • Resize from corners</p>
                </div>
                <button onclick="devMenu.hide()" class="text-purple-400 hover:text-white text-xl">&times;</button>
            </div>
            <div class="flex border-t border-gray-700 mt-2">
                <button id="console-tab" class="px-4 py-2 text-purple-400 border-r border-gray-700 hover:bg-gray-800 font-semibold text-sm ${this.currentTab === 'console' ? 'bg-gray-800 border-b-2 border-purple-400' : ''}" onclick="devMenu.switchTab('console')">
                    🖥️ Console
                </button>
                <button id="cheats-tab" class="px-4 py-2 text-purple-400 border-r border-gray-700 hover:bg-gray-800 font-semibold text-sm ${this.currentTab === 'cheats' ? 'bg-gray-800 border-b-2 border-purple-400' : ''}" onclick="devMenu.switchTab('cheats')">
                    ⚡ Quick Cheats
                </button>
            </div>
        `;

        // Content area
        const contentArea = document.createElement('div');
        contentArea.className = 'flex-1 overflow-hidden';
        contentArea.id = 'dev-menu-content';

        // Console tab content
        const consoleContent = document.createElement('div');
        consoleContent.id = 'console-content';
        consoleContent.className = `h-full ${this.currentTab === 'console' ? 'block' : 'hidden'}`;
        consoleContent.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="p-4 border-b border-gray-700 bg-gray-850">
                    <div class="text-purple-300 text-sm mb-2">Developer Console - Type "help" for commands</div>
                    <div class="flex text-xs text-gray-400">
                        <span class="mr-4">TAB: Auto-complete</span>
                        <span class="mr-4">↑↓: Command history</span>
                        <span>Ctrl+L: Clear</span>
                    </div>
                </div>
                <div id="console-output" class="flex-1 bg-black p-4 overflow-y-auto text-purple-300 text-sm font-mono min-h-0 border-t border-b border-gray-800" style="min-height: 120px; box-sizing: border-box; scrollbar-width: thin; overflow-x: hidden;">
                    <div class="text-purple-400">Developer Console v2.0</div>
                    <div class="text-gray-400">Type "help" to get started</div>
                </div>
                <div class="p-4 border-t border-gray-700 bg-gray-850">
                    <div class="flex items-center">
                        <span class="text-purple-400 mr-2">></span>
                        <input type="text" id="console-input" class="flex-1 bg-white text-black border border-gray-400 rounded outline-none font-mono px-2 py-1" placeholder="Enter command..." autocomplete="off">
                    </div>
                </div>
            </div>
        `;

        // Quick cheats tab content
        const cheatsContent = document.createElement('div');
        cheatsContent.id = 'cheats-content';
        cheatsContent.className = `h-full p-6 overflow-y-auto ${this.currentTab === 'cheats' ? 'block' : 'hidden'}`;
        
        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6';
        
        Object.entries(this.categories).forEach(([key, category], index) => {
            const categoryElement = this.createCategoryElement(key, category, index + 1);
            categoriesContainer.appendChild(categoryElement);
        });
        
        cheatsContent.appendChild(categoriesContainer);

        // Assemble the menu
        contentArea.appendChild(consoleContent);
        contentArea.appendChild(cheatsContent);
        
        menuContent.appendChild(header);
        menuContent.appendChild(contentArea);
        
        // Add resize handles
        this.addResizeHandles(menuContent);
        
        this.menuElement.appendChild(menuContent);
        
        // Set up dragging and resizing with delay to ensure DOM is ready
        setTimeout(() => this.setupDragAndResize(), 100);
        
        // Set up console input handlers with delay to ensure DOM is ready
        setTimeout(() => this.setupConsoleInput(), 100);
        
        // Load console history
        this.updateConsole();
    }

    /**
     * Add resize handles to the modal
     */
    addResizeHandles(menuContent) {
        // Create resize handles for all corners and edges
        const handles = [
            { class: 'nw-resize', style: 'top: 0; left: 0; width: 10px; height: 10px; cursor: nw-resize;' },
            { class: 'ne-resize', style: 'top: 0; right: 0; width: 10px; height: 10px; cursor: ne-resize;' },
            { class: 'sw-resize', style: 'bottom: 0; left: 0; width: 10px; height: 10px; cursor: sw-resize;' },
            { class: 'se-resize', style: 'bottom: 0; right: 0; width: 10px; height: 10px; cursor: se-resize;' },
            { class: 'n-resize', style: 'top: 0; left: 10px; right: 10px; height: 5px; cursor: n-resize;' },
            { class: 's-resize', style: 'bottom: 0; left: 10px; right: 10px; height: 5px; cursor: s-resize;' },
            { class: 'w-resize', style: 'left: 0; top: 10px; bottom: 10px; width: 5px; cursor: w-resize;' },
            { class: 'e-resize', style: 'right: 0; top: 10px; bottom: 10px; width: 5px; cursor: e-resize;' }
        ];

        handles.forEach(handle => {
            const resizeHandle = document.createElement('div');
            resizeHandle.className = `resize-handle ${handle.class} absolute bg-purple-500 opacity-0 hover:opacity-50 transition-opacity`;
            resizeHandle.style.cssText = handle.style;
            menuContent.appendChild(resizeHandle);
        });
    }

    /**
     * Set up drag and resize functionality
     */
    setupDragAndResize() {
        const header = document.getElementById('dev-menu-header');
        const modal = this.menuElement;

        if (!header || !modal) {
            console.warn('Developer menu elements not found, retrying...');
            setTimeout(() => this.setupDragAndResize(), 100);
            return;
        }

        let isDragging = false;
        let isResizing = false;
        let currentResizeHandle = null;
        let startX, startY, startWidth, startHeight, startLeft, startTop;

        // Dragging functionality
        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return; // Don't drag when clicking buttons
            
            isDragging = true;
            startX = e.clientX - modal.offsetLeft;
            startY = e.clientY - modal.offsetTop;
            
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', stopDrag);
            e.preventDefault();
        });

        function handleDrag(e) {
            if (!isDragging) return;
            
            const newLeft = e.clientX - startX;
            const newTop = e.clientY - startY;
            
            // Keep modal within viewport bounds
            const maxLeft = window.innerWidth - modal.offsetWidth;
            const maxTop = window.innerHeight - modal.offsetHeight;
            
            modal.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
            modal.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', stopDrag);
        }

        // Resizing functionality
        modal.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resize-handle')) {
                isResizing = true;
                currentResizeHandle = e.target;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(modal.style.width);
                startHeight = parseInt(modal.style.height);
                startLeft = parseInt(modal.style.left);
                startTop = parseInt(modal.style.top);
                
                document.addEventListener('mousemove', handleResize);
                document.addEventListener('mouseup', stopResize);
                e.preventDefault();
            }
        });

        function handleResize(e) {
            if (!isResizing) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const minWidth = 400;
            const minHeight = 300;
            const maxWidth = window.innerWidth - 50;
            const maxHeight = window.innerHeight - 50;
            
            if (currentResizeHandle.classList.contains('se-resize')) {
                // Bottom-right corner
                const newWidth = Math.max(minWidth, Math.min(startWidth + deltaX, maxWidth));
                const newHeight = Math.max(minHeight, Math.min(startHeight + deltaY, maxHeight));
                modal.style.width = newWidth + 'px';
                modal.style.height = newHeight + 'px';
            } else if (currentResizeHandle.classList.contains('sw-resize')) {
                // Bottom-left corner
                const newWidth = Math.max(minWidth, Math.min(startWidth - deltaX, maxWidth));
                const newHeight = Math.max(minHeight, Math.min(startHeight + deltaY, maxHeight));
                if (newWidth > minWidth) modal.style.left = startLeft + deltaX + 'px';
                modal.style.width = newWidth + 'px';
                modal.style.height = newHeight + 'px';
            } else if (currentResizeHandle.classList.contains('ne-resize')) {
                // Top-right corner
                const newWidth = Math.max(minWidth, Math.min(startWidth + deltaX, maxWidth));
                const newHeight = Math.max(minHeight, Math.min(startHeight - deltaY, maxHeight));
                if (newHeight > minHeight) modal.style.top = startTop + deltaY + 'px';
                modal.style.width = newWidth + 'px';
                modal.style.height = newHeight + 'px';
            } else if (currentResizeHandle.classList.contains('nw-resize')) {
                // Top-left corner
                const newWidth = Math.max(minWidth, Math.min(startWidth - deltaX, maxWidth));
                const newHeight = Math.max(minHeight, Math.min(startHeight - deltaY, maxHeight));
                if (newWidth > minWidth) modal.style.left = startLeft + deltaX + 'px';
                if (newHeight > minHeight) modal.style.top = startTop + deltaY + 'px';
                modal.style.width = newWidth + 'px';
                modal.style.height = newHeight + 'px';
            } else if (currentResizeHandle.classList.contains('e-resize')) {
                // Right edge
                const newWidth = Math.max(minWidth, Math.min(startWidth + deltaX, maxWidth));
                modal.style.width = newWidth + 'px';
            } else if (currentResizeHandle.classList.contains('w-resize')) {
                // Left edge
                const newWidth = Math.max(minWidth, Math.min(startWidth - deltaX, maxWidth));
                if (newWidth > minWidth) modal.style.left = startLeft + deltaX + 'px';
                modal.style.width = newWidth + 'px';
            } else if (currentResizeHandle.classList.contains('s-resize')) {
                // Bottom edge
                const newHeight = Math.max(minHeight, Math.min(startHeight + deltaY, maxHeight));
                modal.style.height = newHeight + 'px';
            } else if (currentResizeHandle.classList.contains('n-resize')) {
                // Top edge
                const newHeight = Math.max(minHeight, Math.min(startHeight - deltaY, maxHeight));
                if (newHeight > minHeight) modal.style.top = startTop + deltaY + 'px';
                modal.style.height = newHeight + 'px';
            }
        }

        function stopResize() {
            isResizing = false;
            currentResizeHandle = null;
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', stopResize);
        }
    }

    /**
     * Switch between tabs
     */
    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab appearance
        document.getElementById('console-tab').className = `px-4 py-2 text-purple-400 border-r border-gray-700 hover:bg-gray-800 font-semibold text-sm ${tab === 'console' ? 'bg-gray-800 border-b-2 border-purple-400' : ''}`;
        document.getElementById('cheats-tab').className = `px-4 py-2 text-purple-400 border-r border-gray-700 hover:bg-gray-800 font-semibold text-sm ${tab === 'cheats' ? 'bg-gray-800 border-b-2 border-purple-400' : ''}`;
        
        // Show/hide content
        document.getElementById('console-content').className = `h-full ${tab === 'console' ? 'block' : 'hidden'}`;
        document.getElementById('cheats-content').className = `h-full p-6 overflow-y-auto ${tab === 'cheats' ? 'block' : 'hidden'}`;
        
        // Focus console input if switching to console tab
        if (tab === 'console') {
            setTimeout(() => {
                const input = document.getElementById('console-input');
                if (input) {
                    input.focus();
                    // Re-setup handlers in case they weren't attached initially
                    this.setupConsoleInput();
                }
            }, 100);
        }
    }

    /**
     * Set up console input handlers
     */
    setupConsoleInput() {
        const input = document.getElementById('console-input');
        if (!input) {
            console.warn('Console input element not found, retrying...');
            setTimeout(() => this.setupConsoleInput(), 100);
            return;
        }

        input.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    const command = input.value;
                    input.value = '';
                    this.executeConsoleCommand(command);
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    if (this.historyIndex > 0) {
                        this.historyIndex--;
                        input.value = this.commandHistory[this.historyIndex] || '';
                    }
                    break;
                    
                case 'ArrowDown':
                    e.preventDefault();
                    if (this.historyIndex < this.commandHistory.length - 1) {
                        this.historyIndex++;
                        input.value = this.commandHistory[this.historyIndex] || '';
                    } else {
                        this.historyIndex = this.commandHistory.length;
                        input.value = '';
                    }
                    break;
                    
                case 'Tab':
                    e.preventDefault();
                    this.autocompleteCommand(input);
                    break;
                    
                case 'l':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.clearConsole();
                    }
                    break;
            }
        });

        // Focus input when console is shown
        if (this.currentTab === 'console') {
            setTimeout(() => input.focus(), 50);
        }
    }

    /**
     * Autocomplete command input
     */
    autocompleteCommand(input) {
        const value = input.value.toLowerCase();
        const matches = Object.keys(this.consoleCommands).filter(cmd => cmd.startsWith(value));
        
        if (matches.length === 1) {
            input.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            this.log(`Possible commands: ${matches.join(', ')}`);
        }
    }

    /**
     * Create a category element
     */
    createCategoryElement(key, category, number) {
        const element = document.createElement('div');
        element.className = 'bg-gray-800 border border-gray-600 rounded-lg p-4';
        
        const header = document.createElement('h3');
        header.className = 'text-purple-400 font-bold mb-3 flex items-center';
        header.innerHTML = `<span class="bg-purple-600 text-white rounded px-2 py-1 text-xs mr-2">${number}</span>${category.name}`;
        
        const commandsList = document.createElement('div');
        commandsList.className = 'space-y-2';
        
        category.commands.forEach(command => {
            const button = document.createElement('button');
            button.className = 'w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 text-purple-300 hover:text-white rounded text-sm transition-colors duration-200';
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
        // Try new console output element first, fallback to old one
        const consoleElement = document.getElementById('console-output') || document.getElementById('dev-console');
        if (!consoleElement || !this.consoleLog) return;
        
        const html = this.consoleLog.slice(-100).map(entry => {
            let colorClass = 'text-purple-300';
            if (entry.type === 'error') colorClass = 'text-red-400';
            else if (entry.type === 'command') colorClass = 'text-blue-400';
            else if (entry.type === 'success') colorClass = 'text-purple-400';
            else if (entry.type === 'warning') colorClass = 'text-yellow-400';
            else if (entry.type === 'info') colorClass = 'text-blue-300';
            
            return `<div class="${colorClass}">${entry.message}</div>`;
        }).join('');
        
        consoleElement.innerHTML = html;
        consoleElement.scrollTop = consoleElement.scrollHeight;
    }

    // =================
    // COMMAND IMPLEMENTATIONS
    // =================

    promptSetLevel() {
        this.log('Use the console command instead: level <number>', 'warning');
        this.log('Example: level 5', 'info');
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
        this.log('Use the console command instead: xp <amount>', 'warning');
        this.log('Example: xp 100', 'info');
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
        if (!gameData || !gameData.player) {
            this.log('Player data not available', 'error');
            return;
        }
        
        const derivedStats = gameData.player.derivedStats || {};
        derivedStats.health = derivedStats.maxHealth || 100;
        this.log(`HP set to maximum (${derivedStats.maxHealth})`);
        this.refreshUI();
    }

    setMPToMax() {
        if (!gameData || !gameData.player) {
            this.log('Player data not available', 'error');
            return;
        }
        
        const derivedStats = gameData.player.derivedStats || {};
        derivedStats.mana = derivedStats.maxMana || 100;
        this.log(`MP set to maximum (${derivedStats.maxMana})`);
        this.refreshUI();
    }

    healFully() {
        this.setHPToMax();
        this.setMPToMax();
        this.log('Fully healed (HP and MP restored)');
    }

    addGold(amount) {
        if (!gameData || !gameData.player) {
            this.log('Player data not available', 'error');
            return;
        }
        
        if (isNaN(amount)) {
            this.log('Gold amount must be a number', 'error');
            return;
        }
        
        const player = gameData.player;
        if (!player.gold) player.gold = 0;
        player.gold += amount;
        this.log(`Added ${amount} gold (Total: ${player.gold.toLocaleString()})`);
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
        this.log('Console cleared', 'success');
    }

    reloadGame() {
        this.log('⚠️  WARNING: This will reload the game and lose unsaved progress!', 'warning');
        this.log('Use the console command: reload confirm', 'info');
        this.log('Or press the Reload button again to confirm', 'info');
    }

    /**
     * Force reload without confirmation (for console command)
     */
    forceReload() {
        this.log('Reloading game...', 'warning');
        setTimeout(() => window.location.reload(), 1000);
    }

    /**
     * Get and display player information
     */
    getPlayerInfo() {
        if (!gameData || !gameData.player) {
            this.log('Player data not available', 'error');
            return;
        }

        const player = gameData.player;
        const derivedStats = player.derivedStats || {};
        const info = [
            `Name: ${player.name || 'Unknown'}`,
            `Level: ${player.level || 1}`,
            `XP: ${player.experience || 0}`,
            `HP: ${derivedStats.health || 0}/${derivedStats.maxHealth || 0}`,
            `MP: ${derivedStats.mana || 0}/${derivedStats.maxMana || 0}`,
            `Gold: ${player.gold || 0}`,
            `Location: ${player.location || 'Unknown'}`
        ];

        this.log('Player Information:', 'success');
        info.forEach(line => this.log(`  ${line}`));
    }

    /**
     * Set player HP
     */
    setHP(value) {
        if (!gameData || !gameData.player) {
            this.log('Player data not available', 'error');
            return;
        }

        const player = gameData.player;
        const derivedStats = player.derivedStats || {};
        const newHP = Math.max(0, Math.min(value, derivedStats.maxHealth || 100));
        derivedStats.health = newHP;
        
        this.log(`HP set to ${newHP}/${derivedStats.maxHealth}`, 'success');
        this.refreshUI();
    }

    /**
     * Set player MP
     */
    setMP(value) {
        if (!gameData || !gameData.player) {
            this.log('Player data not available', 'error');
            return;
        }

        const player = gameData.player;
        const derivedStats = player.derivedStats || {};
        const newMP = Math.max(0, Math.min(value, derivedStats.maxMana || 100));
        derivedStats.mana = newMP;
        
        this.log(`MP set to ${newMP}/${derivedStats.maxMana}`, 'success');
        this.refreshUI();
    }

    /**
     * Set player level
     */
    setLevel(level) {
        if (!gameData || !gameData.player) {
            this.log('Player data not available', 'error');
            return;
        }

        if (isNaN(level) || level < 1 || level > 20) {
            this.log('Level must be a number between 1 and 20', 'error');
            return;
        }

        const player = gameData.player;
        const oldLevel = player.level;
        player.level = level;
        
        // Recalculate stats if character system is available
        if (typeof calculateDerivedStats === 'function') {
            calculateDerivedStats();
        }
        
        this.log(`Level changed from ${oldLevel} to ${level}`, 'success');
        this.refreshUI();
    }

    /**
     * Set player experience
     */
    setXP(amount) {
        if (!gameData || !gameData.player) {
            this.log('Player data not available', 'error');
            return;
        }

        if (isNaN(amount) || amount < 0) {
            this.log('Experience must be a positive number', 'error');
            return;
        }

        const player = gameData.player;
        const oldXP = player.experience || 0;
        player.experience = amount;
        
        // Update level based on experience if system is available
        if (typeof experienceManager !== 'undefined' && experienceManager.updateLevelFromExperience) {
            experienceManager.updateLevelFromExperience();
        }
        
        this.log(`Experience changed from ${oldXP} to ${amount}`, 'success');
        this.refreshUI();
    }

    /**
     * Add item by ID to inventory
     */
    addItemById(itemId, quantity = 1) {
        if (!itemId) {
            this.log('Item ID required', 'error');
            return;
        }

        if (!gameData || !gameData.player) {
            this.log('Player data not available', 'error');
            return;
        }

        // Create a simple item if we don't have item data loaded
        let foundItem = null;
        
        // Try to find item in loaded data first
        if (window.itemsData) {
            const categories = ['weapons', 'armor', 'consumables', 'tools', 'misc'];
            for (const category of categories) {
                if (window.itemsData[category] && window.itemsData[category][itemId]) {
                    foundItem = window.itemsData[category][itemId];
                    break;
                }
            }
        }

        // If not found, create a basic item
        if (!foundItem) {
            foundItem = {
                id: itemId,
                name: itemId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                type: 'misc',
                description: `Item created via developer console`,
                rarity: 'common',
                weight: 1
            };
        }

        // Add to inventory
        const player = gameData.player;
        if (!player.inventory) player.inventory = [];
        
        for (let i = 0; i < quantity; i++) {
            player.inventory.push({ ...foundItem });
        }
        
        this.log(`Added ${quantity}x ${foundItem.name}`, 'success');
        this.refreshUI();
    }

    /**
     * Remove item by ID from inventory
     */
    removeItemById(itemId, quantity = 1) {
        if (!itemId) {
            this.log('Item ID required', 'error');
            return;
        }

        if (!gameData || !gameData.player) {
            this.log('Player data not available', 'error');
            return;
        }

        const player = gameData.player;
        if (!player.inventory || player.inventory.length === 0) {
            this.log('Inventory is empty', 'warning');
            return;
        }

        let removedCount = 0;
        for (let i = player.inventory.length - 1; i >= 0 && removedCount < quantity; i--) {
            if (player.inventory[i].id === itemId) {
                player.inventory.splice(i, 1);
                removedCount++;
            }
        }

        if (removedCount > 0) {
            this.log(`Removed ${removedCount}x ${itemId}`, 'success');
            this.refreshUI();
        } else {
            this.log(`Item '${itemId}' not found in inventory`, 'warning');
        }
    }

    /**
     * List available items or show inventory
     */
    listItems(type) {
        if (!gameData || !gameData.player) {
            this.log('Player data not available', 'error');
            return;
        }

        const player = gameData.player;
        if (!player.inventory || player.inventory.length === 0) {
            this.log('Inventory is empty', 'info');
            return;
        }

        this.log('Current Inventory:', 'success');
        let filteredItems = player.inventory;
        
        if (type) {
            filteredItems = player.inventory.filter(item => item.type === type);
            this.log(`Filtering by type: ${type}`, 'info');
        }

        if (filteredItems.length === 0) {
            this.log(`No items found${type ? ` of type '${type}'` : ''}`, 'warning');
            return;
        }

        filteredItems.forEach((item, index) => {
            this.log(`  ${index + 1}. ${item.name} (${item.type}) - ${item.description || 'No description'}`);
        });
        
        this.log(`Total: ${filteredItems.length} items`, 'info');
    }

    showHelp() {
        this.log('DEVELOPER CONSOLE HELP', 'success');
        this.log('=====================');
        this.log('');
        this.log('Navigation:', 'success');
        this.log('• ` (backtick) - Toggle developer menu');
        this.log('• ESC - Close menu');
        this.log('• TAB - Auto-complete commands');
        this.log('• ↑/↓ - Command history');
        this.log('• Ctrl+L - Clear console');
        this.log('');
        this.log('Console Commands:', 'success');
        this.log('• help - Show this help');
        this.log('• commands - List all commands');
        this.log('• clear - Clear console output');
        this.log('• player - Show player information');
        this.log('• level [n] - Set player level');
        this.log('• hp [n|max] - Set or show HP');
        this.log('• mp [n|max] - Set or show MP');
        this.log('• gold [n] - Add gold');
        this.log('• item [id] [qty] - Add item to inventory');
        this.log('• time [n] - Advance time by n hours');
        this.log('• reload - Reload the game');
        this.log('');
        this.log('Use "help [command]" for detailed command info.', 'info');
        this.log('Use the Quick Cheats tab for button-based shortcuts.', 'info');
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
        if (!gameData) {
            this.log('Game data not available', 'error');
            return;
        }

        const player = gameData.player || {};
        const derivedStats = player.derivedStats || {};
        
        const state = {
            player: {
                name: player.name || 'Unknown',
                level: player.level || 1,
                experience: player.experience || 0,
                location: player.location || 'Unknown',
                stats: player.stats || {},
                derivedStats: {
                    health: derivedStats.health || 0,
                    maxHealth: derivedStats.maxHealth || 0,
                    mana: derivedStats.mana || 0,
                    maxMana: derivedStats.maxMana || 0
                },
                inventory: (player.inventory ? player.inventory.length : 0) + ' items',
                gold: player.gold || 0,
                godMode: player.godMode || false
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
        this.log('Game state logged to browser console', 'success');
        
        // Also display key info in the developer console
        this.log('=== GAME STATE SUMMARY ===', 'success');
        this.log(`Player: ${state.player.name} (Level ${state.player.level})`);
        this.log(`HP: ${state.player.derivedStats.health}/${state.player.derivedStats.maxHealth}`);
        this.log(`MP: ${state.player.derivedStats.mana}/${state.player.derivedStats.maxMana}`);
        this.log(`XP: ${state.player.experience}, Gold: ${state.player.gold}`);
        this.log(`Location: ${state.player.location}`);
        this.log(`Inventory: ${state.player.inventory}`);
        if (state.player.godMode) this.log('God Mode: ACTIVE', 'warning');
    }

    // ==================
    // INVENTORY COMMANDS
    // ==================
    
    addTestItems() {
        if (!gameData || !gameData.player) {
            this.log('Player data not available', 'error');
            return;
        }
        
        const player = gameData.player;
        if (!player.inventory) player.inventory = [];
        
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
            player.inventory.push(item);
        });
        
        this.log(`Added ${testItems.length} test items to inventory`, 'success');
        this.refreshUI();
    }
    
    clearInventory() {
        if (!gameData || !gameData.player) {
            this.log('Player data not available', 'error');
            return;
        }
        
        const player = gameData.player;
        if (!player.inventory) player.inventory = [];
        
        const itemCount = player.inventory.length;
        if (itemCount === 0) {
            this.log('Inventory is already empty', 'info');
            return;
        }
        
        player.inventory = [];
        this.log(`Cleared inventory (${itemCount} items removed)`, 'success');
        this.refreshUI();
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
    localStorage.setItem('devMode', 'true');
    devMenu.isEnabled = true;
    devMenu.log('Developer mode enabled globally');
};

window.disableDevMode = () => {
    localStorage.removeItem('devMode');
    devMenu.isEnabled = false;
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

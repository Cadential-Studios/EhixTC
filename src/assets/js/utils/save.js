// Save System Module
// Edoria: The Triune Convergence - Save/Load Management

class SaveManager {
    constructor() {
        this.saveKey = SAVE_KEY || 'edoriaSaves';
        this.maxSlots = SAVE_SLOT_LIMIT || 10; // Increased from 5
        this.gameVersion = GAME_VERSION || 'dev';
        this.autoSaveKey = `${this.saveKey}_autosave`;
        this.backupKey = `${this.saveKey}_backup`;
    }

    // Get all save slots
    getSaveSlots() {
        try {
            const saves = localStorage.getItem(this.saveKey);
            return saves ? JSON.parse(saves) : [];
        } catch (error) {
            console.error('Error loading save slots:', error);
            return [];
        }
    }

    // Set save slots with error handling
    setSaveSlots(slots) {
        try {
            // Create backup before overwriting
            const currentSaves = localStorage.getItem(this.saveKey);
            if (currentSaves) {
                localStorage.setItem(this.backupKey, currentSaves);
            }
            
            localStorage.setItem(this.saveKey, JSON.stringify(slots));
            return true;
        } catch (error) {
            console.error('Error saving slots:', error);
            if (error.name === 'QuotaExceededError') {
                this.showError('Storage limit exceeded. Please delete some saves.');
            } else {
                this.showError('Failed to save game data.');
            }
            return false;
        }
    }

    // Create comprehensive save data
    createSaveData(name = null, isAutoSave = false) {
        const timestamp = new Date();
        const saveData = {
            saveId: `save_${Date.now()}`,
            name: name || (isAutoSave ? 'Auto Save' : `Manual Save ${timestamp.toLocaleDateString()}`),
            gameVersion: this.gameVersion,
            timestamp: timestamp.toISOString(),
            isAutoSave: isAutoSave,
            playTime: this.calculatePlayTime(),
            location: gameData?.player?.location || 'unknown',
            level: gameData?.player?.level || 1,
            screenshot: this.captureGameState(),
            data: this.sanitizeGameData()
        };
        
        return saveData;
    }

    // Sanitize game data to prevent circular references and reduce size
    sanitizeGameData() {
        try {
            const dataCopy = {
                player: { ...gameData.player },
                time: { ...gameData.time },
                story: { ...gameData.story },
                settings: { ...gameData.settings }
            };

            // Convert Sets to Arrays for JSON serialization
            if (dataCopy.player.lore instanceof Set) {
                dataCopy.player.lore = Array.from(dataCopy.player.lore);
            }
            if (dataCopy.player.rumors instanceof Set) {
                dataCopy.player.rumors = Array.from(dataCopy.player.rumors);
            }
            if (dataCopy.player.journalPins instanceof Set) {
                dataCopy.player.journalPins = Array.from(dataCopy.player.journalPins);
            }

            return JSON.parse(JSON.stringify(dataCopy));
        } catch (error) {
            console.error('Error sanitizing game data:', error);
            throw error;
        }
    }

    // Calculate play time
    calculatePlayTime() {
        if (gameData?.time?.playStartTime) {
            return Date.now() - gameData.time.playStartTime;
        }
        return 0;
    }

    // Capture current game state for preview
    captureGameState() {
        return {
            currentScene: gameData?.story?.currentScene || null,
            hp: gameData?.player?.stats?.hp || 100,
            maxHp: gameData?.player?.stats?.max_hp || 100,
            gold: gameData?.player?.currency?.gold || 0,
            inventoryCount: gameData?.player?.inventory?.length || 0
        };
    }

    // Manual save with optional custom name
    saveGame(customName = null) {
        const saveData = this.createSaveData(customName, false);
        
        if (customName) {
            // Save to specific slot if custom name provided
            this.saveToNewSlot(saveData);
        } else {
            // Show save name dialog
            this.showSaveNameDialog((name) => {
                if (name !== null) {
                    saveData.name = name || saveData.name;
                    this.saveToNewSlot(saveData);
                }
            });
        }
    }

    // Auto save (happens automatically)
    autoSave() {
        try {
            const autoSaveData = this.createSaveData('Auto Save', true);
            localStorage.setItem(this.autoSaveKey, JSON.stringify(autoSaveData));
            
            // Also add to regular saves but mark as auto
            const slots = this.getSaveSlots();
            
            // Remove old auto saves to prevent spam
            const filteredSlots = slots.filter(save => !save.isAutoSave);
            
            // Add new auto save at the beginning
            filteredSlots.unshift(autoSaveData);
            
            // Keep within limit
            if (filteredSlots.length > this.maxSlots) {
                filteredSlots.splice(this.maxSlots);
            }
            
            this.setSaveSlots(filteredSlots);
            console.log('Auto save completed');
        } catch (error) {
            console.error('Auto save failed:', error);
        }
    }

    // Save to new slot (manual saves)
    saveToNewSlot(saveData) {
        const slots = this.getSaveSlots();
        
        // Remove old auto saves from manual slot list
        const manualSlots = slots.filter(save => !save.isAutoSave);
        
        // Add new save at the beginning
        manualSlots.unshift(saveData);
        
        // Keep within limit for manual saves
        if (manualSlots.length > this.maxSlots - 1) { // Reserve 1 slot for auto save
            manualSlots.splice(this.maxSlots - 1);
        }
        
        // Re-add auto save if it exists
        const autoSave = slots.find(save => save.isAutoSave);
        if (autoSave) {
            manualSlots.unshift(autoSave);
        }
        
        if (this.setSaveSlots(manualSlots)) {
            this.populateSaveSlots();
            this.displaySaveMessage('Game saved successfully!', 'success');
        }
    }

    // Save to specific slot (overwrite)
    saveToSlot(index) {
        this.showConfirmationModal('Overwrite this save slot?', (confirmed) => {
            if (!confirmed) return;
            
            const slots = this.getSaveSlots();
            if (index >= 0 && index < slots.length) {
                const saveData = this.createSaveData(slots[index].name, slots[index].isAutoSave);
                slots[index] = saveData;
                
                if (this.setSaveSlots(slots)) {
                    this.populateSaveSlots();
                    this.displaySaveMessage('Save slot overwritten!', 'success');
                }
            }
        });
    }
    loadGame(index) {
        const slots = this.getSaveSlots();
        const save = slots[index];
        
        if (!save) {
            this.showError('Save slot not found.');
            return;
        }

        this.showConfirmationModal('Load this save? Any unsaved progress will be lost.', (confirmed) => {
            if (!confirmed) return;
            
            try {
                this.restoreGameData(save.data);
                this.displaySaveMessage('Game loaded successfully!', 'success');
                
                // Navigate to appropriate screen
                if (save.data.story?.currentScene) {
                    renderScene(save.data.story.currentScene);
                } else {
                    renderLocation(save.data.player?.location || 'westwalker_camp');
                }
                
                updateDisplay();
                
                // Close the settings panel
                if (typeof closePanel === 'function') {
                    closePanel();
                }
                
            } catch (error) {
                console.error('Failed to load game:', error);
                this.showError('Failed to load save file. The save may be corrupted.');
            }
        });
    }

    // Restore game data from save
    restoreGameData(saveData) {
        const { player, time, story, settings } = saveData;
        
        // Restore player data
        gameData.player = { ...player };
        
        // Convert arrays back to Sets if needed
        if (Array.isArray(player.lore)) {
            gameData.player.lore = new Set(player.lore);
        }
        if (Array.isArray(player.rumors)) {
            gameData.player.rumors = new Set(player.rumors);
        }
        if (Array.isArray(player.journalPins)) {
            gameData.player.journalPins = new Set(player.journalPins);
        }
        
        // Restore other data
        gameData.time = { ...time };
        gameData.story = { ...story };
        gameData.settings = { ...settings };
        
        // Ensure inventory structure is consistent
        if (typeof craftingManager !== 'undefined' && craftingManager.convertInventoryToNewStructure) {
            craftingManager.convertInventoryToNewStructure();
        }
    }

    // Delete save slot
    deleteSave(index) {
        this.showConfirmationModal('Delete this save? This action cannot be undone.', (confirmed) => {
            if (!confirmed) return;
            
            const slots = this.getSaveSlots();
            if (index >= 0 && index < slots.length) {
                slots.splice(index, 1);
                
                if (this.setSaveSlots(slots)) {
                    this.populateSaveSlots();
                    this.displaySaveMessage('Save deleted.', 'info');
                }
            }
        });
    }

    // Clear all saves
    clearAllSaves() {
        this.showConfirmationModal('Delete ALL saved games? This action cannot be undone and will remove all your progress!', (confirmed) => {
            if (!confirmed) return;
            
            try {
                // Clear main saves
                localStorage.removeItem(this.saveKey);
                // Clear auto-saves
                localStorage.removeItem(this.autoSaveKey);
                // Clear backup
                localStorage.removeItem(this.backupKey);
                
                // Update UI
                this.populateSaveSlots();
                this.displaySaveMessage('All saves cleared.', 'info');
                
                console.log('All saves cleared successfully');
            } catch (error) {
                console.error('Error clearing saves:', error);
                this.showError('Failed to clear all saves.');
            }
        });
    }

    // Import save from file
    importSave(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const saveData = JSON.parse(e.target.result);
                
                // Validate save data
                if (!this.validateSaveData(saveData)) {
                    this.showError('Invalid save file format.');
                    return;
                }
                
                const slots = this.getSaveSlots();
                saveData.name = `${saveData.name} (Imported)`;
                slots.unshift(saveData);
                
                // Keep within limit
                if (slots.length > this.maxSlots) {
                    slots.splice(this.maxSlots);
                }
                
                if (this.setSaveSlots(slots)) {
                    this.populateSaveSlots();
                    this.displaySaveMessage('Save imported successfully!', 'success');
                }
                
            } catch (error) {
                console.error('Import failed:', error);
                this.showError('Failed to import save file. Invalid format.');
            }
        };
        reader.readAsText(file);
    }

    // Export save to file
    exportSave(index) {
        const slots = this.getSaveSlots();
        const save = slots[index];
        
        if (!save) {
            this.showError('Save slot not found.');
            return;
        }
        
        const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${save.name.replace(/[^a-z0-9]/gi, '_')}_${save.saveId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Validate save data structure
    validateSaveData(saveData) {
        return saveData && 
               saveData.data && 
               saveData.data.player && 
               saveData.timestamp && 
               saveData.gameVersion;
    }

    // Populate save slots UI with enhanced display
    populateSaveSlots(customContainer) {
        const slots = this.getSaveSlots();
        const container = customContainer || document.getElementById('save-slots');
        if (!container) return;
        
        if (slots.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-400">
                    <i class="ph-duotone ph-folder-open text-4xl mb-2"></i>
                    <p>No saved games found</p>
                    <p class="text-sm mt-1">Click "Save Game" to create your first save</p>
                </div>
            `;
            return;
        }

        container.innerHTML = slots.map((save, index) => {
            const date = new Date(save.timestamp);
            const playTime = this.formatPlayTime(save.playTime || 0);
            const isAutoSave = save.isAutoSave;
            
            return `
                <div class="save-slot bg-gray-700 rounded-lg p-4 mb-3 border ${isAutoSave ? 'border-blue-500' : 'border-gray-600'}" data-slot="${index}">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex-1">
                            <h4 class="text-white font-semibold flex items-center gap-2">
                                ${isAutoSave ? '<i class="ph-duotone ph-clock text-blue-400"></i>' : '<i class="ph-duotone ph-floppy-disk text-green-400"></i>'}
                                ${save.name}
                            </h4>
                            <p class="text-gray-400 text-sm">${date.toLocaleString()}</p>
                        </div>
                        <div class="text-right text-sm text-gray-300">
                            <div>Level ${save.level || 1}</div>
                            <div>${playTime}</div>
                        </div>
                    </div>
                    
                    <div class="text-sm text-gray-300 mb-3">
                        <div class="flex justify-between">
                            <span>Location: ${(save.location || 'Unknown').replace(/_/g, ' ')}</span>
                            <span>HP: ${save.screenshot?.hp || '?'}/${save.screenshot?.maxHp || '?'}</span>
                        </div>
                        <div class="flex justify-between mt-1">
                            <span>Items: ${save.screenshot?.inventoryCount || 0}</span>
                            <span>Gold: ${save.screenshot?.gold || 0}</span>
                        </div>
                    </div>
                    
                    <div class="flex gap-2 flex-wrap">
                        <button class="load-save-btn flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors" data-slot="${index}">
                            <i class="ph-duotone ph-play mr-1"></i>Load
                        </button>
                        ${!isAutoSave ? `
                            <button class="overwrite-save-btn bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm transition-colors" data-slot="${index}">
                                <i class="ph-duotone ph-floppy-disk mr-1"></i>Overwrite  
                            </button>
                        ` : ''}
                        <button class="export-save-btn bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition-colors" data-slot="${index}">
                            <i class="ph-duotone ph-export mr-1"></i>Export
                        </button>
                        <button class="delete-save-btn bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors" data-slot="${index}">
                            <i class="ph-duotone ph-trash mr-1"></i>Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners
        this.attachSaveSlotListeners();
    }

    // Attach event listeners to save slot buttons
    attachSaveSlotListeners() {
        const container = document.getElementById('save-slots');
        if (!container) return;

        // Load buttons
        container.querySelectorAll('.load-save-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.loadGame(parseInt(btn.dataset.slot));
            });
        });

        // Overwrite buttons
        container.querySelectorAll('.overwrite-save-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.saveToSlot(parseInt(btn.dataset.slot));
            });
        });

        // Export buttons
        container.querySelectorAll('.export-save-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.exportSave(parseInt(btn.dataset.slot));
            });
        });

        // Delete buttons
        container.querySelectorAll('.delete-save-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.deleteSave(parseInt(btn.dataset.slot));
            });
        });
    }

    // Format play time for display
    formatPlayTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return `${seconds}s`;
        }
    }

    // Show save name dialog
    showSaveNameDialog(callback) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 border border-gray-600">
                <h3 class="text-white text-xl font-cinzel mb-4">Save Game</h3>
                <div class="mb-4">
                    <label class="block text-gray-300 text-sm mb-2">Save Name:</label>
                    <input type="text" id="save-name-input" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none" 
                           placeholder="Enter save name..." maxlength="50">
                </div>
                <div class="flex justify-end gap-3">
                    <button class="cancel-btn bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">Cancel</button>
                    <button class="confirm-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">Save</button>
                </div>
            </div>
        `;

        const input = overlay.querySelector('#save-name-input');
        const confirmBtn = overlay.querySelector('.confirm-btn');
        const cancelBtn = overlay.querySelector('.cancel-btn');

        // Set default name
        const defaultName = `Save ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
        input.value = defaultName;
        input.select();

        confirmBtn.onclick = () => {
            const name = input.value.trim();
            overlay.remove();
            callback(name || defaultName);
        };

        cancelBtn.onclick = () => {
            overlay.remove();
            callback(null);
        };

        // Enter key to confirm
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                confirmBtn.click();
            }
        });

        document.body.appendChild(overlay);
        input.focus();
    }

    // Display save message with type
    displaySaveMessage(message, type = 'success') {
        const msgEl = document.getElementById('save-message');
        if (!msgEl) return;

        const colors = {
            success: 'text-green-300',
            error: 'text-red-300',
            info: 'text-blue-300',
            warning: 'text-yellow-300'
        };

        msgEl.textContent = message;
        msgEl.className = `text-sm text-center ${colors[type] || colors.success}`;
        msgEl.style.display = 'block';
        
        setTimeout(() => {
            msgEl.style.display = 'none';
        }, 3000);
    }

    // Show error message
    showError(message) {
        this.displaySaveMessage(message, 'error');
    }

    // Enhanced confirmation modal
    showConfirmationModal(message, callback) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 confirmation-modal';
        overlay.innerHTML = `
            <div class="bg-gray-800 p-6 rounded-lg text-center max-w-md mx-4 border border-gray-600">
                <div class="mb-4">
                    <i class="ph-duotone ph-warning-circle text-yellow-400 text-4xl mb-2"></i>
                    <p class="text-white text-lg">${message}</p>
                </div>
                <div class="flex justify-center gap-4">
                    <button class="confirm-btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors">Yes</button>
                    <button class="cancel-btn bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors">No</button>
                </div>
            </div>
        `;

        overlay.querySelector('.confirm-btn').onclick = () => { 
            overlay.remove(); 
            callback(true); 
        };
        overlay.querySelector('.cancel-btn').onclick = () => { 
            overlay.remove(); 
            callback(false); 
        };

        document.body.appendChild(overlay);
    }
}

// Create global save manager instance
const saveManager = new SaveManager();

// Make SaveManager available globally
if (typeof window !== 'undefined') {
    window.saveManager = saveManager;
}

// Global functions for backward compatibility
function getSaveSlots() { return saveManager.getSaveSlots(); }
function setSaveSlots(slots) { return saveManager.setSaveSlots(slots); }
function createSaveData() { return saveManager.createSaveData(); }
function saveGame() { return saveManager.saveGame(); }
function saveToSlot(index) { return saveManager.saveToSlot(index); }
function loadGame(index) { return saveManager.loadGame(index); }
function populateSaveSlots() { return saveManager.populateSaveSlots(); }
function deleteSave(index) { return saveManager.deleteSave(index); }
function clearAllSaves() { return saveManager.clearAllSaves(); }
function displaySaveMessage(msg, type) { return saveManager.displaySaveMessage(msg, type); }
function showConfirmationModal(message, callback) { return saveManager.showConfirmationModal(message, callback); }

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SaveManager, showConfirmationModal };
}

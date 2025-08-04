// Foraging Progress Modal
function showForagingProgress({duration = 2000, onComplete, diceRoll, bonus, skillName}) {
    let modal = document.getElementById('foraging-progress-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'foraging-progress-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 hidden';
        modal.innerHTML = `
            <div class="bg-green-950 border-2 border-green-700 rounded-lg p-8 max-w-md mx-4 flex flex-col items-center shadow-2xl animate-pulse">
                <div class="flex flex-col items-center mb-4">
                    <span class="text-3xl font-cinzel text-green-200 animate-bounce">🌿 Foraging...</span>
                    <span id="foraging-dice-roll" class="mt-2 text-lg text-green-100"></span>
                </div>
                <div class="w-full h-6 bg-green-900 rounded-full overflow-hidden mb-2 border border-green-700">
                    <div id="foraging-progress-bar" class="h-full bg-gradient-to-r from-green-400 to-green-700 transition-all duration-300" style="width:0%"></div>
                </div>
                <span id="foraging-time-label" class="text-xs text-green-300">Time passing...</span>
            </div>
        `;
        document.body.appendChild(modal);
    }
    // Set dice roll display
    const diceText = diceRoll !== undefined ? `Rolled <span class='font-bold text-green-300'>d20</span>: <span class='font-bold text-green-200'>${diceRoll}</span> + <span class='font-bold text-green-300'>${bonus}</span> (${skillName})` : '';
    modal.querySelector('#foraging-dice-roll').innerHTML = diceText;
    modal.classList.remove('hidden');
    // Animate progress bar smoothly using CSS transition
    const bar = modal.querySelector('#foraging-progress-bar');
    bar.style.transition = `width ${duration}ms linear`;
    // Reset to 0 instantly before triggering animation
    bar.style.width = '0%';
    // Force reflow to apply the reset
    void bar.offsetWidth;
    // Animate to 100%
    setTimeout(() => {
        bar.style.width = '100%';
    }, 10);
    // After duration, hide modal and call onComplete
    setTimeout(() => {
        modal.classList.add('hidden');
        if (onComplete) onComplete();
    }, duration + 400);
}

// UI Management Module
// Edoria: The Triune Convergence - User Interface

// Note: DOM elements are initialized in main.js
// This module provides UI management functions

// General message system that works both in and out of combat
function showGameMessage(message, type = 'normal') {
    // If in combat, use combat message system
    if (combatState.inCombat) {
        addCombatMessage(message, type);
        return;
    }
    
    // Otherwise, show a floating message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-2xl transition-all duration-500';
    
    let bgColor = 'bg-gray-800 border-gray-600 text-gray-300';
    switch (type) {
        case 'success':
            bgColor = 'bg-green-800 border-green-600 text-green-300';
            break;
        case 'failure':
            bgColor = 'bg-red-800 border-red-600 text-red-300';
            break;
        case 'info':
            bgColor = 'bg-blue-800 border-blue-600 text-blue-300';
            break;
        case 'warning':
            bgColor = 'bg-yellow-800 border-yellow-600 text-yellow-300';
            break;
    }
    
    messageDiv.className += ` ${bgColor} border-2`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(-50%) translateY(-100px)';
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 500);
    }, 3000);
}

// Combat message system
function addCombatMessage(message, type = 'normal') {
    const combatMessages = document.getElementById('combat-messages');
    if (!combatMessages) {
        console.warn('Combat messages container not found');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'combat-message p-2 rounded mb-1';
    
    let colorClass = 'text-gray-300';
    switch (type) {
        case 'success':
            colorClass = 'text-green-300';
            break;
        case 'failure':
        case 'damage':
            colorClass = 'text-red-300';
            break;
        case 'info':
            colorClass = 'text-blue-300';
            break;
        case 'warning':
            colorClass = 'text-yellow-300';
            break;
        case 'healing':
            colorClass = 'text-green-400';
            break;
    }
    
    messageDiv.className += ` ${colorClass}`;
    messageDiv.textContent = message;
    
    combatMessages.appendChild(messageDiv);
    
    // Auto-scroll to bottom if enabled
    if (gameData.settings.autoScrollCombatLog) {
        combatMessages.scrollTop = combatMessages.scrollHeight;
    }
}

function showFloatingText(text, color = 'white') {
    // Create floating text element
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.className = `fixed z-50 pointer-events-none font-bold text-lg animate-bounce`;
    floatingText.style.color = color;
    floatingText.style.left = '50%';
    floatingText.style.top = '50%';
    floatingText.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(floatingText);
    
    // Remove after animation
    setTimeout(() => {
        if (floatingText.parentNode) {
            floatingText.parentNode.removeChild(floatingText);
        }
    }, 2000);
}

// Panel Management Functions
function openPanel(panelId) {
    // Close all panels first
    closeAllPanels();
    
    // Open the requested panel
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.style.display = 'block';
        panel.classList.add('open');
        if (typeof hideBottomNavForMobile !== 'undefined') {
            hideBottomNavForMobile(true);
        }
        
        // Populate panel content based on panel type
        switch (panelId) {
            case 'journal-panel':
                renderJournal();
                break;
            case 'character-panel':
                renderCharacterSheet();
                break;
            case 'inventory-panel':
                renderAdvancedInventory();
                break;
            case 'crafting-panel':
                renderCraftingWorkshop();
                break;
            case 'settings-panel':
                renderSettings();
                break;
        }
    }
}

function closeAllPanels() {
    if (!uiPanels || typeof uiPanels.forEach !== 'function') {
        return;
    }
    uiPanels.forEach(panel => {
        if (panel) {
            panel.style.display = 'none';
            panel.classList.remove('open');
        }
    });
    if (typeof hideBottomNavForMobile !== 'undefined') {
        hideBottomNavForMobile(false);
    }
}

function updateDisplayOriginal() {
    // Update date display
    if (dateEl) {
        dateEl.textContent = `${gameData.time.months[gameData.time.month]} ${gameData.time.day}, ${gameData.time.year} PA`;
    }
    
    // Update month description
    if (monthDescEl) {
        monthDescEl.textContent = gameData.time.monthDescriptions[gameData.time.month];
    }
    
    // Update moon phases
    updateMoonPhases();
}

function updateMoonPhases() {
    // Calculate moon phases based on current day
    const edyriaPhase = (gameData.time.day + gameData.moons.edyria.phase) % gameData.moons.edyria.cycle;
    const kapraPhase = (gameData.time.day + gameData.moons.kapra.phase) % gameData.moons.kapra.cycle;
    const eniaPhase = (gameData.time.day + gameData.moons.enia.phase) % gameData.moons.enia.cycle;
    
    // Update visual representations
    updateMoonVisual(moonEdyriaEl, edyriaPhase, gameData.moons.edyria.cycle);
    updateMoonVisual(moonKapraEl, kapraPhase, gameData.moons.kapra.cycle);
    updateMoonVisual(moonEniaEl, eniaPhase, gameData.moons.enia.cycle);
}

function updateMoonVisual(moonEl, phase, cycle) {
    if (!moonEl) return;
    
    // Calculate moon fullness (0 = new moon, 1 = full moon)
    const fullness = Math.abs((phase - cycle/2) / (cycle/2));
    const opacity = 0.3 + (0.7 * (1 - fullness));
    
    moonEl.style.opacity = opacity;
    
    // Add full moon class if close to full
    if (fullness < 0.1) {
        moonEl.classList.add('full-moon');
    } else {
        moonEl.classList.remove('full-moon');
    }
}

// Settings Panel Rendering
function renderSettings() {
    if (!settingsContent) return;
    
    const content = `
        <div class="settings-panel space-y-6">
            <div class="setting-group">
                <h4 class="font-cinzel text-xl text-white mb-3">Game Settings</h4>
                
                <div class="setting-item mb-4">
                    <label class="block text-gray-300 mb-2">Text Speed</label>
                    <input type="range" min="0.5" max="2" step="0.1" value="${gameData.settings.textSpeed}" 
                           class="w-full" id="text-speed-slider">
                    <div class="text-gray-400 text-sm mt-1">Current: ${gameData.settings.textSpeed}x</div>
                </div>
                
                <div class="setting-item mb-4">
                    <label class="block text-gray-300 mb-2">Volume</label>
                    <input type="range" min="0" max="1" step="0.1" value="${gameData.settings.volume}" 
                           class="w-full" id="volume-slider">
                    <div class="text-gray-400 text-sm mt-1">Current: ${Math.round(gameData.settings.volume * 100)}%</div>
                </div>
            </div>
            
            <div class="setting-group">
                <h4 class="font-cinzel text-xl text-white mb-3">Combat Settings</h4>
                
                <div class="setting-item mb-4">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" ${gameData.settings.showDiceAnimations ? 'checked' : ''} 
                               id="dice-animations-toggle" class="rounded">
                        <span class="text-gray-300">Show Dice Roll Animations</span>
                    </label>
                </div>
                
                <div class="setting-item mb-4">
                    <label class="block text-gray-300 mb-2">Combat Animation Speed</label>
                    <input type="range" min="0.5" max="2" step="0.1" value="${gameData.settings.combatAnimationSpeed}" 
                           class="w-full" id="combat-speed-slider">
                    <div class="text-gray-400 text-sm mt-1">Current: ${gameData.settings.combatAnimationSpeed}x</div>
                </div>
                
                <div class="setting-item mb-4">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" ${gameData.settings.autoScrollCombatLog ? 'checked' : ''} 
                               id="auto-scroll-toggle" class="rounded">
                        <span class="text-gray-300">Auto-scroll Combat Log</span>
                    </label>
                </div>
                
                <div class="setting-item mb-4">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" ${gameData.settings.showStatAnimations ? 'checked' : ''} 
                               id="stat-animations-toggle" class="rounded">
                        <span class="text-gray-300">Show Stat Change Animations</span>
                    </label>
                    <div class="text-gray-400 text-xs mt-1">Display animated modals when healing or equipping items that change stats</div>
                </div>
            </div>
            
            <div class="setting-group">
                <h4 class="font-cinzel text-xl text-white mb-3">Save System</h4>
                <div class="space-y-3">
                    <div class="flex gap-2">
                        <button class="action-button flex-1 py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 transition-colors" onclick="saveGame()">
                            <i class="ph-duotone ph-floppy-disk mr-2"></i>Save Game
                        </button>
                        <button class="action-button py-2 px-4 rounded bg-green-600 hover:bg-green-700 transition-colors" onclick="saveManager.autoSave()" title="Manual Auto Save">
                            <i class="ph-duotone ph-clock"></i>
                        </button>
                    </div>
                    
                    <div class="flex gap-2">
                        <label class="action-button flex-1 py-2 px-4 rounded bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer text-center">
                            <i class="ph-duotone ph-upload mr-2"></i>Import Save
                            <input type="file" id="import-save-input" accept=".json" style="display: none;" onchange="handleSaveImport(this)">
                        </label>
                        <button class="action-button py-2 px-4 rounded bg-gray-600 hover:bg-gray-700 transition-colors" onclick="clearAllSaves()" title="Clear All Saves">
                            <i class="ph-duotone ph-trash"></i>
                        </button>
                    </div>
                    
                    <div id="save-slots" class="space-y-2 max-h-96 overflow-y-auto"></div>
                    <div id="save-message" class="text-green-300 text-sm text-center" style="display: none;"></div>
                </div>
            </div>
        </div>
    `;
    
    settingsContent.innerHTML = content;
    
    // Add event listeners for settings
    const textSpeedSlider = document.getElementById('text-speed-slider');
    const volumeSlider = document.getElementById('volume-slider');
    const diceAnimationsToggle = document.getElementById('dice-animations-toggle');
    const combatSpeedSlider = document.getElementById('combat-speed-slider');
    const autoScrollToggle = document.getElementById('auto-scroll-toggle');
    const statAnimationsToggle = document.getElementById('stat-animations-toggle');
    
    if (textSpeedSlider) {
        textSpeedSlider.addEventListener('input', function() {
            gameData.settings.textSpeed = parseFloat(this.value);
            this.nextElementSibling.textContent = `Current: ${gameData.settings.textSpeed}x`;
        });
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            gameData.settings.volume = parseFloat(this.value);
            this.nextElementSibling.textContent = `Current: ${Math.round(gameData.settings.volume * 100)}%`;
        });
    }
    
    if (diceAnimationsToggle) {
        diceAnimationsToggle.addEventListener('change', function() {
            gameData.settings.showDiceAnimations = this.checked;
        });
    }
    
    if (combatSpeedSlider) {
        combatSpeedSlider.addEventListener('input', function() {
            gameData.settings.combatAnimationSpeed = parseFloat(this.value);
            this.nextElementSibling.textContent = `Current: ${gameData.settings.combatAnimationSpeed}x`;
        });
    }
    
    if (autoScrollToggle) {
        autoScrollToggle.addEventListener('change', function() {
            gameData.settings.autoScrollCombatLog = this.checked;
        });
    }
    
    if (statAnimationsToggle) {
        statAnimationsToggle.addEventListener('change', function() {
            gameData.settings.showStatAnimations = this.checked;
            // Update the stat animator with the new setting
            if (typeof toggleStatAnimations === 'function') {
                toggleStatAnimations(this.checked);
            }
        });
    }
    
    // Populate save slots
    populateSaveSlots();
}

// Save system helper functions
function handleSaveImport(input) {
    const file = input.files[0];
    if (file) {
        saveManager.importSave(file);
        input.value = ''; // Reset input
    }
}

function clearAllSaves() {
    saveManager.showConfirmationModal('Delete ALL save files? This action cannot be undone!', (confirmed) => {
        if (confirmed) {
            localStorage.removeItem(saveManager.saveKey);
            localStorage.removeItem(saveManager.autoSaveKey);
            localStorage.removeItem(saveManager.backupKey);
            saveManager.populateSaveSlots();
            saveManager.displaySaveMessage('All saves cleared.', 'info');
        }
    });
}

// Journal Panel Rendering
function renderJournal(activeTab = 'all') {
    if (!journalContentEl) return;

    const searchEl = document.getElementById('journal-search-input');
    const searchQuery = searchEl ? searchEl.value.toLowerCase() : '';

    let content = '<div class="journal-container">';

    // Tab Navigation + Search
    content += `
        <div class="journal-tabs mb-4">
            <div class="flex flex-wrap items-center space-x-1 bg-gray-800 rounded-lg p-1">
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('all')"><i class='ph-duotone ph-book-open mr-1'></i>All</button>
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'quests' ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('quests')"><i class='ph-duotone ph-scroll mr-1'></i>Quests</button>
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'lore' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('lore')"><i class='ph-duotone ph-book mr-1'></i>Lore</button>
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'rumors' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('rumors')"><i class='ph-duotone ph-chats-circle mr-1'></i>Rumors</button>
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'locations' ? 'bg-green-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('locations')"><i class='ph-duotone ph-map-pin mr-1'></i>Locations</button>
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'items' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('items')"><i class='ph-duotone ph-backpack mr-1'></i>Items</button>
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'npcs' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('npcs')"><i class='ph-duotone ph-users mr-1'></i>NPCs</button>
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'bestiary' ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('bestiary')"><i class='ph-duotone ph-users mr-1'></i>Bestiary</button>
                <input id="journal-search-input" class="ml-auto px-2 py-1 rounded text-black" placeholder="Search..." value="${searchQuery}" oninput="renderJournal('${activeTab}')" />
            </div>
        </div>
    `;
    // Locations Tab
    if (activeTab === 'locations') {
        const locations = Object.values(gameData.locations || {});
        content += `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    <i class='ph-duotone ph-map-pin'></i> Locations & Regions
                </h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${locations.length > 0 ?
                        locations.map(loc => `
                            <div class="journal-entry location">
                                <div class="text-green-400 font-semibold">${loc.name}</div>
                                <div class="text-white text-sm">${loc.description || ''}</div>
                            </div>
                        `).join('') :
                        '<div class="text-gray-400 italic">No locations discovered</div>'
                    }
                </div>
            </div>
        `;
    }

    // Items Tab
    if (activeTab === 'items') {
        const items = Object.values(gameData.journalItems || {});
        content += `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    <i class='ph-duotone ph-backpack'></i> Items & Artifacts
                </h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${items.length > 0 ?
                        items.map(item => `
                            <div class="journal-entry item">
                                <div class="text-orange-400 font-semibold">${item.name}</div>
                                <div class="text-white text-sm">${item.description || ''}</div>
                            </div>
                        `).join('') :
                        '<div class="text-gray-400 italic">No items discovered</div>'
                    }
                </div>
            </div>
        `;
    }

    // NPCs Tab
    if (activeTab === 'npcs') {
        const npcs = Object.values(gameData.journalNpcs || {});
        content += `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    <i class='ph-duotone ph-users'></i> NPCs & Relationships
                </h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${npcs.length > 0 ?
                        npcs.map(npc => `
                            <div class="journal-entry npc">
                                <div class="text-purple-400 font-semibold">${npc.name}</div>
                                <div class="text-white text-sm">${npc.description || ''}</div>
                                <div class="text-xs text-purple-300 mt-1">Relationship: <span class="font-bold">${npc.relationship_score ?? 'Unknown'}</span></div>
                            </div>
                        `).join('') :
                        '<div class="text-gray-400 italic">No NPCs discovered</div>'
                    }
                </div>
            </div>
        `;
    }

    // Bestiary Tab
    if (activeTab === 'bestiary') {
        // Load monsters from gameData.monsters or fallback to window.monstersData if available
        let monsters = [];
        if (gameData.monsters) {
            monsters = Object.values(gameData.monsters);
        } else if (typeof window !== 'undefined' && window.monstersData) {
            monsters = Object.values(window.monstersData);
        }
        content += `
            <div class="journal-section mb-6" style="height:70%;display:flex;flex-direction:column;">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    <i class='ph-duotone ph-paw-print'></i> Bestiary
                </h4>
                <div class="space-y-4 flex-1 overflow-y-auto" style="height:100%;">
                    ${monsters.length > 0 ?
                        monsters.map(monster => `
                            <div class="journal-entry bestiary bg-gray-800 rounded-lg p-3 border border-gray-700">
                                <div class="flex justify-between items-center mb-1">
                                    <div class="text-red-400 font-bold text-lg">${monster.name}</div>
                                    <span class="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded">Level ${monster.level}</span>
                                </div>
                                <div class="text-white text-sm mb-2">${monster.description || ''}</div>
                                <div class="flex flex-wrap gap-2 text-xs mb-2">
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">HP: ${monster.hitPoints}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">AC: ${monster.armorClass}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">STR: ${monster.attributes?.strength ?? '?'}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">DEX: ${monster.attributes?.dexterity ?? '?'}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">CON: ${monster.attributes?.constitution ?? '?'}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">INT: ${monster.attributes?.intelligence ?? '?'}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">WIS: ${monster.attributes?.wisdom ?? '?'}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">CHA: ${monster.attributes?.charisma ?? '?'}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-semibold text-purple-300">Abilities:</span>
                                    <ul class="list-disc list-inside ml-4">
                                        ${monster.abilities?.map(ability => `<li><span class="text-yellow-300 font-semibold">${ability.name}:</span> <span class="text-gray-200">${ability.description}</span></li>`).join('') || '<li class="text-gray-400">None</li>'}
                                    </ul>
                                </div>
                                <div class="mb-1">
                                    <span class="font-semibold text-blue-300">Resistances:</span> <span class="text-gray-200">${(monster.resistances || []).join(', ') || 'None'}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-semibold text-red-300">Weaknesses:</span> <span class="text-gray-200">${(monster.weaknesses || []).join(', ') || 'None'}</span>
                                </div>
                                <div>
                                    <span class="font-semibold text-green-300">Loot:</span> <span class="text-gray-200">${(monster.loot || []).map(l => `${l.item} (${Math.round(l.chance * 100)}%)`).join(', ') || 'None'}</span>
                                </div>
                            </div>
                        `).join('') :
                        '<div class="text-gray-400 italic">No monsters discovered</div>'
                    }
                </div>
            </div>
        `;
    }
    
    // Content based on active tab
    if (activeTab === 'all' || activeTab === 'quests') {
        // Ensure quests arrays exist and are arrays (handle corrupted save data)
        if (!gameData.player.quests.active || !Array.isArray(gameData.player.quests.active)) {
            gameData.player.quests.active = [];
        }
        if (!gameData.player.quests.completed || !Array.isArray(gameData.player.quests.completed)) {
            gameData.player.quests.completed = [];
        }
        
        const activeQuests = gameData.player.quests.active.filter(q => (q.text || q).toLowerCase().includes(searchQuery));
        const completedQuests = gameData.player.quests.completed.filter(q => (q.text || q).toLowerCase().includes(searchQuery));
        content += `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    📋 Active Quests
                </h4>
                <div class="space-y-2">
                    ${activeQuests.length > 0 ?
                        activeQuests.map(quest => {
                            const qid = quest.id || quest.text || quest;
                            const pinned = gameData.player.journalPins.has(qid);
                            const progress = quest.progress !== undefined ? quest.progress : null;
                            return `
                            <div class="journal-entry quest ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                                <div class="flex justify-between items-center mb-1">
                                    <div class="text-amber-300 font-semibold">Active</div>
                                    <div class="flex items-center gap-2">
                                        <button class="text-blue-400 text-xs" onclick="trackQuest('${qid}')">Track</button>
                                        <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="toggleJournalPin('${qid}')">${pinned ? '★' : '☆'}</button>
                                    </div>
                                </div>
                                <div class="text-white">${quest.text || quest}</div>
                                ${progress !== null ? `<div class="quest-progress"><div class="quest-progress-fill" style="width:${Math.round(progress * 100)}%"></div></div>` : ''}
                            </div>
                            `;
                        }).join('') :
                        '<div class="text-gray-400 italic">No active quests</div>'
                    }
                </div>
                
                <h4 class="font-cinzel text-lg text-white mb-3 mt-6 flex items-center gap-2">
                    ✅ Completed Quests
                </h4>
                <div class="space-y-2">
                    ${completedQuests.length > 0 ?
                        completedQuests.map(quest => {
                            const qid = quest.id || quest.text || quest;
                            const pinned = gameData.player.journalPins.has(qid);
                            return `
                            <div class="journal-entry quest completed ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                                <div class="flex justify-between items-center mb-1">
                                    <div class="text-green-300 font-semibold">Completed</div>
                                    <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="toggleJournalPin('${qid}')">${pinned ? '★' : '☆'}</button>
                                </div>
                                <div class="text-white">${quest.text || quest}</div>
                            </div>
                            `;
                        }).join('') :
                        '<div class="text-gray-400 italic">No completed quests</div>'
                    }
                </div>
            </div>
        `;
    }
    
    if (activeTab === 'all' || activeTab === 'lore') {
        const loreEntries = Array.from(gameData.player.lore).filter(l => l.toLowerCase().includes(searchQuery));
        content += `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    📚 Lore & Knowledge
                </h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${loreEntries.length > 0 ?
                        loreEntries.map(lore => {
                            const pinned = gameData.player.journalPins.has(lore);
                            return `
                            <div class="journal-entry lore ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                                <div class="flex justify-between items-center mb-1">
                                    <div class="text-blue-300 font-semibold">Knowledge</div>
                                    <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="toggleJournalPin('${lore}')">${pinned ? '★' : '☆'}</button>
                                </div>
                                <div class="text-white">${processJournalText(lore)}</div>
                            </div>
                            `;
                        }).join('') :
                        '<div class="text-gray-400 italic">No lore discovered</div>'
                    }
                </div>
            </div>
        `;
    }
    
    if (activeTab === 'all' || activeTab === 'rumors') {
        const rumorEntries = Array.from(gameData.player.rumors).filter(r => r.toLowerCase().includes(searchQuery));
        content += `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    🗣️ Rumors & Whispers
                </h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${rumorEntries.length > 0 ?
                        rumorEntries.map(rumor => {
                            const pinned = gameData.player.journalPins.has(rumor);
                            return `
                            <div class="journal-entry rumor ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                                <div class="flex justify-between items-center mb-1">
                                    <div class="text-purple-300 font-semibold">Rumor</div>
                                    <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="toggleJournalPin('${rumor}')">${pinned ? '★' : '☆'}</button>
                                </div>
                                <div class="text-white">${processJournalText(rumor)}</div>
                            </div>
                            `;
                        }).join('') :
                        '<div class="text-gray-400 italic">No rumors heard</div>'
                    }
                </div>
            </div>
        `;
    }
    
    content += '</div>';
    journalContentEl.innerHTML = content;
}

// Process journal text to add hyperlinks
function processJournalText(text) {
    // Convert text references to clickable hyperlinks
    text = text.replace(/\b(Griefwood|Jorn|Westwalker|M'ra Kaal|Scholar|Leonin|Aethermoon|Verdamoon|Umbralmoon|Convergence)\b/g, 
        '<span class="journal-link text-blue-400 hover:text-blue-300 cursor-pointer underline decoration-dotted" onclick="showQuickReference(\'$1\')">$1</span>');
    
    return text;
}

// Quick reference modal
function showQuickReference(term) {
    const references = {
        'Griefwood': 'A mysterious forest at the edge of the Frontier, known for its ancient secrets and dangerous wildlife.',
        'Jorn': 'A frontier trading post where travelers gather to share news and trade goods.',
        'Westwalker': 'Hardy frontier folk who make their living on the edge of civilization.',
        'M\'ra Kaal': 'The proud Leonin clan known for their spiritual connection and warrior traditions.',
        'Scholar': 'Learned individuals who study the mysteries of magic and ancient lore.',
        'Leonin': 'Cat-like humanoids with strong tribal traditions and spiritual beliefs.',
        'Aethermoon': 'The blue moon that governs magic and mystical energies.',
        'Verdamoon': 'The green moon that influences nature and healing.',
        'Umbralmoon': 'The dark moon associated with shadows and hidden knowledge.',
        'Convergence': 'The rare astronomical event when all three moons align.'
    };
    
    showModal('Quick Reference', references[term] || 'No reference information available.');
}

function showModal(title, content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('quick-reference-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quick-reference-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
        modal.innerHTML = `
            <div class="bg-gray-900 border-2 border-gray-600 rounded-lg p-6 max-w-md mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 id="modal-title" class="font-cinzel text-xl text-white"></h3>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div id="modal-content" class="text-gray-300"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-content').textContent = content;
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('quick-reference-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Keyboard shortcuts for enhanced experience
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Only handle shortcuts when not in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Panel shortcuts
        switch(event.key.toLowerCase()) {
            case 'c':
                if (!event.ctrlKey) openPanel('character-panel');
                break;
            case 'i':
                if (!event.ctrlKey) openPanel('inventory-panel');
                break;
            case 'j':
                if (!event.ctrlKey) openPanel('journal-panel');
                break;
            case 'c':
                if (!event.ctrlKey) openPanel('crafting-panel');
                break;
            case 's':
                if (!event.ctrlKey) openPanel('settings-panel');
                break;
            case 'escape':
                closeAllPanels();
                break;
        }
    });
}

// Crafting Workshop Functions
function renderCraftingWorkshop() {
    const craftingContent = document.getElementById('crafting-content');
    if (!craftingContent) return;


    // Clear previous content
    craftingContent.innerHTML = '';

    // Create main grid container
    const workshop = document.createElement('div');
    workshop.className = 'crafting-workshop grid grid-cols-1 lg:grid-cols-3 gap-6';
    workshop.style.height = '80%';
    workshop.style.minHeight = '400px';
    workshop.style.maxHeight = '80vh';

    // Helper to create a panel
    function createPanel(className, iconClass, title, contentId, placeholder) {
        const panel = document.createElement('div');
        panel.className = `${className} bg-gray-800 rounded-lg p-4 border border-gray-600`;
        panel.style.height = '85vh';
        panel.style.maxHeight = '85vh';
        panel.style.overflowY = 'auto';

        const h3 = document.createElement('h3');
        h3.className = 'font-cinzel text-xl text-white mb-4 flex items-center';
        h3.innerHTML = `<i class="ph-duotone ${iconClass} mr-2"></i>${title}`;
        panel.appendChild(h3);

        const contentDiv = document.createElement('div');
        contentDiv.id = contentId;
        contentDiv.className = contentId === 'category-list' ? 'space-y-2' : 'space-y-3';
        if (placeholder) {
            contentDiv.innerHTML = placeholder;
        }
        panel.appendChild(contentDiv);

        return panel;
    }

    // Create and append panels
    workshop.appendChild(createPanel('recipe-categories', 'ph-list', 'Recipe Categories', 'category-list'));
    workshop.appendChild(createPanel('recipe-list', 'ph-scroll', 'Available Recipes', 'recipe-list-content'));
    workshop.appendChild(createPanel(
        'crafting-details', 'ph-hammer', 'Crafting Details', 'crafting-details-content',
        `<p class="text-gray-400 text-center py-8">Select a recipe to view crafting details</p>`
    ));

    craftingContent.appendChild(workshop);

    populateCraftingCategories();
    populateRecipeList();
}

function populateCraftingCategories() {
    const categoryList = document.getElementById('category-list');
    if (!categoryList) return;

    const categories = craftingManager.getCategories();

    categoryList.innerHTML = categories.map(category => {
        const isActive = currentCraftingCategory === category;
        const categoryName = category === 'all' ? 'All Recipes' : 
                           category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
        
        return `
            <button class="category-btn w-full text-left px-3 py-2 rounded transition-colors
                ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
                onclick="selectCraftingCategory('${category}')">
                <i class="ph-duotone ${getCategoryIcon(category)} mr-2"></i>${categoryName}
            </button>
        `;
    }).join('');
}

function selectCraftingCategory(category) {
    currentCraftingCategory = category;
    populateCraftingCategories();
    populateRecipeList();
}

function populateRecipeList() {
    const recipeListContent = document.getElementById('recipe-list-content');
    if (!recipeListContent) return;

    const filteredRecipes = craftingManager.getRecipesByCategory(currentCraftingCategory);

    if (filteredRecipes.length === 0) {
        recipeListContent.innerHTML = '<p class="text-gray-400 text-center py-4">No recipes found in this category</p>';
        return;
    }

    recipeListContent.innerHTML = filteredRecipes.map(recipe => {
        const canCraft = craftingManager.canCraftRecipe(recipe.id);

        // Render skill badges
        const skillsBadges = Object.entries(recipe.requiredSkills || {})
            .map(([skill, level]) => `<span class="inline-block rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1 ${window.getSkillBadgeBorder(skill)} ${window.getSkillBadgeColor(skill)}">${skill.charAt(0).toUpperCase() + skill.slice(1)} ${level}</span>`)
            .join(' ');

        return `
            <div class="recipe-item bg-gray-700 rounded-lg p-3 border border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors
                ${canCraft ? 'border-green-500' : 'border-gray-600'}"
                onclick="selectRecipe('${recipe.id}')">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-cinzel text-white font-bold">${recipe.name}</h4>
                    <span class="text-xs px-2 py-1 rounded ${getDifficultyColor(recipe.difficulty)}">${recipe.difficulty}</span>
                </div>
                <p class="text-sm text-gray-300 mb-2">${recipe.description}</p>
                <div class="flex flex-wrap items-center text-xs mb-1">
                    ${skillsBadges || '<span class="text-gray-400">None</span>'}
                </div>
                <div class="flex justify-between items-center text-xs">
                    <span class="text-yellow-300">XP: ${recipe.experienceGained}</span>
                </div>
                ${!canCraft ? '<div class="text-red-400 text-xs mt-1">Missing requirements</div>' : ''}
            </div>
        `;
    }).join('');
}

function selectRecipe(recipeId) {
    currentSelectedRecipe = recipeId;
    displayRecipeDetails(recipeId);
}

function displayRecipeDetails(recipeId) {
    const detailsContent = document.getElementById('crafting-details-content');
    if (!detailsContent) return;

    const recipe = craftingManager.getRecipe(recipeId);
    if (!recipe) return;

    const canCraft = craftingManager.canCraftRecipe(recipeId);
    const successRate = craftingManager.calculateSuccessRate(recipe);
    const ingredients = craftingManager.getIngredientsList(recipe);
    const skills = craftingManager.getSkillRequirements(recipe);

    detailsContent.innerHTML = `
        <div class="recipe-details">
            <div class="mb-4">
                <h4 class="font-cinzel text-xl text-white mb-2">${recipe.name}</h4>
                <p class="text-gray-300 text-sm mb-3">${recipe.description}</p>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="text-blue-300">
                        <strong>Method:</strong> ${recipe.craftingMethod}
                    </div>
                    <div class="text-yellow-300">
                        <strong>Time:</strong> ${recipe.craftingTime}s
                    </div>
                    <div class="text-green-300">
                        <strong>Experience:</strong> ${recipe.experienceGained}
                    </div>
                    <div class="text-purple-300">
                        <strong>Success Rate:</strong> ${successRate}%
                    </div>
                </div>
            </div>

            <!-- Required Skills -->
            ${skills.length > 0 ? `
                <div class="mb-4">
                    <h5 class="font-cinzel text-white mb-2">Required Skills</h5>
                    <div class="flex flex-wrap gap-1">
                        ${skills.map(skill => `
                            <span class="inline-block rounded-full px-2 py-1 text-xs font-semibold ${window.getSkillBadgeBorder(skill.id)} ${window.getSkillBadgeColor(skill.id)} ${skill.hasSkill ? '' : 'opacity-60'}" title="${skill.displayName}: ${skill.playerLevel}/${skill.requiredLevel}">
                                ${skill.displayName} ${skill.requiredLevel}
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Required Tools -->
            ${recipe.requiredTools ? `
                <div class="mb-4">
                    <h5 class="font-cinzel text-white mb-2">Required Tools</h5>
                    <div class="space-y-1">
                        ${recipe.requiredTools.map(tool => `
                            <div class="text-sm text-blue-300">• ${tool.replace(/_/g, ' ').toUpperCase()}</div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Ingredients -->
            <div class="mb-4">
                <h5 class="font-cinzel text-white mb-2">Required Ingredients</h5>
                <div class="space-y-1">
                    ${ingredients.map(ingredient => `
                        <div class="flex justify-between text-sm ${ingredient.hasEnough ? 'text-green-300' : 'text-red-300'}">
                            <span>${ingredient.displayName}</span>
                            <span>${ingredient.playerQuantity}/${ingredient.quantity}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Results -->
            <div class="mb-4">
                <h5 class="font-cinzel text-white mb-2">Crafting Results</h5>
                <div class="space-y-1">
                    ${recipe.results.map(result => `
                        <div class="text-sm text-green-300">
                            • ${result.itemId.replace(/_/g, ' ').toUpperCase()} (${result.quantity}) - ${result.chance}%
                        </div>
                    `).join('')}
                    ${recipe.byproducts && recipe.byproducts.length > 0 ? `
                        <div class="text-sm text-blue-300 mt-2">
                            <strong>Possible Byproducts:</strong>
                            ${recipe.byproducts.map(bp => `
                                <div>• ${bp.itemId.replace(/_/g, ' ').toUpperCase()} (${bp.quantity}) - ${bp.chance}%</div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- Craft Button -->
            <button class="craft-btn w-full py-3 px-4 rounded-lg font-cinzel font-bold transition-colors
                ${canCraft ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}"
                ${canCraft ? `onclick="craftItem('${recipeId}')"` : 'disabled'}>
                ${canCraft ? 'Craft Item' : 'Cannot Craft'}
            </button>
        </div>
    `;
}

function craftItem(recipeId) {
    const success = craftingManager.craftItem(recipeId);
    
    // Refresh displays after crafting
    displayRecipeDetails(recipeId);
    populateRecipeList();
    
    // Refresh inventory if it's open
    if (document.getElementById('inventory-panel').style.display === 'block') {
        renderAdvancedInventory();
    }
}

// Global crafting state
let currentCraftingCategory = 'all';
let currentSelectedRecipe = null;

// Helper functions for crafting UI
function getCategoryIcon(category) {
    const icons = {
        'all': 'ph-stack',
        'metalworking': 'ph-fire',
        'weaponsmithing': 'ph-sword',
        'alchemy': 'ph-flask',
        'enchanting': 'ph-magic-wand',
        'leatherworking': 'ph-shield',
        'woodworking': 'ph-tree',
        'cooking': 'ph-cooking-pot'
    };
    return icons[category] || 'ph-wrench';
}

function getDifficultyColor(difficulty) {
    const colors = {
        'easy': 'bg-green-600 text-green-100',
        'medium': 'bg-yellow-600 text-yellow-100',
        'hard': 'bg-red-600 text-red-100',
        'master': 'bg-purple-600 text-purple-100'
    };
    return colors[difficulty] || 'bg-gray-600 text-gray-100';
}

// Effects Panel Functions
function updateEffectsPanel() {
    const effectsContent = document.getElementById('effects-content');
    if (!effectsContent) return;

    if (gameData.effects.active.length === 0) {
        effectsContent.innerHTML = `
            <div class="text-center text-gray-400 py-8">
                <i class="ph-duotone ph-sparkle text-4xl mb-4"></i>
                <p>No active effects</p>
            </div>
        `;
        return;
    }

    const effectsHTML = gameData.effects.active.map(effect => {
        const effectTemplate = effectsData[effect.id];
        if (!effectTemplate) return '';

        const timeRemaining = Math.max(0, effect.remaining);
        const totalDuration = effect.duration;
        const progressPercent = totalDuration > 0 ? ((totalDuration - timeRemaining) / totalDuration) * 100 : 0;
        
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const effectTypeClass = effect.type;
        const nameColorClass = effect.type === 'debuff' ? 'text-red-400' : 
                              effect.type === 'buff' ? 'text-blue-400' : 'text-yellow-400';

        return `
            <div class="effect-item ${effectTypeClass}">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-cinzel text-lg ${nameColorClass}">${effect.name}</h3>
                    <span class="effect-timer">${timeString}</span>
                </div>
                <p class="text-gray-300 text-sm mb-2">${effect.description}</p>
                ${totalDuration > 0 ? `
                    <div class="effect-progress-bar">
                        <div class="effect-progress-fill ${effectTypeClass}" style="width: ${progressPercent}%"></div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    effectsContent.innerHTML = effectsHTML;
}

// Enhanced updateDisplay function to include time and effects
function updateDisplay() {
    // Update date display
    if (dateEl) {
        dateEl.textContent = `${gameData.time.months[gameData.time.month]} ${gameData.time.day}, ${gameData.time.year} PA`;
    }
    
    // Update month description
    if (monthDescEl) {
        monthDescEl.textContent = gameData.time.monthDescriptions[gameData.time.month];
    }
    
    // Update time display
    updateTimeDisplay();
    
    // Update moon phases
    updateMoonPhases();
    
    // Update effects panel if open
    const effectsPanel = document.getElementById('effects-panel');
    if (effectsPanel && effectsPanel.classList.contains('open')) {
        updateEffectsPanel();
    }
    
    // Update time controls
    updateTimeControlDisplay();
    
    // Trigger auto-save occasionally (every 10 minutes of play time)
    if (typeof saveManager !== 'undefined') {
        const now = Date.now();
        if (!window.lastAutoSave) window.lastAutoSave = now;
        
        // Auto-save every 10 minutes (600,000 ms)
        if (now - window.lastAutoSave > 600000) {
            saveManager.autoSave();
            window.lastAutoSave = now;
        }
    }
}

// Activate item function for magical items
function activateItem(itemId) {
    const item = itemsData[itemId];
    if (!item || !item.effect) {
        showGameMessage('This item cannot be activated.', 'warning');
        return;
    }

    // Check if item has activatable property
    if (!item.properties || !item.properties.includes('activatable')) {
        showGameMessage('This item cannot be activated.', 'warning');
        return;
    }

    // Apply the effect
    const success = applyEffect(item.effect, item.name);
    if (success) {
        showGameMessage(`You activate the ${item.name}.`, 'success');
    } else {
        showGameMessage('Failed to activate the item.', 'failure');
    }
}

// Toggle pin status for journal entries
function toggleJournalPin(id) {
    if (gameData.player.journalPins.has(id)) {
        gameData.player.journalPins.delete(id);
    } else {
        gameData.player.journalPins.add(id);
    }
    renderJournal();
}

// Simulated quest tracking
function trackQuest(id) {
    showGameMessage(`Tracking quest: ${id}`, 'info');
}

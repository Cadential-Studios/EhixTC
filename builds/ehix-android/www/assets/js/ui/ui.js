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
    uiPanels.forEach(panel => {
        panel.style.display = 'none';
        panel.classList.remove('open');
    });
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
                <div class="space-y-2">
                    <button class="action-button w-full py-2 px-4 rounded" onclick="saveGame()">Save Game</button>
                    <div id="save-slots" class="space-y-2"></div>
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

// Journal Panel Rendering
function renderJournal(activeTab = 'all') {
    if (!journalContentEl) return;
    
    let content = '<div class="journal-container">';
    
    // Tab Navigation
    content += `
        <div class="journal-tabs mb-6">
            <div class="flex space-x-1 bg-gray-800 rounded-lg p-1">
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('all')">All</button>
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'quests' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('quests')">Quests</button>
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'lore' ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('lore')">Lore</button>
                <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'rumors' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="renderJournal('rumors')">Rumors</button>
            </div>
        </div>
    `;
    
    // Content based on active tab
    if (activeTab === 'all' || activeTab === 'quests') {
        content += `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    📋 Active Quests
                </h4>
                <div class="space-y-2">
                    ${gameData.player.quests.active.length > 0 ? 
                        gameData.player.quests.active.map(quest => `
                            <div class="quest-item bg-gray-800 p-3 rounded border-l-4 border-blue-500">
                                <div class="text-blue-300 font-semibold">Active</div>
                                <div class="text-white">${quest}</div>
                            </div>
                        `).join('') : 
                        '<div class="text-gray-400 italic">No active quests</div>'
                    }
                </div>
                
                <h4 class="font-cinzel text-lg text-white mb-3 mt-6 flex items-center gap-2">
                    ✅ Completed Quests
                </h4>
                <div class="space-y-2">
                    ${gameData.player.quests.completed.length > 0 ? 
                        gameData.player.quests.completed.map(quest => `
                            <div class="quest-item bg-gray-800 p-3 rounded border-l-4 border-green-500">
                                <div class="text-green-300 font-semibold">Completed</div>
                                <div class="text-white">${quest}</div>
                            </div>
                        `).join('') : 
                        '<div class="text-gray-400 italic">No completed quests</div>'
                    }
                </div>
            </div>
        `;
    }
    
    if (activeTab === 'all' || activeTab === 'lore') {
        content += `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    📚 Lore & Knowledge
                </h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${gameData.player.lore.size > 0 ? 
                        Array.from(gameData.player.lore).map(lore => `
                            <div class="lore-item bg-gray-800 p-3 rounded border-l-4 border-yellow-500">
                                <div class="text-yellow-300 font-semibold">Knowledge</div>
                                <div class="text-white">${processJournalText(lore)}</div>
                            </div>
                        `).join('') : 
                        '<div class="text-gray-400 italic">No lore discovered</div>'
                    }
                </div>
            </div>
        `;
    }
    
    if (activeTab === 'all' || activeTab === 'rumors') {
        content += `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    🗣️ Rumors & Whispers
                </h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${gameData.player.rumors.size > 0 ? 
                        Array.from(gameData.player.rumors).map(rumor => `
                            <div class="rumor-item bg-gray-800 p-3 rounded border-l-4 border-purple-500">
                                <div class="text-purple-300 font-semibold">Rumor</div>
                                <div class="text-white">${processJournalText(rumor)}</div>
                            </div>
                        `).join('') : 
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

    craftingContent.innerHTML = `
        <div class="crafting-workshop grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <!-- Recipe Categories -->
            <div class="recipe-categories bg-gray-800 rounded-lg p-4 border border-gray-600">
                <h3 class="font-cinzel text-xl text-white mb-4 flex items-center">
                    <i class="ph-duotone ph-list mr-2"></i>Recipe Categories
                </h3>
                <div id="category-list" class="space-y-2">
                    <!-- Categories will be populated here -->
                </div>
            </div>

            <!-- Recipe List -->
            <div class="recipe-list bg-gray-800 rounded-lg p-4 border border-gray-600">
                <h3 class="font-cinzel text-xl text-white mb-4 flex items-center">
                    <i class="ph-duotone ph-scroll mr-2"></i>Available Recipes
                </h3>
                <div id="recipe-list-content" class="space-y-3 max-h-96 overflow-y-auto">
                    <!-- Recipes will be populated here -->
                </div>
            </div>

            <!-- Crafting Details -->
            <div class="crafting-details bg-gray-800 rounded-lg p-4 border border-gray-600">
                <h3 class="font-cinzel text-xl text-white mb-4 flex items-center">
                    <i class="ph-duotone ph-hammer mr-2"></i>Crafting Details
                </h3>
                <div id="crafting-details-content">
                    <p class="text-gray-400 text-center py-8">Select a recipe to view crafting details</p>
                </div>
            </div>
        </div>
    `;

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
        const skillsText = Object.entries(recipe.requiredSkills || {})
            .map(([skill, level]) => `${skill} ${level}`)
            .join(', ');

        return `
            <div class="recipe-item bg-gray-700 rounded-lg p-3 border border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors
                ${canCraft ? 'border-green-500' : 'border-gray-600'}"
                onclick="selectRecipe('${recipe.id}')">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-cinzel text-white font-bold">${recipe.name}</h4>
                    <span class="text-xs px-2 py-1 rounded ${getDifficultyColor(recipe.difficulty)}">${recipe.difficulty}</span>
                </div>
                <p class="text-sm text-gray-300 mb-2">${recipe.description}</p>
                <div class="flex justify-between items-center text-xs">
                    <span class="text-blue-300">Skills: ${skillsText || 'None'}</span>
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
                    <div class="space-y-1">
                        ${skills.map(skill => `
                            <div class="flex justify-between text-sm ${skill.hasSkill ? 'text-green-300' : 'text-red-300'}">
                                <span>${skill.displayName}</span>
                                <span>${skill.playerLevel}/${skill.requiredLevel}</span>
                            </div>
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

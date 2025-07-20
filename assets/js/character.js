// Character System Module
// Edoria: The Triune Convergence - Character Management

// Skills System Functions
function getSkillModifier(skillName) {
    const ability = skillAbilityMap[skillName];
    const abilityMod = getAbilityModifier(ability);
    const skill = gameData.player.skills[skillName];
    
    let proficiencyMod = 0;
    if (skill.proficient) {
        proficiencyMod = gameData.player.proficiencyBonus;
        if (skill.expertise) {
            proficiencyMod *= 2; // Expertise doubles proficiency bonus
        }
    }
    
    return abilityMod + proficiencyMod;
}

function getSkillBreakdown(skillName) {
    const ability = skillAbilityMap[skillName];
    const abilityMod = getAbilityModifier(ability);
    const skill = gameData.player.skills[skillName];
    
    let proficiencyMod = 0;
    if (skill.proficient) {
        proficiencyMod = gameData.player.proficiencyBonus;
        if (skill.expertise) {
            proficiencyMod *= 2;
        }
    }
    
    return {
        ability: ability,
        abilityModifier: abilityMod,
        proficiencyBonus: proficiencyMod,
        total: abilityMod + proficiencyMod,
        isProficient: skill.proficient,
        hasExpertise: skill.expertise
    };
}

// Equipment System Functions
function equipItem(itemId, slot = null) {
    const item = itemsData[itemId];
    if (!item) return false;
    
    // Check if player has this item in inventory
    const hasItem = gameData.player.inventory.some(invItem => 
        typeof invItem === 'string' ? invItem === itemId : invItem.id === itemId
    );
    
    if (!hasItem) {
        showGameMessage("You don't have this item in your inventory!", 'warning');
        return false;
    }
    
    // Determine slot if not specified
    if (!slot) {
        slot = item.slot;
    }
    
    // Handle special cases for rings
    if (slot === 'finger') {
        slot = gameData.player.equipment.finger1 ? 'finger2' : 'finger1';
    }
    
    // Check if slot is valid
    if (!gameData.player.equipment.hasOwnProperty(slot) || slot === 'none') {
        return false;
    }

    // Capture old stats for animation
    const oldStats = { ...gameData.player.stats };
    
    // Unequip current item in slot
    if (gameData.player.equipment[slot]) {
        unequipItem(slot);
    }
    
    // Equip new item (but keep it in inventory)
    gameData.player.equipment[slot] = itemId;
    
    // Recalculate stats
    recalculateStats();
    
    // Show stat change animation if item has stat bonuses
    if (item.statBonus && typeof showStatBonusAnimation === 'function') {
        // Calculate actual stat changes that happened
        const statChanges = {};
        Object.keys(item.statBonus).forEach(stat => {
            const oldValue = oldStats[stat] || 0;
            const newValue = gameData.player.stats[stat] || 0;
            const change = newValue - oldValue;
            if (change !== 0) {
                statChanges[stat] = change;
            }
        });
        
        if (Object.keys(statChanges).length > 0) {
            showStatBonusAnimation(statChanges, item.name, true);
        }
    }
    
    showGameMessage(`Equipped ${item.name}!`, 'success');
    return true;
}

function unequipItem(slot) {
    const itemId = gameData.player.equipment[slot];
    if (!itemId) return false;
    
    const item = itemsData[itemId];
    
    // Capture old stats for animation
    const oldStats = { ...gameData.player.stats };
    
    // Remove from equipment (item stays in inventory)
    gameData.player.equipment[slot] = null;
    
    // Recalculate stats
    recalculateStats();
    
    // Show stat change animation if item had stat bonuses
    if (item && item.statBonus && typeof showStatBonusAnimation === 'function') {
        // Calculate actual stat changes that happened
        const statChanges = {};
        Object.keys(item.statBonus).forEach(stat => {
            const oldValue = oldStats[stat] || 0;
            const newValue = gameData.player.stats[stat] || 0;
            const change = newValue - oldValue;
            if (change !== 0) {
                statChanges[stat] = change;
            }
        });
        
        if (Object.keys(statChanges).length > 0) {
            showStatBonusAnimation(statChanges, item.name, false);
        }
    }
    
    if (item) {
        showGameMessage(`Unequipped ${item.name}!`, 'info');
    }
    return true;
}

function recalculateStats() {
    // Base stats from character origin
    let totalStats = { ...gameData.player.stats };
    let totalAC = 10 + getAbilityModifier('dexterity');
    
    // Apply equipment bonuses
    Object.values(gameData.player.equipment).forEach(itemId => {
        if (!itemId) return;
        const item = itemsData[itemId];
        if (!item) return;
        
        // Apply stat bonuses
        if (item.statBonus) {
            Object.entries(item.statBonus).forEach(([stat, bonus]) => {
                if (totalStats[stat]) {
                    totalStats[stat] += bonus;
                }
            });
        }
        
        // Apply armor class
        if (item.armorClass) {
            if (item.type === 'armor' && (item.subtype === 'light' || item.subtype === 'medium' || item.subtype === 'heavy' || item.subtype === 'clothing')) {
                // Base armor replaces base AC
                totalAC = item.armorClass + (item.maxDexMod ? Math.min(getAbilityModifier('dexterity'), item.maxDexMod) : getAbilityModifier('dexterity'));
            } else {
                // Shields and accessories add to AC
                totalAC += item.armorClass;
            }
        }
    });
    
    // Update derived stats
    gameData.player.derivedStats.armorClass = totalAC;
    gameData.player.derivedStats.maxHealth = 20 + (getAbilityModifier('constitution') * gameData.player.level);
    gameData.player.derivedStats.maxMana = 10 + (getAbilityModifier('intelligence') * gameData.player.level);
    gameData.player.derivedStats.carryCapacity = 150 + (getAbilityModifier('strength') * 15);
    
    // Ensure current health/mana don't exceed maximums
    gameData.player.derivedStats.health = Math.min(gameData.player.derivedStats.health, gameData.player.derivedStats.maxHealth);
    gameData.player.derivedStats.mana = Math.min(gameData.player.derivedStats.mana, gameData.player.derivedStats.maxMana);
}

function calculateDerivedStats() {
    recalculateStats();
}

function getTotalWeight() {
    let weight = 0;
    
    // Inventory weight
    gameData.player.inventory.forEach(item => {
        const itemId = typeof item === 'string' ? item : item.id;
        const itemData = itemsData[itemId];
        if (itemData) {
            const quantity = typeof item === 'string' ? 1 : (item.quantity || 1);
            weight += (itemData.weight || 0) * quantity;
        }
    });
    
    // Equipment weight
    Object.values(gameData.player.equipment).forEach(itemId => {
        if (itemId) {
            const item = itemsData[itemId];
            if (item) {
                weight += item.weight || 0;
            }
        }
    });
    
    return weight;
}

// Experience and Leveling System
function gainExperience(amount) {
    gameData.player.experience += amount;
    showFloatingText(`+${amount} XP`, 'purple');
    
    // Check for level up
    if (gameData.player.experience >= gameData.player.experienceToNext) {
        levelUp();
    }
    
    // Update character sheet if open
    if (typeof renderCharacterSheet === 'function') {
        renderCharacterSheet();
    }
}

function levelUp() {
    const oldLevel = gameData.player.level;
    gameData.player.level++;
    
    // Calculate new experience requirement (using D&D 5e style progression)
    const experienceTable = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000];
    gameData.player.experienceToNext = experienceTable[gameData.player.level] || experienceTable[experienceTable.length - 1] * 2;
    
    // Update proficiency bonus (every 4 levels)
    gameData.player.proficiencyBonus = Math.ceil(gameData.player.level / 4) + 1;
    
    // Recalculate derived stats
    calculateDerivedStats();
    
    // Show level up notification
    showLevelUpModal(oldLevel, gameData.player.level);
    showFloatingText(`Level Up! Now Level ${gameData.player.level}`, 'gold');
}

function showLevelUpModal(oldLevel, newLevel) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.style.zIndex = '9999';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-gradient-to-br from-yellow-900 to-orange-900 rounded-lg p-8 max-w-md w-full mx-4 border-4 border-yellow-500 shadow-2xl text-center';
    
    modalContent.innerHTML = `
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="font-cinzel text-3xl text-yellow-300 mb-4">Level Up!</h2>
        <div class="text-white text-xl mb-4">
            Level ${oldLevel} → Level <span class="text-yellow-300 font-bold">${newLevel}</span>
        </div>
        <div class="space-y-2 text-sm text-yellow-100 mb-6">
            <div>• Health and Mana increased</div>
            <div>• Proficiency bonus: +${gameData.player.proficiencyBonus}</div>
            <div>• New abilities may be available</div>
        </div>
        <button onclick="this.closest('.fixed').remove()" 
                class="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
            Continue Adventure
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Auto-close after 10 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 10000);
}

// Character Sheet Rendering
function renderCharacterSheet() {
    const characterContentEl = document.getElementById('character-content');
    if (!characterContentEl) return;
    
    const player = gameData.player;
    const healthPercent = (player.derivedStats.health / player.derivedStats.maxHealth) * 100;
    const manaPercent = (player.derivedStats.mana / player.derivedStats.maxMana) * 100;
    const xpPercent = (player.experience / player.experienceToNext) * 100;
    
    const content = `
        <div class="character-sheet space-y-6">
            <!-- Character Header -->
            <div class="character-header bg-gray-800 rounded-lg p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-cinzel text-2xl text-white mb-1">${player.name || 'Adventurer'}</h3>
                        <p class="text-gray-400">${capitalizeFirst(player.origin || 'Unknown Origin')} • Level ${player.level}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-purple-400 text-sm">Experience</div>
                        <div class="text-white font-bold">${player.experience} / ${player.experienceToNext}</div>
                        <div class="w-32 h-2 bg-gray-700 rounded-full mt-1">
                            <div class="h-full bg-purple-600 rounded-full transition-all duration-300" style="width: ${xpPercent}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Vital Statistics -->
            <div class="vital-stats grid grid-cols-2 gap-4">
                <div class="stat-card bg-gray-800 rounded-lg p-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-red-400 font-semibold">Health</span>
                        <span class="text-white font-bold">${player.derivedStats.health} / ${player.derivedStats.maxHealth}</span>
                    </div>
                    <div class="w-full h-3 bg-gray-700 rounded-full">
                        <div class="h-full bg-red-600 rounded-full transition-all duration-300" style="width: ${healthPercent}%"></div>
                    </div>
                </div>
                
                <div class="stat-card bg-gray-800 rounded-lg p-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-blue-400 font-semibold">Mana</span>
                        <span class="text-white font-bold">${player.derivedStats.mana} / ${player.derivedStats.maxMana}</span>
                    </div>
                    <div class="w-full h-3 bg-gray-700 rounded-full">
                        <div class="h-full bg-blue-600 rounded-full transition-all duration-300" style="width: ${manaPercent}%"></div>
                    </div>
                </div>
            </div>
            
            <!-- Core Stats -->
            <div class="core-stats bg-gray-800 rounded-lg p-4">
                <h4 class="font-cinzel text-lg text-white mb-3">Core Attributes</h4>
                <div class="grid grid-cols-3 gap-4">
                    ${Object.entries(player.stats).map(([stat, value]) => {
                        const modifier = getAbilityModifier(value);
                        return `
                            <div class="stat-item text-center p-2 bg-gray-700 rounded">
                                <div class="text-gray-400 text-xs uppercase">${stat}</div>
                                <div class="text-white text-xl font-bold">${value}</div>
                                <div class="text-gray-500 text-sm">${modifier >= 0 ? '+' : ''}${modifier}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Armor Class:</span>
                        <span class="text-white font-bold">${player.derivedStats.armorClass}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Proficiency:</span>
                        <span class="text-white font-bold">+${player.proficiencyBonus}</span>
                    </div>
                </div>
            </div>
            
            <!-- Skills -->
            <div class="skills bg-gray-800 rounded-lg p-4">
                <h4 class="font-cinzel text-lg text-white mb-3">Skills</h4>
                <div class="space-y-1 max-h-48 overflow-y-auto">
                    ${Object.entries(player.skills).map(([skillName, skill]) => {
                        const breakdown = getSkillBreakdown(skillName);
                        const displayName = skillDisplayNames[skillName];
                        return `
                            <div class="skill-item flex justify-between items-center py-1 px-2 rounded hover:bg-gray-700 cursor-pointer"
                                 onclick="triggerManualSkillCheck('${skillName}')"
                                 title="Click to make a ${displayName} check">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm ${skill.proficient ? 'text-yellow-400' : 'text-gray-400'}">${skill.proficient ? '●' : '○'}</span>
                                    <span class="text-white">${displayName}</span>
                                    ${skill.expertise ? '<span class="text-purple-400 text-xs">★</span>' : ''}
                                </div>
                                <span class="text-gray-300 font-mono text-sm">${breakdown.total >= 0 ? '+' : ''}${breakdown.total}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="mt-2 text-xs text-gray-500">
                    ● Proficient | ○ Not Proficient | ★ Expertise | Click skill to make a check
                </div>
            </div>
        </div>
    `;
    
    characterContentEl.innerHTML = content;
}

// Auto-equip starting gear
function autoEquipStartingGear() {
    // Try to equip basic starting items if they exist in inventory
    const startingGear = {
        'iron_sword': 'mainhand',
        'leather_armor': 'chest',
        'wooden_shield': 'offhand'
    };
    
    Object.entries(startingGear).forEach(([itemId, slot]) => {
        if (gameData.player.inventory.includes(itemId)) {
            equipItem(itemId, slot);
        }
    });
}

// Inventory rendering function
function renderInventory() {
    if (!inventoryContentEl) return;
    
    inventoryContentEl.innerHTML = `
        <div class="inventory-container grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Equipment Panel -->
            <div class="equipment-panel">
                <h3 class="font-cinzel text-xl text-yellow-400 mb-4 border-b border-yellow-600 pb-2">
                    <i class="ph-duotone ph-sword"></i> Equipment
                </h3>
                <div class="equipment-grid bg-gray-800 rounded-lg p-4">
                    <div class="grid grid-cols-3 gap-2 mb-4">
                        <div></div>
                        <div class="equipment-slot" data-slot="head">
                            <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center">
                                ${gameData.player.equipment.head ? getItemName(gameData.player.equipment.head) : '👑 Head'}
                            </div>
                        </div>
                        <div></div>
                        
                        <div class="equipment-slot" data-slot="mainhand">
                            <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center">
                                ${gameData.player.equipment.mainhand ? getItemName(gameData.player.equipment.mainhand) : '<i class="ph-duotone ph-sword"></i> Main Hand'}
                            </div>
                        </div>
                        <div class="equipment-slot" data-slot="chest">
                            <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center">
                                ${gameData.player.equipment.chest ? getItemName(gameData.player.equipment.chest) : '👕 Chest'}
                            </div>
                        </div>
                        <div class="equipment-slot" data-slot="offhand">
                            <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center">
                                ${gameData.player.equipment.offhand ? getItemName(gameData.player.equipment.offhand) : '<i class="ph-duotone ph-shield"></i> Off Hand'}
                            </div>
                        </div>
                        
                        <div class="equipment-slot" data-slot="finger1">
                            <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center">
                                ${gameData.player.equipment.finger1 ? getItemName(gameData.player.equipment.finger1) : '💍 Ring 1'}
                            </div>
                        </div>
                        <div class="equipment-slot" data-slot="neck">
                            <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center">
                                ${gameData.player.equipment.neck ? getItemName(gameData.player.equipment.neck) : '📿 Neck'}
                            </div>
                        </div>
                        <div class="equipment-slot" data-slot="finger2">
                            <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center">
                                ${gameData.player.equipment.finger2 ? getItemName(gameData.player.equipment.finger2) : '💍 Ring 2'}
                            </div>
                        </div>
                        
                        <div></div>
                        <div class="equipment-slot" data-slot="feet">
                            <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center">
                                ${gameData.player.equipment.feet ? getItemName(gameData.player.equipment.feet) : '👢 Feet'}
                            </div>
                        </div>
                        <div></div>
                    </div>
                    
                    <!-- Character Stats Summary -->
                    <div class="stats-summary bg-gray-700 rounded-lg p-3 mt-4">
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div>AC: <span class="text-blue-400">${gameData.player.derivedStats.armorClass}</span></div>
                            <div>Weight: <span class="text-yellow-400">${getTotalWeight().toFixed(1)}/${gameData.player.derivedStats.carryCapacity}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Inventory Panel -->
            <div class="inventory-panel">
                <h3 class="font-cinzel text-xl text-green-400 mb-4 border-b border-green-600 pb-2">
                    🎒 Inventory
                </h3>
                <div class="inventory-grid bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                    ${renderInventoryItems()}
                </div>
            </div>
        </div>
    `;
    
    // Add click handlers for equipment slots
    inventoryContentEl.querySelectorAll('.equipment-slot').forEach(slot => {
        slot.addEventListener('click', () => {
            const slotName = slot.dataset.slot;
            if (gameData.player.equipment[slotName]) {
                unequipItem(slotName);
                renderInventory(); // Refresh display
            }
        });
    });
}

function renderInventoryItems() {
    if (!gameData.player.inventory || gameData.player.inventory.length === 0) {
        return '<p class="text-gray-400 text-center py-8">Your inventory is empty.</p>';
    }
    
    // Group items by type
    const groupedItems = {};
    gameData.player.inventory.forEach(item => {
        const itemId = typeof item === 'string' ? item : item.id;
        const quantity = typeof item === 'string' ? 1 : (item.quantity || 1);
        
        if (groupedItems[itemId]) {
            groupedItems[itemId].quantity += quantity;
        } else {
            groupedItems[itemId] = { quantity, data: itemsData[itemId] || { name: itemId } };
        }
    });
    
    return Object.entries(groupedItems).map(([itemId, itemInfo]) => {
        const item = itemInfo.data;
        const quantity = itemInfo.quantity;
        const rarityColor = getRarityColor(item.rarity);
        
        return `
            <div class="inventory-item bg-gray-700 border-2 ${rarityColor} rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-600 transition-colors"
                 onclick="handleItemClick('${itemId}')">
                <div class="flex justify-between items-center">
                    <span class="font-semibold text-white">${item.name || itemId}</span>
                    ${quantity > 1 ? `<span class="quantity-badge bg-blue-600 text-white px-2 py-1 rounded text-sm">${quantity}</span>` : ''}
                </div>
                <div class="text-gray-300 text-sm mt-1">${item.description || 'No description available.'}</div>
                ${item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory' ? 
                    `<button class="equip-btn bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm mt-2"
                             onclick="event.stopPropagation(); equipItem('${itemId}'); renderInventory();">
                        Equip
                    </button>` : ''}
                ${item.type === 'consumable' ? 
                    `<button class="use-btn bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm mt-2"
                             onclick="event.stopPropagation(); useConsumableItem('${itemId}'); renderInventory();">
                        Use
                    </button>` : ''}
            </div>
        `;
    }).join('');
}

function getItemName(itemId) {
    const item = itemsData[itemId];
    return item ? item.name : itemId;
}

function getRarityColor(rarity) {
    switch(rarity) {
        case 'common': return 'border-gray-500';
        case 'uncommon': return 'border-green-500';
        case 'rare': return 'border-blue-500';
        case 'epic': return 'border-purple-500';
        case 'legendary': return 'border-yellow-500';
        default: return 'border-gray-500';
    }
}

function handleItemClick(itemId) {
    const item = itemsData[itemId];
    if (item) {
        showModal(item.name, item.description || 'No description available.');
    }
}

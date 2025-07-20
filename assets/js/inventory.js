// Advanced Inventory System
// Edoria: The Triune Convergence - Enhanced Inventory Management
// TASK 24: Advanced Inventory System Implementation

class InventoryManager {
    constructor() {
        this.searchTerm = '';
        this.activeFilters = {
            type: 'all',
            rarity: 'all',
            usability: 'all',
            slot: 'all'
        };
        this.sortCriteria = {
            field: 'name',
            direction: 'asc'
        };
        this.isDetailModalOpen = false;
    }

    // Main inventory rendering function
    renderAdvancedInventory() {
        if (!inventoryContentEl) return;

        inventoryContentEl.innerHTML = `
            <div class="advanced-inventory-container">
                <!-- Inventory Header with Search and Controls -->
                <div class="inventory-header bg-gray-800 rounded-lg p-4 mb-4">
                    <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <!-- Search Bar -->
                        <div class="search-container flex-1 max-w-md">
                            <div class="relative">
                                <input type="text" 
                                       id="inventory-search" 
                                       placeholder="Search items..." 
                                       value="${this.searchTerm}"
                                       class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500">
                                <i class="ph-duotone ph-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            </div>
                        </div>
                        
                        <!-- Filter Controls -->
                        <div class="filter-controls flex gap-2 flex-wrap">
                            <select id="type-filter" class="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                                <option value="all">All Types</option>
                                <option value="weapon">Weapons</option>
                                <option value="armor">Armor</option>
                                <option value="consumable">Consumables</option>
                                <option value="tool">Tools</option>
                                <option value="quest">Quest Items</option>
                                <option value="misc">Miscellaneous</option>
                            </select>
                            
                            <select id="rarity-filter" class="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                                <option value="all">All Rarities</option>
                                <option value="common">Common</option>
                                <option value="uncommon">Uncommon</option>
                                <option value="rare">Rare</option>
                                <option value="epic">Epic</option>
                                <option value="legendary">Legendary</option>
                            </select>
                            
                            <select id="sort-field" class="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                                <option value="name">Name</option>
                                <option value="type">Type</option>
                                <option value="rarity">Rarity</option>
                                <option value="value">Value</option>
                                <option value="weight">Weight</option>
                            </select>
                            
                            <button id="sort-direction" 
                                    class="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm hover:bg-gray-600">
                                <i class="ph-duotone ${this.sortCriteria.direction === 'asc' ? 'ph-sort-ascending' : 'ph-sort-descending'}"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Quick Stats -->
                    <div class="inventory-stats mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div class="stat-item bg-gray-700 rounded px-3 py-2">
                            <span class="text-gray-400">Items:</span>
                            <span class="text-white ml-2">${this.getFilteredItems().length}/${gameData.player.inventory.length}</span>
                        </div>
                        <div class="stat-item bg-gray-700 rounded px-3 py-2">
                            <span class="text-gray-400">Weight:</span>
                            <span class="text-yellow-400 ml-2">${getTotalWeight().toFixed(1)}/${gameData.player.derivedStats.carryCapacity}</span>
                        </div>
                        <div class="stat-item bg-gray-700 rounded px-3 py-2">
                            <span class="text-gray-400">Value:</span>
                            <span class="text-green-400 ml-2">${this.getTotalValue()} gold</span>
                        </div>
                        <div class="stat-item bg-gray-700 rounded px-3 py-2">
                            <span class="text-gray-400">Free Slots:</span>
                            <span class="text-blue-400 ml-2">${this.getFreeSlots()}</span>
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="inventory-main grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <!-- Equipment Panel -->
                    <div class="equipment-section">
                        <h3 class="font-cinzel text-xl text-yellow-400 mb-4 border-b border-yellow-600 pb-2">
                            <i class="ph-duotone ph-sword"></i> Equipment
                        </h3>
                        ${this.renderEquipmentPanel()}
                    </div>
                    
                    <!-- Inventory Grid -->
                    <div class="inventory-section xl:col-span-2">
                        <h3 class="font-cinzel text-xl text-green-400 mb-4 border-b border-green-600 pb-2">
                            <i class="ph-duotone ph-backpack"></i> Inventory
                        </h3>
                        <div class="inventory-grid bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                            ${this.renderInventoryGrid()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.updateFilterValues();
    }

    // Render equipment panel
    renderEquipmentPanel() {
        return `
            <div class="equipment-grid bg-gray-800 rounded-lg p-4">
                <div class="grid grid-cols-3 gap-2 mb-4">
                    <div></div>
                    <div class="equipment-slot" data-slot="head">
                        <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center hover:bg-gray-600 cursor-pointer transition-colors">
                            ${gameData.player.equipment.head ? this.renderEquippedItem('head') : '<i class="ph-duotone ph-crown text-gray-400"></i><br><span class="text-xs text-gray-400">Head</span>'}
                        </div>
                    </div>
                    <div></div>
                    
                    <div class="equipment-slot" data-slot="mainhand">
                        <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center hover:bg-gray-600 cursor-pointer transition-colors">
                            ${gameData.player.equipment.mainhand ? this.renderEquippedItem('mainhand') : '<i class="ph-duotone ph-sword text-gray-400"></i><br><span class="text-xs text-gray-400">Main Hand</span>'}
                        </div>
                    </div>
                    <div class="equipment-slot" data-slot="chest">
                        <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center hover:bg-gray-600 cursor-pointer transition-colors">
                            ${gameData.player.equipment.chest ? this.renderEquippedItem('chest') : '<i class="ph-duotone ph-t-shirt text-gray-400"></i><br><span class="text-xs text-gray-400">Chest</span>'}
                        </div>
                    </div>
                    <div class="equipment-slot" data-slot="offhand">
                        <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center hover:bg-gray-600 cursor-pointer transition-colors">
                            ${gameData.player.equipment.offhand ? this.renderEquippedItem('offhand') : '<i class="ph-duotone ph-shield text-gray-400"></i><br><span class="text-xs text-gray-400">Off Hand</span>'}
                        </div>
                    </div>
                    
                    <div class="equipment-slot" data-slot="finger1">
                        <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center hover:bg-gray-600 cursor-pointer transition-colors">
                            ${gameData.player.equipment.finger1 ? this.renderEquippedItem('finger1') : '<i class="ph-duotone ph-ring text-gray-400"></i><br><span class="text-xs text-gray-400">Ring 1</span>'}
                        </div>
                    </div>
                    <div class="equipment-slot" data-slot="neck">
                        <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center hover:bg-gray-600 cursor-pointer transition-colors">
                            ${gameData.player.equipment.neck ? this.renderEquippedItem('neck') : '<i class="ph-duotone ph-necklace text-gray-400"></i><br><span class="text-xs text-gray-400">Neck</span>'}
                        </div>
                    </div>
                    <div class="equipment-slot" data-slot="finger2">
                        <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center hover:bg-gray-600 cursor-pointer transition-colors">
                            ${gameData.player.equipment.finger2 ? this.renderEquippedItem('finger2') : '<i class="ph-duotone ph-ring text-gray-400"></i><br><span class="text-xs text-gray-400">Ring 2</span>'}
                        </div>
                    </div>
                    
                    <div></div>
                    <div class="equipment-slot" data-slot="feet">
                        <div class="slot-content bg-gray-700 border-2 border-gray-600 rounded-lg p-4 text-center hover:bg-gray-600 cursor-pointer transition-colors">
                            ${gameData.player.equipment.feet ? this.renderEquippedItem('feet') : '<i class="ph-duotone ph-sneaker text-gray-400"></i><br><span class="text-xs text-gray-400">Feet</span>'}
                        </div>
                    </div>
                    <div></div>
                </div>
                
                <!-- Character Stats Summary -->
                <div class="stats-summary bg-gray-700 rounded-lg p-3 mt-4">
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        <div class="text-center">
                            <span class="text-gray-400">Armor Class</span>
                            <div class="text-blue-400 text-lg font-bold">${gameData.player.derivedStats.armorClass}</div>
                        </div>
                        <div class="text-center">
                            <span class="text-gray-400">Encumbrance</span>
                            <div class="text-yellow-400 text-lg font-bold">${Math.round((getTotalWeight() / gameData.player.derivedStats.carryCapacity) * 100)}%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render equipped item with rarity colors
    renderEquippedItem(slot) {
        const itemId = gameData.player.equipment[slot];
        const item = itemsData[itemId];
        if (!item) return `<span class="text-red-400">Unknown Item</span>`;
        
        const rarityColor = this.getRarityBorderColor(item.rarity);
        const rarityText = this.getRarityTextColor(item.rarity);
        
        return `
            <div class="equipped-item-display">
                <div class="text-xs ${rarityText} font-semibold mb-1">${item.name}</div>
                <div class="text-xs text-gray-400">${item.type}</div>
            </div>
        `;
    }

    // Get filtered and sorted items
    getFilteredItems() {
        if (!gameData.player.inventory) return [];

        // Group items by ID and count quantities
        const groupedItems = {};
        gameData.player.inventory.forEach(item => {
            const itemId = typeof item === 'string' ? item : item.id;
            const quantity = typeof item === 'string' ? 1 : (item.quantity || 1);
            
            if (groupedItems[itemId]) {
                groupedItems[itemId].quantity += quantity;
            } else {
                const itemData = itemsData[itemId] || { 
                    name: itemId, 
                    type: 'misc', 
                    rarity: 'common',
                    description: 'Unknown item',
                    value: 0,
                    weight: 0
                };
                groupedItems[itemId] = { 
                    id: itemId,
                    quantity, 
                    data: itemData 
                };
            }
        });

        let filteredItems = Object.values(groupedItems);

        // Apply search filter
        if (this.searchTerm) {
            const searchLower = this.searchTerm.toLowerCase();
            filteredItems = filteredItems.filter(item => 
                item.data.name.toLowerCase().includes(searchLower) ||
                item.data.description.toLowerCase().includes(searchLower) ||
                item.data.type.toLowerCase().includes(searchLower)
            );
        }

        // Apply type filter
        if (this.activeFilters.type !== 'all') {
            filteredItems = filteredItems.filter(item => item.data.type === this.activeFilters.type);
        }

        // Apply rarity filter
        if (this.activeFilters.rarity !== 'all') {
            filteredItems = filteredItems.filter(item => item.data.rarity === this.activeFilters.rarity);
        }

        // Apply usability filter
        if (this.activeFilters.usability !== 'all') {
            filteredItems = filteredItems.filter(item => {
                if (this.activeFilters.usability === 'usable') {
                    return this.canUseItem(item.data);
                } else {
                    return !this.canUseItem(item.data);
                }
            });
        }

        // Apply sorting
        filteredItems.sort((a, b) => {
            let valueA, valueB;
            
            switch (this.sortCriteria.field) {
                case 'name':
                    valueA = a.data.name.toLowerCase();
                    valueB = b.data.name.toLowerCase();
                    break;
                case 'type':
                    valueA = a.data.type;
                    valueB = b.data.type;
                    break;
                case 'rarity':
                    const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
                    valueA = rarityOrder[a.data.rarity] || 0;
                    valueB = rarityOrder[b.data.rarity] || 0;
                    break;
                case 'value':
                    valueA = a.data.value || 0;
                    valueB = b.data.value || 0;
                    break;
                case 'weight':
                    valueA = a.data.weight || 0;
                    valueB = b.data.weight || 0;
                    break;
                default:
                    valueA = a.data.name.toLowerCase();
                    valueB = b.data.name.toLowerCase();
            }

            if (valueA < valueB) return this.sortCriteria.direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortCriteria.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filteredItems;
    }

    // Render inventory grid with filtered items
    renderInventoryGrid() {
        const filteredItems = this.getFilteredItems();
        
        if (filteredItems.length === 0) {
            const hasFilters = this.searchTerm || 
                             this.activeFilters.type !== 'all' || 
                             this.activeFilters.rarity !== 'all' || 
                             this.activeFilters.usability !== 'all';
                             
            if (hasFilters) {
                return `
                    <div class="text-center py-8">
                        <i class="ph-duotone ph-magnifying-glass text-gray-400 text-4xl mb-4"></i>
                        <p class="text-gray-400">No items found matching your search criteria.</p>
                        <button onclick="inventoryManager.clearFilters()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                            Clear Filters
                        </button>
                    </div>
                `;
            } else {
                return `
                    <div class="text-center py-8">
                        <i class="ph-duotone ph-backpack text-gray-400 text-4xl mb-4"></i>
                        <p class="text-gray-400">Your inventory is empty.</p>
                    </div>
                `;
            }
        }

        return filteredItems.map(item => this.renderInventoryItem(item)).join('');
    }

    // Render individual inventory item
    renderInventoryItem(item) {
        const rarityBorderColor = this.getRarityBorderColor(item.data.rarity);
        const rarityTextColor = this.getRarityTextColor(item.data.rarity);
        const canUse = this.canUseItem(item.data);
        const isEquippable = item.data.slot && item.data.slot !== 'none';
        
        return `
            <div class="inventory-item bg-gray-700 border-2 ${rarityBorderColor} rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-600 transition-all duration-200 ${!canUse ? 'opacity-60' : ''}"
                 onclick="inventoryManager.openItemModal('${item.id}')">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span class="font-semibold ${rarityTextColor}">${item.data.name}</span>
                            ${item.quantity > 1 ? `<span class="quantity-badge bg-blue-600 text-white px-2 py-1 rounded text-xs">${item.quantity}</span>` : ''}
                        </div>
                        <div class="text-gray-400 text-xs">${item.data.type.charAt(0).toUpperCase() + item.data.type.slice(1)} ${item.data.subtype ? '• ' + item.data.subtype : ''}</div>
                    </div>
                    <div class="flex flex-col items-end text-xs text-gray-400">
                        ${item.data.value ? `<span>${item.data.value}g</span>` : ''}
                        ${item.data.weight ? `<span>${item.data.weight}lb</span>` : ''}
                    </div>
                </div>
                
                <div class="text-gray-300 text-sm mb-2">${item.data.description || 'No description available.'}</div>
                
                ${isEquippable ? `
                    <div class="flex gap-2 mt-2">
                        <button onclick="event.stopPropagation(); inventoryManager.equipItem('${item.id}')" 
                                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors ${!canUse ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${!canUse ? 'disabled' : ''}>
                            <i class="ph-duotone ph-sword mr-1"></i>Equip
                        </button>
                        <button onclick="event.stopPropagation(); inventoryManager.openItemModal('${item.id}')" 
                                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors">
                            <i class="ph-duotone ph-eye mr-1"></i>Details
                        </button>
                    </div>
                ` : item.data.type === 'consumable' ? `
                    <div class="flex gap-2 mt-2">
                        <button onclick="event.stopPropagation(); inventoryManager.useItem('${item.id}')" 
                                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors">
                            <i class="ph-duotone ph-flask mr-1"></i>Use
                        </button>
                        <button onclick="event.stopPropagation(); inventoryManager.openItemModal('${item.id}')" 
                                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors">
                            <i class="ph-duotone ph-eye mr-1"></i>Details
                        </button>
                    </div>
                ` : `
                    <div class="mt-2">
                        <button onclick="event.stopPropagation(); inventoryManager.openItemModal('${item.id}')" 
                                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors">
                            <i class="ph-duotone ph-eye mr-1"></i>Details
                        </button>
                    </div>
                `}
            </div>
        `;
    }

    // Get rarity colors
    getRarityBorderColor(rarity) {
        const colors = {
            common: 'border-gray-500',
            uncommon: 'border-green-500',
            rare: 'border-blue-500',
            epic: 'border-purple-500',
            legendary: 'border-orange-500'
        };
        return colors[rarity] || colors.common;
    }

    getRarityTextColor(rarity) {
        const colors = {
            common: 'text-gray-300',
            uncommon: 'text-green-400',
            rare: 'text-blue-400',
            epic: 'text-purple-400',
            legendary: 'text-orange-400'
        };
        return colors[rarity] || colors.common;
    }

    // Utility functions
    canUseItem(item) {
        // Add logic for checking if player can use item based on class, level, etc.
        return true; // For now, assume all items can be used
    }

    getTotalValue() {
        if (!gameData.player.inventory) return 0;
        
        return gameData.player.inventory.reduce((total, item) => {
            const itemId = typeof item === 'string' ? item : item.id;
            const quantity = typeof item === 'string' ? 1 : (item.quantity || 1);
            const itemData = itemsData[itemId];
            return total + ((itemData?.value || 0) * quantity);
        }, 0);
    }

    getFreeSlots() {
        const maxSlots = 50; // Default max inventory slots
        return maxSlots - (gameData.player.inventory?.length || 0);
    }

    // Event handlers
    attachEventListeners() {
        // Search input
        const searchInput = document.getElementById('inventory-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.updateInventoryDisplay();
            });
        }

        // Filter dropdowns
        const typeFilter = document.getElementById('type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.activeFilters.type = e.target.value;
                this.updateInventoryDisplay();
            });
        }

        const rarityFilter = document.getElementById('rarity-filter');
        if (rarityFilter) {
            rarityFilter.addEventListener('change', (e) => {
                this.activeFilters.rarity = e.target.value;
                this.updateInventoryDisplay();
            });
        }

        const sortField = document.getElementById('sort-field');
        if (sortField) {
            sortField.addEventListener('change', (e) => {
                this.sortCriteria.field = e.target.value;
                this.updateInventoryDisplay();
            });
        }

        const sortDirection = document.getElementById('sort-direction');
        if (sortDirection) {
            sortDirection.addEventListener('click', () => {
                this.sortCriteria.direction = this.sortCriteria.direction === 'asc' ? 'desc' : 'asc';
                this.updateInventoryDisplay();
            });
        }

        // Equipment slot handlers
        inventoryContentEl.querySelectorAll('.equipment-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                const slotName = slot.dataset.slot;
                if (gameData.player.equipment[slotName]) {
                    this.unequipItem(slotName);
                }
            });
        });
    }

    updateFilterValues() {
        const typeFilter = document.getElementById('type-filter');
        const rarityFilter = document.getElementById('rarity-filter');
        const sortField = document.getElementById('sort-field');
        
        if (typeFilter) typeFilter.value = this.activeFilters.type;
        if (rarityFilter) rarityFilter.value = this.activeFilters.rarity;
        if (sortField) sortField.value = this.sortCriteria.field;
    }

    updateInventoryDisplay() {
        const inventoryGrid = document.querySelector('.inventory-grid');
        const inventoryStats = document.querySelector('.inventory-stats');
        
        if (inventoryGrid) {
            inventoryGrid.innerHTML = this.renderInventoryGrid();
        }
        
        if (inventoryStats) {
            inventoryStats.innerHTML = `
                <div class="stat-item bg-gray-700 rounded px-3 py-2">
                    <span class="text-gray-400">Items:</span>
                    <span class="text-white ml-2">${this.getFilteredItems().length}/${gameData.player.inventory.length}</span>
                </div>
                <div class="stat-item bg-gray-700 rounded px-3 py-2">
                    <span class="text-gray-400">Weight:</span>
                    <span class="text-yellow-400 ml-2">${getTotalWeight().toFixed(1)}/${gameData.player.derivedStats.carryCapacity}</span>
                </div>
                <div class="stat-item bg-gray-700 rounded px-3 py-2">
                    <span class="text-gray-400">Value:</span>
                    <span class="text-green-400 ml-2">${this.getTotalValue()} gold</span>
                </div>
                <div class="stat-item bg-gray-700 rounded px-3 py-2">
                    <span class="text-gray-400">Free Slots:</span>
                    <span class="text-blue-400 ml-2">${this.getFreeSlots()}</span>
                </div>
            `;
        }

        // Update sort direction icon
        const sortDirectionBtn = document.getElementById('sort-direction');
        if (sortDirectionBtn) {
            const icon = sortDirectionBtn.querySelector('i');
            if (icon) {
                icon.className = `ph-duotone ${this.sortCriteria.direction === 'asc' ? 'ph-sort-ascending' : 'ph-sort-descending'}`;
            }
        }
    }

    clearFilters() {
        this.searchTerm = '';
        this.activeFilters = {
            type: 'all',
            rarity: 'all',
            usability: 'all',
            slot: 'all'
        };
        
        const searchInput = document.getElementById('inventory-search');
        if (searchInput) searchInput.value = '';
        
        this.updateFilterValues();
        this.updateInventoryDisplay();
    }

    // Item interaction methods
    equipItem(itemId) {
        if (typeof equipItem === 'function') {
            const success = equipItem(itemId);
            if (success) {
                this.updateInventoryDisplay(); // Refresh the inventory display
                this.renderAdvancedInventory(); // Refresh the entire display
            }
            return success;
        }
        return false;
    }

    unequipItem(slotName) {
        if (typeof unequipItem === 'function') {
            const success = unequipItem(slotName);
            if (success) {
                this.renderAdvancedInventory(); // Refresh the entire display
            }
            return success;
        }
        return false;
    }

    useItem(itemId) {
        const item = itemsData[itemId];
        if (!item) {
            showGameMessage('Unknown item!', 'failure');
            return;
        }

        // Handle consumable items
        if (item.type === 'consumable') {
            this.handleConsumableUse(itemId, item);
        } else {
            showGameMessage(`${item.name} cannot be used.`, 'warning');
        }
    }

    handleConsumableUse(itemId, item) {
        // Remove item from inventory
        const invIndex = gameData.player.inventory.findIndex(invItem => 
            (typeof invItem === 'string' ? invItem : invItem.id) === itemId
        );
        
        if (invIndex === -1) {
            showGameMessage('Item not found in inventory!', 'failure');
            return;
        }

        // Apply item effects based on type
        switch (item.subtype) {
            case 'healing':
                const healAmount = item.healAmount || 10;
                const oldHP = gameData.player.derivedStats.health;
                const newHP = Math.min(
                    oldHP + healAmount,
                    gameData.player.derivedStats.maxHealth
                );
                const actualHeal = newHP - oldHP;
                
                gameData.player.derivedStats.health = newHP;
                
                // Show healing animation
                if (actualHeal > 0 && typeof showHealingAnimation === 'function') {
                    showHealingAnimation(actualHeal, oldHP, newHP, gameData.player.derivedStats.maxHealth);
                }
                
                showGameMessage(`Healed ${actualHeal} hit points!`, 'success');
                break;
            
            case 'mana':
                const manaAmount = item.manaAmount || 10;
                const oldMana = gameData.player.derivedStats.mana;
                const newMana = Math.min(
                    oldMana + manaAmount,
                    gameData.player.derivedStats.maxMana
                );
                const actualMana = newMana - oldMana;
                
                gameData.player.derivedStats.mana = newMana;
                
                // Show mana animation
                if (actualMana > 0 && typeof showManaAnimation === 'function') {
                    showManaAnimation(actualMana, oldMana, newMana, gameData.player.derivedStats.maxMana);
                }
                
                showGameMessage(`Restored ${actualMana} mana!`, 'success');
                break;
            
            default:
                showGameMessage(`Used ${item.name}.`, 'info');
        }

        // Remove item from inventory
        gameData.player.inventory.splice(invIndex, 1);
        
        // Refresh display
        this.updateInventoryDisplay();
        
        // Update character panel if open
        if (typeof renderCharacterPanel === 'function') {
            renderCharacterPanel();
        }
    }

    // Item detail modal
    openItemModal(itemId) {
        const item = itemsData[itemId];
        if (!item) {
            showGameMessage('Unknown item!', 'failure');
            return;
        }

        // Find quantity in inventory
        const invItem = gameData.player.inventory.find(invItem => 
            (typeof invItem === 'string' ? invItem : invItem.id) === itemId
        );
        const quantity = typeof invItem === 'string' ? 1 : (invItem?.quantity || 1);

        this.showItemDetailModal(item, quantity);
    }

    showItemDetailModal(item, quantity) {
        const rarityTextColor = this.getRarityTextColor(item.rarity);
        const isEquippable = item.slot && item.slot !== 'none';
        const isConsumable = item.type === 'consumable';
        
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) {
                this.closeItemModal();
            }
        };

        modalOverlay.innerHTML = `
            <div class="item-detail-modal bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div class="modal-header bg-gray-900 rounded-t-lg p-6 border-b border-gray-700">
                    <div class="flex justify-between items-start">
                        <div>
                            <h2 class="text-2xl font-cinzel ${rarityTextColor} mb-2">${item.name}</h2>
                            <div class="flex gap-4 text-sm text-gray-400">
                                <span>${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                                ${item.subtype ? `<span>• ${item.subtype}</span>` : ''}
                                <span>• ${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}</span>
                                ${quantity > 1 ? `<span>• Quantity: ${quantity}</span>` : ''}
                            </div>
                        </div>
                        <button onclick="inventoryManager.closeItemModal()" 
                                class="text-gray-400 hover:text-white text-xl">
                            <i class="ph-duotone ph-x"></i>
                        </button>
                    </div>
                </div>

                <!-- Modal Content -->
                <div class="modal-content p-6">
                    <!-- Description -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-white mb-2">Description</h3>
                        <p class="text-gray-300">${item.description || 'No description available.'}</p>
                    </div>

                    <!-- Item Stats -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-3">Properties</h3>
                            <div class="space-y-2 text-sm">
                                ${item.value ? `<div><span class="text-gray-400">Value:</span> <span class="text-green-400">${item.value} gold</span></div>` : ''}
                                ${item.weight ? `<div><span class="text-gray-400">Weight:</span> <span class="text-yellow-400">${item.weight} lb</span></div>` : ''}
                                ${item.slot ? `<div><span class="text-gray-400">Slot:</span> <span class="text-blue-400">${item.slot}</span></div>` : ''}
                                ${item.damage ? `<div><span class="text-gray-400">Damage:</span> <span class="text-red-400">${item.damage} ${item.damageType}</span></div>` : ''}
                                ${item.armorClass ? `<div><span class="text-gray-400">Armor Class:</span> <span class="text-blue-400">${item.armorClass}</span></div>` : ''}
                                ${item.range ? `<div><span class="text-gray-400">Range:</span> <span class="text-purple-400">${item.range}</span></div>` : ''}
                            </div>
                        </div>

                        ${item.statBonus && Object.keys(item.statBonus).length > 0 ? `
                            <div>
                                <h3 class="text-lg font-semibold text-white mb-3">Stat Bonuses</h3>
                                <div class="space-y-2 text-sm">
                                    ${Object.entries(item.statBonus).map(([stat, bonus]) => 
                                        `<div><span class="text-gray-400">${stat.charAt(0).toUpperCase() + stat.slice(1)}:</span> <span class="text-green-400">+${bonus}</span></div>`
                                    ).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    ${item.properties && item.properties.length > 0 ? `
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-white mb-3">Special Properties</h3>
                            <div class="flex flex-wrap gap-2">
                                ${item.properties.map(prop => 
                                    `<span class="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">${prop}</span>`
                                ).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Action Buttons -->
                    <div class="flex gap-3 mt-6">
                        ${isEquippable ? `
                            <button onclick="inventoryManager.equipItem('${item.id}'); inventoryManager.closeItemModal();" 
                                    class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition-colors">
                                <i class="ph-duotone ph-sword mr-2"></i>Equip
                            </button>
                        ` : ''}
                        ${isConsumable ? `
                            <button onclick="inventoryManager.useItem('${item.id}'); inventoryManager.closeItemModal();" 
                                    class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold transition-colors">
                                <i class="ph-duotone ph-flask mr-2"></i>Use
                            </button>
                        ` : ''}
                        <button onclick="inventoryManager.closeItemModal()" 
                                class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded font-semibold transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);
        this.isDetailModalOpen = true;
    }

    closeItemModal() {
        const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-75');
        if (modal) {
            modal.remove();
        }
        this.isDetailModalOpen = false;
    }
}

// Create global inventory manager instance
const inventoryManager = new InventoryManager();

// Enhanced inventory rendering function to replace the old one
function renderAdvancedInventory() {
    inventoryManager.renderAdvancedInventory();
}

// Maintain backward compatibility
function renderInventory() {
    inventoryManager.renderAdvancedInventory();
}

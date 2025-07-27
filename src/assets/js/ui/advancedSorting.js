/**
 * Advanced Item Sorting and Filtering System
 * Provides comprehensive sorting, filtering, and search capabilities
 */

class AdvancedSortingSystem {
    constructor() {
        this.customSortOrders = {
            rarity: {
                'common': 0,
                'uncommon': 1,
                'rare': 2,
                'epic': 3,
                'legendary': 4,
                'mythic': 5
            },
            type: {
                'weapon': 0,
                'armor': 1,
                'accessory': 2,
                'consumable': 3,
                'tool': 4,
                'quest': 5,
                'misc': 6
            }
        };
        
        this.savedSortPreferences = this.loadSortPreferences();
        this.applySavedPreferences();
    }

    loadSortPreferences() {
        try {
            return JSON.parse(localStorage.getItem('inventorySortPreferences')) || {};
        } catch {
            return {};
        }
    }

    saveSortPreferences() {
        localStorage.setItem('inventorySortPreferences', JSON.stringify({
            field: inventoryManager.sortCriteria.field,
            direction: inventoryManager.sortCriteria.direction,
            filters: inventoryManager.activeFilters
        }));
    }

    applySavedPreferences() {
        if (this.savedSortPreferences.field) {
            inventoryManager.sortCriteria.field = this.savedSortPreferences.field;
        }
        if (this.savedSortPreferences.direction) {
            inventoryManager.sortCriteria.direction = this.savedSortPreferences.direction;
        }
        if (this.savedSortPreferences.filters) {
            inventoryManager.activeFilters = { ...inventoryManager.activeFilters, ...this.savedSortPreferences.filters };
        }
    }

    // Multi-criteria sorting
    sortItemsAdvanced(items, primarySort, secondarySort = null) {
        return items.sort((a, b) => {
            let result = this.compareItems(a, b, primarySort);
            
            if (result === 0 && secondarySort) {
                result = this.compareItems(a, b, secondarySort);
            }
            
            // Final tie-breaker: alphabetical by name
            if (result === 0) {
                result = a.data.name.localeCompare(b.data.name);
            }
            
            return result;
        });
    }

    compareItems(a, b, sortCriteria) {
        let valueA, valueB;
        
        switch (sortCriteria.field) {
            case 'name':
                valueA = a.data.name.toLowerCase();
                valueB = b.data.name.toLowerCase();
                break;
            case 'type':
                valueA = this.customSortOrders.type[a.data.type] || 999;
                valueB = this.customSortOrders.type[b.data.type] || 999;
                break;
            case 'rarity':
                valueA = this.customSortOrders.rarity[a.data.rarity] || 0;
                valueB = this.customSortOrders.rarity[b.data.rarity] || 0;
                break;
            case 'value':
                valueA = a.data.value || 0;
                valueB = b.data.value || 0;
                break;
            case 'weight':
                valueA = a.data.weight || 0;
                valueB = b.data.weight || 0;
                break;
            case 'level':
                valueA = a.data.levelRequirement || 0;
                valueB = b.data.levelRequirement || 0;
                break;
            case 'quantity':
                valueA = a.quantity || 1;
                valueB = b.quantity || 1;
                break;
            default:
                valueA = a.data.name.toLowerCase();
                valueB = b.data.name.toLowerCase();
        }

        if (valueA < valueB) return sortCriteria.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortCriteria.direction === 'asc' ? 1 : -1;
        return 0;
    }

    // Advanced filtering with multiple criteria
    filterItemsAdvanced(items, filters) {
        return items.filter(item => {
            // Search term filtering
            if (filters.search && filters.search.trim()) {
                const searchLower = filters.search.toLowerCase();
                const searchTerms = searchLower.split(' ').filter(term => term.length > 0);
                
                const itemText = [
                    item.data.name,
                    item.data.description || '',
                    item.data.type,
                    item.data.subtype || '',
                    ...(item.data.properties || [])
                ].join(' ').toLowerCase();
                
                if (!searchTerms.every(term => itemText.includes(term))) {
                    return false;
                }
            }

            // Type filtering
            if (filters.type && filters.type !== 'all' && item.data.type !== filters.type) {
                return false;
            }

            // Rarity filtering
            if (filters.rarity && filters.rarity !== 'all' && item.data.rarity !== filters.rarity) {
                return false;
            }

            // Level requirement filtering
            if (filters.levelRequirement) {
                const playerLevel = gameData.player.level;
                const itemLevel = item.data.levelRequirement || 0;
                
                switch (filters.levelRequirement) {
                    case 'usable':
                        if (itemLevel > playerLevel) return false;
                        break;
                    case 'too-high':
                        if (itemLevel <= playerLevel) return false;
                        break;
                }
            }

            // Value range filtering
            if (filters.valueRange) {
                const value = item.data.value || 0;
                const [min, max] = filters.valueRange;
                if (value < min || value > max) return false;
            }

            // Weight range filtering
            if (filters.weightRange) {
                const weight = item.data.weight || 0;
                const [min, max] = filters.weightRange;
                if (weight < min || weight > max) return false;
            }

            // Equipped status filtering
            if (filters.equipped !== undefined) {
                const isEquipped = Object.values(gameData.player.equipment).includes(item.id);
                if (filters.equipped !== isEquipped) return false;
            }

            return true;
        });
    }

    // Get suggested filters based on current inventory
    getSuggestedFilters(items) {
        const suggestions = {
            types: new Set(),
            rarities: new Set(),
            valueRanges: [],
            weightRanges: []
        };

        items.forEach(item => {
            suggestions.types.add(item.data.type);
            suggestions.rarities.add(item.data.rarity);
        });

        return {
            types: Array.from(suggestions.types).sort(),
            rarities: Array.from(suggestions.rarities).sort((a, b) => 
                this.customSortOrders.rarity[a] - this.customSortOrders.rarity[b]
            )
        };
    }

    // Batch operations
    performBatchOperation(selectedItems, operation) {
        switch (operation) {
            case 'sell':
                this.batchSellItems(selectedItems);
                break;
            case 'drop':
                this.batchDropItems(selectedItems);
                break;
            case 'compare':
                if (selectedItems.length >= 2) {
                    inventoryUIFeatures.showItemComparison(selectedItems);
                }
                break;
            case 'tag':
                this.batchTagItems(selectedItems);
                break;
        }
    }

    batchSellItems(itemIds) {
        let totalValue = 0;
        const itemsToSell = [];

        itemIds.forEach(itemId => {
            const item = inventoryManager.findItemById(itemId);
            if (item && item.value) {
                totalValue += item.value;
                itemsToSell.push(item.name);
            }
        });

        if (totalValue > 0) {
            const confirmSell = confirm(`Sell ${itemsToSell.length} items for ${totalValue} gold?`);
            if (confirmSell) {
                // Remove items from inventory
                itemIds.forEach(itemId => {
                    removeItemFromInventory(itemId);
                });
                
                // Add gold
                gameData.player.gold += totalValue;
                
                inventoryUIFeatures.showMessage(`Sold ${itemsToSell.length} items for ${totalValue} gold!`, 'success');
                inventoryManager.updateDisplay();
                updateGoldDisplay();
            }
        }
    }

    batchDropItems(itemIds) {
        const itemNames = itemIds.map(id => inventoryManager.findItemById(id)?.name).filter(Boolean);
        
        if (itemNames.length > 0) {
            const confirmDrop = confirm(`Drop ${itemNames.length} items? This cannot be undone.`);
            if (confirmDrop) {
                itemIds.forEach(itemId => {
                    removeItemFromInventory(itemId);
                });
                
                inventoryUIFeatures.showMessage(`Dropped ${itemNames.length} items.`, 'warning');
                inventoryManager.updateDisplay();
            }
        }
    }

    // Smart sorting presets
    applySortingPreset(presetName) {
        const presets = {
            'value-high': { field: 'value', direction: 'desc' },
            'value-low': { field: 'value', direction: 'asc' },
            'weight-light': { field: 'weight', direction: 'asc' },
            'weight-heavy': { field: 'weight', direction: 'desc' },
            'rarity-best': { field: 'rarity', direction: 'desc' },
            'rarity-common': { field: 'rarity', direction: 'asc' },
            'alphabetical': { field: 'name', direction: 'asc' },
            'type-grouped': { field: 'type', direction: 'asc' },
            'recent': { field: 'dateAdded', direction: 'desc' }
        };

        if (presets[presetName]) {
            inventoryManager.sortCriteria = presets[presetName];
            this.saveSortPreferences();
            inventoryManager.updateDisplay();
        }
    }

    // Search suggestions and autocomplete
    getSearchSuggestions(partialText, items) {
        const suggestions = new Set();
        const searchLower = partialText.toLowerCase();

        items.forEach(item => {
            // Add item names that start with the search term
            if (item.data.name.toLowerCase().startsWith(searchLower)) {
                suggestions.add(item.data.name);
            }

            // Add item types
            if (item.data.type.toLowerCase().includes(searchLower)) {
                suggestions.add(item.data.type);
            }

            // Add properties
            if (item.data.properties) {
                item.data.properties.forEach(prop => {
                    if (prop.toLowerCase().includes(searchLower)) {
                        suggestions.add(prop);
                    }
                });
            }
        });

        return Array.from(suggestions).slice(0, 8); // Limit suggestions
    }
}

// Initialize the advanced sorting system
const advancedSorting = new AdvancedSortingSystem();

/**
 * Enhanced Inventory UI Features
 * Provides drag-and-drop, tooltips, sorting, and comparison functionality
 */

class InventoryUIFeatures {
    constructor() {
        this.draggedItem = null;
        this.draggedSource = null;
        this.tooltipElement = null;
        this.comparisonMode = false;
        this.selectedItems = new Set();
        this.initialize();
    }

    initialize() {
        this.createTooltipElement();
        this.bindEvents();
        this.setupSortingControls();
    }

    createTooltipElement() {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.id = 'item-tooltip';
        this.tooltipElement.className = 'item-tooltip';
        this.tooltipElement.style.cssText = `
            position: fixed;
            z-index: 10000;
            background: linear-gradient(135deg, #1a1a2e 0%, #2a2a4e 100%);
            border: 2px solid #4a4a6a;
            border-radius: 8px;
            padding: 12px;
            max-width: 320px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            font-family: 'Faculty Glyphic', sans-serif;
            font-size: 14px;
            color: #e0e0e0;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(this.tooltipElement);
    }

    // Drag and Drop System
    makeDraggable(element, itemData, sourceType) {
        element.draggable = true;
        element.addEventListener('dragstart', (e) => {
            this.draggedItem = itemData;
            this.draggedSource = sourceType;
            element.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
            
            // Create drag image
            const dragImage = this.createDragImage(itemData);
            e.dataTransfer.setDragImage(dragImage, 25, 25);
        });

        element.addEventListener('dragend', (e) => {
            element.style.opacity = '1';
            this.draggedItem = null;
            this.draggedSource = null;
        });
    }

    createDragImage(itemData) {
        const dragImage = document.createElement('div');
        dragImage.style.cssText = `
            position: absolute;
            top: -1000px;
            left: -1000px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            border: 2px solid #fbbf24;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: white;
        `;
        dragImage.textContent = this.getItemIcon(itemData);
        document.body.appendChild(dragImage);
        
        setTimeout(() => document.body.removeChild(dragImage), 100);
        return dragImage;
    }

    makeDropZone(element, targetType, slotId = null) {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (this.canDrop(this.draggedItem, targetType, slotId)) {
                element.classList.add('drop-valid');
                e.dataTransfer.dropEffect = 'move';
            } else {
                element.classList.add('drop-invalid');
                e.dataTransfer.dropEffect = 'none';
            }
        });

        element.addEventListener('dragleave', (e) => {
            element.classList.remove('drop-valid', 'drop-invalid');
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('drop-valid', 'drop-invalid');
            
            if (this.canDrop(this.draggedItem, targetType, slotId)) {
                this.handleDrop(this.draggedItem, this.draggedSource, targetType, slotId);
            }
        });
    }

    canDrop(item, targetType, slotId) {
        if (!item) return false;

        switch (targetType) {
            case 'equipment':
                return item.type === 'equipment' && 
                       (slotId === item.slot || this.isCompatibleSlot(item, slotId));
            case 'inventory':
                return true;
            case 'consumable':
                return item.type === 'consumable';
            default:
                return false;
        }
    }

    isCompatibleSlot(item, slotId) {
        const compatibilityMap = {
            'mainHand': ['weapon', 'shield'],
            'offHand': ['weapon', 'shield'],
            'ring1': ['ring'],
            'ring2': ['ring']
        };
        return compatibilityMap[slotId]?.includes(item.subtype);
    }

    handleDrop(item, sourceType, targetType, slotId) {
        if (sourceType === 'inventory' && targetType === 'equipment') {
            equipmentSystem.equipItem(item.id);
        } else if (sourceType === 'equipment' && targetType === 'inventory') {
            equipmentSystem.unequipItem(slotId);
        } else if (sourceType === 'inventory' && targetType === 'inventory') {
            // Reorder inventory items (future enhancement)
            this.showMessage('Item reordering coming soon!');
        }
        
        gameData.saveGame();
        inventoryManager.updateDisplay();
        this.showDropSuccess(item.name);
    }

    showDropSuccess(itemName) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(34, 197, 94, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10001;
            animation: fadeInOut 2s ease;
        `;
        message.textContent = `${itemName} moved successfully!`;
        document.body.appendChild(message);
        
        setTimeout(() => document.body.removeChild(message), 2000);
    }

    // Tooltip System
    showTooltip(e, itemData) {
        const tooltip = this.tooltipElement;
        tooltip.innerHTML = this.generateTooltipContent(itemData);
        tooltip.style.opacity = '1';
        this.positionTooltip(e);
    }

    hideTooltip() {
        this.tooltipElement.style.opacity = '0';
    }

    // Force hide tooltip (used when items are unequipped)
    forceHideTooltip() {
        this.tooltipElement.style.opacity = '0';
    }

    positionTooltip(e) {
        const tooltip = this.tooltipElement;
        const x = e.clientX + 15;
        const y = e.clientY + 15;
        
        // Adjust if tooltip would go off screen
        const rect = tooltip.getBoundingClientRect();
        const adjustedX = x + rect.width > window.innerWidth ? x - rect.width - 30 : x;
        const adjustedY = y + rect.height > window.innerHeight ? y - rect.height - 30 : y;
        
        tooltip.style.left = adjustedX + 'px';
        tooltip.style.top = adjustedY + 'px';
    }

    generateTooltipContent(itemData) {
        const rarityColors = {
            'common': '#9ca3af',
            'uncommon': '#22c55e',
            'rare': '#3b82f6',
            'very_rare': '#a855f7',
            'legendary': '#f59e0b',
            'mythic': '#ef4444'
        };

        let content = `
            <div class="tooltip-header" style="border-bottom: 1px solid #4a4a6a; padding-bottom: 8px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-family: 'Cinzel', serif; font-weight: bold; color: ${rarityColors[itemData.rarity] || '#e0e0e0'};">
                        ${itemData.name}
                    </span>
                    <span style="color: #fbbf24; font-size: 18px;">
                        ${this.getItemIcon(itemData)}
                    </span>
                </div>
                <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">
                    ${itemData.type} ${itemData.subtype ? `• ${itemData.subtype}` : ''}
                </div>
            </div>
        `;

        // Stats and properties
        if (itemData.type === 'equipment') {
            content += this.generateEquipmentStats(itemData);
        } else if (itemData.type === 'consumable') {
            content += this.generateConsumableStats(itemData);
        }

        // Description
        if (itemData.description) {
            content += `
                <div style="margin-top: 8px; font-style: italic; color: #d1d5db;">
                    "${itemData.description}"
                </div>
            `;
        }

        if (itemData.properties && itemData.properties.includes('container')) {
            const totalW = (itemData.container_contents || []).reduce((w,id)=> w + (itemsData[id]?.weight || 0),0);
            const list = itemData.container_contents && itemData.container_contents.length > 0 ?
                itemData.container_contents.map(id => itemsData[id]?.name || id).join(', ') : 'Empty';
            content += `
                <div style="margin-top:8px;">
                    <strong>Contents:</strong> ${list}<br/>
                    <span style="font-size:12px;color:#9ca3af;">Weight: ${totalW}/${itemData.capacity || 0} lb</span>
                </div>
            `;
        }

        // Value and weight
        content += `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #4a4a6a;">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #fbbf24;">Value: ${itemData.value || 0} gp</span>
                    <span style="color: #94a3b8;">Weight: ${itemData.weight || 0} lbs</span>
                </div>
            </div>
        `;

        return content;
    }

    generateEquipmentStats(itemData) {
        let content = '';
        
        if (itemData.stats) {
            content += '<div style="margin: 8px 0;">';
            Object.entries(itemData.stats).forEach(([stat, value]) => {
                const statColor = value > 0 ? '#22c55e' : '#ef4444';
                const prefix = value > 0 ? '+' : '';
                content += `
                    <div style="color: ${statColor};">
                        ${prefix}${value} ${this.getStatDisplayName(stat)}
                    </div>
                `;
            });
            content += '</div>';
        }

        if (itemData.armorClass) {
            content += `<div style="color: #3b82f6;">AC: ${itemData.armorClass}</div>`;
        }

        if (itemData.damage) {
            content += `<div style="color: #ef4444;">Damage: ${itemData.damage}</div>`;
        }

        return content;
    }

    generateConsumableStats(itemData) {
        let content = '';
        
        if (itemData.effects) {
            content += '<div style="margin: 8px 0;">';
            itemData.effects.forEach(effect => {
                content += `<div style="color: #22c55e;">• ${this.formatEffectDescription(effect)}</div>`;
            });
            content += '</div>';
        }

        if (itemData.quantity && itemData.quantity > 1) {
            content += `<div style="color: #fbbf24;">Quantity: ${itemData.quantity}</div>`;
        }

        return content;
    }

    formatEffectDescription(effect) {
        switch (effect.type) {
            case 'heal':
                return `Restores ${effect.amount} HP`;
            case 'mana':
                return `Restores ${effect.amount} Mana`;
            case 'buff':
                return `+${effect.amount} ${this.getStatDisplayName(effect.stat)} for ${effect.duration}s`;
            case 'sustenance':
                return `Removes hunger and thirst`;
            default:
                return effect.description || 'Unknown effect';
        }
    }

    getStatDisplayName(stat) {
        const statNames = {
            'str': 'Strength',
            'dex': 'Dexterity', 
            'con': 'Constitution',
            'int': 'Intelligence',
            'wis': 'Wisdom',
            'cha': 'Charisma',
            'ac': 'Armor Class',
            'attack': 'Attack',
            'damage': 'Damage'
        };
        return statNames[stat] || stat;
    }

    getItemIcon(itemData) {
        const iconMap = {
            'weapon': '⚔️',
            'armor': '🛡️',
            'accessory': '💍',
            'consumable': '🧪',
            'misc': '📦'
        };
        return iconMap[itemData.type] || iconMap[itemData.subtype] || '📦';
    }

    // Item Comparison System
    toggleComparisonMode() {
        this.comparisonMode = !this.comparisonMode;
        this.selectedItems.clear();
        
        const button = document.getElementById('comparison-toggle');
        if (button) {
            button.textContent = this.comparisonMode ? 'Exit Compare' : 'Compare Items';
            button.className = this.comparisonMode 
                ? 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded'
                : 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded';
        }

        inventoryManager.updateDisplay();
    }

    selectItemForComparison(itemId) {
        if (!this.comparisonMode) return;

        if (this.selectedItems.has(itemId)) {
            this.selectedItems.delete(itemId);
        } else if (this.selectedItems.size < 3) {
            this.selectedItems.add(itemId);
        }

        if (this.selectedItems.size >= 2) {
            this.showItemComparison();
        }

        inventoryManager.updateDisplay();
    }

    showItemComparison() {
        const selectedItemsArray = Array.from(this.selectedItems);
        const items = selectedItemsArray.map(id => 
            [...gameData.player.inventory, ...Object.values(gameData.player.equipment)]
                .find(item => item.id === id)
        );

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="background: #1f2937; border: 2px solid #4f46e5; border-radius: 12px; 
                        padding: 24px; max-width: 800px; max-height: 600px; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="color: #fbbf24; font-size: 24px; font-weight: bold;">Item Comparison</h3>
                    <button id="close-comparison" style="color: #ef4444; font-size: 24px; background: none; border: none;">✕</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(${items.length}, 1fr); gap: 20px;">
                    ${items.map(item => this.generateComparisonCard(item)).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#close-comparison').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    generateComparisonCard(item) {
        const rarityColors = {
            'common': '#9ca3af',
            'uncommon': '#22c55e', 
            'rare': '#3b82f6',
            'very_rare': '#a855f7',
            'legendary': '#f59e0b',
            'mythic': '#ef4444'
        };

        return `
            <div style="background: #374151; border: 2px solid ${rarityColors[item.rarity] || '#4b5563'}; 
                        border-radius: 8px; padding: 16px;">
                <div style="text-align: center; margin-bottom: 12px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">${this.getItemIcon(item)}</div>
                    <div style="color: ${rarityColors[item.rarity] || '#f3f4f6'}; font-weight: bold;">
                        ${item.name}
                    </div>
                    <div style="color: #9ca3af; font-size: 12px;">
                        ${item.type} ${item.subtype ? `• ${item.subtype}` : ''}
                    </div>
                </div>
                
                ${item.type === 'equipment' ? this.generateComparisonStats(item) : this.generateConsumableStats(item)}
                
                <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #4b5563; 
                           display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: #fbbf24;">${item.value || 0} gp</span>
                    <span style="color: #94a3b8;">${item.weight || 0} lbs</span>
                </div>
            </div>
        `;
    }

    generateComparisonStats(item) {
        let content = '';
        
        if (item.stats) {
            content += '<div style="margin: 8px 0;">';
            Object.entries(item.stats).forEach(([stat, value]) => {
                const statColor = value > 0 ? '#22c55e' : '#ef4444';
                const prefix = value > 0 ? '+' : '';
                content += `
                    <div style="color: ${statColor}; font-size: 14px;">
                        ${prefix}${value} ${this.getStatDisplayName(stat)}
                    </div>
                `;
            });
            content += '</div>';
        }

        if (item.armorClass) {
            content += `<div style="color: #3b82f6;">AC: ${item.armorClass}</div>`;
        }

        if (item.damage) {
            content += `<div style="color: #ef4444;">Damage: ${item.damage}</div>`;
        }

        return content;
    }

    // Sorting System
    setupSortingControls() {
        document.addEventListener('change', (e) => {
            if (e.target.id === 'sort-criteria') {
                inventoryManager.sortCriteria.type = e.target.value;
                inventoryManager.updateDisplay();
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.id === 'sort-direction') {
                inventoryManager.sortCriteria.direction = 
                    inventoryManager.sortCriteria.direction === 'asc' ? 'desc' : 'asc';
                inventoryManager.updateDisplay();
            }
        });
    }

    bindEvents() {
        // Global event delegation for equipped item tooltips only
        document.addEventListener('mouseenter', (e) => {
            // Only show tooltips for equipped items (not inventory items)
            if (e.target instanceof Element &&
                e.target.hasAttribute('data-item-id') &&
                e.target.closest('.equipped-item-display')) {
                const itemId = e.target.getAttribute('data-item-id');
                const item = this.findItemById(itemId);
                if (item) {
                    this.showTooltip(e, item);
                }
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target instanceof Element &&
                e.target.hasAttribute('data-item-id') &&
                e.target.closest('.equipped-item-display')) {
                this.hideTooltip();
            }
        }, true);

        document.addEventListener('mousemove', (e) => {
            if (this.tooltipElement.style.opacity === '1') {
                this.positionTooltip(e);
            }
        });

        // Comparison mode clicks (for inventory items)
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-inventory-item-id') && this.comparisonMode) {
                e.preventDefault();
                e.stopPropagation();
                const itemId = e.target.getAttribute('data-inventory-item-id');
                this.selectItemForComparison(itemId);
            }
        });
    }

    findItemById(itemId) {
        // First check if the item exists in itemsData
        if (itemsData[itemId]) {
            return itemsData[itemId];
        }
        
        // If not found, return null
        return null;
    }

    showMessage(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            'info': 'bg-blue-600',
            'success': 'bg-green-600',
            'warning': 'bg-yellow-600',
            'error': 'bg-red-600'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
}

// Initialize the enhanced inventory UI features
const inventoryUIFeatures = new InventoryUIFeatures();

// CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    .drop-valid {
        border: 2px dashed #22c55e !important;
        background: rgba(34, 197, 94, 0.1) !important;
    }
    
    .drop-invalid {
        border: 2px dashed #ef4444 !important;
        background: rgba(239, 68, 68, 0.1) !important;
    }
    
    .comparison-selected {
        border: 3px solid #fbbf24 !important;
        background: rgba(251, 191, 36, 0.1) !important;
    }
    
    .dragging {
        opacity: 0.5 !important;
        transform: rotate(5deg) !important;
    }
`;
document.head.appendChild(style);

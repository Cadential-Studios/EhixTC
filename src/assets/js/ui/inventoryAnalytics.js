/**
 * Inventory Analytics Dashboard
 * Provides detailed statistics and insights about the player's inventory
 */

class InventoryAnalytics {
    constructor() {
        this.cachedStats = null;
        this.lastUpdateTime = 0;
        this.cacheTimeout = 5000; // 5 seconds
    }

    // Get comprehensive inventory statistics
    getInventoryStats() {
        const now = Date.now();
        if (this.cachedStats && (now - this.lastUpdateTime) < this.cacheTimeout) {
            return this.cachedStats;
        }

        const items = this.getAllItems();
        const stats = {
            overview: this.calculateOverviewStats(items),
            breakdown: this.calculateTypeBreakdown(items),
            rarity: this.calculateRarityDistribution(items),
            value: this.calculateValueAnalysis(items),
            weight: this.calculateWeightAnalysis(items),
            efficiency: this.calculateEfficiencyMetrics(items),
            recommendations: this.generateRecommendations(items)
        };

        this.cachedStats = stats;
        this.lastUpdateTime = now;
        return stats;
    }

    getAllItems() {
        const inventoryItems = gameData.player.inventory.map(item => {
            const itemId = typeof item === 'string' ? item : item.id;
            const quantity = typeof item === 'string' ? 1 : (item.quantity || 1);
            const itemData = itemsData[itemId];
            
            return itemData ? {
                id: itemId,
                quantity,
                data: itemData,
                equipped: false
            } : null;
        }).filter(Boolean);

        const equippedItems = Object.entries(gameData.player.equipment)
            .filter(([slot, itemId]) => itemId && itemsData[itemId])
            .map(([slot, itemId]) => ({
                id: itemId,
                quantity: 1,
                data: itemsData[itemId],
                equipped: true,
                slot
            }));

        return [...inventoryItems, ...equippedItems];
    }

    calculateOverviewStats(items) {
        return {
            totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
            uniqueItems: items.length,
            totalValue: items.reduce((sum, item) => sum + (item.data.value || 0) * item.quantity, 0),
            totalWeight: items.reduce((sum, item) => sum + (item.data.weight || 0) * item.quantity, 0),
            equippedItems: items.filter(item => item.equipped).length,
            inventorySlots: gameData.player.inventory.length,
            carryCapacity: gameData.player.derivedStats.carryCapacity,
            encumbrancePercentage: Math.round((this.getTotalWeight() / gameData.player.derivedStats.carryCapacity) * 100)
        };
    }

    calculateTypeBreakdown(items) {
        const breakdown = {};
        
        items.forEach(item => {
            const type = item.data.type;
            if (!breakdown[type]) {
                breakdown[type] = {
                    count: 0,
                    totalValue: 0,
                    totalWeight: 0,
                    averageValue: 0,
                    averageWeight: 0
                };
            }
            
            breakdown[type].count += item.quantity;
            breakdown[type].totalValue += (item.data.value || 0) * item.quantity;
            breakdown[type].totalWeight += (item.data.weight || 0) * item.quantity;
        });

        // Calculate averages
        Object.values(breakdown).forEach(stats => {
            stats.averageValue = stats.count > 0 ? stats.totalValue / stats.count : 0;
            stats.averageWeight = stats.count > 0 ? stats.totalWeight / stats.count : 0;
        });

        return breakdown;
    }

    calculateRarityDistribution(items) {
        const distribution = {};
        const rarities = ['common', 'uncommon', 'rare', 'very_rare', 'legendary', 'mythic'];
        
        rarities.forEach(rarity => {
            distribution[rarity] = {
                count: 0,
                percentage: 0,
                totalValue: 0
            };
        });

        items.forEach(item => {
            const rarity = item.data.rarity || 'common';
            if (distribution[rarity]) {
                distribution[rarity].count += item.quantity;
                distribution[rarity].totalValue += (item.data.value || 0) * item.quantity;
            }
        });

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        
        Object.values(distribution).forEach(stats => {
            stats.percentage = totalItems > 0 ? Math.round((stats.count / totalItems) * 100) : 0;
        });

        return distribution;
    }

    calculateValueAnalysis(items) {
        const values = items.map(item => (item.data.value || 0) * item.quantity).filter(v => v > 0);
        values.sort((a, b) => b - a);

        return {
            total: values.reduce((sum, value) => sum + value, 0),
            average: values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0,
            median: this.calculateMedian(values),
            highest: values[0] || 0,
            lowest: values[values.length - 1] || 0,
            top5Items: items
                .sort((a, b) => (b.data.value || 0) - (a.data.value || 0))
                .slice(0, 5)
                .map(item => ({
                    name: item.data.name,
                    value: item.data.value || 0,
                    quantity: item.quantity
                }))
        };
    }

    calculateWeightAnalysis(items) {
        const weights = items.map(item => (item.data.weight || 0) * item.quantity);
        
        return {
            total: weights.reduce((sum, weight) => sum + weight, 0),
            average: weights.length > 0 ? weights.reduce((sum, weight) => sum + weight, 0) / weights.length : 0,
            heaviestItems: items
                .filter(item => item.data.weight > 0)
                .sort((a, b) => b.data.weight - a.data.weight)
                .slice(0, 5)
                .map(item => ({
                    name: item.data.name,
                    weight: item.data.weight,
                    quantity: item.quantity,
                    totalWeight: item.data.weight * item.quantity
                }))
        };
    }

    calculateEfficiencyMetrics(items) {
        const metrics = {
            valuePerWeight: [],
            spaceEfficiency: 0,
            equipmentUtilization: 0
        };

        items.forEach(item => {
            const value = item.data.value || 0;
            const weight = item.data.weight || 1;
            const valuePerWeight = value / weight;
            
            if (value > 0 && weight > 0) {
                metrics.valuePerWeight.push({
                    name: item.data.name,
                    ratio: valuePerWeight,
                    value,
                    weight
                });
            }
        });

        metrics.valuePerWeight.sort((a, b) => b.ratio - a.ratio);
        metrics.valuePerWeight = metrics.valuePerWeight.slice(0, 10);

        // Calculate equipment utilization
        const equipmentSlots = ['head', 'chest', 'clothing', 'legs', 'feet', 'hands', 'mainHand', 'offHand', 'neck', 'finger1', 'finger2'];
        const equippedSlots = equipmentSlots.filter(slot => gameData.player.equipment[slot]);
        metrics.equipmentUtilization = Math.round((equippedSlots.length / equipmentSlots.length) * 100);

        return metrics;
    }

    generateRecommendations(items) {
        const recommendations = [];
        const stats = this.calculateOverviewStats(items);

        // Encumbrance recommendations
        if (stats.encumbrancePercentage > 90) {
            recommendations.push({
                type: 'warning',
                title: 'Heavy Load',
                message: 'You are carrying too much! Consider dropping or selling some items.',
                action: 'Review heavy or low-value items'
            });
        } else if (stats.encumbrancePercentage > 75) {
            recommendations.push({
                type: 'caution',
                title: 'Getting Heavy',
                message: 'Your pack is getting full. Consider managing your inventory soon.',
                action: 'Organize inventory'
            });
        }

        // Value recommendations
        const lowValueItems = items.filter(item => 
            (item.data.value || 0) > 0 && 
            (item.data.value || 0) < 10 && 
            !item.equipped
        );
        
        if (lowValueItems.length > 10) {
            recommendations.push({
                type: 'suggestion',
                title: 'Low Value Items',
                message: `You have ${lowValueItems.length} low-value items that could be sold.`,
                action: 'Sell items worth less than 10 gold'
            });
        }

        // Equipment recommendations
        const equipmentAnalysis = this.calculateEfficiencyMetrics(items);
        if (equipmentAnalysis.equipmentUtilization < 60) {
            recommendations.push({
                type: 'suggestion',
                title: 'Equipment Slots',
                message: 'You have empty equipment slots that could improve your capabilities.',
                action: 'Review available equipment'
            });
        }

        // Consumable recommendations
        const consumables = items.filter(item => item.data.type === 'consumable');
        const healthPotions = consumables.filter(item => 
            item.data.effects && item.data.effects.some(effect => effect.type === 'heal')
        );
        
        if (healthPotions.length === 0) {
            recommendations.push({
                type: 'warning',
                title: 'No Healing Items',
                message: 'You have no healing potions! This could be dangerous in combat.',
                action: 'Acquire healing potions'
            });
        }

        return recommendations;
    }

    calculateMedian(values) {
        if (values.length === 0) return 0;
        
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        
        return sorted.length % 2 === 0 
            ? (sorted[mid - 1] + sorted[mid]) / 2 
            : sorted[mid];
    }

    getTotalWeight() {
        if (!gameData.player.inventory) return 0;
        
        return gameData.player.inventory.reduce((total, item) => {
            const itemId = typeof item === 'string' ? item : item.id;
            const quantity = typeof item === 'string' ? 1 : (item.quantity || 1);
            const itemData = itemsData[itemId];
            return total + ((itemData?.weight || 0) * quantity);
        }, 0) + this.getEquippedWeight();
    }

    getEquippedWeight() {
        return Object.values(gameData.player.equipment)
            .filter(itemId => itemId && itemsData[itemId])
            .reduce((total, itemId) => total + (itemsData[itemId].weight || 0), 0);
    }

    // Generate inventory report
    generateInventoryReport() {
        const stats = this.getInventoryStats();
        
        return {
            timestamp: new Date().toISOString(),
            playerLevel: gameData.player.level,
            playerGold: gameData.player.gold,
            ...stats
        };
    }

    // Export inventory data
    exportInventoryData() {
        const report = this.generateInventoryReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Clear cache (call when inventory changes)
    invalidateCache() {
        this.cachedStats = null;
        this.lastUpdateTime = 0;
    }
}

// Initialize inventory analytics
const inventoryAnalytics = new InventoryAnalytics();

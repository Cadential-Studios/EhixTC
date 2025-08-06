/**
 * Region Utilities
 * Handles region name formatting and styling for consistent display across the game
 */

/**
 * Region configuration mapping lowercase to properly formatted names and colors
 */
const REGION_CONFIG = {
    'frontier': {
        name: 'Frontier',
        color: 'bg-orange-600', // Rugged orange for the frontier
        textColor: 'text-orange-200'
    },
    'pridelands': {
        name: 'Pridelands', 
        color: 'bg-yellow-600', // Golden for leonin territory
        textColor: 'text-yellow-200'
    },
    'gaia': {
        name: 'Gaia',
        color: 'bg-green-600', // Nature green for Gaia
        textColor: 'text-green-200'
    },
    'towns': {
        name: 'Towns',
        color: 'bg-blue-600', // Blue for civilized areas
        textColor: 'text-blue-200'
    },
    'unknown': {
        name: 'Unknown',
        color: 'bg-gray-600',
        textColor: 'text-gray-200'
    }
};

/**
 * Get formatted region display information
 * @param {string} regionKey - The lowercase region key (e.g., 'frontier', 'pridelands')
 * @returns {object} Object containing formatted name, color classes, and utility methods
 */
function getRegionInfo(regionKey) {
    const normalizedKey = regionKey ? regionKey.toLowerCase() : 'unknown';
    const config = REGION_CONFIG[normalizedKey] || REGION_CONFIG.unknown;
    
    return {
        name: config.name,
        color: config.color,
        textColor: config.textColor,
        key: normalizedKey,
        
        // Utility methods for common display patterns
        getDisplayName: () => config.name,
        getBadgeClasses: () => `px-2 py-1 ${config.color} text-white text-xs rounded font-medium`,
        getTextClasses: () => config.textColor,
        
        // Generate HTML badge element
        createBadge: (additionalClasses = '') => 
            `<span class="${config.color} text-white px-2 py-1 text-xs rounded font-medium ${additionalClasses}">${config.name}</span>`,
            
        // Generate styled text span
        createStyledText: (additionalClasses = '') =>
            `<span class="${config.textColor} font-medium ${additionalClasses}">${config.name}</span>`
    };
}

/**
 * Format region name for display (capitalize first letter)
 * @param {string} regionKey - The region key
 * @returns {string} Properly capitalized region name
 */
function formatRegionName(regionKey) {
    return getRegionInfo(regionKey).getDisplayName();
}

/**
 * Get all available regions
 * @returns {Array} Array of region configuration objects
 */
function getAllRegions() {
    return Object.keys(REGION_CONFIG)
        .filter(key => key !== 'unknown')
        .map(key => ({
            key,
            ...REGION_CONFIG[key]
        }));
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        REGION_CONFIG,
        getRegionInfo,
        formatRegionName,
        getAllRegions
    };
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.RegionUtils = {
        REGION_CONFIG,
        getRegionInfo,
        formatRegionName,
        getAllRegions
    };
}

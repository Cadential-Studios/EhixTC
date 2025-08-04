/**
 * Filters and sorts an inventory array based on search text, active filters,
 * and sort criteria. Returns aggregated items with quantities and metadata.
 *
 * @param {Array} inventory - Player inventory array.
 * @param {string} searchTerm - Text to filter item name, description, or type.
 * @param {Object} activeFilters - Filters with `type`, `rarity`, and `usability` keys.
 * @param {Object} sortCriteria - Sorting options with `field` and `direction` keys.
 * @param {Function} canUseItemFn - Function to determine if an item is usable.
 * @returns {Array} Filtered and sorted inventory items.
 */
(function (global) {
  function filterInventoryItems(
    inventory,
    searchTerm,
    activeFilters,
    sortCriteria,
    canUseItemFn = () => true
  ) {
    if (!Array.isArray(inventory)) return [];

    const groupedItems = {};
    inventory.forEach((item) => {
      let itemId;
      let quantity;
      
      // Handle different inventory structures
      if (typeof item === 'string') {
        // Legacy string structure
        itemId = item;
        quantity = 1;
      } else if (item.item) {
        // New structure: {item: "item_id", quantity: number}
        itemId = item.item;
        quantity = item.quantity || 1;
      } else if (item.id) {
        // Legacy object structure: {id: "item_id", quantity: number}
        itemId = item.id;
        quantity = item.quantity || 1;
      } else {
        // Unknown structure, skip
        console.warn('Unknown inventory item structure:', item);
        return;
      }

      if (groupedItems[itemId]) {
        groupedItems[itemId].quantity += quantity;
      } else {
        const itemData =
          (typeof itemsData !== 'undefined' && itemsData[itemId]) || {
            name: itemId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            type: 'misc',
            rarity: 'common',
            description: 'Unknown item',
            value: 0,
            weight: 0,
          };
        groupedItems[itemId] = { id: itemId, quantity, data: itemData };
      }
    });

    let filteredItems = Object.values(groupedItems);

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(
        (item) => {
          // Safety checks to prevent undefined errors
          const name = item.data?.name || '';
          const description = item.data?.description || '';
          const type = item.data?.type || '';
          
          return name.toLowerCase().includes(searchLower) ||
                 description.toLowerCase().includes(searchLower) ||
                 type.toLowerCase().includes(searchLower);
        }
      );
    }

    if (activeFilters.type && activeFilters.type !== 'all') {
      filteredItems = filteredItems.filter(
        (item) => item.data.type === activeFilters.type
      );
    }

    if (activeFilters.rarity && activeFilters.rarity !== 'all') {
      filteredItems = filteredItems.filter(
        (item) => item.data.rarity === activeFilters.rarity
      );
    }

    if (activeFilters.usability && activeFilters.usability !== 'all') {
      filteredItems = filteredItems.filter((item) => {
        return activeFilters.usability === 'usable'
          ? canUseItemFn(item.data)
          : !canUseItemFn(item.data);
      });
    }

    filteredItems.sort((a, b) => {
      let valueA;
      let valueB;

      switch (sortCriteria.field) {
        case 'name':
          valueA = (a.data?.name || '').toLowerCase();
          valueB = (b.data?.name || '').toLowerCase();
          break;
        case 'type':
          valueA = a.data?.type || '';
          valueB = b.data?.type || '';
          break;
        case 'rarity': {
          const rarityOrder = {
            common: 0,
            uncommon: 1,
            rare: 2,
            very_rare: 3,
            legendary: 4,
          };
          valueA = rarityOrder[a.data?.rarity] || 0;
          valueB = rarityOrder[b.data?.rarity] || 0;
          break;
        }
        case 'value':
          valueA = a.data?.value || 0;
          valueB = b.data?.value || 0;
          break;
        case 'weight':
          valueA = a.data?.weight || 0;
          valueB = b.data?.weight || 0;
          break;
        default:
          valueA = (a.data?.name || '').toLowerCase();
          valueB = (b.data?.name || '').toLowerCase();
      }

      if (valueA < valueB)
        return sortCriteria.direction === 'asc' ? -1 : 1;
      if (valueA > valueB)
        return sortCriteria.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filteredItems;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { filterInventoryItems };
  } else {
    global.filterInventoryItems = filterInventoryItems;
  }
})(this);

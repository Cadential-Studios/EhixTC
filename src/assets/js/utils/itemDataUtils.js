// Universal item data lookup for Edoria
// Returns a full item object from itemsData, or a fallback minimal object if not found
export function getItemData(id) {
    if (!id) return null;
    if (window.itemsData && window.itemsData[id]) {
        return window.itemsData[id];
    }
    // fallback: minimal object
    return { id, name: id, icon: '', description: '' };
}

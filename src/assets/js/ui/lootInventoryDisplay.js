// Universal Loot Inventory Display Modal
// Shows lootable items and player inventory side by side, allowing transfer

export function showLootInventoryDisplay({ lootItems, onComplete }) {
    // Remove any existing modal
    const existing = document.getElementById('loot-inventory-modal');
    if (existing) existing.remove();

    // Modal overlay
    const modal = document.createElement('div');
    modal.id = 'loot-inventory-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[200]';
    modal.style.backdropFilter = 'blur(4px)';

    // Modal content (Crafting menu inspired)
    const content = document.createElement('div');
    content.className = 'flex flex-col md:flex-row gap-4 bg-gray-900 border-2 border-blue-400 rounded-xl p-4 shadow-xl max-w-2xl w-full mx-2 relative';

    // Loot inventory card
    const lootCard = document.createElement('div');
    lootCard.className = 'flex-1 min-w-[160px] bg-gray-800 rounded-lg p-2 shadow flex flex-col border border-blue-900';
    lootCard.innerHTML = `<h2 class="font-cinzel text-base text-blue-300 mb-2 tracking-wide">Loot</h2>`;
    const lootList = document.createElement('ul');
    lootList.className = 'space-y-1 overflow-y-auto max-h-56';

    // Player inventory card
    const playerCard = document.createElement('div');
    playerCard.className = 'flex-1 min-w-[160px] bg-gray-800 rounded-lg p-2 shadow flex flex-col border border-green-900';
    playerCard.innerHTML = `<h2 class="font-cinzel text-base text-green-300 mb-2 tracking-wide">Your Inventory</h2>`;
    const playerList = document.createElement('ul');
    playerList.className = 'space-y-1 overflow-y-auto max-h-56';

    // Helper to get item data
    function getItemData(id) {
        return (window.itemsData && window.itemsData[id]) || { name: id, icon: '', description: '' };
    }

    // State
    let loot = Array.isArray(lootItems) ? lootItems.map(i => ({ ...i })) : [];
    let playerInv = Array.isArray(gameData?.player?.inventory) ? gameData.player.inventory.map(i => ({ ...(typeof i === 'object' ? i : { id: i, qty: 1 }) })) : [];

    // Render functions
    function renderLoot() {
        lootList.innerHTML = '';
        if (loot.length === 0) {
            lootList.innerHTML = '<li class="text-gray-400 italic text-xs px-2 py-1">No loot remaining.</li>';
        } else {
            loot.forEach((item, idx) => {
                const data = getItemData(item.id);
                const li = document.createElement('li');
                li.className = 'flex items-center gap-2 bg-gray-700 rounded px-2 py-1 cursor-pointer hover:bg-blue-800 transition text-xs';
                li.innerHTML = `
                    <img src="${data.icon || 'src/assets/images/dice.png'}" alt="" class="w-6 h-6 object-contain rounded shadow" />
                    <span class="font-cinzel text-white">${data.name}</span>
                    <span class="ml-auto text-blue-200 font-bold">x${item.qty}</span>
                `;
                li.title = data.description || '';
                li.onclick = () => {
                    transferToPlayer(idx);
                };
                lootList.appendChild(li);
            });
        }
    }

    function renderPlayer() {
        playerList.innerHTML = '';
        if (playerInv.length === 0) {
            playerList.innerHTML = '<li class="text-gray-400 italic text-xs px-2 py-1">Inventory empty.</li>';
        } else {
            playerInv.forEach((item, idx) => {
                const data = getItemData(item.id);
                const li = document.createElement('li');
                li.className = 'flex items-center gap-2 bg-gray-700 rounded px-2 py-1 text-xs';
                li.innerHTML = `
                    <img src="${data.icon || 'src/assets/images/dice.png'}" alt="" class="w-6 h-6 object-contain rounded shadow" />
                    <span class="font-cinzel text-white">${data.name}</span>
                    <span class="ml-auto text-green-200 font-bold">x${item.qty}</span>
                `;
                li.title = data.description || '';
                playerList.appendChild(li);
            });
        }
    }

    // Transfer logic
    function transferToPlayer(lootIdx) {
        const item = loot[lootIdx];
        if (!item) return;
        // Remove from loot
        if (item.qty > 1) {
            item.qty--;
        } else {
            loot.splice(lootIdx, 1);
        }
        // Add to player inventory (stack if possible)
        const invIdx = playerInv.findIndex(i => i.id === item.id);
        if (invIdx >= 0) {
            playerInv[invIdx].qty++;
        } else {
            playerInv.push({ id: item.id, qty: 1 });
        }
        renderLoot();
        renderPlayer();
    }

    // Confirm/close button
    const doneBtn = document.createElement('button');
    doneBtn.className = 'mt-4 bg-blue-600 hover:bg-blue-700 text-white font-cinzel font-bold py-2 px-6 rounded transition-all duration-200 transform hover:scale-105 shadow self-center text-sm';
    doneBtn.textContent = 'Done';
    doneBtn.onclick = () => {
        // Actually add items to player inventory
        if (Array.isArray(gameData?.player?.inventory)) {
            gameData.player.inventory = playerInv;
        }
        modal.remove();
        if (typeof onComplete === 'function') onComplete(playerInv);
    };

    // Assemble
    lootCard.appendChild(lootList);
    playerCard.appendChild(playerList);
    content.appendChild(lootCard);
    content.appendChild(playerCard);
    content.appendChild(doneBtn);
    modal.appendChild(content);
    document.body.appendChild(modal);

    // Initial render
    renderLoot();
    renderPlayer();

    // Escape key closes
    modal.tabIndex = 0;
    modal.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            modal.remove();
        }
    });
    setTimeout(() => modal.focus(), 100);
}

class ForagingSystem {
    forage(locationId) {
        const location = locationsData[locationId];
        if (!location || !location.foragable) {
            showGameMessage('There is nothing to forage here.', 'warning');
            return;
        }

        const table = lootTablesData[location.loot_table];
        if (!table) {
            showGameMessage('No forage data available.', 'failure');
            return;
        }

        let bonus = getSkillModifier('survival');
        const hasKit = gameData.player.inventory.some(it => (it.id || it) === 'herbalism_kit');
        if (hasKit) bonus += 2;

        const roll = rollDice(1, 20)[0] + bonus;
        const found = [];

        table.items.forEach(entry => {
            if (roll >= entry.required_dc_threshold) {
                if (entry.requires_tool && !gameData.player.inventory.some(it => (it.id || it) === entry.requires_tool)) {
                    return;
                }
                if (Math.random() * 100 <= entry.chance) {
                    const qty = Math.floor(Math.random() * (entry.amount.max - entry.amount.min + 1)) + entry.amount.min;
                    craftingManager.addItemToInventory(entry.item, qty);
                    found.push(`${qty} ${entry.item.replace(/_/g, ' ')}`);
                }
            }
        });

        if (found.length === 0) {
            showGameMessage('You find nothing of value.', 'info');
        } else {
            showGameMessage(`You found: ${found.join(', ')}`, 'success');
        }
    }
}

const foragingSystem = new ForagingSystem();

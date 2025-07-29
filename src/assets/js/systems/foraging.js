class ForagingSystem {
    async forage(locationId) {
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

        // Show foraging progress bar and dice roll in the same modal
        showForagingProgressWithDice({
            duration: 2000,
            onComplete: (roll, skillMod, dc, continueCallback) => {
                // Advance in-game time by 30 minutes (1800000 ms)
                if (typeof advanceTime === 'function') {
                    advanceTime(1800000); // 30 minutes
                } else if (gameData && gameData.time) {
                    gameData.time.minute += 30;
                    if (gameData.time.minute >= 60) {
                        gameData.time.hour += Math.floor(gameData.time.minute / 60);
                        gameData.time.minute = gameData.time.minute % 60;
                    }
                }
                // Wait for user to press Continue on dice roller UI, then show foraging result
                const showResult = () => {
                    this.finishForageWithAnimation(location, table, skillMod, dc, roll);
                };
                if (typeof continueCallback === 'function') {
                    continueCallback(showResult);
                } else {
                    // fallback: show after 1.2s
                    setTimeout(showResult, 1200);
                }
            },
            getSkillModAndDC: () => {
                const skillMod = getSkillModifier('survival') + (gameData.player.inventory.some(it => (it.id || it) === 'herbalism_kit') ? 2 : 0);
                let dc = 5;
                if (table.items && table.items.length > 0) {
                    dc = Math.min(...table.items.map(entry => entry.required_dc_threshold || 5));
                }
                return { skillMod, dc };
            }
        });
    }

    // Shows a cool animation of what was gathered after dice roll
    finishForageWithAnimation(location, table, skillMod, dc, roll) {
        if (typeof roll !== 'number') roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + skillMod;
        const found = [];

        // Ensure itemsData is loaded globally
        if (!window.itemsData) {
            window.itemsData = {};
        }
        table.items.forEach(entry => {
            if (total >= entry.required_dc_threshold) {
                if (entry.requires_tool && !gameData.player.inventory.some(it => (it.id || it) === entry.requires_tool)) {
                    return;
                }
                if (Math.random() * 100 <= entry.chance) {
                    const qty = Math.floor(Math.random() * (entry.amount.max - entry.amount.min + 1)) + entry.amount.min;
                    // Always use item id for lookup and display
                    found.push({
                        id: entry.item,
                        qty
                    });
                    // Add to inventory using id
                    craftingManager.addItemToInventory(entry.item, qty);
                }
            }
        });

        // Animate the foraged items in a modal
        showForageResultAnimation(found);
        if (typeof updateDisplay === 'function') updateDisplay();
    }
}

const foragingSystem = new ForagingSystem();

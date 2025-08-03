
// Ensure showForageResultAnimation is available globally before class definition
async function ensureShowForageResultAnimation() {
    if (typeof window.showForageResultAnimation !== 'function') {
        try {
            const mod = await import('../ui/foragingModal.js');
            if (mod && typeof mod.showForageResultAnimation === 'function') {
                window.showForageResultAnimation = mod.showForageResultAnimation;
            }
        } catch (e) {
            console.error('Error importing foragingModal.js:', e);
        }
    }
}

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
            duration: 5000,
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
        // Use universal getItemData for all lookups
        import('../utils/itemDataUtils.js').then(({ getItemData }) => {
            table.items.forEach(entry => {
                if (total >= entry.required_dc_threshold) {
                    if (entry.requires_tool && !gameData.player.inventory.some(it => (it.id || it) === entry.requires_tool)) {
                        return;
                    }
                    if (Math.random() * 100 <= entry.chance) {
                        const qty = Math.floor(Math.random() * (entry.amount.max - entry.amount.min + 1)) + entry.amount.min;
                        // Always use item id for lookup and display
                        const itemObj = getItemData(entry.item);
                        found.push({
                            id: entry.item,
                            qty,
                            name: itemObj.name,
                            icon: itemObj.icon,
                            description: itemObj.description
                        });
                        // Add to inventory using id
                        craftingManager.addItemToInventory(entry.item, qty);
                    }
                }
            });
        }).then(() => {
            
            // Show loot inventory modal after dice modal closes
            const showResults = () => {
                import('../ui/lootInventoryDisplay.js').then(mod => {
                    if (mod && typeof mod.showLootInventoryDisplay === 'function') {
                        mod.showLootInventoryDisplay({
                            lootItems: found,
                            onComplete: () => {
                                if (typeof updateDisplay === 'function') updateDisplay();
                            }
                        });
                    } else {
                        alert('Foraged: ' + found.map(f => `${f.qty}x ${f.id}`).join(', '));
                        if (typeof updateDisplay === 'function') updateDisplay();
                    }
                }).catch(() => {
                    alert('Foraged: ' + found.map(f => `${f.qty}x ${f.id}`).join(', '));
                    if (typeof updateDisplay === 'function') updateDisplay();
                });
            };


            // If diceRoller modal is still open, wait for it to close
            if (window.diceRoller && window.diceRoller.currentModal) {
                const observer = new MutationObserver(() => {
                    if (!window.diceRoller.currentModal || !document.body.contains(window.diceRoller.currentModal)) {
                        observer.disconnect();
                        setTimeout(showResults, 50);
                    }
                });
                observer.observe(document.body, { childList: true });
            } else {
                setTimeout(showResults, 100);
            }
        });
    }
}

// Ensure the animation function is loaded before using the foraging system
await ensureShowForageResultAnimation();
const foragingSystem = new ForagingSystem();

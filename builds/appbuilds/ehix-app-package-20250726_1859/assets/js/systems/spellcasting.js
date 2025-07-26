// Magic System & Spellcasting Module
// Ehix - The Triune Convergence - Magic Management

// Spell slot management
const spellSlots = {
    level_1: { max: 0, current: 0 },
    level_2: { max: 0, current: 0 },
    level_3: { max: 0, current: 0 },
    level_4: { max: 0, current: 0 },
    level_5: { max: 0, current: 0 },
    level_6: { max: 0, current: 0 },
    level_7: { max: 0, current: 0 },
    level_8: { max: 0, current: 0 },
    level_9: { max: 0, current: 0 }
};

// Known spells and prepared spells
const playerSpells = {
    cantrips: [],
    known: [],
    prepared: [],
    spellbook: [] // For wizards
};

// Spell data cache
let spellData = null;

// Initialize spell system
async function initializeSpellSystem() {
    try {
        const response = await fetch('./data/spells.json');
        spellData = await response.json();
        console.log('Spell system initialized');
        updateSpellSlotsForLevel();
    } catch (error) {
        console.error('Failed to load spell data:', error);
    }
}

// Update spell slots based on character level and class
function updateSpellSlotsForLevel() {
    const player = gameData.player;
    const characterClass = player.characterClass;
    const level = player.level || 1;
    
    // Spell slot progression table (simplified D&D 5e)
    const spellSlotTable = {
        1: { level_1: 2 },
        2: { level_1: 3 },
        3: { level_1: 4, level_2: 2 },
        4: { level_1: 4, level_2: 3 },
        5: { level_1: 4, level_2: 3, level_3: 2 },
        6: { level_1: 4, level_2: 3, level_3: 3 },
        7: { level_1: 4, level_2: 3, level_3: 3, level_4: 1 },
        8: { level_1: 4, level_2: 3, level_3: 3, level_4: 2 },
        9: { level_1: 4, level_2: 3, level_3: 3, level_4: 3, level_5: 1 }
    };
    
    // Reset spell slots
    Object.keys(spellSlots).forEach(level => {
        spellSlots[level].max = 0;
        spellSlots[level].current = 0;
    });
    
    // Check if class can cast spells
    if (characterClass === 'wizard' || characterClass === 'cleric' || characterClass === 'sorcerer') {
        const slots = spellSlotTable[Math.min(level, 9)] || {};
        
        Object.keys(slots).forEach(slotLevel => {
            if (spellSlots[slotLevel]) {
                spellSlots[slotLevel].max = slots[slotLevel];
                spellSlots[slotLevel].current = slots[slotLevel];
            }
        });
    }
    
    updateSpellUI();
}

// Add starting spells based on class
function initializeStartingSpells() {
    const player = gameData.player;
    const characterClass = player.characterClass;
    
    // Clear existing spells
    playerSpells.cantrips = [];
    playerSpells.known = [];
    playerSpells.prepared = [];
    
    switch (characterClass) {
        case 'wizard':
            playerSpells.cantrips = ['prestidigitation', 'mage_hand', 'fire_bolt'];
            playerSpells.spellbook = ['magic_missile', 'shield', 'cure_wounds'];
            playerSpells.prepared = ['magic_missile', 'shield'];
            break;
            
        case 'cleric':
            playerSpells.cantrips = ['sacred_flame', 'prestidigitation'];
            playerSpells.prepared = ['cure_wounds', 'healing_word'];
            break;
            
        case 'sorcerer':
            playerSpells.cantrips = ['fire_bolt', 'mage_hand'];
            playerSpells.known = ['magic_missile', 'shield'];
            break;
    }
    
    updateSpellUI();
}

// Cast a spell
function castSpell(spellId, targetLevel = null) {
    if (!spellData) {
        showGameMessage('Spell system not initialized!', 'error');
        return;
    }
    
    const spell = findSpell(spellId);
    if (!spell) {
        showGameMessage('Spell not found!', 'error');
        return;
    }
    
    // Determine spell level to cast at
    const castLevel = targetLevel || spell.level;
    
    // Check if it's a cantrip (no spell slot required)
    if (spell.level === 0) {
        executeSpell(spell, 0);
        return;
    }
    
    // Check if we have spell slots
    const slotLevel = `level_${castLevel}`;
    if (!spellSlots[slotLevel] || spellSlots[slotLevel].current <= 0) {
        showGameMessage(`No ${getOrdinal(castLevel)} level spell slots remaining!`, 'warning');
        return;
    }
    
    // Consume spell slot
    spellSlots[slotLevel].current--;
    
    // Execute the spell
    executeSpell(spell, castLevel);
    updateSpellUI();
}

// Execute spell effects
function executeSpell(spell, castLevel) {
    console.log(`Casting ${spell.name} at level ${castLevel}`);
    
    switch (spell.attackType) {
        case 'spell_attack':
            performSpellAttack(spell, castLevel);
            break;
            
        case 'saving_throw':
            performSpellSave(spell, castLevel);
            break;
            
        case 'healing':
            performSpellHealing(spell, castLevel);
            break;
            
        case 'auto_hit':
            performAutoHitSpell(spell, castLevel);
            break;
            
        case 'buff':
            performSpellBuff(spell, castLevel);
            break;
            
        case 'utility':
            performUtilitySpell(spell, castLevel);
            break;
            
        default:
            showGameMessage(`${spell.name} cast successfully!`, 'success');
            break;
    }
    
    addCombatMessage(`<i class="ph-duotone ph-magic-wand"></i> ${spell.name} cast!`, 'magic');
}

// Spell attack (vs AC)
function performSpellAttack(spell, castLevel) {
    if (!combatState.inCombat) {
        showGameMessage('Must be in combat to cast attack spells!', 'warning');
        return;
    }
    
    // Show target selection for combat spells
    showSpellTargetSelection(spell, castLevel);
}

// Spell saving throw
function performSpellSave(spell, castLevel) {
    const spellSaveDC = 8 + getProficiencyBonus() + getSpellcastingModifier();
    const damage = calculateSpellDamage(spell, castLevel);
    
    addCombatMessage(`<i class="ph-duotone ph-magic-wand"></i> ${spell.name} cast! Save DC: ${spellSaveDC}`, 'magic');
    
    if (spell.areaType) {
        addCombatMessage(`Area effect: ${spell.areaSize} ${spell.areaType}`, 'info');
    }
    
    // For simplicity, assume enemies fail saves half the time
    const saveSuccessful = Math.random() < 0.5;
    const finalDamage = saveSuccessful ? Math.floor(damage / 2) : damage;
    
    addCombatMessage(`${saveSuccessful ? 'Save successful' : 'Save failed'}! ${finalDamage} ${spell.damageType} damage dealt!`, saveSuccessful ? 'info' : 'damage');
}

// Spell healing
function performSpellHealing(spell, castLevel) {
    const healingAmount = calculateSpellHealing(spell, castLevel);
    
    // Heal the player
    const player = gameData.player;
    const oldHP = player.hitPoints;
    player.hitPoints = Math.min(player.hitPoints + healingAmount, player.maxHitPoints);
    const actualHealing = player.hitPoints - oldHP;
    
    addCombatMessage(`<i class="ph-duotone ph-heart"></i> ${spell.name} heals for ${actualHealing} HP!`, 'healing');
    updateCharacterStats();
}

// Auto-hit spells (like Magic Missile)
function performAutoHitSpell(spell, castLevel) {
    if (spell.id === 'magic_missile') {
        let missiles = spell.missiles || 1;
        
        // Add extra missiles for higher level casting
        if (castLevel > spell.level) {
            missiles += (castLevel - spell.level);
        }
        
        const damagePerMissile = rollDicePool(spell.damage).total;
        const totalDamage = damagePerMissile * missiles;
        
        addCombatMessage(`<i class="ph-duotone ph-magic-wand"></i> ${missiles} Magic Missiles hit for ${totalDamage} force damage!`, 'damage');
    }
}

// Spell buffs and effects
function performSpellBuff(spell, castLevel) {
    addCombatMessage(`<i class="ph-duotone ph-magic-wand"></i> ${spell.name} applied!`, 'buff');
    
    if (spell.effect) {
        const [effectType, value] = spell.effect.split(':');
        applySpellEffect(effectType, parseInt(value), spell.duration);
    }
}

// Utility spells
function performUtilitySpell(spell, castLevel) {
    addCombatMessage(`<i class="ph-duotone ph-magic-wand"></i> ${spell.name} activated!`, 'utility');
    showGameMessage(`${spell.name}: ${spell.description}`, 'info');
}

// Calculate spell damage
function calculateSpellDamage(spell, castLevel) {
    let damage = rollDicePool(spell.damage).total;
    
    // Add upcasting bonus
    if (castLevel > spell.level && spell.upcastBonus) {
        const extraLevels = castLevel - spell.level;
        if (spell.upcastBonus.includes('d6')) {
            damage += extraLevels * rollDicePool('1d6').total;
        }
    }
    
    return damage;
}

// Calculate spell healing
function calculateSpellHealing(spell, castLevel) {
    let healing = rollDicePool(spell.healing).total;
    
    // Add spellcasting modifier
    healing += getSpellcastingModifier();
    
    // Add upcasting bonus
    if (castLevel > spell.level && spell.upcastBonus) {
        const extraLevels = castLevel - spell.level;
        if (spell.upcastBonus.includes('d4')) {
            healing += extraLevels * rollDicePool('1d4').total;
        } else if (spell.upcastBonus.includes('d8')) {
            healing += extraLevels * rollDicePool('1d8').total;
        }
    }
    
    return healing;
}

// Get spellcasting ability modifier
function getSpellcastingModifier() {
    const player = gameData.player;
    const characterClass = player.characterClass;
    
    switch (characterClass) {
        case 'wizard':
            return getAbilityModifier('intelligence');
        case 'cleric':
            return getAbilityModifier('wisdom');
        case 'sorcerer':
            return getAbilityModifier('charisma');
        default:
            return 0;
    }
}

// Find spell by ID
function findSpell(spellId) {
    if (!spellData) return null;
    
    // Search through all spell levels
    for (const level in spellData) {
        if (spellData[level][spellId]) {
            return spellData[level][spellId];
        }
    }
    return null;
}

// Show spell menu
function openSpellMenu() {
    if (!spellData) {
        initializeSpellSystem();
        showGameMessage('Loading spell system...', 'info');
        return;
    }
    
    const spellMenu = document.getElementById('spell-menu');
    if (spellMenu) {
        populateSpellMenu();
        spellMenu.style.display = 'block';
    }
}

// Close spell menu
function closeSpellMenu() {
    const spellMenu = document.getElementById('spell-menu');
    if (spellMenu) {
        spellMenu.style.display = 'none';
    }
}

// Populate spell menu with available spells
function populateSpellMenu() {
    updateSpellSlotsDisplay();
    updateAvailableSpells();
}

// Update spell slots display
function updateSpellSlotsDisplay() {
    const slotsContainer = document.getElementById('spell-slots-container');
    if (!slotsContainer) return;
    
    slotsContainer.innerHTML = '';
    
    Object.keys(spellSlots).forEach(level => {
        const slots = spellSlots[level];
        if (slots.max > 0) {
            const levelNum = level.split('_')[1];
            const slotRow = document.createElement('div');
            slotRow.className = 'spell-slots-row';
            slotRow.innerHTML = `
                <span class="spell-level-label">${getOrdinal(levelNum)} Level:</span>
                <div class="spell-slots">
                    ${Array.from({length: slots.max}, (_, i) => 
                        `<div class="spell-slot ${i < slots.current ? 'available' : 'used'}"></div>`
                    ).join('')}
                </div>
                <span class="spell-slots-text">${slots.current}/${slots.max}</span>
            `;
            slotsContainer.appendChild(slotRow);
        }
    });
}

// Update available spells display
function updateAvailableSpells() {
    const spellContainer = document.getElementById('spell-categories');
    if (!spellContainer) return;
    
    spellContainer.innerHTML = '';
    
    // Add cantrips
    addSpellCategory('Cantrips', playerSpells.cantrips, 0);
    
    // Add prepared spells by level
    for (let level = 1; level <= 9; level++) {
        const spellsAtLevel = getSpellsAtLevel(level);
        if (spellsAtLevel.length > 0) {
            addSpellCategory(`${getOrdinal(level)} Level`, spellsAtLevel, level);
        }
    }
}

// Add spell category to menu
function addSpellCategory(title, spellIds, level) {
    const container = document.getElementById('spell-categories');
    if (!container) return;
    
    const category = document.createElement('div');
    category.className = 'spell-category';
    
    const header = document.createElement('h4');
    header.textContent = title;
    category.appendChild(header);
    
    const spellGrid = document.createElement('div');
    spellGrid.className = 'spell-grid';
    
    spellIds.forEach(spellId => {
        const spell = findSpell(spellId);
        if (spell) {
            const spellElement = createSpellElement(spell, level);
            spellGrid.appendChild(spellElement);
        }
    });
    
    category.appendChild(spellGrid);
    container.appendChild(category);
}

// Create spell element for menu
function createSpellElement(spell, level) {
    const canCast = level === 0 || hasSpellSlot(level);
    
    const spellDiv = document.createElement('div');
    spellDiv.className = `spell-item ${canCast ? '' : 'unavailable'}`;
    spellDiv.innerHTML = `
        <div class="spell-name">${spell.name}</div>
        <div class="spell-info">${spell.school} • ${spell.castingTime}</div>
        <div class="spell-description">${spell.description.substring(0, 100)}...</div>
    `;
    
    if (canCast) {
        spellDiv.onclick = () => {
            closeSpellMenu();
            castSpell(spell.id, level);
        };
    }
    
    return spellDiv;
}

// Check if we have a spell slot of given level or higher
function hasSpellSlot(level) {
    for (let i = level; i <= 9; i++) {
        const slotLevel = `level_${i}`;
        if (spellSlots[slotLevel] && spellSlots[slotLevel].current > 0) {
            return true;
        }
    }
    return false;
}

// Get spells at specific level
function getSpellsAtLevel(level) {
    const characterClass = gameData.player.characterClass;
    
    if (characterClass === 'wizard') {
        return playerSpells.prepared.filter(spellId => {
            const spell = findSpell(spellId);
            return spell && spell.level === level;
        });
    } else {
        return playerSpells.known.filter(spellId => {
            const spell = findSpell(spellId);
            return spell && spell.level === level;
        });
    }
}

// Update spell-related UI elements
function updateSpellUI() {
    updateSpellSlotsDisplay();
    updateCharacterStats(); // Update any spell-related character display
}

// Long rest - restore all spell slots
function longRest() {
    Object.keys(spellSlots).forEach(level => {
        spellSlots[level].current = spellSlots[level].max;
    });
    
    showGameMessage('Spell slots restored after long rest!', 'success');
    updateSpellUI();
}

// Utility function for ordinal numbers
function getOrdinal(num) {
    const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
    return ordinals[num] || `${num}th`;
}

// Apply spell effect
function applySpellEffect(effectType, value, duration) {
    // This would integrate with a more comprehensive buff/debuff system
    switch (effectType) {
        case 'ac_bonus':
            // Temporary AC bonus implementation
            showGameMessage(`AC increased by ${value} for ${duration}!`, 'buff');
            break;
    }
}

// Show spell target selection (for combat spells)
function showSpellTargetSelection(spell, castLevel) {
    // This would integrate with the existing combat target selection
    // For now, just show a message
    showGameMessage(`Select target for ${spell.name}`, 'info');
}

// Initialize spell system when the page loads
if (typeof gameData !== 'undefined' && gameData.player) {
    initializeSpellSystem();
}

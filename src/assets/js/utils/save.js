// Save System Module
// Edoria: The Triune Convergence - Save/Load Management

function getSaveSlots() {
    const saves = localStorage.getItem(SAVE_KEY);
    return saves ? JSON.parse(saves) : [];
}

function setSaveSlots(slots) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
}

function createSaveData() {
    return {
        saveId: `save_${Date.now()}`,
        gameVersion: GAME_VERSION,
        timestamp: new Date().toISOString(),
        data: JSON.parse(JSON.stringify({
            player: gameData.player,
            time: gameData.time,
            story: gameData.story,
            settings: gameData.settings
        }))
    };
}

function saveGame() {
    if(!confirm('Save game? This may overwrite the oldest save.')) return;
    const slots = getSaveSlots();
    if(slots.length >= SAVE_SLOT_LIMIT) {
        slots.shift();
    }
    slots.push(createSaveData());
    setSaveSlots(slots);
    populateSaveSlots();
    displaySaveMessage('Game saved');
}

function saveToSlot(index) {
    if(!confirm('Overwrite save slot ' + (index+1) + '?')) return;
    const slots = getSaveSlots();
    slots[index] = createSaveData();
    setSaveSlots(slots);
    populateSaveSlots();
    displaySaveMessage('Game saved');
}

function loadGame(index) {
    const slots = getSaveSlots();
    const save = slots[index];
    if(!save) return;
    
    const { player, time, story, settings } = save.data;
    gameData.player = player;
    gameData.time = time;
    gameData.story = story;
    gameData.settings = settings;
    
    if(gameData.story.currentScene) {
        renderScene(gameData.story.currentScene);
    } else {
        renderLocation(gameData.player.location || 'westwalker_camp');
    }
    updateDisplay();
    displaySaveMessage('Game loaded');
}

function populateSaveSlots() {
    const slots = getSaveSlots();
    const container = document.getElementById('save-slots');
    if(!container) return;
    
    container.innerHTML = slots.map((s,i)=>`
        <div class="flex justify-between items-center mb-2">
            <span class="text-sm">Slot ${i+1} - ${new Date(s.timestamp).toLocaleString()}</span>
            <div>
                <button class="load-save-btn action-button px-2 py-1 mr-1" data-slot="${i}">Load</button>
                <button class="delete-save-btn action-button px-2 py-1" data-slot="${i}">Delete</button>
            </div>
        </div>
    `).join('') || '<p class="text-gray-400">No saves.</p>';
    
    container.querySelectorAll('.load-save-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            loadGame(parseInt(btn.dataset.slot));
        });
    });
    
    container.querySelectorAll('.delete-save-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            deleteSave(parseInt(btn.dataset.slot));
        });
    });
}

function deleteSave(index) {
    if(!confirm('Delete this save?')) return;
    const slots = getSaveSlots();
    slots.splice(index,1);
    setSaveSlots(slots);
    populateSaveSlots();
    displaySaveMessage('Save deleted');
}

function displaySaveMessage(msg) {
    const msgEl = document.getElementById('save-message');
    if(!msgEl) return;
    msgEl.textContent = msg;
    msgEl.style.display = 'block';
    setTimeout(()=>{ msgEl.style.display = 'none'; },2000);
}

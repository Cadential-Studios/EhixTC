// Journal System - Edoria: The Triune Convergence
// Centralized journal functionality for managing all types of journal entries

// Import base system class
// Assuming BaseSystem is available globally, otherwise would need proper module loading

// Main Journal System Class - extends BaseSystem for proper modular architecture
class JournalSystem extends BaseSystem {
    constructor(config = {}) {
        super(config);
        
        // Initialize subsystems
        this.systems = {
            bestiary: new BeastiarySystem(),
            lore: new LoreSystem(),
            locations: new LocationSystem(),
            npcs: new NPCSystem(),
            quests: new QuestSystem(), // Fixed class name
            notes: new NotesSystem(),
            calendar: new CalendarSystem()
        };
        
        this.pinnedEntries = new Set();
        this.searchFilters = new Map();
        this.activeTab = 'all';
        this.discoveredEntries = new Map();
    }

    // Get default configuration
    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            autoSave: true,
            maxHistorySize: 500,
            enableNotifications: true
        };
    }

    // System initialization
    async onInitialize() {
        this.log('info', 'Initializing Journal System');
        
        // Initialize subsystems
        for (const [name, system] of Object.entries(this.systems)) {
            if (system.initialize) {
                await system.initialize({
                    eventBus: this.eventBus,
                    dataManager: this.dataManager,
                    parent: this
                });
            }
        }

        // Load journal data from game data
        this.loadJournalData();
        
        this.log('info', 'Journal System initialized successfully');
    }

    // Set up event listeners
    setupEventListeners() {
        // Check if EVENTS is available, if not use fallback event names
        const EVENTS = window.EVENTS || {
            LOCATION_DISCOVERED: 'LOCATION_DISCOVERED',
            NPC_MET: 'NPC_MET',
            MONSTER_ENCOUNTERED: 'MONSTER_ENCOUNTERED',
            LORE_DISCOVERED: 'LORE_DISCOVERED',
            QUEST_STARTED: 'QUEST_STARTED',
            QUEST_COMPLETED: 'QUEST_COMPLETED',
            JOURNAL_ENTRY_ADDED: 'JOURNAL_ENTRY_ADDED',
            JOURNAL_ENTRY_UPDATED: 'JOURNAL_ENTRY_UPDATED',
            JOURNAL_ENTRY_PINNED: 'JOURNAL_ENTRY_PINNED',
            JOURNAL_ENTRY_UNPINNED: 'JOURNAL_ENTRY_UNPINNED',
            JOURNAL_TAB_CHANGED: 'JOURNAL_TAB_CHANGED',
            GAME_SAVED: 'GAME_SAVED'
        };
        
        // Listen for discovery events
        this.on(EVENTS.LOCATION_DISCOVERED, (data) => this.onLocationDiscovered(data));
        this.on(EVENTS.NPC_MET, (data) => this.onNPCMet(data));
        this.on(EVENTS.MONSTER_ENCOUNTERED, (data) => this.onMonsterEncountered(data));
        this.on(EVENTS.LORE_DISCOVERED, (data) => this.onLoreDiscovered(data));
        this.on(EVENTS.QUEST_STARTED, (data) => this.onQuestStarted(data));
        this.on(EVENTS.QUEST_COMPLETED, (data) => this.onQuestCompleted(data));
        
        // Store EVENTS reference for use in other methods
        this.EVENTS = EVENTS;
    }

    // Load existing journal data from game save
    loadJournalData() {
        if (!this.dataManager) {
            this.log('warn', 'No data manager available, using gameData directly');
            const gameData = window.gameData;
            if (!gameData?.player) return;
            this.loadFromGameData(gameData.player);
            return;
        }
        
        const playerData = this.dataManager.get('player');
        if (!playerData) return;
        
        this.loadFromGameData(playerData);
    }

    // Load journal data from player data object
    loadFromGameData(playerData) {
        // Ensure proper data structure exists
        this.ensureDataStructure(playerData);
        
        // Load existing pins
        if (playerData.journalPins) {
            this.pinnedEntries = new Set(playerData.journalPins);
        }

        // Load journal entries if they exist
        if (playerData.journal && Array.isArray(playerData.journal)) {
            playerData.journal.forEach(entry => {
                this.addJournalEntry(entry);
            });
        }

        // Load discovered entries
        if (playerData.discoveredEntries) {
            this.discoveredEntries = new Map(Object.entries(playerData.discoveredEntries));
        }
    }

    // Ensure proper data structure exists
    ensureDataStructure(playerData) {
        // Fix the quest structure issue that was causing the error
        if (!playerData.quests) {
            playerData.quests = { active: [], completed: [] };
        } else {
            // Fix the completed quests being an object instead of array
            if (typeof playerData.quests.completed === 'object' && !Array.isArray(playerData.quests.completed)) {
                // Convert object to array if needed
                const completedArray = [];
                for (const [key, value] of Object.entries(playerData.quests.completed)) {
                    if (typeof value === 'string') {
                        completedArray.push({ id: key, text: value, completedAt: Date.now() });
                    } else if (typeof value === 'object') {
                        completedArray.push({ id: key, ...value });
                    }
                }
                playerData.quests.completed = completedArray;
            }
            
            // Ensure active is array
            if (!Array.isArray(playerData.quests.active)) {
                playerData.quests.active = [];
            }
        }

        // Ensure other journal-related structures exist
        if (!playerData.journal) {
            playerData.journal = [];
        }
        if (!playerData.journalPins) {
            playerData.journalPins = [];
        }
        if (!playerData.journalNotes) {
            playerData.journalNotes = {};
        }
        if (!playerData.discoveredEntries) {
            playerData.discoveredEntries = {};
        }
    }

    // Add a journal entry from various sources (dialogue, events, etc.)
    addJournalEntry(entry) {
        if (typeof entry === 'string') {
            // Determine entry type based on content or default to lore
            this.systems.lore.addEntry(new LoreEntry(entry, entry, new Date()));
        } else if (entry.type) {
            switch (entry.type) {
                case 'quest':
                    this.systems.quests.addEntry(new QuestEntry(entry));
                    break;
                case 'lore':
                    this.systems.lore.addEntry(new LoreEntry(entry.title, entry.text, new Date()));
                    break;
                case 'npc':
                    this.systems.npcs.addEntry(new NPCEntry(entry));
                    break;
                case 'location':
                    this.systems.locations.addEntry(new LocationEntry(entry));
                    break;
                case 'bestiary':
                    this.systems.bestiary.addEntry(new BeastieryEntry(entry));
                    break;
                case 'note':
                    this.systems.notes.addEntry(new NoteEntry(entry));
                    break;
                default:
                    this.systems.lore.addEntry(new LoreEntry(entry.title || 'Unknown', entry.text || entry, new Date()));
            }
        }
    }

    // Toggle pin status for journal entries
    togglePin(entryId) {
        if (this.pinnedEntries.has(entryId)) {
            this.pinnedEntries.delete(entryId);
        } else {
            this.pinnedEntries.add(entryId);
        }
        
        // Sync with game data
        if (this.gameData?.player) {
            this.gameData.player.journalPins = this.pinnedEntries;
        }
        
        return this.isPinned(entryId);
    }

    // Check if entry is pinned
    isPinned(entryId) {
        return this.pinnedEntries.has(entryId);
    }

    // Discovery event handlers
    onLocationDiscovered(data) {
        this.log('info', 'Location discovered:', data.locationId);
        
        if (this.systems.locations) {
            this.systems.locations.discoverLocation(data.locationId);
        }
        
        // Emit journal update event
        this.emit(this.EVENTS?.JOURNAL_ENTRY_ADDED || 'JOURNAL_ENTRY_ADDED', {
            type: 'location',
            id: data.locationId,
            timestamp: Date.now()
        });
    }

    onNPCMet(data) {
        this.log('info', 'NPC met:', data.npcId);
        
        if (this.systems.npcs) {
            this.systems.npcs.meetNPC(data.npcId);
        }
        
        // Emit journal update event
        this.emit(this.EVENTS?.JOURNAL_ENTRY_ADDED || 'JOURNAL_ENTRY_ADDED', {
            type: 'npc',
            id: data.npcId,
            timestamp: Date.now()
        });
    }

    onMonsterEncountered(data) {
        this.log('info', 'Monster encountered:', data.monsterId);
        
        if (this.systems.bestiary) {
            this.systems.bestiary.encounterMonster(data.monsterId);
        }
        
        // Emit journal update event
        this.emit(this.EVENTS?.JOURNAL_ENTRY_ADDED || 'JOURNAL_ENTRY_ADDED', {
            type: 'bestiary',
            id: data.monsterId,
            timestamp: Date.now()
        });
    }

    onLoreDiscovered(data) {
        this.log('info', 'Lore discovered:', data.loreId);
        
        if (this.systems.lore) {
            this.systems.lore.discoverLore(data.loreId);
        }
        
        // Emit journal update event
        this.emit(this.EVENTS?.JOURNAL_ENTRY_ADDED || 'JOURNAL_ENTRY_ADDED', {
            type: 'lore',
            id: data.loreId,
            timestamp: Date.now()
        });
    }

    onQuestStarted(data) {
        this.log('info', 'Quest started:', data.questId);
        
        if (this.systems.quests) {
            this.systems.quests.startQuest(data.questId);
        }
        
        // Emit journal update event
        this.emit(this.EVENTS?.JOURNAL_ENTRY_ADDED || 'JOURNAL_ENTRY_ADDED', {
            type: 'quest',
            id: data.questId,
            timestamp: Date.now()
        });
    }

    onQuestCompleted(data) {
        this.log('info', 'Quest completed:', data.questId);
        
        if (this.systems.quests) {
            this.systems.quests.completeQuest(data.questId);
        }
        
        // Emit journal update event
        this.emit(this.EVENTS?.JOURNAL_ENTRY_UPDATED || 'JOURNAL_ENTRY_UPDATED', {
            type: 'quest',
            id: data.questId,
            status: 'completed',
            timestamp: Date.now()
        });
    }

    // Main render method for journal UI
    render(searchQuery = '', activeTab = 'all') {
        this.requireInitialized();
        
        const playerData = this.getPlayerData();
        if (!playerData) {
            return '<div class="text-red-400">Error: Player data not available</div>';
        }

        // Ensure data structure is correct
        this.ensureDataStructure(playerData);
        
        // Update active tab
        this.activeTab = activeTab;
        
        // Emit tab change event
        this.emit(this.EVENTS?.JOURNAL_TAB_CHANGED || 'JOURNAL_TAB_CHANGED', { activeTab });
        
        let content = '';
        
        // Render different sections based on active tab
        if (activeTab === 'all' || activeTab === 'quests') {
            content += this.renderQuestsSection(playerData, searchQuery);
        }
        
        if (activeTab === 'all' || activeTab === 'lore') {
            content += this.renderLoreSection(playerData, searchQuery);
        }
        
        if (activeTab === 'all' || activeTab === 'locations') {
            content += this.renderLocationsSection(playerData, searchQuery);
        }
        
        if (activeTab === 'all' || activeTab === 'npcs') {
            content += this.renderNPCsSection(playerData, searchQuery);
        }
        
        if (activeTab === 'all' || activeTab === 'bestiary') {
            content += this.renderBestiarySection(playerData, searchQuery);
        }
        
        if (activeTab === 'all' || activeTab === 'notes') {
            content += this.renderNotesSection(playerData, searchQuery);
        }
        
        return content;
    }

    // Get player data safely
    getPlayerData() {
        if (this.dataManager) {
            return this.dataManager.get('player');
        }
        return window.gameData?.player;
    }

    // Render quests section
    renderQuestsSection(playerData, searchQuery) {
        const activeQuests = (playerData.quests.active || []).filter(q => 
            (q.text || q.title || q).toLowerCase().includes(searchQuery.toLowerCase())
        );
        const completedQuests = (playerData.quests.completed || []).filter(q => 
            (q.text || q.title || q).toLowerCase().includes(searchQuery.toLowerCase())
        );

        return `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    📋 Active Quests
                </h4>
                <div class="space-y-2">
                    ${activeQuests.length > 0 ?
                        activeQuests.map(quest => this.renderQuestEntry(quest, 'active')).join('') :
                        '<div class="text-gray-400 italic">No active quests</div>'
                    }
                </div>
                
                <h4 class="font-cinzel text-lg text-white mb-3 mt-6 flex items-center gap-2">
                    ✅ Completed Quests
                </h4>
                <div class="space-y-2">
                    ${completedQuests.length > 0 ?
                        completedQuests.map(quest => this.renderQuestEntry(quest, 'completed')).join('') :
                        '<div class="text-gray-400 italic">No completed quests</div>'
                    }
                </div>
            </div>
        `;
    }

    // Render individual quest entry
    renderQuestEntry(quest, status) {
        const qid = quest.id || quest.text || quest.title || quest;
        const pinned = this.isPinned(qid);
        const questText = quest.text || quest.title || quest.description || quest;
        const progress = quest.progress !== undefined ? quest.progress : null;
        const statusClass = status === 'completed' ? 'completed' : '';
        const statusColor = status === 'completed' ? 'text-green-300' : 'text-amber-300';
        const statusText = status === 'completed' ? 'Completed' : 'Active';

        return `
            <div class="journal-entry quest ${statusClass} ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                <div class="flex justify-between items-center mb-1">
                    <div class="${statusColor} font-semibold">${statusText}</div>
                    <div class="flex items-center gap-2">
                        ${status === 'active' ? `<button class="text-blue-400 text-xs" onclick="window.journalSystem?.trackQuest('${qid}')">Track</button>` : ''}
                        <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="window.journalSystem?.togglePin('${qid}')">${pinned ? '★' : '☆'}</button>
                    </div>
                </div>
                <div class="text-white">${questText}</div>
                ${progress !== null ? `<div class="quest-progress"><div class="quest-progress-fill" style="width:${Math.round(progress * 100)}%"></div></div>` : ''}
            </div>
        `;
    }

    // Render lore section
    renderLoreSection(playerData, searchQuery) {
        const lore = Array.from(playerData.lore || []).filter(entry => 
            entry.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    📜 Discovered Lore
                </h4>
                <div class="space-y-2">
                    ${lore.length > 0 ?
                        lore.map(entry => this.renderLoreEntry(entry)).join('') :
                        '<div class="text-gray-400 italic">No lore discovered</div>'
                    }
                </div>
            </div>
        `;
    }

    // Render individual lore entry
    renderLoreEntry(lore) {
        const pinned = this.isPinned(lore);
        
        return `
            <div class="journal-entry lore ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                <div class="flex justify-between items-center mb-1">
                    <div class="text-purple-300 font-semibold">Lore</div>
                    <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="window.journalSystem?.togglePin('${lore}')">${pinned ? '★' : '☆'}</button>
                </div>
                <div class="text-white">${this.processJournalText(lore)}</div>
            </div>
        `;
    }

    // Render locations section
    renderLocationsSection(playerData, searchQuery) {
        // For now, use a basic implementation - can be enhanced with proper location discovery system
        const discoveredLocations = playerData.discoveredLocations || [];
        const filteredLocations = discoveredLocations.filter(location => 
            location.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    🗺️ Discovered Locations
                </h4>
                <div class="space-y-2">
                    ${filteredLocations.length > 0 ?
                        filteredLocations.map(location => this.renderLocationEntry(location)).join('') :
                        '<div class="text-gray-400 italic">No locations discovered</div>'
                    }
                </div>
            </div>
        `;
    }

    // Render individual location entry
    renderLocationEntry(location) {
        const pinned = this.isPinned(location);
        
        return `
            <div class="journal-entry location ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                <div class="flex justify-between items-center mb-1">
                    <div class="text-green-300 font-semibold">Location</div>
                    <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="window.journalSystem?.togglePin('${location}')">${pinned ? '★' : '☆'}</button>
                </div>
                <div class="text-white">${location}</div>
            </div>
        `;
    }

    // Render NPCs section
    renderNPCsSection(playerData, searchQuery) {
        // For now, use a basic implementation - can be enhanced with proper NPC discovery system
        const discoveredNPCs = playerData.discoveredNPCs || [];
        const filteredNPCs = discoveredNPCs.filter(npc => 
            npc.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    👥 Met NPCs
                </h4>
                <div class="space-y-2">
                    ${filteredNPCs.length > 0 ?
                        filteredNPCs.map(npc => this.renderNPCEntry(npc)).join('') :
                        '<div class="text-gray-400 italic">No NPCs met</div>'
                    }
                </div>
            </div>
        `;
    }

    // Render individual NPC entry
    renderNPCEntry(npc) {
        const pinned = this.isPinned(npc);
        
        return `
            <div class="journal-entry npc ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                <div class="flex justify-between items-center mb-1">
                    <div class="text-blue-300 font-semibold">NPC</div>
                    <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="window.journalSystem?.togglePin('${npc}')">${pinned ? '★' : '☆'}</button>
                </div>
                <div class="text-white">${npc}</div>
            </div>
        `;
    }

    // Render bestiary section
    renderBestiarySection(playerData, searchQuery) {
        // For now, use a basic implementation - can be enhanced with proper bestiary system
        const discoveredMonsters = playerData.discoveredMonsters || [];
        const filteredMonsters = discoveredMonsters.filter(monster => 
            monster.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    🐉 Bestiary
                </h4>
                <div class="space-y-2">
                    ${filteredMonsters.length > 0 ?
                        filteredMonsters.map(monster => this.renderBestiaryEntry(monster)).join('') :
                        '<div class="text-gray-400 italic">No monsters encountered</div>'
                    }
                </div>
            </div>
        `;
    }

    // Render individual bestiary entry
    renderBestiaryEntry(monster) {
        const pinned = this.isPinned(monster);
        
        return `
            <div class="journal-entry bestiary ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                <div class="flex justify-between items-center mb-1">
                    <div class="text-red-300 font-semibold">Monster</div>
                    <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="window.journalSystem?.togglePin('${monster}')">${pinned ? '★' : '☆'}</button>
                </div>
                <div class="text-white">${monster}</div>
            </div>
        `;
    }

    // Render notes section
    renderNotesSection(playerData, searchQuery) {
        const notes = Object.entries(playerData.journalNotes || {}).filter(([key, note]) => 
            note.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    📝 Personal Notes
                </h4>
                <div class="space-y-2">
                    ${notes.length > 0 ?
                        notes.map(([key, note]) => this.renderNoteEntry(key, note)).join('') :
                        '<div class="text-gray-400 italic">No personal notes</div>'
                    }
                </div>
            </div>
        `;
    }

    // Render individual note entry
    renderNoteEntry(key, note) {
        const pinned = this.isPinned(key);
        
        return `
            <div class="journal-entry note ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                <div class="flex justify-between items-center mb-1">
                    <div class="text-cyan-300 font-semibold">Note</div>
                    <div class="flex items-center gap-2">
                        <button class="text-yellow-600 text-xs" onclick="window.journalSystem?.editNote('${key}')">Edit</button>
                        <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="window.journalSystem?.togglePin('${key}')">${pinned ? '★' : '☆'}</button>
                    </div>
                </div>
                <div class="text-white">${note}</div>
            </div>
        `;
    }

    // Utility methods for journal actions
    trackQuest(questId) {
        this.emit('QUEST_TRACK_REQUESTED', { questId });
        this.log('info', `Quest tracking requested: ${questId}`);
    }

    editNote(noteKey) {
        // This would open a modal or inline editor
        this.emit('NOTE_EDIT_REQUESTED', { noteKey });
        this.log('info', `Note edit requested: ${noteKey}`);
    }

    // Process journal text for hyperlinks and references
    processJournalText(text) {
        if (!text) return '';
        
        // Convert text references to clickable hyperlinks
        text = text.replace(/\b(Griefwood|Jorn|Westwalker|M'ra Kaal|Scholar|Leonin|Aethermoon|Verdamoon|Umbralmoon|Convergence)\b/g, 
            '<span class="journal-link text-blue-400 hover:text-blue-300 cursor-pointer underline decoration-dotted" onclick="window.journalSystem?.showQuickReference(\'$1\')">$1</span>');
        
        return text;
    }

    // Show quick reference modal
    showQuickReference(term) {
        const references = {
            'Griefwood': 'A mysterious forest at the edge of the Frontier, known for its ancient secrets and dangerous wildlife.',
            'Jorn': 'A frontier trading post where travelers gather to share news and trade goods.',
            'Westwalker': 'Hardy frontier folk who make their living on the edge of civilization.',
            'M\'ra Kaal': 'The proud Leonin clan known for their spiritual connection and warrior traditions.',
            'Scholar': 'Learned individuals who study the mysteries of magic and ancient lore.',
            'Leonin': 'Cat-like humanoids with strong tribal traditions and spiritual beliefs.',
            'Aethermoon': 'The blue moon that governs magic and mystical energies.',
            'Kapra': 'Appearance: A foreboding red glow, intensifying during its full and new moon phases, casting an eerie light said to stir the blood of beasts.',
            'Umbralmoon': 'The dark moon associated with shadows and hidden knowledge.',
            'Convergence': 'The rare astronomical event when all three moons align.',
            'Edoria': 'The world in which the game takes place.',
            'Ehix': 'The central continent where the story unfolds, rich with diverse regions and cultures.'
        };
        
        this.showModal('Quick Reference', references[term] || 'No reference information available.');
    }

    // Show modal helper
    showModal(title, content) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('quick-reference-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'quick-reference-modal';
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
            modal.innerHTML = `
                <div class="bg-gray-900 border-2 border-gray-600 rounded-lg p-6 max-w-md mx-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 id="modal-title" class="font-cinzel text-xl text-white"></h3>
                        <button onclick="window.journalSystem?.closeModal()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    <div id="modal-content" class="text-gray-300"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-content').innerHTML = content;
        modal.classList.remove('hidden');
    }

    // Close modal helper
    closeModal() {
        const modal = document.getElementById('quick-reference-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Toggle pin status and persist to save data
    togglePin(entryId) {
        let isPinned;
        
        if (this.pinnedEntries.has(entryId)) {
            this.pinnedEntries.delete(entryId);
            isPinned = false;
            this.emit(this.EVENTS?.JOURNAL_ENTRY_UNPINNED || 'JOURNAL_ENTRY_UNPINNED', { entryId });
        } else {
            this.pinnedEntries.add(entryId);
            isPinned = true;
            this.emit(this.EVENTS?.JOURNAL_ENTRY_PINNED || 'JOURNAL_ENTRY_PINNED', { entryId });
        }
        
        // Sync with game data
        const playerData = this.getPlayerData();
        if (playerData) {
            playerData.journalPins = Array.from(this.pinnedEntries);
        }
        
        this.log('info', `Entry ${isPinned ? 'pinned' : 'unpinned'}: ${entryId}`);
        return isPinned;
    }

    // Save journal data to player save
    save() {
        const playerData = this.getPlayerData();
        if (!playerData) return;

        // Save pinned entries
        playerData.journalPins = Array.from(this.pinnedEntries);

        // Save discovered entries
        playerData.discoveredEntries = Object.fromEntries(this.discoveredEntries);

        // Save subsystem data
        for (const [name, system] of Object.entries(this.systems)) {
            if (system.save) {
                system.save(playerData);
            }
        }

        this.emit(this.EVENTS?.GAME_SAVED || 'GAME_SAVED', { system: 'journal' });
        this.log('info', 'Journal data saved');
    }

    // Get journal statistics
    getStats() {
        const playerData = this.getPlayerData();
        if (!playerData) return {};

        this.ensureDataStructure(playerData);

        return {
            totalEntries: (playerData.journal || []).length,
            pinnedEntries: this.pinnedEntries.size,
            activeQuests: (playerData.quests.active || []).length,
            completedQuests: (playerData.quests.completed || []).length,
            discoveredLore: (playerData.lore || new Set()).size,
            personalNotes: Object.keys(playerData.journalNotes || {}).length
        };
    }

    // Get all entries for a specific tab
    getEntriesForTab(tab, searchQuery = '') {
        const entries = [];
        const query = searchQuery.toLowerCase();

        switch (tab) {
            case 'all':
                // Combine all entries
                Object.values(this.systems).forEach(system => {
                    if (system.getEntries) {
                        entries.push(...system.getEntries());
                    }
                });
                break;
            case 'quests':
                entries.push(...this.systems.quests.getEntries());
                break;
            case 'lore':
                entries.push(...this.systems.lore.getEntries());
                break;
            case 'npcs':
                entries.push(...this.systems.npcs.getEntries());
                break;
            case 'locations':
                entries.push(...this.systems.locations.getEntries());
                break;
            case 'bestiary':
                entries.push(...this.systems.bestiary.getEntries());
                break;
            case 'notes':
                entries.push(...this.systems.notes.getEntries());
                break;
            case 'calendar':
                entries.push(...this.systems.calendar.getEntries());
                break;
        }

        // Filter by search query
        if (searchQuery) {
            return entries.filter(entry => 
                (entry.title && entry.title.toLowerCase().includes(query)) ||
                (entry.text && entry.text.toLowerCase().includes(query)) ||
                (entry.description && entry.description.toLowerCase().includes(query))
            );
        }

        return entries;
    }

    // Process journal text to add hyperlinks and formatting
    processJournalText(text) {
        if (!text) return '';
        
        // Convert text references to clickable hyperlinks
        text = text.replace(/\b(Griefwood|Jorn|Westwalker|M'ra Kaal|Scholar|Leonin|Aethermoon|Verdamoon|Umbralmoon|Convergence)\b/g, 
            '<span class="journal-link text-blue-400 hover:text-blue-300 cursor-pointer underline decoration-dotted" onclick="journalManager.showQuickReference(\'$1\')">$1</span>');
        
        return text;
    }

    // Show quick reference modal.
    // todo: make a UI section for a glossary to show all terms in one place.
    // todo: move these to a Glossary class for better organization.
    showQuickReference(term) {
        const references = {
            'Griefwood': 'A mysterious forest at the edge of the Frontier, known for its ancient secrets and dangerous wildlife.',
            'Jorn': 'A frontier trading post where travelers gather to share news and trade goods.',
            'Westwalker': 'Hardy frontier folk who make their living on the edge of civilization.',
            'M\'ra Kaal': 'The proud Leonin clan known for their spiritual connection and warrior traditions.',
            'Scholar': 'Learned individuals who study the mysteries of magic and ancient lore.',
            'Leonin': 'Cat-like humanoids with strong tribal traditions and spiritual beliefs.',
            'Aethermoon': 'The blue moon that governs magic and mystical energies.',
            'Kapra': 'Appearance: A foreboding red glow, intensifying during its full and new moon phases, casting an eerie light said to stir the blood of beasts.',
            'Umbralmoon': 'The dark moon associated with shadows and hidden knowledge.',
            'Convergence': 'The rare astronomical event when all three moons align.',
            'Edoria': 'The world in which the game takes place.',
            'Ehix': 'The central continent where the story unfolds, rich with diverse regions and cultures.'
        };
        
        this.showModal('Quick Reference', references[term] || 'No reference information available.');
    }

    // Show modal helper
    showModal(title, content) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('quick-reference-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'quick-reference-modal';
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
            modal.innerHTML = `
                <div class="bg-gray-900 border-2 border-gray-600 rounded-lg p-6 max-w-md mx-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 id="modal-title" class="font-cinzel text-xl text-white"></h3>
                        <button onclick="journalManager.closeModal()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    <div id="modal-content" class="text-gray-300"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-content').innerHTML = content;
        modal.classList.remove('hidden');
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('quick-reference-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Render the complete journal UI
    render(activeTab = 'all', searchQuery = '') {
        const journalContentEl = document.getElementById('journal-content');
        if (!journalContentEl) return;

        this.activeTab = activeTab;
        let content = '<div class="journal-container">';

        // Tab Navigation + Search
        content += this.renderNavigationTabs(activeTab, searchQuery);
        
        // Render content based on active tab
        content += this.renderTabContent(activeTab, searchQuery);
        
        content += '</div>';
        journalContentEl.innerHTML = content;
    }

    // Render navigation tabs
    renderNavigationTabs(activeTab, searchQuery) {
        return `
            <div class="journal-tabs mb-4">
                <div class="flex flex-wrap items-center space-x-1 bg-gray-800 rounded-lg p-1">
                    <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="journalManager.render('all')"><i class='ph-duotone ph-book-open mr-1'></i>All</button>
                    <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'quests' ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="journalManager.render('quests')"><i class='ph-duotone ph-scroll mr-1'></i>Quests</button>
                    <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'lore' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="journalManager.render('lore')"><i class='ph-duotone ph-book mr-1'></i>Lore</button>
                    <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'rumors' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="journalManager.render('rumors')"><i class='ph-duotone ph-chats-circle mr-1'></i>Rumors</button>
                    <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'locations' ? 'bg-green-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="journalManager.render('locations')"><i class='ph-duotone ph-map-pin mr-1'></i>Locations</button>
                    <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'items' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="journalManager.render('items')"><i class='ph-duotone ph-backpack mr-1'></i>Items</button>
                    <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'npcs' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="journalManager.render('npcs')"><i class='ph-duotone ph-users mr-1'></i>NPCs</button>
                    <button class="journal-tab px-4 py-2 rounded-lg font-cinzel ${activeTab === 'bestiary' ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white'}" onclick="journalManager.render('bestiary')"><i class='ph-duotone ph-paw-print mr-1'></i>Bestiary</button>
                    <input id="journal-search-input" class="ml-auto px-2 py-1 rounded text-black" placeholder="Search..." value="${searchQuery}" oninput="journalManager.render('${activeTab}', this.value)" />
                </div>
            </div>
        `;
    }

    // Render content for specific tabs
    renderTabContent(activeTab, searchQuery) {
        let content = '';

        switch (activeTab) {
            case 'all':
                content += this.renderQuestSection(searchQuery);
                content += this.renderLoreSection(searchQuery);
                content += this.renderRumorSection(searchQuery);
                break;
            case 'quests':
                content += this.renderQuestSection(searchQuery);
                break;
            case 'lore':
                content += this.renderLoreSection(searchQuery);
                break;
            case 'rumors':
                content += this.renderRumorSection(searchQuery);
                break;
            case 'locations':
                content += this.renderLocationSection(searchQuery);
                break;
            case 'items':
                content += this.renderItemSection(searchQuery);
                break;
            case 'npcs':
                content += this.renderNPCSection(searchQuery);
                break;
            case 'bestiary':
                content += this.renderBestiarySection(searchQuery);
                break;
        }

        return content;
    }

    // Render quest section
    renderQuestSection(searchQuery) {
        if (!this.gameData?.player?.quests) return '';
        
        const activeQuests = this.gameData.player.quests.active?.filter(q => (q.text || q).toLowerCase().includes(searchQuery.toLowerCase())) || [];
        const completedQuests = this.gameData.player.quests.completed?.filter(q => (q.text || q).toLowerCase().includes(searchQuery.toLowerCase())) || [];
        
        return `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    📋 Active Quests
                </h4>
                <div class="space-y-2">
                    ${activeQuests.length > 0 ?
                        activeQuests.map(quest => {
                            const qid = quest.id || quest.text || quest;
                            const pinned = this.isPinned(qid);
                            const progress = quest.progress !== undefined ? quest.progress : null;
                            return `
                            <div class="journal-entry quest ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                                <div class="flex justify-between items-center mb-1">
                                    <div class="text-amber-300 font-semibold">Active</div>
                                    <div class="flex items-center gap-2">
                                        <button class="text-blue-400 text-xs" onclick="journalManager.trackQuest('${qid}')">Track</button>
                                        <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="journalManager.togglePin('${qid}'); journalManager.render('${this.activeTab}')">${pinned ? '★' : '☆'}</button>
                                    </div>
                                </div>
                                <div class="text-white">${quest.text || quest}</div>
                                ${progress !== null ? `<div class="quest-progress"><div class="quest-progress-fill" style="width:${Math.round(progress * 100)}%"></div></div>` : ''}
                            </div>
                            `;
                        }).join('') :
                        '<div class="text-gray-400 italic">No active quests</div>'
                    }
                </div>
                
                <h4 class="font-cinzel text-lg text-white mb-3 mt-6 flex items-center gap-2">
                    ✅ Completed Quests
                </h4>
                <div class="space-y-2">
                    ${completedQuests.length > 0 ?
                        completedQuests.map(quest => {
                            const qid = quest.id || quest.text || quest;
                            const pinned = this.isPinned(qid);
                            return `
                            <div class="journal-entry quest completed ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                                <div class="flex justify-between items-center mb-1">
                                    <div class="text-green-300 font-semibold">Completed</div>
                                    <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="journalManager.togglePin('${qid}'); journalManager.render('${this.activeTab}')">${pinned ? '★' : '☆'}</button>
                                </div>
                                <div class="text-white">${quest.text || quest}</div>
                            </div>
                            `;
                        }).join('') :
                        '<div class="text-gray-400 italic">No completed quests</div>'
                    }
                </div>
            </div>
        `;
    }

    // Render lore section
    renderLoreSection(searchQuery) {
        const loreEntries = Array.from(this.gameData?.player?.lore || []).filter(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    📚 Lore & Knowledge
                </h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${loreEntries.length > 0 ?
                        loreEntries.map(lore => {
                            const pinned = this.isPinned(lore);
                            return `
                            <div class="journal-entry lore ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                                <div class="flex justify-between items-center mb-1">
                                    <div class="text-blue-300 font-semibold">Knowledge</div>
                                    <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="journalManager.togglePin('${lore}'); journalManager.render('${this.activeTab}')">${pinned ? '★' : '☆'}</button>
                                </div>
                                <div class="text-white">${this.processJournalText(lore)}</div>
                            </div>
                            `;
                        }).join('') :
                        '<div class="text-gray-400 italic">No lore discovered</div>'
                    }
                </div>
            </div>
        `;
    }

    // Render rumor section
    renderRumorSection(searchQuery) {
        const rumorEntries = Array.from(this.gameData?.player?.rumors || []).filter(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    🗣️ Rumors & Whispers
                </h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${rumorEntries.length > 0 ?
                        rumorEntries.map(rumor => {
                            const pinned = this.isPinned(rumor);
                            return `
                            <div class="journal-entry rumor ${pinned ? 'ring-2 ring-yellow-400' : ''}">
                                <div class="flex justify-between items-center mb-1">
                                    <div class="text-purple-300 font-semibold">Rumor</div>
                                    <button class="pin-btn text-yellow-400 text-xs ${pinned ? 'active' : ''}" onclick="journalManager.togglePin('${rumor}'); journalManager.render('${this.activeTab}')">${pinned ? '★' : '☆'}</button>
                                </div>
                                <div class="text-white">${this.processJournalText(rumor)}</div>
                            </div>
                            `;
                        }).join('') :
                        '<div class="text-gray-400 italic">No rumors heard</div>'
                    }
                </div>
            </div>
        `;
    }

    // Render location section
    renderLocationSection(searchQuery) {
        const locations = Object.values(this.gameData?.locations || {});
        
        return `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    <i class='ph-duotone ph-map-pin'></i> Locations & Regions
                </h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${locations.length > 0 ?
                        locations.map(loc => `
                            <div class="journal-entry location">
                                <div class="text-green-400 font-semibold">${loc.name}</div>
                                <div class="text-white text-sm">${loc.description || ''}</div>
                            </div>
                        `).join('') :
                        '<div class="text-gray-400 italic">No locations discovered</div>'
                    }
                </div>
            </div>
        `;
    }

    // Render items section
    renderItemSection(searchQuery) {
        const items = Object.values(this.gameData?.journalItems || {});
        
        return `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    <i class='ph-duotone ph-backpack'></i> Items & Artifacts
                </h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${items.length > 0 ?
                        items.map(item => `
                            <div class="journal-entry item">
                                <div class="text-orange-400 font-semibold">${item.name}</div>
                                <div class="text-white text-sm">${item.description || ''}</div>
                            </div>
                        `).join('') :
                        '<div class="text-gray-400 italic">No items discovered</div>'
                    }
                </div>
            </div>
        `;
    }

    // Render NPC section
    renderNPCSection(searchQuery) {
        const npcs = Object.values(this.gameData?.journalNpcs || {});
        
        return `
            <div class="journal-section mb-6">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    <i class='ph-duotone ph-users'></i> NPCs & Relationships
                </h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${npcs.length > 0 ?
                        npcs.map(npc => `
                            <div class="journal-entry npc">
                                <div class="text-purple-400 font-semibold">${npc.name}</div>
                                <div class="text-white text-sm">${npc.description || ''}</div>
                                <div class="text-xs text-purple-300 mt-1">Relationship: <span class="font-bold">${npc.relationship_score ?? 'Unknown'}</span></div>
                            </div>
                        `).join('') :
                        '<div class="text-gray-400 italic">No NPCs discovered</div>'
                    }
                </div>
            </div>
        `;
    }

    // Render bestiary section
    renderBestiarySection(searchQuery) {
        // Load monsters from gameData.monsters or fallback to window.monstersData if available
        let monsters = [];
        if (this.gameData?.monsters) {
            monsters = Object.values(this.gameData.monsters);
        } else if (typeof window !== 'undefined' && window.monstersData) {
            monsters = Object.values(window.monstersData);
        }
        
        return `
            <div class="journal-section mb-6" style="height:70%;display:flex;flex-direction:column;">
                <h4 class="font-cinzel text-lg text-white mb-3 flex items-center gap-2">
                    <i class='ph-duotone ph-paw-print'></i> Bestiary
                </h4>
                <div class="space-y-4 flex-1 overflow-y-auto" style="height:100%;">
                    ${monsters.length > 0 ?
                        monsters.map(monster => `
                            <div class="journal-entry bestiary bg-gray-800 rounded-lg p-3 border border-gray-700">
                                <div class="flex justify-between items-center mb-1">
                                    <div class="text-red-400 font-bold text-lg">${monster.name}</div>
                                    <span class="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded">Level ${monster.level}</span>
                                </div>
                                <div class="text-white text-sm mb-2">${monster.description || ''}</div>
                                <div class="flex flex-wrap gap-2 text-xs mb-2">
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">HP: ${monster.hitPoints}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">AC: ${monster.armorClass}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">STR: ${monster.attributes?.strength ?? '?'}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">DEX: ${monster.attributes?.dexterity ?? '?'}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">CON: ${monster.attributes?.constitution ?? '?'}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">INT: ${monster.attributes?.intelligence ?? '?'}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">WIS: ${monster.attributes?.wisdom ?? '?'}</span>
                                    <span class="bg-gray-700 text-gray-200 px-2 py-1 rounded">CHA: ${monster.attributes?.charisma ?? '?'}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-semibold text-purple-300">Abilities:</span>
                                    <ul class="list-disc list-inside ml-4">
                                        ${monster.abilities?.map(ability => `<li><span class="text-yellow-300 font-semibold">${ability.name}:</span> <span class="text-gray-200">${ability.description}</span></li>`).join('') || '<li class="text-gray-400">None</li>'}
                                    </ul>
                                </div>
                                <div class="mb-1">
                                    <span class="font-semibold text-blue-300">Resistances:</span> <span class="text-gray-200">${(monster.resistances || []).join(', ') || 'None'}</span>
                                </div>
                                <div class="mb-1">
                                    <span class="font-semibold text-red-300">Weaknesses:</span> <span class="text-gray-200">${(monster.weaknesses || []).join(', ') || 'None'}</span>
                                </div>
                                <div>
                                    <span class="font-semibold text-green-300">Loot:</span> <span class="text-gray-200">${(monster.loot || []).map(l => `${l.item} (${Math.round(l.chance * 100)}%)`).join(', ') || 'None'}</span>
                                </div>
                            </div>
                        `).join('') :
                        '<div class="text-gray-400 italic">No monsters discovered</div>'
                    }
                </div>
            </div>
        `;
    }

    // Quest tracking functionality
    trackQuest(questId) {
        console.log(`Tracking quest: ${questId}`);
        // Add quest tracking logic here
        if (typeof showGameMessage === 'function') {
            showGameMessage(`Tracking quest: ${questId}`, 'info');
        }
    }
}

// Individual System Classes
class BeastiarySystem {
    constructor() {
        this.entries = new Map();
    }

    addEntry(entry) {
        this.entries.set(entry.id, entry);
    }

    getEntry(id) {
        return this.entries.get(id);
    }

    getEntries() {
        return Array.from(this.entries.values());
    }

    removeEntry(id) {
        return this.entries.delete(id);
    }

    getEntriesByType(type) {
        return this.getEntries().filter(entry => entry.type === type);
    }
}

class BeastierySystem {

}

class LoreSystem {
    constructor() {
        this.entries = [];
    }

    addEntry(entry) {
        this.entries.push(entry);
    }

    getEntries() {
        return this.entries;
    }

    findEntryByTitle(title) {
        return this.entries.find(entry => entry.title === title);
    }

    removeEntry(title) {
        const index = this.entries.findIndex(entry => entry.title === title);
        if (index !== -1) {
            return this.entries.splice(index, 1)[0];
        }
        return null;
    }
}

class LocationSystem {
    constructor() {
        this.entries = new Map();
        this.visitedLocations = new Set();
    }

    addEntry(entry) {
        this.entries.set(entry.id, entry);
        this.visitedLocations.add(entry.id);
    }

    getEntry(id) {
        return this.entries.get(id);
    }

    getEntries() {
        return Array.from(this.entries.values());
    }

    markVisited(locationId) {
        this.visitedLocations.add(locationId);
    }

    hasVisited(locationId) {
        return this.visitedLocations.has(locationId);
    }

    getVisitedLocations() {
        return Array.from(this.visitedLocations);
    }
}

class NPCSystem {
    constructor() {
        this.entries = new Map();
        this.relationships = new Map();
    }

    addEntry(entry) {
        this.entries.set(entry.id, entry);
        if (entry.relationship_score !== undefined) {
            this.relationships.set(entry.id, entry.relationship_score);
        }
    }

    getEntry(id) {
        return this.entries.get(id);
    }

    getEntries() {
        return Array.from(this.entries.values());
    }

    updateRelationship(npcId, score) {
        this.relationships.set(npcId, score);
        const npc = this.entries.get(npcId);
        if (npc) {
            npc.relationship_score = score;
        }
    }

    getRelationship(npcId) {
        return this.relationships.get(npcId) || 0;
    }
}

class QuestSystem {
    constructor() {
        this.activeQuests = new Map();
        this.completedQuests = new Map();
        this.questProgress = new Map();
    }

    addQuest(quest) {
        const questEntry = new QuestEntry(quest);
        this.activeQuests.set(questEntry.id, questEntry);
        return questEntry;
    }

    completeQuest(questId) {
        const quest = this.activeQuests.get(questId);
        if (quest) {
            quest.completed = true;
            quest.completedDate = new Date();
            this.completedQuests.set(questId, quest);
            this.activeQuests.delete(questId);
            return true;
        }
        return false;
    }

    updateProgress(questId, progress) {
        this.questProgress.set(questId, progress);
        const quest = this.activeQuests.get(questId);
        if (quest) {
            quest.progress = progress;
        }
    }

    getQuest(questId) {
        return this.activeQuests.get(questId) || this.completedQuests.get(questId);
    }

    getActiveQuests() {
        return Array.from(this.activeQuests.values());
    }

    getCompletedQuests() {
        return Array.from(this.completedQuests.values());
    }

    getEntries() {
        return [...this.getActiveQuests(), ...this.getCompletedQuests()];
    }
}

class NotesSystem {
    constructor() {
        this.entries = [];
        this.categories = new Set();
    }

    addNote(title, content, category = 'general') {
        const note = new NoteEntry(title, content, category);
        this.entries.push(note);
        this.categories.add(category);
        return note;
    }

    getEntries() {
        return this.entries;
    }

    getEntriesByCategory(category) {
        return this.entries.filter(entry => entry.category === category);
    }

    getCategories() {
        return Array.from(this.categories);
    }

    removeNote(id) {
        const index = this.entries.findIndex(entry => entry.id === id);
        if (index !== -1) {
            return this.entries.splice(index, 1)[0];
        }
        return null;
    }
}

class CalendarSystem {
    constructor() {
        this.events = [];
        this.currentDate = null;
    }
    
    addEvent(event) {
        const calendarEvent = event instanceof CalendarEntry ? event : new CalendarEntry(event.date, event.title, event.description, event.npcs);
        this.events.push(calendarEvent);
        return calendarEvent;
    }
    
    getEvents() {
        return this.events;
    }
    
    getEventsByDate(date) {
        return this.events.filter(event => event.date === date);
    }

    getEntries() {
        return this.events;
    }

    setCurrentDate(date) {
        this.currentDate = date;
    }

    getCurrentDate() {
        return this.currentDate;
    }

    getUpcomingEvents(days = 7) {
        // This would need Edorian calendar logic
        return this.events.filter(event => {
            // Placeholder logic - implement proper Edorian date comparison
            return true;
        });
    }
}

// Entry Classes

class LoreEntry {
    constructor(title, text, discoveredDate = new Date()) {
        this.id = this.generateId(title);
        this.type = 'lore';
        this.title = title;
        this.text = text;
        this.discoveredDate = discoveredDate;
        this.tags = [];
        this.importance = 'normal'; // low, normal, high, critical
    }

    generateId(title) {
        return title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
    }

    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
        }
    }

    removeTag(tag) {
        this.tags = this.tags.filter(t => t !== tag);
    }

    setImportance(level) {
        if (['low', 'normal', 'high', 'critical'].includes(level)) {
            this.importance = level;
        }
    }
}

class CalendarEntry {
    constructor(date, title, description, npcs = []) {
        this.id = this.generateId(date, title);
        this.type = 'calendar';
        this.date = date; // Expected to be a string in Edorian Calendar format
        this.title = title; // Title of the event
        this.description = description; // Description of the event
        this.npcs = npcs; // NPCs associated with this event
        this.importance = 'normal';
        this.recurring = false;
        this.tags = [];
    }

    generateId(date, title) {
        return `${date}_${title}`.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
    }

    addNPC(npcId) {
        if (!this.npcs.includes(npcId)) {
            this.npcs.push(npcId);
        }
    }

    removeNPC(npcId) {
        this.npcs = this.npcs.filter(id => id !== npcId);
    }

    setRecurring(isRecurring) {
        this.recurring = isRecurring;
    }
}

class NPCEntry {
    constructor(data) {
        this.id = data.id || this.generateId(data.name);
        this.type = 'npc';
        this.name = data.name;
        this.description = data.description || '';
        this.location = data.location;
        this.relationship_score = data.relationship_score || 0;
        this.firstMet = data.firstMet || new Date();
        this.lastInteraction = data.lastInteraction || new Date();
        this.interactions = [];
        this.questsAssociated = [];
        this.tags = [];
        this.faction = data.faction;
        this.occupation = data.occupation;
    }

    generateId(name) {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    }

    addInteraction(interaction) {
        this.interactions.push({
            date: new Date(),
            type: interaction.type || 'conversation',
            description: interaction.description,
            outcome: interaction.outcome
        });
        this.lastInteraction = new Date();
    }

    associateQuest(questId) {
        if (!this.questsAssociated.includes(questId)) {
            this.questsAssociated.push(questId);
        }
    }

    updateRelationship(newScore) {
        this.relationship_score = newScore;
    }
}

class QuestEntry {
    constructor(data) {
        this.id = data.id || this.generateId(data.text || data.title);
        this.type = 'quest';
        this.title = data.title || data.text || data;
        this.text = data.text || data.title || data;
        this.description = data.description || '';
        this.objectives = data.objectives || [];
        this.progress = data.progress || 0;
        this.completed = data.completed || false;
        this.startDate = data.startDate || new Date();
        this.completedDate = data.completedDate;
        this.giver = data.giver; // NPC who gave the quest
        this.location = data.location;
        this.rewards = data.rewards || [];
        this.tags = data.tags || [];
        this.difficulty = data.difficulty || 'normal';
        this.priority = data.priority || 'normal';
    }

    generateId(title) {
        return title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
    }

    addObjective(objective) {
        this.objectives.push({
            id: this.objectives.length + 1,
            text: objective,
            completed: false
        });
    }

    completeObjective(objectiveId) {
        const objective = this.objectives.find(obj => obj.id === objectiveId);
        if (objective) {
            objective.completed = true;
            this.updateProgress();
        }
    }

    updateProgress() {
        if (this.objectives.length > 0) {
            const completedObjectives = this.objectives.filter(obj => obj.completed).length;
            this.progress = completedObjectives / this.objectives.length;
        }
    }

    complete() {
        this.completed = true;
        this.completedDate = new Date();
        this.progress = 1;
    }
}

class BeastieryEntry {
    constructor(data) {
        this.id = data.id || this.generateId(data.name);
        this.type = 'bestiary';
        this.name = data.name;
        this.description = data.description || '';
        this.level = data.level || 1;
        this.hitPoints = data.hitPoints;
        this.armorClass = data.armorClass;
        this.attributes = data.attributes || {};
        this.abilities = data.abilities || [];
        this.resistances = data.resistances || [];
        this.weaknesses = data.weaknesses || [];
        this.loot = data.loot || [];
        this.firstEncountered = data.firstEncountered || new Date();
        this.timesEncountered = data.timesEncountered || 1;
        this.defeated = data.defeated || 0;
        this.habitat = data.habitat || [];
        this.behavior = data.behavior || '';
        this.dangerLevel = data.dangerLevel || 'unknown';
    }

    generateId(name) {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    }

    recordEncounter() {
        this.timesEncountered += 1;
    }

    recordDefeat() {
        this.defeated += 1;
    }

    addHabitat(location) {
        if (!this.habitat.includes(location)) {
            this.habitat.push(location);
        }
    }
}

class LocationEntry {
    constructor(data) {
        this.id = data.id || this.generateId(data.name);
        this.type = 'location';
        this.name = data.name;
        this.description = data.description || '';
        this.region = data.region;
        this.visited = data.visited || false;
        this.firstVisited = data.firstVisited;
        this.timesVisited = data.timesVisited || 0;
        this.connections = data.connections || {};
        this.services = data.services || [];
        this.npcs = data.npcs || [];
        this.shops = data.shops || [];
        this.pointsOfInterest = data.pointsOfInterest || [];
        this.dangerLevel = data.danger_level || 'safe';
        this.tags = data.tags || [];
    }

    generateId(name) {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    }

    markVisited() {
        if (!this.visited) {
            this.visited = true;
            this.firstVisited = new Date();
        }
        this.timesVisited += 1;
    }

    addPointOfInterest(poi) {
        if (!this.pointsOfInterest.includes(poi)) {
            this.pointsOfInterest.push(poi);
        }
    }

    addNPC(npcId) {
        if (!this.npcs.includes(npcId)) {
            this.npcs.push(npcId);
        }
    }
}

class NoteEntry {
    constructor(title, content, category = 'general') {
        this.id = this.generateId(title);
        this.type = 'note';
        this.title = title;
        this.content = content;
        this.category = category;
        this.created = new Date();
        this.lastModified = new Date();
        this.tags = [];
        this.pinned = false;
    }

    generateId(title) {
        return `note_${title}`.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
    }

    update(content) {
        this.content = content;
        this.lastModified = new Date();
    }

    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
        }
    }

    removeTag(tag) {
        this.tags = this.tags.filter(t => t !== tag);
    }

    pin() {
        this.pinned = true;
    }

    unpin() {
        this.pinned = false;
    }
}

// Global journal manager instance
let journalManager;
let journalSystem; // New modular system instance

// Initialize journal system (legacy support)
function initializeJournalSystem(gameData) {
    journalManager = new JournalManager();
    journalManager.initialize(gameData);
    return journalManager;
}

// Initialize new modular journal system
async function initializeModularJournalSystem(gameData) {
    try {
        console.log('🗒️ Initializing Modular Journal System...');
        console.log('[InitModular] Available dependencies:', {
            eventBus: !!window.eventBus,
            BaseSystem: !!window.BaseSystem,
            JournalSystem: !!window.JournalSystem,
            EVENTS: !!window.EVENTS
        });
        
        // Initialize the global event bus if not already done
        if (typeof window.eventBus === 'undefined') {
            console.log('📡 Creating global event bus...');
            if (typeof EventBus !== 'undefined') {
                window.eventBus = new EventBus();
            } else {
                console.error('[InitModular] EventBus class not available');
                return null;
            }
        }
        
        // Create the journal system instance
        console.log('[InitModular] Creating JournalSystem instance...');
        journalSystem = new JournalSystem({
            debugMode: true,
            autoSave: true
        });
        
        // Make available globally
        window.journalSystem = journalSystem;
        console.log('[InitModular] JournalSystem made available globally');
        
        // Set up dependencies manually since BaseSystem expects them to be injected
        journalSystem.eventBus = window.eventBus;
        journalSystem.dataManager = null; // We'll create a data manager later
        journalSystem.gameData = gameData;
        
        console.log('[InitModular] Dependencies set up, calling initialize...');
        
        // Initialize using BaseSystem pattern (no parameters)
        await journalSystem.initialize();
        
        console.log('✅ Modular Journal System initialized successfully');
        
        // Test the system by ensuring data structure is correct
        if (gameData?.player) {
            console.log('[InitModular] Validating player data structure...');
            journalSystem.ensureDataStructure(gameData.player);
            console.log('✅ Player data structure validated');
        }
        
        return journalSystem;
    } catch (error) {
        console.error('❌ Failed to initialize Modular Journal System:', error);
        console.error('[InitModular] Error details:', error.stack);
        throw error;
    }
}

// Export for use in other modules and Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        JournalManager,
        BeastiarySystem,
        LoreSystem,
        LocationSystem,
        NPCSystem,
        QuestSystem,
        NotesSystem,
        CalendarSystem,
        LoreEntry,
        CalendarEntry,
        NPCEntry,
        QuestEntry,
        BeastieryEntry,
        LocationEntry,
        NoteEntry,
        initializeJournalSystem
    };
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.JournalManager = JournalManager;
    window.JournalSystem = JournalSystem; // Export new system class
    window.initializeJournalSystem = initializeJournalSystem;
    window.initializeModularJournalSystem = initializeModularJournalSystem;
    
    // Global utility functions for UI interactions
    window.toggleJournalPin = function(entryId) {
        if (window.journalSystem && window.journalSystem.initialized) {
            return window.journalSystem.togglePin(entryId);
        } else if (window.journalManager) {
            return window.journalManager.togglePin(entryId);
        }
        console.warn('No journal system available to toggle pin');
        return false;
    };
    
    window.switchJournalTab = function(tab) {
        if (typeof renderJournal === 'function') {
            renderJournal(tab);
        }
    };
    
    window.trackQuest = function(questId) {
        if (window.journalSystem && window.journalSystem.initialized) {
            window.journalSystem.trackQuest(questId);
        }
        console.log('Quest tracking requested:', questId);
    };
    
    // Discovery functions for game integration
    window.discoverLocation = function(locationId, locationName) {
        const EVENTS = window.EVENTS || { LOCATION_DISCOVERED: 'LOCATION_DISCOVERED' };
        
        if (window.eventBus) {
            window.eventBus.emit(EVENTS.LOCATION_DISCOVERED, { locationId, locationName });
        }
        
        // Add to player data as backup
        if (window.gameData?.player) {
            if (!window.gameData.player.discoveredLocations) {
                window.gameData.player.discoveredLocations = [];
            }
            if (!window.gameData.player.discoveredLocations.includes(locationName || locationId)) {
                window.gameData.player.discoveredLocations.push(locationName || locationId);
            }
        }
    };
    
    window.meetNPC = function(npcId, npcName) {
        const EVENTS = window.EVENTS || { NPC_MET: 'NPC_MET' };
        
        if (window.eventBus) {
            window.eventBus.emit(EVENTS.NPC_MET, { npcId, npcName });
        }
        
        // Add to player data as backup
        if (window.gameData?.player) {
            if (!window.gameData.player.discoveredNPCs) {
                window.gameData.player.discoveredNPCs = [];
            }
            if (!window.gameData.player.discoveredNPCs.includes(npcName || npcId)) {
                window.gameData.player.discoveredNPCs.push(npcName || npcId);
            }
        }
    };
    
    window.encounterMonster = function(monsterId, monsterName) {
        const EVENTS = window.EVENTS || { MONSTER_ENCOUNTERED: 'MONSTER_ENCOUNTERED' };
        
        if (window.eventBus) {
            window.eventBus.emit(EVENTS.MONSTER_ENCOUNTERED, { monsterId, monsterName });
        }
        
        // Add to player data as backup
        if (window.gameData?.player) {
            if (!window.gameData.player.discoveredMonsters) {
                window.gameData.player.discoveredMonsters = [];
            }
            if (!window.gameData.player.discoveredMonsters.includes(monsterName || monsterId)) {
                window.gameData.player.discoveredMonsters.push(monsterName || monsterId);
            }
        }
    };
    
    window.discoverLore = function(loreId, loreText) {
        const EVENTS = window.EVENTS || { LORE_DISCOVERED: 'LORE_DISCOVERED' };
        
        if (window.eventBus) {
            window.eventBus.emit(EVENTS.LORE_DISCOVERED, { loreId, loreText });
        }
        
        // Add to player data as backup
        if (window.gameData?.player) {
            if (!window.gameData.player.lore) {
                window.gameData.player.lore = new Set();
            }
            window.gameData.player.lore.add(loreText || loreId);
        }
    };
}
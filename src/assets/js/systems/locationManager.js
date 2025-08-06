// Location Manager System
// Edoria: The Triune Convergence - Dynamic Location Management

class LocationManager {
    constructor() {
        this.locations = {};
        this.currentLocation = null;
        this.detailedLocations = {};
    }

    // Initialize location system and load all data
    async initialize() {
        try {
            console.log('🗺️ Initializing Location Manager...');
            
            // Load base locations
            await this.loadBaseLocations();
            
            // Load detailed location data
            await this.loadDetailedLocations();
            
            console.log(`✅ Location Manager loaded ${Object.keys(this.locations).length} locations`);
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Location Manager:', error);
            return false;
        }
    }

    // Load location data from individual location files
    async loadBaseLocations() {
        try {
            // Define all individual location file paths
            const locationPaths = [
                // Frontier locations
                'locations/frontier/westwalker_camp.json',
                'locations/frontier/griefwood_edge.json',
                'locations/frontier/griefwood_clearing.json',
                
                // Towns
                'locations/towns/westhaven.json',
                'locations/towns/jorn.json',
                
                // Pridelands
                'locations/pridelands/leonin_encampment.json',
                
                // Gaia
                'locations/gaia/gaian_library.json'
            ];

            this.locations = {};
            let loadedCount = 0;

            // Load each location file
            for (const path of locationPaths) {
                try {
                    const response = await fetch(`${DATA_BASE_PATH}${path}`);
                    if (response.ok) {
                        const locationData = await response.json();
                        this.locations[locationData.id] = locationData;
                        loadedCount++;
                        console.log(`📍 Loaded location: ${locationData.name}`);
                    } else {
                        console.warn(`⚠️ Failed to load location from ${path}: ${response.status}`);
                    }
                } catch (error) {
                    console.warn(`⚠️ Error loading location from ${path}:`, error);
                }
            }

            console.log(`📍 Successfully loaded ${loadedCount} locations`);
            
            if (loadedCount === 0) {
                throw new Error('No location files could be loaded');
            }

            // Sync with global locationsData for backward compatibility
            if (typeof window !== 'undefined' && window.locationsData !== undefined) {
                Object.assign(window.locationsData, this.locations);
                console.log('📋 Synced location data with global locationsData variable');
            }
            
        } catch (error) {
            console.error('Failed to load locations:', error);
            throw error;
        }
    }

    // Legacy method - no longer needed as all locations are now detailed
    async loadDetailedLocations() {
        // All locations are now loaded with full detail in loadBaseLocations
        console.log('📋 All locations loaded with detailed data');
        return;
    }

    // Get location data by ID
    getLocation(locationId) {
        return this.locations[locationId] || null;
    }

    // Get all locations in a specific region
    getLocationsByRegion(region) {
        // Support both old lowercase and new capitalized region names
        const normalizedRegion = region.toLowerCase();
        return Object.values(this.locations).filter(loc => 
            loc.region.toLowerCase() === normalizedRegion
        );
    }

    // Get available actions for a location
    getLocationActions(locationId) {
        const location = this.getLocation(locationId);
        if (!location) return [];

        let actions = [];

        // Add base actions from location data
        if (location.actions) {
            actions.push(...location.actions);
        }

        // Generate dynamic actions based on available features
        if (location.shops && location.shops.length > 0) {
            actions.push({
                text: "Visit Shops",
                type: "shops",
                icon: "fas fa-store",
                description: "Browse local merchants and traders"
            });
        }

        if (location.npcs && location.npcs.length > 0) {
            actions.push({
                text: "Talk to People",
                type: "npcs",
                icon: "fas fa-users",
                description: "Speak with local residents and visitors"
            });
        }

        if (location.services) {
            if (location.services.inn && location.services.inn.available) {
                actions.push({
                    text: "Rest at Inn",
                    type: "service",
                    subtype: "inn",
                    icon: "fas fa-bed",
                    description: `Rest and recover (${location.services.inn.cost} gold)`,
                    cost: location.services.inn.cost
                });
            }

            if (location.services.healer && location.services.healer.available) {
                actions.push({
                    text: "Visit Healer",
                    type: "service",
                    subtype: "healer",
                    icon: "fas fa-heart",
                    description: "Heal injuries and restore health"
                });
            }

            if (location.services.blacksmith && location.services.blacksmith.available) {
                actions.push({
                    text: "Visit Blacksmith",
                    type: "service",
                    subtype: "blacksmith",
                    icon: "fas fa-hammer",
                    description: "Repair equipment and craft items"
                });
            }
        }

        // Add travel actions
        if (location.connections) {
            actions.push({
                text: "Travel",
                type: "travel_modal",
                icon: "fas fa-map",
                description: "Journey to other locations"
            });
        }

        // Add exploration if available
        if (location.foragable || location.points_of_interest) {
            actions.push({
                text: "Explore Area",
                type: "explore",
                icon: "fas fa-search",
                description: "Search for items and points of interest"
            });
        }

        return actions;
    }

    // Get NPCs in a location
    getLocationNPCs(locationId) {
        const location = this.getLocation(locationId);
        return location?.npcs || [];
    }

    // Get shops in a location
    getLocationShops(locationId) {
        const location = this.getLocation(locationId);
        return location?.shops || [];
    }

    // Get travel destinations from current location
    getTravelDestinations(locationId) {
        const location = this.getLocation(locationId);
        if (!location?.connections) return [];

        return Object.entries(location.connections).map(([destId, destInfo]) => ({
            id: destId,
            name: destInfo.name,
            distance: destInfo.distance,
            difficulty: destInfo.difficulty,
            travel_time: destInfo.travel_time,
            destination: this.getLocation(destId)
        }));
    }

    // Set current location
    setCurrentLocation(locationId) {
        const location = this.getLocation(locationId);
        if (!location) {
            console.error(`Location ${locationId} not found`);
            return false;
        }

        this.currentLocation = locationId;
        if (gameData && gameData.player) {
            gameData.player.location = locationId;
        }

        console.log(`📍 Player moved to ${location.name}`);
        return true;
    }

    // Get current location data
    getCurrentLocation() {
        if (!this.currentLocation) return null;
        return this.getLocation(this.currentLocation);
    }

    // Show location modal with available actions
    showLocationModal(locationId) {
        const location = this.getLocation(locationId);
        if (!location) return;

        const actions = this.getLocationActions(locationId);
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-2xl font-cinzel text-white">${location.name}</h2>
                        <p class="text-gray-400 text-sm">
                            ${RegionUtils ? RegionUtils.getRegionInfo(location.region).createBadge('mr-2') : `<span class="px-2 py-1 bg-gray-600 text-white text-xs rounded">${location.region}</span>`}
                            ${location.tags ? location.tags.join(' • ') : ''}
                        </p>
                    </div>
                    <button id="close-location-modal" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                ${location.image ? `<div class="mb-4 rounded-lg overflow-hidden">
                    <img src="${location.image}" alt="${location.name}" class="w-full h-48 object-cover">
                </div>` : ''}
                
                <p class="text-gray-300 mb-6">${location.description}</p>
                
                <div class="space-y-3">
                    <h3 class="text-lg font-semibold text-white mb-3">Available Actions</h3>
                    ${actions.map(action => `
                        <button class="location-action-btn w-full bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-left transition-colors"
                                data-type="${action.type}" data-subtype="${action.subtype || ''}" data-target="${action.target || ''}" data-cost="${action.cost || 0}">
                            <div class="flex items-center">
                                <i class="${action.icon || 'fas fa-arrow-right'} text-blue-400 mr-3"></i>
                                <div class="flex-1">
                                    <div class="text-white font-medium">${action.text}</div>
                                    <div class="text-gray-400 text-sm">${action.description || ''}</div>
                                    ${action.cost ? `<div class="text-yellow-400 text-sm">Cost: ${action.cost} gold</div>` : ''}
                                </div>
                            </div>
                        </button>
                    `).join('')}
                </div>
                
                ${location.points_of_interest && location.points_of_interest.length > 0 ? `
                    <div class="mt-6">
                        <h3 class="text-lg font-semibold text-white mb-3">Points of Interest</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            ${location.points_of_interest.map(poi => `
                                <div class="bg-gray-700 rounded-lg p-3">
                                    <div class="text-white font-medium">${poi.name}</div>
                                    <div class="text-gray-400 text-sm">${poi.description}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('#close-location-modal').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

        modal.querySelectorAll('.location-action-btn').forEach(btn => {
            btn.onclick = () => this.handleLocationAction(btn, locationId, modal);
        });
    }

    // Handle location action clicks
    handleLocationAction(btn, locationId, modal) {
        const type = btn.dataset.type;
        const subtype = btn.dataset.subtype;
        const target = btn.dataset.target;
        const cost = parseInt(btn.dataset.cost) || 0;

        switch (type) {
            case 'shops':
                this.showShopsModal(locationId);
                break;
            case 'npcs':
                this.showNPCsModal(locationId);
                break;
            case 'service':
                this.handleService(subtype, cost, locationId);
                break;
            case 'travel_modal':
                this.showTravelModal(locationId);
                break;
            case 'travel':
                if (target) {
                    modal.remove();
                    this.travelToLocation(target);
                }
                break;
            case 'explore':
                this.exploreLocation(locationId);
                break;
            case 'scene':
                if (target) {
                    modal.remove();
                    window.renderScene(target);
                }
                break;
            case 'info':
                showGameMessage(btn.dataset.info || 'No information available.', 'info');
                break;
        }
    }

    // Show shops modal
    showShopsModal(locationId) {
        const shops = this.getLocationShops(locationId);
        if (shops.length === 0) {
            showGameMessage('No shops available in this location.', 'info');
            return;
        }

        // For now, just show the first shop - this can be expanded
        const shop = shops[0];
        showGameMessage(`Welcome to ${shop.name}! (Shop system to be integrated)`, 'info');
    }

    // Show NPCs modal
    showNPCsModal(locationId) {
        const npcs = this.getLocationNPCs(locationId);
        if (npcs.length === 0) {
            showGameMessage('No one to talk to here.', 'info');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-cinzel text-white">People to Talk To</h2>
                    <button id="close-npcs-modal" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="space-y-3">
                    ${npcs.map(npc => `
                        <button class="npc-btn w-full bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-left transition-colors"
                                data-npc-id="${npc.id}">
                            <div class="text-white font-medium">${npc.name}</div>
                            <div class="text-gray-400 text-sm">${npc.role}</div>
                            <div class="text-gray-300 text-sm mt-1">${npc.description}</div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#close-npcs-modal').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

        modal.querySelectorAll('.npc-btn').forEach(btn => {
            btn.onclick = () => {
                const npcId = btn.dataset.npcId;
                modal.remove();
                this.startNPCDialogue(npcId);
            };
        });
    }

    // Show travel modal
    showTravelModal(locationId) {
        const destinations = this.getTravelDestinations(locationId);
        if (destinations.length === 0) {
            showGameMessage('No travel routes available from this location.', 'info');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-cinzel text-white">Travel Destinations</h2>
                    <button id="close-travel-modal" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="space-y-3">
                    ${destinations.map(dest => `
                        <button class="travel-btn w-full bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-left transition-colors"
                                data-location-id="${dest.id}">
                            <div class="text-white font-medium">${dest.name}</div>
                            <div class="text-gray-400 text-sm">Distance: ${dest.distance} km • ${dest.travel_time}</div>
                            <div class="text-${dest.difficulty === 'easy' ? 'green' : dest.difficulty === 'moderate' ? 'yellow' : 'red'}-400 text-sm">
                                Difficulty: ${dest.difficulty}
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#close-travel-modal').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

        modal.querySelectorAll('.travel-btn').forEach(btn => {
            btn.onclick = () => {
                const destId = btn.dataset.locationId;
                modal.remove();
                this.travelToLocation(destId);
            };
        });
    }

    // Travel to a location
    travelToLocation(locationId) {
        if (this.setCurrentLocation(locationId)) {
            renderLocation(locationId);
            showGameMessage(`You have arrived at ${this.getLocation(locationId).name}`, 'success');
        }
    }

    // Handle services
    handleService(serviceType, cost, locationId) {
        const player = gameData.player;
        
        if (cost > 0 && player.gold < cost) {
            showGameMessage(`You need ${cost} gold to use this service.`, 'warning');
            return;
        }

        switch (serviceType) {
            case 'inn':
                player.gold -= cost;
                player.hitPoints = player.maxHitPoints;
                showGameMessage(`You rest at the inn and recover to full health. (-${cost} gold)`, 'success');
                break;
            case 'healer':
                // Implement healer logic
                showGameMessage('The healer tends to your wounds.', 'success');
                break;
            case 'blacksmith':
                // Implement blacksmith logic
                showGameMessage('The blacksmith examines your equipment.', 'info');
                break;
        }

        updateDisplay();
    }

    // Start NPC dialogue
    startNPCDialogue(npcId) {
        // This will be connected to the dialogue system
        showGameMessage(`Starting conversation with ${npcId}... (Dialogue system integration needed)`, 'info');
    }

    // Explore location
    exploreLocation(locationId) {
        const location = this.getLocation(locationId);
        
        if (!location) {
            showGameMessage('Location not found.', 'error');
            return;
        }

        // Show exploration modal with available activities
        this.showExplorationModal(location);
    }

    // Show exploration modal with available activities
    showExplorationModal(location) {
        // Remove any existing modal
        const existingModal = document.getElementById('exploration-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'exploration-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        
        // Get available exploration activities
        const activities = this.getExplorationActivities(location);
        
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-2xl font-cinzel text-white">🌲 Explore ${location.name}</h2>
                        <p class="text-gray-400 text-sm mt-1">${location.exploration?.description || 'What would you like to do here?'}</p>
                    </div>
                    <button id="close-exploration-modal" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-gray-700 rounded-lg p-4 border-l-4 border-green-500">
                        <h3 class="font-cinzel text-lg text-white mb-3">Available Activities</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            ${activities.map(activity => `
                                <button class="exploration-activity-btn bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-lg text-left transition-colors"
                                        data-activity="${activity.type}" data-location="${location.id}">
                                    <div class="flex items-center mb-2">
                                        <span class="text-xl mr-2">${activity.icon}</span>
                                        <span class="font-cinzel text-lg">${activity.name}</span>
                                    </div>
                                    <p class="text-gray-300 text-sm">${activity.description}</p>
                                    ${activity.timeRequired ? `<p class="text-yellow-400 text-xs mt-1">⏱️ ${activity.timeRequired}</p>` : ''}
                                    ${activity.skillRequired ? `<p class="text-blue-400 text-xs">🎯 ${activity.skillRequired} Check</p>` : ''}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    ${location.exploration?.dangers && location.exploration.dangers.length > 0 ? `
                        <div class="bg-red-900 bg-opacity-50 rounded-lg p-4 border-l-4 border-red-500">
                            <h4 class="font-cinzel text-red-300 mb-2">⚠️ Potential Dangers</h4>
                            <ul class="text-red-200 text-sm space-y-1">
                                ${location.exploration.dangers.map(danger => `<li>• ${danger}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                
                <div class="mt-6 flex justify-end">
                    <button id="cancel-exploration" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        document.body.appendChild(modal);
        
        // Close modal handlers
        modal.querySelector('#close-exploration-modal').onclick = () => modal.remove();
        modal.querySelector('#cancel-exploration').onclick = () => modal.remove();
        
        // Click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        // Activity button handlers
        modal.querySelectorAll('.exploration-activity-btn').forEach(btn => {
            btn.onclick = () => {
                const activity = btn.dataset.activity;
                const locationId = btn.dataset.location;
                modal.remove();
                this.handleExplorationActivity(activity, locationId);
            };
        });
    }

    // Get available exploration activities for a location
    getExplorationActivities(location) {
        const activities = [];
        
        // Base activities available in wilderness areas
        if (location.foragable) {
            activities.push({
                type: 'forage',
                name: 'Forage',
                icon: '🌿',
                description: 'Search for herbs, berries, and other useful materials',
                timeRequired: '30 minutes',
                skillRequired: 'Survival'
            });
        }
        
        if (location.exploration?.huntable) {
            activities.push({
                type: 'hunt',
                name: 'Hunt',
                icon: '🏹',
                description: 'Track and hunt local wildlife for meat and materials',
                timeRequired: '2 hours',
                skillRequired: 'Survival'
            });
        }
        
        if (location.exploration?.scoutable) {
            activities.push({
                type: 'scout',
                name: 'Scout',
                icon: '🔍',
                description: 'Survey the area for threats, paths, and points of interest',
                timeRequired: '1 hour',
                skillRequired: 'Perception'
            });
        }
        
        if (location.exploration?.camp) {
            activities.push({
                type: 'camp',
                name: 'Set Up Camp',
                icon: '🏕️',
                description: 'Establish a temporary camp for extended rest',
                timeRequired: '1 hour',
                skillRequired: 'Survival'
            });
        }
        
        if (location.exploration?.meditate && location.tags?.includes('magical')) {
            activities.push({
                type: 'meditate',
                name: 'Meditate',
                icon: '🧘',
                description: 'Focus on the magical energies present in this location',
                timeRequired: '1 hour',
                skillRequired: 'Arcana'
            });
        }
        
        if (location.exploration?.investigate && location.points_of_interest) {
            activities.push({
                type: 'investigate',
                name: 'Investigate',
                icon: '🔎',
                description: 'Examine points of interest more closely',
                timeRequired: '45 minutes',
                skillRequired: 'Investigation'
            });
        }
        
        // Custom activities from location data
        if (location.exploration?.custom_activities) {
            location.exploration.custom_activities.forEach(activity => {
                activities.push(activity);
            });
        }
        
        return activities;
    }

    // Handle specific exploration activities
    handleExplorationActivity(activity, locationId) {
        const location = this.getLocation(locationId);
        
        switch (activity) {
            case 'forage':
                if (window.foragingSystem) {
                    window.foragingSystem.forage(locationId);
                } else {
                    showGameMessage('Foraging system not available.', 'error');
                }
                break;
                
            case 'hunt':
                this.handleHunting(location);
                break;
                
            case 'scout':
                this.handleScouting(location);
                break;
                
            case 'camp':
                this.handleCamping(location);
                break;
                
            case 'meditate':
                this.handleMeditation(location);
                break;
                
            case 'investigate':
                this.handleInvestigation(location);
                break;
                
            case 'gather_rumors':
                this.handleGatherRumors(location);
                break;
                
            case 'network':
                this.handleNetworking(location);
                break;
                
            default:
                showGameMessage(`${activity} is not yet implemented.`, 'info');
                break;
        }
    }

    // Handle hunting activity
    handleHunting(location) {
        showGameMessage('🏹 You begin tracking wildlife in the area...', 'info');
        
        // Advance time by 2 hours
        if (typeof advanceTime === 'function') {
            advanceTime(7200000); // 2 hours in milliseconds
        }
        
        // Simple hunting mechanic (can be expanded)
        const survivalModifier = gameData.player.skills?.survival || 0;
        const roll = Math.floor(Math.random() * 20) + 1 + survivalModifier;
        const dc = location.exploration?.hunting_dc || 15;
        
        if (roll >= dc) {
            const meat = Math.floor(Math.random() * 3) + 1;
            const hide = Math.floor(Math.random() * 2);
            
            if (typeof addToInventory === 'function') {
                if (meat > 0) addToInventory('fresh_meat', meat);
                if (hide > 0) addToInventory('animal_hide', hide);
            }
            
            let message = `🎯 Successful hunt! You gained ${meat} fresh meat`;
            if (hide > 0) message += ` and ${hide} animal hide`;
            showGameMessage(message, 'success');
        } else {
            showGameMessage('🚫 Your hunt was unsuccessful. The animals eluded you.', 'warning');
        }
        
        updateDisplay();
    }

    // Handle scouting activity
    handleScouting(location) {
        showGameMessage('🔍 You carefully survey the surrounding area...', 'info');
        
        // Advance time by 1 hour
        if (typeof advanceTime === 'function') {
            advanceTime(3600000);
        }
        
        const perceptionModifier = gameData.player.skills?.perception || 0;
        const roll = Math.floor(Math.random() * 20) + 1 + perceptionModifier;
        const dc = location.exploration?.scouting_dc || 12;
        
        if (roll >= dc) {
            const discoveries = location.exploration?.scout_discoveries || [
                'You notice animal tracks leading to a water source.',
                'You spot a safe path through the difficult terrain.',
                'You identify potential shelter locations.',
                'You observe the movement patterns of local wildlife.'
            ];
            
            const discovery = discoveries[Math.floor(Math.random() * discoveries.length)];
            showGameMessage(`🎯 ${discovery}`, 'success');
            
            // Grant small XP bonus for successful scouting
            if (typeof grantExperience === 'function') {
                grantExperience(25);
            }
        } else {
            showGameMessage('You survey the area but don\'t notice anything particularly useful.', 'info');
        }
        
        updateDisplay();
    }

    // Handle camping activity
    handleCamping(location) {
        showGameMessage('🏕️ You begin setting up a temporary camp...', 'info');
        
        // Advance time by 1 hour for setup
        if (typeof advanceTime === 'function') {
            advanceTime(3600000);
        }
        
        const survivalModifier = gameData.player.skills?.survival || 0;
        const roll = Math.floor(Math.random() * 20) + 1 + survivalModifier;
        const dc = location.exploration?.camping_dc || 10;
        
        if (roll >= dc) {
            showGameMessage('⛺ Camp established successfully! You can now rest safely here.', 'success');
            // Could add temporary location modification or camp site tracking
        } else {
            showGameMessage('🚫 You struggle to find a suitable camping spot.', 'warning');
        }
        
        updateDisplay();
    }

    // Handle meditation activity
    handleMeditation(location) {
        showGameMessage('🧘 You sit quietly and focus on the magical energies around you...', 'info');
        
        // Advance time by 1 hour
        if (typeof advanceTime === 'function') {
            advanceTime(3600000);
        }
        
        const arcanaModifier = gameData.player.skills?.arcana || 0;
        const roll = Math.floor(Math.random() * 20) + 1 + arcanaModifier;
        const dc = location.exploration?.meditation_dc || 14;
        
        if (roll >= dc) {
            const insights = location.exploration?.meditation_insights || [
                'You sense ancient magical energies flowing through this place.',
                'The magical aura here feels connected to celestial movements.',
                'You perceive traces of old spells woven into the very air.',
                'The magical resonance here suggests this was once a place of power.'
            ];
            
            const insight = insights[Math.floor(Math.random() * insights.length)];
            showGameMessage(`✨ ${insight}`, 'success');
            
            // Grant small XP bonus and possibly temporary magical insight
            if (typeof grantExperience === 'function') {
                grantExperience(50);
            }
        } else {
            showGameMessage('You meditate peacefully but gain no particular insights.', 'info');
        }
        
        updateDisplay();
    }

    // Handle investigation activity  
    handleInvestigation(location) {
        showGameMessage('🔎 You begin examining the points of interest more closely...', 'info');
        
        // Advance time by 45 minutes
        if (typeof advanceTime === 'function') {
            advanceTime(2700000);
        }
        
        const investigationModifier = gameData.player.skills?.investigation || 0;
        const roll = Math.floor(Math.random() * 20) + 1 + investigationModifier;
        const dc = location.exploration?.investigation_dc || 13;
        
        if (roll >= dc && location.points_of_interest) {
            const poi = location.points_of_interest[Math.floor(Math.random() * location.points_of_interest.length)];
            const discoveries = location.exploration?.investigation_discoveries || [
                `You discover hidden details about ${poi.name}.`,
                `Your examination of ${poi.name} reveals interesting historical clues.`,
                `You uncover subtle signs that ${poi.name} has been used recently.`
            ];
            
            const discovery = discoveries[Math.floor(Math.random() * discoveries.length)];
            showGameMessage(`🔍 ${discovery}`, 'success');
            
            if (typeof grantExperience === 'function') {
                grantExperience(35);
            }
        } else {
            showGameMessage('Your investigation doesn\'t turn up anything new.', 'info');
        }
        
        updateDisplay();
    }

    // Handle gathering rumors in towns
    handleGatherRumors(location) {
        showGameMessage('👂 You mingle with locals and listen for interesting gossip...', 'info');
        
        // Advance time by 1 hour
        if (typeof advanceTime === 'function') {
            advanceTime(3600000);
        }
        
        const persuasionModifier = gameData.player.skills?.persuasion || 0;
        const roll = Math.floor(Math.random() * 20) + 1 + persuasionModifier;
        const dc = 12;
        
        if (roll >= dc) {
            // Load rumors from data files if available
            const rumors = [
                'A merchant mentions strange lights seen near the Griefwood.',
                'Someone whispers about ancient treasures hidden in old ruins.',
                'You hear talk of unusual weather patterns affecting trade routes.',
                'A traveler shares stories of helpful spirits encountered in the wilderness.',
                'Locals discuss concerns about increased monster activity.',
                'You learn about a festival planned for the next moon phase.'
            ];
            
            const rumor = rumors[Math.floor(Math.random() * rumors.length)];
            showGameMessage(`💭 Rumor gathered: ${rumor}`, 'success');
            
            // Could add rumors to journal system
            if (typeof grantExperience === 'function') {
                grantExperience(15);
            }
        } else {
            showGameMessage('You spend time listening but don\'t pick up any interesting information.', 'info');
        }
        
        updateDisplay();
    }

    // Handle networking in towns
    handleNetworking(location) {
        showGameMessage('🤝 You introduce yourself and work to build relationships with locals...', 'info');
        
        // Advance time by 2 hours
        if (typeof advanceTime === 'function') {
            advanceTime(7200000);
        }
        
        const persuasionModifier = gameData.player.skills?.persuasion || 0;
        const roll = Math.floor(Math.random() * 20) + 1 + persuasionModifier;
        const dc = 13;
        
        if (roll >= dc) {
            const benefits = [
                'You make friends with a local merchant who offers better prices.',
                'You gain the trust of a guard who shares useful information.',
                'You connect with a craftsperson willing to teach you techniques.',
                'You befriend a local who offers you lodging discounts.',
                'You establish contacts who might have work opportunities.'
            ];
            
            const benefit = benefits[Math.floor(Math.random() * benefits.length)];
            showGameMessage(`🎯 ${benefit}`, 'success');
            
            // Could add relationship tracking or unlock new options
            if (typeof grantExperience === 'function') {
                grantExperience(25);
            }
        } else {
            showGameMessage('Your attempts at networking don\'t yield significant results.', 'warning');
        }
        
        updateDisplay();
    }
}

// Create global location manager instance
const locationManager = new LocationManager();

// Make available globally
if (typeof window !== 'undefined') {
    window.locationManager = locationManager;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    locationManager.initialize();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocationManager;
}

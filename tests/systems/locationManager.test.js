/**
 * Location Manager Test Suite
 * Tests for individual location file loading and LocationManager functionality
 */

// Mock fetch for testing
global.fetch = jest.fn();

// Mock DOM elements and globals
global.document = {
    createElement: jest.fn(() => ({
        className: '',
        innerHTML: '',
        onclick: jest.fn(),
        remove: jest.fn(),
        querySelector: jest.fn(() => ({ onclick: jest.fn() })),
        querySelectorAll: jest.fn(() => [{ onclick: jest.fn(), dataset: {} }])
    })),
    body: {
        appendChild: jest.fn()
    },
    addEventListener: jest.fn()
};

global.window = {
    locationsData: {},
    locationManager: null
};

global.console = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};

// Mock game functions
global.showGameMessage = jest.fn();
global.renderLocation = jest.fn();
global.updateDisplay = jest.fn();

// Mock DATA_BASE_PATH
global.DATA_BASE_PATH = 'src/data/';

// Import the LocationManager class
const LocationManager = require('../../src/assets/js/systems/locationManager');

describe('LocationManager', () => {
    let locationManager;
    
    beforeEach(() => {
        locationManager = new LocationManager();
        fetch.mockClear();
        console.log.mockClear();
        console.warn.mockClear();
        console.error.mockClear();
    });

    describe('initialization', () => {
        it('should initialize with empty locations', () => {
            expect(locationManager.locations).toEqual({});
            expect(locationManager.currentLocation).toBeNull();
            expect(locationManager.detailedLocations).toEqual({});
        });
    });

    describe('loadBaseLocations', () => {
        const mockLocationData = {
            id: 'test_location',
            name: 'Test Location',
            description: 'A test location',
            region: 'test'
        };

        it('should load all location files successfully', async () => {
            // Mock successful responses for all location files
            fetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockLocationData)
            });

            await locationManager.loadBaseLocations();

            // Verify all expected location files were requested
            expect(fetch).toHaveBeenCalledWith('src/data/locations/frontier/westwalker_camp.json');
            expect(fetch).toHaveBeenCalledWith('src/data/locations/frontier/griefwood_edge.json');
            expect(fetch).toHaveBeenCalledWith('src/data/locations/frontier/griefwood_clearing.json');
            expect(fetch).toHaveBeenCalledWith('src/data/locations/towns/westhaven.json');
            expect(fetch).toHaveBeenCalledWith('src/data/locations/towns/jorn.json');
            expect(fetch).toHaveBeenCalledWith('src/data/locations/pridelands/leonin_encampment.json');
            expect(fetch).toHaveBeenCalledWith('src/data/locations/gaia/gaian_library.json');

            // Should have 7 locations loaded (all files)
            expect(Object.keys(locationManager.locations)).toHaveLength(7);
        });

        it('should handle failed location loads gracefully', async () => {
            // Mock some successful and some failed responses
            fetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockLocationData)
                })
                .mockResolvedValueOnce({
                    ok: false,
                    status: 404
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ ...mockLocationData, id: 'test_location_2' })
                });

            await locationManager.loadBaseLocations();

            // Should have loaded the successful ones
            expect(Object.keys(locationManager.locations).length).toBeGreaterThan(0);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should throw error if no locations can be loaded', async () => {
            // Mock all requests to fail
            fetch.mockResolvedValue({
                ok: false,
                status: 404
            });

            await expect(locationManager.loadBaseLocations()).rejects.toThrow('No location files could be loaded');
        });

        it('should sync with global locationsData', async () => {
            global.window.locationsData = {};
            
            fetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockLocationData)
            });

            await locationManager.loadBaseLocations();

            // Should have synced data to window.locationsData
            expect(Object.keys(window.locationsData)).toHaveLength(7);
        });
    });

    describe('location retrieval methods', () => {
        beforeEach(() => {
            // Set up test locations
            locationManager.locations = {
                'test_location_1': {
                    id: 'test_location_1',
                    name: 'Test Location 1',
                    region: 'Frontier',
                    shops: [{ id: 'shop1', name: 'Test Shop' }],
                    npcs: [{ id: 'npc1', name: 'Test NPC' }],
                    connections: { 'test_location_2': { name: 'Test Location 2' } }
                },
                'test_location_2': {
                    id: 'test_location_2',
                    name: 'Test Location 2',
                    region: 'Gaia',
                    shops: [],
                    npcs: []
                }
            };
        });

        it('should get location by ID', () => {
            const location = locationManager.getLocation('test_location_1');
            expect(location).toBeDefined();
            expect(location.name).toBe('Test Location 1');
        });

        it('should return null for non-existent location', () => {
            const location = locationManager.getLocation('non_existent');
            expect(location).toBeNull();
        });

        it('should get locations by region', () => {
            const frontierLocations = locationManager.getLocationsByRegion('frontier');
            expect(frontierLocations).toHaveLength(1);
            expect(frontierLocations[0].name).toBe('Test Location 1');
            
            // Test case insensitive search
            const frontierLocationsCapitalized = locationManager.getLocationsByRegion('Frontier');
            expect(frontierLocationsCapitalized).toHaveLength(1);
        });

        it('should get location NPCs', () => {
            const npcs = locationManager.getLocationNPCs('test_location_1');
            expect(npcs).toHaveLength(1);
            expect(npcs[0].name).toBe('Test NPC');
        });

        it('should get location shops', () => {
            const shops = locationManager.getLocationShops('test_location_1');
            expect(shops).toHaveLength(1);
            expect(shops[0].name).toBe('Test Shop');
        });

        it('should get travel destinations', () => {
            const destinations = locationManager.getTravelDestinations('test_location_1');
            expect(destinations).toHaveLength(1);
            expect(destinations[0].id).toBe('test_location_2');
            expect(destinations[0].name).toBe('Test Location 2');
        });
    });

    describe('location actions', () => {
        beforeEach(() => {
            locationManager.locations = {
                'full_location': {
                    id: 'full_location',
                    name: 'Full Feature Location',
                    actions: [
                        { text: 'Custom Action', type: 'custom' }
                    ],
                    shops: [{ id: 'shop1', name: 'Test Shop' }],
                    npcs: [{ id: 'npc1', name: 'Test NPC' }],
                    services: {
                        inn: { available: true, cost: 5 },
                        healer: { available: true },
                        blacksmith: { available: false }
                    },
                    connections: { 'other_location': { name: 'Other Location' } },
                    foragable: true,
                    points_of_interest: [
                        { id: 'poi1', name: 'Interesting Place' }
                    ]
                }
            };
        });

        it('should generate comprehensive action list', () => {
            const actions = locationManager.getLocationActions('full_location');
            
            // Check for different action types
            const actionTypes = actions.map(a => a.type);
            expect(actionTypes).toContain('shops');
            expect(actionTypes).toContain('npcs');
            expect(actionTypes).toContain('service');
            expect(actionTypes).toContain('travel_modal');
            expect(actionTypes).toContain('explore');
            
            // Check for custom actions from location data
            expect(actions.find(a => a.text === 'Custom Action')).toBeDefined();
            
            // Check for service-specific actions
            const innAction = actions.find(a => a.subtype === 'inn');
            expect(innAction).toBeDefined();
            expect(innAction.cost).toBe(5);
            
            const healerAction = actions.find(a => a.subtype === 'healer');
            expect(healerAction).toBeDefined();
            
            // Should NOT have blacksmith action since it's not available
            const blacksmithAction = actions.find(a => a.subtype === 'blacksmith');
            expect(blacksmithAction).toBeUndefined();
        });
    });

    describe('location management', () => {
        beforeEach(() => {
            locationManager.locations = {
                'test_location': {
                    id: 'test_location',
                    name: 'Test Location'
                }
            };
            
            global.gameData = {
                player: {
                    location: null
                }
            };
        });

        it('should set current location', () => {
            const result = locationManager.setCurrentLocation('test_location');
            expect(result).toBe(true);
            expect(locationManager.currentLocation).toBe('test_location');
            expect(gameData.player.location).toBe('test_location');
        });

        it('should fail to set non-existent location', () => {
            const result = locationManager.setCurrentLocation('non_existent');
            expect(result).toBe(false);
            expect(locationManager.currentLocation).toBeNull();
        });

        it('should get current location data', () => {
            locationManager.setCurrentLocation('test_location');
            const current = locationManager.getCurrentLocation();
            expect(current).toBeDefined();
            expect(current.name).toBe('Test Location');
        });
    });

    describe('service handling', () => {
        beforeEach(() => {
            global.gameData = {
                player: {
                    gold: 100,
                    hitPoints: 50,
                    maxHitPoints: 100
                }
            };
        });

        it('should handle inn service', () => {
            locationManager.handleService('inn', 10, 'test_location');
            
            expect(gameData.player.gold).toBe(90);
            expect(gameData.player.hitPoints).toBe(100);
            expect(showGameMessage).toHaveBeenCalledWith(
                'You rest at the inn and recover to full health. (-10 gold)', 
                'success'
            );
        });

        it('should reject service if insufficient gold', () => {
            gameData.player.gold = 5;
            
            locationManager.handleService('inn', 10, 'test_location');
            
            expect(gameData.player.gold).toBe(5); // Should not change
            expect(showGameMessage).toHaveBeenCalledWith(
                'You need 10 gold to use this service.', 
                'warning'
            );
        });
    });
});

describe('Location File Integration Test', () => {
    const fs = require('fs');
    const path = require('path');
    
    const locationFilePaths = [
        'src/data/locations/frontier/westwalker_camp.json',
        'src/data/locations/frontier/griefwood_edge.json',
        'src/data/locations/frontier/griefwood_clearing.json',
        'src/data/locations/towns/westhaven.json',
        'src/data/locations/towns/jorn.json',
        'src/data/locations/pridelands/leonin_encampment.json',
        'src/data/locations/gaia/gaian_library.json'
    ];

    it('should have all expected location files', () => {
        locationFilePaths.forEach(filePath => {
            const fullPath = path.join(__dirname, '../../', filePath);
            expect(fs.existsSync(fullPath)).toBe(true);
        });
    });

    it('should have valid JSON in all location files', () => {
        locationFilePaths.forEach(filePath => {
            const fullPath = path.join(__dirname, '../../', filePath);
            const content = fs.readFileSync(fullPath, 'utf8');
            
            expect(() => {
                JSON.parse(content);
            }).not.toThrow();
        });
    });

    it('should have required fields in all location files', () => {
        const requiredFields = ['id', 'name', 'description', 'region'];
        
        locationFilePaths.forEach(filePath => {
            const fullPath = path.join(__dirname, '../../', filePath);
            const content = fs.readFileSync(fullPath, 'utf8');
            const locationData = JSON.parse(content);
            
            requiredFields.forEach(field => {
                expect(locationData).toHaveProperty(field);
                expect(locationData[field]).toBeTruthy();
            });
        });
    });

    it('should have consistent data structure across all location files', () => {
        const expectedStructure = {
            id: 'string',
            name: 'string',
            description: 'string',
            region: 'string',
            available_actions: 'object',
            services: 'object',
            danger_level: 'string'
        };

        locationFilePaths.forEach(filePath => {
            const fullPath = path.join(__dirname, '../../', filePath);
            const content = fs.readFileSync(fullPath, 'utf8');
            const locationData = JSON.parse(content);
            
            Object.keys(expectedStructure).forEach(field => {
                if (locationData[field] !== undefined) {
                    expect(typeof locationData[field]).toBe(expectedStructure[field]);
                }
            });
        });
    });

    it('should have valid available_actions structure', () => {
        const expectedActions = ['shop', 'talk', 'rest', 'travel', 'explore'];
        
        locationFilePaths.forEach(filePath => {
            const fullPath = path.join(__dirname, '../../', filePath);
            const content = fs.readFileSync(fullPath, 'utf8');
            const locationData = JSON.parse(content);
            
            if (locationData.available_actions) {
                expectedActions.forEach(action => {
                    expect(locationData.available_actions).toHaveProperty(action);
                    expect(typeof locationData.available_actions[action]).toBe('boolean');
                });
            }
        });
    });

    it('should have valid services structure', () => {
        const expectedServices = ['inn', 'healer', 'blacksmith'];
        
        locationFilePaths.forEach(filePath => {
            const fullPath = path.join(__dirname, '../../', filePath);
            const content = fs.readFileSync(fullPath, 'utf8');
            const locationData = JSON.parse(content);
            
            if (locationData.services) {
                expectedServices.forEach(service => {
                    if (locationData.services[service]) {
                        expect(locationData.services[service]).toHaveProperty('available');
                        expect(typeof locationData.services[service].available).toBe('boolean');
                    }
                });
            }
        });
    });

    it('should have unique location IDs', () => {
        const locationIds = [];
        
        locationFilePaths.forEach(filePath => {
            const fullPath = path.join(__dirname, '../../', filePath);
            const content = fs.readFileSync(fullPath, 'utf8');
            const locationData = JSON.parse(content);
            
            expect(locationIds).not.toContain(locationData.id);
            locationIds.push(locationData.id);
        });
    });
});

describe('LocationManager Visual Test Helper', () => {
    it('should generate location summary report', () => {
        const fs = require('fs');
        const path = require('path');
        
        const locationFilePaths = [
            'src/data/locations/frontier/westwalker_camp.json',
            'src/data/locations/frontier/griefwood_edge.json',
            'src/data/locations/frontier/griefwood_clearing.json',
            'src/data/locations/towns/westhaven.json',
            'src/data/locations/towns/jorn.json',
            'src/data/locations/pridelands/leonin_encampment.json',
            'src/data/locations/gaia/gaian_library.json'
        ];

        console.log('\n=== LOCATION LOADING TEST REPORT ===\n');
        
        locationFilePaths.forEach(filePath => {
            const fullPath = path.join(__dirname, '../../', filePath);
            
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                const locationData = JSON.parse(content);
                
                console.log(`📍 ${locationData.name}`);
                console.log(`   ID: ${locationData.id}`);
                console.log(`   Region: ${locationData.region}`);
                console.log(`   Actions: ${Object.keys(locationData.available_actions || {}).join(', ')}`);
                console.log(`   Services: ${Object.keys(locationData.services || {}).filter(s => locationData.services[s].available).join(', ') || 'None'}`);
                console.log(`   NPCs: ${locationData.npcs ? locationData.npcs.length : 0}`);
                console.log(`   Shops: ${locationData.shops ? locationData.shops.length : 0}`);
                console.log(`   Connections: ${Object.keys(locationData.connections || {}).join(', ') || 'None'}`);
                console.log(`   Foragable: ${locationData.foragable ? 'Yes' : 'No'}`);
                console.log(`   Danger: ${locationData.danger_level}`);
                console.log('');
                
            } catch (error) {
                console.error(`❌ Failed to load ${filePath}:`, error.message);
            }
        });
        
        console.log('=== END REPORT ===\n');
        
        // This test always passes - it's just for generating the report
        expect(true).toBe(true);
    });
});

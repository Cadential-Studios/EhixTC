// Edoria: The Triune Convergence - Main Game Script

// Game Data Structure
const gameData = {
    player: {
        origin: null,
        location: null,
        inventory: [],
        quests: { active: [], completed: [] },
        lore: new Set(),
        rumors: new Set(),
    },
    time: {
        day: 1,
        month: 0,
        year: 998,
        months: ["Alphi", "Brenn", "Frutia", "Dorona", "Evorn", "Filik", "Grenn", "Halbar"],
        monthDescriptions: ["The Awakening", "The Growing", "The Zenith", "The Bounty", "The Waning", "The Reaping", "The Fading", "The Sleeping"]
    },
    story: {
        currentScene: null
    }
};

// Data Storage
let locationsData = {};
let scenesData = {};
let classesData = {};
let itemsData = {};
let questsData = {};
let monstersData = {};
let calendarData = {};

// DOM Elements
const startScreen = document.getElementById('start-screen');
const characterCreationScreen = document.getElementById('character-creation-screen');
const gameScreen = document.getElementById('game-screen');
const startGameButton = document.getElementById('start-game-button');
const originChoices = document.querySelectorAll('#character-creation-screen .choice-button');
const mainContentEl = document.getElementById('main-content');
const dateEl = document.getElementById('current-date');
const monthDescEl = document.getElementById('month-description');
const moonEdyriaEl = document.getElementById('moon-edyria');
const moonKapraEl = document.getElementById('moon-kapra');
const moonEniaEl = document.getElementById('moon-enia');
const navButtons = document.querySelectorAll('.nav-icon');
const uiPanels = document.querySelectorAll('.ui-panel');
const closePanelButtons = document.querySelectorAll('.close-panel-btn');
const characterContentEl = document.getElementById('character-content');
const journalContentEl = document.getElementById('journal-content');
const inventoryContentEl = document.getElementById('inventory-content');

// Data Loading Functions
async function loadGameData() {
    try {
        const responses = await Promise.all([
            fetch('data/locations.json'),
            fetch('data/scenes.json'),
            fetch('data/classes.json'),
            fetch('data/items.json'),
            fetch('data/quests.json'),
            fetch('data/monsters.json'),
            fetch('data/calendar.json')
        ]);

        const data = await Promise.all(responses.map(response => response.json()));
        
        [locationsData, scenesData, classesData, itemsData, questsData, monstersData, calendarData] = data;
        
        console.log('Game data loaded successfully');
    } catch (error) {
        console.error('Error loading game data:', error);
        // Fallback to embedded data if files aren't available
        loadFallbackData();
    }
}

function loadFallbackData() {
    // Fallback data in case JSON files can't be loaded
    locationsData = {
        westwalker_camp: {
            name: "Westwalker Campfire",
            description: "A small, well-kept campfire crackles, a lonely point of light against the vast, darkening plains of the Frontier. The edge of the Griefwood looms like a wall of shadow in the distance. The air is still, but carries an unusual chill.",
            image: "https://placehold.co/800x300/4B3F3F/E0E0E0?text=Westwalker+Camp",
            actions: [
                { text: "Rest by the fire", type: 'scene', target: 'start_vision' },
                { text: "Check your gear", type: 'info', info: "Your ranger's pack is light but well-stocked. You have what you need to survive." },
                { text: "Scout the perimeter", type: 'info', info: "The area seems quiet... too quiet." },
                { text: "Travel to Jorn", type: 'travel', target: 'jorn' }
            ]
        },
        leonin_encampment: {
            name: "M'ra Kaal Encampment",
            description: "The scent of woodsmoke and roasting meat hangs in the air. Around you, the proud Leonin of your clan share stories and sharpen their blades. The sounds of the Ancestral Roar still echo in your spirit.",
            image: "https://placehold.co/800x300/6D4C3C/E0E0E0?text=M'ra+Kaal+Encampment",
            actions: [
                { text: "Meditate on the spirits", type: 'scene', target: 'start_vision' },
                { text: "Visit the Honor Arena", type: 'info', info: "Two warriors are locked in a duel of skill, their movements a blur of muscle and steel. It is a dance of honor." },
                { text: "Speak to the Clan-Speaker", type: 'info', info: "Zema Mataal is deep in communion and cannot be disturbed." },
            ]
        },
        gaian_library: {
            name: "The Great Library of Gaia",
            description: "Sunlight, filtered through high, arched windows, illuminates swirling dust motes. The air smells of old parchment and endless knowledge. Scholars move like ghosts between towering shelves.",
            image: "https://placehold.co/800x300/3C4F6D/E0E0E0?text=Great+Library+of+Gaia",
            actions: [
                { text: "Study the celestial charts", type: 'scene', target: 'start_vision' },
                { text: "Consult a Sage", type: 'info', info: "The sage nods slowly. 'The Convergence, yes... a time of great peril and great opportunity. The stars do not lie.'" },
                { text: "Explore the Archives", type: 'info', info: "You find a dusty tome that mentions 'celestial schisms' and 'realm-thinning' during past Convergences." },
            ]
        }
    };

    scenesData = {
        start_vision: {
            text: "As you focus, the world melts away. The red moon, Kapra, seems to swell in the sky, its light turning from eerie to malevolent. The world holds its breath, and then your mind is violently pulled away.",
            choices: [
                { text: "Witness the vision.", nextScene: "vision" }
            ]
        },
        vision: {
            onEnter: () => {
                gameData.player.quests.active.push("The Vision");
                gameData.player.lore.add("The Triune Convergence is a time of great upheaval.");
            },
            text: "You see flashes: A throne of twisted iron under a black sky. A Leonin warrior with a shattered mane. A dwarven forge, cold and dark. A tidal wave of shadow washing over the plains of Ehix. And through it all, three moons burning like hateful eyes, their light not illuminating, but consuming. You gasp and return to yourself, heart hammering in your chest, the horrifying images seared into your memory.",
            choices: [
                { text: "This is an omen. I must understand it.", nextScene: "seek_answers" },
                { text: "It was just a nightmare, a trick of the light.", nextScene: "dismiss" },
            ]
        },
        seek_answers: {
            text: "The vision feels too real to ignore. It's a warning. The Triune Convergence is not just a celestial event; it's a threat. You know you cannot stand by and do nothing. Your path begins now. Where will you go?",
            choices: [
                { text: "Travel to Gaia and consult the sages.", nextScene: "end_prologue" },
                { text: "Speak with the elders of my people.", nextScene: "end_prologue" },
                { text: "Seek out the reclusive druids of the S'Liviah.", nextScene: "end_prologue" },
            ]
        },
        dismiss: {
            text: "You shake your head, trying to clear the disturbing images. It was the stress of the times, the talk of prophecies, the strange color of the moon. Nothing more. You try to settle back into your routine, but a sliver of ice remains in your gut. The vision, whether real or not, has changed something within you.",
            choices: [
                { text: "I should still be more watchful...", nextScene: "end_prologue" }
            ]
        },
        end_prologue: {
            text: "Your journey has just begun. The fate of Edoria may well rest on the choices you make under the light of the three moons. (To be continued...)",
            choices: []
        }
    };
}

// Game Functions
function updateDisplay() {
    const monthName = gameData.time.months[gameData.time.month];
    dateEl.textContent = `${monthName} ${gameData.time.day}, ${gameData.time.year} PA`;
    monthDescEl.textContent = gameData.time.monthDescriptions[gameData.time.month];
    
    const edyriaPhase = (gameData.time.day % 15) / 14;
    const kapraPhase = (gameData.time.day % 28) / 27;
    const eniaPhase = (gameData.time.day % 38) / 37;
    
    moonEdyriaEl.style.opacity = 0.2 + (edyriaPhase * 0.8);
    moonKapraEl.style.opacity = 0.2 + (kapraPhase * 0.8);
    moonEniaEl.style.opacity = 0.2 + (eniaPhase * 0.8);
}

function renderScene(sceneId) {
    const scene = scenesData[sceneId];
    if (!scene) return;
    
    if (scene.onEnter) scene.onEnter();

    gameData.story.currentScene = sceneId;
    advanceTime();
    
    mainContentEl.innerHTML = `
        <p class="story-text p-4 bg-black bg-opacity-20 rounded-lg mb-6">${typeof scene.text === 'function' ? scene.text(gameData.player.origin) : scene.text}</p>
        <div id="choices" class="grid grid-cols-1 gap-4 mt-auto"></div>
    `;
    
    const choicesEl = document.getElementById('choices');
    scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.className = 'choice-button w-full text-left p-4 rounded-lg font-cinzel text-lg';
        button.onclick = () => {
            if (choice.nextScene) {
                renderScene(choice.nextScene);
            } else {
                renderLocation(gameData.player.location);
            }
        };
        choicesEl.appendChild(button);
    });
}

function renderLocation(locationId) {
    const location = locationsData[locationId];
    if (!location) return;

    gameData.player.location = locationId;
    gameData.story.currentScene = null;
    
    mainContentEl.innerHTML = `
        <div class="mb-4 rounded-lg overflow-hidden"><img src="${location.image}" alt="${location.name}" class="w-full h-full object-cover"></div>
        <h2 class="font-cinzel text-2xl text-white mb-2">${location.name}</h2>
        <p class="text-gray-300 mb-6">${location.description}</p>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-auto">
            ${location.actions.map(action => `
                <button class="action-button p-4 rounded-lg" data-type="${action.type}" data-target="${action.target}" data-info="${action.info || ''}">
                    <span class="font-cinzel text-lg">${action.text}</span>
                </button>
            `).join('')}
        </div>
    `;
    
    document.querySelectorAll('.action-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.currentTarget.dataset.type;
            const target = e.currentTarget.dataset.target;
            const info = e.currentTarget.dataset.info;

            if (type === 'scene') {
                renderScene(target);
            } else if (type === 'info') {
                alert(info);
            } else if (type === 'travel') {
                alert(`Traveling to ${target}... (not yet implemented)`);
            }
        });
    });
}

function advanceTime() {
    gameData.time.day++;
    if (gameData.time.day > 40) {
        gameData.time.day = 1;
        gameData.time.month = (gameData.time.month + 1) % gameData.time.months.length;
        if (gameData.time.month === 0) gameData.time.year++;
    }
    updateDisplay();
}

function openPanel(panelId) {
    closeAllPanels();
    const panel = document.getElementById(panelId);
    if(panel) {
        if(panelId === 'character-panel') {
            let originText = '';
            if (gameData.player.origin === 'westwalker') originText = 'Westwalker of the Frontier';
            if (gameData.player.origin === 'leonin') originText = 'M\'ra Kaal Spirit-Speaker';
            if (gameData.player.origin === 'gaian') originText = 'Gaian Scholar';
            characterContentEl.innerHTML = `<p class="text-xl mb-4">Origin: ${originText}</p><p class="text-gray-400">More stats and details will appear here.</p>`;
        }
        if(panelId === 'journal-panel') {
            journalContentEl.innerHTML = `
                <h3 class="font-cinzel text-xl text-yellow-300 mb-2">Active Quests</h3>
                <div class="text-gray-300 mb-6">${gameData.player.quests.active.map(q => `<p>${q}</p>`).join('') || '<p>None.</p>'}</div>
                <h3 class="font-cinzel text-xl text-yellow-300 mb-2">Rumors</h3>
                <div class="text-gray-300 mb-6">${[...gameData.player.rumors].map(r => `<p>${r}</p>`).join('') || '<p>None.</p>'}</div>
                <h3 class="font-cinzel text-xl text-yellow-300 mb-2">Lore</h3>
                <div class="text-gray-300">${[...gameData.player.lore].map(l => `<p>${l}</p>`).join('') || '<p>None.</p>'}</div>
            `;
        }
        if(panelId === 'inventory-panel') {
             inventoryContentEl.innerHTML = Array(12).fill(0).map(() => `<div class="w-20 h-20 bg-black bg-opacity-20 border border-gray-600 rounded"></div>`).join('');
        }
        panel.style.display = 'block';
    }
}

function closeAllPanels() {
    uiPanels.forEach(panel => panel.style.display = 'none');
}

// Event Listeners
startGameButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    characterCreationScreen.style.display = 'flex';
});

originChoices.forEach(choice => {
    choice.addEventListener('click', () => {
        gameData.player.origin = choice.dataset.origin;
        characterCreationScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        
        let startLocation;
        if (gameData.player.origin === 'westwalker') startLocation = 'westwalker_camp';
        else if (gameData.player.origin === 'leonin') startLocation = 'leonin_encampment';
        else if (gameData.player.origin === 'gaian') startLocation = 'gaian_library';
        
        renderLocation(startLocation);
    });
});

navButtons.forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel)));
closePanelButtons.forEach(button => button.addEventListener('click', closeAllPanels));

// Initialize Game
async function initializeGame() {
    await loadGameData();
    updateDisplay();
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);

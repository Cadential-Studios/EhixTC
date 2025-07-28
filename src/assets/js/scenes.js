// Scene and Location Management Module
// Edoria: The Triune Convergence - Scenes & Locations

// Scene rendering and management
function renderScene(sceneId) {
    const scene = scenesData[sceneId];
    if (!scene) return;

    if (gameData.story.currentScene && gameData.story.currentScene !== sceneId) {
        gameData.story.completedScenes.push(gameData.story.currentScene);
    }

    if (typeof scene.onEnter === 'function') {
        scene.onEnter();
    }

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
            ${location.actions.map((action, index) => `
                <button class="action-button p-4 rounded-lg"
                        data-type="${action.type}"
                        data-target="${action.target || ''}"
                        data-info="${action.info || ''}"
                        data-skill="${action.skill || ''}"
                        data-dc="${action.dc || ''}"
                        data-success-text="${action.successText || ''}"
                        data-failure-text="${action.failureText || ''}"
                        data-index="${index}">
                    <span class="font-cinzel text-lg">${action.text}</span>
                </button>
            `).join('')}
            ${location.foragable ? `<button class="action-button p-4 rounded-lg" data-type="forage" data-location="${locationId}"><span class="font-cinzel text-lg">Forage</span></button>` : ''}
        </div>
    `;
    
    // Only bind actions within the rendered location to avoid interference with
    // unrelated UI elements (e.g., close buttons)
    if (mainContentEl) {
        mainContentEl.querySelectorAll('.action-button').forEach(button => {
            button.addEventListener('click', handleActionButton);
        });
    }
}

function handleActionButton(e) {
    const button = e.currentTarget;
    const type = button.dataset.type;
    const target = button.dataset.target;
    const info = button.dataset.info;
    const skill = button.dataset.skill;
    const dc = parseInt(button.dataset.dc);
    const successText = button.dataset.successText;
    const failureText = button.dataset.failureText;
    
    switch (type) {
        case 'scene':
            if (scenesData[target]) {
                renderScene(target);
            } else {
                showGameMessage(`Scene "${target}" not found.`, 'warning');
            }
            break;
            
        case 'info':
            showGameMessage(info, 'info');
            break;
            
        case 'skill_check':
            triggerSkillCheck(skill, dc, `${skillDisplayNames[skill]} check`, 
                function(result) {
                    // Success callback
                    setTimeout(() => {
                        showGameMessage(successText, 'success');
                        gameData.player.lore.add(successText);
                    }, gameData.settings.showDiceAnimations ? 3000 / gameData.settings.combatAnimationSpeed : 500);
                },
                function(result) {
                    // Failure callback
                    setTimeout(() => {
                        showGameMessage(failureText, 'failure');
                        gameData.player.lore.add(failureText);
                    }, gameData.settings.showDiceAnimations ? 3000 / gameData.settings.combatAnimationSpeed : 500);
                }
            );
            break;
            
        case 'travel':
            // Check if target location exists
            if (locationsData[target]) {
                renderLocation(target);
            } else {
                showGameMessage(`Location "${target}" not found. Travel system needs this location to be defined in locations.json.`, 'warning');
            }
            break;
            
        case 'combat':
            if (target === 'test_combat') {
                testCombat();
            } else {
                showGameMessage('Combat system not fully implemented yet.', 'info');
            }
            break;

        case 'forage':
            foragingSystem.forage(gameData.player.location);
            break;

        default:
            showGameMessage(`Unknown action type: ${type}`, 'warning');
    }
}

// Fallback scene data
function loadFallbackScenes() {
    if (Object.keys(scenesData).length === 0) {
        scenesData = {
            start_vision: {
                text: "As you focus, the world melts away. The red moon, Kapra, seems to swell in the sky, its light turning from eerie to malevolent. The world holds its breath, and then your mind is violently pulled away.",
                choices: [
                    { text: "Witness the vision.", nextScene: "vision" }
                ]
            },
            vision: {
                onEnter: () => {
                    gameData.player.lore.add("You have witnessed a prophetic vision of the Triune Convergence.");
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
}

// Add some skill checks to locations if they don't have them
function enhanceLocationsWithSkillChecks() {
    // todo: pull these from a data file or define them more cleanly
    // Add skill checks to westwalker camp if it doesn't have them
    if (locationsData.westwalker_camp && locationsData.westwalker_camp.actions) {
        const actions = locationsData.westwalker_camp.actions;
        
        // Check if skill checks already exist
        const hasSkillChecks = actions.some(action => action.type === 'skill_check');
        
        if (!hasSkillChecks) {
            // Add skill check actions
            actions.splice(2, 0, // Insert after "Check your gear"
                { 
                    text: "Scout the perimeter (Perception)", 
                    type: "skill_check", 
                    skill: "perception", 
                    dc: 15, 
                    successText: "You notice tracks leading toward the Griefwood - something large passed this way recently.", 
                    failureText: "The area seems quiet... too quiet." 
                },
                { 
                    text: "Forage for supplies (Survival)", 
                    type: "skill_check", 
                    skill: "survival", 
                    dc: 12, 
                    successText: "You find some edible berries and medicinal herbs growing nearby.", 
                    failureText: "You find nothing of value in the sparse wilderness." 
                }
            );
        }
    }
    
    // Add skill checks to leonin encampment
    if (locationsData.leonin_encampment && locationsData.leonin_encampment.actions) {
        const actions = locationsData.leonin_encampment.actions;
        
        const hasSkillChecks = actions.some(action => action.type === 'skill_check');
        
        if (!hasSkillChecks) {
            actions.splice(2, 0, // Insert after "Visit the Honor Arena"
                { 
                    text: "Challenge a warrior (Athletics)", 
                    type: "skill_check", 
                    skill: "athletics", 
                    dc: 16, 
                    successText: "You prove your strength and earn the respect of your clan-mates.", 
                    failureText: "The warrior bests you, but nods with respect for your effort." 
                },
                { 
                    text: "Read the spiritual signs (Insight)", 
                    type: "skill_check", 
                    skill: "insight", 
                    dc: 14, 
                    successText: "The spirits whisper of coming change - the Convergence draws near.", 
                    failureText: "The spirits remain silent, their messages unclear." 
                }
            );
        }
    }
    
    // Add skill checks to gaian library
    if (locationsData.gaian_library && locationsData.gaian_library.actions) {
        const actions = locationsData.gaian_library.actions;
        
        const hasSkillChecks = actions.some(action => action.type === 'skill_check');
        
        if (!hasSkillChecks) {
            actions.splice(2, 0, // Insert after "Consult a Sage"
                { 
                    text: "Research ancient texts (Investigation)", 
                    type: "skill_check", 
                    skill: "investigation", 
                    dc: 13, 
                    successText: "You uncover references to the 'Triune Convergence' and its connection to dimensional instability.", 
                    failureText: "The ancient texts are too cryptic and damaged to yield useful information." 
                },
                { 
                    text: "Decipher magical runes (Arcana)", 
                    type: "skill_check", 
                    skill: "arcana", 
                    dc: 17, 
                    successText: "The runes speak of a ritual that might stabilize or destabilize the Convergence itself.", 
                    failureText: "The magical symbols are too complex for your current understanding." 
                }
            );
        }
    }
}

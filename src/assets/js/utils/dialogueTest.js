/**
 * Dialogue System Test Interface
 * Quick way to test the YAML dialogue system
 */

function createDialogueTestButton() {
    // Create test button
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Dialogue';
    testButton.className = 'bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded ml-2';
    testButton.style.position = 'fixed';
    testButton.style.top = '10px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '1000';
    
    testButton.addEventListener('click', () => {
        // Test the Village Elder dialogue
        if (window.startDialogue) {
            const success = window.startDialogue('Village Elder');
            if (!success) {
                showGameMessage('No available dialogues for Village Elder', 'warning');
            }
        } else {
            showGameMessage('Dialogue system not ready yet', 'warning');
        }
    });
    
    document.body.appendChild(testButton);
}

// Create the test button when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other systems to load
    setTimeout(createDialogueTestButton, 2000);
});

// Also add to developer console commands
if (window.DeveloperConsole) {
    // Add dialogue test commands
    const dialogueCommands = {
        'test_dialogue': {
            description: 'Test the dialogue system with Village Elder',
            execute: () => {
                if (window.startDialogue) {
                    const success = window.startDialogue('Village Elder');
                    return success ? 'Started dialogue with Village Elder' : 'No available dialogues';
                }
                return 'Dialogue system not ready';
            }
        },
        'dialogue_status': {
            description: 'Show dialogue system status',
            execute: () => {
                const status = {
                    systemReady: !!window.dialogueIntegration,
                    yamlLoaded: !!window.YAMLDialogueSystem,
                    integration: !!window.DialogueIntegration,
                    startFunction: !!window.startDialogue
                };
                return JSON.stringify(status, null, 2);
            }
        }
    };
    
    // Add commands to developer console if available
    setTimeout(() => {
        if (window.developerConsole && window.developerConsole.commands) {
            Object.assign(window.developerConsole.commands, dialogueCommands);
        }
    }, 1000);
}

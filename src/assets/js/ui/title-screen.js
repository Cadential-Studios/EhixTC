/**
 * Title Screen Enhanced Functionality
 * Edoria: The Triune Convergence
 */

// Title Screen State Management
window.titleScreenState = {
    audioEnabled: true,
    settingsOpen: false,
    animationsEnabled: true
};

/**
 * Initialize title screen enhancements
 */
function initializeTitleScreen() {
    console.log('🎭 Initializing enhanced title screen...');
    
    // Set up moon interactions
    setupMoonInteractions();
    
    // Initialize button functionality
    setupButtonFunctionality();
    
    // Check if we should hide dev buttons
    checkProductionMode();
    
    // Add keyboard navigation
    setupKeyboardNavigation();
    
    console.log('✅ Title screen enhanced features loaded');
}

/**
 * Setup moon hover and click interactions
 */
function setupMoonInteractions() {
    const moons = document.querySelectorAll('.moon');
    
    moons.forEach(moon => {
        // Enhanced hover effects
        moon.addEventListener('mouseenter', () => {
            moon.style.animationPlayState = 'paused';
            moon.style.transform = 'scale(1.2)';
        });
        
        moon.addEventListener('mouseleave', () => {
            moon.style.animationPlayState = 'running';
            moon.style.transform = '';
        });
        
        // Click for moon info (future feature)
        moon.addEventListener('click', () => {
            const moonName = moon.classList.contains('moon-edyria') ? 'Edyria' :
                           moon.classList.contains('moon-kapra') ? 'Kapra' : 'Enia';
            showMoonInfo(moonName);
        });
    });
}

/**
 * Setup enhanced button functionality
 */
function setupButtonFunctionality() {
    // Settings toggle
    window.toggleSettings = function() {
        console.log('Settings toggled');
        // Future: Open settings panel
        alert('Settings panel coming soon!');
    };
    
    // Audio toggle
    window.toggleAudio = function() {
        window.titleScreenState.audioEnabled = !window.titleScreenState.audioEnabled;
        const btn = document.querySelector('.utility-btn[onclick="toggleAudio()"]');
        const icon = btn.querySelector('i');
        
        if (window.titleScreenState.audioEnabled) {
            icon.className = 'ph-duotone ph-speaker-high';
            btn.innerHTML = '<i class="ph-duotone ph-speaker-high"></i> Audio';
        } else {
            icon.className = 'ph-duotone ph-speaker-slash';
            btn.innerHTML = '<i class="ph-duotone ph-speaker-slash"></i> Audio';
        }
        
        console.log('Audio toggled:', window.titleScreenState.audioEnabled);
    };
    
    // Load game functionality
    window.loadGame = function() {
        console.log('Load game clicked');
        // Future: Show load game dialog
        alert('Load game feature coming soon!');
    };
    
    // New game options
    window.showNewGameOptions = function() {
        console.log('New game options clicked');
        // Future: Show difficulty/origin selection
        alert('New game options coming soon!');
    };
    
    // Game settings
    window.showGameSettings = function() {
        console.log('Game settings clicked');
        // Future: Show in-game settings
        alert('Game settings panel coming soon!');
    };
    
    // Check updates functionality
    window.checkForUpdates = function() {
        console.log('Checking for updates...');
        // Future: Implement update checking
        alert('Update checking feature coming soon!');
    };
}

/**
 * Show moon information modal
 */
function showMoonInfo(moonName) {
    const moonInfo = {
        'Edyria': {
            color: '#6a8dff',
            domain: 'Magic & Knowledge',
            description: 'The blue moon Edyria governs arcane energies and scholarly pursuits.'
        },
        'Kapra': {
            color: '#ff6a6a',
            domain: 'Passion & War',
            description: 'The red moon Kapra influences emotions, conflict, and fierce determination.'
        },
        'Enia': {
            color: '#fffb8a',
            domain: 'Wisdom & Growth',
            description: 'The golden moon Enia nurtures life, wisdom, and natural harmony.'
        }
    };
    
    const info = moonInfo[moonName];
    if (info) {
        console.log(`🌙 ${moonName} - ${info.domain}: ${info.description}`);
        // Future: Show beautiful modal with moon lore
        alert(`🌙 ${moonName}\n${info.domain}\n\n${info.description}`);
    }
}

/**
 * Check if in production mode and hide dev buttons
 */
function checkProductionMode() {
    // Check if we're in production (you can set this based on hostname, build flags, etc.)
    const isProduction = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1' &&
                        !window.location.hostname.includes('github.io');
    
    if (isProduction) {
        document.body.classList.add('production');
        console.log('🚀 Production mode: Dev buttons hidden');
    } else {
        console.log('🛠️ Development mode: Dev buttons visible');
    }
}

/**
 * Setup keyboard navigation for accessibility
 */
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'Enter':
            case ' ':
                // Activate focused element
                if (document.activeElement && document.activeElement.click) {
                    e.preventDefault();
                    document.activeElement.click();
                }
                break;
                
            case 'Escape':
                // Close any open modals/overlays
                const overlay = document.getElementById('version-overlay');
                if (overlay && overlay.style.display !== 'none') {
                    overlay.style.display = 'none';
                }
                break;
                
            case '1':
                // Quick start game
                if (e.ctrlKey) {
                    e.preventDefault();
                    document.getElementById('start-game-button').click();
                }
                break;
        }
    });
}

/**
 * Enhanced mobile mode toggle with better UX
 */
function enhancedToggleMobileMode() {
    const originalToggle = window.toggleMobileMode;
    
    window.toggleMobileMode = function() {
        // Call original function
        if (originalToggle) {
            originalToggle();
        }
        
        // Add visual feedback
        const btn = document.getElementById('mobile-mode-toggle');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
        
        console.log('📱 Mobile mode toggled with enhanced UX');
    };
}

/**
 * Add particle effects on button hover (future enhancement)
 */
function addButtonParticles() {
    const buttons = document.querySelectorAll('.primary-btn, .secondary-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Future: Add particle burst effect
            console.log('✨ Button particle effect triggered');
        });
    });
}

/**
 * Initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all other scripts are loaded
    setTimeout(() => {
        initializeTitleScreen();
        enhancedToggleMobileMode();
        addButtonParticles();
    }, 100);
});

// Export for global access
window.titleScreenEnhancements = {
    initializeTitleScreen,
    showMoonInfo,
    setupMoonInteractions,
    setupButtonFunctionality
};

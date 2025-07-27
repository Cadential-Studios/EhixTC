// Mobile Mode Toggle Functionality
let isMobileMode = false;

function toggleMobileMode() {
    isMobileMode = !isMobileMode;
    const body = document.body;
    const toggleText = document.getElementById('mobile-toggle-text');
    
    if (isMobileMode) {
        body.classList.add('mobile-mode');
        if (toggleText) toggleText.textContent = 'Desktop Mode';
        // Store preference in localStorage
        localStorage.setItem('ehix-mobile-mode', 'true');
        console.log('Mobile mode enabled');
    } else {
        body.classList.remove('mobile-mode');
        if (toggleText) toggleText.textContent = 'Mobile Mode';
        localStorage.setItem('ehix-mobile-mode', 'false');
        console.log('Mobile mode disabled');
    }
    
    // Update any UI elements that need to change based on mobile mode
    updateMobileUI();
}

function updateMobileUI() {
    // Adjust font sizes and spacing based on mobile mode
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        if (isMobileMode) {
            gameContainer.style.fontSize = '14px';
        } else {
            gameContainer.style.fontSize = '';
        }
    }
    
    // Update button text sizes for better touch targets
    const buttons = document.querySelectorAll('.choice-button, .action-button');
    buttons.forEach(button => {
        if (isMobileMode) {
            button.style.fontSize = '0.9rem';
            button.style.padding = '0.75rem';
        } else {
            button.style.fontSize = '';
            button.style.padding = '';
        }
    });

    const grid = document.querySelector('.inventory-grid');
    if (grid) {
        if (isMobileMode) {
            grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            grid.style.maxHeight = '70vh';
        } else {
            grid.style.gridTemplateColumns = '';
            grid.style.maxHeight = '';
        }
    }
}

function initializeMobileMode() {
    // Check if mobile mode was previously enabled
    const savedMode = localStorage.getItem('ehix-mobile-mode');
    const toggleText = document.getElementById('mobile-toggle-text');
    
    if (savedMode === 'true') {
        isMobileMode = true;
        document.body.classList.add('mobile-mode');
        if (toggleText) toggleText.textContent = 'Desktop Mode';
        updateMobileUI();
    } else {
        if (toggleText) toggleText.textContent = 'Mobile Mode';
    }
    
    // Auto-detect mobile devices and suggest mobile mode
    if (window.innerWidth <= 430 && !localStorage.getItem('ehix-mobile-mode-suggested')) {
        setTimeout(() => {
            const suggestion = confirm('Mobile device detected! Would you like to enable mobile mode for a better experience?');
            if (suggestion) {
                toggleMobileMode();
            }
            localStorage.setItem('ehix-mobile-mode-suggested', 'true');
        }, 1000);
    }
}

// Initialize mobile mode when the page loads
document.addEventListener('DOMContentLoaded', initializeMobileMode);

// Handle orientation changes
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        updateMobileUI();
    }, 100);
});

// Handle resize events
window.addEventListener('resize', function() {
    // Suggest mobile mode for small screens
    if (window.innerWidth <= 430 && !isMobileMode && !localStorage.getItem('ehix-mobile-mode-suggested')) {
        localStorage.setItem('ehix-mobile-mode-suggested', 'true');
        const suggestion = confirm('Small screen detected! Would you like to enable mobile mode?');
        if (suggestion) {
            toggleMobileMode();
        }
    }
});

/**
 * Readable Items System for Edoria: The Triune Convergence
 * Handles items with the "readable" property and displays their markdown content
 */

class ReadableItemsSystem {
    constructor() {
        this.modal = null;
        this.currentItem = null;
        this.markdownParser = new MarkdownParser();
        this.initializeModal();
    }

    /**
     * Initialize the readable items modal
     */
    initializeModal() {
        // Create modal HTML
        const modalHTML = `
            <div id="readable-item-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden">
                <div class="bg-gray-800 border border-gray-600 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <!-- Modal Header -->
                    <div class="flex justify-between items-center p-4 border-b border-gray-600">
                        <h2 id="readable-item-title" class="text-xl font-bold text-white">Reading Item</h2>
                        <button id="close-readable-modal" class="text-gray-400 hover:text-white transition-colors">
                            <i class="ph-duotone ph-x text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- Modal Content -->
                    <div class="flex-1 overflow-y-auto p-6 max-h-[70vh]">
                        <div id="readable-item-content" class="prose prose-invert max-w-none">
                            <!-- Markdown content will be inserted here -->
                        </div>
                    </div>
                    
                    <!-- Modal Footer -->
                    <div class="flex justify-end p-4 border-t border-gray-600">
                        <button id="finish-reading-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                            <i class="ph-duotone ph-check mr-2"></i>Finish Reading
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Cache modal element
        this.modal = document.getElementById('readable-item-modal');

        // Set up event listeners
        this.setupEventListeners();
    }

    /**
     * Set up event listeners for the modal
     */
    setupEventListeners() {
        const closeBtn = document.getElementById('close-readable-modal');
        const finishBtn = document.getElementById('finish-reading-btn');

        closeBtn.addEventListener('click', () => this.closeModal());
        finishBtn.addEventListener('click', () => this.closeModal());

        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    /**
     * Read an item with readable property
     * @param {string} itemId - The ID of the item to read
     */
    async readItem(itemId) {
        try {
            // Get item data
            const item = await this.getItemData(itemId);
            if (!item) {
                this.showError('Item not found');
                return;
            }

            // Check if item is readable
            if (!item.properties || !item.properties.includes('readable')) {
                this.showError('This item is not readable');
                return;
            }

            // Check if item has content file
            if (!item.contents) {
                this.showError('No content file specified for this item');
                return;
            }

            this.currentItem = item;

            // Load and display content
            await this.loadAndDisplayContent(item);

        } catch (error) {
            console.error('Error reading item:', error);
            this.showError('Failed to read item');
        }
    }

    /**
     * Get item data from the game data
     * @param {string} itemId - The ID of the item
     * @returns {Object|null} - The item data or null if not found
     */
    async getItemData(itemId) {
        // Check if item is in player inventory first
        if (gameData?.player?.inventory) {
            const inventoryItem = gameData.player.inventory.find(item => item.id === itemId);
            if (inventoryItem) {
                return inventoryItem.data || inventoryItem;
            }
        }

        // If not in inventory, try to load from item data files
        try {
            // Try quest_items.json first
            const questItems = await this.loadJSON('src/data/items/quest_items.json');
            if (questItems && questItems[itemId]) {
                return questItems[itemId];
            }

            // Try other item files if needed
            const itemFiles = [
                'src/data/items/armor.json',
                'src/data/items/weapons.json',
                'src/data/items/consumables.json',
                'src/data/items/misc.json'
            ];

            for (const file of itemFiles) {
                try {
                    const items = await this.loadJSON(file);
                    if (items && items[itemId]) {
                        return items[itemId];
                    }
                } catch (e) {
                    // Continue to next file if this one fails
                    continue;
                }
            }
        } catch (error) {
            console.error('Error loading item data:', error);
        }

        return null;
    }

    /**
     * Load JSON file
     * @param {string} filePath - Path to the JSON file
     * @returns {Object} - Parsed JSON data
     */
    async loadJSON(filePath) {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
        }
        return response.json();
    }

    /**
     * Load and display the content from the markdown file
     * @param {Object} item - The item data
     */
    async loadAndDisplayContent(item) {
        try {
            // Load markdown content
            const contentPath = `src/data/readable_content/${item.contents}`;
            const response = await fetch(contentPath);
            
            if (!response.ok) {
                throw new Error(`Failed to load content file: ${response.statusText}`);
            }

            const markdownContent = await response.text();

            // Parse markdown to HTML
            const htmlContent = this.markdownParser.parse(markdownContent);

            // Update modal content
            document.getElementById('readable-item-title').textContent = item.name || 'Unknown Item';
            document.getElementById('readable-item-content').innerHTML = htmlContent;

            // Show modal
            this.showModal();

        } catch (error) {
            console.error('Error loading content:', error);
            this.showError('Failed to load item content');
        }
    }

    /**
     * Show the reading modal
     */
    showModal() {
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    /**
     * Close the reading modal
     */
    closeModal() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
        this.currentItem = null;
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        if (typeof showGameMessage === 'function') {
            showGameMessage(message, 'error');
        } else {
            alert(message);
        }
    }

    /**
     * Check if an item is readable
     * @param {Object} item - The item data
     * @returns {boolean} - True if the item is readable
     */
    static isReadable(item) {
        return item && item.properties && item.properties.includes('readable');
    }
}

/**
 * Simple Markdown Parser
 * Converts basic markdown syntax to HTML
 */
class MarkdownParser {
    constructor() {
        this.rules = [
            // Headers
            { pattern: /^### (.*$)/gm, replacement: '<h3 class="text-lg font-bold text-amber-400 mb-3 mt-4">$1</h3>' },
            { pattern: /^## (.*$)/gm, replacement: '<h2 class="text-xl font-bold text-amber-300 mb-4 mt-5">$1</h2>' },
            { pattern: /^# (.*$)/gm, replacement: '<h1 class="text-2xl font-bold text-amber-200 mb-4 mt-6">$1</h1>' },
            
            // Bold and Italic
            { pattern: /\*\*\*(.*?)\*\*\*/g, replacement: '<strong><em class="text-yellow-300">$1</em></strong>' },
            { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong class="text-yellow-300">$1</strong>' },
            { pattern: /\*(.*?)\*/g, replacement: '<em class="text-gray-300">$1</em>' },
            
            // Line breaks and paragraphs
            { pattern: /\n\n/g, replacement: '</p><p class="mb-4 text-gray-200 leading-relaxed">' },
            
            // Lists
            { pattern: /^\* (.*$)/gm, replacement: '<li class="text-gray-200 mb-1">$1</li>' },
            { pattern: /^\- (.*$)/gm, replacement: '<li class="text-gray-200 mb-1">$1</li>' },
            
            // Horizontal rules
            { pattern: /^---$/gm, replacement: '<hr class="border-gray-600 my-4">' },
            
            // Code blocks (inline)
            { pattern: /`([^`]+)`/g, replacement: '<code class="bg-gray-700 text-green-400 px-2 py-1 rounded text-sm">$1</code>' },
            
            // Links (basic)
            { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2" class="text-blue-400 hover:text-blue-300 underline">$1</a>' }
        ];
    }

    /**
     * Parse markdown content to HTML
     * @param {string} markdown - The markdown content
     * @returns {string} - HTML content
     */
    parse(markdown) {
        let html = markdown;

        // Apply all markdown rules
        for (const rule of this.rules) {
            html = html.replace(rule.pattern, rule.replacement);
        }

        // Wrap in paragraph tags and handle lists
        html = '<p class="mb-4 text-gray-200 leading-relaxed">' + html + '</p>';
        
        // Clean up list formatting
        html = html.replace(/(<li class="text-gray-200 mb-1">.*<\/li>)/g, (match) => {
            const listItems = match;
            return `<ul class="list-disc list-inside mb-4 space-y-1">${listItems}</ul>`;
        });

        // Clean up empty paragraphs
        html = html.replace(/<p class="mb-4 text-gray-200 leading-relaxed"><\/p>/g, '');
        
        return html;
    }
}

// Global instance
const readableItemsSystem = new ReadableItemsSystem();

// Global function for easy access
window.readItem = (itemId) => {
    readableItemsSystem.readItem(itemId);
};

// Add developer console command for testing
if (typeof window.DeveloperConsole !== 'undefined') {
    // Add command to test readable items
    window.DeveloperConsole.addCommand('test_readable', {
        description: 'Add a test readable item (letter_1) to inventory',
        execute: () => {
            if (typeof window.DeveloperMenu !== 'undefined' && window.DeveloperMenu.addItemById) {
                window.DeveloperMenu.addItemById('letter_1', 1);
                return 'Added Crumpled Letter to inventory. Check your inventory and click Read!';
            } else {
                return 'Developer menu not available';
            }
        }
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ReadableItemsSystem, MarkdownParser };
}

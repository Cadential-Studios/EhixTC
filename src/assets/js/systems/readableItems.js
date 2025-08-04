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
        console.log(`readItem: Attempting to read item "${itemId}"`);
        
        try {
            // Get item data
            const item = await this.getItemData(itemId);
            if (!item) {
                console.error(`readItem: Item "${itemId}" not found`);
                this.showError('Item not found');
                return;
            }

            console.log(`readItem: Item data:`, item);
            console.log(`readItem: Item properties:`, item.properties);
            console.log(`readItem: Item contents:`, item.contents);

            // Check if item is readable
            if (!item.properties || !Array.isArray(item.properties) || !item.properties.includes('readable')) {
                console.error(`readItem: Item "${itemId}" is not readable. Properties:`, item.properties);
                this.showError('This item is not readable');
                return;
            }

            // Check if item has content file
            if (!item.contents) {
                console.error(`readItem: Item "${itemId}" has no contents specified`);
                this.showError('No content file specified for this item');
                return;
            }

            this.currentItem = item;

            console.log(`readItem: Loading and displaying content for "${itemId}"`);
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
        console.log(`getItemData: Looking for item "${itemId}"`);
        
        // Check if item is in player inventory first
        if (gameData?.player?.inventory) {
            const inventoryItem = gameData.player.inventory.find(item => item.id === itemId);
            if (inventoryItem) {
                const itemData = inventoryItem.data || inventoryItem;
                console.log(`getItemData: Found in inventory:`, itemData);
                return itemData;
            }
        }

        // Check loaded items data
        if (window.itemsData) {
            // Try flat structure first
            if (window.itemsData[itemId]) {
                console.log(`getItemData: Found in flat itemsData:`, window.itemsData[itemId]);
                return window.itemsData[itemId];
            }
            
            // Try category structure
            const categories = ['weapons', 'armor', 'consumables', 'tools', 'misc', 'quest_items'];
            for (const category of categories) {
                if (window.itemsData[category] && window.itemsData[category][itemId]) {
                    console.log(`getItemData: Found in category ${category}:`, window.itemsData[category][itemId]);
                    return window.itemsData[category][itemId];
                }
            }
        }

        // If not in inventory, try to load from item data files
        try {
            // Try quest_items.json first
            const questItems = await this.loadJSON('src/data/items/quest_items.json');
            console.log(`getItemData: Loaded quest items:`, questItems);
            if (questItems && questItems[itemId]) {
                console.log(`getItemData: Found in quest_items.json:`, questItems[itemId]);
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
            console.log(`loadAndDisplayContent: Loading content from "${contentPath}"`);
            
            const response = await fetch(contentPath);
            
            if (!response.ok) {
                console.error(`loadAndDisplayContent: Failed to load ${contentPath}: ${response.statusText}`);
                throw new Error(`Failed to load content file: ${response.statusText}`);
            }

            const markdownContent = await response.text();
            console.log(`loadAndDisplayContent: Loaded markdown content:`, markdownContent);

            // Parse markdown to HTML
            const htmlContent = this.markdownParser.parse(markdownContent);
            console.log(`loadAndDisplayContent: Parsed HTML content:`, htmlContent);

            // Update modal content
            document.getElementById('readable-item-title').textContent = item.name || 'Unknown Item';
            document.getElementById('readable-item-content').innerHTML = htmlContent;

            console.log(`loadAndDisplayContent: Updated modal with title "${item.name}" and content`);

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
            // Headers (all 6 levels)
            { pattern: /^###### (.*$)/gm, replacement: '<h6 class="text-sm font-semibold text-amber-500 mb-2 mt-3">$1</h6>' },
            { pattern: /^##### (.*$)/gm, replacement: '<h5 class="text-base font-semibold text-amber-400 mb-2 mt-3">$1</h5>' },
            { pattern: /^#### (.*$)/gm, replacement: '<h4 class="text-lg font-bold text-amber-400 mb-3 mt-4">$1</h4>' },
            { pattern: /^### (.*$)/gm, replacement: '<h3 class="text-xl font-bold text-amber-300 mb-3 mt-4">$1</h3>' },
            { pattern: /^## (.*$)/gm, replacement: '<h2 class="text-2xl font-bold text-amber-200 mb-4 mt-5">$1</h2>' },
            { pattern: /^# (.*$)/gm, replacement: '<h1 class="text-3xl font-bold text-amber-100 mb-4 mt-6">$1</h1>' },
            
            // Code blocks (fenced with ```)
            { pattern: /```(\w+)?\n([\s\S]*?)\n```/g, replacement: '<pre class="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4 overflow-x-auto"><code class="text-green-400 text-sm font-mono">$2</code></pre>' },
            { pattern: /```\n([\s\S]*?)\n```/g, replacement: '<pre class="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4 overflow-x-auto"><code class="text-green-400 text-sm font-mono">$1</code></pre>' },
            
            // Blockquotes
            { pattern: /^> (.*$)/gm, replacement: '<blockquote class="border-l-4 border-amber-500 pl-4 py-2 mb-4 bg-gray-800 bg-opacity-50 italic text-gray-300">$1</blockquote>' },
            
            // Strikethrough
            { pattern: /~~(.*?)~~/g, replacement: '<del class="text-gray-500 line-through">$1</del>' },
            
            // Bold and Italic (order matters!)
            { pattern: /\*\*\*(.*?)\*\*\*/g, replacement: '<strong><em class="text-yellow-300">$1</em></strong>' },
            { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong class="text-yellow-300">$1</strong>' },
            { pattern: /\*(.*?)\*/g, replacement: '<em class="text-gray-300">$1</em>' },
            { pattern: /\_\_\_(.*?)\_\_\_/g, replacement: '<strong><em class="text-yellow-300">$1</em></strong>' },
            { pattern: /\_\_(.*?)\_\_/g, replacement: '<strong class="text-yellow-300">$1</strong>' },
            { pattern: /\_(.*?)\_/g, replacement: '<em class="text-gray-300">$1</em>' },
            
            // Inline code
            { pattern: /`([^`]+)`/g, replacement: '<code class="bg-gray-700 text-green-400 px-2 py-1 rounded text-sm font-mono">$1</code>' },
            
            // Links with better styling
            { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2" class="text-blue-400 hover:text-blue-300 underline hover:no-underline transition-colors duration-200" target="_blank" rel="noopener noreferrer">$1</a>' },
            
            // Auto-link URLs (basic)
            { pattern: /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g, replacement: '<a href="$1" class="text-blue-400 hover:text-blue-300 underline hover:no-underline transition-colors duration-200" target="_blank" rel="noopener noreferrer">$1</a>' },
            
            // Horizontal rules (multiple styles)
            { pattern: /^---$/gm, replacement: '<hr class="border-gray-600 my-6">' },
            { pattern: /^\*\*\*$/gm, replacement: '<hr class="border-gray-600 my-6">' },
            { pattern: /^___$/gm, replacement: '<hr class="border-gray-600 my-6">' },
            
            // Lists (unordered)
            { pattern: /^\* (.*$)/gm, replacement: '<li class="text-gray-200 mb-1">$1</li>' },
            { pattern: /^\- (.*$)/gm, replacement: '<li class="text-gray-200 mb-1">$1</li>' },
            { pattern: /^\+ (.*$)/gm, replacement: '<li class="text-gray-200 mb-1">$1</li>' },
            
            // Lists (ordered)
            { pattern: /^\d+\. (.*$)/gm, replacement: '<li class="text-gray-200 mb-1 list-decimal">$1</li>' },
            
            // Task lists (checkboxes)
            { pattern: /^\- \[ \] (.*$)/gm, replacement: '<li class="text-gray-200 mb-1 flex items-start"><input type="checkbox" disabled class="mt-1 mr-2 text-amber-500"> $1</li>' },
            { pattern: /^\- \[x\] (.*$)/gm, replacement: '<li class="text-gray-200 mb-1 flex items-start"><input type="checkbox" disabled checked class="mt-1 mr-2 text-amber-500"> $1</li>' },
            { pattern: /^\- \[X\] (.*$)/gm, replacement: '<li class="text-gray-200 mb-1 flex items-start"><input type="checkbox" disabled checked class="mt-1 mr-2 text-amber-500"> $1</li>' }
        ];
    }

    /**
     * Parse markdown content to HTML
     * @param {string} markdown - The markdown content
     * @returns {string} - HTML content
     */
    parse(markdown) {
        let html = markdown;

        // Handle tables first (before other processing)
        html = this.parseTables(html);

        // First, handle double newlines (paragraph breaks) by marking them
        html = html.replace(/\n\n/g, '§PARAGRAPH_BREAK§');
        
        // Handle markdown-style line breaks (two spaces + newline)
        html = html.replace(/  \n/g, '<br>');
        
        // Convert remaining single newlines to line breaks
        html = html.replace(/\n/g, '<br>');
        
        // Apply other markdown rules
        for (const rule of this.rules) {
            // Skip the paragraph break rule since we're handling it specially
            if (rule.pattern.source !== '\\n\\n') {
                html = html.replace(rule.pattern, rule.replacement);
            }
        }

        // Convert our paragraph break markers to actual paragraph tags
        html = html.replace(/§PARAGRAPH_BREAK§/g, '</p><p class="mb-4 text-gray-200 leading-relaxed">');

        // Wrap in paragraph tags
        html = '<p class="mb-4 text-gray-200 leading-relaxed">' + html + '</p>';

        // Clean up any empty paragraphs or extra breaks at paragraph boundaries
        html = html.replace(/<p[^>]*><\/p>/g, '');
        html = html.replace(/<p([^>]*)><br>/g, '<p$1>');
        html = html.replace(/<br><\/p>/g, '</p>');
        
        // Handle different types of lists properly
        html = this.processLists(html);

        // Clean up empty paragraphs again after list processing
        html = html.replace(/<p class="mb-4 text-gray-200 leading-relaxed"><\/p>/g, '');
        
        return html;
    }

    /**
     * Parse markdown tables to HTML
     * @param {string} text - The text to parse
     * @returns {string} - Text with tables converted to HTML
     */
    parseTables(text) {
        // Simple table parsing: | header | header |
        //                       |--------|--------|
        //                       | cell   | cell   |
        const tableRegex = /^(\|.+\|)\n(\|[-\s:]+\|)\n((?:\|.+\|\n?)+)/gm;
        
        return text.replace(tableRegex, (match, headerRow, separatorRow, bodyRows) => {
            // Parse header
            const headers = headerRow.split('|').slice(1, -1).map(h => h.trim());
            
            // Parse body rows
            const rows = bodyRows.trim().split('\n').map(row => 
                row.split('|').slice(1, -1).map(cell => cell.trim())
            );
            
            // Build HTML table
            let tableHtml = '<table class="min-w-full bg-gray-800 border border-gray-600 rounded-lg mb-4 overflow-hidden">';
            
            // Table header
            tableHtml += '<thead class="bg-gray-700"><tr>';
            headers.forEach(header => {
                tableHtml += `<th class="px-4 py-2 text-left text-amber-300 font-semibold border-b border-gray-600">${header}</th>`;
            });
            tableHtml += '</tr></thead>';
            
            // Table body
            tableHtml += '<tbody>';
            rows.forEach((row, index) => {
                const bgClass = index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750';
                tableHtml += `<tr class="${bgClass}">`;
                row.forEach(cell => {
                    tableHtml += `<td class="px-4 py-2 text-gray-200 border-b border-gray-700">${cell}</td>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</tbody></table>';
            
            return tableHtml;
        });
    }

    /**
     * Process different types of lists
     * @param {string} html - The HTML to process
     * @returns {string} - HTML with properly wrapped lists
     */
    processLists(html) {
        // Handle unordered lists (*, -, +)
        html = html.replace(/(<li class="text-gray-200 mb-1">.*?<\/li>(?:<br>)*)+/gs, (match) => {
            // Check if this is a task list
            if (match.includes('type="checkbox"')) {
                return `<ul class="list-none mb-4 space-y-2">${match.replace(/<br>/g, '')}</ul>`;
            } else {
                return `<ul class="list-disc list-inside mb-4 ml-4 space-y-1">${match.replace(/<br>/g, '')}</ul>`;
            }
        });

        // Handle ordered lists
        html = html.replace(/(<li class="text-gray-200 mb-1 list-decimal">.*?<\/li>(?:<br>)*)+/gs, (match) => {
            return `<ol class="list-decimal list-inside mb-4 ml-4 space-y-1">${match.replace(/<br>/g, '').replace(/ list-decimal/g, '')}</ol>`;
        });

        // Handle blockquotes properly (remove breaks inside)
        html = html.replace(/(<blockquote[^>]*>.*?<\/blockquote>)<br>/gs, '$1');

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

/**
 * Data Loader for TheLib
 * Handles loading and displaying games and software data
 */

class DataLoader {
    constructor() {
        this.gamesData = null;
        this.softwareData = null;
        this.isLoading = false;
    }

    /**
     * Load JSON data from specified path
     * @param {string} path - Path to JSON file
     * @returns {Promise} Promise resolving to parsed JSON
     */
    async loadJson(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load data from ${path}: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
            showNotification('Failed to load data. Please try again.', 'error');
            return null;
        }
    }

    /**
     * Load games data
     * @returns {Promise} Promise resolving to games data
     */
    async loadGames() {
        if (this.gamesData !== null) {
            return this.gamesData;
        }

        this.isLoading = true;
        this.gamesData = await this.loadJson('data/games.json');
        this.isLoading = false;
        return this.gamesData;
    }

    /**
     * Load software data
     * @returns {Promise} Promise resolving to software data
     */
    async loadSoftware() {
        if (this.softwareData !== null) {
            return this.softwareData;
        }

        this.isLoading = true;
        this.softwareData = await this.loadJson('data/software.json');
        this.isLoading = false;
        return this.softwareData;
    }

    /**
     * Render list items from data
     * @param {string} containerSelector - CSS selector for container element
     * @param {Array} items - Array of items to render
     */
    renderListItems(containerSelector, items) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        // Keep the header row
        const headerRow = container.querySelector('.list-header');
        container.innerHTML = '';
        if (headerRow) {
            container.appendChild(headerRow);
        }

        if (!items || items.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'No items found';
            container.appendChild(emptyMessage);
            return;
        }

        items.forEach(item => {
            const listItem = document.createElement('div');
            listItem.className = 'list-item';
            listItem.dataset.tags = item.tags.join(' ');
            listItem.dataset.description = item.description;
            listItem.dataset.version = item.version;
            listItem.dataset.size = item.size;
            listItem.dataset.id = item.id;

            listItem.innerHTML = `
                <div class="list-column name-column">
                    <span>${item.name}</span>
                </div>
                <div class="list-column version-column">${item.version}</div>
                <div class="list-column size-column">${item.size}</div>
                <div class="list-column date-column">${item.date}</div>
                <div class="list-column actions-column">
                    <button class="action-button download-button" data-tooltip="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-button report-button" data-tooltip="Report Issue">
                        <i class="fas fa-flag"></i>
                    </button>
                </div>
            `;

            container.appendChild(listItem);
            
            // Add animation delay for staggered appearance
            const delay = container.children.length * 0.05;
            listItem.style.animationDelay = `${delay}s`;
        });

        // Initialize tooltips on newly created elements
        if (typeof initTooltips === 'function') {
            initTooltips();
        }
        
        this.setupActionButtons();
    }

    /**
     * Initialize event listeners for action buttons
     */
    setupActionButtons() {
        const listItems = document.querySelectorAll('.list-item');
        if (!listItems.length) return;
        
        listItems.forEach(item => {
            // Attach download button functionality
            const downloadButton = item.querySelector('.download-button');
            if (downloadButton) {
                downloadButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const itemName = item.querySelector('.name-column span')?.textContent || 'file';
                    // Show notification instead of actual download
                    showNotification(`Download started for ${itemName}`);
                });
            }
            
            // Attach report button functionality
            const reportButton = item.querySelector('.report-button');
            if (reportButton) {
                reportButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const itemName = item.querySelector('.name-column span')?.textContent || 'item';
                    // Show notification for report
                    showNotification(`Report submitted for ${itemName}`, 'warning');
                });
            }
            
            // Make the whole row clickable to show the modal
            item.addEventListener('click', () => {
                const itemName = item.querySelector('.name-column span')?.textContent;
                const itemVersion = item.dataset.version;
                const itemSize = item.dataset.size;
                const itemTags = item.dataset.tags;
                const itemDescription = item.dataset.description;
                
                item.classList.add('card-clicked');
                setTimeout(() => {
                    showModal({
                        title: itemName,
                        version: itemVersion,
                        size: itemSize,
                        tags: itemTags,
                        description: itemDescription
                    });
                    setTimeout(() => {
                        item.classList.remove('card-clicked');
                    }, 300);
                }, 150);
            });
        });
    }

    /**
     * Initialize the data loader for games
     */
    async initGames() {
        this.showLoadingState('.items-list');
        const data = await this.loadGames();
        
        if (data && data.games) {
            this.renderListItems('.items-list.games-list', data.games);
            const searchResultsCount = document.getElementById('search-results-count');
            if (searchResultsCount) {
                searchResultsCount.textContent = `Showing all ${data.games.length} items`;
            } else {
                // Create the element if it doesn't exist
                const countElement = document.createElement('div');
                countElement.id = 'search-results-count';
                countElement.className = 'results-count';
                countElement.textContent = `Showing all ${data.games.length} items`;
                
                const searchContainer = document.querySelector('.search-container');
                if (searchContainer) {
                    searchContainer.after(countElement);
                }
            }
        } else {
            this.renderListItems('.items-list.games-list', []);
        }
        
        this.hideLoadingState('.items-list');
    }

    /**
     * Initialize the data loader for software
     */
    async initSoftware() {
        this.showLoadingState('.items-list');
        const data = await this.loadSoftware();
        
        if (data && data.software) {
            this.renderListItems('.items-list.software-list', data.software);
            const searchResultsCount = document.getElementById('search-results-count');
            if (searchResultsCount) {
                searchResultsCount.textContent = `Showing all ${data.software.length} items`;
            } else {
                // Create the element if it doesn't exist
                const countElement = document.createElement('div');
                countElement.id = 'search-results-count';
                countElement.className = 'results-count';
                countElement.textContent = `Showing all ${data.software.length} items`;
                
                const searchContainer = document.querySelector('.search-container');
                if (searchContainer) {
                    searchContainer.after(countElement);
                }
            }
        } else {
            this.renderListItems('.items-list.software-list', []);
        }
        
        this.hideLoadingState('.items-list');
    }

    /**
     * Show loading state on container
     * @param {string} containerSelector - CSS selector for container
     */
    showLoadingState(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        container.classList.add('loading');
        
        // Create loading spinner if it doesn't exist
        if (!container.querySelector('.loading-spinner')) {
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            spinner.innerHTML = '<i class="fas fa-spinner fa-pulse"></i><span>Loading...</span>';
            container.appendChild(spinner);
        }
    }

    /**
     * Hide loading state on container
     * @param {string} containerSelector - CSS selector for container
     */
    hideLoadingState(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        container.classList.remove('loading');
        
        // Remove loading spinner
        const spinner = container.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }
}

// Create global instance
const dataLoader = new DataLoader();

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    try {
        if (path.includes('games.html')) {
            dataLoader.initGames();
        } else if (path.includes('software.html')) {
            dataLoader.initSoftware();
        }
        
        // Update search function to use loaded data
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', async () => {
                try {
                    const filter = searchInput.value.toLowerCase().trim();
                    let items = [];
                    
                    if (path.includes('games.html')) {
                        const gamesData = await dataLoader.loadGames();
                        if (gamesData && gamesData.games) {
                            items = gamesData.games.filter(game => {
                                const searchableText = [
                                    game.name,
                                    game.version, 
                                    game.size,
                                    game.tags.join(' '),
                                    game.description
                                ].join(' ').toLowerCase();
                                
                                return filter === '' || searchableText.includes(filter);
                            });
                        }
                        dataLoader.renderListItems('.items-list.games-list', items);
                    } else if (path.includes('software.html')) {
                        const softwareData = await dataLoader.loadSoftware();
                        if (softwareData && softwareData.software) {
                            items = softwareData.software.filter(software => {
                                const searchableText = [
                                    software.name,
                                    software.version, 
                                    software.size,
                                    software.tags.join(' '),
                                    software.description
                                ].join(' ').toLowerCase();
                                
                                return filter === '' || searchableText.includes(filter);
                            });
                        }
                        dataLoader.renderListItems('.items-list.software-list', items);
                    }
                    
                    // Update results count
                    const resultCountEl = document.getElementById('search-results-count');
                    if (resultCountEl) {
                        const totalItems = path.includes('games.html') ? 
                            (dataLoader.gamesData?.games?.length || 0) : 
                            (dataLoader.softwareData?.software?.length || 0);
                        
                        if (filter === '') {
                            resultCountEl.textContent = `Showing all ${totalItems} items`;
                        } else {
                            resultCountEl.textContent = `Found ${items.length} of ${totalItems} items`;
                        }
                    }
                } catch (error) {
                    console.error('Error in search function:', error);
                }
            });
        }
    } catch (error) {
        console.error('Error initializing page:', error);
        // Fall back to showing error message
        document.querySelector('.content').innerHTML += `
            <div style="text-align: center; margin-top: 50px; padding: 20px; background: var(--bg-darker); border-radius: var(--border-radius-lg);">
                <h2>Something went wrong</h2>
                <p>We're having trouble loading this page. Please try refreshing.</p>
                <p>Error details: ${error.message}</p>
            </div>
        `;
    }
});

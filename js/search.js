let searchTimeout;
let lastFilter = '';

function searchItems() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const filter = searchInput.value.toLowerCase().trim();
    
    // Don't re-search if the query hasn't changed
    if (filter === lastFilter) return;
    lastFilter = filter;
    
    // Clear previous timeout if exists
    if (searchTimeout) clearTimeout(searchTimeout);
    
    // Add loading state
    const contentArea = document.querySelector('.items-list, table tbody');
    if (contentArea) {
        contentArea.classList.add('searching');
    }
    
    searchTimeout = setTimeout(() => {
        const isTableSearch = document.querySelector('table') !== null;
        const isListSearch = document.querySelector('.items-list') !== null;
        
        if (isTableSearch) {
            searchTableItems(filter);
        } else if (isListSearch) {
            searchListItems(filter);
        } else {
            searchCardItems(filter);
        }
        
        // Remove loading state
        if (contentArea) {
            contentArea.classList.remove('searching');
        }
        
        // Update results count
        updateResultsCount(filter);
    }, 300);
}

function searchCardItems(filter) {
    const cards = document.querySelectorAll('.game-card, .software-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const searchableElements = [
            card.querySelector('h3')?.textContent || '',
            card.dataset.tags || '',
            card.dataset.version || '',
            card.dataset.size || '',
            card.querySelector('.game-description, .software-description')?.textContent || ''
        ];

        const text = searchableElements.join(' ').toLowerCase();
        const shouldShow = filter === '' || text.includes(filter);
        
        // Use animation for smoother transitions
        if (shouldShow) {
            card.style.display = '';
            setTimeout(() => card.style.opacity = '1', 10);
            visibleCount++;
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
    
    return visibleCount;
}

function searchTableItems(filter) {
    const rows = document.querySelectorAll('table tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const shouldShow = filter === '' || text.includes(filter);
        
        if (shouldShow) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    return visibleCount;
}

function searchListItems(filter) {
    const items = document.querySelectorAll('.list-item');
    let visibleCount = 0;
    
    items.forEach(item => {
        const name = item.querySelector('.name-column span')?.textContent || '';
        const version = item.querySelector('.version-column')?.textContent || '';
        const size = item.querySelector('.size-column')?.textContent || '';
        const date = item.querySelector('.date-column')?.textContent || '';
        const tags = item.dataset.tags || '';
        const description = item.dataset.description || '';
        
        const searchText = `${name} ${version} ${size} ${date} ${tags} ${description}`.toLowerCase();
        const shouldShow = filter === '' || searchText.includes(filter);
        
        if (shouldShow) {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    return visibleCount;
}

function updateResultsCount(filter) {
    const resultCountEl = document.getElementById('search-results-count');
    
    if (!resultCountEl) {
        const searchContainer = document.querySelector('.search-container');
        if (!searchContainer) return;
        
        const countElement = document.createElement('div');
        countElement.id = 'search-results-count';
        countElement.className = 'results-count';
        searchContainer.after(countElement);
    }
    
    const visibleItems = document.querySelectorAll('.game-card:not([style*="display: none"]), .software-card:not([style*="display: none"]), .list-item:not([style*="display: none"]), table tbody tr:not([style*="display: none"])').length;
    const totalItems = document.querySelectorAll('.game-card, .software-card, .list-item, table tbody tr').length;
    
    const countEl = document.getElementById('search-results-count');
    if (countEl) {
        if (filter === '') {
            countEl.textContent = `Showing all ${totalItems} items`;
        } else {
            countEl.textContent = `Found ${visibleItems} of ${totalItems} items`;
        }
    }
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        // Add event listener for input changes
        searchInput.addEventListener('input', searchItems);
        
        // Initialize results count
        updateResultsCount('');
        
        // Add clear button functionality
        const searchContainer = document.querySelector('.search-container');
        const clearButton = document.createElement('button');
        clearButton.className = 'search-clear';
        clearButton.innerHTML = '<i class="fas fa-times"></i>';
        clearButton.setAttribute('aria-label', 'Clear search');
        clearButton.style.display = 'none';
        
        searchContainer.appendChild(clearButton);
        
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.style.display = 'none';
            searchItems();
            searchInput.focus();
        });
        
        searchInput.addEventListener('input', () => {
            clearButton.style.display = searchInput.value ? 'block' : 'none';
        });
    }
});

window.addEventListener('unload', () => {
    if (searchTimeout) clearTimeout(searchTimeout);
});

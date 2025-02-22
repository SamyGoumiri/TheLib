function searchItems() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const filter = searchInput.value.toLowerCase().trim();
    
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    
    this.searchTimeout = setTimeout(() => {
        const cards = document.querySelectorAll('.game-card, .software-card');
        
        requestAnimationFrame(() => {
            cards.forEach(card => {
                const searchableElements = [
                    card.querySelector('h3')?.textContent || '',
                    ...Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent || ''),
                    card.querySelector('.version')?.textContent || '',
                    card.querySelector('.size-tag')?.textContent || ''
                ];

                const text = searchableElements.join(' ').toLowerCase();
                card.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    }, 300);
}

window.addEventListener('unload', () => {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
});

function searchItems() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return; // Protection contre les erreurs

    const filter = searchInput.value.toLowerCase().trim(); // Ajout de trim()
    
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    
    this.searchTimeout = setTimeout(() => {
        const cards = document.querySelectorAll('.game-card, .software-card');
        
        requestAnimationFrame(() => { // Optimisation des performances d'animation
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

// Nettoyage du timeout lors de la navigation
window.addEventListener('unload', () => {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
});

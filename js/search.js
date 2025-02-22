function searchItems() {
    const searchInput = document.getElementById('search-input');
    const filter = searchInput.value.toLowerCase();
    
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    
    this.searchTimeout = setTimeout(() => {
        const cards = document.querySelectorAll('.game-card, .software-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.game-description, .software-description')?.textContent.toLowerCase() || '';
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(filter) || 
                          description.includes(filter) || 
                          tags.some(tag => tag.includes(filter));
            
            card.style.display = matches ? '' : 'none';
        });
    }, 300);
}

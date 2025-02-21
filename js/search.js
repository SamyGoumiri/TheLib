function searchItems() {
    const searchInput = document.getElementById('search-input');
    const filter = searchInput.value.toLowerCase();
    const tables = document.getElementsByTagName('table');
    
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    
    this.searchTimeout = setTimeout(() => {
        const rows = document.querySelectorAll('table tr:not(:first-child)');
        rows.forEach(row => {
            const text = row.cells[0].textContent.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        });
    }, 300);
}

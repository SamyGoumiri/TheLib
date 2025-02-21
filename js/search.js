function searchItems() {
    const searchInput = document.getElementById('search-input');
    const filter = searchInput.value.toLowerCase();
    const tables = document.getElementsByTagName('table');

    for (let table of tables) {
        const rows = table.getElementsByTagName('tr');
        
        for (let row of rows) {
            const cells = row.getElementsByTagName('td');
            if (cells.length) {
                const text = cells[0].textContent || cells[0].innerText;
                if (text.toLowerCase().indexOf(filter) > -1) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        }
    }
}

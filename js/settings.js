// Appliquer les paramètres au chargement
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedLang = localStorage.getItem('language') || 'en';
    
    document.body.className = savedTheme;
    document.getElementById('theme-select').value = savedTheme;
    document.getElementById('language-select').value = savedLang;
});

document.getElementById('theme-select').addEventListener('change', function() {
    const theme = this.value;
    document.body.className = theme;
    localStorage.setItem('theme', theme);
});

document.getElementById('language-select').addEventListener('change', function() {
    const lang = this.value;
    localStorage.setItem('language', lang);
    console.log(`Language changed to ${lang}`);
});

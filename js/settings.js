// Appliquer les paramètres au chargement
document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('theme-select');
    const langSelect = document.getElementById('language-select');

    if (!themeSelect || !langSelect) return; // Protection contre les erreurs

    // Récupération des paramètres sauvegardés
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedLang = localStorage.getItem('language') || 'en';

    // Application des paramètres
    document.body.className = savedTheme;
    themeSelect.value = savedTheme;
    langSelect.value = savedLang;

    // Gestionnaires d'événements optimisés
    const handleThemeChange = () => {
        const theme = themeSelect.value;
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    };

    const handleLangChange = () => {
        const lang = langSelect.value;
        localStorage.setItem('language', lang);
    };

    themeSelect.addEventListener('change', handleThemeChange);
    langSelect.addEventListener('change', handleLangChange);
});

document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('theme-select');
    const langSelect = document.getElementById('language-select');

    // Theme settings
    if (themeSelect) {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme;
        themeSelect.value = savedTheme;

        themeSelect.addEventListener('change', () => {
            const theme = themeSelect.value;
            document.body.className = theme;
            localStorage.setItem('theme', theme);
            
            // Show success message
            showNotification('Theme updated successfully');
        });
    }

    // Language settings
    if (langSelect) {
        const savedLang = localStorage.getItem('language') || 'en';
        langSelect.value = savedLang;

        langSelect.addEventListener('change', () => {
            const lang = langSelect.value;
            localStorage.setItem('language', lang);
            
            // Show success message
            showNotification('Language preference saved');
        });
    }
});

// Remove duplicate showNotification function as it's now in utils.js

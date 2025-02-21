document.getElementById('theme-select').addEventListener('change', function() {
    document.body.className = this.value;
});

document.getElementById('language-select').addEventListener('change', function() {
    // Logic to change the language of the site
    alert('Language changed to ' + this.value);
});

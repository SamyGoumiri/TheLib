document.getElementById('theme-select').addEventListener('change', function() {
    document.body.className = this.value;
});

document.getElementById('language-select').addEventListener('change', function() {
    alert('Language changed to ' + this.value);
});

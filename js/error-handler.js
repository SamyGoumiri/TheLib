/**
 * Error handling utilities for TheLib
 */

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
    
    // Log to console for debugging
    console.error({
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
    
    // Prevent white screen by showing error message
    const content = document.querySelector('.content');
    if (content && !document.querySelector('.error-message')) {
        const errorDisplay = document.createElement('div');
        errorDisplay.className = 'error-message';
        errorDisplay.innerHTML = `
            <h2>Something went wrong</h2>
            <p>We're having trouble processing your request. You can try refreshing the page.</p>
            <button class="retry-button">Refresh Page</button>
        `;
        
        content.appendChild(errorDisplay);
        
        // Add refresh button handler
        const retryButton = errorDisplay.querySelector('.retry-button');
        if (retryButton) {
            retryButton.addEventListener('click', function() {
                window.location.reload();
            });
        }
    }
    
    // Don't prevent default so the error still shows in console
    return false;
});

// Promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Prevent white screen by showing error message
    const content = document.querySelector('.content');
    if (content && !document.querySelector('.error-message')) {
        const errorDisplay = document.createElement('div');
        errorDisplay.className = 'error-message';
        errorDisplay.innerHTML = `
            <h2>Something went wrong</h2>
            <p>We're having trouble loading data. You can try refreshing the page.</p>
            <button class="retry-button">Refresh Page</button>
        `;
        
        content.appendChild(errorDisplay);
        
        // Add refresh button handler
        const retryButton = errorDisplay.querySelector('.retry-button');
        if (retryButton) {
            retryButton.addEventListener('click', function() {
                window.location.reload();
            });
        }
    }
});

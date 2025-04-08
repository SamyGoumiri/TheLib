/**
 * Common application functionality for TheLib
 */

// Apply stored theme on page load
document.addEventListener('DOMContentLoaded', () => {
    // Apply theme from local storage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = savedTheme;
    
    // Check for image loading errors and replace with placeholders
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete || img.naturalHeight === 0) {
            img.src = 'assets/images/placeholder.jpg';
        }
        
        img.addEventListener('error', () => {
            img.src = 'assets/images/placeholder.jpg';
        });
    });
    
    // Add animation classes for page transitions with delay for smoother loading
    setTimeout(() => {
        document.body.classList.add('page-loaded');
        
        // Ensure content is visible
        const contentElement = document.querySelector('.content');
        if (contentElement) {
            contentElement.classList.add('animate-in');
            contentElement.style.opacity = '1';
        }
    }, 100);
    
    // Update the active navigation link
    updateActiveNavLink();
    
    // Initialize tooltips if needed
    initTooltips();
    
    // Add intersection observer for animations
    initScrollAnimations();
});

// Update the active navigation link based on current page
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar ul li a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.endsWith(linkPath)) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// Initialize tooltips with improved positioning
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip');
        if (!tooltipText) return;
        
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        
        element.appendChild(tooltip);
        
        element.addEventListener('mouseenter', () => {
            // Calculate positioning to keep tooltip within viewport
            const rect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            
            if (rect.right > viewportWidth) {
                tooltip.style.transform = 'translateX(calc(-100% + 20px))';
                tooltip.style.left = 'auto';
                tooltip.style.right = '0';
            }
            
            tooltip.classList.add('visible');
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
            // Reset styles
            setTimeout(() => {
                tooltip.style.transform = '';
                tooltip.style.left = '';
                tooltip.style.right = '';
            }, 300);
        });
    });
}

// Add scroll-based animations using Intersection Observer API
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Make all elements visible immediately if IntersectionObserver isn't supported
        document.querySelectorAll('.will-animate').forEach(el => {
            el.classList.add('animate-in');
        });
        return;
    }
    
    const animateOnScrollElements = document.querySelectorAll('.card, .game-card, .software-card, .settings-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateOnScrollElements.forEach(element => {
        element.classList.add('will-animate');
        observer.observe(element);
    });
    
    // Ensure content becomes visible even if intersection detection fails
    setTimeout(() => {
        document.querySelectorAll('.will-animate').forEach(el => {
            if (!el.classList.contains('animate-in')) {
                el.classList.add('animate-in');
            }
        });
    }, 1000);
}

// Handle system theme changes
if (window.matchMedia) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    prefersDarkScheme.addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme || savedTheme === 'auto') {
            document.body.className = e.matches ? 'dark' : 'light';
        }
    });
}

// Detect browser performance capabilities and adjust animations
function detectPerformanceCapabilities() {
    // Check device performance
    const devicePerformance = window.navigator.hardwareConcurrency || 4;
    const isLowPowerDevice = devicePerformance <= 2 || 
                           /(android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini)/i.test(navigator.userAgent.toLowerCase());
    
    if (isLowPowerDevice) {
        document.body.classList.add('reduce-animations');
    }
}

// Run performance detection on load
detectPerformanceCapabilities();

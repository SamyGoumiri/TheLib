/**
 * Animation utilities for TheLib
 * Provides performance-oriented smooth animations and effects
 */

class AnimationUtils {
    // Detect device capabilities to adjust animation complexity
    static detectCapabilities() {
        const capabilities = {
            highPerformance: false,
            reducedMotion: false
        };
        
        // Check for reduced motion preference
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            capabilities.reducedMotion = true;
            document.documentElement.classList.add('reduced-motion');
        }
        
        // Check device performance approximately
        const devicePerformance = navigator.hardwareConcurrency || 4;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        capabilities.highPerformance = !isMobile && devicePerformance > 4;
        
        // Add class to document based on capabilities
        if (capabilities.highPerformance) {
            document.documentElement.classList.add('high-performance');
        } else {
            document.documentElement.classList.add('standard-performance');
        }
        
        return capabilities;
    }
    
    // Apply staggered animations to a set of elements
    static applyStaggeredAnimation(elements, options = {}) {
        const defaults = {
            animationClass: 'fade-in',
            staggerDelay: 50,
            baseDelay: 0,
            threshold: 0.1,
            unobserveAfter: true
        };
        
        const settings = {...defaults, ...options};
        
        // If reduced motion is preferred, apply animations immediately without staggering
        if (document.documentElement.classList.contains('reduced-motion')) {
            elements.forEach(el => el.classList.add(settings.animationClass));
            return;
        }
        
        // Use Intersection Observer when supported
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        const delay = settings.baseDelay + (index * settings.staggerDelay);
                        setTimeout(() => {
                            entry.target.classList.add(settings.animationClass);
                        }, delay);
                        
                        if (settings.unobserveAfter) {
                            observer.unobserve(entry.target);
                        }
                    }
                });
            }, {
                threshold: settings.threshold
            });
            
            elements.forEach(el => observer.observe(el));
            
            // Fallback: If elements aren't visible after 1 second, show them anyway
            setTimeout(() => {
                elements.forEach(el => {
                    if (!el.classList.contains(settings.animationClass)) {
                        el.classList.add(settings.animationClass);
                    }
                });
            }, 1000);
        } else {
            // Fallback for browsers without IntersectionObserver
            elements.forEach((el, index) => {
                const delay = settings.baseDelay + (index * settings.staggerDelay);
                setTimeout(() => {
                    el.classList.add(settings.animationClass);
                }, delay);
            });
        }
    }
    
    // Add parallax effect with performance considerations
    static applyParallax(element, options = {}) {
        const defaults = {
            speed: 0.05,
            direction: 'vertical', // vertical or horizontal
            reverse: false
        };
        
        const settings = {...defaults, ...options};
        
        // Skip on reduced motion or low performance devices
        if (document.documentElement.classList.contains('reduced-motion') ||
            !document.documentElement.classList.contains('high-performance')) {
            return;
        }
        
        let ticking = false;
        
        const updatePosition = () => {
            const scrollPosition = window.pageYOffset;
            const elementRect = element.getBoundingClientRect();
            const elementVisible = elementRect.top < window.innerHeight && 
                                 elementRect.bottom > 0;
                                 
            if (elementVisible) {
                const movement = settings.reverse ? -scrollPosition * settings.speed : 
                                                 scrollPosition * settings.speed;
                
                const transform = settings.direction === 'vertical' ? 
                    `translateY(${movement}px)` : 
                    `translateX(${movement}px)`;
                    
                element.style.transform = transform;
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updatePosition);
                ticking = true;
            }
        });
        
        // Initial position
        updatePosition();
    }
    
    // Make all animatable elements visible - utility method for emergency visibility
    static ensureVisibility() {
        // Add animate-in class to all will-animate elements to make them visible
        document.querySelectorAll('.will-animate').forEach(el => {
            el.classList.add('animate-in');
        });
        
        // Make sure specific important elements are visible
        document.querySelector('.content')?.classList.add('animate-in');
        document.querySelector('.logo-container')?.classList.add('animate-in');
        document.querySelector('.site-logo')?.classList.add('animate-in');
        
        // Make all children of content visible
        document.querySelectorAll('.content *').forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Detect device capabilities
    const capabilities = AnimationUtils.detectCapabilities();
    
    // Apply animations based on page content
    const cards = document.querySelectorAll('.card, .game-card, .software-card');
    if (cards.length) {
        AnimationUtils.applyStaggeredAnimation(cards, {
            animationClass: 'animate-in',
            staggerDelay: 100
        });
    }
    
    // Ensure critical elements are immediately visible
    document.querySelector('.content')?.classList.add('animate-in');
    document.querySelector('.logo-container')?.classList.add('animate-in');
    document.querySelector('.site-logo')?.classList.add('animate-in');
    
    // Safety timeout to ensure everything becomes visible
    setTimeout(() => {
        AnimationUtils.ensureVisibility();
    }, 500);
    
    // Apply parallax to certain decorative elements if performance allows
    if (capabilities.highPerformance) {
        const decorativeElements = document.querySelectorAll('.site-logo');
        decorativeElements.forEach(el => {
            AnimationUtils.applyParallax(el, {
                speed: 0.03,
                reverse: true
            });
        });
    }
});

// Add global animation utility to window
window.AnimationUtils = AnimationUtils;

// Add emergency fix to ensure page content is visible
window.addEventListener('load', () => {
    // Double-check after full page load that everything is visible
    setTimeout(() => {
        AnimationUtils.ensureVisibility();
    }, 1000);
});

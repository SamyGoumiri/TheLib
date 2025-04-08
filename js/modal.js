// Add this to the top of the file, before any other code
function showNotification(message, type = 'success') {
    // Check if notification container exists
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        // Create notification container
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    notification.appendChild(closeBtn);
    notificationContainer.appendChild(notification);
    
    // Auto-remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

let modalInstance = null;

function createModal() {
    if (modalInstance) return modalInstance;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" aria-label="Close modal">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-image">
                <div class="image-placeholder"></div>
                <img src="" alt="Content preview" loading="lazy">
            </div>
            <div class="modal-details">
                <h2 class="modal-title"></h2>
                <div class="modal-meta"></div>
                <div class="modal-description"></div>
                <div class="modal-actions">
                    <a href="#" class="download-link">
                        <i class="fas fa-download"></i> Download
                    </a>
                </div>
            </div>
        </div>
    `;

    // Improved close modal animation with proper timing
    const closeModal = (e) => {
        if (e) e.preventDefault();
        modal.classList.add('modal-closing');
        modal.classList.remove('modal-active');
        
        // Ensure body scrolling is restored after animation
        setTimeout(() => {
            modal.classList.remove('modal-closing');
            document.body.style.overflow = '';
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    
    // Close when clicking outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(e);
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-active')) {
            closeModal();
        }
    });

    document.body.appendChild(modal);
    modalInstance = modal;
    return modal;
}

function showModal(cardData) {
    if (!cardData) return;

    const modal = createModal();
    
    const data = {
        image: cardData.image || 'assets/images/placeholder.jpg',
        title: cardData.title || 'Untitled',
        tags: cardData.tags || '',
        version: cardData.version || '',
        size: cardData.size || '',
        description: cardData.description || 'No description available.'
    };

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    // Smoother animation with requestAnimationFrame
    requestAnimationFrame(() => {
        const img = modal.querySelector('img');
        const imgPlaceholder = modal.querySelector('.image-placeholder');
        
        // Show loading state
        if (imgPlaceholder) imgPlaceholder.classList.add('loading');
        
        // Preload image before showing modal for smoother experience
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = data.image;
            if (imgPlaceholder) {
                setTimeout(() => {
                    imgPlaceholder.classList.remove('loading');
                }, 300); // Small delay for nicer transition
            }
        };
        tempImg.onerror = () => {
            img.src = 'assets/images/placeholder.jpg';
            if (imgPlaceholder) imgPlaceholder.classList.remove('loading');
        };
        tempImg.src = data.image;
        
        modal.querySelector('.modal-title').textContent = data.title;
        
        // Clear previous meta content
        const metaContainer = modal.querySelector('.modal-meta');
        metaContainer.innerHTML = '';
        
        // Add tags with animation delay for staggered effect
        if (data.tags) {
            data.tags.split(' ').forEach((tag, index) => {
                if (tag.trim()) {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'tag';
                    tagEl.style.animationDelay = `${index * 0.1 + 0.3}s`;
                    tagEl.textContent = tag.trim();
                    metaContainer.appendChild(tagEl);
                }
            });
        }
        
        // Add version and size with animation delay
        if (data.version) {
            const versionEl = document.createElement('span');
            versionEl.className = 'version';
            versionEl.style.animationDelay = '0.5s';
            versionEl.textContent = data.version;
            metaContainer.appendChild(versionEl);
        }
        
        if (data.size) {
            const sizeEl = document.createElement('span');
            sizeEl.className = 'size-tag';
            sizeEl.style.animationDelay = '0.6s';
            sizeEl.textContent = data.size;
            metaContainer.appendChild(sizeEl);
        }
        
        // Add description with fade in effect
        const descriptionContainer = modal.querySelector('.modal-description');
        descriptionContainer.style.opacity = '0';
        descriptionContainer.innerHTML = `<p>${data.description}</p>`;
        
        // Show modal with slight delay for smooth animation
        setTimeout(() => {
            modal.classList.add('modal-active');
            // Fade in description after modal appears
            setTimeout(() => {
                descriptionContainer.style.opacity = '1';
                descriptionContainer.style.transition = 'opacity 0.5s ease';
            }, 300);
        }, 10);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // This part handles the cards, which we're no longer using but keeping the code for reference
    const cards = document.querySelectorAll('.game-card, .software-card');
    if (cards.length) {
        cards.forEach(card => {
            card.classList.add('card-interactive');
            
            card.addEventListener('click', () => {
                const cardData = {
                    title: card.querySelector('h3')?.textContent,
                    image: card.querySelector('img')?.src,
                    tags: card.dataset.tags || card.querySelector('.tag')?.textContent,
                    version: card.dataset.version || card.querySelector('.version')?.textContent,
                    size: card.dataset.size || card.querySelector('.size-tag')?.textContent,
                    description: card.querySelector('.game-description, .software-description')?.textContent
                };
                
                card.classList.add('card-clicked');
                setTimeout(() => {
                    showModal(cardData);
                    setTimeout(() => {
                        card.classList.remove('card-clicked');
                    }, 300);
                }, 150);
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const listItems = document.querySelectorAll('.list-item');
    if (!listItems.length) return;
    
    listItems.forEach(item => {
        // The details button is removed, so this part is omitted
        
        // Attach download button functionality
        const downloadButton = item.querySelector('.download-button');
        if (downloadButton) {
            downloadButton.addEventListener('click', () => {
                const itemName = item.querySelector('.name-column span')?.textContent || 'file';
                // For demonstration, show notification instead of actual download
                showNotification(`Download started for ${itemName}`);
            });
        }
        
        // Attach report button functionality
        const reportButton = item.querySelector('.report-button');
        if (reportButton) {
            reportButton.addEventListener('click', () => {
                const itemName = item.querySelector('.name-column span')?.textContent || 'item';
                // For demonstration, show notification instead of actual report form
                showNotification(`Report submitted for ${itemName}`, 'warning');
            });
        }
    });
});

window.addEventListener('unload', () => {
    if (modalInstance) {
        modalInstance.remove();
        modalInstance = null;
    }
});

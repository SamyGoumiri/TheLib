let modalInstance = null;

function createModal() {
    if (modalInstance) return modalInstance;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-image">
                <img src="" alt="Content preview" loading="lazy">
            </div>
            <div class="modal-details">
                <h2 class="modal-title"></h2>
                <div class="modal-meta"></div>
            </div>
        </div>
    `;

    const closeModal = () => modal.classList.remove('modal-active');
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
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

    const modal = modalInstance || createModal();
    
    // Ajout de la vérification des données
    const data = {
        image: cardData.image || 'assets/images/placeholder.jpg',
        title: cardData.title || 'Untitled',
        tags: cardData.tags || '',
        version: cardData.version || '',
        size: cardData.size || ''
    };

    requestAnimationFrame(() => {
        modal.querySelector('img').src = data.image;
        modal.querySelector('.modal-title').textContent = data.title;
        modal.querySelector('.modal-meta').innerHTML = [
            data.tags && `<span class="tag">${data.tags}</span>`,
            data.version && `<span class="version">${data.version}</span>`,
            data.size && `<span class="size-tag">${data.size}</span>`
        ].filter(Boolean).join('');

        modal.classList.add('modal-active');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.game-card, .software-card');
    if (!cards.length) return;
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const cardData = {
                title: card.querySelector('h3')?.textContent,
                image: card.querySelector('img')?.src,
                tags: card.querySelector('.tag')?.textContent,
                version: card.querySelector('.version')?.textContent,
                size: card.querySelector('.size-tag')?.textContent
            };
            showModal(cardData);
        });
    });
});

window.addEventListener('unload', () => {
    if (modalInstance) {
        modalInstance.remove();
        modalInstance = null;
    }
});

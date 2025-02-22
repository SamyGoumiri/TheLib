let modalInstance = null; // Singleton pattern

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

    // Gestionnaires d'événements optimisés
    const closeModal = () => modal.classList.remove('modal-active');
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Fermeture avec la touche Escape
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
    const img = modal.querySelector('img');
    const title = modal.querySelector('.modal-title');
    const meta = modal.querySelector('.modal-meta');

    requestAnimationFrame(() => {
        img.src = cardData.image || 'assets/images/placeholder.jpg';
        title.textContent = cardData.title || '';
        meta.innerHTML = [
            cardData.tags && `<span class="tag">${cardData.tags}</span>`,
            cardData.version && `<span class="version">${cardData.version}</span>`,
            cardData.size && `<span class="size-tag">${cardData.size}</span>`
        ].filter(Boolean).join('');

        modal.classList.add('modal-active');
    });
}

// Initialisation des écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.game-card, .software-card');
    if (!cards.length) return; // Protection si pas de cartes
    
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

// Nettoyage en quittant la page
window.addEventListener('unload', () => {
    if (modalInstance) {
        modalInstance.remove();
        modalInstance = null;
    }
});

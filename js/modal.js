function createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-image">
                <img src="" alt="Content preview">
            </div>
            <div class="modal-details">
                <h2 class="modal-title"></h2>
                <div class="modal-meta"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('modal-active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('modal-active');
        }
    });

    return modal;
}

function showModal(cardData) {
    const modal = document.querySelector('.modal-overlay') || createModal();
    const img = modal.querySelector('img');
    const title = modal.querySelector('.modal-title');
    const meta = modal.querySelector('.modal-meta');

    img.src = cardData.image || 'assets/images/placeholder.jpg';
    title.textContent = cardData.title;
    meta.innerHTML = `
        ${cardData.tags ? `<span class="tag">${cardData.tags}</span>` : ''}
        ${cardData.version ? `<span class="version">${cardData.version}</span>` : ''}
        ${cardData.size ? `<span class="size-tag">${cardData.size}</span>` : ''}
    `;

    modal.classList.add('modal-active');
}

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.game-card, .software-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const cardData = {
                title: card.querySelector('h3').textContent,
                image: card.querySelector('img')?.src,
                tags: card.querySelector('.tag')?.textContent,
                version: card.querySelector('.version')?.textContent,
                size: card.querySelector('.size-tag')?.textContent
            };
            showModal(cardData);
        });
    });
});

import { igdbService } from './services/igdbService.js';

export class GamesRenderer {
    constructor(containerSelector = '.card-grid') {
        this.container = document.querySelector(containerSelector);
        this.loadingState = false;
    }

    createGameCard(game) {
        const coverUrl = game.cover ? game.cover.url.replace('thumb', 'cover_big') : 'assets/images/game-placeholder.jpg';
        return `
            <div class="game-card" data-game-id="${game.id}">
                <div class="game-image">
                    <img src="${coverUrl}" alt="${game.name}" loading="lazy">
                    <div class="game-overlay">
                        <span class="tag">${game.genres?.[0]?.name || 'Game'}</span>
                        <span class="rating">${Math.round(game.rating || 0)}%</span>
                    </div>
                </div>
                <div class="title-overlay">
                    <h3>${game.name}</h3>
                </div>
            </div>
        `;
    }

    showLoadingState() {
        this.loadingState = true;
        this.container.innerHTML = Array(6).fill('<div class="game-card skeleton"></div>').join('');
    }

    async renderGames() {
        this.showLoadingState();
        
        try {
            const games = await igdbService.getGames();
            if (!games.length) {
                this.container.innerHTML = '<p>Aucun jeu trouvé</p>';
                return;
            }

            this.container.innerHTML = games.map(game => this.createGameCard(game)).join('');
        } catch (error) {
            console.error('Erreur lors du rendu des jeux:', error);
            this.container.innerHTML = '<p>Une erreur est survenue lors du chargement des jeux</p>';
        } finally {
            this.loadingState = false;
        }
    }
}

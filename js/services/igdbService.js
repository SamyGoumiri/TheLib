import { IGDB_CONFIG } from '../config.js';

class IGDBService {
    constructor() {
        this.accessToken = '';
    }

    async authenticate() {
        try {
            const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${IGDB_CONFIG.CLIENT_ID}&client_secret=${IGDB_CONFIG.CLIENT_SECRET}&grant_type=client_credentials`, {
                method: 'POST'
            });
            const data = await response.json();
            this.accessToken = data.access_token;
        } catch (error) {
            console.error('Erreur d\'authentification:', error);
        }
    }

    async getGames(limit = 50) {
        if (!this.accessToken) await this.authenticate();

        try {
            const response = await fetch(`${IGDB_CONFIG.API_URL}/games`, {
                method: 'POST',
                headers: {
                    'Client-ID': IGDB_CONFIG.CLIENT_ID,
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: `fields name,cover.url,genres.name,summary,rating,release_dates.human;
                      where rating != null & cover != null;
                      sort rating desc;
                      limit ${limit};`
            });
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des jeux:', error);
            return [];
        }
    }
}

export const igdbService = new IGDBService();

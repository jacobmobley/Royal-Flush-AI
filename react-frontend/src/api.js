import axios from 'axios';

const api = {
    getGameState: () => axios.get('/api/game_state').then(response => response.data),
    sendPlayerAction: (action) => axios.post('/api/player_action', { action }).then(response => response.data),
};

export default api;
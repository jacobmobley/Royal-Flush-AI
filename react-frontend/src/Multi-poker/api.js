import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Fetch the current game state from the backend
const fetchGameState = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/game-state`);
    console.log("Game state data:", response.data); // Log the response data to check if it's valid JSON
    return response.data;
  } catch (error) {
    console.error('Error fetching game state:', error);
    throw error;
  }
};

// Send a player action (check, call, raise, fold) to the backend
const sendAction = async (actionType, amount = 0) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/player-action`, {
      action: actionType,
      amount: amount,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending player action:', error);
    throw error;
  }
};

// Export functions as a default object for easy importing
export default {
  fetchGameState,
  sendAction,
};
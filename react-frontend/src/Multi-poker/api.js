import axios from "axios";

// Set the API base URL dynamically
let API_BASE_URL = "http://10.186.123.80:5000";

// Function to update the base URL
export const setApiBaseUrl = (url) => {
  API_BASE_URL = url;
};

// Fetch the current game state from the backend
export const fetchGameState = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/game-state`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Send a player action (check, call, raise, fold) to the backend
export const sendAction = async (actionType, amount = 0, username) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/player-action`, {
      action: actionType,
      amount,
      username,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Join the game by username
export const joinGame = async (username) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/join`, {
      username, // Replace "player_id" with "username"
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Signal readiness by username
export const signalReady = async (username) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ready`, {
      username, // Send username to signal readiness
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendEmote = async (username, emote) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-emote`, {
      username,
      emote,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  setApiBaseUrl,
  fetchGameState,
  sendAction,
  joinGame,
  signalReady,
  sendEmote,
};

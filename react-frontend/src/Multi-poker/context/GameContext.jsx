import React, { createContext, useState, useCallback } from 'react';
import api from '../api';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch the current game state from the backend
  const fetchGameState = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.fetchGameState();
      setGameState(response.data);
    } catch (err) {
      console.error('Error fetching game state:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to send a player action to the backend
  const sendPlayerAction = async (actionType, amount = 0) => {
    try {
      const response = await api.sendAction(actionType, amount);
      setGameState(response.data); // Update the game state with the response from the backend
    } catch (err) {
      console.error('Error sending player action:', err);
      setError(err.message);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        loading,
        error,
        fetchGameState,
        sendPlayerAction,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
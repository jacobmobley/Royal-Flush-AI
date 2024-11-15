import React, { createContext, useState, useCallback } from 'react';
import api from '../api';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(null); // Holds the game state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch the game state from the backend
  const fetchGameState = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchGameState();
      console.log("Fetched game state:", data); // Log data to verify it's correct
      setGameState(data); // Update the game state in context
    } catch (err) {
      console.error('Error fetching game state:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <GameContext.Provider value={{ gameState, loading, error, fetchGameState }}>
      {children}
    </GameContext.Provider>
  );
};
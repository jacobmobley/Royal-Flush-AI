import React, { useEffect, useContext } from 'react';
import PokerTable from './components/PokerTable';
import { GameProvider, GameContext } from './context/GameContext';
import api from './api';

const MultiPoker = () => {
  const { gameState, setGameState, fetchGameState } = useContext(GameContext);

  useEffect(() => {
    // Fetch initial game state when the component loads
    fetchGameState();

    // Set up a polling or WebSocket connection for real-time updates if needed
    const interval = setInterval(() => {
      fetchGameState();
    }, 3000); // Poll every 3 seconds, or switch to WebSocket for real-time updates

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, [fetchGameState]);

  return (
    <div className="multi-poker">
      <h1>Multiplayer Poker Game</h1>
      {gameState ? (
        <PokerTable />
      ) : (
        <p>Loading game state...</p>
      )}
    </div>
  );
};

// Wrap MultiPoker in GameProvider for context usage
const MultiPokerApp = () => (
  <GameProvider>
    <MultiPoker />
  </GameProvider>
);

export default MultiPokerApp;
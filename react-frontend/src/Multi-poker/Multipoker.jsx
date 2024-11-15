import React, { useEffect, useContext } from 'react';
import PokerTable from './components/PokerTable';
import { GameProvider, GameContext } from './context/GameContext';

const MultiPoker = () => {
  const { gameState, fetchGameState, loading, error } = useContext(GameContext);

  useEffect(() => {
    fetchGameState(); // Fetch the game state on component load

    // Optional: Set up polling or WebSocket for real-time updates
    const interval = setInterval(() => {
      fetchGameState();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchGameState]);

  if (loading) return <p>Loading game...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="multi-poker">
      <h1>Multiplayer Poker Game</h1>
      {gameState ? <PokerTable /> : <p>Loading game state...</p>}
    </div>
  );
};

const MultiPokerApp = () => (
  <GameProvider>
    <MultiPoker />
  </GameProvider>
);

export default MultiPokerApp;
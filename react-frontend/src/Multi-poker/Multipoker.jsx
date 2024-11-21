import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import api from './api';
import PokerTable from './components/PokerTable';
import { GameProvider, GameContext } from './context/GameContext';

const MultiPoker = () => {
  const { gameState, fetchGameState, loading, error } = useContext(GameContext);
  const { search } = useLocation();
  const lobbyUrl = new URLSearchParams(search).get('url');

  useEffect(() => {
    if (lobbyUrl) {
      api.setApiBaseUrl(lobbyUrl); // Set the base URL dynamically
      console.log(lobbyUrl)
      fetchGameState();
    }
    const interval = setInterval(() => {
      fetchGameState();
    }, 3000);

    return () => clearInterval(interval);
  }, [lobbyUrl, fetchGameState]);


  if (!gameState) return <p>Loading game...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="multi-poker">
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
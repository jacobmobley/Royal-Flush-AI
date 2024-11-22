import React, { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from './api';
import PokerTable from './components/PokerTable';
import { GameProvider, GameContext } from './context/GameContext';
import FireBaseAuth from '../FireBaseAuth';

const MultiPoker = () => {
  const { gameState, fetchGameState, loading, error } = useContext(GameContext);
  const { search } = useLocation();
  const lobbyUrl = new URLSearchParams(search).get("url");
  const buyIn = parseInt(new URLSearchParams(search).get("buyIn"), 10); // Retrieve buy-in from URL
  const [username, setUsername] = useState(null);
  const [joined, setJoined] = useState(false);
  const [curUser] = useState(new FireBaseAuth()); // Firebase instance

  const joinGame = async () => {
    console.log('curUser.userData.currency');
    console.log(curUser.userData.currency);
    if (curUser.userData.username && !joined) {
      try {
        if (curUser.userData.currency >= buyIn) {
          const response = await api.joinGame(curUser.userData.username); // Pass username to join
          console.log("Joined game:", response);

          const updatedCurrency = curUser.userData.currency - buyIn;
          curUser.updateCurrency(updatedCurrency); // Update currency in Firestore

          setUsername(curUser.userData.username);
          setJoined(true);
        } else {
          console.error("Not enough currency to join the game.");
        }
      } catch (error) {
        console.error("Error joining game:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = curUser.getUnsubscribe();
    console.log(curUser.userData.username, joined);

    // Set API base URL dynamically and join game once Firebase user is authenticated
    if (lobbyUrl) {
      api.setApiBaseUrl(lobbyUrl);
      console.log("Lobby URL:", lobbyUrl);
    }

    const interval1 = setInterval(() => {
      console.log(joined);
      if (!joined && !curUser.loading) {
        joinGame();
      } else if (joined) {
        clearInterval(interval1); // Stop trying once joined
      }
    }, 3000); // Retry every 3 seconds

    // Fetch game state periodically
    const interval = setInterval(() => {
      if (joined) {
        fetchGameState();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(interval1);
      unsubscribe();
    };
  }, [curUser, lobbyUrl, joined, fetchGameState]);

  if (!gameState) return <p>Loading game...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="multi-poker">
      {/* Display user's currency */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "1.2em",
        }}
      >
        Total Currency: ${curUser.userData.currency}
      </div>
      {joined && username ? (
        <PokerTable username={username} gameState={gameState} />
      ) : (
        <p>Joining game, please wait...</p>
      )}
    </div>
  );
};

const MultiPokerApp = () => (
  <GameProvider>
    <MultiPoker />
  </GameProvider>
);

export default MultiPokerApp;

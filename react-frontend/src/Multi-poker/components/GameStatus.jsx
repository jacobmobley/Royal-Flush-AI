import React from 'react';

const GameStatus = ({ currentTurn, bigBlind, smallBlind }) => {
  return (
    <div className="game-status">
      <h2>Game Status</h2>
      <p>Turn: {currentTurn}</p>
      <p>Big Blind: ${bigBlind}</p>
      <p>Small Blind: ${smallBlind}</p>
    </div>
  );
};

export default GameStatus;
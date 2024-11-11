import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import PlayerSlot from './PlayerSlot';
import ActionPanel from './ActionPanel';
import GameStatus from './GameStatus';

const PokerTable = () => {
  const { gameState } = useContext(GameContext);

  if (!gameState) {
    return <p>Loading game...</p>;
  }

  const { players, communityCards, pot, currentPlayer, currentTurn, bigBlind, smallBlind } = gameState;

  return (
    <div className="poker-table">
      <h2>Community Cards</h2>
      <div className="community-cards">
        {communityCards.length > 0 ? (
          communityCards.map((card, index) => (
            <div key={index} className="card">
              {card.rank} of {card.suit}
            </div>
          ))
        ) : (
          <p>No cards yet</p>
        )}
      </div>

      <h2>Pot: ${pot}</h2>

      <div className="game-status">
        <GameStatus currentTurn={currentTurn} bigBlind={bigBlind} smallBlind={smallBlind} />
      </div>

      <div className="player-slots">
        {players.map((player, index) => (
          <PlayerSlot
            key={player.id}
            player={player}
            isCurrent={player.id === currentPlayer}
          />
        ))}
      </div>

      <div className="action-panel">
        {currentPlayer && <ActionPanel />}
      </div>
    </div>
  );
};

export default PokerTable;
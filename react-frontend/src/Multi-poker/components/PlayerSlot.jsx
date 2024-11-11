import React from 'react';

const PlayerSlot = ({ player, isCurrent }) => {
  return (
    <div className={`player-slot ${isCurrent ? 'current-player' : ''}`}>
      <h3>{player.name}</h3>
      <p>Chips: ${player.chips}</p>
      
      {isCurrent && player.hand ? (
        <div className="player-hand">
          {player.hand.map((card, index) => (
            <div key={index} className="card">
              {card.rank} of {card.suit}
            </div>
          ))}
        </div>
      ) : (
        <p className="player-status">{player.status || 'Waiting'}</p>
      )}
    </div>
  );
};

export default PlayerSlot;
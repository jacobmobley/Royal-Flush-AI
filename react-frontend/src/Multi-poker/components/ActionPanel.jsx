import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';

const ActionPanel = () => {
  const { sendPlayerAction } = useContext(GameContext);
  const [raiseAmount, setRaiseAmount] = useState(0);

  const handleAction = (action) => {
    if (action === 'raise' && raiseAmount > 0) {
      sendPlayerAction('raise', raiseAmount);
    } else {
      sendPlayerAction(action);
    }
  };

  return (
    <div className="action-panel">
      <button onClick={() => handleAction('check')}>Check</button>
      <button onClick={() => handleAction('call')}>Call</button>
      <button onClick={() => handleAction('fold')}>Fold</button>

      <div className="raise-section">
        <input
          type="number"
          value={raiseAmount}
          onChange={(e) => setRaiseAmount(Number(e.target.value))}
          placeholder="Raise Amount"
        />
        <button onClick={() => handleAction('raise')}>Raise</button>
      </div>
    </div>
  );
};

export default ActionPanel;
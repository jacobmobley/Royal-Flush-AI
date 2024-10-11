import React, { useState } from 'react';
import './RouletteTable.module.css'; // Updated CSS module

const RouletteTable = ({ onPlaceBet }) => {
  const [selectedBet, setSelectedBet] = useState(null);

  const placeBet = (betType, betValue) => {
    setSelectedBet({ type: betType, value: betValue });
    onPlaceBet(betType, betValue);
  };

  const getButtonColor = (number) => {
    if (number === 0) return 'green';
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(number) ? 'red' : 'black';
  };

  // Function to format single-digit numbers with leading zeros
  const formatNumber = (number) => {
    return number < 10 ? `0${number}` : number; // Format single digits as '01', '02', etc.
  };

  return (
    <div className="betting-table">
      <h3>Betting Table</h3>

      {/* Row for 00 */}
      <div className="zero-row" style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          className={`number-button long-button ${getButtonColor(0)}`}
          onClick={() => placeBet('number', 0)}
        >
          00
        </button>
      </div>

      {/* Row 1: numbers 1-12 */}
      <div className="number-row" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {Array.from({ length: 12 }, (_, i) => (
          <button
            key={i + 1}
            className={`number-button ${getButtonColor(i + 1)}`}
            onClick={() => placeBet('number', i + 1)}
          >
            {formatNumber(i + 1)}
          </button>
        ))}
      </div>

      {/* Row 2: numbers 13-24 */}
      <div className="number-row" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {Array.from({ length: 12 }, (_, i) => (
          <button
            key={i + 13}
            className={`number-button ${getButtonColor(i + 13)}`}
            onClick={() => placeBet('number', i + 13)}
          >
            {formatNumber(i + 13)}
          </button>
        ))}
      </div>

      {/* Row 3: numbers 25-36 */}
      <div className="number-row" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {Array.from({ length: 12 }, (_, i) => (
          <button
            key={i + 25}
            className={`number-button ${getButtonColor(i + 25)}`}
            onClick={() => placeBet('number', i + 25)}
          >
            {formatNumber(i + 25)}
          </button>
        ))}
      </div>

      {/* Bet options */}
      <div className="bet-options" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="bet-row" style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => placeBet('color', 'red')} className="red-option bet-button">Red</button>
          <button onClick={() => placeBet('color', 'black')} className="black-option bet-button">Black</button>
          <button onClick={() => placeBet('parity', 'even')} className="bet-button">Even</button>
          <button onClick={() => placeBet('parity', 'odd')} className="bet-button">Odd</button>
        </div>
        <div className="bet-row" style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => placeBet('range', '1-18')} className="bet-button">1 to 18</button>
          <button onClick={() => placeBet('range', '19-36')} className="bet-button">19 to 36</button>
        </div>
        <div className="bet-row" style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => placeBet('dozen', '1st12')} className="bet-button">1st 12</button>
          <button onClick={() => placeBet('dozen', '2nd12')} className="bet-button">2nd 12</button>
          <button onClick={() => placeBet('dozen', '3rd12')} className="bet-button">3rd 12</button>
        </div>
      </div>

      <p className="bet-summary">Selected Bet: {selectedBet ? `${selectedBet.type} on ${selectedBet.value}` : 'No bet yet'}</p>
    </div>
  );
};

export default RouletteTable;

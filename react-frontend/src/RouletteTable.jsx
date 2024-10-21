import React, { useState } from 'react';
import styles from './RouletteTable.module.css'; // Import CSS module as 'styles'

const RouletteTable = ({ onPlaceBet }) => {
  const [selectedBet, setSelectedBet] = useState(null);

  const placeBet = (betType, betValue) => {
    setSelectedBet({ type: betType, value: betValue });
    onPlaceBet(betType, betValue);
  };

  return (
    <div className={styles.bettingTable}>
      <h3>Betting Table</h3>

      {/* Row for 00 */}
      <div className={styles.zeroRow} style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          className={`${styles.numberButton} ${styles.green}`}
          onClick={() => placeBet('number', 0)}
        >
          00
        </button>
      </div>

      {/* Row 1: 1-12 */}
      <div className={styles.numberRow} style={{ display: 'flex', justifyContent: 'center' }}>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 1)}>01</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 2)}>02</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 3)}>03</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 4)}>04</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 5)}>05</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 6)}>06</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 7)}>07</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 8)}>08</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 9)}>09</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 10)}>10</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 11)}>11</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 12)}>12</button>
      </div>

      {/* Row 2: 13-24 */}
      <div className={styles.numberRow} style={{ display: 'flex', justifyContent: 'center' }}>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 13)}>13</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 14)}>14</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 15)}>15</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 16)}>16</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 17)}>17</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 18)}>18</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 19)}>19</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 20)}>20</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 21)}>21</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 22)}>22</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 23)}>23</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 24)}>24</button>
      </div>

      {/* Row 3: 25-36 */}
      <div className={styles.numberRow} style={{ display: 'flex', justifyContent: 'center' }}>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 25)}>25</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 26)}>26</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 27)}>27</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 28)}>28</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 29)}>29</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 30)}>30</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 31)}>31</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 32)}>32</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 33)}>33</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 34)}>34</button>
        <button className={`${styles.numberButton} ${styles.black}`} onClick={() => placeBet('number', 35)}>35</button>
        <button className={`${styles.numberButton} ${styles.red}`} onClick={() => placeBet('number', 36)}>36</button>
      </div>

      {/* Bet options */}
      <div className={styles.betOptions}>
        <div className={styles.betRow}>
          <button onClick={() => placeBet('color', 'red')} className={`${styles.redOption} ${styles.betButton}`}>Red</button>
          <button onClick={() => placeBet('color', 'black')} className={`${styles.blackOption} ${styles.betButton}`}>Black</button>
          <button onClick={() => placeBet('parity', 'even')} className={styles.betButton}>Even</button>
          <button onClick={() => placeBet('parity', 'odd')} className={styles.betButton}>Odd</button>
        </div>
        <div className={styles.betRow}>
          <button onClick={() => placeBet('range', '1-18')} className={styles.betButton}>1 to 18</button>
          <button onClick={() => placeBet('range', '19-36')} className={styles.betButton}>19 to 36</button>
        </div>
        <div className={styles.betRow}>
          <button onClick={() => placeBet('dozen', '1st12')} className={styles.betButton}>1st 12</button>
          <button onClick={() => placeBet('dozen', '2nd12')} className={styles.betButton}>2nd 12</button>
          <button onClick={() => placeBet('dozen', '3rd12')} className={styles.betButton}>3rd 12</button>
        </div>
      </div>

      <p className={styles.betSummary}>Selected Bet: {selectedBet ? `${selectedBet.type} on ${selectedBet.value}` : 'No bet yet'}</p>
    </div>
  );
};

export default RouletteTable;

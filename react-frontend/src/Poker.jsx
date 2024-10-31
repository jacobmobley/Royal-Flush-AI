import React, { useState } from "react";
import styles from "./Poker.module.css";
import FireBaseAuth from "./FireBaseAuth";

function Poker() {
  const [isTurnPopupVisible, setTurnPopupVisible] = useState(false);
  const [isPopupExiting, setPopupExiting] = useState(false);
  const [potValue, setPotValue] = useState(1300);

  const handleYourTurnClick = () => {
    setTurnPopupVisible(true);

    setTimeout(() => {
      setPopupExiting(true);

      setTimeout(() => {
        setTurnPopupVisible(false);
        setPopupExiting(false);
      }, 500);
    }, 500);
  };

  const getMinimumChips = (amount) => {
    const chipValues = [1000, 500, 100, 25, 5, 1]; // Yellow, Purple, Black, Green, Red, White
    const chipNames = ['Yellow ($1000)', 'Purple ($500)', 'Black ($100)', 'Green ($25)', 'Red ($5)', 'White ($1)'];
    const result = Array(chipValues.length).fill(0);

    for (let i = 0; i < chipValues.length; i++) {
      if (amount >= chipValues[i]) {
        result[i] = Math.floor(amount / chipValues[i]);
        amount -= result[i] * chipValues[i];
      }
    }

    return result.map((count, index) => count > 0 ? `${count} x ${chipNames[index]}` : null).filter(Boolean);
  };

  const chipsNeeded = getMinimumChips(potValue);

  return (
    <div className={styles.pokergame}>
      {isTurnPopupVisible && (
        <div className={styles.popupOverlay}>
          <div
            className={`${styles.turnPopup} ${
              isPopupExiting ? styles.exitAnimation : ""
            }`}
          >
            <p>Your Turn!</p>
          </div>
        </div>
      )}
      <div className={styles.pokerTable}>
        <div className={styles.pot}>
          <div className={styles.potHeader}>Current Pot</div>
          <div className={styles.potAmount}>${potValue}</div>
        </div>
        <div className={styles.chipBreakdown}>
          <h3>Chips:</h3>
          <ul>
            {chipsNeeded.map((chip, index) => (
              <li key={index}>{chip}</li>
            ))}
          </ul>
        </div>
        <div className={styles.river}></div>
      </div>

      <div className={styles.player}>
        <div className={styles.buttonContainer}>
          <button className={styles.actionButton} onClick={handleYourTurnClick}>Your Turn</button>
          <button className={styles.actionButton}>Call/Check</button>
          <button className={styles.actionButton}>Fold</button>
          <button className={styles.actionButton}>Bet/Raise</button>
        </div>
      </div>
    </div>
  );
}

export default Poker;

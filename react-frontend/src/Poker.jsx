import React, { useState, useEffect, useRef } from "react";
import styles from "./Poker.module.css";
import FireBaseAuth from "./FireBaseAuth";

function Poker() {
  const [isTurnPopupVisible, setTurnPopupVisible] = useState(false);
  const [isPopupExiting, setPopupExiting] = useState(false);
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
          <div className={styles.potAmount}>$</div>
        </div>
        <div className={styles.river}></div>
      </div>
      <div className={styles.tempButtons}>
        <button className={styles.addPlayer}>Add Player</button>
        <button className={styles.newRound}>New Round</button>
        <button className={styles.yourTurn} onClick={handleYourTurnClick}>
          Your Turn
        </button>
        <button className={styles.dealCards}>Deal Cards</button>
        <button className={styles.flopCards}>Flop Cards</button>
        <button className={styles.turnCard}>Turn Cards</button>
        <button className={styles.youWin}>You Win</button>
        <button className={styles.youLose}>You Lose</button>
      </div>

      <div className={styles.player}>
        <div className={styles.buttonContainer}>
          <button className={styles.actionButton}>Call/Check</button>
          <button className={styles.actionButton}>Fold</button>
          <button className={styles.actionButton}>Bet/Raise</button>
        </div>
      </div>
    </div>
  );
}

export default Poker;

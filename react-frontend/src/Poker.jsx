import React, { useState, useEffect, useRef } from "react";
import styles from "./Poker.module.css";
import FireBaseAuth from "./FireBaseAuth";

function Poker() {
  return (
    <div className={styles.pokergame}>
      poker
      <div className={styles.buttonContainer}>
        <button className={styles.actionButton}>Call/Check</button>
        <button className={styles.actionButton}>Fold</button>
        <button className={styles.actionButton}>Bet/Raise</button>
      </div>
    </div>
  );
}

export default Poker;

import React, { useState, useEffect } from "react";
import styles from "./Poker.module.css";
import api from "./api";

function Poker() {
  const [potValue, setPotValue] = useState(0);
  const [currentRaise, setCurrentRaise] = useState(0);
  const [flopCards, setFlopCards] = useState(["10♦", "J♠", "Q♣"]);
  const [turnCard, setTurnCard] = useState("K♥");
  const [riverCard, setRiverCard] = useState("A♠");
  const [playerHand, setPlayerHand] = useState(["5♠", "7♠"]); // User's hand as player 1
  const [players, setPlayers] = useState([
    { name: "Your Hand", bet: 100, cards: playerHand },
    { name: "Player 2", bet: 150, cards: ["?", "?"] },
    { name: "Player 3", bet: 200, cards: ["?", "?"] },
    { name: "Player 4", bet: 120, cards: ["?", "?"] },
    { name: "Player 5", bet: 50, cards: ["?", "?"] },
    { name: "Player 6", bet: 180, cards: ["?", "?"] },
  ]);

  const handleRaiseChange = (event) => {
    setCurrentRaise(Number(event.target.value));
  };

  const handleBetRaise = () => {
    setPotValue(potValue + currentRaise);
    setCurrentRaise(0);
  };

  const sendGameData = async () => {
    const gameData = {
      "Current hand": playerHand,
      Flop: flopCards,
      River: riverCard,
      Turn: turnCard,
      "Pot amount": potValue,
      "Current raise": currentRaise,
    };
    try {
      await api.sendGameData(gameData);
      console.log("Game data sent:", gameData);
    } catch (error) {
      console.error("Error sending game data:", error);
    }
  };

  useEffect(() => {
    sendGameData();
  }, [playerHand, flopCards, turnCard, riverCard, potValue, currentRaise]);

  return (
    <div className={styles.pokerContainer}>
      <div className={styles.pokerTable}>
        <div className={styles.pot}>
          <div className={styles.potHeader}>Pot Amount</div>
          <div className={styles.potValue}>${potValue}</div>
        </div>
        <div className={styles.communityCards}>
          {flopCards.map((card, index) => (
            <div key={index} className={styles.card}>{card}</div>
          ))}
          <div className={styles.card}>{turnCard}</div>
          <div className={styles.card}>{riverCard}</div>
        </div>
        <div className={styles.players}>
          {players.map((player, index) => (
            <div key={index} className={`${styles.playerSlot} ${styles[`player${index + 1}`]}`}>
              <p>{player.name}</p>
              <p>Bet: ${player.bet}</p>
              <div className={styles.playerCards}>
                {player.cards.map((card, idx) => (
                  <div key={idx} className={card === "?" ? styles.faceDownCard : styles.card}>
                    {card !== "?" ? card : ""}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.controls}>
        <input
          type="range"
          min="0"
          max="500"
          value={currentRaise}
          onChange={handleRaiseChange}
          className={styles.slider}
        />
        <div className={styles.raiseDisplay}>Raise: ${currentRaise}</div>
        <button className={styles.controlButton} onClick={handleBetRaise}>Bet/Raise</button>
        <button className={styles.controlButton}>Check/Call</button>
        <button className={styles.controlButton}>Fold</button>
      </div>
    </div>
  );
}

export default Poker;

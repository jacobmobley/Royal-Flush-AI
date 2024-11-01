import React, { useState, useEffect } from "react";
import styles from "./Poker.module.css";
import api from "./api";

function Poker() {
  const [potValue, setPotValue] = useState(0);
  const [currentRaise, setCurrentRaise] = useState(0);
  const [flopCards, setFlopCards] = useState([]);
  const [turnCard, setTurnCard] = useState();
  const [riverCard, setRiverCard] = useState();
  const [playerHand, setPlayerHand] = useState(["5♠", "7♠"]); // User's hand as player 1
  const [curPlayer, setCurPlayer] = useState(
    { name: "Your Hand", bankroll: 100, cards: playerHand });
  const [aiPlayer, setAiPlayer] = useState(
    { name: "AI Player", bankroll: 150, cards: ["?", "?"] });
  const [curAction, setCurAction] = useState(0);
  //0 for player 1 for ai;

  function getCardImage(value, suit, i) {
    if ((i == 1 && !showDealerCard) || !showCard) {
      return back;
    }
    const key = `${suit}${value}`;
    return cardImageMap[key];
  }

  const updatePlayer = (newValue) => {
    setCurPlayer(prevPlayer => ({
      ...prevPlayer,
      bankroll: newValue,
    }));
  };

  const getMinimumChips = (amount) => {
    const chipValues = [1000, 500, 100, 25, 5, 1];
    const chipColors = ['#FFD700', '#800080', '#000000', '#008000', '#FF0000', '#FFFFFF'];
    const chipLabels = ['$1000', '$500', '$100', '$25', '$5', '$1'];
    const result = [];

    for (let i = 0; i < chipValues.length; i++) {
      const count = Math.floor(amount / chipValues[i]);
      amount -= count * chipValues[i];
      if (count > 0) {
        result.push({ count, color: chipColors[i], label: chipLabels[i] });
      }
    }
    return result;
  };

  const handleRaiseChange = (event) => {
    setCurrentRaise(Number(event.target.value));
  };

  const handleBetRaise = () => {
    setPotValue(potValue + currentRaise);
    updatePlayer(curPlayer.bankroll - currentRaise);
  };


  // const handleTurn = () {

  // };

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
            <div key={0} className={styles.card}>{card}</div>
          ))}
          <div className={styles.card}>{turnCard}</div>
          <div className={styles.card}>{riverCard}</div>
        </div>
        <div className={styles.players}>
          <div key={0} className={`${styles.playerSlot} ${styles[`player1`]}`}>
            <p>{curPlayer.name}</p>
            <p>BankRoll: ${curPlayer.bankroll}</p>
            <div className={styles.playerCards}>
              {curPlayer.cards.map((card, idx) => (
                <div key={idx} className={card === "?" ? styles.faceDownCard : styles.card}>
                  {card !== "?" ? card : ""}
                </div>
              ))}
            </div>
            <div className={styles.chips}>
              {getMinimumChips(curPlayer.bankroll).map((chip, idx) => (
                <div key={idx} className={styles.chipStack}>
                  {[...Array(chip.count)].map((_, i) => (
                    <div
                      key={i}
                      className={styles.chip}
                      style={{ backgroundColor: chip.color }}
                    >
                      <span className={styles.chipLabel}>{chip.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.players}>
          <div key={0} className={`${styles.playerSlot} ${styles[`player2`]}`}>
            <p>{curPlayer.name}</p>
            <p>BankRoll: ${curPlayer.bankroll}</p>
            <div className={styles.playerCards}>
              {curPlayer.cards.map((card, idx) => (
                <div key={idx} className={card === "?" ? styles.faceDownCard : styles.card}>
                  {card !== "?" ? card : ""}
                </div>
              ))}
            </div>
            <div className={styles.chips}>
              {getMinimumChips(curPlayer.bankroll).map((chip, idx) => (
                <div key={idx} className={styles.chipStack}>
                  {[...Array(chip.count)].map((_, i) => (
                    <div
                      key={i}
                      className={styles.chip}
                      style={{ backgroundColor: chip.color }}
                    >
                      <span className={styles.chipLabel}>{chip.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <input
          type="range"
          min="0"
          max={curPlayer.bankroll}
          value={currentRaise}
          onChange={handleRaiseChange}
          className={styles.slider}
        />
        <div className={styles.raiseDisplay}>Raise: ${currentRaise}</div>
        <button className={styles.controlButton} onClick={handleBetRaise}>Check/Raise</button>
        <button className={styles.controlButton}>Check/Call</button>
        <button className={styles.controlButton}>Fold</button>
      </div>
    </div>
  );
}

export default Poker;

import React, { useState, useEffect } from "react";
import styles from "./Poker.module.css";
import api from "./api";

function Poker() {
  const [potValue, setPotValue] = useState(1000);
  const [currentRaise, setCurrentRaise] = useState(0);
  const [flopCards, setFlopCards] = useState(["10♦", "J♠", "Q♣"]);
  const [turnCard, setTurnCard] = useState("K♥");
  const [riverCard, setRiverCard] = useState("A♠");
  const [playerHand, setPlayerHand] = useState(["5♠", "7♠"]);
  const [players, setPlayers] = useState([
    { name: "Your Hand", bet: 1238, cards: playerHand },
    { name: "Player 2", bet: 1383, cards: ["?", "?"] },
    { name: "Player 3", bet: 2034, cards: ["?", "?"] },
    { name: "Player 4", bet: 4444, cards: ["?", "?"] },
    { name: "Player 5", bet: 3333, cards: ["?", "?"] },
    { name: "Player 6", bet: 2222, cards: ["?", "?"] },
  ]);

  const getMinimumChips = (amount) => {
    const chipValues = [1000, 500, 100, 25, 5, 1];
    const chipColors = [
      "#FFD700",
      "#800080",
      "#333333",
      "#008000",
      "#FF0000",
      "#FFFFFF",
    ];
    const chipLabels = ["$1000", "$500", "$100", "$25", "$5", "$1"];
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

  const [isOpen, setIsOpen] = useState(false);

  const toggleBox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.pokerContainer}>
      <div className={styles.pokerTable}>
        <div className={styles.pot}>
          <div className={styles.potHeader}>Total Pot</div>
          <div className={styles.potValue}>${potValue}</div>
        </div>

        <div className={styles.communityCards}>
          {flopCards.map((card, index) => (
            <div key={index} className={styles.card}>
              {card}
            </div>
          ))}
          <div className={styles.card}>{turnCard}</div>
          <div className={styles.card}>{riverCard}</div>
        </div>

        <div className={styles.potChips}>
          {getMinimumChips(potValue).map((chip, idx) => (
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

        <div className={styles.players}>
          {players.map((player, index) => (
            <div
              key={index}
              className={`${styles.playerSlot} ${styles[`player${index + 1}`]}`}
            >
              <p>{player.name}</p>
              <p>Bet: ${player.bet}</p>
              <div className={styles.playerCards}>
                {player.cards.map((card, idx) => (
                  <div
                    key={idx}
                    className={card === "?" ? styles.faceDownCard : styles.card}
                  >
                    {card !== "?" ? card : ""}
                  </div>
                ))}
              </div>
              <div className={styles.chips}>
                {getMinimumChips(player.bet).map((chip, idx) => (
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
          ))}
        </div>
      </div>
      <div className={styles.guide}>
        <button onClick={toggleBox} style={styles.button}>
          {isOpen ? "Close " : "Open "}
          Guide
        </button>
        {isOpen && (
          <div className={styles.box}>
            <ul className={styles.list}>
              <p>
                The order of poker hand rankings from highest to lowest are as
                follows:{" "}
              </p>
              <p>-</p>
              <p>Royal Flush - A, K, Q, J, 10, all the same suit</p>
              <p>
                Straight Flush - Five cards in a sequence, all the same suit
              </p>
              <p>Four of a Kind - All four cards of the same rank</p>
              <p>Full House - Three of a kind with a pair</p>
              <p>Flush - Any five cards of the same suit</p>
              <p>Straight - Five cards in a sequence, not the same suit</p>
              <p>Three of a Kind - Three cards of the same rank</p>
              <p>Two Pair - Two different pairs</p>
              <p>Pair - Two cards of the same rank</p>
              <p>
                High Card - If none of the above are made, the highest card
                plays
              </p>
            </ul>
          </div>
        )}
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
        <button className={styles.controlButton} onClick={handleBetRaise}>
          Bet/Raise
        </button>
        <button className={styles.controlButton}>Check/Call</button>
        <button className={styles.controlButton}>Fold</button>
      </div>
    </div>
  );
}

export default Poker;

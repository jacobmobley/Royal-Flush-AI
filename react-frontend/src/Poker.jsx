import React, { useState, useEffect } from "react";
import styles from "./Poker.module.css";
import api from "./api";
import { useNavigate } from "react-router-dom";

function Poker() {
  const navigate = useNavigate();

  const [potValue, setPotValue] = useState(1000);
  const [currentRaise, setCurrentRaise] = useState(0);
  const [flopCards, setFlopCards] = useState([]);
  const [playerHand, setPlayerHand] = useState(['?', '?']); // User's hand as player 1
  const [curPlayer, setCurPlayer] = useState(
    { name: "Your Hand", bankroll: 100, cards: playerHand });
  const [aiPlayer, setAiPlayer] = useState(
    { name: "AI Player", bankroll: 150, cards: ['?', '?'] });
  const [curAction, setCurAction] = useState(1);
  //0 for player 1 for ai;
  const [curBig, setCurBig] = useState(0);

  function getCardImage(value, suit, i) {
    if ((i == 1 && !showDealerCard) || !showCard) {
      return back;
    }
    const key = `${suit}${value}`;
    return cardImageMap[key];
  }

  const updatePlayerBankroll = (newValue) => {
    setCurPlayer(prevPlayer => ({
      ...prevPlayer,
      bankroll: newValue,
    }));
  };


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
    updatePlayerBankroll(curPlayer.bankroll - currentRaise);
  };


  // const handleTurn = () {

  // };

  // const sendGameData = async () => {
  //   const gameData = {
  //     "Current hand": aiPlayer.cards,
  //     Flop: flopCards,
  //     "Pot amount": potValue,
  //     "Current raise": currentRaise,
  //   };
  //   try {
  //     await api.sendGameData(gameData);
  //     console.log("Game data sent:", gameData);
  //   } catch (error) {
  //     console.error("Error sending game data:", error);
  //   }
  // };

  useEffect(() => {
    // sendGameData();
    // if (curPlayer.bankroll <= 0) {
    //   navigate("/homepage");
    // }
    if (currentRaise > curPlayer.bankroll) {
      setCurrentRaise(curPlayer.bankroll);
    }
  }, [playerHand, flopCards, potValue, currentRaise]);

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
            <div key={0} className={styles.card}>{card}</div>
          ))}
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
          <div key={0} className={`${styles.playerSlot} ${styles[`player1`]} 
              ${curAction == 0 ? styles.playerAction : ''}
            `}>

            {curBig == 0 &&
            <div
              className={curBig == 0 &&  curAction ? styles.bigbutton : ''}
            >
              <span className={styles.bigbuttonText}>BB</span>
            </div>
            }
            <p>{curPlayer.name}</p>
            <p>Bankroll: ${curPlayer.bankroll}</p>
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
        <div className={styles.players} >
          <div key={0} className={`${styles.playerSlot} ${styles[`player2`]} 
              ${curAction == 1 ? styles.playerAction : ''}
            `}>
            {curBig == 1 &&
            <div
              className={curBig == 1 &&  curAction ? styles.bigbuttonai : ''}
            >
              <span className={styles.bigbuttonText}>BB</span>
            </div>
            }
            <p>{aiPlayer.name}</p>
            <p>Bankroll: ${aiPlayer.bankroll}</p>
            <div className={styles.playerCards}>
              {aiPlayer.cards.map((card, idx) => (
                <div key={idx} className={card === "?" ? styles.faceDownCard : styles.card}>
                  {card !== "?" ? card : ""}
                </div>
              ))}
            </div>
            <div className={styles.chips}>
              {getMinimumChips(aiPlayer.bankroll).map((chip, idx) => (
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
        {curAction == 0 &&
        <input
          type="range"
          min="0"
          max={curPlayer.bankroll}
          value={currentRaise}
          onChange={handleRaiseChange}
          className={styles.slider}
        />}
        {curAction == 0 &&
        <div className={styles.raiseDisplay}>Raise: ${currentRaise}</div>
        }
        {curAction == 0 &&
        <button className={styles.controlButton} onClick={handleBetRaise}>Raise</button>}
        {curAction == 0 &&
        <button className={styles.controlButton}>Check/Call</button>}
        {curAction == 0 &&
        <button className={styles.controlButton}>Fold</button>}
      </div>
    </div>
  );
}

export default Poker;

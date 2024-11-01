import React, { useState, useEffect } from "react";
import styles from "./Poker.module.css";
import api from "./api";
import { useNavigate } from "react-router-dom";

import back from "./assets/cards/cardBack_red2.png";

import clubs2 from "./assets/cards/2_of_clubs.png";
import clubs3 from "./assets/cards/3_of_clubs.png";
import clubs4 from "./assets/cards/4_of_clubs.png";
import clubs5 from "./assets/cards/5_of_clubs.png";
import clubs6 from "./assets/cards/6_of_clubs.png";
import clubs7 from "./assets/cards/7_of_clubs.png";
import clubs8 from "./assets/cards/8_of_clubs.png";
import clubs9 from "./assets/cards/9_of_clubs.png";
import clubs10 from "./assets/cards/10_of_clubs.png";
import clubsjack from "./assets/cards/jack_of_clubs.png";
import clubsqueen from "./assets/cards/queen_of_clubs.png";
import clubsking from "./assets/cards/king_of_clubs.png";
import clubsace from "./assets/cards/ace_of_clubs.png";

import diamonds2 from "./assets/cards/2_of_diamonds.png";
import diamonds3 from "./assets/cards/3_of_diamonds.png";
import diamonds4 from "./assets/cards/4_of_diamonds.png";
import diamonds5 from "./assets/cards/5_of_diamonds.png";
import diamonds6 from "./assets/cards/6_of_diamonds.png";
import diamonds7 from "./assets/cards/7_of_diamonds.png";
import diamonds8 from "./assets/cards/8_of_diamonds.png";
import diamonds9 from "./assets/cards/9_of_diamonds.png";
import diamonds10 from "./assets/cards/10_of_diamonds.png";
import diamondsjack from "./assets/cards/jack_of_diamonds.png";
import diamondsqueen from "./assets/cards/queen_of_diamonds.png";
import diamondsking from "./assets/cards/king_of_diamonds.png";
import diamondsace from "./assets/cards/ace_of_diamonds.png";

import hearts2 from "./assets/cards/2_of_hearts.png";
import hearts3 from "./assets/cards/3_of_hearts.png";
import hearts4 from "./assets/cards/4_of_hearts.png";
import hearts5 from "./assets/cards/5_of_hearts.png";
import hearts6 from "./assets/cards/6_of_hearts.png";
import hearts7 from "./assets/cards/7_of_hearts.png";
import hearts8 from "./assets/cards/8_of_hearts.png";
import hearts9 from "./assets/cards/9_of_hearts.png";
import hearts10 from "./assets/cards/10_of_hearts.png";
import heartsjack from "./assets/cards/jack_of_hearts.png";
import heartsqueen from "./assets/cards/queen_of_hearts.png";
import heartsking from "./assets/cards/king_of_hearts.png";
import heartsace from "./assets/cards/ace_of_hearts.png";

import spades2 from "./assets/cards/2_of_spades.png";
import spades3 from "./assets/cards/3_of_spades.png";
import spades4 from "./assets/cards/4_of_spades.png";
import spades5 from "./assets/cards/5_of_spades.png";
import spades6 from "./assets/cards/6_of_spades.png";
import spades7 from "./assets/cards/7_of_spades.png";
import spades8 from "./assets/cards/8_of_spades.png";
import spades9 from "./assets/cards/9_of_spades.png";
import spades10 from "./assets/cards/10_of_spades.png";
import spadesjack from "./assets/cards/jack_of_spades.png";
import spadesqueen from "./assets/cards/queen_of_spades.png";
import spadesking from "./assets/cards/king_of_spades.png";
import spadesace from "./assets/cards/ace_of_spades.png";
import { updateCurrentUser } from "firebase/auth";

const suits = ["spades", "clubs", "diamonds", "hearts"];
const values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "jack",
  "queen",
  "king",
  "ace",
];

const cardImageMap = {
  clubs2,
  clubs3,
  clubs4,
  clubs5,
  clubs6,
  clubs7,
  clubs8,
  clubs9,
  clubs10,
  clubsjack,
  clubsqueen,
  clubsking,
  clubsace,
  diamonds2,
  diamonds3,
  diamonds4,
  diamonds5,
  diamonds6,
  diamonds7,
  diamonds8,
  diamonds9,
  diamonds10,
  diamondsjack,
  diamondsqueen,
  diamondsking,
  diamondsace,
  hearts2,
  hearts3,
  hearts4,
  hearts5,
  hearts6,
  hearts7,
  hearts8,
  hearts9,
  hearts10,
  heartsjack,
  heartsqueen,
  heartsking,
  heartsace,
  spades2,
  spades3,
  spades4,
  spades5,
  spades6,
  spades7,
  spades8,
  spades9,
  spades10,
  spadesjack,
  spadesqueen,
  spadesking,
  spadesace,
};

function Poker() {
  const navigate = useNavigate();

  const [potValue, setPotValue] = useState(0);
  const [currentRaise, setCurrentRaise] = useState(0);
  const [flopCards, setFlopCards] = useState([]);
  const [playerHand, setPlayerHand] = useState([]); // User's hand as player 1
  const [aiHand, setAIhand] = useState([]);
  const [curPlayer, setCurPlayer] = useState(
    { name: "Your Hand", bankroll: 100});
  const [aiPlayer, setAiPlayer] = useState(
    { name: "AI Player", bankroll: 150});
  const [curAction, setCurAction] = useState(1);
  //0 for player 1 for ai;
  const [curBig, setCurBig] = useState(0);
  const [curCall, setCurCall] = useState(0);
  const [check, setCheck] = useState(false);
  const [turnCount, setTurnCount] = useState(1);
  const [call, setCall] = useState(false);
  const [deck, setDeck] = useState([]);
  const [aiTurnDone, setAiTurnDone] = useState(false);
  const [endState, setEndState] = useState(false);
  const [cardCount, setCardCount] = useState(0);

  function getCardImage(value, suit, showBack) {
    if (!showBack) {
      return back;
    }
    const key = `${suit}${value}`;
    return cardImageMap[key];
  }

  function createDeck() {
    const newDeck = [];
    for (let suit of suits) {
      for (let value of values) {
         newDeck.push({ value, suit });
      }
    }
    return newDeck;
  }

  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  const updatePlayerBankroll = (newValue) => {
    setCurPlayer(prevPlayer => ({
      ...prevPlayer,
      bankroll: newValue,
    }));
  };
  const updateAiBankroll = (newValue) => {
    setAiPlayer(prevPlayer => ({
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

  const handleAction = () => {
    setPotValue(potValue + currentRaise);
    if (curAction == 0) {
      updatePlayerBankroll(curPlayer.bankroll - currentRaise);
    }
    else {
      updateAiBankroll(aiPlayer.bankroll - currentRaise);
    }
    
    console.log("test");
    handleNewturn();
  };

  const handleCheck = () => {
    setCurrentRaise(0);
    setCheck(true);
  };

  useEffect(() => {
    if (check) {
      handleAction();
    }
    setCheck(false);
  }, [check]);

  

  const handleCall = () => {
    setCurrentRaise(curCall);
    setCall(true);
  };

  useEffect(() => {
    if (call) {
      handleAction();
      setCall(0);
    }
    setCall(false);
  }, [call]);


  const handleNewGame = () => {
    if (curPlayer.bankroll == 0) {
      navigate("/homepage");
    }
    // Create and shuffle the deck
    const newDeck = shuffleDeck(createDeck());
    setFlopCards([]);
    setCardCount(0);
    setEndState(false);

    // Deal cards to the player
    const playerCards = [newDeck.pop(), newDeck.pop()];
    setPlayerHand(playerCards);
    console.log(playerCards);

    // Deal cards to the AI
    const aiCards = [newDeck.pop(), newDeck.pop()];
    setAIhand(aiCards);
    console.log(aiHand);

    // Update the deck state
    setDeck(newDeck);
    setCurBig(curBig ^ 1);
    console.log(curBig);
    setCurAction(curBig ^ 0);
    setPotValue(0);
  };

  const handleNewturn = () => {
    console.log("call: " + curCall);
    if (turnCount >= 2) {
      dealFlop();
    }
    if (currentRaise > curCall) {
      setCurCall(currentRaise - curCall);
      setTurnCount(2);
    }
    else {
      setCurCall(0);
      setTurnCount(prevTurnCount => prevTurnCount + 1);
    }
    setCurAction(curAction ^ 1);
  };

  const handleAIturn = () => {
    let bet = 10;
    if (curCall > 0) {
      bet = curCall;
    }
    else {
      bet = 0;
    }
    setCurrentRaise(bet);
    setAiTurnDone(true);
  };

  const dealFlop = () => {
    switch (cardCount) {
      case 0:
        handleFlop();
        break;
      case 1:
        handleRiverTurn();
        break;
      case 2:
        handleRiverTurn();
        break;
      case 3:
        setEndState(true);
        break;
    }
    setTurnCount(0);
  }

  const handleFlop = () => {
    const newDeck = deck;
    const flop = [newDeck.pop(), newDeck.pop(), newDeck.pop()];
    setDeck(newDeck);
    setFlopCards(flop);
    setCardCount(1);
  };

  const handleRiverTurn = () => {
    const newDeck = deck;
    const flop = flopCards;
    flop.push(newDeck.pop());
    setDeck(newDeck);
    setFlopCards(flop);
    setCardCount(cardCount + 1);
  };

  useEffect(() => {
    if (aiTurnDone) {
      handleAction();
    }
    setAiTurnDone(false);
  }, [aiTurnDone]);
  


  const handleFold = () => {
    console.log(curAction);
    switch(curAction) {
      case 0:
        updateAiBankroll(aiPlayer.bankroll + potValue);
        break;

      case 1:
        updatePlayerBankroll(curPlayer.bankroll + potValue);
        break;
    }
    handleNewGame();
  };

  function whoWins(handOne, handTwo) {
    return 0;
  }

  const handleEndGame = () => {
    let winner = whoWins();
    if (winner == 0) {
      updatePlayerBankroll(curPlayer.bankroll + potValue);
    }
    else {
      updateAiBankroll(aiPlayer.bankroll + potValue);
    }
    handleNewGame();
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
    if (curAction === 1) {
      const delay = setTimeout(() => {
        handleAIturn();
      }, 1000); // 1000ms = 1 second delay

      // Cleanup the timeout if the component unmounts or curAction changes
      return () => clearTimeout(delay);
    }
  }, [curAction]);

  useEffect(() => {
    handleNewGame();
  }, []);

  useEffect(() => {
    if (currentRaise > curPlayer.bankroll) {
      setCurrentRaise(curPlayer.bankroll);
    }
  }, [playerHand, flopCards, potValue, currentRaise]);

  useEffect(() => {
    if (endState) {
      const delay = setTimeout(() => {
        handleEndGame();
      }, 3000); // 1000ms = 1 second delay

      // Cleanup the timeout if the component unmounts or curAction changes
      return () => clearTimeout(delay);
      setEndState(false);
    }
  }, [endState]);

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
              <img
                key={index}
                src={getCardImage(card.value, card.suit, true)}
                alt={`${card.value} of ${card.suit}`}
                className={styles.cardImage}
                width={80}
                height={110}
              />
          </div>
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
              className={curBig == 0 ? styles.bigbutton : ''}
            >
              <span className={styles.bigbuttonText}>BB</span>
            </div>
            }
            <p>{curPlayer.name}</p>
            <p>Bankroll: ${curPlayer.bankroll}</p>
            <div className={styles.playerCards}>
              {playerHand.map((card, idx) => (
                <div key={idx} className={card === "?" ? styles.faceDownCard : styles.card}>
                  <img
                    key={idx}
                    src={getCardImage(card.value, card.suit, true)}
                    alt={`${card.value} of ${card.suit}`}
                    className={styles.cardImage}
                    width={80}
                    height={110}
                  />
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
              className={curBig == 1  ? styles.bigbuttonai : ''}
            >
              <span className={styles.bigbuttonText}>BB</span>
            </div>
            }
            <p>{aiPlayer.name}</p>
            <p>Bankroll: ${aiPlayer.bankroll}</p>
            <div className={styles.playerCards}>
              {aiHand.map((card, idx) => (
                <div key={idx} className={card === "?" ? styles.faceDownCard : styles.card}>
                  <img
                    key={idx}
                    src={getCardImage(card.value, card.suit, endState)}
                    alt={`${card.value} of ${card.suit}`}
                    className={styles.cardImage}
                    width={80}
                    height={110}
                  />
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
          min={curCall}
          max={curPlayer.bankroll}
          value={currentRaise}
          onChange={handleRaiseChange}
          className={styles.slider}
        />}
        {curAction == 0 &&
        <div className={styles.raiseDisplay}>Raise: ${currentRaise}</div>
        }
        {curAction == 0 &&
        <button className={styles.controlButton} onClick={handleAction}>Raise</button>}
        {curAction == 0 &&
        <button className={styles.controlButton} onClick={curCall > 0 ? handleCall : handleCheck}>Check/Call</button>}
        {curAction == 0 &&
        <button className={styles.controlButton} onClick={handleFold}>Fold</button>}
      </div>
    </div>
  );
}

export default Poker;

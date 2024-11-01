import React, { useState, useEffect } from "react";
import styles from "./Poker.module.css";
import api from "./api";
import { getBuyIn } from "./PokerSettings.js";
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

const valueOrder = [
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
  const [curPlayer, setCurPlayer] = useState({
    name: "Your Hand",
    bankroll: 100,
  });
  const [aiPlayer, setAiPlayer] = useState({
    name: "AI Player",
    bankroll: 150,
  });
  const [curBig, setCurBig] = useState(1);
  const [curCall, setCurCall] = useState(0);
  const [deck, setDeck] = useState([]);
  const [endState, setEndState] = useState(false);

  const phases = ["pre-flop", "flop", "turn", "river"]; // Define the game phases
  const [phase, setPhase] = useState("pre-flop"); // State to track the current phase
  const [roundComplete, setRoundComplete] = useState(false); // Tracks if the round is complete
  const [curAction, setCurAction] = useState(0); // Player with small blind acts first

  const smallBlindAmount = 5; // Small blind amount
  const bigBlindAmount = 10; // Big blind amount

  const [gameStarted, setGameStarted] = useState(false);

  const [isTurnPopupVisible, setTurnPopupVisible] = useState(false);

  useEffect(() => {
    if (curAction === 0) {
      // Show the popup when it's the player's turn
      setTurnPopupVisible(true);
      // Automatically hide the popup after 2 seconds
      const timeout = setTimeout(() => {
        setTurnPopupVisible(false);
      }, 1000);

      return () => clearTimeout(timeout); // Clean up timeout on effect cleanup
    }
  }, [curAction]);

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
    setCurPlayer((prevPlayer) => ({
      ...prevPlayer,
      bankroll: newValue,
    }));
  };
  const updateAiBankroll = (newValue) => {
    setAiPlayer((prevPlayer) => ({
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

  const handleFlop = () => {
    const newFlop = [deck.pop(), deck.pop(), deck.pop()];
    console.log(deck);
    console.log(newFlop);
    setFlopCards(newFlop);
  };

  const handleTurn = () => {
    setFlopCards([...flopCards, deck.pop()]);
  };

  const handleRiver = () => {
    setFlopCards([...flopCards, deck.pop()]);
  };

  const handleNewGame = () => {
    setGameStarted(true); // Ensure game is marked as started
    setPhase("pre-flop");
    setCurAction(curBig ^ 1); // Player with small blind acts first
    setPotValue(smallBlindAmount + bigBlindAmount); // Initialize pot with blinds
    setCurrentRaise(0);
    setCurCall(bigBlindAmount); // Set minimum call amount to the big blind
    setRoundComplete(false); // Reset round complete state for new game
    setEndState(false);

    // Reset player and AI hands
    setPlayerHand([]);
    setAIhand([]);

    // Create, shuffle, and assign a new deck
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);

    // Deal new hands to player and AI
    const playerCards = [newDeck.pop(), newDeck.pop()];
    setPlayerHand(playerCards);

    const aiCards = [newDeck.pop(), newDeck.pop()];
    setAIhand(aiCards);

    // Reset community cards
    setFlopCards([]);

    // Deduct blinds from the appropriate players
    if (curBig === 0) {
      updatePlayerBankroll(curPlayer.bankroll - bigBlindAmount); // Player is big blind
      updateAiBankroll(aiPlayer.bankroll - smallBlindAmount); // AI is small blind
    } else {
      updatePlayerBankroll(curPlayer.bankroll - smallBlindAmount); // Player is small blind
      updateAiBankroll(aiPlayer.bankroll - bigBlindAmount); // AI is big blind
    }

    console.log(
      "New game started. Player bankroll:",
      curPlayer.bankroll,
      "AI bankroll:",
      aiPlayer.bankroll
    );
  };

  const advancePhase = () => {
    console.log(phase);
    const currentPhaseIndex = phases.indexOf(phase);
    if (currentPhaseIndex < phases.length - 1) {
      const newPhase = phases[currentPhaseIndex + 1];
      setPhase(newPhase);

      // Reveal community cards based on the phase
      if (newPhase === "flop") handleFlop();
      if (newPhase === "turn") handleTurn();
      if (newPhase === "river") handleRiver();
    } else {
      setEndState(true); // End game after river phase
      rotateBlinds(); // Rotate blinds at the end of each round
    }
  };

  const rotateBlinds = () => {
    setCurBig(curBig ^ 1); // Toggle curBig to switch blinds for the next game
  };

  const handleAction = () => {
    if (curAction === 0) {
      // Player's action
      updatePlayerBankroll(curPlayer.bankroll - currentRaise);
    } else {
      // AI's action
      updateAiBankroll(aiPlayer.bankroll - currentRaise);
    }
    setPotValue(potValue + currentRaise);
    setCurAction(curAction ^ 1); // Switch turn
    setCurrentRaise(0);

    // Check if both players have acted this round (round complete)
    if (curAction === curBig) {
      setRoundComplete(true);
    }
  };

  const handleCheck = () => {
    console.log("player: check");
    setCurrentRaise(currentRaise); // No raise for a check
    setCurAction(curAction ^ 1); // Switch turn
    if (curAction === curBig) {
      setRoundComplete(true); // End the round if both players have acted
    }
  };

  const handleCall = () => {
    console.log("player: call");
    const amountToCall = curCall - currentRaise;
    setCurrentRaise(amountToCall);
    updatePlayerBankroll(curPlayer.bankroll - amountToCall);
    setPotValue(potValue + amountToCall);
    setCurAction(curAction ^ 1);
    if (curAction === curBig) {
      setRoundComplete(true); // End the round if both players have acted
    }
  };

  // Handle fold action
  const handleFold = () => {
    console.log("player: fold");
    if (curAction === 0) {
      updateAiBankroll(aiPlayer.bankroll + potValue);
    } else {
      updatePlayerBankroll(curPlayer.bankroll + potValue);
    }

    // Check for zero bankrolls after awarding the pot
    if (curPlayer.bankroll === 0 || aiPlayer.bankroll === 0) {
      navigateToEndScreen(); // End the game if a player is out of bankroll
    } else {
      handleNewGame(); // Otherwise, start a new game
    }
  };

  // Trigger AI actions if it's the AI's turn
  useEffect(() => {
    if (curAction === 1 && !endState) {
      const delay = setTimeout(() => handleAIturn(), 1000); // AI turn delay
      return () => clearTimeout(delay);
    }
  }, [curAction, endState]);

  // AI's turn logic
  const handleAIturn = () => {
    const aiDecision = decideAIAction();

    switch (aiDecision) {
      case "call":
        console.log("ai: call");
        handleAICall();
        break;
      case "raise":
        console.log("ai: raise");
        handleAIRaise();
        break;
      case "check":
        console.log("ai: check");
        handleAICheck();
        break;
      case "fold":
        console.log("ai: fold");
        handleAICheck();
        break;
      default:
        handleAICheck(); // Default to check if no decision made
    }
  };

  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  const decideAIAction = () => {
    const simulatedPlayerHands = generateSimulatedPlayerHands();
    //let aiWinProbability = evaluateAIWinProbability(aiHand, simulatedPlayerHands, flopCards);
    let aiWinProbability=randomNumber(0, 1);
    console.log(aiWinProbability);
    // Make decision based on probability thresholds and current call amount
    if (aiWinProbability > 0.75 && potValue < aiPlayer.bankroll / 2) {
      return "raise"; // Confident hand and pot size is reasonable
    } else if (aiWinProbability > 0.1) {
      return "call"; // Decent hand, call
    } else if (curCall === 0) {
      return "check"; // Weak hand, but no risk in checking
    } else {
      return "fold"; // Weak hand, fold if there’s a bet
    }
  };

  const handleAICall = () => {
    const amountToCall = currentRaise;
    updateAiBankroll(aiPlayer.bankroll - amountToCall);
    setPotValue(potValue + amountToCall);
    setCurAction(0); // Pass control back to the player
    setRoundComplete(curAction === curBig); // Set round complete if needed
  };

  const handleAIRaise = () => {
    const raiseAmount = currentRaise + 10;
    updateAiBankroll(aiPlayer.bankroll - raiseAmount);
    setPotValue(potValue + raiseAmount);
    setCurrentRaise(raiseAmount);
    setCurCall(raiseAmount); // Update call amount to the new raise
    setCurAction(0); // Pass control back to the player
    setRoundComplete(curAction === curBig); // Set round complete if needed
  };

  const handleAICheck = () => {
    setCurrentRaise(currentRaise); // No raise on a check
    setCurAction(0); // Pass control back to the player
    setRoundComplete(curAction === curBig); // Set round complete if needed
  };

  const handleAIFold = () => {
    console.log(curPlayer);
    updatePlayerBankroll(curPlayer.bankroll + potValue); // Award pot to player
    resetGame(); // Reset round or start a new game
  };

  function generateSimulatedPlayerHands() {
    const unseenCards = deck.filter(
      (card) => !aiHand.includes(card) && !flopCards.includes(card)
    );
    const simulatedHands = [];

    for (let i = 0; i < 100; i++) {
      // Generate 100 simulated hands for variety
      const randomHand = [
        unseenCards[Math.floor(Math.random() * unseenCards.length)],
        unseenCards[Math.floor(Math.random() * unseenCards.length)],
      ];
      simulatedHands.push(randomHand);
    }

    return simulatedHands;
  }

  function evaluateAIWinProbability(
    aiHand,
    simulatedPlayerHands,
    communityCards
  ) {
    let aiWins = 0;
    let totalSimulations = simulatedPlayerHands.length;

    for (let simulatedHand of simulatedPlayerHands) {
      const aiBestHand = evaluateBestHand([...aiHand, ...communityCards]);
      const playerBestHand = evaluateBestHand([
        ...simulatedHand,
        ...communityCards,
      ]);
      const result = compareHands(aiBestHand, playerBestHand);

      if (result > 0) {
        aiWins += 1; // AI wins this simulated matchup
      }
      // No increment for a tie as we're only tracking AI wins
    }

    return aiWins / totalSimulations; // Return win probability as a percentage
  }

  useEffect(() => {
    if (endState) {
      handleEndGame();
      rotateBlinds(); // Rotate blinds after awarding the pot
    }
  }, [endState]);

  const handleEndGame = () => {
    const winner = whoWins();
    console.log("winner:" + winner);
    if (winner === 0) {
      updatePlayerBankroll(curPlayer.bankroll + potValue); // Award pot to player
    } else if (winner === 1) {
      updateAiBankroll(aiPlayer.bankroll + potValue); // Award pot to AI
    }
    setPotValue(0); // Reset pot
    resetGame(); // Reset game or navigate to end screen
  };

  const navigateToEndScreen = () => {
    // Navigate to a summary screen or display end-game results here
    console.log(
      "Game over! Final Bankrolls - Player:",
      curPlayer.bankroll,
      "AI:",
      aiPlayer.bankroll
    );
    // Optionally navigate or display a message based on your app's structure
    navigate("/homepage"); // Assuming you have an end screen route
  };

  const resetGame = () => {
    if (curPlayer.bankroll > 0 && aiPlayer.bankroll > 0) {
      console.log("currbig" + curBig);
      handleNewGame(); // Start a new game
    } else {
      navigateToEndScreen(); // End game if any player is out of bankroll
    }
  };

  function whoWins() {
    const hands = [
      { name: "player", hand: playerHand },
      { name: "ai", hand: aiHand },
    ];

    // Combine player and AI hands with the community cards (flopCards)
    let bestHandPlayer = evaluateBestHand([...playerHand, ...flopCards]);
    console.log(playerHand, aiHand);
    let bestHandAI = evaluateBestHand([...aiHand, ...flopCards]);
    console.log(bestHandPlayer, bestHandAI);
    // Compare the best hands
    if (compareHands(bestHandPlayer, bestHandAI) > 0) {
      return 0; // Player wins
    } else if (compareHands(bestHandPlayer, bestHandAI) < 0) {
      return 1; // AI wins
    } else {
      return -1; // Tie
    }
  }

  function evaluateBestHand(cards) {
    let allCombinations = getAllCombinations(cards, 5);
    let bestHand = { rank: -1, values: [] };

    for (let combination of allCombinations) {
      let rankedHand = rankHand(combination);
      if (
        rankedHand.rank > bestHand.rank ||
        (rankedHand.rank === bestHand.rank &&
          isHigherHand(rankedHand.values, bestHand.values))
      ) {
        bestHand = rankedHand;
      }
    }
    return bestHand;
    
  }

  function isHigherHand(hand1Values, hand2Values) {
    // Sort both hands by value order to facilitate comparison
    const sortedHand1 = hand1Values
      .map((value) => valueOrder.indexOf(value))
      .sort((a, b) => b - a);
    const sortedHand2 = hand2Values
      .map((value) => valueOrder.indexOf(value))
      .sort((a, b) => b - a);

    // Compare each card in descending order
    for (let i = 0; i < sortedHand1.length; i++) {
      if (sortedHand1[i] > sortedHand2[i]) return true; // Hand 1 is higher
      if (sortedHand1[i] < sortedHand2[i]) return false; // Hand 2 is higher
    }
    return null; // Hands are equal in rank and value
  }

  function rankHand(cards) {
    let values = cards.map((card) => card.value);
    let suits = cards.map((card) => card.suit);

    let valueCounts = countValues(values);
    console.log(cards);
    let isFlush = new Set(suits).size === 1;
    let isStraight = checkStraight(values);

    if (
      isFlush &&
      isStraight &&
      values.includes("ace") &&
      values.includes("king")
    ) {
      return { rank: 9, values: ["A", "K", "Q", "J", "10"] }; // Royal Flush
    }
    if (isFlush && isStraight) return { rank: 8, values: values.sort() }; // Straight Flush
    if (isFlush) return { rank: 5, values: values.sort() }; // Flush
    if (isStraight) return { rank: 4, values: values.sort() }; // Straight
  
    if (valueCounts[4]) return { rank: 7, values: values.sort() }; // Four of a Kind
    if (valueCounts && valueCounts[2]) return { rank: 6, values: values.sort() }; // Full House
    if (valueCounts[3]) return { rank: 3, values: values.sort() }; // Three of a Kind
    if (Object.keys(valueCounts).length === 3) return { rank: 2, values: values.sort() }; // Two Pair
    if (valueCounts[2]) return { rank: 1, values: values.sort() }; // One Pair
  
    return { rank: 0, values: values.sort().reverse() }; // High Card
  }

  function compareHands(hand1, hand2) {
    if (hand1.rank !== hand2.rank) return hand1.rank - hand2.rank;
    return compareValues(hand1.values, hand2.values);
  }

  function compareValues(values1, values2) {
    const valueOrder = [
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
    for (let i = 0; i < values1.length; i++) {
      if (valueOrder.indexOf(values1[i]) !== valueOrder.indexOf(values2[i])) {
        return valueOrder.indexOf(values1[i]) - valueOrder.indexOf(values2[i]);
      }
    }
    return 0;
  }

  function getAllCombinations(arr, length) {
    function combinationsHelper(start, chosen) {
      if (chosen.length === length) return [chosen];
      let result = [];
      for (let i = start; i < arr.length; i++) {
        result = result.concat(combinationsHelper(i + 1, [...chosen, arr[i]]));
      }
      return result;
    }
    return combinationsHelper(0, []);
  }

  function checkStraight(values) {
    const valueOrder = [
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
    let sortedValues = values
      .map((val) => valueOrder.indexOf(val))
      .sort((a, b) => a - b);
    for (let i = 1; i < sortedValues.length; i++) {
      if (sortedValues[i] - sortedValues[i - 1] !== 1) return false;
    }
    return true;
  }

  function countValues(values) {
    console.log(values);
    let counts = {};
    values.forEach((value) => (counts[value] = (counts[value] || 0) + 1));
    return counts;
  }

  function getTopValues(counts, ...quantities) {
    return quantities.flatMap((q) =>
      Object.keys(counts).filter((key) => counts[key] === q)
    );
  }

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
    if (roundComplete) {
      advancePhase(); // Move to the next phase
      setRoundComplete(false); // Reset for the next phase
    }
  }, [roundComplete]);

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
      {!gameStarted ? (
        <button
          className={styles.startButton}
          onClick={() => {
            setGameStarted(true);
            handleNewGame(); // Start the game setup
          }}
        >
          Start Game
        </button>
      ) : (
        <>
          {isTurnPopupVisible && (
            <div className={styles.popupOverlay}>
              <div className={styles.turnPopup}>
                <p>Your Turn!</p>
              </div>
            </div>
          )}

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
              <div
                key={0}
                className={`${styles.playerSlot} ${styles[`player1`]} 
              ${curAction == 0 ? styles.playerAction : ""}
            `}
              >
                {curBig == 0 && (
                  <div className={curBig == 0 ? styles.bigbutton : ""}>
                    <span className={styles.bigbuttonText}>BB</span>
                  </div>
                )}
                <p>{curPlayer.name}</p>
                <p>Bankroll: ${curPlayer.bankroll}</p>
                <div className={styles.playerCards}>
                  {playerHand.map((card, idx) => (
                    <div
                      key={idx}
                      className={
                        card === "?" ? styles.faceDownCard : styles.card
                      }
                    >
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
            <div className={styles.players}>
              <div
                key={0}
                className={`${styles.playerSlot} ${styles[`player2`]} 
              ${curAction == 1 ? styles.playerAction : ""}
            `}
              >
                {curBig == 1 && (
                  <div className={curBig == 1 ? styles.bigbuttonai : ""}>
                    <span className={styles.bigbuttonText}>BB</span>
                  </div>
                )}
                <p>{aiPlayer.name}</p>
                <p>Bankroll: ${aiPlayer.bankroll}</p>
                <div className={styles.playerCards}>
                  {aiHand.map((card, idx) => (
                    <div
                      key={idx}
                      className={
                        card === "?" ? styles.faceDownCard : styles.card
                      }
                    >
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
                    The order of poker hand rankings from highest to lowest are
                    as follows:{" "}
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
            {curAction == 0 && (
              <input
                type="range"
                min={curCall}
                max={curPlayer.bankroll}
                value={currentRaise}
                onChange={handleRaiseChange}
                className={styles.slider}
              />
            )}
            {curAction == 0 && (
              <div className={styles.raiseDisplay}>Raise: ${currentRaise}</div>
            )}
            {curAction == 0 && (
              <button className={styles.controlButton} onClick={handleAction}>
                Raise
              </button>
            )}
            {curAction == 0 && (
              <button
                className={styles.controlButton}
                onClick={curCall > 0 ? handleCall : handleCheck}
              >
                Check/Call
              </button>
            )}
            {curAction == 0 && (
              <button className={styles.controlButton} onClick={handleFold}>
                Fold
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Poker;

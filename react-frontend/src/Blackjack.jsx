import React, { useState, useEffect } from "react";
import styles from "./Blackjack.module.css";
import FireBaseAuth from "./FireBaseAuth";

const suits = ["♠", "♣", "♦", "♥"];
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
  "J",
  "Q",
  "K",
  "A",
];

function Blackjack() {
  const [curUser] = useState(new FireBaseAuth());
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentBet, setCurrentBet] = useState(100);
  const [message, setMessage] = useState("");
  const [resultClass, setResultClass] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);

  const setTotalPointsWithUpdate = (newPoints) => {
    setTotalPoints(newPoints); // Set local state
    curUser.updateCurrency(newPoints); // Update Firebase
  };

  useEffect(() => {
    const unsubscribe = curUser.getUnsubscribe();
    if (loading) {
      const checkLoadingStatus = setInterval(() => {
        if (!curUser.loading) {
          setLoading(false);
          setUserData(curUser.userData); // Sync with Firebase
          const initialPoints = curUser.userData?.currency || 0;
          clearInterval(checkLoadingStatus);
          setTotalPoints(initialPoints);
          initGame();
        }
      }, 100);
    }

    return () => {
      unsubscribe();
    };
  }, [curUser]);

  if (loading) {
    return <div className={styles.loading}>Loading user data...</div>;
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

  function drawCard() {
    const newDeck = [...deck];
    const card = newDeck.pop();
    setDeck(newDeck);
    return card;
  }

  function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;

    hand.forEach((card) => {
      if (["J", "Q", "K"].includes(card.value)) {
        score += 10;
      } else if (card.value === "A") {
        score += 11;
        aceCount++;
      } else {
        score += parseInt(card.value);
      }
    });

    while (score > 21 && aceCount > 0) {
      score -= 10;
      aceCount--;
    }

    return score;
  }

  function initGame() {
    const newDeck = shuffleDeck(createDeck());
    const playerStartingHand = [newDeck.pop(), newDeck.pop()];
    const dealerStartingHand = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setPlayerHand(playerStartingHand);
    setDealerHand(dealerStartingHand);
    setIsGameOver(false);
    setMessage("");
    setResultClass(""); // Reset result class
    setTotalPoints((prev) => {
      const newTotal = prev - currentBet;
      console.log("Updated totalPoints:", newTotal);

      // After calculating, update both local state and Firebase
      setTotalPointsWithUpdate(newTotal); // Call the custom setter with the new total points
      return newTotal; // Update local state with the new total
    });
  }

  function handleHit() {
    if (isGameOver) return;

    const newPlayerHand = [...playerHand, drawCard()];
    setPlayerHand(newPlayerHand);

    if (calculateScore(newPlayerHand) > 21) {
      setMessage("Bust! You lose.");
      setResultClass(styles.redText);
      setIsGameOver(true);
    }
  }

  function handleStand() {
    if (isGameOver) return;

    let newDealerHand = [...dealerHand];
    while (calculateScore(newDealerHand) < 17) {
      newDealerHand.push(drawCard());
    }
    setDealerHand(newDealerHand);

    const dealerScore = calculateScore(newDealerHand);
    const playerScore = calculateScore(playerHand);

    if (dealerScore > 21 || playerScore > dealerScore) {
      setMessage("You win!");
      setTotalPointsWithUpdate(totalPoints + currentBet * 2);
      setResultClass(styles.greenText);
    } else if (playerScore === dealerScore) {
      setMessage("It's a tie!");
      setTotalPointsWithUpdate(totalPoints + currentBet);
    } else {
      setMessage("Dealer wins!");
      setResultClass(styles.redText);
    }

    setIsGameOver(true);
  }

  function handleBetChange(e) {
    setCurrentBet(parseInt(e.target.value));
  }

  function handleRestart() {
    initGame();
  }

  return (
    <div className={styles.blackjackGame}>
      <div className={styles.gameArea}>
        <div className={styles.dealerArea}>
          <h2>Dealer's Hand</h2>
          <div className={styles.cardArea}>
            {dealerHand.map((card, i) => (
              <span key={i}>
                {card.value}
                {card.suit}
              </span>
            ))}
          </div>
          <p className={styles.score}>Score: {calculateScore(dealerHand)}</p>
        </div>
        <div className={styles.playerArea}>
          <h2>Your Hand</h2>
          <div className={styles.cardArea}>
            {playerHand.map((card, i) => (
              <span key={i}>
                {card.value}
                {card.suit}
              </span>
            ))}
          </div>
          <p className={styles.score}>Score: {calculateScore(playerHand)}</p>
        </div>
      </div>
      <div className={styles.controls}>
        <h3>
          Total Points: <span>{totalPoints}</span>
        </h3>
        <label htmlFor="bet-amount">Bet Amount:</label>
        <input
          className={styles.betInput}
          type="number"
          id="bet-amount"
          value={currentBet}
          onChange={handleBetChange}
        />
        <div className={styles.buttonArea}>
          <button className={styles.hitButton} onClick={handleHit}>
            Hit
          </button>
          <button className={styles.standButton} onClick={handleStand}>
            Stand
          </button>
          <button className={styles.restartButton} onClick={handleRestart}>
            Restart
          </button>
        </div>
        <p className={resultClass}>{message}</p>
      </div>
    </div>
  );
}

export default Blackjack;

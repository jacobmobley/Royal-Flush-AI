import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Blackjack.module.css';
import FireBaseAuth from './FireBaseAuth';

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
  const { deckCount } = useParams(); // Get deck count from URL params
  const numDecks = parseInt(deckCount, 10) || 1; // Default to 1 deck if not specified

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
    setTotalPoints(newPoints); // Update local state
    curUser.updateCurrency(newPoints); // Update Firebase
  };

  useEffect(() => {
    const unsubscribe = curUser.getUnsubscribe();

    // Check for loading completion
    const checkLoadingStatus = setInterval(() => {
      if (!curUser.loading) {
        setLoading(false);
        setUserData(curUser.userData); // Sync with Firebase data
        const initialPoints = curUser.userData?.currency || 0;
        setTotalPoints(initialPoints);
        clearInterval(checkLoadingStatus);
        initGame(); // Start the game after loading
      }
    }, 100);

    return () => {
      unsubscribe();
      clearInterval(checkLoadingStatus);
    };
  }, [curUser]);

  if (loading) {
    return <div className={styles.loading}>Loading user data...</div>;
  }

  function initGame() {
    if (currentBet > totalPoints) {
      setMessage('Not enough points to place this bet.');
      setIsGameOver(true);
      return;
    }

    const newDeck = shuffleDeck(createDeck(numDecks));
    setDeck(newDeck);
    setPlayerHand([newDeck.pop(), newDeck.pop()]);
    setDealerHand([newDeck.pop(), newDeck.pop()]);
    setIsGameOver(false);
    setMessage('');
    setTotalPoints((prevPoints) => {
      const newTotal = prevPoints - currentBet;
      setTotalPointsWithUpdate(newTotal);
      return newTotal;
    });
  }

  function createDeck(numDecks) {
    const newDeck = [];
    for (let i = 0; i < numDecks; i++) {
      for (let suit of suits) {
        for (let value of values) {
          newDeck.push({ value, suit });
        }
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
        score += parseInt(card.value, 10);
      }
    });

    while (score > 21 && aceCount > 0) {
      score -= 10;
      aceCount--;
    }

    return score;
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

    const newDealerHand = [...dealerHand];
    while (calculateScore(newDealerHand) < 17) {
      newDealerHand.push(drawCard());
    }
    setDealerHand(newDealerHand);
    determineWinner(newDealerHand);
    setIsGameOver(true);
  }

  function determineWinner(dealerHand) {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    if (dealerScore > 21 || playerScore > dealerScore) {
      setMessage('You win!');
      setTotalPoints((prevPoints) => {
        const newTotal = prevPoints + currentBet * 2;
        setTotalPointsWithUpdate(newTotal);
        return newTotal;
      });
    } else if (dealerScore === playerScore) {
      setMessage("It's a tie!");
      setTotalPoints((prevPoints) => {
        const newTotal = prevPoints + currentBet;
        setTotalPointsWithUpdate(newTotal);
        return newTotal;
      });
    } else {
      setMessage('Dealer wins!');
    }
  }

  function handleBetChange(e) {
    setCurrentBet(parseInt(e.target.value, 10));
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
          <p className={styles.score}>Score: {isGameOver ? calculateScore(dealerHand) : '?'}</p>
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
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Blackjack;
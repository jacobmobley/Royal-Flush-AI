import React, { useState, useEffect } from 'react';
import styles from './Blackjack.module.css';

const suits = ['♠', '♣', '♦', '♥'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function Blackjack() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalPoints, setTotalPoints] = useState(1000);
  const [currentBet, setCurrentBet] = useState(100);
  const [message, setMessage] = useState('');
  const [resultClass, setResultClass] = useState(''); // New state for dynamic class

  useEffect(() => {
    initGame();
  }, []);

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

    hand.forEach(card => {
      if (['J', 'Q', 'K'].includes(card.value)) {
        score += 10;
      } else if (card.value === 'A') {
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

  function updateGameArea() {
    if (calculateScore(playerHand) > 21) {
      setMessage('Bust! You lose.');
      setIsGameOver(true);
      setResultClass(styles.redText); // Apply red text when player loses
    }
  }

  function initGame() {
    const newDeck = shuffleDeck(createDeck());
    const playerStartingHand = [newDeck.pop(), newDeck.pop()];
    const dealerStartingHand = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setPlayerHand(playerStartingHand);
    setDealerHand(dealerStartingHand);
    setIsGameOver(false);
    setMessage('');
    setResultClass(''); // Reset to default
    setTotalPoints(prev => prev - currentBet);
  }

  function handleHit() {
    if (isGameOver) return;

    const newPlayerHand = [...playerHand, drawCard()];
    setPlayerHand(newPlayerHand);
  
    const playerScore = calculateScore(newPlayerHand);
  
    if (playerScore > 21) {
      setMessage('Bust! You lose.');
      setResultClass(styles.redText);
      setIsGameOver(true);
      return;
    }
  
    updateGameArea();
  }

  function handleStand() {
    if (isGameOver) return;
  
    // Dealer draws until they reach a score of 17 or higher
    let newDealerHand = [...dealerHand];
    while (calculateScore(newDealerHand) < 17) {
      newDealerHand.push(drawCard());
    }
    setDealerHand(newDealerHand);
  
    // After updating dealer's hand, check for the winner
    const dealerScore = calculateScore(newDealerHand);
    const playerScore = calculateScore(playerHand);
  
    if (dealerScore > 21) {
      setMessage('Dealer busts! You win!');
      setTotalPoints(totalPoints + currentBet * 2);
      setResultClass(styles.greenText); // Player wins
    } else if (playerScore > dealerScore) {
      setMessage('You win!');
      setTotalPoints(totalPoints + currentBet * 2);
      setResultClass(styles.greenText); // Player wins
    } else if (playerScore === dealerScore) {
      setMessage('It\'s a tie!');
      setTotalPoints(totalPoints + currentBet); // Return bet amount to player
      setResultClass(''); // Neutral, no color
    } else {
      setMessage('Dealer wins!');
      setResultClass(styles.redText); // Dealer wins
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
          <div id="dealer-cards">
            {dealerHand.length > 0 ? (
              dealerHand.map((card, i) => <span key={i}>{card.value}{card.suit} </span>)
            ) : (
              <span>No cards</span>
            )}
          </div>
          <p className={styles.yellowText}>Score: {dealerHand.length > 0 ? calculateScore(dealerHand) : 0}</p>
        </div>
        <div className={styles.playerArea}>
          <h2>Your Hand</h2>
          <div id="player-cards">
            {playerHand.length > 0 ? (
              playerHand.map((card, i) => <span key={i}>{card.value}{card.suit} </span>)
            ) : (
              <span>No cards</span>
            )}
          </div>
          <p className={styles.yellowText}>Score: {playerHand.length > 0 ? calculateScore(playerHand) : 0}</p>
        </div>
      </div>
      <div className={styles.controls}>
        <h3>Total Points: <span>{totalPoints}</span></h3>
        <label htmlFor="bet-amount">Bet Amount:</label>
        <input type="number" id="bet-amount" value={currentBet} onChange={handleBetChange} />
        <button onClick={handleHit}>Hit</button>
        <button onClick={handleStand}>Stand</button>
        <button onClick={handleRestart}>Restart</button>
        <p className={resultClass}>{message}</p> {/* Dynamically apply red or green text */}
      </div>
    </div>
  );
}

export default Blackjack;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Blackjack.module.css";
import FireBaseAuth from "./FireBaseAuth";
import AchievementNotification from './popups/AchievementNotification';

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

function Blackjack() {
  function getCardImage(value, suit, i) {
    if ((i == 1 && !showDealerCard) || !showCard) {
      return back;
    }
    const key = `${suit}${value}`;
    return cardImageMap[key];
  }

  const { deckCount } = useParams();
  const numDecks = deckCount >= 1 ? parseInt(deckCount, 10) : 1;
  const [curUser] = useState(new FireBaseAuth());
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentBet, setCurrentBet] = useState(0);
  const [message, setMessage] = useState("");
  const [resultClass, setResultClass] = useState("");
  const [totalPoints, setTotalPoints] = useState(999999999999);
  const [showDealerCard, setShowDealerCard] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [achievement, setAchievement] = useState(false);
  const [achievementName, setAchievementName] = useState('Earn more than 10000 currency in one round of blackjack');

  const setTotalPointsWithUpdate = (newPoints) => {
    setTotalPoints(newPoints);
    curUser.updateCurrency(newPoints);
  };


  useEffect(() => {
    const unsubscribe = curUser.getUnsubscribe();

    const checkLoadingStatus = setInterval(() => {
      if (!curUser.loading) {
        setLoading(false);
        setUserData(curUser.userData);
        const initialPoints = curUser.userData?.currency || 0;
        const initialAchievement = curUser.userData?.achievements[achievementName] || '';
        setTotalPoints(initialPoints);
        setAchievement(initialAchievement);
        clearInterval(checkLoadingStatus);
        initGame();
      }
    }, 100);

    return () => {
      unsubscribe();
      clearInterval(checkLoadingStatus);
    };
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading user data...</div>;
  }

  function initGame() {
    console.log(numDecks);
    if (currentBet == 0) {
      setShowCard(false);
    } else {
      setShowCard(true);
    }
    if (currentBet > totalPoints) {
      setMessage("Not enough points to place this bet.");
      setIsGameOver(true);
      return;
    }
    const newDeck = shuffleDeck(createDeck(numDecks));
    setDeck(newDeck);
    setPlayerHand([newDeck.pop(), newDeck.pop()]);
    setDealerHand([newDeck.pop(), newDeck.pop()]);
    
    setIsGameOver(false);
    setMessage("");
    setTotalPoints((prevPoints) => {
      const newTotal = prevPoints - currentBet;
      setTotalPointsWithUpdate(newTotal);
      return newTotal;
    });
  }
  function createDeck(numDecks) {
    const newDeck = [];
    let c = 0;
    for (let i = 0; i < numDecks; i++) {
      for (let suit of suits) {
        for (let value of values) {
          c++;
          newDeck.push({ value, suit });
        }
      }
    }
    console.log('num cards: ' + c);
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
    if (deck.length === 0) return null;

    const card = deck.pop();
    setDeck([...deck]);
    return card;
  }

  function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;

    hand.forEach((card) => {
      if (["jack", "queen", "king"].includes(card.value)) {
        score += 10;
      } else if (card.value === "ace") {
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
      setIsGameOver(true);
    }
  }

  function handleStand() {
    setShowDealerCard(true);
    if (isGameOver) return;

    let newDealerHand = [...dealerHand];
    console.log(dealerHand);
    while (calculateScore(newDealerHand) < 17) {
      newDealerHand.push(drawCard());
    }

    setDealerHand(newDealerHand);
    const dealerScore = calculateScore(newDealerHand);
    const playerScore = calculateScore(playerHand);

    if (dealerScore > 21 || playerScore > dealerScore) {
      setMessage("You win!");
      if (currentBet * 2 > 10000 && !achievement) {
        setAchievement(true);
        curUser.completeAchievement(achievementName);
      }
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
    setCurrentBet(parseInt(e.target.value, 10));
  }

  function handleRestart() {
    setShowDealerCard(false);
    initGame();
  }

  return (
    <div className={styles.blackjackGame}>
      <div className={styles.blackjackTitle}>
        <h1>BLACKJACK</h1>
      </div>
      <div className={styles.gameArea}>
        <div className={styles.dealerArea}>
          <h2>Dealer's Hand</h2>
          <div className={styles.cardArea}>
            {dealerHand.map((card, i) => (
              <img
                key={i}
                src={getCardImage(card.value, card.suit, i)}
                alt={`${card.value} of ${card.suit}`}
                className={styles.cardImage}
              />
            ))}
          </div>
          <p className={styles.score}>
            Score: {isGameOver ? calculateScore(dealerHand) : "?"}
          </p>
        </div>
        <div className={styles.playerArea}>
          <h2>Your Hand</h2>
          <div className={styles.cardArea}>
            {playerHand.map((card, i) => (
              <img
                key={i}
                src={getCardImage(card.value, card.suit, 0)}
                alt={`${card.value} of ${card.suit}`}
                className={styles.cardImage}
              />
            ))}
          </div>
          <p className={styles.score}>Score: {calculateScore(playerHand)}</p>
        </div>
      </div>
      <div className={styles.controls}>
        <h3>
          Total Points: <span>{totalPoints}</span>
        </h3>
        <label htmlFor="bet-amount">Bet Amount: </label>
        <input
          className={styles.betInput}
          type="number"
          id="bet-amount"
          value={currentBet}
          onChange={handleBetChange}
        />
        <div className={styles.buttonArea}>
          <button
            className={styles.hitButton}
            onClick={handleHit}
            disabled={isGameOver}
          >
            Hit
          </button>
          <button
            className={styles.standButton}
            onClick={handleStand}
            disabled={isGameOver}
          >
            Stand
          </button>
          <button className={styles.restartButton} onClick={handleRestart}>
            Restart
          </button>
        </div>
        <p className={resultClass}>{message}</p>
      </div>
      {showCard && achievement && (
        <AchievementNotification
          achievementName={achievementName}
        />
      )}
    </div>
  );
}

export default Blackjack;

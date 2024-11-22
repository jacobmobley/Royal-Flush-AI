import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../context/GameContext";
import styles from "./PokerTable.module.css";

import back from "../../assets/cards/cardBack_red2.png";
import { getCardImage } from "../utils/cardImages";
import api from "../api";

const PokerTable = ({ username, gameState }) => {
  const {
    players,
    communityCards,
    pot,
    bigBlind,
    smallBlind,
    currentTurn,
    currentPlayerIndex,
    dealerIndex,
    readyPlayers,
  } = gameState;
  const [raiseAmount, setRaiseAmount] = useState(bigBlind); // Initialize to the big blind amount

  const playerIndex = players.findIndex((player) => player.username === username);

  useEffect(() => {
    if (currentTurn === "pre-flop" && playerIndex === currentPlayerIndex) {
      handleBlinds();
    }
  }, [currentTurn, dealerIndex, currentPlayerIndex]);

  const handleBlinds = async () => {
    // Small Blind: Dealer Index + 1
    const smallBlindIndex = (dealerIndex + 1) % players.length;
    // Big Blind: Dealer Index + 2
    const bigBlindIndex = (dealerIndex + 2) % players.length;

    try {
      if (playerIndex === smallBlindIndex) {
        const response = await api.sendAction("Raise", smallBlind, username);
        console.log("Small blind posted:", smallBlind, response);
      } else if (playerIndex === bigBlindIndex) {
        await api.sendAction("Raise", bigBlind, username);
        console.log("Big blind posted:", bigBlind);
      }
    } catch (error) {
      console.error("Error handling blinds:", error);
    }
  };

  // Function to signal readiness
  const handleReady = async () => {
    try {
      const response = await api.signalReady(username); // Signal readiness
      console.log("Player is ready:", response);
    } catch (error) {
      console.error("Failed to signal readiness:", error);
    }
  };

  const handleAction = async (action, amount = 0) => {
    try {
      const response = await api.sendAction(action, amount, username);
      console.log(`Action ${action} processed`, response);
    } catch (error) {
      console.error(`Failed to process action ${action}:`, error);
    }
  };

  // Function to calculate chip stacks for a given amount
  const getMinimumChips = (amount) => {
    const chipValues = [1000, 500, 100, 25, 5, 1];
    const chipColors = ["#FFD700", "#800080", "#333333", "#008000", "#FF0000", "#FFFFFF"];
    const chipLabels = ["$1000", "$500", "$100", "$25", "$5", "$1"];
    const result = [];

    chipValues.forEach((chipValue, index) => {
      const count = Math.floor(amount / chipValue);
      amount -= count * chipValue;
      if (count > 0) {
        result.push({ count, color: chipColors[index], label: chipLabels[index] });
      }
    });

    return result;
  };

  return (
    <div className={styles.pokerContainer}>
      {/* Current Turn Display */}
      <div className={styles.currentTurn}>
        <h2>{currentTurn.replace("-", " ").toUpperCase()}</h2>
      </div>

      {/* Poker Table */}
      <div className={styles.pokerTable}>
        {/* Pot Display */}
        <div className={styles.pot}>
          <div>Total Pot: ${pot}</div>
          <div className={styles.potChips}>
            {getMinimumChips(pot).map((chip, idx) => (
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

        {/* Community Cards */}
        <div className={styles.communityCards}>
          {communityCards.map((card, index) => (
            <div key={index} className={styles.card}>
              <img
                src={getCardImage(card.value, card.suit) || back}
                alt={`${card.value} of ${card.suit}`}
                className={styles.cardImage}
              />
            </div>
          ))}
        </div>

{/* Player Slots */}
{players.map((player, index) => {
          const isCurrentUser = player.username === username;
          const isCurrentTurn = index === currentPlayerIndex;

          return (
            <div
              key={index}
              className={`${styles.playerSlot} ${styles[`player${index + 1}`]} ${
                isCurrentUser ? styles.currentUser : ""
              } ${isCurrentTurn ? styles.playerAction : ""} ${
                isCurrentUser && isCurrentTurn ? styles.currentUserPlayerAction : ""
              }`}
            >
              <p>
                <strong>{player.username}</strong>
              </p>
              <p>Bankroll: ${player.chips}</p>
              <div className={styles.cards}>
                {isCurrentUser
                  ? player.hand.map((card, idx) => (
                      <img
                        key={idx}
                        src={getCardImage(card.value, card.suit) || back}
                        alt={`${card.value} of ${card.suit}`}
                        className={styles.cardImage}
                      />
                    ))
                  : player.hand.map((_, idx) => (
                      <img
                        key={idx}
                        src={back}
                        alt="Card back"
                        className={styles.cardImage}
                      />
                    ))}
              </div>
              <div className={styles.chips}>
                {getMinimumChips(player.chips).map((chip, idx) => (
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
          );
        })}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {currentTurn === "waiting-for-players" ? (
          <button className={styles.controlButton} onClick={handleReady}>
            Ready
          </button>
        ) : (
          <>
            <button
              className={styles.controlButton}
              onClick={() => handleAction("Check")}
              disabled={gameState.currentPlayerIndex !== playerIndex}
            >
              Check
            </button>
            <button
              className={styles.controlButton}
              onClick={() => handleAction("Call")}
              disabled={gameState.currentPlayerIndex !== playerIndex}
            >
              Call
            </button>
            <button
              className={styles.controlButton}
              onClick={() => handleAction("Raise", raiseAmount)}
              disabled={gameState.currentPlayerIndex !== playerIndex}
            >
              Raise
            </button>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min={bigBlind}
                max={players[playerIndex]?.chips || bigBlind}
                step={5}
                value={raiseAmount}
                onChange={(e) => setRaiseAmount(Number(e.target.value))}
                className={styles.slider}
              />
              <p>Raise Amount: ${raiseAmount}</p>
            </div>
            <button
              className={styles.controlButton}
              onClick={() => handleAction("Fold")}
              disabled={gameState.currentPlayerIndex !== playerIndex}
            >
              Fold
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PokerTable;

import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import styles from "./PokerTable.module.css";

import { getBuyIn } from "../../PokerSettings.js";
import { useNavigate } from "react-router-dom";
import gear from "../../assets/Settings.png";
import { Link } from "react-router-dom";
import Settings from "../../Settings";

import back from "../../assets/cards/cardBack_red2.png";
import { getCardImage } from "../utils/cardImages";

import funky from "../../assets/funky.mp3";
import chill from "../../assets/chill.mp3";
import relaxing from "../../assets/relaxing.mp3";
import click from "../../assets/click2.mp3";

const PokerTable = () => {
  const { gameState } = useContext(GameContext);

  if (!gameState) return <p>Loading game...</p>;

  const { players, communityCards, pot, currentPlayerIndex } = gameState;

  // Function to calculate chip stacks for a given amount
  const getMinimumChips = (amount) => {
    const chipValues = [1000, 500, 100, 25, 5, 1];
    const chipColors = [
      "#FFD700", // Gold
      "#800080", // Purple
      "#333333", // Black
      "#008000", // Green
      "#FF0000", // Red
      "#FFFFFF", // White
    ];
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

  const handleAction = (action) => {
    console.log(`Player action: ${action}`);
    // Handle action logic here (Check, Call, Raise, Fold)
  };

  return (
    <div className={styles.pokerContainer}>
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
        {players.map((player, index) => (
          <div
            key={index}
            className={`${styles.playerSlot} ${styles[`player${index + 1}`]} ${
              currentPlayerIndex === index ? styles.playerAction : ""
            }`}
          >
            <p>{player.name}</p>
            <p>Bankroll: ${player.chips}</p>
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
        ))}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.controlButton}
          onClick={() => handleAction("Check")}
        >
          Check
        </button>
        <button
          className={styles.controlButton}
          onClick={() => handleAction("Call")}
        >
          Call
        </button>
        <button
          className={styles.controlButton}
          onClick={() => handleAction("Raise")}
        >
          Raise
        </button>
        <button
          className={styles.controlButton}
          onClick={() => handleAction("Fold")}
        >
          Fold
        </button>
      </div>
    </div>
  );
};

export default PokerTable;
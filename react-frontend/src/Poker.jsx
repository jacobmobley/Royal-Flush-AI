import React, { useState, useEffect, useRef } from "react";
import styles from "./Poker.module.css";
import api from "./api";
import { getBuyIn } from "./PokerSettings.js";
import { useNavigate } from "react-router-dom";
import funky from "./assets/funky.mp3";
import chill from "./assets/chill.mp3";
import relaxing from "./assets/relaxing.mp3";
import click from "./assets/click.mp3";
import gear from "./assets/Settings.png";
import { Link } from "react-router-dom";
import Settings from "./Settings";

function Poker() {
  const navigate = useNavigate();

  const [showSettings, setShowSettings] = useState(false);

  const [potValue, setPotValue] = useState(1000);
  const [currentRaise, setCurrentRaise] = useState(0);
  const [flopCards, setFlopCards] = useState([]);
  const [playerHand, setPlayerHand] = useState(["?", "?"]); // User's hand as player 1
  const [curPlayer, setCurPlayer] = useState({
    name: "Your Hand",
    bankroll: 100,
    cards: playerHand,
  });
  const [aiPlayer, setAiPlayer] = useState({
    name: "AI Player",
    bankroll: 150,
    cards: ["?", "?"],
  });
  const [curAction, setCurAction] = useState(0);
  //0 for player 1 for ai;
  const [curBig, setCurBig] = useState(1);

  function getCardImage(value, suit, i) {
    if ((i == 1 && !showDealerCard) || !showCard) {
      return back;
    }
    const key = `${suit}${value}`;
    return cardImageMap[key];
  }

  const updatePlayerBankroll = (newValue) => {
    setCurPlayer((prevPlayer) => ({
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

  const playClickSound = () => {
    effectsRef.current.play().catch((error) => {
      console.error("Click sound play error:", error);
    });
  };

  const handleRaiseChange = (event) => {
    setCurrentRaise(Number(event.target.value));
  };

  const handleBetRaise = () => {
    playClickSound();
    setPotValue(potValue + currentRaise);
    updatePlayerBankroll(curPlayer.bankroll - currentRaise);
  };

  const handleNewGame = () => {
    setCurBig(curBig ^ 1);
    setCurAction(curBig ^ 1);
  };

  const handleNewturn = () => {
    setCurBig(curBig ^ 1);
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
    playClickSound();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    audioRef.current.addEventListener("ended", playNextTrack);

    return () => {
      audioRef.current.pause();
      audioRef.current.removeEventListener("ended", playNextTrack); // Clean up event listener
    };
  }, []);

  const playlist = [funky, chill, relaxing];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(
    Math.floor(Math.random() * playlist.length)
  ); // Start from random track

  const audioRef = useRef(new Audio(playlist[currentTrackIndex])); // Initialize with a random track
  const effectsRef = useRef(new Audio(click));

  const toggleSettings = () => {
    effectsRef.current.play().catch((error) => {
      console.error("Click sound play error:", error);
    });
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    // Ensure the audio source updates without autoplaying unexpectedly
    if (audioRef.current.src !== playlist[currentTrackIndex]) {
      audioRef.current.src = playlist[currentTrackIndex];
    }
  }, [currentTrackIndex]);

  const playNextTrack = () => {
    if (!audioRef.current.paused) {
      audioRef.current.pause();
    }
    const nextTrackIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextTrackIndex);
    audioRef.current.src = playlist[nextTrackIndex];
    audioRef.current
      .play()
      .catch((error) => console.error("Audio play error:", error));
  };

  const play = () => {
    // Play only if the audio is paused, to prevent overlapping sounds
    if (audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.error("Audio play blocked by the browser:", error);
      });
    }
  };

  return (
    <div className={styles.pokerContainer} onClick={play}>
      <div className={styles.pokerTable}>
        <div className={styles.pot}>
          <div className={styles.potHeader}>Total Pot</div>
          <div className={styles.potValue}>${potValue}</div>
        </div>

        <div className={styles.communityCards}>
          {flopCards.map((card, index) => (
            <div key={0} className={styles.card}>
              {card}
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
              {curPlayer.cards.map((card, idx) => (
                <div
                  key={idx}
                  className={card === "?" ? styles.faceDownCard : styles.card}
                >
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
              {aiPlayer.cards.map((card, idx) => (
                <div
                  key={idx}
                  className={card === "?" ? styles.faceDownCard : styles.card}
                >
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
        {curAction == 0 && (
          <input
            type="range"
            min="0"
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
          <button className={styles.controlButton} onClick={handleBetRaise}>
            Raise
          </button>
        )}
        {curAction == 0 && (
          <button className={styles.controlButton}>Check/Call</button>
        )}
        {curAction == 0 && (
          <button className={styles.controlButton}>Fold</button>
        )}
      </div>
      <img
        src={gear}
        alt="Settings Icon"
        className={`${styles.settings}`}
        onClick={toggleSettings}
      />
      {showSettings && (
        <div className={`${styles.modalOverlay}`}>
          <Settings
            toggleSettings={toggleSettings}
            audioRef={audioRef}
            effectsRef={effectsRef}
          />
        </div>
      )}
    </div>
  );
}

export default Poker;

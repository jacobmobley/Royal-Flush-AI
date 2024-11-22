import React, { useState, useEffect } from "react";
import styles from "./frontpage-styles.module.css"
import FireBaseAuth from "./FireBaseAuth";
import { auth, firestore_db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { setBuyIn } from "./PokerSettings.js"

function PokerInit() {
    const fbauth = new FireBaseAuth();
    const navigate = useNavigate();

    const [buyIn, setLocBuyIn] =  useState(100);
    const [maxCurrency, setMaxCurrency] = useState(null);
    const [gameCounter, setGameCounter] = useState(0);

    const handleSliderChange = (event) => {
        setLocBuyIn(event.target.value);
    }

      async function getCurrency() {
        const user = auth.currentUser;
        if (!user) {
            console.error("No user authenticated");
            return;
        }
        await fbauth.fetchUserData(user);
        return fbauth.userData['currency'];
      }

      useEffect(() => {
        // Fetch the maximum currency value dynamically
        const fetchMaxCurrency = async () => {
          const max = await getCurrency();
          setMaxCurrency(max); // Update the max currency state
        };
    
        fetchMaxCurrency();
      }, []);

      const handleStartGame = () => {
        setBuyIn(buyIn);

        navigate("/poker"); // Navigate to the poker game page
      };

      const handleBack = () => {
        navigate("/homepage");
      }
    
      // Display the settings

      if (maxCurrency > 100) {
        return (
            <div className = {styles.modal}>
              <div className={styles.pokerInitItem}>
                <h2>Select Buy In</h2>
              </div>
              <div>
                <label htmlFor="buyInSlider" className={styles.pokerInitItem}>Buy-In: {buyIn}</label>
                <input
                id="buyInSlider"
                type="range"
                min="100"
                max={maxCurrency}
                step="100"
                value={buyIn}
                onChange={handleSliderChange}
                className={styles.slider}
                />
              </div>
              <div>
                <button onClick={handleStartGame}>
                    Start Game
                </button>
                <button onClick={handleBack} className={styles.redButton}>
                    Back
                </button>
              </div>
            
            </div>
          );
      }
      else if (maxCurrency != null) {
        return (
            <div className = {styles.modal}>
              <div className={styles.pokerInitError}>
                <h2>You do not have enough money to play; you need at least 100 for the buy in.</h2>
                <button onClick={handleBack} className={styles.redButton}>
                    Back
                </button>
              </div>
            </div>
          );
      }

      
}

export default PokerInit;
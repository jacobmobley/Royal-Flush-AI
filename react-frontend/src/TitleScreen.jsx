import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore_db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./frontpage-styles.module.css";
import gear from "./assets/Settings.png";
import { Link } from "react-router-dom";
import Settings from "./Settings";

const TitleScreen = () => {
  
  const [userData, setUserData] = useState({ username: "", currency: 0, bio: "" });
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user) {
        try {
          // Reference to the user's document in Firestore
          const userDocRef = doc(firestore_db, "users", user.email);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            // Update user data state
            setUserData(docSnap.data());
            console.log(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false); // Set loading to false after data is fetched
        }
      } else {
        setLoading(false); // No user, set loading to false
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch the user data once the user is authenticated
        fetchUserData(user);
      } else {
        console.log("No user is signed in.");
        // Handle the case where there is no user logged in
        setUserData(null);
        setLoading(false); // No user, set loading to false
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show loading spinner or message while user data is being fetched
  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="container">
      {/* Show user info only when data is available */}
      <div className={styles.userInfo}>
        <span>{userData?.username}</span> |{" "}
        <span>Currency: {userData?.currency}</span>
      </div>
      <div>TITLE SCREEN</div>
      <div className={styles.pokerButtons}>
        <button type="poker" className={styles.Poker}>
          Texas Hold'em
        </button>
      </div>
      <div className={styles.gameButtons}>
        <Link
          to="/Blackjack"
          className={`${styles.button} ${styles.blackjack}`}
        >
          Blackjack
        </Link>
        <button type="minigame" className={styles.Roulette}>
          Roulette
        </button>
        <Link to="/PlinkoGame" className={`${styles.button} ${styles.plinko}`}>
          Plinko
        </Link>
      </div>
      <img
        src={gear}
        alt="Settings Icon"
        className={`${styles.settings}`}
        onClick={toggleSettings}
      />
      {showSettings && (
        <div className={`${styles.modalOverlay}`}>
          <Settings toggleSettings={toggleSettings} />
        </div>
      )}
    </div>
  );
};

export default TitleScreen;
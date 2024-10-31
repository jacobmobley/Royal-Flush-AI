import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore_db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./frontpage-styles.module.css";
import gear from "./assets/Settings.png";
import { Link } from "react-router-dom";
import Settings from "./Settings";
import logo from "./assets/RoyalFlushAILogo.png";
import funky from "./assets/funky.mp3"; // Import funky.mp3

const HomePage = () => {
  const images = [
    "./src/assets/avatars/bear.png",
    "./src/assets/avatars/cat.png",
    "./src/assets/avatars/chicken.png",
    "./src/assets/avatars/dog.png",
    "./src/assets/avatars/fox.png",
    "./src/assets/avatars/koala.png",
    "./src/assets/avatars/meerkat.png",
    "./src/assets/avatars/panda.png",
    "./src/assets/avatars/rabbit.png",
    "./src/assets/avatars/sea-lion.png",
  ];
  const [userData, setUserData] = useState({
    username: "",
    currency: 0,
    avatar: 0,
  });
  const [deckCount, setDeckCount] = useState(3); // Default to 1 deck
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");

  const audioRef = useRef(new Audio(funky));
  audioRef.current.loop = true;

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user) {
        try {
          const userDocRef = doc(firestore_db, "users", user.email);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
            setImage(images[docSnap.data().avatar]);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading user data...</div>;
  }
  const play = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.error("Audio play blocked by the browser:", error);
      });
    }
  };
  return (
    <div className="container" onClick={play}>
      <audio ref={audioRef} className={styles.backgroundMusic} loop>
        <source src={funky} type="audio/mpeg" />
      </audio>
      <div className={styles.userInfo}>
        <span>
          <img
            src={image}
            className={styles.profileImgTitlePage}
            alt="Avatar"
          />
        </span>
        <span>{userData?.username}</span> <span>|</span>
        <span>Currency: {userData?.currency}</span>
      </div>

      <div className={styles.menu}>
        <img src={logo} alt="Royal Flush AI Logo" className={styles.homeLogo} />
        <div className={styles.pokerButtons}>
          <Link to="/Poker" className={styles.poker}>
            Texas Hold'em
          </Link>
        </div>
        <div className={styles.gameButtons}>
          <Link
            to={`/blackjack/${deckCount}`}
            className={`${styles.button} ${styles.blackjack}`}
          >
            Blackjack
          </Link>
          <Link
            to="/RouletteE"
            className={`${styles.button} ${styles.roulette}`}
          >
            European Roulette
          </Link>
          <Link
            to="/RouletteA"
            className={`${styles.button} ${styles.roulette}`}
          >
            American Roulette
          </Link>
        </div>
        <label htmlFor="deck-count">Number of Decks: </label>
        <input
          type="number"
          id="deck-count"
          value={deckCount}
          min="1"
          onChange={(e) => setDeckCount(e.target.value)}
          className={styles.deckInput}
        />
      </div>
      <img
        src={gear}
        alt="Settings Icon"
        className={`${styles.settings}`}
        onClick={toggleSettings}
      />
      {showSettings && (
        <div className={`${styles.modalOverlay}`}>
          <Settings toggleSettings={toggleSettings} audioRef={audioRef} />
        </div>
      )}
    </div>
  );
};

export default HomePage;

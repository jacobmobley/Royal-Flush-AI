import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore_db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./frontpage-styles.module.css";
import gear from "./assets/Settings.png";
import { Link } from "react-router-dom";
import Settings from "./Settings";
import logo from "./assets/RoyalFlushAILogo.png";
import funky from "./assets/funky.mp3";
import chill from "./assets/chill.mp3";
import relaxing from "./assets/relaxing.mp3";

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
  const [deckCount, setDeckCount] = useState(3);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");

  const playlist = [funky, chill, relaxing];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(
    Math.floor(Math.random() * playlist.length)
  ); // Start from random track
  const audioRef = useRef(new Audio());

  const toggleSettings = () => setShowSettings(!showSettings);

  const playNextTrack = () => {
    const nextTrackIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextTrackIndex);
    audioRef.current.src = playlist[nextTrackIndex];
    audioRef.current
      .play()
      .catch((error) => console.error("Audio play error:", error));
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

    // Play the initial random track
    audioRef.current.src = playlist[currentTrackIndex];
    audioRef.current
      .play()
      .catch((error) => console.error("Audio play error:", error));

    // Event listener to play the next track when the current track ends
    audioRef.current.addEventListener("ended", playNextTrack);

    return () => {
      unsubscribe();
      audioRef.current.removeEventListener("ended", playNextTrack); // Clean up event listener
    };
  }, [currentTrackIndex]); // Re-run when currentTrackIndex changes

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
          <Link to="/pokerinit" className={styles.poker}>
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
        <div className={styles.deckCount}>
          <label className={styles.deckNumLabel} htmlFor="deck-count">
            Number of Decks:{" "}
          </label>
          <input
            type="number"
            id="deck-count"
            value={deckCount}
            min="1"
            onChange={(e) => setDeckCount(e.target.value)}
            className={styles.deckInput}
          />
        </div>
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

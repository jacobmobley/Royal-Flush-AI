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
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");

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

  return (
    <div className="container">
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
            to="/Blackjack"
            className={`${styles.button} ${styles.blackjack}`}
          >
            Blackjack
          </Link>
          <Link
            to="/Roulette"
            className={`${styles.button} ${styles.roulette}`}
          >
            Roulette
          </Link>
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
          <Settings toggleSettings={toggleSettings} />
        </div>
      )}
    </div>
  );
};

export default HomePage;

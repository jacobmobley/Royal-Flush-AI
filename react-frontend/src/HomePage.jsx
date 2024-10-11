import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore_db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./frontpage-styles.module.css";
import gear from "./assets/Settings.png";
import { Link } from "react-router-dom";
import Settings from "./Settings";
import logo from "./assets/RoyalFlushAILogo.png";

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
  const [loading, setLoading] = useState(true); // New loading state
  const [image, setImage] = useState("");

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

            setImage(images[docSnap.data().avatar]);
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
        <span>
          <img src={image} className={styles.profileImgTitlePage} />
        </span>
        <span>{userData?.username}</span> <span>|</span>
        <span>Currency: {userData?.currency}</span>
      </div>

      <div className={styles.menu}>
        <img src={logo} alt="Royal Flush AI Logo" className={styles.homeLogo} />
        <div className={styles.pokerButtons}>
          <button type="poker" className={styles.poker}>
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
          <Link
            to="/Roulette"
            className={`${styles.button} ${styles.roulette}`}
          >
            Roulette
          </Link>
          {/*<Link to="/PlinkoGame" className={`${styles.button} ${styles.plinko}`}>
          Plinko
        </Link>*/}
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

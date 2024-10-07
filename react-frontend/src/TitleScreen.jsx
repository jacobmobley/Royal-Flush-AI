import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore_db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./frontpage-styles.module.css";
import { useNavigate } from "react-router-dom";
import logo from "./assets/RoyalFlushAILogo.png";
import gear from "./assets/Settings.png";
import Settings from "./Settings";

const TitleScreen = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [userData, setUserData] = useState({ username: "", currency: 0 });
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      // Get the currently authenticated user
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        // Reference to the user's document in Firestore
        const userDocRef = doc(firestore_db, "users", user.email);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          // Update user data state
          setUserData(docSnap.data());
          console.log(docSnap.data());
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    
    <div className="container">
      <div className={styles.userInfo}>
        <span>{userData.username}</span> | <span>Currency: {userData.currency}</span>
      </div>
      <div>TITLE SCREEN</div>
      <img
        src={gear}
        alt="Settings Icon"
        className={`${styles.settings}`}
        onClick={toggleSettings}
      />
      {showSettings && (

        <div className={`${styles.modalOverlay}`}>
          <div className={`${styles.modal}`}>
            <Settings toggleSettings={toggleSettings} />
          </div>

        </div>
      )}
    </div>
  );
};

export default TitleScreen;

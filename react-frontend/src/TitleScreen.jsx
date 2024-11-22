import React, { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./frontpage-styles.module.css";
import logo from "./assets/RoyalFlushAILogo.png";
import funky from "./assets/funky.mp3";

const TitleScreen = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img
          src={logo}
          alt="Royal Flush AI Logo"
          className={`${styles.logo}`}
        />
      </div>
      <div className={styles.buttonContainer}>
        <h1>Royal Flush AI</h1>
        <Link
          to="/newplayer"
          className={`${styles.button} ${styles.newPlayer}`}
        >
          New Player? <br />
          Create a New Account
        </Link>
        <Link
          to="/returningplayer"
          className={`${styles.button} ${styles.returningPlayer}`}
        >
          Returning Player? <br />
          Sign into Existing Account
        </Link>
        {/* <Link to="/homepage" className={`${styles.button} ${styles.preview}`}>
          Preview Title Screen
        </Link> */}
      </div>
    </div>
  );
};

export default TitleScreen;

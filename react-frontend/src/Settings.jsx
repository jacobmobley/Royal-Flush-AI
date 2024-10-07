import React, { useState } from "react";
import styles from "./frontpage-styles.module.css";

const Settings = ({ toggleSettings }) => {
  const [selectedTab, setSelectedTab] = useState("Account Security");

  const renderContent = () => {
    switch (selectedTab) {
      case "Account Security":
        return <p>Here you can change your account security settings.</p>;
      case "Profile Appearance":
        return <p>Here you can change how your profile looks.</p>;
      case "Game Appearance":
        return <p>Customize the game's appearance here.</p>;
      case "Sound Settings":
        return <p>Adjust sound settings for the game.</p>;
      default:
        return <p>Select an option from the left.</p>;
    }
  };

  return (
    <div className={styles.bigSettings}>
      {/* Settings Title outside the white modal box */}
      <div className={styles.settingsTitle}>
        <h1>SETTINGS</h1>
      </div>

      {/* Container holding the side buttons and modal */}
      <div className={styles.settingsContainer}>
        {/* Side buttons outside the white modal */}
        <div className={styles.sideButtons}>
          <button onClick={() => setSelectedTab("Account Security")}>
            Account Security
          </button>
          <button onClick={() => setSelectedTab("Profile Appearance")}>
            Profile Appearance
          </button>
          <button onClick={() => setSelectedTab("Game Appearance")}>
            Game Appearance
          </button>
          <button onClick={() => setSelectedTab("Sound Settings")}>
            Sound
          </button>
        </div>

        {/* White modal content box */}
        <div className={styles.modal}>
          <button className={styles.closeButton} onClick={toggleSettings}>
            X
          </button>
          <h1>{selectedTab}</h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;

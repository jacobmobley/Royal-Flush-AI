import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import styles from "./frontpage-styles.module.css";
import { useNavigate } from "react-router-dom";
import logo from "./assets/RoyalFlushAILogo.png";

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
    <div className="big-settings">
      <div className="settings-title">
        <h1>SETTINGS</h1>
      </div>
      <div className="settings-container">
        <div className="side-buttons">
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
        <div className="modal">
          <button className="close-button" onClick={toggleSettings}>
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

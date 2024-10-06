import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./frontpage-styles.css";
import { useNavigate } from "react-router-dom";
import logo from "./assets/RoyalFlushAILogo.png";
import gear from "./assets/Settings.png";
import Settings from "./Settings";

const TitleScreen = () => {
  const [showSettings, setShowSettings] = useState(false);
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const navigate = useNavigate();
  return (
    <div className="container">
      <div>TITLE SCREEN</div>
      <img
        src={gear}
        alt="Settings Icon"
        className="settings"
        onClick={toggleSettings}
      />
      {showSettings && (
        <div className="modal-overlay">
          <div className="modal">
            <Settings toggleSettings={toggleSettings} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleScreen;

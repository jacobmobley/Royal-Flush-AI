import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./frontpage-styles.css";
import { useNavigate } from "react-router-dom";
import logo from "./assets/RoyalFlushAILogo.png";

const Settings = ({ toggleSettings }) => {
  return (
    <div>
      <h1>Settings</h1>
      <p>
        I have to implement account security, profile appearance, game
        appearance, and sound tabs but this is here for now
      </p>
      <button onClick={toggleSettings}>Close Settings</button>{" "}
      {/* Close button */}
    </div>
  );
};

export default Settings;

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./frontpage-styles.css";
import { useNavigate } from "react-router-dom";
import logo from "./assets/RoyalFlushAILogo.png";
import gear from "./assets/Settings.png";

const TitleScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="Container">
      <div>TITLE SCREEN</div>
      <img src={gear} alt="Settings Icon" className="settings" />
    </div>
  );
};

export default TitleScreen;

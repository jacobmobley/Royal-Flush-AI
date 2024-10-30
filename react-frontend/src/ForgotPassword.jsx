import React, { useState } from "react";
import {
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";
import styles from "./frontpage-styles.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "./assets/RoyalFlushAILogo.png";
import ResetPasswordPopup from "./popups/ResetPasswordPopup"

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({});



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    sendPasswordResetEmail(
      auth,
      formData.email
    )
      .then((userCredential) => {
        // Successful login

        // Redirect to the game page
        navigate("/returningplayer");
      })
      .catch((error) => {
        setMessage(error.message);
        setMessageStyle({ color: "red" });
        console.error("Error signing in:", error);
      });
  };

  return (
    <div className={`${styles.container} ${styles.secondContainer}`}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Royal Flush AI Logo" className={styles.logo} />
      </div>
      <div className={styles.formContainer}>
        <Link to="/returningplayer" className={`${styles.button} ${styles.backButton}`}>
          &#8592; Back
        </Link>
        <h1>Send Forgot Password Email</h1>
        <form id="passreset-form" onSubmit={handleSubmit}>
          <label htmlFor="email" className={styles.formLabel}>
            Email:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField}
          />

          <button className={styles.submitButton}>Send Email</button>
        </form>
      </div>
      {message && (
        <div id="message" style={{ display: "block", ...messageStyle }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;

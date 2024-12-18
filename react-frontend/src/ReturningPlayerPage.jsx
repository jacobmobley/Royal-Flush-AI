import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "./firebase";
import styles from "./frontpage-styles.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "./assets/RoyalFlushAILogo.png";
import ReCAPTCHA from "react-google-recaptcha";

const ReturningPlayerPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({});
  const [showResetPassPopup, setshowResetPassPopup] = useState(false);
  const [captchaState, setCaptchaState] = useState(false);

  const toggleResetPassPopup = () => {
    setshowResetPassPopup(!showResetPassPopup);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaState(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!captchaState) {
      setMessage("Please fill CAPTCHA");
      setMessageStyle({ color: "red" });
      return;
    }

    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Proceed with sign in after setting persistence
        return signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      })
      .then((userCredential) => {
        // Successful login
        setMessage("Sign-in successful!");
        setMessageStyle({ color: "green" });
        console.log("User signed in:", userCredential.user);

        // Redirect to the game page
        navigate("/homepage");
      })
      .catch((error) => {
        let errorMsg = "";
        switch (error.message) {
          case "auth/user-not-found":
            errorMsg = "No user found with this email.";
            break;
          case "auth/wrong-password":
            errorMsg = "Incorrect password.";
            break;
          default:
            errorMsg = error.message;
        }
        setMessage(errorMsg);
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
        <Link to="/" className={`${styles.button} ${styles.backButton}`}>
          &#8592; Back
        </Link>
        <h1>Log in to an Existing Account</h1>
        <form id="login-form" onSubmit={handleSubmit}>
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

          <label htmlFor="password" className={styles.formLabel}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className={styles.inputField}
          />

          <ReCAPTCHA
            sitekey="6LcbOYQqAAAAAOXWZCe1gh8EWZ17a_Iuk_giEogz"
            onChange={handleCaptchaChange}
          />

          {message && (
            <div id="message" className={styles.message}>
              {message}
            </div>
          )}

          <button className={styles.submitButton}>Sign In</button>
        </form>
        <Link
          to="/forgotpass"
          className={`${styles.button} ${styles.forgotpassButton}`}
        >
          Forgot Password
        </Link>
      </div>
    </div>
  );
};

export default ReturningPlayerPage;

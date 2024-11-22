import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore_db } from "./firebase";
import styles from "./frontpage-styles.module.css"; // Import CSS module
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "./assets/RoyalFlushAILogo.png";
import ReCAPTCHA from 'react-google-recaptcha'
import {
  query,
  doc,
  getDoc,
  setDoc,
  collection,
  where,
  getDocs,
} from "firebase/firestore";

// Check if the username is already taken
const isUsernameTaken = async (username) => {
  const q = query(
    collection(firestore_db, "users"),
    where("username", "==", username)
  );

  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};

const isEmailTaken = async (email) => {
  const q = doc(firestore_db, "users", email);

  const querySnapshot = await getDoc(q);

  return querySnapshot.exists();
};

const NewPlayerPage = () => {
  const [captchaState, setCaptchaState] = useState(false);
  const [achievements, setAchievements] = useState({
    'Earn more than 10000 currency in one round of blackjack': false,
    'Earn more than 50000 currency total in both American and European Roulette': false,
    'Get a Royal Flush in poker': false,
    'Beat the AI in 5 consecutive rounds in poker': false,
    'Play at least 10 games': false,
    'Lose all your currency in a game of poker': false,
  });
  const navigate = useNavigate();

  const handleCaptchaChange = (token) => {
    setCaptchaState(true);
  };

  // State for form data and messages
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaState) {
      setMessage("Please fill CAPTCHA");
      setMessageStyle({ color: "red" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageStyle({ color: "red" });
      return;
    }

    if (await isUsernameTaken(formData.username)) {
      setMessage("Username is already taken. Please choose another one.");
      setMessageStyle({ color: "red" });
      console.log(formData.username);
      return;
    }

    if (await isEmailTaken(formData.email)) {
      setMessage(
        "There already is an account associated with that email address."
      );
      setMessageStyle({ color: "red" });
      return;
    }

    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Signed in
        const userDocRef = doc(firestore_db, "users", formData.email);
        setDoc(userDocRef, {
          username: formData.username,
          currency: 5000,
          bio: "",
          avatar: 0,
          achievements: { ...achievements },
          pokerGameCounter: 0,
        });
        setMessage("Sign-up successful!");
        setMessageStyle({ color: "green" });
        console.log("User signed up:", userCredential.user);

        // Redirect to another page if needed
        navigate("/homepage");
      })
      .catch((error) => {
        setMessage(error.message);
        setMessageStyle({ color: "red" });
        console.error("Error signing up:", error);
      });
  };

  return (
    <div className={`${styles.container} ${styles.secondContainer}`}>
      {" "}
      {/* Apply CSS module styles */}
      <div className={`${styles.logoContainer}`}>
        <img src={logo} alt="Royal Flush AI Logo" className={styles.logo} />
      </div>
      <div className={`${styles.formContainer}`}>
        <Link to="/" className={`${styles.button} ${styles.backButton}`}>
          &#8592; Back
        </Link>
        <h1>Create a New Account</h1>
        <form id="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="username" className={styles.formLabel}>
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={formData.username}
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

          <label htmlFor="confirmPassword" className={styles.formLabel}>
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.inputField}
          />

          <label htmlFor="email" className={styles.formLabel}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField}
          />
          <ReCAPTCHA
            sitekey="6LcbOYQqAAAAAOXWZCe1gh8EWZ17a_Iuk_giEogz"
            onChange={handleCaptchaChange}
          />

          <button type="submit" className={`${styles.submitButton}`}>
            Let’s Go!
          </button>
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

export default NewPlayerPage;

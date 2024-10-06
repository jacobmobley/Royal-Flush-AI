import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./frontpage-styles.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "./assets/RoyalFlushAILogo.png";

const ReturningPlayerPage = () => {
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

    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Successful login
        setMessage("Sign-in successful!");
        setMessageStyle({ color: "green" });
        console.log("User signed in:", userCredential.user);

        // Redirect to the game page
        navigate("/game");
      })
      .catch((error) => {
        let errorMsg = "";
        switch (error.code) {
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
    <div className="container">
      <div className="logo-container">
        <img src={logo} alt="Royal Flush AI Logo" className="logo" />
      </div>
      <div className="form-container">
        {/* <button type="back" className="back-button"></button> */}
        <Link to="/" className="button back-button">
          &#8592; Back
        </Link>
        <h1>Log in to an Existing Account</h1>
        <form id="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Username:</label>
          <input
            type="text"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="submit-button">
            Sign In
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

export default ReturningPlayerPage;

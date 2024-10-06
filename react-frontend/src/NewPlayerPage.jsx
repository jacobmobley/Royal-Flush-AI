import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./frontpage-styles.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "./assets/RoyalFlushAILogo.png";

const NewPlayerPage = () => {
  const navigate = useNavigate();

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
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageStyle({ color: "red" });
      return;
    }
    console.log(auth);

    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Signed in
        setMessage("Sign-up successful!");
        setMessageStyle({ color: "green" });
        console.log("User signed up:", userCredential.user);

        // Redirect to another page if needed
        // navigate('/dashboard');
      })
      .catch((error) => {
        setMessage(error.message);
        setMessageStyle({ color: "red" });
        console.error("Error signing up:", error);
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
        <h1>Create a New Account</h1>
        <form id="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={formData.username}
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

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <button type="submit" className="submit-button">
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

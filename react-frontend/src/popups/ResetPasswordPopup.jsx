import React, { useState } from "react";
import styles from "../frontpage-styles.module.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore_db, auth } from "../firebase";

const ResetPasswordPopup = ({ toggleResetPassPopup, onSubmit }) => {

  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({});

  const changePassword = async (newPassword, confirmPassword) => {
    sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent!
    // ..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
  } 
  
  
  const [formData, setFormData] = useState({
    email: "",
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault(); 

      await changePassword(formData.email);

      onSubmit();
    }
    catch (error) {
      setMessage("Error updating Password: ", error);
      setMessageStyle({ color: "red" });
    }

  }


    return (
      <div>
          <div>
            <div>
              <div className={styles.modal}>
                <button className={styles.closeButton} onClick={toggleResetPassPopup}>
                    X
                </button>
                <br></br>
                <form id="signup-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter new password:"
                    value={formData.password}
                    required
                    onChange={handleChange}
                />
                <br></br>
                <button type="submit">
                  Submit
                </button>
                <div id="message" style={{ display: "block", ...messageStyle }}>
                  {message}
                </div>
                </form>
                </div>
            </div>
          </div>
      </div>
    );
  };

export default ResetPasswordPopup;
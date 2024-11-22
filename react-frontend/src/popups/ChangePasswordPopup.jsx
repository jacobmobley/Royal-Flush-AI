import React, { useState } from "react";
import styles from "../frontpage-styles.module.css";
import { updatePassword, reauthenticateWithCredential, updateEmail, sendEmailVerification } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore_db, auth } from "../firebase";

const ChangePasswordPopup = ({ togglePasswordPopup, onSubmit }) => {

  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({});

  const changePassword = async (newPassword, confirmPassword) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in.");
    }
    if (newPassword != confirmPassword) {
      throw new Error("Passwords dont match.");
    }
    updatePassword(auth.currentUser, newPassword).then(() => {
      togglePasswordPopup();
    }).catch((error) => {
      setMessage("Error updating Password: ", error);
      setMessageStyle({ color: "red" });
    });
  } 
  
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault(); 

      await changePassword(formData.password, formData.confirmPassword);

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
                <button className={styles.closeButton} onClick={togglePasswordPopup}>
                    X
                </button>
                <br></br>
                <form id="signup-form" onSubmit={handleSubmit}>
               <input
                    type="password"
                    name="password"
                    placeholder="Enter new password:"
                    value={formData.password}
                    required
                    onChange={handleChange}
                />
                <input
                    type="Password"
                    name="confirmPassword"
                    placeholder="Confirm password:"
                    value={formData.confirmPassword}
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

export default ChangePasswordPopup;
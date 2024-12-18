import React, { useState } from "react";
import styles from "../frontpage-styles.module.css";
import {
  EmailAuthProvider,
  updateEmail,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore_db, auth } from "../firebase";

const ChangeUsernamePopup = ({ toggleUsernamePopup, onSubmit }) => {
  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({});

  const changeUsername = async (newUsername, password) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user is currently signed in.");
      }
      const email = user.email;
      await changeDocUsername(email, newUsername);
    } catch (error) {
        console.log("Error:", error);
        return;
    }
  };

  const changeDocUsername = async (email, newUsername) => {
    try {
      const q = doc(firestore_db, "users", email);

      setDoc(
        q,
        {
          username: newUsername,
        },
        { merge: true }
      );
    } catch (error) {
      console.log("Error: username not changed", error);
    }
  };
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

        await changeUsername(formData.username, formData.password);

        onSubmit();
    }
    catch (error) {
        setMessage("Error updating username");
        setMessageStyle({ color: "red" });
    }
  }


  return (
    <div>
      <div>
        <div>
          <div className={styles.modal}>
            <button
              className={`${styles.closeButton}`}
              onClick={toggleUsernamePopup}
            >
              X
            </button>
            <br></br>
            <form
              className={"styles.customBio"}
              id="signup-form"
              onSubmit={handleSubmit}
            >
              <input
                type="username"
                name="username"
                placeholder="Enter new username:"
                value={formData.username}
                required
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Enter current password:"
                value={formData.password}
                required
                onChange={handleChange}
              />
              <br></br>
              <button className={styles.submit}>Submit</button>
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

export default ChangeUsernamePopup;

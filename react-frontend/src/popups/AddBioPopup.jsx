import React, { useState } from "react";
import styles from "../frontpage-styles.module.css";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore_db, auth } from "../firebase";

const AddBioPopup = ({ toggleBioPopup, onSubmit }) => {
  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({});

  const changeDocBio = async (email, newBio) => {
    try {
      const q = doc(firestore_db, "users", email);

      setDoc(
        q,
        {
          bio: newBio,
        },
        { merge: true }
      );
      console.log(newBio);
    } catch (error) {
      console.log("Error: bio not changed", error);
    }
  };
  const [formData, setFormData] = useState({
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      setMessage("User not authenticated.\n");
      setMessageStyle({ color: "red" });
      return;
    }

    if (formData.bio.length > 400) {
      setMessage("Bio cannot exceed 400 characters.\n");
      setMessageStyle({ color: "red" });
      return;
    }

    const profanity_arr = [
      "fuck",
      "shit",
      "dick",
      "pussy",
      "anus",
      "nigga",
      "nigger",
      "faggot",
      "bitch",
      "anal",
      "kill",
      "die",
    ];

    for (let i = 0; i < profanity_arr.length; i++) {
      if (formData.bio.includes(profanity_arr[i])) {
        setMessage("Bio cannot contain profanity.\n");
        setMessageStyle({ color: "red" });
        return;
      }
    }

    await changeDocBio(user.email, formData.bio);

    toggleBioPopup();

    onSubmit();
  };

  return (
    <div>
      <div>
        <div>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={toggleBioPopup}>
              X
            </button>
            <br></br>
            <form id="signup-form" onSubmit={handleSubmit}>
              <textarea
                className={styles.customBio}
                style={{ height: 100 }}
                type="bio"
                name="bio"
                placeholder="Enter bio:"
                value={formData.bio}
                required
                onChange={handleChange}
              />
              <br></br>
              <button type="submit">Submit</button>
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

export default AddBioPopup;

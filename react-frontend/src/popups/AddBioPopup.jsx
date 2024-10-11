import React, { useState } from "react";
import styles from "../frontpage-styles.module.css";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, sendEmailVerification } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore_db, auth } from "../firebase";

const AddBioPopup = ({ toggleBioPopup }) => {

  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({});

//   const changeUsername = async (newBio, password) => {
//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         throw new Error("No user is currently signed in.");
//       }
//       const email = user.email;
//       const credential = EmailAuthProvider.credential(email, password);

//       await changeDocUsername(email, newBio);
  
//       await reauthenticateWithCredential(user, credential);
  
      
//     } catch (error) {
//       setMessage("Error updating username: ", error);
//       setMessageStyle({ color: "red" });
//     }
      
//   } 
  
  const changeDocBio = async (email, newBio) => {
    try {
      const q = doc(firestore_db, "users", email);

      setDoc(q, {
        bio: newBio,
      }, { merge: true });
      
    }
    catch (error) {
      console.log("Error: username not changed", error);
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

    await changeDocBio(user.email, formData.bio);

    toggleBioPopup();
  }


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
                <textarea style = {{ height : 100 }}
                    type="bio"
                    name="bio"
                    placeholder="Enter bio:"
                    value={formData.bio}
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

export default AddBioPopup;
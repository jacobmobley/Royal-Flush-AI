import React, { useState } from "react";
import styles from "../frontpage-styles.module.css";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, sendEmailVerification } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore_db, auth } from "../firebase";

const ChangeEmailPopup = ({ toggleEmailPopup }) => {

  const changeEmail = async (newEmail, password) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user is currently signed in.");
      }
      const oldEmail = user.email;
      const credential = EmailAuthProvider.credential(oldEmail, password);
  
      await reauthenticateWithCredential(user, credential);

      await sendEmailVerification(user);
  
      await updateEmail(user, newEmail);
  
      await changeDocumentId(oldEmail, newEmail);
    } catch (error) {
      console.error("Error updating email: ", error);
    }
      
  } 
  
  const changeDocumentId = async (oldEmail, newEmail) => {
    try {
      // Reference to the original document
      const oldDocRef = doc(firestore_db, "users", oldEmail);
      
      // Fetch the original document's data
      const oldDocSnap = await getDoc(oldDocRef);
  
      if (oldDocSnap.exists()) {
        // Get the data of the original document
        const docData = oldDocSnap.data();
  
        // Create a new document with the new ID and the same data
        const newDocRef = doc(firestore_db, "users", newEmail);
        await setDoc(newDocRef, docData);
  
        // Optionally delete the original document after the new one is created
        await deleteDoc(oldDocRef);
  
        console.log(`Document ID changed from ${oldEmail} to ${newEmail}`);
      } else {
        console.log("Original document does not exist.");
      }
    } catch (error) {
      console.error("Error changing document ID:", error);
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
    e.preventDefault();

    changeEmail(formData.email, formData.password);
  }


    return (
      <div>
          <div>
            <div>
              <div className={styles.modal}>
                <button className={styles.closeButton} onClick={toggleEmailPopup}>
                    X
                </button>
                <br></br>
                <form id="signup-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter new email:"
                    value={formData.email}
                    required
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter password:"
                    value={formData.password}
                    required
                    onChange={handleChange}
                />
                <br></br>
                <button type="submit">
                  Submit
                </button>
                </form>
                </div>
            </div>
          </div>
      </div>
    );
  };

export default ChangeEmailPopup;
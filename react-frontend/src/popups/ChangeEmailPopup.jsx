import React, { useState } from "react";
import styles from "../frontpage-styles.module.css";

const changeEmail = async () => {
    const user = auth.currentUser;

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const ChangeEmailPopup = ({ toggleEmailPopup }) => {
    return (
      <div>
          <div>
            <div>
              <div className={styles.modal}>
                <button className={styles.closeButon} onClick={toggleEmailPopup}>
                    X
                </button>
                <br></br>
                <input
                    type="text"
                    placeholder="Enter new email:"
                />
                <input
                    type="text"
                    placeholder="Enter password:"
                />
                </div>
            </div>
          </div>
      </div>
    );
  };

export default ChangeEmailPopup;
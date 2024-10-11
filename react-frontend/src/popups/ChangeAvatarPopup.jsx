import React, { useState } from "react";
import styles from "../frontpage-styles.module.css";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, sendEmailVerification } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore_db, auth } from "../firebase";

const ChangeAvatarPopup = ({ toggleAvatarPopup, onSubmit }) => {

    const images = [
        './src/assets/avatars/bear.png', 
        './src/assets/avatars/cat.png', 
        './src/assets/avatars/chicken.png',
        './src/assets/avatars/dog.png',
        './src/assets/avatars/fox.png',
        './src/assets/avatars/koala.png',
        './src/assets/avatars/meerkat.png',
        './src/assets/avatars/panda.png',
        './src/assets/avatars/rabbit.png',
        './src/assets/avatars/sea-lion.png',        
    ];

    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [showSubmitButton, setShowSubmitButton] = useState(false);

    // Handle image click
    const handleClick = (index) => {
      setSelectedImageIndex(index); // Set the clicked image index
      setShowSubmitButton(true);
    };

    const setAvatarImage = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.log("No user signed in");
            return;
        }
        const d = doc(firestore_db, 'users', user.email);
        
            setDoc(d, { avatar: selectedImageIndex }, { merge: true });

        onSubmit();
    }
  
    return (
    <div className={styles.modalGrid}>
    <div>
        <button className={styles.closeButton} onClick={toggleAvatarPopup}>
            X
          </button>
      <div className={styles["gallery-grid"]}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Gallery image ${index + 1}`}
            className={styles["gallery-image"]}
            onClick={() => handleClick(index)} // Click event handler
            style={{
              outline: selectedImageIndex === index ? '5px solid green' : 'none', // Green outline if selected
            }}
          />
        ))}
      </div>
      </div>
      <div>
      {showSubmitButton && (
        <div>
          <button onClick={setAvatarImage}>Set</button>
        </div>
      )}
      </div>
      </div>
    );
  };

export default ChangeAvatarPopup; 
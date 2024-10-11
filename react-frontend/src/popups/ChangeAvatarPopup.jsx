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

    const [selectedImage, setSelectedImage] = useState(null);

    const handleClick = (image) => {
      
    };
  
    const closeModal = () => {
      setSelectedImage(null); // Close the enlarged image modal
    };
  
    return (
    <div className={styles.modal}>
            <button className={styles.closeButton} onClick={toggleAvatarPopup
            }>
                X
            </button>
            <br></br>
      <div>
        <div className={styles['gallery-grid']}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Gallery image ${index + 1}`}
              className={styles['gallery-image']}
              onClick={() => handleClick(image)}
            />
          ))}
        </div>
  
        {/* Modal for showing the clicked image */}
        {selectedImage && (
          <div className="modal" onClick={closeModal}>
            <span className="close">&times;</span>
            <img className="modal-content" src={selectedImage} alt="Enlarged" />
          </div>
        )}
      </div>
      </div>
    );
  };

export default ChangeAvatarPopup; 
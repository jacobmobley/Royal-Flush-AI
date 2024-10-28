import React, { useState, useEffect } from "react";
import FireBaseAuth from "./FireBaseAuth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore_db, auth } from "./firebase";
import ChangeUsernamePopup from "./popups/ChangeUsernamePopup";
import ChangePasswordPopup from "./popups/ChangePasswordPopup";
import AddBioPopup from "./popups/AddBioPopup";
import ChangeAvatarPopup from "./popups/ChangeAvatarPopup";
import styles from "./frontpage-styles.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Settings = ({ toggleSettings }) => {
  const [selectedTab, setSelectedTab] = useState("Account Security");
  const [bio, setBio] = useState(null);
  const [showUsernamePopup, setShowUsernamePopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showBioPopup, setShowBioPopup] = useState(false);
  const [showBioMessage, setShowBioMessage] = useState(false);
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);

  const onSubmit = async () => {
    await sleep(500);
    window.location.reload();
  };

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const toggleUsernamePopup = () => {
    setShowUsernamePopup(!showUsernamePopup);
  };

  const togglePasswordPopup = () => {
    setShowPasswordPopup(!showPasswordPopup);
  };

  const toggleBioPopup = async () => {
    setShowBioPopup(!showBioPopup);
  };

  const toggleAvatarPopup = async () => {
    setShowAvatarPopup(!showAvatarPopup);
  };

  const getBio = async () => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }
    const q = doc(firestore_db, "users", user.email); // Use user.email

    const docSnap = await getDoc(q);

    if (docSnap.exists()) {
      // Access the 'bio' field from the document
      const bioData = docSnap.data().bio;
      console.log("Bio:", bioData);
      setBio(bioData);
      setShowBioMessage(true);
    } else {
      console.log("No such document!");
      setShowBioMessage(false);
    }
  };

  // Fetch the bio when "Profile Appearance" tab is selected
  useEffect(() => {
    if (selectedTab === "Profile Appearance") {
      getBio();
    }
  }, [selectedTab]);

  const renderContent = () => {
    switch (selectedTab) {
      case "Account Security":
        return (
          <>
            <p>Here you can change your account security settings.</p>
            <br></br>
            <div className={styles.accountButtons}>
              <button className={styles.change} onClick={toggleUsernamePopup}>
                Change Username
              </button>

              {showUsernamePopup && (
                <div className={`${styles.modalOverlay}`}>
                  <ChangeUsernamePopup
                    toggleUsernamePopup={toggleUsernamePopup}
                    onSubmit={onSubmit}
                  />
                </div>
              )}
              <button onClick={togglePasswordPopup}>Change Password</button>
              {showPasswordPopup && (
                <div className={`${styles.modalOverlay}`}>
                  <ChangePasswordPopup
                    togglePasswordPopup={togglePasswordPopup}
                    onSubmit={onSubmit}
                  />
                </div>
              )}
              <Link to="/" className={`${styles.button} ${styles.change} `}>
                &#8592; Logout
              </Link>
            </div>
          </>
        );
      case "Profile Appearance":
        return (
          <>
            <p>Here you can change how your profile looks.</p>
            <br />
            {showBioMessage && bio && (
              <>
                <div>
                  <p>
                    <strong>Current Bio:</strong> {bio}
                  </p>
                </div>
                <br></br>
              </>
            )}
            <button className={styles.change} onClick={toggleBioPopup}>
              Add or Change Bio
            </button>
            <br></br> <br></br>
            {showBioPopup && (
              <div className={`${styles.modalOverlay}`}>
                <AddBioPopup
                  toggleBioPopup={toggleBioPopup}
                  onSubmit={onSubmit}
                />
              </div>
            )}
            <button className={styles.change} onClick={toggleAvatarPopup}>
              Add or Change Avatar
            </button>
            <br></br> <br></br>
            {showAvatarPopup && (
              <div className={`${styles.modalOverlay}`}>
                <ChangeAvatarPopup
                  toggleAvatarPopup={toggleAvatarPopup}
                  onSubmit={onSubmit}
                />
              </div>
            )}
            {/* Add a popup? or not needed? */}
          </>
        );
      case "Game Appearance":
        return <p>Customize the game's appearance here.</p>;
      case "Sound Settings":
        return (
          <div className={styles.volumeControl}>
            <p>Adjust sound settings for the game.</p>
            {/* <label htmlFor="volume-slider">Volume: {volume}%</label> */}
            <input
              type="range"
              id="volume-slider"
              min="0"
              max="100"
              // value={volume}
              // onChange={handleVolumeChange}
              style={{ width: "100%" }}
            />
          </div>
        );
      default:
        return <p>Select an option from the left.</p>;
    }
  };

  return (
    <div className={styles.bigSettings}>
      {/* Settings Title outside the white modal box */}
      <div className={styles.settingsTitle}>
        <h1>SETTINGS</h1>
        <button className={styles.closeButton} onClick={toggleSettings}>
          X
        </button>
      </div>

      {/* Container holding the side buttons and modal */}
      <div className={styles.settingsContainer}>
        {/* Side buttons outside the white modal */}
        <div className={styles.sideButtons}>
          <button
            className={styles.accountSecurity}
            onClick={() => setSelectedTab("Account Security")}
          >
            Account Security
          </button>
          <button
            className={styles.profileAppearance}
            onClick={() => setSelectedTab("Profile Appearance")}
          >
            Profile Appearance
          </button>
          <button
            className={styles.gameAppearance}
            onClick={() => setSelectedTab("Game Appearance")}
          >
            Game Appearance
          </button>
          <button
            className={styles.soundSettings}
            onClick={() => setSelectedTab("Sound Settings")}
          >
            Sound
          </button>
        </div>

        {/* White modal content box */}
        <div className={styles.modal}>
          <h1>{selectedTab}</h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;

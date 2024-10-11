import React, { useState, useEffect } from "react";
import FireBaseAuth from './FireBaseAuth';
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore_db, auth } from "./firebase";
import styles from "./frontpage-styles.module.css";
import ChangeUsernamePopup from "./popups/ChangeUsernamePopup";
import AddBioPopup from "./popups/AddBioPopup";

const Settings = ({ toggleSettings }) => {
  const [selectedTab, setSelectedTab] = useState("Account Security");
  const [bio, setBio] = useState(null);
  const [showUsernamePopup, setShowUsernamePopup] = useState(false);
  const [showBioPopup, setShowBioPopup] = useState(false);
  const [showBioMessage, setShowBioMessage] = useState(false);

  const onSubmit = async () => {
    await sleep(500);
    window.location.reload();
  }

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const toggleUsernamePopup = () => {
    setShowUsernamePopup(!showUsernamePopup);
  };

  const toggleBioPopup = async () => {
    setShowBioPopup(!showBioPopup);
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
            <button onClick={toggleUsernamePopup}>Change Username</button>
            {showUsernamePopup && (
              <div className={`${styles.modalOverlay}`}>
                <ChangeUsernamePopup toggleUsernamePopup={toggleUsernamePopup} onSubmit={onSubmit}/>
              </div>
            )}
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
                <p><strong>Current Bio:</strong> {bio}</p>
              </div>
              <br></br>
              </>
            )}
            <button onClick={toggleBioPopup}>Add or Change Bio</button>
            <br></br> <br></br>
            {showBioPopup && (
              <div className={`${styles.modalOverlay}`}>
                <AddBioPopup toggleBioPopup={toggleBioPopup} onSubmit={onSubmit} />
              </div>
            )}
            <button>Add or Change Avatar</button>{" "}
            {/* Add a popup? or not needed? */}
          </>
        );
      case "Game Appearance":
        return <p>Customize the game's appearance here.</p>;
      case "Sound Settings":
        return <p>Adjust sound settings for the game.</p>;
      default:
        return <p>Select an option from the left.</p>;
    }
  };

  return (
    <div className={styles.bigSettings}>
      {/* Settings Title outside the white modal box */}
      <div className={styles.settingsTitle}>
        <h1>SETTINGS</h1>
      </div>

      {/* Container holding the side buttons and modal */}
      <div className={styles.settingsContainer}>
        {/* Side buttons outside the white modal */}
        <div className={styles.sideButtons}>
          <button onClick={() => setSelectedTab("Account Security")}>
            Account Security
          </button>
          <button onClick={() => setSelectedTab("Profile Appearance")}>
            Profile Appearance
          </button>
          <button onClick={() => setSelectedTab("Game Appearance")}>
            Game Appearance
          </button>
          <button onClick={() => setSelectedTab("Sound Settings")}>
            Sound
          </button>
        </div>

        {/* White modal content box */}
        <div className={styles.modal}>
          <button className={styles.closeButton} onClick={toggleSettings}>
            X
          </button>
          <h1>{selectedTab}</h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;

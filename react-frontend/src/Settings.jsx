import React, { useState } from "react";
import styles from "./frontpage-styles.module.css";

const Settings = ({ toggleSettings }) => {
  const [selectedTab, setSelectedTab] = useState("Account Security");
  const [volume, setVolume] = useState(50); // State for volume slider

  const handleVolumeChange = (e) => {
    setVolume(e.target.value); // Update volume state when slider moves
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "Account Security":
        return (
          <div>
            <p>Here you can change your account security settings.</p>
            <form id="account-security-form">
              <label htmlFor="password">Current Password:</label>
              <input type="password" id="password" name="password" required />

              <label htmlFor="username">Change Username:</label>
              <input type="text" id="username" name="username" required />

              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                required
              />

              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
              />

              <button type="submit" className={styles.submitButton}>
                Save
              </button>
            </form>
          </div>
        );
      case "Profile Appearance":
        return (
          <div>
            <p>Here you can change how your profile looks.</p>
            <form id="profile-settings">
              <label htmlFor="bio">Enter Your Bio:</label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                cols="50"
                placeholder="Write your bio here..."
                required
              ></textarea>

              <label htmlFor="avatar">Upload Avatar (Image):</label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                required
              />

              <button type="submit">Submit</button>
            </form>
          </div>
        );
      case "Game Appearance":
        return <p>Customize the game's appearance here.</p>;
      case "Sound Settings":
        return (
          <div>
            <p>Adjust sound settings for the game.</p>
            <label htmlFor="volume">Volume:</label>
            <input
              type="range"
              id="volume"
              name="volume"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
            <span>{volume}%</span>
          </div>
        );
      default:
        return <p>Select an option from the left.</p>;
    }
  };

  return (
    <div className={styles.bigSettings}>
      <div className={styles.settingsTitle}>
        <h1>SETTINGS</h1>
      </div>

      <div className={styles.settingsContainer}>
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

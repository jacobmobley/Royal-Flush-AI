import React from 'react';
import './frontpage-styles.css';  // Assuming you have this CSS file

const HomePage = () => {
  return (
    <div className="container">
      <div className="logo-container">
        <img
          src="RoyalFlushAILogo.png"
          alt="Royal Flush AI Logo"
          className="logo"
        />
      </div>
      <div className="button-container">
        <h1>Royal Flush AI</h1>
        {/* Link for New Player page */}
        <a href="newplayer.html" className="button new-player">
          New Player? <br />
          Create a New Account
        </a>
        {/* Link for Returning Player page */}
        <a href="returningplayer.html" className="button returning-player">
          Returning Player? <br />
          Sign into Existing Account
        </a>
      </div>
    </div>
  );
};

export default HomePage;
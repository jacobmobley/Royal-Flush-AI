import React from 'react';
import './frontpage-styles.css';
import logo from './assets/RoyalFlushAILogo.png';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container">
      <div className="logo-container">
        <img src={logo} alt="Royal Flush AI Logo" className="logo" />
      </div>
      <div className="button-container">
        <h1>Royal Flush AI</h1>
        {/* Link for New Player page */}
        <Link to="/newplayer" className="button new-player">
          New Player? <br />
          Create a New Account
        </Link>
        {/* Link for Returning Player page */}
        <Link to="/returningplayer" className="button returning-player">
          Returning Player? <br />
          Sign into Existing Account
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
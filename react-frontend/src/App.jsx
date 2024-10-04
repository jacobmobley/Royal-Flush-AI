import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import NewPlayerPage from './NewPlayerPage';
import ReturningPlayerPage from './ReturningPlayerPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/newplayer" element={<NewPlayerPage/>} />
          <Route path="/returningplayer" element={<ReturningPlayerPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
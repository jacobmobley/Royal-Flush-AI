import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import NewPlayerPage from "./NewPlayerPage";
import ReturningPlayerPage from "./ReturningPlayerPage";
import TitleScreen from "./TitleScreen";
import PlinkoGame from "./plinko";
import Settings from "./Settings";

export const authData = {email: "", username: "", currency: 0};


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/newplayer" element={<NewPlayerPage />} />
          <Route path="/returningplayer" element={<ReturningPlayerPage />} />
          <Route path="/titlescreen" element={<TitleScreen />} />
          <Route path="/plinkogame" element={<PlinkoGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

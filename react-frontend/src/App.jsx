import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import NewPlayerPage from "./NewPlayerPage";
import ReturningPlayerPage from "./ReturningPlayerPage";
import TitleScreen from "./TitleScreen";
import PlinkoGame from "./PlinkoGame";
import Blackjack from "./Blackjack";
import Roulette from "./Roulette";
import Settings from "./Settings";

export const authData = {email: "", username: "", currency: 0};


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TitleScreen />} />
          <Route path="/newplayer" element={<NewPlayerPage />} />
          <Route path="/returningplayer" element={<ReturningPlayerPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/plinkogame" element={<PlinkoGame />} />
          <Route path="/blackjack" element={<Blackjack />} />
          <Route path="/roulette" element={<Roulette />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

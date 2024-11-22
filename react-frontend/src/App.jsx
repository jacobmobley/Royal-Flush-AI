import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import NewPlayerPage from "./NewPlayerPage";
import ReturningPlayerPage from "./ReturningPlayerPage";
import TitleScreen from "./TitleScreen";
import PlinkoGame from "./PlinkoGame";
import Blackjack from "./Blackjack";
import PokerInit from "./PokerInit";
import Poker from "./Poker";
import RouletteE from "./RouletteE";
import RouletteA from "./RouletteA";
import Multipoker from "./Multi-poker/Multipoker.jsx";
import LobbyManager from "./LobbyManager.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import Settings from "./Settings";

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
          {/* <Route path="/roulette" element={<Roulette />} /> */}
          <Route path="/poker" element={<Poker />} />

          <Route path="/blackjack/:deckCount" element={<Blackjack />} />
          <Route path="/roulettee" element={<RouletteE />} />
          <Route path="/roulettea" element={<RouletteA />} />
          <Route path="/forgotpass" element={<ForgotPassword />} />
          <Route path="/pokerinit" element={<PokerInit />} />
          <Route path="/Multipoker" element={<Multipoker />} />

          <Route path="/lobby" element={<LobbyManager />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;

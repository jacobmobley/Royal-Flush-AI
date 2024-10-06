import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import NewPlayerPage from "./NewPlayerPage";
import ReturningPlayerPage from "./ReturningPlayerPage";
import TitleScreen from "./TitleScreen";
// import Settings from "./Settings";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/frontpage" element={<HomePage />} />
          <Route path="/newplayer" element={<NewPlayerPage />} />
          <Route path="/returningplayer" element={<ReturningPlayerPage />} />
          <Route path="/titlescreen" element={<TitleScreen />} />

          {/* <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

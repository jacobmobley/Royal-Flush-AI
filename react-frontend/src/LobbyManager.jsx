import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LobbyManager = () => {
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch available lobbies from the server
  const fetchLobbies = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/list-lobbies");
      setLobbies(response.data);
    } catch (err) {
      setError("Failed to load lobbies.");
    } finally {
      setLoading(false);
    }
  };

  // Join a lobby
  const handleJoinLobby = (lobbyUrl) => {
    navigate(`/multipoker?url=${encodeURIComponent(lobbyUrl)}`);
  };

  // Fetch lobbies on component mount
  useEffect(() => {
    fetchLobbies();
  }, []);

  return (
    <div>
      <h1>Lobby Manager</h1>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* List Lobbies Section */}
      <h2>Available Lobbies</h2>
      {loading ? (
        <p>Loading lobbies...</p>
      ) : (
        <ul>
          {lobbies.map((lobby, index) => (
            <li key={index}>
              <p>Lobby at {lobby.url} (Port: {lobby.port})</p>
              <button onClick={() => handleJoinLobby(lobby.url)}>Join</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LobbyManager;

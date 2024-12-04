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
      const response = await axios.get(
        "http://10.186.123.80:5000/list-lobbies"
      );
      setLobbies(response.data); // Response includes port, buyIn, difficulty, and URL
    } catch (err) {
      setError("Failed to load lobbies.");
    } finally {
      setLoading(false);
    }
  };

  // Join a lobby
  const handleJoinLobby = (lobbyUrl, buyIn) => {
    navigate(`/multipoker?url=${encodeURIComponent(lobbyUrl)}&buyIn=${buyIn}`);
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
            <li key={index} style={{ marginBottom: "1em" }}>
              <p>
                <strong>Port:</strong> {lobby.port} <br />
                <strong>Buy-In:</strong> ${lobby.buyIn} <br />
                <strong>Difficulty:</strong>{" "}
                <span
                  style={{
                    color:
                      lobby.difficulty === "Easy"
                        ? "green"
                        : lobby.difficulty === "Medium"
                        ? "orange"
                        : "red",
                  }}
                >
                  {lobby.difficulty}
                </span>
              </p>
              <button onClick={() => handleJoinLobby(lobby.url, lobby.buyIn)}>
                Join
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LobbyManager;

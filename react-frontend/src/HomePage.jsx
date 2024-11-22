import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore_db } from "./firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

import styles from "./frontpage-styles.module.css";
import gear from "./assets/Settings.png";
import { Link } from "react-router-dom";
import Settings from "./Settings";
import logo from "./assets/RoyalFlushAILogo.png";
import funky from "./assets/funky.mp3";
import chill from "./assets/chill.mp3";
import relaxing from "./assets/relaxing.mp3";
import click from "./assets/click2.mp3";
import FriendsPopup from "./popups/FriendsPopup";
import FriendRequestPopup from "./popups/FriendRequestPopup";
import FireBaseAuth from "./FireBaseAuth";

const HomePage = () => {
  const images = [
    "./src/assets/avatars/bear.png",
    "./src/assets/avatars/cat.png",
    "./src/assets/avatars/chicken.png",
    "./src/assets/avatars/dog.png",
    "./src/assets/avatars/fox.png",
    "./src/assets/avatars/koala.png",
    "./src/assets/avatars/meerkat.png",
    "./src/assets/avatars/panda.png",
    "./src/assets/avatars/rabbit.png",
    "./src/assets/avatars/sea-lion.png",
  ];

  const [userData, setUserData] = useState({
    username: "",
    currency: 0,
    avatar: 0,
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [deckCount, setDeckCount] = useState(3);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const [showFriendsPopup, setShowFriendsPopup] = useState(false);
  const [showFriendRequestPopup, setShowFriendRequestPopup] = useState(false);
  const [friendRequestEmail, setFriendRequestEmail] = useState(null);

  const playlist = [funky, chill, relaxing];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(
    Math.floor(Math.random() * playlist.length)
  ); // Start from random track

  const audioRef = useRef(new Audio(playlist[currentTrackIndex])); // Initialize with a random track
  const effectsRef = useRef(new Audio(click));

  const toggleSettings = () => {
    effectsRef.current.play().catch((error) => {
      console.error("Click sound play error:", error);
    });
    setShowSettings(!showSettings);
  };

  const toggleFriendsPopup = () => {
    setShowFriendsPopup(!showFriendsPopup);
  }

  const toggleFriendRequest = () => {
    setShowFriendRequestPopup(!showFriendRequestPopup);
  }

  const fbauth = new FireBaseAuth();

  const playNextTrack = () => {
    if (!audioRef.current.paused) {
      audioRef.current.pause();
    }
    const nextTrackIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextTrackIndex);
    audioRef.current.src = playlist[nextTrackIndex];
    audioRef.current
      .play()
      .catch((error) => console.error("Audio play error:", error));
  };

  const fetchLeaderboard = async () => {
    const leaderboardQuery = query(
      collection(firestore_db, "users"),
      orderBy("currency", "desc"),
      limit(10)
    );

    try {
      const querySnapshot = await getDocs(leaderboardQuery);
      const topUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeaderboard(topUsers);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user) {
        try {
          const userDocRef = doc(firestore_db, "users", user.email);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
            setImage(images[docSnap.data().avatar]);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    const fetchAchievements = async (user) => {
      try {
        const achievementsRef = doc(firestore_db, 'users', user.email);
        const docSnap = await getDoc(achievementsRef);
        const data = docSnap.data();
        const achievements = data.achievements;
        console.log(achievements);
        setAchievements(achievements);
      } catch (error) {
        console.error("Error fetching achievemtns:", error);
      }
    };

    const getFriendRequestEmail = async () => {
      const user = auth.currentUser;

      if (!user) {
          console.log("No user authenticated");
          return;
      }
      await fbauth.fetchUserData(user);
      if (!fbauth.userData['requests'] || fbauth.userData['requests'].length === 0) return null;

      setFriendRequestEmail(fbauth.userData["requests"][0]);
      toggleFriendRequest();
  }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getFriendRequestEmail();
        fetchUserData(user);
        fetchLeaderboard(); // Fetch the leaderboard when the user is authenticated
        fetchAchievements(user);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    // Event listener to play the next track when the current track ends
    audioRef.current.addEventListener("ended", playNextTrack);

    return () => {
      unsubscribe();
      audioRef.current.pause();
      audioRef.current.removeEventListener("ended", playNextTrack); // Clean up event listener
    };
  }, []); // Only run on mount/unmount

  useEffect(() => {
    // Ensure the audio source updates without autoplaying unexpectedly
    if (audioRef.current.src !== playlist[currentTrackIndex]) {
      audioRef.current.src = playlist[currentTrackIndex];
    }
  }, [currentTrackIndex]);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  const play = () => {
    // Play only if the audio is paused, to prevent overlapping sounds
    if (audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.error("Audio play blocked by the browser:", error);
      });
    }
  };

  return (
    <div className="container">
      {showFriendRequestPopup && (
        <div className={`${styles.modalOverlay}`}>
          <FriendRequestPopup
            toggleFriendRequest={toggleFriendRequest}
            requestEmail={friendRequestEmail}
          />
        </div>
      )}
      <div className={styles.userInfo}>
        <span>
          <img
            src={image}
            className={styles.profileImgTitlePage}
            alt="Avatar"
          />
        </span>
        <span>{userData?.username}</span> <span>|</span>
        <span>Currency: {userData?.currency}</span>
      </div>

      <div className={styles.friendsPopupButton} onClick={toggleFriendsPopup}>
        Friends Menu
      </div>

      {showFriendsPopup && (
      <div className={`${styles.modalOverlay}`}>
      <FriendsPopup
        toggleFriendsPopup={toggleFriendsPopup}
      />
      </div>
      )}

      <div className={styles.leaderboard}>
        <h2>Leaderboard</h2>
        <ul>
          {leaderboard.map((user, index) => (
            <div
              key={user.id}
              className={`${styles.leaderboardRow} ${
                user.username === userData.username ? styles.highlight : ""
              }`}
            >
              <p className={styles.rankingUser}>
                #{index + 1} {user.username}
              </p>
              <p className={styles.theirCurrency}>{user.currency}</p>
            </div>
          ))}
        </ul>
      </div>
      <div className={styles.achievements}>
        <h2>Achievements</h2>
        <ul>
          {Object.keys(achievements).length > 0 ? (
            Object.entries(achievements).map(([key, value]) => (
              <div key={key} className={styles.achievementsRow}>
                <p className={styles.rankingUser}>{key}</p>
                <p className={styles.theirCurrency}>
                  {value ? 'Completed' : 'Incomplete'}
                </p>
              </div>
            ))
          ) : (
            <p>No achievements available.</p>
          )}
        </ul>
      </div>
      <div className={styles.menu}>
        <img src={logo} alt="Royal Flush AI Logo" className={styles.homeLogo} />
        <div className={styles.pokerButtons}>
          <Link to="/pokerinit" className={`${styles.button} ${styles.poker}`}>
            Poker Singleplayer
          </Link>
          <Link to="/lobby" className={`${styles.button} ${styles.poker}`}>
            Poker Multiplayer
          </Link>
        </div>
        <div className={styles.gameButtons}>
          <Link
            to={`/blackjack/${deckCount}`}
            className={`${styles.button} ${styles.blackjack}`}
          >
            Blackjack
          </Link>
          <Link
            to="/RouletteE"
            className={`${styles.button} ${styles.roulette}`}
          >
            European Roulette
          </Link>
          <Link
            to="/RouletteA"
            className={`${styles.button} ${styles.roulette}`}
          >
            American Roulette
          </Link>
        </div>
        <div className={styles.deckCount}>
          <label className={styles.deckNumLabel} htmlFor="deck-count">
            Number of Decks:{" "}
          </label>
          <input
            type="number"
            id="deck-count"
            value={deckCount}
            min="1"
            onChange={(e) => setDeckCount(e.target.value)}
            className={styles.deckInput}
          />
        </div>
      </div>
      <img
        src={gear}
        alt="Settings Icon"
        className={`${styles.settings}`}
        onClick={toggleSettings}
      />
      {showSettings && (
        <div className={`${styles.modalOverlay}`}>
          <Settings
            toggleSettings={toggleSettings}
            audioRef={audioRef}
            effectsRef={effectsRef}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;

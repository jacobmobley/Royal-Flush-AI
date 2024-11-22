import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, firestore_db } from "../firebase";
import styles from "../frontpage-styles.module.css";
import FireBaseAuth from "../FireBaseAuth";

function FriendsPopup({ toggleFriendsPopup }) {
  const [formData, setFormData] = useState({ requestUsername: "" });
  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({});
  const [friends, setFriends] = useState([]); // State to store friend data
  const fbauth = new FireBaseAuth();

  const hideMessageAfterDelay = () => {
    setTimeout(() => {
        setMessage("");
    }, 1500)
}

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user authenticated");
        return;
      }
      await fbauth.fetchUserData(user);

      // Fetch friends and their usernames
      const userFriends = fbauth.userData.friends || [];
      const friendsData = [];
      for (const email of userFriends) {
        const friendDocRef = doc(firestore_db, "users", email);
        const friendDocSnap = await getDoc(friendDocRef);
        if (friendDocSnap.exists()) {
          const friendData = friendDocSnap.data();
          friendsData.push({ email, username: friendData.username });
        }
      }
      setFriends(friendsData); // Set friend data
    };

    fetchData();
  }, []);

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function getCurrUsername() {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user authenticated");
      return;
    }
    return fbauth.userData["username"];
  }

  const getUserByUsername = async (username) => {
    const userDocRef = collection(firestore_db, "users");
    const q = query(userDocRef, where("username", "==", username));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        if (querySnapshot.docs[0].data().username === (await getCurrUsername())) {
          return -2; // Self username query
        }
        return querySnapshot.docs[0];
      } else {
        return -1; // Username not found
      }
    } catch (error) {
      console.error("Error querying user by username:", error);
    }
  };

  const submitFriendRequest = async (e) => {
    e.preventDefault();
    const userDoc = await getUserByUsername(formData.requestUsername);
    if (userDoc === -1) {
      setMessage("There is no user with that username.");
      setMessageStyle({ color: "red" });
      hideMessageAfterDelay();
      return;
    }
    if (userDoc === -2) {
      setMessage("You cannot be your own friend!");
      setMessageStyle({ color: "red" });
      hideMessageAfterDelay();
      return;
    }

    try {
      const userDocData = userDoc.data();
      if (
        userDocData.requests &&
        userDocData.requests.some((el) => el === auth.currentUser.email)
      ) {
        setMessage("You have already sent a request to that user.");
        setMessageStyle({ color: "red" });
        hideMessageAfterDelay();
        return;
      }
      if (
        userDocData.friends &&
        userDocData.friends.some((el) => el === auth.currentUser.email)
      ) {
        setMessage("That user is already your friend.");
        setMessageStyle({ color: "red" });
        hideMessageAfterDelay();
        return;
      }
      const userDocRef = userDoc.ref;

      await updateDoc(userDocRef, {
        requests: arrayUnion(auth.currentUser.email),
      });

      setMessage("Friend request successfully sent!");
      setMessageStyle({ color: "green" });
      hideMessageAfterDelay();
    } catch (error) {
      console.error("Error updating friend requests:", error);
      setMessage("An error occurred while sending the friend request.");
      setMessageStyle({ color: "red" });
      hideMessageAfterDelay();
    }
  };

  return (
    <div className={styles.modal}>
      <button className={styles.closeButton} onClick={toggleFriendsPopup}>
        X
      </button>
      <br></br>
      <h2 style={{ color: "black" }}>Friends Menu</h2>
      <form id="friend-form" onSubmit={submitFriendRequest}>
        <input
          type="text"
          name="requestUsername"
          placeholder="Enter username:"
          value={formData.requestUsername}
          required
          onChange={handleRequestChange}
        />
        <button type="submit">Submit Friend Request</button>
      </form>
      <div id="message" style={{ display: "block", ...messageStyle }}>
        {message}
      </div>
      <div>
      <h3 style={{ color: "black" }}>Friends</h3>
      <ul>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend.email} className={styles.leaderboardRow}>
              <p className={styles.rankingUser}>{friend.username}</p>
            </div>
            
          ))
        ) : (
          <p style={{ color: "black" }}>No friends found.</p>
        )}
        </ul>
      </div>
    </div>
  );
}

export default FriendsPopup;

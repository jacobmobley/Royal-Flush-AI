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
  arrayRemove
} from "firebase/firestore";
import { auth, firestore_db } from "../firebase";
import styles from "../frontpage-styles.module.css";
import FireBaseAuth from "../FireBaseAuth";

function FriendsPopup({ toggleFriendsPopup }) {
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
    const [formData, setFormData] = useState({ requestUsername: "" });
    const [message, setMessage] = useState("");
    const [messageStyle, setMessageStyle] = useState({});
    const [friends, setFriends] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
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
        console.log("Authenticated user:", user.email);
    
        await fbauth.fetchUserData(user);
        console.log("Fetched user data:", fbauth.userData);
    
        const userFriends = fbauth.userData.friends || [];
        if (!Array.isArray(userFriends)) {
            console.error("Friends field is not an array or undefined");
            return;
        }
    
        const friendsData = [];
        for (const email of userFriends) {
            const friendDocRef = doc(firestore_db, "users", email);
            const friendDocSnap = await getDoc(friendDocRef);
            if (friendDocSnap.exists()) {
            const friendData = friendDocSnap.data();
            friendsData.push({ email, username: friendData.username });
            } else {
            console.error(`Friend document for ${email} does not exist`);
            }
        }
        setFriends(friendsData);
        console.log("Friends data updated:", friendsData);
        };
    
        fetchData().catch((err) => console.error("Error in fetchData:", err));
    }, []); // Dependency array ensures this runs only once
    

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
        await fbauth.fetchUserData(user);
        return fbauth.userData["username"];
    };

    const getUserByUsername = async (username) => {
        const userDocRef = collection(firestore_db, "users");
        const q = query(userDocRef, where("username", "==", username));
        try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            console.log(querySnapshot.docs[0].data().username, await getCurrUsername())
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

    async function removeFriend(email) {
        const user = auth.currentUser;

        if (!user) {
        console.error("No user authenticated");
        return;
        }

        // Remove the friend's email from the user's friends array in Firestore
        let userDocRef = doc(firestore_db, "users", user.email);
        await updateDoc(userDocRef, {
        friends: arrayRemove(email),
        });
        userDocRef = doc(firestore_db, "users", email);
        await updateDoc(userDocRef, {
        friends: arrayRemove(user.email),
        });


        // Update the local state to remove the friend from the displayed list
        setFriends((prevFriends) => prevFriends.filter((friend) => friend.email !== email));
    }

        const viewProfile = async (email) => {
        try {
        const friendDocRef = doc(firestore_db, "users", email);
        const friendDocSnap = await getDoc(friendDocRef);

        if (friendDocSnap.exists()) {
            const friendData = friendDocSnap.data();
            setSelectedProfile({
            username: friendData.username,
            currency: friendData.currency,
            bio: friendData.bio,
            avatar: friendData.avatar,
            });
        } else {
            console.error(`Friend document for ${email} does not exist`);
        }
        } catch (error) {
        console.error("Error fetching friend's profile:", error);
        }
    };

    const closeProfile = () => {
        setSelectedProfile(null);
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
                    <div key={friend.email} className={styles.friendsRow}>
                    <p className={styles.rankingUser}>{friend.username}</p>
                    <button onClick={() => viewProfile(friend.email)}>View</button>
                    <button className={styles.redButton} onClick={() => removeFriend(friend.email)}>Remove</button>
                    </div>
                    
                ))
                ) : (
                <p style={{ color: "black" }}>No friends found.</p>
                )}
                </ul>
            </div>
            {selectedProfile && (
        <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
            <img
                src={images[selectedProfile.avatar]} // Use a default avatar if none exists
                alt={`${selectedProfile.username}'s Avatar`}
                className={styles.profileAvatar}
            />
            <h3 className={styles.profileUsername}>{selectedProfile.username}</h3>
            </div>
            <div className={styles.profileDetails}>
            <p>
                <strong>Currency:</strong> {selectedProfile.currency || 0}
            </p>
            <p>
                <strong>Bio:</strong> {selectedProfile.bio || "No bio available."}
            </p>
            </div>
            <button className={styles.closeProfileButton} onClick={closeProfile}>
            Close Profile
            </button>
        </div>
        )}
    </div>
    );
}

export default FriendsPopup;

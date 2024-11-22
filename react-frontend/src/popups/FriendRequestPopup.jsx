import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import styles from "../frontpage-styles.module.css";
import React, { useEffect, useState } from "react";
import FireBaseAuth from "../FireBaseAuth";
import { auth, firestore_db } from "../firebase";

function FriendRequestPopup({ toggleFriendRequest, requestEmail }) {

    const [requestUsername, setRequestUsername] = useState("");
    const fbauth = new FireBaseAuth();

    useEffect(() => {
        const getRequestUsername = async () => {
            const user = auth.currentUser;
    
            if (!user) {
                console.log("No user authenticated");
                return;
            }
            await fbauth.fetchUserData(user);
            const docRef = doc(firestore_db, 'users', requestEmail);
            const docSnap = await getDoc(docRef);
            console.log(docSnap);
            setRequestUsername(docSnap.data().username);
        }
        getRequestUsername();
    }, []);

    const removeRequestFromList = async () => {
        const user = auth.currentUser;

        if (!user) {
            console.log("No user authenticated");
            return;
        }
        try {
            await fbauth.fetchUserData(user);
            if (!fbauth.userData['requests']) return;

            const docRef = doc(firestore_db, 'users', user.email);
            await updateDoc(docRef, {
            requests: arrayRemove(requestEmail),
            });
        } catch (err) {
            console.error("Error removing friend request from list:", err);
        }
    }

    const addToFriendsList = async () => {
        const user = auth.currentUser;

        if (!user) {
            console.log("No user authenticated");
            return;
        }
        try {
            let docRef = doc(firestore_db, 'users', user.email);
            await updateDoc(docRef, {
                friends: arrayUnion(requestEmail),
            });
            docRef = doc(firestore_db, 'users', requestEmail);
            await updateDoc(docRef, {
                friends: arrayUnion(user.email),
            });            
        } catch (err) {
            console.error("Error adding friend to list:", err);
        }

    }

    const acceptRequest = async () => {
        const user = auth.currentUser;

        if (!user) {
            console.log("No user authenticated");
            return;
        }
        addToFriendsList();
        removeRequestFromList();

        toggleFriendRequest();
        console.log("accepted");
    }

    const rejectRequest = async () => {
        const user = auth.currentUser;

        if (!user) {
            console.log("No user authenticated");
            return;
        }

        removeRequestFromList();

        toggleFriendRequest();
    }

    return (
        <div className={styles.modalReqPopup}>
            <p style={{ color: "black" }}>You have a new friend request from {requestUsername}!</p>
            <button className={styles.greenButton} onClick={acceptRequest}>Accept</button>
            <button className={styles.redButton} onClick={rejectRequest}>Reject</button>
        </div>
    );
}

export default FriendRequestPopup;
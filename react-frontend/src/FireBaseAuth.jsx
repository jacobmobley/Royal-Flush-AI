import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore_db } from "./firebase";
import { doc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";

class FireBaseAuth {
  constructor() {
    this.loading = true;
    this.userData = useState({ username: "", currency: 0, friends: [], requests: [] });
  }

  getUnsubscribe() {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch the user data once the user is authenticated
        this.fetchUserData(user);
      } else {
        console.log("No user is signed in.");
        // Handle the case where there is no user logged in
        this.userData = null;
        this.loading = false; // No user, set loading to false
      }
    });
    
    return () => unsubscribe();
  }


  async fetchUserData(user) {
    if (user) {
      try {
        // Reference to the user's document in Firestore
        const userDocRef = doc(firestore_db, "users", user.email);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          // Update user data state
          this.userData = docSnap.data();
          console.log(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        this.loading = false; // Set loading to false after data is fetched
      }
    } else {
      this.loading = false; // No user, set loading to false
    }
  }

  async updateCurrency(newCurrency) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const userDocRef = doc(firestore_db, 'users', user.email);

      console.log(newCurrency);

      // Update the currency field in Firestore
      await updateDoc(userDocRef, {
        currency: newCurrency,
      });

      console.log("Currency successfully updated to:", newCurrency);

      // Optionally update local userData after successful update
      this.userData.currency = newCurrency;

    } catch (error) {
      console.error("Error updating currency:", error);
    }
  }



  async updateFriends(newFriend) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const userDocRef = doc(firestore_db, 'users', user.email);
      console.log(newCurrency);

      // Update the currency field in Firestore
      await updateDoc(userDocRef, {
        friends: arrayUnion(newFriend),
      });

      console.log("Currency successfully updated to:", newCurrency);

      // Optionally update local userData after successful update
      this.userData.currency = newCurrency;

    } catch (error) {
      console.error("Error updating currency:", error);
    }
  }
  
  async completeAchievement(achievement) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const userDocRef = doc(firestore_db, 'users', user.email);

      function sanitizeFieldName(name) {
        return name.replace(/[.#$/\[\]]/g, '_'); 
      }

      const sanitizedAchievementName = sanitizeFieldName(achievement);

      await updateDoc(userDocRef, {
        [`achievements.${sanitizedAchievementName}`]: true,
      });

      console.log(`Achievement "${achievement}" marked as completed.`);

      if (this.userData && this.userData.achievements) {
        this.userData.achievements[sanitizedAchievementName] = true;
      }

    } catch (error) {
      console.error("Error updating achievement:", error);
    }
  }

  async updateGameCounter() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const userDocRef = doc(firestore_db, 'users', user.email);

      await updateDoc(userDocRef, {
        pokerGameCounter: increment(1),
      });

      console.log("Counter successfully incremented.");

    } catch (error) {
      console.error("Error incrementing counter:", error);
    }
  }
};

export default FireBaseAuth;
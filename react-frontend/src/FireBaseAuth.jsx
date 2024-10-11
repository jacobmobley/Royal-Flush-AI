import { useState} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore_db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

class FireBaseAuth {
  constructor() {
    this.userData = useState({ username: "", currency: 0 });
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch the user data once the user is authenticated
        fetchUserData(user);
      } else {
        console.log("No user is signed in.");
        // Handle the case where there is no user logged in
        setUserData(null);
        setLoading(false); // No user, set loading to false
      }
    });
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
        setLoading(false); // Set loading to false after data is fetched
      }
    } else {
      setLoading(false); // No user, set loading to false
    }
  }
};

export default HomePage;
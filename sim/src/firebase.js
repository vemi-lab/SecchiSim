import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, collection } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAz7_L3oaiLF52rPkhfMqJTEAa3fhn5bUM",
  authDomain: "secchisim-vemi-4f776.firebaseapp.com",
  projectId: "secchisim-vemi-4f776",
  storageBucket: "secchisim-vemi-4f776.appspot.com",
  messagingSenderId: "894048278189",
  appId: "1:894048278189:web:5c7f52afbbecb854369824",
  measurementId: "G-6NSPKVGKQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Function to get user data using email as the identifier
export async function getUserData(userEmail) {
  try {
    const userDocRef = doc(collection(db, "users"), userEmail);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      console.log("No such user found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Function to update user data (email, password, and volunteer roles)
export async function updateUserData(userEmail, newData) {
  try {
    const userDocRef = doc(collection(db, "users"), userEmail);
    await updateDoc(userDocRef, newData);
    console.log("User data updated successfully!");
  } catch (error) {
    console.error("Error updating user data:", error);
  }
}

export default app;
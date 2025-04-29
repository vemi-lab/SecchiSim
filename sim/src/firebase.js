import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, getDocs } from "firebase/firestore";

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

// Ensure Firebase authentication session persists
setPersistence(auth, browserLocalPersistence)
    .then(() => console.log("Auth persistence enabled"))
    .catch((error) => console.error("Error setting persistence:", error));

// Function to get user data using email as the identifier
export async function getUserData(userEmail) {
  try {
    const userDocRef = doc(db, "users", userEmail);
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

// Function to update user data (email, password, and access roles)
export async function updateUserData(userEmail, newData) {
  try {
    const userDocRef = doc(db, "users", userEmail);
    await updateDoc(userDocRef, newData);
    console.log("User data updated successfully!");
  } catch (error) {
    console.error("Error updating user data:", error);
  }
}

// Function to get data from a subcollection
export async function getSubcollectionData(userEmail, year, subcollectionName) {
  try {
    const subcollectionRef = doc(db, `users/${userEmail}/${year}/${subcollectionName}`);
    const subcollectionSnap = await getDoc(subcollectionRef);
    if (subcollectionSnap.exists()) {
      return subcollectionSnap.data();
    } else {
      console.log(`No data found in subcollection: ${subcollectionName}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching subcollection data (${subcollectionName}):`, error);
  }
}

// Function to update data in a subcollection
export async function updateSubcollectionData(userEmail, year, subcollectionName, newData) {
  try {
    const subcollectionRef = doc(db, `users/${userEmail}/${year}/${subcollectionName}`);
    await updateDoc(subcollectionRef, newData);
    console.log(`Subcollection (${subcollectionName}) data updated successfully!`);
  } catch (error) {
    console.error(`Error updating subcollection data (${subcollectionName}):`, error);
  }
}

// Function to add a new document to a subcollection
export async function addDocumentToSubcollection(userEmail, year, subcollectionName, docName, docData) {
  try {
    const docRef = doc(db, `users/${userEmail}/${year}/${subcollectionName}/${docName}`);
    await setDoc(docRef, docData);
    console.log(`Document (${docName}) added to subcollection (${subcollectionName}) successfully!`);
  } catch (error) {
    console.error(`Error adding document to subcollection (${subcollectionName}):`, error);
  }
}

// Example: Function to fetch quiz data from the "Quizzes" subcollection
export async function getQuizData(userEmail, year) {
  return await getSubcollectionData(userEmail, year, "Quizzes");
}

// Example: Function to update quiz data in the "Quizzes" subcollection
export async function updateQuizData(userEmail, year, quizData) {
  await updateSubcollectionData(userEmail, year, "Quizzes", quizData);
}

// Function to fetch all user emails
export async function getAllUserEmails() {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    return usersSnapshot.docs.map((doc) => doc.data().personal?.email);
  } catch (error) {
    console.error("Error fetching user emails:", error);
    return [];
  }
}

export default app;
import React, {useContext, useState, useEffect} from 'react'
import {auth, db} from '../firebase'
import {
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail, 
    sendEmailVerification,
    updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from "firebase/firestore"

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    async function signup(email, password, fullName, phoneNumber) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await sendEmailVerification(user);
        await updateProfile(user, { displayName: fullName });

        const currentYear = new Date().getFullYear().toString(); // e.g., "2026"

        // Default access roles
        const defaultAccessSecchiRoles = {
            "Secchi Role": true
        };

        const defaultAccessDoRoles = {
            "Dissolved Oxygen Role": false
        };

        // Initial quiz progress
        const initialQuizProgress = {
            "Secchi_1_RetryCount": 3,
            "Secchi_1_Disabled": false,
            "Secchi_2_RetryCount": 3,
            "Secchi_2_Disabled": false,
            "Secchi_3_RetryCount": 3,
            "Secchi_3_Disabled": false,
            "DO_1_RetryCount": 3,
            "DO_1_Disabled": true,
            "DO_2_RetryCount": 3,
            "DO_2_Disabled": true,
            "DO_3_RetryCount": 3,
            "DO_3_Disabled": true
        };

        // Initial quiz scores
        const initialQuizScores = {
            "Secchi_1_Score": null,
            "Secchi_2_Score": null,
            "Secchi_3_Score": null,
            "DO_1_Score": null,
            "DO_2_Score": null,
            "DO_3_Score": null
        };

        try {
            // Create user document
            const userDocRef = doc(db, "users", email);
            await setDoc(userDocRef, {
                personal: {
                    fullName: fullName,
                    phoneNumber: phoneNumber,
                    email: email
                },
                isAdmin: false,
                isActive: true
            });

            // Create yearly subcollection and its documents
            const yearCollectionPath = `users/${email}/${currentYear}`;
            const rolesDocRef = doc(db, `${yearCollectionPath}/Roles`);
            const quizzesDocRef = doc(db, `${yearCollectionPath}/Quizzes`);
            const scoresDocRef = doc(db, `${yearCollectionPath}/Scores`);

            await Promise.all([
                setDoc(rolesDocRef, { ...defaultAccessSecchiRoles, ...defaultAccessDoRoles }),
                setDoc(quizzesDocRef, initialQuizProgress),
                setDoc(scoresDocRef, initialQuizScores)
            ]);
        } catch (error) {
            console.error("Error creating user data in Firestore:", error);
            throw error; // Re-throw the error to handle it in the UI if needed
        }

        return userCredential;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout(){
        return signOut(auth)
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    // Function to check role access
    async function hasAccessToRole(role) {
        if (!currentUser) return false;

        try {
            const currentYear = new Date().getFullYear().toString(); // e.g., "2026"
            const rolesDocRef = doc(db, `users/${currentUser.email}/${currentYear}/Roles`);
            const rolesDoc = await getDoc(rolesDocRef);

            if (rolesDoc.exists()) {
                const roles = rolesDoc.data();
                return roles[role] === true; // Return true if the role is enabled
            } else {
                console.warn("Roles document does not exist for the user.");
                return false;
            }
        } catch (error) {
            console.error("Error checking role access:", error);
            return false;
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await user.reload(); // force refresh state
                if (!user.emailVerified){
                    alert("Account created!");
                    setCurrentUser(null);
                } else {
                setCurrentUser(user); //set the authentificated user properly
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        hasAccessToRole // Ensure this is included in the context value
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
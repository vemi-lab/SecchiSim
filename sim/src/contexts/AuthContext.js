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
            "Dissolved Oxygen Role": false // Default to no access
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
        const initialQuizScores = { };

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

        return userCredential; // Remove hasAccess from return
    }

    async function fetchUserRoles(email) {
        const currentYear = new Date().getFullYear().toString();
        const rolesDocRef = doc(db, `users/${email}/${currentYear}/Roles`);
        const rolesSnapshot = await getDoc(rolesDocRef);
        return rolesSnapshot.exists() ? rolesSnapshot.data() : {};
    }

    async function ensureYearlyCollection(email) {
        const currentYear = new Date().getFullYear().toString();
        const yearCollectionPath = `users/${email}/${currentYear}`;

        const rolesDocRef = doc(db, `${yearCollectionPath}/Roles`);
        const quizzesDocRef = doc(db, `${yearCollectionPath}/Quizzes`);
        const scoresDocRef = doc(db, `${yearCollectionPath}/Scores`);

        const rolesSnapshot = await getDoc(rolesDocRef);

        if (!rolesSnapshot.exists()) {
            // Default access roles
            const defaultAccessSecchiRoles = {
                "Secchi Role": true
            };

            const defaultAccessDoRoles = {
                "Dissolved Oxygen Role": false // Default to no access
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
            const initialQuizScores = {};

            try {
                await Promise.all([
                    setDoc(rolesDocRef, { ...defaultAccessSecchiRoles, ...defaultAccessDoRoles }),
                    setDoc(quizzesDocRef, initialQuizProgress),
                    setDoc(scoresDocRef, initialQuizScores)
                ]);
            } catch (error) {
                console.error("Error creating yearly collection:", error);
                throw error;
            }
        }
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

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await user.reload(); // force refresh state
                if (!user.emailVerified){
                    alert("Account created!");
                    setCurrentUser(null);
                } else {
                    const email = user.email;
                    await ensureYearlyCollection(email); // Ensure the yearly collection exists
                    const roles = await fetchUserRoles(email);
                    setCurrentUser({ ...user, roles }); // Include roles in the user state
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
        fetchUserRoles // Expose fetchUserRoles for other components
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}